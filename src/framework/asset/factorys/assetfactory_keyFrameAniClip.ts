namespace m4m.framework
{
    @assetF(AssetTypeEnum.KeyFrameAniclip)
    export class assetfactory_keyFrameAniClip implements IAssetFactory
    {

        //#region 废弃de参考代码
        // newAsset(): keyFrameAniClip
        // {
        //     return null;
        // }

        // load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: keyFrameAniClip, call: (handle: () => void) => void)
        // {
        //     let filename = getFileName(url);

        //     state.resstate[filename] = new ResourceState();
        //     if (state.resstateFirst == null)
        //     {
        //         state.resstateFirst = state.resstate[filename];
        //     }
        //     m4m.io.loadText(url,
        //         (text, err, isloadFail) =>
        //         {
        //             call(() =>
        //             {
        //                 state.isloadFail = isloadFail ? true : false;
        //                 if (AssetFactoryTools.catchError(err, onstate, state))
        //                     return;
        //                 let time = Date.now();
        //                 let _clip = asset ? asset : new keyFrameAniClip(filename);
        //                 _clip.Parse(text);
        //                 let calc = Date.now() - time;
        //                 console.log(`[序列帧动画]解析:${url}  耗时:${calc}/ms`);
        //                 AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
        //             });
        //         },
        //         (loadedLength, totalLength) =>
        //         {
        //             AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
        //         })
        // }

        // loadByPack(respack, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: keyFrameAniClip, call: (handle: () => void) => void)
        // {
        //     call(() =>
        //     {
        //         let filename = getFileName(url);

        //         state.resstate[filename] = new ResourceState();
        //         if (state.resstateFirst == null)
        //         {
        //             state.resstateFirst = state.resstate[filename];
        //         }
        //         let time = Date.now();
        //         let _buffer = respack[filename];
        //         let _clip = asset ? asset : new keyFrameAniClip(filename);
        //         _clip.Parse(_buffer);
        //         let calc = Date.now() - time;
        //         console.log(`[序列帧动画]解析:${url}  耗时:${calc}/ms`);
        //         AssetFactoryTools.useAsset(assetMgr, onstate, state, _clip, url);
        //     });
        // }
        //#endregion
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string)
        {
            return new keyFrameAniClip(filename).Parse(txt);
        }
    }
}