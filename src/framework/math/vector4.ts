"use strict";
namespace m4m.math {
    export function vec4Clone(from: vector4, to: vector4) {
        to.x = from.x;
        to.y = from.y;
        to.z = from.z;
        to.w = from.w;
        //to.rawData.set(from.rawData);
        // to.rawData[0] = from.rawData[0];
        // to.rawData[1] = from.rawData[1];
        // to.rawData[2] = from.rawData[2];
        // to.rawData[3] = from.rawData[3];
    }

    export function vec4SLerp(vector: vector4, vector2: vector4, v: number, out: vector4) {
        out.x = vector.x * (1 - v) + vector2.x * v;
        out.y = vector.y * (1 - v) + vector2.y * v;
        out.z = vector.z * (1 - v) + vector2.z * v;
        out.w = vector.w * (1 - v) + vector2.w * v;

    }

    export function vec4Add(a: m4m.math.vector4, b: m4m.math.vector4, out: m4m.math.vector4) {
        // out.rawData[0] = a.rawData[0] + b.rawData[0];
        // out.rawData[1] = a.rawData[1] + b.rawData[1];
        // out.rawData[2] = a.rawData[2] + b.rawData[2];
        // out.rawData[3] = a.rawData[3] + b.rawData[3];
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        out.w = a.w + b.w;
    }

    export function vec4ScaleByNum(from: m4m.math.vector4, scale: number, out: m4m.math.vector4) {
        // out.rawData[0] = from.rawData[0] * scale;
        // out.rawData[1] = from.rawData[1] * scale;
        // out.rawData[2] = from.rawData[2] * scale;
        // out.rawData[3] = from.rawData[3] * scale;
        out.x = from.x * scale;
        out.y = from.y * scale;
        out.z = from.z * scale;
        out.w = from.w * scale;
    }

    export function vec4SetAll(vector: vector4, value: number) {
        // vector.rawData[0] = value;
        // vector.rawData[1] = value;
        // vector.rawData[2] = value;
        // vector.rawData[3] = value;
        vector.x = value;
        vector.y = value;
        vector.z = value;
        vector.w = value;
    }

    export function vec4Set(vector: vector4, x: number, y: number, z: number, w: number) {
        // vector.rawData[0] = x;
        // vector.rawData[1] = y;
        // vector.rawData[2] = z;
        // vector.rawData[3] = w;
        vector.x = x;
        vector.y = y;
        vector.z = z;
        vector.w = w;
    }

    export function vec4Equal(vector: vector4, vector2: vector4, threshold = 0.00001): boolean {
        if (vector == vector2) return true;
        if (Math.abs(vector.x - vector2.x) > threshold)
            return false;

        if (Math.abs(vector.y - vector2.y) > threshold)
            return false;

        if (Math.abs(vector.z - vector2.z) > threshold)
            return false;

        if (Math.abs(vector.w - vector2.w) > threshold)
            return false;

        return true;
    }
}