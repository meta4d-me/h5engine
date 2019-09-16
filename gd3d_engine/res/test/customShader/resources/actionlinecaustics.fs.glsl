

precision highp float;



#define RIM_LIGHTING_OPERATOR -= 0.25 *


uniform float glstate_timer;


uniform lowp sampler2D _MainTex;
uniform lowp sampler2D _CausticsTex;
uniform lowp float _LightingIntensity;
uniform lowp float _CausticsIntensity;
uniform lowp float _UnitTime;

varying mediump vec2 xlv_TEXCOORD0;
varying mediump vec2 _CausticsTex_UV;
varying vec3 pos;
varying float v_atten;
varying float v_facing;


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

void main()
{
    lowp vec4 emission = texture2D(_MainTex, xlv_TEXCOORD0);
    // if(emission.a < _AlphaCut)
    //     discard;

    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    emission.xyz *= decode_hdr(lightmap);
    #endif



    vec2 projectedWorldPos = .1 *vec2(pos.x,pos.z);
    projectedWorldPos = 1. + mod(projectedWorldPos,1.);
    // projectedWorldPos+= mod(10.*_UnitTime,2.);
    projectedWorldPos+= mod(10.*glstate_timer * 0.01,2.);

    // vec4 final = texture2D(_MainTex, xlv_TEXCOORD0);

    float atten = v_atten;

    atten = mix(1., atten, _LightingIntensity);
    atten = 1.;
    // float causticcol = texture2D(_CausticsTex,projectedWorldPos).a;
    // The original version is using alpha channel
    float causticcol = texture2D(_CausticsTex,projectedWorldPos).r;

    float causticsStrength = _CausticsIntensity * v_facing;
    atten += causticsStrength * causticcol;


    emission *= atten;

    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif

    // lowp vec4 light = texture2D(_LightTex, _StreamLightUV) * _LightColor * _LightRate;
    // lowp vec4 mask = texture2D(_MaskTex, xlv_TEXCOORD0);
    // light = min(light,mask);

    // gl_FragData[0] = vec4(pos, 1);
    // gl_FragData[0] = vec4(projectedWorldPos, 1, 1);
    // gl_FragData[0] = emission * (1. + causticcol);
    // gl_FragData[0] = vec4(causticcol);
    gl_FragData[0] = emission;
    // gl_FragData[0] = vec4(vec3(mod(atten, 1.)), 1);
    // gl_FragData[0] = vec4(vec3(v_facing), 1);
    //gl_FragData[0] = vec4(vec3(v_facing * causticcol),1.0);

}