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

        public timelineFrame: { [frameIndex: number]: EffectFrameData };
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
        constructor(assetMgr: gd3d.framework.assetMgr)
        {
            this.mgr = assetMgr;
            this.mesh = this.mgr.getDefaultMesh("quad");
            this.shader = this.mgr.getShader("diffuse.shader.json");
            this.mat.setShader(this.shader);
        }

        public initData()
        {
            this.actions = [];
            this.timelineFrame = {};
            
        }

        WriteToJson(obj: any): any
        {

        }

    }
    @gd3d.reflect.SerializeType
    export class EffectElementEmission implements IEffectElement
    {
        name: string;
        elementType: gd3d.framework.EffectElementTypeEnum = gd3d.framework.EffectElementTypeEnum.EmissionType;//singlemesh,emission....
        beloop: boolean;
        delayTime: number;
        /**
        * 发射器类型
        */
        emissionType: gd3d.framework.ParticleEmissionType;

        simulateInLocalSpace: boolean = true;
        /**
         * 发射器的位置
         */
        rootpos: gd3d.math.vector3;
        rootRotAngle: gd3d.math.vector3;
        rootScale: gd3d.math.vector3;

        /**
         * 最大发射粒子数（全类型）
         */
        maxEmissionCount: number;
        /**
         * 发射数量（全类型）
         */
        emissionCount: number;
        /**
         * 发射时间（continue类型时表示持续发射时间，burst时表示延时发射时间）
         */
        time: number;
        /**
         * 位置相关
         * 
         * @type {gd3d.math.vector3}
         * @memberof EmissionNew
         */

        /**
         * 沿着本地坐标轴不同方向的速度
         * 
         * @type {number}
         * @memberof EmissionNew
         */
        moveSpeed: gd3d.framework.ParticleNode;
        /**
         * 重力
         * 
         * @type {number}
         * @memberof EmissionNew
         */
        gravity: number;

        /**
         * 旋转相关
         * 
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        euler: gd3d.framework.ParticleNode;
        eulerNodes: Array<gd3d.framework.ParticleNode>;
        eulerSpeed: gd3d.framework.ParticleNode;

        /**
         * 缩放相关
         * 
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        scale: gd3d.framework.ParticleNode;
        scaleNodes: Array<gd3d.framework.ParticleNodeNumber>;
        scaleSpeed: gd3d.framework.ParticleNode;

        /**
         * 颜色相关
         * 
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        color: gd3d.framework.ParticleNode;
        colorRate: number;
        colorNodes: Array<gd3d.framework.ParticleNode>;
        colorSpeed: gd3d.framework.ParticleNode;
        /**
         * 随机方向上的速度
         * 
         * @type {number}
         * @memberof EmissionNew
         */
        simulationSpeed: gd3d.framework.ParticleNodeNumber;
        /**
         * 透明度相关
         * 
         * @type {AlphaNode}
         * @memberof EmissionNew
         */
        alpha: gd3d.framework.ParticleNodeNumber;
        alphaNodes: Array<gd3d.framework.ParticleNodeNumber>;
        alphaSpeed: gd3d.framework.ParticleNodeNumber;

        /**
         * uv相关
         * 
         * @type {UVSpeedNode}
         * @memberof EmissionNew
         */
        uv: gd3d.framework.ParticleNodeVec2;
        uvType: gd3d.framework.UVTypeEnum;
        uvRoll: gd3d.framework.UVRoll;
        uvSprite: gd3d.framework.UVSprite;

        tilling: gd3d.math.vector2;
        /**
         * 材质相关
         * 
         * @type {EffectMatData}
         * @memberof EmissionNew
         */
        mat: gd3d.framework.material;

        /**
         * 生命周期
         * 
         * @type {ValueData}
         * @memberof EmissionNew
         */
        life: gd3d.framework.ValueData;
        renderModel: gd3d.framework.RenderModel = gd3d.framework.RenderModel.None;
        mesh: gd3d.framework.mesh;

        WriteToJson(obj: any): any
        {

        }
    }
}

