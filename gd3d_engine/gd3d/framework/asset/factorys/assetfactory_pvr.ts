namespace gd3d.framework
{
    export class AssetFactory_PVR implements IAssetFactory
    {
        newAsset(): texture
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: texture)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadArrayBuffer(url,
                (_buffer, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _texture = new texture(filename);
                    let pvr: PvrParse = new PvrParse(assetMgr.webgl);
                    _texture.glTexture = pvr.parse(_buffer);

                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                });
        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: texture)
        {

        }
    }
}