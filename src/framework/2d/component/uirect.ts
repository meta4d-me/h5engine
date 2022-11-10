/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework
{
    @reflect.node2DComponent
    export class uirect implements I2DComponent
    {
        static readonly ClassName:string="uirect";

        canbeClick:boolean=true;

        start() {

        }

        onPlay(){

        }
        
        update(delta: number) {

        }
        transform: transform2D;
        remove() {
            this.transform = null;
        }

    }

}