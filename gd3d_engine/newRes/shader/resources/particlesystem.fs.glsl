
precision mediump float;

varying vec2 v_uv;

uniform vec4 _TintColor;
uniform sampler2D _MainTex;

varying vec4 v_color;

void main()
{
    gl_FragColor = 2.0 * v_color * _TintColor * texture2D(_MainTex, v_uv);
}