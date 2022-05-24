precision highp float;

uniform float glstate_timer;

uniform lowp sampler2D _MainTex;
varying mediump vec2 xlv_TEXCOORD0;
varying vec4 data;



#ifdef LIGHTMAP
uniform lowp sampler2D _LightmapTex;
varying mediump vec2 lightmap_TEXCOORD;
lowp vec3 decode_hdr(lowp vec4 data)
{
    lowp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
    return data.rgb * power * 2.0 ;
}
#endif

// #ifdef FOG
// uniform lowp vec4 glstate_fog_color;
// varying lowp float factor;
// #endif

mediump float GetLuminance (mediump vec3 rgb)
{
     return (0.2126 * rgb.x) + (0.7152 * rgb.y) + (0.0722 * rgb.z);
}

void main()
{

    // ALBEDO_TEXTURE
    mediump vec4 tex = texture2D(_MainTex, xlv_TEXCOORD0);
    // if(albedo.a < _AlphaCut)
    //     discard;

// #if !LOW_END
    // NOTE: High End
    mediump float luminanceOverride = tex.a;
    mediump float shift = .5 * (1. + sin(mod(3.14159 * (.5 * glstate_timer + luminanceOverride), 3.14159)));
    shift /= 3. * GetLuminance(tex.rgb);
    shift -= .1;

    mediump float newLuminance = mix(1., shift, data.g);
    tex *= newLuminance;
    // NOTE: High End
// #endif

    #ifdef LIGHTMAP
    lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    albedo.xyz *= decode_hdr(lightmap);
    #endif

    gl_FragData[0] = data.r * tex;

}