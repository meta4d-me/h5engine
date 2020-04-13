namespace gd3d.unity
{
    /**
     * StateMachineBehaviour is a component that can be added to a state machine state. It's the base class every script on a state derives from.
     */
    export class StateMachineBehaviour
    {
        /**
         * Called on the first Update frame when making a transition to a state machine. This is not called when making a transition into a state machine sub-state.
         * 
         * @param animator The Animator playing this state machine.
         * @param stateMachinePathHash The full path hash for this state machine.
         */
        OnStateMachineEnter(animator: Animator, stateMachinePathHash: number)
        {

        }

        /**
         * Called on the last Update frame when making a transition out of a StateMachine. This is not called when making a transition into a StateMachine sub-state.
         * 
         * @param animator The Animator playing this state machine.
         * @param stateMachinePathHash The full path hash for this state machine.
         */
        OnStateMachineExit(animator: Animator, stateMachinePathHash: number)
        {

        }

        /**
         * Called on the first Update frame when a state machine evaluate this state.
         */
        OnStateEnter(animator: Animator, animatorStateInfo: AnimatorStateInfo, layerIndex: number)
        {

        }

        /**
         * Called on the last update frame when a state machine evaluate this state.
         */
        OnStateExit(animator: Animator, animatorStateInfo: AnimatorStateInfo, layerIndex: number)
        {

        }

        /**
         * Called right after MonoBehaviour.OnAnimatorIK.
         */
        OnStateIK(animator: Animator, animatorStateInfo: AnimatorStateInfo, layerIndex: number)
        {

        }

        /**
         * Called right after MonoBehaviour.OnAnimatorMove.
         */
        OnStateMove(animator: Animator, animatorStateInfo: AnimatorStateInfo, layerIndex: number)
        {

        }

        /**
         * Called at each Update frame except for the first and last frame.
         */
        OnStateUpdate(animator: Animator, animatorStateInfo: AnimatorStateInfo, layerIndex: number)
        {

        }

    }
}