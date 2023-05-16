namespace m4m.render {
    /** 是否全局关闭，贴图mipmap */
    export let mipmapCancel: boolean = false;
    /**
     * @private
     */
    export enum TextureFormatEnum {
        RGBA = 1,// WebGL2RenderingContext.RGBA,
        RGB = 2,//WebGL2RenderingContext.RGB,
        Gray = 3,//WebGL2RenderingContext.LUMINANCE,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
        KTX = 5,
        FLOAT16,
        FLOAT32,
        ASTC_RGBA_4x4,
        ASTC_RGBA_5x4,
        ASTC_RGBA_5x5,
        ASTC_RGBA_6x5,
        ASTC_RGBA_6x6,
        ASTC_RGBA_8x5,
        ASTC_RGBA_8x6,
        ASTC_RGBA_8x8,
        ASTC_RGBA_10x5,
        ASTC_RGBA_10x6,
        ASTC_RGBA_10x8,
        ASTC_RGBA_10x10,
        ASTC_RGBA_12x10,
        ASTC_RGBA_12x12,
    }
    /**
     * @private
     */
    export class textureReader {
        constructor(webgl: WebGL2RenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray: boolean = false) {
            this._gray = gray;
            this._width = width;
            this._height = height;
            this.webgl = webgl;
            this._data = new Uint8Array(this._width * this._height * 4);
            if (gray)
                this._grayData = new Uint8Array(this._width * this._height);

            this.refresh(texRGBA);
        }

        private _isDispose = false;
        private webgl: WebGL2RenderingContext;
        private _width: number;
        get width() { return this._width; }
        private _height: number;
        get height() { return this._height; }
        private _data: Uint8Array;
        private _grayData: Uint8Array;
        get data() {
            if (this._gray) {
                return this._grayData;
            } else {
                return this._data;
            }
        }
        private _gray: boolean;
        get gray() { return this._gray; }
        get isDispose() { return this._isDispose; }
        getPixel(u: number, v: number): any {
            var x = (u * this._width) | 0;
            var y = (v * this._height) | 0;
            if (x < 0 || x >= this._width || y < 0 || y >= this._height) return 0;
            if (this._gray) {
                return this._grayData[y * this._width + x];
            }
            else {
                var i = (y * this._width + x) * 4;
                return new math.color(this._data[i], this._data[i + 1], this._data[i + 2], this._data[i + 3]);
            }
        }

        /** 刷新data数据 */
        refresh(texRGBA: WebGLTexture) {
            if (!texRGBA) {
                console.warn(`texRGBA is null `);
                return;
            }
            var fbo = this.webgl.createFramebuffer();
            var fbold = this.webgl.getParameter(this.webgl.FRAMEBUFFER_BINDING);
            this.webgl.bindFramebuffer(this.webgl.FRAMEBUFFER, fbo);
            this.webgl.framebufferTexture2D(this.webgl.FRAMEBUFFER, this.webgl.COLOR_ATTACHMENT0, this.webgl.TEXTURE_2D,
                texRGBA, 0);

            // var readData = new Uint8Array(this._width * this._height * 4);
            this._data[0] = 2;
            this.webgl.readPixels(0, 0, this._width, this._height, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE,
                this._data);
            this.webgl.deleteFramebuffer(fbo);
            this.webgl.bindFramebuffer(this.webgl.FRAMEBUFFER, fbold);

            if (this._gray) {
                for (var i = 0; i < this._width * this._height; i++) {
                    this._grayData[i] = this._data[i * 4];  //now only rad pass
                }
            }
        }

        dispose() {
            this.webgl = null;
            this._data = null;
            this._grayData = null;
        }
    }
    /**
     * @private
     */
    export interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGL2RenderingContext);
        caclByteLength(): number;
    }
    /**
     * @private
     */
    export class glRenderTarget implements ITexture {
        width: number;
        height: number;
        constructor(webgl: WebGL2RenderingContext, width: number, height: number, depth: boolean = false, stencil: boolean = false, fbo: WebGLFramebuffer = null) {
            this.width = width;
            this.height = height;
            this.fbo = fbo ? fbo : webgl.createFramebuffer();
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            if (depth || stencil) {
                this.renderbuffer = webgl.createRenderbuffer();
                webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
                if (depth && stencil) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_STENCIL, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                }
                else if (depth) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);

                }
                else {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.STENCIL_INDEX8, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                }
            }

            this.texture = webgl.createTexture();
            this.fbo["width"] = width;
            this.fbo["height"] = height;

            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, width, height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);

            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);

            //set unUse state
            glRenderTarget.useNull(webgl);
        }
        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;
        use(webgl: WebGL2RenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            //webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);

        }
        static useNull(webgl: WebGL2RenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
            webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);

        }
        dispose(webgl: WebGL2RenderingContext) {
            //if (this.texture == null && this.img != null)
            //    this.disposeit = true;

            if (this.texture != null) {
                webgl.deleteFramebuffer(this.renderbuffer);
                this.renderbuffer = null;
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }
        caclByteLength(): number {
            //RGBA & no mipmap
            return this.width * this.height * 4;
        }
        isFrameBuffer(): boolean {
            return true;
        }
    }
    /**
     * @private
     */
    export class glTexture2D implements ITexture {
        private linear: boolean = true;
        private premultiply: boolean = true;
        private repeat: boolean = true;
        private mirroredU: boolean = true;
        private mirroredV: boolean = true;

        constructor(webgl: WebGL2RenderingContext, format: TextureFormatEnum = TextureFormatEnum.RGBA, mipmap: boolean = false, linear: boolean = true) {
            this.webgl = webgl;
            this.format = format;
            this.linear = linear;
            this.mipmap = mipmap;
            if (mipmapCancel) {
                this.mipmap = false;
            }

            //if (url == null)//不给定url 则 texture 不加载
            //    return;
            this.texture = webgl.createTexture();
        }

        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false): void {
            this.width = img.width;
            this.height = img.height;
            this.mipmap = mipmap;
            if (mipmapCancel) {
                this.mipmap = false;
            }
            this.linear = linear;
            this.premultiply = premultiply;
            this.repeat = repeat;
            this.mirroredU = mirroredU;
            this.mirroredV = mirroredV;
            this.loaded = true;
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 1);

            let texF = this.getGLFormat();

            // var formatGL = this.webgl.RGBA;
            // if (this.format == TextureFormatEnum.RGB)
            //     formatGL = this.webgl.RGB;
            // else if (this.format == TextureFormatEnum.Gray)
            //     formatGL = this.webgl.LUMINANCE;
            this.webgl.texImage2D(this.webgl.TEXTURE_2D,
                0,
                texF.internalformatGL,
                texF.formatGL,
                //最后这个type，可以管格式
                this.webgl.UNSIGNED_BYTE
                , img);
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);

                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

                }
            }

            if (repeat) {
                if (mirroredU && mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else if (mirroredU) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
                else if (mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
            }
            else {
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.CLAMP_TO_EDGE);
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.CLAMP_TO_EDGE);
            }
            //this.img = null;
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, null);
        }
        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array | Uint16Array | Float32Array, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false, premultiplyAlpha = true, flipY = true, dataType: number = this.webgl.UNSIGNED_BYTE): void {
            this.width = width;
            this.height = height;
            this.mipmap = mipmap;
            if (mipmapCancel) {
                this.mipmap = false;
            }
            this.linear = linear;
            this.repeat = repeat;
            this.mirroredU = mirroredU;
            this.mirroredV = mirroredV;
            this.loaded = true;
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            if (premultiplyAlpha) {
                this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            } else {
                this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            }
            if (flipY) {
                // this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 1);
            }
            let texF = this.getGLFormat();

            this.webgl.texImage2D(this.webgl.TEXTURE_2D,
                0,
                texF.internalformatGL,
                width,
                height,
                0,
                texF.formatGL,
                //最后这个type，可以管格式
                dataType,
                data);
            if (mipmap) {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);

                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

                }
            }
            else {
                if (linear) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

                }
            }
            //this.img = null;

            if (repeat) {
                if (mirroredU && mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else if (mirroredU) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
                else if (mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
            }
            else {
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.CLAMP_TO_EDGE);
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.CLAMP_TO_EDGE);
            }

            this.webgl.bindTexture(this.webgl.TEXTURE_2D, null);
        }

        webgl: WebGL2RenderingContext;
        //img: HTMLImageElement = null;
        loaded: boolean = false;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number = 0;
        height: number = 0;
        mipmap: boolean = false;
        caclByteLength(): number {
            let pixellen = 1;
            if (this.format == TextureFormatEnum.RGBA) {
                pixellen = 4;
            }
            else if (this.format == TextureFormatEnum.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen;
            if (this.mipmap) {
                len = len * (1 - Math.pow(0.25, 10)) / 0.75;
            }
            return len;
        }

        //创建读取器，有可能失败
        reader: textureReader;
        getReader(redOnly: boolean = false): textureReader {
            if (this.reader != null) {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != TextureFormatEnum.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null) return null;
            if (this.reader == null)
                this.reader = new textureReader(this.webgl, this.texture, this.width, this.height, redOnly);

            return this.reader;
        }
        //disposeit: boolean = false;
        dispose(webgl: WebGL2RenderingContext) {
            //if (this.texture == null && this.img != null)
            //    this.disposeit = true;

            if (this.texture != null) {
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }
        isFrameBuffer(): boolean {
            return false;
        }

        private getGLFormat(): { internalformatGL: number, formatGL: number } {
            let formatGL:number = this.webgl.RGBA;
            let internalformatGL = formatGL;
            switch (this.format) {
                case TextureFormatEnum.RGB:
                    formatGL = this.webgl.RGB;
                    internalformatGL = formatGL;
                    break;
                case TextureFormatEnum.FLOAT16:
                    formatGL = this.webgl.RGBA;
                    internalformatGL = this.webgl.RGBA16F;
                    // formatGL = this.webgl.RGBA;
                    // var ext = this.webgl.getExtension('OES_texture_half_float');
                    // if (ext == null) throw "nit support oes";
                    // dataType = ext.HALF_FLOAT_OES;
                    break;
                case TextureFormatEnum.FLOAT32:
                    formatGL = this.webgl.RGBA;
                    internalformatGL = this.webgl.RGBA32F;
                    break;
                case TextureFormatEnum.Gray:
                    formatGL = this.webgl.LUMINANCE;
                    internalformatGL = formatGL;
                    break;
            }
            return { internalformatGL, formatGL };
        }
        private static mapTexture: { [id: string]: glTexture2D } = {};
        static formGrayArray(webgl: WebGL2RenderingContext, array: number[] | Float32Array | Float64Array, width: number, height: number) {
            var mipmap = false;
            var linear = true;
            var t = new glTexture2D(webgl, TextureFormatEnum.RGBA, mipmap, linear);
            var data = new Uint8Array(array.length * 4);
            for (var y = 0; y < width; y++) {
                for (var x = 0; x < width; x++) {
                    var fi = y * 512 + x;
                    var i = y * width + x;
                    data[fi * 4] = array[i] * 255;
                    data[fi * 4 + 1] = array[i] * 255;
                    data[fi * 4 + 2] = array[i] * 255;
                    data[fi * 4 + 3] = 255;
                }
            }

            t.uploadByteArray(mipmap, linear, 512, 512, data);

            return t;
        }

        static staticTexture(webgl: WebGL2RenderingContext, name: "grid" | "gray" | "white" | "black" | "normal") {
            let t = glTexture2D.mapTexture[name];
            if (t != undefined) return t;
            const mipmap = false;
            const linear = true;
            t = new glTexture2D(webgl, TextureFormatEnum.RGBA, mipmap, linear);

            let size = 1;
            let data: Uint8Array;
            if (name == "grid") {
                size = 256
                data = new Uint8Array(size * size * 4);
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        let seek = (y * size + x) * 4;

                        if (((x - size * 0.5) * (y - size * 0.5)) > 0) {
                            data[seek] = 0;
                            data[seek + 1] = 0;
                            data[seek + 2] = 0;
                            data[seek + 3] = 255;
                        }
                        else {
                            data[seek] = 255;
                            data[seek + 1] = 255;
                            data[seek + 2] = 255;
                            data[seek + 3] = 255;
                        }
                    }
                }
            } else {
                let rg = 0, b = 0;
                switch (name) {
                    case "gray": rg = b = 128; break;
                    case "white": rg = b = 255; break;
                    case "black": rg = b = 0; break;
                    case "normal": rg = 128, b = 255; break;
                }

                size = 16;
                data = new Uint8Array(size * size * 4);
                for (let y = 0; y < size; y++) {
                    for (let x = 0; x < size; x++) {
                        let seek = (y * size + x) * 4;
                        data[seek] = rg;
                        data[seek + 1] = rg;
                        data[seek + 2] = b;
                        data[seek + 3] = 255;
                    }
                }
            }

            t.uploadByteArray(mipmap, linear, size, size, data);

            glTexture2D.mapTexture[name] = t;
            return t;
        }

        static particleTexture(webgl: WebGL2RenderingContext, name = framework.defTexture.particle) {
            var t = glTexture2D.mapTexture[name];
            if (t != undefined)
                return t;

            var mipmap = false;
            var linear = true;
            t = new glTexture2D(webgl, TextureFormatEnum.RGBA, mipmap, linear);

            var size = 64

            var data = new Uint8Array(size * size * 4);
            var half = size / 2;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    var l = math.floatClamp(math.vec2Length(new math.vector2(i - half, j - half)), 0, half) / half;
                    // l = l * l;
                    var f = 1 - l;
                    f = f * f;
                    // f = f * f * f;
                    // f = - 8 / 3 * f * f * f + 4 * f * f - f / 3;

                    var pos = (i + j * size) * 4;
                    data[pos] = f * 255;
                    data[pos + 1] = f * 255;
                    data[pos + 2] = f * 255;
                    data[pos + 3] = 255;
                }
            }

            t.uploadByteArray(mipmap, linear, size, size, data);

            glTexture2D.mapTexture[name] = t;
            return t;
        }
    }

    export class glTextureCube implements ITexture {
        constructor(webgl: WebGL2RenderingContext, format: TextureFormatEnum = TextureFormatEnum.RGBA, mipmap: boolean = false, linear: boolean = true) {
            this.webgl = webgl;
            this.format = format;
            this.mipmap = mipmap;
            if (mipmapCancel) {
                this.mipmap = false;
            }
            this.linear = linear;

            this.texture = webgl.createTexture();
        }
        uploadImages(
            Texture_NEGATIVE_X: framework.texture,
            Texture_NEGATIVE_Y: framework.texture,
            Texture_NEGATIVE_Z: framework.texture,
            Texture_POSITIVE_X: framework.texture,
            Texture_POSITIVE_Y: framework.texture,
            Texture_POSITIVE_Z: framework.texture,
            min = WebGL2RenderingContext.NEAREST, max = WebGL2RenderingContext.NEAREST, mipmap: number = null
        ) {
            let wrc = this.webgl;

            let textures = [Texture_NEGATIVE_X, Texture_NEGATIVE_Y, Texture_NEGATIVE_Z, Texture_POSITIVE_X, Texture_POSITIVE_Y, Texture_POSITIVE_Z];
            const typeArr = [wrc.TEXTURE_CUBE_MAP_NEGATIVE_X, wrc.TEXTURE_CUBE_MAP_NEGATIVE_Y, wrc.TEXTURE_CUBE_MAP_NEGATIVE_Z, wrc.TEXTURE_CUBE_MAP_POSITIVE_X, wrc.TEXTURE_CUBE_MAP_POSITIVE_Y, wrc.TEXTURE_CUBE_MAP_POSITIVE_Z];
            for (var i = 0; i < typeArr.length; i++) {
                let reader = (textures[i].glTexture as glTexture2D).getReader();
                if (!reader) {
                    console.warn(`getReader() fail : ${textures[i].getName()}`);
                    return;
                }
                this.upload(reader.data, reader.width, reader.height, typeArr[i]);
            }
            wrc.texParameteri(wrc.TEXTURE_CUBE_MAP, wrc.TEXTURE_MIN_FILTER, min);
            wrc.texParameteri(wrc.TEXTURE_CUBE_MAP, wrc.TEXTURE_MAG_FILTER, max);
            wrc.texParameteri(wrc.TEXTURE_CUBE_MAP, wrc.TEXTURE_WRAP_S, wrc.CLAMP_TO_EDGE);
            wrc.texParameteri(wrc.TEXTURE_CUBE_MAP, wrc.TEXTURE_WRAP_T, wrc.CLAMP_TO_EDGE);

            if (mipmap !== null) {
                wrc.generateMipmap(wrc.TEXTURE_CUBE_MAP);
            }

        }

        private upload(data: HTMLImageElement | Uint8Array, width: number, height: number, TEXTURE_CUBE_MAP_: number): void {
            this.width = width;
            this.height = height;
            this.loaded = true;
            let gl = this.webgl;
            // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);

            this.webgl.bindTexture(this.webgl.TEXTURE_CUBE_MAP, this.texture);
            var formatGL:number = this.webgl.RGBA;
            if (this.format == TextureFormatEnum.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == TextureFormatEnum.Gray)
                formatGL = this.webgl.LUMINANCE;
            if (data instanceof HTMLImageElement) {
                this.webgl.texImage2D(TEXTURE_CUBE_MAP_,
                    0,
                    formatGL,
                    formatGL,
                    //最后这个type，可以管格式
                    this.webgl.UNSIGNED_BYTE
                    , data);
            } else {
                this.webgl.texImage2D(TEXTURE_CUBE_MAP_,
                    0,
                    formatGL,
                    width,
                    height,
                    0,
                    formatGL,
                    //最后这个type，可以管格式
                    this.webgl.UNSIGNED_BYTE
                    , data);
            }

            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, min);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, max);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // let mipmap = this.mipmap;
            let linear = this.linear;
            // let repeat = true;
            // let premultiply = true;
            // let mirroredU = false;
            // let mirroredV = false;

            // if (mipmap)
            // {
            //     //生成mipmap
            //     this.webgl.generateMipmap(this.webgl.TEXTURE_2D);

            //     if (linear)
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
            //     }
            //     else
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

            //     }
            // }
            // else
            // {
            //     if (linear)
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
            //     }
            //     else
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

            //     }
            // }
            //this.img = null;

            // if (repeat)
            // {
            //     if (mirroredU && mirroredV)
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
            //     }
            //     else if (mirroredU)
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
            //     }
            //     else if (mirroredV)
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
            //     }
            //     else
            //     {
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
            //         this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
            //     }
            // }
            // else
            // {
            //     this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.CLAMP_TO_EDGE);
            //     this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.CLAMP_TO_EDGE);
            // }


        }

        webgl: WebGL2RenderingContext;
        //img: HTMLImageElement = null;
        loaded: boolean = false;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number = 0;
        height: number = 0;
        mipmap: boolean = false;
        linear: boolean = false;
        caclByteLength(): number {
            let pixellen = 1;
            if (this.format == TextureFormatEnum.RGBA) {
                pixellen = 4;
            }
            else if (this.format == TextureFormatEnum.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen * 6;
            if (this.mipmap) {
                len = len * (1 - Math.pow(0.25, 10)) / 0.75;
            }
            return len;
        }
        //disposeit: boolean = false;
        dispose(webgl: WebGL2RenderingContext) {
            if (this.texture != null) {
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }
        isFrameBuffer(): boolean {
            return false;
        }
    }
    /**
     * @private
     */
    export class WriteableTexture2D implements ITexture {
        constructor(webgl: WebGL2RenderingContext, format: TextureFormatEnum = TextureFormatEnum.RGBA, width: number, height: number, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false) {
            this.webgl = webgl;

            this.texture = webgl.createTexture();

            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);

            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            this.format = format;
            this.formatGL = this.webgl.RGBA;
            if (format == TextureFormatEnum.RGB)
                this.formatGL = this.webgl.RGB;
            else if (format == TextureFormatEnum.Gray)
                this.formatGL = this.webgl.LUMINANCE;

            var data: Uint8Array = null;
            //data = new Uint8Array(width * height * 4);
            //for (var x = 0; x < width; x++)
            //    for (var y = 0; y < height; y++) {
            //        var seek = y * width * 4 + x * 4;
            //        data[seek] = 23;
            //        data[seek + 1] = 100;
            //        data[seek + 3] = 255;
            //    }
            this.webgl.texImage2D(this.webgl.TEXTURE_2D,
                0,
                this.formatGL,
                width,
                height,
                0,
                this.formatGL,
                //最后这个type，可以管格式
                this.webgl.UNSIGNED_BYTE
                , data);
            if (linear) {
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
            }
            else {
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

            }
            if (repeat) {
                if (mirroredU && mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else if (mirroredU) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.MIRRORED_REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
                else if (mirroredV) {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.MIRRORED_REPEAT);
                }
                else {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.REPEAT);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.REPEAT);
                }
            }
            else {
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_S, this.webgl.CLAMP_TO_EDGE);
                this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_WRAP_T, this.webgl.CLAMP_TO_EDGE);
            }

        }
        linear: boolean;
        premultiply: boolean = true;
        repeat: boolean = false;
        mirroredU: boolean = false;
        mirroredV: boolean = false
        updateRect(data: Uint8Array, x: number, y: number, width: number, height: number) {
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);

            this.webgl.texSubImage2D(this.webgl.TEXTURE_2D, 0,
                x, y, width, height,
                this.formatGL,
                this.webgl.UNSIGNED_BYTE,
                data);
        }
        updateRectImg(data: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, x: number, y: number) {
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            this.webgl.texSubImage2D(this.webgl.TEXTURE_2D, 0,
                x, y,
                this.formatGL,
                this.webgl.UNSIGNED_BYTE,
                data);
        }


        isFrameBuffer(): boolean {
            return false;
        }
        webgl: WebGL2RenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        formatGL: number;
        width: number = 0;
        height: number = 0;

        dispose(webgl: WebGL2RenderingContext) {
            if (this.texture != null) {
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }
        caclByteLength(): number {
            let pixellen = 1;
            if (this.format == TextureFormatEnum.RGBA) {
                pixellen = 4;
            }
            else if (this.format == TextureFormatEnum.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen;
            return len;
        }
    }

    /**
     * 视频纹理
     */
    export class videoTexture implements ITexture {
        private _video: HTMLVideoElement;
        private _needUpdateVideo = false;
        public texture: WebGLTexture;
        public width: number = 1;
        public height: number = 1;
        public premultiply: boolean = false;
        public flipY: boolean = true;
        public mipmap: boolean = false;
        public linear: boolean = true;
        public repeat: boolean = true;
        public mirroredU: boolean = false;
        public mirroredV: boolean = false;
        constructor(video: HTMLVideoElement) {
            this._video = video;
            const gl = m4m.framework.sceneMgr.app.webgl;
            this.texture = gl.createTexture();
            if (!video) {
                console.error(`video is null`);
                return;
            }
            this.width = video.width;
            this.height = video.height;
            this.applyProperty();
            if (video.buffered.length) {    //video 有数据了可以上传纹理
                this.refreshTexture();
            }
            if ('requestVideoFrameCallback' in video) {
                (video as any).requestVideoFrameCallback(() => {
                    this.updateVideo();
                });
            }
        }

        /** 视频对象 */
        public get video() { return this._video; }

        /**
         * 应用webgl纹理属性
         */
        applyProperty() {
            if (!this._video) {
                console.warn(`video is null`);
            }
            let mipmap = this.mipmap;
            if (mipmapCancel) {
                mipmap = false;
            }
            const linear = this.linear;
            const repeat = this.repeat;
            const mirroredU = this.mirroredU;
            const mirroredV = this.mirroredV;

            const gl = m4m.framework.sceneMgr.app.webgl;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            if (mipmap) {
                //生成mipmap
                gl.generateMipmap(gl.TEXTURE_2D);

                if (linear) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);

                }
            }
            else {
                if (linear) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

                }
            }

            if (repeat) {
                if (mirroredU && mirroredV) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
                }
                else if (mirroredU) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                else if (mirroredV) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        isFrameBuffer(): boolean {
            return false;
        }
        dispose(webgl: WebGL2RenderingContext) {
            this._video = null;
            const gl = m4m.framework.sceneMgr.app.webgl;
            if (this.texture) {
                gl.deleteTexture(this.texture);
                this.texture = null;
            }

        }
        caclByteLength(): number {
            return 0;
        }

        /** 开启 视频到纹理的更新循环 */
        loopVideoToTexture() {
            if (this._needUpdateVideo) return;
            this.updateVideo();
        }

        /** 更新 视频帧 到纹理 , */
        private updateVideo() {
            this._needUpdateVideo = false;

            if (!this._video) {
                console.warn(`video is null`);
                return;
            }

            //更新帧数据到 webgl 纹理
            this.refreshTexture();

            if ('requestVideoFrameCallback' in this._video) {
                this._needUpdateVideo = true;
                (this._video as any).requestVideoFrameCallback(() => {
                    this.updateVideo();
                });
            }

        }

        /**
         * 更新纹理
         */
        private refreshTexture() {
            if (!this._video) {
                console.warn(`video is null`);
            }
            const gl = m4m.framework.sceneMgr.app.webgl;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiply ? 1 : 0);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY ? 1 : 0);

            let formatGLxF = gl.RGB;
            let internalformatGL = gl.RGB;
            gl.texImage2D(gl.TEXTURE_2D,
                0,
                internalformatGL,
                formatGLxF,
                //最后这个type，可以管格式
                gl.UNSIGNED_BYTE
                , this._video);

            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }

}