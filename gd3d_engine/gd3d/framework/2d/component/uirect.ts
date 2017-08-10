/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.node2DComponent
    export class uirect implements I2DComponent
    {
        canbeClick:boolean=true;

        start() {
            throw new Error("Method not implemented.");
        }
        update(delta: number) {
            throw new Error("Method not implemented.");
        }
        transform: transform2D;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean) {
            throw new Error("Method not implemented.");
        }
        remove() {
            throw new Error("Method not implemented.");
        }

    }

}