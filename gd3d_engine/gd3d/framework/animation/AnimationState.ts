namespace gd3d.unity
{
    /**
     * The AnimationState gives full control over animation blending.
     */
    export class AnimationState
    {
        /**
         * Which blend mode should be used?
         */
        blendMode: AnimationBlendMode;

        /**
         * The clip that is being played by this animation state.
         */
        clip: AnimationClip;

        /**
         * Enables / disables the animation.
         */
        enabled: boolean;

        /**
         * The length of the animation clip in seconds.
         */
        length: number;

        /**
         * The name of the animation.
         */
        name: string;

        /**
         * The normalized playback speed.
         */
        normalizedSpeed: number;

        /**
         * The normalized time of the animation.
         */
        normalizedTime: number;

        /**
         * The playback speed of the animation. 1 is normal playback speed.
         */
        speed: number;

        /**
         * The current time of the animation.
         */
        time: number;

        /**
         * The weight of animation.
         */
        weight: number;

        /**
         * Wrapping mode of the animation.
         */
        wrapMode: framework.AnimationCurveWrapMode;

        /**
         * Adds a transform which should be animated. This allows you to reduce the number of animations you have to create.
         * 
         * @param mix The transform to animate.
         * @param recursive Whether to also animate all children of the specified transform.
         */
        AddMixingTransform(mix: framework.transform, recursive = true)
        {

        }

        /**
         * Removes a transform which should be animated.
         */
        RemoveMixingTransform(mix: framework.transform)
        {

        }

    }
}