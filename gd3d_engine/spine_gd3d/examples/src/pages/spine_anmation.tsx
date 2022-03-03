import React from "react";
import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src/index";
export class SpineAnimation extends React.Component {
    componentDidMount(): void {
        let app = new gd3d.framework.application();
        app.bePlay = true;
        let div = document.getElementById("container") as HTMLDivElement;
        app.start(div);
        let scene = app.getScene();
        //相机
        var objCam = new gd3d.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        camera.near = 0.01;
        camera.far = 10;
        camera.opvalue = 0;
        //2dUI root
        let root2d = new gd3d.framework.overlay2D();
        camera.addOverLay(root2d);
        this.init(app, root2d);
    }

    private init(app: gd3d.framework.application, root2d: gd3d.framework.overlay2D) {


        let fscodeUI: string = `
        uniform sampler2D _MainTex;
        varying lowp vec4 xlv_COLOR;
        varying highp vec2 xlv_TEXCOORD0;
        void main()
        {
            lowp vec4 tmpvar_3;
            tmpvar_3 = (xlv_COLOR * texture2D(_MainTex, xlv_TEXCOORD0));
            gl_FragData[0] = tmpvar_3;
        }`;
        let vscodeUI: string = `
        attribute vec4 _glesVertex;    
        attribute vec4 _glesColor;                   
        attribute vec4 _glesMultiTexCoord0;          
        uniform highp mat4 _SpineMvp;       
        varying lowp vec4 xlv_COLOR;                 
        varying highp vec2 xlv_TEXCOORD0;            
        void main()                                      
        {                                                
            highp vec4 tmpvar_1;                         
            tmpvar_1.w = 1.0;                            
            tmpvar_1.xyz = _glesVertex.xyz;              
            xlv_COLOR = _glesColor;                      
            xlv_TEXCOORD0 = vec2(_glesMultiTexCoord0.x,_glesMultiTexCoord0.y);      
            gl_Position = (_SpineMvp * tmpvar_1);   
        }
        `;
        let pool = app.getAssetMgr().shaderPool;
        pool.compileVS(app.webgl, "spine", vscodeUI);
        pool.compileFS(app.webgl, "spine", fscodeUI);
        let program = pool.linkProgram(app.webgl, "spine", "spine");
        var spineShader = new gd3d.framework.shader("shader/spine");
        spineShader.passes["base"] = [];
        var p = new gd3d.render.glDrawPass();
        p.setProgram(program);
        spineShader.passes["base"].push(p);
        spineShader.fillUnDefUniform(p);
        p.state_ztest = false;
        p.state_zwrite = false;
        p.state_showface = gd3d.render.ShowFaceStateEnum.ALL;

        let assetManager = new SpineAssetMgr(app.getAssetMgr());
        // spineSkeleton.shader = app.getAssetMgr().getShader("shader/defui");
        spineSkeleton.shader = spineShader;
        let skeletonFile = "./assets/raptor-pro.json";
        let atlasFile = "./assets/raptor.atlas"
        let animation = "walk";
        Promise.all([
            new Promise<void>((resolve, reject) => {
                assetManager.loadText(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) => {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() => {
                let atlas = assetManager.require(atlasFile);
                let atlasLoader = new AtlasAttachmentLoader(atlas);
                let skeletonJson = new SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.require(skeletonFile));
                let comp = new spineSkeleton(skeletonData);
                comp.state.setAnimation(0, animation, true);
                let spineNode = new gd3d.framework.transform2D;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }

    render(): React.ReactNode {
        return <div id="container">spine_animation</div>
    }
}