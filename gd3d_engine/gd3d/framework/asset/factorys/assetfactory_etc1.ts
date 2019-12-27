namespace gd3d.framework
{
    @assetF(AssetTypeEnum.KTX)
    export class AssetFactory_ETC1 implements IAssetFactory
    {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number)
        {
            let _texture = new texture(name);
            let imgGuid = dwguid || bundle.texs[name];
            let texName = name.split(".")[0];
            let texDescName = `${texName}.imgdesc.json`;
            let hasImgdesc = bundle && bundle.files[texDescName] != null;
            let guidList: number[] = [imgGuid];
            if (hasImgdesc)
            {
                guidList.push(bundle.files[texDescName]);
            }

            let len = guidList.length;
            for (let i = 0; i < len; i++)
            {
                //如找到已近加载过的资源，不再重复构建
                let _guid = guidList[i];
                let assRef = assetMgr.mapGuid[_guid]
                if (assRef)
                {
                    _texture = assRef.asset as texture;
                    if (_texture && _texture instanceof texture)
                    {
                        let loading = assetMgr.mapLoading[imgGuid];
                        if (loading)
                        {
                            delete loading.data;
                        }
                        return _texture;
                    }
                }
            }

            // let texName = name.split(".")[0];
            // let texDesc = `${texName}.imgdesc.json`;
            if (!hasImgdesc)
            {
                _texture.glTexture = KTXParse.parse(assetmgr.webgl, bytes);
                //清理 HTMLImageElement 的占用
                let loading = assetMgr.mapLoading[imgGuid];
                if (loading)
                {
                    delete loading.data;
                }
            }

            return _texture;
        }
    }
}