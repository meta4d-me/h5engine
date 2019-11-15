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

        constructor(a: Partial<AnimationCurveKeyframe>)
        {
            a.time && (this.time = a.time);
            a.value && (this.value = a.value);
            a.tangent && (this.tangent = a.tangent);
        }
    }
}