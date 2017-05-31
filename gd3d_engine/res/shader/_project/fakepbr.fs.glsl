uniform sampler2D _albedo;
uniform sampler2D _normal;
uniform sampler2D _gloss;
uniform sampler2D _specular;
uniform sampler2D _opacity;
uniform lowp float _cutvalue;
uniform highp vec4 glstate_eyepos;
uniform highp vec4 glstate_vec4_lightposs[8];
uniform highp vec4 glstate_vec4_lightdirs[8];
uniform highp float glstate_float_spotangelcoss[8];

varying highp vec2 xlv_TEXCOORD0;
varying highp vec3 posWorld;
varying highp vec3 normalDir;
varying highp vec3 tangentDir;
varying highp vec3 bitangentDir;


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

highp float calcSpec(highp vec3 N,highp vec3 worldpos,highp vec3 eyedir,highp vec4 lightPos,highp vec4 lightDir,highp float cosspot)
{

    highp float shininess=30.0;//高光系数
    highp vec3 L = normalize(lightPos.xyz - worldpos); 
    highp vec3 L2 = -lightDir.xyz;
    highp float dotSpot = dot(L,L2);
    //三种光源 计算出三个 高光强度，然后根据条件选出一个
    highp float spec =pow(clamp(dot(N,normalize(L+eyedir)),0.0,1.0), shininess);
    highp float specD =pow(clamp(dot(N,normalize(L2+eyedir)),0.0,1.0), shininess);
    spec= mix(spec,spec*smoothstep(cosspot,1.0,dotSpot),lightDir.w);
    spec= mix(specD,spec,lightPos.w);

    //highp  float specularLight = pow(clamp(dot(N,H),0.0,1.0), shininess);

    return spec;
}

void main() 
{
    highp float _opacity_var = texture2D(_opacity,xlv_TEXCOORD0).g;
    if(_opacity_var<0.5)  discard;


    //clip(step(_cutvalue,_opacity_var) - 0.5);

    highp float diff=0.0;
    highp float specularPower=0.0;
    highp mat3 TBNmat = mat3( tangentDir, bitangentDir, normalDir);
    highp vec3 eyeDir =glstate_eyepos.xyz-posWorld;
    for(int i=0;i<8;i++)
    {
        highp vec3 normal;// = TBN*N;
		normal =  texture2D(_normal, xlv_TEXCOORD0).xyz *2.0 -1.0;
        normal =normalize(normal);
		normal =TBNmat*(normal);
        
        diff+=calcDiffuse(normal,posWorld,glstate_vec4_lightposs[i],glstate_vec4_lightdirs[i],glstate_float_spotangelcoss[i]);
        specularPower+=calcSpec(normal,posWorld,eyeDir,glstate_vec4_lightposs[i],glstate_vec4_lightdirs[i],glstate_float_spotangelcoss[i]);
    }

    //gloss //假的光洁度，只影响了高光
    mediump float Pi = 3.141592654;
    mediump float InvPi = 0.31830988618;
    mediump vec4 _gloss_var = texture2D(_gloss,xlv_TEXCOORD0);
    mediump float gloss = _gloss_var.r;
    mediump float specPow = exp2( gloss * 10.0+1.0);
    //spec //受到高光贴图的过滤
    highp float normTerm = (specPow + 8.0 ) / (8.0 * Pi);
    highp vec4 specularColor = texture2D(_specular,xlv_TEXCOORD0);
    highp float specularMonochrome = max( max(specularColor.r, specularColor.g), specularColor.b);
    specularColor*=pow(specularPower,specPow)*normTerm;
    //diffuse

    lowp vec4 diffuseColor= texture2D(_albedo, xlv_TEXCOORD0);//光照颜色
    diffuseColor *= 1.0-specularMonochrome;//均衡能量
    mediump vec3 directDiffuse = vec3(diff,diff,diff);//直接光照
    mediump vec3 indirectDiffuse = vec3(0.3,0.3,0.3);//间接光照

    lowp vec4 col_1;    
    mediump vec4 prev_2;
    lowp vec4 final = (diffuseColor*vec4(directDiffuse+indirectDiffuse,1.0)  + specularColor);

    gl_FragData[0] = final;

}