/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public  
     * @language zh_CN
     * @classdesc
     * rect 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class rectBody extends bassBody implements I2DComponent
    {
        static readonly ClassName:string="rectBody";
        transform: transform2D;
        
        start() {
            let data = this.options || {};
            this.body=this._physicsEngine.creatRectBodyByInitData(this.transform.localTranslate.x,this.transform.localTranslate.y,this.transform.width,this.transform.height,data);
        }
        onPlay(){

        }
    }
}