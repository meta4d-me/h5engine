/// <reference path="../lib/gd3d.d.ts" />

namespace t
{
    export class test_LevelUpWithRoleMove implements IState
    {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();

        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {

                    state.finish = true;
                }
            }
            );
        }

        start(app: gd3d.framework.application)
        {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            //任务排队执行系统
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadEffect.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
        }
        private loadEffect(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
        {
            let assetbundleName = "res/particleEffect/fx_shengji_jiaose/fx_shengji_jiaose.assetbundle.json";
            let name = "fx_shengji_jiaose.effect.json";
            // this._loadEffect("res/particleEffect/hjxnew/hjxnew.assetbundle.json", "hjxnew");//
            // this._loadEffect("res/particleEffect/fx_shengji_jiaose/fx_shengji_jiaose.assetbundle.json", "fx_shengji_jiaose.effect.json");//
            this.app.getAssetMgr().load(assetbundleName, gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    let tr = new gd3d.framework.transform();
                    this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                    var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.textasset;
                    this.effect.setEffect(text.content);
                    this.scene.addChild(tr);
                    tr.markDirty();
                    state.finish = true;
                }
            }
            );
        }

        private effect: gd3d.framework.effectSystem;
        _loadEffect(assetbundleName: string, name: string)
        {
            this.app.getAssetMgr().load(assetbundleName, gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    let tr = new gd3d.framework.transform();
                    this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as gd3d.framework.effectSystem;
                    var text: gd3d.framework.textasset = this.app.getAssetMgr().getAssetByName(name) as gd3d.framework.textasset;
                    this.effect.setEffect(text.content);
                    this.scene.addChild(tr);
                    tr.markDirty();
                }
            }
            );
        }

        private role: gd3d.framework.transform;
        private loadRole(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) =>
            {
                if (s.isfinish)
                {
                    var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json") as gd3d.framework.prefab;
                    this.role = _prefab.getCloneTrans();
                    this.role.name = "role";
                    this.scene.addChild(this.role);
                    this.role.localScale = new gd3d.math.vector3(1, 1, 1);
                    this.role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    this.role.gameObject.visible = true;
                    var ap = this.role.gameObject.getComponent("aniplayer") as gd3d.framework.aniplayer;
                    ap.autoplay = true;
                    let aniclipName = "attack_01.FBAni.aniclip.bin";
                    ap.playCross(aniclipName, 0.2);

                    let play = document.createElement("button");
                    play.textContent = "play";
                    play.onclick = () =>
                    {
                        ap.playCross(aniclipName, 0.2);
                        this.effect.stop();
                        this.effect.play();
                    }
                    play.style.top = "240px";
                    play.style.position = "absolute";
                    this.app.container.appendChild(play);
                    this.role.addChild(this.effect.gameObject.transform);
                }
            });
        }

        private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) 
        {
            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 50;
            this.camera.fov = Math.PI * 0.3;
            // this.camera.backgroundColor = new gd3d.math.color(0.2, 0.2, 0.2, 1);
            objCam.localTranslate = new gd3d.math.vector3(0, 5, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            state.finish = true;
        }

        timer: number = 0;
        private quat: gd3d.math.quaternion = new gd3d.math.quaternion();
        update(delta: number)
        {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.role != null)
            {
                var x = Math.sin(this.timer * 1);
                var z = Math.cos(this.timer * 1);
                // var x2 = Math.sin(this.timer * 1.1);
                // var z2 = Math.cos(this.timer * 1.1);
                // let objCam = this.camera.gameObject.transform;
                // objCam.localTranslate = new gd3d.math.vector3(x * 5, 5, -z * 5);
                this.role.localTranslate = new gd3d.math.vector3(x * 5, 0, -z * 5);
                gd3d.math.quatFromEulerAngles(0, 2, 0, this.quat);
                gd3d.math.quatMultiply(this.role.localRotate, this.quat, this.role.localRotate);
                // this.effect.gameObject.transform.localTranslate = this.role.localTranslate;
                // this.effect.gameObject.transform.markDirty();
                this.role.markDirty();
            }
        }
    }

}