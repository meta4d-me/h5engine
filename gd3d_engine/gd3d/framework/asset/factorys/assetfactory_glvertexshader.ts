namespace gd3d.framework
{
    export class AssetFactory_GLVertexShader implements IAssetFactory
    {
        newAsset(): IAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: IAsset)
        {
            let filename = getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    state.resstate[filename].state = 1;//完成

                    state.logs.push("load a glshader:" + filename);
                    assetMgr.shaderPool.compileVS(assetMgr.webgl, name, txt);
                    onstate(state);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                });
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: IAsset)
        {
            let filename = getFileName(url);
            let name = filename.substring(0, filename.indexOf("."));

            state.resstate[filename] = new ResourceState();
            let txt = respack[filename];
            txt = decodeURI(txt);
            state.resstate[filename].state = 1;//完成

            state.logs.push("load a glshader:" + filename);
            assetMgr.shaderPool.compileVS(assetMgr.webgl, name, txt);
            onstate(state);
        }
    }
}