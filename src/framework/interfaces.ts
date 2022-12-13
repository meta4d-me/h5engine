//引擎的接口列表
namespace m4m.framework {
    export interface IEnabled {
        /** 是否启用 */
        enabled: boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 组件实例接口
     * @version m4m 1.0
     */
    export interface INodeComponent {
        onPlay();
        start();
        update(delta: number);
        gameObject: gameObject;
        remove();
        // clone();         //没有实际使用过 的接口
        // jsonToAttribute(json: any, assetmgr: assetMgr);
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d组件的接口
     * @version m4m 1.0
     */
    export interface I2DComponent {
        onPlay();
        start();
        update(delta: number);
        transform: transform2D;
        remove();
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d碰撞器接口
     * @version m4m 1.0
     */
    export interface ICollider2d {
        transform: transform2D;
        getBound(): obb2d;
        intersectsTransform(tran: transform2D): boolean;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2D渲染组件的接口
     * @version m4m 1.0
     */
    export interface IRectRenderer extends I2DComponent {
        render(canvas: canvas);
        //刷新顶点信息
        updateTran();
        //获取渲染材质
        getMaterial(): material;
        //获取渲染边界(合并渲染深度排序会使用到)
        getDrawBounds(): m4m.math.rect;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 渲染器接口 继承自组件接口
     * @version m4m 1.0
     */
    export interface IRenderer extends INodeComponent {
        layer: RenderLayerEnum;
        renderLayer: number;  //后期发现 和 gameObject.layer 概念冲突 ，实现时 对接处理
        queue: number;

        render(context: renderContext, assetmgr: assetMgr, camera: camera);
    }

    /**
     * 
     */
    export interface IRendererGpuIns extends IRenderer{
        // /**
        //  * 执行GPU Instancing 绘制
        //  * @param context 
        //  * @param assetmgr 
        //  * @param camera 
        //  */
        // GpuInstancingRender(context: renderContext, assetmgr: assetMgr, camera: m4m.framework.camera);
        /** 是否开启 GPU Instancing 绘制 */
        isGpuInstancing () : boolean;
    }
}