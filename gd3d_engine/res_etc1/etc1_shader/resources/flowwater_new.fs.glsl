uniform lowp sampler2D _MainTex;  
varying mediump vec2 _base_uv;
varying lowp vec4 attcolor;

#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif




mediump vec4 texture2DEtC1(mediump sampler2D sampler,mediump vec2 uv)
{
    uv = uv - floor(uv);
    uv.y = 1.0 - uv.y;
    mediump vec2 scale = vec2(1.0,0.5);
    mediump vec2 offset = vec2(0.0,0.5);
    return vec4( texture2D(sampler, uv * scale).xyz, texture2D(sampler, uv * scale + offset).x);
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