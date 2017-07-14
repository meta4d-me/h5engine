namespace gd3d.framework
{
    export class AssetFactory_Material implements IAssetFactory
    {
        newAsset(filename?:string): IAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: material)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
                gd3d.io.loadText(url, (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _material = new material(filename);
                    _material.Parse(assetMgr, JSON.parse(txt));

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _material, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }
    }
}