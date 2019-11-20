precision mediump float;  

//坐标属性
attribute vec3 _glesVertex;
attribute vec2 _glesMultiTexCoord0;
attribute vec4 _glesColor;

uniform mat4 glstate_matrix_mvp;

varying vec2 v_uv;

//
uniform vec4 a_particle_position;
uniform vec4 a_particle_scale;
uniform vec4 a_particle_rotation;
uniform vec4 a_particle_color;

#ifdef ENABLED_PARTICLE_SYSTEM_textureSheetAnimation
    uniform vec4 a_particle_tilingOffset;
    uniform vec2 a_particle_flipUV;
#endif

uniform mat4 u_particle_billboardMatrix;

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
    position.xyz = position.xyz * a_particle_scale.xyz;

    // 计算旋转
    mat3 rMat = makeParticleRotationMatrix(a_particle_rotation.xyz);
    position.xyz = rMat * position.xyz;
    position = u_particle_billboardMatrix * position;

    // 位移
    position.xyz = position.xyz + a_particle_position.xyz;

    // 颜色
    v_particle_color = a_particle_color * _glesColor;

    #ifdef ENABLED_PARTICLE_SYSTEM_textureSheetAnimation
        if(a_particle_flipUV.x > 0.5) v_uv.x = 1.0 - v_uv.x;
        if(a_particle_flipUV.y > 0.5) v_uv.y = 1.0 - v_uv.y;
        v_uv = v_uv * a_particle_tilingOffset.xy + a_particle_tilingOffset.zw;
    #endif
    
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