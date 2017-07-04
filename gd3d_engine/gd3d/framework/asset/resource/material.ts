/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class UniformData
    {
        @gd3d.reflect.Field("number")
        @gd3d.reflect.UIStyle("UniformTypeEnum")
        type: render.UniformTypeEnum;
        @gd3d.reflect.Field("any")
        value: any;
        defaultValue: any;

        constructor(type: render.UniformTypeEnum, value: any, defaultValue: any = null)
        {
            this.type = type;
            this.value = value;
            this.defaultValue = defaultValue;
        }
    }

    @gd3d.reflect.SerializeType
    export class material implements IAsset
    {
        @gd3d.reflect.Field("constText")
        private name: constText = null;
        private id: resID = new resID();
        defaultAsset: boolean = false;

        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "material_" + this.getGUID();
            }
            if (!sceneMgr.app.getAssetMgr().nameDuplicateCheck(assetName))
            {
                throw new Error("already have name.");
            }
            this.name = new constText(assetName);
            gd3d.io.enumMgr.enumMap["UniformTypeEnum"] = render.UniformTypeEnum;
            this.mapUniformTemp = {};
        }

        getName(): string
        {
            if (this.name == undefined)
            {
                return null;
            }
            return this.name.getText();
        }
        getGUID(): number
        {
            return this.id.getID();
        }

        dispose()
        {
            for (let id in this.mapUniform)
            {
                switch (this.mapUniform[id].type)
                {
                    case render.UniformTypeEnum.Texture:
                        if (this.mapUniform[id] != null && this.mapUniform[id].value != null)
                            this.mapUniform[id].value.unuse(true);
                        break;
                }
            }
            delete this.mapUniform;
            delete this.mapUniformTemp;
        }
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }

        caclByteLength(): number
        {
            let total = 0;
            if (this.shader)
            {
                total += this.shader.caclByteLength();
            }
            for (let k in this.mapUniform)
            {
                let type = this.mapUniform[k].type;
                let value = this.mapUniform[k].value;
                let defaultValue = this.mapUniform[k].defaultValue;
                switch (type)
                {
                    case render.UniformTypeEnum.Float:
                        total += 4;
                        break;
                    case render.UniformTypeEnum.Floatv:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Float4:
                        total += 16;
                        break;
                    case render.UniformTypeEnum.Float4v:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Float4x4:
                        total += 64;
                        break;
                    case render.UniformTypeEnum.Float4x4v:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Texture:
                        if (value != null)
                        {
                            total += value.caclByteLength();
                        }
                        else if (defaultValue != null)
                        {
                            total += defaultValue.caclByteLength();
                        }
                        break;
                }
            }
            for (let k in this.mapUniformTemp)
            {
                let type = this.mapUniformTemp[k].type;
                let value = this.mapUniformTemp[k].value;
                let defaultValue = this.mapUniformTemp[k].defaultValue;
                switch (type)
                {
                    case render.UniformTypeEnum.Float:
                        total += 4;
                        break;
                    case render.UniformTypeEnum.Floatv:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Float4:
                        total += 16;
                        break;
                    case render.UniformTypeEnum.Float4v:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Float4x4:
                        total += 64;
                        break;
                    case render.UniformTypeEnum.Float4x4v:
                        total += value.byteLength;
                        break;
                    case render.UniformTypeEnum.Texture:
                        if (value != null)
                        {
                            total += value.caclByteLength();
                        }
                        else if (defaultValue != null)
                        {
                            total += defaultValue.caclByteLength();
                        }
                        break;
                }
            }
            return total;
        }
        initUniformData(passes: render.glDrawPass[])
        {
            if (passes == null)
                return;
            for (var i = 0; i < passes.length; i++)
            {
                var p = passes[i];
                for (var key in p.uniforms)
                {
                    var u = p.uniforms[key];
                    var defv = this.shader.defaultValue[key];
                    if (defv != null)
                    {
                        this.mapUniform[key] = new UniformData(u.type, defv.value, defv.defaultValue);
                        continue;
                    }
                    if (this.mapUniform[key] != null)
                    {
                        continue;
                    }
                    if (u.type == render.UniformTypeEnum.Float)
                        this.mapUniform[key] = new UniformData(u.type, u.value);//{ type: u.type, value: u.value };
                    else if (u.type == render.UniformTypeEnum.Floatv)
                        this.mapUniform[key] = new UniformData(u.type, new Float32Array(0));
                    else if (u.type == render.UniformTypeEnum.Float4)
                    {
                        let _v4 = new gd3d.math.vector4();
                        if (key.indexOf("_ST") > 0)
                        {
                            _v4.x = 1;
                            _v4.y = 1;
                        }
                        this.mapUniform[key] = new UniformData(u.type, _v4);//{ type: u.type, value: new gd3d.math.vector4() };
                    }
                    else if (u.type == render.UniformTypeEnum.Float4v)
                        this.mapUniform[key] = new UniformData(u.type, new Float32Array(0));
                    else if (u.type == render.UniformTypeEnum.Float4x4)
                        this.mapUniform[key] = new UniformData(u.type, new gd3d.math.matrix());//{ type: u.type, value: new gd3d.math.matrix() };
                    else if (u.type == render.UniformTypeEnum.Float4x4v)
                        this.mapUniform[key] = new UniformData(u.type, new Float32Array(0));
                    else if (u.type == render.UniformTypeEnum.Texture)
                        this.mapUniform[key] = new UniformData(u.type, null);//{ type: u.type, value: null };
                }
            }
        }

        setShader(shader: shader)
        {
            this.shader = shader;
            this.mapUniform = {};

            this.initUniformData(this.shader.passes["base"]);
        }
        private _changeShaderMap: { [name: string]: material } = {};
        changeShader(shader: shader)
        {
            let map: { [id: string]: UniformData };
            if (this._changeShaderMap[shader.getName()] != undefined)
            {
                map = this._changeShaderMap[shader.getName()].mapUniform;
            } else
            {
                let mat: material = this.clone();
                map = mat.mapUniform;
                this._changeShaderMap[shader.getName()] = mat;
            }
            this.setShader(shader);
            for (let key in map)
            {
                if (this.mapUniform[key] != undefined)
                {
                    this.mapUniform[key] = map[key];
                }
            }
        }
        getLayer()
        {
            return this.shader.layer;
        }
        getQueue()
        {
            return this.shader.queue;
        }
        getShader()
        {
            return this.shader;
        }
        @gd3d.reflect.Field("shader")
        private shader: shader;

        @gd3d.reflect.Field("UniformDataDic")
        mapUniform: {
            [id: string]: UniformData
        } = {};//参数
        private mapUniformTemp: {
            [id: string]: UniformData
        };
        setFloat(_id: string, _number: number)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _number;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Float, _number);
        }
        setFloatv(_id: string, _numbers: Float32Array)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _numbers;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Floatv, _numbers);
        }
        setVector4(_id: string, _vector4: math.vector4)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _vector4;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Float4, _vector4);
        }
        setVector4v(_id: string, _vector4v: Float32Array)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _vector4v;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Float4v, _vector4v);
        }
        setMatrix(_id: string, _matrix: math.matrix)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _matrix;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Float4x4, _matrix);

        }
        setMatrixv(_id: string, _matrixv: Float32Array)
        {
            if (this.mapUniform[_id] != undefined)
                this.mapUniform[_id].value = _matrixv;
            else
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Float4x4v, _matrixv);
        }
        setTexture(_id: string, _texture: gd3d.framework.texture)
        {
            if (this.mapUniform[_id] != undefined)
            {
                if (this.mapUniform[_id].value)
                {
                    this.mapUniform[_id].value.unuse();
                }
                this.mapUniform[_id].value = _texture;
                if (_texture != null)
                {
                    _texture.use();

                    //图片的尺寸信息(1/width,1/height,width,height)
                    let _texelsizeName = _id + "_TexelSize";
                    let _gltexture = _texture.glTexture;
                    let _texelsize = this.mapUniform[_texelsizeName].value;
                    if(_texelsize != undefined)
                    {
                        this.setVector4(_texelsizeName,new math.vector4(1.0/_gltexture.width,1.0/_gltexture.height,_gltexture.width,_gltexture.height));
                    }
                }
            }
            else
            {
                this.mapUniformTemp[_id] = new UniformData(render.UniformTypeEnum.Texture, _texture);
            }
        }

        uploadUniform(pass: render.glDrawPass)
        {
            for (let id in this.mapUniform)
            {
                let type = this.mapUniform[id].type;
                let value = this.mapUniform[id].value;
                let defaultValue = this.mapUniform[id].defaultValue;
                var target = pass.uniforms[id];
                if (target == null) continue;
                switch (type)
                {
                    case render.UniformTypeEnum.Float:
                        pass.uniformFloat(id, value);
                        break;
                    case render.UniformTypeEnum.Floatv:
                        pass.uniformFloatv(id, value);
                        break;
                    case render.UniformTypeEnum.Float4:
                        pass.uniformVec4(id, value);
                        break;
                    case render.UniformTypeEnum.Float4v:
                        pass.uniformVec4v(id, value);
                        break;
                    case render.UniformTypeEnum.Float4x4:
                        pass.uniformMatrix(id, value);
                        break;
                    case render.UniformTypeEnum.Float4x4v:
                        pass.uniformMatrixV(id, value);
                        break;
                    case render.UniformTypeEnum.Texture:
                        if (value != null)
                        {
                            pass.uniformTexture(id, value.glTexture);
                        }
                        else if (defaultValue != null)
                        {
                            pass.uniformTexture(id, defaultValue.glTexture);
                        }
                        else
                        {
                            pass.uniformTexture(id, null);
                        }
                        break;
                }
            }
            for (let id in this.mapUniformTemp)
            {
                let type = this.mapUniformTemp[id].type;
                let value = this.mapUniformTemp[id].value;
                var target = pass.uniforms[id];
                if (target == null) continue;
                switch (type)
                {
                    case render.UniformTypeEnum.Float:
                        pass.uniformFloat(id, value);
                        break;
                    case render.UniformTypeEnum.Floatv:
                        pass.uniformFloatv(id, value);
                        break;
                    case render.UniformTypeEnum.Float4:
                        pass.uniformVec4(id, value);
                        break;
                    case render.UniformTypeEnum.Float4v:
                        pass.uniformVec4v(id, value);
                        break;
                    case render.UniformTypeEnum.Float4x4:
                        pass.uniformMatrix(id, value);
                        break;
                    case render.UniformTypeEnum.Float4x4v:
                        pass.uniformMatrixV(id, value);
                        break;
                    case render.UniformTypeEnum.Texture:
                        if (value != null)
                            pass.uniformTexture(id, value.glTexture);
                        else
                            pass.uniformTexture(id, null);
                        break;
                }
            }
        }

        draw(context: renderContext, mesh: mesh, sm: subMeshInfo, basetype: string = "base")
        {

            let drawPasses = this.shader.passes[basetype + context.drawtype];
            if (drawPasses == undefined)
                drawPasses = this.shader.passes["base" + context.drawtype];
            if (drawPasses == undefined)
                return;
            for (var i = 0; i < drawPasses.length; i++)
            {
                var pass = drawPasses[i];

                //auto uniforms
                for (var key in pass.uniforms)
                {
                    switch (key)
                    {
                        case "glstate_matrix_model":
                            this.setMatrix(key, context.matrixModel);
                            break;
                        case "glstate_matrix_view":
                            this.setMatrix(key, context.matrixView);
                            break;
                        case "glstate_matrix_project":
                            this.setMatrix(key, context.matrixProject);
                            break;
                        case "glstate_matrix_modelview":
                            this.setMatrix(key, context.matrixModelView);
                            break;
                        case "glstate_matrix_viewproject":
                            this.setMatrix(key, context.matrixViewProject);
                            break;
                        case "glstate_matrix_mvp":
                            this.setMatrix(key, context.matrixModelViewProject);
                            break;
                        case "glstate_timer":
                            this.setFloat(key, context.floatTimer);
                            break;
                        case "glstate_lightcount":
                            this.setFloat(key, context.intLightCount);
                            break;
                        case "glstate_vec4_lightposs":
                            if (context.vec4LightPos.length > 0)
                            {
                                this.setVector4v(key, context.vec4LightPos);
                            }
                            break;
                        case "glstate_vec4_lightdirs":
                            if (context.vec4LightDir.length > 0)
                            {
                                this.setVector4v(key, context.vec4LightDir);
                            }
                            break;
                        case "glstate_float_spotangelcoss":
                            if (context.floatLightSpotAngleCos.length > 0)
                            {
                                this.setFloatv(key, context.floatLightSpotAngleCos);
                            }
                            break;
                        case "glstate_eyepos":
                            this.setVector4(key, context.eyePos);
                            break;
                        case "_LightmapTex":
                            this.setTexture(key, context.lightmap);
                            break;
                        case "glstate_lightmapOffset":
                            this.setVector4(key, context.lightmapOffset);
                            break;
                        case "glstate_lightmapUV":
                            this.setFloat(key, context.lightmapUV);
                            break;
                        case "glstate_fog_start":
                            this.setFloat(key, context.fog._Start);
                            break;
                        case "glstate_fog_end":
                            this.setFloat(key, context.fog._End);
                            break;
                        case "glstate_fog_color":
                            this.setVector4(key, context.fog._Color);
                            break;
                    }
                }
                this.uploadUniform(pass);
                pass.use(context.webgl);

                mesh.glMesh.bind(context.webgl, pass.program, sm.useVertexIndex);
                if (sm.useVertexIndex < 0)
                {
                    if (sm.line)
                    {
                        mesh.glMesh.drawArrayLines(context.webgl, sm.start, sm.size);
                    }
                    else
                    {
                        mesh.glMesh.drawArrayTris(context.webgl, sm.start, sm.size);
                    }
                }
                else
                {
                    if (sm.line)
                    {
                        mesh.glMesh.drawElementLines(context.webgl, sm.start, sm.size);
                    }
                    else
                    {
                        mesh.glMesh.drawElementTris(context.webgl, sm.start, sm.size);
                    }
                }
            }
            this.mapUniformTemp = {};
        }

        Parse(assetmgr: assetMgr, json: any)
        {
            var shaderName = json["shader"];
            this.setShader(assetmgr.getShader(shaderName) as gd3d.framework.shader);
            var mapUniform = json["mapUniform"];
            for (var i in mapUniform)
            {
                var jsonChild = mapUniform[i];
                var _uniformType: render.UniformTypeEnum = jsonChild["type"] as render.UniformTypeEnum;
                switch (_uniformType)
                {
                    case render.UniformTypeEnum.Texture:
                        var _value: string = jsonChild["value"];
                        var _texture: gd3d.framework.texture = assetmgr.getAssetByName(_value) as gd3d.framework.texture;
                        if (_texture == undefined)
                        {
                            _texture = assetmgr.getDefaultTexture("grid");
                        }
                        this.setTexture(i, _texture);
                        break;
                    case render.UniformTypeEnum.Float:
                        var _value: string = jsonChild["value"];
                        this.setFloat(i, parseFloat(_value));
                        break;
                    case render.UniformTypeEnum.Float4:
                        var tempValue = jsonChild["value"];
                        try
                        {
                            let values = tempValue.match(RegexpUtil.vector4Regexp);
                            if (values != null)
                            {
                                var _float4: math.vector4 = new math.vector4(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]), parseFloat(values[4]));
                                this.setVector4(i, _float4);
                            }
                        }
                        catch (e)
                        {
                            //数据不合法就不提交了
                        }
                        break;
                    default:
                        console.log("materialJson的mapuniform中的某type：" + jsonChild["type"] + "不符合范围（0-2）")
                }
            }
        }

        public clone(): material
        {
            let mat: material = new material(this.getName());
            mat.setShader(this.shader);
            for (var i in this.mapUniform)
            {
                var data: UniformData = this.mapUniform[i];
                var _uniformType: render.UniformTypeEnum = data.type;
                switch (_uniformType)
                {
                    case render.UniformTypeEnum.Texture:
                        mat.setTexture(i, data.value);
                        break;
                    case render.UniformTypeEnum.Float:
                        mat.setFloat(i, data.value);
                        break;
                    case render.UniformTypeEnum.Float4:
                        mat.setVector4(i, data.value);
                        break;
                    default:
                        break;
                }
            }
            return mat;
        }
    }
}