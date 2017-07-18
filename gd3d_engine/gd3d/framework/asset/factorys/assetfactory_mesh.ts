namespace gd3d.framework
{
    export class AssetFactory_Mesh implements IAssetFactory
    {
        newAsset(): mesh
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: mesh)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadArrayBuffer(url,
                (_buffer, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    let _mesh = asset ? asset : new mesh(filename);
                    _mesh.Parse(_buffer, assetMgr.webgl);//在此方法中命名mesh的name（name存在bin文件中）

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: mesh)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            let _buffer = respack[filename];
            let _mesh = asset ? asset : new mesh(filename);
            _mesh.Parse(_buffer, assetMgr.webgl);

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
        }
    }
}