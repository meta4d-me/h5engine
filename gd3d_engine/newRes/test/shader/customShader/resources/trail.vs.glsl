attribute highp vec4 _glesVertex;
attribute mediump vec4 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;
uniform mediump vec4 _MainTex_ST;
varying mediump vec2 xlv_TEXCOORD0;


attribute vec4 _glesColor;
varying highp vec4 v_color;

void main()
{
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    highp vec4 position=vec4(_glesVertex.xyz,1.0);
    position = (glstate_matrix_mvp * position);
	v_color = _glesColor;
    gl_Position =position;
}