uniform mediump sampler2D _Main_Tex;

varying lowp vec4 xlv_COLOR;
varying mediump vec2 xlv_TEXCOORD0;          


vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main() 
{
    lowp vec4 basecolor = texture2DEtC1(_Main_Tex, xlv_TEXCOORD0);
    gl_FragData[0] =basecolor*xlv_COLOR;
    //gl_FragData[0] =vec4(1,0,0,1);
}