uniform sampler2D _MainTex;
uniform lowp float _AlphaCut;
uniform highp vec4 _Color;  
varying highp vec2 xlv_TEXCOORD0;
varying highp float factor;    
void main() 
{
    lowp vec4 tmpvar_3 = texture2D(_MainTex, xlv_TEXCOORD0);
    lowp vec3 afterFog = mix(_Color.rgb, tmpvar_3.rgb, factor);
    // tmpvar_3 = tmpvar_3 * factor + _Color * (1.0-factor);
    if(tmpvar_3.a < _AlphaCut)
        discard;
    gl_FragData[0] = vec4(afterFog,tmpvar_3.z);
}