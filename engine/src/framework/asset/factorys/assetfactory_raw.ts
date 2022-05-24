namespace m4m.framework
{
    @assetF(AssetTypeEnum.RAW)
    export class AssetFactory_RAW implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number)
        {
            let _texture = new texture(name);
            _texture.glTexture = RAWParse.parse(assetmgr.webgl, bytes);
            return _texture;
        }
    }
}