namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * 资源类型
     * @version gd3d 1.0
     */
    export enum AssetTypeEnum
    {
        Unknown,
        Auto,
        Bundle,
        CompressBundle,
        GLVertexShader,
        GLFragmentShader,
        Shader,
        Texture,
        TextureDesc,
        Mesh,
        Prefab,
        Material,
        Aniclip,
        Scene,
        Atlas,
        Font,
        TextAsset,
        PackBin,
        PackTxt,
        pathAsset
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载状态
     * @version gd3d 1.0
     */
    export class stateLoad
    {
        /**
         * @public
         * @language zh_CN
         * 加载是否遇到错误
         * @version gd3d 1.0
         */
        iserror: boolean = false;
        /**
         * @public
         * @language zh_CN
         * 加载是否完成
         * @version gd3d 1.0
         */
        isfinish: boolean = false;

        /**
         * @public
         * @language zh_CN
         * 记录需要加载的每一个的状态和资源引用
         * @version gd3d 1.0
         */
        resstate: { [id: string]: { res: IAsset, state: number } } = {};

        /**
         * 当前的进度
         */
        curtask: number = 0;

        /**
         * 总进度
         */
        totaltask: number = 0;

        /**
         * 获取加载进度
         */
        get progress(): number
        {
            return this.curtask / this.totaltask;
        }

        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的log
         * @version gd3d 1.0
         */
        logs: string[] = [];
        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的错误信息
         * @version gd3d 1.0
         */
        errs: Error[] = [];
        /**
         * 源url地址
         */
        url: string;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源包
     * @version gd3d 1.0
     */
    export class assetBundle
    {
        public name: string;
        private id: number;
        assetmgr: assetMgr;
        files: { name: string, length: number, packes:number }[] = [];
        packages:string[] = [];
        url: string;
        path: string;
        constructor(url: string)
        {
            this.url = url;
            var i = url.lastIndexOf("/");
            this.path = url.substring(0, i);
        }
        parse(json: any)
        {
            var files = json["files"];
            for (var i = 0; i < files.length; i++)
            {
                var item = files[i];
                let packes = -1;
                if(item.packes != undefined)
                    packes = item.packes;
                this.files.push({ name: item.name, length: item.length, packes:packes });
            }
            if(json["packes"] != undefined)
            {
                let packes = json["packes"];
                for(var i = 0; i<packes.length; i++)
                {
                    this.packages.push(packes[i]);
                }
            }
        }
        unload()
        {
            for (let key in this.mapNamed)
            {
                let asset = this.assetmgr.getAssetByName(key, this.name);
                if (asset)
                {
                    this.assetmgr.unuse(asset);
                }
            }
            this.assetmgr.removeAssetBundle(this.name);
        }
        load(assetmgr: assetMgr, stateinfo:{state:stateLoad, type:AssetTypeEnum, onstate:(state:stateLoad) => void })
        {
            let state = stateinfo.state;
            let onstate = stateinfo.onstate;
            
            let totoal = this.files.length;
            this.assetmgr = assetmgr;
            //这里需要一个顺序，现在比较偷懒，比如shader 一定在 glshader 之后
            // material 一定在shader 和 texture 之后
            // prefab 一定在最后
            var glvshaders: string[] = [];
            var glfshaders: string[] = [];
            var shaders: string[] = [];
            var meshs: string[] = [];
            var textures: string[] = [];
            var texturedescs: string[] = [];
            var materials: string[] = [];
            var anclips: string[] = [];
            var prefabs: string[] = [];
            var scenes: string[] = [];
            var textassets: string[] = [];

            var mapPackes: { [id: string]: number } = {};
            for (var i = 0; i < this.files.length; i++)
            {
                var fitem = this.files[i];
                // console.log("fitem:" + fitem.name);
                var type: AssetTypeEnum = assetmgr.calcType(fitem.name);
                var url = this.path + "/" + fitem.name;
                if(fitem.packes != -1)
                {
                    //压缩在包里的
                    mapPackes[url] = fitem.packes;
                }
                
                {
                    if (type == AssetTypeEnum.GLFragmentShader)
                        glfshaders.push(url);
                    else if (type == AssetTypeEnum.GLVertexShader)
                        glvshaders.push(url);
                    else if (type == AssetTypeEnum.Shader)
                        shaders.push(url);
                    else if (type == AssetTypeEnum.Texture)
                        textures.push(url);
                    else if (type == AssetTypeEnum.TextureDesc)
                        texturedescs.push(url);
                    else if (type == AssetTypeEnum.Mesh)
                        meshs.push(url);
                    else if (type == AssetTypeEnum.Material)
                        materials.push(url);
                    else if (type == AssetTypeEnum.Aniclip)
                        anclips.push(url);
                    else if (type == AssetTypeEnum.Prefab)
                        prefabs.push(url);
                    else if (type == AssetTypeEnum.Scene)
                        scenes.push(url);
                    else if (type == AssetTypeEnum.TextAsset)
                        textassets.push(url);
                }
            }

            //排序
            var list: { url: string, type: AssetTypeEnum }[] = [];

            //合并的包要先加载
            for(var i=0; i<this.packages.length; i++)
            {
                let pack = this.packages[i];
                let type: AssetTypeEnum = assetmgr.calcType(pack);
                var url = this.path + "/" + pack;
                list.push({url:url, type: type});
            }

            for (var i = 0; i < glvshaders.length; i++)
            {
                list.push({ url: glvshaders[i], type: AssetTypeEnum.GLVertexShader });
            }
            for (var i = 0; i < glfshaders.length; i++)
            {
                list.push({ url: glfshaders[i], type: AssetTypeEnum.GLFragmentShader });
            }
            for (var i = 0; i < shaders.length; i++)
            {
                list.push({ url: shaders[i], type: AssetTypeEnum.Shader });
            }
            for (var i = 0; i < textures.length; i++)
            {
                list.push({ url: textures[i], type: AssetTypeEnum.Texture });
            }
            for (var i = 0; i < texturedescs.length; i++)
            {
                list.push({ url: texturedescs[i], type: AssetTypeEnum.TextureDesc });
            }
            for (var i = 0; i < meshs.length; i++)
            {
                list.push({ url: meshs[i], type: AssetTypeEnum.Mesh });
            }
            for (var i = 0; i < materials.length; i++)
            {
                list.push({ url: materials[i], type: AssetTypeEnum.Material });
            }
            for (var i = 0; i < anclips.length; i++)
            {
                list.push({ url: anclips[i], type: AssetTypeEnum.Aniclip });
            }
            for (var i = 0; i < prefabs.length; i++)
            {
                list.push({ url: prefabs[i], type: AssetTypeEnum.Prefab });
            }
            for (var i = 0; i < scenes.length; i++)
            {
                list.push({ url: scenes[i], type: AssetTypeEnum.Scene });
            }
            for (var i = 0; i < textassets.length; i++)
            {
                list.push({ url: textassets[i], type: AssetTypeEnum.TextAsset });
            }
            let realTotal = list.length;
            if (totoal > realTotal)
            {
                console.log("assetBundle中某个file不是资源或后缀有问题");
            }

            state.totaltask = realTotal + 1;//自身也算一个task
            state.curtask = 1;
            onstate(state);
            assetmgr.doWaitState(this.url, state);

            //排序完毕，开始加载
            var loadcall = () =>
            {
                var surl = list[state.curtask - 1].url;
                var type = list[state.curtask - 1].type;
                if(mapPackes[surl] != undefined)
                {
                    //在pack里
                    assetmgr.loadResByPack(mapPackes[surl], surl, type, (s) =>
                    {
                        realTotal--;
                        state.curtask++;

                        let _fileName = assetmgr.getFileName(surl);

                        if (type != AssetTypeEnum.GLVertexShader && type != AssetTypeEnum.GLFragmentShader && type != AssetTypeEnum.Shader
                        &&type != AssetTypeEnum.PackBin && type != AssetTypeEnum.PackTxt)    
                        {
                            let _res = s.resstate[_fileName].res;
                            this.mapNamed[_fileName] = _res.getGUID();
                        }

                        if (realTotal === 0)
                        {
                            state.isfinish = true;
                            onstate(state);
                            assetmgr.loadByQueue();
                        }
                        else
                        {
                            onstate(state);
                            loadcall();
                        }
                        assetmgr.doWaitState(this.url, state);
                    }, state);
                }
                else
                {
                    assetmgr.loadSingleRes(surl, type, (s) =>
                    {
                        realTotal--;
                        state.curtask++;

                        let _fileName = assetmgr.getFileName(surl);

                        
                        if (type != AssetTypeEnum.GLVertexShader && type != AssetTypeEnum.GLFragmentShader && type != AssetTypeEnum.Shader
                        &&type != AssetTypeEnum.PackBin && type != AssetTypeEnum.PackTxt)    
                        {
                            let _res = s.resstate[_fileName].res;
                            this.mapNamed[_fileName] = _res.getGUID();
                        }


                        if (realTotal === 0)
                        {
                            state.isfinish = true;
                            onstate(state);
                            assetmgr.loadByQueue();
                        }
                        else
                        {
                            onstate(state);
                            loadcall(); 
                        }
                        assetmgr.doWaitState(this.url, state);
                    }, state);
                }
            }
            loadcall();
        }

        /**
         * @public
         * @language zh_CN
         * 资源GUID的字典，key为资源的名称
         * @version gd3d 1.0
         */
        mapNamed: { [id: string]: number } = {};
    }

    /**
     * @public
     * @language zh_CN
     * 通用的资源管理器，你也可以自己搞个东西当资源，继承IResource即可<p/>
     * 资源管理器用引用计数法管理资源，计数混乱会导致问题，循环引用也会导致问题，需要注意<p/>
     * js 语法层面不能提供可靠的自动引用计数机制，所以如果你用乱了，哪啊就是乱了<p/>
     * 所有的资源都是从资源管理器get出来的<p/>
     * 所有的资源不用的时候都要还到资源管理器<p/>
     * @version gd3d 1.0
     */
    export class assetMgr
    {
        app: application;
        webgl: WebGLRenderingContext;
        shaderPool: gd3d.render.shaderPool;
        defMesh: defMesh;
        constructor(app: application)
        {
            this.app = app;
            this.webgl = app.webgl;
            this.shaderPool = new gd3d.render.shaderPool();
        }
        initDefAsset()
        {
            defShader.initDefaultShader(this);
            defMesh.initDefaultMesh(this);
            defTexture.initDefaultTexture(this);
        }
        //资源获取方式三，静态资源
        mapShader: { [id: string]: shader } = {};
        getShader(name: string): shader
        {
            return this.mapShader[name];
        }

        /**
         * @public
         * @language zh_CN
         * 默认Mesh资源
         * @version gd3d 1.0
         */
        mapDefaultMesh: { [id: string]: mesh } = {};
        getDefaultMesh(name: string): mesh
        {
            return this.mapDefaultMesh[name];
        }

        /**
         * @public
         * @language zh_CN
         * 默认图片资源
         * @version gd3d 1.0
         */
        mapDefaultTexture: { [id: string]: texture } = {};
        getDefaultTexture(name: string): texture
        {
            return this.mapDefaultTexture[name];
        }

        /**
         * @public
         * @language zh_CN
         * assetbundle的字典，key为bundlename
         * @version gd3d 1.0
         */
        mapBundle: { [id: string]: assetBundle } = {};

        /**
         * @public
         * @language zh_CN
         * 资源的字典，key为资源的GUID
         * @version gd3d 1.0
         */
        mapRes: { [id: number]: assetRef } = {};
        /**
         * @public
         * @language zh_CN
         * 资源GUID的字典，key为资源的名称
         * @version gd3d 1.0
         */
        mapNamed: { [id: string]: number[] } = {};
        /**
        * @public
        * @language zh_CN
        * 通过资源的GUID获取资源
        * @version gd3d 1.0
        * @param id 资源的GUID
        */
        getAsset(id: number): IAsset
        {
            var r = this.mapRes[id];
            if (r == null) return null;
            return r.asset;
        }
        /**
         * @public
         * @language zh_CN
         * 通过资源的名称获取资源
         * @version gd3d 1.0
         * @param name 资源的名称
         */
        getAssetByName(name: string, bundlename: string = null): IAsset
        {
            if (this.mapNamed[name] == null)
                return null;
            var id = this.mapNamed[name][0];
            if (bundlename != null)
            {
                let assetbundle = this.mapBundle[bundlename] as assetBundle;
                if (assetbundle != null)
                    id = assetbundle.mapNamed[name];
            }

            if (id == null) return null;
            var r = this.mapRes[id];
            if (r == null) return null;
            return r.asset;
        }
        getAssetBundle(bundlename: string): assetBundle
        {
            if (this.mapBundle[bundlename])
                return this.mapBundle[bundlename];
            return null;
        }
        /**
         * @public
         * @language zh_CN
         * 取消资源的引用，当前资源的引用计数减一
         * @param res 需要取消引用的资源
         * @param disposeNow 如果引用计数归零则立即释放
         * @version gd3d 1.0
         */
        unuse(res: IAsset, disposeNow: boolean = false)
        {
            var id = res.getGUID();
            var name = res.getName();
            if (res.defaultAsset)//静态资源不参与引用计数管理
            {
                return;
            }
            this.mapRes[id].refcount--;
            if (disposeNow && this.mapRes[id].refcount <= 0)
            {
                this.mapRes[id].asset.dispose();
                if (name != null)
                {
                    if (this.mapNamed[name].length <= 1)
                    {
                        delete this.mapNamed[name];
                    }
                    else
                    {
                        for (let key in this.mapNamed[name])
                        {
                            if (id == this.mapNamed[name][key])
                            {
                                this.mapNamed[name].splice(parseInt(key), 1);
                            }
                        }
                    }
                }
                delete this.mapRes[id];
            }
        }
        /**
         * @public
         * @language zh_CN
         * 引用资源，当前资源的引用计数加一
         * @param res 需要引用的资源
         * @version gd3d 1.0
         */
        use(res: IAsset)
        {
            var id = res.getGUID();
            var name = res.getName();
            if (id <= 0)//如果没有id，分配一个
            {
                throw new Error("不合法的res guid:" + name);
            }
            if (res.defaultAsset)//静态资源不参与引用计数管理
            {
                return;
            }
            if (this.mapRes[id] == null)
            {
                this.mapRes[id] = { asset: res, refcount: 0 };
                if (name != null)
                {
                    if (this.mapNamed[name] == null)
                        this.mapNamed[name] = [];
                    this.mapNamed[name].push(id);
                }
            }
            this.mapRes[id].refcount++;
        }

        /**
         * @public
         * @language zh_CN
         * 释放所有引用为零的资源
         * @version gd3d 1.0
         */
        releaseUnuseAsset()
        {
            for (let k in this.mapRes)
            {
                if (this.mapRes[k].refcount <= 0)
                {
                    let name = this.mapRes[k].asset.getName();
                    if (this.mapNamed[name].length <= 1)
                    {
                        delete this.mapNamed[name];
                    }
                    else
                    {
                        for (let key in this.mapNamed[name])
                        {
                            if (this.mapRes[k].asset.getGUID() == this.mapNamed[name][key])
                            {
                                this.mapNamed[name].splice(parseInt(key), 1);
                            }
                        }
                    }
                    this.mapRes[k].asset.dispose();
                    delete this.mapRes[k];
                }
            }
        }

        /**
         * @public
         * @language zh_CN
         * 返回所有资源引用计数
         * @version gd3d 1.0
         */
        getAssetsRefcount(): { [id: string]: number }
        {
            let mapRefcout: { [id: string]: number } = {};
            for (var k in this.mapNamed)
            {
                if (this.mapNamed[k].length == 1)
                {
                    let res = this.mapRes[this.mapNamed[k][0]];
                    mapRefcout[k] = res.refcount;
                }
                else
                {
                    for (let key in this.mapNamed[k])
                    {
                        let res = this.mapRes[this.mapNamed[k][key]];
                        mapRefcout[k + "(" + key + ")"] = res.refcount;
                    }
                }

            }
            return mapRefcout;
        }

        nameDuplicateCheck(name: string): boolean
        {
            // if (this.mapNamed[name])
            //     return false;
            return true;
        }
        //加载资源接口，这个clone 以前 写的骨骼动画那部分的接口即可
        //多个package 或者 fileGroup 有重复文件均不影响
        //。。。
        //loadFile //加载单个文件
        //unloadFile

        //loadFileGroup
        //unloadFileGroup

        //loadPackage
        //unloadPackage

        private mapInLoad: { [id: string]: stateLoad } = {};
        removeAssetBundle(name: string)
        {
            if(this.mapBundle[name] != null)
                delete this.mapBundle[name];
            if (this.mapInLoad[name] != null)
                delete this.mapInLoad[name];
        }
        /**
         * @public
         * @language zh_CN
         * 通过资源的url获取当前的加载状态
         * @version gd3d 1.0
         * @param url 资源的url
         */
        //getUrlLoadState(url: string): stateLoad
        //{
        //    return this.mapInLoad[url];
        //}

        private assetUrlDic: { [id: number]: string } = {};
        /**
         * @public
         * @language zh_CN
         * 获取资源的url
         * @version gd3d 1.0
         * @param asset 资源
         */
        getAssetUrl(asset: IAsset): string
        {
            return this.assetUrlDic[asset.getGUID()];
        }
        
        bundlePackBin:{[name:string]:ArrayBuffer} = {};
        bundlePackJson:JSON;
        //packnum 0 txt 1 bin
        loadResByPack(packnum:number, url: string, type: AssetTypeEnum, onstate: (state: stateLoad) => void, state: stateLoad)
        {
            let bundlename = this.getFileName(state.url);
            let filename = this.getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));
            let respack:any;
            if(packnum == 0)
            {
                respack = this.bundlePackJson;
            }
            else 
            {
                respack = this.bundlePackBin;
            }
            if (type == AssetTypeEnum.GLVertexShader)
            {
                state.resstate[filename] = { state: 0, res: null }
                let txt = this.bundlePackJson[filename];
                txt = decodeURI(txt);
                state.resstate[filename].state = 1;//完成

                state.logs.push("load a glshader:" + filename);
                this.shaderPool.compileVS(this.webgl, name, txt);
                onstate(state);
            }
            else if (type == AssetTypeEnum.GLFragmentShader)
            {
                state.resstate[filename] = { state: 0, res: null }
                let txt = this.bundlePackJson[filename];
                txt = decodeURI(txt);
                state.resstate[filename].state = 1;//完成

                state.logs.push("load a glshader:" + filename);
                this.shaderPool.compileFS(this.webgl, name, txt);
                onstate(state);
            }
            else if (type == AssetTypeEnum.Shader)
            {
                state.resstate[filename] = { state: 0, res: null }
                let txt = this.bundlePackJson[filename];
                state.resstate[filename].state = 1;//完成
                var _shader = new shader(filename);
                _shader.parse(this, JSON.parse(txt));
                this.assetUrlDic[_shader.getGUID()] = url;
                // this.use(_shader); //shader 地位特殊，不作为named resource,不卸载
                this.mapShader[filename] = _shader;
                onstate(state);
            }
            else if (type == AssetTypeEnum.TextureDesc)
            {
                let txt = this.bundlePackJson[filename];
                
                var _texturedesc = JSON.parse(txt);
                var _name: string = _texturedesc["name"];
                var _filterMode: string = _texturedesc["filterMode"];
                var _format: string = _texturedesc["format"];
                var _mipmap: boolean = _texturedesc["mipmap"];
                var _wrap: string = _texturedesc["wrap"];

                var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                if (_format == "RGB")
                {
                    _textureFormat = render.TextureFormatEnum.RGB;
                }
                else if (_format == "Gray")
                {
                    _textureFormat = render.TextureFormatEnum.Gray;
                }

                var _linear: boolean = true;
                if (_filterMode.indexOf("linear") < 0)
                {
                    _linear = false;
                }

                var _repeat: boolean = false;
                if (_wrap.indexOf("Repeat") >= 0)
                {
                    _repeat = true;
                }


                var _textureSrc: string = url.replace(filename, _name);

                state.resstate[filename] = { state: 0, res: null }
                var img = new Image();
                img.src = _textureSrc;
                img.crossOrigin = "anonymous";
                img.onerror = (error) =>
                {
                    if (error != null)
                    {
                        state.errs.push(new Error("img load failed:" + filename + ". message:" + error.message));
                        state.iserror = true;
                        onstate(state);
                    }
                }
                img.onload = () =>
                {
                    var _texture = new texture(filename);
                    _texture.realName = _name;
                    this.assetUrlDic[_texture.getGUID()] = url;

                    var t2d = new gd3d.render.glTexture2D(this.webgl, _textureFormat);
                    t2d.uploadImage(img, _mipmap, _linear, true, _repeat);
                    _texture.glTexture = t2d;

                    this.use(_texture);
                    state.resstate[filename].state = 1;//完成
                    state.resstate[filename].res = _texture;
                    onstate(state);
                }
            }
            else if (type == AssetTypeEnum.Material)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                state.resstate[filename].state = 1;
                var _material = new material(filename);//?what the fuck,解析出材质
                _material.Parse(this, JSON.parse(txt));
                this.assetUrlDic[_material.getGUID()] = url;
                this.use(_material);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _material;
                onstate(state);
            }
            else if (type == AssetTypeEnum.Mesh)
            {
                state.resstate[filename] = { state: 0, res: null };
                let _buffer = this.bundlePackBin[filename];
                var _mesh = new mesh(filename);
                this.assetUrlDic[_mesh.getGUID()] = url;
                _mesh.Parse(_buffer, this.webgl);//在此方法中命名mesh的name（name存在bin文件中）
                this.use(_mesh);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _mesh;
                onstate(state);
            }
            else if (type == AssetTypeEnum.Aniclip)
            {
                state.resstate[filename] = { state: 0, res: null };
                let _buffer = this.bundlePackBin[filename];
                var _clip = new animationClip(filename);
                this.assetUrlDic[_clip.getGUID()] = url;
                _clip.Parse(_buffer);
                this.use(_clip);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _clip;
                onstate(state);
            }
            else if (type == AssetTypeEnum.Atlas)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                var _atlas = new atlas(filename);
                this.assetUrlDic[_atlas.getGUID()] = url;
                _atlas.Parse(txt, this);
                this.use(_atlas);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _atlas;
                onstate(state);
                
            }
            else if (type == AssetTypeEnum.Prefab)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                var _prefab = new prefab(filename);
                _prefab.assetbundle = bundlename;
                this.assetUrlDic[_prefab.getGUID()] = url;
                _prefab.Parse(txt, this);
                this.use(_prefab);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _prefab;
                onstate(state);
            }
            else if (type == AssetTypeEnum.Scene)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                var _scene = new rawscene(filename);
                _scene.assetbundle = bundlename;
                this.assetUrlDic[_scene.getGUID()] = url;
                _scene.Parse(txt, this);
                this.use(_scene);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _scene;
                onstate(state);
            }
            else if (type == AssetTypeEnum.Font)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                var _font = new font(filename);
                this.assetUrlDic[_font.getGUID()] = url;
                _font.Parse(txt, this);
                this.use(_font);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _font;
                onstate(state);
            }
            else if (type == AssetTypeEnum.TextAsset)
            {
                state.resstate[filename] = { state: 0, res: null };
                let txt = this.bundlePackJson[filename];
                var _textasset = new textasset(filename);
                this.assetUrlDic[_textasset.getGUID()] = url;
                _textasset.content = txt;
                this.use(_textasset);
                state.resstate[filename].state = 1;
                state.resstate[filename].res = _textasset;
                onstate(state);
            }
            else
            {
                throw new Error("cant use the type:" + type);
            }
        }
        /**
         * @public
         * @language zh_CN
         * 加载单个资源
         * 所有load进来的资源，均use一遍，引用计数为1
         * 再unload 一次 归0，则可dispose（）
         * @version gd3d 1.0
         * @param url 资源的url
         * @param type 资源的类型
         * @param onstate 状态返回的回调
         * @param state 资源加载的总状态
         */
        loadSingleRes(url: string, type: AssetTypeEnum, onstate: (state: stateLoad) => void, state: stateLoad)
        {
            let bundlename = this.getFileName(state.url);
            let filename = this.getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));
            if(type == AssetTypeEnum.PackBin)
            {
                gd3d.io.loadArrayBuffer(url, (_buffer, err) =>
                {
                    var read: gd3d.io.binReader = new gd3d.io.binReader(_buffer);
                    let index = read.readInt32();
                    read.position = index;
                    while(read.canread())
                    {
                        let indindex = read.readInt32();
                        if(index == 0)  break;

                        let key = read.readStringUtf8FixLength(indindex);
                        let strs:string[] = key.split('|');

                        let start = parseInt(strs[1]);
                        let len = parseInt(strs[2]);

                        let bufs: ArrayBuffer = _buffer.slice(start, start + len);
                        this.bundlePackBin[strs[0]] = bufs;
                    }

                    onstate(state);
                })
            }
            else if(type == AssetTypeEnum.PackTxt)
            {
                gd3d.io.loadArrayBuffer(url, (_buffer, err) =>
                {
                    var read: gd3d.io.binReader = new gd3d.io.binReader(_buffer);
                    
                    var arr = new Uint8Array(_buffer.byteLength);
                    read.readUint8Array(arr);
                    let txt = gd3d.io.binReader.utf8ArrayToString(arr);
                    
                    this.bundlePackJson = JSON.parse(txt);
                    onstate(state);
                });
            }
            else if (type == AssetTypeEnum.GLVertexShader)
            {
                state.resstate[filename] = { state: 0, res: null }
                gd3d.io.loadText(url, (txt, err) =>
                {
                    state.resstate[filename].state = 1;//完成

                    state.logs.push("load a glshader:" + filename);
                    this.shaderPool.compileVS(this.webgl, name, txt);
                    onstate(state);
                }
                );
            }
            else if (type == AssetTypeEnum.GLFragmentShader)
            {
                state.resstate[filename] = { state: 0, res: null }
                gd3d.io.loadText(url, (txt, err) =>
                {
                    state.resstate[filename].state = 1;//完成

                    state.logs.push("load a glshader:" + filename);
                    this.shaderPool.compileFS(this.webgl, name, txt);
                    onstate(state);
                }
                );
            }
            else if (type == AssetTypeEnum.Shader)
            {
                state.resstate[filename] = { state: 0, res: null }
                gd3d.io.loadText(url, (txt, err) =>
                {
                    state.resstate[filename].state = 1;//完成
                    var _shader = new shader(filename);
                    _shader.parse(this, JSON.parse(txt));
                    this.assetUrlDic[_shader.getGUID()] = url;
                    this.mapShader[filename] = _shader;
                    onstate(state);
                });
            }
            else if (type == AssetTypeEnum.Texture)
            {
                state.resstate[filename] = { state: 0, res: null }
                var img = new Image();
                img.src = url;
                img.crossOrigin = "anonymous";
                img.onerror = (error) =>
                {
                    if (error != null)
                    {
                        state.errs.push(new Error("img load failed:" + filename + ". message:" + error.message));
                        state.iserror = true;
                        onstate(state);
                    }
                }
                img.onload = () =>
                {
                    var _texture = new texture(filename);
                    this.assetUrlDic[_texture.getGUID()] = url;
                    var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                    var t2d = new gd3d.render.glTexture2D(this.webgl, _textureFormat);
                    t2d.uploadImage(img, true, true, true, true);
                    _texture.glTexture = t2d;
                    this.use(_texture);
                    state.resstate[filename].state = 1;//完成
                    state.resstate[filename].res = _texture;
                    onstate(state);
                }
            }
            else if (type == AssetTypeEnum.TextureDesc)
            {
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _texturedesc = JSON.parse(txt);
                    var _name: string = _texturedesc["name"];
                    var _filterMode: string = _texturedesc["filterMode"];
                    var _format: string = _texturedesc["format"];
                    var _mipmap: boolean = _texturedesc["mipmap"];
                    var _wrap: string = _texturedesc["wrap"];

                    var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                    if (_format == "RGB")
                    {
                        _textureFormat = render.TextureFormatEnum.RGB;
                    }
                    else if (_format == "Gray")
                    {
                        _textureFormat = render.TextureFormatEnum.Gray;
                    }

                    var _linear: boolean = true;
                    if (_filterMode.indexOf("linear") < 0)
                    {
                        _linear = false;
                    }

                    var _repeat: boolean = false;
                    if (_wrap.indexOf("Repeat") >= 0)
                    {
                        _repeat = true;
                    }


                    var _textureSrc: string = url.replace(filename, _name);

                    state.resstate[filename] = { state: 0, res: null }
                    var img = new Image();
                    img.src = _textureSrc;
                    img.crossOrigin = "anonymous";
                    img.onerror = (error) =>
                    {
                        if (error != null)
                        {
                            state.errs.push(new Error("img load failed:" + filename + ". message:" + error.message));
                            state.iserror = true;
                            onstate(state);
                        }
                    }
                    img.onload = () =>
                    {
                        var _texture = new texture(filename);
                        _texture.realName = _name;
                        this.assetUrlDic[_texture.getGUID()] = url;

                        var t2d = new gd3d.render.glTexture2D(this.webgl, _textureFormat);
                        t2d.uploadImage(img, _mipmap, _linear, true, _repeat);
                        _texture.glTexture = t2d;

                        this.use(_texture);
                        state.resstate[filename].state = 1;//完成
                        state.resstate[filename].res = _texture;
                        onstate(state);
                    }
                })
            }
            else if (type == AssetTypeEnum.Material)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    state.resstate[filename].state = 1;
                    var _material = new material(filename);//?what the fuck,解析出材质
                    _material.Parse(this, JSON.parse(txt));
                    this.assetUrlDic[_material.getGUID()] = url;
                    this.use(_material);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _material;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Mesh)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadArrayBuffer(url, (_buffer, err) =>
                {
                    var _mesh = new mesh(filename);
                    this.assetUrlDic[_mesh.getGUID()] = url;
                    _mesh.Parse(_buffer, this.webgl);//在此方法中命名mesh的name（name存在bin文件中）
                    this.use(_mesh);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _mesh;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Aniclip)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadArrayBuffer(url, (_buffer, err) =>
                {
                    var _clip = new animationClip(filename);
                    this.assetUrlDic[_clip.getGUID()] = url;
                    _clip.Parse(_buffer);
                    this.use(_clip);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _clip;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Atlas)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _atlas = new atlas(filename);
                    this.assetUrlDic[_atlas.getGUID()] = url;
                    _atlas.Parse(txt, this);
                    this.use(_atlas);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _atlas;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Prefab)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _prefab = new prefab(filename);
                    _prefab.assetbundle = bundlename;
                    this.assetUrlDic[_prefab.getGUID()] = url;
                    _prefab.Parse(txt, this);
                    this.use(_prefab);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _prefab;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Scene)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _scene = new rawscene(filename);
                    _scene.assetbundle = bundlename;
                    this.assetUrlDic[_scene.getGUID()] = url;
                    _scene.Parse(txt, this);
                    this.use(_scene);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _scene;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.Font)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _font = new font(filename);
                    this.assetUrlDic[_font.getGUID()] = url;
                    _font.Parse(txt, this);
                    this.use(_font);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _font;
                    onstate(state);
                })
            }
            else if (type == AssetTypeEnum.TextAsset)
            {
                state.resstate[filename] = { state: 0, res: null };
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _textasset = new textasset(filename);
                    this.assetUrlDic[_textasset.getGUID()] = url;
                    _textasset.content = txt;
                    this.use(_textasset);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _textasset;
                    onstate(state);
                })
            }
            else if(type==AssetTypeEnum.pathAsset)
            {
                state.resstate[filename]={state:0,res:null};
                gd3d.io.loadText(url, (txt, err) =>
                {
                    var _path = new pathasset(filename);
                    this.assetUrlDic[_path.getGUID()] = url;
                    _path.Parse(JSON.parse(txt));
                    this.use(_path);
                    state.resstate[filename].state = 1;
                    state.resstate[filename].res = _path;
                    onstate(state);
                })
            }
            else
            {
                throw new Error("cant use the type:" + type);
            }
        }

        private waitStateDic: { [name: string]: Function[] } = {};
        public doWaitState(name: string, state: stateLoad)
        {
            if (this.waitStateDic[name] == null)
                return;
            for (var key in this.waitStateDic[name])
            { 
                this.waitStateDic[name][key](state);
            }
            if (state.isfinish)
            {
                this.waitStateDic[name].length = 0;
            }
        }

        private queueState: {state:stateLoad, type:AssetTypeEnum, onstate:(state:stateLoad) => void }[] = [];
        private curloadinfo:{state:stateLoad, type:AssetTypeEnum, onstate:(state:stateLoad) => void };
        public loadByQueue()
        {
            if(this.curloadinfo!=null)
            {
                if(!this.curloadinfo.state.isfinish)
                    return;
                else
                {
                    this.curloadinfo = null;   
                    this.bundlePackBin = {};
                    this.bundlePackJson = null;
                }
            }
            if(this.queueState.length == 0)   return;
            
            this.curloadinfo = this.queueState.shift();
            let state = this.curloadinfo.state;
            let url = state.url;
            let type = this.curloadinfo.type;
            let onstate = this.curloadinfo.onstate;
            
            if (type == AssetTypeEnum.Bundle)//加载包
            {
                gd3d.io.loadText(url, (txt, err) =>
                {
                    let filename = this.getFileName(url);

                    var ab = new assetBundle(url);
                    ab.name = filename;
                    ab.parse(JSON.parse(txt));
                    ab.load(this, this.curloadinfo);

                    this.mapBundle[filename] = ab;
                });
            }
            else if(type == AssetTypeEnum.CompressBundle)
            {
                //压缩的bundle在packs.txt中
                let loadurl = url.replace(".assetbundle.json", ".packs.txt");
                gd3d.io.loadText(loadurl, (txt, err) =>
                {
                    let filename = this.getFileName(url);

                    var ab = new assetBundle(url);
                    ab.name = filename;
                    let json = JSON.parse(txt);
                    this.bundlePackJson = json;
                    ab.parse(json["bundleinfo"]);
                    ab.load(this, this.curloadinfo);

                    this.mapBundle[filename] = ab;
                });
            }
            else
            {
                state.totaltask = 1;
                this.loadSingleRes(url, type, (s) =>
                {
                    state.curtask = 1;
                    s.isfinish = true;
                    onstate(s);
                    this.doWaitState(url, s);
                    this.loadByQueue();
                }, state);
            }
        }
        /**
         * @public
         * @language zh_CN
         * 加载压缩后的包
         * @version gd3d 1.0
         * @param url 资源的url
         * @param type 资源的类型
         * @param onstate 状态返回的回调
         */
        loadCompressBundle(url: string, onstate: (state: stateLoad) => void = null)
        {
            let name = this.getFileName(url);
            let type = this.calcType(url);
            var state = new stateLoad();
            this.mapInLoad[name] = state;
            state.url = url;
            if(type != AssetTypeEnum.Bundle)
            {
                state.errs.push(new Error("is not bundle compress type:" + url));
                state.iserror = true;
                onstate(state);
                this.doWaitState(url, state);
                return;
            }
            type = AssetTypeEnum.CompressBundle;
            this.queueState.push({state, type, onstate});
            this.loadByQueue();
        }
        /**
         * @public
         * @language zh_CN
         * 加载资源
         * 这里来区分assetbundle和单个资源
         * @version gd3d 1.0
         * @param url 资源的url
         * @param type 资源的类型
         * @param onstate 状态返回的回调
         */
        load(url: string, type: AssetTypeEnum = AssetTypeEnum.Auto, onstate: (state: stateLoad) => void = null)
        {
            if (onstate == null)
                onstate = () => { };

            let name = this.getFileName(url);
            if (this.mapInLoad[name] != null)
            {
                let _state = this.mapInLoad[name];
                if (_state.isfinish)
                {
                    onstate(this.mapInLoad[name]);
                }
                else
                {
                    if (this.waitStateDic[name] == null)
                        this.waitStateDic[name] = [];
                    this.waitStateDic[name].push(onstate);
                }
                return;
            }

            var state = new stateLoad();
            this.mapInLoad[name] = state;
            state.url = url;
            //确定资源类型
            if (type == AssetTypeEnum.Auto)
            {
                type = this.calcType(url);
            }
            if (type == AssetTypeEnum.Unknown)
            {
                state.errs.push(new Error("can not sure about type:" + url));
                state.iserror = true;
                onstate(state);
                this.doWaitState(url, state);
                return;
            }
            this.queueState.push({state, type, onstate});
            this.loadByQueue();
        }

        /**
         * @public
         * @language zh_CN
         * 卸载资源
         * @version gd3d 1.0
         * @param url 资源的url
         * @param onstate 状态返回的回调
         */
        unload(url: string, onstate: () => void = null)
        {
            //如果资源没有被加载，则往后不执行
            let name = this.getFileName(url);
            if (this.mapInLoad[name] == null)
                return;
            let state: stateLoad = this.mapInLoad[name];
            for (let key in state.resstate)
            {
                state.resstate[key].res.unuse();
            }
            delete this.mapInLoad[name];
        }

        /**
         * @public
         * @language zh_CN
         * 加载场景
         * 只有先load完包含场景的assetbundle，才能load场景
         * @version gd3d 1.0
         * @param sceneName 场景名称
         * @param onComplete 加载完成回调
         */
        loadScene(sceneName: string, onComplete: () => void)
        {
            if (sceneName.length > 0)
            {
                //移除没有标记为不销毁的跟节点                          
                // let sceneRoot = this.app.getScene().getRoot();
                // let rootChildrenlength = sceneRoot.children.length;
                // for (let i = rootChildrenlength - 1; i >= 0; i--)
                // {
                //     let tempChild = sceneRoot.children[i];
                //     if (tempChild.gameObject.dontdestroyonload)
                //         continue;
                //     sceneRoot.removeChild(tempChild);
                //     tempChild.dispose();
                // }

                var _rawscene: rawscene = this.getAssetByName(sceneName) as rawscene;

                let willLoadRoot = _rawscene.getSceneRoot();
                while (willLoadRoot.children.length > 0)
                {
                    this.app.getScene().addChild(willLoadRoot.children.shift());
                }

                //lightmap
                _rawscene.useLightMap(this.app.getScene());
            }
            else
            {
                var _camera: transform = new transform();
                _camera.gameObject.addComponent("camera");
                _camera.name = "camera";
                this.app.getScene().addChild(_camera);
            }
            this.app.getScene().name = sceneName;
            this.app.getScene().getRoot().markDirty();
            onComplete();
        }

        /**
         * @public
         * @language zh_CN
         * 保存场景
         * 这里只是把场景序列化
         * 具体保存要编辑器来进行
         * 保存的地址和内容通过回调返回
         * @version gd3d 1.0
         * @param fun 回调
         */
        saveScene(fun: (data: SaveInfo, resourses?: string[]) => void)
        {
            io.SerializeDependent.resoursePaths = [];//先清空下资源引用

            let info: SaveInfo = new SaveInfo();
            let _scene = {};
            let _rootNode = io.serializeObj(this.app.getScene().getRoot(), this);

            let _lightmaps = [];
            let lightmaps = this.app.getScene().lightmaps;
            for (var str in lightmaps)
            {
                let _lightmap = {};
                _lightmap["name"] = lightmaps[str].getName();
                _lightmaps.push(_lightmap);
            }

            _scene["rootNode"] = _rootNode;
            _scene["lightmap"] = _lightmaps;

            let _sceneStr = JSON.stringify(_scene);

            var _rawscene: rawscene = this.getAssetByName(this.app.getScene().name) as rawscene;
            _rawscene.Parse(_sceneStr, this);
            let url = this.getAssetUrl(_rawscene);

            info.files[url] = _sceneStr;

            fun(info, io.SerializeDependent.resoursePaths);
        }

        /**
         * @public
         * @language zh_CN
         * 保存场景
         * 这里只是把场景序列化
         * 具体保存要编辑器来进行
         * 保存的地址和内容通过回调返回
         * @version gd3d 1.0
         * @param fun 回调
         */
        savePrefab(trans: transform, prefabName: string, fun: (data: SaveInfo, resourses?: string[]) => void)
        {
            io.SerializeDependent.resoursePaths = [];//先清空下资源引用

            let info: SaveInfo = new SaveInfo();

            var _prefab: prefab = this.getAssetByName(prefabName) as prefab;
            _prefab.apply(trans);
            let _rootTrans = io.serializeObj(trans, null, this);

            let url = this.getAssetUrl(_prefab);
            info.files[url] = JSON.stringify(_rootTrans);

            fun(info, io.SerializeDependent.resoursePaths);
        }




        /**
         * @language zh_CN
         * 保存材质
         * @param mat 
         * @param fun 
         */
        saveMaterial(mat: material, fun: (data: SaveInfo) => void)
        {
            let info: SaveInfo = new SaveInfo();
            let data = {};
            let mapUniform = {};
            let shader = mat.getShader();
            let shaderPropertis = shader.defaultValue;
            data["shader"] = shader.getName();
            data["mapUniform"] = mapUniform;

            for (let key in shaderPropertis)
            {
                if (mat.mapUniform[key] != undefined)
                {
                    let propertyDdata = {};
                    let uniformData = mat.mapUniform[key];
                    propertyDdata["type"] = uniformData.type;
                    switch (uniformData.type)
                    {
                        case gd3d.render.UniformTypeEnum.Texture:
                            propertyDdata["value"] = uniformData.value != null ? uniformData.value.name.name : "";
                            break;
                        case gd3d.render.UniformTypeEnum.Float4:
                            propertyDdata["value"] = uniformData.value;
                            break;
                        case gd3d.render.UniformTypeEnum.Float:
                            propertyDdata["value"] = uniformData.value;
                            break;
                    }
                    mapUniform[key] = propertyDdata;
                }
            }
            let url = this.getAssetUrl(mat);
            info.files[url] = JSON.stringify(data);
            fun(info);
        }


        /**
         * @public
         * @language zh_CN
         * 同步加载单个资源（伪同步，只是创建了一个资源的实例返回，还是要等待资源数据加载完成来填充数据）
         * 这个接口还需要完善
         * @version gd3d 1.0
         * @param url 资源的url
         * @param type 资源的类型
         */
        loadSingleResImmediate(url: string, type: AssetTypeEnum): any
        {
            let result: any;
            let filename = this.getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));
            if (type == AssetTypeEnum.GLVertexShader)
            {
                gd3d.io.loadText(url, (txt, err) =>
                {
                    this.shaderPool.compileVS(this.webgl, name, txt);
                }
                );
            }
            else if (type == AssetTypeEnum.GLFragmentShader)
            {
                gd3d.io.loadText(url, (txt, err) =>
                {
                    this.shaderPool.compileFS(this.webgl, name, txt);
                }
                );
            }
            else if (type == AssetTypeEnum.Shader)
            {
                result = new shader(filename);
                gd3d.io.loadText(url, (txt, err) =>
                {
                    result.parse(this, JSON.parse(txt));
                    this.mapShader[filename] = result;
                });
            }
            else if (type == AssetTypeEnum.Texture)
            {
                result = new texture(filename);

                var img = new Image();
                img.src = url;
                img.onload = () =>
                {
                    var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                    result.glTexture = new gd3d.render.glTexture2D(this.webgl, _textureFormat);
                    result.glTexture.uploadImage(img, false, false);
                    this.use(result);
                }
            }
            else if (type == AssetTypeEnum.Mesh)
            {
                result = new mesh(filename);
                gd3d.io.loadArrayBuffer(url, (txt, err) =>
                {
                    result.Parse(txt, this.webgl);
                    this.use(result);
                })
            }
            else
            {
                throw new Error("cant use the type:" + type);
            }
            return result;
        }

        /**
         * @public
         * @language zh_CN
         * 同步加载资源（伪同步，只是创建了一个资源的实例返回，还是要等待资源数据加载完成来填充数据）
         * 这个接口还需要完善
         * 这里有个问题，如果是assetbundle，那么实例究竟是个啥东西。
         * @version gd3d 1.0
         * @param url 资源的url
         * @param type 资源的类型
         */
        loadImmediate(url: string, type: AssetTypeEnum = AssetTypeEnum.Auto): any
        {
            var result: any;
            //确定资源类型
            if (type == AssetTypeEnum.Auto)
            {
                type = this.calcType(url);
            }
            if (type == AssetTypeEnum.Unknown)
            {
                throw new Error("unknown format");
            }
            else if (type == AssetTypeEnum.Bundle)//加载包
            {
                result = new assetBundle(url);
                gd3d.io.loadText(url, (txt, err) =>
                {
                    result.parse(JSON.parse(txt));
                });
            }
            else
            {
                result = this.loadSingleResImmediate(url, type);
            }
            return result;
        }

        /**
         * @public
         * @language zh_CN
         * 通过url获取资源的名称
         * @version gd3d 1.0
         * @param url 资源的url
         */
        getFileName(url: string): string
        {
            var filei = url.lastIndexOf("/");
            var file = url.substr(filei + 1);
            return file;
        }
        /**
         * @public
         * @language zh_CN
         * 通过url获取资源的类型
         * @version gd3d 1.0
         * @param url 资源的url
         */
        calcType(url: string): AssetTypeEnum
        {
            var filei = url.lastIndexOf("/");
            var file = url.substr(filei + 1);

            var i = file.indexOf(".", 0);
            var extname = null;
            while (i >= 0)
            {
                extname = file.substr(i);
                if (extname == ".vs.glsl")
                {
                    return AssetTypeEnum.GLVertexShader;
                }
                else if (extname == ".assetbundle.json")
                {
                    return AssetTypeEnum.Bundle;
                }
                else if (extname == ".fs.glsl")
                {
                    return AssetTypeEnum.GLFragmentShader;
                }
                else if (extname == ".shader.json")
                {
                    return AssetTypeEnum.Shader;
                }
                else if (extname == ".png" || extname == ".jpg")
                {
                    return AssetTypeEnum.Texture;
                }
                else if (extname == ".imgdesc.json")
                {
                    return AssetTypeEnum.TextureDesc;
                }
                else if (extname == ".mat.json")
                {
                    return AssetTypeEnum.Material;
                }
                else if (extname == ".mesh.bin")
                {
                    return AssetTypeEnum.Mesh;
                }
                else if (extname == ".aniclip.bin")
                {
                    return AssetTypeEnum.Aniclip;
                }
                else if (extname == ".prefab.json")
                {
                    return AssetTypeEnum.Prefab;
                }
                else if (extname == ".scene.json")
                {
                    return AssetTypeEnum.Scene;
                }
                else if (extname == ".atlas.json")
                {
                    return AssetTypeEnum.Atlas;
                }
                else if (extname == ".font.json")
                {
                    return AssetTypeEnum.Font;
                }
                else if (extname == ".json" || extname == ".txt" || extname == ".effect.json")
                {
                    return AssetTypeEnum.TextAsset;
                }
                else if(extname == ".packs.bin")
                {
                    return AssetTypeEnum.PackBin;
                }
                else if(extname == ".packs.txt")
                {
                    return AssetTypeEnum.PackTxt;
                }
                else if(extname==".path.json")
                {
                    return AssetTypeEnum.pathAsset;
                }
                i = file.indexOf(".", i + 1);
            }
            return AssetTypeEnum.Unknown;
        }
    }


    /**
     * @public
     * @language zh_CN
     * 资源引用计数的结构
     * @version gd3d 1.0
     */
    export class assetRef
    {
        asset: IAsset;
        refcount: number;
    }

    export class SaveInfo
    {
        files: { [key: string]: string } = {};
    }
}
