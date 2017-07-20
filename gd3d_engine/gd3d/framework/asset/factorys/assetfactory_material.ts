namespace gd3d.framework
{
    export class AssetFactory_Material implements IAssetFactory
    {
        newAsset(filename?: string): material
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: material)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    let _material = asset ? asset : new material(filename);
                    _material.Parse(assetMgr, JSON.parse(txt));

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _material, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: material)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            let txt = respack[filename];
            let _material = asset ? asset : new material(filename);
            _material.Parse(assetMgr, JSON.parse(txt));

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _material, url);
        }
    }
}