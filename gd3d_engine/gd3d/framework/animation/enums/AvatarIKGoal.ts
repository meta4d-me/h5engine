namespace gd3d.unity
{
    /**
     * IK Goal.
     * 
     * Used to set and get IK weights, position and rotation. See Also: Animator.SetIKPosition, Animator.SetIKPositionWeight, Animator.SetIKRotation and Animator.SetIKRotationWeight.
     */
    export enum AvatarIKGoal
    {
        /**
         * The left foot.
         */
        LeftFoot,

        /**
         * The right foot.
         */
        RightFoot,

        /**
         * The left hand.
         */
        LeftHand,

        /**
         * The right hand.
         */
        RightHand,

    }
}