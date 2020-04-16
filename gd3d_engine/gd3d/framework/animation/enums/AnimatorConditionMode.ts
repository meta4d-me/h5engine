namespace gd3d.unity
{
    /**
     * The mode of the condition.
     */
    export enum AnimatorConditionMode
    {
        /**
         * The condition is true when the parameter value is true.
         */
        If,

        /**
         * The condition is true when the parameter value is false.
         */
        IfNot,

        /**
         * The condition is true when parameter value is greater than the threshold.
         */
        Greater,

        /**
         * The condition is true when the parameter value is less than the threshold.
         */
        Less,

        /**
         * The condition is true when parameter value is equal to the threshold.
         */
        Equals,

        /**
         * The condition is true when the parameter value is not equal to the threshold.
         */
        NotEqual,

    }
}