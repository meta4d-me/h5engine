namespace m4m.framework
{
    @assetF(AssetTypeEnum.GLTF)
    export class AssetFactory_GLTF implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            return new m4m.framework.gltf(filename, JSON.parse(txt));
        }
    }
}