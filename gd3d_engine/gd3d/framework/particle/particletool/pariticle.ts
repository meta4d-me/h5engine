namespace gd3d.framework
{

    //还是要抽象出粒子的概念
    //这里根据发射器定义的初始参数  计算当前要提交的数据
    export class Particle
    {
        public gameObject: gameObject;
        public renderModel: RenderModel = RenderModel.Mesh;
        //public mat: EffectMatData;
        public localMatrix: math.matrix = new math.matrix();

        private startScale: math.vector3 = new gd3d.math.vector3();
        public startRotation: gd3d.math.quaternion = new gd3d.math.quaternion();
        public rotationByShape: math.quaternion = new math.quaternion();
        public euler: math.vector3;
        public rotationByEuler: math.quaternion = new math.quaternion();

        //private startPitchYawRoll: gd3d.math.vector3 = new gd3d.math.vector3();

        public localTranslate: math.vector3;
        public localRotation: math.quaternion = new math.quaternion();
        public localScale: math.vector3;
        public color: math.vector3;
        public uv: math.vector2;
        public alpha: number;
        public tilling: math.vector2 = new math.vector2(1, 1);


        private totalLife:number;//总生命
        private curLife: number;//当前经过的生命周期
        private format: number;
        private speedDir: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        private movespeed:gd3d.math.vector3;
        private simulationSpeed: number;
        private uvSpriteFrameInternal: number;
        public startFrameId: number;

        public data: Emission;
        private batcher: EmissionBatcher;
        private emisson:EmissionElement;
        private vertexSize: number;//单个顶点大小
        private vertexCount: number;//顶点数量
        public sourceVbo: Float32Array;
        public vertexStartIndex: number;
        public dataForVbo: Float32Array; //自己维护一个顶点数据的数组
        public dataForEbo: Uint16Array;

        //根据发射器定义 初始化
        constructor(batcher: EmissionBatcher)//, _data: EmissionNew, startIndex: number, format: number
        {
            this.gameObject = batcher.effectSys.gameObject;
            this.emisson=batcher.emissionElement;
            this.batcher = batcher;
            this.format = batcher.formate;
            this.data = batcher.data.clone();
            
            this.vertexSize = gd3d.render.meshData.calcByteSize(this.format) / 4;
            this.vertexStartIndex = batcher.curVerCount;
            this.vertexCount = this.emisson.perVertexCount;

            this.dataForVbo = new Float32Array(this.vertexCount * this.vertexSize);
            this.dataForEbo = this.data.mesh.data.genIndexDataArray();
            this.dataForVbo.set(this.data.mesh.data.genVertexDataArray(this.format), 0);
            this.sourceVbo = this.data.getVboData(this.format);

            this.initByData();

            //计算得出初始vbo ebo
        }

        public uploadData(array: Float32Array)
        {
            array.set(this.dataForVbo, this.vertexStartIndex * this.vertexSize);
        }
        initByData()
        {
            this.totalLife=this.data.life.getValueRandom();
            this.renderModel=this.data.renderModel;
            this.curLife = 0;
            this.startFrameId = this.batcher.effectSys.frameId;

            //box方向随着中心轴朝向
            let localRandomDirection = gd3d.math.pool.clone_vector3(this.data.particleStartData.randomDirection);
            this.speedDir = gd3d.math.pool.clone_vector3(localRandomDirection);

            let localRandomTranslate = gd3d.math.pool.clone_vector3(this.data.particleStartData.randomPosition);
            this.localTranslate=gd3d.math.pool.clone_vector3(localRandomTranslate);

            this.simulationSpeed = this.data.simulationSpeed != undefined ? this.data.simulationSpeed.getValue() : 0;

            if (this.data.euler == undefined)
                this.euler = new gd3d.math.vector3(0, 0, 0);
            else
                this.euler = this.data.euler.getValueRandom();
            if (this.data.scale == undefined)
                this.localScale = new gd3d.math.vector3(1, 1, 1);
            else
                this.localScale = this.data.scale.getValueRandom();
            if (this.data.color == undefined)
                this.color = new gd3d.math.vector3(0, 0, 0);
            else
                this.color = this.data.color.getValueRandom();
            if (this.data.alpha == undefined)
                this.alpha = 1;
            else
                this.alpha = this.data.alpha.getValueRandom();
            if (this.data.uv == undefined)
                this.uv = new gd3d.math.vector2(1, 1);
            else
                this.uv = this.data.uv.getValueRandom();

            if(this.data.moveSpeed!=undefined)
            {
                this.movespeed=this.data.moveSpeed.getValue();
            }
            else
            {
                this.movespeed=new gd3d.math.vector3();
            }
            //记下初始scale
            gd3d.math.vec3Clone(this.localScale, this.startScale);

            //模型初始旋转量
            if (this.renderModel == RenderModel.None || this.renderModel == RenderModel.StretchedBillBoard)
            {
                gd3d.math.quatFromEulerAngles(this.euler.x, this.euler.y, this.euler.z, this.rotationByEuler);

                if (this.data.particleStartData.shapeType != ParticleSystemShape.NORMAL)
                {
                    let localOrgin = gd3d.math.pool.vector3_zero;
                    gd3d.math.quatLookat(localOrgin, localRandomDirection, this.rotationByShape);

                    let initRot = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatFromEulerAngles(90, 0, 0, initRot);
                    gd3d.math.quatMultiply(this.rotationByShape, initRot, this.rotationByShape);
                    gd3d.math.pool.delete_quaternion(initRot);
                }
            }
            if (this.data.uvType == UVTypeEnum.UVSprite)
            {
                this.uvSpriteFrameInternal = (this.totalLife* effectSystem.fps) / this.data.uvSprite.totalCount;
            }
        }
        actived:boolean=true;
        update(delta: number)
        {
            if(!this.actived) return;
            this.curLife += delta;
            if (this.curLife >= this.totalLife)
            {
                //矩阵置零
                gd3d.math.matrixZero(this.matToBatcher);
                this._updateVBO();
                this.emisson.deadParticles.push(this);
                this.curLife=0;
                this.actived=false;
                return;
            }
            this._updatePos(delta);
            this._updateScale(delta);
            this._updateEuler(delta);
            this._updateRotation(delta);
            this._updateLocalMatrix(delta);
            this._updateColor(delta);
            this._updateAlpha(delta);
            this._updateUV(delta);
            this._updateVBO();
        }
        private matToBatcher:gd3d.math.matrix=new gd3d.math.matrix();
        private _updateLocalMatrix(delta: number)
        {
            gd3d.math.matrixMakeTransformRTS(this.localTranslate, this.localScale, this.localRotation, this.localMatrix);
            gd3d.math.matrixMultiply(this.emisson.matToBatcher,this.localMatrix,this.matToBatcher);
        }

        private _updateRotation(delta: number)
        {
            gd3d.math.quatFromEulerAngles(this.euler.x, this.euler.y, this.euler.z, this.rotationByEuler);
            this._updateElementRotation();
        }
        
        private matToworld:gd3d.math.matrix;
        private _updateElementRotation()
        {

            var cam = gd3d.framework.sceneMgr.app.getScene().mainCamera;
            let cameraTransform = cam.gameObject.transform;
            let translation = gd3d.math.pool.new_vector3();
            let worldRotation = gd3d.math.pool.new_quaternion();
            let worldTranslation = gd3d.math.pool.new_vector3();
            let invTransformRotation = gd3d.math.pool.new_quaternion();

            gd3d.math.vec3Clone(this.localTranslate, translation);
            this.matToworld=this.emisson.getmatrixToWorld();

            gd3d.math.matrixTransformVector3(translation, this.matToworld, worldTranslation);

            if (this.renderModel != RenderModel.Mesh)
            {

                if (this.renderModel == RenderModel.BillBoard)
                {
                    gd3d.math.quatLookat(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);
                }
                else if (this.renderModel == RenderModel.HorizontalBillBoard)
                {
                    worldRotation.x = -0.5;
                    worldRotation.y = 0.5;
                    worldRotation.z = 0.5;
                    worldRotation.w = 0.5;
                }
                else if (this.renderModel == RenderModel.VerticalBillBoard)
                {
                    let forwardTarget = gd3d.math.pool.new_vector3();
                    gd3d.math.vec3Clone(cameraTransform.getWorldTranslate(), forwardTarget);
                    forwardTarget.y = worldTranslation.y;
                    gd3d.math.quatLookat(worldTranslation, forwardTarget, worldRotation);
                    gd3d.math.pool.delete_vector3(forwardTarget);

                }
                else if (this.renderModel == RenderModel.StretchedBillBoard)
                {
                    // gd3d.math.quatMultiply(worldRotation, this.rotationByEuler, this.localRotation);
                    // gd3d.math.quatMultiply(this.rotationByShape, this.localRotation, this.localRotation);

                    gd3d.math.quatClone(this.rotationByShape, this.localRotation);

                    gd3d.math.quatLookat(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);

                    let lookRot = new gd3d.math.quaternion();
                    gd3d.math.quatClone(this.emisson.getWorldRotation(), invTransformRotation);
                    gd3d.math.quatInverse(invTransformRotation, invTransformRotation);
                    gd3d.math.quatMultiply(invTransformRotation, worldRotation, lookRot);

                    let inverRot = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatInverse(this.localRotation, inverRot);
                    gd3d.math.quatMultiply(inverRot, lookRot, lookRot);

                    let angle = gd3d.math.pool.new_vector3();
                    gd3d.math.quatToEulerAngles(lookRot, angle);
                    gd3d.math.quatFromEulerAngles(0, angle.y, 0, lookRot);
                    gd3d.math.quatMultiply(this.localRotation, lookRot, this.localRotation);

                    gd3d.math.pool.delete_quaternion(inverRot);
                    gd3d.math.pool.delete_vector3(angle);
                    gd3d.math.pool.delete_quaternion(lookRot);
                    return;
                }
                gd3d.math.quatMultiply(worldRotation, this.rotationByEuler, worldRotation);//eulerrot有的不是必要的，todo
                //消除transform组件对粒子本身的影响
                gd3d.math.quatClone(this.emisson.getWorldRotation(), invTransformRotation);
                gd3d.math.quatInverse(invTransformRotation, invTransformRotation);
                gd3d.math.quatMultiply(invTransformRotation, worldRotation, this.localRotation);
            } else
            {
                gd3d.math.quatClone(this.rotationByEuler,this.localRotation);
            }
            gd3d.math.pool.delete_vector3(translation);
            gd3d.math.pool.delete_quaternion(worldRotation);
            gd3d.math.pool.delete_vector3(worldTranslation);
            gd3d.math.pool.delete_quaternion(invTransformRotation);

        }
        private _updatePos(delta: number)
        {

            if (this.data.moveSpeed != undefined)
            {
                this.localTranslate.x += this.movespeed.x * delta;
                this.localTranslate.y += this.movespeed.y* delta;
                this.localTranslate.z += this.movespeed.z * delta;
            }

            let currentTranslate = EffectUtil.vecMuliNum(this.speedDir, this.simulationSpeed);
            gd3d.math.vec3Add(this.localTranslate, currentTranslate, this.localTranslate);

        }
        private _updateEuler(delta: number)
        {
            let index = 0;
            if (this.data.eulerNodes != undefined && this.data.eulerSpeed != undefined)
            {
                console.error("scale只能通过插值或者speed来修改，不能两个同时存在！");
                return;
            }
            if (this.data.eulerNodes != undefined)
            {
                this._updateNode(this.data.eulerNodes, this.totalLife, this.euler);
            } else if (this.data.eulerSpeed != undefined)
            {
                if (this.data.eulerSpeed.x != undefined)
                    this.euler.x += this.data.eulerSpeed.x.getValue() * delta;
                if (this.data.eulerSpeed.y != undefined)
                    this.euler.y += this.data.eulerSpeed.y.getValue() * delta;
                if (this.data.eulerSpeed.z != undefined)
                    this.euler.z += this.data.eulerSpeed.z.getValue() * delta;
            }
        }
        private _startNode: ParticleNode;
        private endNode: ParticleNode;
        private _updateScale(delta: number)
        {
            let index = 0;
            if (this.data.scaleNodes != undefined && this.data.scaleSpeed != undefined)
            {
                console.error("scale只能通过插值或者speed来修改，不能两个同时存在！");
                return;
            }
            if (this.data.scaleNodes != undefined)
            {
                this._updateNode(this.data.scaleNodes, this.totalLife, this.localScale, nodeType.scale);
            } else if (this.data.scaleSpeed != undefined)
            {
                if (this.data.scaleSpeed.x != undefined)
                    this.localScale.x += this.data.scaleSpeed.x.getValue() * delta;
                if (this.data.scaleSpeed.y != undefined)
                    this.localScale.y += this.data.scaleSpeed.y.getValue() * delta;
                if (this.data.scaleSpeed.z != undefined)
                    this.localScale.z += this.data.scaleSpeed.z.getValue() * delta;
            }
        }
        private _updateColor(delta: number)
        {
            let index = 0;
            if (this.data.colorNodes != undefined && this.data.colorSpeed != undefined)
            {
                console.error("color只能通过插值或者speed来修改，不能两个同时存在！");
                return;
            }
            if (this.data.colorNodes != undefined)
            {
                this._updateNode(this.data.colorNodes, this.totalLife, this.color);
            } else if (this.data.colorSpeed != undefined)
            {
                if (this.data.colorSpeed.x != undefined)
                    this.color.x += this.data.colorSpeed.x.getValue() * delta;
                if (this.data.colorSpeed.y != undefined)
                    this.color.y += this.data.colorSpeed.y.getValue() * delta;
                if (this.data.colorSpeed.z != undefined)
                    this.color.z += this.data.colorSpeed.z.getValue() * delta;
            }
        }

        private tempStartNode: any;
        private tempEndNode: any;
        private _updateNode(nodes: any, life: number, out: any, nodetype: nodeType = nodeType.none)
        {
            let index = 0;
            var duration = 0;
            if (nodes != undefined)
            {
                for (var i = 0; i < nodes.length; i++)
                {
                    if (i + 1 < nodes.length)
                    {
                        if (nodes[i].key * life <= this.curLife && nodes[i + 1].key * life >= this.curLife)
                        {
                            this.tempStartNode = nodes[i];
                            this.tempEndNode = nodes[i + 1];
                            index++;
                            duration = (this.tempEndNode.key - this.tempStartNode.key) * life;
                            break;
                        }
                    } else
                    {
                        if (this.curLife < nodes[i].key * life)
                        {
                            this.tempStartNode = nodes[i - 1];
                            this.tempEndNode = nodes[i];
                            duration = (this.tempEndNode.key - this.tempStartNode.key) * life;
                        }
                    }
                }
                if (this.tempStartNode instanceof ParticleNode)
                {
                    if (duration > 0)
                    {
                        gd3d.math.vec3SLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration, out);

                    }
                } else if (this.tempStartNode instanceof ParticleNodeNumber)
                {
                    //目前这里只刷了alpha值，
                    if (duration > 0)
                    {
                        if (nodetype == nodeType.alpha)
                        {
                            this.alpha = gd3d.math.numberLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration);
                        }
                        else if (nodetype = nodeType.scale)
                        {
                            var targetscale = gd3d.math.numberLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration);
                            gd3d.math.vec3ScaleByNum(this.startScale, targetscale, out);
                        }
                    }
                } else if (this.tempStartNode instanceof UVSpeedNode)
                {
                    if (duration > 0)
                    {
                        gd3d.math.vec2SLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration, out);
                    }
                }

            }

        }

        private _startNodeNum: ParticleNodeNumber;
        private _curNodeNum: ParticleNodeNumber;

        private _updateAlpha(delta: number)
        {
            let index = 0;
            if (this.data.alphaNodes != undefined && this.data.alphaSpeed != undefined)
            {
                console.error("color只能通过插值或者speed来修改，不能两个同时存在！");
                return;
            }
            if (this.data.alphaNodes != undefined)
            {
                this._updateNode(this.data.alphaNodes, this.totalLife, this.alpha, nodeType.alpha);
            } else if (this.data.alphaSpeed != undefined)
            {
                this.alpha += this.data.alphaSpeed.getValue() * delta;
            }
        }
        private _startUVSpeedNode: UVSpeedNode;
        private _curUVSpeedNode: UVSpeedNode;
        private spriteIndex: number;
        private _updateUV(delta: number)
        {
            if (this.uv == undefined)
                this.uv = new gd3d.math.vector2();
            if (this.data.uvType == UVTypeEnum.NONE)
            {
                this.uv = this.data.uv.getValue();
            } else if (this.data.uvType == UVTypeEnum.UVRoll)
            {
                if (this.data.uvRoll != undefined)
                {
                    if (this.data.uvRoll.uvSpeedNodes != undefined && this.data.uvRoll.uvSpeed != undefined)
                    {
                        console.error("uv只能通过插值或者speed来修改，不能两个同时存在！");
                        return;
                    }
                    let index = 0;
                    if (this.data.uvRoll.uvSpeedNodes != undefined)
                    {
                        this._updateNode(this.data.uvRoll.uvSpeedNodes, this.totalLife, this.uv);
                    } else if (this.data.uvRoll.uvSpeed != undefined)
                    {
                        if (this.data.uvRoll.uvSpeed.u != undefined)
                            this.uv.x += this.data.uvRoll.uvSpeed.u.getValue() * delta;
                        if (this.data.uvRoll.uvSpeed.v != undefined)
                            this.uv.y += this.data.uvRoll.uvSpeed.v.getValue() * delta;
                    }
                }
            } else if (this.data.uvType == UVTypeEnum.UVSprite)
            {
                if (this.data.uvSprite != undefined)
                {
                    this.spriteIndex = Math.floor((this.batcher.effectSys.frameId - this.startFrameId) / this.uvSpriteFrameInternal);
                    this.spriteIndex %= this.data.uvSprite.totalCount;
                    this.uv.x = (this.spriteIndex % this.data.uvSprite.column) / this.data.uvSprite.column;
                    this.uv.y = Math.floor((this.spriteIndex / this.data.uvSprite.column)) / this.data.uvSprite.row;
                    this.tilling.x = this.data.uvSprite.column;
                    this.tilling.y = this.data.uvSprite.row;
                }
            }

        }
        private _updateVBO()
        {
            let vertexSize = this.vertexSize;

            for (let i = 0; i < this.vertexCount; i++)
            {
                {//postion
                    let vertex = gd3d.math.pool.new_vector3();
                    vertex.x = this.sourceVbo[i * vertexSize + 0];
                    vertex.y = this.sourceVbo[i * vertexSize + 1];
                    vertex.z = this.sourceVbo[i * vertexSize + 2];

                    gd3d.math.matrixTransformVector3(vertex, this.matToBatcher, vertex); 

                    this.dataForVbo[i * vertexSize + 0] = vertex.x;
                    this.dataForVbo[i * vertexSize + 1] = vertex.y;
                    this.dataForVbo[i * vertexSize + 2] = vertex.z;
                    gd3d.math.pool.delete_vector3(vertex);
                }

                {//color
                    //处理一下颜色，以防灰度值 > 1
                    let r = math.floatClamp(this.sourceVbo[i * vertexSize + 3], 0, 1);
                    let g = math.floatClamp(this.sourceVbo[i * vertexSize + 4], 0, 1);
                    let b = math.floatClamp(this.sourceVbo[i * vertexSize + 5], 0, 1);
                    let a = math.floatClamp(this.sourceVbo[i * vertexSize + 6], 0, 1);
                    if (this.color != undefined)
                    {
                        r = math.floatClamp(this.color.x, 0, 1);
                        g = math.floatClamp(this.color.y, 0, 1);
                        b = math.floatClamp(this.color.z, 0, 1);
                    }
                    if (this.alpha != undefined)
                        a = math.floatClamp(this.alpha, 0, 1);
                    this.dataForVbo[i * vertexSize + 3] = r;
                    this.dataForVbo[i * vertexSize + 4] = g;
                    this.dataForVbo[i * vertexSize + 5] = b;
                    this.dataForVbo[i * vertexSize + 6] = a;
                }
                {
                    //uv
                    this.dataForVbo[i * vertexSize + 7] = this.sourceVbo[i * vertexSize + 7] / this.tilling.x + this.uv.x;
                    this.dataForVbo[i * vertexSize + 8] = this.sourceVbo[i * vertexSize + 8] / this.tilling.y + this.uv.y;
                }
            }
        }

        dispose()
        {
            this.dataForVbo = null;
            this.dataForEbo = null;
            this.startRotation = null;
            this.localRotation = null;
            //this.startPitchYawRoll = null;
            this.rotationByEuler = null;
            this.rotationByShape = null;
            this.tilling = null;
            this.localMatrix = null;
            this.localTranslate = null;
            this.euler = null;
            this.localScale = null;
            this.color = null;
            this.uv = null;
        }
    }
    export enum nodeType
    {
        none,
        alpha,
        scale

    }
}