namespace m4m.framework {
    @assetF(AssetTypeEnum.ParticleSystem)
    export class AssetFactory_ParticleSystem implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string) {
            if (txt.indexOf(`gd3d.`) != -1) { txt = txt.replaceAll(`gd3d.`, `m4m.`); }     //xx的工具特效导出资源被植入了 code域名信息，暂时这样处理。
            var data = ParticleSystemData.get(name);

            if (!data) {
                data = new ParticleSystemData();
                data.value = name;
            }
            data.setData(txt);

            return data;
        }
    }
}