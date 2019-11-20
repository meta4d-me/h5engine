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

        __class__: "feng3d.ParticleSystem" = "feng3d.ParticleSystem";

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
         * 是否正在播放
         */
        get isPlaying()
        {
            return this._isPlaying;
        }
        private _isPlaying = false;

        /**
         * 粒子时间
         */
        time = 0;

        get main() { return this._main; }
        set main(v)
        {
            this._modules.replace(this._main, v);
            v.particleSystem = this;
            this._main = v;
        }
        private _main: ParticleMainModule;

        get emission() { return this._emission; }
        set emission(v)
        {
            this._modules.replace(this._emission, v);
            v.particleSystem = this;
            this._emission = v;
        }
        private _emission: ParticleEmissionModule;

        get shape() { return this._shape; }
        set shape(v)
        {
            this._modules.replace(this._shape, v);
            v.particleSystem = this;
            this._shape = v;
        }
        private _shape: ParticleShapeModule;

        get velocityOverLifetime() { return this._velocityOverLifetime; }
        set velocityOverLifetime(v)
        {
            this._modules.replace(this._velocityOverLifetime, v);
            v.particleSystem = this;
            this._velocityOverLifetime = v;
        }
        private _velocityOverLifetime: ParticleVelocityOverLifetimeModule;

        get limitVelocityOverLifetime() { return this._limitVelocityOverLifetime; }
        set limitVelocityOverLifetime(v)
        {
            this._modules.replace(this._limitVelocityOverLifetime, v);
            v.particleSystem = this;
            this._limitVelocityOverLifetime = v;
        }
        private _limitVelocityOverLifetime: ParticleLimitVelocityOverLifetimeModule;

        get forceOverLifetime() { return this._forceOverLifetime; }
        set forceOverLifetime(v)
        {
            this._modules.replace(this._forceOverLifetime, v);
            v.particleSystem = this;
            this._forceOverLifetime = v;
        }
        private _forceOverLifetime: ParticleForceOverLifetimeModule;

        get colorOverLifetime() { return this._colorOverLifetime; }
        set colorOverLifetime(v)
        {
            this._modules.replace(this._colorOverLifetime, v);
            v.particleSystem = this;
            this._colorOverLifetime = v;
        }
        private _colorOverLifetime: ParticleColorOverLifetimeModule;

        get sizeOverLifetime() { return this._sizeOverLifetime; }
        set sizeOverLifetime(v)
        {
            this._modules.replace(this._sizeOverLifetime, v);
            v.particleSystem = this;
            this._sizeOverLifetime = v;
        }
        private _sizeOverLifetime: ParticleSizeOverLifetimeModule;

        get rotationOverLifetime() { return this._rotationOverLifetime; }
        set rotationOverLifetime(v)
        {
            this._modules.replace(this._rotationOverLifetime, v);
            v.particleSystem = this;
            this._rotationOverLifetime = v;
        }
        private _rotationOverLifetime: ParticleRotationOverLifetimeModule;

        /**
         * 粒子系统纹理表动画模块。
         */

        get textureSheetAnimation() { return this._textureSheetAnimation; }
        set textureSheetAnimation(v)
        {
            this._modules.replace(this._textureSheetAnimation, v);
            v.particleSystem = this;
            this._textureSheetAnimation = v;
        }
        private _textureSheetAnimation: ParticleTextureSheetAnimationModule;

        // geometry = Geometry.billboard;

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

        /**
         * 活跃粒子数量
         */
        get numActiveParticles()
        {
            return this._activeParticles.length;
        }

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
                this._mesh = sceneMgr.app.getAssetMgr().getDefaultMesh("quad_particle");
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
            this.forceOverLifetime = new ParticleForceOverLifetimeModule();
            this.colorOverLifetime = new ParticleColorOverLifetimeModule();
            this.sizeOverLifetime = new ParticleSizeOverLifetimeModule();
            this.rotationOverLifetime = new ParticleRotationOverLifetimeModule();
            this.textureSheetAnimation = new ParticleTextureSheetAnimationModule();
            this.limitVelocityOverLifetime = new ParticleLimitVelocityOverLifetimeModule();

            this.main.enabled = true;
            this.emission.enabled = true;
            this.shape.enabled = true;
        }

        update(interval: number)
        {
            if (!this.isPlaying) return;

            this.time = this.time + this.main.simulationSpeed * interval;
            this._realTime = this.time - this.startDelay;

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

            var cameraMatrix = new Matrix4x4(camera.gameObject.transform.getWorldMatrix().rawData);

            var localToWorldMatrix = new Matrix4x4(this.transform.getWorldMatrix().rawData.concat());
            var worldToLocalMatrix = localToWorldMatrix.clone().invert();
            //
            var localCameraPos = worldToLocalMatrix.transformVector(cameraMatrix.position);
            var localCameraUp = worldToLocalMatrix.deltaTransformVector(cameraMatrix.up);
            // 计算公告牌矩阵
            var u_particle_billboardMatrix = new Matrix4x4();

            if (!this.shape.alignToDirection && this.mesh == sceneMgr.app.getAssetMgr().getDefaultMesh("quad_particle"))
            {
                u_particle_billboardMatrix.lookAt(localCameraPos, localCameraUp);
            }

            var positions: number[] = [];
            var scales: number[] = [];
            var rotations: number[] = [];
            var colors: number[] = [];
            var tilingOffsets: number[] = [];
            var flipUVs: number[] = [];

            var matrixModelViewProject = new Matrix4x4(context.matrixModelViewProject.rawData);

            for (let i = 0, n = this._activeParticles.length; i < n; i++)
            {
                var particle = this._activeParticles[i];
                positions.push(particle.position.x, particle.position.y, particle.position.z);
                scales.push(particle.size.x, particle.size.y, particle.size.z);

                rotations.push(particle.rotation.x, particle.rotation.y, particle.rotation.z);
                colors.push(particle.color.r, particle.color.g, particle.color.b, particle.color.a);
                tilingOffsets.push(particle.tilingOffset.x, particle.tilingOffset.y, particle.tilingOffset.z, particle.tilingOffset.w);
                flipUVs.push(particle.flipUV.x, particle.flipUV.y);

                //
                var u_particle_transfrom = new Matrix4x4().recompose([particle.position, particle.rotation.scaleNumberTo(Math.DEG2RAD), particle.size]);
                u_particle_transfrom.append(u_particle_billboardMatrix).append(matrixModelViewProject);

                context.matrixModelViewProject = new gd3d.math.matrix(u_particle_transfrom.rawData);

                let len = subMeshs.length;
                let scene = tran.scene;
                for (let j = 0; j < len; j++)
                {
                    let sm = subMeshs[j];
                    let mid = subMeshs[j].matIndex;//根据这个找到使用的具体哪个材质    
                    // let usemat = this.materials[mid];
                    let usemat = this.material;
                    let drawtype = scene.fog ? "base_fog" : "base";
                    if (scene.fog)
                    {
                        context.fog = scene.fog;
                    }
                    if (usemat != null)
                    {
                        
                        
                        usemat.setMatrix("u_particle_billboardMatrix", u_particle_billboardMatrix)
                        usemat.draw(context, mesh, sm, drawtype);
                    }
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
            var emits: { time: number, num: number }[] = [];
            // 单粒子发射周期
            var step = 1 / this.emission.rateOverTime.getValue(rateAtDuration);
            var bursts = this.emission.bursts;

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
                this._emitParticles(v.time, v.num, rateAtDuration);
            });
        }

        /**
         * 发射粒子
         * @param birthTime 发射时间
         * @param num 发射数量
         */
        private _emitParticles(birthTime: number, num: number, rateAtDuration: number)
        {
            for (let i = 0; i < num; i++)
            {
                if (this._activeParticles.length >= this.main.maxParticles) return;
                var lifetime = this.main.startLifetime.getValue(rateAtDuration);
                var birthRateAtDuration = (birthTime - this.startDelay) / this.main.duration;
                var rateAtLifeTime = (this._realTime - birthTime) / lifetime;

                if (rateAtLifeTime < 1)
                {
                    var particle = this._particlePool.pop() || new Particle1();
                    particle.birthTime = birthTime;
                    particle.lifetime = lifetime;
                    particle.rateAtLifeTime = rateAtLifeTime;
                    //
                    particle.birthRateAtDuration = birthRateAtDuration;

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
                if (particle.rateAtLifeTime > 1)
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
    }

    // AssetData.addAssetData("Billboard-Geometry", Geometry.billboard = serialization.setValue(new PlaneGeometry(), { name: "Billboard-Geometry", assetId: "Billboard-Geometry", yUp: false, hideFlags: HideFlags.NotEditable }));
}