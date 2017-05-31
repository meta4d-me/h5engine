/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class canvas
    {
        constructor()
        {
            this.rootNode = new transform2D();
            this.rootNode.canvas = this;
        }
        is2dUI: boolean = true;//用于区分ui是2d还是3d

        parentTrans: transform;
        batcher: batcher2D;
        webgl: WebGLRenderingContext;
        scene: scene;
        addChild(node: transform2D)
        {
            this.rootNode.addChild(node);
        }
        removeChild(node: transform2D)
        {
            this.rootNode.removeChild(node);
        }
        getChildren(): transform2D[]
        {
            return this.rootNode.children;
        }
        getChildCount(): number
        {
            if (this.rootNode.children == null) return 0;
            return this.rootNode.children.length;
        }
        getChild(index: number): transform2D
        {
            return this.rootNode.children[index];
        }

        private pointDown: Boolean = false;
        private pointSelect: transform2D = null;//当前选中的UI
        private pointEvent: PointEvent = new PointEvent();
        private pointX: number = 0;
        private pointY: number = 0;
        update(delta: number, touch: Boolean, XOnScreenSpace: number, YOnScreenSpace: number)
        {
            //canvas 的空间是左上角(-asp,1)-(asp,-1),和屏幕空间一致
            //右下角是 1*asp，1
            //这里有点状况，不应该乘以
            var asp = this.pixelWidth / this.pixelHeight;
            this.rootNode.localScale.x = 2 / this.pixelWidth;
            this.rootNode.localScale.y = -2 / this.pixelHeight;
            this.rootNode.localTranslate.y = 1;
            this.rootNode.localTranslate.x = -1;

            this.rootNode.width = this.pixelWidth;
            this.rootNode.height = this.pixelHeight;
            this.rootNode.pivot.x = 0;
            this.rootNode.pivot.y = 0;
            this.rootNode.updateTran(false);

            {//updateinput
                //重置event
                this.pointEvent.eated = false;
                this.pointEvent.x = XOnScreenSpace;
                this.pointEvent.y = YOnScreenSpace;
                this.pointEvent.selected = this.pointSelect;
                var skip = false;
                if (this.pointDown == false && touch == false)//nothing
                {
                    skip = true;
                }
                else if (this.pointDown == false && touch == true)//pointdown
                {
                    this.pointEvent.type = PointEventEnum.PointDown;
                }
                else if (this.pointDown == true && touch == true)//pointhold
                {
                    this.pointEvent.type = PointEventEnum.PointHold;
                    if (this.pointX == this.pointEvent.x && this.pointY == this.pointEvent.y)
                    {
                        // console.log("skip event");
                        skip = true;
                    }
                }
                else if (this.pointDown == true && touch == false)//pointup
                {
                    this.pointEvent.type = PointEventEnum.PointUp;
                }
                //事件走的是flash U型圈
                if (!skip)
                {
                    this.rootNode.onCapturePointEvent(this, this.pointEvent);
                    this.rootNode.onPointEvent(this, this.pointEvent);
                    this.pointSelect = this.pointEvent.selected;//选中了啥，同步回来
                    this.pointDown = touch;
                    this.pointX = this.pointEvent.x;
                    this.pointY = this.pointEvent.y;
                }
            }

            this.rootNode.update(delta);
        }

        lastMat: material;
        static defmat: material;

        /**
        * @language zh_CN
        * 渲染之后的回调
        * @version Egret 3.0
        * @platform Web,Native
        */
        public afterRender: Function;

        render(context: renderContext, assetmgr: assetMgr)
        {
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


            //begin
            this.drawScene(this.rootNode, context, assetmgr);
            this.batcher.end(context.webgl);

            if (this.afterRender != null)
                this.afterRender();
        }
        pushRawData(mat: material, data: number[])
        {
            if (mat != this.lastMat)
            {
                this.lastMat = mat;
                this.batcher.end(this.webgl);
                var pass = this.lastMat.getShader().passes["base"][0];

                //有一些自动参数要传进去
                mat.setMatrix("glstate_matrix_mvp", this.context.matrixModelViewProject);

                mat.uploadUniform(pass);
                // //mvp 信号
                pass.use(this.webgl);

                // this.batcher.begin(context.webgl, pass);

                // this.batcher.push(context.webgl, this.vbod, null);
                // this.batcher.end(context.webgl);
                this.batcher.begin(this.webgl, pass);
            }
            this.batcher.push(this.webgl, data, null);
        }
        context: renderContext;
        assetmgr: assetMgr;
        drawScene(node: transform2D, context: renderContext, assetmgr: assetMgr)
        {
            //context.updateModel(this.gameObject.transform);

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
        //画布使用的像素大小
        @gd3d.reflect.Field("number")
        pixelWidth: number = 640;//root 里面的单位是pixel
        @gd3d.reflect.Field("number")
        pixelHeight: number = 480;
        @gd3d.reflect.Field("transform2D")
        private rootNode: transform2D;
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
    }
}