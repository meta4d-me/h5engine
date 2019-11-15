namespace gd3d.framework
{
    /**
     * 动画关键帧
     */
    export class AnimationCurveKeyframe
    {
        /**
         * 时间轴的位置 [0,1]
         */
        time: number

        /**
         * 值 [0,1]
         */
        value: number

        /**
         * 斜率
         */
        tangent: number

        constructor(param: Partial<AnimationCurveKeyframe>)
        {
            this.init(param);
        }

        init(param: Partial<AnimationCurveKeyframe>)
        {
            param.time && (this.time = param.time);
            param.value && (this.value = param.value);
            param.tangent && (this.tangent = param.tangent);
        }
    }
}