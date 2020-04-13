namespace gd3d.unity
{
    /**
     * The animator state info related to this event (Read Only).
     */
    export class AnimatorStateInfo
    {
        /**
         * The full path hash for this state.
         */
        fullPathHash: number;

        /**
         * Current duration of the state.
         */
        length: number;

        /**
         * Is the state looping.
         */
        loop: boolean;

        /**
         * Normalized time of the State.
         */
        normalizedTime: number;

        /**
         * The hash is generated using Animator.StringToHash. The hash does not include the name of the parent layer.
         */
        shortNameHash: number;

        /**
         * The playback speed of the animation. 1 is the normal playback speed.
         */
        speed: number;

        /**
         * The speed multiplier for this state.
         */
        speedMultiplier: number;

        /**
         * The Tag of the State.
         */
        tagHash: number;

        /**
         * Does name match the name of the active state in the statemachine?
         */
        IsName(name: string)
        {

        }

        /**
         * Does tag match the tag of the active state in the statemachine.
         */
        IsTag(tag: string)
        {

        }

    }
}