import { AssetManagerBase, Downloader, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";
import { spineSkeleton } from ".";

export const defSpineShaderName = "shader/spine"

export class SpineAssetMgr extends AssetManagerBase {
    private _assetMgr: gd3d.framework.assetMgr;
    private _defDrawPass: gd3d.render.glDrawPass;
    constructor(assetMgr: gd3d.framework.assetMgr, pathPrefix: string = "", downloader: Downloader = null) {
        super((image: any) => new Gd3dTexture(image, assetMgr.webgl), pathPrefix, downloader);
        this._assetMgr = assetMgr;

        this.initShader();
    }

    private initShader() {
        let vscodeUI: string = `
        attribute vec4 _glesVertex;    
        attribute vec4 _glesColor;                   
        attribute vec4 _glesMultiTexCoord0;          
        uniform highp mat4 _SpineMvp;
        uniform highp mat4 glstate_matrix_model;
        varying lowp vec4 xlv_COLOR;                 
        varying highp vec2 xlv_TEXCOORD0;            
        void main()                                      
        {                                                
            highp vec4 tmpvar_1;                         
            tmpvar_1.w = 1.0;                            
            tmpvar_1.xyz = _glesVertex.xyz;              
            xlv_COLOR = _glesColor;                      
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,_glesMultiTexCoord0.y);      
            gl_Position = (_SpineMvp*glstate_matrix_model* tmpvar_1);   
        }
        `;
        let fscodeUI: string = `
        uniform sampler2D _MainTex;
        varying lowp vec4 xlv_COLOR;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));
            if(tmpvar_3.a<0.5){
                discard;
            }
            gl_FragData[0] = tmpvar_3;
        }`;
        let pool = this._assetMgr.shaderPool;
        pool.compileVS(this._assetMgr.webgl, "spine", vscodeUI);
        pool.compileFS(this._assetMgr.webgl, "spine", fscodeUI);
        let program = pool.linkProgram(this._assetMgr.webgl, "spine", "spine");
        var spineShader = new gd3d.framework.shader(defSpineShaderName);
        spineShader.passes["base"] = [];
        var p = new gd3d.render.glDrawPass();
        p.setProgram(program);
        spineShader.passes["base"].push(p);
        spineShader.fillUnDefUniform(p);
        p.state_ztest = false;
        p.state_zwrite = false;
        p.state_showface = gd3d.render.ShowFaceStateEnum.CW;

        this._assetMgr.mapShader[spineShader.getName()] = spineShader;
    }
}


export class Gd3dTexture extends Texture {
    private _texture: gd3d.framework.texture;
    private _needUpdate: boolean = true;
    get texture(): gd3d.framework.texture {
        if (this._needUpdate) {
            this._needUpdate = false;
            this._webgl.bindTexture(this._webgl.TEXTURE_2D, this._texture.glTexture.texture);
            this._webgl.pixelStorei(this._webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, spineSkeleton.premultipliedAlpha ? 1 : 0);
            this._webgl.pixelStorei(this._webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this._webgl.texImage2D(this._webgl.TEXTURE_2D, 0, this._webgl.RGBA, this._webgl.RGBA, this._webgl.UNSIGNED_BYTE, this.getImage());
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
        tex.glTexture = new gd3d.render.glTexture2D(webgl, _textureFormat);
        this._texture = tex;
    }
    setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void {
        this._needUpdate = true;
        this._minFilter = minFilter;
        this._magFilter = magFilter;
    }
    setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void {
        this._needUpdate = true;
        this._uWrap = uWrap;
        this._vWrap = vWrap;
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }
}