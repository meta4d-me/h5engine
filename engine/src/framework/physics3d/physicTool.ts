namespace m4m.framework
{
    /** 
     * tool of physic
     */
    export class physicTool
    {
        static Ivec3Equal(a: math.Ivec3, b: math.Ivec3)
        {
            return a.x == b.x && a.y == b.y && a.z == b.z;
        }

        static Ivec2Equal(a: math.Ivec2, b: math.Ivec2)
        {
            return a.x == b.x && a.y == b.y;
        }

        static IQuatEqual(a: math.Iquat, b: math.Iquat)
        {
            return a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
        }

        static Ivec3Copy(from: math.Ivec3, to: math.Ivec3)
        {
            to.x = from.x;
            to.y = from.y;
            to.z = from.z;
        }

        static Ivec2Copy(from: math.Ivec2, to: math.Ivec2)
        {
            to.x = from.x;
            to.y = from.y;
        }

        static IQuatCopy(from: math.Iquat, to: math.Iquat)
        {
            to.x = from.x;
            to.y = from.y;
            to.z = from.z;
            to.w = from.w;
        }

        static vec3AsArray(vec3: math.vector3)
        {
            let result = [];
            // result[0] = vec3.rawData[0];
            // result[1] = vec3.rawData[1];
            // result[2] = vec3.rawData[2];
            result[0] = vec3.x;
            result[1] = vec3.y;
            result[2] = vec3.z;
            return result;
        }

    }

}