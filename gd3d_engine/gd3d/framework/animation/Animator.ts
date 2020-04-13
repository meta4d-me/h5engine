namespace gd3d.unity
{
    export type Constructor<T> = (new (...args) => T);
    
    export class Animator
    {

        /**
         * Gets the avatar angular velocity for the last evaluated frame.
         */
        angularVelocity: math.vector3;

        /**
         * Should root motion be applied?
         */
        applyRootMotion: boolean;

        /**
         * Gets/Sets the current Avatar.
         */
        avatar: Avatar;

        /**
         * The position of the body center of mass.
         */
        bodyPosition: math.vector3;

        /**
         * The rotation of the body center of mass.
         */
        bodyRotation: math.quaternion;

        /**
         * Controls culling of this Animator component.
         */
        cullingMode: AnimatorCullingMode;

        /**
         * Gets the avatar delta position for the last evaluated frame.
         */
        deltaPosition: math.vector3;

        /**
         * Gets the avatar delta rotation for the last evaluated frame.
         */
        deltaRotation: math.quaternion;

        /**
         * Blends pivot point between body center of mass and feet pivot.
         */
        feetPivotActive: number;

        /**
         * Sets whether the Animator sends events of type AnimationEvent.
         */
        fireEvents: boolean;

        /**
         * The current gravity weight based on current animations that are played.
         */
        gravityWeight: number;

        /**
         * Returns true if Animator has any playables assigned to it.
         */
        hasBoundPlayables: boolean;

        /**
         * Returns true if the current rig has root motion.
         */
        hasRootMotion: boolean;

        /**
         * Returns true if the object has a transform hierarchy.
         */
        hasTransformHierarchy: boolean;

        /**
         * Returns the scale of the current Avatar for a humanoid rig, (1 by default if the rig is generic).
         */
        humanScale: number;

        /**
         * Returns true if the current rig is humanoid, false if it is generic.
         */
        isHuman: boolean;

        /**
         * Returns whether the animator is initialized successfully.
         */
        isInitialized: boolean;

        /**
         * If automatic matching is active.
         */
        isMatchingTarget: boolean;

        /**
         * Returns true if the current rig is optimizable with AnimatorUtility.OptimizeTransformHierarchy.
         */
        isOptimizable: boolean;

        /**
         * Controls the behaviour of the Animator component when a GameObject is disabled.
         */
        keepAnimatorControllerStateOnDisable: boolean;

        /**
         * Returns the number of layers in the controller.
         */
        layerCount: number;

        /**
         * Additional layers affects the center of mass.
         */
        layersAffectMassCenter: boolean;

        /**
         * Get left foot bottom height.
         */
        leftFeetBottomHeight: number;

        /**
         * Returns the number of parameters in the controller.
         */
        parameterCount: number;

        /**
         * The AnimatorControllerParameter list used by the animator. (Read Only)
         */
        parameters: AnimatorControllerParameter[];

        /**
         * Get the current position of the pivot.
         */
        pivotPosition: math.vector3;

        /**
         * Gets the pivot weight.
         */
        pivotWeight: number;

        /**
         * The PlayableGraph created by the Animator.
         */
        playableGraph: PlayableGraph;

        /**
         * Sets the playback position in the recording buffer.
         */
        playbackTime: number;

        /**
         * Gets the mode of the Animator recorder.
         */
        recorderMode: AnimatorRecorderMode;

        /**
         * Start time of the first frame of the buffer relative to the frame at which StartRecording was called.
         */
        recorderStartTime: number;

        /**
         * End time of the recorded clip relative to when StartRecording was called.
         */
        recorderStopTime: number;

        /**
         * Get right foot bottom height.
         */
        rightFeetBottomHeight: number;

        /**
         * The root position, the position of the game object.
         */
        rootPosition: math.vector3;

        /**
         * The root rotation, the rotation of the game object.
         */
        rootRotation: math.quaternion;

        /**
         * The runtime representation of AnimatorController that controls the Animator.
         */
        runtimeAnimatorController: RuntimeAnimatorController;

        /**
         * The playback speed of the Animator. 1 is normal playback speed.
         */
        speed: number;

        /**
         * Automatic stabilization of feet during transition and blending.
         */
        stabilizeFeet: boolean;

        /**
         * Returns the position of the target specified by SetTarget.
         */
        targetPosition: math.vector3;

        /**
         * Returns the rotation of the target specified by SetTarget.
         */
        targetRotation: math.quaternion;

        /**
         * Specifies the update mode of the Animator.
         */
        updateMode: AnimatorUpdateMode;

        /**
         * Gets the avatar velocity for the last evaluated frame.
         */
        velocity: math.vector3;

        /**
         * Apply the default Root Motion.
         * 
         * @param stateName 	The name of the state.
         * @param normalizedTransitionDuration The duration of the transition (normalized).
         * @param layer The layer where the crossfade occurs.
         * @param normalizedTimeOffset The time of the state (normalized).
         * @param normalizedTransitionTime The time of the transition (normalized).
         */
        ApplyBuiltinRootMotion(stateName: string, normalizedTransitionDuration: number, layer = -1, normalizedTimeOffset = Number.MIN_SAFE_INTEGER, normalizedTransitionTime = 0.0)
        {

        }

        /**
         * Creates a crossfade from the current state to any other state using normalized times.
         * 
         * @param stateName The name of the state.
         * @param normalizedTransitionDuration The duration of the transition (in seconds).
         * @param layer The layer where the crossfade occurs.
         * @param normalizedTimeOffset The time of the state (in seconds).
         * @param normalizedTransitionTime The time of the transition (normalized).
         */
        CrossFade(stateName: string, normalizedTransitionDuration: number, layer = -1, normalizedTimeOffset = Number.MIN_SAFE_INTEGER, normalizedTransitionTime = 0.0)
        {

        }

        /**
         * Creates a crossfade from the current state to any other state using times in seconds.
         * 
         * @param stateName The name of the state.
         * @param fixedTransitionDuration The duration of the transition (in seconds).
         * @param layer The layer where the crossfade occurs.
         * @param fixedTimeOffset The time of the state (in seconds).
         * @param normalizedTransitionTime The time of the transition (normalized).
         */
        CrossFadeInFixedTime(stateName: String, fixedTransitionDuration: number, layer = -1, fixedTimeOffset = 0.0, normalizedTransitionTime = 0.0)
        {

        }

        /**
         * Returns an AnimatorTransitionInfo with the informations on the current transition.
         * 
         * @param layerIndex The layer's index.
         */
        GetAnimatorTransitionInfo(layerIndex: number)
        {

        }

        /**
         * Returns the first StateMachineBehaviour that matches type T or is derived from T. Returns null if none are found.
         */
        GetBehaviour<T extends StateMachineBehaviour>(type: Constructor<T>): T
        {
            return null;
        }

        /**
         * Returns all StateMachineBehaviour that match type T or are derived from T. Returns null if none are found.
         */
        GetBehaviours<T extends StateMachineBehaviour>(type: Constructor<T>): T[]
        {
            return null;
        }

        /**
         * Returns Transform mapped to this human bone id.
         * 
         * @param humanBoneId The human bone that is queried, see enum HumanBodyBones for a list of possible values.
         */
        GetBoneTransform(humanBoneId: HumanBodyBones)
        {

        }

        /**
         * Returns the value of the given boolean parameter.
         * 
         * @param name The parameter name.
         */
        GetBool(name: string)
        {
            return false;
        }

        /**
         * Returns an array of all the AnimatorClipInfo in the current state of the given layer.
         * 
         * @param layerIndex The layer index.
         */
        GetCurrentAnimatorClipInfo(layerIndex: number): AnimatorClipInfo[]
        {
            return null;
        }

        /**
         * Returns the number of AnimatorClipInfo in the current state.
         */
        GetCurrentAnimatorClipInfoCount(layerIndex: number)
        {
            return 0;
        }

        /**
         * Returns an AnimatorStateInfo with the information on the current state.
         */
        GetCurrentAnimatorStateInfo(layerIndex: number): AnimatorStateInfo
        {
            return null;
        }

        /**
         * Returns the value of the given float parameter.
         */
        GetFloat(name: string)
        {
            return 0;
        }

        /**
         * Gets the position of an IK hint.
         * 
         * @param hint The AvatarIKHint that is queried.
         * 
         * @returns Vector3 Return the current position of this IK hint in world space.
         */
        GetIKHintPosition(hint: AvatarIKHint): math.vector3
        {
            return null;
        }

        /**
         * Gets the translative weight of an IK Hint (0 = at the original animation before IK, 1 = at the hint).
         * 
         * @param hint The AvatarIKHint that is queried.
         */
        GetIKHintPositionWeight(hint: AvatarIKHint)
        {
            return 0;
        }

        /**
         * Gets the position of an IK goal.
         * 
         * @param goal The AvatarIKGoal that is queried.
         */
        GetIKPosition(goal: AvatarIKGoal): math.vector3
        {
            return null;
        }

        /**
         * Gets the translative weight of an IK goal (0 = at the original animation before IK, 1 = at the goal).
         * 
         * @param goal The AvatarIKGoal that is queried.
         */
        GetIKPositionWeight(goal: AvatarIKGoal)
        {

        }

        /**
         * Gets the rotation of an IK goal.
         * 
         * @param goal The AvatarIKGoal that is is queried.
         */
        GetIKRotation(goal: AvatarIKGoal)
        {

        }

        /**
         * Gets the rotational weight of an IK goal (0 = rotation before IK, 1 = rotation at the IK goal).
         * 
         * @param goal The AvatarIKGoal that is is queried.
         */
        GetIKRotationWeight(goal: AvatarIKGoal)
        {

        }

        /**
         * Returns the value of the given integer parameter.
         * 
         * @param name The parameter name.
         */
        GetInteger(name: string)
        {
            return 0;
        }

        /**
         * Returns the index of the layer with the given name.
         * 
         * @param layerName The layer name.
         */
        GetLayerIndex(layerName: string)
        {

        }

        /**
         * Returns the layer name.
         * 
         * @param layerIndex The layer index.
         */
        GetLayerName(layerIndex: number)
        {

        }

        /**
         * Returns the weight of the layer at the specified index.
         * 
         * @param layerIndex The layer index.
         */
        GetLayerWeight(layerIndex: number)
        {

        }

        /**
         * Returns an array of all the AnimatorClipInfo in the next state of the given layer.
         * 
         * @param layerIndex The layer index.
         */
        GetNextAnimatorClipInfo(layerIndex: number): AnimatorClipInfo[]
        {
            return null;
        }

        /**
         * Returns the number of AnimatorClipInfo in the next state.
         * 
         * @param layerIndex The layer index.
         */
        GetNextAnimatorClipInfoCount(layerIndex: number)
        {
            return 0;
        }

        /**
         * Returns an AnimatorStateInfo with the information on the next state.
         */
        GetNextAnimatorStateInfo(layerIndex: number): AnimatorStateInfo
        {
            return null;
        }

        /**
         * See AnimatorController.parameters.
         */
        GetParameter(index: number): AnimatorControllerParameter
        {
            return null;
        }

        /**
         * Returns true if the state exists in this layer, false otherwise.
         * 
         * @param layerIndex The layer index.
         * @param stateID The state ID.
         */
        HasState(layerIndex: number, stateID: number)
        {
            return false;
        }

        /**
         * Interrupts the automatic target matching.
         * 
         * CompleteMatch will make the gameobject match the target completely at the next frame.
         */
        InterruptMatchTarget(completeMatch = true)
        {

        }

        /**
         * Returns true if there is a transition on the given layer, false otherwise.
         * 
         * @param layerIndex The layer index.
         */
        IsInTransition(layerIndex: number)
        {

        }

        /**
         * Returns true if the parameter is controlled by a curve, false otherwise.
         * 
         * @param name The parameter name.
         * 
         * @returns True if the parameter is controlled by a curve, false otherwise.
         */
        IsParameterControlledByCurve(name: string)
        {

        }

        /**
         * Automatically adjust the GameObject position and rotation.
         * 
         * @param matchPosition The position we want the body part to reach.
         * @param matchRotation The rotation in which we want the body part to be.
         * @param targetBodyPart The body part that is involved in the match.
         * @param weightMask Structure that contains weights for matching position and rotation.
         * @param startNormalizedTime Start time within the animation clip (0 - beginning of clip, 1 - end of clip).
         * @param targetNormalizedTime End time within the animation clip (0 - beginning of clip, 1 - end of clip), values greater than 1 can be set to trigger a match after a certain number of loops. Ex: 2.3 means at 30% of 2nd loop.
         */
        MatchTarget(matchPosition: math.vector3, matchRotation: math.quaternion, targetBodyPart: AvatarTarget, weightMask: MatchTargetWeightMask, startNormalizedTime: number, targetNormalizedTime = 1)
        {

        }

        /**
         * Plays a state.
         * 
         * @param stateName The state name.
         * @param layer The layer index. If layer is -1, it plays the first state with the given state name or hash.
         * @param normalizedTime The time offset between zero and one.
         */
        Play(stateName: string, layer = -1, normalizedTime = Number.MIN_SAFE_INTEGER)
        {

        }

        /**
         * Plays a state.
         * 
         * @param stateName The state name.
         * @param layer The layer index. If layer is -1, it plays the first state with the given state name or hash.
         * @param fixedTime The time offset (in seconds).
         */
        PlayInFixedTime(stateName: string, layer = -1, fixedTime = Number.MIN_SAFE_INTEGER)
        {

        }

        /**
         * Rebind all the animated properties and mesh data with the Animator.
         */
        Rebind()
        {

        }

        /**
         * Resets the value of the given trigger parameter.
         * 
         * @param name The parameter name.
         */
        ResetTrigger(name: string)
        {

        }

        /**
         * Sets local rotation of a human bone during a IK pass.
         * 
         * @param humanBoneId The human bone Id.
         * @param rotation The local rotation.
         */
        SetBoneLocalRotation(humanBoneId: HumanBodyBones, rotation: math.quaternion)
        {

        }

        /**
         * Sets the value of the given boolean parameter.
         * 
         * @param name The parameter name.
         * @param value The new parameter value.
         */
        SetBool(name: string, value: boolean)
        {

        }

        /**
         * Send float values to the Animator to affect transitions.
         * 
         * @param name The parameter name.
         * @param value The new parameter value.
         * @param dampTime The damper total time.
         * @param deltaTime The delta time to give to the damper.
         */
        SetFloat(name: string, value: number, dampTime: number, deltaTime: number)
        {

        }

        /**
         * Sets the position of an IK hint.
         * 
         * @param hint The AvatarIKHint that is set.
         * @param hintPosition The position in world space.
         */
        SetIKHintPosition(hint: AvatarIKHint, hintPosition: math.vector3)
        {

        }

        /**
         * Sets the translative weight of an IK hint (0 = at the original animation before IK, 1 = at the hint).
         * 
         * @param hint The AvatarIKHint that is set.
         * @param value The translative weight.
         */
        SetIKHintPositionWeight(hint: AvatarIKHint, value: number)
        {

        }

        /**
         * Sets the position of an IK goal.
         * 
         * @param goal The AvatarIKGoal that is set.
         * @param goalPosition The position in world space.
         */
        SetIKPosition(goal: AvatarIKGoal, goalPosition: math.vector3)
        {

        }

        /**
         * Sets the translative weight of an IK goal (0 = at the original animation before IK, 1 = at the goal).
         * 
         * @param goal The AvatarIKGoal that is set.
         * @param value The translative weight.
         */
        SetIKPositionWeight(goal: AvatarIKGoal, value: number)
        {

        }

        /**
         * Sets the rotation of an IK goal.
         * 
         * @param goal The AvatarIKGoal that is set.
         * @param goalRotation The rotation in world space.
         */
        SetIKRotation(goal: AvatarIKGoal, goalRotation: math.quaternion)
        {

        }

        /**
         * Sets the rotational weight of an IK goal (0 = rotation before IK, 1 = rotation at the IK goal).
         * 
         * @param goal The AvatarIKGoal that is set.
         * @param value The rotational weight.
         */
        SetIKRotationWeight(goal: AvatarIKGoal, value: number)
        {

        }

        /**
         * Sets the value of the given integer parameter.
         * 
         * @param name The parameter name.
         * @param value The new parameter value.
         */
        SetInteger(name: string, value: number)
        {

        }

        /**
         * Sets the weight of the layer at the given index.
         * 
         * @param layerIndex The layer index.
         * @param weight The new layer weight.
         */
        SetLayerWeight(layerIndex: number, weight: number)
        {

        }

        /**
         * Sets the look at position.
         * 
         * @param lookAtPosition The position to lookAt.
         */
        SetLookAtPosition(lookAtPosition: math.vector3)
        {

        }

        /**
         * Set look at weights.
         * 
         * @param weight (0-1) the global weight of the LookAt, multiplier for other parameters.
         * @param bodyWeight (0-1) determines how much the body is involved in the LookAt.
         * @param headWeight (0-1) determines how much the head is involved in the LookAt.
         * @param eyesWeight (0-1) determines how much the eyes are involved in the LookAt.
         * @param clampWeight (0-1) 0.0 means the character is completely unrestrained in motion, 1.0 means he's completely clamped (look at becomes impossible), and 0.5 means he'll be able to move on half of the possible range (180 degrees).
         */
        SetLookAtWeight(weight: number, bodyWeight = 0.0, headWeight = 1.0, eyesWeight = 0.0, clampWeight = 0.5)
        {

        }

        /**
         * Sets an AvatarTarget and a targetNormalizedTime for the current state.
         * 
         * @param targetIndex The avatar body part that is queried.
         * @param targetNormalizedTime The current state Time that is queried.
         */
        SetTarget(targetIndex: AvatarTarget, targetNormalizedTime: number)
        {

        }

        /**
         * Sets the value of the given trigger parameter.
         * 
         * @param name The parameter name.
         */
        SetTrigger(name: string)
        {

        }

        /**
         * Sets the animator in playback mode.
         */
        StartPlayback()
        {

        }

        /**
         * Sets the animator in recording mode, and allocates a circular buffer of size frameCount.
         */
        StartRecording(frameCount: number)
        {

        }

        /**
         * Stops the animator playback mode. When playback stops, the avatar resumes getting control from game logic.
         */
        StopPlayback()
        {

        }

        /**
         * Stops animator record mode.
         */
        StopRecording()
        {

        }

        /**
         * Evaluates the animator based on deltaTime.
         */
        Update(deltaTime: number)
        {

        }

        /**
         * Forces a write of the default values stored in the animator.
         */
        WriteDefaultValues()
        {

        }

        /**
         * Generates an parameter id from a string.
         */
        static StringToHash(name: string)
        {

        }
    }
}