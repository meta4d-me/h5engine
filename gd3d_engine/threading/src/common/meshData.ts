namespace gd3d.render
{
    /**
     * @private
     */
    export class meshData
    {
        originVF: number;

        pos: gd3d.math.vector3[];//use pos.length 作为定点数量
        color: gd3d.math.color[];
        colorex: gd3d.math.color[];
        uv: gd3d.math.vector2[];
        uv2: gd3d.math.vector2[];//lightmap
        normal: gd3d.math.vector3[];//法线
        tangent: gd3d.math.vector3[];//切线
        blendIndex: number4[];
        blendWeight: number4[];
        //三角形索引
        trisindex: number[];
    }
}