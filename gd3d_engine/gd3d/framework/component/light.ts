/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    export enum LightTypeEnum
    {
        Direction,
        Point,
        Spot,
    }
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 灯光组件
     * @version egret-gd3d 1.0
     */
    @reflect.nodeComponent
    @reflect.nodeLight
    export class light implements INodeComponent
    {
         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version egret-gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 光源类型
         * @version egret-gd3d 1.0
         */
        type:LightTypeEnum;
         /**
         * @private
         */
        spotAngelCos:number =0.9;
        start()
        {

        }
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