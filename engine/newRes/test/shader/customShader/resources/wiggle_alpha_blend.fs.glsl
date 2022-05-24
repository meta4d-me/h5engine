uniform lowp sampler2D _MainTex;                                                                                                
varying highp vec2 xlv_TEXCOORD0;
//-------------------------------
uniform lowp float _ScrollX;
uniform lowp float _ScrollY;
uniform lowp float _WiggleScrollX;
uniform lowp float _WiggleScrollY;
uniform lowp float _WiggleStrength;
uniform lowp sampler2D _MaskTex;
uniform lowp sampler2D _WiggleTex;
//-------------------------------
uniform mediump float glstate_timer;
// uniform lowp float _Alpha;
// uniform lowp float _Superimposition;
#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif
void main() 
{
    mediump vec2 _Time = vec2(glstate_timer * 0.05 , glstate_timer);
    //Wiggle calculation
    mediump vec2 texCoord_0;
    mediump vec2 tmpvar_6 = fract((vec2(_WiggleScrollX,_WiggleScrollY) * _Time.xy));
    mediump vec2 uv_4 = (xlv_TEXCOORD0 + tmpvar_6);
    mediump vec4 tmpvar_7 = texture2D(_WiggleTex, uv_4);
    texCoord_0.x = (xlv_TEXCOORD0.x - (tmpvar_7.x * _WiggleStrength));
    texCoord_0.y = (xlv_TEXCOORD0.y + (tmpvar_7.z * _WiggleStrength));
    mediump vec2 tmpvar_9 = fract((vec2(_ScrollX,_ScrollY) * _Time.xy));
    texCoord_0 = (texCoord_0 + tmpvar_9);

    mediump vec4 emission = texture2D(_MainTex, texCoord_0);
    // emission.a = emission.a*_Alpha;
    // emission.xyz *= _Superimposition;
    //----------------------------------------------------------

    //mask 
    emission.w = texture2D(_MaskTex, texCoord_0).x;

    //---------------------------------------------------------
    #ifdef FOG
    emission.xyz= mix(glstate_fog_color.xyz, emission.xyz, factor);
    #endif
    gl_FragData[0] = emission;

}