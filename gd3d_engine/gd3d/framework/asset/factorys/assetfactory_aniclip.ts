namespace gd3d.framework
{
    export class AssetFactory_Aniclip implements IAssetFactory
    {
        newAsset(): animationClip
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: animationClip)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadArrayBuffer(url,
                (_buffer, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _clip = new animationClip(filename);
                    _clip.Parse(_buffer);

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad,assetMgr: assetMgr,asset?: animationClip)
        {
            let filename = getFileName(url);

                state.resstate[filename] = new ResourceState();
                let _buffer = assetMgr.bundlePackBin[filename];
                var _clip = new animationClip(filename);
                _clip.Parse(_buffer);

                AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
        }
    }
}