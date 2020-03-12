namespace gd3d.framework
{
    @assetF(AssetTypeEnum.LineRenderer)
    export class AssetFactory_LineRenderer implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string)
        {

            var data = LineRendererData.get(name);

            data.setData(txt);

            return data;
        }
    }
}