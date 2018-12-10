namespace gd3d.math{
    export function vec4Clone(from: vector4, to: vector4) {
        // to.x = from.x;
        // to.y = from.y;
        // to.z = from.z;
        // to.w = from.w;
        //to.rawData.set(from.rawData);
        to.rawData[0]=from.rawData[0];
        to.rawData[1]=from.rawData[1];
        to.rawData[2]=from.rawData[2];
        to.rawData[3]=from.rawData[3];
    }

    export function vec4SLerp(vector: vector4, vector2: vector4, v: number, out: vector4) {
        out.x = vector.x * (1 - v) + vector2.x * v;
        out.y = vector.y * (1 - v) + vector2.y * v;
        out.z = vector.z * (1 - v) + vector2.z * v;
        out.w = vector.w * (1 - v) + vector2.w * v;
        
    }

    export function vec4Add(a: gd3d.math.vector4, b: gd3d.math.vector4, out: gd3d.math.vector4){
        out.rawData[0] = a.rawData[0] + b.rawData[0];
        out.rawData[1] = a.rawData[1] + b.rawData[1];
        out.rawData[2] = a.rawData[2] + b.rawData[2];
        out.rawData[3] = a.rawData[3] + b.rawData[3];
    }

    export function vec4ScaleByNum(from: gd3d.math.vector4, scale: number, out: gd3d.math.vector4){
        out.rawData[0] = from.rawData[0] * scale;
        out.rawData[1] = from.rawData[1] * scale;
        out.rawData[2] = from.rawData[2] * scale;
        out.rawData[3] = from.rawData[3] * scale;
    }

    
}