/// <reference path="../../io/reflect.ts" />

namespace gd3d.io
{
    export function cloneObj(instanceObj: any, clonedObj: any = undefined): any
    {
        //过滤掉不需要序列化的对象
        let _flag: gd3d.framework.HideFlags = gd3d.framework.HideFlags.None;
        let _type: string;
        if (instanceObj["__gdmeta__"] && instanceObj["__gdmeta__"]["class"])
        {
            _type = reflect.getClassName(instanceObj);
        }
        if (_type == "transform")
        {
            _flag = instanceObj["gameObject"].hideFlags;
        }
        else if (_type == "transform2D")
        {
            _flag = instanceObj.hideFlags;
        }
        if ((_flag & gd3d.framework.HideFlags.DontSaveInBuild) || (_flag & gd3d.framework.HideFlags.DontSaveInEditor) || (_flag & gd3d.framework.HideFlags.HideInHierarchy))
        {
            return null;
        }

        if (clonedObj == undefined)
        {
            clonedObj = reflect.createInstance(instanceObj, null);
        }
        for (let key in instanceObj["__gdmeta__"])
        {
            let t = instanceObj["__gdmeta__"][key];

            if (t["custom"] == null)
                continue;
            if (t["custom"]["SerializeField"] == null && t["custom"]["nodecomp"] == null && t["custom"]["2dcomp"] == null)
                continue;
            let valueType: string = t["custom"]["valueType"];
            if (valueType == null)
            {
                continue;
            }

            //基本类型和定义为SerializeType的类型才会关心
            switch (valueType.toLowerCase())
            {
                case "number":
                case "string":
                case "boolean":
                    clonedObj[key] = instanceObj[key];
                    break;
                default:
                    cloneOtherTypeOrArray(instanceObj, clonedObj, key);
                    break;
            }
        }
        return clonedObj;
    }

    export function cloneOtherTypeOrArray(instanceObj: any, clonedObj: any, key: string)
    {
        if (instanceObj[key])
        {
            if (instanceObj[key]["__gdmeta__"])
            {
                cloneOtherType(instanceObj, clonedObj, key);
            }
            else if (instanceObj["__gdmeta__"][key] && instanceObj["__gdmeta__"][key]["custom"] && instanceObj["__gdmeta__"][key]["custom"]["valueType"])
            {
                let isArray: boolean = instanceObj[key] instanceof Array;
                if (isArray)
                    clonedObj[key] = [];
                else
                    clonedObj[key] = {};

                for (var newkey in instanceObj[key])
                {
                    let field = instanceObj[key][newkey];
                   
                    if (field&&field["__gdmeta__"])
                    {
                        let _meta = field["__gdmeta__"];
                        if (_meta["class"] && _meta["class"]["typename"] == "UniformData" && field.type == 3)
                        {
                            //排除掉Matrix类型的序列化
                        }
                        else
                        {
                            cloneOtherType(instanceObj[key], clonedObj[key], newkey, instanceObj, clonedObj, key);
                        }
                    }
                    else
                    {
                        //如果数组是int、string、boolean。
                        if (!instanceObj[key]["__gdmeta__"])
                        {
                            let baseType: string = typeof (field);
                            switch (baseType.toLowerCase())
                            {
                                case "number":
                                case "string":
                                case "boolean":
                                    if (isArray)
                                    {
                                        clonedObj[key].push(field);
                                    }
                                    else
                                    {
                                        clonedObj[key][newkey] = field;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    export function cloneOtherType(instanceObj: any, clonedObj: any, key: string, instanceParent: any = null, clonedParent: any = null, instanceKey: string = "")
    {
        let _meta = instanceObj[key]["__gdmeta__"];
        if (_meta["class"] && _meta["class"]["custom"] && (_meta["class"]["custom"]["SerializeType"] || _meta["class"]["custom"]["nodecomp"] || _meta["class"]["custom"]["2dcomp"]))
        {
            let isArray: boolean = instanceObj instanceof Array;

            let type: string = _meta["class"]["typename"];
            if (isAsset(type))
            {
                let _defaultAsset: boolean = instanceObj[key].defaultAsset;
                if (isArray)
                {
                    clonedObj.push(instanceObj[key]);
                }
                else
                {
                    clonedObj[key] = instanceObj[key];
                }
            }
            else
            {
                let isreference = false;
                if ((isArray && instanceParent["__gdmeta__"] && instanceParent["__gdmeta__"]["class"] && instanceParent["__gdmeta__"]["class"]["custom"] && (instanceParent["__gdmeta__"]["class"]["custom"]["nodecomp"] || instanceParent["__gdmeta__"]["class"]["custom"]["2dcomp"])) ||
                    (!isArray && instanceObj["__gdmeta__"] && instanceObj["__gdmeta__"]["class"] && instanceObj["__gdmeta__"]["class"]["custom"] && (instanceObj["__gdmeta__"]["class"]["custom"]["nodecomp"] || instanceObj["__gdmeta__"]["class"]["custom"]["2dcomp"])))
                {
                    //当前instance是组件
                    if (_meta["class"]["custom"]["nodecomp"] || _meta["class"]["custom"]["2dcomp"] || type == "transform" || type == "transform2D")
                    {
                        isreference = true;
                    }
                }
                if (isreference)
                {
                    if (isArray)
                    {
                        clonedObj.push(instanceObj[key]);
                    }
                    else
                    {
                        clonedObj[key] = instanceObj[key];
                    }
                }
                else
                {
                    let _clonedObj;
                    if (_meta["class"]["custom"]["selfclone"])
                    {
                        _clonedObj = instanceObj[key].clone();
                    }
                    else
                    {
                        _clonedObj = cloneObj(instanceObj[key], clonedObj[key]);
                    }

                    if (_clonedObj != null)
                    {
                        if (isArray)
                        {
                            if (type == "nodeComponent" && instanceKey == "components" && reflect.getClassName(instanceParent) == "gameObject")
                            {
                                clonedParent.addComponentDirect(_clonedObj.comp);
                            }
                            else if (type == "transform" && instanceKey == "children" && reflect.getClassName(instanceParent) == "transform")
                            {
                                clonedParent.addChild(_clonedObj);
                            }
                            else if (type == "C2DComponent" && instanceKey == "components" && reflect.getClassName(instanceParent) == "transform2D")
                            {
                                clonedParent.addComponentDirect(_clonedObj.comp);
                            }
                            else if (type == "transform2D" && instanceKey == "children" && reflect.getClassName(instanceParent) == "transform2D")
                            {
                                clonedParent.addChild(_clonedObj);
                            }
                            else
                            {
                                clonedObj.push(_clonedObj);
                            }
                        }
                        else
                        {
                            clonedObj[key] = _clonedObj;
                        }
                    }
                }

            }

        }
    }
}