namespace gd3d.framework
{
    export class AssetFactory_PathAsset implements IAssetFactory
    {
        newAsset(): pathasset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: pathasset)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _path = new pathasset(filename);
                    _path.Parse(JSON.parse(txt));

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _path, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })

        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: pathasset)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            let txt = assetMgr.bundlePackJson[filename];
            var _path = new pathasset(filename);
            _path.Parse(JSON.parse(txt));

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _path, url);
        }
    }
}