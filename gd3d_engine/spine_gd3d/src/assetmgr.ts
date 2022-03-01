import { AssetManagerBase, Downloader, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";

export class SpineAssetMgr extends AssetManagerBase {
    constructor(webgl: WebGLRenderingContext, pathPrefix: string = "", downloader: Downloader = null) {
        super((image: any) => new Gd3dTexture(image, webgl), pathPrefix, downloader
        );
    }
}


export class Gd3dTexture extends Texture {
    private _texture: gd3d.framework.texture;
    private _needUpdate: boolean = true;
    get texture(): gd3d.framework.texture {
        if (this._needUpdate) {
            this._webgl.bindTexture(this._webgl.TEXTURE_2D, this._texture);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MAG_FILTER, this._magFilter ?? this._webgl.LINEAR);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MIN_FILTER, this._minFilter ?? this._webgl.LINEAR);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_S, this._uWrap ?? this._webgl.CLAMP_TO_EDGE);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_T, this._vWrap ?? this._webgl.CLAMP_TO_EDGE);
        }
        return this._texture;
    }
    private _uWrap: TextureWrap;
    private _vWrap: TextureWrap;
    private _magFilter: TextureFilter;
    private _minFilter: TextureFilter;
    private _webgl: WebGLRenderingContext;
    constructor(image: HTMLImageElement, webgl: WebGLRenderingContext) {
        super(image);
        this._webgl = webgl;
        const tex = new gd3d.framework.texture();
        var _textureFormat = gd3d.render.TextureFormatEnum.RGBA;
        var t2d = new gd3d.render.glTexture2D(webgl, _textureFormat);

        t2d.uploadImage(image, false, true, true, false);
        tex.glTexture = t2d;
        this._texture = tex;
    }
    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void {
        this._minFilter = minFilter;
        this._magFilter = magFilter;
    }
    setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void {
        this._uWrap = uWrap;
        this._vWrap = vWrap;
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }
}