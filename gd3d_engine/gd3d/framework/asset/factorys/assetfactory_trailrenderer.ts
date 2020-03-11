namespace gd3d.framework
{
    @assetF(AssetTypeEnum.TrailRenderer)
    export class AssetFactory_TrailRenderer implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string)
        {

            var data = TrailRendererData.get(name);

            data.setData(txt);

            return data;
        }
    }
}