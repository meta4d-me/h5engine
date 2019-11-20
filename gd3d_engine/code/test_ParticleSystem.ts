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
    attribute highp vec4 _glesVertex;
    attribute mediump vec4 _glesMultiTexCoord0;   
    attribute lowp vec4 _glesColor;                   
    uniform highp mat4 glstate_matrix_mvp;      
    varying lowp vec4 xlv_COLOR;
    varying mediump vec2 xlv_TEXCOORD0;                
    void main()                                     
    {                                               
        highp vec4 tmpvar_1;                        
        tmpvar_1.w = 1.0;
        tmpvar_1.xyz = _glesVertex.xyz;             
        xlv_COLOR = _glesColor;
        xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;                     
        gl_Position = (glstate_matrix_mvp * tmpvar_1);  
    }
    `;

    fscode = `
    uniform mediump sampler2D _MainTex;
    uniform lowp vec4 _TintColor;
    varying lowp vec4 xlv_COLOR;
    varying mediump vec2 xlv_TEXCOORD0;          
    void main() 
    {
        lowp vec4 tmpvar_3 = xlv_COLOR*_TintColor*texture2D(_MainTex, xlv_TEXCOORD0);
        gl_FragData[0] = 4.0*tmpvar_3;
    }
    `;
}