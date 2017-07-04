namespace gd3d.framework
{
    /**
    * @private
    * @language zh_CN
    * @classdesc
    * 拾取到的信息
    * @version egret-gd3d 1.0
    */
    export class pickinfo
    {
        public pickedtran: transform;
        public distance: number;
        public hitposition: gd3d.math.vector3 = new gd3d.math.vector3();
        public bu: number = 0;
        public bv: number = 0;
        public faceId: number = -1;
        public subMeshId: number = 0;
        constructor(_bu: number, _bv: number, _distance: number)
        {
            this.distance = _distance;
            this.bu = _bu;
            this.bv = _bv;
        }
    }
}