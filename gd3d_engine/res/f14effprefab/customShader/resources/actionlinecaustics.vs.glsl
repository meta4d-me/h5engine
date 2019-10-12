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

attribute vec4 _glesVertex;
attribute lowp vec4 _glesMultiTexCoord0;
attribute vec3 _glesNormal;

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_world2object;
uniform mediump vec4 _MainTex_ST;
uniform mediump vec4 _CausticsTex_ST;

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
attribute mediump vec4 _glesMultiTexCoord1;
uniform mediump vec4 glstate_lightmapOffset;
// uniform mediump float glstate_lightmapUV;
varying mediump vec2 lightmap_TEXCOORD;
#endif

#ifdef FOG
// #define glstate_fog_end		150.
// #define glstate_fog_start	1.
uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;
#endif

#ifdef SKIN
attribute lowp vec4 _glesBlendIndex4;
attribute lowp vec4 _glesBlendWeight4;
uniform highp vec4 glstate_vec4_bones[110];
mat4 buildMat4(int index)
{
	vec4 quat = glstate_vec4_bones[index * 2 + 0];
	vec4 translation = glstate_vec4_bones[index * 2 + 1];
	float xy = 2.0 * quat.x * quat.y;
	float xz = 2.0 * quat.x * quat.z;
	float xw = 2.0 * quat.x * quat.w;
	float yz = 2.0 * quat.y * quat.z;
	float yw = 2.0 * quat.y * quat.w;
	float zw = 2.0 * quat.z * quat.w;
	float xx = 2.0*quat.x * quat.x;
	float yy = 2.0*quat.y * quat.y;
	float zz = 2.0*quat.z * quat.z;
	float ww = 2.0*quat.w * quat.w;
	float s = translation.w;
	mat4 matrix = mat4(
	(1.0-yy-zz)*s, (xy+zw)*s, (xz-yw)*s, 0,
	(xy-zw)*s, (1.0-xx-zz)*s, (yz + xw)*s, 0,
	(xz + yw)*s, (yz - xw)*s, (1.0-xx-yy)*s, 0,
	translation.x, translation.y, translation.z, 1);
	return matrix;
}

highp vec4 calcVertex(highp vec4 srcVertex,lowp vec4 blendIndex,lowp vec4 blendWeight)
{
	int i = int(blendIndex.x);
    int i2 =int(blendIndex.y);
	int i3 =int(blendIndex.z);
	int i4 =int(blendIndex.w);

    mat4 mat = buildMat4(i)*blendWeight.x
			 + buildMat4(i2)*blendWeight.y
			 + buildMat4(i3)*blendWeight.z
			 + buildMat4(i4)*blendWeight.w;
	return mat* srcVertex;
}
#endif

float inverseLerp(float x, float y, float z) {
	return (z-x) / (y - x);
}

void main()
{
    vec4 position=vec4(_glesVertex.xyz,1.0);
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    _CausticsTex_UV = _glesMultiTexCoord0.xy * _CausticsTex_ST.xy + _CausticsTex_ST.zw;


	// World position
	vec4 wp = glstate_matrix_model*position;
	wp.xyz /= wp.w;

#ifdef CALCULATE_NORMAL
	vec3 normal = normalize((glstate_matrix_model * vec4(_glesNormal, 0.0)).xyz);
#endif

#ifdef NEEDS_PER_PIXEL_WORLD_POS
	pos = wp.xyz;
#endif
	// pos = _glesVertex.xyz;


    //----------------------------------------------------------
    #ifdef LIGHTMAP
    mediump vec2 beforelightUV = _glesMultiTexCoord1.xy;
    lowp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    lowp float v = beforelightUV.y * glstate_lightmapOffset.y + glstate_lightmapOffset.w;
    lightmap_TEXCOORD = vec2(u,v);
    #endif

    #ifdef SKIN
    position =calcVertex(position,_glesBlendIndex4,_glesBlendWeight4);
    #endif

    position = (glstate_matrix_mvp * position);

    #ifdef FOG
    factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start);
    factor = clamp(factor, 0.0, 1.0);
    #endif

#ifdef NEEDS_DEPTH_FACTOR
	mediump float waterDepth = inverseLerp(DEPTH_START, DEPTH_END, wp.y);
#endif

#ifdef NEEDS_LIGHTING
	mediump float atten = 0.;
	#ifdef ACTION_LINE
		// Middle-ground / above water factor
		mediump float actionLine = mix( 1., 0.2, (inverseLerp( 0., 1.5, wp.z) - inverseLerp(5.,50.,wp.z)) );
	#endif

	#ifdef AMBIENT_LIGHT
		atten += AMBIENT_LIGHT;
	#endif

	#ifdef VERTEX_RIM_LIGHTING
		mediump float rimFactor = 1. - dot(normal, vec3(0,0,-1) );
		#ifdef RIM_POWER
		rimFactor = pow(rimFactor, RIM_POWER);
		#endif
		atten RIM_LIGHTING_OPERATOR rimFactor;
	#endif

	#ifdef NO_LIGHTING_ABOVE_WATER
		atten = mix( 1., atten, waterDepth);
	#endif
	v_atten = atten;

	// v_facing = clamp(dot(normalize(normal), vec3(0, 1., 0)), 0., 1.);
	#ifdef UP_FACE_FACTOR
		v_facing = clamp(dot(normal, vec3(0, sign(DEPTH_START - wp.y), 0)), 0., 1.);
	#endif

#endif

#ifdef NEEDS_NORMAL
		v_normal = normal;
#endif

    // lowp vec2 _speed= vec2(_SpeedU,_SpeedV);
    // _StreamLightUV = (_glesMultiTexCoord0.xy * _LightTex_ST.xy + _LightTex_ST.zw)  + _speed * glstate_timer;
    gl_Position = position;
}