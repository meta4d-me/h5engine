namespace m4m.framework
{
    @assetF(AssetTypeEnum.TextAsset)
    export class AssetFactory_TextAsset implements IAssetFactory
    {
        //#region  废弃de参考代码
        // newAsset(): textasset
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: textasset, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new ResourceState();
        //     if(state.resstateFirst==null)
        //     {
        //         state.resstateFirst=state.resstate[filename];
        //     }
        //     m4m.io.loadText(url,
        //         (txt, err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(err, onstate, state))
        //                     return;

        //                 let _textasset = asset ? asset : new textasset(filename);
        //                 _textasset.content = txt;

        //                 AssetFactoryTools.useAsset(assetMgr, onstate, state, _textasset, url);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         })
        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: textasset, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {
        //         let filename = getFileName(url);
        //         state.resstate[filename] = new ResourceState();
        //         if(state.resstateFirst==null)
        //         {
        //             state.resstateFirst=state.resstate[filename];
        //         }
        //         let txt = respack[filename];
        //         let _textasset = asset ? asset : new textasset(filename);
        //         _textasset.content = txt;

        //         AssetFactoryTools.useAsset(assetMgr, onstate, state, _textasset, url);
        //     });
        // }
        //#endregion
        
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            let asset =  new textasset(filename);
            asset.content = txt;
            return asset;
        }
    }
}