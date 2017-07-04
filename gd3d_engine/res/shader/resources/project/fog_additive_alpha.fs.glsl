uniform sampler2D _MainTex;  
uniform highp vec4 _MainColor;
uniform highp float _alpha;
varying highp vec2 _base_uv;

uniform highp vec4 glstate_fog_color; 
varying highp float factor; 
void main() 
{
    lowp vec4 tmpvar_3 = texture2D(_MainTex, _base_uv)*_MainColor;
    highp float alpha=_alpha*tmpvar_3.a;
    lowp vec3 afterFog = mix(glstate_fog_color.rgb, tmpvar_3.rgb, factor);
    gl_FragData[0] = vec4(afterFog,alpha);
}