/// <reference path="ParticleModule.ts" />

namespace gd3d.framework
{
    /**
     * 粒子系统 颜色随时间变化模块
     * 
     * @author feng3d
     */
    export class ParticleColorOverLifetimeModule extends ParticleModule
    {
        /**
         * The gradient controlling the particle colors.
         * 控制粒子颜色的梯度。
         */
        @serialize
        color = new MinMaxGradient();

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            particle[_ColorOverLifetime_rate] = Math.random();
        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1)
        {
            if (!this.enabled) return;

            particle.color.multiply(this.color.getValue(particle.rateAtLifeTime, particle[_ColorOverLifetime_rate]));
        }
    }

    var _ColorOverLifetime_rate = "_ColorOverLifetime_rate";

}