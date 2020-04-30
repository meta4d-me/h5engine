/// <reference path="./RuntimeAnimatorController.ts" />

namespace gd3d.framework
{
    /**
     * The Animator Controller controls animation through layers with state machines, controlled by parameters.
     */
    export class AnimatorController extends RuntimeAnimatorController
    {
        /**
         * The layers in the controller.
         */
        layers: AnimatorControllerLayer[];

        /**
         * Parameters are used to communicate between scripting and the controller. They are used to drive transitions and blendtrees for example.
         */
        parameters: AnimatorControllerParameter[];

    }
}