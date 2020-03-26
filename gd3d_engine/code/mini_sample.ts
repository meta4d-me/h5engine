
/** 极简样例 */
class mini_sample implements IState
{
    start(app: gd3d.framework.application)
    {
        let obj = gd3d.framework.TransformUtil.CreatePrimitive(gd3d.framework.PrimitiveType.Cube, app);
        let scene = app.getScene();
        scene.addChild(obj);
        //initCamera
        let objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new gd3d.math.vector3(0, 15, -15);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as gd3d.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new gd3d.math.vector3(0, 2.5, 0)
    }

    update(delta: number)
    {


    }
}