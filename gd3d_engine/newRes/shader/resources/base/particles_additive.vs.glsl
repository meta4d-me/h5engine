attribute highp vec4 _glesVertex;
attribute mediump vec4 _glesMultiTexCoord0;   
attribute lowp vec4 _glesColor;                   
uniform highp mat4 glstate_matrix_mvp;      

uniform highp vec3 a_particle_position;
uniform highp vec3 a_particle_scale;
uniform highp vec3 a_particle_rotation;
uniform highp vec4 a_particle_color;

uniform highp mat4 u_particle_billboardMatrix;

varying lowp vec4 xlv_COLOR;
varying mediump vec2 xlv_TEXCOORD0;           


mat3 makeParticleRotationMatrix(highp vec3 rotation)
{
    float DEG2RAD = 3.1415926 / 180.0;
    
    float rx = rotation.x * DEG2RAD;
    float ry = rotation.y * DEG2RAD;
    float rz = rotation.z * DEG2RAD;

    float sx = sin(rx);
    float cx = cos(rx);
    float sy = sin(ry);
    float cy = cos(ry);
    float sz = sin(rz);
    float cz = cos(rz);

    mat3 tmp;
    tmp[ 0 ] = vec3(cy * cz, cy * sz, -sy);
    tmp[ 1 ] = vec3(sx * sy * cz - cx * sz, sx * sy * sz + cx * cz, sx * cy);
    tmp[ 2 ] = vec3(cx * sy * cz + sx * sz, cx * sy * sz - sx * cz, cx * cy);
    return tmp;
}

vec4 particleAnimation(vec4 position) 
{
    // 计算缩放
    position.xyz = position.xyz * a_particle_scale;

    // 计算旋转
    mat3 rMat = makeParticleRotationMatrix(a_particle_rotation);
    position.xyz = rMat * position.xyz;
    position = u_particle_billboardMatrix * position;

    // 位移
    position.xyz = position.xyz + a_particle_position;

    // 颜色
    // v_particle_color = a_particle_color;

    return position;
}

void main()                                     
{                                               
    highp vec4 tmpvar_1;                        
    tmpvar_1.w = 1.0;
    tmpvar_1.xyz = _glesVertex.xyz;      

    // tmpvar_1 = particleAnimation(tmpvar_1);
           
    xlv_COLOR = _glesColor;
	xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;                     
    gl_Position = (glstate_matrix_mvp * tmpvar_1);  
}