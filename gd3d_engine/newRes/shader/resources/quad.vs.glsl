attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
uniform highp mat4 glstate_matrix_mvp;
varying highp vec2 xlv_TEXCOORD0;

void main()
{
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;
    #ifdef QUAD
    gl_Position = vec4(_glesVertex.xy*2.0,_glesVertex.z,1.0);
    #else
    gl_Position = (glstate_matrix_mvp * tmpvar_1);
    #endif
}