class KTXParse
{
    private version = 0x03525650;
    private flags = 0;
    private pixelFormatH = 0;
    private pixelFormatL = 0;
    // private colourSpace = 0;
    private channelType = 0;
    height = 1;
    width = 1;
    private depth = 1;
    // private numSurfaces = 1;
    private numFaces = 1;
    private mipMapCount = 1;
    private metaDataSize = 0;
    private gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext)
    {
        this.gl = gl;
    }
    /**
     * @
     * @language zh_CN
     * @classdesc
     * 解析pvr图片
     * @param _buffer 图片二进制数据
     * @version gd3d 1.0
     */
    parse(_buffer: ArrayBuffer): gd3d.render.glTexture2D
    {
        let ar: Uint8Array = new Uint8Array(_buffer);
        _buffer = null;
        var tool: gd3d.io.binTool = new gd3d.io.binTool();
        tool.writeUint8Array(ar);
        this.version = tool.readUInt32();
        if (this.version === 0x03525650)
        {

            let tex = this.parseV3(tool);
            tool.dispose();
            return tex;
        }

        else if (this.version === 0x50565203)
        {
            //v2
            console.error("v2");
        } else
        {
            console.error("pvr parse error!:" + this.version);
            return null;
        }
    }

    private parseV3(tool: gd3d.io.binTool)
    {

        this.flags = tool.readUInt32();//0:没有设置  0x02 ：alpha预乘
        if (this.flags == 0)
            this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);//开启预乘
        else
            this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);//开启预乘
        this.pixelFormatH = tool.readUInt32();//高4位 rgba
        this.pixelFormatL = tool.readUInt32();//低4位 8888/4444/5551/565    高四位和低四位共同决定了其格式RGBA（32位）、RGBA4（16位）、    RGB、RGB5_A1、RGB565、  LUMINANCE_ALPHA、LUMINANCE、ALPHA
        // this.colourSpace = tool.readUInt32();//0:linear rgb   1:srgb
        tool.readBytes(4);
        this.channelType = tool.readUInt32();//格式
        this.height = tool.readUInt32();
        this.width = tool.readUInt32();
        this.depth = tool.readUInt32();
        // this.numSurfaces = tool.readUInt32();
        tool.readBytes(4);
        this.numFaces = tool.readUInt32();
        this.mipMapCount = tool.readUInt32();
        this.metaDataSize = tool.readUInt32();
        tool.readBytes(this.metaDataSize);
        let engineFormat;
        let textureFormat;
        let textureType;
        var t2d = new gd3d.render.glTexture2D(this.gl);
        switch (this.pixelFormatH)
        {
            case 0:
                textureFormat = t2d.ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                engineFormat = gd3d.render.TextureFormatEnum.PVRTC2_RGB;
                break;
            case 1:
                textureFormat = t2d.ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                engineFormat = gd3d.render.TextureFormatEnum.PVRTC2_RGBA;
                break;
            case 2:
                textureFormat = t2d.ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                engineFormat = gd3d.render.TextureFormatEnum.PVRTC4_RGB;
                break;
            case 3:
                textureFormat = t2d.ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                engineFormat = gd3d.render.TextureFormatEnum.PVRTC4_RGBA;
                break;
            default:
                textureFormat = this.gl.RGB;
                engineFormat = gd3d.render.TextureFormatEnum.RGB;
                console.log("unknow pixel format::" + this.pixelFormatH);
        }
        t2d.format = engineFormat;
        switch (this.channelType)
        {
            case ChannelTypes.UnsignedByteNorm:
                textureType = this.gl.UNSIGNED_BYTE;
                break;
            case ChannelTypes.UnsignedShortNorm:
                break;
        }
        var target = this.gl.TEXTURE_2D;
        if (this.numFaces > 1)
            target = this.gl.TEXTURE_CUBE_MAP;

        //v3
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);//对齐方式
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);//不对Y翻转

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(target, t2d.texture);

        if (this.numFaces > 1)
            target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X;

        function textureLevelSize(format, width, height)
        {
            switch (format)
            {
                case t2d.ext.COMPRESSED_RGB_S3TC_DXT1_EXT:
                case t2d.ext.COMPRESSED_RGB_ATC_WEBGL:
                case t2d.ext.COMPRESSED_RGB_ETC1_WEBGL:
                    return ((width + 3) >> 2) * ((height + 3) >> 2) * 8;

                case t2d.ext.COMPRESSED_RGBA_S3TC_DXT3_EXT:
                case t2d.ext.COMPRESSED_RGBA_S3TC_DXT5_EXT:
                case t2d.ext.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL:
                case t2d.ext.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL:
                    return ((width + 3) >> 2) * ((height + 3) >> 2) * 16;

                case t2d.ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                case t2d.ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                    return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);
                case t2d.ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                case t2d.ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                    return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);
                default:
                    return 0;
            }
        }
        var offset = 0;
        let _width: number = this.width;
        let _height: number = this.height;
        for (var i = 0; i < this.mipMapCount; ++i)
        {
            var levelSize = textureLevelSize(textureFormat, _width, _height);
            let data = tool.readBytes(levelSize);
            this.gl.compressedTexImage2D(this.gl.TEXTURE_2D, i, textureFormat, _width, _height, 0, data);

            _width = _width >> 1;
            if (_width < 1)
                _width = 1;
            _height = _height >> 1;
            if (_height < 1)
                _height = 1;
            offset += levelSize;
        }
        if (this.mipMapCount > 1)
        {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        } else
        {
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        }
        return t2d;
    }
}

/**
 *
 * for description see https://www.khronos.org/opengles/sdk/tools/KTX/
 * for file layout see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/
 *
 * ported from https://github.com/BabylonJS/Babylon.js/blob/master/src/Misc/khronosTextureContainer.ts
 */
class KhronosTextureContainer
{
    private static HEADER_LEN = 12 + (13 * 4); // identifier + header elements (not including key value meta-data pairs)

    // load types
    private static COMPRESSED_2D = 0; // uses a gl.compressedTexImage2D()
    private static COMPRESSED_3D = 1; // uses a gl.compressedTexImage3D()
    private static TEX_2D = 2; // uses a gl.texImage2D()
    private static TEX_3D = 3; // uses a gl.texImage3D()

    /**
     * 
     * @param gl 
     * @param arrayBuffer contents of the KTX container file
     * @param facesExpected should be either 1 or 6, based whether a cube texture or or
     */
    static parse(gl: WebGLRenderingContext, arrayBuffer: ArrayBuffer, facesExpected = 1, loadMipmaps = true): gd3d.render.glTexture2D
    {

        // Test that it is a ktx formatted file, based on the first 12 bytes, character representation is:
        // '´', 'K', 'T', 'X', ' ', '1', '1', 'ª', '\r', '\n', '\x1A', '\n'
        // 0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A
        var identifier = new Uint8Array(arrayBuffer, 0, 12);
        if (identifier[0] !== 0xAB ||
            identifier[1] !== 0x4B ||
            identifier[2] !== 0x54 ||
            identifier[3] !== 0x58 ||
            identifier[4] !== 0x20 ||
            identifier[5] !== 0x31 ||
            identifier[6] !== 0x31 ||
            identifier[7] !== 0xBB ||
            identifier[8] !== 0x0D ||
            identifier[9] !== 0x0A ||
            identifier[10] !== 0x1A ||
            identifier[11] !== 0x0A)
        {
            console.error('texture missing KTX identifier');
            return;
        }

        // load the reset of the header in native 32 bit uint
        var dataSize = Uint32Array.BYTES_PER_ELEMENT;
        var headerDataView = new DataView(arrayBuffer, 12, 13 * dataSize);
        var endianness = headerDataView.getUint32(0, true);
        var littleEndian = endianness === 0x04030201;

        var glType = headerDataView.getUint32(1 * dataSize, littleEndian); // must be 0 for compressed textures
        var glTypeSize = headerDataView.getUint32(2 * dataSize, littleEndian); // must be 1 for compressed textures
        var glFormat = headerDataView.getUint32(3 * dataSize, littleEndian); // must be 0 for compressed textures
        var glInternalFormat = headerDataView.getUint32(4 * dataSize, littleEndian); // the value of arg passed to gl.compressedTexImage2D(,,x,,,,)
        var glBaseInternalFormat = headerDataView.getUint32(5 * dataSize, littleEndian); // specify GL_RGB, GL_RGBA, GL_ALPHA, etc (un-compressed only)
        var pixelWidth = headerDataView.getUint32(6 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage2D(,,,x,,,)
        var pixelHeight = headerDataView.getUint32(7 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage2D(,,,,x,,)
        var pixelDepth = headerDataView.getUint32(8 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage3D(,,,,,x,,)
        var numberOfArrayElements = headerDataView.getUint32(9 * dataSize, littleEndian); // used for texture arrays
        var numberOfFaces = headerDataView.getUint32(10 * dataSize, littleEndian); // used for cubemap textures, should either be 1 or 6
        var numberOfMipmapLevels = headerDataView.getUint32(11 * dataSize, littleEndian); // number of levels; disregard possibility of 0 for compressed textures
        var bytesOfKeyValueData = headerDataView.getUint32(12 * dataSize, littleEndian); // the amount of space after the header for meta-data

        // Make sure we have a compressed type.  Not only reduces work, but probably better to let dev know they are not compressing.
        if (glType !== 0)
        {
            console.warn('only compressed formats currently supported');
            return null;
        } else
        {
            // value of zero is an indication to generate mipmaps @ runtime.  Not usually allowed for compressed, so disregard.
            numberOfMipmapLevels = Math.max(1, numberOfMipmapLevels);
        }
        if (pixelHeight === 0 || pixelDepth !== 0)
        {
            console.warn('only 2D textures currently supported');
            return null;
        }
        if (numberOfArrayElements !== 0)
        {
            console.warn('texture arrays not currently supported');
            return null;
        }
        if (numberOfFaces !== facesExpected)
        {
            console.warn('number of faces expected' + facesExpected + ', but found ' + numberOfFaces);
            return null;
        }
        // we now have a completely validated file, so could use existence of loadType as success
        // would need to make this more elaborate & adjust checks above to support more than one load type
        var loadType = KhronosTextureContainer.COMPRESSED_2D;

        // return mipmaps for js
        var mipmaps: { data: ArrayBuffer, width: number, height: number }[] = [];

        // initialize width & height for level 1
        var dataOffset = KhronosTextureContainer.HEADER_LEN + bytesOfKeyValueData;
        var width = pixelWidth;
        var height = pixelHeight;
        var mipmapCount = loadMipmaps ? numberOfMipmapLevels : 1;

        for (var level = 0; level < mipmapCount; level++)
        {
            var imageSize = new Int32Array(arrayBuffer, dataOffset, 1)[0]; // size per face, since not supporting array cubemaps
            dataOffset += 4; // size of the image + 4 for the imageSize field

            for (var face = 0; face < numberOfFaces; face++)
            {
                var byteArray = new Uint8Array(arrayBuffer, dataOffset, imageSize);

                mipmaps.push({ data: byteArray, width: width, height: height });

                dataOffset += imageSize;
                dataOffset += 3 - ((imageSize + 3) % 4); // add padding for odd sized image

            }
            width = Math.max(1.0, width * 0.5);
            height = Math.max(1.0, height * 0.5);
        }



        return null;
    }


}