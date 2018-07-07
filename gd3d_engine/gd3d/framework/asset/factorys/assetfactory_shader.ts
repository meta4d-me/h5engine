namespace gd3d.framework
{
    export class AssetFactory_Shader implements IAssetFactory
    {
        newAsset(): shader
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: shader)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err , isloadFail) =>
                {
                    state.isloadFail = isloadFail ? true : false;
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _shader = new shader(filename);
                    try {
                        _shader.parse(assetMgr, JSON.parse(txt));
                    }
                    catch (e) {
                        console.error("error  filename :" + filename);
                        throw new Error("shader on parse");
                    }

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

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: shader)
        {
            let filename = getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));

            state.resstate[filename] = new ResourceState();
            let txt = respack[filename];
            state.resstate[filename].state = 1;//完成
            var _shader = new shader(filename);
            try {
                    _shader.parse(assetMgr, JSON.parse(txt));
                }
                catch (e) {
                    console.error("error  filename :" + filename);
                    throw new Error("shader on parse");
                }

            assetMgr.setAssetUrl(_shader, url);
            assetMgr.mapShader[filename] = _shader;
            onstate(state);
        }
    }
}