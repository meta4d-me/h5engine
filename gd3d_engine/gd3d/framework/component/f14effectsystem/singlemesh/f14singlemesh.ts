namespace gd3d.framework
{
    export class F14SingleMesh implements F14Element
    {
        drawActive: boolean;
        active: boolean;
        type: F14TypeEnum;
        layer: F14Layer;
        private  effect:F14Effect;
        //public bool BeRecording = false;
        public RenderBatch:F14SingleMeshBath;
    
        public position:math.vector3=new math.vector3();
        public scale:math.vector3=new math.vector3();
        public euler:math.vector3=new math.vector3();
        public color:math.color=new math.color();
        public tex_ST:math.vector4=new math.vector4();
        public baseddata:F14SingleMeshBaseData;
    
        private localRotate:math.quaternion=new math.quaternion();
        //-----------------life from to---------------------
        public startFrame:number;
        public endFrame:number;

        private vertexCount:number;
        private posArr:math.vector3[];
        private colorArr:math.color[];
        private uvArr:math.vector2[];
        private dataforvbo:Float32Array;
        private dataforebo:Uint16Array;
        
        constructor(effect:F14Effect,layer:F14Layer)
        {
            this.type = F14TypeEnum.SingleMeshType;
            this.effect = effect;
            this.layer = layer;
            this.baseddata = layer.data.elementdata as F14SingleMeshBaseData;
    

            math.vec3Clone(this.baseddata.position,this.position);
            math.vec3Clone(this.baseddata.scale,this.scale);
            math.vec3Clone(this.baseddata.euler,this.euler);
            math.colorClone(this.baseddata.color,this.color);
            math.vec4Clone(this.baseddata.tex_ST,this.tex_ST);
            
            this.refreshStartEndFrame();

            this.posArr=this.baseddata.mesh.data.pos;
            this.colorArr=this.baseddata.mesh.data.color;
            this.uvArr=this.baseddata.mesh.data.uv;
            this.vertexCount=this.posArr.length;
            
            this.dataforvbo=this.baseddata.mesh.data.genVertexDataArray(this.effect.VF);
            this.dataforebo=this.baseddata.mesh.data.genIndexDataArray();
        }
    
        public refreshStartEndFrame()
        {
            if (this.layer.frameList.length == 0)
            {
                this.startFrame = 0;
            }else
            {
                this.startFrame = this.layer.frameList[0];
            }
            if(this.layer.frameList.length>1)
            {
                this.endFrame = this.layer.frameList[this.layer.frameList.length - 1];
            }else
            {
                this.endFrame = this.effect.data.lifeTime;
            }
        }
    
        public update(deltaTime:number,frame:number, fps:number)
        {
            if (this.layer.frameList.length == 0)
            {
                this.drawActive = false;
                return;
            }      
            switch (this.baseddata.loopenum)
            {
                case LoopEnum.Restart:
                    if (this.effect.data.beloop)
                    {
                        frame = this.effect.restartFrame;
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
                    break;
                case LoopEnum.TimeContinue:
                    if (frame < this.startFrame|| frame > this.endFrame)
                    {
                        this.drawActive = false;
                        return;
                    }else
                    {
                        this.drawActive = true;
                    }
                    break;
            }
           
            ////------------------time line 方式--------------------
            //先传入本身初始的属性值，属性不一定在lin中存在值，需要初始值

            for(var item in this.layer.Attlines)
            {
                let att = this.layer.Attlines[item];
                att.getValue(frame,this.baseddata,this[item]);
            }

            if (this.baseddata.enableTexAnimation)
            {
                this.refreshCurTex_ST(frame,fps);
            }
            
            this.refreshTargetMatrix();
        }
        targetMat:math.matrix=new math.matrix();
        public refreshTargetMatrix()
        {
            math.quatFromEulerAngles(this.euler.x, this.euler.y, this.euler.z,this.localRotate);
            math.matrixMakeTransformRTS(this.position,this.scale,this.localRotate,this.targetMat);
            //return Matrix4x4.TRS(this.position, Quaternion.Euler(this.euler.x, this.euler.y, this.euler.z),this.scale);
        }

        uploadMeshdata()
        {
            let batch=this.layer.batch as F14SingleMeshBath;
            for(let i=0;i<this.vertexCount;i++)
            {
                let tempos=math.pool.new_vector3();
                math.matrixTransformVector3(this.posArr[i],this.targetMat,tempos);
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+0]= tempos.x;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+1]= tempos.y;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+2]= tempos.z;

                let temColor=math.pool.new_color();
                math.colorMultiply(this.colorArr[i],this.color,temColor);
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+3]= temColor.r;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+4]= temColor.g;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+5]= temColor.b;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+6]= temColor.a;

                let temUv=math.pool.new_vector2();
                temUv.x=this.uvArr[i].x*this.tex_ST.x+this.tex_ST.z;
                temUv.y=this.uvArr[i].y*this.tex_ST.y+this.tex_ST.w;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+7]= temUv.x;
                batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+8]= temUv.y;
            }
            for(let i=0;i<this.dataforebo.length;i++)
            {
                batch.dataForEbo[i+batch.curIndexCount]=this.dataforebo[i]+batch.curVertexcount;
            }

            batch.curRealVboCount+=this.dataforvbo.length;
            batch.curIndexCount+=this.dataforebo.length;
            batch.curVertexcount+=this.vertexCount;
        }
    
    
    
        public refreshCurTex_ST(curframe:number,fps:number)
        {
            if (this.baseddata.uvType == UVTypeEnum.UVRoll)
            {   
                this.tex_ST.z = this.baseddata.uSpeed * (curframe-this.startFrame)/fps+this.tex_ST.z;
                this.tex_ST.w = this.baseddata.vSpeed * (curframe - this.startFrame) /fps + this.tex_ST.w;
            }
            else if(this.baseddata.uvType==UVTypeEnum.UVSprite)
            {
                let lerp = (curframe - this.startFrame) /(this.endFrame - this.startFrame);
                
                let index =Math.floor(lerp * this.baseddata.count);
                index = index %this.baseddata.count;
    
                let width = 1.0/ this.baseddata.column;//width
                let height = 1.0/ this.baseddata.row;//height
                let offsetx = width * (index % this.baseddata.column);//offsetx
                let offsety = height * Math.floor(index / this.baseddata.column);//offsety
    
                this.tex_ST.x = width;
                this.tex_ST.y = height;
                this.tex_ST.z = offsetx;
                this.tex_ST.w = offsety;
            }
        }
    }
    
}