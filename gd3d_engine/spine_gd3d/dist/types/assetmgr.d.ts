import { AssetManagerBase, Downloader, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";
export declare const defSpineShaderName = "shader/spine";
export declare class SpineAssetMgr extends AssetManagerBase {
    private _assetMgr;
    private _defDrawPass;
    constructor(assetMgr: gd3d.framework.assetMgr, pathPrefix?: string, downloader?: Downloader);
    private initShader;
}
export declare class Gd3dTexture extends Texture {
    private _texture;
    private _needUpdate;
    get texture(): gd3d.framework.texture;
    private _uWrap;
    private _vWrap;
    private _magFilter;
    private _minFilter;
    private _webgl;
    constructor(image: HTMLImageElement, webgl: WebGLRenderingContext);
    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
    setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
    dispose(): void;
}
