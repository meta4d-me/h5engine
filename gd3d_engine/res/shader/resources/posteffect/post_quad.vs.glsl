attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
varying highp vec2 xlv_TEXCOORD0;

void main()
{
    xlv_TEXCOORD0=vec2(_glesMultiTexCoord0.x,1.0-_glesMultiTexCoord0.y);
    gl_Position = vec4(_glesVertex.xy*2.0,_glesVertex.z,1.0);
}