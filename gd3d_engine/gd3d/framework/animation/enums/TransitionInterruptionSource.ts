namespace gd3d.unity
{
    /**
     * Which AnimatorState transitions can interrupt the Transition.
     */
    export enum TransitionInterruptionSource
    {
        /**
         * The Transition cannot be interrupted. Formely know as Atomic.
         */
        None,

        /**
         * The Transition can be interrupted by transitions in the source AnimatorState.
         */
        Source,

        /**
         * The Transition can be interrupted by transitions in the destination AnimatorState.
         */
        Destination,

        /**
         * The Transition can be interrupted by transitions in the source or the destination AnimatorState.
         */
        SourceThenDestination,

        /**
         * The Transition can be interrupted by transitions in the source or the destination AnimatorState.
         */
        DestinationThenSource,
    }
}