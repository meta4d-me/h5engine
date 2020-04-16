/// <reference path="./AnimatorTransitionBase.ts" />

namespace gd3d.framework
{
    /**
     * Transitions define when and how the state machine switch from one state to another. AnimatorStateTransition always originate from an Animator State (or AnyState) and have timing parameters.
     * 
     * A transition happens when all its conditions are met. AnimatorStateTransition derives from AnimatorTransitionBase.
     */
    export class AnimatorStateTransition extends AnimatorTransitionBase
    {
        /**
         * Set to true to allow or disallow transition to self during AnyState transition.
         */
        canTransitionToSelf: boolean;

        /**
         * The duration of the transition.
         */
        duration: number;

        /**
         * If AnimatorStateTransition.hasExitTime is true, exitTime represents the exact time at which the transition can take effect. This is represented in normalized time, so for example an exit time of 0.75 means that on the first frame where 75% of the animation has played, the Exit Time condition will be true. On the next frame, the condition will be false. For looped animations, transitions with exit times smaller than 1 will be evaluated every loop, so you can use this to time your transition with the proper timing in the animation, every loop. Transitions with exit times greater than one will be evaluated only once, so they can be used to exit at a specific time, after a fixed number of loops. For example, a transition with an exit time of 3.5 will be evaluated once, after three and a half loops.
         */
        exitTime: number;

        /**
         * When active the transition will have an exit time condition.
         */
        hasExitTime: boolean;

        /**
         * Determines whether the duration of the transition is reported in a fixed duration in seconds or as a normalized time.
         */
        hasFixedDuration: boolean;

        /**
         * Which AnimatorState transitions can interrupt the Transition.
         */
        interruptionSource: TransitionInterruptionSource;

        /**
         * The time at which the destination state will start.
         */
        offset: number;

        /**
         * The Transition can be interrupted by a transition that has a higher priority.
         */
        orderedInterruption: boolean;

    }
}