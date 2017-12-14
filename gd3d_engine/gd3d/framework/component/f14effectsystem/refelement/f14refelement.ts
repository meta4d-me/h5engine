namespace gd3d.framework
{
    export class F14RefElement implements F14Element
    {
        type: F14TypeEnum;
        layer: F14Layer;
        drawActive: boolean;
        active: boolean;
        public baseddata:F14RefBaseData;
        //-----------------life from to---------------------
        public startFrame:number;
        public endFrame:number;
    
        public effect:F14Effect;
        public constructor(effect:F14Effect, layer:F14Layer)
        {
            this.type = F14TypeEnum.RefType;
            this.effect = effect;
            this.baseddata = layer.data.elementdata as F14RefBaseData;
            this.layer = layer;
            this.refreshStartEndFrame();

            this.RefEffect = new F14Effect();
            this.RefEffect.setData(this.baseddata.refData);
            //this.RefEffect.batchRoot = effect.player.transform;
        }
        public RefEffect:F14Effect;
    
        // public changeData(data:F14EffectData)
        // {
        //     this.baseddata.refData = data;
        //     this.RefEffect.changeData(data);
        // }
    
        //---------------------------------------reset-----------------------------------------------
        // public reset()
        // {
        //     this.RefEffect.reset();
        // }
        //------------------------------------update----------------------------------------------
        private refreshStartEndFrame()
        {
            if (this.layer.frameList.length == 0)
            {
                this.startFrame = 0;
            }
            else
            {
                this.startFrame = this.layer.frameList[0];
            }
            if (this.layer.frameList.length > 1)
            {
                this.endFrame = this.layer.frameList[this.layer.frameList.length - 1];
            }
            else
            {
                this.endFrame = this.effect.data.lifeTime;
            }
        }
        update(deltaTime: number, frame: number, fps: number)
        {
            if(this.layer.frameList.length==0)
            {
                this.drawActive = false;
                return;
            }
            if (frame < this.startFrame || frame > this.endFrame)
            {
                this.drawActive = false;
                return;
            }
            else
            {
                this.drawActive = true;
            }
            this.RefEffect.update(deltaTime);
        }
    
    }
}