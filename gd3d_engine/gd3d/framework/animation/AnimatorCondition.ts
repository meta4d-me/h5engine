namespace gd3d.framework
{
    /**
     * AnimatorCondition conditions that need to be met for a transition to happen.
     */
    export class AnimatorCondition
    {
        /**
         * The mode of the condition.
         */
        mode: AnimatorConditionMode;

        /**
         * The name of the parameter used in the condition.
         */
        parameter: string;

        /**
         * The AnimatorParameter's threshold value for the condition to be true.
         */
        threshold: number;
    }
}