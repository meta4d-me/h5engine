namespace gd3d.framework
{
    export class AssetFactory_Prefab implements IAssetFactory
    {
        newAsset(): prefab
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: prefab)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url, (txt, err) =>
            {
                if (AssetFactoryTools.catchError(err, onstate, state))
                    return;

                var _prefab = new prefab(filename);
                _prefab.assetbundle = bundlename;
                _prefab.Parse(txt, assetMgr);

                AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
            },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: prefab)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);
            
            state.resstate[filename] = new ResourceState();
            let txt = assetMgr.bundlePackJson[filename];
            var _prefab = new prefab(filename);
            _prefab.assetbundle = bundlename;
            _prefab.Parse(txt, assetMgr);

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _prefab, url);
        }
    }
}