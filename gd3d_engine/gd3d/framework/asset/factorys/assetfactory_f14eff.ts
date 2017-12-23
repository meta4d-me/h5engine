namespace gd3d.framework
{
    export class AssetFactory_f14eff implements IAssetFactory
    {
        newAsset(): f14eff
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: f14eff)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url, (txt, err) =>
            {
                if (AssetFactoryTools.catchError(err, onstate, state))
                    return;

                let _f14eff = asset ? asset : new f14eff(filename);
                _f14eff.assetbundle = bundlename;
                _f14eff.Parse(txt, assetMgr);

                AssetFactoryTools.useAsset(assetMgr, onstate, state, _f14eff, url);
            },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: f14eff)
        {
            let bundlename = getFileName(state.url);
            let filename = getFileName(url);
            
            state.resstate[filename] = new ResourceState();
            let txt = respack[filename];
            let _f14eff = asset ? asset : new f14eff(filename);
            _f14eff.assetbundle = bundlename;
            _f14eff.Parse(txt, assetMgr);

            AssetFactoryTools.useAsset(assetMgr, onstate, state, _f14eff, url);
        }
    }
}