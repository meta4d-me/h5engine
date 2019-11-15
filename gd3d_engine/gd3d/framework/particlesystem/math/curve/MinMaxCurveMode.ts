namespace gd3d.framework
{
    /**
     * 曲线模式
     * 
     * @author feng3d
     */
    export enum MinMaxCurveMode
    {
        /**
         * 常量
         */
        Constant,
        /**
         * 曲线
         */
        Curve,
        /**
         * 两个常量间取随机值
         */
        RandomBetweenTwoConstants,
        /**
         * 两个曲线中取随机值
         */
        RandomBetweenTwoCurves,
    }
}