uniform lowp sampler2D _MainTex;                                                                                                
varying highp vec2 xlv_TEXCOORD0;

lowp float f_Alpha;
lowp float f_Superimposition;
#ifdef INSTANCE
varying lowp float v_Alpha;
varying lowp float v_Superimposition;
#else
uniform lowp float _Alpha;
uniform lowp float _Superimposition;
#endif

#ifdef FOG
uniform lowp vec4 glstate_fog_color; 
varying lowp float factor;
#endif

void main() 
{
    #ifdef INSTANCE
        f_Alpha = v_Alpha;
        f_Superimposition = v_Superimposition;
    #else
        f_Alpha = _Alpha;
        f_Superimposition = _Superimposition;
    #endif

    lowp vec4 emission = texture2D(_MainTex, xlv_TEXCOORD0);
    emission.a=emission.a * f_Alpha;
    emission.xyz *= f_Superimposition;
    //----------------------------------------------------------
    #ifdef FOG
    emission.xyz= mix(glstate_fog_color.xyz, emission.xyz, factor);
    #endif
    gl_FragData[0] = emission;

}