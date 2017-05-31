uniform sampler2D _MainTex;


uniform highp vec4 glstate_vec4_lightposs[8];
uniform highp vec4 glstate_vec4_lightdirs[8];
uniform highp float glstate_float_spotangelcoss[8];

varying highp vec3 vWorldpos;
varying highp vec3 vNormal;
varying highp vec2 xlv_TEXCOORD0;
varying highp vec3 vEyepos;


//calcDiffuse 计算漫反射强度函数
//统一三种光源的传参方式，在函数内混合，方便就不高效
//只需要方向光时另写
//N 世界空间法线
//worldpos 世界空间pos
//lightPos 光源位置,w=0 表示方向光
//lightDir 光源方向，W=0 表示点光源，和楼上的w一起为1 表示 探照灯 spot
//cosspot cos(a) a为spot的半径 a取值0到90度，算好cos再传进来
highp float calcDiffuse(highp vec3 N,highp vec3 worldpos,highp vec4 lightPos,highp vec4 lightDir,highp float cosspot)
{
    //求入射角，点光源&聚光灯
    highp vec3 L = normalize(lightPos.xyz - worldpos); 
    //求张角 聚光灯 也是方向光入射角
    highp vec3 L2 = -lightDir.xyz;
    highp float dotSpot = dot(L,L2);
    //漫反射强度
    highp float diffuse =clamp(dot(N.xyz,L.xyz),0.0,1.0); 
    highp float diffuseD =clamp(dot(N.xyz,L2.xyz),0.0,1.0); 

    //pos.w 和 dir.w 至少有一个1，刚好组合出三种光源
    diffuse= mix(diffuse,diffuse*smoothstep(cosspot,1.0,dotSpot),lightDir.w);
    diffuse= mix(diffuseD,diffuse,lightPos.w);

    return diffuse;
}

highp float calSpec(highp vec3 worldpos,highp vec4 lightPos,highp vec4 lightDir)
{
   // highp vec3 ks=vec3(0.5,0.5,0.5);//物体对于反射光线的衰减系数
    highp float shininess=1.0;//高光系数
   // highp vec3 lightcolor=vec3(1.0,1.0,1.0);

    highp vec3 N=normalize(vNormal);

   // highp vec3 L = normalize(lightPos.xyz - worldpos); 
    highp vec3 L = normalize(-lightDir.xyz); 
    highp vec3 v=normalize(vEyepos-worldpos);
    highp vec3 H=normalize(L+v);
    //highp vec3 R=reflect(-L,N);
    //R=normalize(R);

    highp  float specularLight = pow(clamp(dot(N,H),0.0,1.0), shininess);

    //highp vec3 spec=ks*lightcolor*specularLight;
    highp float spec=specularLight;
    return spec;
}
void main() 
{
    highp float diff=0.0;
    highp float specularColor=0.0;
    for(int i=0;i<8;i++)
    {
        diff+=calcDiffuse(vNormal,vWorldpos,glstate_vec4_lightposs[i],glstate_vec4_lightdirs[i],glstate_float_spotangelcoss[i]);
        specularColor+=calSpec(vWorldpos,glstate_vec4_lightposs[i],glstate_vec4_lightdirs[i]);
    }
    lowp vec4 xlv_COLOR=vec4(diff,diff,diff,1.0);
    xlv_COLOR+=vec4(specularColor,specularColor,specularColor,1.0);

    lowp vec4 col_1;    
    mediump vec4 prev_2;
    lowp vec4 tmpvar_3;
    tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));

    prev_2 = tmpvar_3;
    mediump vec4 tmpvar_4;
    tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);
    col_1 = tmpvar_4;
    
   gl_FragData[0] = col_1;
    //gl_FragData[0]=vec4(specularColor,1.0);
    //gl_FragData[0] = xlv_COLOR;
}