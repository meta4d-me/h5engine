namespace m4m.framework
{

    /**
     * Object 工具
     */
    export class ObjectUtil
    {

        /**
         * 判断是否为基础类型 undefined,null,boolean,string,number
         */
        static isBaseType(object: any): boolean
        {
            //基础类型
            if (
                object == undefined
                || object == null
                || typeof object == "boolean"
                || typeof object == "string"
                || typeof object == "number"
            )
                return true;
        }

        /**
         * 判断是否为Object对象，构造函数是否为Object， 检测 object.constructor == Object
         * 
         * @param obj 用于判断的对象
         */
        static isObject(obj: any): boolean
        {
            return obj != null && (obj.constructor == Object || (obj.constructor.name == "Object"));// 兼容其他 HTMLIFrameElement 传入的Object
        }

    }
}