namespace gd3d.framework
{
    /**
     * Culling mode for the Animator.
     */
    export enum AnimatorCullingMode
    {
        /**
         * Always animate the entire character. Object is animated even when offscreen.
         */
        AlwaysAnimate,

        /**
         * Retarget, IK and write of Transforms are disabled when renderers are not visible.
         */
        CullUpdateTransforms,

        /**
         * Animation is completely disabled when renderers are not visible.
         */
        CullCompletely,

    }
}