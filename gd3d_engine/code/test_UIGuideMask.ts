//UI 新手引导
class test_UIGuideMask implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    assetMgr: gd3d.framework.assetMgr;
    iptMgr: gd3d.framework.inputMgr;
    rooto2d: gd3d.framework.overlay2D;
    private inited = false;
    async start(app: gd3d.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        this.iptMgr = this.app.getInputMgr();
        //相机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 10;
        //2dUI root
        this.rooto2d = new gd3d.framework.overlay2D();
        this.camera.addOverLay(this.rooto2d);
        await datGui.init();
        this.init();
    }
    
    private dec  = "点击屏幕 , 移动孔的位置"
    init(){
        //遮挡模板 
        let template = new gd3d.framework.transform2D();
        let rImg = template.addComponent("rawImage2D") as gd3d.framework.rawImage2D;
        rImg.image = this.assetMgr.getDefaultTexture(gd3d.framework.defTexture.white);
        rImg.color = new gd3d.math.color(0,0,0,0.8);

        let opt = gd3d.framework.layoutOption;
        let maskui = new gd3d.framework.transform2D();
        maskui.layoutState = opt.TOP | opt.BOTTOM |opt.LEFT |opt.RIGHT ;
        let maskComp = maskui.addComponent("guideMask") as guideMask;
        this.rooto2d.addChild(maskui);
        maskComp.holeRect = new gd3d.math.rect(200,200,100,100);
        maskComp.template = template;

        let tv2 = new gd3d.math.vector2();
        let tv2_1 = new gd3d.math.vector2();
        this.iptMgr.addPointListener(gd3d.event.PointEventEnum.PointDown,([x,y])=>{
            gd3d.math.vec2Set(tv2,x,y);
            this.rooto2d.calScreenPosToCanvasPos(tv2,tv2_1);
            maskComp.holeRect.x = tv2_1.x;
            maskComp.holeRect.y = tv2_1.y;
            maskComp.holeRect = maskComp.holeRect; 
        },this);

        //adtUI
        let gui = new dat.GUI();;
        gui.add( this , 'dec');
    }

    update(delta: number) {
        

    }


 
}