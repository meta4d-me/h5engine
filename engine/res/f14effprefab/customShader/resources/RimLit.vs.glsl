precision highp float;


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

// appdata
attribute vec4 _glesVertex;
attribute lowp vec4 _glesMultiTexCoord0;
attribute lowp vec3 _glesNormal;

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_world2object;
uniform mediump vec4 _MainTex_ST;


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
attribute mediump vec4 _glesMultiTexCoord1;
uniform mediump vec4 glstate_lightmapOffset;
// uniform mediump float glstate_lightmapUV;
varying mediump vec2 lightmap_TEXCOORD;
#endif

#ifdef FOG
uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;
#endif

#ifdef SKIN
highp mat4 blendMat;
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

    blendMat = buildMat4(i)*blendWeight.x
			 + buildMat4(i2)*blendWeight.y
			 + buildMat4(i3)*blendWeight.z
			 + buildMat4(i4)*blendWeight.w;
	return blendMat * srcVertex;
}
#endif

float inverseLerp(float x, float y, float z) {
	// return (z-x) / (y - x);
    return smoothstep(x,y,z);   // TODO:
}

void main()
{
    vec4 position=vec4(_glesVertex.xyz,1.0);

    vec3 normal = _glesNormal;

    #ifdef SKIN
    position =calcVertex(position,_glesBlendIndex4,_glesBlendWeight4);
    normal = normalize(mat3(blendMat) * _glesNormal);
    #endif
	// World position
	// mediump vec4 wp = glstate_matrix_model * position;
    position = (glstate_matrix_mvp * position);

#ifdef CALCULATE_NORMAL
    normal = normalize(mat3(glstate_matrix_model) * normal);
#endif

    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;


    //----------------------------------------------------------
    #ifdef LIGHTMAP
    mediump vec2 beforelightUV = _glesMultiTexCoord1.xy;
    lowp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    lowp float v = beforelightUV.y * glstate_lightmapOffset.y + glstate_lightmapOffset.w;
    lightmap_TEXCOORD = vec2(u,v);
    #endif

#ifdef NEEDS_LIGHTING
	mediump float atten = 0.;
	#ifdef AMBIENT_LIGHT
		atten += AMBIENT_LIGHT;
	#endif
	#ifdef VERTEX_RIM_LIGHTING
		mediump float rimFactor = 1.-dot(normal, vec3(0,0,-1) );

		#ifdef RIM_POWER
		rimFactor = pow(rimFactor, RIM_POWER);
		#endif

		atten RIM_LIGHTING_OPERATOR rimFactor;
	#endif	// lighting.x
	v_atten = atten;
#endif

#ifdef NEEDS_NORMAL
		v_normal = normal;
#endif

    gl_Position = position;
}