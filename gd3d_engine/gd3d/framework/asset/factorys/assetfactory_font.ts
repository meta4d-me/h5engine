namespace gd3d.framework
{
    export class AssetFactory_Font implements IAssetFactory
    {
        newAsset(filename?:string): IAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: font)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
                gd3d.io.loadText(url, (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _font = new font(filename);
                    _font.Parse(txt, assetMgr);

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _font, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }
    }
}