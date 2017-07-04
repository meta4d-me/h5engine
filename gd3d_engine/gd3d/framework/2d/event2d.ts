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

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * ui事件
     * @version egret-gd3d 1.0
     */
    export class UIEvent
    {
        funcs: Function[] = [];
        addListener(func: Function)
        {
            this.funcs.push(func);
        }
        excute()
        {
            for (let key in this.funcs)
            {
                this.funcs[key]();
            }
        }
        clear()
        {
            this.funcs.length = 0;
        }
    }

}