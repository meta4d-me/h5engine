namespace gd3d.framework
{
    /**
     * IK Hint.
     * 
     * Used to set and get IK weights and position. See Also: Animator.GetIKHintPosition, Animator.GetIKHintPositionWeight, Animator.SetIKHintPosition, and Animator.SetIKHintPositionWeight.
     */
    export enum AvatarIKHint
    {
        /**
         * The left knee IK hint.
         */
        LeftKnee,

        /**
         * The right knee IK hint.
         */
        RightKnee,

        /**
         * The left elbow IK hint.
         */
        LeftElbow,

        /**
         * The right elbow IK hint.
         */
        RightElbow,

    }
}