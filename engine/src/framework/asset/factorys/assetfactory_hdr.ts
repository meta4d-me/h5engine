namespace m4m.framework
{
    @assetF(AssetTypeEnum.HDR)
    export class AssetFactory_HDR implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer)
        {
            let _texture = new texture(name);
            _texture.glTexture = new HdrParser(assetmgr.webgl).get2DTexture(bytes);
            return _texture;
        }
    }
}