namespace gd3d.unity
{
    /**
     * Stores keyframe based animations.
     * 
     * AnimationClip is used by Animation to play back animations.
     */
    export class AnimationClip
    {
        /**
         * Returns true if the animation clip has no curves and no events.
         */
        empty: boolean;

        /**
         * Animation Events for this animation clip.
         */
        events: AnimationEvent[];

        /**
         * Frame rate at which keyframes are sampled. (Read Only)
         */
        frameRate: number;

        /**
         * Returns true if the Animation has animation on the root transform.
         */
        hasGenericRootTransform: number;

        /**
         * Returns true if the AnimationClip has root motion curves.
         */
        hasMotionCurves: number;

        /**
         * Returns true if the AnimationClip has editor curves for its root motion.
         */
        hasMotionFloatCurves: number;

        /**
         * Returns true if the AnimationClip has root Curves.
         */
        hasRootCurves: boolean;

        /**
         * Returns true if the animation contains curve that drives a humanoid rig.
         */
        humanMotion: boolean;

        /**
         * Set to true if the AnimationClip will be used with the Legacy Animation component ( instead of the Animator ).
         */
        legacy: boolean;

        /**
         * Animation length in seconds. (Read Only)
         */
        length: number;

        /**
         * AABB of this Animation Clip in local space of Animation component that it is attached too.
         */
        localBounds: Bounds;

        /**
         * Sets the default wrap mode used in the animation state.
         */
        wrapMode: framework.AnimationCurveWrapMode;

        /**
         * Adds an animation event to the clip.
         */
        AddEvent(evt: unity.AnimationEvent)
        {

        }

        /**
         * Clears all curves from the clip.
         */
        ClearCurves()
        {

        }

        /**
         * Realigns quaternion keys to ensure shortest interpolation paths.
         */
        EnsureQuaternionContinuity()
        {

        }

        /**
         * Samples an animation at a given time for any animated properties.
         * 
         * @param go The animated game object.
         * @param time The time to sample an animation.
         */
        SampleAnimation(go: framework.gameObject, time: number)
        {

        }

        /**
         * Assigns the curve to animate a specific property.
         * 
         * @param relativePath Path to the game object this curve applies to. The relativePath is formatted similar to a pathname, e.g. "root/spine/leftArm". If relativePath is empty it refers to the game object the animation clip is attached to.
         * @param type The class type of the component that is animated.
         * @param propertyName The name or path to the property being animated.
         * @param curve The animation curve.
         */
        SetCurve(relativePath: string, type: (new () => any), propertyName: string, curve: framework.AnimationCurve1)
        {

        }

    }
}