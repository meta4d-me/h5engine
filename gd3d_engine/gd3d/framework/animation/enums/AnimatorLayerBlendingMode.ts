namespace gd3d.framework
{
    /**
     * Specifies how the layer is blended with the previous layers.
     */
    export enum AnimatorLayerBlendingMode
    {

        /**
         * Animations overrides to the previous layers.
         */
        Override,

        /**
         * Animations are added to the previous layers.
         */
        Additive,
    }
}