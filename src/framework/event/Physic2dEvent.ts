namespace m4m.event
{
    export class Physic2dEvent extends AEvent
    {
        /**
         * 当接收事件
         * @param event 物理2d事件类型
         * @param func 触发回调函数
         * @param thisArg this对象
         */
        OnEnum(event: Physic2dEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.On(Physic2dEventEnum[event],func,thisArg);
        }

        /**
         * 发射事件
         * @param event 物理2d事件类型
         * @param args 参数数据
         */
        EmitEnum(event: Physic2dEventEnum, ...args: Array<any>){
            super.Emit(Physic2dEventEnum[event],args);
        }
    }
}