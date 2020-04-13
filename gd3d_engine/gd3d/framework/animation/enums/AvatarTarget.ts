namespace gd3d.unity
{
    /**
     * Target.
     * 
     * See Also: Animator.SetTarget and Animator.MatchTarget.
     */
    export enum AvatarTarget
    {
        /**
         * The root, the position of the game object.
         */
        Root,

        /**
         * The body, center of mass.
         */
        Body,

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