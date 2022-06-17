namespace m4m.framework
{
    @assetF(AssetTypeEnum.Texture)
    export class AssetFactory_Texture implements IAssetFactory
    {
        //#region 废弃de参考代码
        // newAsset(): texture
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: texture, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new ResourceState();
        //     if(state.resstateFirst==null)
        //     {
        //         state.resstateFirst=state.resstate[filename];
        //     }
        //     m4m.io.loadImg(url,
        //         (_tex, _err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(_err, onstate, state))
        //                     return;

        //                 let _texture = asset ? asset : new texture(filename);
        //                 var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
        //                 var t2d = new m4m.render.glTexture2D(assetMgr.webgl, _textureFormat);
        //                 t2d.uploadImage(_tex, false, true, true, false);
        //                 _texture.glTexture = t2d;

        //                 AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         });
        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: texture, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {

        //     });
        // }
        //#endregion
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string , dwguid: number)
        {
            let imgGuid = bundle && bundle.texs ?  bundle.texs[filename] : dwguid;
            let _tex = assetMgr.mapImage[imgGuid] || assetMgr.mapLoading[imgGuid].data;
            let _texture =  new texture(filename);
            var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
            var t2d = new m4m.render.glTexture2D(assetmgr.webgl, _textureFormat);
            if(_tex){
                t2d.uploadImage(_tex, false, true, true, true); // TODO:
                // t2d.uploadImage(_tex, false, true, true, false);
            }else{
                console.warn(`_tex load fail !`);
            }
            _texture.glTexture = t2d;
            return _texture;
        }
    }
}