namespace m4m.framework
{
    @assetF(AssetTypeEnum.cPrefab)
    export class AssetFactory_cPrefab implements IAssetFactory
    {
        //#region 废弃de参考代码
        // newAsset(): prefab
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: prefab, call: (handle: () => void) => void)
        // {
        //     let bundlename = getFileName(state.url);
        //     let filename = getFileName(url);
        //     filename = filename.replace("cprefab", "prefab");
        //     state.resstate[filename] = new ResourceState();
        //     if (state.resstateFirst == null)
        //     {
        //         state.resstateFirst = state.resstate[filename];
        //     }
        //     m4m.io.loadJSON(url, (json, err, isloadFail) =>
        //     {
        //         call(() =>
        //         {
        //             state.isloadFail = isloadFail ? true : false;
        //             if (AssetFactoryTools.catchError(err, onstate, state))
        //                 return;
        //             let _prefab = asset ? asset : new prefab(filename);
        //             _prefab.assetbundle = bundlename;
        //             // _prefab.Parse(txt, assetMgr);
        //             // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
        //             _prefab.cParse(json);
        //             AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url.replace("cprefab", "prefab"));
        //         });


        //         // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
        //     },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         })
        // }

        // loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: prefab, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {

        //         let bundlename = getFileName(state.url);
        //         let filename = getFileName(url);
        //         let oldName = filename;
        //         filename = filename.replace("cprefab", "prefab");
        //         state.resstate[filename] = new ResourceState();
        //         if (state.resstateFirst == null)
        //         {
        //             state.resstateFirst = state.resstate[filename];
        //         }
        //         let txt = respack[oldName];
        //         let _prefab = asset ? asset : new prefab(filename);
        //         _prefab.assetbundle = bundlename;

        //         return io.JSONParse(txt).then((json) =>
        //         {
        //             _prefab.cParse(json);
        //             AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url.replace("cprefab", "prefab"));
        //         });
        //         // await _prefab.Parse(txt, assetMgr);
        //         // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);

        //     });
        // }
        //#endregion
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            let asset = new prefab(filename);
            asset.assetbundle = bundle.name;
            asset.cParse(JSON.parse(txt));
            return asset;            
        }
    }
}