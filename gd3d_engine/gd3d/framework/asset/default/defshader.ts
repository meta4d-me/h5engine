namespace gd3d.framework
{
    export class defShader
    {
        static shader0: string = "{\
            \"properties\": [\
              \"_MainTex('MainTex',Texture)='white'{}\"\
            ]\
          }";
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

        static vsUiMaskCode:string = "\
        attribute vec4 _glesVertex;   \
        attribute vec4 _glesColor;                  \
        attribute vec4 _glesMultiTexCoord0;         \
        uniform highp mat4 glstate_matrix_mvp;      \
        uniform lowp float MaskState;      \
        varying lowp vec4 xlv_COLOR;                \
        varying highp vec2 xlv_TEXCOORD0;           \
        varying highp vec2 mask_TEXCOORD;           \
        void main()                                     \
        {                                               \
            highp vec4 tmpvar_1;                        \
            tmpvar_1.w = 1.0;                           \
            tmpvar_1.xyz = _glesVertex.xyz;             \
            xlv_COLOR = _glesColor;                     \
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,1.0-_glesMultiTexCoord0.y);     \
            if(MaskState != 0.0){    \
                mask_TEXCOORD.x = (_glesVertex.x - 1.0)/-2.0;\
                mask_TEXCOORD.y = (_glesVertex.y - 1.0)/-2.0;\
            }\
            gl_Position = (glstate_matrix_mvp * tmpvar_1);  \
        }";

        static fscodeMaskUi:string = "         \
        uniform sampler2D _MainTex;                                                 \
        uniform highp vec4 _maskRect;                                                 \
        uniform lowp float MaskState;      \
        varying lowp vec4 xlv_COLOR;                                                 \
        varying highp vec2 xlv_TEXCOORD0;   \
        varying highp vec2 mask_TEXCOORD;           \
        bool CalcuCut(){   \
            highp float l;\
            highp float t;\
            highp float r;\
            highp float b;\
            highp vec2 texc1;\
            bool beCut;\
            l = _maskRect.x;\
            t = _maskRect.y;\
            r = _maskRect.z + l;\
            b = _maskRect.w + t;\
            texc1 = mask_TEXCOORD;\
            if(texc1.x >(1.0 - l) || texc1.x <(1.0 - r) || texc1.y <t || texc1.y>b){ \
                beCut = true; \
            }else{\
                beCut = false;\
            }\
            return beCut;\
        }\
           \
        void main() \
        {\
            if(MaskState != 0.0 && CalcuCut()) discard;\
            lowp vec4 tmpvar_3;\
            tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));\
            gl_FragData[0] = tmpvar_3 ;\
        }\
        ";

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

        static uishader: string = "{\
            \"properties\": [\
              \"_MainTex('MainTex',Texture)='white'{}\",\
              \"_MaskTex('MaskTex',Texture)='white'{}\"\
            ]\
            }";

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

        static shaderuifront: string = "{\
            \"properties\": [\
              \"_MainTex('MainTex',Texture)='white'{}\"\
            ]\
            }";

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
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,1.0-_glesMultiTexCoord0.y);     \
            gl_Position = (glstate_matrix_mvp * tmpvar_1);  \
        }";

        
        static fscodeuifont: string = "\
        precision mediump float ;\
        uniform sampler2D _MainTex;\
        varying lowp vec4 xlv_COLOR;\
        varying lowp vec4 xlv_COLOREx;\
        varying highp vec2 xlv_TEXCOORD0;    \
        void main()  \
        { \
            float scale = 10.0;   \
            float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5)*scale;   \
        float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34)*scale;   \
        \
        float c=xlv_COLOR.a * clamp ( d,0.0,1.0);  \
        float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);  \
        bc =min(1.0-c,bc); \
        \
        \
        \
        gl_FragData[0] =xlv_COLOR*c + xlv_COLOREx*bc; \
    }";
    
        static vscodeuifontmask: string = "\
        attribute vec4 _glesVertex;   \
        attribute vec4 _glesColor;                  \
        attribute vec4 _glesColorEx;                  \
        attribute vec4 _glesMultiTexCoord0;         \
        uniform highp mat4 glstate_matrix_mvp;      \
        uniform lowp float MaskState;      \
        varying lowp vec4 xlv_COLOR;                \
        varying lowp vec4 xlv_COLOREx;                                                 \
        varying highp vec2 xlv_TEXCOORD0;           \
        varying highp vec2 mask_TEXCOORD;           \
        void main()                                     \
        {                                               \
            highp vec4 tmpvar_1;                        \
            tmpvar_1.w = 1.0;                           \
            tmpvar_1.xyz = _glesVertex.xyz;             \
            xlv_COLOR = _glesColor;                     \
            xlv_COLOREx = _glesColorEx;                     \
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,1.0-_glesMultiTexCoord0.y);     \
            if(MaskState != 0.0){    \
                mask_TEXCOORD.x = (_glesVertex.x - 1.0)/-2.0;\
                mask_TEXCOORD.y = (_glesVertex.y - 1.0)/-2.0;\
            }\
            gl_Position = (glstate_matrix_mvp * tmpvar_1);  \
        }";

        static fscodeuifontmask:string = "\
        precision mediump float;\
            uniform sampler2D _MainTex;  \
            uniform lowp float MaskState;      \
            uniform highp vec4 _maskRect;       \
            varying lowp vec4 xlv_COLOR; \
            varying lowp vec4 xlv_COLOREx; \
            varying highp vec2 xlv_TEXCOORD0;    \
            varying highp vec2 mask_TEXCOORD;     \
            bool CalcuCut(){   \
                highp float l;\
                highp float t;\
                highp float r;\
                highp float b;\
                highp vec2 texc1;\
                bool beCut;\
                l = _maskRect.x;\
                t = _maskRect.y;\
                r = _maskRect.z + l;\
                b = _maskRect.w + t;\
                texc1 = mask_TEXCOORD;\
                if(texc1.x >(1.0 - l) || texc1.x <(1.0 - r) || texc1.y <t || texc1.y>b){ \
                    beCut = true; \
                }else{\
                    beCut = false;\
                }\
                return beCut;\
            }\
            \
            void main()  \
            { \
                if(MaskState != 0.0 && CalcuCut())  discard;\
            float scale = 10.0;   \
            float d = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.5)*scale;  \
            float bd = (texture2D(_MainTex, xlv_TEXCOORD0).r - 0.34)*scale;  \
            \
            float c=xlv_COLOR.a * clamp ( d,0.0,1.0);  \
            float bc=xlv_COLOREx.a * clamp ( bd,0.0,1.0);  \
            bc =min(1.0-c,bc); \
            lowp vec4 final =  xlv_COLOR*c + xlv_COLOREx*bc ;\
            gl_FragData[0] = final ;\
            }";


        static diffuseShader: string = "{\
            \"properties\": [\
              \"_MainTex('MainTex',Texture)='white'{}\",\
              \"_AlphaCut('AlphaCut',Range(0.0,1.0)) = 0.5\"\
            ]\
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

        static fsdiffuse: string = "\
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


        //editor
        static vsline: string = "\
        attribute vec4 _glesVertex;\
        attribute vec4 _glesColor;\
        uniform highp mat4 glstate_matrix_mvp;\
        varying lowp vec4 xlv_COLOR;\
        void main()\
        {\
            highp vec4 tmpvar_1;\
            tmpvar_1.w = 1.0;\
            tmpvar_1.xyz = _glesVertex.xyz;\
            xlv_COLOR = _glesColor;\
            gl_Position = (glstate_matrix_mvp * tmpvar_1);\
        }";

        static fsline: string = "\
        varying lowp vec4 xlv_COLOR;\
        void main()\
        {\
            gl_FragData[0] = xlv_COLOR;\
        }";


        static materialShader: string = "{\
            \"properties\": [\
              \"_Color('Color',Vector) = (1,1,1,1)\"\
            ]\
            }";
        static vsmaterialcolor: string = "\
        attribute vec4 _glesVertex;\
        uniform vec4 _Color;\
        uniform highp mat4 glstate_matrix_mvp;\
        varying lowp vec4 xlv_COLOR;\
        void main()\
        {\
            highp vec4 tmpvar_1;\
            tmpvar_1.w = 1.0;\
            tmpvar_1.xyz = _glesVertex.xyz;\
            xlv_COLOR = _Color;\
            gl_Position = (glstate_matrix_mvp * tmpvar_1);\
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

            pool.compileVS(assetmgr.webgl, "diffuse", defShader.vsdiffuse);
            pool.compileFS(assetmgr.webgl, "diffuse", defShader.fsdiffuse);

            pool.compileVS(assetmgr.webgl, "line", defShader.vsline);
            pool.compileFS(assetmgr.webgl, "line", defShader.fsline);

            pool.compileVS(assetmgr.webgl, "materialcolor", defShader.vsmaterialcolor);
            
            pool.compileVS(assetmgr.webgl, "defUIMaskVS", defShader.vsUiMaskCode);
            pool.compileFS(assetmgr.webgl, "defUIMaskFS", defShader.fscodeMaskUi);

            pool.compileVS(assetmgr.webgl, "defuifontMaskVS", defShader.vscodeuifontmask);
            pool.compileFS(assetmgr.webgl, "defuifontMaskFS", defShader.fscodeuifontmask);

            var program = pool.linkProgram(assetmgr.webgl, "def", "def");
            var program2 = pool.linkProgram(assetmgr.webgl, "def", "defui");
            var programuifont = pool.linkProgram(assetmgr.webgl, "defuifont", "defuifont");
            var programdiffuse = pool.linkProgram(assetmgr.webgl, "diffuse", "diffuse");
            var programline = pool.linkProgram(assetmgr.webgl, "line", "line");
            var programmaterialcolor = pool.linkProgram(assetmgr.webgl, "materialcolor", "line");
            var programMaskUI = pool.linkProgram(assetmgr.webgl,"defUIMaskVS","defUIMaskFS");
            var programMaskfont = pool.linkProgram(assetmgr.webgl,"defuifontMaskVS","defuifontMaskFS");
            {
                var sh = new shader("shader/def");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                sh._parseProperties(assetmgr,JSON.parse(this.shader0).properties);
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
                sh._parseProperties(assetmgr,JSON.parse(this.diffuseShader).properties);
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
                sh._parseProperties(assetmgr,JSON.parse(this.uishader).properties);
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
                sh._parseProperties(assetmgr,JSON.parse(this.uishader).properties);
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
                sh._parseProperties(assetmgr,JSON.parse(this.shaderuifront).properties);
                
                p.setProgram(programuifont);
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.setAlphaBlend(render.BlendModeEnum.Blend_PreMultiply);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/line");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                p.setProgram(programline);
                p.state_ztest = true;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.state_zwrite = true;
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.setAlphaBlend(render.BlendModeEnum.Close);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/materialcolor");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                sh._parseProperties(assetmgr,JSON.parse(this.materialShader).properties);
                p.setProgram(programmaterialcolor);
                p.state_ztest = false;
                //p.state_ztest_method = render.webglkit.LEQUAL;
                //p.state_zwrite = true;
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.setAlphaBlend(render.BlendModeEnum.Close);
                sh.layer = RenderLayerEnum.Overlay;
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/defmaskui");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                sh._parseProperties(assetmgr,JSON.parse(this.uishader).properties);
                p.setProgram(programMaskUI);
                p.state_showface = render.ShowFaceStateEnum.ALL;
                p.state_ztest = false;
                p.state_zwrite = false;
                p.state_ztest_method = render.webglkit.LEQUAL;
                p.setAlphaBlend(render.BlendModeEnum.Blend_PreMultiply);
                assetmgr.mapShader[sh.getName()] = sh;
            }
            {
                var sh = new shader("shader/defmaskfont");
                sh.defaultAsset = true;
                sh.passes["base"] = [];
                var p = new render.glDrawPass();
                sh.passes["base"].push(p);
                sh._parseProperties(assetmgr,JSON.parse(this.shaderuifront).properties);
                
                p.setProgram(programMaskfont);
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