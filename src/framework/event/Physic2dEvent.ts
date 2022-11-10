namespace m4m.event
{
    export class Physic2dEvent extends AEvent
    {
        OnEnum(event: Physic2dEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.On(Physic2dEventEnum[event],func,thisArg);
        }
        EmitEnum(event: Physic2dEventEnum, ...args: Array<any>){
            super.Emit(Physic2dEventEnum[event],args);
        }
    }
}