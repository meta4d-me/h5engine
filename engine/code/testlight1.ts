namespace t
{
    export class test_light1 implements IState
    {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        tex: m4m.framework.texture;
        private loadText()
        {
            return new Promise<void>((resolve, reject) =>
            {
                //創建一個貼圖
                this.tex = new m4m.framework.texture();
                this.tex.glTexture = new m4m.render.WriteableTexture2D(this.app.webgl, m4m.render.TextureFormatEnum.RGBA, 512, 512, true);
                var wt = this.tex.glTexture as m4m.render.WriteableTexture2D;
                //填充貼圖部分數據
                var da = new Uint8Array(256 * 256 * 4);
                for (var x = 0; x < 256; x++)
                    for (var y = 0; y < 256; y++)
                    {
                        var seek = y * 256 * 4 + x * 4;
                        da[seek] = 235;
                        da[seek + 1] = 50;
                        da[seek + 2] = 230;
                        da[seek + 3] = 230;
                    }
                wt.updateRect(da, 256, 256, 256, 256);
                //用圖片填充貼圖部分數據
                var img = new Image();
                img.onload = (e) =>
                {
                    wt.updateRectImg(img, 0, 0);
                    resolve();
                };
                img.src = "res/zg256.png";
            })
        }

        private addCubes()
        {
            for (var i = -4; i < 5; i++)
            {
                for (var j = -4; j < 5; j++)
                {
                    this.addCube(i, j, 0);
                    this.addCube(i, 0, j);
                }
            }
        }

        private addCube(x: number, y: number, z: number)
        {
            var cube = new m4m.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.8;
            cube.localTranslate.x = x;
            cube.localTranslate.y = y;
            cube.localTranslate.z = z;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            let cuber = renderer;

            var sh = this.app.getAssetMgr().getShader("light1.shader.json");
            if (sh != null)
            {
                cuber.materials = [];
                cuber.materials.push(new m4m.framework.material());
                cuber.materials[0].setShader(sh);
                cuber.materials[0].setTexture("_MainTex", this.tex);
            }
        }

        private addCameraAndLight()
        {
            //添加一个摄像机
            var objCam = new m4m.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new m4m.math.vector3(0, 0, -10);
            objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            var lightNode = new m4m.framework.transform();
            this.scene.addChild(lightNode);
            this.light = lightNode.gameObject.addComponent("light") as m4m.framework.light;
            lightNode.localTranslate.x = 2;
            lightNode.localTranslate.z = 1;
            lightNode.localTranslate.y = 3;
            lightNode.markDirty();

            {
                var cube = new m4m.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lightNode.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
                let cuber = renderer;

                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null)
                {
                    cuber.materials = [];
                    cuber.materials.push(new m4m.framework.material());
                    cuber.materials[0].setShader(sh);//----------------使用shader
                    //cuber.materials[0].setVector4("_Color", new m4m.math.vector4(0.4, 0.4, 0.2, 1.0));

                    let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as m4m.framework.texture;
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
        }
        start(app: m4m.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = () =>
            {
                if (this.light != null)
                {
                    if (this.light.type == m4m.framework.LightTypeEnum.Direction)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (this.light.type == m4m.framework.LightTypeEnum.Point)
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Spot;
                        this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else
                    {
                        this.light.type = m4m.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            }
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            util.loadShader(this.app.getAssetMgr())
                .then(() => this.loadText())
                .then(() => this.addCubes())
                .then(() => this.addCameraAndLight())
        }

        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number = 0;
        update(delta: number)
        {
            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new m4m.math.vector3(x2 * 10, 2.25, -z2 * 10);
                // objCam.markDirty();
                objCam.updateWorldTran();
                objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
                //objCam.markDirty();
            }
            if (this.light != null)
            {
                var objLight = this.light.gameObject.transform;
                objLight.localTranslate = new m4m.math.vector3(x * 5, 3, z * 5);
                objLight.updateWorldTran();
                objLight.lookatPoint(new m4m.math.vector3(0, 0, 0));
            }
        }
    }
}