attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
uniform highp mat4 glstate_matrix_mvp;
uniform highp float _Start;
uniform highp float _End;

varying highp float factor;
varying highp vec2 xlv_TEXCOORD0;
void main()
{
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;

    highp vec4 pos = (glstate_matrix_mvp * tmpvar_1);
    factor = (_End - abs(pos.z))/(_End - _Start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}