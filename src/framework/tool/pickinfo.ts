namespace m4m.framework
{
    /**
    * @private
    * @language zh_CN
    * @classdesc
    * 拾取到的信息
    * @version m4m 1.0
    */
    export class pickinfo
    {
        normal:math.vector3=new math.vector3();
        public pickedtran: transform;
        public distance: number = 0;
        public hitposition: math.vector3 = new math.vector3();
        public bu: number = 0;
        public bv: number = 0;
        public faceId: number = -1;
        public subMeshId: number = 0;
        /**
         * 点 拾取信息
         * @param _bu u
         * @param _bv v
         * @param _distance 距离 
         */
        constructor(_bu: number =0, _bv: number =0, _distance: number = 0)
        {
            this.distance = _distance;
            this.bu = _bu;
            this.bv = _bv;
        }
        /**
         * 初始化
         */
        init(){
            this.pickedtran = null;
            this.hitposition.x = this.hitposition.y = this.hitposition.z = this.distance = this.bu = this.bv = this.subMeshId = 0;
            this.faceId = -1;
        }

        /**
         * 重一个对象克隆属性到自己
         * @param from 克隆的对象
         */
        cloneFrom(from:pickinfo){
            math.vec3Clone(from.normal,this.normal);
            this.pickedtran = from.pickedtran;
            math.vec3Clone(from.hitposition,this.hitposition);
            this.distance = from.distance;
            this.bu = from.bu;
            this.bv = from.bv;
            this.subMeshId = from.subMeshId;
            this.faceId = from.faceId;
        }
    }
}