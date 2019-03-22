/** 
 * 3d物理 复合物理对象 compound
 */
class test_3DPhysics_compound implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    astMgr : gd3d.framework.assetMgr;
    mrs : gd3d.framework.meshRenderer[] = [];
    iptMgr : gd3d.framework.inputMgr;
    async start  (app: gd3d.framework.application) {
        await physics3dDemoTool.init(app);
        this.app = app;
        this.scene = physics3dDemoTool.scene;
        this.astMgr = physics3dDemoTool.astMgr;
        this.iptMgr = physics3dDemoTool.iptMgr;
        this.camera = physics3dDemoTool.camera;
        this.init();
        return null;
    }

    private types = [ 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box' ];
    // private types = [ 'box'];
    private sizes = [ 30,5,30,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  23,10,3 ];
    private positions = [ 0,0,0,  12,-16,12,  -12,-16,12,  12,-16,-12,  -12,-16,-12,  12,16,-12,  -12,16,-12,  0,25,-12 ];
    private chairId = 0;
    //创建一把 椅子
    private crateChair(){
        let chairTran = new gd3d.framework.transform();
        gd3d.math.vec3Set(chairTran.localPosition,0,3,5);
        gd3d.math.vec3SetAll(chairTran.localScale,3);
        this.scene.addChild(chairTran);
        chairTran.name = `chair_${this.chairId}`;
        this.chairId++;
        let len = this.types.length;
        let mat = physics3dDemoTool.mats["activated"];
        let mesh, n, m;
        let sizes = this.sizes;
        let positions = this.positions;
        let tag = "_chairItype_";
        let subs = [];
        let scale = 3;
        for(var i=0; i < len ; i++){
            let sunTran = new gd3d.framework.transform();
            sunTran.name = `sub_${len}`;
            n = i*3;
            // m = new THREE.Matrix4().makeTranslation( positions[n+0], positions[n+1], positions[n+2] );
            gd3d.math.vec3Set(sunTran.localPosition, positions[n+0]/100 * scale, positions[n+1]/100 * scale, positions[n+2]/100 * scale);
            gd3d.math.vec3Set(sunTran.localScale,sizes[n+0]/100 * scale, sizes[n+1]/100 * scale, sizes[n+2]/100 * scale);
            chairTran.addChild(sunTran);
            let meshName = "cube";
            // if(i==1 || i==2 || i==3 || i==4 || i==5 || i==6) meshName = "cylinder";
            physics3dDemoTool.attachMesh(sunTran,mat,meshName , true);
            let itype = meshName == "cylinder"? gd3d.framework.ImpostorType.CylinderImpostor : gd3d.framework.ImpostorType.BoxImpostor;
            sunTran[tag] = itype;
            subs.push(sunTran);
        }
        subs.forEach(c=>{
            new gd3d.framework.PhysicsImpostor(c, c[tag] , { mass: 0.5});
        });
        // new gd3d.framework.PhysicsImpostor(chairTran, gd3d.framework.ImpostorType.NoImpostor, { mass: 1,friction:0.8, disableBidirectionalTransformation : true});
        new gd3d.framework.PhysicsImpostor(chairTran, gd3d.framework.ImpostorType.NoImpostor, { mass: 1,friction:0.8});
        let mr = chairTran.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer; 
        this.mrs.push(mr);
        return chairTran;
    }

    private targetTran : gd3d.framework.transform;
    private boxTran : gd3d.framework.transform;
    private cylinderTran : gd3d.framework.transform;
    private floor : gd3d.framework.transform;
    init(){
        //初始化 物理世界-----------------------
        this.scene.enablePhysics(new gd3d.math.vector3(0,-9.8,0),new gd3d.framework.OimoJSPlugin());
        let mat_activated = physics3dDemoTool.mats["activated"];
        let mat_stick = physics3dDemoTool.mats["yellow"];
        let mat_white = physics3dDemoTool.mats["white"];
        //构建物体-------------------
        //底面
        let trans=new gd3d.framework.transform();
        this.floor = trans;
        trans.localScale.x= 20;
        trans.localScale.y= 0.01;
        trans.localScale.z= 20;
        this.scene.addChild(trans);
        physics3dDemoTool.attachMesh(trans , mat_white ,"cube");

        //box
        let trans2=new gd3d.framework.transform();
        this.boxTran = trans2;
        trans2.name = "box"
        trans2.localPosition.y=5;
        trans2.localPosition.x= -0.3;
        trans2.localPosition.z=0.3;
        this.scene.addChild(trans2);
        let mr = physics3dDemoTool.attachMesh(trans2 , mat_activated ,"cube");

        //sphere
        let trans3=new gd3d.framework.transform();
        trans3.name = "sphere";
        trans3.localPosition.y = 15;
        trans3.localPosition.x = -0.2;
        trans3.localPosition.z = 0.2;
        this.scene.addChild(trans3);
        let mr1 = physics3dDemoTool.attachMesh(trans3 , mat_activated ,"sphere");

        //cylinder
        let cylinder_mid =new gd3d.framework.transform();
        this.cylinderTran = cylinder_mid;
        cylinder_mid.name = "cylinder"
        cylinder_mid.localPosition.y = 8;
        this.scene.addChild(cylinder_mid);
        let mr2 =physics3dDemoTool.attachMesh(cylinder_mid , mat_stick ,"cylinder");

        
        let groundImpostor = new gd3d.framework.PhysicsImpostor(trans, gd3d.framework.ImpostorType.PlaneImpostor, { mass: 0, restitution: 0.1 , friction: 0.9});
        //chair 复合物体 需要放置在 静态地板之后 不然会有异常（omio 的BUG）
        let _c = this.crateChair();
        // let boxImpostor = new gd3d.framework.PhysicsImpostor(trans2, gd3d.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.6 ,friction: 0.5});
        let boxImpostor = new gd3d.framework.PhysicsImpostor(trans2, gd3d.framework.ImpostorType.BoxImpostor, { mass: 2 ,restitution: 0.5 , kinematic : true });
        let sphereImpostor = new gd3d.framework.PhysicsImpostor(trans3, gd3d.framework.ImpostorType.SphereImpostor, { mass: 0.5, restitution: 0.6 ,friction: 0.5});
        let cylinderImpostor = new gd3d.framework.PhysicsImpostor(cylinder_mid, gd3d.framework.ImpostorType.CylinderImpostor, { mass: 2,friction:0.5});



        this.mrs.push(mr,mr1,mr2);
        //apply Target set
        this.targetTran = _c;

        //鼠标事件
        this.iptMgr.addPointListener(gd3d.event.PointEventEnum.PointMove,this.onPonitMove,this);

        //GUI
        this.setGUI();
    }

    private guiMsg = "复合物理对象 demo ";
    setGUI(){
        if(!dat) return;
        let gui = new dat.GUI();
        gui.add(this, 'guiMsg');
        //force
        let folderF = gui.addFolder("force (冲量)");
        let limitf = 100;
        folderF.add(this.force, 'x', -limitf, limitf);
        folderF.add(this.force, 'y', -limitf, limitf);
        folderF.add(this.force, 'z', -limitf, limitf);
        let folderC = gui.addFolder("contactPoint (施加点)");
        let limitc = 3;
        folderC.add(this.contactlocalPoint, 'x', -limitc, limitc);
        folderC.add(this.contactlocalPoint, 'y', -limitc, limitc);
        folderC.add(this.contactlocalPoint, 'z', -limitc, limitc);
        //方法
        let folderFun = gui.addFolder("触发方法");
        folderFun.open();
        folderFun.add(this, 'impulseTarget' );
        folderFun.add(this, 'applyReset' );
    }

    //重置
    private applyReset(){
        physics3dDemoTool.resetObj(this.mrs);
    }

    private impulseTarget(){
        this.doImpulse(this.targetTran.physicsImpostor);
    }

    private force = new gd3d.math.vector3(-10,0,5);
    private contactlocalPoint = new gd3d.math.vector3(0,0,0);
    private tempV3 = new gd3d.math.vector3();
    private doImpulse(phyImpostor : gd3d.framework.PhysicsImpostor){
        let pos = this.tempV3;
        gd3d.math.vec3Add(phyImpostor.object.getWorldPosition(),this.contactlocalPoint,pos);
        phyImpostor.applyImpulse(this.force, pos);
    }

    cachePickInfo = new gd3d.framework.pickinfo();
    cacheRota = new gd3d.math.quaternion();
    cache_y = 0;
    //移动 到射线点
    onPonitMove([x,y]){
        let viewPos = help_v2;
        viewPos.x = x;
        viewPos.y = y;
        console.log(`x: ${x} ,y :${y}`);
        let ray = this.camera.creatRayByScreen(viewPos,this.app);
        let mf = this.floor.gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
        let isinsrt =  mf.mesh.intersects(ray,this.floor.getWorldMatrix(),this.cachePickInfo);
        if(!isinsrt || !this.cachePickInfo || !this.cachePickInfo.hitposition)return;
        let pos = this.cachePickInfo.hitposition;
        console.log(`pos  x: ${pos.x} ,y :${pos.y} , z: ${pos.z}`);

        //同步ctr box 位置
        pos.y += 0.55;
        this.boxTran.physicsImpostor.kinematicSetPosition(pos);  //更新动力学 位置
    }

    private tcount = 0;
    private time = 0.5;
    update(delta: number) {
        this.tcount += delta;
        if(this.tcount > this.time){
            physics3dDemoTool.ckBodySleeped(this.mrs);
            this.tcount = 0;
        }

    }
}