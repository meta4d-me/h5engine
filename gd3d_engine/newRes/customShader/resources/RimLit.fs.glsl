precision highp float;

#define _LightingIntensity      1.

#define DEPTH_START		0.0
#define DEPTH_END		-5.0
#define AMBIENT_LIGHT	1.

#define RIM_POWER		0.5
#define RIM_LIGHTING_OPERATOR += 0.25 *

#ifdef LOW_END
	#define VERTEX_RIM_LIGHTING
#else
	#define PIXEL_RIM_LIGHTING
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

#ifdef PER_PIXEL_CAUSTICS
    uniform lowp float _CausticsIntensity;
    uniform lowp sampler2D _CausticsTex;
    uniform lowp float _UnitTime;
    uniform float glstate_timer;
#endif


uniform lowp sampler2D _MainTex;
// uniform lowp float _LightingIntensity;

// v2f
varying lowp vec2 xlv_TEXCOORD0;
#ifdef NEEDS_NORMAL
	varying vec3 v_normal;
#endif
#ifdef NEEDS_LIGHTING
    // fixed2 lighting : COLOR0;
    varying lowp float v_atten;
	#ifdef UP_FACE_FACTOR
    varying lowp float v_facing;
	#endif
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

    // ALBEDO_TEXTURE
    lowp vec4 albedo = texture2D(_MainTex, xlv_TEXCOORD0);
    // if(albedo.a < _AlphaCut)
    //     discard;



    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    albedo.xyz *= decode_hdr(lightmap);
    #endif


#ifdef NEEDS_LIGHTING
    lowp float atten = v_atten;

	#ifdef PIXEL_RIM_LIGHTING
        float rimFactor = dot(v_normal, v_normal);
        #ifdef RIM_POWER
            rimFactor = pow(rimFactor, RIM_POWER);
        #endif
		atten RIM_LIGHTING_OPERATOR rimFactor;
	#endif

    atten = mix(1., atten, _LightingIntensity);

    albedo *= atten;
#endif

#ifndef ALPHA_ON
    albedo.a = 1.;
#endif

    gl_FragData[0] = albedo;
}