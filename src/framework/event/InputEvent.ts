namespace m4m.event
{
    /** 输入事件 */
    export class InputEvent extends AEvent
    {
        OnEnum_key(event: KeyEventEnum, func: (...args: Array<any>) => void, thisArg: any)
        {
            this.On(KeyEventEnum[event], func, thisArg);
        }
        EmitEnum_key(event: KeyEventEnum, ...args: Array<any>)
        {
            super.Emit(KeyEventEnum[event], args);
        }

        OnEnum_point(event: PointEventEnum, func: (...args: Array<any>) => void, thisArg: any)
        {
            this.On(PointEventEnum[event], func, thisArg);
        }
        EmitEnum_point(event: PointEventEnum, ...args: Array<any>)
        {
            super.Emit(PointEventEnum[event], args);
        }

    }

    /** 输入htmlElement 原生事件类型集合 */
    export interface inputHtmlNativeEventMap {
        "blur": FocusEvent;
        "keydown": KeyboardEvent;
        "keyup": KeyboardEvent;
        "mousedown": MouseEvent;
        // "mouseenter": MouseEvent;
        // "mouseleave": MouseEvent;
        "mousemove": MouseEvent;
        // "mouseout": MouseEvent;
        // "mouseover": MouseEvent;
        "mouseup": MouseEvent;
        "touchcancel": TouchEvent;
        "touchend": TouchEvent;
        "touchmove": TouchEvent;
        "touchstart": TouchEvent;
        "wheel": WheelEvent;
    }
    
    /** 输入htmlElement 原生事件 */
    export class inputHtmlNativeEvent extends AEvent
    {
        On<K extends keyof inputHtmlNativeEventMap>(tagName: K, func: (ev: any) => void, thisArg: any)
        {
            super.On(tagName, func, thisArg);
        }
        Emit<K extends keyof inputHtmlNativeEventMap>(tagName: K, ev: any)
        {
            super.Emit(tagName, ev);
        }
    }
}