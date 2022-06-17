/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework {
    /**
     * 富文本版 lable 
     * 支持表情字符，自定义样式段落
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class richLabel implements IRectRenderer {
        render(canvas: canvas)
        {
            throw new Error("Method not implemented.");
        }
        updateTran()
        {
            throw new Error("Method not implemented.");
        }
        getMaterial(): material
        {
            throw new Error("Method not implemented.");
        }
        getDrawBounds(): math.rect
        {
            throw new Error("Method not implemented.");
        }
        onPlay()
        {
            throw new Error("Method not implemented.");
        }
        start()
        {
            throw new Error("Method not implemented.");
        }
        update(delta: number)
        {
            throw new Error("Method not implemented.");
        }
        transform: transform2D;
        remove()
        {
            throw new Error("Method not implemented.");
        }
        
    }
}