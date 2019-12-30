uniform lowp sampler2D _MainTex;
uniform lowp sampler2D _LightTex;
uniform lowp vec4 _LightColor;
uniform lowp float _LightRate;
uniform lowp sampler2D _MaskTex;
uniform lowp float _AlphaCut;
varying mediump vec2 xlv_TEXCOORD0;
varying mediump vec2 _StreamLightUV;

#ifdef LIGHTMAP
uniform lowp sampler2D _LightmapTex;
varying mediump vec2 lightmap_TEXCOORD;
lowp vec3 decode_hdr(lowp vec4 data)
{
    lowp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
    return data.rgb * power * 2.0 ;
}
#endif

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
    if(emission.a < _AlphaCut)
        discard;

    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2DEtC1(_LightmapTex, lightmap_TEXCOORD);
    emission.xyz *= decode_hdr(lightmap);
    #endif

    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif

    lowp vec4 light = texture2DEtC1(_LightTex, _StreamLightUV) * _LightColor * _LightRate;
    lowp vec4 mask = texture2DEtC1(_MaskTex, xlv_TEXCOORD0);
    light = min(light,mask);

    emission.rgb += light.rgb;
    gl_FragData[0] = emission;
}