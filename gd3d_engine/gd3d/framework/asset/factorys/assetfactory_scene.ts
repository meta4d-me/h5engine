namespace gd3d.framework
{
    export class AssetFactory_Scene implements IAssetFactory
    {
        newAsset(): rawscene
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: rawscene)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _scene = new rawscene(filename);
                    _scene.assetbundle = bundlename;
                    _scene.Parse(txt, assetMgr);

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _scene, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: rawscene)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            let txt = assetMgr.bundlePackJson[filename];
            var _scene = new rawscene(filename);
            _scene.assetbundle = bundlename;
            _scene.Parse(txt, assetMgr);

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _scene, url);
        }
    }
}