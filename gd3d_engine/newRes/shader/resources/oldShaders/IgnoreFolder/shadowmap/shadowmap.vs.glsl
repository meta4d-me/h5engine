attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_model;
uniform highp mat4  _LightProjection;
uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST;  

varying highp vec2 xlv_TEXCOORD0;
varying highp vec4 _WorldPos;

void main()
{
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;  
	_WorldPos = (_LightProjection * glstate_matrix_model * tmpvar_1);
    gl_Position = (glstate_matrix_mvp * tmpvar_1);
}