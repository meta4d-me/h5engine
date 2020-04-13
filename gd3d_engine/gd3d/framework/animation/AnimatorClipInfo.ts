namespace gd3d.unity
{
    /**
     * Information about clip being played and blended by the Animator.
     */
    export class AnimatorClipInfo
    {
        /**
         * Returns the animation clip played by the Animator.
         */
        clip: AnimationClip;

        /**
         * Returns the blending weight used by the Animator to blend this clip.
         */
        weight: number;

    }
}