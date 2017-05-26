namespace gd3d.framework
{
    export class StringUtil
    {
        public static COMPONENT_CAMERA = "camera";
        public static COMPONENT_BOXCOLLIDER = "boxcollider";
        public static COMPONENT_LIGHT = "light";
        public static COMPONENT_MESHFILTER = "meshFilter";
        public static COMPONENT_MESHRENDER = "meshRenderer";
        public static COMPONENT_EFFECTSYSTEM = "effectSystem";
        public static COMPONENT_LABEL = "label";
        public static COMPONENT_IMAGE = "image2D";
        public static COMPONENT_RAWIMAGE = "rawImage2D";
        public static COMPONENT_BUTTON = "button";




        public static COMPONENT_SKINMESHRENDER = "skinnedMeshRenderer";

        public static COMPONENT_CAMERACONTROLLER = "cameraController";
        public static COMPONENT_CANVASRENDER = "canvasRenderer";

        public static UIStyle_RangeFloat = "rangeFloat";
        public static UIStyle_Enum = "enum";




        public static RESOURCES_MESH_CUBE = "cube";

        static replaceAll(srcStr: string, fromStr: string, toStr: string)
        {
            return srcStr.replace(new RegExp(fromStr, 'gm'), toStr);
        }

        static trimAll(str: string)
        {
            str += "";//可能传进来number，number没有replace方法
            var result = str.replace(/(^\s+)|(\s+$)/g, "");
            result = result.replace(/\s/g, "");
            return result;
        }

        static firstCharToLowerCase(str: string)
        {
            let firstChar = str.substr(0, 1).toLowerCase();
            let other = str.substr(1);
            return firstChar + other;
        }
    }

}