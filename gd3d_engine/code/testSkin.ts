/** 加载分步资源包 */
class test_f4skin implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;

    boneConfig(bone: gd3d.framework.transform, yOffset = 4, rotate = 10)
    {
        const mf = bone.gameObject.addComponent('meshFilter') as gd3d.framework.meshFilter;
        mf.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
        const mr = bone.gameObject.addComponent('meshRenderer') as gd3d.framework.meshRenderer;

        bone.localTranslate.x = yOffset;
        // gd3d.math.quatFromEulerAngles(0, 0, rotate, bone.localRotate);
        bone.markDirty();
    }

    assembSkeleton(segment: number)
    {
        let bones: gd3d.framework.transform[] = [];
        for (let i = 0; i < segment; i++)
        {
            const bone = new gd3d.framework.transform();
            bone.name = 'bone_' + i;
            bones[i] = bone;
            if (i)
            {
                this.boneConfig(bone);
                const parent = bones[i - 1];
                parent.addChild(bone);
            } else
            {
                this.boneConfig(bone, 0);
                // bone.localTranslate.z = 0.5;
            }
        }
        return bones;
    }

    createMesh(ctx: WebGLRenderingContext)
    {
        let mesh = new gd3d.framework.mesh();

        const NumVertsPerRow = 5;
        const NumVertsPerCol = 2;
        const CellSpacing = 2;

        const boneAmount = 3;

        let _NumCellsPerRow;
        let _NumCellsPerCol;
        let _Width;
        let _Depth;
        let _NumVertices;
        let _NumTriangles;

        _NumCellsPerRow = NumVertsPerRow - 1;
        _NumCellsPerCol = NumVertsPerCol - 1;
        _Width = _NumCellsPerRow * CellSpacing;
        _Depth = _NumCellsPerCol * CellSpacing;
        _NumVertices = NumVertsPerRow * NumVertsPerCol;
        _NumTriangles = _NumCellsPerRow * _NumCellsPerCol * 2;

        let data = mesh.data = new gd3d.render.meshData();

        let _Vertices: gd3d.math.vector3[] = data.pos = [];
        // let _UV: gd3d.math.vector2[] = data.uv = [];
        // let _UV2: gd3d.math.vector2[] = data.uv2 = [];
        let _Colours: gd3d.math.vector4[] = data.color = [];
        let _BoneIndex: gd3d.math.vector4[] = data.blendIndex = [];
        let _BoneWeight: gd3d.math.vector4[] = data.blendWeight = [];
        let _Indices = data.trisindex = [];

        const StartZ = -1;
        const EndZ = _Depth;
        const StartX = 0;
        // const StartX = -(_Width / 2);
        const EndX = _Width;
        // const EndX = _Width / 2;

        const fUI = _NumCellsPerRow * 0.5 / _NumCellsPerRow;
        const fVI = _NumCellsPerCol * 0.5 / _NumCellsPerCol;

        let i = 0;

        let fWaterStep = 0.0;

        const bw = [
            [1, 0, 0, 0],
            [0.7, 0.3, 0, 0],
            [0.5, 0.5, 0, 0],
            [0, 0.6, 0.4, 0],
            [0, 0, 1, 0],
        ]
        const bi = [
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
        ];

        for (let z = StartZ; z <= EndZ; z += CellSpacing)
        {
            let j = 0;

            for (let x = StartX; x <= EndX; x += CellSpacing)
            {
                let iIndex = i * NumVertsPerRow + j;

                _Vertices[iIndex] = new gd3d.math.vector3();
                _Colours[iIndex] = new gd3d.math.vector4();
                _BoneIndex[iIndex] = new gd3d.math.vector4();
                _BoneWeight[iIndex] = new gd3d.math.vector4();
                // _UV[iIndex] = new gd3d.math.vector2();
                // _UV2[iIndex] = new gd3d.math.vector2();

                _Vertices[iIndex].x = x;
                _Vertices[iIndex].y = 0;
                _Vertices[iIndex].z = z;
                console.log('j ' + j);
                console.log('x ' + x);


                _BoneWeight[iIndex].x = _Colours[iIndex].x = bw[j][0];
                _BoneWeight[iIndex].y = _Colours[iIndex].y = bw[j][1];
                _BoneWeight[iIndex].z = _Colours[iIndex].z = bw[j][2];
                _BoneWeight[iIndex].w = bw[j][3];
                _Colours[iIndex].w = 1;

                _BoneIndex[iIndex].x = bi[j][0];
                _BoneIndex[iIndex].y = bi[j][1];
                _BoneIndex[iIndex].z = bi[j][2];
                _BoneIndex[iIndex].w = bi[j][3] = 1;
                // const absZ = Math.abs(z);
                // if(absZ < 1.0 && absZ >= 0.0) {
                //     _Colours[iIndex].y = 0;
                // }

                // _Colours[iIndex].x = Math.sin(fWaterStep);
                // // fWaterStep += 0.01 + this.RandomRange(0.01, 0.02);
                // _Colours[iIndex].z = 1; // Unnecessary

                // _Vertices[iIndex].z = z;

                // _UV[iIndex].x = j * fUI;
                // _UV[iIndex].y = i * fVI;
                // _UV2[iIndex].x = j * fUI;
                // _UV2[iIndex].y = i * fVI;

                ++j;
            }

            // fWaterStep += 0.3 + this.RandomRange(0.1, 1.4);
            ++i;
        }

        let iBaseIndex = 0;
        for (let i = 0; i < _NumCellsPerCol; ++i)
        {
            for (let j = 0; j < _NumCellsPerRow; ++j)
            {
                _Indices[iBaseIndex] = i * NumVertsPerRow + j;
                _Indices[iBaseIndex + 1] = i * NumVertsPerRow + j + 1;
                _Indices[iBaseIndex + 2] = (i + 1) * NumVertsPerRow + j;

                _Indices[iBaseIndex + 3] = (i + 1) * NumVertsPerRow + j;
                _Indices[iBaseIndex + 4] = i * NumVertsPerRow + j + 1;
                _Indices[iBaseIndex + 5] = (i + 1) * NumVertsPerRow + j + 1;

                iBaseIndex += 6;
            }
        }
        // this._Vertices = _Vertices;
        // this._UV = _UV;
        // this._UV2 = _UV2;
        // this._Colours = _Colours;
        // this._Indices = _Indices;
        // this._Position = this.m_transform.localTranslate;



        // Update mesh
        // const mf = this.gameObject.getComponent('meshFilter') as gd3d.framework.meshFilter;
        mesh.glMesh = new gd3d.render.glMesh();
        let vf = gd3d.render.VertexFormatMask.Position
            | gd3d.render.VertexFormatMask.Color
            | gd3d.render.VertexFormatMask.BlendIndex4
            | gd3d.render.VertexFormatMask.BlendWeight4;
        mesh.glMesh.initBuffer(ctx, vf, _Vertices.length, gd3d.render.MeshTypeEnum.Dynamic);

        // create binary buffer
        const bs = 3 + 4 + 4 + 4;	// byteStride
        // const bs = 3 + 4;	// byteStride
        // const bs = 3 + 4 + 4;	// byteStride
        let vbo = new Float32Array(_Vertices.length * bs);
        for (let v = 0; v < _Vertices.length; v++)
        {
            let cur = vbo.subarray(v * bs); // offset
            let position = cur.subarray(0, 3);
            let color = cur.subarray(3, 7);
            let boneIndex = cur.subarray(7, 11);
            let boneWeight = cur.subarray(11, 15);
            // let uv = cur.subarray(7, 9);
            // let uv2 = cur.subarray(9);
            position[0] = _Vertices[v].x;
            position[1] = _Vertices[v].y;
            position[2] = _Vertices[v].z;

            boneIndex[0] = _BoneIndex[v].x;
            boneIndex[1] = _BoneIndex[v].y;
            boneIndex[2] = _BoneIndex[v].z;
            boneIndex[3] = _BoneIndex[v].w;

            boneWeight[0] = _BoneWeight[v].x;
            boneWeight[1] = _BoneWeight[v].y;
            boneWeight[2] = _BoneWeight[v].z;
            boneWeight[3] = _BoneWeight[v].w;

            color[0] = _Colours[v].x;
            color[1] = _Colours[v].y;
            color[2] = _Colours[v].z;
            color[3] = _Colours[v].w;
            // uv[0] = _UV[v].x;
            // uv[1] = _UV[v].y;
            // uv2[0] = _UV2[v].x;
            // uv2[1] = _UV2[v].y;
        }
        let ebo = new Uint16Array(_Indices);

        mesh.glMesh.uploadVertexData(ctx, vbo);
        mesh.glMesh.addIndex(ctx, ebo.length);
        mesh.glMesh.uploadIndexData(ctx, 0, ebo);

        mesh.submesh = [];
        let sm = new gd3d.framework.subMeshInfo();
        sm.matIndex = 0;
        sm.useVertexIndex = 0;
        sm.start = 0;
        sm.size = ebo.length;
        sm.line = false;
        mesh.submesh.push(sm);

        mesh.glMesh.uploadIndexSubData(ctx, 0, ebo);

        return mesh;
    }


    async start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        gd3d.framework.assetMgr.openGuid = false;

        // let isSplitPcakge = true;
        // let mpath = "meshprefab/";
        // let tpath = "textures/";


        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10); //?
        objCam.markDirty();//标记为需要刷新


        await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, this.app.getAssetMgr());

        // await new Promise((res) => {
        //     this.app.getAssetMgr().load("newRes/shader/shader.assetbundle.json" , gd3d.framework.AssetTypeEnum.Auto, (state) => {
        //         if (state.isfinish) {
        //             res();
        //         }
        //     })
        // });



        const sample = new gd3d.framework.transform();
        // mf.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
        // const mr = sample.gameObject.addComponent('meshRenderer') as gd3d.framework.meshRenderer;
        const mr = sample.gameObject.addComponent('f4skinnedMeshRenderer') as gd3d.framework.f4skinnedMeshRenderer;
        mr.materials = [];
        mr.materials[0] = new gd3d.framework.material('mat');
        // debugger
        mr.materials[0].setShader(this.app.getAssetMgr().getShader("f4skin.shader.json"));

        // const mf = sample.gameObject.addComponent('meshFilter') as gd3d.framework.meshFilter;
        // mf.mesh = this.createMesh(this.app.webgl);
        mr.mesh = this.createMesh(this.app.webgl);

        let joints = this.assembSkeleton(3);

        this.scene.addChild(sample);
        this.scene.addChild(joints[0]);

        this.bones = mr.bones = joints;
        mr.initStaticPoseMatrices();
        mr.initBoneMatrices();
        // mr.materials[0].setTexture("boneSampler", mr.boneMatricesTexture);


        objCam.lookat(sample);
        // PF_PlayerSharkAlien
        // PF_EnemySharkAlien

        let loadNameRes = "PF_PlayerSharkAlien";
        // let loadNameRes = "DragonHigh_prefab_boss";
        await demoTool.loadbySync(`newRes/pfb/model/${loadNameRes}/${loadNameRes}.assetbundle.json`, this.app.getAssetMgr());
        // await new Promise(res => {
        //     this.app.getAssetMgr().load(
        //         `res/prefabs/PF_PlayerSharkAlien/PF_PlayerSharkAlien.assetbundle.json`,
        //         // "res/prefabs/PF_EnemySharkPyro/PF_EnemySharkPyro.assetbundle.json",
        //         // "res/prefabs/PF_CrabNormal/PF_CrabNormal.assetbundle.json",
        //         gd3d.framework.AssetTypeEnum.Auto,
        //         (s) => {
        //             if (s.isfinish)
        //                 res();
        //         });
        // });

        let pf = (this.app.getAssetMgr().getAssetByName(`${loadNameRes}.prefab.json`, `${loadNameRes}.assetbundle.json`) as gd3d.framework.prefab).getCloneTrans();


        let orig = pf.clone();
        this.scene.addChild(orig);
        let [anip11] = orig.gameObject.getComponentsInChildren("keyFrameAniPlayer") as gd3d.framework.keyFrameAniPlayer[];
        // anip11.play();
        let cName = anip11.clips[0].getName();
        anip11.playByName(cName);
        // this.scene.addChild(pf);
        let [f4, f5] = pf.gameObject.getComponentsInChildren('f4skinnedMeshRenderer') as gd3d.framework.f4skinnedMeshRenderer[];
        f4.materials[0].setShader(this.app.getAssetMgr().getShader("f4skin.shader.json"));

        pf.gameObject.getComponentsInChildren("ParticleSystem").forEach(v =>
        {

            var ps = (<gd3d.framework.ParticleSystem>v);
            ps.main.loop = true;
            ps.play();
        });

        // f4.initStaticPoseMatrices();
        // f4.initBoneMatrices();
        // f5.initStaticPoseMatrices();
        // f5.initBoneMatrices();
        let anim = f5.gameObject.transform.parent;
        // gd3d.math.quatFromEulerAngles(0.9043889, 3.298536, 169.602, anim.localRotate);
        // anim.localTranslate.x = -1.312147;
        // anim.localTranslate.y = 0.4988527;
        // anim.localTranslate.z = -0.03769693;

        anim.parent.removeChild(anim);
        f4.bones[3].addChild(anim);
        pf.localTranslate.x = 0;
        pf.localTranslate.z -= 2;
        pf.localTranslate.y = 4;
        console.log(f4)
        window['f4'] = f4;
        window['f5'] = f5;
        // this.f4 = f4.gameObject.transform;
        // this.f4 = f4.gameObject.transform.parent;
        // this.f4 = f4.bones;
        this.f4 = pf;
        // f4.gameObject.visible = false;

        // for(let bone of f4.bones) {
        // let bone = f4.bones[3];
        // const mf = bone.gameObject.addComponent('meshFilter') as gd3d.framework.meshFilter;
        // mf.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
        // const mr2 = bone.gameObject.addComponent('meshRenderer') as gd3d.framework.meshRenderer;
        // }

        let [anip, anip2] = pf.gameObject.getComponentsInChildren("keyFrameAniPlayer") as gd3d.framework.keyFrameAniPlayer[];
        console.log(anip)
        console.log(anip2)
        // anip.playByName('bite.keyframeAniclip.json');
        // anip2.play();
        anip.play();
        window['anip'] = anip2;

        let bite = (value = 190) =>
        {
            anip.rewind();
            anip.playByName('bite.keyframeAniclip.json');
            setTimeout(() =>
            {
                anip2.rewind();
                anip2.play();
            }, value);
        }
        window['bite'] = bite;
        app.showFps();

        // setInterval(bite, 2000)


        // gd3d.framework.assetMgr.cdnRoot = "res/";
        // gd3d.framework.assetMgr.guidlistURL = "res/guidlist.json";
        // this.app.getAssetMgr().load("res/shader/MainShader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (state) => {
        //     if (state.isfinish)
        //     {

        // mr.materials[0].setShader(this.app.getAssetMgr().getShader("diffuse.shader.json"));

        // this.app.getAssetMgr().load(`res/prefabs/baihu/${isSplitPcakge ? mpath:""}resources/res_baihu_baihu.FBX_baihu.mesh.bin`, gd3d.framework.AssetTypeEnum.Auto, (s) =>
        // {
        //     if (s.isfinish)
        //     {
        //         var smesh1 = this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin") as gd3d.framework.mesh;
        //         var mesh1 = baihu.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        //         // mesh1.mesh = smesh1.clone();  //clone 失效
        //         mesh1.mesh = smesh1;
        //         var renderer = baihu.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
        //         var collider = baihu.gameObject.addComponent("boxcollider") as gd3d.framework.boxcollider;
        //         baihu.markDirty();
        //         var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
        //         renderer.materials = [];
        //         renderer.materials.push(new gd3d.framework.material());
        //         renderer.materials.push(new gd3d.framework.material());
        //         renderer.materials.push(new gd3d.framework.material());
        //         renderer.materials.push(new gd3d.framework.material());
        //         renderer.materials[0].setShader(sh);
        //         renderer.materials[1].setShader(sh);
        //         renderer.materials[2].setShader(sh);
        //         renderer.materials[3].setShader(sh);
        //         this.app.getAssetMgr().load(`res/prefabs/baihu/${isSplitPcakge? tpath:""}resources/baihu.imgdesc.json`, gd3d.framework.AssetTypeEnum.Auto, (s2) =>
        //         {
        //             if (s2.isfinish)
        //             {
        //                 let texture = this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json") as gd3d.framework.texture;
        //                 renderer.materials[0].setTexture("_MainTex", texture);
        //             }
        //         });
        //         this.app.getAssetMgr().load(`res/prefabs/baihu/${isSplitPcakge? tpath:""}resources/baihuan.png`, gd3d.framework.AssetTypeEnum.Auto, (s2) =>
        //         {
        //             if (s2.isfinish)
        //             {
        //                 let texture = this.app.getAssetMgr().getAssetByName("baihuan.png") as gd3d.framework.texture;
        //                 renderer.materials[1].setTexture("_MainTex", texture);
        //             }
        //         });
        // });
        //     }
        // });


    }

    bones: gd3d.framework.transform[];
    // f4: gd3d.framework.transform[];
    f4: gd3d.framework.transform;

    rotate(bone: gd3d.framework.transform, valuey: number, valuez: number)
    {
        gd3d.math.quatFromEulerAngles(0, valuey, valuez, bone.localRotate);
    }

    timer: number = 0;
    update(delta: number)
    {
        this.timer += delta;
        if (this.bones && this.bones.length)
        {
            this.rotate(this.bones[0], Math.sin(this.timer * 2) * 50, Math.cos(this.timer * 4) * 40 * 0);
            this.rotate(this.bones[1], Math.sin(this.timer * 2) * 80, Math.cos(this.timer * 4) * -80 * 0);
            this.rotate(this.bones[2], Math.sin(this.timer * 2) * 60, Math.cos(this.timer * 4) * 80 * 0);
        }
        if (window['f4'])
        {
            // console.log(this.f4[0].localRotate)
            // console.log(this.f4[1].localRotate)
            // console.log(this.f4[2].localRotate)
            // console.log(this.f4[3].localRotate)
            // console.log(this.f4[4].localRotate)
            gd3d.math.quatFromEulerAngles(0, this.timer * 10, 0, this.f4.localRotate);
            // this.rotate(this.f4[1], Math.sin(this.timer * 2) * 30, Math.cos(this.timer * 4) * 0);
            // this.rotate(this.f4[2], Math.sin(this.timer * 2) * 30, Math.cos(this.timer * 4) * 0);
            // this.rotate(this.f4[3], Math.sin(this.timer * 2) * 30, Math.cos(this.timer * 4) * 0);
            // this.rotate(this.f4[4], Math.sin(this.timer * 2) * 30, Math.cos(this.timer * 4) * 0);
            // this.rotate(this.f4[5], Math.sin(this.timer * 2) * 30, Math.cos(this.timer * 4) * 0);
        }
        // this.timer += delta;
        // var x = Math.sin(this.timer);
        // var z = Math.cos(this.timer);
        // var x2 = Math.sin(this.timer * 0.1);
        // var z2 = Math.cos(this.timer * 0.1);
        // var objCam = this.camera.gameObject.transform;
        // objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        // objCam.lookat(this.cube);
        // objCam.markDirty();//标记为需要刷新
        // objCam.updateWorldTran();
    }
}