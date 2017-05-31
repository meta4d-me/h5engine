namespace gd3d.framework
{
    export enum RenderModel
    {
        None,
        BillBoard,
        StretchedBillBoard,
        HorizontalBillBoard,
        VerticalBillBoard,
        Mesh
    }

    export enum ParticleCurveType
    {
        LINEAR,
        CURVE
    }
    /**
     * 单个粒子数据
     */
    export class ParticleData
    {
        public emissionData: EmissionData = new EmissionData();
        public materialData: MaterialData = new MaterialData();
        public particleDetailData: ParticleDetailData = new ParticleDetailData();

        constructor()
        {

        }
    }
    export enum ParticleMethodType
    {
        Normal,
        UVSPRITE,
        UVROLL
    }

    /**
     * 粒子数据
     */
    export class ParticleDetailData
    {
        /**
        *  粒子名称
        */
        public name: string;
        /**
         *粒子种类
         */
        public renderModel: RenderModel = gd3d.framework.RenderModel.BillBoard;
        
        /**
         * 
         */
        public bindAxis:boolean=false;
        public bindx:boolean=false;
        public bindy:boolean=false;
        public bindz:boolean=false;
        /**
        * 形状类型  可以为.mesh文件名默认为plane
        */
        public type: string="plane";

        /**
        * 粒子网格名字
        */
        public meshName: string;

        /**
        * 粒子是否循环发射
        */
        public isLoop: boolean = false;

        /**
        * 是否朝向摄像机
        */
        public isLookAtCamera: boolean = false;

        /**
        * 重力
        */
        public gravity: ValueData = new ValueData();

        /**
        * 在垂直方向上的速度，方向向下为正值
        */
        public gravitySpeed: ValueData = new ValueData();

        /**
        * 粒子周期
        */
        public life: ValueData = new ValueData();

        /**
        * 粒子速度
        */
        public speed: ValueData = new ValueData();

        /**
        * 粒子起始旋转值
        */
        public startPitchYawRoll: ParticleNode = new ParticleNode();

        /**
        * 粒子角速度
        */
        public angularVelocity: ParticleNode = new ParticleNode();

        /**
        * 受外力影响的速度
        */
        public velocity: ParticleNode = new ParticleNode();

        /**
        * 受外力影响的加速度
        */
        public acceleration: ParticleNode = new ParticleNode();
        /**
        * 粒子大小扩大或缩小范围
        */
        public scale: ParticleNode = new ParticleNode();

        /**
        * 粒子大小扩大或缩小节点
        */
        public scaleNode: Array<ParticleNode> = new Array<ParticleNode>();

        /**
        *  粒子颜色
        */
        // public color: gd3d.math.vector4 = new gd3d.math.vector4(1, 1, 1,1);
        public color: ParticleNode = new ParticleNode();
        /**
        * 粒子颜色节点
        */
        public colorNode: Array<ParticleNode> = new Array<ParticleNode>();

        /**
        * 粒子透明度
        */
        public alpha: ValueData = new ValueData();

        /**
        * 粒子透明度节点
        */
        public alphaNode: Array<AlphaNode> = new Array<AlphaNode>();

        /**
        * 粒子位置节点
        */
        public positionNode: Array<ParticleNode> = new Array<ParticleNode>();

        /**
        * 粒子起始位置
        */
        public particleStartData: gd3d.framework.ParticleStartData = new gd3d.framework.ParticleStartData();


        public isRotation: boolean = false;

        /**
        * 是否无限生命
        */
        public infinite: boolean = false;

        public delayTime: ValueData = new ValueData();

        public interpolationType = ParticleCurveType.CURVE;

        public uvSprite: UVSprite;
        public uvRoll: UVRoll;

        /**
         * 材质类型
         */
        public particleMethodType: ParticleMethodType = ParticleMethodType.Normal;

        /**
         * 是否为拖尾
         */
        public istrail:boolean=false;

        /**
         * billbord时候角速度
         * 
         */
        public angleSpeedForbillboard:ValueData=new ValueData();
        constructor()
        {

        }
    }

    export class UVSprite
    {
        //uv序列帧动画
        public row: number;
        public column: number;
        /**
         * 在粒子生命周期内播放的帧数
         */
        public frameOverLifeTime: number;

        /**
         * 第几帧开始播放
         */
        public startFrame: number = 0;

        /**
         * 生命周期类序列帧动画循环的播放的次数
         */
        public cycles: number = 1;
    }

    export class UVRoll
    {
        /**
        * uv滚动
        */
        public uvSpeed: UVSpeedNode = new UVSpeedNode();
        public uvSpeedNodes: Array<UVSpeedNode> = new Array<UVSpeedNode>();
    }
}
