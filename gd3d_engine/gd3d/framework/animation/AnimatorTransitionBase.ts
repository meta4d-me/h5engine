namespace gd3d.framework
{
    /**
     * Base class for animator transitions. Transitions define when and how the state machine switches from one state to another.
     * 
     * A transition happens when all its conditions are met.
     */
    export class AnimatorTransitionBase
    {
        /**
         * AnimatorCondition conditions that need to be met for a transition to happen.
         */
        conditions: AnimatorCondition[];

        /**
         * The destination state of the transition.
         */
        destinationState: AnimatorState;

        /**
         * The destination state machine of the transition.
         */
        destinationStateMachine: AnimatorStateMachine;

        /**
         * Is the transition destination the exit of the current state machine.
         */
        isExit: boolean;

        /**
         * Mutes the transition. The transition will never occur.
         */
        mute: boolean;

        /**
         * Mutes all other transitions in the source state.
         */
        solo: boolean;

        /**
         * Utility function to add a condition to a transition.
         * 
         * @param mode The AnimatorCondition mode of the condition.
         * @param threshold The threshold value of the condition.
         * @param parameter The name of the parameter.
         */
        AddCondition(mode: AnimatorConditionMode, threshold: number, parameter: string)
        {
            var condition = new AnimatorCondition();
            condition.mode = mode;
            condition.threshold = threshold;
            condition.parameter = parameter;
            this.conditions.push(condition);
        }

        /**
         * Utility function to remove a condition from the transition.
         * 
         * @param condition The condition to remove.
         */
        RemoveCondition(condition: AnimatorCondition)
        {
            this.conditions = this.conditions.filter(v => v != condition);
        }

    }
}