namespace gd3d.unity
{
    /**
     * Options for how to send a message.
     * 
     * This is used by SendMessage & BroadcastMessage in GameObject & Component.
     */
    export enum SendMessageOptions
    {
        /**
         * A receiver is required for SendMessage.
         */
        RequireReceiver,

        /**
         * No receiver is required for SendMessage.
         */
        DontRequireReceiver,

    }
}