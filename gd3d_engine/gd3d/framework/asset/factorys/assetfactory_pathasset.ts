namespace gd3d.framework
{
    @assetF(AssetTypeEnum.PathAsset)
    export class AssetFactory_PathAsset implements IAssetFactory
    {
        //#region 废弃de参考代码
        // newAsset(): pathasset
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: pathasset, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new ResourceState();
        //     if (state.resstateFirst == null)
        //     {
        //         state.resstateFirst = state.resstate[filename];
        //     }
        //     gd3d.io.loadText(url,
        //         (txt, err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(err, onstate, state))
        //                     return;

        //                 let _path = asset ? asset : new pathasset(filename);
        //                 _path.Parse(JSON.parse(txt));

        //                 AssetFactoryTools.useAsset(assetMgr, onstate, state, _path, url);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         })

        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: pathasset, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {
        //         let filename = getFileName(url);

        //         state.resstate[filename] = new ResourceState();
        //         if (state.resstateFirst == null)
        //         {
        //             state.resstateFirst = state.resstate[filename];
        //         }
        //         let txt = respack[filename];
        //         let _path = asset ? asset : new pathasset(filename);
        //         _path.Parse(JSON.parse(txt));

        //         AssetFactoryTools.useAsset(assetMgr, onstate, state, _path, url);
        //     });
        // }
        //#endregion

        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string)
        {
            return new pathasset(name).Parse(JSON.parse(txt));
        }
    }
}