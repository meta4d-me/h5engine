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

        let mat_white = new gd3d.framework.material("white");
        mat_white.setShader(this.astMgr.getShader("shader/def"));
        mat_white.setVector4("_MainColor", new gd3d.math.vector4(1, 1, 1, 1));

        let tran = new gd3d.framework.transform();
        tran.localScale.x = 20;
        tran.localScale.y = 0.01;
        tran.localScale.z = 20;
        this.scene.addChild(tran);

        let mf = tran.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        if (!mf) mf = tran.gameObject.addComponent("meshFilter") as any;
        let mr = tran.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        if (!mr) mr = tran.gameObject.addComponent("meshRenderer") as any;
        mr.materials[0] = mat_white;
        mf.mesh = this.astMgr.getDefaultMesh("cube");


        this.initParticleSystem();
    }

    private initParticleSystem()
    {
        let tran = new gd3d.framework.transform();
        tran.name = "ParticleSystem";
        this.scene.addChild(tran);

        // 新建粒子材质
        var mat = new gd3d.framework.material("defparticle1");
        var shader = this.initParticleShader();
        mat.setShader(shader);
        var tex = this.astMgr.getDefaultTexture("grid");
        mat.setTexture("_MainTex", tex);
        //
        let ps = tran.gameObject.getComponent("ParticleSystem") as gd3d.framework.ParticleSystem;
        if (!ps) ps = tran.gameObject.addComponent("ParticleSystem") as any;
        //
        ps.material = mat;
        // ps.mesh = this.astMgr.getDefaultMesh("cube");
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
        //sh._parseProperties(assetmgr,JSON.parse(this.shader0).properties);
        p.state_ztest = true;
        p.state_ztest_method = gd3d.render.webglkit.LEQUAL;
        p.state_zwrite = true;
        p.state_showface = gd3d.render.ShowFaceStateEnum.CCW;
        p.setAlphaBlend(gd3d.render.BlendModeEnum.Close);
        //p.uniformTexture("_MainTex", null);
        assetmgr.mapShader[sh.getName()] = sh;

        return sh;
    }

    update(delta: number)
    {

    }


    vscode = `
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
    `;

    fscode = `
    precision mediump float;

    varying vec2 v_uv;
    
    uniform vec4 u_tintColor;
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
        finalColor = 2.0 * finalColor * u_tintColor * texture2D(_MainTex, uv);
    
        gl_FragColor = finalColor;
    }
    `;
}