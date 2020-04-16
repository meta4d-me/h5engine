namespace gd3d.framework
{
    /**
     * Structure that represents a state in the context of its parent state machine.
     */
    export class ChildAnimatorState
    {
        /**
         * The position the the state node in the context of its parent state machine.
         */
        position: math.vector3;

        /**
         * The state.
         */
        state: AnimatorState;
    }
}