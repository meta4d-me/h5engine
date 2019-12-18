namespace gd3d.framework
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
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            var speed = math.vec3Length(particle.velocity);

            // 计算位置
            var dir = new math.vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            );
            math.vec3Normalize(dir, dir);

            var p = new math.vector3(this.radius * dir.x, this.radius * dir.y, this.radius * dir.z);
            if (!this.emitFromShell)
            {
                var rand = Math.random();
                p.x *= rand;
                p.y *= rand;
                p.z *= rand;
            }
            particle.position.x = p.x;
            particle.position.y = p.y;
            particle.position.z = p.z;

            // 计算速度
            particle.velocity.x = dir.x * speed;
            particle.velocity.y = dir.y * speed;
            particle.velocity.z = dir.z * speed;
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
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            var speed = math.vec3Length(particle.velocity);

            // 计算位置
            var dir = new math.vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            );
            math.vec3Normalize(dir, dir);
            dir.z = Math.abs(dir.z);

            var p = new math.vector3(this.radius * dir.x, this.radius * dir.y, this.radius * dir.z);
            if (!this.emitFromShell)
            {
                var rand = Math.random();
                p.x *= rand;
                p.y *= rand;
                p.z *= rand;
            }
            particle.position.x = p.x;
            particle.position.y = p.y;
            particle.position.z = p.z;

            // 计算速度
            particle.velocity.x = dir.x * speed;
            particle.velocity.y = dir.y * speed;
            particle.velocity.z = dir.z * speed;
        }
    }
}