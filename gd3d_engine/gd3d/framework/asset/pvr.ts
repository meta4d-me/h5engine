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
    public MIPMapCount = 1;
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
            return null;
        }

        this.flags = tool.readUInt32();
        this.pixelFormatH = tool.readUInt32();
        this.pixelFormatL = tool.readUInt32();
        this.colourSpace = tool.readUInt32();
        this.channelType = tool.readUInt32();
        this.height = tool.readUInt32();
        this.width = tool.readUInt32();
        this.depth = tool.readUInt32();
        this.numSurfaces = tool.readUInt32();
        this.numFaces = tool.readUInt32();
        this.MIPMapCount = tool.readUInt32();
        this.metaDataSize = tool.readUInt32();

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

        var ret = this.getTextureFormat(this.gl, this);
        var textureFormat = ret.format;
        var textureInternalFormat = ret.internalFormat;
        var textureType = ret.type;

        if (textureInternalFormat == 0)
            return null;
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
        var target = this.gl.TEXTURE_2D;

        if (this.numFaces > 1)
        {
            target = this.gl.TEXTURE_CUBE_MAP;
        }

        if (this.numSurfaces > 1)
        {
            return null;
        }

        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);
        this.gl.bindTexture(target, t2d.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);

        var currentMIPSize = 0;

        // Loop through the faces
        if (this.numFaces > 1)
            target = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X;

        var MIPWidth = this.width;
        var MIPHeight = this.height;

        for (var MIPLevel = 0; MIPLevel < this.MIPMapCount; ++MIPLevel)
        {
            currentMIPSize = this.getDataSize(this, MIPLevel, false, false);
            var eTextureTarget = target;

            for (var face = 0; face < this.numFaces; ++face)
            {
                if (MIPLevel >= 0)
                {
                    var textureData = tool.readBytes(currentMIPSize);
                    this.gl.texImage2D(eTextureTarget, MIPLevel - 0, textureInternalFormat, MIPWidth, MIPHeight, 0, textureFormat, textureType, textureData);
                }
                eTextureTarget++;
            }

            // Reduce the MIP size
            MIPWidth = Math.max(1, MIPWidth >> 1);
            MIPHeight = Math.max(1, MIPHeight >> 1);
        }
        return t2d;
    }

    private getTextureFormat(gl, header): { format: number, type: number, internalFormat: number }
    {
        var ret: { format: number, type: number, internalFormat: number } = { format: 0, type: 0, internalFormat: 0 };

        if (header.pixelFormatH == 0)
        {
            return;
        }

        switch (header.channelType)
        {
            case ChannelTypes.Float:
                {
                    // TODO: Add support.
                    return;
                }
            case ChannelTypes.UnsignedByteNorm:
                {
                    ret.type = gl.UNSIGNED_BYTE;
                    switch (header.pixelFormatL)
                    {
                        case this.genPixelTypeL4(8, 8, 8, 8):
                            if (header.pixelFormatH == this.genPixelTypeH4('r', 'g', 'b', 'a'))
                                ret.format = ret.internalFormat = gl.RGBA;
                            else
                                ret.format = ret.internalFormat = gl.BGRA;
                            break;
                        case this.genPixelTypeL3(8, 8, 8):
                            ret.format = ret.internalFormat = gl.RGB;
                            break;
                        case this.genPixelTypeL2(8, 8):
                            ret.format = ret.internalFormat = gl.LUMINANCE_ALPHA;
                            break;
                        case this.genPixelTypeL1(8):
                            if (header.pixelFormatH == this.genPixelTypeH1('l'))
                                ret.format = ret.internalFormat = gl.LUMINANCE;
                            else
                                ret.format = ret.internalFormat = gl.ALPHA;
                            break;
                    }
                }
            case ChannelTypes.UnsignedShortNorm:
                {
                    switch (header.pixelFormatL)
                    {
                        case this.genPixelTypeL4(4, 4, 4, 4):
                            ret.type = gl.UNSIGNED_SHORT_4_4_4_4;
                            ret.format = ret.internalFormat = gl.BGRA;
                            break;
                        case this.genPixelTypeL4(5, 5, 5, 1):
                            ret.type = gl.UNSIGNED_SHORT_5_5_5_1;
                            ret.format = ret.internalFormat = gl.RGBA;
                            break;
                        case this.genPixelTypeL3(5, 6, 5):
                            ret.type = gl.UNSIGNED_SHORT_5_6_5;
                            ret.format = ret.internalFormat = gl.RGB;
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

    private getDataSize(header, MIPLevel, allSurfaces, allFaces)
    {
        var smallestWidth = 1;
        var smallestHeight = 1;
        var smallestDepth = 1;

        var pixelFormatH = header.pixelFormatH;

        if (pixelFormatH == 0)
        {
            // TODO: Handle compressed textures.
            // PVRTexture.getFormatMinDims(header);
        }

        var dataSize = 0;
        if (MIPLevel == -1)
        {
            for (var currentMIP = 0; currentMIP < header.MIPMapCount; ++currentMIP)
            {
                var width = Math.max(1, header.width >> currentMIP);
                var height = Math.max(1, header.height >> currentMIP);
                var depth = Math.max(1, header.depth >> currentMIP);

                if (header.pixelFormatH == 0)
                {
                    // Pad the dimensions if the texture is compressed
                    width = width + ((-1 * width) % smallestWidth);
                    height = height + ((-1 * height) % smallestHeight);
                    depth = depth + ((-1 * depth) % smallestDepth);
                }

                // Add the current MIP map's data size
                dataSize += this.getBitsPerPixel(header) * width * height * depth;
            }
        }
        else
        {
            var width = Math.max(1, header.width >> MIPLevel);
            var height = Math.max(1, header.height >> MIPLevel);
            var depth = Math.max(1, header.depth >> MIPLevel);

            if (header.pixelFormatH == 0)
            {
                // Pad the dimensions if the texture is compressed
                width = width + ((-1 * width) % smallestWidth);
                height = height + ((-1 * height) % smallestHeight);
                depth = depth + ((-1 * depth) % smallestDepth);
            }

            // Add the current MIP map's data size
            dataSize += this.getBitsPerPixel(header) * width * height * depth;
        }

        var numFaces = (allFaces ? header.numFaces : 1);
        var numSurfs = (allSurfaces ? header.numSurfaces : 1);

        return (dataSize / 8) * numSurfs * numFaces;
    }

    private getBitsPerPixel(header)
    {
        if (header.pixelFormatH != 0)
        {
            var lowPart = header.pixelFormatL;
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