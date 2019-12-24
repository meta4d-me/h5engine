namespace gd3d.framework
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
        //     gd3d.io.loadImg(url,
        //         (_tex, _err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(_err, onstate, state))
        //                     return;

        //                 let _texture = asset ? asset : new texture(filename);
        //                 var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
        //                 var t2d = new gd3d.render.glTexture2D(assetMgr.webgl, _textureFormat);
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
            let _texture : texture;
            let texName = filename.split(".")[0];
            let texDescName = `${texName}.imgdesc.json`;
            let hasImgdesc = bundle && bundle.files[texDescName] != null;
            let guidList : number[] = [imgGuid];
            if(hasImgdesc) {
                guidList.push(bundle.files[texDescName]);
            }

            let len = guidList.length;
            for(let i=0;i < len ;i++){
                //如找到已近加载过的资源，不再重复构建
                let _guid = guidList[i];
                let assRef = assetMgr.mapGuid[_guid]
                if(assRef){
                    _texture = assRef.asset as texture;
                    if(_texture && _texture instanceof texture) {
                        delete assetMgr.mapImage[imgGuid];
                        return _texture;
                    }
                }
            }

            //有描述文件不new texture ， 避免冗余增加内存开销
            if(!hasImgdesc){
                let _tex = assetMgr.mapImage[imgGuid] || assetMgr.mapLoading[imgGuid].data;
                _texture =  new texture(filename);
                var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                var t2d = new gd3d.render.glTexture2D(assetmgr.webgl, _textureFormat)
                t2d.uploadImage(_tex, false, true, true, false);
                _texture.glTexture = t2d;
                //清理 HTMLImageElement 的占用
                delete assetMgr.mapImage[imgGuid];
            }
            return _texture;
        }
    }
}