import { BlendMode } from "@esotericsoftware/spine-core";
import { Gd3dTexture } from ".";
export declare function BlendParamToName(param: number): "ONE" | "ONE_MINUS_SRC_COLOR" | "SRC_ALPHA" | "ONE_MINUS_SRC_ALPHA" | "ONE_MINUS_DST_ALPHA" | "DST_COLOR";
export declare class SpineMeshBatcher {
    private static VERTEX_SIZE;
    private mesh;
    private vertices;
    private verticesLength;
    private indices;
    private indicesLength;
    private drawParams;
    private _needUpdate;
    private _shader;
    constructor(shader: gd3d.framework.shader, maxVertices?: number);
    dispose(): void;
    clear(): void;
    canBatch(verticesLength: number, indicesLength: number): boolean;
    begin(): void;
    batch(vertices: ArrayLike<number>, verticesLength: number, indices: ArrayLike<number>, indicesLength: number, z: number, slotBlendMode: BlendMode, slotTexture: Gd3dTexture): void;
    private addDrawParams;
    end(): void;
    private _projectMat;
    private _mat;
    render(context: gd3d.framework.renderContext, app: gd3d.framework.application): void;
}
