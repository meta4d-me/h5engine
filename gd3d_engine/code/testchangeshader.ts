/// <reference path="../lib/gd3d.d.ts" />

namespace t
{
    export class test_changeshader implements IState
    {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        renderer: gd3d.framework.meshRenderer;
        objCam: gd3d.framework.transform;
        start(app: gd3d.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            var baihu = new gd3d.framework.transform();
            baihu.name = "baihu";
            baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 20;
            this.scene.addChild(baihu);

            this.changeShader();
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
            {
                if (state.isfinish)
                {
                    this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", gd3d.framework.AssetTypeEnum.Auto, (s) =>
                    {
                        if (s.isfinish)
                        {
                            var smesh1 = this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin") as gd3d.framework.mesh;
                            var mesh1 = baihu.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
                            mesh1.mesh = (smesh1);
                            this.renderer = baihu.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                            var collider = baihu.gameObject.addComponent("boxcollider") as gd3d.framework.boxcollider;
                            baihu.markDirty();
                            var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                            this.renderer.materials = [];
                            this.renderer.materials.push(new gd3d.framework.material());
                            this.renderer.materials.push(new gd3d.framework.material());
                            this.renderer.materials.push(new gd3d.framework.material());
                            this.renderer.materials.push(new gd3d.framework.material());
                            this.renderer.materials[0].setShader(sh);
                            this.renderer.materials[1].setShader(sh);
                            this.renderer.materials[2].setShader(sh);
                            this.renderer.materials[3].setShader(sh);
                            this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihu.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, (s2) =>
                            {
                                if (s2.isfinish)
                                {
                                    let texture = this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json") as gd3d.framework.texture;
                                    this.renderer.materials[0].setTexture("_MainTex", texture);
                                }
                            });
                            this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuan.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, (s2) =>
                            {
                                if (s2.isfinish)
                                {
                                    let texture = this.app.getAssetMgr().getAssetByName("baihuan.imgdesc.json") as gd3d.framework.texture;
                                    this.renderer.materials[1].setTexture("_MainTex", texture);
                                }
                            });
                            this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuya.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, (s2) =>
                            {
                                if (s2.isfinish)
                                {
                                    let texture = this.app.getAssetMgr().getAssetByName("baihuya.imgdesc.json") as gd3d.framework.texture;
                                    this.renderer.materials[2].setTexture("_MainTex", texture);
                                }
                            });
                            this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihumao.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, (s2) =>
                            {
                                if (s2.isfinish)
                                {
                                    let texture = this.app.getAssetMgr().getAssetByName("baihumao.imgdesc.json") as gd3d.framework.texture;
                                    this.renderer.materials[3].setTexture("_MainTex", texture);
                                }
                            });

                        }
                    });
                }
            });
            this.cube = baihu;

            //添加一个摄像机
            this.objCam = new gd3d.framework.transform();
            this.objCam.name = "sth.";
            this.scene.addChild(this.objCam);
            this.camera = this.objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.objCam.localTranslate = new gd3d.math.vector3(0, 2, -2);
            this.objCam.lookat(baihu);
            this.objCam.markDirty();//标记为需要刷新

        }

        private changeShader()
        {
            var btn = document.createElement("button");
            btn.textContent = "切换Shader到：diffuse.shader.json";
            btn.onclick = () =>
            {
                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json") as gd3d.framework.shader;
                this.change(sh);
            }
            btn.style.top = "160px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

            var btn2 = document.createElement("button");
            btn2.textContent = "切换Shader到：transparent-diffuse.shader.json";
            btn2.onclick = () =>
            {
                var sh = this.app.getAssetMgr().getShader("transparent-diffuse.shader.json") as gd3d.framework.shader;
                this.change(sh);
            }
            btn2.style.top = "124px";
            btn2.style.position = "absolute";
            this.app.container.appendChild(btn2);
        }

        change(sha: gd3d.framework.shader)
        {
            for (let i = 0; i < 4; i++)
            {
                let _uniform = this.renderer.materials[i].mapUniform;
                this.renderer.materials[i].setShader(sha);
                for (let key in _uniform)
                {
                    if (this.renderer.materials[i].mapUniform[key] != undefined)
                        this.renderer.materials[i].mapUniform[key] = _uniform[key];
                }
            }
        }

        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        cube2: gd3d.framework.transform;
        cube3: gd3d.framework.transform;
        timer: number = 0;
        update(delta: number)
        {

        }
    }
}