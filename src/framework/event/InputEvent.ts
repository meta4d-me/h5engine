namespace m4m.event
{
    /** 输入事件 */
    export class InputEvent extends AEvent
    {
        /**
         * 接收按键事件回调
         * @param event 按键事件枚举
         * @param func 触发回调函数
         * @param thisArg this对象
         */
        OnEnum_key(event: KeyEventEnum, func: (...args: Array<any>) => void, thisArg: any)
        {
            this.On(KeyEventEnum[event], func, thisArg);
        }
        /**
         * 发射按键事件
         * @param event 按键事件枚举
         * @param args 事件参数
         */
        EmitEnum_key(event: KeyEventEnum, ...args: Array<any>)
        {
            super.Emit(KeyEventEnum[event], args);
        }

        /**
         * 接收点击事件回调
         * @param event 点击事件枚举
         * @param func 触发回调函数
         * @param thisArg this对象
         */
        OnEnum_point(event: PointEventEnum, func: (...args: Array<any>) => void, thisArg: any)
        {
            this.On(PointEventEnum[event], func, thisArg);
        }

        /**
         * 发射点击事件
         * @param event 点击事件枚举
         * @param args 事件参数
         */
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
        /**
         * 当接收事件
         * @param tagName 事件名
         * @param func 触发回调函数
         * @param thisArg this对象
         */
        On<K extends keyof inputHtmlNativeEventMap>(tagName: K, func: (ev: any) => void, thisArg: any)
        {
            super.On(tagName, func, thisArg);
        }

        /**
         * 发射事件
         * @param tagName 事件名
         * @param ev 事件数据
         */
        Emit<K extends keyof inputHtmlNativeEventMap>(tagName: K, ev: any)
        {
            super.Emit(tagName, ev);
        }
    }
}