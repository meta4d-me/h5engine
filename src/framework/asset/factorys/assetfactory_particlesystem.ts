namespace m4m.framework {
    @assetF(AssetTypeEnum.ParticleSystem)
    export class AssetFactory_ParticleSystem implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string) {
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