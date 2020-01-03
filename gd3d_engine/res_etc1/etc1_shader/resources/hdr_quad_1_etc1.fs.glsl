#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D _MainTex;
uniform float _K;
varying highp vec2 xlv_TEXCOORD0;



vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
uv = uv - floor(uv);
uv.y = 1.0 - uv.y;
return vec4( texture2D(sampler, uv * vec2(1.0,0.5)).xyz, texture2D(sampler, uv * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}
            


vec4 xposure(vec4 color, float gray, float ex)
{
    float b = (4. * ex - 1.);
    float a = 1. - b;
    float f = gray * (a * gray + b);
    return color * f;
}

void main()
{
    vec4 color = texture2DEtC1(_MainTex, xlv_TEXCOORD0);
    float lum = .3 * color.x + .59 * color.y + .11 * color.z;
    gl_FragData[0] = xposure(color, lum, _K);
}