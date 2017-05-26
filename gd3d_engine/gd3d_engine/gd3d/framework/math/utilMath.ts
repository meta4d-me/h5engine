//找不到归属的放这里
namespace gd3d.math
{
    //row：图片行数//column:图片列数//index：第几张图片（index从0开始计数）
    export function spriteAnimation(row: number, column: number, index: number, out: vector4)
    {
        var width = 1 / column;
        var height = 1 / row;
        var offsetx = width * (index % column);
        var offsety = height * Math.floor(index / column);

        out.x = width;
        out.y = height;
        out.z = offsetx;
        out.w = offsety;
        // var uvOffset=new gd3d.math.vector4(width,height,offsetx,offsety);
        // return  uvOffset;
    }
}