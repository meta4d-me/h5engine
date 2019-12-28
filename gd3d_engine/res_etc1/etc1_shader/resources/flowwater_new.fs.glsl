uniform lowp sampler2D _MainTex;  
varying mediump vec2 _base_uv;
varying lowp vec4 attcolor;

#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif




vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main() 
{
    lowp vec4 basecolor = texture2DEtC1(_MainTex, _base_uv);
    lowp vec4 emission=basecolor*attcolor;

    #ifdef FOG
    //emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    emission= mix(vec4(0,0,0,0), emission, factor);
    #endif

    gl_FragData[0] =emission;
}