

precision highp float;



uniform sampler2D _MainTex;


varying vec4 color;
varying vec2 uv;

// #ifdef LIGHTMAP
// uniform lowp sampler2D _LightmapTex;
// varying mediump vec2 lightmap_TEXCOORD;
// lowp vec3 decode_hdr(lowp vec4 data)
// {
//     lowp float power =pow( 2.0 ,data.a * 255.0 - 128.0);
//     return data.rgb * power * 2.0 ;
// }
// #endif

// #ifdef FOG
// uniform lowp vec4 glstate_fog_color;
// varying lowp float factor;
// #endif

void main()
{
    vec4 emission = texture2D(_MainTex, uv);
    // lowp vec4 emission = lerp(tex2D(_MainTex, uv), tex2D(_NextTex, uv), _BlendValue);
    // if(emission.a < _AlphaCut)
    //     discard;

    // #ifdef LIGHTMAP
    // lowp vec4 lightmap = texture2D(_LightmapTex, lightmap_TEXCOORD);
    // emission.xyz *= decode_hdr(lightmap);
    // #endif





    // vec4 texcol = texture2D(_MainTex, uv);
    // texcol.a = 0.2 * abs(sin( 25. * (color.r + glstate_timer * 0.02) * 3.14159265359));

	// #ifdef FOG
    // emission.xyz = mix(glstate_fog_color.rgb, emission.rgb, factor);
	// #endif

    emission.a *= color.x;
    gl_FragData[0] = emission;

}