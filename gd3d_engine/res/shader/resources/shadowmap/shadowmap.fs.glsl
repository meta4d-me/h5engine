#ifdef GL_FRAGMENT_PRECISION_HIGH  
precision highp float;  
#else  
precision mediump float;  
#endif 

uniform sampler2D _MainTex;
uniform sampler2D _Light_Depth;

uniform float _AlphaCut;

varying highp vec2 xlv_TEXCOORD0;
varying highp vec4 _WorldPos;


const float UnpackDownscale = 255. / 256.; 
const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256.,  256.);
const vec4 UnpackFactors = UnpackDownscale / vec4(PackFactors, 1.);


float unpackRGBAToDepth(const in vec4 v) 
{
    return dot(v, UnpackFactors);
}

float GetShadowAtten() {
	float shadowDepth = unpackRGBAToDepth(texture2D(_Light_Depth, _WorldPos.xy));
	return _WorldPos.z <= shadowDepth ? 1.0 : 0.1;
}

void main() 
{
    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);
	tmpvar_3 = tmpvar_3 * GetShadowAtten();
    gl_FragData[0] = tmpvar_3;
}