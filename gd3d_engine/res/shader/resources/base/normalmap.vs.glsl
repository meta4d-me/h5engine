
// in  attributes from our SpriteBatch
attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;
attribute vec4 _glesColor;
attribute vec3 _glesNormal;
attribute vec3 _glesTangent;  

uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;

// out  varyings to our fragment shader
varying highp vec4 xlv_COLOR;
varying highp vec3 xlv_Position;      
varying highp vec2 xlv_TEXCOORD0;

varying highp mat3 TBNmat;
varying highp vec3 worldpos;


highp mat3 calBTNMatrix(highp mat3 NormalMatToWorld,highp vec3 _normal,highp vec3 _tangent)
{
    highp vec3 normal=normalize(NormalMatToWorld*_normal);
    highp vec3 tangent=normalize(NormalMatToWorld*_tangent);
    highp vec3 binormal=cross(normal,tangent);
  	return (mat3(tangent,binormal,normal));

}
void main()
{
	//求世界空间法线
    mat3 normalmat = mat3(glstate_matrix_model);
	//normalmat[3] =vec4(0,0,0,1);

   	TBNmat=calBTNMatrix(normalmat,_glesNormal,_glesTangent);

	vec4 pos = glstate_matrix_model * vec4(_glesVertex.xyz, 1.0);
    worldpos = pos.xyz;
	//eyedir = glstate_eyepos - worldpos;

	xlv_COLOR = _glesColor;
	xlv_Position = _glesVertex.xyz;
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;
	gl_Position = pos;
}




