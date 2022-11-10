namespace m4m.framework
{
    @assetF(AssetTypeEnum.BIN)
    export class AssetFactory_BIN implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer)
        {
            return new bin(name, bytes);
        }
    }
}