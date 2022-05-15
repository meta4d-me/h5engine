/// <reference path="../lib/gd3d.d.ts" />

namespace t
{
    export class light_d1 implements IState
    {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private addcube()
        {
            var smesh1 = this.app.getAssetMgr().getDefaultMesh("cube");
            for (var i = -4; i < 5; i++)
            {
                for (var j = -4; j < 5; j++)
                {
                    var baihu = new gd3d.framework.transform();
                    this.scene.addChild(baihu);
                    baihu.localScale = new gd3d.math.vector3(0.5, 0.5, 0.5);
                    baihu.localTranslate.x = i;
                    baihu.localTranslate.y = j;
                    //gd3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
                    baihu.markDirty();

                    // var smesh1 = this.app.getAssetMgr().getAssetByName("Sphere.mesh.bin") as gd3d.framework.mesh;
                    var mesh1 = baihu.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
                    mesh1.mesh = (smesh1);
                    var renderer = baihu.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                    baihu.markDirty();
                    var sh = this.app.getAssetMgr().getShader("light3.shader.json");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);

                    let texture = this.app.getAssetMgr().getAssetByName("rock256.png") as gd3d.framework.texture;
                    renderer.materials[0].setTexture("_MainTex", texture);

                    var tex2 = this.app.getAssetMgr().getAssetByName("rock_n256.png") as gd3d.framework.texture;
                    renderer.materials[0].setTexture("_NormalTex", tex2);
                }
            }
        }
        private addCameraAndLight()
        {
            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新


            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light") as gd3d.framework.light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

            {
                var cube = new gd3d.framework.transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;

                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                let cuber = renderer;
            }
        }
        start(app: gd3d.framework.application)
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
                    if (this.light.type == gd3d.framework.LightTypeEnum.Direction)
                    {
                        this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (this.light.type == gd3d.framework.LightTypeEnum.Point)
                    {
                        this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else
                    {
                        this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            }
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            util.loadShader(this.app.getAssetMgr())
                .then(() => Promise.all(["newRes/zg256.png", "newRes/rock256.png", "newRes/rock_n256.png"].map(item => util.loadTex(item, this.app.getAssetMgr()))))
                .then(() => this.addcube())
                .then(() => this.addCameraAndLight())
        }

        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number = 0;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        update(delta: number)
        {
            this.taskmgr.move(delta);

            this.timer += delta;

            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null)
            {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 4, -z2 * 5);
                // objCam.markDirty();
                //objCam.updateWorldTran();
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
            }
            if (this.light != null)
            {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 3, 3, z * 3);

                //objlight.updateWorldTran();
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objlight.markDirty();
            }

        }
    }

}