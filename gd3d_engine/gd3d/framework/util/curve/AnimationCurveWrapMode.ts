namespace gd3d.framework
{
    /**
     * 动画曲线Wrap模式，处理超出范围情况
     * 
     * @author feng3d
     */
    export enum AnimationCurveWrapMode
    {
        /**
         * Reads the default repeat mode set higher up.
         */
        Default = 0,

        /**
         * When time reaches the end of the animation clip, the clip will automatically stop playing and time will be reset to beginning of the clip.
         */
        Once = 1,

        /**
         * 夹紧; 0>-<1
         */
        Clamp = 1,

        /**
         * 循环; 0->1,0->1
         */
        Loop = 2,

        /**
         * 来回循环; 0->1,1->0
         */
        PingPong = 4,

        ClampForever = 8
    }
}