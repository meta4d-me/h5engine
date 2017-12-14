namespace gd3d.framework
{
    export class F14RefElementBatch implements F14Basebatch
    {
        type: F14TypeEnum;
        effect: F14Effect;
        private element:F14RefElement;
        public constructor(effect:F14Effect,element:F14RefElement)
        {
            this.type = F14TypeEnum.RefType;
            this.effect = effect;
            this.element = element;
        }
        unRender()
        {
            //this.element.RefEffect.unRender();
        }
        getElementCount()
        {
            return this.element.RefEffect.getElementCount();
        }
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number)
        {
            //this.element.RefEffect.render();
            if (this.element.drawActive)
            {
                this.element.RefEffect.render(context,assetmgr,camera,Effqueue);
            }
            else
            {
    
            }
        }
        dispose()
        {
            this.element.RefEffect.dispose();
        }
    }
}