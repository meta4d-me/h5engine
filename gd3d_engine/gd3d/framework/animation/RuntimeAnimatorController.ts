namespace gd3d.unity
{
    /**
     * The runtime representation of the AnimatorController. Use this representation to change the Animator Controller during runtime.
     */
    export class RuntimeAnimatorController
    {
        /**
         * Retrieves all AnimationClip used by the controller.
         */
        animationClips: unity.AnimationClip[];
    }
}