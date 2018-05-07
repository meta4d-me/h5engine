namespace gd3d.render
{
    /**
     * @private
     */
    export enum VertexFormatMask
    {
        Position = 0x00000001,
        Normal = 0x00000002,
        Tangent = 0x00000004,
        Color = 0x00000008,
        UV0 = 0x00000010,
        UV1 = 0x00000020,
        BlendIndex4 = 0x00000040,
        BlendWeight4 = 0x00000080,
        ColorEX = 0x00000100,
    }
    /**
     * @private
     */
    export class number4
    {
        v0: number;
        v1: number;
        v2: number;
        v3: number;
    }
    /**
     * @private
     */
    export enum MeshTypeEnum
    {
        Static,
        Dynamic,
        Stream,
    }
}