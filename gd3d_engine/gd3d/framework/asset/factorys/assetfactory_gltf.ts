namespace gd3d.framework
{
    @assetF(AssetTypeEnum.GLTF)
    export class AssetFactory_GLTF implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            return new gd3d.framework.gltf(filename, JSON.parse(txt));
        }
    }
}