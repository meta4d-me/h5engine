namespace m4m.framework
{
    /**
     * 粒子系统 发射形状
     * 
     * @author feng3d
     */
    export class ParticleSystemShapeBase
    {
        protected _module: ParticleShapeModule;
        /**
         * 粒子系统形状
         * @param module 粒子形状模块
         */
        constructor(module: ParticleShapeModule)
        {
            this._module = module;
        }


        /**
         * 计算粒子的发射位置与方向
         * 
         * @param particle 
         * @param position 
         * @param dir 
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3)
        {

        }
    }
}