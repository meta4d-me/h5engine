precision highp float;



attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
attribute vec4 _glesMultiTexCoord1;
attribute vec4 _glesColor;

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;
uniform highp mat4 glstate_matrix_world2object;

uniform vec4 glstate_eyepos;
uniform float glstate_timer;

uniform mediump vec4 _MainTex_ST;

varying vec4 color;
varying vec2 uv;

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


float inverseLerp(float x,float y,float z){
	// return clamp((z-x)/(y-x), 0., 1.);
    // return clamp(z-x, 0, y)/(y-x);
    return smoothstep(x,y,z);   // TODO:
}


void main()
{
    highp vec4 position=vec4(_glesVertex.xyz,1.0);


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


    float belowWaterFactor = inverseLerp(1., -3. , glstate_eyepos.y);

    position.z *= 0.5;

    color.x = inverseLerp(-1., 0., position.z) - inverseLerp(30., 140., position.z);
    color.y = 0.;

    float timer = glstate_timer * 0.01;

    position.y *= sin( 50. * (_glesColor.r + timer * 3.14159265359)) * 0.3 * color.x * belowWaterFactor;
    position.y -= belowWaterFactor * 2. * inverseLerp(20., 140., position.z);



    position = (glstate_matrix_mvp * position);


    uv = _glesMultiTexCoord0.xy*_MainTex_ST.xy*vec2(0.5)+_MainTex_ST.zw;
    uv += timer * 15.;

    gl_Position = position;
}