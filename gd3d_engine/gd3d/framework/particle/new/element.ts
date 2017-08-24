namespace gd3d.framework
{

    export interface IEffectElement
    {
        name: string;
        elementType: EffectElementTypeEnum;//singlemesh,emission....
        beloop: boolean;
        delayTime: number;
        mat: material;
        mesh: mesh;
        writeToJson(obj: any): any;
        dispose();
    }

    export enum AttributeType
    {
        PositionType = 1,
        EulerType = 2,
        ScaleType = 3,
        ColorType = 4,
        ColorRateType = 5,
        AlphaType = 6,
        TillingType = 7,
    }
    @gd3d.reflect.SerializeType
    export class EffectElementSingleMesh implements IEffectElement
    {
        public name: string;
        @gd3d.reflect.Field("EffectElementTypeEnum")
        public elementType: gd3d.framework.EffectElementTypeEnum = gd3d.framework.EffectElementTypeEnum.SingleMeshType;//singlemesh,emission....

        @gd3d.reflect.Field("boolean")
        public beloop: boolean = false;

        @gd3d.reflect.Field("number")
        public delayTime: number = 0;

        @gd3d.reflect.Field("number")
        public life: number = 5;
        // @gd3d.reflect.Field("material")
        public mat: gd3d.framework.material = new gd3d.framework.material();

        @gd3d.reflect.Field("string")
        public texturePath: string;

        @gd3d.reflect.Field("shader")
        public shader: gd3d.framework.shader;

        @gd3d.reflect.Field("mesh")
        public mesh: gd3d.framework.mesh = new gd3d.framework.mesh();

        @gd3d.reflect.Field("Vector3AttributeData")
        public position: Vector3AttributeData = new Vector3AttributeData();

        @gd3d.reflect.Field("Vector3AttributeData")
        public euler: Vector3AttributeData = new Vector3AttributeData();

        @gd3d.reflect.Field("Vector3AttributeData")
        public scale: Vector3AttributeData = new Vector3AttributeData();;

        @gd3d.reflect.Field("Vector3AttributeData")
        public color: Vector3AttributeData = new Vector3AttributeData();;

        @gd3d.reflect.Field("NumberAttributeData")
        public alpha: NumberAttributeData = new NumberAttributeData();

        @gd3d.reflect.Field("Vector2AttributeData")
        public tilling: Vector2AttributeData = new Vector2AttributeData();;

        @gd3d.reflect.Field("NumberAttributeData")
        public colorRate: NumberAttributeData = new NumberAttributeData();//几倍颜色叠加
        public uv: gd3d.math.vector2 = new gd3d.math.vector2();

        @gd3d.reflect.Field("RenderModel")
        public renderModel: gd3d.framework.RenderModel = gd3d.framework.RenderModel.None;

        //每个属性是一个单独的timeline
        public timelineFrames: { [attributeType: number]: { [frameIndex: number]: any } } = {};

        public ref: string;//数据整体引用
        public actions: IEffectAction[];
        public curAttrData: EffectAttrsData;
        public effectBatcher: EffectBatcherNew;
        // public meshdataVbo: Float32Array;

        //在effectbatcher中顶点的开始位置
        public startVboIndex: number = 0;
        //在effectbatcher中索引的开始位置，用来动态计算当前要渲染到哪个顶点，主要针对delaytime类型的特效重播时的处理
        public startEboIndex: number = 0;
        //在effectbatcher中索引的结束位置，用来动态计算当前要渲染到哪个顶点，主要针对delaytime类型的特效重播时的处理
        public endEboIndex: number = 0;
        public actionActive: boolean = false;//当前帧action状态
        public loopFrame: number = Number.MAX_VALUE;//循环帧数
        public active: boolean = true;//激活状态
        public transform: transform;
        private mgr: gd3d.framework.assetMgr;
        private effectIns: effectSystemNew;

        public rotationByEuler: math.quaternion = new math.quaternion();
        public localRotation: math.quaternion = new math.quaternion();

        constructor(assetMgr: gd3d.framework.assetMgr, effectIns: effectSystemNew)
        {
            this.mgr = assetMgr;
            this.effectIns = effectIns;
            this.mesh = this.mgr.getDefaultMesh("quad");
            this.shader = this.mgr.getShader("diffuse.shader.json");
            this.mat.setShader(this.shader);
            this.initData();
        }

        public initData()
        {
            this.actions = [];
            this.timelineFrames = {};
            this.timelineFrames[AttributeType.PositionType] = {};
            this.timelineFrames[AttributeType.EulerType] = {};
            this.timelineFrames[AttributeType.ScaleType] = {};
            this.timelineFrames[AttributeType.ColorType] = {};
            this.timelineFrames[AttributeType.ColorRateType] = {};
            this.timelineFrames[AttributeType.AlphaType] = {};
            this.timelineFrames[AttributeType.TillingType] = {};
            this.position.attributeType = AttributeType.PositionType;
            this.euler.attributeType = AttributeType.EulerType;
            this.scale.attributeType = AttributeType.ScaleType;
            this.color.attributeType = AttributeType.ColorType;
            this.colorRate.attributeType = AttributeType.ColorRateType;
            this.alpha.attributeType = AttributeType.AlphaType;
            this.tilling.attributeType = AttributeType.TillingType;
            this.position.addFramePoint(new FrameKeyPointData(60, new gd3d.math.vector3(3, 3, 3)));

            this.recordElementLerpAttributes(this.position);
            this.recordElementLerpAttributes(this.euler);
            this.recordElementLerpAttributes(this.scale);
            this.recordElementLerpAttributes(this.color);
            this.recordElementLerpAttributes(this.colorRate);
            this.recordElementLerpAttributes(this.alpha);
            this.recordElementLerpAttributes(this.tilling);
        }

        public getFrameVal(attributeType: AttributeType, frameIndex: number = 0)
        {
            let timeLine = this.timelineFrames[attributeType];
            if (timeLine[frameIndex] != undefined)
                return timeLine[frameIndex];
            return null;
        }

        writeToJson(obj: any): any
        {

        }

        copyandinit(): EffectAttrsData//没有的数据初始化
        {
            let data = new EffectAttrsData();
            let pos = this.getFrameVal(AttributeType.PositionType);
            if (pos != null)
                data.pos = math.pool.clone_vector3(pos);
            else
                data.initAttribute("");


            
            if (this.euler != undefined)
                data.euler = math.pool.clone_vector3(this.getFrameVal(AttributeType.EulerType));
            else
                data.initAttribute("euler");

            if (this.color != undefined)
                data.color = math.pool.clone_vector3(this.getFrameVal(AttributeType.ColorType));
            else
                data.initAttribute("color");

            if (this.scale != undefined)
                data.scale = math.pool.clone_vector3(this.getFrameVal(AttributeType.ScaleType));
            else
                data.initAttribute("scale");

            if (this.uv != undefined)
                data.uv = math.pool.clone_vector2(this.uv);
            else
                data.initAttribute("uv");
            if (this.tilling != undefined)
                data.tilling = math.pool.clone_vector2(this.getFrameVal(AttributeType.TillingType));
            else
                data.initAttribute("tilling");
            if (this.colorRate != undefined)
                data.colorRate = this.getFrameVal(AttributeType.ColorRateType);
            else
                data.initAttribute("colorRate");
            // if (this.mat != undefined)
            //     data.mat = this.mat.clone();

            if (this.rotationByEuler != undefined)
                data.rotationByEuler = math.pool.clone_quaternion(this.rotationByEuler);
            if (this.localRotation != undefined)
                data.localRotation = math.pool.clone_quaternion(this.localRotation);
            // if (this.meshdataVbo != undefined)
            //     data.meshdataVbo = this.meshdataVbo;//这个数组不会被改变，可以直接引用

            data.alpha = this.getFrameVal(AttributeType.AlphaType);
            data.renderModel = this.renderModel;
            data.mesh = this.mesh;
            return data;
        }

        update()
        {
            if (this.curAttrData == undefined || this.curAttrData == null)
                return;
            if (this.active)
            {
                // if (this.curAttrData.startEuler)
                // {
                //     gd3d.math.quatFromEulerAngles(this.curAttrData.startEuler.x, this.curAttrData.startEuler.y, this.curAttrData.startEuler.z, this.curAttrData.startRotation);
                // }
                if (this.curAttrData.euler != undefined)
                {
                    // console.log("euler:" + this.curAttrData.euler.toString());
                    gd3d.math.quatFromEulerAngles(this.curAttrData.euler.x, this.curAttrData.euler.y, this.curAttrData.euler.z, this.curAttrData.rotationByEuler);
                }
                this.updateElementRotation();
                gd3d.math.matrixMakeTransformRTS(this.curAttrData.pos, this.curAttrData.scale, this.curAttrData.localRotation, this.curAttrData.matrix);
            }
            else
            {
                this.curAttrData.resetMatrix();
            }
        }

        private updateElementRotation() 
        {
            let cameraTransform = gd3d.framework.sceneMgr.app.getScene().mainCamera.gameObject.transform;
            let worldRotation = gd3d.math.pool.new_quaternion();
            let localRotation = gd3d.math.pool.new_quaternion();

            if (this.curAttrData.renderModel != RenderModel.None) 
            {
                let invTransformRotation = gd3d.math.pool.new_quaternion();
                let worldTranslation = gd3d.math.pool.new_vector3();
                let translation = gd3d.math.pool.new_vector3();
                gd3d.math.vec3Clone(this.curAttrData.pos, translation);
                if (this.transform != undefined)
                {
                    gd3d.math.matrixTransformVector3(translation, this.transform.getWorldMatrix(), worldTranslation);
                }
                if (this.curAttrData.renderModel == RenderModel.BillBoard) 
                {
                    gd3d.math.quatLookat(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);
                }
                else if (this.curAttrData.renderModel == RenderModel.HorizontalBillBoard)
                {
                    worldRotation.x = -0.5;
                    worldRotation.y = 0.5;
                    worldRotation.z = 0.5;
                    worldRotation.w = 0.5;
                }
                else if (this.curAttrData.renderModel == RenderModel.VerticalBillBoard)
                {
                    let forwardTarget = gd3d.math.pool.new_vector3();
                    gd3d.math.vec3Clone(cameraTransform.getWorldTranslate(), forwardTarget);
                    forwardTarget.y = worldTranslation.y;
                    gd3d.math.quatLookat(worldTranslation, forwardTarget, worldRotation);
                    gd3d.math.pool.delete_vector3(forwardTarget);
                }
                else if (this.curAttrData.renderModel == RenderModel.StretchedBillBoard) 
                {

                    gd3d.math.quatMultiply(worldRotation, this.curAttrData.rotationByEuler, this.curAttrData.localRotation);

                    gd3d.math.quatLookat(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);

                    let lookRot = new gd3d.math.quaternion();
                    gd3d.math.quatClone(this.transform.getWorldRotate(), invTransformRotation);
                    gd3d.math.quatInverse(invTransformRotation, invTransformRotation);
                    gd3d.math.quatMultiply(invTransformRotation, worldRotation, lookRot);

                    let inverRot = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatInverse(this.curAttrData.localRotation, inverRot);
                    gd3d.math.quatMultiply(inverRot, lookRot, lookRot);

                    let angle = gd3d.math.pool.new_vector3();
                    gd3d.math.quatToEulerAngles(lookRot, angle);
                    gd3d.math.quatFromEulerAngles(0, angle.y, 0, lookRot);
                    gd3d.math.quatMultiply(this.curAttrData.localRotation, lookRot, this.curAttrData.localRotation);

                    gd3d.math.pool.delete_quaternion(inverRot);
                    gd3d.math.pool.delete_vector3(angle);
                    gd3d.math.pool.delete_quaternion(lookRot);
                    return;
                }
                else if (this.curAttrData.renderModel == RenderModel.Mesh)
                {
                    EffectUtil.quatLookatZ(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);
                }

                gd3d.math.quatMultiply(worldRotation, this.curAttrData.rotationByEuler, worldRotation);
                //消除transform组件对粒子本身的影响
                gd3d.math.quatClone(this.transform.gameObject.transform.getWorldRotate(), invTransformRotation);
                gd3d.math.quatInverse(invTransformRotation, invTransformRotation);

                gd3d.math.quatMultiply(invTransformRotation, worldRotation, this.curAttrData.localRotation);

                // gd3d.math.quatMultiply(invTransformRotation, worldRotation, localRotation);
                // gd3d.math.quatMultiply(this.curAttrData.startRotation, localRotation, this.curAttrData.localRotation);

                gd3d.math.pool.delete_vector3(translation);
                gd3d.math.pool.delete_vector3(worldTranslation);
                gd3d.math.pool.delete_quaternion(invTransformRotation);
            } else
            {
                gd3d.math.quatMultiply(worldRotation, this.curAttrData.rotationByEuler, this.curAttrData.localRotation);
                // gd3d.math.quatMultiply(worldRotation, this.curAttrData.rotationByEuler, localRotation);
                // gd3d.math.quatMultiply(localRotation, this.curAttrData.startRotation, this.curAttrData.localRotation);
            }

            gd3d.math.pool.delete_quaternion(localRotation);
            gd3d.math.pool.delete_quaternion(worldRotation);

        }
        dispose()
        {

        }
        /**
         * 当前帧的数据是否有变化，有变化才需要去刷新batcher，否则直接用当前batcher中的数据去提交渲染即可。
         * 在以下三种情况下，数据都是变化的，都需要刷新bacther：
         * 1、timeline中有当前帧
         * 2、renderModel不是none
         * 3、有action在刷新
         * @param frameIndex 
         */
        isCurFrameNeedRefresh(frameIndex: number): boolean
        {
            for (let index in this.timelineFrames)
            {
                if (this.timelineFrames[index][frameIndex] != undefined)
                    return true;
            }
            if (this.curAttrData != undefined && this.curAttrData.renderModel != RenderModel.None)
            {
                return true;
            }
            return this.actionActive;
        }
        /**
         * 一次lerp一个属性。所有要修改的属性都实现IAttributeData接口
         * @param data 
         */
        private recordElementLerpAttributes(data: IAttributeData)
        {
            if (data.data != undefined)
            {
                for (let i = 0; i < data.frameIndexs.length - 1; i++)
                {
                    let fromFrameId = data.frameIndexs[i];
                    let toFrameId = data.frameIndexs[i + 1];

                    let fromFrameData: FrameKeyPointData = data.data[fromFrameId];
                    let toFrameData: FrameKeyPointData = data.data[toFrameId];
                    let timeLine: { [frameIndex: number]: any } = this.timelineFrames[data.attributeType]
                    if (fromFrameData.actions == null)
                    {
                        //lerp操作
                        this.lerp(fromFrameId, toFrameId, fromFrameData.val, toFrameData.val, timeLine);
                    } else
                    {
                        //记录action
                    }
                }
            }
        }

        private lerp(fromFrameId: number, toFrameId: number, fromFrameVal: any, toFrameVal: any, timeLine: { [frameIndex: number]: any })
        {
            for (let i = fromFrameId; i <= toFrameId; i++)
            {
                let outVal;
                if (fromFrameVal instanceof gd3d.math.vector3)
                {
                    outVal = new gd3d.math.vector3();
                    gd3d.math.vec3SLerp(fromFrameVal, toFrameVal, (i - fromFrameId) / (toFrameId - fromFrameId), outVal);
                }
                else if (fromFrameVal instanceof gd3d.math.vector2)
                {
                    outVal = new gd3d.math.vector2();
                    gd3d.math.vec2SLerp(fromFrameVal, toFrameVal, (i - fromFrameId) / (toFrameId - fromFrameId), outVal);
                } else if (typeof (fromFrameVal) === 'number')
                {
                    outVal = gd3d.math.numberLerp(fromFrameVal, toFrameVal, (i - fromFrameId) / (toFrameId - fromFrameId));
                }
                timeLine[i] = outVal;
            }
        }
    }
}

