
/** HDR + glTF 样例 */
class HDR_sample implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    assetMgr: gd3d.framework.assetMgr;

    _load(path: string, type = gd3d.framework.AssetTypeEnum.Auto)
    {
        return new Promise((resolve) =>
        {
            this.assetMgr?.load(path, type, (res) =>
            {
                if (res.isfinish)
                    resolve(res);
                else
                    resolve(null);
            });
        });
    }
    async load<T extends gd3d.framework.IAsset>(path: string, name: string, type?: gd3d.framework.AssetTypeEnum)
    {
        await this._load(path + name, type);
        return this.assetMgr.getAssetByName<T>(name);
    }

    async loadCubeTexture(folder: string,
        images = [
            'negx.hdr',
            'negy.hdr',
            'negz.hdr',
            'posx.hdr',
            'posy.hdr',
            'posz.hdr',
        ]
    )
    {
        const tex: gd3d.framework.texture[] = await Promise.all(images.map(n => this.load(folder, n)));
        const cubeTex = new gd3d.framework.texture(folder.split('/').pop());
        cubeTex.glTexture = new gd3d.render.glTextureCube(this.app.webgl, gd3d.render.TextureFormatEnum.RGBA, true, true);
        cubeTex.use();
        (<gd3d.render.glTextureCube>cubeTex.glTexture).uploadImages(
            tex[0],
            tex[1],
            tex[2],
            tex[3],
            tex[4],
            tex[5],
        );
        return cubeTex;
    }

    start(app: gd3d.framework.application)
    {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        // gd3d.framework.assetMgr.openGuid = true;

        const scene = app.getScene();

        //initCamera
        const objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        const cam = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        cam.near = 0.01;
        cam.far = 1000;
        // cam.fov = Math.PI * 0.3;

        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;

        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 0, 0);

        const HDRpath = "res/pbrRes/HDR/";
        (async() => {
            // const tex = await this.load<gd3d.framework.texture>(HDRpath, 'flower_road_2k.hdr');
            // mr.materials[0].setTexture("_MainTex", tex);
            await demoTool.loadbySync(`newRes/shader/MainShader.assetbundle.json`, app.getAssetMgr());
            await demoTool.loadbySync(`newRes/test/shader/customShader/customShader.assetbundle.json`, app.getAssetMgr());  //项目shader
            // await datGui.init();

            const exp = 4;

            const env = await this.loadCubeTexture(HDRpath + 'helipad/');
            const skybox = new gd3d.framework.transform();
            skybox.localScale.x = skybox.localScale.y = skybox.localScale.z = 600;
            this.scene.addChild(skybox);
            let mf_c = skybox.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            mf_c.mesh = this.assetMgr.getDefaultMesh("cube");
            let mr_c = skybox.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            mr_c.materials[0] = new gd3d.framework.material("skyboxmat");
            mr_c.materials[0].setShader(this.assetMgr.getShader("skybox.shader.json"));
            // let pass = mr_c.materials[0].getShader().passes["base"][0];
            // pass.state_showface = gd3d.render.ShowFaceStateEnum.CW;
            mr_c.materials[0].setCubeTexture("u_sky", env);
            mr_c.materials[0].setFloat("u_Exposure", exp);

            // const brdf = await this.load<gd3d.framework.texture>('res/pbrRes/', 'lut_ggx.png');

            const gltfFolder = 'res/pbrRes/FlightHelmet/glTF/';
            const gltf = await this.load<gd3d.framework.gltf>(gltfFolder, 'FlightHelmet.gltf');
            const root = await gltf.load(this.assetMgr, this.app.webgl, gltfFolder, null, env, exp);
            gd3d.math.vec3SetAll(root.localScale, 10);
            // root.localScale.x *= -1;
            // root.markDirty();
            this.app.getScene().addChild(root);
        })();
    }

    update(delta: number)
    {


    }
}