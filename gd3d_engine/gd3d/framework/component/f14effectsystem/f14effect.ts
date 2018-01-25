namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class f14EffectSystem implements IRenderer
    {

        layer: RenderLayerEnum=RenderLayerEnum.Transparent;
        renderLayer: CullingMask=CullingMask.default;
        queue: number=0;
        start() {}
        gameObject: gameObject;
        remove() {}
        
        private fps:number=30;
        public data:F14EffectData;
        public layers:F14Layer[] =[];
        //--------------------------------------------------------------------
        public VF:number=gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
        public webgl:WebGLRenderingContext;

        private _f14eff: f14eff;
        /**
         * f14eff 资源
         * @private
         */
        @gd3d.reflect.Field("f14eff")
        @gd3d.reflect.UIStyle("WidgetDragSelect")
        get f14eff()
        {
            return this._f14eff;
        }
        set f14eff(asset: f14eff)
        {
            if (this._f14eff != null)
            {
                this._f14eff.unuse();
            }
            this._f14eff = asset;
            this.setData(asset.data);
        }
        private _delayTime:number=0;
        /**
         * delaytime
         * @private
         */
        @gd3d.reflect.Field("number")
        get delay(){
            return this._delayTime;
        }
        set delay(deley:number){
            this._delayTime = deley;
        }

        setData(data:F14EffectData)
        {
            //-------------------准备各种需要访问
            this.webgl=gd3d.framework.sceneMgr.app.webgl;

            this.data = data;
            for (let i = 0,count=this.data.layers.length; i < count; i++)
            {
                let layerdata:F14LayerData = this.data.layers[i];
                this.addF14layer(layerdata.type,layerdata);
            }
            for(let i=0;i<this.renderBatch.length;i++)
            {
                if(this.renderBatch[i].type==F14TypeEnum.SingleMeshType)
                {
                    (this.renderBatch[i] as F14SingleMeshBath).OnEndCollectElement();
                } 
            }
        }

        private elements:F14Element[] =[];
        public renderBatch:F14Basebatch[] =[];

        private loopCount:number=0;
        private allTime:number=0;
        public update(deltaTime:number)
        {
            if(!this.active) return;
            if (this.data == null) return;
            this.allTime+=deltaTime;
            this.totalTime=this.allTime-this._delayTime;
            if(this.totalTime<=0) return;
            this.totalFrame=this.totalTime*this.fps;
            this.restartFrame = this.totalFrame % this.data.lifeTime;
            this.restartFrame=Math.floor(this.restartFrame);


            let newLoopCount=Math.floor(this.totalFrame/this.data.lifeTime);
            if(newLoopCount!=this.loopCount)
            {
                this.OnEndOnceLoop();
            }
            this.loopCount=newLoopCount;

            for (let i = 0; i < this.elements.length; i++)
            {
                this.elements[i].update(deltaTime, this.totalFrame, this.fps);
            }
        }
        private OnEndOnceLoop()
        {
            for (let i = 0; i < this.elements.length; i++)
            {
                this.elements[i].OnEndOnceLoop();
            }
        }

        private _renderCamera:camera;
        get renderCamera():camera
        {
            if(this._renderCamera!=null)
            {
                return this._renderCamera;
            }else
            {
                return gd3d.framework.sceneMgr.app.getScene().mainCamera;
            }
        }

        public render(context: renderContext, assetmgr: assetMgr, camera: camera,Effqueue:number=0)
        {
            if(!this.active) return;            
            this._renderCamera=camera;
            let curCount = 0;
            context.updateModel(this.gameObject.transform);
            for (let i = 0; i < this.renderBatch.length; i++)
            {
                this.renderBatch[i].render(context,assetmgr,camera,Effqueue+curCount);
                curCount += this.renderBatch[i].getElementCount();
            }
            
        }
        private totalTime:number=0;
        public restartFrame:number;
        totalFrame:number=0;

        private addF14layer(type:F14TypeEnum, layerdata:F14LayerData):F14Layer
        {
            if (type==F14TypeEnum.SingleMeshType)
            {
                let layer = new F14Layer(this,layerdata);
                let element = new F14SingleMesh(this, layer);
                layer.element = element;
    
                this.layers.push(layer);
                this.elements.push(element);
                //--------------------------------------放到batcher中----------
                let data=layerdata.elementdata as F14SingleMeshBaseData;
                if(this.layers.length>1&&this.layers[this.layers.length-2].type==type)
                {
                    let batch=this.layers[this.layers.length-2].batch as F14SingleMeshBath;
                    if(batch.type==F14TypeEnum.SingleMeshType&&batch.canBatch(element))
                    {
                        batch.addElement(element);
                        layer.batch = batch;
                    }else
                    {
                        let _batch= new F14SingleMeshBath(data.material,this);
                        _batch.addElement(element);
                        layer.batch = _batch;
                        this.renderBatch.push(_batch);
                    }
                }
                else if(this.layers.length=1)
                {
                    let batch= new F14SingleMeshBath(data.material,this);
                    batch.addElement(element);
                    layer.batch = batch;
                    this.renderBatch.push(batch);
                }
                return layer;
            }else if(type==F14TypeEnum.particlesType)
            {
                let layer = new F14Layer(this,layerdata);
                let element = new F14Emission(this, layer);
                layer.element = element;
    
                this.layers.push(layer);
                this.elements.push(element);
                //--------------------------------------放到batcher中----------
                let batch= new F14EmissionBatch(this,element);
                layer.batch = batch;
                this.renderBatch.push(batch);
                return layer;
            }else
            {
                let layer = new F14Layer(this,layerdata);
                let element = new F14RefElement(this,layer);
                layer.element = element;

                this.layers.push(layer);
                this.elements.push(element);
    
                var refbath = new F14RefElementBatch(this,element);
                this.renderBatch.push(refbath);
                layer.batch = refbath;
    
                return layer;
            }
        }
    
        //返回element个数（包含reflayer内部的）
        public getElementCount():number
        {
            let totalcount = 0;
            for(let i=0;i<this.layers.length;i++)
            {
                if(this.layers[i].type==F14TypeEnum.RefType)
                {
                    totalcount += this.layers[i].batch.getElementCount();
                }else
                {
                    totalcount++;
                }
            }
            return totalcount;
        }
    
        public dispose()
        {

        }
        private active:boolean=false;
        public play()
        {
            if(this.active)
            {
                this.reset();
            }
            this.active=true;
        }
        public stop()
        {
            this.active=false;
            this.reset();
        }
        reset()
        {
            this.allTime=0;
            //this.totalTime=0;
            for (let i = 0; i < this.elements.length; i++)
            {
                this.elements[i].reset();
            }
        }
        clone() {
            
        }
    }
}