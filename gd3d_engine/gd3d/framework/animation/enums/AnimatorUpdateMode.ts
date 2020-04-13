namespace gd3d.unity
{
    /**
     * The update mode of the Animator.
     */
    export enum AnimatorUpdateMode
    {
        /**
         * Normal update of the animator.
         */
        Normal,

        /**
         * Updates the animator during the physic loop in order to have the animation system synchronized with the physics engine.
         */
        AnimatePhysics,

        /**
         * Animator updates independently of Time.timeScale.
         */
        UnscaledTime

    }
}