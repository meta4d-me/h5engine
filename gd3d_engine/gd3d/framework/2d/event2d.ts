namespace gd3d.framework
{
    export enum PointEventEnum
    {
        PointNothing,
        PointDown,
        PointHold,
        PointUp,
    }
    export class PointEvent
    {
        type: PointEventEnum;
        x: number;
        y: number;
        eated: boolean;//事件是否被吃掉
        selected: transform2D;//是否有谁被选中
    }



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