
precision mediump float;

varying vec2 v_uv;

uniform vec4 _TintColor;
uniform sampler2D _MainTex;
uniform vec4 _MainTex_ST;

varying vec4 v_particle_color;

//texture2DEtC1Mark

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
    finalColor = 2.0 * finalColor * _TintColor * texture2D(_MainTex, uv);

    gl_FragColor = finalColor;
}