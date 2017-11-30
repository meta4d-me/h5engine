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
varying mediump vec3 lightDir;

//varying lowp float light2dot;
varying mediump	float angle;
uniform lowp float _light2_area;
uniform lowp float _Light2Rate;
uniform mediump vec4 _Light2Color;

void main()
{
    lowp vec4 asmcolor=texture2D(_asm,_asm_uv);
    lowp vec4 basecolor=texture2D(_MainTex,_maintex_uv);
    if(basecolor.a*_alphaRate<0.5)
    {
        discard;
    }
    lowp vec3 mainTexcolor=basecolor.rgb*_diffuseRate;
    lowp vec3 specColor=basecolor.rgb*_speculerRate*asmcolor.g;
    lowp vec2 streamligtuv=normalDir.xy*0.5+_light_uv;
    lowp vec3 lightcolor=texture2D(_streamLight,streamligtuv).rgb;


    lightcolor=min(vec3(asmcolor.b),lightcolor)*_LightColor.rgb*_LightRate;

    lowp vec3 lightDir=vec3(cos(angle),0.0,sin(angle));
    highp vec3 normalxz=normalize(vec3(normalDir.x,0,normalDir.z));
    lowp vec3 lightcolor2=vec3(pow(max(dot(normalxz,lightDir),0.0),_light2_area))*_Light2Rate*_Light2Color.rgb;
    
    gl_FragData[0]=vec4(mainTexcolor+specColor+lightcolor+lightcolor2,1.0);
    //gl_FragData[0]=vec4(normalDir,1.0);
}