namespace gd3d.framework
{
    @assetF(AssetTypeEnum.TextureDesc)
    export class AssetFactory_TextureDesc implements IAssetFactory
    {
        private readonly t_Normal = "t_Normal";
        private readonly t_PVR = "t_PVR";
        private readonly t_DDS = "t_DDS";
        //#region 废弃de参考代码
        // newAsset(): texture
        // {
        //     return null;
        // }

        // private parseTexture(txt: string, url: string, call: (handle: () => void) => void, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: texture)
        // {
        //     let filename = getFileName(url);
        //     var _texturedesc = JSON.parse(txt);
        //     var _name: string = _texturedesc["name"];
        //     var _filterMode: string = _texturedesc["filterMode"];
        //     var _format: string = _texturedesc["format"];
        //     var _mipmap: boolean = _texturedesc["mipmap"];
        //     var _wrap: string = _texturedesc["wrap"];
        //     var _premultiplyAlpha: boolean = _texturedesc["premultiplyAlpha"];

        //     if (_premultiplyAlpha == undefined)
        //     {
        //         _premultiplyAlpha = true;
        //     }
        //     var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
        //     if (_format == "RGB")
        //         _textureFormat = render.TextureFormatEnum.RGB;
        //     else if (_format == "Gray")
        //         _textureFormat = render.TextureFormatEnum.Gray;

        //     var _linear: boolean = true;
        //     if (_filterMode.indexOf("linear") < 0)
        //         _linear = false;

        //     var _repeat: boolean = false;
        //     if (_wrap.indexOf("Repeat") >= 0)
        //         _repeat = true;

        //     var _textureSrc: string = url.replace(filename, _name);

        //     //图片类型
        //     let loadFun: (url: string, fun: (_bin: ArrayBuffer | HTMLImageElement, _err: Error, isloadFail?: boolean) => void, onprocess: (curLength: number, totalLength: number) => void) => any;
        //     let tType = this.t_Normal;
        //     if (_textureSrc.indexOf(".pvr.bin") >= 0)
        //     {
        //         tType = this.t_PVR;
        //     } else if (_textureSrc.indexOf(".dds.bin") >= 0)
        //     {
        //         tType = this.t_DDS;
        //     }

        //     loadFun = tType == this.t_Normal ? gd3d.io.loadImg : gd3d.io.loadArrayBuffer;

        //     loadFun(_textureSrc,
        //         (data, _err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(_err, onstate, state))
        //                     return;

        //                 let _texture = asset ? asset : new texture(filename);
        //                 _texture.realName = _name;

        //                 //构建贴图
        //                 switch (tType)
        //                 {
        //                     case this.t_Normal:
        //                         var t2d = new gd3d.render.glTexture2D(assetMgr.webgl, _textureFormat);
        //                         t2d.uploadImage(data as any, _mipmap, _linear, _premultiplyAlpha, _repeat);
        //                         _texture.glTexture = t2d;
        //                         break;
        //                     case this.t_PVR:
        //                         let pvr: PvrParse = new PvrParse(assetMgr.webgl);
        //                         _texture.glTexture = pvr.parse(data as any);
        //                         break;
        //                     case this.t_DDS:
        //                         assetMgr.webgl.pixelStorei(assetMgr.webgl.UNPACK_FLIP_Y_WEBGL, 1);
        //                         let textureUtil = new WebGLTextureUtil(assetMgr.webgl, true);
        //                         textureUtil.loadDDS(_textureSrc, null, (texture, error, stats) =>
        //                         {
        //                             let t2d = new gd3d.render.glTexture2D(assetMgr.webgl);
        //                             t2d.format = gd3d.render.TextureFormatEnum.PVRTC2_RGB;
        //                             t2d.texture = texture;
        //                             _texture.glTexture = t2d;
        //                         });
        //                         break;
        //                 }

        //                 AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onRefProgress(loadedLength, totalLength, onstate, state, filename);
        //         });
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: texture, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new RefResourceState();
        //     if (state.resstateFirst == null)
        //     {
        //         state.resstateFirst = state.resstate[filename];
        //     }

        //     gd3d.io.loadText(url,
        //         (txt, err, isloadFail) =>
        //         {
        //             state.isloadFail = isloadFail ? true : false;
        //             if (AssetFactoryTools.catchError(err, onstate, state))
        //                 return;

        //             this.parseTexture(txt, url, call, onstate, state, assetMgr, asset);
        //         },
        //         (loadedLength, totalLength) => { AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename); }
        //     );
        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: texture, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);
        //     state.resstate[filename] = new RefResourceState();

        //     let txt = respack[filename];

        //     this.parseTexture(txt, url, call, onstate, state, assetMgr, asset);
        // }
        //#endregion


        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, data: string, dwguid: number)
        {
            var _texturedesc = JSON.parse(data);
            var _name: string = _texturedesc["name"];
            var _filterMode: string = _texturedesc["filterMode"];
            var _format: string = _texturedesc["format"];
            var _mipmap: boolean = _texturedesc["mipmap"];
            var _wrap: string = _texturedesc["wrap"];
            var _premultiplyAlpha: boolean = _texturedesc["premultiplyAlpha"];

            if (_premultiplyAlpha == undefined)
            {
                _premultiplyAlpha = true;
            }
            var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
            if (_format == "RGB")
                _textureFormat = render.TextureFormatEnum.RGB;
            else if (_format == "Gray")
                _textureFormat = render.TextureFormatEnum.Gray;

            var _linear: boolean = true;
            if (_filterMode.indexOf("linear") < 0)
                _linear = false;

            var _repeat: boolean = false;
            if (_wrap.indexOf("Repeat") >= 0)
                _repeat = true;



            // let _texture = asset ? asset : new texture(url);
            let _texture = new texture(name);

            _texture.realName = _name;
            let tType = this.t_Normal;
            if (_name.indexOf(".pvr.bin") >= 0)
            {
                tType = this.t_PVR;
            } else if (_name.indexOf(".dds.bin") >= 0)
            {
                tType = this.t_DDS;
            }
            let imgGuid = dwguid || bundle.texs[_name];
            let img = assetMgr.mapImage[imgGuid] || assetMgr.mapLoading[imgGuid].data;
            //构建贴图
            switch (tType)
            {
                case this.t_Normal:
                    var t2d = new gd3d.render.glTexture2D(assetmgr.webgl, _textureFormat);
                    t2d.uploadImage(img, _mipmap, _linear, _premultiplyAlpha, _repeat);
                    _texture.glTexture = t2d;
                    break;
                case this.t_PVR:
                    let pvr: PvrParse = new PvrParse(assetmgr.webgl);
                    _texture.glTexture = pvr.parse(img);
                    break;
                case this.t_DDS:
                    throw new Error("暂不支持DDS");
                // assetMgr.webgl.pixelStorei(assetMgr.webgl.UNPACK_FLIP_Y_WEBGL, 1);
                // let textureUtil = new WebGLTextureUtil(assetMgr.webgl, true);
                // textureUtil.loadDDS(_textureSrc, null, (texture, error, stats) =>
                // {
                //     let t2d = new gd3d.render.glTexture2D(assetMgr.webgl);
                //     t2d.format = gd3d.render.TextureFormatEnum.PVRTC2_RGB;
                //     t2d.texture = texture;
                //     _texture.glTexture = t2d;
                // });
                // break;
            }

            return _texture;
        }

        needDownload(text: string)
        {
            let json = JSON.parse(text);
            return json.name;
        }
    }
}