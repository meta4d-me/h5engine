uniform sampler2D _Main_Tex; 
uniform sampler2D _Mask; 

varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;

varying mediump vec4 v_color;



mediump vec4 texture2DEtC1(mediump sampler2D sampler,mediump vec2 uv)
{
uv = uv - floor(uv);
uv.y = 1.0 - uv.y;
mediump vec2 scale = vec2(1.0,0.5);
mediump vec2 offset = vec2(0.0,0.5);
return vec4( texture2D(sampler, uv * scale).xyz, texture2D(sampler, uv * scale + offset).x);
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
