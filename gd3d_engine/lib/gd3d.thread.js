var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var gd3d;
(function (gd3d) {
    var threading;
    (function (threading) {
        function threadHandle() {
            return function (constructor) {
                handleMaps.set(constructor.name, new constructor());
            };
        }
        threading.threadHandle = threadHandle;
    })(threading = gd3d.threading || (gd3d.threading = {}));
})(gd3d || (gd3d = {}));
var handleMaps = new Map();
onmessage = function (ev) {
    if (handleMaps.has(ev.data.handle)) {
        let result = handleMaps.get(ev.data.handle).handle(ev.data.data);
        let data = {
            result: result,
            id: ev.data.id
        };
        postMessage(data, undefined);
    }
};
var gd3d;
(function (gd3d) {
    var math;
    (function (math) {
        var _byte = new Uint8Array(1);
        var _int16 = new Int32Array(1);
        var _int32 = new Int32Array(1);
        var _uint16 = new Int32Array(1);
        var _uint32 = new Int32Array(1);
        var _float32 = new Float32Array(1);
        var _float64 = new Float64Array(1);
        function Byte(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _byte[0] = v;
            return _byte[0];
        }
        math.Byte = Byte;
        function Int16(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _int16[0] = v;
            return _int16[0];
        }
        math.Int16 = Int16;
        function Int32(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _int32[0] = v;
            return _int32[0];
        }
        math.Int32 = Int32;
        function UInt16(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _uint16[0] = v;
            return _uint16[0];
        }
        math.UInt16 = UInt16;
        function UInt32(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _uint32[0] = v;
            return _uint32[0];
        }
        math.UInt32 = UInt32;
        function Float(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _float32[0] = v;
            return _float32[0];
        }
        math.Float = Float;
        function Double(v = 0) {
            if (typeof (v) == "string")
                v = Number(v);
            _float64[0] = v;
            return _float64[0];
        }
        math.Double = Double;
        /**
         * @private
         */
        class vector2 {
            constructor(x = 0, y = 0, w = 0, h = 0) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
        }
        math.vector2 = vector2;
        /**
         * @private
         */
        class rect {
            constructor(x = 0, y = 0, w = 0, h = 0) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            }
        }
        math.rect = rect;
        /**
         * @private
         */
        class border {
            constructor(l = 0, t = 0, r = 0, b = 0) {
                this.l = l;
                this.t = t;
                this.r = r;
                this.b = b;
            }
        }
        math.border = border;
        /**
         * @private
         */
        class color {
            constructor(r = 1, g = 1, b = 1, a = 1) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        }
        math.color = color;
        /**
         * @private
         */
        class vector3 {
            constructor(x = 0, y = 0, z = 0) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        }
        math.vector3 = vector3;
        /**
         * @private
         */
        class vector4 {
            constructor(x = 0, y = 0, z = 0, w = 0) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
        }
        math.vector4 = vector4;
        /**
         * @private
         */
        class quaternion {
            constructor(x = 0, y = 0, z = 0, w = 1) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }
        }
        math.quaternion = quaternion;
        /**
         * @private
         */
        class matrix {
            constructor(datas = null) {
                if (datas) {
                    this.rawData = datas;
                }
                else
                    this.rawData = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            }
            toString() {
                return "[" + this.rawData[0] + "," + this.rawData[1] + "," + this.rawData[2] + "," + this.rawData[3] + "],"
                    + "[" + this.rawData[4] + "," + this.rawData[5] + "," + this.rawData[6] + "," + this.rawData[7] + "],"
                    + "[" + this.rawData[8] + "," + this.rawData[9] + "," + this.rawData[10] + "," + this.rawData[11] + "],"
                    + "[" + this.rawData[12] + "," + this.rawData[13] + "," + this.rawData[14] + "," + this.rawData[15] + "]";
            }
        }
        math.matrix = matrix;
        /**
         * @private
         */
        class matrix3x2 {
            constructor(datas = null) {
                if (datas) {
                    this.rawData = datas;
                }
                else
                    this.rawData = new Float32Array([1, 0, 0, 1, 0, 0]);
            }
            toString() {
                return "[" + this.rawData[0] + "," + this.rawData[1] + "," + this.rawData[2] + "],"
                    + "[" + this.rawData[3] + "," + this.rawData[4] + "," + this.rawData[5] + "]";
            }
        }
        math.matrix3x2 = matrix3x2;
    })(math = gd3d.math || (gd3d.math = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var render;
    (function (render) {
        /**
         * @private
         */
        class meshData {
        }
        render.meshData = meshData;
    })(render = gd3d.render || (gd3d.render = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var math;
    (function (math) {
        //临时写在这里
        function floatClamp(v, min = 0, max = 1) {
            if (v < min)
                return min;
            else if (v > max)
                return max;
            else
                return v;
        }
        math.floatClamp = floatClamp;
        function sign(value) {
            value = +value; // convert to a number
            if (value === 0 || isNaN(value))
                return value;
            return value > 0 ? 1 : -1;
        }
        math.sign = sign;
        function getKeyCodeByAscii(ev) {
            if (ev.shiftKey) {
                return ev.keyCode - 32;
            }
            else {
                return ev.keyCode;
            }
        }
        math.getKeyCodeByAscii = getKeyCodeByAscii;
        function numberLerp(fromV, toV, v) {
            return fromV * (1 - v) + toV * v;
        }
        math.numberLerp = numberLerp;
        function x_AXIS() {
            return commonStatic.x_axis;
        }
        math.x_AXIS = x_AXIS;
        function y_AXIS() {
            return commonStatic.y_axis;
        }
        math.y_AXIS = y_AXIS;
        function z_AXIS() {
            return commonStatic.z_axis;
        }
        math.z_AXIS = z_AXIS;
        class commonStatic {
        }
        commonStatic.x_axis = new gd3d.math.vector3(1, 0, 0);
        commonStatic.y_axis = new gd3d.math.vector3(0, 1, 0);
        commonStatic.z_axis = new gd3d.math.vector3(0, 0, 1);
        math.commonStatic = commonStatic;
    })(math = gd3d.math || (gd3d.math = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var render;
    (function (render) {
        /**
         * @private
         */
        let VertexFormatMask;
        (function (VertexFormatMask) {
            VertexFormatMask[VertexFormatMask["Position"] = 1] = "Position";
            VertexFormatMask[VertexFormatMask["Normal"] = 2] = "Normal";
            VertexFormatMask[VertexFormatMask["Tangent"] = 4] = "Tangent";
            VertexFormatMask[VertexFormatMask["Color"] = 8] = "Color";
            VertexFormatMask[VertexFormatMask["UV0"] = 16] = "UV0";
            VertexFormatMask[VertexFormatMask["UV1"] = 32] = "UV1";
            VertexFormatMask[VertexFormatMask["BlendIndex4"] = 64] = "BlendIndex4";
            VertexFormatMask[VertexFormatMask["BlendWeight4"] = 128] = "BlendWeight4";
            VertexFormatMask[VertexFormatMask["ColorEX"] = 256] = "ColorEX";
        })(VertexFormatMask = render.VertexFormatMask || (render.VertexFormatMask = {}));
        /**
         * @private
         */
        class number4 {
        }
        render.number4 = number4;
        /**
         * @private
         */
        let MeshTypeEnum;
        (function (MeshTypeEnum) {
            MeshTypeEnum[MeshTypeEnum["Static"] = 0] = "Static";
            MeshTypeEnum[MeshTypeEnum["Dynamic"] = 1] = "Dynamic";
            MeshTypeEnum[MeshTypeEnum["Stream"] = 2] = "Stream";
        })(MeshTypeEnum = render.MeshTypeEnum || (render.MeshTypeEnum = {}));
    })(render = gd3d.render || (gd3d.render = {}));
})(gd3d || (gd3d = {}));
//0.04
//处理utf8 string 还是不能用encode decode，有些特殊情况没覆盖
var gd3d;
//0.04
//处理utf8 string 还是不能用encode decode，有些特殊情况没覆盖
(function (gd3d) {
    var io;
    (function (io) {
        /**
         * @private
         */
        class binReader {
            constructor(buf, seek = 0) {
                this._seek = seek;
                this._data = new DataView(buf, seek);
            }
            seek(seek) {
                this._seek = seek;
            }
            peek() {
                return this._seek;
            }
            length() {
                return this._data.byteLength;
            }
            canread() {
                //LogManager.Warn(this._buf.byteLength + "  &&&&&&&&&&&   " + this._seek + "    " + this._buf.buffer.byteLength);
                return this._data.byteLength - this._seek;
            }
            readStringAnsi() {
                var slen = this._data.getUint8(this._seek);
                this._seek++;
                var bs = "";
                for (var i = 0; i < slen; i++) {
                    bs += String.fromCharCode(this._data.getUint8(this._seek));
                    this._seek++;
                }
                return bs;
            }
            static utf8ArrayToString(array) {
                var ret = [];
                for (var i = 0; i < array.length; i++) {
                    var cc = array[i];
                    if (cc == 0)
                        break;
                    var ct = 0;
                    if (cc > 0xE0) {
                        ct = (cc & 0x0F) << 12;
                        cc = array[++i];
                        ct |= (cc & 0x3F) << 6;
                        cc = array[++i];
                        ct |= cc & 0x3F;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0xC0) {
                        ct = (cc & 0x1F) << 6;
                        cc = array[++i];
                        ct |= (cc & 0x3F) << 6;
                        ret.push(String.fromCharCode(ct));
                    }
                    else if (cc > 0x80) {
                        throw new Error("InvalidCharacterError");
                    }
                    else {
                        ret.push(String.fromCharCode(array[i]));
                    }
                }
                return ret.join('');
                //                var b = array[i];
                //    if (b > 0 && b < 16)
                //    {
                //        uri += '%0' + b.toString(16);
                //    }
                //    else if (b > 16)
                //    {
                //        uri += '%' + b.toString(16);
                //    }
                //}
                //return decodeURIComponent(uri);
            }
            readStringUtf8() {
                var length = this._data.getInt8(this._seek);
                this._seek++;
                var arr = new Uint8Array(length);
                this.readUint8Array(arr);
                return binReader.utf8ArrayToString(arr);
            }
            readStringUtf8FixLength(length) {
                var arr = new Uint8Array(length);
                this.readUint8Array(arr);
                return binReader.utf8ArrayToString(arr);
            }
            readSingle() {
                var num = this._data.getFloat32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readDouble() {
                var num = this._data.getFloat64(this._seek, true);
                this._seek += 8;
                return num;
            }
            readInt8() {
                var num = this._data.getInt8(this._seek);
                this._seek += 1;
                return num;
            }
            readUInt8() {
                //LogManager.Warn(this._data.byteLength + "  @@@@@@@@@@@@@@@@@  " + this._seek);
                var num = this._data.getUint8(this._seek);
                this._seek += 1;
                return num;
            }
            readInt16() {
                //LogManager.Log(this._seek + "   " + this.length());
                var num = this._data.getInt16(this._seek, true);
                this._seek += 2;
                return num;
            }
            readUInt16() {
                var num = this._data.getUint16(this._seek, true);
                this._seek += 2;
                //LogManager.Warn("readUInt16 " + this._seek);
                return num;
            }
            readInt32() {
                var num = this._data.getInt32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readUInt32() {
                var num = this._data.getUint32(this._seek, true);
                this._seek += 4;
                return num;
            }
            readUint8Array(target = null, offset = 0, length = -1) {
                if (length < 0)
                    length = target.length;
                for (var i = 0; i < length; i++) {
                    target[i] = this._data.getUint8(this._seek);
                    this._seek++;
                }
                return target;
            }
            readUint8ArrayByOffset(target, offset, length = 0) {
                if (length < 0)
                    length = target.length;
                for (var i = 0; i < length; i++) {
                    target[i] = this._data.getUint8(offset);
                    offset++;
                }
                return target;
            }
            set position(value) {
                this.seek(value);
            }
            get position() {
                return this.peek();
            }
            readBoolean() {
                return this.readUInt8() > 0;
            }
            readByte() {
                return this.readUInt8();
            }
            readBytes(target = null, offset = 0, length = -1) {
                return this.readUint8Array(target, offset, length);
            }
            readUnsignedShort() {
                return this.readUInt16();
            }
            readUnsignedInt() {
                return this.readUInt32();
            }
            readFloat() {
                return this.readSingle();
            }
            readUTFBytes(length) {
                var arry = new Uint8Array(length);
                return binReader.utf8ArrayToString(this.readUint8Array(arry));
            }
            /// <summary>
            /// 有符号 Byte
            /// </summary>
            readSymbolByte() {
                return this.readInt8();
            }
            readShort() {
                return this.readInt16();
            }
            readInt() {
                return this.readInt32();
            }
        }
        io.binReader = binReader;
        class binWriter {
            constructor() {
                //if (buf == null)
                {
                    var buf = new ArrayBuffer(1024);
                    this._length = 0;
                }
                this._buf = new Uint8Array(buf);
                this._data = new DataView(this._buf.buffer);
                this._seek = 0;
            }
            sureData(addlen) {
                var nextlen = this._buf.byteLength;
                while (nextlen < (this._length + addlen)) {
                    nextlen += 1024;
                }
                if (nextlen != this._buf.byteLength) {
                    var newbuf = new Uint8Array(nextlen);
                    for (var i = 0; i < this._length; i++) {
                        newbuf[i] = this._buf[i];
                    }
                    this._buf = newbuf;
                    this._data = new DataView(this._buf.buffer);
                }
                this._length += addlen;
            }
            getLength() {
                return length;
            }
            getBuffer() {
                return this._buf.buffer.slice(0, this._length);
            }
            seek(seek) {
                this._seek = seek;
            }
            peek() {
                return this._seek;
            }
            writeInt8(num) {
                this.sureData(1);
                this._data.setInt8(this._seek, num);
                this._seek++;
            }
            writeUInt8(num) {
                this.sureData(1);
                this._data.setUint8(this._seek, num);
                this._seek++;
            }
            writeInt16(num) {
                this.sureData(2);
                this._data.setInt16(this._seek, num, true);
                this._seek += 2;
            }
            writeUInt16(num) {
                this.sureData(2);
                this._data.setUint16(this._seek, num, true);
                this._seek += 2;
            }
            writeInt32(num) {
                this.sureData(4);
                this._data.setInt32(this._seek, num, true);
                this._seek += 4;
            }
            writeUInt32(num) {
                this.sureData(4);
                this._data.setUint32(this._seek, num, true);
                this._seek += 4;
            }
            writeSingle(num) {
                this.sureData(4);
                this._data.setFloat32(this._seek, num, true);
                this._seek += 4;
            }
            writeDouble(num) {
                this.sureData(8);
                this._data.setFloat64(this._seek, num, true);
                this._seek += 8;
            }
            writeStringAnsi(str) {
                var slen = str.length;
                this.sureData(slen + 1);
                this._data.setUint8(this._seek, slen);
                this._seek++;
                for (var i = 0; i < slen; i++) {
                    this._data.setUint8(this._seek, str.charCodeAt(i));
                    this._seek++;
                }
            }
            writeStringUtf8(str) {
                var bstr = binWriter.stringToUtf8Array(str);
                this.writeUInt8(bstr.length);
                this.writeUint8Array(bstr);
            }
            static stringToUtf8Array(str) {
                var bstr = [];
                for (var i = 0; i < str.length; i++) {
                    var c = str.charAt(i);
                    var cc = c.charCodeAt(0);
                    if (cc > 0xFFFF) {
                        throw new Error("InvalidCharacterError");
                    }
                    if (cc > 0x80) {
                        if (cc < 0x07FF) {
                            var c1 = (cc >>> 6) | 0xC0;
                            var c2 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2);
                        }
                        else {
                            var c1 = (cc >>> 12) | 0xE0;
                            var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                            var c3 = (cc & 0x3F) | 0x80;
                            bstr.push(c1, c2, c3);
                        }
                    }
                    else {
                        bstr.push(cc);
                    }
                }
                return bstr;
            }
            writeStringUtf8DataOnly(str) {
                var bstr = binWriter.stringToUtf8Array(str);
                this.writeUint8Array(bstr);
            }
            writeUint8Array(array, offset = 0, length = -1) {
                if (length < 0)
                    length = array.length;
                this.sureData(length);
                for (var i = offset; i < offset + length; i++) {
                    this._data.setUint8(this._seek, array[i]);
                    this._seek++;
                }
            }
            get length() {
                return this._seek;
            }
            writeByte(num) {
                this.writeUInt8(num);
            }
            writeBytes(array, offset = 0, length = 0) {
                this.writeUint8Array(array, offset, length);
            }
            writeUnsignedShort(num) {
                this.writeUInt16(num);
            }
            writeUnsignedInt(num) {
                this.writeUInt32(num);
            }
            writeFloat(num) {
                this.writeSingle(num);
            }
            writeUTFBytes(str) {
                var strArray = binWriter.stringToUtf8Array(str);
                this.writeUint8Array(strArray);
            }
            /// <summary>
            /// 写入有符号 Byte
            /// </summary>
            writeSymbolByte(num) {
                this.writeInt8(num);
            }
            writeShort(num) {
                this.writeInt16(num);
            }
            writeInt(num) {
                this.writeInt32(num);
            }
        }
        io.binWriter = binWriter;
    })(io = gd3d.io || (gd3d.io = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var threading;
    (function (threading) {
        /**
          * @private
          */
        class subMeshInfo {
            constructor() {
                this.useVertexIndex = 0; //-1 表示不用indexbuffer,>=0 表示第几个，
                //通常都是用第一个indexbuffer，只有用wireframe显示模式，使用第二个部分
                this.line = false;
            }
        }
        threading.subMeshInfo = subMeshInfo;
        let meshDataHandle = class meshDataHandle {
            handle(buf) {
                let data = {};
                //console.log("hello world");
                var objVF = { vf: 0 }; //顶点属性
                // var data: gd3d.render.meshData = new gd3d.render.meshData();
                var read = new gd3d.io.binReader(buf);
                //meshdata.name = read.readString();
                //var bound = read.readBound();
                var meshName = read.readStringAnsi();
                //this.setName(read.readStringAnsi());
                read.position = read.position + 24;
                var vcount = read.readUInt32();
                var vec10tpose = [];
                var tag = read.readUInt8();
                while (tag && tag < 18) {
                    //end
                    if (tag == 255) {
                        break;
                    }
                    if (tag == 1) {
                        if (data.pos == undefined) {
                            data.pos = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Position;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var _position = new gd3d.math.vector3();
                            _position.x = read.readSingle();
                            _position.y = read.readSingle();
                            _position.z = read.readSingle();
                            data.pos.push(_position);
                        }
                    }
                    else if (tag == 2) {
                        if (data.color == undefined) {
                            data.color = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Color;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var _color = new gd3d.math.color();
                            _color.a = gd3d.math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                            _color.r = gd3d.math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                            _color.g = gd3d.math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                            _color.b = gd3d.math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                            data.color.push(_color);
                        }
                    }
                    else if (tag == 3) {
                        if (data.normal == undefined) {
                            data.normal = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Normal;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var _normal = new gd3d.math.vector3();
                            _normal.x = read.readSingle();
                            _normal.y = read.readSingle();
                            _normal.z = read.readSingle();
                            data.normal.push(_normal);
                        }
                    }
                    else if (tag == 4) {
                        if (data.uv == undefined) {
                            data.uv = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.UV0;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var uv = new gd3d.math.vector2();
                            uv.x = read.readSingle();
                            uv.y = read.readSingle();
                            data.uv.push(uv);
                        }
                    }
                    else if (tag == 5) {
                        if (data.uv2 == undefined) {
                            data.uv2 = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.UV1;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var uv = new gd3d.math.vector2();
                            uv.x = read.readSingle();
                            uv.y = read.readSingle();
                            data.uv2.push(uv);
                        }
                    }
                    else if (tag == 6) {
                        //meshdata.vec2uvs2 = new Float32Array(vcount * 2);
                        for (var i = 0; i < vcount; i++) {
                            //meshdata.vec2uvs2[i * 2 + 0] =
                            read.readSingle(); //u
                            //meshdata.vec2uvs2[i * 2 + 1] =
                            read.readSingle(); //v
                        }
                    }
                    else if (tag == 7) {
                        if (data.tangent == undefined) {
                            data.tangent = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Tangent;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var tangent = new gd3d.math.vector3();
                            var x = read.readSingle();
                            var y = read.readSingle();
                            var z = read.readSingle();
                            var w = read.readSingle();
                            tangent.x = x / w;
                            tangent.y = y / w;
                            tangent.z = z / w;
                            data.tangent.push(tangent);
                        }
                    }
                    else if (tag == 8) {
                        for (var i = 0; i < vcount; i++) {
                            //meshdata.vec2uvs2[i * 2 + 0] =
                            read.readSingle(); //u
                            //meshdata.vec2uvs2[i * 2 + 1] =
                            read.readSingle(); //v
                        }
                    }
                    else if (tag == 16) {
                        var tposelen = read.readUInt8();
                        //meshdata.vec10tpose = new Float32Array(tposelen * 10);
                        for (var i = 0; i < tposelen; i++) {
                            vec10tpose[i * 10 + 0] = read.readSingle(); //posx;
                            vec10tpose[i * 10 + 1] = read.readSingle(); //posy;
                            vec10tpose[i * 10 + 2] = read.readSingle(); //posz;
                            vec10tpose[i * 10 + 3] = read.readSingle(); //scalex;
                            vec10tpose[i * 10 + 4] = read.readSingle(); //scaley;
                            vec10tpose[i * 10 + 5] = read.readSingle(); //scalez;
                            vec10tpose[i * 10 + 6] = read.readSingle(); //quatx;
                            vec10tpose[i * 10 + 7] = read.readSingle(); //quaty;
                            vec10tpose[i * 10 + 8] = read.readSingle(); //quatz;
                            vec10tpose[i * 10 + 9] = read.readSingle(); //quatw;
                        }
                    }
                    else if (tag == 17) {
                        if (data.blendIndex == undefined) {
                            data.blendIndex = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.BlendIndex4;
                        }
                        if (data.blendWeight == undefined) {
                            data.blendWeight = [];
                            objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.BlendWeight4;
                        }
                        for (var i = 0; i < vcount; i++) {
                            var _boneIndex = new gd3d.render.number4();
                            _boneIndex.v0 = read.readUInt32();
                            _boneIndex.v1 = read.readUInt32();
                            _boneIndex.v2 = read.readUInt32();
                            _boneIndex.v3 = read.readUInt32();
                            var _boneWeight = new gd3d.render.number4();
                            _boneWeight.v0 = read.readSingle();
                            _boneWeight.v1 = read.readSingle();
                            _boneWeight.v2 = read.readSingle();
                            _boneWeight.v3 = read.readSingle();
                            data.blendIndex.push(_boneIndex);
                            data.blendWeight.push(_boneWeight);
                        }
                    }
                    else {
                        throw "notwrite" + tag;
                    }
                    tag = read.readUInt8();
                }
                var subcount = read.readUInt8();
                data.trisindex = [];
                var submesh = [];
                for (var i = 0; i < subcount; i++) {
                    var _submeshinfo = new subMeshInfo();
                    var tv = read.readUInt32(); //代表之前submesh中的drawstyle
                    var sublen = read.readUInt32();
                    _submeshinfo.start = data.trisindex.length;
                    _submeshinfo.size = sublen;
                    _submeshinfo.matIndex = i;
                    submesh.push(_submeshinfo);
                    for (var j = 0; j < sublen; j++) {
                        var index = read.readUInt32();
                        data.trisindex.push(index);
                    }
                }
                return {
                    meshData: data,
                    subMesh: submesh,
                    objVF: objVF
                };
            }
        };
        meshDataHandle = __decorate([
            threading.threadHandle()
        ], meshDataHandle);
        threading.meshDataHandle = meshDataHandle;
    })(threading = gd3d.threading || (gd3d.threading = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2QzZC50aHJlYWQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvcWluZ3J1aWJpbi9Eb2N1bWVudHMvQ3VyRGV2ZWxvcGVyL2VuZ2luZXNvdXJjZV9uZXcvZ2QzZF9lbmdpbmUvdGhyZWFkaW5nL3NyYy8iLCJzb3VyY2VzIjpbIm1haW4udHMiLCJjb21tb24vbWF0aC50cyIsImNvbW1vbi9tZXNoRGF0YS50cyIsImNvbW1vbi9udW1iZXIudHMiLCJjb21tb24vcmVuZGVyLnRzIiwiY29tbW9uL3N0cmVhbS50cyIsImhhbmRsZS9JSGFuZGxlLnRzIiwiaGFuZGxlL21lc2hEYXRhSGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVUsSUFBSSxDQVNiO0FBVEQsV0FBVSxJQUFJO0lBQUMsSUFBQSxTQUFTLENBU3ZCO0lBVGMsV0FBQSxTQUFTO1FBRXBCO1lBRUksTUFBTSxDQUFDLFVBQVUsV0FBVztnQkFFeEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUM7UUFDTixDQUFDO1FBTmUsc0JBQVksZUFNM0IsQ0FBQTtJQUNMLENBQUMsRUFUYyxTQUFTLEdBQVQsY0FBUyxLQUFULGNBQVMsUUFTdkI7QUFBRCxDQUFDLEVBVFMsSUFBSSxLQUFKLElBQUksUUFTYjtBQUNELElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7QUFFeEMsU0FBUyxHQUFHLFVBQVUsRUFBZ0I7SUFFbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ25DLENBQUM7UUFDRyxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxD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QUNELFNBQVMsQ0FBQyxHQUFXO2dCQUVqQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFakIsQ0FBQztZQUNELFVBQVUsQ0FBQyxHQUFXO2dCQUVsQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakIsQ0FBQztZQUNELFVBQVUsQ0FBQyxHQUFXO2dCQUVsQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELFdBQVcsQ0FBQyxHQUFXO2dCQUVuQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELFVBQVUsQ0FBQyxHQUFXO2dCQUVsQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELFdBQVcsQ0FBQyxHQUFXO2dCQUVuQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELFdBQVcsQ0FBQyxHQUFXO2dCQUVuQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELFdBQVcsQ0FBQyxHQUFXO2dCQUVuQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELGVBQWUsQ0FBQyxHQUFXO2dCQUV2QixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxF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QUFHLElBQUksQ0FBQyxDQUFDLENBQ2xCLENBQUM7d0JBQ0csRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FDNUIsQ0FBQzs0QkFDRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs0QkFDaEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO3dCQUM3RCxDQUFDO3dCQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUMvQixDQUFDOzRCQUNHLElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDbkMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQzNELE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzRCQUMzRCxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFDM0QsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7NEJBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM1QixDQUFDO29CQUNMLENBQUM7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VSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsT0FBTzs0QkFDbEQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsU0FBUzs0QkFDcEQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsU0FBUzs0QkFDcEQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsU0FBUzs0QkFDcEQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsUUFBUTs0QkFDbkQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsUUFBUTs0QkFDbkQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsUUFBUTs0QkFDbkQsVUFBVSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsUUFBUTt3QkFDdkQsQ0FBQztvQkFDTCxDQUFDO29CQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQ25CLENBQUM7d0JBQ0csRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsQ0FDakMsQ0FBQzs0QkFDRyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs0QkFDckIsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFL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