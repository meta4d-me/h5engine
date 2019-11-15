namespace feng3d
{
    /**
     * 粒子模块
     */
    export class ParticleModule extends EventDispatcher
    {
        /**
         * 是否开启
         */
        enabled = false;

        /**
         * 粒子系统
         */
        particleSystem: ParticleSystem;

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle)
        {

        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle)
        {

        }
    }
}