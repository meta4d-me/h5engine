/// <reference path="ParticleSystemShapeBase.ts" />

namespace m4m.framework
{
    /**
     * 粒子系统 发射圆盘
     * 
     * @author feng3d
     */
    export class ParticleSystemShapeCircle extends ParticleSystemShapeBase
    {
        get radius()
        {
            return this._module.radius;
        }

        set radius(v)
        {
            this._module.radius = v;
        }

        get arc()
        {
            return this._module.arc;
        }

        set arc(v)
        {
            this._module.arc = v;
        }

        /**
         * The mode used for generating particles around the arc.
         * 
         * 在弧线周围产生粒子的模式。
         */
        get arcMode()
        {
            return this._module.arcMode;
        }

        set arcMode(v)
        {
            this._module.arcMode = v;
        }

        /**
         * Control the gap between emission points around the arc.
         * 
         * 控制弧线周围发射点之间的间隙。
         */
        get arcSpread()
        {
            return this._module.arcSpread;
        }

        set arcSpread(v)
        {
            this._module.arcSpread = v;
        }

        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        get arcSpeed()
        {
            return this._module.arcSpeed;
        }

        set arcSpeed(v)
        {
            this._module.arcSpeed = v;
        }

        /**
         * 是否从圆形边缘发射。
         */
        emitFromEdge = false;

        /**
         * 计算粒子的发射位置与方向
         * 
         * @param particle 
         * @param position 
         * @param dir 
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3)
        {
            var radius = this.radius;
            var arc = this.arc;
            // 在圆心的方向
            var radiusAngle = 0;
            if (this.arcMode == ParticleSystemShapeMultiModeValue.Random)
            {
                radiusAngle = Math.random() * arc;
            } else if (this.arcMode == ParticleSystemShapeMultiModeValue.Loop)
            {
                var totalAngle = particle.birthTime * this.arcSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
            } else if (this.arcMode == ParticleSystemShapeMultiModeValue.PingPong)
            {
                var totalAngle = particle.birthTime * this.arcSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
                if (Math.floor(totalAngle / arc) % 2 == 1)
                {
                    radiusAngle = arc - radiusAngle;
                }
            }
            if (this.arcSpread > 0)
            {
                radiusAngle = Math.floor(radiusAngle / arc / this.arcSpread) * arc * this.arcSpread;
            }
            radiusAngle = math.degToRad(radiusAngle);
            // 计算位置
            dir.x = Math.cos(radiusAngle);
            dir.y = Math.sin(radiusAngle);
            dir.z = 0;
            //
            position.x = dir.x * radius;
            position.y = dir.y * radius;
            position.z = dir.z * radius;
            if (!this.emitFromEdge)
            {
                var rand = Math.random();
                position.x *= rand;
                position.y *= rand;
                position.z *= rand;
            }
        }
    }
}