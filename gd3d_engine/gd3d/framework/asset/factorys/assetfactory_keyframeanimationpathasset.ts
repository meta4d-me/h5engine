namespace gd3d.framework
{
    export class AssetFactory_KeyframeAnimationPathAsset implements IAssetFactory
    {

        newAsset():keyframeAnimationPathAsset
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: keyframeAnimationPathAsset)
        {
            let filename=getFileName(url);
            state.resstate[filename]=new ResourceState();

            gd3d.io.loadText(url,
                (txt,err)=>
                {
                    if(AssetFactoryTools.catchError(err,onstate,state))
                         return;

                    let _keyframepath=asset?asset:new keyframeAnimationPathAsset(filename);
                    _keyframepath.Parse(JSON.parse(txt));//这个方法，需要自己来实现

                    AssetFactoryTools.useAsset(assetMgr,onstate,state,_keyframepath,url);              
                },
                (loadedLength, totalLength)=>
                {
                    AssetFactoryTools.onProgress(loadedLength,totalLength,onstate,state,filename);
                })            
        }

        loadByPack(respack:any, url: string, onstate: (state: stateLoad) => void, state: stateLoad,assetMgr: assetMgr, asset?: keyframeAnimationPathAsset)
        {
            let filename=getFileName(url);

            state.resstate[filename]=new ResourceState();
            let txt=respack[filename];
            let _keyframepath=asset?asset:new keyframeAnimationPathAsset(filename);
            _keyframepath.Parse(JSON.parse(txt));

            AssetFactoryTools.useAsset(assetMgr,onstate,state,_keyframepath,url);
        }
    }
}