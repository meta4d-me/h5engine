attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST;
uniform highp vec4 _asm_ST;
uniform highp vec4 _streamlight_ST;
uniform highp float _speedu;
uniform highp float _speedv;
uniform highp float glstate_timer;
uniform highp float _Start;
uniform highp float _End;

varying highp float factor;
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


	highp vec4 pos = (glstate_matrix_mvp * vec4(_glesVertex.xyz, 1.0));
    factor = (_End - abs(pos.z))/(_End - _Start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}

