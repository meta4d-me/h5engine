attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;

uniform highp mat4 glstate_matrix_mvp;
uniform highp vec4 _MainTex_ST;
uniform highp float _speedu;
uniform highp float _speedv;
uniform highp float glstate_timer;
uniform highp float glstate_fog_start;
uniform highp float glstate_fog_end;

varying highp float factor;
varying highp vec2 _base_uv;


void main()
{
    highp vec2 _speed= vec2(_speedu,-_speedv);
	_base_uv = _glesMultiTexCoord0.xy * _MainTex_ST.xy + _MainTex_ST.zw+ _speed * glstate_timer;

	highp vec4 pos = (glstate_matrix_mvp * vec4(_glesVertex.xyz, 1.0));
    factor = (glstate_fog_end - abs(pos.z))/(glstate_fog_end - glstate_fog_start); 
    factor = clamp(factor, 0.0, 1.0);  
    gl_Position = pos;
}
