#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

const float PI = 3.14159265;
uniform sampler2D _MainTex;
uniform float _UD;
uniform float _UR;
varying highp vec2 xlv_TEXCOORD0;



vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    uv = uv - floor(uv);
    uv.y = 1.0 - uv.y;
    return vec4( texture2D(sampler, uv * vec2(1.0,0.5)).xyz, texture2D(sampler, uv * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}
                



void main()
{
    ivec2 ires = ivec2(1024, 1024);
    float Res = float(ires.s);

    vec2 st = xlv_TEXCOORD0;
    float Radius = Res * _UR;
    vec2 xy = Res * st;

    vec2 dxy = xy - vec2(Res / 2.0, Res / 2.0);
    float r = length(dxy);
    float beta = atan(dxy.y, dxy.x) + radians(_UD) * 2.0 * (Radius - r) / Radius;

    vec2 xy1 = xy;
    if (r <= Radius)
    {
        xy1 = Res / 2.0 + r * vec2(cos(beta), sin(beta));
    }
    st = xy1 / Res;

    vec3 irgb = texture2DEtC1(_MainTex, st).rgb;

    gl_FragData[0] = vec4(irgb, 1.0);
}