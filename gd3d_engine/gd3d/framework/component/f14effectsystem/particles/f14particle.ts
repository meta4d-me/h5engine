namespace gd3d.framework
{
    export class F14Particle
    {
    
        private data:F14EmissionBaseData;
        private element:F14Emission;
    
        private totalLife:number;//总生命
        private startScaleRate:number;
        private startScale:math.vector3;
        public Starteuler:math.vector3;//这个应该为float，只绕了一个轴
        public StartPos:math.vector3=new math.vector3();
        public startColor:math.vector3;
        public startAlpha:number;
        public colorRate:number;
        private simulationSpeed:number;
        private simulateInLocalSpace:boolean;
        private starTex_ST:math.vector4;
    
        private speedDir:math.vector3=new math.vector3();
    
        public enableVelocityOverLifetime:boolean;
        private movespeed:math.vector3;
    
        public enableSizeOverLifetime:boolean;
        private sizeNodes:NumberKey[];
    
        public enableRotOverLifeTime:boolean;
        public eulerSpeed:number;
    
        public enableColorOverLifetime:boolean;
        private colorNodes:Vector3Key[];
        private alphaNodes:NumberKey[];
    
        public enableTexAnimation:boolean;
        public uvType:UVTypeEnum;
        public tex_ST:math.vector4=new math.vector4();
    
    
        public rotationByEuler = new math.quaternion();
        public rotationByShape = new math.quaternion();
        public startRotation = new math.quaternion();
        public rotAngle:number = 0;
    
        public localMatrix = new math.matrix();
    
        public localTranslate = new math.vector3();
        public localRotation = new math.quaternion();
        public localScale = new math.vector3(1, 1, 1);
        public color = new math.vector3(1, 1, 1);
        public alpha:number = 1;
    
        private Color:math.color=new math.color();
        //-----------------------------------------------------------------------------
        private curLife:number;//当前经过的生命周期
        private life01:number;//(0---1)
        public actived:boolean = false;
    
        ////在emission是在simulate in world space 时候,将发射器的这个矩阵保存起来,为静态的
        ////在emission是在simulate in local space 时候，为动态的
        private emissionMatToWorld:math.matrix;
        private emissionWorldRotation:math.quaternion;
    
        //private float startTime = 0;
        public constructor(element:F14Emission,data:F14EmissionBaseData)
        {
            this.data = data;
            this.element = element;
            this.initByEmissionData(data);
        }
        public initByEmissionData(data:F14EmissionBaseData)
        {
            this.actived = true;
            this.curLife = 0;
    
            this.totalLife = data.lifeTime.getValue(true);
            this.simulateInLocalSpace = data.simulateInLocalSpace;
            this.simulationSpeed = data.simulationSpeed.getValue(true);
            this.startScaleRate = data.startScaleRate.getValue(true);
            this.startScale=data.startScale.getValue(true);
            math.vec3ScaleByNum(this.startScale,this.startScaleRate,this.startScale);
            this.Starteuler = data.startEuler.getValue(true);
            this.startColor = data.startColor.getValue(true);
            this.startAlpha = data.startAlpha.getValue(true);
            this.colorRate = data.colorRate;
            this.starTex_ST = data.start_tex_st;
            //math.vec4Clone(data.start_tex_st,this.starTex_ST);
    
            this.movespeed = data.moveSpeed.getValue(true);
            this.sizeNodes = data.sizeNodes;
            this.eulerSpeed = data.angleSpeed.getValue(true);
            this.colorNodes = data.colorNodes;
            this.alphaNodes = data.alphaNodes;
            this.uvType = data.uvType;
            //tex_ST 与粒子curtime也有相关性
            this.getCurTex_ST(data);
    
            F14EmissionBaseData.getRandomDirAndPosByZEmission(data,this.speedDir,this.StartPos);
            //this.rotationByEuler = Quaternion.Euler(this.Starteuler);
            math.quatFromEulerAngles(this.Starteuler.x,this.Starteuler.y,this.Starteuler.z,this.rotationByEuler);
            this.rotAngle = 0;
            //todo simulateinworld/billboard
    
    
            gd3d.math.vec3Clone(this.startScale,this.localScale);
            gd3d.math.vec3Clone(this.startColor,this.color);
            this.alpha = this.startAlpha;
            //this.tex_ST = this.starTex_ST;
            gd3d.math.vec4Clone(this.starTex_ST,this.tex_ST);
        }
    
        public update(deltaTime:number)
        {
            if (!this.actived) return;
            this.curLife += deltaTime;
            //this.curLife = Time.time - this.startTime;
            this.life01 = this.curLife / this.totalLife;
            if (this.life01 > 1)
            {
                this.actived = false;
                // this.transformVertex = Matrix4x4.zero;
                // this.transformVertex.m33 = 1;
                //this.updateMeshData();
                //this.element.particlelist.Remove(this);
                this.element.deadParticles.push(this);
                return;
            }
            this.updatePos();
            this.updateSize();
            this.updateEuler();
            this.updateRot();
            this.updateLocalMatrix();
            this.updateColor();
            this.updateUV();
            
            //this.updateMeshData(this.curVertexCount);
        }
        private tempos=math.pool.new_vector3();
        private temcolor=math.pool.new_color();
        private temUv=math.pool.new_vector2();
        uploadMeshdata()
        {
            if(this.actived)
            {
                let batch=this.element.layer.batch as F14EmissionBatch;
                for(let i=0;i<this.element.vertexCount;i++)
                {
                    math.matrixTransformVector3(this.element.posArr[i],this.transformVertex,this.tempos);
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+0]= this.tempos.x;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+1]= this.tempos.y;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+2]= this.tempos.z;
    
                    math.colorMultiply(this.element.colorArr[i],this.Color,this.temcolor);
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+3]= this.temcolor.r;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+4]= this.temcolor.g;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+5]= this.temcolor.b;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+6]= this.temcolor.a;

                    this.temUv.x=this.element.uvArr[i].x*this.tex_ST.x+this.tex_ST.z;
                    this.temUv.y=this.element.uvArr[i].y*this.tex_ST.y+this.tex_ST.w;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+7]= this.temUv.x;
                    batch.dataForVbo[i*batch.vertexLength+batch.curRealVboCount+8]= this.temUv.y;
                }
                for(let i=0;i<this.element.dataforebo.length;i++)
                {
                    batch.dataForEbo[i+batch.curIndexCount]=this.element.dataforebo[i]+batch.curVertexcount;
                }
    
                batch.curRealVboCount+=this.element.dataforvboLen;
                batch.curIndexCount+=this.element.dataforebo.length;
                batch.curVertexcount+=this.element.vertexCount;
            }
        }
        /**
         * 在emission是在simulate in local space 时候，为matTobathcer
         * 在emission是在simulate in world space 时候，为matToWorld
         */
    
        private transformVertex = new math.matrix();
        private updateLocalMatrix()
        {
            math.matrixMakeTransformRTS(this.localTranslate,this.localScale,this.localRotation,this.localMatrix);
            if (this.data.simulateInLocalSpace)
            {
                math.matrixMultiply(this.element.localMatrix,this.localMatrix,this.transformVertex);
            }
            else
            {//这边待定
                //gd3d.math.matrixMultiply(this.emissionMatToWorld, this.localMatrix, this.transformVertex);
                console.log("还未处理！");
            }
        }
        private updatePos()
        {
            math.vec3ScaleByNum(this.speedDir,this.simulationSpeed * this.curLife,this.localTranslate);
            math.vec3Add(this.localTranslate,this.StartPos,this.localTranslate);

            if (this.data.enableVelocityOverLifetime)
            {
                let moved=math.pool.new_vector3();
                math.vec3ScaleByNum(this.movespeed,this.curLife,moved);
                math.vec3Add(this.localTranslate,moved,this.localTranslate);
                math.pool.delete_vector3(moved);            
            }
        }
        private updateSize()
        {
            if (this.data.enableSizeOverLifetime&&this.sizeNodes.length>0)
            {
                if(this.sizeNodes[0].key>this.life01)
                {
                    let tar=math.numberLerp(1, this.sizeNodes[0].value, this.life01 / this.sizeNodes[0].key);
                    math.vec3ScaleByNum(this.startScale,tar,this.localScale);
                    return;
                }
                for (let i = 0; i < this.sizeNodes.length - 1; i++)
                {
                    if (this.sizeNodes[i].key <= this.life01 && this.sizeNodes[i + 1].key >= this.life01)
                    {
                        let tar =math.numberLerp(this.sizeNodes[i].value, this.sizeNodes[i + 1].value, (this.life01 - this.sizeNodes[i].key) / (this.sizeNodes[i + 1].key - this.sizeNodes[i].key));
                        math.vec3ScaleByNum(this.startScale,tar,this.localScale);
                        break;
                    }
                }
            }
        }     
    
        private updateEuler()
        {
            if (this.data.enableRotOverLifeTime)
            {
                this.rotAngle = this.eulerSpeed * this.curLife;
            }
        }
        //------temp value
        private angleRot:math.quaternion=new math.quaternion();
        private worldpos=new math.vector3();
        private tarWorldpos=new math.vector3();
        private lookDir=new math.vector3();
        private worldRotation=new math.quaternion();
        private invParWorldRot=new math.quaternion();

        private updateRot()
        {
            if (this.data.rendermodel == RenderModelEnum.Mesh)
            {
                math.quatFromAxisAngle(math.pool.vector3_up,this.rotAngle,this.angleRot);
                math.quatMultiply(this.rotationByEuler,this.angleRot,this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.BillBoard)
            {
                this.emissionMatToWorld=this.element.getWorldMatrix();
                math.matrixTransformVector3(this.localTranslate,this.emissionMatToWorld,this.worldpos);
                this.tarWorldpos=this.element.effect.renderCamera.gameObject.transform.getWorldTranslate();
                gd3d.math.quatLookat(this.worldpos, this.tarWorldpos, this.worldRotation);

                this.emissionWorldRotation=this.element.getWorldRotation();
                math.quatInverse(this.emissionWorldRotation,this.invParWorldRot);
                gd3d.math.quatMultiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                math.quatFromAxisAngle(math.pool.vector3_forward,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                gd3d.math.quatMultiply(this.localRotation, this.rotationByEuler, this.localRotation);

            }
            else if (this.data.rendermodel == RenderModelEnum.HorizontalBillBoard)
            {
                this.worldRotation.x = -0.5;
                this.worldRotation.y = 0.5;
                this.worldRotation.z = 0.5;
                this.worldRotation.w = 0.5;

                this.emissionWorldRotation=this.element.getWorldRotation();
                math.quatInverse(this.emissionWorldRotation,this.invParWorldRot);
                gd3d.math.quatMultiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                math.quatFromAxisAngle(math.pool.vector3_forward,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                gd3d.math.quatMultiply(this.localRotation, this.rotationByEuler, this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.VerticalBillBoard)
            {
                this.emissionMatToWorld=this.element.getWorldMatrix();
                math.matrixTransformVector3(this.localTranslate,this.emissionMatToWorld,this.worldpos);
                this.tarWorldpos=this.element.effect.renderCamera.gameObject.transform.getWorldTranslate();
                this.tarWorldpos.y=this.worldpos.y;
                gd3d.math.quatLookat(this.worldpos, this.tarWorldpos, this.worldRotation);
                
                this.emissionWorldRotation=this.element.getWorldRotation();
                math.quatInverse(this.emissionWorldRotation,this.invParWorldRot);
                gd3d.math.quatMultiply(this.invParWorldRot, this.worldRotation, this.localRotation);

                math.quatFromAxisAngle(math.pool.vector3_forward,this.rotAngle + this.Starteuler.z,this.rotationByEuler);
                gd3d.math.quatMultiply(this.localRotation, this.rotationByEuler, this.localRotation);
            }
            else if (this.data.rendermodel == RenderModelEnum.StretchedBillBoard)
            {
                //todo先留着
                //Debug.Log("还未处理！");
                // Vector3 worldStartPos = this.getElementMatToWorld() * this.StartPos;
                // Vector3 targetpos = F14EffectPlayer.currentCamera.transform.position;
                // Vector3 dir = targetpos - worldStartPos;
                // Vector3 lookdir=(Vector3.Dot(this.speedDir, dir) * this.speedDir + worldStartPos)-targetpos;
    
                // Quaternion worldRot = Quaternion.LookRotation(lookdir,this.speedDir);
                // Quaternion parentRot = this.getElementQuat();
                // this.localRotation = Quaternion.Inverse(parentRot) * worldRot;
            }
        }   
        private updateColor()
        {
            if (this.data.enableColorOverLifetime)
            {
                if (this.colorNodes.length > 0)
                {
                    if(this.colorNodes[0].key>this.life01)
                    {
                        math.vec3SLerp(this.startColor, this.colorNodes[0].value, this.life01/ this.colorNodes[0].key,this.color);
                    }else
                    {
                        for (let i = 0; i < this.colorNodes.length - 1; i++)
                        {
                            if (this.colorNodes[i].key <= this.life01 && this.colorNodes[i + 1].key >= this.life01)
                            {
                                math.vec3SLerp(this.colorNodes[i].value, this.colorNodes[i + 1].value, (this.life01 - this.colorNodes[i].key) / (this.colorNodes[i + 1].key - this.colorNodes[i].key),this.color);
                                break;
                            }
                        }
                    }
                }
                if (this.alphaNodes.length>0)
                {
                    if (this.alphaNodes[0].key > this.life01)
                    {
                        this.alpha = math.numberLerp(this.startAlpha, this.alphaNodes[0].value, this.life01 / this.alphaNodes[0].key);
                        
                    }
                    else
                    {
                        for (let i = 0; i < this.alphaNodes.length - 1; i++)
                        {
                            if (this.alphaNodes[i].key <= this.life01 && this.alphaNodes[i + 1].key >= this.life01)
                            {
                                this.alpha = math.numberLerp(this.alphaNodes[i].value, this.alphaNodes[i + 1].value, (this.life01 - this.alphaNodes[i].key) / (this.alphaNodes[i + 1].key - this.alphaNodes[i].key));
                                break;
                            }
                        }
                    }
                }
            }
            this.Color.r = this.color.x;
            this.Color.g = this.color.y;
            this.Color.b = this.color.z;
            this.Color.a = this.alpha;
        }
        private updateUV()
        {
            this.getCurTex_ST(this.data);
        }
        public getCurTex_ST(data:F14EmissionBaseData)
        {
            if (!data.enableTexAnimation) return;
            if (data.uvType == UVTypeEnum.UVRoll)
            {
                this.tex_ST.x = 1;
                this.tex_ST.y = 1;
                this.tex_ST.z = data.uSpeed * this.curLife;
                this.tex_ST.w = data.vSpeed * this.curLife;
            }
            else
            {
                // let index = Math.floor(this.life01 * data.count);
    
                // let width = 1 / data.column;//width
                // let height = 1 / data.row;//height
                // let offsetx = width * (index % data.column);//offsetx
                // let offsety = height * Math.floor(index / data.column);//offsety
    
                // this.tex_ST.x = width;
                // this.tex_ST.y = height;
                // this.tex_ST.z = offsetx;
                // this.tex_ST.w = offsety;

                let index = Math.floor(this.life01 * data.count);
                gd3d.math.spriteAnimation(data.row,data.column,index,this.tex_ST);

            }
        }
    }
    
}