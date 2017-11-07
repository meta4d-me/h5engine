uniform sampler2D _MainTex; 
uniform sampler2D _Mask; 

varying lowp vec4 v_color;
varying mediump vec2 _maintex_uv;
varying mediump vec2 _mask_uv;


uniform lowp vec4 glstate_fog_color;
varying lowp float factor; 

void main()
{
    lowp vec4 basecolor=texture2D(_MainTex,_maintex_uv);
    lowp float mask_a=texture2D(_Mask,_mask_uv).a;

    lowp vec3 tempcolor=v_color.rgb*basecolor.rgb;
    lowp float tempAlpha=clamp(basecolor.a*v_color.a*mask_a, 0.0, 1.0);  
    //gl_FragData[0]=vec4(tempcolor,tempAlpha);

    lowp vec4 tmpvar_3 = vec4(tempcolor,tempAlpha);
    lowp vec3 afterFog = mix(glstate_fog_color.rgb, tmpvar_3.rgb, factor);
    gl_FragData[0] = vec4(afterFog,tmpvar_3.a);
}
