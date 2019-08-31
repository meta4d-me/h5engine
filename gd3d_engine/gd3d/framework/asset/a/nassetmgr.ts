namespace gd3d.framework
{
    type loadCallback = (state?: stateLoad) => void;
    type downloadBindType = (guid: number, url: string, type: AssetTypeEnum, finish: () => void) => void;

    export const assetParseMap: { [key: number]: IAssetFactory } = {};
    //资源处理装饰器
    export function assetF(type: AssetTypeEnum)
    {
        return function (ctor)
        {
            assetParseMap[type] = new ctor();
        }
    }

    //#region 资源类型
    export function calcType(url: string | any): AssetTypeEnum
    {
        var filei = url.lastIndexOf("/");
        var file = url.substr(filei + 1);
        var i = file.indexOf(".", 0);
        var extname = null;
        while (i >= 0)
        {
            extname = file.substr(i);

            switch (extname)
            {
                case ".vs.glsl":
                    return AssetTypeEnum.GLVertexShader;
                case ".fs.glsl":
                    return AssetTypeEnum.GLFragmentShader;
                case ".assetbundle.json":
                    return AssetTypeEnum.Bundle;
                case ".shader.json":
                    return AssetTypeEnum.Shader;
                case ".png":
                case ".jpg":
                    return AssetTypeEnum.Texture;
                case ".pvr.bin":
                case ".pvr":
                case ".pvr.bin.js":
                    return AssetTypeEnum.PVR;
                case ".imgdesc.json":
                    return AssetTypeEnum.TextureDesc;
                case ".mesh.bin":
                case ".mesh.bin.js":
                case ".cmesh.bin":
                    return AssetTypeEnum.Mesh;
                case ".aniclip.bin":
                case ".aniclip.bin.js":
                    return AssetTypeEnum.Aniclip;
                case ".prefab.json":
                    return AssetTypeEnum.Prefab;
                case ".cprefab.json":
                    return AssetTypeEnum.cPrefab;
                case ".scene.json":
                    return AssetTypeEnum.Scene;
                case ".atlas.json":
                    return AssetTypeEnum.Atlas;
                case ".font.json":
                    return AssetTypeEnum.Font;
                case ".json":
                case ".txt":
                case ".effect.json":
                    return AssetTypeEnum.TextAsset;
                case ".mat.json":
                    return AssetTypeEnum.Material;
                case ".bpkg.json":
                case ".packs.bin":
                case ".packs.bin.js":
                    return AssetTypeEnum.PackBin;
                case ".jpkg.json":
                case ".packs.txt":
                    return AssetTypeEnum.PackTxt;
                case ".path.json":
                    return AssetTypeEnum.PathAsset;
                case ".f14effect.json":
                    return AssetTypeEnum.F14Effect;
                case ".dds":
                case ".dds.bin":
                    return AssetTypeEnum.DDS;
                case ".keyframeAniclip.json":
                    return AssetTypeEnum.KeyFrameAniclip;
            }

            i = file.indexOf(".", i + 1);
        }
    }

    export function calcReqType(type: AssetTypeEnum): "text" | "arraybuffer"
    {
        var e = AssetTypeEnum;
        switch (type)
        {
            case e.PackTxt:
            case e.Bundle:
            case e.Atlas:
            case e.cPrefab:
            case e.F14Effect:
            case e.Font:
            case e.GLFragmentShader:
            case e.GLVertexShader:
            case e.KeyFrameAniclip:
            case e.Material:
            case e.PathAsset:
            case e.Scene:
            case e.Shader:
            case e.TextAsset:
            case e.TextureDesc:
            case e.PackTxt:
                return "text";
            case e.Aniclip:
            case e.DDS:
            case e.Mesh:
            case e.PVR:
            case e.PackBin:
                return "arraybuffer";
            default:
                throw Error(`无法识别类型 enum:${AssetTypeEnum[type]},type:${type}`);
        }
    }
    //#endregion


    //资源管理器
    export class assetMgr
    {
        static urlmapGuid: { [key: string]: number } = {};//全局资源记录
        static cdnRoot: string;//资源根目录
        static guidlistURL: string;//资源根目录
        static onGuidInit: () => void;
        public static Instance: assetMgr;

        static mapLoading: { [key: number]: { url?: string, readyok: boolean, data?: any, cbQueue?: loadCallback[], subRes?: number[] } } = {};//下载好的,未下载好的,资源
        static mapGuid: { [key: number]: assetRef } = {};//解析好的资源        
        static mapImage: { [key: number]: HTMLImageElement } = {};//图片缓存
        static mapNamed: { [key: string]: IAsset } = {};//资源名是 ,系统资源类型的名字 或自己定义的名字
        static noparseBundle: Array<assetBundle> = [];//未解析的资源包

        static atonceParse: boolean = true;//是否立即解析        
        concurrent: number;//最大并发 不填不控制并发
        execCount: number = 0;//当前并发数
        watingQueue: Array<downloadBindType> = [];//等待队列

        name_bundles: { [key: string]: assetBundle } = {};
        guid_bundles: { [key: string]: assetBundle } = {};

        mapShader: { [id: string]: shader } = {};



        //外部才能确定在哪用,初始化全局资源记录
        static initGuidList()
        {
            io.loadJSON(assetMgr.guidlistURL, (json) =>
            {
                assetMgr.urlmapGuid = json.res;
                // console.log(`initGuidList  资源GUID从[${json.__useid}]开始计数`);
                resID.idAll = json.__useid;
                if (assetMgr.onGuidInit)
                    assetMgr.onGuidInit();
            });
        }


        //加载资源
        load(url: string, type: AssetTypeEnum = AssetTypeEnum.Auto,
            /** 这是解析完成的回调 */
            onstate: loadCallback = null)
        {
            let keyUrl = url.replace(assetMgr.cdnRoot, "");
            let guid = assetMgr.urlmapGuid[keyUrl];
            if (!guid)
            {
                if (url.endsWith(".assetbundle.json"))
                    guid = assetBundle.buildGuid();
                else
                    guid = resID.next();//生成一个guid
            }
            type = type == AssetTypeEnum.Auto ? calcType(url) : type;
            if (assetMgr.mapGuid[guid])//已下载的资源
            {
                let state = new stateLoad();
                state.isfinish = true;
                onstate(state);
                return;
            }

            //只下载一次 其他入队
            this.download(guid, url, type, () =>
            {//下载完毕
                let loading = assetMgr.mapLoading[guid];
                if (type == AssetTypeEnum.Bundle)
                {
                    let bundle = new assetBundle(url, this, guid);
                    bundle.onReady = () =>
                    {
                        if (this.name_bundles[bundle.name])
                            console.warn(`assetbundle命名冲突:${bundle.name},${bundle.url}`);
                        this.name_bundles[bundle.name] = bundle;
                        let state = new stateLoad();
                        state.isfinish = true;
                        onstate(state);
                    };
                    bundle.parseBundle(loading.data);
                } else
                {
                    let filename = getFileName(url);
                    const next = function (name, guid, type, dwguid?: number)
                    {
                        this.parseRes({ name, guid, type, dwguid }).then(() =>
                        {
                            //解析完毕
                            let state = new stateLoad();
                            state.isfinish = true;
                            onstate(state);
                        });
                    }

                    let factory = assetParseMap[type];
                    if (factory.needDownload)
                    {
                        let nname = factory.needDownload(assetMgr.mapLoading[guid].data);
                        let nurl = url.replace(filename, nname);
                        let nguid = resID.next();
                        let ntype = calcType(nname);
                        if (ntype == AssetTypeEnum.Texture)
                            this.loadImg(nguid, nurl, next.bind(this, filename, guid, type, nguid));//不一样的是这里带了一个需要下载的GUID
                        else
                            this.download(nguid, nurl, ntype, next.bind(this, filename, guid, type, nguid));//不一样的是这里带了一个需要下载的GUID
                    } else
                        next(filename, guid, type);

                }
            });
        }

        download(guid: number, url: string, type: AssetTypeEnum, finish: () => void)
        {
            let loading = assetMgr.mapLoading[guid];
            //下载完成的不再下载
            if (loading && loading.readyok && finish)
                return finish();
            else if (!loading)
                assetMgr.mapLoading[guid] = loading = { readyok: false, url: url };
            //并发上限放入等待队列
            if (this.checkConcurrent())
            {
                this.watingQueue.push(this.download.bind(this, guid, url, type));
                return;
            }
            let repType: "text" | "arraybuffer" = calcReqType(type);
            ++this.execCount;
            io.xhrLoad(url, (data, err) =>
            {
                console.error(err.stack);
                --this.execCount;
                if (!this.checkConcurrent() && this.watingQueue.length > 0)
                    this.watingQueue.shift().apply(null);
            }, () => { }, repType, (xhr) =>
                {
                    --this.execCount;
                    let loading = assetMgr.mapLoading[guid];
                    loading.readyok = true;
                    loading.data = xhr.response;
                    finish();
                    if (!this.checkConcurrent() && this.watingQueue.length > 0)
                        this.watingQueue.shift().apply(null);
                });
        }

        //加载图片
        loadImg(guid: number, url: string, cb: (img) => void)
        {
            if (assetMgr.mapImage[guid])
                return cb(assetMgr.mapImage[guid]);
            let loading = assetMgr.mapLoading[guid];
            if (!loading)
                loading = assetMgr.mapLoading[guid] = { readyok: false, cbQueue: [] }
            loading.cbQueue.push(cb);
            this._loadImg(url, (img) =>
            {
                assetMgr.mapImage[guid] = img;
                loading.readyok = true;
                loading.data = img;
                while (loading.cbQueue.length > 0)
                    loading.cbQueue.shift()(img);
            });
        }

        //微信可复写
        protected _loadImg(url: string, cb: (img) => void)
        {
            let img = new Image();
            //webgl跨域渲染要这样玩 [crossOrigin = ""]否则服务器允许跨域也没用
            img.crossOrigin = "";
            img.src = url;
            img.onload = cb.bind(this, img);
        }

        //检查并发
        private checkConcurrent(): boolean
        {
            return this.concurrent && this.execCount >= this.concurrent;
        }


        use(asset: IAsset)
        {
            let guid = asset.getGUID();
            let ref = assetMgr.mapGuid[guid];
            if (!ref)
            {
                ref = new assetRef();
                ref.asset = asset;
                ref.refcount = 1;
                assetMgr.mapGuid[guid] = ref;
                if (assetMgr.mapNamed[asset.getName()])
                    console.warn(`资源命名冲突:${asset.getName()}`);
                assetMgr.mapNamed[asset.getName()] = asset;
                // delete assetMgr.mapLoading[guid];
            } else
                ++ref.refcount;
        }

        unuse(asset: IAsset, disposeNow: boolean = false)
        {
            let guid = asset.getGUID();
            let assetref = assetMgr.mapGuid[guid];
            if (disposeNow && assetref && assetref.refcount < 1)
            {
                delete assetMgr.mapGuid[guid];
                // delete assetMgr.mapLoading[asset.getGUID()];
                delete assetMgr.mapNamed[assetref.asset.getName()];
            }
        }

        async parseRes(asset: { guid: number, type: number, name: string, dwguid?: number }, bundle?: assetBundle)
        {
            // let ctime = Date.now();
            let data = assetMgr.mapLoading[asset.guid].data;
            let factory = assetParseMap[asset.type];
            if (!factory)
            {
                console.warn(`无法找到[${AssetTypeEnum[asset.type]}]的解析器`);
                return;
            }
            if (!factory.parse)
            {
                console.warn(`解析器 ${factory.constructor.name} 没有实现parse方法`);
                return;
            }

            let __asset = factory.parse(this, bundle, asset.name, data, asset.dwguid);
            if (__asset instanceof gd3d.threading.gdPromise)
                __asset = (await __asset);
            if (__asset)
            {
                if (bundle)
                    __asset["id"].id = asset.guid;
                this.use(__asset);
            }
            // console.log(`解析完成[${AssetTypeEnum[asset.type]}]${Date.now() - ctime}ms,解析器:${factory.constructor.name},guid:${asset.guid},name:${asset.name}`);
        }

        getAssetByName<T extends IAsset>(name: string, bundlename?: string): T
        {
            if (bundlename)
            {
                let bundle = this.name_bundles[bundlename];
                if (bundle)
                {
                    let guid = bundle.files[name];
                    if (guid && assetMgr.mapGuid[guid])
                        return assetMgr.mapGuid[guid].asset as T;
                }
            }
            return assetMgr.mapNamed[name] as T;
        }

        //#region api保留
        mapDefaultMesh: { [id: string]: mesh } = {};
        mapDefaultTexture: { [id: string]: texture } = {};
        mapDefaultCubeTexture: { [id: string]: texture } = {};
        mapDefaultSprite: { [id: string]: sprite } = {};
        mapMaterial: { [id: string]: material } = {};
        getDefaultMesh(name: string): mesh { return this.mapDefaultMesh[name]; }
        getDefaultTexture(name: string): texture { return this.mapDefaultTexture[name]; }
        getDefaultCubeTexture(name: string): texture { return this.mapDefaultCubeTexture[name]; }
        getDefaultSprite(name: string): sprite { return this.mapDefaultSprite[name]; }
        getMaterial(name: string): material { return this.mapMaterial[name]; }

        static useBinJs: boolean = false;
        static txt = ".txt";
        private static bin = ".bin";
        app: gd3d.framework.application;
        shaderPool: gd3d.render.shaderPool;
        webgl: WebGLRenderingContext;
        mapRes: { [id: number]: any } = {};
        constructor(app: application)
        {
            this.app = app;
            this.webgl = app.webgl;
            this.shaderPool = new gd3d.render.shaderPool();
            // this.initAssetFactorys();
        }
        static correctFileName(name: string): string
        {
            if (name.indexOf(this.bin) < 0)
            {
                return name;
            }
            let binlen = this.bin.length;
            let substr = name.substring(name.length - binlen);
            if (substr == this.bin)
            {
                return name + ".js";
            }
            return name;
        }
        static correctTxtFileName(name: string): string
        {
            if (name.indexOf(this.txt) < 0)
            {
                return name;
            }
            let len = this.txt.length;
            let substr = name.substring(name.length - len);
            if (substr == this.txt)
            {
                return name + ".js";
            }
            return name;
        }
        getShader(name: string): gd3d.framework.shader
        {
            return this.mapShader[name];
        }
        private particlemat: material;
        getDefParticleMat(): material
        {
            if (this.particlemat == null)
            {
                var mat = new material("defparticle");
                var shader = this.getShader("particles_additive.shader.json");
                if (shader == null)
                {
                    shader = this.getShader("shader/def");
                }
                mat.setShader(shader);
                var tex = this.getDefaultTexture("grid");
                mat.setTexture("_MainTex", tex);
                this.particlemat = mat;
            }
            return this.particlemat;
        }
        private assetUrlDic: { [id: number]: string };// = {};
        setAssetUrl(asset: IAsset, url: string)
        {
            // this.assetUrlDic[asset.getGUID()] = url;
        }
        getAssetUrl(asset: IAsset): string
        {
            return this.assetUrlDic[asset.getGUID()];
        }
        maploaded: { [url: string]: IAsset };// = {};

        savePrefab(trans: transform, prefabName: string, fun: (data: SaveInfo, resourses?: string[], contents?: any[]) => void)
        {
        }
        loadCompressBundle(url: string, a?)
        {
        }
        loadImmediate(url: string)
        {
            return null;
        }
        getAssetBundle(url: string)
        {
            return null;
        }
        releaseUnuseAsset()
        {
        }
        initDefAsset()
        {
            defMesh.initDefaultMesh(this);
            defTexture.initDefaultTexture(this);
            defsprite.initDefaultSprite(this);
            defShader.initDefaultShader(this);
            defmaterial.initDefaultMaterial(this);
        }
        loadScene(sceneName: string, onComplete: (firstChilds: Array<transform>) => void)
        {
            let firstChilds = new Array<transform>();
            let scene = this.app.getScene();
            if (sceneName.length > 0)
            {
                var _rawscene: rawscene = this.getAssetByName(sceneName) as rawscene;
                let willLoadRoot = _rawscene.getSceneRoot();
                while (willLoadRoot.children.length > 0)
                {
                    let trans = willLoadRoot.children.shift();
                    firstChilds.push(trans);
                    scene.addChild(trans);
                }
                //清空原场景UI
                scene["_overlay2d"] = new Array<overlay2D>();
                //lightmap
                _rawscene.useLightMap(scene);
                //fog
                _rawscene.useFog(scene);
                //nav
                _rawscene.useNavMesh(scene);
            }
            else
            {
                var _camera: transform = new transform();
                _camera.gameObject.addComponent("camera");
                _camera.name = "camera";
                firstChilds.push(_camera);
                scene.addChild(_camera);
            }
            scene.name = sceneName;
            scene.getRoot().markDirty();
            onComplete(firstChilds);
        }
        //#endregion
    }
    //#region api保留
    export class SaveInfo
    {
        files: { [key: string]: string } = {};
    }
    //#endregion api保留

    //--------------api保留----------------end     
}