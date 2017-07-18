namespace gd3d.framework
{
    export interface IAssetFactory
    {
        newAsset(assetName?: string): IAsset;
        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: IAsset): void;
        loadByPack(respack:any, url: string, onstate: (state: stateLoad) => void, state: stateLoad,assetMgr: assetMgr, asset?: IAsset):void;
    }

    export class AssetFactoryTools
    {
        static catchError(err: Error, onstate: (state: stateLoad) => void, state: stateLoad): boolean
        {
            if (err != null)
            {
                state.iserror = true;
                state.errs.push(new Error(err.message));
                onstate(state);
                return true;
            }
            return false;
        }

        static useAsset(assetMgr: assetMgr, onstate: (state: stateLoad) => void, state: stateLoad, asset: IAsset, url: string)
        {
            let fileName = getFileName(url);
            
            assetMgr.setAssetUrl(asset, url);
            assetMgr.use(asset);
            state.resstate[fileName].state = 1;
            state.resstate[fileName].res = asset;
            onstate(state);
        }

        static onProgress(loadedLength: number, totalLength: number, onstate: (state: stateLoad) => void, state: stateLoad,filename:string)
        {
            state.resstate[filename].loadedLength = loadedLength;
            // state.resstate[filename].totalLength = totalLength;
            state.progressCall = true;
            onstate(state);
        }
    }

    export function getFileName(url: string)
    {
        var filei = url.lastIndexOf("/");
        var file = url.substr(filei + 1);
        return file;
    }
}