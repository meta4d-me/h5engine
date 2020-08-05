precision lowp float;
uniform lowp sampler2D _MainTex;

varying mediump vec2 xlv_TEXCOORD0;
varying highp vec4 v_color;

void main()
{
    //gl_FragData[0] = v_color;

    lowp vec4 basecolor = texture2D(_MainTex, xlv_TEXCOORD0);

    // if(basecolor.a < 0.01)
    //     discard;

    //lowp vec4 fristColor=basecolor*_MainColor * vec4(v_color.rgb, 1);
    //lowp vec4 emission = fristColor;
    lowp vec4 emission =  v_color * basecolor;
    // lowp vec4 emission =  basecolor * vec4(1.0,1.0,1.0,v_color.a);

    gl_FragData[0] = emission;
}