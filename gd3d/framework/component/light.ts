/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    export enum LightTypeEnum
    {
        Direction,
        Point,
        Spot,
    }
    //灯光
    @reflect.nodeComponent
    @reflect.nodeLight
    export class light implements INodeComponent
    {
        gameObject: gameObject;
        @gd3d.reflect.Field("boolean")
        isOpen: boolean = false;//添加测试用
        @gd3d.reflect.Field("string")
        lightName: string;//添加测试用

        //光源类型
        type:LightTypeEnum;
        spotAngelCos:number =0.9;
        start()
        {

        }
        update(delta: number)
        {

        }

        remove()
        {

        }
        clone()
        {

        }
    }
}