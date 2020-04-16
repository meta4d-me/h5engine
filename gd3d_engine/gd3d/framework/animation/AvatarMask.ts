namespace gd3d.unity
{
    /**
     * AvatarMask is used to mask out humanoid body parts and transforms.
     * 
     * They can be used when importing animation or in an animator controller layer.
     */
    export class AvatarMask
    {
        /**
         * Number of transforms.
         */
        transformCount: number;

        /**
         * Adds a transform path into the AvatarMask.
         * 
         * @param transform The transform to add into the AvatarMask.
         * @param recursive Whether to also add all children of the specified transform.
         */
        AddTransformPath(transform: framework.transform, recursive = true)
        {

        }

        /**
         * Returns true if the humanoid body part at the given index is active.
         * 
         * @param index The index of the humanoid body part.
         */
        GetHumanoidBodyPartActive(index: AvatarMaskBodyPart)
        {

        }

        /**
         * Returns true if the transform at the given index is active.
         * 
         * @param index The index of the transform.
         */
        GetTransformActive(index: number)
        {

        }

        /**
         * Returns the path of the transform at the given index.
         * 
         * @param index The index of the transform.
         */
        GetTransformPath(index: number)
        {

        }

        /**
         * Removes a transform path from the AvatarMask.
         * 
         * @param transform The Transform that should be removed from the AvatarMask.
         * @param recursive Whether to also remove all children of the specified transform.
         */
        RemoveTransformPath(transform: framework.transform, recursive = true)
        {

        }

        /**
         * Sets the humanoid body part at the given index to active or not.
         * 
         * @param index The index of the humanoid body part.
         * @param value Active or not.
         */
        SetHumanoidBodyPartActive(index: AvatarMaskBodyPart, value: boolean)
        {

        }

        /**
         * Sets the tranform at the given index to active or not.
         * 
         * @param index The index of the transform.
         * @param value Active or not.
         */
        SetTransformActive(index: number, value: boolean)
        {

        }

        /**
         * Sets the path of the transform at the given index.
         * 
         * @param index The index of the transform.
         * @param path The path of the transform.
         */
        SetTransformPath(index: number, path: string)
        {

        }

    }
}