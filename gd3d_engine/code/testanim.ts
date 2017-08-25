/// <reference path="../lib/gd3d.d.ts" />

class test_anim implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    player: gd3d.framework.transform;
    cubes: { [id: string]: gd3d.framework.transform } = {};
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        // this.app.targetFrame = 10;
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;

        this.scene.addChild(baihu);
        {
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("light") as gd3d.framework.light;
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();

        }
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                // let _shader = this.app.getAssetMgr().getShader("light1.shader.json");

                this.app.getAssetMgr().load("res/prefabs/elong/elong.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("elong.prefab.json") as gd3d.framework.prefab;
                        baihu = _prefab.getCloneTrans();
                        this.player = baihu;
                        this.scene.addChild(baihu);
                        baihu.localScale = new gd3d.math.vector3(0.2, 0.2, 0.2);
                        baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);


                        objCam.lookat(baihu);
                        objCam.markDirty();
                        // var _skinMeshRenders = baihu.gameObject.getComponentsInChildren("skinnedMeshRenderer") as gd3d.framework.skinnedMeshRenderer[];
                        // _skinMeshRenders[0].materials[0].setShader(_shader);

                        var ap = baihu.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
                        // ap.autoplay = false;

                        document.onkeydown = (ev) =>
                        {
                            if (ev.code == "KeyM")
                            {
                                ap.playCrossByIndex(0, 0.2);
                            }
                            else if (ev.code == "KeyN")
                            {
                                ap.playCrossByIndex(1, 0.2);
                            }
                            else if(ev.code == "KeyS"){
                                ap.stop();
                            }
                        }

                        let wingroot = baihu.find("Bip001 Xtra17Nub");

                        let trans = new gd3d.framework.transform();
                        trans.name = "cube11";
                        var mesh = trans.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
                        var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                        mesh.mesh = smesh;
                        var renderer = trans.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                        wingroot.addChild(trans);
                        trans.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        renderer.materials = [];
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials[0].setShader(this.app.getAssetMgr().getShader("shader/def"));

                        

                        // for (var i = 0; i < ap.bones.length; i++)
                        // {
                        //     var cube = new gd3d.framework.transform();
                        //     cube.name = "cube";
                        //     var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
                        //     var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                        //     mesh.mesh = smesh;
                        //     var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                        //     gd3d.math.vec3Clone(ap.bones[i].tposep, cube.localTranslate);

                        //     gd3d.math.quatClone(ap.bones[i].tposeq, cube.localRotate);
                        //     cube.localScale.x=0.2;
                        //     baihu.addChild(cube);
                        //     cube.markDirty();
                        //     this.cubes[ap.bones[i].name] = cube;
                        // }
                    }
                });
            }
        });
        this.cube = baihu;

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();//标记为需要刷新


    }

    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();//标记为需要刷新
        objCam.updateWorldTran();
        //for (var key in this.cubes)
        //{
        //    var ap = this.player.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
        //    if (ap != null && ap.nowpose != null)
        //    {
        //        var p = ap.nowpose[key];
        //        var t = ap.tpose[key];

        //        if (p != undefined && t != undefined)
        //        {
        //            // var matt = new gd3d.math.matrix();
        //            // var matb = new gd3d.math.matrix();
        //            // gd3d.math.matrixMakeTransformRTS(t.t, new gd3d.math.vector3(1, 1, 1), t.r, matt);
        //            // gd3d.math.matrixMakeTransformRTS(p.t, new gd3d.math.vector3(1, 1, 1), p.r, matb);
        //            // let _matrix = new gd3d.math.matrix();
        //            // gd3d.math.matrixMultiply(matb, matt, _matrix);

        //            // let _newmatrix = new gd3d.math.matrix();
        //            // gd3d.math.matrixMultiply(this.player.getWorldMatrix(), _matrix, _newmatrix);
        //            // this.cubes[key].setWorldMatrix(_newmatrix);

        //             let fmat = gd3d.framework.PoseBoneMatrix.sMultiply(p, t);

        //             gd3d.math.vec3Clone(fmat.t, this.cubes[key].localTranslate);
        //             gd3d.math.quatClone(fmat.r, this.cubes[key].localRotate);
        //            this.cubes[key].markDirty();
        //        }
        //    }

        //}
    }
}