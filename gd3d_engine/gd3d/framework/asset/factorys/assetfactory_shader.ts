namespace gd3d.framework
{
    export class AssetFactory_Shader implements IAssetFactory
    {
        newAsset(): IAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: IAsset)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
                gd3d.io.loadText(url, (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _shader = new shader(filename);
                    _shader.parse(assetMgr, JSON.parse(txt));

                    assetMgr.setAssetUrl(_shader, url);
                    assetMgr.mapShader[filename] = _shader;
                    state.resstate[filename].state = 1;//完成
                    onstate(state);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                });
        }
    }
}