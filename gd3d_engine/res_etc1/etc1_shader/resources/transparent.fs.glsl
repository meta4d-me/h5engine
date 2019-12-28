uniform lowp sampler2D _MainTex;                                                                                                
varying highp vec2 xlv_TEXCOORD0;
uniform lowp float _Alpha;
uniform lowp float _Superimposition;

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
    lowp vec4 emission = texture2DEtC1(_MainTex, xlv_TEXCOORD0);
    emission.a=emission.a*_Alpha;
    emission.xyz *= _Superimposition;
    //----------------------------------------------------------
    #ifdef FOG
    emission.xyz= mix(glstate_fog_color.xyz, emission.xyz, factor);
    #endif
    gl_FragData[0] = emission;

}