namespace gd3d.unity
{
    /**
     * Structure that represents a state machine in the context of its parent state machine.
     */
    export class ChildAnimatorStateMachine
    {
        /**
         * The position the the state machine node in the context of its parent state machine.
         */
        position: math.vector3;

        /**
         * The state machine.
         */
        stateMachine: AnimatorStateMachine;
    }
}