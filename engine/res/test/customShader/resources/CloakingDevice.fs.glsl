precision highp float;

#define SHADER_NAME CloakingDevice

varying vec4 color;


void main()
{

    gl_FragData[0] = color;

}