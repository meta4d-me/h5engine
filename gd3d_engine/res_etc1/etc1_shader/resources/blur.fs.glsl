uniform sampler2D _MainTex;
uniform lowp float _BlurGap; //卷积每层间隔单位
uniform highp vec4 _MainTex_TexelSize;
varying highp vec2 xlv_TEXCOORD0;


vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main() 
{
	lowp float offset_x = _MainTex_TexelSize.x * _BlurGap;
	lowp float offset_y = _MainTex_TexelSize.y * _BlurGap;
    highp vec4 sample0,sample1,sample2,sample3;
	sample0=texture2DEtC1(_MainTex,vec2(xlv_TEXCOORD0.x-offset_x,xlv_TEXCOORD0.y-offset_y));
	sample1=texture2DEtC1(_MainTex,vec2(xlv_TEXCOORD0.x+offset_x,xlv_TEXCOORD0.y-offset_y));
	sample2=texture2DEtC1(_MainTex,vec2(xlv_TEXCOORD0.x+offset_x,xlv_TEXCOORD0.y+offset_y));
	sample3=texture2DEtC1(_MainTex,vec2(xlv_TEXCOORD0.x-offset_x,xlv_TEXCOORD0.y+offset_y));
	highp vec4 color=(sample0+sample1+sample2+sample3) / 4.0;
    gl_FragData[0] = color;
}