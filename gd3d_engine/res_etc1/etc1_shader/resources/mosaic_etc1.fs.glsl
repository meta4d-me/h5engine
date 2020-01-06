uniform sampler2D _MainTex;
uniform lowp float _MosaicSize;
uniform highp vec4 _MainTex_TexelSize;
varying highp vec2 xlv_TEXCOORD0;


mediump vec4 texture2DEtC1(mediump sampler2D sampler,mediump vec2 uv)
{
uv = uv - floor(uv);
mediump vec2 scale = vec2(1.0,0.5);
mediump vec2 offset = vec2(0.0,0.5);
return vec4( texture2D(sampler, uv * scale).xyz, texture2D(sampler, uv * scale + offset).x);
}



void main() //马赛克效果
{
    // lowp vec4 tmpvar_3 = texture2DEtC1(_MainTex, xlv_TEXCOORD0);
    // gl_FragData[0] = tmpvar_3;
    highp vec2 uv = (xlv_TEXCOORD0*_MainTex_TexelSize.zw);
    uv = floor(uv/_MosaicSize)*_MosaicSize;
    uv = uv * _MainTex_TexelSize.xy;
    gl_FragData[0] = texture2D(_MainTex, uv);
    // highp vec4 color = texture2D(_MainTex,xlv_TEXCOORD0);
    // gl_FragData[0] = color * color;
}