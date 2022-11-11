﻿namespace m4m.math {
    export function colorSet(out: color, r: number, g: number, b: number, a: number) {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
    }

    export function colorSet_White(out: color) {
        out.r = 1;
        out.g = 1;
        out.b = 1;
        out.a = 1;
    }
    export function colorSet_Black(out: color) {
        out.r = 0;
        out.g = 0;
        out.b = 0;
        out.a = 1;
    }
    export function colorSet_Gray(out: color) {
        out.r = 0.5;
        out.g = 0.5;
        out.b = 0.5;
        out.a = 1;
    }

    export function colorMultiply(srca: color, srcb: color, out: color) {
        out.r = srca.r * srcb.r;
        out.g = srca.g * srcb.g;
        out.b = srca.b * srcb.b;
        out.a = srca.a * srcb.a;
    }

    export function scaleToRef(src: color, scale: number, out: color) {
        out.r = src.r * scale;
        out.g = src.g * scale;
        out.b = src.b * scale;
        out.a = src.a * scale;
    }

    export function colorClone(src: color, out: color) {
        out.a = src.a;
        out.r = src.r;
        out.g = src.g;
        out.b = src.b;
        //out.rawData.set(src.rawData);
        // out.rawData[0]=src.rawData[0];
        // out.rawData[1]=src.rawData[1];
        // out.rawData[2]=src.rawData[2];
        // out.rawData[3]=src.rawData[3];
    }

    export function colorLerp(srca: color, srcb: color, t: number, out: color) {
        out.a = t * (srcb.a - srca.a) + srca.a;
        out.r = t * (srcb.r - srca.r) + srca.r;
        out.g = t * (srcb.g - srca.g) + srca.g;
        out.b = t * (srcb.b - srca.b) + srca.b;

        // out.a = Math.floor(out.a);
        // out.r = Math.floor(out.r);
        // out.g = Math.floor(out.g);
        // out.b = Math.floor(out.b);
    }

    export function colorEqual(c: color, c1: color, threshold = 0.00001): boolean {
        if (c == c1) return true;
        if (Math.abs(c.r - c1.r) > threshold) return false;

        if (Math.abs(c.g - c1.g) > threshold) return false;

        if (Math.abs(c.b - c1.b) > threshold) return false;

        if (Math.abs(c.a - c1.a) > threshold) return false;

        return true;
    }

    /**
     * 颜色转成 CSS 格式
     * @param src 
     * @param hasAlpha 是否包含Alpha
     * @returns like #ffffffff
     */
    export function colorToCSS(src: color, hasAlpha = true): string {
        let r = Math.round(src.r * 255).toString(16);
        let g = Math.round(src.r * 255).toString(16);
        let b = Math.round(src.r * 255).toString(16);
        if (r.length == 1) r += "0";
        if (g.length == 1) g += "0";
        if (b.length == 1) b += "0";
        if (hasAlpha) {
            let a = Math.round(src.r * 255).toString(16);
            if (a.length == 1) a += "0";
            return `#${r}${g}${b}${a}`;
        } else {
            return `#${r}${g}${b}`;
        }
    }

}