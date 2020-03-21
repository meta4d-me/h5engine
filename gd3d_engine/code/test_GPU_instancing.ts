
let testSh_vs = `
        attribute vec3 _glesNormal;
        attribute vec4 _glesVertex;
        attribute vec4 _glesColor;
        attribute vec4 _glesMultiTexCoord0;

        attribute vec4 a_particle_color;

        attribute highp vec4 instance_offset_matrix_0;
        attribute highp vec4 instance_offset_matrix_1;
        attribute highp vec4 instance_offset_matrix_2;
        attribute highp vec4 instance_offset_matrix_3;

        uniform highp mat4 glstate_matrix_mvp;
        varying lowp vec4 xlv_COLOR;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec3 aaa = _glesNormal;

            highp mat4 instance_offset_matrix = mat4(instance_offset_matrix_0,instance_offset_matrix_1,instance_offset_matrix_2,instance_offset_matrix_3);
            highp vec4 tmpvar_1;
            tmpvar_1.w = _glesNormal.x;
            tmpvar_1.w = 1.0;
            tmpvar_1.xyz = _glesVertex.xyz;
            tmpvar_1 = instance_offset_matrix * tmpvar_1;
            xlv_COLOR = a_particle_color;
            // xlv_COLOR = _glesColor - a_particle_color;
            xlv_TEXCOORD0 = _glesMultiTexCoord0.xy;
            gl_Position = (glstate_matrix_mvp * tmpvar_1);
        }
`;

let testSh_fs = `
        uniform sampler2D _MainTex;
        varying lowp vec4 xlv_COLOR;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 col_1;
            mediump vec4 prev_2;
            lowp vec4 tmpvar_3;
            tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));
            prev_2 = tmpvar_3;
            mediump vec4 tmpvar_4;
            tmpvar_4 = mix(vec4(1.0, 1.0, 1.0, 1.0), prev_2, prev_2.wwww);
            col_1 = tmpvar_4;
            col_1.x =xlv_TEXCOORD0.x;
            col_1.y =xlv_TEXCOORD0.y;
            //gl_FragData[0] = col_1;
            tmpvar_3 = xlv_COLOR;
            // tmpvar_3.x = 1.0;
            gl_FragData[0] = tmpvar_3;
        }
`;


/** GPU 实例渲染模式  */
class test_GPU_instancing implements IState
{
    _app : gd3d.framework.application;
    _scene: gd3d.framework.scene;
    _mat: gd3d.framework.material;
    _mat_ins: gd3d.framework.material;
    private shBase : gd3d.framework.shader;
    private instanceShBase : gd3d.framework.shader;
    start(app: gd3d.framework.application)
    {
        let scene = this._scene = app.getScene();
        this._app = app;
        //initCamera
        let objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0);

        this.initMaterails();

        //绘制xx  个物体
        let xx = 100;
        let count = 0;
        while (count < xx)
        {
            this.createOne(app,true);
            count++;
        }

        //
        app.showDrawCall();
        app.showFps();
    }

    initMaterails(){
       //new a _mat
       this._mat = new gd3d.framework.material("base");
       this._mat_ins = new gd3d.framework.material("GPU_Instancing");
       // this._mat.setShader();

       this.instanceShBase = this.makeShader(this._app.getAssetMgr(),testSh_vs,testSh_fs,"instance_base");
       this.shBase = this.makeShader(this._app.getAssetMgr(),testSh_vs,testSh_fs);

       this._mat_ins.setShader(this.instanceShBase);
       this._mat_ins.enableGpuInstancing = true;

       this._mat.setShader(this.shBase);

    }



    private makeShader(assetmgr: gd3d.framework.assetMgr, vs: string, fs: string , passId = "base"){
        //shader
        var pool = assetmgr.shaderPool;
        pool.compileVS(assetmgr.webgl, "gpuInstancing", vs);
        pool.compileFS(assetmgr.webgl, "gpuInstancing", fs);
        var program = pool.linkProgram(assetmgr.webgl, "gpuInstancing", "gpuInstancing");
        //set materail
        var sh = new gd3d.framework.shader("shader/gpuInstancing");
        sh.defaultAsset = true;
        sh.passes[passId] = [];
        var p = new gd3d.render.glDrawPass();
        p.setProgram(program);
        sh.passes[passId].push(p);
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

    createOne(app , needInstance : boolean = true)
    {
        let obj = gd3d.framework.TransformUtil.CreatePrimitive(gd3d.framework.PrimitiveType.Cube, app);
        this._scene.addChild(obj);
        let range = 10;
        gd3d.math.vec3Set(obj.localPosition, this.getRandom(range), this.getRandom(range), this.getRandom(range));
        //change materail
        let mr = obj.gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
        let mat = needInstance ? this._mat_ins : this._mat;
        mr.materials[0] = mat.clone();
        mr.materials[0].setVector4("a_particle_color",new gd3d.math.vector4(Math.random(),Math.random(),Math.random(),1));
    }

    private getRandom(range: number)
    {
        return range * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    }

    update(delta: number)
    {


    }
}