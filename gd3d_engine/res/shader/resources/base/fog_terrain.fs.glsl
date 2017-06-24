uniform sampler2D _Splat0;
uniform sampler2D _Splat1;
uniform sampler2D _Splat2;
uniform sampler2D _Splat3;
uniform sampler2D _Control;
uniform sampler2D _LightmapTex;
uniform lowp float _AlphaCut;
uniform highp vec4 glstate_fog_color;  

varying highp float factor;  
varying highp vec2 xlv_TEXCOORD0;
varying highp vec2 xlv_TEXCOORD1;
varying highp vec2 uv_Splat0;
varying highp vec2 uv_Splat1;
varying highp vec2 uv_Splat2;
varying highp vec2 uv_Splat3;
lowp vec3 decode_hdr(lowp vec4 data)
{
    highp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
    return data.rgb * power * 2.0 ;
}
void main() 
{
    highp vec4 control = texture2D(_Control, xlv_TEXCOORD0);
    highp vec3 lay1 = texture2D(_Splat0,uv_Splat0).xyz;
    highp vec3 lay2 = texture2D(_Splat1,uv_Splat1).xyz;
    highp vec3 lay3 = texture2D(_Splat2,uv_Splat2).xyz;
    highp vec3 lay4 = texture2D(_Splat3,uv_Splat2).xyz;
    lowp vec4 outColor = vec4(lay1*control.r + lay2*control.g + lay3*control.b + lay4*(1.0-control.a),1);
    // outColor = vec4(lay4,0);

    lowp vec4 lightmap = texture2D(_LightmapTex, xlv_TEXCOORD1);
    outColor.xyz *= decode_hdr(lightmap);

    lowp vec3 afterFog = mix(glstate_fog_color.rgb, outColor.rgb, factor);

    // outColor.xyz *= lightmap.xyz;
    gl_FragData[0] = vec4(afterFog,outColor.a);
    // gl_FragData[0] = vec4(lay1,0);
}