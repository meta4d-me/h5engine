namespace gd3d.framework
{
    export class AssetFactory_TextAsset implements IAssetFactory
    {
        newAsset(): IAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: prefab)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
                gd3d.io.loadText(url, (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _textasset = new textasset(filename);
                    _textasset.content = txt;

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _textasset, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })

        }
    }
}