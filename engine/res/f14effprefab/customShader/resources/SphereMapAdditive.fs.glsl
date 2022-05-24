precision highp float;


#define RIM_POWER               0.5
#define RIM_LIGHTING_OPERATOR += 0.25 *


uniform lowp sampler2D _MainTex;
uniform lowp sampler2D _SphereMap;
uniform lowp float _SphereMapIntensity;

varying lowp vec2 xlv_TEXCOORD0;
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

// #ifdef FOG
// uniform lowp vec4 glstate_fog_color;
// varying lowp float factor;
// #endif

void main()
{

    // ALBEDO_TEXTURE
    // lowp vec4 albedo = texture2D(_MainTex, xlv_TEXCOORD0);
    lowp vec4 albedo = vec4(0);
    // if(albedo.a < _AlphaCut)
    //     discard;

    // SPHERE_MAP
    lowp vec2 sphereMapCoordinate = 0.5 + 0.5 * v_normal.xy;
    // SPHERE_MAP_ADDITIVE
    albedo += texture2D(_SphereMap, sphereMapCoordinate) * _SphereMapIntensity;

    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    albedo.xyz *= decode_hdr(lightmap);
    #endif




    // #ifdef FOG
    // albedo.xyz = mix(glstate_fog_color.rgb, albedo.rgb, factor);
    // #endif

    gl_FragData[0] = albedo;
}