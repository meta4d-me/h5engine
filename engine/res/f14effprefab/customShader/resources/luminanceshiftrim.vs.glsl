precision highp float;



attribute vec3 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
attribute vec3 _glesColor;
attribute highp vec3 _glesNormal;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_mvp;
uniform vec4 glstate_eyepos;


uniform mediump vec4 _MainTex_ST;
varying mediump vec2 xlv_TEXCOORD0;
// varying vec2 uv;
varying vec4 data;

#ifdef LIGHTMAP
attribute mediump vec4 _glesMultiTexCoord1;
uniform mediump vec4 glstate_lightmapOffset;
// uniform mediump float glstate_lightmapUV;
varying mediump vec2 lightmap_TEXCOORD;
#endif

// #ifdef FOGs
// uniform highp float glstate_fog_start;
// uniform highp float glstate_fog_end;
// varying highp float factor;
// #endif

uniform float _RimSize;
uniform float _RimIntensity;


#ifdef SKIN
highp mat4 blendMat;
attribute highp vec4 _glesBlendIndex4;
attribute highp vec4 _glesBlendWeight4;
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

highp vec4 calcVertex(highp vec4 srcVertex,highp vec4 blendIndex,highp vec4 blendWeight)
{
	int i = int(blendIndex.x);
    int i2 =int(blendIndex.y);
	int i3 =int(blendIndex.z);
	int i4 =int(blendIndex.w);

    blendMat = buildMat4(i)*blendWeight.x
			 + buildMat4(i2)*blendWeight.y
			 + buildMat4(i3)*blendWeight.z
			 + buildMat4(i4)*blendWeight.w;
	return blendMat* srcVertex;
}
#endif


void main()
{
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    highp vec4 position=vec4(_glesVertex.xyz,1.0);

    //----------------------------------------------------------
    #ifdef LIGHTMAP
    mediump vec2 beforelightUV = _glesMultiTexCoord1.xy;
    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    highp float v = beforelightUV.y * glstate_lightmapOffset.y + glstate_lightmapOffset.w;
    lightmap_TEXCOORD = vec2(u,v);
    #endif

	// World position
    vec3 normalizedNormal = _glesNormal;
    #ifdef SKIN
    position =calcVertex(position,_glesBlendIndex4,_glesBlendWeight4);
    normalizedNormal = normalize(mat3(blendMat) * _glesNormal);
    #endif
	vec4 wp = glstate_matrix_model * position;
	// wp.xyz /= wp.w;
    position = glstate_matrix_mvp * position;


    // Apply the rim effect
    vec3 viewDir = normalize(glstate_eyepos.xyz - wp.xyz);
    normalizedNormal = normalize(mat3(glstate_matrix_model) * normalizedNormal);
	float dotProduct = .5 * (1. - dot(normalizedNormal, viewDir));

	// Rim Intensity
	data.r = 1. + mix(0., _RimIntensity, dotProduct);

	// Shift intensity
    data.g = _glesColor.r;

    gl_Position = position;
}