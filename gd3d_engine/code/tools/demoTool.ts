/** demo 工具 */

class demoTool{
     static loadbySync(url:string,astMgr: gd3d.framework.assetMgr){
        return new gd3d.threading.gdPromise<any>((resolve,reject)=>{
            astMgr.load(url,gd3d.framework.AssetTypeEnum.Auto,(state)=>{
                if(state && state.isfinish){
                    resolve();
                }
            });
        });
    }
    
}


