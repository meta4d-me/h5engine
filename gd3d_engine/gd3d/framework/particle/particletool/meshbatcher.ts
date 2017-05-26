namespace gd3d.framework
{
    export class MeshBatcher
    {
        groupMesh: gd3d.framework.mesh;
        camera: gd3d.framework.camera;
        bufferInit: boolean = false;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;

        _material: gd3d.framework.material;
        particleSystem: particleSystem;

        private listUVSPeedNode: Array<UVSpeedNode>;
        private _vercount: number;
        public get vercount()
        {
            return this._vercount;
        }
        private _indexcount: number;
        public get indexcount()
        {
            return this._indexcount;
        }
        public parlist: Array<Particle>;

        private _maxvercount: number = 0;
        public get maxvercount()
        {
            return this._maxvercount;
        }
        public set maxvercount(value: number)
        {
            if (this._maxvercount > value) return;
            this._maxvercount = value;

            this.dataForVbo = new Float32Array(15 * this._maxvercount);
            this.dataForEbo = new Uint16Array(3 * this._maxvercount);
        }
        constructor(mat: material, maxvercout: number = 128, particle: particleSystem)
        {
            //this.position = _pos;
            this._material = mat;
            this.particleSystem = particle;
            this.groupMesh = new gd3d.framework.mesh();
            this.groupMesh.data = new gd3d.render.meshData();
            this.groupMesh.glMesh = new gd3d.render.glMesh();

            this.parlist = new Array<Particle>();
            this._vercount = 0;
            this._indexcount = 0;
            this.maxvercount = maxvercout;

            this.total = gd3d.render.meshData.calcByteSize(this.vf) / 4;
        }

        private vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
        private total: number;
        AddP(particle: Particle)
        {
            particle.vertexStartIndex = this._vercount;

            let shapeMesh = particle.mesh;
            //let vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
            let total = this.total;

            let vertexCount = particle.mesh.data.pos.length;
            for (let i = 0; i < vertexCount; i++)
            {
                {//postion
                    let vertex = gd3d.math.pool.new_vector3();
                    vertex.x = particle.vertexArr[i * 15 + 0];
                    vertex.y = particle.vertexArr[i * 15 + 1];
                    vertex.z = particle.vertexArr[i * 15 + 2];

                    gd3d.math.matrixTransformVector3(vertex, particle.localMatrix, vertex);

                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 0] = vertex.x;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 1] = vertex.y;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 2] = vertex.z;
                    gd3d.math.pool.delete_vector3(vertex);
                }
                {//normal
                    this.dataForVbo[(this._vercount + i) * total + 3] = particle.vertexArr[i * total + 3];
                    this.dataForVbo[(this._vercount + i) * total + 4] = particle.vertexArr[i * total + 4];
                    this.dataForVbo[(this._vercount + i) * total + 5] = particle.vertexArr[i * total + 5];
                }

                {//tangent
                    this.dataForVbo[(this._vercount + i) * total + 6] = particle.vertexArr[i * total + 6];
                    this.dataForVbo[(this._vercount + i) * total + 7] = particle.vertexArr[i * total + 7];
                    this.dataForVbo[(this._vercount + i) * total + 8] = particle.vertexArr[i * total + 8];
                }
                {//color
                    //处理一下颜色，以防灰度值 > 1
                    particle.color.x = Math.min(particle.color.x, 1);
                    particle.color.y = Math.min(particle.color.y, 1);
                    particle.color.z = Math.min(particle.color.z, 1);

                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 9] = particle.color.x;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 10] = particle.color.y;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 11] = particle.color.z;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 12] = particle.color.w;
                }
                {//uv
                    if (this.particleSystem.particleMethodType == ParticleMethodType.UVSPRITE)
                    {
                        var temptUV = gd3d.math.pool.new_vector2();
                        temptUV.x = particle.curTextureOffset.x * particle.vertexArr[i * total + 13] * particle.materialData.tiling.x + particle.curTextureOffset.z + particle.materialData.offset.x;
                        temptUV.y = particle.curTextureOffset.y * particle.vertexArr[i * total + 14] * particle.materialData.tiling.y + particle.curTextureOffset.w + particle.materialData.offset.y;

                        this.dataForVbo[(this._vercount + i) * total + 13] = temptUV.x;
                        this.dataForVbo[(this._vercount + i) * total + 14] = temptUV.y;
                        gd3d.math.pool.delete_vector2(temptUV);
                    }
                    else
                    {
                        this.dataForVbo[(this._vercount + i) * total + 13] = particle.vertexArr[i * total + 13] * particle.materialData.tiling.x + particle.materialData.offset.x;
                        this.dataForVbo[(this._vercount + i) * total + 14] = particle.vertexArr[i * total + 14] * particle.materialData.tiling.y + particle.materialData.offset.y;
                    }
                }
            }
            var ParticleIndexArr = shapeMesh.data.genIndexDataArray();

            for (var i = 0; i < ParticleIndexArr.length; i++)
            {
                this.dataForEbo[this._indexcount + i] = ParticleIndexArr[i] + this._vercount;
            }
            this._vercount += vertexCount;
            this._indexcount += ParticleIndexArr.length;
            this.parlist.push(particle);
        }

        addParticle(particleMesh: gd3d.framework.mesh, particleData: gd3d.framework.ParticleData): Particle
        {
            var particle = new Particle(particleMesh, particleData, this);
            if (particle != null)
            {
                this.AddP(particle);
            }
            return particle;
        }

        update(delta: number)
        {
            if (this.bdispose) return;
            for (let n = 0; n < this.parlist.length; n++)
            {
                let particle = this.parlist[n];

                if (!particle.isinit) continue;

                let vertexCount = particle.mesh.data.pos.length;
                for (var i = 0; i < vertexCount; i++)//目前只刷新了position/color。法线等未考虑。//todo
                {
                    let vertex = gd3d.math.pool.new_vector3();
                    vertex.x = particle.vertexArr[i * 15 + 0];
                    vertex.y = particle.vertexArr[i * 15 + 1];
                    vertex.z = particle.vertexArr[i * 15 + 2];

                    if (this.particleSystem.isTrail)
                    {
                        var temptMatrixToWorld = gd3d.math.pool.new_matrix();
                        gd3d.math.matrixMultiply(particle.trailMatrix, particle.localMatrix, temptMatrixToWorld);
                        gd3d.math.matrixTransformVector3(vertex, temptMatrixToWorld, vertex);
                        gd3d.math.pool.delete_matrix(temptMatrixToWorld);
                    }
                    else
                    {
                        gd3d.math.matrixTransformVector3(vertex, particle.localMatrix, vertex);
                    }
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 0] = vertex.x;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 1] = vertex.y;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 2] = vertex.z;

                    //处理一下颜色，以防灰度值 > 1
                    particle.color.x = Math.min(particle.color.x, 1);
                    particle.color.y = Math.min(particle.color.y, 1);
                    particle.color.z = Math.min(particle.color.z, 1);
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 9] = particle.color.x;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 10] = particle.color.y;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 11] = particle.color.z;
                    this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 12] = particle.color.w;

                    if (this.particleSystem.particleMethodType == ParticleMethodType.UVROLL || this.particleSystem.particleMethodType == ParticleMethodType.UVSPRITE)//这里仅刷新uv
                    {
                        var temptUV = gd3d.math.pool.new_vector2();
                        temptUV.x = particle.curTextureOffset.x * particle.vertexArr[i * this.total + 13] * particle.materialData.tiling.x + particle.curTextureOffset.z + particle.materialData.offset.x;
                        temptUV.y = particle.curTextureOffset.y * particle.vertexArr[i * this.total + 14] * particle.materialData.tiling.y + particle.curTextureOffset.w + particle.materialData.offset.y;

                        this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 13] = temptUV.x;
                        this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 14] = temptUV.y;
                        gd3d.math.pool.delete_vector2(temptUV);
                    }
                    else
                    {
                        this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 13] = particle.vertexArr[i * 15 + 13] * particle.materialData.tiling.x + particle.materialData.offset.x;
                        this.dataForVbo[(particle.vertexStartIndex + i) * 15 + 14] = particle.vertexArr[i * 15 + 14] * particle.materialData.tiling.y + particle.materialData.offset.y;
                    }

                    gd3d.math.pool.delete_vector3(vertex);
                }
            }
        }


        render(context: gd3d.framework.renderContext, assetmgr: gd3d.framework.assetMgr)
        {
            if (this.particleSystem.isTrail)
            {
                context.updateModeTrail();
            }
            else
            {
                context.updateModel(this.particleSystem.gameObject.transform);
            }
            if (!this.bufferInit)
            {
                // this.vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
                this.groupMesh.glMesh.initBuffer(context.webgl, this.vf, this.maxvercount);
                this.bufferInit = true;
            }

            this.groupMesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            this.groupMesh.glMesh.addIndex(context.webgl, this.dataForEbo.length);
            this.groupMesh.glMesh.uploadIndexSubData(context.webgl, 0, this.dataForEbo);
            this.groupMesh.submesh = [];
            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = this.dataForEbo.length;
                sm.line = false;
                this.groupMesh.submesh.push(sm);
            }

            this._material.draw(context, this.groupMesh, sm, "base");
        }
        bdispose: boolean = false;
        dispose()
        {
            if (this.groupMesh != null)
            {
                if (!this.bdispose)
                {
                    this.bdispose = true;
                }
                this.groupMesh.dispose();
            }
            this.dataForEbo = null;
            this.dataForVbo = null;
            for (var k in this.parlist)
            {
                this.parlist[k].dispose();
            }
            this.parlist.length = 0;
        }
    }
    export class Particle
    {
        public vertexStartIndex: number;
        public isinit: boolean;
        public mesh: gd3d.framework.mesh;
        public vertexArr: Float32Array;

        private meshBatcherWorldMatrix: gd3d.math.matrix;
        private particleSyTrans: gd3d.framework.transform;

        private centerPosition: gd3d.math.vector3;
        private _localTranslate: gd3d.math.vector3;
        public set localTranslate(value: gd3d.math.vector3)
        {
            this._localTranslate = value;
            this.curPosition = this._localTranslate;
        }
        public get localTranslate()
        {
            return this._localTranslate;
        }

        private startAlphaNode: EffectAlphaNode;
        private curAlphaNode: EffectAlphaNode;

        private _alpha: number;
        public set alpha(value: number)
        {
            this._alpha = value;
            this._color.w = this._alpha;
            this.startAlphaNode = new EffectAlphaNode(0, this._alpha);
        }
        public get alpha()
        {
            return this._alpha;
        }

        private listAlphaNode: Array<EffectAlphaNode>;

        private startScaleNode: EffectScaleNode;
        private curScaleNode: EffectScaleNode;

        private _scale: gd3d.math.vector3;
        private _scale_temp: gd3d.math.vector3;

        public set localScale(value: gd3d.math.vector3)
        {
            this._scale = value;
            this._scale_temp = math.pool.clone_vector3(this._scale);
            this.startScaleNode = new EffectScaleNode(0, this._scale_temp);
        }
        public get localScale()
        {
            return this._scale;
        }

        private listScaleNode: Array<EffectScaleNode>;

        private startUVSpeedNode: EffectUVSpeedNode;
        private CurUVSpeedNode: EffectUVSpeedNode;

        private _uvSpeed: gd3d.math.vector2;
        private _uvSpeed_temp: gd3d.math.vector2;

        public set uvSpeed(value: gd3d.math.vector2)
        {
            this._uvSpeed = value;
            this._uvSpeed_temp = gd3d.math.pool.clone_vector2(this._uvSpeed);
            this.startUVSpeedNode = new EffectUVSpeedNode(0, this._uvSpeed_temp);
        }
        public get uvSpeed()
        {
            return this._uvSpeed;
        }

        private listUvSpeedNode: Array<EffectUVSpeedNode>;

        private _alive: boolean;

        private startColorNode: EffectColorNode;
        private curColorNode: EffectColorNode;

        private _color: gd3d.math.vector4 = new gd3d.math.vector4();
        private _color_temp: gd3d.math.vector4;

        public set color(value: gd3d.math.vector4)
        {
            this._color = value;
            this._color_temp = gd3d.math.pool.clone_vector4(this._color);
            this.startColorNode = new EffectColorNode(0, this._color_temp);
        }
        public get color()
        {
            return this._color;
        }

        private listColorNode: Array<EffectColorNode>;

        private curve: Curve3;

        public get alive()
        {
            return this._alive;
        }
        public set alive(value: boolean)
        {
            this._alive = value;
        }

        private lifeTime: number;
        private curlifeTime: number;
        public get lifeLocation()
        {
            if (this.infinite)
            {
                return (this.curlifeTime % this.lifeTime) / this.lifeTime;
            }
            else
            {
                return this.curlifeTime / this.lifeTime;
            }
        }
        private isloop: boolean;
        private lookatcam: boolean;

        private infinite: boolean = false;

        private speed: number = 0;
        private speedDir: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);

        private particleDetailData: ParticleDetailData;
        materialData: MaterialData;

        private meshBatcher: MeshBatcher;

        private curTime: number;
        private delayTime: number = 0;
        private time: number = 0;
        /** 初始旋转角度，范围为0-360 */
        private renderModel: RenderModel;
        /** 外力速度 */
        private velocity: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        /** 外力加速度 F = ma, v=v+at */
        private acceleration: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);

        /**旋转角速度 */
        private angularVelocity: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        private angularVelocityForBillboard: number;

        gravitySpeed: number = 0;
        /**
         * 重力缩放因子
         */
        gravityModifier: number = 0;

        private localAxisX = new gd3d.math.vector3(1, 0, 0);
        private localAxisY = new gd3d.math.vector3(0, 1, 0);
        private localAxisZ = new gd3d.math.vector3(0, 0, 1);

        private camera: any;
        private cameraTransform: transform;

        private startPosition: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        private curPosition: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);

        /**  初始化时粒子是否朝向随机方向*/
        private isRotation: boolean;
        private startPitchYawRoll: gd3d.math.vector3 = new gd3d.math.vector3();

        private rotation_start: gd3d.math.quaternion = new gd3d.math.quaternion();
        private rotation_shape: gd3d.math.quaternion = new gd3d.math.quaternion();
        private rotationToCamera = gd3d.math.pool.new_quaternion();
        private rotation_overLifetime: gd3d.math.quaternion = new gd3d.math.quaternion();
        private rotation_overLifetime_temp: gd3d.math.quaternion = new gd3d.math.quaternion();
        private rotation: gd3d.math.quaternion = new gd3d.math.quaternion();

        /** 粒子本地旋转 */
        private localRotation: gd3d.math.quaternion = new gd3d.math.quaternion();
        private worldRotation: gd3d.math.quaternion = new gd3d.math.quaternion();

        public localMatrix: gd3d.math.matrix = new gd3d.math.matrix();
        public worldMatrix: gd3d.math.matrix = new gd3d.math.matrix();

        private interpType: ParticleCurveType = ParticleCurveType.CURVE;

        private bindAxis: boolean = false;
        private bindx: boolean = false;
        private bindy: boolean = false;
        private bindz: boolean = false;

        trailMatrix: gd3d.math.matrix;
        constructor(_shape: gd3d.framework.mesh, particleData: gd3d.framework.ParticleData, MeshBatcher: MeshBatcher)
        {
            this.mesh = _shape;
            this.clear();
            this.meshBatcher = MeshBatcher;
            this.particleSyTrans = this.meshBatcher.particleSystem.gameObject.transform;
            // this.camera = this.particleSyTrans.scene.renderCameras[0];
            this.camera = MeshBatcher.camera;
            this.cameraTransform = this.camera.gameObject.transform;
            this.particleDetailData = particleData.particleDetailData;
            this.materialData = particleData.materialData;
            this.localMatrix = new gd3d.math.matrix();

            var vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
            this.vertexArr = _shape.data.genVertexDataArray(vf);

            this.parseByData();
            if (this.meshBatcher.particleSystem.isTrail)
            {
                this.recordTrailMatrix();
            }
        }

        private recordTrailMatrix()
        {
            if (this.trailMatrix == undefined)
            {
                this.trailMatrix = gd3d.math.pool.new_matrix();
            }
            gd3d.math.matrixClone(this.meshBatcherWorldMatrix, this.trailMatrix);
        }


        public parseByData()
        {
            var p: ParticleDetailData = this.particleDetailData;
            this.lookatcam = p.isLookAtCamera;
            this.isloop = p.isLoop;
            this.gravityModifier = p.gravity.getValue();
            this.gravitySpeed = p.gravitySpeed.getValue();
            this.lifeTime = p.life.getValue();
            this.speed = p.speed.getValue();

            this._color_temp = gd3d.math.pool.new_vector4();
            this._color_temp.x = p.color.x.getValue();
            this._color_temp.y = p.color.y.getValue();
            this._color_temp.z = p.color.z.getValue();
            this.color = this._color_temp;

            this.velocity = gd3d.math.pool.clone_vector3(p.velocity.getValue());
            this.acceleration = gd3d.math.pool.clone_vector3(p.acceleration.getValue());
            this.angularVelocity = gd3d.math.pool.clone_vector3(p.angularVelocity.getValue());
            this.angularVelocityForBillboard = p.angleSpeedForbillboard.getValue();

            //生成粒子的中心位置
            this.centerPosition = gd3d.math.pool.clone_vector3(p.particleStartData.position);
            let randomDirection = gd3d.math.pool.clone_vector3(p.particleStartData.randomDirection);
            math.vec3Clone(randomDirection, this.speedDir);
            gd3d.math.vec3Normalize(this.speedDir, this.speedDir);
            math.vec3Clone(this.centerPosition, this.localTranslate);

            //本地坐标的随机点
            let randomPosition = gd3d.math.pool.clone_vector3(p.particleStartData.randomPosition);
            //获得本地坐标位置
            math.vec3Add(this.localTranslate, randomPosition, this.localTranslate);
            gd3d.math.pool.delete_vector3(randomPosition);

            this.delayTime = p.delayTime.getValue();
            math.vec3Clone(p.scale.getValue(), this.localScale);
            for (var i = 0; i < p.scaleNode.length; i++)
            {
                var v = p.scaleNode[i];
                var tscalenode: EffectScaleNode = new EffectScaleNode(v.key, v.getValue());
                this.addScaleNode(tscalenode);
            }


            for (var i = 0; i < p.colorNode.length; i++)
            {
                var v = p.colorNode[i];
                var tcolornode: EffectColorNode = new EffectColorNode(v.key, v.getValue());
                this.addColorNode(tcolornode);
            }

            this.alpha = p.alpha.getValue();
            for (var i = 0; i < p.alphaNode.length; i++) 
            {
                var vv = p.alphaNode[i].alpha.getValue();
                var talphanode: EffectAlphaNode = new EffectAlphaNode(p.alphaNode[i].key, vv);
                this.addAlphaNode(talphanode);
            }

            this.interpType = p.interpolationType;
            if (this.interpType == ParticleCurveType.LINEAR) 
            {
                this.curve = Curve3.GetLerpBezier(p.positionNode);
            } else 
            {
                if (p.positionNode.length == 2) 
                {
                    this.curve = gd3d.framework.Curve3.CreateQuadraticBezier(this.localTranslate, p.positionNode[0].getValue(), p.positionNode[1].getValue(), 20);
                }
                else if (p.positionNode.length == 3) 
                {
                    this.curve = gd3d.framework.Curve3.CreateCubicBezier(this.localTranslate, p.positionNode[0].getValue(), p.positionNode[1].getValue(), p.positionNode[2].getValue(), 20);
                }
            }

            this.bindAxis = p.bindAxis;
            this.bindx = p.bindx;
            this.bindy = p.bindy;
            this.bindz = p.bindz;

            this.infinite = p.infinite;
            this.renderModel = p.renderModel;
            this.isRotation = p.isRotation;

            this.meshBatcherWorldMatrix = this.particleSyTrans.getWorldMatrix();
            math.vec3Clone(p.startPitchYawRoll.getValue(), this.startPitchYawRoll);

            gd3d.math.quatFromEulerAngles(this.startPitchYawRoll.x, this.startPitchYawRoll.y, this.startPitchYawRoll.z, this.rotation_start);
            gd3d.math.quatNormalize(this.rotation_start, this.rotation_start);
            gd3d.math.quatClone(this.rotation_start, this.localRotation);

            if (this.renderModel == RenderModel.StretchedBillBoard)
            {
                var targetPos = new gd3d.math.vector3();
                var worldpos = new gd3d.math.vector3();
                var quatWorld = new gd3d.math.quaternion();
                var parentrot = new gd3d.math.quaternion();

                gd3d.math.matrixTransformVector3(this.localTranslate, this.meshBatcherWorldMatrix, worldpos);
                if (gd3d.math.vec3Length(this.speedDir) > 0)
                {
                    gd3d.math.vec3Add(worldpos, this.speedDir, targetPos);
                    gd3d.math.quat2Lookat(worldpos, targetPos, quatWorld);
                    var pRot = this.particleSyTrans.getWorldRotate();
                    gd3d.math.quatClone(pRot, parentrot);
                    gd3d.math.quatInverse(parentrot, parentrot);
                    gd3d.math.quatMultiply(parentrot, quatWorld, this.localRotation);
                    var initRot = new gd3d.math.quaternion();
                    gd3d.math.quatFromEulerAngles(90, 0, 0, initRot);
                    gd3d.math.quatMultiply(this.localRotation, initRot, this.localRotation);
                }

            }
            this.updaterot(0);

            gd3d.math.pool.delete_vector3(randomDirection);

            math.matrixMakeTransformRTS(this.localTranslate, this.localScale, this.localRotation, this.localMatrix);

            if (this.particleDetailData.particleMethodType == ParticleMethodType.UVROLL)
            {
                this.uvSpeed = gd3d.math.pool.clone_vector2(this.particleDetailData.uvRoll.uvSpeed.getValue());
                for (var i = 0; i < this.particleDetailData.uvRoll.uvSpeedNodes.length; i++)
                {
                    var uvspeed = this.particleDetailData.uvRoll.uvSpeedNodes[i];
                    var uvspednode: EffectUVSpeedNode = new EffectUVSpeedNode(uvspeed.key, uvspeed.getValue());
                    this.addUVSpeedNode(uvspednode);
                }
            }
            if (this.particleDetailData.particleMethodType == ParticleMethodType.UVSPRITE)
            {
                this.updateUVSpriteAnimation(0);//第一帧   序列帧动画展示
            }
            this.isinit = true;
        }

        private RotAngle: number = 0;
        private updaterot(delta: number)
        {
            var quatWorld = gd3d.math.pool.new_quaternion();
            var worldpos = gd3d.math.pool.new_vector3();
            var targetpos = gd3d.math.pool.new_vector3();
            var parentrot = gd3d.math.pool.new_quaternion();

            var lookRot = gd3d.math.pool.new_quaternion();
            var angleRot = gd3d.math.pool.new_quaternion();

            if (this.renderModel == RenderModel.Mesh)
            {
                if (this.lookatcam)
                {
                    gd3d.math.matrixTransformVector3(this.localTranslate, this.meshBatcherWorldMatrix, worldpos);
                    gd3d.math.vec3Clone(this.cameraTransform.getWorldTranslate(), targetpos);

                    gd3d.math.quatLookat(worldpos, targetpos, quatWorld);
                    var pRot = this.particleSyTrans.getWorldRotate();
                    gd3d.math.quatClone(pRot, parentrot);
                    gd3d.math.quatInverse(parentrot, parentrot);
                    gd3d.math.quatMultiply(parentrot, quatWorld, lookRot);

                    this.RotAngle += delta * this.angularVelocity.z;
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, this.RotAngle, angleRot);

                    gd3d.math.quatMultiply(lookRot, angleRot, this.localRotation);
                }
                else
                {
                    var Anglex = delta * this.angularVelocity.x;
                    var Angley = delta * this.angularVelocity.y;
                    var Anglez = delta * this.angularVelocity.z;
                    if (this.bindAxis)
                    {
                        if (this.bindx) Anglex = 0;
                        if (this.bindy) Angley = 0;
                        if (this.bindz) Anglez = 0;
                    }

                    gd3d.math.quatFromEulerAngles(Anglex, Angley, Anglez, angleRot);
                    gd3d.math.quatMultiply(this.localRotation, angleRot, this.localRotation);
                }
            }
            else
            {
                gd3d.math.matrixTransformVector3(this.localTranslate, this.meshBatcherWorldMatrix, worldpos);
                if (this.renderModel == RenderModel.BillBoard)
                {
                    gd3d.math.vec3Clone(this.cameraTransform.getWorldTranslate(), targetpos);
                    gd3d.math.quatLookat(worldpos, targetpos, quatWorld);
                }
                else if (this.renderModel == RenderModel.HorizontalBillBoard)
                {
                    // gd3d.math.vec3Add(worldpos, gd3d.math.pool.vector3_up, targetpos);
                    // gd3d.math.quatLookat(worldpos, targetpos, quatWorld);
                    quatWorld.x = -0.5;
                    quatWorld.y = 0.5;
                    quatWorld.z = 0.5;
                    quatWorld.w = 0.5;
                }
                else if (this.renderModel == RenderModel.VerticalBillBoard)
                {
                    gd3d.math.vec3Clone(this.cameraTransform.getWorldTranslate(), targetpos);
                    targetpos.y = worldpos.y;
                    gd3d.math.quatLookat(worldpos, targetpos, quatWorld);
                }
                else if (this.renderModel == RenderModel.StretchedBillBoard)
                {
                    gd3d.math.quatLookat(worldpos, this.cameraTransform.getWorldTranslate(), quatWorld);
                    var pRot = this.particleSyTrans.getWorldRotate();
                    gd3d.math.quatClone(pRot, parentrot);
                    gd3d.math.quatInverse(parentrot, parentrot);
                    gd3d.math.quatMultiply(parentrot, quatWorld, lookRot);

                    var inverRot = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatInverse(this.localRotation, inverRot);

                    gd3d.math.quatMultiply(inverRot, lookRot, lookRot);

                    var angle = gd3d.math.pool.new_vector3();
                    gd3d.math.quatToEulerAngles(lookRot, angle);
                    gd3d.math.quatFromEulerAngles(0, angle.y, 0, lookRot);
                    gd3d.math.quatMultiply(this.localRotation, lookRot, this.localRotation);

                    gd3d.math.pool.delete_vector3(worldpos);
                    gd3d.math.pool.delete_vector3(targetpos);
                    gd3d.math.pool.delete_quaternion(quatWorld);
                    gd3d.math.pool.delete_quaternion(parentrot);
                    gd3d.math.pool.delete_quaternion(angleRot);
                    gd3d.math.pool.delete_quaternion(lookRot);
                    return;
                }
                var pRot = this.particleSyTrans.getWorldRotate();
                gd3d.math.quatClone(pRot, parentrot);
                gd3d.math.quatInverse(parentrot, parentrot);
                gd3d.math.quatMultiply(parentrot, quatWorld, lookRot);

                this.RotAngle += delta * this.angularVelocityForBillboard;
                gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, this.RotAngle, angleRot);

                gd3d.math.quatMultiply(lookRot, angleRot, this.localRotation);
            }
            gd3d.math.pool.delete_vector3(worldpos);
            gd3d.math.pool.delete_vector3(targetpos);
            gd3d.math.pool.delete_quaternion(quatWorld);
            gd3d.math.pool.delete_quaternion(parentrot);
            gd3d.math.pool.delete_quaternion(angleRot);
            gd3d.math.pool.delete_quaternion(lookRot);


        }

        public updatematrix()
        {
            gd3d.math.matrixMakeTransformRTS(this.localTranslate, this.localScale, this.localRotation, this.localMatrix);
            //gd3d.math.matrixMultiply(this.meshBatcherWorldMatrix, this.localMatrix, this.worldMatrix);
        }

        public addUVSpeedNode(node: EffectUVSpeedNode)
        {
            this.listUvSpeedNode.push(node);
        }

        public resetMatrix()
        {
            gd3d.math.matrixZero(this.localMatrix);
            //gd3d.math.matrixZero(this.worldMatrix);
        }

        public addAlphaNode(node: EffectAlphaNode)
        {
            this.listAlphaNode.push(node);
        }

        public addColorNode(node: EffectColorNode)
        {
            this.listColorNode.push(node);
        }

        public addScaleNode(node: EffectScaleNode)
        {
            this.listScaleNode.push(node);
        }

        public updategravity(deltaTime: number)
        {
            this.gravitySpeed = this.gravitySpeed + this.gravityModifier * -9.8 * deltaTime;
            this.localTranslate.y += this.gravitySpeed * deltaTime;
        }

        private displacement: gd3d.math.vector3 = new gd3d.math.vector3();
        /**更新外力影响 */
        private updateForce(delta: number)
        {
            this.velocity.x = this.velocity.x + this.acceleration.x * delta;
            this.velocity.y = this.velocity.y + this.acceleration.y * delta;
            this.velocity.z = this.velocity.z + this.acceleration.z * delta;

            this.displacement.x = this.velocity.x * delta;
            this.displacement.y = this.velocity.y * delta;
            this.displacement.z = this.velocity.z * delta;
            math.vec3Add(this.localTranslate, this.displacement, this.localTranslate);
        }

        private _tempVec3 = new gd3d.math.vector3();
        public updateposition(deltaTime: number)
        {
            if (this.curve != null)
            {
                if (this.curve.beizerPoints.length > 0)
                {
                    if (this.lifeLocation >= (this.curve.bezierPointNum - this.curve.beizerPoints.length) / (this.curve.bezierPointNum))
                    {
                        gd3d.math.vec3Clone(this.curPosition, this.startPosition);
                        this.curPosition = this.curve.beizerPoints.shift();
                    }
                }

                ///大约计算值，非准确值，
                let subLife = this.lifeTime / this.curve.bezierPointNum;

                let curPosLocation = (this.curlifeTime % subLife) / subLife;
                gd3d.math.vec3SLerp(this.startPosition, this.curPosition, curPosLocation, this.localTranslate);
            }
            else
            {
                this.updategravity(deltaTime);
                this.updateForce(deltaTime);
                gd3d.math.vec3ScaleByNum(this.speedDir, this.speed, this._tempVec3);
                gd3d.math.vec3Add(this.localTranslate, this._tempVec3, this.localTranslate);
            }
        }

        public updatescale(deltaTime: number)
        {
            let index = 0;
            for (var i = 0; i < this.listScaleNode.length; i++)
            {
                if (this.listScaleNode[i].lifeLocation < this.lifeLocation)
                {
                    this.startScaleNode = this.listScaleNode[i];
                    index++;
                }
            }
            this.listScaleNode.splice(0, index);

            if (this.listScaleNode.length == 0) return;
            this.curScaleNode = this.listScaleNode[0];
            var duration = this.curScaleNode.lifeLocation - this.startScaleNode.lifeLocation;
            if (duration > 0)
            {
                gd3d.math.vec3SLerp(this.startScaleNode.keyScale, this.curScaleNode.keyScale, (this.lifeLocation - this.startScaleNode.lifeLocation) / duration, this._scale);
            }
            if (this.localScale.x < 0 || this.localScale.y < 0 || this.localScale.z < 0)
            {
                this.alive = false;
            }
        }

        curTextureOffset: gd3d.math.vector4 = new gd3d.math.vector4();
        //uv滚动
        private updateUV(deltaTime: number)
        {
            let index = 0;
            if (this.listUvSpeedNode.length != 0)
            {
                for (var i = 0; i < this.listUvSpeedNode.length; i++)
                {
                    if (this.listUvSpeedNode[i].lifelocation < this.lifeLocation)
                    {
                        this.startUVSpeedNode = this.listUvSpeedNode[i];
                        index++;
                    }
                }
                this.listUvSpeedNode.splice(0, index);

                if (this.listUvSpeedNode.length > 0)
                {
                    this.CurUVSpeedNode = this.listUvSpeedNode[0];
                    var duration = this.CurUVSpeedNode.lifelocation - this.startUVSpeedNode.lifelocation;
                    if (duration > 0)
                    {
                        gd3d.math.vec2SLerp(this.startUVSpeedNode.keyUVSpeed, this.CurUVSpeedNode.keyUVSpeed, (this.lifeLocation - this.startUVSpeedNode.lifelocation) % duration, this._uvSpeed);
                    }
                }
            }
            this.curTextureOffset.z -= deltaTime * this._uvSpeed.x;
            this.curTextureOffset.w -= deltaTime * this._uvSpeed.y;

            // this.meshBatcher._material.setVector4("_MainTex_ST", this.curTextureAtt);
        }
        //序列帧动画
        private updateUVSpriteAnimation(deltaTime: number)
        {
            var frameTime = 1.0 / (this.particleDetailData.uvSprite.frameOverLifeTime * this.particleDetailData.uvSprite.cycles);
            var frameIndex = Math.floor(this.lifeLocation / frameTime) + this.particleDetailData.uvSprite.startFrame;

            gd3d.math.spriteAnimation(this.particleDetailData.uvSprite.row, this.particleDetailData.uvSprite.column, frameIndex, this.curTextureOffset);
        }

        public updatecolor(deltaTime: number)
        {
            let index = 0;
            for (var i = 0; i < this.listColorNode.length; i++)
            {
                if (this.listColorNode[i].lifeLocation < this.lifeLocation)
                {
                    this.startColorNode = this.listColorNode[i];
                    index++;
                }
            }
            this.listColorNode.splice(0, index);
            if (this.listColorNode.length != 0)
            {
                this.curColorNode = this.listColorNode[0];
                var tempt = gd3d.math.pool.new_vector3();
                gd3d.math.vec3SLerp(this.startColorNode.keyColor, this.curColorNode.keyColor, (this.lifeLocation - this.startColorNode.lifeLocation) / (this.curColorNode.lifeLocation - this.startColorNode.lifeLocation), tempt);
                this._color.x = tempt.x;
                this._color.y = tempt.y;
                this._color.z = tempt.z;
                gd3d.math.pool.delete_vector3(tempt);
            }
            index = 0;
            for (var i = 0; i < this.listAlphaNode.length; i++)
            {
                if (this.listAlphaNode[i].lifeLocation < this.lifeLocation)
                {
                    this.startAlphaNode = this.listAlphaNode[i];
                    index++;
                }
            }
            this.listAlphaNode.splice(0, index);
            if (this.listAlphaNode.length == 0)
            {
                this._color.w = this._alpha;
                return;
            }
            this.curAlphaNode = this.listAlphaNode[0];
            this._alpha = (this.curAlphaNode.keyAlpha - this.startAlphaNode.keyAlpha) * (this.lifeLocation - this.startAlphaNode.lifeLocation) / (this.curAlphaNode.lifeLocation - this.startAlphaNode.lifeLocation) + this.startAlphaNode.keyAlpha;
            this._color.w = this._alpha;
        }

        public updatelifetime(deltaTime: number): boolean
        {
            if (!this.alive)
            {
                return this.alive;
            }

            this.curlifeTime += deltaTime;
            if (!this.infinite)
            {
                if (this.curlifeTime > this.lifeTime)
                {
                    this.alive = false;
                }
            }
            return this.alive;
        }

        public update(delta: number)
        {
            this.time += delta;
            if (this.time < this.delayTime) 
            {
                // console.log("延时时间：" + this.time);
                return;
            }

            if (!this.alive) return;
            if (!this.isinit)
            {//clear后parsedata了，这个因该不会再出现了。
                this.parseByData();//这也作为一帧
                //this.isinit = true;
            }
            else
            {
                if (!this.updatelifetime(delta))
                {
                    if (this.isloop)
                    {
                        this.clear();//clear之后应该回到第一帧，也就要parsebydata（）
                        this.parseByData();
                    }
                    else
                    {
                        //粒子死掉了，应该不再提少数据，待优化
                        this.resetMatrix();
                        // this.meshBatcher.parlist.splice(this.meshBatcher.parlist.indexOf(this), 1);
                    }
                }
                else
                {
                    this.updatescale(delta);
                    this.updatecolor(delta);
                    this.updateposition(delta);
                    this.updaterot(delta);
                    if (this.meshBatcher.particleSystem.particleMethodType == ParticleMethodType.UVROLL)
                    {
                        this.updateUV(delta);
                    }
                    else if (this.meshBatcher.particleSystem.particleMethodType == ParticleMethodType.UVSPRITE)
                    {
                        this.updateUVSpriteAnimation(delta);
                    }

                    this.updatematrix();
                }

            }

        }

        public clear()
        {
            //this.resetMatrix();
            this._alive = true;
            this.isinit = false;
            this.lookatcam = false;
            this.curlifeTime = 0;
            this.speed = 1;
            gd3d.math.pool.delete_vector2(this.uvSpeed);
            gd3d.math.pool.delete_vector2(this._uvSpeed_temp);
            gd3d.math.pool.delete_vector3(this._scale_temp);
            gd3d.math.pool.delete_vector4(this._color_temp);
            gd3d.math.pool.delete_vector3(this.velocity);
            gd3d.math.pool.delete_vector3(this.acceleration);
            gd3d.math.pool.delete_vector3(this.angularVelocity);
            // this.speedDir = new gd3d.math.vector3(0, 0, 0);
            this.speedDir.x = 0;
            this.speedDir.y = 0;
            this.speedDir.z = 0;
            this.localTranslate = new gd3d.math.vector3();
            this.centerPosition = new gd3d.math.vector3();
            // this.curTextureOffset = new gd3d.math.vector4(1.0, 1.0, 0, 0);
            this.curTextureOffset.x = 1.0;
            this.curTextureOffset.y = 1.0;
            this.curTextureOffset.z = 0.0;
            this.curTextureOffset.w = 0.0;

            this.color = new gd3d.math.vector4(1, 1, 1, 1);
            this.alpha = 1;
            this.listAlphaNode = new Array<EffectAlphaNode>();
            this.listScaleNode = new Array<EffectScaleNode>();
            this.listColorNode = new Array<EffectColorNode>();
            this.listUvSpeedNode = new Array<EffectUVSpeedNode>();
            this.localScale = new gd3d.math.vector3();
            this.gravityModifier = 0;
            this.gravitySpeed = 0;
        }
        public dispose()
        {
            this.vertexArr = null;
            gd3d.math.pool.delete_vector2(this.uvSpeed);
            gd3d.math.pool.delete_vector2(this._uvSpeed_temp);
            gd3d.math.pool.delete_vector3(this._scale_temp);
            gd3d.math.pool.delete_vector4(this._color_temp);
            gd3d.math.pool.delete_vector3(this.velocity);
            gd3d.math.pool.delete_vector3(this.acceleration);
            gd3d.math.pool.delete_vector3(this.angularVelocity);
            this.listAlphaNode.length = 0;
            this.listScaleNode.length = 0;
            this.listColorNode.length = 0;
            this.listUvSpeedNode.length = 0;
        }
    }

    export class EffectColorNode
    {
        lifeLocation: number;
        keyColor: gd3d.math.vector3;
        constructor(_location: number, _color: gd3d.math.vector3)
        {
            this.lifeLocation = _location;
            this.keyColor = _color;
        }
    }

    export class EffectScaleNode
    {
        lifeLocation: number;
        keyScale: gd3d.math.vector3;
        constructor(_location: number, _scale: gd3d.math.vector3)
        {
            this.lifeLocation = _location;
            this.keyScale = _scale;
        }
    }

    export class EffectAlphaNode
    {
        lifeLocation: number;
        keyAlpha: number;
        constructor(_location: number, _keyAlpha: number)
        {
            this.lifeLocation = _location;
            this.keyAlpha = _keyAlpha;
        }
    }

    export class EffectUVSpeedNode
    {
        lifelocation: number;
        keyUVSpeed: gd3d.math.vector2;
        constructor(_location: number, _uvSpeed: gd3d.math.vector2)
        {
            this.lifelocation = _location;
            this.keyUVSpeed = _uvSpeed;
        }
    }
}