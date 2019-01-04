namespace dome {
    export class paowuxian2 implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        assetmgr: gd3d.framework.assetMgr;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();
        camera: gd3d.framework.camera;
        inputMgr: gd3d.framework.inputMgr;
        rooto2d: gd3d.framework.overlay2D;

        start(app: gd3d.framework.application) {
            this.app = app;
            this.scene = app.getScene();
            this.assetmgr = app.getAssetMgr();
            this.inputMgr = this.app.getInputMgr();


            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadmesh.bind(this));
            this.taskmgr.addTaskCall(this.gameInit.bind(this));
        }

        private pointDown = false;
        update(delta: number) {
            if (this.pointDown == false && this.inputMgr.point.touch == true)//pointdown
            {
                this.fire();
            }
            this.pointDown = this.inputMgr.point.touch;

            this.taskmgr.move(delta);
            CameraController.instance().update(delta);

            this.gameupdate(delta);
        }

        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) => {
                if (_state.isfinish) {
                    state.finish = true;
                }
            }
            );
        }

        private targets: gd3d.framework.transform[] = [];
        private loadmesh(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            var name = "box";
            name = "Map_Castle";
            this.app.getAssetMgr().load("res/prefabs/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (s) => {
                if (s.isfinish) {
                    var _prefab: gd3d.framework.prefab = this.app.getAssetMgr().getAssetByName(name + ".prefab.json") as gd3d.framework.prefab;
                    let item = _prefab.getCloneTrans();
                    this.scene.addChild(item);

                    //---------------showbox
                    let showColider = (trans: gd3d.framework.transform) => {
                        let collider = trans.gameObject.getComponent("boxcollider") as gd3d.framework.boxcollider;
                        if (collider != null) {
                            collider.colliderVisible = true;
                            this.targets.push(trans);
                        }
                        if (trans.children != null) {
                            for (let key in trans.children) {
                                showColider(trans.children[key]);
                                // this.targets.push(trans.children[key]);
                            }
                        }
                    }
                    showColider(item);
                    state.finish = true;
                }
            });
        }
        private addcam(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -15);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            let controller = new CameraController();
            CameraController.instance().init(this.app, this.camera);
            state.finish = true;

        }

        //------------------------------------------------------game-----------------------------------------
        paojia: gd3d.framework.transform;
        paodan: gd3d.framework.transform;
        // target: gd3d.framework.transform;
        
        cam2: gd3d.framework.gameObject;
        camctr: camCtr;
        testUI: gd3d.framework.transform2D;
        
        beUIFollow: boolean = true;

        hitPosition:gd3d.math.vector3=new gd3d.math.vector3();
        behit:boolean=false;
        middlePos:gd3d.math.vector3=new gd3d.math.vector3();
        gameInit(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate) {
            this.paojia = this.addcube(new gd3d.math.vector3(),new gd3d.math.vector3(1,1.0,2.0));
            this.paodan = this.addcube(new gd3d.math.vector3(), new gd3d.math.vector3(0.2,0.2,1));


            this.addPaoDancam();

            this.addBtn("切换相机", 60, 500, () => {
                this.cam2.visible = !this.cam2.visible;
                this.camera.gameObject.visible = !this.camera.gameObject.visible;
            });

            this.addBtn("UI跟随Paodan", 60, 700, () => {
                this.beUIFollow = !this.beUIFollow;
                if (this.beUIFollow == false) {
                    this.testUI.localTranslate.x = 0;
                    this.testUI.localTranslate.y = 0;
                    this.testUI.markDirty();
                }
            });

            this.floor=this.scene.getRoot().find("Map_Castle_floor");
            state.finish = true;
        }
        //----------------------------------game scene asset------------------------------------------------
        addPaoDancam() {
            var objCam = new gd3d.framework.transform();
            this.cam2 = objCam.gameObject;
            this.cam2.visible = false;
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            camera.near = 0.01;
            camera.far = 2000;
            camera.fov = Math.PI * 0.3;
            camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -15);
            objCam.markDirty();//标记为需要刷新
            this.camctr = objCam.gameObject.addComponent("camCtr") as camCtr;

            this.camctr.setTarget(this.paodan, new gd3d.math.vector3(0, 0.5, 0));
            this.camctr.setDistanceToTarget(5);
            this.camctr.setRotAngle(0, 30);


            //2dUI root
            this.rooto2d = new gd3d.framework.overlay2D();
            this.camera.addOverLay(this.rooto2d);

            //raw png
            let raw_t2 = new gd3d.framework.transform2D;
            this.testUI = raw_t2;
            raw_t2.name = "滑动卷轴框png";
            raw_t2.width = 100;
            raw_t2.height = 100;
            let raw_i2 = raw_t2.addComponent("rawImage2D") as gd3d.framework.rawImage2D;
            raw_i2.image = this.assetmgr.getDefaultTexture("grid");
            this.rooto2d.addChild(raw_t2);
        }

        //-------------------------------game logic--------------------------------------------------------------------
        private floor:gd3d.framework.transform;
        fire(): void {
            this.pickScene((info)=>{
                console.warn("pick point:" + info.hitposition.toString(), info);

                this.adjustMiddlePoint(this.paojia.getWorldPosition(),info.hitposition,this.middlePos);

                let target = this.addcube(info.hitposition);
                this.updatePaojia(this.middlePos);
                this.fireBullet();
            });

            // this.fireBullet();
        }

        private beLaunched: boolean = false;
        private time: number = 0;
        /**
         * 设置泡弹跑的总时间
         */
        private totaltime: number = 10;
        private fireBullet() {
            this.beLaunched = true;
            this.time = 0;
        }

        private temp_pickInfo= gd3d.math.pool.new_pickInfo();
        private pickScene(fuc:(info:gd3d.framework.pickinfo)=>void)
        {
            let inputMgr = this.app.getInputMgr();
            let ray = this.camera.creatRayByScreen(new gd3d.math.vector2(inputMgr.point.x, inputMgr.point.y), this.app);
            let temp=this.temp_pickInfo;


            let bePickMesh=false;
            let infos=this.intersetColliders(ray,this.targets);

            for(let i=0;i<infos.length;i++)
            {
                bePickMesh= this.intersetMesh(ray,temp,infos[i].pickedtran);
                if(bePickMesh)
                    break;
            }
            if(!bePickMesh&&this.floor)
            {
                bePickMesh=this.intersetMesh(ray,temp,this.floor);
            }
            this.behit=bePickMesh;
            if(bePickMesh)
            {
                gd3d.math.vec3Clone(temp.hitposition,this.hitPosition);
                fuc(temp);
            }else
            {
                // console.error("鸡毛没碰到！");
            }

            for(let key in infos)
            {
                gd3d.math.pool.delete_pickInfo(infos[key]);
            }

            // gd3d.math.pool.delete_pickInfo(temp);
        }

        gameupdate(delta:number)
        {
            this.updateInfo();
            this.updateBullet(delta);
            this.updateUI();
        }

        private temptPos: gd3d.math.vector3 = new gd3d.math.vector3();
        private temptdir: gd3d.math.vector3 = new gd3d.math.vector3();


        private updateBullet(delta: number) {
            if (this.beLaunched&&this.behit) {
                this.time += delta;

                let lerp = this.time / this.totaltime;
                lerp = Math.min(lerp, 1.0);

                let paojiaWorldpos=this.paojia.getWorldPosition();
                this.bessel(paojiaWorldpos,this.middlePos,this.hitPosition, lerp, this.temptPos);

                gd3d.math.vec3Clone(this.temptPos, this.paodan.localPosition);
                
                this.paodan.markDirty();

                this.getBeselDir(paojiaWorldpos,this.middlePos,this.hitPosition,lerp,this.temptdir);
                // gd3d.math.vec3Normalize(this.temptdir,this.temptdir);
                gd3d.math.vec3Add(this.paodan.getWorldPosition(),this.temptdir,this.temptdir);
                this.paodan.lookatPoint(this.temptdir);

            }

        }

        private screenpos: gd3d.math.vector2 = new gd3d.math.vector2();
        private updateUI() {
            if (this.beUIFollow && this.paodan) {
                let pos = this.paodan.getWorldPosition();
                this.camera.calcScreenPosFromWorldPos(this.app, pos, this.screenpos);

                gd3d.math.vec2Clone(this.screenpos, this.testUI.localTranslate);
                this.testUI.markDirty();
            }
        }

        private updatePaojia(middlePos:gd3d.math.vector3)
        {
            let dir=gd3d.math.pool.new_vector3();
            gd3d.math.vec3Subtract(middlePos,this.paojia.getWorldPosition(),dir);
            gd3d.math.vec3Normalize(dir,dir);
            let info=this.getRotAnlge(dir,gd3d.math.pool.vector3_forward);
            gd3d.math.quatFromEulerAngles(-1*info.rotx,info.roty,0,this.paojia.localRotate);
            this.paojia.markDirty();
        }

        updateInfo()
        {
            // this.pickScene((info)=>{
            //     this.adjustMiddlePoint(this.paojia.getWorldPosition(),info.hitposition,this.temtOut);
            //     gd3d.math.quatClone(this.temtOut.rot,this.paojia.localRotate);
            //     this.paojia.markDirty();
            // });

        }
        //-----------------------------game util---------------------------------------------------------------------------------
        intersetMesh(ray:gd3d.framework.ray,info:gd3d.framework.pickinfo,tran:gd3d.framework.transform):boolean
        {
            var meshFilter = tran.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
            if (meshFilter != null)
            {
                //3d normal mesh
                var mesh = meshFilter.getMeshOutput();
                if (mesh)
                {
                    let bool = mesh.intersects(ray, tran.getWorldMatrix(), info);
                    return bool;
                }
            }
            return false;
        }

        intersetColliders(ray:gd3d.framework.ray,trans:gd3d.framework.transform[]):gd3d.framework.pickinfo[]
        {
            let infos:gd3d.framework.pickinfo[]=[];

            let info=gd3d.math.pool.new_pickInfo();
            for(let i=0;i<trans.length;i++)
            {
                let bepicked=ray.intersectCollider(trans[i],info);
                if(bepicked)
                {
                    let newinfo=gd3d.math.pool.new_pickInfo();
                    newinfo.cloneFrom(info);
                    infos.push(newinfo);
                }
            }
            infos.sort((a,b)=>{
                return a.distance-b.distance;
            });
            return infos;
        }

        addcube(pos: gd3d.math.vector3, scale:gd3d.math.vector3=null): gd3d.framework.transform {
            let cube4 = new gd3d.framework.transform();
            if(scale!=null)
            {
                gd3d.math.vec3Clone(scale,cube4.localScale);
            }
            gd3d.math.vec3Clone(pos, cube4.localPosition);
            this.scene.addChild(cube4);

            let meshf4 = cube4.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            cube4.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            meshf4.mesh = this.assetmgr.getDefaultMesh("cube");
            return cube4;
        }

        private addBtn(text: string, x: number, y: number, func: () => void) {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () => {
                func();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }

        private adjustMiddlePoint(from: gd3d.math.vector3, to: gd3d.math.vector3,pos: gd3d.math.vector3)
        {
            let dis = gd3d.math.vec3Distance(from, to);
            //----lerp
            let lerp = 0.7;
            gd3d.math.vec3SLerp(from, to, lerp,pos);
            //---------------up延伸
            // let upy=10;
            pos.y += dis * 0.5;
        }

        private bessel(from: gd3d.math.vector3, middle: gd3d.math.vector3, to: gd3d.math.vector3, t: number,out:gd3d.math.vector3)
        {
            //out=from*(1-t)^2+middle*2t(1-t)+to*t^2

            let p1 = Math.pow(1 - t, 2);
            let p2 = 2 * t * (1 - t);
            let p3 = Math.pow(t, 2);

            out.x = from.x * p1 + middle.x * p2 + to.x * p3;
            out.y = from.y * p1 + middle.y * p2 + to.y * p3;
            out.z = from.z * p1 + middle.z * p2 + to.z * p3;
        }

        private getBeselDir(from: gd3d.math.vector3, middle: gd3d.math.vector3, to: gd3d.math.vector3, t: number,out:gd3d.math.vector3)
        {
            //out=from*2*(1-t)*(-1)+middle*2(1-2t)+to*2t
            let p1 = -1*2*(1-t);
            let p2 = 2 *(1-2*t);
            let p3 = 2*t;

            out.x = from.x * p1 + middle.x * p2 + to.x * p3;
            out.y = from.y * p1 + middle.y * p2 + to.y * p3;
            out.z = from.z * p1 + middle.z * p2 + to.z * p3;
        }

        private getRotAnlge(dir:gd3d.math.vector3,forward:gd3d.math.vector3):{rotx:number,roty:number}
        {
            let tana=dir.y/Math.sqrt(dir.x*dir.x+dir.z*dir.z);
            let _rotx=Math.atan(tana)*180/Math.PI;

            dir.y=0;
            gd3d.math.vec3Normalize(dir,dir);
            let _roty=this.fromToRotation(forward,dir,gd3d.math.pool.vector3_right);
            return {rotx:_rotx,roty:_roty};
        }

        private fromToRotation(from:gd3d.math.vector3,to:gd3d.math.vector3,right:gd3d.math.vector3):number
        {
            let dir1=gd3d.math.pool.new_vector3();
            let dir2=gd3d.math.pool.new_vector3();

            gd3d.math.vec3Normalize(from,dir1);  
            gd3d.math.vec3Normalize(to,dir2);

            let dot=gd3d.math.vec3Dot(dir1,dir2);

            let dot2=gd3d.math.vec3Dot(dir2,right);
            dot2=Math.acos(dot2)*180/Math.PI;
            if(dot2>90)
            {
                dot=-1*Math.acos(dot)*180/Math.PI;
            }else
            {
                dot=Math.acos(dot)*180/Math.PI;
            }

            gd3d.math.pool.delete_vector3(dir1);
            gd3d.math.pool.delete_vector3(dir2);
            return dot;
        }
    }
}