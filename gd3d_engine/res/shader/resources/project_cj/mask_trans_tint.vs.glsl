attribute highp vec3 _glesVertex;
//attribute lowp vec4 _glesColor;
attribute mediump vec2 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;


uniform mediump vec4 _MainTex_ST;
uniform mediump vec4 _Mask_ST;
uniform mediump vec4 _Main_Color;

varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

varying lowp vec4 v_color;
void main()
{

    _maintex_uv = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    _mask_uv = _glesMultiTexCoord0.xy * _Mask_ST.xy + _Mask_ST.zw;
    //v_color =_glesColor*_Main_Color*2.0;
    v_color =_Main_Color*2.0;
	gl_Position = (glstate_matrix_mvp * vec4(_glesVertex.xyz, 1.0));
}