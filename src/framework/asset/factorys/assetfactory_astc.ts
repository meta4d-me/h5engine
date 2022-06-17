namespace m4m.framework
{
    @assetF(AssetTypeEnum.ASTC)
    export class AssetFactory_ASTC implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number)
        {
            let _texture = new texture(name);
            _texture.glTexture = ASTCParse.parse(assetmgr.webgl, bytes);
            return _texture;
        }
    }
}