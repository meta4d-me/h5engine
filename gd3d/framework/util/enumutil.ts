namespace gd3d.framework
{
    export class EnumUtil
    {
        static getEnumObjByType(enumType: string): any
        {
            let index = enumType.indexOf("gd3d.framework.");
            if (index == 0)
                enumType = enumType.substr(15);

            return eval("{result:" + enumType + "}");
        }
    }
}