attribute vec4 _glesVertex;
attribute vec4 _glesMultiTexCoord0;
attribute vec4 _glesMultiTexCoord1;

uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 glstate_lightmapOffset;
uniform lowp float glstate_lightmapUV;

uniform highp vec4 _Splat0_ST;
uniform highp vec4 _Splat1_ST;
uniform highp vec4 _Splat2_ST;
uniform highp vec4 _Splat3_ST;
uniform highp float _Start;
uniform highp float _End;

varying highp float factor;
varying highp vec2 xlv_TEXCOORD0;
varying highp vec2 xlv_TEXCOORD1;
varying highp vec2 uv_Splat0;
varying highp vec2 uv_Splat1;
varying highp vec2 uv_Splat2;
varying highp vec2 uv_Splat3;


void main()
{
    highp vec4 tmpvar_1;
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;
    uv_Splat0 = _glesMultiTexCoord0.xy * _Splat0_ST.xy + _Splat0_ST.zw;
    uv_Splat1 = _glesMultiTexCoord0.xy * _Splat1_ST.xy + _Splat1_ST.zw;
    uv_Splat2 = _glesMultiTexCoord0.xy * _Splat2_ST.xy + _Splat2_ST.zw;
    uv_Splat3 = _glesMultiTexCoord0.xy * _Splat3_ST.xy + _Splat3_ST.zw;
    
    highp vec2 beforelightUV = _glesMultiTexCoord1.xy;
    if(glstate_lightmapUV == 0.0)
    {
        beforelightUV = _glesMultiTexCoord0.xy;
    }
    highp float u = beforelightUV.x * glstate_lightmapOffset.x + glstate_lightmapOffset.z;
    highp float v = 1.0 - ((1.0 - beforelightUV.y) * glstate_lightmapOffset.y + glstate_lightmapOffset.w);
    xlv_TEXCOORD1 = vec2(u,v);
    
    highp vec4 pos = (glstate_matrix_mvp * tmpvar_1);
    factor = (_End - abs(pos.z))/(_End - _Start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}