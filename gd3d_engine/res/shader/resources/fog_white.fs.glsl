uniform highp vec4 _Color; 

varying highp float factor; 
void main() 
{
    lowp vec4 tmpvar_3 = vec4(1.0, 1.0, 1.0, 1.0);
    lowp vec3 afterFog = mix(_Color.rgb, tmpvar_3.xyz, factor);
    gl_FragData[0] = vec4(afterFog,tmpvar_3.w);
}