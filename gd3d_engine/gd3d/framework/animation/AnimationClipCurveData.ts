namespace gd3d.unity
{
    /**
     * An AnimationClipCurveData object contains all the information needed to identify a specific curve in an AnimationClip. The curve animates a specific property of a component / material attached to a game object / animated bone.
     */
    export class AnimationClipCurveData
    {
        __class__: "gd3d.unity.AnimationClipCurveData";

        /**
         * The actual animation curve.
         */
        curve: framework.AnimationCurve1;

        /**
         * The path of the game object / bone being animated.
         */
        path: string;

        /**
         * The name of the property being animated.
         */
        propertyName: string;

        /**
         * The type of the component / material being animated.
         */
        type: new () => any;

    }
}