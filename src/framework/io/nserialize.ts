namespace m4m.io
{
    var assetMgr: m4m.framework.assetMgr;
    const filter = { cls: true, insid: true, gameObject: true, components: true, children: true };
    const baseType = { string: true, number: true, boolean: true };
    export function ndeSerialize<T extends framework.transform | framework.transform2D>(json: any, assetbundle: string, useAsset?: boolean): T
    {
        if (!assetMgr)
            assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        var bundlename: string = assetbundle;
        var instMap: { [key: number]: framework.transform | framework.transform2D | any } = {};

        var gos: Array<{ go: framework.gameObject, data: any }> = [];
        let root = createTrasn(json, gos, instMap);
        let is2d = json.cls == "transform2D";
        let coms: Array<any>;
        if (is2d)
            coms = [];
        fullTrasn(json, root, gos, instMap, bundlename);
        //先收集transform 再赋值gameobject
        var god: { go: framework.gameObject, data: any };
        for (let i = 0, len = gos.length; i < len; ++i)
        {
            god = gos[i];
            fullGO(god.data, god.go, bundlename, instMap, useAsset, is2d, coms);
        }
        if (is2d)
        {
            for (let i = 0, len = coms.length; i < len; ++i)
            {
                let com = coms[i];
                com.src[com.key] = com.cls == "transform2D" ? instMap[com.refid] : instMap[com.refid].getComponent(com.cls);
            }
        }
        return root;
    }
    function fullTrasn(json: any, node: framework.transform | framework.transform2D,
        gos: Array<{ go: framework.gameObject, data: any }>, instMap: { [key: number]: framework.transform | framework.transform2D },
        bundlename: string)
    {
        if (json.children)
        {
            for (let i = 0, len = json.children.length; i < len; ++i)
            {
                var ctrans = createTrasn(json.children[i], gos, instMap);
                node.addChild(ctrans);
                fullTrasn(json.children[i], ctrans, gos, instMap, bundlename);
            }
        }
    }
    function createTrasn(json, gos: Array<{ go: framework.gameObject, data: any }>, instMap: { [key: number]: framework.transform | framework.transform2D })
    {
        let trans = new framework[json.cls];
        trans.name = json.name;
        for (let k in json)
        {
            if (!filter[k])
                fullValue(trans, k, json[k]);
            // trans[k] = json[k];
        }

        if (json.components || (json.gameObject && json.gameObject.components))
        {
            gos.push({
                go: json.components ? trans : trans.gameObject,
                data: json.components ? json : json.gameObject
            });
        }
        instMap[json.insid] = trans;
        return trans;
    }
    function fullGO(json: any, go: framework.gameObject, bundlename: string, instMap: { [key: number]: framework.transform | framework.transform2D }, useAsset?: boolean, is2d?: boolean, comps?: Array<any>)
    {
        go.layer = json.layer;
        go.tag = json.tag;
        for (let i = 0, len = json.components.length; i < len; ++i)
        {
            var jcomp = json.components[i];
            var comp = go.addComponent(jcomp.cls);

            for (let k in jcomp)
                fullProp(comp, jcomp, k, bundlename, instMap, useAsset, is2d, comps);
        }
    }
    function fullProp(comp, jcomp, k, bundlename: string, instMap: { [key: number]: any }, useAsset?: boolean, is2d?: boolean, comps?: Array<any>)
    {
        let prop = jcomp[k];
        if (prop instanceof Array)
        {
            let arrProp: Array<any> = comp[k] || (comp[k] = []);

            for (let i = 0, len = prop.length; i < len; ++i)
            {
                let ele = prop[i];
                let value;
                if (ele.cls && isAsset(ele.cls))
                    value = getAssetValue(ele.value, ele.cls, bundlename, useAsset);
                else if (ele.refid)
                {
                    value = instMap[ele.refid];
                }
                else
                {
                    // value = ele;
                    arrProp.push(null);//先填充空值再赋值
                    fullValue(arrProp, i, prop[i]);
                }
                if (value)
                    arrProp.push(value);
            }
        } else if (prop.cls && isAsset(prop.cls))
            comp[k] = getAssetValue(prop.value, prop.cls, bundlename, useAsset);
        else if (prop.refid)
        {
            if (is2d)
            {
                //comp[k] = instMap[prop.refid].getComponent(prop.cls);
                comps.push({
                    refid: prop.refid,
                    cls: prop.cls,
                    src: comp,
                    key: k
                });
            }
            else
            {

                if (prop.cls && m4m.reflect.isComp(prop.cls))
                {
                    //引用组件
                    let trans = instMap[prop.refid] as framework.transform;
                    comp[k] = trans.gameObject.getComponent(prop.cls);
                } else
                    comp[k] = instMap[prop.refid];
            }
        }
        else
            fullValue(comp, k, prop);
        // comp[k] = prop;
    }
    function fullValue(obj: any, key: string | number, json)
    {
        if (!json.cls || baseType[json.cls])
            obj[key] = json;
        else
        {
            let ctor = m4m.math[json.cls] || m4m.framework[json.cls];
            let inst = new ctor();
            for (let k in json)
            {
                if (k == "cls")
                    continue;
                fullValue(inst, k, json[k]);
            }
            obj[key] = inst;
        }
    }
    function getAssetValue(assetName: string, type: string, bundlename: string, useAsset?: boolean)
    {
        let asset: framework.IAsset;
        if (assetName.indexOf("SystemDefaultAsset-") >= 0)
        {
            assetName = assetName.replace("SystemDefaultAsset-", "");
            if (type == "mesh")
                asset = assetMgr.getDefaultMesh(assetName.replace(".mesh.bin", "").replace(".cmesh.bin", ""));
            else if (type == "texture")
                asset = assetMgr.getDefaultTexture(assetName);
        }
        else
            asset = assetMgr.getAssetByName(assetName, bundlename) ||
                assetMgr.getAssetByName(assetName.replace(".mesh.bin", ".cmesh.bin"), bundlename);

        if (!asset && type == "animationClip")
        {
            let clip = new framework.animationClip(assetName);
            clip.bones = [];
            clip.subclips = [];
            asset = clip;
        }
        if (useAsset && asset)
            asset.use();
        return asset;
    }

}