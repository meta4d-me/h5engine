namespace gd3d.framework
{
    /**
     * 粒子系统 发射边
     * 
     * @author feng3d
     */
    export class ParticleSystemShapeEdge extends ParticleSystemShapeBase
    {
        /**
         * 边长的一半。
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
         * The mode used for generating particles around the radius.
         * 
         * 在弧线周围产生粒子的模式。
         */
        get radiusMode()
        {
            return this._module.radiusMode;
        }

        set radiusMode(v)
        {
            this._module.radiusMode = v;
        }

        /**
         * Control the gap between emission points around the radius.
         * 
         * 控制弧线周围发射点之间的间隙。
         */
        get radiusSpread()
        {
            return this._module.radiusSpread;
        }

        set radiusSpread(v)
        {
            this._module.radiusSpread = v;
        }

        /**
         * When using one of the animated modes, how quickly to move the emission position around the radius.
         * 
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        get radiusSpeed()
        {
            return this._module.radiusSpeed;
        }

        set radiusSpeed(v)
        {
            this._module.radiusSpeed = v;
        }

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            var speed = particle.velocity.length;
            var arc = 360 * this.radius;
            // 在圆心的方向
            var radiusAngle = 0;
            if (this.radiusMode == ParticleSystemShapeMultiModeValue.Random)
            {
                radiusAngle = Math.random() * arc;
            } else if (this.radiusMode == ParticleSystemShapeMultiModeValue.Loop)
            {
                var totalAngle = particle.birthTime * this.radiusSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
            } else if (this.radiusMode == ParticleSystemShapeMultiModeValue.PingPong)
            {
                var totalAngle = particle.birthTime * this.radiusSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
                if (Math.floor(totalAngle / arc) % 2 == 1)
                {
                    radiusAngle = arc - radiusAngle;
                }
            }
            // else if (this.arcMode == ParticleSystemShapeMultiModeValue.BurstSpread)
            // {
            // }
            if (this.radiusSpread > 0)
            {
                radiusAngle = Math.floor(radiusAngle / arc / this.radiusSpread) * arc * this.radiusSpread;
            }
            radiusAngle = radiusAngle / arc;

            // 计算位置
            var dir = new Vector3(0, 1, 0);
            var p = new Vector3(this.radius * (radiusAngle * 2 - 1), 0, 0);

            //
            particle.position.copy(p);

            // 计算速度
            particle.velocity.copy(dir).scaleNumber(speed);
        }
    }
}