uniform lowp sampler2D _MainTex;     
uniform lowp vec4 glstate_fog_color; 
 
varying lowp float factor;                                                                                           
varying mediump vec2 xlv_TEXCOORD0;
void main() 
{
    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);
    lowp vec4 afterFog = mix(vec4(0,0,0,0), tmpvar_3, factor);
    gl_FragData[0] =afterFog;
}