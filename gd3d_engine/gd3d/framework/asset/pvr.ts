class PVRHeader
{
    public version = 0x03525650;
    public flags = 0;
    public pixelFormatH = 0;
    public pixelFormatL = 0;
    public colourSpace = 0;
    public channelType = 0;
    public height = 1;
    public width = 1;
    public depth = 1;
    public numSurfaces = 1;
    public numFaces = 1;
    public mipMapCount = 1;
    public metaDataSize = 0;
    public gl: WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext)
    {
        this.gl = gl;
    }
    public parse(_buffer: ArrayBuffer): gd3d.render.glTexture2D
    {
        var t2d = new gd3d.render.glTexture2D(this.gl, gd3d.render.TextureFormatEnum.PVRTC);
        let ar: Uint8Array = new Uint8Array(_buffer);
        var tool: gd3d.io.binTool = new gd3d.io.binTool();
        tool.writeUint8Array(ar);
        var pvrMetaData = new Object();
        this.version = tool.readUInt32();

        if (this.version != 0x03525650)
        {
            //字节次序不匹配（等于0x50565203时匹配）
            return null;
        }

        this.flags = tool.readUInt32();//0:没有设置  0x02 ：alpha预乘
        this.pixelFormatH = tool.readUInt32();//高4位 rgba
        this.pixelFormatL = tool.readUInt32();//低4位 8888/4444/5551/565    高四位和低四位共同决定了其格式RGBA（32位）、RGBA4（16位）、    RGB、RGB5_A1、RGB565、  LUMINANCE_ALPHA、LUMINANCE、ALPHA
        this.colourSpace = tool.readUInt32();//0:linear rgb   1:srgb
        this.channelType = tool.readUInt32();//格式
        this.height = tool.readUInt32();
        this.width = tool.readUInt32();
        this.depth = tool.readUInt32();
        this.numSurfaces = tool.readUInt32();
        this.numFaces = tool.readUInt32();
        this.mipMapCount = tool.readUInt32();
        this.metaDataSize = tool.readUInt32();

        //没搞明白metaData的作用是啥？
        var metaDataSize = 0;
        while (metaDataSize < this.metaDataSize)
        {
            var devFourCC = tool.readUInt32();
            metaDataSize += 4;

            var key = tool.readUInt32();
            metaDataSize += 4;

            var dataSize = tool.readUInt32();
            metaDataSize += 4;

            if (dataSize > 0)
            {
                tool.readBytes(dataSize);
                metaDataSize += dataSize;
            }
        }

        var ret = this.getTextureFormat();
        var textureFormat = ret.format;
        var textureInternalFormat = ret.internalFormat;
        var textureType = ret.type;

        if (textureInternalFormat == 0)
            return null;
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 2);//对齐方式
        var target = this.gl.TEXTURE_2D;

        if (this.numFaces > 1)
        {
            target = this.gl.TEXTURE_CUBE_MAP;
        }

        if (this.numSurfaces > 1)
        {
            return null;
        }

        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);//开启预乘
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);//不对Y翻转
        this.gl.bindTexture(target, t2d.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);//线性过滤
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);//mipmap之间执行线性过滤

        var currentMipMapSize = 0;

        if (this.numFaces > 1)
            target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X;

        var mipWidth = this.width;
        var mipHeight = this.height;

        for (var mipLevel = 0; mipLevel < this.mipMapCount; ++mipLevel)
        {
            currentMipMapSize = this.getDataSize(mipLevel, false, false);

            for (var face = 0; face < this.numFaces; ++face)
            {
                if (mipLevel >= 0)
                {
                    var textureData = tool.readBytes(currentMipMapSize);
                    if (this.numFaces > 1)
                        this.gl.texImage2D(target, mipLevel, textureInternalFormat, mipWidth, mipHeight, 0, textureFormat, textureType, textureData);
                    else
                        this.gl.texImage2D(target + face, mipLevel, textureInternalFormat, mipWidth, mipHeight, 0, textureFormat, textureType, textureData);
                }
            }

            mipWidth = Math.max(1, mipWidth >> 1);
            mipHeight = Math.max(1, mipHeight >> 1);
        }
        return t2d;
    }

    private getTextureFormat(): { format: number, type: number, internalFormat: number }
    {
        var ret: { format: number, type: number, internalFormat: number } = { format: 0, type: 0, internalFormat: 0 };
        //jpg、bmp用gl.RGB
        //png用gl.RGBA
        //灰度图用gl.LUMINANCE或gl.LUMINANCE_ALPHA，此外还有gl.ALPHA
        if (this.pixelFormatH == 0)
        {
            return;
        }
        switch (this.channelType)
        {
            case ChannelTypes.UnsignedByteNorm:
                {
                    ret.type = this.gl.UNSIGNED_BYTE;
                    switch (this.pixelFormatL)
                    {
                        case this.genPixelTypeL4(8, 8, 8, 8):
                            if (this.pixelFormatH == this.genPixelTypeH4('r', 'g', 'b', 'a'))
                                ret.format = ret.internalFormat = this.gl.RGBA;
                            break;
                        case this.genPixelTypeL3(8, 8, 8):
                            ret.format = ret.internalFormat = this.gl.RGB;
                            break;
                        case this.genPixelTypeL2(8, 8):
                            ret.format = ret.internalFormat = this.gl.LUMINANCE_ALPHA;
                            break;
                        case this.genPixelTypeL1(8):
                            if (this.pixelFormatH == this.genPixelTypeH1('l'))
                                ret.format = ret.internalFormat = this.gl.LUMINANCE;
                            else
                                ret.format = ret.internalFormat = this.gl.ALPHA;
                            break;
                    }
                }
            case ChannelTypes.UnsignedShortNorm:
                {
                    switch (this.pixelFormatL)
                    {
                        case this.genPixelTypeL4(4, 4, 4, 4):
                            ret.type = this.gl.UNSIGNED_SHORT_4_4_4_4;
                            ret.format = ret.internalFormat = this.gl.RGBA4;
                            break;
                        case this.genPixelTypeL4(5, 5, 5, 1):
                            ret.type = this.gl.UNSIGNED_SHORT_5_5_5_1;
                            ret.format = ret.internalFormat = this.gl.RGB5_A1;
                            break;
                        case this.genPixelTypeL3(5, 6, 5):
                            ret.type = this.gl.UNSIGNED_SHORT_5_6_5;
                            ret.format = ret.internalFormat = this.gl.RGB565;
                            break;
                    }
                }
        }

        return ret;
    }

    private genPixelTypeH4(c1Name, c2Name, c3Name, c4Name)
    {
        var val = 0;
        val |= c1Name.charCodeAt();
        if (c2Name != undefined)
            val |= c2Name.charCodeAt() << 8;

        if (c3Name != undefined)
            val |= c3Name.charCodeAt() << 16;

        if (c4Name != undefined)
            val |= c4Name.charCodeAt() << 24;

        return val;
    }
    private genPixelTypeH1(c1Name)
    {
        var val = 0;
        val |= c1Name.charCodeAt();

        return val;
    }
    private genPixelTypeL3(c1Bits, c2Bits, c3Bits)
    {
        var val = 0;
        val |= c1Bits;

        if (c2Bits != undefined)
            val |= c2Bits << 8;

        if (c3Bits != undefined)
            val |= c3Bits << 16;

        return val;
    }
    private genPixelTypeL2(c1Bits, c2Bits)
    {
        var val = 0;
        val |= c1Bits;

        if (c2Bits != undefined)
            val |= c2Bits << 8;

        return val;
    }
    private genPixelTypeL1(c1Bits)
    {
        var val = 0;
        val |= c1Bits;

        return val;
    }

    private genPixelTypeL4(c1Bits, c2Bits, c3Bits, c4Bits)
    {
        var val = 0;
        val |= c1Bits;

        if (c2Bits != undefined)
            val |= c2Bits << 8;

        if (c3Bits != undefined)
            val |= c3Bits << 16;

        if (c4Bits != undefined)
            val |= c4Bits << 24;

        return val;
    }

    private getDataSize(mipLevel, allSurfaces, allFaces)
    {
        var smallestWidth = 1;
        var smallestHeight = 1;
        var smallestDepth = 1;

        var pixelFormatH = this.pixelFormatH;

        if (pixelFormatH == 0)
        {
            // TODO: Handle compressed textures.
        }

        var dataSize = 0;
        if (mipLevel == -1)
        {
            for (var currentMIP = 0; currentMIP < this.mipMapCount; ++currentMIP)
            {
                var width = Math.max(1, this.width >> currentMIP);
                var height = Math.max(1, this.height >> currentMIP);
                var depth = Math.max(1, this.depth >> currentMIP);

                if (this.pixelFormatH == 0)//?
                {
                    width = width + ((-1 * width) % smallestWidth);
                    height = height + ((-1 * height) % smallestHeight);
                    depth = depth + ((-1 * depth) % smallestDepth);
                }

                dataSize += this.getBitsPerPixel() * width * height * depth;
            }
        }
        else
        {
            var width = Math.max(1, this.width >> mipLevel);
            var height = Math.max(1, this.height >> mipLevel);
            var depth = Math.max(1, this.depth >> mipLevel);

            if (this.pixelFormatH == 0)
            {
                width = width + ((-1 * width) % smallestWidth);
                height = height + ((-1 * height) % smallestHeight);
                depth = depth + ((-1 * depth) % smallestDepth);
            }

            dataSize += this.getBitsPerPixel() * width * height * depth;
        }

        var numFaces = (allFaces ? this.numFaces : 1);
        var numSurfs = (allSurfaces ? this.numSurfaces : 1);

        return (dataSize / 8) * numSurfs * numFaces;
    }

    private getBitsPerPixel()
    {
        if (this.pixelFormatH != 0)
        {
            var lowPart = this.pixelFormatL;
            var c1Bits = (lowPart >> 24) & 0xFF;
            var c2Bits = (lowPart >> 16) & 0xFF;
            var c3Bits = (lowPart >> 8) & 0xFF;
            var c4Bits = lowPart & 0xFF;
            return c1Bits + c2Bits + c3Bits + c4Bits;
        }
        return 0;
    }
}



enum ChannelTypes
{
    UnsignedByteNorm = 0,
    SignedByteNorm = 1,
    UnsignedByte = 2,
    SignedByte = 3,
    UnsignedShortNorm = 4,
    SignedShortNorm = 5,
    UnsignedShort = 6,
    SignedShort = 7,
    UnsignedIntegerNorm = 8,
    SignedIntegerNorm = 9,
    UnsignedInteger = 10,
    SignedInteger = 11,
    SignedFloat = 12,
    Float = 12, //the name Float is now deprecated.
    UnsignedFloat = 13,
}