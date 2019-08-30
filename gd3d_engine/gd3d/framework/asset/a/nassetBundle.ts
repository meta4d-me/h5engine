namespace gd3d.framework
{

    export class assetBundle
    {
        static idNext = -1;//id起始位置               

        files: { [key: string]: number }; //Array<{ name: string, guid: number }>;

        texs: { [name: string]: number };

        pkgs: string[];

        pkgsGuid: number[];

        url: string;

        baseUrl: string;

        guid: number; //bundle 的guid和普通资源的guid 是靠起始位置区分的        

        name: string;

        dw_imgCount: number;

        dw_fileCount: number;

        onReady: () => void;

        ready: boolean;

        subpkg;

        constructor(url: string, private assetmgr: assetMgr, guid?: number)
        {
            this.guid = guid || assetBundle.buildGuid();
            this.url = url;
            this.baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
            this.name = url.substring(url.lastIndexOf("/") + 1);
        }
        public static buildGuid()
        {
            //资源包自己的使用的GUID
            return --assetBundle.idNext;
        }


        //解析资源包描述文件 和下载
        parseBundle(data: string)
        {
            let json = JSON.parse(data);
            this.files = json.files;
            this.texs = json.texs;
            this.pkgs = json.pkg;
            // console.log(`${this.name}正在解析描述文件...`);
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
                    var extName = this.pkgs[i].substring(this.pkgs[i].indexOf("."));
                    var url = nameURL + extName;
                    var kurl = url.replace(assetMgr.cdnRoot, "");
                    var guid = assetMgr.urlmapGuid[kurl];
                    this.pkgsGuid.push(guid);
                    // console.log(`${this.name} 开始下载分包 ,guid:${guid},${url}`);
                    this.assetmgr.download(guid, url, calcType(url), () =>
                    {
                        ++dwpkgCount;
                        // console.log(`${this.name} 下载分包 ${dwpkgCount}/${this.dw_fileCount} ,guid:${guid},${url}`);
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
                    this.assetmgr.download(guid, `${this.baseUrl}Resources/${k}`, calcType(k), () =>
                    {
                        ++dwpkgCount;
                        // console.log(`${this.name} 下载分包 ${dwpkgCount}/${this.dw_fileCount} ,guid:${guid},${url}`);
                        if (dwpkgCount >= this.dw_fileCount)
                            this.parseFile();
                    });
                }
            }


            //下载图片
            const imageNext = function ()
            {
                ++dwpkgCount;
                // console.log(`${this.name} 下载分包 ${dwpkgCount}/${this.dw_fileCount} ,guid:${guid},${url}`);
                if (dwpkgCount >= this.dw_fileCount)
                    this.parseFile();
            }
            for (let k in this.texs)
            {
                var guid = this.texs[k];
                this.files[k] = guid;//先下载 然后给解析器补充一个key
                if (k.endsWith(".png") || k.endsWith(".jpg"))
                    this.assetmgr.loadImg(guid, `${this.baseUrl}resources/${k}`, imageNext.bind(this));
                else
                    this.assetmgr.download(guid, `${this.baseUrl}resources/${k}`, AssetTypeEnum.PVR, imageNext.bind(this));
            }

        }

        //解包
        private unpkg()
        {
            // console.log(`${this.name}开始解包 0/${this.pkgsGuid.length}`)
            for (let i = this.pkgsGuid.length - 1; i >= 0; --i)
            {

                var pkgGuid = this.pkgsGuid[i];
                var pkgld = assetMgr.mapLoading[pkgGuid];
                if (pkgld.data == 0)//被解析过了不再解析 项目中标记的 
                    continue;
                var isbin = this.pkgs[i].endsWith(".bpkg.json");
                pkgld.subRes = [];
                if (isbin)
                {   //二进制压缩 带图片
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
                } else
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
            if (!this.ready)
            {
                if (!assetMgr.atonceParse)
                {
                    assetMgr.noparseBundle.push(this);
                    return;
                }

                // let time = Date.now();
                if (this.pkgs)//如果需要解包就解
                    this.unpkg();

                let assets: Array<any> = [];
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
                //解析顺序按枚举从小到大来排序
                assets.sort((a, b) => { return a.type - b.type; });

                for (let asset of assets)
                {
                    if (assetMgr.mapGuid[asset.guid])
                        continue;//已经解析好的资源不需要再解析
                    await this.assetmgr.parseRes(asset, this);
                }

                this.ready = true;
                // console.log(`资源包:${this.name} 准备完毕. 解析耗时${Date.now() - time}/ms`);
            }

            if (this.onReady)
            {
                this.onReady();
                this.onReady = null;
            }
        }
    }
}