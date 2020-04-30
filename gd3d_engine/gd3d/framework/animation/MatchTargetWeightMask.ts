namespace gd3d.framework
{
    /**
     * Use this struct to specify the position and rotation weight mask for Animator.MatchTarget.
     */
    export class MatchTargetWeightMask
    {

        /**
         * Position XYZ weight.
         */
        positionXYZWeight: math.vector3;

        /**
         * Rotation weight.
         */
        rotationWeight: number;

    }
}