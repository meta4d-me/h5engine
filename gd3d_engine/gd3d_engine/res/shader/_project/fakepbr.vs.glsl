attribute vec4 _glesVertex;
attribute vec2 _glesMultiTexCoord0;
attribute vec3 _glesTangent;
attribute vec3 _glesNormal;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_mvp;

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

    gl_Position = (glstate_matrix_mvp * _glesVertex);
}