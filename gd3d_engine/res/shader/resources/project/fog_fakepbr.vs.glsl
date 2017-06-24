attribute vec4 _glesVertex;
attribute vec2 _glesMultiTexCoord0;
attribute vec3 _glesTangent;
attribute vec3 _glesNormal;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_mvp;
uniform highp float glstate_fog_start;
uniform highp float glstate_fog_end;

varying highp float factor;
varying highp vec2 xlv_TEXCOORD0;
varying highp vec3 posWorld;
varying highp vec3 normalDir;
varying highp vec3 tangentDir;
varying highp vec3 bitangentDir;
void main()
{
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;
    posWorld = (glstate_matrix_model * _glesVertex).xyz;
    highp mat3 normalmat = mat3(glstate_matrix_model);

    normalDir = normalize(normalmat*_glesNormal);
    tangentDir = normalize(normalmat*_glesTangent);
    bitangentDir = cross(normalDir,tangentDir);

    highp vec4 pos = (glstate_matrix_mvp * _glesVertex);
    factor = (glstate_fog_end - abs(pos.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}