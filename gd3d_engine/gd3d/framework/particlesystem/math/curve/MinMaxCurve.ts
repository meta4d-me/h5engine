namespace gd3d.framework
{
    /**
     * 最大最小曲线
     */
    export class MinMaxCurve
    {
        /**
         * 模式
         */
        mode = MinMaxCurveMode.Constant;

        /**
         * 常量值
         */
        constant = 0;

        /**
         * 常量值，用于 MinMaxCurveMode.RandomBetweenTwoConstants
         */
        constant1 = 0;

        /**
         * 曲线，用于 MinMaxCurveMode.RandomBetweenTwoCurves
         */
        curve = new AnimationCurve1();

        /**
         * 曲线1
         */
        curve1 = serialization.setValue(new AnimationCurve1(), { keys: [{ time: 0, value: 0, tangent: 0 }, { time: 1, value: 1, tangent: 0 }] });

        /**
         * 曲线缩放比
         */
        curveMultiplier = 1;

        /**
         * 是否在编辑器中只显示Y轴 0-1 区域，例如 lifetime 为非负，需要设置为true
         */
        between0And1 = false;

        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number, randomBetween: number = Math.random())
        {
            switch (this.mode)
            {
                case MinMaxCurveMode.Constant:
                    return this.constant;
                case MinMaxCurveMode.Curve:
                    return this.curve.getValue(time) * this.curveMultiplier;
                case MinMaxCurveMode.RandomBetweenTwoConstants:
                    return Math.lerp(this.constant, this.constant1, randomBetween);
                case MinMaxCurveMode.RandomBetweenTwoCurves:
                    return Math.lerp(this.curve.getValue(time), this.curve1.getValue(time), randomBetween) * this.curveMultiplier;
            }

            return this.constant;
        }
    }
}