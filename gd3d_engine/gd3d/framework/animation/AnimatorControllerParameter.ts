namespace gd3d.unity
{
    /**
     * Used to communicate between scripting and the controller. Some parameters can be set in scripting and used by the controller, while other parameters are based on Custom Curves in Animation Clips and can be sampled using the scripting API.
     */
    export class AnimatorControllerParameter
    {
        /**
         * The default bool value for the parameter.
         */
        defaultBool: boolean;

        /**
         * The default float value for the parameter.
         */
        defaultFloat: number;

        /**
         * The default int value for the parameter.
         */
        defaultInt: number;

        /**
         * The name of the parameter.
         */
        name: string;

        /**
         * Returns the hash of the parameter based on its name.
         */
        nameHash: number;

        /**
         * The type of the parameter.
         */
        type: AnimatorControllerParameterType;

    }
}