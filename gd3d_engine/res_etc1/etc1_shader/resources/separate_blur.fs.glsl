uniform sampler2D _MainTex;

varying highp vec2 uv;
varying highp vec4 uv01;
varying highp vec4 uv23;
varying highp vec4 uv45;



vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

void main() 
{
    lowp vec4 color=vec4(0,0,0,0);
    color+=0.4*texture2DEtC1(_MainTex, uv.xy);
    color+=0.15*texture2DEtC1(_MainTex, uv01.xy);
    color+=0.15*texture2DEtC1(_MainTex, uv01.zw);
    color+=0.10*texture2DEtC1(_MainTex, uv23.xy);
    color+=0.10*texture2DEtC1(_MainTex, uv23.zw);
    color+=0.05*texture2DEtC1(_MainTex, uv45.xy);
    color+=0.05*texture2DEtC1(_MainTex, uv45.zw);

    gl_FragData[0] = color;
}
