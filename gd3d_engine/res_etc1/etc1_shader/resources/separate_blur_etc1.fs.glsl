uniform sampler2D _MainTex;

varying highp vec2 uv;
varying highp vec4 uv01;
varying highp vec4 uv23;
varying highp vec4 uv45;



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
    lowp vec4 color=vec4(0,0,0,0);
    color+=0.4*texture2DEtC1(_MainTex, uv.xy);
    color+=0.15*texture2D(_MainTex, uv01.xy);
    color+=0.15*texture2D(_MainTex, uv01.zw);
    color+=0.10*texture2D(_MainTex, uv23.xy);
    color+=0.10*texture2D(_MainTex, uv23.zw);
    color+=0.05*texture2D(_MainTex, uv45.xy);
    color+=0.05*texture2D(_MainTex, uv45.zw);

    gl_FragData[0] = color;
}
