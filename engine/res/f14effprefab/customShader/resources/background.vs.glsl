precision highp float;



attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;

uniform mediump vec4 _MainTex_ST;

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




    position = (glstate_matrix_mvp * position);

    // Force the screen space z to the far clip plane so even though this renders last (and the geometry is front of some stuff), it still renders behind everything
    position.z = position.w - 0.001;

    // #ifdef FOG
    // factor = (glstate_fog_end - abs(position.z))/(glstate_fog_end - glstate_fog_start);
    // factor = clamp(factor, 0.0, 1.0);
    // #endif

    uv = _glesMultiTexCoord0.xy*_MainTex_ST.xy+_MainTex_ST.zw;

    gl_Position = position;
}