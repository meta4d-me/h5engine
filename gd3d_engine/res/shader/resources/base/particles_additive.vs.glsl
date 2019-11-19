precision mediump float;  

//坐标属性
attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat4 u_modelMatrix;
uniform mat4 u_ITModelMatrix;
uniform mat4 u_viewProjection;

varying vec2 v_uv;

//
attribute vec3 a_particle_position;
attribute vec3 a_particle_scale;
attribute vec3 a_particle_rotation;
attribute vec4 a_particle_color;

#ifdef ENABLED_PARTICLE_SYSTEM_textureSheetAnimation
    attribute vec4 a_particle_tilingOffset;
    attribute vec2 a_particle_flipUV;
#endif

uniform mat3 u_particle_billboardMatrix;

varying vec4 v_particle_color;

mat3 makeParticleRotationMatrix(vec3 rotation)
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
    position.xyz = u_particle_billboardMatrix * position.xyz;

    // 位移
    position.xyz = position.xyz + a_particle_position;

    // 颜色
    v_particle_color = a_particle_color;

    #ifdef ENABLED_PARTICLE_SYSTEM_textureSheetAnimation
        if(a_particle_flipUV.x > 0.5) v_uv.x = 1.0 - v_uv.x;
        if(a_particle_flipUV.y > 0.5) v_uv.y = 1.0 - v_uv.y;
        v_uv = v_uv * a_particle_tilingOffset.xy + a_particle_tilingOffset.zw;
    #endif
    
    return position;
}

void main() 
{
    vec4 position = vec4(a_position, 1.0);
    //输出uv
    v_uv = a_uv;
    
    position = particleAnimation(position);

    //获取全局坐标
    vec4 worldPosition = u_modelMatrix * position;
    //计算投影坐标
    gl_Position = u_viewProjection * worldPosition;
}