namespace gd3d.framework
{
    @assetF(AssetTypeEnum.PVR)
    export class AssetFactory_PVR implements IAssetFactory
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
        //     if (state.resstateFirst == null)
        //     {
        //         state.resstateFirst = state.resstate[filename];
        //     }
        //     gd3d.io.loadArrayBuffer(url,
        //         (_buffer, err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(err, onstate, state))
        //                     return;

        //                 let _texture = asset ? asset : new texture(filename);
        //                 let pvr: PvrParse = new PvrParse(assetMgr.webgl);
        //                 _texture.glTexture = pvr.parse(_buffer);

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
        //     { });
        // }
        //#endregion
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer , dwguid: number)
        {
            let _texture = new texture(name);
            let pvr: PvrParse = new PvrParse(assetmgr.webgl);
            let imgGuid = dwguid || bundle.texs[name];
            let texName = name.split(".")[0];
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
                        let loading = assetMgr.mapLoading[imgGuid];
                        if(loading){
                            delete loading.data;
                        }
                        return _texture;
                    }
                }
            }

            // let assRef = assetMgr.mapGuid[imgGuid];
            // if(assRef){
            //     _texture = assRef.asset as texture;
            //     if(_texture && _texture instanceof texture) return _texture;
            // }


            // let texName = name.split(".")[0];
            // let texDesc = `${texName}.imgdesc.json`;
            if(!hasImgdesc){
                _texture.glTexture = pvr.parse(bytes);
                //清理 HTMLImageElement 的占用
                let loading = assetMgr.mapLoading[imgGuid];
                if(loading){
                    delete loading.data;
                }
            }

            return _texture;
        }
    }
}