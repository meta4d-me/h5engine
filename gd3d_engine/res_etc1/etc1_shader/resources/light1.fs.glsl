uniform lowp sampler2D _MainTex;                                                 
varying lowp vec4 xlv_COLOR;                                                 
varying mediump vec2 xlv_TEXCOORD0;   


vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main() 
{
    lowp vec4 tmpvar_3= (xlv_COLOR * texture2DEtC1(_MainTex, xlv_TEXCOORD0));
    lowp vec4 tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), tmpvar_3, tmpvar_3.wwww);
    gl_FragData[0] = tmpvar_4;
}