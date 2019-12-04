class test_ParticleSystem_particles_additive_drawInstanced
{
    static initShader(assetmgr: gd3d.framework.assetMgr, pool: gd3d.render.shaderPool)
    {
        pool.compileVS(assetmgr.webgl, "particles_additive1", this.vscode);
        pool.compileFS(assetmgr.webgl, "particles_additive1", this.fscode);
        var program = pool.linkProgram(assetmgr.webgl, "particles_additive1", "particles_additive1");

        var sh = new gd3d.framework.shader("shader/particles_additive1");
        sh.defaultAsset = true;
        sh.passes["base"] = [];
        var p = new gd3d.render.glDrawPass();
        p.setProgram(program);
        sh.passes["base"].push(p);
        sh.fillUnDefUniform(p);
        p.state_ztest = true;
        p.state_ztest_method = gd3d.render.webglkit.LEQUAL;
        p.state_zwrite = false;
        p.state_showface = gd3d.render.ShowFaceStateEnum.ALL;
        p.setAlphaBlend(gd3d.render.BlendModeEnum.Add);
        assetmgr.mapShader[sh.getName()] = sh;

        return sh;
    }

    static vscode = `
    precision mediump float;  

    //坐标属性
    attribute vec3 _glesVertex;
    attribute vec2 _glesMultiTexCoord0;
    attribute vec4 _glesColor;
    
    uniform mat4 glstate_matrix_mvp;
    
    varying vec2 v_uv;
    
    //
    attribute vec4 a_particle_position;
    attribute vec4 a_particle_scale;
    attribute vec4 a_particle_rotation;
    attribute vec4 a_particle_color;
    attribute vec4 a_particle_tilingOffset;
    attribute vec4 a_particle_flipUV;
    
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
        v_particle_color = a_particle_color * _glesColor;
    
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
    
        particleAnimation(position);
        // position = particleAnimation(position);
    
        //计算投影坐标
        gl_Position = glstate_matrix_mvp * position;
    }
    `;

    static fscode = `
    precision mediump float;

    varying vec2 v_uv;
    
    uniform vec4 _TintColor;
    uniform sampler2D _MainTex;
    uniform vec4 _MainTex_ST;
    
    varying vec4 v_particle_color;
    
    vec4 particleAnimation(vec4 color) {
    
        color.xyz = color.xyz * v_particle_color.xyz;
        color.xyz = color.xyz * v_particle_color.www;
        return color;
    }
    
    void main()
    {
        vec4 finalColor = vec4(1.0, 1.0, 1.0, 1.0);
    
        finalColor = particleAnimation(finalColor);
    
        vec2 uv = v_uv;
        uv = uv * _MainTex_ST.xy + _MainTex_ST.zw;
        finalColor = 2.0 * finalColor * _TintColor * texture2D(_MainTex, uv);
    
        gl_FragColor = finalColor;
    }
    `;

}