namespace gd3d.framework
{

    export interface IEffectElement
    {
        name: string;
        elementType: gd3d.framework.EffectElementTypeEnum;//singlemesh,emission....
        beloop: boolean;
        delayTime: number;
        mat: gd3d.framework.material;

        WriteToJson(obj: any): any;
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

        @gd3d.reflect.Field("number")
        public colorRate: number = 1;//几倍颜色叠加
        public uv: gd3d.math.vector2 = new gd3d.math.vector2();

        @gd3d.reflect.Field("RenderModel")
        public renderModel: gd3d.framework.RenderModel = gd3d.framework.RenderModel.None;

        // public timelineFrame: { [frameIndex: number]: EffectAttrsData };
        public ref: string;//数据整体引用
        public actions: IEffectAction[];
        public curAttrData: EffectAttrsData;
        public effectBatcher: EffectBatcher;
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
        private effectIns: effectSystem;
        constructor(assetMgr: gd3d.framework.assetMgr, effectIns: effectSystem)
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
            // this.timelineFrame = {};
            // for (let i = 0; i < this.life * effectSystem.fps; i++)
            // {
            //     let data: EffectAttrsData = new EffectAttrsData();

            // }
        }

        WriteToJson(obj: any): any
        {

        }

        /**
         * 一次lerp一个属性。所有要修改的属性都实现IAttributeData接口
         * @param data 
         */
        private recordElementLerpAttributes(data: IAttributeData)
        {
            if (data.data != undefined)
            {
                for (let i in data.data)
                {
                    let frameData: FrameKeyPointData = data.data[i];
                    if (frameData.actions != undefined)
                    {
                        //action
                    }
                    // if (frameData.frameIndex != -1)
                    // {
                    //     if (frameData. != undefined && frameData.lerpDatas.length != 0)
                    //     {
                    //         this.recordLerpValues(frameData);
                    //     } else if (frameData.attrsData != undefined)
                    //     {
                    //         if (this.timelineFrame[frameData.frameIndex] == undefined)
                    //         {
                    //             this.timelineFrame[frameData.frameIndex] = new EffectFrameData();
                    //             this.timelineFrame[frameData.frameIndex].attrsData = new EffectAttrsData();
                    //             this.timelineFrame[frameData.frameIndex].frameIndex = frameData.frameIndex;
                    //         }
                    //         for (let k in frameData.attrsData)
                    //         {
                    //             this.timelineFrame[frameData.frameIndex].attrsData.setLerpAttribute(k, frameData.attrsData.getAttribute(k));
                    //         }
                    //     }
                    // }
                }
            }
        }

        /**
         * 录制插值数据
         * 
         * @private
         * @param {EffectElementData} elementData 
         * @param {EffectFrameData} effectFrameData 
         * 
         * @memberof effectSystem
         */
        private recordLerpValues(effectFrameData: EffectFrameData)
        {
            //每一帧所需要进行插值的属性分别进行插值
            for (let i in effectFrameData.lerpDatas)
            {
                if (effectFrameData.lerpDatas[i].type == EffectLerpTypeEnum.Linear)
                {
                    //effectFrameData.lerpDatas[i].attrsList 每一帧中的需要插值的列表
                    for (let key in effectFrameData.lerpDatas[i].attrsList)
                    {
                        //attrname 插值的属性名
                        let attrname = effectFrameData.lerpDatas[i].attrsList[key];
                        //对该属性进行插值
                        this.recordLerp(effectFrameData, effectFrameData.lerpDatas[i], attrname);
                    }
                }
            }
        }
        // private newFrameData: EffectFrameData;
        /**
         * 记录插值
         */
        private recordLerp(effectFrameData: EffectFrameData, lerpData: EffectLerpData, key: string)
        {

            let fromFrame = lerpData.fromFrame;
            let toFrame = lerpData.toFrame.getValue();
            let toVal = lerpData.attrsData.getAttribute(key);
            if (effectFrameData.attrsData[key] == undefined)
            {
                effectFrameData.attrsData.initAttribute(key);
            }
            let fromVal = effectFrameData.attrsData.getAttribute(key);
            //在需要进行插值的帧里面进行插值
            for (let i = fromFrame + 1; i <= toFrame; i++)
            {
                let outVal;
                if (fromVal instanceof gd3d.math.vector3)
                {
                    outVal = new gd3d.math.vector3();
                    gd3d.math.vec3SLerp(fromVal, toVal, (i - fromFrame) / (toFrame - fromFrame), outVal);
                }
                else if (fromVal instanceof gd3d.math.vector2)
                {
                    outVal = new gd3d.math.vector2();
                    gd3d.math.vec2SLerp(fromVal, toVal, (i - fromFrame) / (toFrame - fromFrame), outVal);
                } else if (typeof (fromVal) === 'number')
                {
                    outVal = gd3d.math.numberLerp(fromVal, toVal, (i - fromFrame) / (toFrame - fromFrame));
                }

                // let newFrameData: EffectFrameData = this.timelineFrame[i];
                // if (newFrameData == undefined) 
                // {
                //     newFrameData = new EffectFrameData();
                //     newFrameData.attrsData = new EffectAttrsData();
                //     newFrameData.frameIndex = i;
                //     this.timelineFrame[i] = newFrameData;
                // }
                // newFrameData.attrsData.setLerpAttribute(key, outVal);
            }
        }

    }

}

