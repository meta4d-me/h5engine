attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0; 
varying highp vec2 xlv_TEXCOORD0;   
void main()                     
{ 
    gl_Position = _glesVertex;
    xlv_TEXCOORD0=_glesMultiTexCoord0.xy;
}   