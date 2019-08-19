precision highp float;



uniform sampler2D _MainTex;
uniform sampler2D _NextTex;
uniform float _BlendValue;

varying vec2 uv;


#ifdef LIGHTMAP
uniform lowp sampler2D _LightmapTex;
varying mediump vec2 lightmap_TEXCOORD;
lowp vec3 decode_hdr(lowp vec4 data)
{
    lowp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
    return data.rgb * power * 2.0 ;
}
#endif

#ifdef FOG
uniform lowp vec4 glstate_fog_color;
varying lowp float factor;
#endif

void main()
{
    vec4 emission = mix(texture2D(_MainTex, uv), texture2D(_NextTex, uv), _BlendValue);

    // #ifdef LIGHTMAP
    // lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    // emission.xyz *= decode_hdr(lightmap);
    // #endif

    // #ifdef FOG
    // emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
    // #endif

    gl_FragData[0] = emission;

}