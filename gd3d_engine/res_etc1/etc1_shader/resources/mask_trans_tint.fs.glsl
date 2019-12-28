uniform sampler2D _MainTex; 
uniform sampler2D _Mask; 
uniform mediump vec4 _Main_Color;

varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

uniform lowp float _mixColorRate;
uniform lowp float _mixAlphaRate;

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
    highp vec4 basecolor=texture2DEtC1(_MainTex,_maintex_uv);
    highp vec4 maskcolor=texture2DEtC1(_Mask,_mask_uv);

    lowp vec3 tempcolor=_Main_Color.rgb*basecolor.rgb*maskcolor.rgb*_mixColorRate;
    lowp float tempAlpha=_Main_Color.a*basecolor.a*maskcolor.a*_mixAlphaRate;
    lowp vec4 emission=vec4(tempcolor,tempAlpha);

    //----------------------------------------------------------
    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2DEtC1(_LightmapTex, lightmap_TEXCOORD);
    emission.xyz *= decode_hdr(lightmap);
    #endif

    #ifdef FOG
    emission= mix(vec4(0,0,0,0), emission, factor);

    //emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif
    gl_FragData[0] = emission;


}
