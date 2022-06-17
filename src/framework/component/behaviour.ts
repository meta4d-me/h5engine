namespace m4m.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 脚本行文类
     * @version m4m 1.0
     */
    export class behaviour implements INodeComponent , IEnabled
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
         * 挂载的gameobject
         * @version m4m 1.0
         */
        gameObject: gameObject;

        /** 初始化使用 */
        start()
        {

        }

        /** 初始化使用 在start 之后 */
        onPlay()
        {

        }

        /** 每帧调用一次 */
        update(delta: number)
        {

        }
        /**
         * @private
         */
        remove()
        {

        }
        /**
         * @private
         */
        clone()
        {

        }
    }

}