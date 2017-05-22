namespace gd3d.render
{
    export enum ShowFaceStateEnum
    {
        ALL,
        CCW,
        CW,
    }
    export enum DrawModeEnum
    {
        VboTri,
        VboLine,
        EboTri,
        EboLine,
    }
    export enum BlendModeEnum
    {
        Close,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }

    export class glDrawPass
    {
        program: glProgram;
        state_showface: ShowFaceStateEnum = ShowFaceStateEnum.CCW;
        state_zwrite: boolean = false;
        state_ztest: boolean = false;
        state_ztest_method: number = webglkit.LEQUAL;
        state_blend: boolean = false;
        state_blendEquation: number = 0;
        state_blendSrcRGB: number = 0;
        state_blendDestRGB: number = 0;
        state_blendSrcAlpha: number = 0;
        state_blendDestALpha: number = 0;
        uniforms: { [id: string]: { change: boolean, location: WebGLUniformLocation, type: UniformTypeEnum, value: any } } = {};
        uniformallchange: boolean = false;
        setProgram(program: glProgram, uniformDefault: boolean = false)
        {
            this.program = program;
            this.uniforms = {};
            //default uniform
            for (var key in this.program.mapUniform)
            {
                var loc = this.program.mapUniform[key].location;
                if (this.program.mapUniform[key].type == UniformTypeEnum.Texture)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Texture, value: null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Float4x4v)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Float4x4v, value: uniformDefault ? new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) : null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Float4x4)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Float4x4, value: uniformDefault ? new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) : null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Float4v)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Float4v, value: uniformDefault ? new Float32Array([0, 0, 0, 0]) : null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Float4)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Float4, value: uniformDefault ? new Float32Array([0, 0, 0, 0]) : null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Float)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Float, value: uniformDefault ? 0 : null };
                }
                else if (this.program.mapUniform[key].type == UniformTypeEnum.Floatv)
                {
                    this.uniforms[key] = { change: false, location: loc, type: UniformTypeEnum.Floatv, value: uniformDefault ? new Float32Array([0]) : null };
                }
            }
            this.uniformallchange = true;
        }
        setAlphaBlend(mode: BlendModeEnum)
        {
            if (mode == BlendModeEnum.Add)
            {
                this.state_blend = true;
                this.state_zwrite = false;
                this.state_blendEquation = webglkit.FUNC_ADD;
                this.state_blendSrcRGB = webglkit.SRC_ALPHA;
                this.state_blendDestRGB = webglkit.ONE;
                this.state_blendSrcAlpha = webglkit.SRC_ALPHA;
                this.state_blendDestALpha = webglkit.ONE;
            }
            else if (mode == BlendModeEnum.Add_PreMultiply)
            {
                this.state_blend = true;
                this.state_zwrite = false;
                this.state_blendEquation = webglkit.FUNC_ADD;
                this.state_blendSrcRGB = webglkit.ONE;
                this.state_blendDestRGB = webglkit.ONE;
                this.state_blendSrcAlpha = webglkit.SRC_ALPHA;
                this.state_blendDestALpha = webglkit.ONE;
            }
            else if (mode == BlendModeEnum.Blend)
            {
                this.state_blend = true;
                this.state_zwrite = false;
                this.state_blendEquation = webglkit.FUNC_ADD;
                this.state_blendSrcRGB = webglkit.SRC_ALPHA;
                this.state_blendDestRGB = webglkit.ONE_MINUS_SRC_ALPHA;
                this.state_blendSrcAlpha = webglkit.SRC_ALPHA;
                this.state_blendDestALpha = webglkit.ONE;
            }
            else if (mode == BlendModeEnum.Blend_PreMultiply)
            {
                this.state_blend = true;
                this.state_zwrite = false;
                this.state_blendEquation = webglkit.FUNC_ADD;
                this.state_blendSrcRGB = webglkit.ONE;
                this.state_blendDestRGB = webglkit.ONE_MINUS_SRC_ALPHA;
                this.state_blendSrcAlpha = webglkit.SRC_ALPHA;
                this.state_blendDestALpha = webglkit.ONE;

            }
            else if (mode == BlendModeEnum.Close)
            {
                this.state_blend = false;
            }
        }
        //设置uniform save起来
        uniformFloat(name: string, number: number)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Float) throw new Error("wrong uniform type:" + v.type);

            this.uniforms[name].value = number;
            this.uniforms[name].change = true;
        }
        uniformFloatv(name: string, numbers: Float32Array)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Floatv) throw new Error("wrong uniform type:" + v.type);

            this.uniforms[name].value = numbers;
            this.uniforms[name].change = true;
        }
        uniformVec4(name: string, vec: math.vector4)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Float4) throw new Error("wrong uniform type:" + v.type);
            var varray = this.uniforms[name].value;
            if (varray == null)
            {
                this.uniforms[name].value = [0, 0, 0, 0];
                varray = this.uniforms[name].value;
            }
            varray[0] = vec.x;
            varray[1] = vec.y;
            varray[2] = vec.z;
            varray[3] = vec.w;
            this.uniforms[name].change = true;
        }
        uniformVec4v(name: string, vecdata: Float32Array)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Float4v) throw new Error("wrong uniform type:" + v.type);
            this.uniforms[name].value = vecdata;
            this.uniforms[name].change = true;
        }
        uniformMatrix(name: string, mat: math.matrix)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Float4x4) throw new Error("wrong uniform type:" + v.type);
            this.uniforms[name].value = mat.rawData;
            this.uniforms[name].change = true;
        }
        uniformMatrixV(name: string, matdata: Float32Array)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Float4x4v) throw new Error("wrong uniform type:" + v.type);
            this.uniforms[name].value = matdata;
            this.uniforms[name].change = true;
        }
        uniformTexture(name: string, tex: render.ITexture)
        {
            var v = this.uniforms[name];
            if (v == null) throw new Error("do not have this uniform");
            if (v.type != UniformTypeEnum.Texture) throw new Error("wrong uniform type:" + v.type);
            this.uniforms[name].value = tex;
            this.uniforms[name].change = true;
        }
        static textureID: number[] = null;
        //使用材质
        use(webgl: WebGLRenderingContext, applyUniForm: boolean = true)
        {
            //set state
            if (this.state_showface == ShowFaceStateEnum.ALL)
            {
                webgl.disable(webgl.CULL_FACE);
            }
            else
            {
                if (this.state_showface == ShowFaceStateEnum.CCW)
                {
                    webgl.frontFace(webgl.CCW);
                }
                else
                {
                    webgl.frontFace(webgl.CW);
                }
                webgl.cullFace(webgl.BACK);
                webgl.enable(webgl.CULL_FACE);

            }
            if (this.state_zwrite)
            {
                webgl.depthMask(true);
            }
            else
            {
                webgl.depthMask(false);
            }
            if (this.state_ztest)
            {
                webgl.enable(webgl.DEPTH_TEST);
                webgl.depthFunc(this.state_ztest_method);
            }
            else
            {
                webgl.disable(webgl.DEPTH_TEST);
            }
            if (this.state_blend)
            {
                webgl.enable(webgl.BLEND);
                webgl.blendEquation(this.state_blendEquation);
                //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                webgl.blendFuncSeparate(this.state_blendSrcRGB, this.state_blendDestRGB,
                    this.state_blendSrcAlpha, this.state_blendDestALpha);
            }
            else
            {
                webgl.disable(webgl.BLEND);
            }


            //use program
            this.program.use(webgl);
            if (applyUniForm)
            {
                this.applyUniformSaved(webgl);
            }
        }
        applyUniformSaved(webgl: WebGLRenderingContext)
        {

            var texindex = 0;//自动统计使用的贴图
            //set uniform
            for (var key in this.uniforms)
            {
                var u = this.uniforms[key];
                if (u.type == UniformTypeEnum.Texture)
                {
                    if (this.uniformallchange || u.change)
                    {
                        var tex = u.value != null ? (u.value as ITexture).texture : null;
                        webgl.activeTexture(webglkit.GetTextureNumber(webgl, texindex));
                        webgl.bindTexture(webgl.TEXTURE_2D, tex);
                        webgl.uniform1i(u.location, texindex);
                    }
                    texindex++;
                }
                else if (this.uniformallchange || u.change)
                {
                    if (u.type == UniformTypeEnum.Float)
                    {
                        webgl.uniform1f(u.location, u.value);
                    }
                    else if(u.type==UniformTypeEnum.Floatv)
                    {
                        webgl.uniform1fv(u.location,u.value as Float32Array);
                    }
                    else if (u.type == UniformTypeEnum.Float4 || u.type == UniformTypeEnum.Float4v)
                    {
                        webgl.uniform4fv(u.location, u.value as Float32Array);
                    }
                    else if (u.type == UniformTypeEnum.Float4x4 || u.type == UniformTypeEnum.Float4x4v)
                    {
                        webgl.uniformMatrix4fv(u.location, false, u.value as Float32Array);
                    }

                }
                u.change = false;
            }
            this.uniformallchange = false;
        }
        applyUniform_Float(webgl: WebGLRenderingContext, key: string, value: number)
        {
            var u = this.uniforms[key];
            webgl.uniform1f(u.location, value);
        }
        applyUniform_Floatv(webgl: WebGLRenderingContext, key: string, value: Float32Array)
        {
            var u = this.uniforms[key];
            webgl.uniform1fv(u.location, value);
        }
        applyUniform_Float4(webgl: WebGLRenderingContext, key: string, value: math.vector4)
        {
            var u = this.uniforms[key];
            webgl.uniform4f(u.location, value.x, value.y, value.z, value.w);
        }
        applyUniform_Float4v(webgl: WebGLRenderingContext, key: string, values: Float32Array)
        {
            var u = this.uniforms[key];
            webgl.uniform4fv(u.location, values);
        }
        applyUniform_Float4x4(webgl: WebGLRenderingContext, key: string, value: math.matrix)
        {
            var u = this.uniforms[key];
            webgl.uniformMatrix4fv(u.location, false, value.rawData);
        }
        applyUniform_Float4x4v(webgl: WebGLRenderingContext, key: string, values: Float32Array)
        {
            var u = this.uniforms[key];
            webgl.uniformMatrix4fv(u.location, false, values);
        }
        applyUniform_FloatTexture(webgl: WebGLRenderingContext, texindex: number, key: string, value: ITexture)
        {
            var u = this.uniforms[key];
            var tex = value != null ? (value as ITexture).texture : null;
            webgl.activeTexture(webglkit.GetTextureNumber(webgl, texindex));
            webgl.bindTexture(webgl.TEXTURE_2D, tex);
            webgl.uniform1i(u.location, texindex);
        }
        draw(webgl: WebGLRenderingContext, mesh: glMesh, drawmode: DrawModeEnum = DrawModeEnum.EboTri,
            drawindexindex: number = 0, drawbegin: number = 0, drawcount: number = -1)
        {
            this.use(webgl);
            //bind attribute &vbo

            mesh.bind(webgl, this.program, drawindexindex);
            if (drawmode == DrawModeEnum.VboTri)
            {
                mesh.drawArrayTris(webgl, drawbegin, drawcount);
            }
            else if (drawmode == DrawModeEnum.VboLine)
            {
                mesh.drawArrayLines(webgl, drawbegin, drawcount);
            }
            else if (drawmode == DrawModeEnum.EboTri)
            {
                mesh.drawElementTris(webgl, drawbegin, drawcount);
            }
            else if (drawmode == DrawModeEnum.EboLine)
            {
                mesh.drawElementLines(webgl, drawbegin, drawcount);
            }
        }



    }
}