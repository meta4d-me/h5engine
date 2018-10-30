namespace dome
{
    export class paowuxian implements IState
    {
        camera: gd3d.framework.camera;
        scene: gd3d.framework.scene;
        app: gd3d.framework.application;
        assetmgr:gd3d.framework.assetMgr;
        taskmgr: gd3d.framework.taskMgr = new gd3d.framework.taskMgr();

        private paoLen:number=2;
        private paojia:gd3d.framework.transform;
        private paodan:gd3d.framework.transform;
        private guiji:gd3d.framework.transform;
        private orgPos:gd3d.math.vector3=new gd3d.math.vector3(0,0,-10);
        rotEuler:gd3d.math.vector3=new gd3d.math.vector3(-90,0,0);
        gravity:number=10;
        speed:number=10;


        dir:gd3d.math.vector3=new gd3d.math.vector3();
        start(app: gd3d.framework.application) {
            this.app=app;
            this.scene=app.getScene();
            this.assetmgr=app.getAssetMgr();

            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.gamerun.bind(this));

        }

        private loadShader(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, (_state) =>
            {
                if (_state.isfinish)
                {
                    state.finish = true;
                }
            }
            );
        }

        private gamerun(laststate: gd3d.framework.taskstate, state: gd3d.framework.taskstate)
        {
            this.addcam();
            this.addcube();

            this.addUI();
            state.finish=true;
        }


        private paoKouPos:gd3d.math.vector3=new gd3d.math.vector3();

        private timer:number=0;
        update(delta: number) {
            this.taskmgr.move(delta);
            CameraController.instance().update(delta);

            if(this.paojia)
            {
                this.rotEuler.x= gd3d.math.floatClamp(this.rotEuler.x,-90,0);

                this.paojia.localEulerAngles=this.rotEuler;
                this.paojia.markDirty();
    
                this.guiji.localEulerAngles=new gd3d.math.vector3(0,this.rotEuler.y,0);
                this.guiji.markDirty();
    
                let meshf=this.guiji.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
                // this.getDirByRotAngle(this.rotEuler,this.dir);
                // gd3d.math.vec3Normalize(this.dir,this.dir);
                //------------炮口位置
                //gd3d.math.vec3ScaleByNum(this.dir,this.paoLen,this.paoKouPos);

                meshf.mesh=this.getMeshData(-this.rotEuler.x,this.gravity,this.speed,this.paoLen);
            }


            if(this.actived)
            {
                this.timer+=delta*0.1;
                let move=new gd3d.math.vector3();
                gd3d.math.vec3ScaleByNum(this.dir,this.speed,move);
                gd3d.math.vec3ScaleByNum(move,this.timer,move);
                move.y-=0.5*this.gravity*this.timer*this.timer;


                gd3d.math.vec3Add(this.paoKouPos,move,this.paodan.localPosition);
                gd3d.math.vec3Add(this.paodan.localPosition,this.paojia.getWorldPosition(),this.paodan.localPosition);

                this.paodan.markDirty();

                if(this.paodan.localPosition.y<0)
                {
                    this.actived=false;
                }
            }
        }

        private addcam()
        {
            //添加一个摄像机
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
            this.camera.near = 0.01;
            this.camera.far = 2000;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            objCam.localTranslate = new gd3d.math.vector3(0,0,-15);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();//标记为需要刷新
            // let controller=new CameraController();
            CameraController.instance().init(this.app,this.camera);
        }


        private addcube()
        {
            let cube0=new gd3d.framework.transform();
            cube0.localScale=new gd3d.math.vector3(1000,0.01,1000);
            this.scene.addChild(cube0);
            let meshf0=cube0.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            let meshr0=cube0.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            meshf0.mesh=this.assetmgr.getDefaultMesh("cube");

            let cube1=new gd3d.framework.transform();
            this.paojia=cube1;
            cube1.localPosition=this.orgPos;
            cube1.localScale=new gd3d.math.vector3(0.5,0.5,this.paoLen*2);
            this.scene.addChild(cube1);
            let meshf1=cube1.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            let meshr1=cube1.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            meshf1.mesh=this.assetmgr.getDefaultMesh("cube");
            
            let cube2=new gd3d.framework.transform();
            cube2.localScale=new gd3d.math.vector3(0.2,0.2,0.2);
            this.paodan=cube2;
            this.scene.addChild(cube2);
            let meshf2=cube2.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            let meshr2=cube2.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            meshf2.mesh=this.assetmgr.getDefaultMesh("cube");

            let cube3=new gd3d.framework.transform();
            this.guiji=cube3;
            cube3.localPosition=this.orgPos;
            this.scene.addChild(cube3);
            let meshf3=cube3.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            let meshr3=cube3.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            let mat=new gd3d.framework.material();
            let shader=this.assetmgr.getShader("diffuse_bothside.shader.json");
            mat.setShader(shader);
            meshr3.materials=[mat];

        }

        getDirByRotAngle(euler:gd3d.math.vector3,dir:gd3d.math.vector3)
        {
            let rot=new gd3d.math.quaternion();
            gd3d.math.quatFromEulerAngles(euler.x,euler.y,euler.z,rot);
            gd3d.math.quatTransformVector(rot,gd3d.math.pool.vector3_forward,dir);

            // gd3d.math.vec3ScaleByNum(dir,3,dir);

            // let cube2=new gd3d.framework.transform();
            // cube2.localPosition=dir;
            // this.scene.addChild(cube2);
            // let meshf2=cube2.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
            // let meshr2=cube2.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;
            // meshf2.mesh=this.assetmgr.getDefaultMesh("cube");
        }

        private mesh:gd3d.framework.mesh;
        private lerpCount:number=50;
        getMeshData(anglex:number,gravity:number,speed:number,paoLen:number,paojiaPosY:number=0):gd3d.framework.mesh
        {
            if(this.mesh==null)
            {
               this.mesh=this.initmesh(anglex,gravity,speed,paoLen,paojiaPosY);
            }else
            {
                anglex=anglex*Math.PI/180;
                let halfwidth:number=0.1;
                let posarr:gd3d.math.vector3[]=[];
                let paokouy=paoLen*Math.sin(anglex);
                let paokouz=paoLen*Math.cos(anglex);
                
                let speedy=Math.sin(anglex)*speed;
                let speedz=Math.cos(anglex)*speed;
                let totalTime=speedy/gravity+Math.sqrt(2*(paojiaPosY+paokouy)/gravity+Math.pow(speedy/gravity,2));
                //
                let count=this.lerpCount;
                let deltaTime=totalTime/count;
                for(let i=0;i<=count;i++)
                {
                    let counttime=deltaTime*i;
                    let newpos1=new gd3d.math.vector3(halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                    let newpos2=new gd3d.math.vector3(-halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                    posarr.push(newpos1);
                    posarr.push(newpos2);
                    
                }
                this.mesh.data.pos=posarr;
                var vf = gd3d.render.VertexFormatMask.Position| gd3d.render.VertexFormatMask.UV0;
                var v32 = this.mesh.data.genVertexDataArray(vf);
                this.mesh.glMesh.uploadVertexData(this.app.webgl, v32);
            }
            
            return this.mesh
        }

        private initmesh(anglex:number,gravity:number,speed:number,paoLen:number,paojiaPosY:number=0):gd3d.framework.mesh
        {
            anglex=anglex*Math.PI/180;
            let halfwidth:number=0.1;
            let posarr:gd3d.math.vector3[]=[];
            let uvArr:gd3d.math.vector2[]=[];
            let trisindex: number[]=[];
            let data=new gd3d.render.meshData();
            data.pos=posarr;
            data.uv=uvArr;
            data.trisindex=trisindex;

            let paokouy=paoLen*Math.sin(anglex);
            let paokouz=paoLen*Math.cos(anglex);
            
            let speedy=Math.sin(anglex)*speed;
            let speedz=Math.cos(anglex)*speed;
            let totalTime=speedy/gravity+Math.sqrt(2*(paojiaPosY+paokouy)/gravity+Math.pow(speedy/gravity,2));
            //
            let count=this.lerpCount;
            let deltaTime=totalTime/count;
            for(let i=0;i<=count;i++)
            {
                let counttime=deltaTime*i;
                let newpos1=new gd3d.math.vector3(halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                let newpos2=new gd3d.math.vector3(-halfwidth,speedy*counttime-0.5*gravity*Math.pow(counttime,2)+paokouy,speedz*counttime+paokouz);
                posarr.push(newpos1);
                posarr.push(newpos2);

                let newUv1=new gd3d.math.vector2(i/count,0);
                let newUv2=new gd3d.math.vector2(i/count,1);
                uvArr.push(newUv1);
                uvArr.push(newUv2);

                trisindex.push();
            }
            for(let i=0;i<count;i++)
            {
                trisindex.push(2*i+0,2*i+2,2*i+1,2*i+1,2*i+2,2*i+3);
            }

            var _mesh: gd3d.framework.mesh = new gd3d.framework.mesh(".mesh.bin");
            _mesh.data = data;
            var vf = gd3d.render.VertexFormatMask.Position| gd3d.render.VertexFormatMask.UV0;
            _mesh.data.originVF=vf;
            var v32 = _mesh.data.genVertexDataArray(vf);
            var i16 = _mesh.data.genIndexDataArray();

            _mesh.glMesh = new gd3d.render.glMesh();
            _mesh.glMesh.initBuffer(this.app.webgl, vf, _mesh.data.pos.length,gd3d.render.MeshTypeEnum.Dynamic);
            _mesh.glMesh.uploadVertexData(this.app.webgl, v32);

            _mesh.glMesh.addIndex(this.app.webgl, i16.length);
            _mesh.glMesh.uploadIndexData(this.app.webgl, 0, i16);
            _mesh.submesh = [];

            {
                var sm = new gd3d.framework.subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = false;
                _mesh.submesh.push(sm);
            }
            return _mesh;
        }
        private actived:boolean=false;
        private addUI()
        {
            let deltaangle:number=3;
            this.addBtn("左转",30,300,()=>{
                this.rotEuler.y-=deltaangle;
            });
            this.addBtn("右转",100,300,()=>{
                this.rotEuler.y+=deltaangle;
            });

            this.addBtn("上转",30,400,()=>{
                this.rotEuler.x-=deltaangle;
            });
            this.addBtn("下转",100,400,()=>{
                this.rotEuler.x+=deltaangle;
            });

            this.addBtn("发射",60,500,()=>{
                this.actived=true;
            });
        }

        private addBtn(text: string,x:number,y:number,func:()=>void)
        {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = () =>
            {
                func();
            }
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        }

    }
}