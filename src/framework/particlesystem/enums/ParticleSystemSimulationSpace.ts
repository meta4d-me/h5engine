namespace m4m.framework
{
    /**
     * 粒子模拟空间
     * 
     * @author feng3d
     */
    export enum ParticleSystemSimulationSpace
    {
        /**
         * Simulate particles in local space.
         * 
         * 模拟局部空间中的粒子。
         */
        Local = 0,

        /**
         * Simulate particles in world space.
         * 
         * 模拟世界空间中的粒子。
         */
        World = 1,
    }

}