class test_multipleplayer_anim implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    player: gd3d.framework.transform;
    cubes: { [id: string]: gd3d.framework.transform } = {};
    infos: { [boneCount: number]: { abName: string, prefabName: string, materialCount: number } } = {};

    init()
    {
        // this.infos[25] = { abName: "gblgongjiang/gblgongjiang.assetbundle.json", prefabName: "gblgongjiang.prefab.json", materialCount: 1 };
        // this.infos[60] = { abName: "emoshou/emoshou.assetbundle.json", prefabName: "emoshou.prefab.json", materialCount: 3 };
        this.infos[53] = { abName: "prefabs/elong/elong.assetbundle.json", prefabName: "elong.prefab.json", materialCount: 1 };


    }
    start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.init();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;

        this.scene.addChild(baihu);

        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) =>
        {
            if (state.isfinish)
            {
                //let _shader = this.app.getAssetMgr().getShader("bone.shader.json");
                let data = this.infos[53];
                this.app.getAssetMgr().load("res/" + data.abName, gd3d.framework.AssetTypeEnum.Auto, (s) =>
                {
                    if (s.isfinish)
                    {
                        var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(data.prefabName) as gd3d.framework.prefab;
                        let a = 10;
                        let b = 10;
                        for (let i = -14; i <=14; i++)
                        {
                            for (let j = -14; j <=14; j++)
                            {
                                let trans = _prefab.getCloneTrans();

                                this.scene.addChild(trans);
                                trans.localScale = new gd3d.math.vector3(1, 1, 1);
                                // trans.localTranslate = new gd3d.math.vector3((-a + i) * 5, 0, (-b + j) * 5);
                                trans.localTranslate = new gd3d.math.vector3(i * 5,0,j*5);
                                if (i ==0 && j == 0)
                                {
                                    objCam.lookat(trans);
                                }
                                var ap = trans.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
                                ap.autoplay = true;
                                ap._playTimer = Math.random() * 1000;
                            }
                        }
                        objCam.markDirty();
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
        this.camera.far = 199;
        objCam.localTranslate = new gd3d.math.vector3(0, 86, 0);
        // objCam.lookat(baihu);
        objCam.markDirty();//标记为需要刷新


    }

    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {
        // this.timer += delta;
        // var x = Math.sin(this.timer * 0.5);
        // var z = Math.cos(this.timer * 0.5);
        // // var x2 = Math.sin(this.timer * 1.1);
        // // var z2 = Math.cos(this.timer * 1.1);
        // let objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x * 86, 55, -z * 86);
        // objCam.lookat(this.cube);
        // objCam.markDirty();//标记为需要刷新
        // objCam.updateWorldTran();
        // for (var key in this.cubes)
        // {
        //     var ap = this.player.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
        //     if (ap != null && ap.nowpose != null)
        //     {
        //         var p = ap.nowpose[key];
        //         var t = ap.tpose[key];

        //         if (p != undefined && t != undefined)
        //         {
        //             // var matt = new gd3d.math.matrix();
        //             // var matb = new gd3d.math.matrix();
        //             // gd3d.math.matrixMakeTransformRTS(t.t, new gd3d.math.vector3(1, 1, 1), t.r, matt);
        //             // gd3d.math.matrixMakeTransformRTS(p.t, new gd3d.math.vector3(1, 1, 1), p.r, matb);
        //             // let _matrix = new gd3d.math.matrix();
        //             // gd3d.math.matrixMultiply(matb, matt, _matrix);

        //             // let _newmatrix = new gd3d.math.matrix();
        //             // gd3d.math.matrixMultiply(this.player.getWorldMatrix(), _matrix, _newmatrix);
        //             // this.cubes[key].setWorldMatrix(_newmatrix);

        //             let fmat = gd3d.framework.PoseBoneMatrix.sMultiply(p, t);

        //             gd3d.math.vec3Clone(fmat.t, this.cubes[key].localTranslate);
        //             gd3d.math.quatClone(fmat.r, this.cubes[key].localRotate);
        //             this.cubes[key].markDirty();
        //         }
        //     }

        // }
    }
}