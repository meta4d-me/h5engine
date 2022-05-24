namespace m4m.framework {

    export class RAWParse {
        private static readonly HEADER_SIZE_X = 7;
        private static readonly HEADER_SIZE_Y = 10;
        private static readonly HEADER_SIZE_Z = 13;
        private static readonly HEADER_MAX = 16;

        private static gLInternalFormat: GLenum;
        private static pixelWidth: number;
        private static pixelHeight: number;

        /**
         * 
         * @param gl WebGLRenderingContext
         * @param arrayBuffer contents of the ASTC container file
         */
        static parse(gl: WebGLRenderingContext, arrayBuffer: ArrayBuffer): render.glTexture2D {
            return this.parseByAtt(gl, arrayBuffer);
        }

        /**
         * 解析纹理 通过参数
         * @param gl 
         * @param arrayBuffer 
         * @param _mipmap 
         * @param _linear 
         * @param _premultiplyAlpha 
         * @param _repeat 
         * @returns 
         */
        public static parseByAtt(gl: WebGLRenderingContext, arrayBuffer: ArrayBuffer, _mipmap = false, _linear = true, _premultiplyAlpha = true, _repeat = false) {
            var reader = new io.binReader(arrayBuffer);
            var w = reader.readUInt16();
            var h = reader.readUInt16();
            var data = new ArrayBuffer(w * h * 8);
            var bts = new Uint8Array(data);
            var f16 = new Uint16Array(data);
            reader.readBytes(bts,0,bts.length);
            let result: render.glTexture2D;

            let ext = gl.getExtension("OES_texture_half_float");
            if (!ext) {
                console.error(`当前环境 不支持 float 16 texture 纹理`);
                return;
            }

            // 初始化纹理
            let t2d = result = new m4m.render.glTexture2D(gl);
            t2d.width = this.pixelHeight;
            t2d.height = this.pixelWidth;
            t2d.format = render.TextureFormatEnum.FLOAT16;
            t2d.uploadByteArray(_mipmap, _linear, w, h, f16, _repeat, false, false, _premultiplyAlpha);

            return result;
        }
    }
}