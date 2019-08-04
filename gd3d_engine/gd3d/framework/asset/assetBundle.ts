namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源包
     * @version gd3d 1.0
     */
    export class assetBundle {

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 包名
         * @version gd3d 1.0
         */
        public name: string;
        private id: number;
        /**
         * @public
         * @language zh_CN
         * 资源管理器实例
         * @version gd3d 1.0
         */
        assetmgr: assetMgr;
        private files: { name: string, length: number, packes: number, guid: string, zip_Length: number }[] = [];
        private packages: string[] = [];

        private bundlePackBin: { [name: string]: ArrayBuffer } = {};
        private bundlePackJson: JSON;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 包完整路径
         * @version gd3d 1.0
         */
        url: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 不带包名路径
         * @version gd3d 1.0
         */
        path: string;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 资源的总字节数
         * @version gd3d 1.0
         */
        totalLength: number = 0;

        loadLightMap: boolean = true;

        //guid等待加载完毕回调 资源计数
        private waitGuidCount = 0;

        constructor(url: string) {
            this.url = url;
            let i = url.lastIndexOf("/");
            this.path = url.substring(0, i);

            this.assetmgr = gd3d.framework.sceneMgr.app.getAssetMgr();
            if (this.assetmgr.waitlightmapScene[url]) {
                this.loadLightMap = false;
            }
        }
        loadCompressBundle(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetmgr: assetMgr) {
            state.totalByteLength = this.totalLength;
            // console.log(`ab loadCompressBundle ${url}`);
            gd3d.io.loadText(url, (txt, err, isloadFail) => {
                if (err != null) {
                    state.isloadFail = isloadFail ? true : false;
                    state.iserror = true;
                    state.errs.push(new Error(err.message));
                    onstate(state);
                    return;
                }
                // console.log(`ab loadCompressBundlew 下载完成 ${url}`);

                let json = JSON.parse(txt);
                this.bundlePackJson = json;
                this.parse(json["bundleinfo"], this.totalLength);
                this.load(assetmgr, onstate, state);

                assetmgr.mapBundle[this.name] = this;
            },
                (loadedLength, totalLength) => {
                    state.compressTextLoaded = loadedLength;
                    onstate(state);
                });
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析包
         * @param json 
         * @version gd3d 1.0
         */
        parse(json: any, totalLength: number = 0) {
            let files = json["files"];
            for (let i = 0; i < files.length; i++) {
                let item = files[i];
                let packes = -1;
                if (item.packes != undefined)
                    packes = item.packes;
                if (!this.loadLightMap && (item.name as string).indexOf("LightmapFar-") >= 0) {
                    this.assetmgr.waitlightmapScene[this.url].push(this.path + "/" + item.name);
                    continue;
                }
                this.files.push({ name: item.name, length: item.length, packes: packes, guid: item.guid, zip_Length: item.zip_Length });
                if (item.guid != undefined) {
                    this.mapNameGuid[item.name] = item.guid;
                }
            }
            if (json["packes"] != undefined) {
                let packes = json["packes"];
                for (let i = 0; i < packes.length; i++) {
                    this.packages.push(packes[i]);
                }
            } else {
                if (json["totalLength"] != undefined) {
                    if (totalLength == 0) {
                        this.totalLength = json["totalLength"];
                    }
                }
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 卸载包 包内对应的资源引用计数减一
         * @param disposeNow 如果引用计数归零则立即释放
         * @version gd3d 1.0
         */
        unload(disposeNow: boolean = false) {
            for (let key in this.mapNamed) {
                let asset = this.assetmgr.getAssetByName(key, this.name);
                if (asset) {
                    this.assetmgr.unuse(asset, disposeNow);
                }
            }
            this.assetmgr.removeAssetBundle(this.name);
        }

        private isTextureRepeat(_type : AssetTypeEnum , name : string , list : {[name:string] : boolean }):boolean{
            //是否是图片资源
            if(_type != AssetTypeEnum.Texture && _type != AssetTypeEnum.PVR && _type != AssetTypeEnum.DDS) return false;
            let idx = name.indexOf(".");
            let decName = name.substr(0,idx) + `.imgdesc.json`;
            return list[decName] == true;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 加载包
         * @param assetmgr 资源管理器实例
         * @param stateinfo 加载的状态信息实例
         * @version gd3d 1.0
         */
        load(assetmgr: assetMgr, onstate: (state: stateLoad) => void, state: stateLoad) {
            if (assetmgr && assetmgr != this.assetmgr) {
                this.assetmgr = assetmgr;
            }
            state.totalByteLength = this.totalLength;
            let filse = this.files;
            let fLen = filse.length;

            let glvshaders: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let glfshaders: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let shaders: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let meshs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let textures: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let texturedescs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let materials: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let anclips: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let prefabs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let scenes: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let textassets: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let pvrs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let packs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let f14effs: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let fonts: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let atlass: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let ddss: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];
            let kfaniclips: { url: string, type: AssetTypeEnum, asset: IAsset }[] = [];

            
            let asslist: any[] = [];

            //这里定义了加载顺序
            asslist.push(packs, glvshaders, glfshaders, shaders, textassets, meshs,
                textures, pvrs, ddss, texturedescs, fonts, atlass,
                materials, anclips, kfaniclips, f14effs, prefabs, scenes);

            let mapPackes: { [id: string]: number } = {};


            //合并的包要先加载
            for (let pack of this.packages) {
                let type: AssetTypeEnum = assetmgr.calcType(pack);
                let url = this.path + "/" + pack;
                packs.push({ url: url, type: type, asset: null });
            }

            //name map 重复贴图资源需要使用
            let nameMap = {};
            for(let i=0; i < fLen ;i++){
                let file = filse[i];
                nameMap[file.name] = true;
            }            
            
            let guidList : {[guid:string] : boolean} = {};
            let list: { url: string, type: AssetTypeEnum, guid : string , asset: IAsset, handle: () => any }[] = [];
            //遍历每项资源 整理到加载列表
            for(let i=0; i < fLen ;i++){
                let fitem = filse[i];
                let type: AssetTypeEnum = assetmgr.calcType(fitem.name);
                //检查重复贴图资源
                if(this.isTextureRepeat(type,fitem.name,nameMap)) continue;

                let url = this.path + "/" + fitem.name;
                let fileName = assetmgr.getFileName(url);
                let guid = fitem.guid;
                if (guid != undefined) {
                    let mapGuid = assetmgr.mapGuidId;
                    let mAssId = mapGuid[guid];
                    // guid重复性检查
                    //是否guid_map 中包含 (重复资源)
                    if (mAssId != undefined) {
                        //如果是来自同一个ab包的 guid重复资源 ，则不放入等待列表
                        if (guidList[guid]) {
                            continue;
                        }

                        let sRef = assetmgr.mapRes[mAssId];
                        //同guid 资源 是否 正在加载中 
                        if (sRef && assetmgr.assetIsLoing(sRef)) {
                            //是 加入 guid_waitLoad_map
                            //关联到 bundle 的 加载状态队列
                            state.resstate[fileName] = new ResourceState();
                            //考虑-- 失败 情况
                            //等待执行 前后时间
                            this.waitGuidCount++; //加入等待列表 ，计数增加

                            let waitLoaded = () => {
                                let old = this.waitGuidCount;
                                this.waitGuidCount--; //减少计数
                                //检查加载结束to解析资源
                                this.CkNextHandleOfGuid(list, state, onstate);
                            };

                            let waitList: any[];
                            if (!assetmgr.mapGuidWaitLoaded[guid]) {
                                assetmgr.mapGuidWaitLoaded[guid] = [];
                            }
                            waitList = assetmgr.mapGuidWaitLoaded[guid];
                            waitList.push(waitLoaded);//等待同guid资源加完 回调处理

                        }
                        continue;  //跳过 不放入加载队列
                    }
                }

                guidList[guid] = true; //

                // let url = this.path + "/" + fitem.name;
                // let fileName = assetmgr.getFileName(url);
                if (fitem.packes != -1) {
                    //压缩在包里的
                    mapPackes[url] = fitem.packes;
                }

                {
                    let asset = null;
                    let _item = { url, type, guid, asset: null };
                    switch (type) {
                        case AssetTypeEnum.GLFragmentShader:
                            glfshaders.push(_item);
                            break;
                        case AssetTypeEnum.GLVertexShader:
                            glvshaders.push(_item);
                            break;
                        case AssetTypeEnum.Shader:
                            asset = new shader(fileName);
                            shaders.push(_item);
                            break;
                        case AssetTypeEnum.Texture:
                            asset = new texture(fileName);
                            textures.push(_item);
                            break;
                        case AssetTypeEnum.TextureDesc:
                            asset = new texture(fileName);
                            texturedescs.push(_item);
                            break;
                        case AssetTypeEnum.Mesh:
                            asset = new mesh(fileName);
                            meshs.push(_item);
                            break;
                        case AssetTypeEnum.Material:
                            asset = new material(fileName);
                            materials.push(_item);
                            break;
                        case AssetTypeEnum.Aniclip:
                            asset = new animationClip(fileName);
                            anclips.push(_item);
                            break;
                        case AssetTypeEnum.Prefab:
                            asset = new prefab(fileName);
                            prefabs.push(_item);
                            break;
                        case AssetTypeEnum.Scene:
                            asset = new rawscene(fileName);
                            scenes.push(_item);
                            break;
                        case AssetTypeEnum.TextAsset:
                            asset = new textasset(fileName);
                            textassets.push(_item);
                            break;
                        case AssetTypeEnum.PVR:
                            asset = new texture(fileName);
                            pvrs.push(_item);
                            break;
                        case AssetTypeEnum.F14Effect:
                            asset = new f14eff(fileName);
                            f14effs.push(_item);
                            break;
                        case AssetTypeEnum.DDS:
                            asset = new texture(fileName);
                            ddss.push(_item);
                            break;
                        case AssetTypeEnum.Font:
                            asset = new font(fileName);
                            fonts.push(_item);
                            break;
                        case AssetTypeEnum.Atlas:
                            asset = new atlas(fileName);
                            atlass.push(_item);
                            break;
                        case AssetTypeEnum.KeyFrameAniclip:
                            asset = new keyFrameAniClip(fileName);
                            kfaniclips.push(_item);
                            break;
                    }
                    _item.asset = asset;

                    if (type != AssetTypeEnum.GLVertexShader && type != AssetTypeEnum.GLFragmentShader && type != AssetTypeEnum.Shader
                        && type != AssetTypeEnum.PackBin && type != AssetTypeEnum.PackTxt && type != AssetTypeEnum.Prefab) {
                        if (!asset)
                            continue;
                        let assId = asset.getGUID();
                        this.mapNamed[fileName] = assId;
                        assetmgr.regRes(fileName, asset);
                        //注册 guid_map  {guid : AssetId}
                        if (guid && assetmgr.mapGuidId[guid] == undefined) {
                            assetmgr.mapGuidId[guid] = assId;
                        }
                    }
                }
            }

            let handles = {};
            //按类型整理顺序到list 
            for (let i = 0, len = asslist.length; i < len; ++i) {
                for (let j = 0, clen = asslist[i].length; j < clen; ++j) {
                    let item = asslist[i][j];
                    handles[item.url] = list.length;
                    list.push({ url: item.url, type: item.type, guid: item.guid, asset: item.asset, handle: undefined });
                }
            }


            let packlist = [];
            let haveBin = false;
            let tempMap = {};
            //按list 顺序加载
            for (let item of list) {
                let surl = item.url;
                let type = item.type;
                let asset = item.asset;
                tempMap[surl] = 1;
                if (mapPackes[surl] != undefined) {
                    packlist.push({ surl, type, asset });
                    delete tempMap[surl];
                    if (this.mapIsNull(tempMap))
                        this.downloadFinsih(state, list, haveBin, onstate, packlist, mapPackes, handles);
                }
                else {
                    if (type == AssetTypeEnum.PackBin) {
                        haveBin = true;
                        gd3d.io.loadArrayBuffer(surl, (_buffer, err, isloadFail) => {

                            if (err != null) {
                                state.isloadFail = isloadFail ? true : false;
                                state.iserror = true;
                                state.errs.push(new Error(err.message));
                                onstate(state);

                                return;
                            }
                            let read: gd3d.io.binReader = new gd3d.io.binReader(_buffer);
                            let index = read.readInt32();
                            read.position = index;
                            while (read.canread()) {
                                let indindex = read.readInt32();
                                if (index == 0) break;

                                let key = read.readStringUtf8FixLength(indindex);
                                let strs: string[] = key.split('|');

                                let start = parseInt(strs[1]);
                                let len = parseInt(strs[2]);

                                let bufs: ArrayBuffer = _buffer.slice(start, start + len);
                                this.bundlePackBin[strs[0]] = bufs;
                            }


                            delete tempMap[surl];
                            if (this.mapIsNull(tempMap))
                                this.downloadFinsih(state, list, haveBin, onstate, packlist, mapPackes, handles);

                        },
                            (loadedLength, totalLength) => {
                                state.compressBinLoaded = loadedLength;
                                onstate(state);
                            });
                    }
                    else {

                        assetmgr.loadSingleRes(surl, type, (s) => {
                            if (s.iserror) {
                                state.iserror = true;
                                onstate(state);
                                return;
                            }

                            if (s.progressCall) {
                                s.progressCall = false;
                                onstate(state);
                                return;
                            }



                        }, state, asset, (data) => {

                            list[handles[data.url]].handle = data.handle;
                            delete tempMap[data.url];
                            if (this.mapIsNull(tempMap))
                                this.downloadFinsih(state, list, haveBin, onstate, packlist, mapPackes, handles);
                        });
                    }

                }
            }

        }

        //加载完毕处理
        private downloadFinsih(state, list, haveBin: boolean, onstate, packlist, mapPackes, handles) {
            if (haveBin) {
                let respackCall = (fcall: () => void) => {
                    if (packlist.length < 1)
                        fcall();
                    let count = 0;
                    for (let uitem of packlist) {
                        //在pack里
                        let respack;
                        if (mapPackes[uitem.surl] == 0) respack = this.bundlePackJson;
                        else if (mapPackes[uitem.surl] == 1) respack = this.bundlePackBin;
                        else console.log("未识别的packnum: " + mapPackes[uitem.surl]);
                        this.assetmgr.loadResByPack(respack, uitem.surl, uitem.type, (s) => {
                            if (s.progressCall) {
                                s.progressCall = false;
                                onstate(state);
                                return;
                            }

                            if (state != undefined)
                                state.bundleLoadState |= uitem.loadstate;

                        }, state, uitem.asset, (data) => {
                            list[handles[data.url]].handle = data.handle;
                            if (++count >= packlist.length)
                                fcall();
                        });
                    }
                };
                respackCall(() => {
                    // this.NextHandle(list, state, onstate , assetmgr);
                    this.CkNextHandleOfGuid(list, state, onstate);
                });
            }
            else
                // this.NextHandle(list, state, onstate,assetmgr);
                this.CkNextHandleOfGuid(list, state, onstate);
        }

        private CkNextHandleOfGuid(list, state, onstate) {
            if (this.waitGuidCount > 0) return;
            this.NextHandle(list, state, onstate);
        }

        //是否需要解析
        static needParsing: boolean = true;
        private static needParsesArr: {
            [key: string]: {
                list: { url: string, type: AssetTypeEnum, guid: string, asset: IAsset, handle: () => any }[],
                state,
                onstate,
                call: (list: { url: string, type: AssetTypeEnum, guid: string, asset: IAsset, handle: () => any }[], state, onstate) => void
            }
        } = {};

        //解析  只预加载 未解析 的资源
        static startParseByUrl(url: string):boolean {
            let source = this.needParsesArr[url];
            if (source) {
                source.call(source.list, source.state, source.onstate);
                delete this.needParsesArr[url];
                return true;
            }
        }

        static preloadCompleteFun:Function;
        //文件加载完毕后统一解析处理 
        private NextHandle(list: { url: string, type: AssetTypeEnum, guid: string, asset: IAsset, handle: () => any }[], state, onstate) {
            if (assetBundle.needParsing) {
                this.NextHandleParsing(list, state, onstate);
            } else {
                // console.log("只预加载    " + this.url);
                assetBundle.needParsesArr[this.url] = {
                    list: list,
                    state: state,
                    onstate: onstate,
                    call: this.NextHandleParsing.bind(this)
                }
                if(assetBundle.preloadCompleteFun)
                {
                    assetBundle.preloadCompleteFun(this.url);
                }
            }
        }

        private NextHandleParsing(list: { url: string, type: AssetTypeEnum, guid: string, asset: IAsset, handle: () => any }[], state, onstate) {
            let waitArrs = [];
            let count = 0;
            let lastHandle = [];
            let finish = () => {
                // console.log(`资源包 :${this.url} 加载完成`);
                state.isfinish = true;
                onstate(state);
                //回调 guid列表
                this.endWaitList(list);
            };
            for (var i = 0, l = list.length; i < l; ++i) {
                var hitem = list[i];
                if (!hitem.handle)
                    continue;

                if (hitem.type == AssetTypeEnum.Scene || hitem.type == AssetTypeEnum.Prefab || hitem.type == AssetTypeEnum.F14Effect) {
                    lastHandle.push(hitem)
                    continue;
                }

                let waiting = hitem.handle();
                if (waiting instanceof threading.gdPromise) {
                    waitArrs.push(waiting);
                    waiting.then(() => {
                        if (++count >= waitArrs.length) {
                            lastHandle.sort((a, b) => {
                                return b.type - a.type;
                            })
                            while (lastHandle.length > 0)
                                lastHandle.shift().handle();
                            waitArrs = [];
                            finish();
                        }
                    });

                }
            }
            if (waitArrs.length < 1) {
                while (lastHandle.length > 0)
                    lastHandle.shift().handle();
                finish();
            }
        }

        private endWaitList(list: { url: string, type: AssetTypeEnum, guid: string, asset: IAsset, handle: () => any }[]) {
            //回调guid列表
            let len = list.length;
            for (let i = 0; i < len; i++) {
                let item = list[i];
                if (item.guid == undefined) continue;
                let guid = item.guid;
                let wlMap = this.assetmgr.mapGuidWaitLoaded;
                if (wlMap[guid] == undefined) continue;
                let waitList = wlMap[guid];
                if (waitList) {
                    waitList.forEach(element => {
                        element();
                    });
                    waitList.length = 0;
                    delete wlMap[guid];
                }
            }
        }

        private mapIsNull(map): boolean {
            if (!map)
                return true;
            for (let k in map)
                return false;
            return true;
        }
        /**
         * @public
         * @language zh_CN
         * 资源GUID的字典，key为资源的名称
         * @version gd3d 1.0
         */
        mapNamed: { [name: string]: number } = {};

        /**
         * 资源名- Guid 字典
         */
        mapNameGuid: { [name: string]: string } = {};
    }
}