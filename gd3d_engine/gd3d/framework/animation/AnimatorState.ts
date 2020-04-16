namespace gd3d.unity
{
    /**
     * States are the basic building blocks of a state machine. Each state contains a Motion ( AnimationClip or BlendTree) which will play while the character is in that state. When an event in the game triggers a state transition, the character will be left in a new state whose animation sequence will then take over.
     */
    export class AnimatorState
    {
        /**
         * The Behaviour list assigned to this state.
         */
        behaviours: StateMachineBehaviour[];

        /**
         * Offset at which the animation loop starts. Useful for synchronizing looped animations. Units is normalized time.
         */
        cycleOffset: number;

        /**
         * The animator controller parameter that drives the cycle offset value.
         */
        cycleOffsetParameter: string;

        /**
         * Define if the cycle offset value is driven by an Animator controller parameter or by the value set in the editor.
         */
        cycleOffsetParameterActive: boolean;

        /**
         * Should Foot IK be respected for this state.
         */
        iKOnFeet: boolean;

        /**
         * Should the state be mirrored.
         */
        mirror: boolean;

        /**
         * The animator controller parameter that drives the mirror value.
         */
        mirrorParameter: string;

        /**
         * Define if the mirror value is driven by an Animator controller parameter or by the value set in the editor.
         */
        mirrorParameterActive: boolean;

        /**
         * The motion assigned to this state.
         */
        motion: Motion;

        /**
         * The hashed name of the state.
         */
        nameHash: number;

        /**
         * The default speed of the motion.
         */
        speed: number;

        /**
         * The animator controller parameter that drives the speed value.
         */
        speedParameter: string;

        /**
         * Define if the speed value is driven by an Animator controller parameter or by the value set in the editor.
         */
        speedParameterActive: boolean;

        /**
         * A tag can be used to identify a state.
         */
        tag: string;

        /**
         * If timeParameterActive is true, the value of this Parameter will be used instead of normalized time.
         */
        timeParameter: string;

        /**
         * If true, use value of given Parameter as normalized time.
         */
        timeParameterActive: boolean;

        /**
         * The transitions that are going out of the state.
         */
        transitions: AnimatorStateTransition[];

        /**
         * Whether or not the AnimatorStates writes back the default values for properties that are not animated by its Motion.
         */
        writeDefaultValues: boolean;


        /**
         * Utility function to add an outgoing transition to the exit of the state's parent state machine.
         * 
         * @param defaultExitTime If true, the exit time will be the equivalent of 0.25 second.
         */
        AddExitTransition(defaultExitTime: boolean)
        {

        }

        /**
         * Adds a state machine behaviour class of type stateMachineBehaviourType to the AnimatorState. C# Users can use a generic version.
         */
        AddStateMachineBehaviour(stateMachineBehaviourType: new () => any)
        {

        }

        /**
         * Utility function to add an outgoing transition to the destination state.
         * 
         * @param destinationState The destination state | machine.
         * @param defaultExitTime If true, the exit time will be the equivalent of 0.25 second.
         */
        AddTransition(destinationState: AnimatorState | AnimatorStateMachine | AnimatorStateTransition, defaultExitTime: boolean)
        {

        }

        /**
         * Utility function to remove a transition from the state.
         * 
         * @param transition Transition to remove.
         */
        RemoveTransition(transition: AnimatorStateTransition)
        {
            this.transitions = this.transitions.filter(v => v != transition);
        }

    }
}