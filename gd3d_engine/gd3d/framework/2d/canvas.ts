/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d节点的容器类
     * @version egret-gd3d 1.0
     */
    @gd3d.reflect.SerializeType
    export class canvas
    {
        static readonly ClassName:string="canvas";

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 构造函数
         * @version egret-gd3d 1.0
         */
        constructor()
        {
            this.rootNode = new transform2D();
            this.rootNode.canvas = this;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 用于区分当前容器是在overlay(2D)还是canvasrenderer(3D)下
         * @version egret-gd3d 1.0
         */
        is2dUI: boolean = true;
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 如果是在canvasrenderer下，这里可以获取到canvasrenderer所在的transform节点
         * @version egret-gd3d 1.0
         */
        parentTrans: transform;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 2d批处理类，用来收集2d节点，完成绘制
         * @version egret-gd3d 1.0
         */
        batcher: batcher2D;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * webgl实例
         * @version egret-gd3d 1.0
         */
        webgl: WebGLRenderingContext;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前所在场景
         * @version egret-gd3d 1.0
         */
        scene: scene;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d节点
         * @param node 要添加的2d节点实例
         * @version egret-gd3d 1.0
         */
        addChild(node: transform2D)
        {
            this.rootNode.addChild(node);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除2d节点
         * @param node 要移除的2d节点实例
         * @version egret-gd3d 1.0
         */
        removeChild(node: transform2D)
        {
            this.rootNode.removeChild(node);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所有孩子节点
         * @version egret-gd3d 1.0
         */
        getChildren(): transform2D[]
        {
            return this.rootNode.children;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取孩子节点的数量
         * @version egret-gd3d 1.0
         */
        getChildCount(): number
        {
            if (this.rootNode.children == null) return 0;
            return this.rootNode.children.length;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取指定的孩子节点
         * @param index 位置索引
         * @version egret-gd3d 1.0
         */
        getChild(index: number): transform2D
        {
            return this.rootNode.children[index];
        }

        private pointDown: Boolean = false;
        private pointEvent: PointEvent = new PointEvent();
        private pointX: number = 0;
        private pointY: number = 0;

        private lastWidth = 0;
        private lastHeight = 0;
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 更新
         * @param delta 两次update的间隔时间
         * @param touch 是否接收到事件
         * @param XOnModelSpace 模型空间下的x偏移
         * @param YOnModelSpace 模型空间下的y偏移
         * @version egret-gd3d 1.0
         */
        update(delta: number, touch: Boolean, XOnModelSpace: number, YOnModelSpace: number)
        {
            //canvas 的空间是左上角(-asp,1)-(asp,-1),和屏幕空间一致
            //右下角是 1*asp，1
            //这里有点状况，不应该乘以
            var asp = this.pixelWidth / this.pixelHeight;
            this.rootNode.localScale.x = 2 / this.pixelWidth;
            this.rootNode.localScale.y = -2 / this.pixelHeight;
            this.rootNode.localTranslate.y = 1;
            this.rootNode.localTranslate.x = -1;

            if(this.pixelWidth != this.lastWidth || this.pixelHeight != this.lastHeight){
                this.lastWidth = this.rootNode.width = this.pixelWidth;
                this.lastHeight = this.rootNode.height = this.pixelHeight;
                this.rootNode.markDirty();
            }

            this.rootNode.pivot.x = 0;
            this.rootNode.pivot.y = 0;
            this.rootNode.updateTran(false);

            {//updateinput
                //重置event
                this.pointEvent.eated = false;
                this.pointEvent.x = XOnModelSpace;
                this.pointEvent.y = YOnModelSpace;
                this.pointEvent.selected = null;
                var skip = false;
                if (this.pointDown == false && touch == false)//nothing
                {
                    skip = true;
                }
                else if (this.pointDown == false && touch == true)//pointdown
                {
                    this.pointEvent.type = event.PointEventEnum.PointDown;
                }
                else if (this.pointDown == true && touch == true)//pointhold
                {
                    this.pointEvent.type = event.PointEventEnum.PointHold;
                    if (this.pointX == this.pointEvent.x && this.pointY == this.pointEvent.y)
                    {
                        // console.log("skip event");
                        skip = true;
                    }
                }
                else if (this.pointDown == true && touch == false)//pointup
                {
                    this.pointEvent.type = event.PointEventEnum.PointUp;
                }
                //事件走的是flash U型圈
                if (!skip)
                {
                    if(this.scene.app.bePlay){
                        this.rootNode.onCapturePointEvent(this, this.pointEvent);
                        this.rootNode.onPointEvent(this, this.pointEvent);
                    }
                    this.pointDown = touch;
                    this.pointX = this.pointEvent.x;
                    this.pointY = this.pointEvent.y;
                }
            }

            //this.rootNode.update(delta);
            if (this.scene.app.bePlay)
            {
                this.objupdate(this.rootNode,delta);
            }
        }

        private objupdate(node: transform2D, delta){

            node.init(this.scene.app.bePlay);//组件还未初始化的初始化
            if (node.components.length > 0)
            {
                node.update(delta);
            }

            if (node.children != null)
            {
                for (let i = 0; i < node.children.length; i++)
                {
                    this.objupdate(node.children[i], delta);
                }
            }
        }

        private lastMat: material;
        //static defmat: material;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染完成后的回调
         * @version egret-gd3d 1.0
         */
        public afterRender: Function;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染前回调
         * @version egret-gd3d 1.0
         */
        public beforeRender: Function;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染
         * @param context 渲染上下文
         * @param assetmgr 资源管理类的实例
         * @version egret-gd3d 1.0
         */
        render(context: renderContext, assetmgr: assetMgr)
        {
            DrawCallInfo.inc.currentState=DrawCallEnum.UI;
            this.context = context;
            this.assetmgr = assetmgr;
            // context.updateModel(this.gameObject.transform);
            this.lastMat = null;

            // if (canvasRenderer.defmat == null)
            // {
            //     canvasRenderer.defmat = new material();
            //     canvasRenderer.defmat.setShader(assetmgr.getShader("shader/defui"));
            // }
            if (this.batcher == null)
            {
                this.webgl = context.webgl;
                this.batcher = new batcher2D();
                var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0 | gd3d.render.VertexFormatMask.ColorEX;
                this.batcher.initBuffer(context.webgl, vf, render.DrawModeEnum.VboTri);


            }

            //this.pushDrawData(canvas.defmat, this.vbod);

            if(this.beforeRender != null)
                this.beforeRender();

            //begin
            this.drawScene(this.rootNode, context, assetmgr);
            this.batcher.end(context.webgl);

            
            if (this.afterRender != null)
                this.afterRender();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 提交原始数据</p>
         * 所有的2d渲染组件将数据提交到这里</p>
         * 最后由批处理完成绘制
         * @param mat 材质
         * @param data 2d渲染组件的顶点数据
         * @version egret-gd3d 1.0
         */
        pushRawData(mat: material, data: number[])
        {
            if (mat != this.lastMat)
            {
                this.lastMat = mat;
                this.batcher.end(this.webgl);
                let pass = this.lastMat.getShader().passes["base"][0];

                //有一些自动参数要传进去
                //mat.setMatrix("glstate_matrix_mvp", this.context.matrixModelViewProject);

                //mat.uploadUniform(pass);
                // //mvp 信号
                pass.use(this.webgl);
                mat.uploadUnifoms(pass,this.context);

                // this.batcher.begin(context.webgl, pass);

                // this.batcher.push(context.webgl, this.vbod, null);
                // this.batcher.end(context.webgl);
                this.batcher.begin(this.webgl, pass);
            }else{
                let msta = mat.statedMapUniforms["MaskState"]; 
                let mr = mat.statedMapUniforms["_maskRect"];
                if(msta != null && msta.value != null && mr != null && mr.value != null){
                    let rect = mr.value as math.vector4;
                    if(this.lastMaskV4 == null) this.lastMaskV4 = new math.vector4();
                    if(msta.value != this.lastMaskSta || this.lastMaskV4.x != rect.x || this.lastMaskV4.y != rect.y || this.lastMaskV4.z != rect.z || this.lastMaskV4.w != rect.w){
                        this.lastMaskSta = msta.value;
                        math.vec4Clone(rect,this.lastMaskV4);
                        this.batcher.end(this.webgl);
                        let pass = this.lastMat.getShader().passes["base"][0];
                        //mat.uploadUniform(pass);
                        mat.uploadUnifoms(pass,this.context);
                    }
                }
            }
            
            this.batcher.push(this.webgl, data, null);
        }
        private context: renderContext;

        private lastMaskSta:number = -1;
        private lastMaskV4:math.vector4;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 资源管理类的实例
         * @version egret-gd3d 1.0
         */
        assetmgr: assetMgr;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 绘制2d节点
         * @param node 要绘制的2d节点
         * @param context 渲染上下文
         * @param assetmgr 资源管理类的实例
         * @version egret-gd3d 1.0
         */
        drawScene(node: transform2D, context: renderContext, assetmgr: assetMgr)
        {
            //context.updateModel(this.gameObject.transform);
            if(!node.visible)return;
            if (node.renderer != null)
            {
                node.renderer.render(this);
            }
            if (node.children != null)
            {
                for (var i = 0; i < node.children.length; i++)
                {
                    this.drawScene(node.children[i], context, assetmgr);
                }
            }
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 画布使用的像素宽度
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        pixelWidth: number = 640;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 画布使用的像素高度
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        pixelHeight: number = 480;
        
        @gd3d.reflect.Field("transform2D")
        private rootNode: transform2D;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取canvas的根节点
         * @version egret-gd3d 1.0
         */
        getRoot(): transform2D
        {
            if (this.rootNode == null)
            {
                this.rootNode = new transform2D();
                this.rootNode.canvas = this;
                this.scene.app.markNotify(this.rootNode,NotifyType.AddChild);
            }
            return this.rootNode;
        }

        //屏幕空间坐标 转到 canvas 坐标
        ModelPosToCanvasPos(fromP:math.vector2,outP:math.vector2){
            if(fromP == null || outP == null) return;
            let scalx = 1 - (fromP.x - 1)/-2;  
            let scaly =  (fromP.y - 1)/-2;
            outP.x = scalx * this.pixelWidth;
            outP.y = scaly * this.pixelHeight;
        }
    }
}