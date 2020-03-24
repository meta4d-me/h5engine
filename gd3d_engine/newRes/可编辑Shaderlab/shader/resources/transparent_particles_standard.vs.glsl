
precision mediump float;

attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec4 a_color;

uniform vec4 _MainTex_ST;

uniform vec2 _Panning;
uniform vec2 _Time;

uniform vec4 _NoiseTex_ST;
uniform vec4 _NoisePanning;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewProjection;

varying vec2 v_uv;
varying vec4 v_color;

uniform float EXTENDED_PARTICLES;
varying vec2 v_particledata;

uniform float NOISE_TEXTURE;
uniform float NOISEUV;
varying vec2 v_noiseuv;

void main() 
{
    vec3 position = a_position;
    gl_Position = u_viewProjection * u_modelMatrix * vec4(position, 1.0);
    v_uv = a_uv * _MainTex_ST.xy + _MainTex_ST.zw + (_Panning.xy * _Time.yy);
    // v_color = a_color;
    v_color = vec4(1.0,1.0,1.0,1.0);

    if(EXTENDED_PARTICLES > 0.5)
    {
        if( NOISE_TEXTURE > 0.5)
        {
            if( NOISEUV > 0.5)
            {
                v_noiseuv = a_uv * _NoiseTex_ST.xy + _NoiseTex_ST.zw + (_NoisePanning.xy * _Time.yy);
            }
            else
            {
                v_noiseuv = a_uv * _MainTex_ST.xy + _MainTex_ST.zw + (_NoisePanning.xy * _Time.yy);
            }
        }
    }
    else
    {
        // v_particledata = a_uv.zw;
        v_particledata = a_uv;
    }
}