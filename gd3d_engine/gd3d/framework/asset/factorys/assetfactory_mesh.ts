namespace gd3d.framework
{
    export class AssetFactory_Mesh implements IAssetFactory
    {
        newAsset(): mesh
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: mesh, call: (handle: () => void) => void)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            if (state.resstateFirst == null)
            {
                state.resstateFirst = state.resstate[filename];
            }

            // if (url.lastIndexOf(".bin") != -1)
            // {
            //     gd3d.io.loadArrayBuffer(url,
            //         (_buffer, err, isloadFail) =>
            //         {

            //             call(() =>
            //             {
            //                 state.isloadFail = isloadFail ? true : false;
            //                 if (AssetFactoryTools.catchError(err, onstate, state))
            //                     return;
            //                 let _mesh = asset ? asset : new mesh(filename);

            //                 let time = Date.now();
            //                 return _mesh.Parse(_buffer, assetMgr.webgl).then(() =>
            //                 {
            //                     let calc = Date.now() - time;
            //                     console.log(`[bin]加载:${url}  耗时:${calc}/ms`);
            //                     AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
            //                 });
            //             });
            //         },
            //         (loadedLength, totalLength) =>
            //         {
            //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
            //         })
            // } else if (url.lastIndexOf(".json") != -1)
            {
                gd3d.io.loadJSON(url, (_buffer, err, isloadFail) =>
                {
                    call(() =>
                    {
                        state.isloadFail = isloadFail ? true : false;
                        if (AssetFactoryTools.catchError(err, onstate, state))
                            return;
                        let _mesh = asset ? asset : new mesh(filename);

                        // let time = Date.now();
                        // return _mesh.Parse(_buffer, assetMgr.webgl).then(() =>
                        // {                            
                        //     AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
                        // });
                        _mesh.Parse(_buffer, assetMgr.webgl);
                        AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
                        // let calc = Date.now() - time;
                        // console.log(`[json]加载:${url}  耗时:${calc}/ms`);
                    });
                }, (loadedLength, totalLength) =>
                    {
                        AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                    });
            }
        }

        loadByPack(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: mesh, call: (handle: () => void) => void)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            if (state.resstateFirst == null)
            {
                state.resstateFirst = state.resstate[filename];
            }
            let _buffer = respack[filename];
            let _mesh = asset ? asset : new mesh(filename);
           
            call(() =>
            {
                // return _mesh.Parse(_buffer, assetMgr.webgl).then(() =>
                // {

                //     AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);

                // });
                _mesh.Parse(_buffer, assetMgr.webgl);
                AssetFactoryTools.useAsset(assetMgr, onstate, state, _mesh, url);
            });
        }
    }
}