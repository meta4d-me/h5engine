namespace gd3d.framework
{
    export interface ComponentMap { ParticleSystem: ParticleSystem }

    export interface GameObjectEventMap
    {
        /**
         * 粒子效果播放结束
         */
        particleCompleted: ParticleSystem;
    }

    /**
     * 粒子系统
     * 
     * @author feng3d
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class ParticleSystem implements IRenderer
    {
        static readonly ClassName: string = "particlesystem";

        __class__: "gd3d.framework.ParticleSystem";

        layer: RenderLayerEnum = RenderLayerEnum.Transparent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        //renderLayer: CullingMask = CullingMask.default;
        get renderLayer() { return this.gameObject.layer; }
        set renderLayer(layer: number)
        {
            this.gameObject.layer = layer;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number = 0;

        /**
         * Biases Particle System sorting amongst other transparencies.
         * 
         * Use lower (negative) numbers to prioritize the Particle System to draw closer to the front, and use higher numbers to prioritize other transparent objects.
         */
        sortingFudge = 0;

        /**
         * 参考Unity ParticleSystemRenderer.pivot
         * 
         * Modify the pivot point used for rotating particles.
         * 
         * The units are expressed as a multiplier of the particle sizes, relative to their diameters. For example, a value of 0.5 adjusts the pivot by the particle radius, allowing particles to rotate around their edges.
         */
        pivot = new math.vector3(0, 0, 0);

        get transform()
        {
            return this.gameObject && this.gameObject.transform;
        }

        /**
         * Is the particle system playing right now ?
         * 
         * 粒子系统正在运行吗?
         */
        get isPlaying()
        {
            return this._isPlaying;
        }
        private _isPlaying = false;

        /**
         * Is the particle system stopped right now ?
         * 
         * 粒子系统现在停止了吗?
         */
        get isStopped()
        {
            return !this._isPlaying && this.time == 0;
        }

        /**
         * Is the particle system paused right now ?
         * 
         * 粒子系统现在暂停了吗?
         */
        get isPaused()
        {
            return !this._isPlaying && this.time != 0;
        }

        /**
         * The current number of particles (Read Only).
         * 
         * 当前粒子数(只读)。
         */
        get particleCount()
        {
            return this._activeParticles.length;
        }

        /**
         * Playback position in seconds.
         * 
         * 回放位置(秒)
         */
        time = 0;

        get main() { return this._main; }
        set main(v)
        {
            ArrayUtil.replace(this._modules, this._main, v);
            v.particleSystem = this;
            this._main = v;
        }
        private _main: ParticleMainModule;

        get emission() { return this._emission; }
        set emission(v)
        {
            ArrayUtil.replace(this._modules, this._emission, v);
            v.particleSystem = this;
            this._emission = v;
        }
        private _emission: ParticleEmissionModule;

        get shape() { return this._shape; }
        set shape(v)
        {
            ArrayUtil.replace(this._modules, this._shape, v);
            v.particleSystem = this;
            this._shape = v;
        }
        private _shape: ParticleShapeModule;

        get velocityOverLifetime() { return this._velocityOverLifetime; }
        set velocityOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._velocityOverLifetime, v);
            v.particleSystem = this;
            this._velocityOverLifetime = v;
        }
        private _velocityOverLifetime: ParticleVelocityOverLifetimeModule;

        get limitVelocityOverLifetime() { return this._limitVelocityOverLifetime; }
        set limitVelocityOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._limitVelocityOverLifetime, v);
            v.particleSystem = this;
            this._limitVelocityOverLifetime = v;
        }
        private _limitVelocityOverLifetime: ParticleLimitVelocityOverLifetimeModule;

        /**
         * Script interface for the Particle System velocity inheritance module.
         * 
         * 粒子系统速度继承模块。
         */
        get inheritVelocity() { return this._inheritVelocity; }
        set inheritVelocity(v)
        {
            ArrayUtil.replace(this._modules, this._inheritVelocity, v);
            v.particleSystem = this;
            this._inheritVelocity = v;
        }
        private _inheritVelocity: ParticleInheritVelocityModule;

        get forceOverLifetime() { return this._forceOverLifetime; }
        set forceOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._forceOverLifetime, v);
            v.particleSystem = this;
            this._forceOverLifetime = v;
        }
        private _forceOverLifetime: ParticleForceOverLifetimeModule;

        get colorOverLifetime() { return this._colorOverLifetime; }
        set colorOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._colorOverLifetime, v);
            v.particleSystem = this;
            this._colorOverLifetime = v;
        }
        private _colorOverLifetime: ParticleColorOverLifetimeModule;

        /**
         * 颜色随速度变化模块。
         */
        get colorBySpeed() { return this._colorBySpeed; }
        set colorBySpeed(v)
        {
            ArrayUtil.replace(this._modules, this._colorBySpeed, v);
            v.particleSystem = this;
            this._colorBySpeed = v;
        }
        private _colorBySpeed: ParticleColorBySpeedModule;

        get sizeOverLifetime() { return this._sizeOverLifetime; }
        set sizeOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._sizeOverLifetime, v);
            v.particleSystem = this;
            this._sizeOverLifetime = v;
        }
        private _sizeOverLifetime: ParticleSizeOverLifetimeModule;

        /**
         * 缩放随速度变化模块
         */
        get sizeBySpeed() { return this._sizeBySpeed; }
        set sizeBySpeed(v)
        {
            ArrayUtil.replace(this._modules, this._sizeBySpeed, v);
            v.particleSystem = this;
            this._sizeBySpeed = v;
        }
        private _sizeBySpeed: ParticleSizeBySpeedModule;

        get rotationOverLifetime() { return this._rotationOverLifetime; }
        set rotationOverLifetime(v)
        {
            ArrayUtil.replace(this._modules, this._rotationOverLifetime, v);
            v.particleSystem = this;
            this._rotationOverLifetime = v;
        }
        private _rotationOverLifetime: ParticleRotationOverLifetimeModule;

        /**
         * 旋转角度随速度变化模块
         */
        get rotationBySpeed() { return this._rotationBySpeed; }
        set rotationBySpeed(v)
        {
            ArrayUtil.replace(this._modules, this._rotationBySpeed, v);
            v.particleSystem = this;
            this._rotationBySpeed = v;
        }
        private _rotationBySpeed: ParticleRotationBySpeedModule;

        /**
         * 旋转角度随速度变化模块
         */
        get noise() { return this._noise; }
        set noise(v)
        {
            ArrayUtil.replace(this._modules, this._noise, v);
            v.particleSystem = this;
            this._noise = v;
        }
        private _noise: ParticleNoiseModule;

        /**
         * 旋转角度随速度变化模块
         */
        get subEmitters() { return this._subEmitters; }
        set subEmitters(v)
        {
            ArrayUtil.replace(this._modules, this._subEmitters, v);
            v.particleSystem = this;
            this._subEmitters = v;
        }
        private _subEmitters: ParticleSubEmittersModule;

        /**
         * 粒子系统纹理表动画模块。
         */
        get textureSheetAnimation() { return this._textureSheetAnimation; }
        set textureSheetAnimation(v)
        {
            ArrayUtil.replace(this._modules, this._textureSheetAnimation, v);
            v.particleSystem = this;
            this._textureSheetAnimation = v;
        }
        private _textureSheetAnimation: ParticleTextureSheetAnimationModule;

        private _mesh: mesh;
        private _meshAABB: aabb;

        //本意mesh filter 可以弄一点 模型处理，比如lod
        //先直进直出吧
        /**
         * @private
         */
        @gd3d.reflect.Field("mesh")
        @gd3d.reflect.UIStyle("WidgetDragSelect")
        get mesh()
        {
            return this._mesh;
        }
        /**
        * @public
        * @language zh_CN
        * @param mesh 此组件的mesh
        * @classdesc
        * 设置mesh数据
        * @version gd3d 1.0
        */
        set mesh(mesh: mesh)
        {
            if (this._mesh != null)
            {
                this._mesh.unuse();
            }
            this._mesh = mesh;
            this._meshAABB = this._mesh.data.getAABB();
            if (this._mesh != null)
            {
                this._mesh.use();
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("material")
        material: material;

        get single() { return true; }

        /**
         * Start delay in seconds.
         * 启动延迟(以秒为单位)。在调用.play()时初始化值。
         */
        startDelay = 0;

        @gd3d.reflect.Field("ParticleSystemData")
        get particleSystemData()
        {
            return this._particleSystemData;
        }

        set particleSystemData(v)
        {
            var data = ParticleSystemData.get(v.value);
            if (data.objectData)
            {
                serialization.setValue(this, data.objectData);
            } else
            {
                data.particleSystem = this;
            }
            this._particleSystemData = data;
        }
        private _particleSystemData: ParticleSystemData;

        onPlay()
        {

        }

        start()
        {
            if (!this._mesh)
            {
                this._mesh = sceneMgr.app.getAssetMgr().getDefaultMesh(gd3d.framework.defMesh.quad);
                this._meshAABB = this._mesh.data.getAABB();
            }

            if (!this.material)
            {
                this.material = sceneMgr.app.getAssetMgr().getDefParticleSystemMat();
            }
        }

        remove()
        {
            console.warn(`未实现 ParticleSystem  remove`);
            // throw "未实现";
        }

        clone()
        {
            console.warn(`未实现 ParticleSystem  clone`);
            //throw "未实现";
        }

        gameObject: gameObject;

        constructor()
        {
            this.main = new ParticleMainModule();
            this.emission = new ParticleEmissionModule();
            this.shape = new ParticleShapeModule();
            this.velocityOverLifetime = new ParticleVelocityOverLifetimeModule();
            this.inheritVelocity = new ParticleInheritVelocityModule();
            this.forceOverLifetime = new ParticleForceOverLifetimeModule();
            this.limitVelocityOverLifetime = new ParticleLimitVelocityOverLifetimeModule();
            this.colorOverLifetime = new ParticleColorOverLifetimeModule();
            this.colorBySpeed = new ParticleColorBySpeedModule();
            this.sizeOverLifetime = new ParticleSizeOverLifetimeModule();
            this.sizeBySpeed = new ParticleSizeBySpeedModule();
            this.rotationOverLifetime = new ParticleRotationOverLifetimeModule();
            this.rotationBySpeed = new ParticleRotationBySpeedModule();
            this.noise = new ParticleNoiseModule();
            this.subEmitters = new ParticleSubEmittersModule();
            this.textureSheetAnimation = new ParticleTextureSheetAnimationModule();

            this.main.enabled = true;
            this.emission.enabled = true;
            this.shape.enabled = true;
        }

        update(interval: number)
        {
            if (!this.isPlaying) return;

            math.matrixClone(this.transform.getWorldMatrix(), this.localToWorldMatrix);
            math.matrixInverse(this.localToWorldMatrix, this.worldToLocalMatrix);

            var deltaTime = this.main.simulationSpeed * interval;
            this.time = this.time + deltaTime;

            var emitInfo = this._emitInfo;

            emitInfo.preTime = emitInfo.currentTime;
            emitInfo.currentTime = this.time - emitInfo.startDelay;
            emitInfo.preWorldPos.x = emitInfo.currentWorldPos.x;
            emitInfo.preWorldPos.y = emitInfo.currentWorldPos.y;
            emitInfo.preWorldPos.z = emitInfo.currentWorldPos.z;

            // 粒子系统位置
            math.matrixGetTranslation(this.localToWorldMatrix, emitInfo.currentWorldPos);

            // 粒子系统位移
            emitInfo.moveVec.x = emitInfo.currentWorldPos.x - emitInfo.preWorldPos.x;
            emitInfo.moveVec.y = emitInfo.currentWorldPos.y - emitInfo.preWorldPos.y;
            emitInfo.moveVec.z = emitInfo.currentWorldPos.z - emitInfo.preWorldPos.z;
            // 粒子系统速度
            emitInfo.speed.x = emitInfo.moveVec.x / deltaTime;
            emitInfo.speed.y = emitInfo.moveVec.y / deltaTime;
            emitInfo.speed.z = emitInfo.moveVec.z / deltaTime;

            this._updateActiveParticlesState(deltaTime);

            // 完成一个循环
            if (this.main.loop && Math.floor(emitInfo.preTime / this.main.duration) < Math.floor(emitInfo.currentTime / this.main.duration))
            {
                // 重新计算喷发概率
                this.emission.bursts.forEach(element =>
                {
                    element.calculateProbability();
                });
                // this.dispatch("particleCycled", this);
            }

            // 发射粒子
            if (!this._isSubParticleSystem) // 子粒子系统自身不会自动发射粒子
            {
                var emits = this._emit(emitInfo);

                emits.sort((a, b) => { return a.time - b.time });
                emits.forEach(v =>
                {
                    this._emitParticles(v);
                });
            }

            // 判断非循环的效果是否播放结束
            if (!this.main.loop && this._activeParticles.length == 0 && emitInfo.currentTime > this.main.duration)
            {
                this.stop();
                // this.dispatch("particleCompleted", this);
            }
        }

        /**
         * 停止
         */
        stop()
        {
            this._isPlaying = false;
            this.time = 0;

            this._particlePool = this._particlePool.concat(this._activeParticles);
            this._activeParticles.length = 0;
        }

        /**
         * 播放
         */
        play()
        {
            this._isPlaying = true;
            this.time = 0;

            this._particlePool = this._particlePool.concat(this._activeParticles);
            this._activeParticles.length = 0;

            var startDelay = this.main.startDelay.getValue(Math.random());

            this._emitInfo =
            {
                preTime: -startDelay,
                currentTime: -startDelay,
                preWorldPos: new math.vector3(),
                currentWorldPos: new math.vector3(),
                rateAtDuration: 0,
                _leftRateOverDistance: 0,
                _isRateOverDistance: false,
                startDelay: startDelay,
                moveVec: new math.vector3(),
                speed: new math.vector3(),
                position: new math.vector3(),
            };

            // 重新计算喷发概率
            this.emission.bursts.forEach(element =>
            {
                element.calculateProbability();
            });
        }

        /**
         * 暂停
         */
        pause()
        {
            this._isPlaying = false;
        }

        /**
         * 继续
         */
        continue()
        {
            if (this.time == 0)
            {
                this.play();
            } else
            {
                this._isPlaying = true;
                this._emitInfo.preTime = Math.max(0, this._emitInfo.currentTime);
            }
        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            math.matrixClone(this.transform.getWorldMatrix(), this.localToWorldMatrix);
            math.matrixInverse(this.localToWorldMatrix, this.worldToLocalMatrix);

            if (!this._awaked)
            {
                if (this.main.playOnAwake && !this._isPlaying)
                {
                    this.play();
                }
                this._awaked = true;
            }

            if (this.particleCount < 1) return;

            DrawCallInfo.inc.currentState = DrawCallEnum.EffectSystem;
            let go = this.gameObject;
            let tran = go.transform;

            context.updateLightMask(go.layer);
            context.updateModel(tran);
            if (!this.material) return;
            let mesh = this.mesh;
            if (mesh == null || mesh.glMesh == null || mesh.submesh == null) return;
            let subMeshs = mesh.submesh;
            if (subMeshs == null) return;

            mesh.glMesh.bindVboBuffer(context.webgl);

            // 获取批量渲染扩展
            var isSupportDrawInstancedArrays = !!context.webgl.drawArraysInstanced;
            // isSupportDrawInstancedArrays = false;

            // 计算公告牌矩阵
            var isbillboard = !this.shape.alignToDirection && this.mesh == sceneMgr.app.getAssetMgr().getDefaultMesh(gd3d.framework.defMesh.quad);
            var billboardMatrix = new math.matrix();
            if (isbillboard)
            {
                //
                var cameraForward = new math.vector3();
                var cameraUp = new math.vector3();
                camera.gameObject.transform.getForwardInWorld(cameraForward);
                camera.gameObject.transform.getUpInWorld(cameraUp);
                if (this.main.simulationSpace == ParticleSystemSimulationSpace.Local)
                {
                    math.matrixTransformNormal(cameraForward, this.worldToLocalMatrix, cameraForward);
                    math.matrixTransformNormal(cameraUp, this.worldToLocalMatrix, cameraUp);
                }

                math.matrixLookat(new math.vector3(), cameraForward, cameraUp, billboardMatrix);
            }

            this.material.setMatrix("u_particle_billboardMatrix", billboardMatrix);

            // 计算中心点偏移
            var pivotOffset = new math.vector4(
                this.pivot.x * (this._meshAABB.maximum.x - this._meshAABB.minimum.x),
                -this.pivot.z * (this._meshAABB.maximum.y - this._meshAABB.minimum.y),
                this.pivot.y * (this._meshAABB.maximum.z - this._meshAABB.minimum.z),
                0
            );
            this.material.setVector4("u_particle_pivotOffset", pivotOffset);

            if (this.main.simulationSpace == ParticleSystemSimulationSpace.World)
            {
                gd3d.math.matrixClone(context.matrixViewProject, context.matrixModelViewProject);
            }
            if (!isSupportDrawInstancedArrays)
            {
                for (let i = 0, n = this._activeParticles.length; i < n; i++)
                {
                    var particle = this._activeParticles[i];

                    this.material.setVector4("a_particle_position", new math.vector4(particle.position.x, particle.position.y, particle.position.z, 1));
                    this.material.setVector4("a_particle_scale", new math.vector4(particle.size.x, particle.size.y, particle.size.z, 1));
                    this.material.setVector4("a_particle_rotation", new math.vector4(particle.rotation.x, particle.rotation.y, (isbillboard ? -1 : 1) * particle.rotation.z, 1));
                    this.material.setVector4("a_particle_color", new math.vector4(particle.color.r, particle.color.g, particle.color.b, particle.color.a));
                    this.material.setVector4("a_particle_tilingOffset", new math.vector4(particle.tilingOffset.x, particle.tilingOffset.y, particle.tilingOffset.z, particle.tilingOffset.w));
                    this.material.setVector4("a_particle_flipUV", new math.vector4(particle.flipUV.x, particle.flipUV.y, 0, 0));

                    this.material.draw(context, mesh, subMeshs[0]);
                }
            } else
            {
                var data: number[] = [];
                for (let i = 0, n = this._activeParticles.length; i < n; i++)
                {
                    var particle = this._activeParticles[i];

                    data.push(
                        particle.position.x, particle.position.y, particle.position.z, 1,
                        particle.size.x, particle.size.y, particle.size.z, 1,
                        particle.rotation.x, particle.rotation.y, (isbillboard ? -1 : 1) * particle.rotation.z, 1,
                        particle.color.r, particle.color.g, particle.color.b, particle.color.a,
                        particle.tilingOffset.x, particle.tilingOffset.y, particle.tilingOffset.z, particle.tilingOffset.w,
                        particle.flipUV.x, particle.flipUV.y, 0, 0,
                    );

                }

                var stride = this._attributes.reduce((pv, cv) => pv += cv[1], 0) * 4;
                if (isSupportDrawInstancedArrays && this.particleCount > 0)
                {
                    var vbo = this._getVBO(context.webgl);

                    var drawInstanceInfo: DrawInstanceInfo = {
                        instanceCount: this.particleCount,
                        initBuffer: (gl) =>
                        {
                            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                        },
                        activeAttributes: (gl, pass) =>
                        {
                            let program = pass.program.program;
                            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

                            var offset = 0;
                            this._attributes.forEach(element =>
                            {
                                var location = gl.getAttribLocation(program, element[0]);
                                if (location == -1) return;

                                gl.enableVertexAttribArray(location);
                                gl.vertexAttribPointer(location, element[1], gl.FLOAT, false, stride, offset);
                                gl.vertexAttribDivisor(location, 1);
                                offset += element[1] * 4;

                            });
                        },
                        disableAttributes: (gl, pass) =>
                        {
                            let program = pass.program.program;
                            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

                            this._attributes.forEach(element =>
                            {
                                var location = gl.getAttribLocation(program, element[0]);
                                if (location == -1) return;

                                gl.vertexAttribDivisor(location, 0);
                                gl.disableVertexAttribArray(location);
                            });
                        },
                    };

                    let drawtype = meshRenderer.instanceDrawType(context);
                    this.material.draw(context, mesh, subMeshs[0], drawtype, drawInstanceInfo);
                }
            }
        }

        private _vbos: [WebGLRenderingContext, WebGLBuffer][] = [];
        private _getVBO(gl: WebGLRenderingContext)
        {
            for (let i = 0, n = this._vbos.length; i < n; i++)
            {
                if (this._vbos[i][0] == gl)
                    return this._vbos[i][1];
            }
            var vbo = gl.createBuffer();
            this._vbos.push([gl, vbo]);
            return vbo;
        }

        private _attributes: [string, number][] = [
            ["a_particle_position", 4],
            ["a_particle_scale", 4],
            ["a_particle_rotation", 4],
            ["a_particle_color", 4],
            ["a_particle_tilingOffset", 4],
            ["a_particle_flipUV", 4],
        ];

        private _awaked = false;

        /**
         * 粒子池，用于存放未发射或者死亡粒子
         */
        private _particlePool: Particle1[] = [];
        /**
         * 活跃的粒子列表
         */
        private _activeParticles: Particle1[] = [];

        private readonly _modules: ParticleModule[] = [];

        /**
         * 发射粒子
         * 
         * @param startTime 发射起始时间
         * @param endTime 发射终止时间
         * @param startPos 发射起始位置
         * @param stopPos 发射终止位置
         */
        private _emit(emitInfo: ParticleSystemEmitInfo)
        {
            // 
            var emits: { time: number, num: number, position: math.vector3, emitInfo: ParticleSystemEmitInfo }[] = [];

            var startTime = emitInfo.preTime;
            var endTime = emitInfo.currentTime;

            if (!this.emission.enabled) return emits;

            // 判断是否开始发射
            if (endTime <= 0) return emits;

            var loop = this.main.loop;
            var duration = this.main.duration;

            // 判断是否结束发射
            if (!loop && startTime >= duration) return emits;

            // 计算最后发射时间
            if (!loop) endTime = Math.min(endTime, duration);

            // 计算此处在发射周期的位置
            var rateAtDuration = (endTime % duration) / duration;
            if (rateAtDuration == 0 && endTime >= duration) rateAtDuration = 1;

            emitInfo.rateAtDuration = rateAtDuration;

            // 处理移动发射粒子
            var moveEmits = this._emitWithMove(emitInfo);
            emits = emits.concat(moveEmits);

            // 单粒子发射周期
            var timeEmits = this._emitWithTime(emitInfo, duration);
            emits = emits.concat(timeEmits);

            return emits;
        }

        /**
         * 计算在指定移动的位移线段中发射的粒子列表。
         * 
         * @param rateAtDuration 
         * @param prePos 
         * @param currentPos 
         */
        private _emitWithMove(emitInfo: ParticleSystemEmitInfo)
        {
            var emits: { time: number; num: number; position: math.vector3; emitInfo: ParticleSystemEmitInfo; }[] = [];
            if (this.main.simulationSpace == ParticleSystemSimulationSpace.World)
            {
                if (emitInfo._isRateOverDistance)
                {
                    var moveVec = new math.vector3();
                    moveVec.x = emitInfo.currentWorldPos.x - emitInfo.preWorldPos.x;
                    moveVec.y = emitInfo.currentWorldPos.y - emitInfo.preWorldPos.y;
                    moveVec.z = emitInfo.currentWorldPos.z - emitInfo.preWorldPos.z;
                    var moveDistance = math.vec3Length(moveVec);
                    var worldPos = emitInfo.currentWorldPos;
                    // 本次移动距离
                    if (moveDistance > 0)
                    {
                        // 移动方向
                        var moveDir = new math.vector3(moveVec.x, moveVec.y, moveVec.z);
                        math.vec3Normalize(moveDir, moveDir);

                        // 剩余移动量
                        var leftRateOverDistance = emitInfo._leftRateOverDistance + moveDistance;
                        // 发射频率
                        var rateOverDistance = this.emission.rateOverDistance.getValue(emitInfo.rateAtDuration);
                        // 发射间隔距离
                        var invRateOverDistance = 1 / rateOverDistance;
                        // 发射间隔位移
                        var invRateOverDistanceVec = new math.vector3(
                            moveDir.x / rateOverDistance,
                            moveDir.y / rateOverDistance,
                            moveDir.z / rateOverDistance,
                        );
                        // 上次发射位置
                        var lastRateOverDistance = new math.vector3(
                            emitInfo.preWorldPos.x - moveDir.x * emitInfo._leftRateOverDistance,
                            emitInfo.preWorldPos.y - moveDir.y * emitInfo._leftRateOverDistance,
                            emitInfo.preWorldPos.z - moveDir.z * emitInfo._leftRateOverDistance,
                        );

                        while (invRateOverDistance < leftRateOverDistance)
                        {
                            lastRateOverDistance.x += invRateOverDistanceVec.x;
                            lastRateOverDistance.y += invRateOverDistanceVec.y;
                            lastRateOverDistance.z += invRateOverDistanceVec.z;

                            emits.push({
                                position: new math.vector3(
                                    lastRateOverDistance.x - worldPos.x,
                                    lastRateOverDistance.y - worldPos.y,
                                    lastRateOverDistance.z - worldPos.z,
                                ),
                                time: emitInfo.preTime + (emitInfo.currentTime - emitInfo.preTime) * (1 - leftRateOverDistance / moveDistance),
                                num: 1,
                                emitInfo: emitInfo
                            });
                            leftRateOverDistance -= invRateOverDistance;
                        }
                        emitInfo._leftRateOverDistance = leftRateOverDistance;
                    }
                }
                emitInfo._isRateOverDistance = true;
            }
            else
            {
                emitInfo._isRateOverDistance = false;
                emitInfo._leftRateOverDistance = 0;
            }
            return emits;
        }

        /**
         * 计算在指定时间段内发射的粒子列表
         * 
         * @param rateAtDuration 
         * @param preRealTime 
         * @param duration 
         * @param realEmitTime 
         */
        private _emitWithTime(emitInfo: ParticleSystemEmitInfo, duration: number)
        {
            var rateAtDuration = emitInfo.rateAtDuration;
            var preTime = emitInfo.preTime;
            var currentTime = emitInfo.currentTime;

            var emits: { time: number; num: number; position: math.vector3; emitInfo: ParticleSystemEmitInfo }[] = [];

            var step = 1 / this.emission.rateOverTime.getValue(rateAtDuration);
            var bursts = this.emission.bursts;
            // 遍历所有发射周期
            var cycleStartIndex = Math.floor(preTime / duration);
            var cycleEndIndex = Math.ceil(currentTime / duration);
            for (let k = cycleStartIndex; k < cycleEndIndex; k++)
            {
                var cycleStartTime = k * duration;
                var cycleEndTime = (k + 1) * duration;
                // 单个周期内的起始与结束时间
                var startTime = Math.max(preTime, cycleStartTime);
                var endTime = Math.min(currentTime, cycleEndTime);
                // 处理稳定发射
                var singleStart = Math.ceil(startTime / step) * step;
                for (var i = singleStart; i < endTime; i += step)
                {
                    emits.push({ time: i, num: 1, emitInfo: emitInfo, position: new math.vector3(emitInfo.position.x, emitInfo.position.y, emitInfo.position.z) });
                }
                // 处理喷发
                var inCycleStart = startTime - cycleStartTime;
                var inCycleEnd = endTime - cycleStartTime;
                for (let i = 0; i < bursts.length; i++)
                {
                    const burst = bursts[i];
                    if (burst.isProbability && inCycleStart <= burst.time && burst.time < inCycleEnd)
                    {
                        emits.push({ time: cycleStartTime + burst.time, num: burst.count.getValue(rateAtDuration), emitInfo: emitInfo, position: new math.vector3(emitInfo.position.x, emitInfo.position.y, emitInfo.position.z) });
                    }
                }
            }
            return emits;
        }

        /**
         * 发射粒子
         * @param birthTime 发射时间
         * @param num 发射数量
         */
        private _emitParticles(v: { time: number; num: number; position: math.vector3; emitInfo: ParticleSystemEmitInfo })
        {
            var num = v.num;
            var birthTime = v.time;
            var position = v.position;
            var emitInfo = v.emitInfo;
            for (let i = 0; i < num; i++)
            {
                if (this._activeParticles.length >= this.main.maxParticles) return;
                var lifetime = this.main.startLifetime.getValue(emitInfo.rateAtDuration);
                var birthRateAtDuration = (birthTime - emitInfo.startDelay) / this.main.duration;
                var rateAtLifeTime = (emitInfo.currentTime - birthTime) / lifetime;

                if (rateAtLifeTime < 1)
                {
                    var particle = this._particlePool.pop() || new Particle1();
                    particle.cache = {};
                    particle.position = new math.vector3(position.x, position.y, position.z);
                    particle.birthTime = birthTime;
                    particle.lifetime = lifetime;
                    particle.rateAtLifeTime = rateAtLifeTime;
                    //
                    particle.birthRateAtDuration = birthRateAtDuration - Math.floor(birthRateAtDuration);
                    //
                    particle.preTime = emitInfo.currentTime;
                    particle.curTime = emitInfo.currentTime;
                    particle.prePosition = new math.vector3(position.x, position.y, position.z);
                    particle.curPosition = new math.vector3(position.x, position.y, position.z);

                    //
                    this._activeParticles.push(particle);
                    this._initParticleState(particle);
                    this._updateParticleState(particle, 0);
                }
            }
        }

        /**
         * 更新活跃粒子状态
         */
        private _updateActiveParticlesState(deltaTime: number)
        {
            for (let i = this._activeParticles.length - 1; i >= 0; i--)
            {
                var particle = this._activeParticles[i];

                particle.rateAtLifeTime = (particle.curTime + deltaTime - particle.birthTime) / particle.lifetime;
                if (particle.rateAtLifeTime < 0 || particle.rateAtLifeTime > 1)
                {
                    this._activeParticles.splice(i, 1);
                    this._particlePool.push(particle);
                    particle.subEmitInfo = null;
                } else
                {
                    this._updateParticleState(particle, deltaTime);
                }
            }
        }

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        private _initParticleState(particle: Particle1)
        {
            this._modules.forEach(v => { v.initParticleState(particle) });
        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        private _updateParticleState(particle: Particle1, deltaTime: number)
        {
            //
            this._modules.forEach(v => { v.updateParticleState(particle) });
            particle.updateState(particle.curTime + deltaTime);
        }

        _simulationSpaceChanged()
        {
            if (!this.transform) return;
            if (this._activeParticles.length == 0) return;

            if (this._main.simulationSpace == ParticleSystemSimulationSpace.Local)
            {
                var worldToLocalMatrix = this.worldToLocalMatrix;
                this._activeParticles.forEach(p =>
                {
                    math.matrixTransformVector3(p.position, worldToLocalMatrix, p.position);
                    math.matrixTransformNormal(p.velocity, worldToLocalMatrix, p.velocity);
                    math.matrixTransformNormal(p.acceleration, worldToLocalMatrix, p.acceleration);
                });
            } else
            {
                var localToWorldMatrix = this.localToWorldMatrix;
                this._activeParticles.forEach(p =>
                {
                    math.matrixTransformVector3(p.position, localToWorldMatrix, p.position);
                    math.matrixTransformNormal(p.velocity, localToWorldMatrix, p.velocity);
                    math.matrixTransformNormal(p.acceleration, localToWorldMatrix, p.acceleration);
                });
            }
        }

        /**
         * 给指定粒子添加指定空间的位移。
         * 
         * @param particle 粒子。
         * @param position 速度。
         * @param space 速度所在空间。
         * @param name  速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticlePosition(particle: Particle1, position: math.vector3, space: ParticleSystemSimulationSpace, name?: string)
        {
            if (name != undefined)
            {
                this.removeParticleVelocity(particle, name);
                particle.cache[name] = { value: new math.vector3(position.x, position.y, position.z), space: space };
            }

            if (space != this.main.simulationSpace)
            {
                if (space == ParticleSystemSimulationSpace.World)
                {
                    math.matrixTransformVector3(position, this.worldToLocalMatrix, position);
                } else
                {
                    math.matrixTransformVector3(position, this.localToWorldMatrix, position);
                }
            }
            //
            particle.position.x += position.x;
            particle.position.y += position.y;
            particle.position.z += position.z;
        }

        /**
         * 移除指定粒子上的位移
         * 
         * @param particle 粒子。
         * @param name 位移名称。
         */
        removeParticlePosition(particle: Particle1, name: string)
        {
            var obj: { value: math.vector3, space: ParticleSystemSimulationSpace } = particle.cache[name];
            if (obj)
            {
                delete particle.cache[name];

                var space = obj.space;
                var value = obj.value;
                if (space != this.main.simulationSpace)
                {
                    if (space == ParticleSystemSimulationSpace.World)
                    {
                        math.matrixTransformVector3(value, this.worldToLocalMatrix, value);
                    } else
                    {
                        math.matrixTransformVector3(value, this.localToWorldMatrix, value);
                    }
                }
                //
                particle.position.x -= value.x;
                particle.position.y -= value.y;
                particle.position.z -= value.z;
            }
        }

        /**
         * 给指定粒子添加指定空间的速度。
         * 
         * @param particle 粒子。
         * @param velocity 速度。
         * @param space 速度所在空间。
         * @param name  速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticleVelocity(particle: Particle1, velocity: math.vector3, space: ParticleSystemSimulationSpace, name?: string)
        {
            if (name != undefined)
            {
                this.removeParticleVelocity(particle, name);
                particle.cache[name] = { value: new math.vector3(velocity.x, velocity.y, velocity.z), space: space };
            }

            if (space != this.main.simulationSpace)
            {
                if (space == ParticleSystemSimulationSpace.World)
                {
                    math.matrixTransformNormal(velocity, this.worldToLocalMatrix, velocity);
                } else
                {
                    math.matrixTransformNormal(velocity, this.localToWorldMatrix, velocity);
                }
            }
            //
            particle.velocity.x += velocity.x;
            particle.velocity.y += velocity.y;
            particle.velocity.z += velocity.z;
        }

        /**
         * 移除指定粒子上的速度
         * 
         * @param particle 粒子。
         * @param name 速度名称。
         */
        removeParticleVelocity(particle: Particle1, name: string)
        {
            var obj: { value: math.vector3, space: ParticleSystemSimulationSpace } = particle.cache[name];
            if (obj)
            {
                delete particle.cache[name];

                var space = obj.space;
                var value = obj.value;
                if (space != this.main.simulationSpace)
                {
                    if (space == ParticleSystemSimulationSpace.World)
                    {
                        math.matrixTransformNormal(value, this.worldToLocalMatrix, value);
                    } else
                    {
                        math.matrixTransformNormal(value, this.localToWorldMatrix, value);
                    }
                }
                //
                particle.velocity.x -= value.x;
                particle.velocity.y -= value.y;
                particle.velocity.z -= value.z;
            }
        }

        /**
         * 给指定粒子添加指定空间的速度。
         * 
         * @param particle 粒子。
         * @param acceleration 加速度。
         * @param space 加速度所在空间。
         * @param name  加速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticleAcceleration(particle: Particle1, acceleration: math.vector3, space: ParticleSystemSimulationSpace, name?: string)
        {
            if (name != undefined)
            {
                this.removeParticleAcceleration(particle, name);
                particle.cache[name] = { value: new math.vector3(acceleration.x, acceleration.y, acceleration.z), space: space };
            }

            if (space != this.main.simulationSpace)
            {
                if (space == ParticleSystemSimulationSpace.World)
                {
                    math.matrixTransformNormal(acceleration, this.worldToLocalMatrix, acceleration);
                } else
                {
                    math.matrixTransformNormal(acceleration, this.localToWorldMatrix, acceleration);
                }
            }
            //
            particle.acceleration.x += acceleration.x;
            particle.acceleration.y += acceleration.y;
            particle.acceleration.z += acceleration.z;
        }

        /**
         * 移除指定粒子上的加速度
         * 
         * @param particle 粒子。
         * @param name 加速度名称。
         */
        removeParticleAcceleration(particle: Particle1, name: string)
        {
            var obj: { value: math.vector3, space: ParticleSystemSimulationSpace } = particle.cache[name];
            if (obj)
            {
                delete particle.cache[name];

                var space = obj.space;
                var value = obj.value;
                if (space != this.main.simulationSpace)
                {
                    if (space == ParticleSystemSimulationSpace.World)
                    {
                        math.matrixTransformNormal(value, this.worldToLocalMatrix, value);
                    } else
                    {
                        math.matrixTransformNormal(value, this.localToWorldMatrix, value);
                    }
                }
                //
                particle.acceleration.x -= value.x;
                particle.acceleration.y -= value.y;
                particle.acceleration.z -= value.z;
            }
        }

        /**
         * 触发子发射器
         * 
         * @param subEmitterIndex 子发射器索引
         */
        TriggerSubEmitter(subEmitterIndex: number, particles: Particle1[] = null)
        {
            if (!this.subEmitters.enabled) return;

            var subEmitter = this.subEmitters.GetSubEmitterSystem(subEmitterIndex);
            if (!subEmitter) return;

            // if (!subEmitter.enabled) return;

            var probability = this.subEmitters.GetSubEmitterEmitProbability(subEmitterIndex);
            this.subEmitters.GetSubEmitterProperties(subEmitterIndex);
            this.subEmitters.GetSubEmitterType(subEmitterIndex);

            particles = particles || this._activeParticles;

            var emits: {
                time: number;
                num: number;
                position: math.vector3;
                emitInfo: ParticleSystemEmitInfo;
            }[] = [];

            particles.forEach(particle =>
            {
                if (Math.random() > probability) return;

                // 粒子所在世界坐标
                var particleWoldPos = new math.vector3(particle.position.x, particle.position.y, particle.position.z);
                math.matrixTransformVector3(particleWoldPos, this.localToWorldMatrix, particleWoldPos);

                // 粒子在子粒子系统的坐标
                var subEmitPos = new math.vector3(particleWoldPos.x, particleWoldPos.y, particleWoldPos.z);
                math.matrixTransformVector3(subEmitPos, subEmitter.worldToLocalMatrix, subEmitPos);

                if (!particle.subEmitInfo)
                {
                    var startDelay = this.main.startDelay.getValue(Math.random());
                    particle.subEmitInfo = {
                        preTime: particle.preTime - particle.birthTime - startDelay,
                        currentTime: particle.preTime - particle.birthTime - startDelay,
                        preWorldPos: new math.vector3(particleWoldPos.x, particleWoldPos.y, particleWoldPos.z),
                        currentWorldPos: new math.vector3(particleWoldPos.x, particleWoldPos.y, particleWoldPos.z),
                        rateAtDuration: 0,
                        _leftRateOverDistance: 0,
                        _isRateOverDistance: false,
                        startDelay: startDelay,
                        moveVec: new math.vector3(),
                        speed: new math.vector3(),
                        position: subEmitPos,
                    };
                } else
                {
                    particle.subEmitInfo.preTime = particle.preTime - particle.birthTime - particle.subEmitInfo.startDelay;
                    particle.subEmitInfo.currentTime = particle.curTime - particle.birthTime - particle.subEmitInfo.startDelay;

                    particle.subEmitInfo.position.x = subEmitPos.x;
                    particle.subEmitInfo.position.y = subEmitPos.y;
                    particle.subEmitInfo.position.z = subEmitPos.z;
                }

                var subEmits = subEmitter._emit(particle.subEmitInfo);

                emits = emits.concat(subEmits);
            });

            emits.sort((a, b) => { return a.time - b.time });
            emits.forEach(v =>
            {
                subEmitter._emitParticles(v);
            });
        }

        /**
         * 上次移动发射的位置
         */
        private _preworldPos = new math.vector3();
        private _isRateOverDistance = false;
        private _leftRateOverDistance = 0;
        //
        worldPos = new math.vector3();
        moveVec = new math.vector3();
        speed = new math.vector3();

        /**
         * 是否为被上级粒子系统引用的子粒子系统。
         */
        _isSubParticleSystem = false;

        /**
         * 发射信息
         */
        _emitInfo: ParticleSystemEmitInfo;

        //
        localToWorldMatrix = new math.matrix();
        worldToLocalMatrix = new math.matrix();
    }


    /**
     * 粒子系统发射器状态信息
     */
    export interface ParticleSystemEmitInfo
    {
        /**
         * 上次粒子系统时间
         */
        preTime: number;

        /**
         * 当前粒子系统时间
         */
        currentTime: number;

        /**
         * 上次世界坐标
         */
        preWorldPos: math.vector3;

        /**
         * 当前世界坐标
         */
        currentWorldPos: math.vector3;

        /**
         * 发射器本地位置
         */
        position: math.vector3;

        /**
         * Start delay in seconds.
         * 启动延迟(以秒为单位)。在调用.play()时初始化值。
         */
        startDelay: number;

        /**
         * 此次位移
         */
        moveVec: math.vector3;

        /**
         * 当前移动速度
         */
        speed: math.vector3;

        /**
         * 此时在发射周期的位置
         */
        rateAtDuration: number;

        /**
         * 用于处理移动发射的剩余移动距离。
         */
        _leftRateOverDistance: number;

        /**
         * 是否已经执行位移发射。
         */
        _isRateOverDistance: boolean;
    }
}