namespace gd3d.framework
{
    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 2d事件类型
     * @version egret-gd3d 1.0
     */
    export enum PointEventEnum
    {
        PointNothing,
        PointDown,
        PointHold,
        PointUp,
    }

    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 2d事件对象
     * @version egret-gd3d 1.0
     */
    export class PointEvent
    {
        type: PointEventEnum;
        x: number;
        y: number;
        eated: boolean;//事件是否被吃掉
        selected: transform2D;//是否有谁被选中
    }
}