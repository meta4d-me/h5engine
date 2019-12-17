precision highp float;


#define DEPTH_START -1.0
#define DEPTH_END -5.0



attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
attribute lowp vec3 _glesNormal;

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_world2object;
uniform mediump vec4 _MainTex_ST;
uniform mediump vec4 _CausticsTex_ST;

varying mediump vec2 xlv_TEXCOORD0;
varying mediump vec2 _CausticsTex_UV;

varying vec3 pos;
varying float v_atten;
varying float v_facing;

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
	mat4 matrix = mat4(
	1.0-yy-zz, xy+zw, xz-yw, 0,
	xy-zw, 1.0-xx-zz, yz + xw, 0,
	xz + yw, yz - xw, 1.0-xx-yy, 0,
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
    highp vec4 position=vec4(_glesVertex.xyz,1.0);
    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
    _CausticsTex_UV = _glesMultiTexCoord0.xy * _CausticsTex_ST.xy + _CausticsTex_ST.zw;


	// World position
	vec4 wp = glstate_matrix_model*position;
	wp.xyz /= wp.w;
	pos = wp.xyz;
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

	float waterDepth = inverseLerp(DEPTH_START, DEPTH_END, wp.y);
	// ACTION_LINE
	float actionLine = mix( 1., 0.2, (inverseLerp( 0., 1.5, wp.z) - inverseLerp(5.,50.,wp.z)) );

	// NO_LIGHTING_ABOVE_WATER
	// actionLine = mix( 1., actionLine, waterDepth);
	v_atten = actionLine;
    vec3 normal = normalize((glstate_matrix_model * vec4(_glesNormal, 0.0)).xyz);
	// v_facing = clamp(dot(normalize(normal), vec3(0, 1., 0)), 0., 1.);
	v_facing = clamp(dot(normal, vec3(0, sign(DEPTH_START - wp.y), 0)), 0., 1.);

    // lowp vec2 _speed= vec2(_SpeedU,_SpeedV);
    // _StreamLightUV = (_glesMultiTexCoord0.xy * _LightTex_ST.xy + _LightTex_ST.zw)  + _speed * glstate_timer;
    gl_Position = position;
}