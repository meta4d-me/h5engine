
precision mediump float;  

//坐标属性
attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;
attribute vec4 _glesColor;

uniform mat4 glstate_matrix_mvp;

varying vec2 v_uv;


attribute vec3 a_particle_position;
attribute vec3 a_particle_scale;
attribute vec3 a_particle_rotation;
attribute vec4 a_particle_color;
attribute vec4 a_particle_tilingOffset;
attribute vec2 a_particle_flipUV;

uniform mat4 u_particle_billboardMatrix;

varying vec4 v_particle_color;

mat3 makeParticleRotationMatrix(vec3 rotation)
{
    float DEG2RAD = 3.1415926 / 180.0;
    
    float rx = rotation.x * DEG2RAD;
    float ry = rotation.y * DEG2RAD;
    float rz = rotation.z * DEG2RAD;

    float sinX = sin(rx);
    float cosX = cos(rx);
    float sinY = sin(ry);
    float cosY = cos(ry);
    float sinZ = sin(rz);
    float cosZ = cos(rz);

    mat3 tmp;
    float ce = cosY * cosZ;
    float cf = cosY * sinZ;
    float de = sinY * cosZ;
    float df = sinY * sinZ;

    float te0 = ce + df * sinX;
    float te4 = de * sinX - cf;
    float te8 = cosX * sinY;

    float te1 = cosX * sinZ;
    float te5 = cosX * cosZ;
    float te9 = - sinX;

    float te2 = cf * sinX - de;
    float te6 = df + ce * sinX;
    float te10 = cosX * cosY;

    tmp[0] = vec3(te0, te1, te2);
    tmp[1] = vec3(te4, te5, te6);
    tmp[2] = vec3(te8, te9, te10);
            
    return tmp;
}

vec4 particleAnimation(vec4 position) 
{
    mat3 billboardMatrix = mat3(u_particle_billboardMatrix[0].xyz,u_particle_billboardMatrix[1].xyz,u_particle_billboardMatrix[2].xyz);
    
    // 计算缩放
    position.xyz = position.xyz * a_particle_scale.xyz;

    // 计算旋转
    mat3 rMat = makeParticleRotationMatrix(a_particle_rotation.xyz);
    position.xyz = rMat * position.xyz;
    position.xyz = billboardMatrix * position.xyz;

    // 位移
    position.xyz = position.xyz + a_particle_position.xyz;

    // 颜色
    // v_particle_color = a_particle_color * _glesColor;
    v_particle_color = a_particle_color;

    if(a_particle_flipUV.x > 0.5) v_uv.x = 1.0 - v_uv.x;
    if(a_particle_flipUV.y > 0.5) v_uv.y = 1.0 - v_uv.y;
    v_uv = v_uv * a_particle_tilingOffset.xy + a_particle_tilingOffset.zw;
    
    return position;
}

void main() 
{
    vec4 position = vec4(_glesVertex.xyz, 1.0);
    //输出uv
    v_uv = _glesMultiTexCoord0.xy;

    position = particleAnimation(position);

    //计算投影坐标
    gl_Position = glstate_matrix_mvp * position;
}