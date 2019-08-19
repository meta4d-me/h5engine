precision highp float;


#define RIM_POWER               0.5
#define RIM_LIGHTING_OPERATOR += 0.25 *


uniform float glstate_timer;


uniform lowp sampler2D _MainTex;
uniform lowp sampler2D _CausticsTex;
uniform lowp float _LightingIntensity;
uniform lowp float _CausticsIntensity;
uniform lowp vec4 _Tint;
uniform lowp float _TintIntensity;

varying mediump vec2 xlv_TEXCOORD0;
varying vec3 pos;
varying float v_atten;
varying float v_facing;
varying vec3 v_normal;


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

    // ALBEDO_TEXTURE
    lowp vec4 albedo = texture2D(_MainTex, xlv_TEXCOORD0);
    // if(albedo.a < _AlphaCut)
    //     discard;

    // TINT_ON
    albedo.rgb += _Tint.rgb * _TintIntensity;


    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    albedo.xyz *= decode_hdr(lightmap);
    #endif



    // vec4 final = texture2D(_MainTex, xlv_TEXCOORD0);

    // NEEDS_LIGHTING
    float atten = v_atten;

    // PIXEL_RIM_LIGHTING
    float rimFactor = dot(v_normal, v_normal);
#ifdef RIM_POWER
    rimFactor = pow(rimFactor, RIM_POWER);
#endif
    // RIM_LIGHTING_OPERATOR
    atten += 0.25 * rimFactor;

    atten = mix(1., atten, _LightingIntensity);
    // float causticcol = texture2D(_CausticsTex,projectedWorldPos).a;
    // The original version is using alpha channel

    // PER_PIXEL_CAUSTICS
    float causticsStrength = _CausticsIntensity * v_facing;
    vec2 projectedWorldPos = .1 *vec2(pos.x,pos.z);
    projectedWorldPos = 1. + mod(projectedWorldPos,1.);
    projectedWorldPos+= mod(10.*glstate_timer * 0.01,2.);


    float causticcol = texture2D(_CausticsTex,projectedWorldPos).r;

    // 'Add' caustics
    atten += causticsStrength * causticcol;


    albedo *= atten;
    albedo.a = 1.;

    #ifdef FOG
    albedo.xyz = mix(glstate_fog_color.rgb, albedo.rgb, factor);
    #endif

    // lowp vec4 light = texture2D(_LightTex, _StreamLightUV) * _LightColor * _LightRate;
    // lowp vec4 mask = texture2D(_MaskTex, xlv_TEXCOORD0);
    // light = min(light,mask);

    // gl_FragData[0] = vec4(pos, 1);
    // gl_FragData[0] = vec4(projectedWorldPos, 0, 1);
    // gl_FragData[0] = albedo * (1. + causticcol);
    // gl_FragData[0] = vec4(causticcol);
    gl_FragData[0] = albedo;
    // gl_FragData[0] = vec4(vec3(mod(atten, 1.)), 1);
    // gl_FragData[0] = vec4(vec3(v_facing), 1);
    //gl_FragData[0] = vec4(vec3(v_facing * causticcol),1.0);

}