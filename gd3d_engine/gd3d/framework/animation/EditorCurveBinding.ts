namespace gd3d.framework
{
    /**
     * Defines how a curve is attached to an object that it controls.
     */
    export class EditorCurveBinding
    {
        /**
         * The transform path of the object that is animated.
         */
        path: string;

        /**
         * The name of the property to be animated.
         */
        propertyName: string;

        /**
         * The type of the property to be animated.
         */
        type: new () => any;

        /**
         * Creates a preconfigured binding for a curve where values should not be interpolated.
         * 
         * @param inPath The transform path to the object to animate.
         * @param inType The type of the object to animate.
         * @param inPropertyName The name of the property to animate on the object.
         */
        static DiscreteCurve(inPath: string, inType: new () => any, inPropertyName: string)
        {

        }

        /**
         * Creates a preconfigured binding for a float curve.
         * 
         * @param inPath The transform path to the object to animate.
         * @param inType The type of the object to animate.
         * @param inPropertyName The name of the property to animate on the object.
         */
        static FloatCurve(inPath: string, inType: new () => any, inPropertyName: string)
        {

        }

        /**
         * Creates a preconfigured binding for a curve that points to an Object.
         * 
         * @param inPath The transform path to the object to animate.
         * @param inType The type of the object to animate.
         * @param inPropertyName The name of the property to animate on the object.
         */
        static PPtrCurve(inPath: string, inType: new () => any, inPropertyName: string)
        {

        }

    }
}