/// <reference path="event/EventDispatcher.ts" />

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
    export class ParticleSystem extends EventDispatcher implements IRenderer
    {
        static readonly ClassName: string = "ParticleSystem";

        __class__: "gd3d.framework.ParticleSystem" = "gd3d.framework.ParticleSystem";

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

        get transform()
        {
            return this.gameObject.transform;
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
            if (this._main)
            {
                watcher.unwatch(this._main, "simulationSpace", this._simulationSpaceChanged, this);
            }
            Array.replace(this._modules, this._main, v);
            v.particleSystem = this;
            this._main = v;
            watcher.watch(this._main, "simulationSpace", this._simulationSpaceChanged, this);
        }
        private _main: ParticleMainModule;

        get emission() { return this._emission; }
        set emission(v)
        {
            Array.replace(this._modules, this._emission, v);
            v.particleSystem = this;
            this._emission = v;
        }
        private _emission: ParticleEmissionModule;

        get shape() { return this._shape; }
        set shape(v)
        {
            Array.replace(this._modules, this._shape, v);
            v.particleSystem = this;
            this._shape = v;
        }
        private _shape: ParticleShapeModule;

        get velocityOverLifetime() { return this._velocityOverLifetime; }
        set velocityOverLifetime(v)
        {
            Array.replace(this._modules, this._velocityOverLifetime, v);
            v.particleSystem = this;
            this._velocityOverLifetime = v;
        }
        private _velocityOverLifetime: ParticleVelocityOverLifetimeModule;

        get limitVelocityOverLifetime() { return this._limitVelocityOverLifetime; }
        set limitVelocityOverLifetime(v)
        {
            Array.replace(this._modules, this._limitVelocityOverLifetime, v);
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
            Array.replace(this._modules, this._inheritVelocity, v);
            v.particleSystem = this;
            this._inheritVelocity = v;
        }
        private _inheritVelocity: ParticleInheritVelocityModule;

        get forceOverLifetime() { return this._forceOverLifetime; }
        set forceOverLifetime(v)
        {
            Array.replace(this._modules, this._forceOverLifetime, v);
            v.particleSystem = this;
            this._forceOverLifetime = v;
        }
        private _forceOverLifetime: ParticleForceOverLifetimeModule;

        get colorOverLifetime() { return this._colorOverLifetime; }
        set colorOverLifetime(v)
        {
            Array.replace(this._modules, this._colorOverLifetime, v);
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
            Array.replace(this._modules, this._colorBySpeed, v);
            v.particleSystem = this;
            this._colorBySpeed = v;
        }
        private _colorBySpeed: ParticleColorBySpeedModule;

        get sizeOverLifetime() { return this._sizeOverLifetime; }
        set sizeOverLifetime(v)
        {
            Array.replace(this._modules, this._sizeOverLifetime, v);
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
            Array.replace(this._modules, this._sizeBySpeed, v);
            v.particleSystem = this;
            this._sizeBySpeed = v;
        }
        private _sizeBySpeed: ParticleSizeBySpeedModule;

        get rotationOverLifetime() { return this._rotationOverLifetime; }
        set rotationOverLifetime(v)
        {
            Array.replace(this._modules, this._rotationOverLifetime, v);
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
            Array.replace(this._modules, this._rotationBySpeed, v);
            v.particleSystem = this;
            this._rotationBySpeed = v;
        }
        private _rotationBySpeed: ParticleRotationBySpeedModule;

        /**
         * 粒子系统纹理表动画模块。
         */
        get textureSheetAnimation() { return this._textureSheetAnimation; }
        set textureSheetAnimation(v)
        {
            Array.replace(this._modules, this._textureSheetAnimation, v);
            v.particleSystem = this;
            this._textureSheetAnimation = v;
        }
        private _textureSheetAnimation: ParticleTextureSheetAnimationModule;

        private _mesh: mesh;

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

        onPlay()
        {

        }

        start()
        {
            if (!this._mesh)
            {
                this._mesh = sceneMgr.app.getAssetMgr().getDefaultMesh(gd3d.framework.defMesh.quad);
            }

            if (!this.material)
            {
                this.material = sceneMgr.app.getAssetMgr().getDefParticleMat();
            }
        }

        remove()
        {
            throw "未实现";
        }

        clone()
        {
            throw "未实现";
        }

        gameObject: gameObject;

        constructor()
        {
            super();

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
            this.textureSheetAnimation = new ParticleTextureSheetAnimationModule();

            this.main.enabled = true;
            this.emission.enabled = true;
            this.shape.enabled = true;
        }

        update(interval: number)
        {
            if (!this.isPlaying) return;

            this.localToWorldMatrix.copyRawDataFrom(this.transform.getWorldMatrix().rawData);
            this.worldToLocalMatrix.copyFrom(this.localToWorldMatrix).invert();

            this.time = this.time + this.main.simulationSpeed * interval;
            this._realTime = this.time - this.startDelay;
            // 粒子系统位置
            this.worldPos.copy(this.localToWorldMatrix.getPosition());
            // 粒子系统位移
            this.moveVec.copy(this.worldPos).sub(this._preworldPos);
            // 粒子系统速度
            this.speed.copy(this.moveVec).divideNumber(this.main.simulationSpeed * interval / 1000);

            this._updateActiveParticlesState();

            // 完成一个循环
            if (this.main.loop && Math.floor(this._preRealTime / this.main.duration) < Math.floor(this._realTime / this.main.duration))
            {
                // 重新计算喷发概率
                this.emission.bursts.forEach(element =>
                {
                    element.calculateProbability();
                });
            }

            this._emit();

            this._preRealTime = this._realTime;
            this._preworldPos.copy(this.worldPos);

            // 判断非循环的效果是否播放结束
            if (!this.main.loop && this._activeParticles.length == 0 && this._realTime > this.main.duration)
            {
                this.stop();
                this.dispatch("particleCompleted", this);
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
            this._startDelay_rate = Math.random();
            this.updateStartDelay();
            this._preRealTime = 0;

            this._particlePool = this._particlePool.concat(this._activeParticles);
            this._activeParticles.length = 0;

            // 重新计算喷发概率
            this.emission.bursts.forEach(element =>
            {
                element.calculateProbability();
            });
        }

        private _startDelay_rate = Math.random();

        /**
         * @private
         */
        updateStartDelay()
        {
            this.startDelay = this.main.startDelay.getValue(this._startDelay_rate);
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
                this._preRealTime = Math.max(0, this._realTime);
            }
        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            var localToWorldMatrix = this.localToWorldMatrix = new Matrix4x4(this.transform.getWorldMatrix().rawData.concat());
            var worldToLocalMatrix = this.worldToLocalMatrix = localToWorldMatrix.clone().invert();

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

            if (!this._awaked)
            {
                this._isPlaying = this.main.playOnAwake;
                this._awaked = true;
            }

            // renderAtomic.instanceCount = this._activeParticles.length;
            //
            // renderAtomic.shaderMacro.HAS_PARTICLE_ANIMATOR = true;

            // renderAtomic.shaderMacro.ENABLED_PARTICLE_SYSTEM_textureSheetAnimation = this.textureSheetAnimation.enabled;

            // 计算公告牌矩阵
            var isbillboard = !this.shape.alignToDirection && this.mesh == sceneMgr.app.getAssetMgr().getDefaultMesh(gd3d.framework.defMesh.quad);
            var billboardMatrix = new Matrix4x4();
            if (isbillboard)
            {
                var cameraMatrix = new Matrix4x4(camera.gameObject.transform.getWorldMatrix().rawData);

                //
                var localCameraForward = worldToLocalMatrix.deltaTransformVector(cameraMatrix.forward);
                var localCameraUp = worldToLocalMatrix.deltaTransformVector(cameraMatrix.up);

                billboardMatrix.lookAt(localCameraForward, localCameraUp);
            }

            var positions: number[] = [];
            var scales: number[] = [];
            var rotations: number[] = [];
            var colors: number[] = [];
            var tilingOffsets: number[] = [];
            var flipUVs: number[] = [];
            for (let i = 0, n = this._activeParticles.length; i < n; i++)
            {
                var particle = this._activeParticles[i];
                positions.push(particle.position.x, particle.position.y, particle.position.z);
                scales.push(particle.size.x, particle.size.y, particle.size.z);

                rotations.push(particle.rotation.x, particle.rotation.y, particle.rotation.z);
                colors.push(particle.color.r, particle.color.g, particle.color.b, particle.color.a);
                tilingOffsets.push(particle.tilingOffset.x, particle.tilingOffset.y, particle.tilingOffset.z, particle.tilingOffset.w);
                flipUVs.push(particle.flipUV.x, particle.flipUV.y);

                this.material.setVector4("a_particle_position", new math.vector4(particle.position.x, particle.position.y, particle.position.z, 1));
                this.material.setVector4("a_particle_scale", new math.vector4(particle.size.x, particle.size.y, particle.size.z, 1));
                this.material.setVector4("a_particle_rotation", new math.vector4(particle.rotation.x, particle.rotation.y, (isbillboard ? -1 : 1) * particle.rotation.z, 1));
                this.material.setVector4("a_particle_color", new math.vector4(particle.color.r, particle.color.g, particle.color.b, particle.color.a));
                this.material.setVector4("a_particle_tilingOffset", new math.vector4(particle.tilingOffset.x, particle.tilingOffset.y, particle.tilingOffset.z, particle.tilingOffset.w));
                this.material.setVector4("a_particle_flipUV", new math.vector4(particle.flipUV.x, particle.flipUV.y, 0, 0));
                this.material.setMatrix("u_particle_billboardMatrix", new math.matrix(billboardMatrix.rawData.concat()))

                this.material.draw(context, mesh, subMeshs[0]);
            }

            if (isbillboard)
            {
                for (var i = 0, n = rotations.length; i < n; i += 3)
                {
                    rotations[i + 2] = -rotations[i + 2];
                }
            }
        }

        private _awaked = false;

        /**
         * 当前真实时间（time - startDelay）
         */
        private _realTime = 0;
        /**
         * 上次真实时间
         */
        private _preRealTime = 0;

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
         * 此时在周期中的位置
         */
        get rateAtDuration()
        {
            return (this._realTime % this.main.duration) / this.main.duration;
        }

        /**
         * 发射粒子
         * @param time 当前粒子时间
         */
        private _emit()
        {
            if (!this.emission.enabled) return;

            // 判断是否达到最大粒子数量
            if (this._activeParticles.length >= this.main.maxParticles) return;

            // 判断是否开始发射
            if (this._realTime <= 0) return;

            var loop = this.main.loop;
            var duration = this.main.duration;
            var rateAtDuration = this.rateAtDuration;
            var preRealTime = this._preRealTime;

            // 判断是否结束发射
            if (!loop && preRealTime >= duration) return;

            // 计算最后发射时间
            var realEmitTime = this._realTime;
            if (!loop) realEmitTime = Math.min(realEmitTime, duration);

            // 
            var emits: { time: number, num: number, position?: Vector3 }[] = [];
            // 单粒子发射周期
            var step = 1 / this.emission.rateOverTime.getValue(rateAtDuration);
            var bursts = this.emission.bursts;
            // 处理移动发射粒子
            if (this.main.simulationSpace == ParticleSystemSimulationSpace.World)
            {
                if (this._isRateOverDistance)
                {
                    var moveVec = this.moveVec;
                    var worldPos = this.worldPos;
                    // 本次移动距离
                    if (moveVec.lengthSquared > 0)
                    {
                        // 移动方向
                        var moveDir = moveVec.clone().normalize();
                        // 剩余移动量
                        var leftRateOverDistance = this._leftRateOverDistance + moveVec.length;
                        // 发射频率
                        var rateOverDistance = this.emission.rateOverDistance.getValue(rateAtDuration);
                        // 发射间隔距离
                        var invRateOverDistance = 1 / rateOverDistance;
                        // 发射间隔位移
                        var invRateOverDistanceVec = moveDir.scaleNumberTo(1 / rateOverDistance);
                        // 上次发射位置
                        var lastRateOverDistance = this._preworldPos.addTo(moveDir.negateTo().scaleNumber(this._leftRateOverDistance));
                        // 发射位置列表
                        var emitPosArr: Vector3[] = [];
                        while (invRateOverDistance < leftRateOverDistance)
                        {
                            emitPosArr.push(lastRateOverDistance.add(invRateOverDistanceVec).clone());
                            leftRateOverDistance -= invRateOverDistance;
                        }
                        this._leftRateOverDistance = leftRateOverDistance;
                        emitPosArr.forEach(p =>
                        {
                            emits.push({ time: this.time, num: 1, position: p.sub(worldPos) });
                        });
                    }
                }
                this._isRateOverDistance = true;
            } else
            {
                this._isRateOverDistance = false;
                this._leftRateOverDistance = 0;
            }

            // 遍历所有发射周期
            var cycleStartIndex = Math.floor(preRealTime / duration);
            var cycleEndIndex = Math.ceil(realEmitTime / duration);
            for (let k = cycleStartIndex; k < cycleEndIndex; k++)
            {
                var cycleStartTime = k * duration;
                var cycleEndTime = (k + 1) * duration;

                // 单个周期内的起始与结束时间
                var startTime = Math.max(preRealTime, cycleStartTime);
                var endTime = Math.min(realEmitTime, cycleEndTime);

                // 处理稳定发射
                var singleStart = Math.ceil(startTime / step) * step;
                for (var i = singleStart; i < endTime; i += step)
                {
                    emits.push({ time: i, num: 1 });
                }

                // 处理喷发
                var inCycleStart = startTime - cycleStartTime;
                var inCycleEnd = endTime - cycleStartTime;
                for (let i = 0; i < bursts.length; i++)
                {
                    const burst = bursts[i];
                    if (burst.isProbability && inCycleStart <= burst.time && burst.time < inCycleEnd)
                    {
                        emits.push({ time: cycleStartTime + burst.time, num: burst.count.getValue(rateAtDuration) });
                    }
                }
            }

            emits.sort((a, b) => { return a.time - b.time });;

            emits.forEach(v =>
            {
                this._emitParticles(v);
            });
        }

        /**
         * 发射粒子
         * @param birthTime 发射时间
         * @param num 发射数量
         */
        private _emitParticles(v: { time: number; num: number; position?: Vector3; })
        {
            var rateAtDuration = this.rateAtDuration;
            var num = v.num;
            var birthTime = v.time;
            var position = v.position || new Vector3();
            for (let i = 0; i < num; i++)
            {
                if (this._activeParticles.length >= this.main.maxParticles) return;
                var lifetime = this.main.startLifetime.getValue(rateAtDuration);
                var birthRateAtDuration = (birthTime - this.startDelay) / this.main.duration;
                var rateAtLifeTime = (this._realTime - birthTime) / lifetime;

                if (rateAtLifeTime < 1)
                {
                    var particle = this._particlePool.pop() || new Particle1();
                    particle.cache = {};
                    particle.position.copy(position);
                    particle.birthTime = birthTime;
                    particle.lifetime = lifetime;
                    particle.rateAtLifeTime = rateAtLifeTime;
                    //
                    particle.birthRateAtDuration = birthRateAtDuration - Math.floor(birthRateAtDuration);

                    this._activeParticles.push(particle);
                    this._initParticleState(particle);
                    this._updateParticleState(particle);
                }
            }
        }

        /**
         * 更新活跃粒子状态
         */
        private _updateActiveParticlesState()
        {
            for (let i = this._activeParticles.length - 1; i >= 0; i--)
            {
                var particle = this._activeParticles[i];
                particle.rateAtLifeTime = (this._realTime - particle.birthTime) / particle.lifetime;
                if (particle.rateAtLifeTime < 0 || particle.rateAtLifeTime > 1)
                {
                    this._activeParticles.splice(i, 1);
                    this._particlePool.push(particle);
                } else
                {
                    this._updateParticleState(particle);
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
        private _updateParticleState(particle: Particle1)
        {
            var preTime = Math.max(this._preRealTime, particle.birthTime);
            //
            this._modules.forEach(v => { v.updateParticleState(particle) });
            particle.updateState(preTime, this._realTime);
        }

        private _simulationSpaceChanged()
        {
            if (!this.transform) return;
            if (this._activeParticles.length == 0) return;

            if (this._main.simulationSpace == ParticleSystemSimulationSpace.Local)
            {
                var worldToLocalMatrix = this.worldToLocalMatrix;
                this._activeParticles.forEach(p =>
                {
                    worldToLocalMatrix.transformVector(p.position, p.position);
                    worldToLocalMatrix.deltaTransformVector(p.velocity, p.velocity);
                    worldToLocalMatrix.deltaTransformVector(p.acceleration, p.acceleration);
                });
            } else
            {
                var localToWorldMatrix = this.localToWorldMatrix;
                this._activeParticles.forEach(p =>
                {
                    localToWorldMatrix.transformVector(p.position, p.position);
                    localToWorldMatrix.deltaTransformVector(p.velocity, p.velocity);
                    localToWorldMatrix.deltaTransformVector(p.acceleration, p.acceleration);
                });
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
        addParticleVelocity(particle: Particle1, velocity: Vector3, space: ParticleSystemSimulationSpace, name?: string)
        {
            if (name != undefined)
            {
                this.removeParticleVelocity(particle, name);
                particle.cache[name] = { value: velocity.clone(), space: space };
            }

            if (space != this.main.simulationSpace)
            {
                if (space == ParticleSystemSimulationSpace.World)
                {
                    this.worldToLocalMatrix.deltaTransformVector(velocity, velocity);
                } else
                {
                    this.localToWorldMatrix.deltaTransformVector(velocity, velocity);
                }
            }
            //
            particle.velocity.add(velocity);
        }

        /**
         * 移除指定粒子上的速度
         * 
         * @param particle 粒子。
         * @param name 速度名称。
         */
        removeParticleVelocity(particle: Particle1, name: string)
        {
            var obj: { value: Vector3, space: ParticleSystemSimulationSpace } = particle.cache[name];
            if (obj)
            {
                delete particle.cache[name];

                var space = obj.space;
                var value = obj.value;
                if (space != this.main.simulationSpace)
                {
                    if (space == ParticleSystemSimulationSpace.World)
                    {
                        this.worldToLocalMatrix.deltaTransformVector(value, value);
                    } else
                    {
                        this.localToWorldMatrix.deltaTransformVector(value, value);
                    }
                }
                //
                particle.velocity.sub(value);
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
        addParticleAcceleration(particle: Particle1, acceleration: Vector3, space: ParticleSystemSimulationSpace, name?: string)
        {
            if (name != undefined)
            {
                this.removeParticleAcceleration(particle, name);
                particle.cache[name] = { value: acceleration.clone(), space: space };
            }

            if (space != this.main.simulationSpace)
            {
                if (space == ParticleSystemSimulationSpace.World)
                {
                    this.worldToLocalMatrix.deltaTransformVector(acceleration, acceleration);
                } else
                {
                    this.localToWorldMatrix.deltaTransformVector(acceleration, acceleration);
                }
            }
            //
            particle.acceleration.add(acceleration);
        }

        /**
         * 移除指定粒子上的加速度
         * 
         * @param particle 粒子。
         * @param name 加速度名称。
         */
        removeParticleAcceleration(particle: Particle1, name: string)
        {
            var obj: { value: Vector3, space: ParticleSystemSimulationSpace } = particle.cache[name];
            if (obj)
            {
                delete particle.cache[name];

                var space = obj.space;
                var value = obj.value;
                if (space != this.main.simulationSpace)
                {
                    if (space == ParticleSystemSimulationSpace.World)
                    {
                        this.worldToLocalMatrix.deltaTransformVector(value, value);
                    } else
                    {
                        this.localToWorldMatrix.deltaTransformVector(value, value);
                    }
                }
                //
                particle.acceleration.sub(value);
            }
        }

        /**
         * 上次移动发射的位置
         */
        private _preworldPos = new Vector3();
        private _isRateOverDistance = false;
        private _leftRateOverDistance = 0;
        //
        worldPos = new Vector3();
        moveVec = new Vector3();
        speed = new Vector3;

        //
        localToWorldMatrix = new Matrix4x4();
        worldToLocalMatrix = new Matrix4x4();
    }
}