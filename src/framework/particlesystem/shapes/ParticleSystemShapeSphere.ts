namespace m4m.framework
{
    /**
     * 从球体的体积中发射。
     * 
     * @author feng3d
     */
    export class ParticleSystemShapeSphere extends ParticleSystemShapeBase
    {
        /**
         * 球体半径
         */
        get radius()
        {
            return this._module.radius;
        }

        set radius(v)
        {
            this._module.radius = v;
        }

        /**
         * 是否从球面发射
         */
        emitFromShell = false;

        /**
         * 计算粒子的发射位置与方向
         * 
         * @param particle 
         * @param position 
         * @param dir 
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3)
        {
            //
            dir.x = Math.random() * 2 - 1;
            dir.y = Math.random() * 2 - 1;
            dir.z = Math.random() * 2 - 1;
            math.vec3Normalize(dir, dir);
            //
            position.x = this.radius * dir.x;
            position.y = this.radius * dir.y;
            position.z = this.radius * dir.z;
            if (!this.emitFromShell)
            {
                var rand = Math.random();
                position.x *= rand;
                position.y *= rand;
                position.z *= rand;
            }
        }
    }

    /**
     * 从半球体的体积中发出。
     */
    export class ParticleSystemShapeHemisphere extends ParticleSystemShapeBase
    {
        radius = 1;

        /**
         * 是否从球面发射
         */
        emitFromShell = false;

        /**
         * 计算粒子的发射位置与方向
         * 
         * @param particle 
         * @param position 
         * @param dir 
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3)
        {
            //
            dir.x = Math.random() * 2 - 1;
            dir.y = Math.random() * 2 - 1;
            dir.z = Math.random() * 2 - 1;

            math.vec3Normalize(dir, dir);
            dir.z = Math.abs(dir.z);

            //
            position.x = this.radius * dir.x;
            position.y = this.radius * dir.y;
            position.z = this.radius * dir.z;
            if (!this.emitFromShell)
            {
                var rand = Math.random();
                position.x *= rand;
                position.y *= rand;
                position.z *= rand;
            }
        }
    }
}