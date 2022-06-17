namespace m4m.framework
{
    @assetF(AssetTypeEnum.Aniclip)
    export class AssetFactory_Aniclip implements IAssetFactory
    {
        //#region 废弃de参考代码
        /*
        newAsset(): animationClip
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: animationClip, call: (handle: () => void) => void)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            if(state.resstateFirst==null)
            {
                state.resstateFirst=state.resstate[filename];
            }
            m4m.io.loadArrayBuffer(url,
                (_buffer, err, isloadFail) =>
                {

                    call(() =>
                    {
                        state.isloadFail = isloadFail ? true : false;
                        if (AssetFactoryTools.catchError(err, onstate, state))
                            return;
                        let time = Date.now();
                        let _clip = asset ? asset : new animationClip(filename);
                        // _clip.Parse(_buffer);

                        // AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
                        return _clip.Parse(_buffer).then(() =>
                        {
                            let calc = Date.now() - time;
                            console.log(`[animiclip]解析:${url}  耗时:${calc}/ms`);
                            AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
                        });
                    });

                },
                (loadedLength, totalLength) =>
                {
                    AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                })
        }

        loadByPack(respack, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: animationClip, call: (handle: () => void) => void)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            if(state.resstateFirst==null)
            {
                state.resstateFirst=state.resstate[filename];
            }
            let time = Date.now();
            let _buffer = respack[filename];
            let _clip = asset ? asset : new animationClip(filename);
            // _clip.Parse(_buffer);

            // AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
            call(() =>
            {
               return _clip.Parse(_buffer).then(() =>
                {
                    let calc = Date.now() - time;
                    console.log(`[animiclip]解析:${url}  耗时:${calc}/ms`);
                    AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
                });
            });
        }        
        */
        //#endregion

        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, bytes: ArrayBuffer)
        {            
            return new animationClip(filename).Parse(bytes);
        }

    }
}