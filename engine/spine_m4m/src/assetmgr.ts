import { AssetManagerBase, Downloader, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";
import { setting } from "./setting";

export const defSpineShaderName = "shader/spine"

export class SpineAssetMgr extends AssetManagerBase {
    private _assetMgr: m4m.framework.assetMgr;
    private _defDrawPass: m4m.render.glDrawPass;
    constructor(assetMgr: m4m.framework.assetMgr, pathPrefix: string = "", downloader: Downloader = null) {
        super((image: any) => new m4mTexture(image, assetMgr.webgl), pathPrefix, downloader);
        this._assetMgr = assetMgr;

        this.initShader();
    }

    private initShader() {
        let vscodeUI: string = `
        attribute vec4 _glesVertex;    
        attribute vec4 _glesColor;
        attribute vec4 _glesColorEx;                   
        attribute vec4 _glesMultiTexCoord0;          
        uniform highp mat4 glstate_matrix_model;
        varying lowp vec4 v_light;  
        varying lowp vec4 v_dark;               
        varying highp vec2 xlv_TEXCOORD0;            
        void main()                                      
        {                                                
            highp vec4 tmpvar_1;                         
            tmpvar_1.w = 1.0;                            
            tmpvar_1.xyz = _glesVertex.xyz;              
            v_light = _glesColor;
            v_dark = _glesColorEx;                    
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,_glesMultiTexCoord0.y);      
            gl_Position = glstate_matrix_model* tmpvar_1;   
        }
        `;
        let fscodeUI: string = `
        uniform sampler2D _MainTex;
        uniform highp vec4 MainColor;
        varying lowp vec4 v_light;
        varying lowp vec4 v_dark;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 texColor = texture2D(_MainTex, xlv_TEXCOORD0);
            gl_FragColor.a = MainColor.a*texColor.a * v_light.a;
            gl_FragColor.rgb =MainColor.rgb*(((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb);
        }`;
        let pool = this._assetMgr.shaderPool;
        pool.compileVS(this._assetMgr.webgl, "spine", vscodeUI);
        pool.compileFS(this._assetMgr.webgl, "spine", fscodeUI);
        let program = pool.linkProgram(this._assetMgr.webgl, "spine", "spine");
        var spineShader = new m4m.framework.shader(defSpineShaderName);
        spineShader.passes["base"] = [];
        var p = new m4m.render.glDrawPass();
        p.setProgram(program);
        spineShader.passes["base"].push(p);
        spineShader.fillUnDefUniform(p);
        p.state_ztest = false;
        p.state_zwrite = false;
        p.state_showface = m4m.render.ShowFaceStateEnum.ALL;

        this._assetMgr.mapShader[spineShader.getName()] = spineShader;
    }
}


export class m4mTexture extends Texture {
    private _texture: m4m.framework.texture;
    private _needUpdate: boolean = true;
    readonly width: number;
    readonly height: number;
    get texture(): m4m.framework.texture {
        if (this._needUpdate) {
            this._needUpdate = false;
            this._webgl.bindTexture(this._webgl.TEXTURE_2D, this._texture.glTexture.texture);
            this._webgl.pixelStorei(this._webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, setting.premultipliedAlpha ? 1 : 0);
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
        this.width = image.width;
        this.height = image.height;
        this._webgl = webgl;
        const tex = new m4m.framework.texture();
        var _textureFormat = m4m.render.TextureFormatEnum.RGBA;
        tex.glTexture = new m4m.render.glTexture2D(webgl, _textureFormat);
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