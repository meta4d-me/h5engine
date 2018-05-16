namespace gd3d.framework
{
    export class assetfactory_keyFrameAniClip implements IAssetFactory
    {
        newAsset(): keyFrameAniClip
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: keyFrameAniClip)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (text, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;
                    let _clip = asset ? asset : new keyFrameAniClip(filename);
                    _clip.Parse(text);

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack, url: string, onstate: (state: stateLoad) => void, state: stateLoad,assetMgr: assetMgr,asset?: keyFrameAniClip)
        {
            let filename = getFileName(url);

                state.resstate[filename] = new ResourceState();
                let _buffer = respack[filename];
                let _clip = asset ? asset : new keyFrameAniClip(filename);
                _clip.Parse(_buffer);

                AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
        }
    }
}