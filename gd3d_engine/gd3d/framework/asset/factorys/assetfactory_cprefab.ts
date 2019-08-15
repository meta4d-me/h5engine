namespace gd3d.framework
{
    export class AssetFactory_cPrefab implements IAssetFactory
    {
        newAsset(): prefab
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: prefab, call: (handle: () => void) => void)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);
            filename = filename.replace("cprefab","prefab");
            state.resstate[filename] = new ResourceState();
            if (state.resstateFirst == null)
            {
                state.resstateFirst = state.resstate[filename];
            }
            gd3d.io.loadJSON(url, (json, err, isloadFail) =>
            {
                call(() =>
                {
                    state.isloadFail = isloadFail ? true : false;
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;
                    let _prefab = asset ? asset : new prefab(filename);
                    _prefab.assetbundle = bundlename;
                    // _prefab.Parse(txt, assetMgr);
                    // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
                    _prefab.cParse(json, assetMgr);
                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url.replace("cprefab","prefab"));
                });


                // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
            },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: prefab, call: (handle: () => void) => void)
        {
            call(() =>
            {

                let bundlename = getFileName(state.url);
                let filename = getFileName(url);
                let oldName = filename;
                filename = filename.replace("cprefab","prefab");
                state.resstate[filename] = new ResourceState();
                if (state.resstateFirst == null)
                {
                    state.resstateFirst = state.resstate[filename];
                }
                let txt = respack[oldName];
                let _prefab = asset ? asset : new prefab(filename);
                _prefab.assetbundle = bundlename;

                return io.JSONParse(txt).then((json) =>
                {
                    _prefab.cParse(json, assetMgr);
                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url.replace("cprefab","prefab"));
                });
                // await _prefab.Parse(txt, assetMgr);
                // AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);

            });
        }
    }
}