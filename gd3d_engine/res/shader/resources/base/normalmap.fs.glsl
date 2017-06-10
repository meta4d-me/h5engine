
uniform sampler2D _MainTex;  
uniform sampler2D _NormalTex;   //normal map

uniform highp mat4 glstate_matrix_model;
uniform highp vec4 glstate_vec4_lightposs[8];
uniform highp vec4 glstate_vec4_lightdirs[8];
uniform highp float glstate_float_spotangelcoss[8];
uniform highp float glstate_lightcount;
varying lowp vec4 xlv_COLOR;     
varying highp vec3 xlv_Position;                                             
varying highp vec2 xlv_TEXCOORD0; 
varying highp mat3 TBNmat;
varying highp vec3 worldpos; 

highp float calcDiffuse(highp vec3 N,highp vec3 worldpos,highp vec4 lightPos,highp vec4 lightDir,highp float cosspot);
// highp mat3 cotangentFrame(vec3 normal,highp vec3 position,vec2 uv);

void main() 
{
	//切空间逆矩阵的计算 应该在vertex shader 里面完成，不需要dfdx 和 dfdy
	
	//mesh 算好切线tangent，然后 normal 和 tangent cross 出 bnormal
	//然后合成出切空间逆矩阵，放在这里算不划算
	highp mat3 TBN = TBNmat;//

    highp mat3 normalmat = mat3(glstate_matrix_model);

	highp vec3 N = normalize(TBNmat[2]*normalmat);

    highp float diff=0.0;

    //calcDiffuse(N,worldpos,glstate_vec4_lightposs[0],glstate_vec4_lightdirs[0],0.8);
    for(int i=0;i<8;i++)
    {        
        int c =int(glstate_lightcount);
        if(i>=c)break;
		highp vec4 lpos=glstate_vec4_lightposs[i];
		//lpos.xyz = TBN*lpos.xyz;
		highp vec4 ldir =glstate_vec4_lightdirs[i];
		//ldir.xyz = TBN*ldir.xyz;
		
		//这是进入切空间的原因
		highp vec3 normal;// = TBN*N;
		normal =  texture2D(_NormalTex, xlv_TEXCOORD0).xyz *2.0 -1.0;
        normal =normalize(normal);
		normal =TBN*(normal);

		
        diff += calcDiffuse(normal,worldpos,lpos,ldir,glstate_float_spotangelcoss[i]);
    }
	//diff=1.0;
	lowp vec4 color = vec4(diff,diff,diff,1.0);       

    lowp vec4 tmpvar_3;
    tmpvar_3 = (color * texture2D(_MainTex, xlv_TEXCOORD0));

    gl_FragData[0] = tmpvar_3;
}

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
