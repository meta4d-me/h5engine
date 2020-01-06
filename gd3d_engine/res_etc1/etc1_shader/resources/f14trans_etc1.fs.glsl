uniform mediump sampler2D _Main_Tex;

varying lowp vec4 xlv_COLOR;
varying mediump vec2 xlv_TEXCOORD0;       


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
    lowp vec4 basecolor = texture2DEtC1(_Main_Tex, xlv_TEXCOORD0);
    gl_FragData[0] =basecolor*xlv_COLOR;
    //gl_FragData[0] =vec4(1,0,0,1);
}