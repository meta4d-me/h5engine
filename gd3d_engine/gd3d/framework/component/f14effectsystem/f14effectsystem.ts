namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 特效组件
     * @version egret-gd3d 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    // @reflect.selfClone
    export class f14EffectSystem implements IRenderer
    {
        gameObject: gameObject;
        layer: RenderLayerEnum=RenderLayerEnum.Transparent;
        renderLayer: CullingMask=CullingMask.default;
        queue: number=0;
        start() 
        {

        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera) {

        }
        update(delta: number) {

        }
        remove() {

        }
        clone() {

        }

    }
}