/// <reference path="../io/reflect.ts" />

namespace gd3d.math
{
    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class vector2
    {
        constructor(x: number = 0, y: number = 0)
        {
            this.x = x;
            this.y = y;
        }
        @gd3d.reflect.Field("number")
        x: number;
        @gd3d.reflect.Field("number")
        y: number;
        toString(): string
        {
            return this.x + "," + this.y;
        }
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class rect
    {
        constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0)
        {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        @gd3d.reflect.Field("number")
        x: number;
        @gd3d.reflect.Field("number")
        y: number;
        @gd3d.reflect.Field("number")
        w: number;
        @gd3d.reflect.Field("number")
        h: number;
        toString(): string
        {
            return this.x + "," + this.y + "," + this.w + "," + this.h;
        }
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class border
    {
        constructor(l: number = 0, t: number = 0, r: number = 0, b: number = 0)
        {
            this.l = l;
            this.t = t;
            this.r = r;
            this.b = b;
        }
        @gd3d.reflect.Field("number")
        l: number;
        @gd3d.reflect.Field("number")
        t: number;
        @gd3d.reflect.Field("number")
        r: number;
        @gd3d.reflect.Field("number")
        b: number;
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class color
    {
        constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1)
        {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        @gd3d.reflect.Field("number")
        r: number;
        @gd3d.reflect.Field("number")
        g: number;
        @gd3d.reflect.Field("number")
        b: number;
        @gd3d.reflect.Field("number")
        a: number;
        toString(): string
        {
            return this.r + "," + this.g + "," + this.b + "," + this.a;
        }
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class vector3
    {
        constructor(x: number = 0, y: number = 0, z: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        @gd3d.reflect.Field("number")
        x: number;
        @gd3d.reflect.Field("number")
        y: number;
        @gd3d.reflect.Field("number")
        z: number;
        toString(): string
        {
            return this.x + "," + this.y + "," + this.z;
        }
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class vector4
    {
        constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        @gd3d.reflect.Field("number")
        x: number;
        @gd3d.reflect.Field("number")
        y: number;
        @gd3d.reflect.Field("number")
        z: number;
        @gd3d.reflect.Field("number")
        w: number;
        toString(): string
        {
            return this.x + "," + this.y + "," + this.z + "," + this.w;
        }
    }

    /**
     * @private
     */
    @gd3d.reflect.SerializeType
    export class quaternion
    {
        constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        @gd3d.reflect.Field("number")
        x: number;
        @gd3d.reflect.Field("number")
        y: number;
        @gd3d.reflect.Field("number")
        z: number;
        @gd3d.reflect.Field("number")
        w: number;
        toString(): string
        {
            return this.x + "," + this.y + "," + this.z + "," + this.w;
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
                this.rawData = new Float32Array([1, 0, 0, 0, 1, 0]);
        }
        toString(): string
        {
            return "[" + this.rawData[0] + "," + this.rawData[1] + "," + this.rawData[2] + "],"
                + "[" + this.rawData[3] + "," + this.rawData[4] + "," + this.rawData[5] + "]";
        }
    }
    // //表示一个变换
    // export class transform
    // {
    //     rot: quaternion = new quaternion();
    //     tran: vector3 = new vector3();
    //     scale: vector3 = new vector3(1, 1, 1);
    // }
    // //表示一个不含缩放的变换
    // export class TransformWithoutScale
    // {
    //     rot: quaternion = new quaternion();
    //     tran: vector3 = new vector3();
    // }

    export function vec4FormJson(json:string,vec4:vector4)
    {
        json=json.replace("(","");
        json=json.replace(")","");    
        let arr=json.split(",");
        vec4.x=Number(arr[0]);
        vec4.y=Number(arr[1]);
        vec4.z=Number(arr[2]);
        vec4.w=Number(arr[3]);
    }
    export function vec3FormJson(json:string,vec3:vector3)
    {
        json=json.replace("(","");
        json=json.replace(")","");
        
        let arr=json.split(",");
        vec3.x=Number(arr[0]);
        vec3.y=Number(arr[1]);
        vec3.z=Number(arr[2]);
    }
    export function vec2FormJson(json:string,vec2:vector2)
    {
        json=json.replace("(","");
        json=json.replace(")","");    
        let arr=json.split(",");
        vec2.x=Number(arr[0]);
        vec2.y=Number(arr[1]);
    }
    export function colorFormJson(json:string,_color:color)
    {
        json=json.replace("RGBA(","");
        json=json.replace(")","");  
        let arr=json.split(",");
        _color.r=Number(arr[0]);
        _color.g=Number(arr[1]);
        _color.b=Number(arr[2]);
        _color.a=Number(arr[3]);
    }
}