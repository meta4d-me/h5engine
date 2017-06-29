uniform sampler2D _MainTex;
uniform sampler2D _LightTex;
uniform lowp vec4 _LightColor;
uniform lowp float _LightRate;
uniform sampler2D _MaskTex;
uniform lowp float _AlphaCut;
uniform highp vec4 glstate_fog_color; 

varying highp float factor;  
varying highp vec2 xlv_TEXCOORD0;
varying highp vec2 _StreamLightUV;
void main() 
{
    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);
    if(tmpvar_3.a < _AlphaCut)
        discard;

    lowp vec4 light = texture2D(_LightTex, _StreamLightUV) * _LightColor * _LightRate;
    lowp vec4 mask = texture2D(_MaskTex, xlv_TEXCOORD0);
    light = min(light,mask);

    tmpvar_3.rgb += light.rgb;
    
    lowp vec3 afterFog = mix(glstate_fog_color.rgb, tmpvar_3.rgb, factor);
    gl_FragData[0] = vec4(afterFog,tmpvar_3.a);
}