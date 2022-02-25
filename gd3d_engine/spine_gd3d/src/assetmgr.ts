import { AssetManagerBase, Downloader, Texture, TextureFilter, TextureWrap } from "../node_modules/@esotericsoftware/spine-core/dist/index";

export class SpineAssetMgr extends AssetManagerBase {
    constructor(webgl: WebGLRenderingContext, pathPrefix: string = "", downloader: Downloader = null) {
        super((image: any) => new Gd3dTexture(image, webgl), pathPrefix, downloader
        );
    }
}


export class Gd3dTexture extends Texture {
    texture: gd3d.framework.texture;
    constructor(image: HTMLImageElement, webgl: WebGLRenderingContext) {
        super(image);
        const tex = new gd3d.framework.texture();
        var _textureFormat = gd3d.render.TextureFormatEnum.RGBA;
        var t2d = new gd3d.render.glTexture2D(webgl, _textureFormat);
        t2d.uploadImage(image, false, true, true, false);
        tex.glTexture = t2d;
        this.texture = tex;
    }
    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void {
        throw new Error("Method not implemented.");
    }
    setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void {
        throw new Error("Method not implemented.");
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }
}