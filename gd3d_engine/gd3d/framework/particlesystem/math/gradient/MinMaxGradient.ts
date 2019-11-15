namespace gd3d.framework
{
    /**
     * 最大最小颜色渐变
     */
    export class MinMaxGradient
    {
        /**
         * 模式
         */
        mode = MinMaxGradientMode.Color;

        /**
         * 常量颜色值
         */
        color = new Color4();

        /**
         * 常量颜色值，作用于 MinMaxGradientMode.RandomBetweenTwoColors
         */
        color1 = new Color4();

        gradient = new Gradient();

        gradient1 = new Gradient();

        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number, randomBetween: number = Math.random())
        {
            switch (this.mode)
            {
                case MinMaxGradientMode.Color:
                    return this.color;
                case MinMaxGradientMode.Gradient:
                    return this.gradient.getValue(time);
                case MinMaxGradientMode.RandomBetweenTwoColors:
                    return this.color.mixTo(this.color1, randomBetween);
                case MinMaxGradientMode.RandomBetweenTwoGradients:
                    var min = this.gradient.getValue(time);
                    var max = this.gradient1.getValue(time);
                    var v = min.mixTo(max, randomBetween);
                    return v;
                case MinMaxGradientMode.RandomColor:
                    var v = this.gradient.getValue(randomBetween);
                    return v;
            }
            return this.color;
        }
    }
}