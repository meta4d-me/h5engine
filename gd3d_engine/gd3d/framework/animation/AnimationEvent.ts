namespace gd3d.unity
{
    /**
     * AnimationEvent lets you call a script function similar to SendMessage as part of playing back an animation.
     * 
     * Animation events support functions that take zero or one parameter. The parameter can be a float, an int, a string, an object reference, or an AnimationEvent.
     */
    export class AnimationEvent
    {
        /**
         * The animation state that fired this event (Read Only).
         */
        animationState: AnimationState;

        /**
         * The animator clip info related to this event (Read Only).
         */
        animatorClipInfo: AnimatorClipInfo;

        /**
         * The animator state info related to this event (Read Only).
         */
        animatorStateInfo: AnimatorStateInfo;

        /**
         * Float parameter that is stored in the event and will be sent to the function.
         */
        floatParameter: number;

        /**
         * The name of the function that will be called.
         */
        functionName: string;

        /**
         * Int parameter that is stored in the event and will be sent to the function.
         */
        intParameter: number;

        /**
         * Returns true if this Animation event has been fired by an Animator component.
         */
        isFiredByAnimator: boolean;

        /**
         * Returns true if this Animation event has been fired by an Animation component.
         */
        isFiredByLegacy: boolean;

        /**
         * Function call options.
         */
        messageOptions: SendMessageOptions;

        /**
         * Object reference parameter that is stored in the event and will be sent to the function.
         */
        objectReferenceParameter: Object;

        /**
         * String parameter that is stored in the event and will be sent to the function.
         */
        stringParameter: string;

        /**
         * The time at which the event will be fired off.
         */
        time: number;

    }
}