attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST;
uniform highp vec4 _asm_ST;
uniform highp vec4 _streamlight_ST;
uniform highp float _speedu;
uniform highp float _speedv;
uniform highp float glstate_timer;

varying highp vec2 _base_uv;
varying highp vec2 _asm_uv;
varying highp vec2 _light_uv;


void main()
{
	_base_uv = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw;
	_asm_uv = _glesMultiTexCoord0.xy * _asm_ST.xy + _asm_ST.zw;
	highp vec2 _speed;
    _speed = vec2(_speedu,_speedv);
    _light_uv = (_glesMultiTexCoord0.xy * _streamlight_ST.xy + _streamlight_ST.zw)  + _speed * glstate_timer;


	gl_Position = (glstate_matrix_mvp * vec4(_glesVertex.xyz, 1.0));
}

