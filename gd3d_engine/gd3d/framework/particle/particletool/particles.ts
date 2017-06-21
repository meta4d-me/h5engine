namespace gd3d.framework
{
    //特效系统中的发射器都丢在这里
    export class Particles
    {
        public gameObject: gameObject;
        public name: string;
        public emissionElements: EmissionElement[] = [];//一个特效系统可以有多个发射器元素
        private vf: number;
        public effectSys: effectSystem;
        public loopFrame: number = Number.MAX_VALUE;//循环帧数
        constructor(sys: effectSystem)
        {
            this.effectSys = sys;
            this.vf = sys.vf;
        }
        addEmission(_emissionNew: Emission)
        {
            let _emissionElement = new EmissionElement(_emissionNew, this.effectSys);
            this.emissionElements.push(_emissionElement);
        }
        update(delta: number)
        {
            for (let key in this.emissionElements)
            {
                this.emissionElements[key].update(delta);
            }
        }
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            for (let key in this.emissionElements)
            {
                this.emissionElements[key].render(context, assetmgr, camera);
            }
        }
        dispose()
        {
            for (let key in this.emissionElements)
            {
                this.emissionElements[key].dispose();
            }
            this.emissionElements.length = 0;
        }
    }
    //发射器也作为特效系统的一个元素
    export class EmissionElement
    {
        public gameObject: gameObject;
        public emissionBatchers: EmissionBatcher[];//一个发射器可能有多个batcher 需要有一个管理机制

        public active: boolean = true;//激活状态

        public emission: Emission;//原始数据，不能被改变
        private vf: number;
        private curTime: number;
        private numcount: number;
        private isover: boolean = false;

        private _continueSpaceTime: number;
        public effectSys: effectSystem;
        constructor(_emission: Emission, sys: effectSystem)
        {
            this.effectSys = sys;
            this.vf = sys.vf;
            this.gameObject = sys.gameObject;
            this.emission = _emission;
            switch (this.emission.emissionType)
            {
                case ParticleEmissionType.burst:
                    break;
                case ParticleEmissionType.continue:
                    this._continueSpaceTime = this.emission.time / (this.emission.emissionCount);
                    break;
            }
            this.curTime = 0;
            this.numcount = 0;

            this.emissionBatchers = [];
            this.emissionBatchers[0] = new EmissionBatcher(this.emission, this.effectSys);//先处理一个batcher的情况
        }

        public update(delta: number)
        {
            this.curTime += delta;
            this.updateEmission(delta);
            this.updateBatcher(delta);
        }

        updateBatcher(delta: number)
        {
            for (let key in this.emissionBatchers)
            {
                this.emissionBatchers[key].update(delta);
            }
        }

        updateEmission(delta: number)
        {
            if (this.isover) return;
            if (this.emission.emissionType == ParticleEmissionType.continue)
            {
                if (this.numcount == 0) 
                {
                    this.addParticle();
                    this.numcount++;
                }

                if (this.curTime > this._continueSpaceTime)
                {
                    if (this.numcount < this.emission.emissionCount)
                    {
                        this.addParticle();
                        this.curTime = 0;
                        this.numcount++;
                    }
                    else
                    {
                        if (this.emission.beLoop)
                        {
                            this.curTime = 0;
                            this.numcount = 0;
                            this.isover = false;
                        } else
                        {
                            this.isover = true;
                        }
                    }
                }
            }
            else if (this.emission.emissionType == ParticleEmissionType.burst)
            {
                if (this.curTime > this.emission.time)
                {
                    this.addParticle(this.emission.emissionCount);
                    if (this.emission.beLoop)
                    {
                        this.curTime = 0;
                        this.isover = false;
                    } else
                    {
                        this.isover = true;
                    }
                }
            }
        }

        addParticle(count: number = 1)
        {
            //处理batcher上限 决定是否新建
            for (let i = 0; i < count; i++)
            {
                this.emissionBatchers[0].addParticle();
            }
        }

        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            for (let key in this.emissionBatchers)
            {
                this.emissionBatchers[key].render(context, assetmgr, camera);
            }
        }
        dispose()
        {
            for (let key in this.emissionBatchers)
            {
                this.emissionBatchers[key].dispose();
            }
            this.emissionBatchers.length = 0;
        }
        public isOver(): boolean
        {
            return this.isover;
        }
    }
    export class EmissionBatcher
    {
        public gameObject: gameObject;
        public data: Emission;
        public mesh: mesh;
        public mat: material;
        public beBufferInited: boolean = false;
        public beAddParticle: boolean = false;

        public dataForVbo: Float32Array;
        public dataForEbo: Uint16Array;

        public particles: Particle[] = [];
        // public curLiveIndex: number = 0;
        /**
         * 顶点大小
         * @public
         * @type {number}
         * @memberof effect
         */
        public vertexSize: number = 0;
        public formate: number = 0;
        public effectSys: effectSystem;
        constructor(_data: Emission, effectSys: effectSystem)
        {
            this.effectSys = effectSys;
            this.data = _data;
            this.formate = effectSys.vf;
            this.vertexSize = gd3d.render.meshData.calcByteSize(this.formate) / 4;
            this.curTotalVertexCount = 512;
            this.indexStartIndex = 512;

            this.initMesh();

            //初始化材质信息
            this.mat = new material();
            if (this.data.mat.shader == null)
            {
                this.mat.setShader(sceneMgr.app.getAssetMgr().getShader("diffuse.shader.json"));
            }
            else
            {
                this.mat.setShader(this.data.mat.shader);
            }
            if (this.data.mat.alphaCut != undefined)
                this.mat.setFloat("_AlphaCut", this.data.mat.alphaCut);
            if (this.data.mat.diffuseTexture != null)
                this.mat.setTexture("_MainTex", this.data.mat.diffuseTexture);
        }

        initMesh()
        {
            this.mesh = new mesh();
            this.mesh.data = new render.meshData();
            this.mesh.glMesh = new render.glMesh();
            this.mesh.submesh = [];
            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = 0;
                sm.line = false;
                this.mesh.submesh.push(sm);
            }
        }

        public curVerCount: number = 0;
        public curIndexCount: number = 0;
        addParticle()
        {
            let p = new Particle(this);
            p.uploadData(this.dataForVbo);
            for (let i = 0; i < p.dataForEbo.length; i++)
            {
                this.dataForEbo[this.curIndexCount + i] = p.dataForEbo[i] + this.curVerCount;
            }

            this.curVerCount += this.data.mesh.data.pos.length;
            this.curIndexCount += p.dataForEbo.length;
            this.particles.push(p);
            this.beAddParticle = true;
        }
        /**
         * 当前总的顶点数量
         * 
         * @private
         * @type {number}
         * @memberof effect
         */
        private _totalVertexCount: number = 0;
        public get curTotalVertexCount(): number
        {
            return this._totalVertexCount;
        }
        public set curTotalVertexCount(val: number)
        {
            this._totalVertexCount = val;
            this.resizeVboSize(this._totalVertexCount * this.vertexSize);
        }

        private _indexStartIndex = 0;
        public get indexStartIndex()
        {
            return this._indexStartIndex;
        }
        public set indexStartIndex(value: number)
        {
            this._indexStartIndex = value;
            if (this.dataForEbo != null)
            {
                let ebo = new Uint16Array(this._indexStartIndex);
                ebo.set(this.dataForEbo, 0);
                this.dataForEbo = ebo;
            } else
            {
                this.dataForEbo = new Uint16Array(this._indexStartIndex);
            }
        }
        update(delta: number)
        {
            for (let key in this.particles)
            {
                this.particles[key].update(delta);
                this.particles[key].uploadData(this.dataForVbo);
            }
        }
        private _vbosize: number = 0;
        /**
         * 动态设定vbo大小
         * 
         * @param {number} value 
         * @returns 
         * 
         * @memberof effect
         */
        public resizeVboSize(value: number)
        {
            if (this._vbosize > value) return;
            this._vbosize = value;
            if (this.dataForVbo != null)
            {
                let vbo = new Float32Array(this._vbosize);
                vbo.set(this.dataForVbo, 0);
                this.dataForVbo = vbo;
            } else
            {
                this.dataForVbo = new Float32Array(this._vbosize);
            }
        }

        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            let mesh = this.mesh;
            if (!this.beBufferInited)
            {
                mesh.glMesh.initBuffer(context.webgl, this.formate, this.curTotalVertexCount);
                mesh.glMesh.addIndex(context.webgl, this.dataForEbo.length);
                this.beBufferInited = true;
            }
            if (this.beAddParticle)
            {
                this.beAddParticle = false;
                mesh.submesh[0].size = this.dataForEbo.length;//如果顶点上限要动态管理  也需要resetvbosize
                mesh.glMesh.resetEboSize(context.webgl, 0, this.dataForEbo.length);
                mesh.glMesh.uploadIndexSubData(context.webgl, 0, this.dataForEbo);
            }
            mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            this.mat.draw(context, mesh, mesh.submesh[0], "base");
        }
        dispose()
        {
            this.dataForVbo = null;
            this.dataForEbo = null;
            this.mesh.dispose();
            this.mat.dispose();
            for (let key in this.particles)
            {
                this.particles[key].dispose();
            }
        }
    }
    //还是要抽象出粒子的概念
    //这里根据发射器定义的初始参数  计算当前要提交的数据
    export class Particle
    {
        public gameObject: gameObject;
        public localTranslate: math.vector3;
        public euler: math.vector3;
        public color: math.vector3;
        private initscale:math.vector3=new gd3d.math.vector3();
        public scale: math.vector3;
        public uv: math.vector2;
        public alpha: number;
        public mat: EffectMatData;
        public renderModel: RenderModel = RenderModel.None;
        public matrix: math.matrix = new math.matrix();
        public tilling: math.vector2 = new math.vector2(1, 1);
        /**
         * lerp，action更新euler，再由euler合成rotationByEuler。
         * 下一步拿rotationByEuler乘以billboard生成的四元数得到最终的localRotation。
         * 再用localRotation,pos，scale计算出最终的matrix。
         * matrix作用每个顶点，然后去渲染。
         * 
         * @type {math.quaternion}
         * @memberof EffectAttrsData
         */
        public rotationByEuler: math.quaternion = new math.quaternion();
        /**
         * 本地旋转(经过各种lerp和action后计算的最终值)
         * 
         * @type {math.quaternion}
         * @memberof EffectAttrsData
         */
        public localRotation: math.quaternion = new math.quaternion();

        public rotationByShape: math.quaternion = new math.quaternion();
        private startPitchYawRoll: gd3d.math.vector3 = new gd3d.math.vector3();
        public rotation_start: gd3d.math.quaternion = new gd3d.math.quaternion();

        public vertexStartIndex: number;
        public dataForVbo: Float32Array; //自己维护一个顶点数据的数组
        public sourceVbo: Float32Array;
        public dataForEbo: Uint16Array;
        public data: Emission;
        private vertexCount: number;//顶点数量
        private vertexSize: number;//单个顶点大小
        private curLife: number;//当前经过的生命周期
        private format: number;
        private uvSpriteFrameInternal: number;
        private batcher: EmissionBatcher;
        private speedDir: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        private simulationSpeed: number;
        public startFrameId: number;
        //根据发射器定义 初始化
        constructor(batcher: EmissionBatcher)//, _data: EmissionNew, startIndex: number, format: number
        {
            this.batcher = batcher;
            this.format = batcher.formate;
            this.data = batcher.data.clone();
            this.data.life.getValueRandom();
            this.startFrameId = this.batcher.effectSys.frameId;
            // if (this.data.moveSpeed != undefined)
            //     this.data.moveSpeed.getValueRandom();
            // if (this.data.eulerSpeed != undefined)
            //     this.data.eulerSpeed.getValueRandom();
            // if (this.data.scaleSpeed != undefined)
            //     this.data.scaleSpeed.getValueRandom();
            // if (this.data.colorSpeed != undefined)
            //     this.data.colorSpeed.getValueRandom();
            // if (this.data.alphaNodes != undefined)
            // {
            //     for (let i in this.data.alphaNodes)
            //         this.data.alphaNodes[i].getValueRandom();
            // }
            // if (this.data.eulerNodes != undefined)
            // {
            //     for (let i in this.data.eulerNodes)
            //         this.data.eulerNodes[i].getValueRandom();
            // }
            // if (this.data.scaleNodes != undefined)
            // {
            //     for (let i in this.data.scaleNodes)
            //         this.data.scaleNodes[i].getValueRandom();
            // }
            // if (this.data.colorNodes != undefined)
            // {
            //     for (let i in this.data.colorNodes)
            //         this.data.colorNodes[i].getValueRandom();
            // }
            // if (this.data.uvRoll != undefined)
            // {
            //     this.data.uvRoll.uvSpeed.getValueRandom();
            //     if (this.data.uvRoll.uvSpeedNodes != undefined)
            //     {
            //         for (let i in this.data.uvRoll.uvSpeedNodes)
            //             this.data.uvRoll.uvSpeedNodes[i].getValueRandom();
            //     }
            // }
            if (this.data.uvType == UVTypeEnum.UVSprite)
            {
                this.uvSpriteFrameInternal = (this.data.life.getValue() * effectSystem.fps) / this.data.uvSprite.totalCount;
            }
            this.gameObject = batcher.effectSys.gameObject;
            this.vertexSize = gd3d.render.meshData.calcByteSize(this.format) / 4;
            this.vertexStartIndex = batcher.curVerCount;
            this.dataForVbo = new Float32Array(this.data.mesh.data.pos.length * this.vertexSize);
            this.dataForEbo = this.data.mesh.data.genIndexDataArray();
            this.sourceVbo = this.data.getVboData(this.format);
            this.vertexCount = this.data.mesh.data.pos.length;
            this.curLife = 0;
            this.initByData();
            this.dataForVbo.set(this.data.mesh.data.genVertexDataArray(this.format), 0);
            //计算得出初始vbo ebo
        }

        public uploadData(array: Float32Array)
        {
            array.set(this.dataForVbo, this.vertexStartIndex * this.vertexSize);
        }
        initByData()
        {

            //box方向随着中心轴朝向
            let localRandomDirection = gd3d.math.pool.clone_vector3(this.data.particleStartData.randomDirection);
            this.speedDir = gd3d.math.pool.clone_vector3(localRandomDirection);

            //生成粒子的中心位置
            let localCenterTranslate = gd3d.math.pool.clone_vector3(this.data.particleStartData.position);
            let localRandomTranslate = gd3d.math.pool.clone_vector3(this.data.particleStartData.randomPosition);

            this.localTranslate = gd3d.math.pool.clone_vector3(localCenterTranslate);
            gd3d.math.vec3Add(this.localTranslate, localRandomTranslate, this.localTranslate);

            this.simulationSpeed = this.data.simulationSpeed != undefined ? this.data.simulationSpeed.getValue() : 0;

            if (this.data.euler == undefined)
                this.euler = new gd3d.math.vector3(0, 0, 0);
            else
                this.euler = this.data.euler.getValueRandom();
            if (this.data.scale == undefined)
                this.scale = new gd3d.math.vector3(1, 1, 1);
            else
                this.scale = this.data.scale.getValueRandom();
            if (this.data.color == undefined)
                this.color = new gd3d.math.vector3(0, 0, 0);
            else
                this.color = this.data.color.getValueRandom();
            if (this.data.alpha == undefined)
                this.alpha = 1;
            else
                this.alpha = this.data.alpha.getValueRandom();
            
            //记下初始scale
            gd3d.math.vec3Clone(this.scale,this.initscale);

            ///模型初始旋转量
            if (this.renderModel == RenderModel.None || this.renderModel == RenderModel.StretchedBillBoard)
            {
                gd3d.math.quatFromEulerAngles(this.startPitchYawRoll.x, this.startPitchYawRoll.y, this.startPitchYawRoll.z, this.rotation_start);

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
        }
        update(delta: number)
        {
            this.curLife += delta;
            if (this.curLife >= this.data.life.getValue())
            {
                //矩阵置零
                gd3d.math.matrixZero(this.matrix);
                this._updateVBO();
                return;
            }
            this._updatePos(delta);
            this._updateEuler(delta);
            this._updateScale(delta);
            this._updateRotation(delta);
            this._updateLocalMatrix(delta);
            this._updateColor(delta);
            this._updateAlpha(delta);
            this._updateUV(delta);
            this._updateVBO();
        }

        private _updateLocalMatrix(delta: number)
        {
            gd3d.math.matrixMakeTransformRTS(this.localTranslate, this.scale, this.localRotation, this.matrix);
        }

        private _updateRotation(delta: number)
        {
            gd3d.math.quatFromEulerAngles(this.euler.x, this.euler.y, this.euler.z, this.rotationByEuler);
            this._updateElementRotation();
        }

        private _updateElementRotation()
        {

            var cam = gd3d.framework.sceneMgr.app.getScene().mainCamera;
            let cameraTransform = cam.gameObject.transform;
            let translation = gd3d.math.pool.new_vector3();
            let worldRotation = gd3d.math.pool.new_quaternion();
            let worldTranslation = gd3d.math.pool.new_vector3();
            let invTransformRotation = gd3d.math.pool.new_quaternion();

            gd3d.math.vec3Clone(this.localTranslate, translation);
            gd3d.math.matrixTransformVector3(translation, this.gameObject.transform.getWorldMatrix(), worldTranslation);

            this.renderModel = this.data.renderModel;
            if (this.renderModel != RenderModel.None)
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
                    gd3d.math.quatClone(this.gameObject.transform.getWorldRotate(), invTransformRotation);
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
                else if (this.renderModel == RenderModel.Mesh) 
                {
                    EffectUtil.quatLookatZ(worldTranslation, cameraTransform.getWorldTranslate(), worldRotation);
                }
                gd3d.math.quatMultiply(worldRotation, this.rotationByEuler, worldRotation);
                //消除transform组件对粒子本身的影响
                gd3d.math.quatClone(this.gameObject.transform.getWorldRotate(), invTransformRotation);
                gd3d.math.quatInverse(invTransformRotation, invTransformRotation);
                gd3d.math.quatMultiply(invTransformRotation, worldRotation, this.localRotation);
            } else
            {
                gd3d.math.quatMultiply(worldRotation, this.rotationByEuler, this.localRotation);
                gd3d.math.quatMultiply(this.rotationByShape, this.localRotation, this.localRotation);
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
                if (this.data.moveSpeed.x != undefined)
                    this.localTranslate.x += this.data.moveSpeed.x.getValue() * delta;
                if (this.data.moveSpeed.y != undefined)
                    this.localTranslate.y += this.data.moveSpeed.y.getValue() * delta;
                if (this.data.moveSpeed.z != undefined)
                    this.localTranslate.z += this.data.moveSpeed.z.getValue() * delta;
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
                // for (var i = 0; i < this.data.eulerNodes.length; i++)
                // {
                //     if (this.data.eulerNodes[i].key < this.curLife)
                //     {
                //         this._startNode = this.data.eulerNodes[i];
                //         index++;
                //     }
                // }
                // if (index == this.data.eulerNodes.length) return;
                // this.endNode = this.data.eulerNodes[index];
                // var duration = this.endNode.key - this._startNode.key;
                // if (duration > 0)
                // {
                //     gd3d.math.vec3SLerp(this._startNode.getValue(), this.endNode.getValue(), (this.curLife - this._startNode.key) / duration, this.euler);
                // }
                this._updateNode(this.data.eulerNodes, this.data.life.getValue(), this.euler);
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
                // for (var i = 0; i < this.data.scaleNodes.length; i++)
                // {
                //     if (this.data.scaleNodes[i].key * this.data.life.getValue() < this.curLife)
                //     {
                //         if (i + 1 == this.data.scaleNodes.length || (i + 1 < this.data.scaleNodes.length && this.data.scaleNodes[i + 1].key > this.curLife))
                //         {
                //             this._startNode = this.data.scaleNodes[i];
                //             index++;
                //         }
                //     }
                // }
                // if (index == this.data.scaleNodes.length) return;
                // this.endNode = this.data.scaleNodes[index];
                // let startKey = 0;
                // let startVal = this.data.scale.getValue();
                // if (index > 0)
                // {
                //     startKey = this.data.scaleNodes[index - 1].key * this.data.life.getValue();
                //     startVal = this.data.scaleNodes[index - 1].getValue();
                // }
                // var duration = this.endNode.key * this.data.life.getValue() - startKey;
                // if (duration > 0)
                // {
                //     gd3d.math.vec3SLerp(startVal, this.endNode.getValue(), (this.curLife - startKey) / duration, this.scale);
                // }
                this._updateNode(this.data.scaleNodes, this.data.life.getValue(), this.scale,nodeType.scale);
            } else if (this.data.scaleSpeed != undefined)
            {
                if (this.data.scaleSpeed.x != undefined)
                    this.scale.x += this.data.scaleSpeed.x.getValue() * delta;
                if (this.data.scaleSpeed.y != undefined)
                    this.scale.y += this.data.scaleSpeed.y.getValue() * delta;
                if (this.data.scaleSpeed.z != undefined)
                    this.scale.z += this.data.scaleSpeed.z.getValue() * delta;
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
                // for (var i = 0; i < this.data.colorNodes.length; i++)
                // {
                //     if (this.data.colorNodes[i].key < this.curLife)
                //     {
                //         this._startNode = this.data.colorNodes[i];
                //         index++;
                //     }
                // }
                // if (index == 0 || index == this.data.colorNodes.length) return;
                // this.endNode = this.data.colorNodes[index];
                // var duration = this.endNode.key - this._startNode.key;
                // if (duration > 0)
                // {
                //     gd3d.math.vec3SLerp(this._startNode.getValue(), this.endNode.getValue(), (this.curLife - this._startNode.key) / duration, this.color);
                // }
                this._updateNode(this.data.colorNodes, this.data.life.getValue(), this.color);
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
        private _updateNode(nodes: any, life: number, out: any,nodetype:nodeType=nodeType.none)
        {
            let index = 0;
            var duration=0;
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

                //var duration = (this.tempEndNode.key - this.tempStartNode.key) * life;
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
                        // var lvalue=this.tempStartNode.getValue();
                        // var rvalue=this.tempEndNode.getValue();
                        // var lerp=(this.curLife - this.tempStartNode.key * life) / duration;
                        // out=gd3d.math.numberLerp(lvalue,rvalue,lerp);
                        if(nodetype==nodeType.alpha)
                        {
                            this.alpha=gd3d.math.numberLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration);
                        }
                        else if(nodetype=nodeType.scale)
                        {
                            var targetscale=gd3d.math.numberLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration);
                            gd3d.math.vec3ScaleByNum(this.initscale,targetscale,out);
                        }
                        // else
                        // {
                        //     out = gd3d.math.numberLerp(this.tempStartNode.getValue(), this.tempEndNode.getValue(), (this.curLife - this.tempStartNode.key * life) / duration);
                        // }
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
                // for (var i = 0; i < this.data.alphaNodes.length; i++)
                // {
                //     if (this.data.alphaNodes[i].key < this.curLife)
                //     {
                //         this._startNodeNum = this.data.alphaNodes[i];
                //         index++;
                //     }
                // }
                // if (index == 0 || index == this.data.alphaNodes.length) return;
                // this._curNodeNum = this.data.alphaNodes[index];
                // var duration = this.endNode.key - this._startNode.key;
                // if (duration > 0)
                // {
                //     this.alpha = gd3d.math.numberLerp(this._startNodeNum.getValue(), this._curNodeNum.getValue(), (this.curLife - this._startNode.key) / duration);
                // }
                this._updateNode(this.data.alphaNodes, this.data.life.getValue(), this.alpha,nodeType.alpha);
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
                        this._updateNode(this.data.uvRoll.uvSpeedNodes, this.data.life.getValue(), this.uv);
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

                    gd3d.math.matrixTransformVector3(vertex, this.matrix, vertex);

                    this.dataForVbo[i * vertexSize + 0] = vertex.x;
                    this.dataForVbo[i * vertexSize + 1] = vertex.y;
                    this.dataForVbo[i * vertexSize + 2] = vertex.z;
                    gd3d.math.pool.delete_vector3(vertex);
                }

                {//color
                    //处理一下颜色，以防灰度值 > 1
                    let r = math.floatClamp(this.sourceVbo[i * vertexSize + 9], 0, 1);
                    let g = math.floatClamp(this.sourceVbo[i * vertexSize + 10], 0, 1);
                    let b = math.floatClamp(this.sourceVbo[i * vertexSize + 11], 0, 1);
                    let a = math.floatClamp(this.sourceVbo[i * vertexSize + 12], 0, 1);
                    if (this.color != undefined)
                    {
                        r = math.floatClamp(this.color.x, 0, 1);
                        g = math.floatClamp(this.color.y, 0, 1);
                        b = math.floatClamp(this.color.z, 0, 1);
                    }
                    if (this.alpha != undefined)
                        a = math.floatClamp(this.alpha, 0, 1);
                    this.dataForVbo[i * 15 + 9] = r;
                    this.dataForVbo[i * 15 + 10] = g;
                    this.dataForVbo[i * 15 + 11] = b;
                    this.dataForVbo[i * 15 + 12] = a;
                }
                {
                    //uv
                    this.dataForVbo[i * vertexSize + 13] = this.sourceVbo[i * vertexSize + 13] / this.tilling.x + this.uv.x;
                    this.dataForVbo[i * vertexSize + 14] = this.sourceVbo[i * vertexSize + 14] / this.tilling.y + this.uv.y;
                }
            }
        }

        dispose()
        {
            this.dataForVbo = null;
            this.dataForEbo = null;
            this.rotation_start = null;
            this.localRotation = null;
            this.startPitchYawRoll = null;
            this.rotationByEuler = null;
            this.rotationByShape = null;
            this.tilling = null;
            this.matrix = null;
            this.localTranslate = null;
            this.euler = null;
            this.scale = null;
            this.color = null;
            this.uv = null;
        }
    }
    export enum nodeType{
        none,
        alpha,
        scale
        
    }
}