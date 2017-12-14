namespace gd3d.framework
{
    export class F14Emission implements F14Element
    {
        type: F14TypeEnum;
        layer: F14Layer;
        drawActive: boolean;
        active: boolean;
        public effect:F14Effect;


    
        public baseddata:F14EmissionBaseData;
        public currentData:F14EmissionBaseData;
        //-------------------------数据------------------------------------
        public particlelist:F14Particle[]=[];
        public deadParticles:F14Particle[] =[];

    
        //--------------------------------------------------------
        private frameLife:number = 0;
    
        private TotalTime:number = 0;
        private newStartDataTime:number = 0;//改变currentdata的时间
        public curTime:number = 0;//减去dely剩下的
        private beover:boolean = false;
        //private bool beBurst = false;
        private numcount:number = 0;

        //--------------------
        localMatrix:math.matrix=new math.matrix();
        private _worldMatrix:math.matrix=new math.matrix();
        private localrot=new math.quaternion();
        private worldRot=new math.quaternion();

        vertexCount:number;
        vertexLength:number;
        dataforvboLen:number;
        dataforebo:Uint16Array;
        posArr:math.vector3[];
        colorArr:math.color[];
        uvArr:math.vector2[];

        public constructor(effect:F14Effect,layer:F14Layer)
        {
            this.type = F14TypeEnum.particlesType;
            this.effect = effect;
            this.layer = layer;
            this.baseddata = layer.data.elementdata as F14EmissionBaseData;
            this.currentData = this.baseddata;
            
            this.initBycurrentdata();
            this.vertexCount=this.currentData.mesh.data.pos.length;
            this.posArr=this.currentData.mesh.data.pos;
            this.colorArr=this.currentData.mesh.data.color;
            this.uvArr=this.currentData.mesh.data.uv;
            this.dataforebo=this.currentData.mesh.data.genIndexDataArray();
            this.vertexLength=gd3d.render.meshData.calcByteSize(this.effect.VF)/4;
            this.dataforvboLen=this.vertexCount*this.vertexLength;
        }
    
        private lastFrame:number = 0;
        public update(deltaTime:number, frame:number,fps:number)
        {
            this.drawActive = true;
            this.TotalTime += deltaTime;
            this.frameLife =Math.floor(this.baseddata.duration * fps);
            if (this.frameLife == 0) this.frameLife = 1;
            frame = Math.floor(this.TotalTime * fps) % this.frameLife;
            this.updateLife();
            //-------------------------------change current basedata------------------------------------------------------------
            if(frame!=this.lastFrame&&this.layer.frames[frame])
            {
                if(this.layer.frames[frame].data.EmissionData != this.currentData)
                {
                    this.changeCurrentBaseData(this.layer.frames[frame].data.EmissionData);
                }
            }
            this.lastFrame = frame;
            for (let i = 0; i < this.particlelist.length; i++)
            {
                this.particlelist[i].update(deltaTime);
            }
        }
        public changeCurrentBaseData(data:F14EmissionBaseData)
        {
            this.currentData = data;
            this.newStartDataTime = this.TotalTime;
            this.numcount = 0;
            this.initBycurrentdata();
        }

        private initBycurrentdata()
        {
            math.quatFromEulerAngles(this.currentData.rotEuler.x,this.currentData.rotEuler.y,this.currentData.rotEuler.z,this.localrot);
            math.matrixMakeTransformRTS(this.currentData.rotPosition,this.currentData.rotScale,this.localrot,this.localMatrix);

            
        }

        public getWorldMatrix():math.matrix
        {
            let mat=this.effect.gameObject.transform.getWorldMatrix();
            math.matrixMultiply(mat,this.localMatrix,this._worldMatrix);
            return this._worldMatrix;
        }
        getWorldRotation():math.quaternion
        {
            let rot=this.effect.gameObject.transform.getWorldRotate();
            gd3d.math.quatMultiply(rot, this.localrot, this.worldRot);
            return this.worldRot;
        }


        public uploadMeshData()
        {
            // var perVertexCount=this.currentData.mesh.vertexCount;
            // int[] indicArr = this.currentData.mesh.GetIndices(0);
    
            // this.vertices.Clear();
            // this.colors.Clear();
            // this.uv.Clear();
    
            // this.indices.Clear();
            // for (int i = this.particlelist.Count-1,j=0; i >=0 ; i--,j++)
            // //for (int i=0;i<this.particlelist.Count;i++)
            // {
            //     this.particlelist[i].updateMeshData();
            //     for (int k = 0; k < indicArr.Length; k++)
            //     {
            //         int index = indicArr[k] +j*perVertexCount;
            //         this.indices.Add(index);
            //     }
            // }
            // this.refreshVirtualMeshData();
        }
    
        // public void refreshVirtualMeshData()
        // {
        //     this.combinemesh.Clear();
        //     this.combinemesh.SetVertices(this.vertices);
        //     this.combinemesh.SetColors(this.colors);
        //     this.combinemesh.SetUVs(0, this.uv);
        //     this.combinemesh.SetIndices(this.indices.ToArray(), MeshTopology.Triangles, 0);
        // }
    
        private updateLife()
        {
            if (this.beover) return;
            this.curTime = this.TotalTime - this.baseddata.delayTime;
            if (this.curTime <= 0) return;
            //--------------update in Livelife-------------------
            this.updateEmission();
    
            if (this.TotalTime > this.baseddata.duration)
            {
                if (this.baseddata.beloop)
                {
                    switch(this.baseddata.loopenum)
                    {
                        case LoopEnum.Restart:
                            this.reInit();
                            break;
                        case LoopEnum.TimeContinue:
                            this.beover = true;
                            break;
                    }
                }
                else
                {
                    this.beover = true;
                }
            }
        }
        private reInit()
        {
            this.currentData = this.baseddata;
            this.newStartDataTime = 0;
            this.beover = false;
            this.TotalTime = 0;
            this.numcount = 0;
    
            this.currentData.rateOverTime.getValue(true);//重新随机
            for (let i = 0; i < this.baseddata.bursts.length; i++)
            {
                this.baseddata.bursts[i].burst(false);
            }
        }
    
    
        private updateEmission()
        {
            let needCount = Math.floor(this.currentData.rateOverTime.getValue() * (this.TotalTime-this.newStartDataTime));
            let realcount = needCount - this.numcount;
            this.addParticle(realcount);
            this.numcount=needCount;
    
            if(this.baseddata.bursts.length>0)
            {
                for(let i=0;i<this.baseddata.bursts.length;i++)
                {
                    if(!this.baseddata.bursts[i].beburst()&&this.baseddata.bursts[i].time<=this.TotalTime)
                    {
                        let count = this.baseddata.bursts[i].count.getValue(true);
                        this.baseddata.bursts[i].burst();
                        this.addParticle(count);
                    }
                }
            }
        }
    
        private addParticle(count:number = 1)
        {
            for (let i = 0; i < count; i++)
            {
                if (this.deadParticles.length > 0)
                {
                    // let pp = this.deadParticles[0];
                    // this.deadParticles.RemoveAt(0);
                    // pp.initByEmissionData(this.currentData);
                    // this.particlelist.Add(pp);

                    let pp=this.deadParticles.pop();
                    pp.initByEmissionData(this.currentData);
                }
                else
                {
                    let pp = new F14Particle(this, this.currentData);
                    this.particlelist.push(pp);
                }
            }
        }
    }
    
}