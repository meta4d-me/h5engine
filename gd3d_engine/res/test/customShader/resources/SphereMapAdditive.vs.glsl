precision highp float;



attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
attribute lowp vec3 _glesNormal;

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;
uniform mediump vec4 _MainTex_ST;

varying mediump vec2 xlv_TEXCOORD0;

varying vec3 v_normal;


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
    highp vec4 position=vec4(_glesVertex.xyz,1.0);


    vec3 normal = _glesNormal;
    #ifdef SKIN
    position =calcVertex(position,_glesBlendIndex4,_glesBlendWeight4);
    normal = normalize(mat3(blendMat) * _glesNormal);
    #endif
	// // World position
	// vec4 wp = glstate_matrix_model * position;
	// // wp.xyz /= wp.w;
    position = (glstate_matrix_mvp * position);
	// CALCULATE_NORMAL
    normal = normalize(mat3(glstate_matrix_model) * normal);
	v_normal = normal;

    xlv_TEXCOORD0 = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;






    //----------------------------------------------------------
    #ifdef LIGHTMAP
    mediump vec2 beforelightUV = _glesMultiTexCoord1.xy;
    lowp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    lowp float v = beforelightUV.y * glstate_lightmapOffset.y + glstate_lightmapOffset.w;
    lightmap_TEXCOORD = vec2(u,v);
    #endif


    #ifdef FOG
    factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start);
    factor = clamp(factor, 0.0, 1.0);
    #endif


	// v_facing = clamp(dot(normalize(normal), vec3(0, 1., 0)), 0., 1.);

    gl_Position = position;
}