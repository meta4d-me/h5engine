/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class shader implements IAsset
    {
        @gd3d.reflect.Field("constText")
        private name: constText = null;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "shader_" + this.getGUID();
            }
            if (!sceneMgr.app.getAssetMgr().nameDuplicateCheck(assetName))
            {
                throw new Error("already have name.");
            }
            this.name = new constText(assetName);
        }
        getName(): string
        {
            return this.name.getText();
        }
        getGUID(): number
        {
            return this.id.getID();
        }
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        dispose()
        {
            //shader 其实没有多大dispose的价值
            //shader 里面引用三种资源  vs fs program，都有比较复杂的引用关系，而且不怎么占内存，不和他jiu

            // for (var i = 0; i < this.passes.length; i++)
            // {
            //     this.passes[0].dispose(assetmgr.webgl);
            // }
            //this.glMesh.dispose(webgl);
        }
        caclByteLength(): number
        {
            let total = 0;
            return total;
        }
        passes: { [id: string]: gd3d.render.glDrawPass[] } = {};

        // @gd3d.reflect.Field("UniformData")
        defaultValue: { [key: string]: { type: string, value?: any, defaultValue?: any, min?: number, max?: number } } = {};
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        queue: number = 0;
        parse(assetmgr: assetMgr, json: any)
        {
            this._parseProperties(assetmgr, json.properties);

            if (json.layer)
            {
                var layer = json.layer;
                if (layer == "transparent")
                    this.layer = RenderLayerEnum.Transparent;
                else if (layer == "overlay")
                    this.layer = RenderLayerEnum.Overlay;
                else if (layer == "common")
                    this.layer = RenderLayerEnum.Common;
            }
            if (json.queue)
            {
                this.queue = json.queue;
            }
            var passes = json.passes;
            this.passes = {};
            for (var key in passes)
            {
                var passbass = passes[key];
                var curpasses: render.glDrawPass[];

                //限制一下pass的名字
                if (key == "base" || key == "lightmap" || key == "skin" || key == "quad")
                {

                }
                else if (key.indexOf("base_") == 0 || key.indexOf("lightmap_") == 0 || key.indexOf("skin_") == 0)
                {

                }
                else
                {
                    continue;
                }
                this.passes[key] = [];
                for (var i = 0; i < passbass.length; i++)
                {
                    this.passes[key].push(this._parsePass(assetmgr, passbass[i]));
                }
            }
            if (this.passes["base"] == undefined)
            {
                throw new Error("do not have base passgroup.");
            }
        }

        private _parseProperties(assetmgr: assetMgr, properties: any)
        {
            this.defaultValue = {};
            for (var index in properties)
            {
                let property = properties[index] as string;

                //检测字符串格式有无错误
                let words = property.match(RegexpUtil.floatRegexp);
                if (words == null)
                    words = property.match(RegexpUtil.rangeRegexp);
                if (words == null)
                    words = property.match(RegexpUtil.vectorRegexp);
                if (words == null)
                    words = property.match(RegexpUtil.textureRegexp);
                if (words == null)
                {
                    alert(this.getName() + " property error! info:\n" + property);
                    return;
                }

                if (words != null && words.length >= 4)
                {
                    let key = words[1];
                    let showName = words[2];
                    let type = words[3].toLowerCase();

                    switch (type)
                    {
                        case "float":
                            this.defaultValue[key] = { type: type, value: parseFloat(words[4]) };
                            break;
                        case "range":
                            this.defaultValue[key] = { type: type, min: parseFloat(words[4]), max: parseFloat(words[5]), value: parseFloat(words[6]) };
                            break;
                        case "vector":
                        case "color":
                            let _vector = new gd3d.math.vector4(parseFloat(words[4]), parseFloat(words[5]), parseFloat(words[6]), parseFloat(words[7]));
                            this.defaultValue[key] = { type: type, value: _vector };
                            break;
                        case "texture":
                            this.defaultValue[key] = { type: type, defaultValue: assetmgr.getDefaultTexture(words[4]) };
                            break;
                        default:
                            alert(this.getName() + " property error! unknown type : " + type);
                            break;
                    }
                }
            }
        }
        private _parsePass(assetmgr: assetMgr, json: any): render.glDrawPass
        {
            var pass = new render.glDrawPass();

            var vs = json["vs"];
            var fs = json["fs"];

            switch (json["showface"])
            {
                case "cw":
                    pass.state_showface = render.ShowFaceStateEnum.CW;
                    break;
                case "ccw":
                    pass.state_showface = render.ShowFaceStateEnum.CCW;
                    break;
                default:
                    pass.state_showface = render.ShowFaceStateEnum.ALL;
                    break;
            }

            var blendmode = render.BlendModeEnum.Close;
            switch (json["blendmode"])
            {
                case "add":
                    blendmode = render.BlendModeEnum.Add;
                    break;
                case "addpremult":
                    blendmode = render.BlendModeEnum.Add_PreMultiply;
                    break;
                case "blend":
                    blendmode = render.BlendModeEnum.Blend;
                    break;
                case "blendpremult":
                    blendmode = render.BlendModeEnum.Blend_PreMultiply;
                    break;
            }

            switch (json["zwrite"])
            {
                case "off":
                    pass.state_zwrite = false;
                    break;
                case "on":
                default:
                    pass.state_zwrite = true;
                    break;
            }

            pass.setAlphaBlend(blendmode);
            pass.state_ztest = true;
            switch (json["ztest"])
            {
                case "greater":
                    pass.state_ztest_method = render.webglkit.GREATER;
                    break;
                case "gequal":
                    pass.state_ztest_method = render.webglkit.GEQUAL;
                    break;
                case "less":
                    pass.state_ztest_method = render.webglkit.LESS;
                    break;
                case "equal":
                    pass.state_ztest_method = render.webglkit.EQUAL
                    break;
                case "notequal":
                    pass.state_ztest_method = render.webglkit.NOTEQUAL
                    break;
                case "always":
                case "off":
                    pass.state_ztest = false;
                    break;
                case "never":
                    pass.state_ztest_method = render.webglkit.NEVER;
                    break;
                case "lequal":
                default:
                    pass.state_ztest_method = render.webglkit.LEQUAL;
                    break;
            }

            var program = assetmgr.shaderPool.linkProgram(assetmgr.webgl, vs, fs);
            pass.setProgram(program);

            if (this.layer == RenderLayerEnum.Overlay)
            {
                pass.state_ztest = true;
                pass.state_zwrite = true;
                pass.state_ztest_method = render.webglkit.ALWAYS;
            }
            return pass;
        }


    }

}