/** 
 * 粒子系統示例
 */
class test_ParticleSystem implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr: gd3d.framework.assetMgr;

    async start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.astMgr = this.app.getAssetMgr();
        // await demoTool.loadbySync(`newRes/shader/shader.assetbundle.json`,this.astMgr);
        // await demoTool.loadbySync(`res/f14effprefab/customShader/customShader.assetbundle.json`,this.astMgr);
        //res/f14effprefab/customShader/customShader.assetbundle.json
        //
        this.init();
    }

    private init()
    {
        //相机-----------------------------------
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 120;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        let hoverc = this.camera.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)

        this.initParticleSystem();
    }

    private initParticleSystem()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "ParticleSystem";
        gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(1, 0, 0), -90, tran.localRotate);
        tran.localRotate = tran.localRotate;
        this.scene.addChild(tran);

        // 新建粒子材质
        var mat = new gd3d.framework.material("defparticle1");
        var shader = this.initParticleShader();
        mat.setShader(shader);

        var tex = this.astMgr.getDefaultTexture(gd3d.framework.defTexture.particle);
        mat.setTexture("_MainTex", tex);
        //
        let ps = tran.gameObject.getComponent("ParticleSystem") as gd3d.framework.ParticleSystem;
        if (!ps) ps = tran.gameObject.addComponent("ParticleSystem") as any;
        //
        ps.material = mat;
        // ps.mesh = this.astMgr.getDefaultMesh("cube");

        // gd3d.framework.serialization.setValue(ps, pd);

        //
        ps.colorOverLifetime.enabled = true;
        ps.colorOverLifetime.color.mode = gd3d.framework.MinMaxGradientMode.Gradient;
        ps.colorOverLifetime.color.gradient.colorKeys[0].color.setTo(1, 0, 0);
        ps.colorOverLifetime.color.gradient.colorKeys[1].color.setTo(0, 1, 0);

        //
        ps.play();
    }

    private initParticleShader()
    {
        var assetmgr = this.astMgr;
        var pool = this.astMgr.shaderPool;

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

    update(delta: number)
    {

    }

    vscode = `
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
    `;

    fscode = `
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