

precision highp float;

#define AMBIENT_LIGHT 0.
#define DEPTH_START -1.0
#define DEPTH_END -5.0

#define NO_LIGHTING_ABOVE_WATER

#define RIM_POWER 0.5
#define RIM_LIGHTING_OPERATOR -= 0.25 *

#ifdef LOW_END
	#define VERTEX_RIM_LIGHTING
	#define ACTION_LINE
#else
	#define PIXEL_RIM_LIGHTING
	#define PER_PIXEL_CAUSTICS
	#define BUMP_MAPPED_CAUSTICS
	#define ACTION_LINE
#endif

#ifdef PER_PIXEL_CAUSTICS

	#ifndef NEEDS_WORLD_NORMAL
		#define NEEDS_WORLD_NORMAL
	#endif

	#ifndef NEEDS_PER_PIXEL_WORLD_POS
		#define NEEDS_PER_PIXEL_WORLD_POS
	#endif

	#ifndef UP_FACE_FACTOR
		#define UP_FACE_FACTOR
	#endif

	#ifndef NEEDS_DEPTH_FACTOR
		#define NEEDS_DEPTH_FACTOR
	#endif

	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif
#endif

#ifdef NO_LIGHTING_ABOVE_WATER
	#ifndef NEEDS_DEPTH_FACTOR
		#define NEEDS_DEPTH_FACTOR
	#endif
#endif

#ifdef AMBIENT_LIGHT
	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif
#endif

#ifdef ACTION_LINE
	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif

	#ifndef NEEDS_DEPTH_FACTOR
		#define NEEDS_DEPTH_FACTOR
	#endif
#endif

#ifdef FAST_ACTION_LINE
	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif
#endif

#ifdef VERTEX_RIM_LIGHTING
	#ifndef CALCULATE_NORMAL
		#define CALCULATE_NORMAL
	#endif

	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif
#endif

#ifdef PIXEL_RIM_LIGHTING
	#ifndef NEEDS_LIGHTING
		#define NEEDS_LIGHTING
	#endif

	#ifndef NEEDS_NORMAL
		#define NEEDS_NORMAL
	#endif
#endif

#ifdef SPHERE_MAP_ADDITIVE
	#ifndef SPHERE_MAP
		#define SPHERE_MAP
	#endif
#endif

#ifdef SPHERE_MAP_BLEND
	#ifndef SPHERE_MAP
		#define SPHERE_MAP
	#endif
#endif

#ifdef SPHERE_MAP
	#ifndef NEEDS_NORMAL
		#define NEEDS_NORMAL
	#endif
#endif

#ifdef ABOVE_WATER_BRIGHTEN
	#ifndef NEEDS_DEPTH_FACTOR
		#define NEEDS_DEPTH_FACTOR
	#endif
#endif

#ifdef UP_FACE_FACTOR
	#ifndef CALCULATE_NORMAL
		#define CALCULATE_NORMAL
	#endif
#endif

#ifdef NEEDS_NORMAL
	#ifndef CALCULATE_NORMAL
		#define CALCULATE_NORMAL
	#endif
#endif



uniform lowp sampler2D _MainTex;

#ifdef NEEDS_LIGHTING
    // uniform lowp float _LightingIntensity;
#endif
#ifdef PER_PIXEL_CAUSTICS
    uniform lowp float _CausticsIntensity;
    uniform lowp sampler2D _CausticsTex;
    uniform lowp float _UnitTime;
    uniform float glstate_timer;
#endif

// NOTE: v2f
varying lowp vec2 xlv_TEXCOORD0;
varying lowp vec2 _CausticsTex_UV;

#ifdef NEEDS_PER_PIXEL_WORLD_POS
    varying vec3 pos;
#endif
#ifdef NEEDS_LIGHTING
    // fixed2 lighting : COLOR0;
    varying lowp float v_atten;
	#ifdef UP_FACE_FACTOR
	varying lowp float v_facing;
	#endif
#endif
#ifdef NEEDS_NORMAL
    // float3 normal : COLOR1;
    varying vec3 v_normal;
#endif

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




    // vec4 final = texture2D(_MainTex, xlv_TEXCOORD0);

#ifdef NEEDS_LIGHTING
    lowp float atten = v_atten;
	#ifdef PIXEL_RIM_LIGHTING
		mediump float rimFactor = dot(v_normal, v_normal);
		#ifdef RIM_POWER
			rimFactor = pow(rimFactor, RIM_POWER);
		#endif
		atten RIM_LIGHTING_OPERATOR rimFactor;
    #endif

    // atten = mix(1., atten, _LightingIntensity);
    atten = 1.;

	#ifdef PER_PIXEL_CAUSTICS
        lowp float causticsStrength = _CausticsIntensity * v_facing;
        vec2 projectedWorldPos = .1 *vec2(pos.x,pos.z);

        projectedWorldPos = 1. + mod(projectedWorldPos,1.);
        projectedWorldPos += mod(10.* glstate_timer * 0.01,2.);
        #ifdef BUMP_MAPPED_CAUSTICS
            projectedWorldPos += 0.05 * length(emission);
        #endif
        // The original version is using alpha channel
        lowp float causticcol = texture2D(_CausticsTex,projectedWorldPos).r;

        atten += causticsStrength * causticcol;

    #endif
    emission *= atten;
#endif

    #ifdef FOG
    emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    #endif

    gl_FragData[0] = emission;
}