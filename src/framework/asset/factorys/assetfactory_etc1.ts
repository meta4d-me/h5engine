namespace m4m.framework
{
    @assetF(AssetTypeEnum.KTX)
    export class AssetFactory_ETC1 implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number)
        {
            let _texture = new texture(name);
            _texture.glTexture = KTXParse.parse(assetmgr.webgl, bytes);
            return _texture;
        }
    }
}