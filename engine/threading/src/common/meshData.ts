namespace m4m.render
{
    /**
     * @private
     */
    export class meshData
    {
        originVF: number;

        pos: m4m.math.vector3[];//use pos.length 作为定点数量
        color: m4m.math.color[];
        colorex: m4m.math.color[];
        uv: m4m.math.vector2[];
        uv2: m4m.math.vector2[];//lightmap
        normal: m4m.math.vector3[];//法线
        tangent: m4m.math.vector3[];//切线
        blendIndex: number4[];
        blendWeight: number4[];
        //三角形索引
        trisindex: number[];
    }
}