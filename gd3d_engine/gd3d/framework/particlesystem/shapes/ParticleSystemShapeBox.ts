/// <reference path="ParticleSystemShapeBase.ts" />

namespace gd3d.framework
{
    /**
     * @author feng3d
     */
    export enum ParticleSystemShapeBoxEmitFrom
    {
        /**
         * 从盒子内部发射。
         */
        Volume,
        /**
         * 从盒子外壳发射。
         */
        Shell,
        /**
         * 从盒子边缘发射。
         */
        Edge,
    }

    /**
     * 粒子系统 发射盒子
     * 
     * @author feng3d
     */
    export class ParticleSystemShapeBox extends ParticleSystemShapeBase
    {
        /**
         * 盒子X方向缩放。
         */
        get boxX()
        {
            return this._module.box.x;
        }

        set boxX(v)
        {
            this._module.box.x = v;
        }

        /**
         * 盒子Y方向缩放。
         */
        get boxY()
        {
            return this._module.box.y;
        }

        set boxY(v)
        {
            this._module.box.y = v;
        }

        /**
         * 盒子Z方向缩放。
         */
        get boxZ()
        {
            return this._module.box.z;
        }

        set boxZ(v)
        {
            this._module.box.z = v;
        }

        /**
         * 粒子系统盒子发射类型。
         */
        emitFrom = ParticleSystemShapeBoxEmitFrom.Volume;

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            var speed = math.vec3Length(particle.velocity);

            // 计算位置
            var p = new math.vector3(this.boxX * (Math.random() * 2 - 1), this.boxY * (Math.random() * 2 - 1), this.boxZ * (Math.random() * 2 - 1));

            if (this.emitFrom == ParticleSystemShapeBoxEmitFrom.Shell)
            {
                var max = Math.max(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z));
                if (Math.abs(p.x) == max)
                {
                    p.x = p.x < 0 ? -1 : 1;
                } else if (Math.abs(p.y) == max)
                {
                    p.y = p.y < 0 ? -1 : 1;
                } else if (Math.abs(p.z) == max)
                {
                    p.z = p.z < 0 ? -1 : 1;
                }
            } else if (this.emitFrom == ParticleSystemShapeBoxEmitFrom.Edge)
            {
                var min = Math.min(Math.abs(p.x), Math.abs(p.y), Math.abs(p.z));
                if (Math.abs(p.x) == min)
                {
                    p.y = p.y < 0 ? -1 : 1;
                    p.z = p.z < 0 ? -1 : 1;
                } else if (Math.abs(p.y) == min)
                {
                    p.x = p.x < 0 ? -1 : 1;
                    p.z = p.z < 0 ? -1 : 1;
                } else if (Math.abs(p.z) == min)
                {
                    p.x = p.x < 0 ? -1 : 1;
                    p.y = p.y < 0 ? -1 : 1;
                }
            }

            particle.position.x = p.x;
            particle.position.y = p.y;
            particle.position.z = p.z;

            // 计算速度
            var dir = new math.vector3(0, 0, 1);
            particle.velocity.x = dir.x * speed;
            particle.velocity.y = dir.y * speed;
            particle.velocity.z = dir.z * speed;
        }
    }
}