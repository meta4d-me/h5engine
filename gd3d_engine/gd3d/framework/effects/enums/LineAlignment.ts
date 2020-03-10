namespace gd3d.framework
{
    /**
     * Control the direction lines face, when using the LineRenderer or TrailRenderer.
     * 
     * 使用LineRenderer或TrailRenderer时，控制方向线的面。
     */
    export enum LineAlignment
    {

        /**
         * Lines face the camera.
         * 
         * 线面向相机。
         */
        View,
        /**
         * Lines face the Z axis of the Transform Component.
         * 
         * 线面向变换组件的Z轴。
         */
        TransformZ,

        /**
         * 无特定朝向，自动根据线条走向确定面向(法线)
         */
        None,
    }
}