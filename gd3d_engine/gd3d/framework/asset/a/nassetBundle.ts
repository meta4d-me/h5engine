namespace gd3d.framework
{

    export class assetBundle
    {
        static idNext = -1;//id起始位置               

        files: { [key: string]: number } = {}; //Array<{ name: string, guid: number }>;

        texs: { [name: string]: number } = {};

        pkgs: string[] = [];

        pkgsGuid: number[] = [];

        url: string;

        baseUrl: string;

        keyUrl: string;

        guid: number; //bundle 的guid和普通资源的guid 是靠起始位置区分的        

        name: string;

        dw_imgCount: number;

        dw_fileCount: number;

        onReady: () => void;
        onDownloadFinish: () => void;
        ready: boolean;
        parseOutTime: number = 1000 * 30;
        dwOutTime: number = 1000 * 30;
        stateQueue = [];
        stateParse: any = {};
        stateText: string;
        thd: number;
        dhd: number;
        parseResolve: (o?) => void;
        parseReject: (o: Error) => void;

        static reTryTest = {};
        constructor(url: string, private assetmgr: assetMgr, guid?: number)
        {
            this.guid = guid || assetBundle.buildGuid();
            this.url = url;
            this.baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
            this.name = url.substring(url.lastIndexOf("/") + 1);
            this.keyUrl = url.replace(assetMgr.cdnRoot, "");
        }
        public static buildGuid()
        {
            //资源包自己的使用的GUID
            return --assetBundle.idNext;
        }

        getParseInfo()
        {
            let fcount = 0;
            let text = "\nparse:\n";
            let temp = []
            for (let k in this.stateParse)
                if (k != "count")
                    temp.push(this.stateParse[k]);
            temp.sort((a, b) => { return a.i - b.i });
            fcount = 0;
            for (let item of temp)
            {
                text += `name:${item.name},i:${item.i},type:${item.type} ,st:${item.st}\n`;
                if (item.wd)
                    ++fcount;
            }
            text += `${fcount}/${this.stateParse.count}`;

            return text;
            // this.fail(new Error(`[资源]解析超时 ${this.url} , state:${this.stateText},${text}`));
        }
        getDownloadInfo()
        {
            let text = "\ndownload :\n";
            let fcount = 0;
            for (let item of this.stateQueue)
            {
                text += `${item.url} ,guid:${item.guid} ,wd:${item.wd}\n`;
                if (item.wd)
                    ++fcount;
            }
            text += `${fcount}/${this.stateQueue.length}`;
            // this.fail(new Error(`[资源]下载超时 ${this.url} , state:${this.stateText},${text}`));
            return text;
        }
        //解析资源包描述文件 和下载
        parseBundle(data: string)
        {
            return new Promise((resolve, reject) =>
            {
                this.parseResolve = resolve;
                this.parseReject = reject;

                if (assetBundle.reTryTest[this.name])
                {
                    console.error(`资源 ${this.name} 正在重试 , ${this.url}`);
                    delete assetBundle.reTryTest[this.name];
                    this.ready = false;
                }
                this.dhd = setTimeout(() =>
                {

                    this.fail(new Error(`[资源]下载超时 ${this.url} , state:${this.stateText}`));
                }, this.dwOutTime);

                let json;
                try
                {
                    json = JSON.parse(data);
                } catch (error)
                {
                    this.fail(new Error(`[资源]描述文件错误 ${this.url} ,${error.message}`));
                    return;
                }
                this.files = json.files;
                this.texs = json.texs;
                this.pkgs = json.pkg;
                this.stateText = "下载资源";
                if (!assetMgr.openGuid)
                {
                    for (let k in this.files)
                        this.files[k] = assetBundle.buildGuid();
                    for (let k in this.texs)
                        this.texs[k] = assetBundle.buildGuid();
                }

                this.dw_imgCount = this.dw_fileCount = Object.keys(this.texs || {}).length;
                let dwpkgCount = 0;
                if (this.pkgs)
                {
                    this.dw_fileCount += Object.keys(this.pkgs).length;
                    // console.log(`当前资源是压缩状态.`);

                    this.pkgsGuid = this.pkgsGuid || [];

                    var nameURL = this.url.substring(0, this.url.lastIndexOf(".assetbundle"));

                    for (let i = 0, len = this.pkgs.length; i < len; ++i)
                    {
                        let extName = this.pkgs[i].substring(this.pkgs[i].indexOf("."));
                        let url = nameURL + extName;
                        let kurl = url.replace(assetMgr.cdnRoot, "");
                        let guid = assetMgr.urlmapGuid[kurl];
                        if (!guid)
                            guid = assetBundle.buildGuid();
                        this.pkgsGuid.push(guid);

                        let state = { guid, url, wd: false };
                        this.stateQueue.push(state);
                        this.assetmgr.download(guid, url, calcType(url), () =>
                        {
                            state.wd = true;
                            ++dwpkgCount;
                            if (dwpkgCount >= this.dw_fileCount)
                                this.parseFile();
                        });
                    }
                } else
                {
                    this.dw_fileCount += Object.keys(this.files).length;
                    // console.log(`当前资源是分包状态.`);
                    for (let k in this.files)
                    {
                        let guid = this.files[k];
                        let url = `${this.baseUrl}Resources/${k}`;
                        let state = { guid, url, wd: false };
                        this.stateQueue.push(state);
                        this.assetmgr.download(guid, url, calcType(k), () =>
                        {
                            state.wd = true;
                            ++dwpkgCount;
                            // console.log(`${this.name} 下载分包 ${dwpkgCount}/${this.dw_fileCount} ,guid:${guid},${url}`);
                            if (dwpkgCount >= this.dw_fileCount)
                                this.parseFile();
                        });
                    }
                }


                //下载图片
                const imageNext = function (state)
                {
                    state.wd = true;
                    ++dwpkgCount;
                    // console.log(`${this.name} 下载分包 ${dwpkgCount}/${this.dw_fileCount} ,guid:${guid},${url}`);
                    if (dwpkgCount >= this.dw_fileCount)
                        this.parseFile();
                }
                for (let k in this.texs)
                {
                    let guid = this.texs[k];
                    this.files[k] = guid;//先下载 然后给解析器补充一个key
                    let url = `${this.baseUrl}resources/${k}`;
                    let state = { guid, url, wd: false };
                    this.stateQueue.push(state);
                    if (k.endsWith(".png") || k.endsWith(".jpg"))
                        this.assetmgr.loadImg(guid, url, imageNext.bind(this, state));
                    else
                        this.assetmgr.download(guid, url, AssetTypeEnum.PVR, imageNext.bind(this, state));
                }
            });
        }

        //解包
        private unpkg()
        {
            // console.log(`${this.name}开始解包 0/${this.pkgsGuid.length}`)
            this.stateText = "解包";
            for (let i = this.pkgsGuid.length - 1; i >= 0; --i)
            {
                var pkgGuid = this.pkgsGuid[i];
                var pkgld = assetMgr.mapLoading[pkgGuid];
                if (!pkgld || !pkgld.data || pkgld.data == 0)//被解析过了不再解析 项目中标记的 
                    continue;
                var isbin = this.pkgs[i].endsWith(".bpkg.json");
                pkgld.subRes = [];
                if (isbin)
                {   //二进制压缩 带图片
                    try
                    {
                        var buffer: ArrayBuffer = pkgld.data;
                        var reader = new io.binReader(buffer);
                        var count = reader.readByte();
                        // console.log(`解压二进制包,文件数:${count}`);
                        while (count-- > 0)
                        {
                            var nl = reader.readByte();
                            var namebytes = reader.readBytesRef(nl);
                            var name = String.fromCharCode.apply(null, namebytes);
                            var fsize = reader.readUInt32();
                            var bin = reader.readBytesRef(fsize);
                            var guid = this.files[name] || this.texs[name];//如果文件找不到,就去找图片
                            assetMgr.mapLoading[guid] = {
                                readyok: true,
                                data: bin.buffer
                            };
                            pkgld.subRes.push(guid);
                            // console.log(`解压 bin文件${name},size:${fsize},guid:${guid}`);
                        }
                    } catch (error)
                    {
                        throw new Error(`[资源]unpkg bpkg失败:${this.url},${this.pkgs[i]}\n${error.message}`);
                    }
                } else
                {
                    try
                    {
                        let json = JSON.parse(pkgld.data);
                        // console.log(`解压文本包,文件数:${Object.keys(json).length}`);
                        for (let k in json)
                        {
                            var guid = this.files[k];
                            assetMgr.mapLoading[guid] = {
                                readyok: true,
                                data: json[k]
                            };
                            pkgld.subRes.push(guid);
                            // console.log(`解压 text文件${k},size:${json[k].length},${guid}`);
                        }
                    } catch (error)
                    {
                        throw new Error(`[资源]unpkg jpkg失败:${this.url},${this.pkgs[i]}\n${error.message}`);
                    }

                }
                //释放原数据
                delete pkgld.data;
                // console.log(`${this.name}:解包完成.`);
            }
            // this.parseFile();
        }

        //解析
        async parseFile()
        {
            clearTimeout(this.dhd);
            this.thd = setTimeout(() =>
            {
                this.fail(new Error(`[资源]解析超时 ${this.url} , state:${this.stateText}`));
            }, this.parseOutTime);
            if (this.onDownloadFinish)
                this.onDownloadFinish();
            if (!this.ready)
            {
                // if (!assetMgr.atonceParse)
                // {
                //     assetMgr.noparseBundle.push(this);
                //     return;
                // }

                // let time = Date.now();
                if (this.pkgs)//如果需要解包就解
                {
                    try
                    {
                        this.unpkg();
                    } catch (error)
                    {
                        this.fail(error);
                        return;
                    }
                }
                this.stateText = "资源解析";
                let assets: Array<any> = [];
                let idx = 0;
                for (let k in this.files)
                {
                    //已经解析的资源不再做解析
                    if (assetMgr.mapGuid[this.files[k]])
                        continue;
                    let type = calcType(k);
                    assets.push({
                        type,
                        name: k,
                        guid: this.files[k]
                    });

                }
                this.stateParse.count = idx;
                //解析顺序按枚举从小到大来排序
                assets.sort((a, b) => { return a.type - b.type; });
                for (let asset of assets)
                    this.stateParse[asset.name] = { name: asset.name, i: idx++, type: AssetTypeEnum[asset.type], st: false, guid: asset.guid };

                for (let asset of assets)
                {
                    if (assetMgr.mapGuid[asset.guid])
                        continue;//已经解析好的资源不需要再解析
                    try
                    {
                        await this.assetmgr.parseRes(asset, this);
                    } catch (error)
                    {

                        this.fail(error);
                        return;
                    }
                    this.stateParse[asset.name].st = true;
                }
                this.ready = true;
                // console.log(`资源包:${this.name} 准备完毕. 解析耗时${Date.now() - time}/ms`);
            }
            this.stateQueue = null;
            this.stateParse = null;
            this.stateText = null;
            clearTimeout(this.thd);
            this.parseResolve();
        }

        unload(disposeNow: boolean = false)
        {
            for (let k in this.files)
            {
                var ref = assetMgr.mapGuid[this.files[k]];
                if (ref)
                    this.assetmgr.unuse(ref.asset, disposeNow);
            }
            for (let k in this.texs)
                delete assetMgr.mapImage[this.texs[k]];

            while (this.pkgsGuid.length > 0)
            {
                let guid = this.pkgsGuid.pop();
                let ref = assetMgr.mapGuid[guid];
                if (ref)
                    this.assetmgr.unuse(ref.asset, disposeNow);
                else
                    delete assetMgr.mapLoading[guid];
            }
            delete this.assetmgr.guid_bundles[this.guid];
            delete this.assetmgr.name_bundles[this.name];
            delete this.assetmgr.kurl_bundles[this.keyUrl];
            delete assetMgr.mapBundleNamed[this.guid];
            delete assetMgr.mapGuid[this.guid];
        }
        fail(error: Error)
        {
            assetBundle.reTryTest[this.name] = 1;

            let dwinfo = this.getDownloadInfo();
            let pinfo = this.getParseInfo();
            this.unload(true);
            console.error(dwinfo);
            console.error(pinfo);
            console.error(`${error.message}\n${error.stack}\n`);
            this.parseReject(new Error(`#########${error.message}\n${error.stack}\n${dwinfo}\n${pinfo}`));
        }
    }
}