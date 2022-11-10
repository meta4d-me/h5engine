import { AssetManagerBase, Texture } from "@esotericsoftware/spine-core";
import { spineSkeleton } from ".";
export const defSpineShaderName = "shader/spine";
export class SpineAssetMgr extends AssetManagerBase {
    constructor(assetMgr, pathPrefix = "", downloader = null) {
        super((image) => new Gd3dTexture(image, assetMgr.webgl), pathPrefix, downloader);
        this._assetMgr = assetMgr;
        this.initShader();
    }
    initShader() {
        let vscodeUI = `
        attribute vec4 _glesVertex;    
        attribute vec4 _glesColor;
        attribute vec4 _glesColorEx;                   
        attribute vec4 _glesMultiTexCoord0;          
        uniform highp mat4 _SpineMvp;
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
            gl_Position = (_SpineMvp*glstate_matrix_model* tmpvar_1);   
        }
        `;
        let fscodeUI = `
        uniform sampler2D _MainTex;
        varying lowp vec4 v_light;
        varying lowp vec4 v_dark;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 texColor = texture2D(_MainTex, xlv_TEXCOORD0);
            gl_FragColor.a = texColor.a * v_light.a;
            gl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;
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
    constructor(image, webgl) {
        super(image);
        this._needUpdate = true;
        this._webgl = webgl;
        const tex = new gd3d.framework.texture();
        var _textureFormat = gd3d.render.TextureFormatEnum.RGBA;
        tex.glTexture = new gd3d.render.glTexture2D(webgl, _textureFormat);
        this._texture = tex;
    }
    get texture() {
        var _a, _b, _c, _d;
        if (this._needUpdate) {
            this._needUpdate = false;
            this._webgl.bindTexture(this._webgl.TEXTURE_2D, this._texture.glTexture.texture);
            this._webgl.pixelStorei(this._webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, spineSkeleton.premultipliedAlpha ? 1 : 0);
            this._webgl.pixelStorei(this._webgl.UNPACK_FLIP_Y_WEBGL, 0);
            this._webgl.texImage2D(this._webgl.TEXTURE_2D, 0, this._webgl.RGBA, this._webgl.RGBA, this._webgl.UNSIGNED_BYTE, this.getImage());
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MAG_FILTER, (_a = this._magFilter) !== null && _a !== void 0 ? _a : this._webgl.LINEAR);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_MIN_FILTER, (_b = this._minFilter) !== null && _b !== void 0 ? _b : this._webgl.LINEAR);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_S, (_c = this._uWrap) !== null && _c !== void 0 ? _c : this._webgl.CLAMP_TO_EDGE);
            this._webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_T, (_d = this._vWrap) !== null && _d !== void 0 ? _d : this._webgl.CLAMP_TO_EDGE);
        }
        return this._texture;
    }
    setFilters(minFilter, magFilter) {
        this._needUpdate = true;
        this._minFilter = minFilter;
        this._magFilter = magFilter;
    }
    setWraps(uWrap, vWrap) {
        this._needUpdate = true;
        this._uWrap = uWrap;
        this._vWrap = vWrap;
    }
    dispose() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=assetmgr.js.map