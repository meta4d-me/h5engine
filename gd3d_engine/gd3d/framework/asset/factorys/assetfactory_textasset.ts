namespace gd3d.framework
{
    export class AssetFactory_TextAsset implements IAssetFactory
    {
        newAsset(): textasset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: textasset)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    let _textasset = asset ? asset : new textasset(filename);
                    _textasset.content = txt;

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _textasset, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: textasset)
        {
            let filename = getFileName(url);
            state.resstate[filename] = new ResourceState();
            let txt = respack[filename];
            let _textasset = asset ? asset : new textasset(filename);
            _textasset.content = txt;

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _textasset, url);
        }
    }
}