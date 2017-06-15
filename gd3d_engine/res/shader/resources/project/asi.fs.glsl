uniform sampler2D _MainTex;  
uniform sampler2D _asm;
uniform sampler2D _streamlight;
uniform highp float _LightRate;
uniform highp vec4 _LightColor;
uniform highp float _emitpow;
uniform highp float _diffuse;
uniform highp float _Cutoff;


varying highp vec2 _base_uv;
varying highp vec2 _asm_uv;
varying highp vec2 _light_uv;


void main() 
{
    if(texture2D(_asm,_asm_uv).r<_Cutoff)
    {
        discard;
    }
    highp vec3 baseTex=texture2D(_MainTex,_base_uv).rgb;

    highp float asi_g=texture2D(_asm,_asm_uv).g;

    highp vec3 d_color=baseTex*_diffuse;
    lowp vec3 e_color=baseTex*_emitpow*asi_g;
    
    lowp vec3 light = texture2D(_streamlight, _light_uv).rgb* _LightRate*_LightColor.xyz;
    lowp float maskv=texture2D(_asm,_asm_uv).b;
    lowp vec3 mask = vec3(maskv,maskv,maskv);
    light = min(light,mask);

    gl_FragData[0] = vec4(d_color+e_color+light,1.0);
}

