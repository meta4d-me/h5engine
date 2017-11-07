
attribute highp vec3 _glesVertex;
attribute highp vec3 _glesNormal;
attribute mediump vec2 _glesMultiTexCoord0;

uniform lowp float glstate_timer;
uniform highp mat4 glstate_matrix_mvp;
uniform highp mat4 glstate_matrix_model;

uniform mediump vec4 _MainTex_ST;
uniform mediump vec4 _asm_ST;
uniform mediump vec4 _streamLight_ST;

uniform float _speedu;
uniform float _speedv;

varying mediump vec2 _maintex_uv;
varying mediump vec2 _asm_uv;
varying mediump vec2 _light_uv;
varying highp vec3 normalDir;


uniform lowp float glstate_fog_start;
uniform lowp float glstate_fog_end;
varying lowp float factor;

void main()
{
	_maintex_uv = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
	_asm_uv = _glesMultiTexCoord0.xy * _asm_ST.xy + _asm_ST.zw;
	lowp vec2 _speed= vec2(_speedu,_speedv);
    _light_uv = (_glesMultiTexCoord0.xy * _streamLight_ST.xy + _streamLight_ST.zw)  + _speed * glstate_timer;

    normalDir=mat3(glstate_matrix_model)*_glesVertex.xyz;


	highp vec4 pos = (glstate_matrix_mvp * vec4(_glesVertex.xyz, 1.0));
    factor = (glstate_fog_end - abs(pos.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}
