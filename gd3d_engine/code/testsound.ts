namespace t {

    export class test_sound implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number = 0;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        count: number = 0;
        counttimer: number = 0;
        private angularVelocity: gd3d.math.vector3 = new gd3d.math.vector3(10, 0, 0);
        private eulerAngle = gd3d.math.pool.new_vector3();
        looped: AudioBuffer = null;
        once1: AudioBuffer = null;
        once2: AudioBuffer = null;


        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
                state.finish = true;
            }
            );
        }

        private loadText(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            }
            );
        }

        private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {

            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            state.finish = true;

        }

        private addcube(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            //添加一个盒子
            {
                //添加一个盒子
                {
                    let cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
                    let cuber = renderer;

                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);//----------------使用shader
                        let texture = this.app.getAssetMgr().getAssetByName("zg256.png") as gd3d.framework.texture;
                        cuber.materials[0].setTexture("_MainTex", texture);

                    }
                    this.cube = cube;


                }
            }
            state.finish = true;
        }

        private loadSoundInfe(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            {

                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/music1.mp3", (buf, err) => {
                    this.looped = buf;
                    // gd3d.framework.AudioEx.instance().playLooped("abc", this.looped);
                });
                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound1.mp3", (buf, err) => {
                    this.once1 = buf;
                });
                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound2.mp3", (buf, err) => {
                    this.once2 = buf;
                    // gd3d.framework.AudioEx.instance().playOnce("once2", this.once2);
                });
                {
                    var button = document.createElement("button");
                    button.textContent = "play once1";
                    button.onclick = () => {
                        // gd3d.framework.AudioEx.instance().playOnce("once1", this.once1);
                    };
                    button.style.top = "130px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play once2";
                    button.onclick = () => {
                        // gd3d.framework.AudioEx.instance().playOnce("once2", this.once2);
                    };
                    button.style.top = "130px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play loop";
                    button.onclick = () => {
                        // gd3d.framework.AudioEx.instance().playLooped("abc", this.looped);
                    };

                    button.style.top = "160px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "stop loop";
                    button.onclick = () => {
                        // gd3d.framework.AudioEx.instance().stopLooped("abc");
                    };
                    button.style.top = "160px";
                    button.style.left = "90px"
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    document.body.appendChild(document.createElement("p"));
                    var input = document.createElement("input");
                    input.type = "range";
                    input.valueAsNumber = 10;
                    // gd3d.framework.AudioEx.instance().setSoundVolume(-0.2);
                    // gd3d.framework.AudioEx.instance().setMusicVolume(-0.2);
                    input.oninput = (e) => {
                        var value = (input.valueAsNumber - 50) / 50;
                        // gd3d.framework.AudioEx.instance().setSoundVolume(value);
                        // gd3d.framework.AudioEx.instance().setMusicVolume(value);
                    };
                    input.style.top = "190px";
                    input.style.position = "absolute";
                    this.app.container.appendChild(input);
                }

            }
            state.finish = true;
        }


        start(app: gd3d.framework.application) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();

            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this))
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadSoundInfe.bind(this));

        }




        update(delta: number) {
            this.taskmgr.move(delta);

            this.timer += delta;

            if (this.cube != null) {

                let cubeTransform = this.cube.gameObject.transform;

                this.eulerAngle.x = delta * this.angularVelocity.x * 10;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;

                let rotateVelocity: gd3d.math.quaternion = gd3d.math.pool.new_quaternion();

                //替代掉这个函数
                gd3d.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);

                //一切ok
                //gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(0, 1, 0), this.timer, rotateVelocity);

                gd3d.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                cubeTransform.markDirty();
            }
        }
    }

}