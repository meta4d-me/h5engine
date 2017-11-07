uniform sampler2D _MainTex; 
uniform sampler2D _asm; 
uniform sampler2D _streamLight; 

uniform lowp float _diffuseRate;
uniform lowp float _speculerRate;
uniform lowp float _LightRate;
uniform mediump vec4 _LightColor;
uniform lowp float _alphaRate;

varying mediump vec2 _maintex_uv;
varying mediump vec2 _asm_uv;
varying mediump vec2 _light_uv;
varying highp vec3 normalDir;

void main()
{
    lowp vec4 asmcolor=texture2D(_MainTex,_asm_uv);
    if(asmcolor.a*_alphaRate<0.5)
    {
        discard;
    }
    lowp vec3 basecolor=texture2D(_MainTex,_maintex_uv).rgb;

    lowp vec3 mainTexcolor=basecolor*_diffuseRate;
    lowp vec3 specColor=basecolor*_speculerRate*asmcolor.g;

    lowp vec2 streamligtuv=normalDir.xy*0.5+_light_uv;
    lowp vec3 lightcolor=texture2D(_MainTex,streamligtuv).rgb;
    lightcolor=min(lightcolor,vec3(asmcolor.b))*_LightColor.rgb*_LightRate;
    
    gl_FragData[0]=vec4(mainTexcolor+specColor+lightcolor,1.0);
}