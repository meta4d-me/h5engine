namespace gd3d.framework
{
    /**
     * 粒子系统 旋转角度随时间变化模块
     */
    export class ParticleRotationOverLifetimeModule extends ParticleModule
    {
        /**
         * Set the rotation over lifetime on each axis separately.
         * 在每个轴上分别设置基于生命周期的旋转。
         */
        separateAxes = false;

        /**
         * 角速度，基于生命周期的旋转。
         */
        angularVelocity: MinMaxCurveVector3;

        constructor()
        {
            super();
            this.angularVelocity = new MinMaxCurveVector3();
            this.angularVelocity.xCurve.between0And1 = false;
            this.angularVelocity.xCurve.constant = 45;
            this.angularVelocity.xCurve.constant1 = 45;
            this.angularVelocity.xCurve.curveMultiplier = 45;
            this.angularVelocity.yCurve.between0And1 = false;
            this.angularVelocity.yCurve.constant = 45;
            this.angularVelocity.yCurve.constant1 = 45;
            this.angularVelocity.yCurve.curveMultiplier = 45;
            this.angularVelocity.zCurve.between0And1 = false;
            this.angularVelocity.zCurve.constant = 45;
            this.angularVelocity.zCurve.constant1 = 45;
            this.angularVelocity.zCurve.curveMultiplier = 45;
        }

        /**
         * Rotation over lifetime curve for the X axis.
         * 
         * X轴的旋转寿命曲线。
         */
        get x()
        {
            return this.angularVelocity.xCurve;
        }

        set x(v)
        {
            this.angularVelocity.xCurve = v;
        }

        /**
         * Rotation multiplier around the X axis.
         * 
         * 绕X轴旋转乘法器
         */
        get xMultiplier()
        {
            return this.x.curveMultiplier;
        }

        set xMultiplier(v)
        {
            this.x.curveMultiplier = v;
        }

        /**
         * Rotation over lifetime curve for the Y axis.
         * 
         * Y轴的旋转寿命曲线。
         */
        get y()
        {
            return this.angularVelocity.yCurve;
        }

        set y(v)
        {
            this.angularVelocity.yCurve = v;
        }

        /**
         * Rotation multiplier around the Y axis.
         * 
         * 绕Y轴旋转乘法器
         */
        get yMultiplier()
        {
            return this.y.curveMultiplier;
        }

        set yMultiplier(v)
        {
            this.y.curveMultiplier = v;
        }

        /**
         * Rotation over lifetime curve for the Z axis.
         * 
         * Z轴的旋转寿命曲线。
         */
        get z()
        {
            return this.angularVelocity.zCurve;
        }

        set z(v)
        {
            this.angularVelocity.zCurve = v;
        }

        /**
         * Rotation multiplier around the Z axis.
         * 
         * 绕Z轴旋转乘法器
         */
        get zMultiplier()
        {
            return this.z.curveMultiplier;
        }

        set zMultiplier(v)
        {
            this.z.curveMultiplier = v;
        }

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1)
        {
            particle[_RotationOverLifetime_rate] = Math.random();
            particle[_RotationOverLifetime_preAngularVelocity] = new Vector3();
        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1)
        {
            var preAngularVelocity: Vector3 = particle[_RotationOverLifetime_preAngularVelocity];
            particle.angularVelocity.sub(preAngularVelocity);
            preAngularVelocity.init(0, 0, 0);
            if (!this.enabled) return;

            var v = this.angularVelocity.getValue(particle.rateAtLifeTime, particle[_RotationOverLifetime_rate]);
            if (!this.separateAxes)
            {
                v.x = v.y = 0;
            }
            particle.angularVelocity.add(v);
            preAngularVelocity.copy(v);
        }
    }
    var _RotationOverLifetime_rate = "_RotationOverLifetime_rate";
    var _RotationOverLifetime_preAngularVelocity = "_RotationOverLifetime_preAngularVelocity";
}