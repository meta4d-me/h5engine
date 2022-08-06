
declare var WebGLTextureUtil;
namespace m4m.framework {
    @assetF(AssetTypeEnum.DDS)
    export class AssetFactory_DDS implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer) {
            let _texture = new texture(name);
            _texture.glTexture = S3TCParse.parse(assetmgr.webgl, bytes);
            return _texture;
        }
    }
}