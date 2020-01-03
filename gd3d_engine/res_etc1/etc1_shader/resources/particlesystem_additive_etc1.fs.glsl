
precision mediump float;

varying vec2 v_uv;

uniform vec4 _TintColor;
uniform sampler2D _MainTex;
uniform vec4 _MainTex_ST;

varying vec4 v_particle_color;



vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
uv = uv - floor(uv);
uv.y = 1.0 - uv.y;
return vec4( texture2D(sampler, uv * vec2(1.0,0.5)).xyz, texture2D(sampler, uv * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}
            


vec4 particleAnimation(vec4 color) {

    color.xyz = color.xyz * v_particle_color.xyz;
    color.xyz = color.xyz * v_particle_color.www;
    return color;
}

void main()
{
    vec4 finalColor = vec4(1.0, 1.0, 1.0, 1.0);

    finalColor = particleAnimation(finalColor);

    vec2 uv = v_uv;
    uv = uv * _MainTex_ST.xy + _MainTex_ST.zw;
    finalColor = 2.0 * finalColor * _TintColor * texture2DEtC1(_MainTex, uv);

    gl_FragColor = finalColor;
}