class test_ShadowMap implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    renderer: gd3d.framework.meshRenderer[];
    skinRenders: gd3d.framework.skinnedMeshRenderer[];
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        let name = "baihu";
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                this.app.getAssetMgr().load("res/scenes/testshadowmap/testshadowmap.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto,
                    (s) =>
                    {
                        if (s.isfinish)
                        {
                            var _scene: gd3d.framework.rawscene = this.app.getAssetMgr().getAssetByName("testshadowmap.scene.json") as gd3d.framework.rawscene;
                            var _root = _scene.getSceneRoot();
                            this.scene.addChild(_root);
                            this.scene.getRoot().markDirty();

                            let _aabb = this.app.getScene().getRoot().aabbchild;
                            console.log(_aabb.maximum + " : " + _aabb.minimum);
                            this.FitToScene(this.lightcamera,_aabb);
                            this.ShowCameraInfo(this.lightcamera);

                            var depth = new gd3d.framework.cameraPostQueue_Depth();
                            depth.renderTarget = new gd3d.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                            this.lightcamera.postQueues.push(depth);
                            
                            this.depthTexture = new gd3d.framework.texture("_depth");
                            this.depthTexture.glTexture = depth.renderTarget;
                            gd3d.framework.shader.setGlobalTexture ("_Light_Depth",this.depthTexture);
                        }
                    });
            }
        });

        //添加一个摄像机
        var lightCamObj = new gd3d.framework.transform();
        lightCamObj.name = "LightCamera";
        this.scene.addChild(lightCamObj);
        lightCamObj.localTranslate = new gd3d.math.vector3(10,10,-10);
        this.lightcamera = lightCamObj.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.lightcamera.opvalue = 0;
        this.lightcamera.gameObject.transform.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        lightCamObj.markDirty();//标记为需要刷新


        var viewCamObj = new gd3d.framework.transform();
        viewCamObj.name = "ViewCamera";
        this.scene.addChild(viewCamObj);
        viewCamObj.localTranslate = new gd3d.math.vector3(10,10,10);
        viewCamObj.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        this.viewcamera = viewCamObj.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.viewcamera.backgroundColor = new gd3d.math.color(1, 0.11, 0.11, 1.0);

        viewCamObj.markDirty();
        this.ShowUI();
    }

    lightcamera: gd3d.framework.camera;//方向光的camera
    depthTexture:gd3d.framework.texture;//方向光的camera生成的深度图

    viewcamera:gd3d.framework.camera;//视图camera

    timer: number = 0;

    posToUV:gd3d.math.matrix = new gd3d.math.matrix();
    lightProjection:gd3d.math.matrix = new gd3d.math.matrix();

    update(delta: number)
    {
        this.posToUV.rawData[0] = 0.5;
        this.posToUV.rawData[1] = 0.0;
        this.posToUV.rawData[2] = 0.0;
        this.posToUV.rawData[3] = 0.0;

        this.posToUV.rawData[4] = 0.0;
        this.posToUV.rawData[5] = 0.5;
        this.posToUV.rawData[6] = 0.0;
        this.posToUV.rawData[7] = 0.0;

        this.posToUV.rawData[8] = 0.0;
        this.posToUV.rawData[9] = 0.0;
        this.posToUV.rawData[10] = 1.0;
        this.posToUV.rawData[11] = 0.0;

        this.posToUV.rawData[12] = 0.5;
        this.posToUV.rawData[13] = 0.5;
        this.posToUV.rawData[14] = 0.0;
        this.posToUV.rawData[15] = 1.0;
        

        let worldToView:gd3d.math.matrix = gd3d.math.pool.new_matrix();
        this.lightcamera.calcViewMatrix(worldToView);

        var vpp = new gd3d.math.rect();
        this.lightcamera.calcViewPortPixel(this.app, vpp);
        var asp = vpp.w / vpp.h;
        let projection:gd3d.math.matrix = gd3d.math.pool.new_matrix();
        this.lightcamera.calcProjectMatrix(asp,projection);

        gd3d.math.matrixMultiply(projection,worldToView,this.lightProjection);
        gd3d.math.matrixMultiply(this.posToUV,this.lightProjection,this.lightProjection);
        gd3d.framework.shader.setGlobalMatrix("_LightProjection", this.lightProjection);
    }

    FitToScene(lightCamera:gd3d.framework.camera,aabb:gd3d.framework.aabb)
	{
		lightCamera.gameObject.transform.setWorldPosition(new gd3d.math.vector3(aabb.center.x, aabb.center.y, aabb.center.z));

        let _vec3 = gd3d.math.pool.new_vector3();
        gd3d.math.vec3Subtract(aabb.maximum,aabb.minimum,_vec3);

		let maxLength = gd3d.math.vec3Length(_vec3);

		lightCamera.size = maxLength/2;
		lightCamera.near = -maxLength/2;
		lightCamera.far  = maxLength/2;
        
	}

    labelNear:HTMLLabelElement;
    labelFar:HTMLLabelElement;
    inputNear:HTMLInputElement;
    inputFar:HTMLInputElement;

    ShowUI()
    {
        document.addEventListener("keydown",(ev)=>{
            if(ev.key === "c"){
                if(this.viewcamera.postQueues.length>0)
                this.viewcamera.postQueues = [];
                else{
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.material.setShader(this.scene.app.getAssetMgr().getShader("mask.shader.json"));
                
                post.material.setTexture("_MainTex", this.depthTexture);
                this.viewcamera.postQueues.push(post);
                }
            }
        })

        this.labelNear = document.createElement("label");
        this.labelNear.style.top = "100px";
        this.labelNear.style.position = "absolute";
        this.app.container.appendChild(this.labelNear);

        this.inputNear = document.createElement("input");
        this.inputNear.type = "range";
        this.inputNear.min = "-15";
        this.inputNear.max = "15";
        this.inputNear.step = "0.1";
        this.inputNear.oninput = () =>
        {
            let _value = parseFloat(this.inputNear.value);
            if (_value > this.lightcamera.far)
            {
                _value = this.lightcamera.far;
                this.inputNear.value = _value.toString();
            }
            this.labelNear.textContent = "near :" + _value;
            this.lightcamera.near = _value;
        }
        this.inputNear.style.top = "124px";
        this.inputNear.style.position = "absolute";
        this.app.container.appendChild(this.inputNear);

        this.labelFar = document.createElement("label");
        this.labelFar.style.top = "225px";
        this.labelFar.style.position = "absolute";
        this.app.container.appendChild(this.labelFar);

        this.inputFar = document.createElement("input");
        this.inputFar.type = "range";
        this.inputFar.min = "-15";
        this.inputFar.max = "15";
        this.inputFar.step = "0.1";
        this.inputFar.oninput = () =>
        {
            let _value = parseFloat(this.inputFar.value);
            if (_value < this.lightcamera.near)
            {
                _value = this.lightcamera.near;
                this.inputFar.value = _value.toString();
            }
            this.labelFar.textContent = "far :" + _value;
            this.lightcamera.far = _value;
        }
        this.inputFar.style.top = "250px";
        this.inputFar.style.position = "absolute";
        this.app.container.appendChild(this.inputFar);
    }

    ShowCameraInfo(camera:gd3d.framework.camera)
    {
        let near = camera.near.toString();
        let far = camera.far.toString();
        this.inputNear.value = near;
        this.inputFar.value = far;
        this.labelNear.textContent = "near :" + near;
        this.labelFar.textContent = "far :" +far;
    }
}