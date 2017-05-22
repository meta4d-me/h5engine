namespace gd3d.framework
{
    export class defShader
    {
        static vscode: string = "\
    attribute vec4 _glesVertex;   \
    attribute vec4 _glesColor;                  \
    attribute vec4 _glesMultiTexCoord0;         \
    uniform highp mat4 glstate_matrix_mvp;      \
    varying lowp vec4 xlv_COLOR;                \
    varying highp vec2 xlv_TEXCOORD0;           \
    void main()                                     \
    {                                               \
        highp vec4 tmpvar_1;                        \
        tmpvar_1.w = 1.0;                           \
        tmpvar_1.xyz = _glesVertex.xyz;             \
        xlv_COLOR = _glesColor;                     \
        xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;     \
        gl_Position = (glstate_matrix_mvp * tmpvar_1);  \
    }";

        static fscode: string = "         \
    uniform sampler2D _MainTex;                                                 \
    varying lowp vec4 xlv_COLOR;                                                 \
    varying highp vec2 xlv_TEXCOORD0;   \
    void main() \
    {\
        lowp vec4 col_1;    \
        mediump vec4 prev_2;\
        lowp vec4 tmpvar_3;\
        tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\
        prev_2 = tmpvar_3;\
        mediump vec4 tmpvar_4;\
        tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);\
        col_1 = tmpvar_4;\
        col_1.x =xlv_TEXCOORD0.x;\
        col_1.y =xlv_TEXCOORD0.y;\
        gl_FragData[0] = col_1;\
    }\
    ";
        static fscode2: string = "         \
    void main() \
    {\
        gl_FragData[0] = vec4(1.0, 1.0, 1.0, 1.0);\
    }\
    ";
        static fscodeui: string = "         \
    uniform sampler2D _MainTex;                                                 \
    varying lowp vec4 xlv_COLOR;                                                 \
    varying highp vec2 xlv_TEXCOORD0;   \
    void main() \
    {\
        lowp vec4 tmpvar_3;\
        tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\
        gl_FragData[0] = tmpvar_3;\
    }\
    ";
        static vscodeuifont: string = "\
    attribute vec4 _glesVertex;   \
    attribute vec4 _glesColor;                  \
    attribute vec4 _glesColorEx;                  \
    attribute vec4 _glesMultiTexCoord0;         \
    uniform highp mat4 glstate_matrix_mvp;      \
    varying lowp vec4 xlv_COLOR;                \
    varying lowp vec4 xlv_COLOREx;                                                 \
    varying highp vec2 xlv_TEXCOORD0;           \
    void main()                                     \
    {                                               \
        highp vec4 tmpvar_1;                        \
        tmpvar_1.w = 1.0;                           \
        tmpvar_1.xyz = _glesVertex.xyz;             \
        xlv_COLOR = _glesColor;                     \
        xlv_COLOREx = _glesColorEx;                     \
        xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;     \
        gl_Position = (glstate_matrix_mvp * tmpvar_1);  \
    }";
        static fscodeuifont: string = "\
precision mediump float;//鎸囧畾娴偣鍨嬬簿纭害 \n\
uniform sampler2D _MainTex; \n\
varying lowp vec4 xlv_COLOR;\n\
varying lowp vec4 xlv_COLOREx;\n\
varying highp vec2 xlv_TEXCOORD0;   \n\
void main() \n\
{\n\
float scale = 10.0;//  \n\
float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5)*scale;  //0.5\n\
float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34)*scale;  //0.34\n\
\n\
float c=xlv_COLOR.a * clamp ( d,0.0,1.0); \n\
float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0); \n\
bc =min(1.0-c,bc);\n\
\n\
\n\
\n\
gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc;\n\
}";
        static vsdiffuse: string = "\
    attribute vec4 _glesVertex;\
    attribute vec4 _glesMultiTexCoord0;\
    uniform highp mat4 glstate_matrix_mvp;\
    varying highp vec2 xlv_TEXCOORD0;\
    void main()\
    {\
        highp vec4 tmpvar_1;\
        tmpvar_1.w = 1.0;\
        tmpvar_1.xyz = _glesVertex.xyz;\
        xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;\
        gl_Position = (glstate_matrix_mvp * tmpvar_1);\
    }";

    static fsdiffuse:string="\
    uniform sampler2D _MainTex;\
uniform lowp float _AlphaCut;\
varying highp vec2 xlv_TEXCOORD0;\
void main() \
{\
    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);\
    if(tmpvar_3.a < _AlphaCut)\
        discard;\
    gl_FragData[0] = tmpvar_3;\
}";

        static initDefaultShader(assetmgr: assetMgr)
        {
            var pool = assetmgr.shaderPool;
            //鍙戠幇鏄簳灞備竴涓紩鐢ㄤ贡浜嗭紝鍘熺粨鏋勬病闂
            pool.compileVS(assetmgr.webgl, "def", defShader.vscode);
            pool.compileFS(assetmgr.webgl, "def", defShader.fscode);
            pool.compileFS(assetmgr.webgl, "def2", defShader.fscode2);
            pool.compileFS(assetmgr.webgl, "defui", defShader.fscodeui);
            pool.compileVS(assetmgr.webgl, "defuifont", defShader.vscodeuifont);
            pool.compileFS(assetmgr.webgl, "defuifont", defShader.fscodeuifont);
            pool.compileVS(assetmgr.webgl,"diffuse",defShader.vsdiffuse);
            pool.compileFS(assetmgr.webgl,"diffuse",defShader.fsdiffuse);
            var program = pool.linkProgram(assetmgr.webgl, "def", "def");
            var program2 = pool.linkProgram(assetmgr.webgl, "def", "defui");
            var programuifont = pool.linkProgram(assetmgr.webgl, "defuifont", "defuifont");
            var programdiffuse=pool.linkProgram(assetmgr.webgl,"diffuse","diffuse");
            {
                var sh = new shader("shader/def");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.state_ztest = true;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = render.ShowFaceStateEnum.CCW;
                p.setProgram(program);
                p.setAlphaBlend(render.BlendModeEnum.Close);
                p.uniformTexture("_MainTex", null);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/def3dbeforeui");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.state_ztest = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.state_zwrite = false;
                p.state_showface = render.ShowFaceStateEnum.CCW;
                p.setProgram(programdiffuse);
                p.setAlphaBlend(render.BlendModeEnum.Close);
                p.uniformTexture("_MainTex", null);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/def2");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.setProgram(program2);
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.state_ztest = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.setAlphaBlend(render.BlendModeEnum.Close);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/defui");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.setProgram(program2);
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.setAlphaBlend(render.BlendModeEnum.Blend_PreMultiply);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/defuifont");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.setProgram(programuifont);
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.setAlphaBlend(render.BlendModeEnum.Blend_PreMultiply);
                assetmgr.mapShader[sh.getName()] = sh;
            }
        }
    }

}