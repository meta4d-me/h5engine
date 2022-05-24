
namespace m4m.math
{


    export type byte = number;
    export type short = number;
    export type int = number;
    export type ushort = number;
    export type uint = number;
    export type float = number;
    export type double = number;

    var _byte: Uint8Array = new Uint8Array(1);
    var _int16: Int32Array = new Int32Array(1);
    var _int32: Int32Array = new Int32Array(1);
    var _uint16: Int32Array = new Int32Array(1);
    var _uint32: Int32Array = new Int32Array(1);
    var _float32: Float32Array = new Float32Array(1);
    var _float64: Float64Array = new Float64Array(1);
    export function Byte(v: number | string = 0): byte
    {
        if (typeof (v) == "string")
            v = Number(v);
        _byte[0] = v;
        return _byte[0];
    }

    export function Int16(v: number | string = 0): short
    {
        if (typeof (v) == "string")
            v = Number(v);
        _int16[0] = v;
        return _int16[0];
    }

    export function Int32(v: number | string = 0): int
    {
        if (typeof (v) == "string")
            v = Number(v);
        _int32[0] = v;
        return _int32[0];
    }


    export function UInt16(v: number | string = 0): ushort
    {
        if (typeof (v) == "string")
            v = Number(v);
        _uint16[0] = v;
        return _uint16[0];
    }

    export function UInt32(v: number | string = 0): uint
    {
        if (typeof (v) == "string")
            v = Number(v);
        _uint32[0] = v;
        return _uint32[0];
    }

    export function Float(v: number | string = 0): float
    {
        if (typeof (v) == "string")
            v = Number(v);
        _float32[0] = v;
        return _float32[0];
    }

    export function Double(v: number | string = 0): double
    {
        if (typeof (v) == "string")
            v = Number(v);
        _float64[0] = v;
        return _float64[0];
    }


    /**
     * @private
     */

    export class vector2
    {

        constructor(public x: float = 0, public y: float = 0, public w: float = 0, public h: float = 0)
        {
        }


    }

    /**
     * @private
     */

    export class rect
    {

        constructor(public x: float = 0, public y: float = 0, public w: float = 0, public h: float = 0)
        {

        }

    }

    /**
     * @private
     */

    export class border
    {

        constructor(public l: float = 0, public t: float = 0, public r: float = 0, public b: float = 0)
        {
        }


    }

    /**
     * @private
     */

    export class color
    {

        constructor(public r: float = 1, public g: float = 1, public b: float = 1, public a: float = 1)
        {

        }

    }

    /**
     * @private
     */

    export class vector3
    {

        constructor(public x: float = 0, public y: float = 0, public z: float = 0)
        {

        }

    }

    /**
     * @private
     */

    export class vector4
    {
        constructor(public x: float = 0, public y: float = 0, public z: float = 0, public w: float = 0)
        {

        }

    }

    /**
     * @private
     */

    export class quaternion
    {

        constructor(public x: float = 0, public y: float = 0, public z: float = 0, public w: float = 1)
        {
        }


    }

    /**
     * @private
     */
    export class matrix
    {
        public rawData: Float32Array;
        constructor(datas: Float32Array = null)
        {
            if (datas)
            {
                this.rawData = datas;
            }
            else
                this.rawData = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        }
        toString(): string
        {
            return "[" + this.rawData[0] + "," + this.rawData[1] + "," + this.rawData[2] + "," + this.rawData[3] + "],"
                + "[" + this.rawData[4] + "," + this.rawData[5] + "," + this.rawData[6] + "," + this.rawData[7] + "],"
                + "[" + this.rawData[8] + "," + this.rawData[9] + "," + this.rawData[10] + "," + this.rawData[11] + "],"
                + "[" + this.rawData[12] + "," + this.rawData[13] + "," + this.rawData[14] + "," + this.rawData[15] + "]";
        }
    }
    /**
     * @private
     */
    export class matrix3x2
    {
        public rawData: Float32Array;
        constructor(datas: Float32Array = null)
        {
            if (datas)
            {
                this.rawData = datas;
            }
            else
                this.rawData = new Float32Array([1, 0, 0, 1, 0, 0]);
        }
        toString(): string
        {
            return "[" + this.rawData[0] + "," + this.rawData[1] + "," + this.rawData[2] + "],"
                + "[" + this.rawData[3] + "," + this.rawData[4] + "," + this.rawData[5] + "]";
        }
    }
}