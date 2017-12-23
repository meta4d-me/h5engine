uniform lowp sampler2D _MainTex;  
varying mediump vec2 _base_uv;
varying lowp vec4 attcolor;


uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;

void main() 
{
    lowp vec4 basecolor = texture2D(_MainTex, _base_uv);
    lowp vec4 emission=basecolor*attcolor;

    lowp vec3 afterFog = mix(glstate_fog_color.rgb, emission.rgb, factor);

    gl_FragData[0] = vec4(afterFog,emission.a);
}