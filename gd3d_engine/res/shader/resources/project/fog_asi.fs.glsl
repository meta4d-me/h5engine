uniform sampler2D _MainTex;  
uniform sampler2D _asm;
uniform sampler2D _streamlight;
uniform highp float _LightRate;
uniform highp vec4 _LightColor;
uniform highp float _emitpow;
uniform highp float _diffuse;
//uniform highp float _Cutoff;
uniform highp vec4 glstate_fog_color; 

varying highp float factor;   
varying highp vec2 _base_uv;
varying highp vec2 _asm_uv;
varying highp vec2 _light_uv;


void main() 
{
    if(texture2D(_asm,_asm_uv).r<0.5)
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

    lowp vec4 tmpvar_3 = vec4(d_color+e_color+light,1.0);
    lowp vec3 afterFog = mix(glstate_fog_color.rgb, tmpvar_3.rgb, factor);
    gl_FragData[0] = vec4(afterFog,tmpvar_3.a);
}

