uniform lowp sampler2D _MainTex;                                                 
varying lowp vec4 xlv_COLOR;                                                 
varying mediump vec2 xlv_TEXCOORD0;   


mediump vec4 texture2DEtC1(mediump sampler2D sampler,mediump vec2 uv)
{
uv = uv - floor(uv);
mediump vec2 scale = vec2(1.0,0.5);
mediump vec2 offset = vec2(0.0,0.5);
return vec4( texture2D(sampler, uv * scale).xyz, texture2D(sampler, uv * scale + offset).x);
}



void main() 
{
    lowp vec4 tmpvar_3= (xlv_COLOR * texture2DEtC1(_MainTex, xlv_TEXCOORD0));
    lowp vec4 tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), tmpvar_3, tmpvar_3.wwww);
    gl_FragData[0] = tmpvar_4;
}