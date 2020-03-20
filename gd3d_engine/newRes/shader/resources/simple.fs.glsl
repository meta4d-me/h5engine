precision highp float;

uniform sampler2D _Main_Tex;
uniform float _AlphaCut;
uniform vec4 _MainColor;

varying vec2 xlv_TEXCOORD0;    

#ifdef FOG
uniform lowp vec4 glstate_fog_color;
varying lowp float factor;
#endif

void main() 
{
    vec4 basecolor = texture2D(_Main_Tex, xlv_TEXCOORD0);

    if(basecolor.a < _AlphaCut)
        discard;

    basecolor = basecolor * _MainColor;

    basecolor.rgb = basecolor.rgb * basecolor.a;

    #ifdef FOG
    basecolor.xyz = mix(glstate_fog_color.rgb, basecolor.rgb, factor);
    #endif
        
    gl_FragData[0] = basecolor;
}