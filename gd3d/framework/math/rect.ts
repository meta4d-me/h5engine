namespace gd3d.math
{
    export function rectSet_One(out: rect)
    {
        out.x = 0;
        out.y = 0;
        out.w = 1;
        out.h = 1;
    }

    export function rectSet_Zero(out: rect)
    {
        out.x = 0;
        out.y = 0;
        out.w = 0;
        out.h = 0;
    }

    export function rectEqul(src1: rect, src2: rect): boolean
    {
        return !((src1.x != src2.x) ||
            (src1.y != src2.y) ||
            (src1.w != src2.w) ||
            (src1.h != src2.h));
    }

    export function rectInner(x: number, y: number, src: rect): boolean
    {
        if (x < src.x || x > src.x + src.w ||
            y < src.y || y > src.y + src.h)
        {
            return false;
        }
        return true;
    }
}