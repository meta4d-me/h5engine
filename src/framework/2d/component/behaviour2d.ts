/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework
{
    export class behaviour2d implements I2DComponent , IEnabled
    {

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件启用
         * @version m4m 1.0
         */
        // @reflect.Field("boolean")  //有问题 ，待处理组件继承后 开启
        enabled : boolean = true;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的transform
         * @version m4m 1.0
         */
        transform: transform2D;

        /** 初始化使用 */
        start() {

        }

        /** 初始化使用  在start 之后*/
        onPlay(){

        }
        /** 每帧调用一次 */
        update(delta: number) {

        }
        remove() {
            
        }

    }

}