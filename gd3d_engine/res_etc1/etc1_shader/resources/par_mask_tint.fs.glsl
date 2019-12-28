uniform sampler2D _Main_Tex; 
uniform sampler2D _Mask; 

varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

varying mediump vec4 v_color;



vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main()    
{
    highp vec4 basecolor=texture2DEtC1(_Main_Tex,_maintex_uv);
    highp vec4 maskcolor=texture2DEtC1(_Mask,_mask_uv);

    mediump vec3 tempcolor=v_color.rgb*basecolor.rgb*maskcolor.rgb;
    mediump float tempAlpha=v_color.a*basecolor.a*maskcolor.a;
    mediump vec4 emission=vec4(tempcolor,tempAlpha);
    
    gl_FragData[0] = emission;
}
