namespace gd3d.framework
{
    export class F14RefElement implements F14Element
    {
        type: F14TypeEnum;
        layer: F14Layer;
        drawActive: boolean;
        public baseddata:F14RefBaseData;
        //-----------------life from to---------------------
        public startFrame:number;
        public endFrame:number;
    
        public effect:f14EffectSystem;
        public constructor(effect:f14EffectSystem, layer:F14Layer)
        {
            this.type = F14TypeEnum.RefType;
            this.effect = effect;
            this.baseddata = layer.data.elementdata as F14RefBaseData;
            this.layer = layer;
            this.refreshStartEndFrame();

            this.RefEffect = new f14EffectSystem();
            this.RefEffect.setData(this.baseddata.refData);
            //this.RefEffect.batchRoot = effect.player.transform;
        }
        public RefEffect:f14EffectSystem;
    
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

        OnEndOnceLoop()
        {

        }
        reset()
        {

        }
    
    }
}