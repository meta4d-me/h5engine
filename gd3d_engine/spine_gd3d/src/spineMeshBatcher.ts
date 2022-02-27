import { BlendMode } from "../node_modules/@esotericsoftware/spine-core/dist/SlotData";
import { spineSkeleton } from "./spineComp";

const ONE = 1;
const ONE_MINUS_SRC_COLOR = 0x0301;
const SRC_ALPHA = 0x0302;
const ONE_MINUS_SRC_ALPHA = 0x0303;
const ONE_MINUS_DST_ALPHA = 0x0305;
const DST_COLOR = 0x0306;

export class SpineMeshBatcher {
    private static VERTEX_SIZE = 9;
    private mesh: gd3d.render.glMesh;
    private vertices: Float32Array;
    private verticesLength = 0;
    private indices: Uint16Array;
    private indicesLength = 0;

    private drawParams: { start: number, count: number, slotTexture: gd3d.framework.texture, srcRgb: number, srcAlpha: number, dstRgb: number, dstAlpha: number }[] = [];
    private _needUpdate: boolean;
    private _drawPass: gd3d.render.glDrawPass;
    private _mat: gd3d.framework.material;

    constructor(drawPass: gd3d.render.glDrawPass, maxVertices: number = 10920) {
        this._drawPass = drawPass;
        if (maxVertices > 10920) throw new Error("Can't have more than 10920 triangles per batch: " + maxVertices);
        this.vertices = new Float32Array(maxVertices * SpineMeshBatcher.VERTEX_SIZE);
        this.indices = new Uint16Array(maxVertices * 3);
        let mat = new gd3d.framework.material();
        let shader = new gd3d.framework.shader();
        shader.passes["base"] = [drawPass];
        mat.setShader(shader);
        this._mat = mat;
    }

    dispose() {

    }

    clear() {
        this.drawParams = [];
    }

    canBatch(verticesLength: number, indicesLength: number) {
        if (this.indicesLength + indicesLength >= this.indices.length) return false;
        if (this.verticesLength + verticesLength >= this.vertices.length) return false;
        return true;
    }

    begin() {
        this.verticesLength = 0;
        this.indicesLength = 0;
        this.drawParams = [];
    }

    batch(vertices: ArrayLike<number>, verticesLength: number, indices: ArrayLike<number>, indicesLength: number, z: number = 0, slotBlendMode: BlendMode, slotTexture: gd3d.framework.texture) {
        let indexAdd = this.verticesLength / SpineMeshBatcher.VERTEX_SIZE;
        let indexStart = this.indicesLength;
        let i = this.verticesLength;
        let vertexBuffer = this.vertices;
        let j = 0;
        for (; j < verticesLength;) {
            vertexBuffer[i++] = vertices[j++];//x
            vertexBuffer[i++] = vertices[j++];//y
            vertexBuffer[i++] = z;
            vertexBuffer[i++] = vertices[j++];//r
            vertexBuffer[i++] = vertices[j++];//g
            vertexBuffer[i++] = vertices[j++];//b
            vertexBuffer[i++] = vertices[j++];//a
            vertexBuffer[i++] = vertices[j++];//u
            vertexBuffer[i++] = vertices[j++];//v
        }
        this.verticesLength = i;

        let indicesArray = this.indices;
        for (i = this.indicesLength, j = 0; j < indicesLength; i++, j++)
            indicesArray[i] = indices[j] + indexAdd;
        this.indicesLength += indicesLength;
        this.addDrawParams(indexStart, indicesLength, slotBlendMode, slotTexture)
    }

    private addDrawParams(start: number, count: number, slotBlendMode: BlendMode, slotTexture: gd3d.framework.texture) {
        let srcRgb, srcAlpha, dstRgb, dstAlpha;
        switch (slotBlendMode) {
            case BlendMode.Normal:
                srcRgb = spineSkeleton.premultipliedAlpha ? ONE : SRC_ALPHA;
                srcAlpha = ONE;
                dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode.Additive:
                srcRgb = spineSkeleton.premultipliedAlpha ? ONE : SRC_ALPHA;
                srcAlpha = ONE;
                dstRgb = dstAlpha = ONE;
                break;
            case BlendMode.Multiply:
                srcRgb = DST_COLOR;
                srcAlpha = ONE_MINUS_SRC_ALPHA;
                dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode.Screen:
                srcRgb = ONE;
                srcAlpha = ONE_MINUS_SRC_ALPHA;
                dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                break;
        }
        this.drawParams.push({ start, count, slotTexture, srcRgb, srcAlpha, dstRgb, dstAlpha });
    }

    end() {
        this._needUpdate = true;
    }

    render(context: gd3d.framework.renderContext) {
        let { webgl } = context;
        if (this._needUpdate) {
            this._needUpdate = false;
            if (this.mesh == null) {
                let mesh = new gd3d.render.glMesh();
                let vf = gd3d.render.VertexFormatMask.Position
                    | gd3d.render.VertexFormatMask.Color
                    | gd3d.render.VertexFormatMask.UV0
                mesh.initBuffer(webgl, vf, this.vertices.length / SpineMeshBatcher.VERTEX_SIZE, gd3d.render.MeshTypeEnum.Dynamic);
                mesh.uploadVertexData(webgl, this.vertices);
                mesh.addIndex(webgl, this.indices.length);
                mesh.uploadIndexData(webgl, 0, this.indices);
                this.mesh = mesh;
            } else {
                this.mesh.uploadVertexData(webgl, this.vertices);
                this.mesh.uploadIndexData(webgl, 0, this.indices);
            }
        }
        if (this.mesh) {
            this.mesh.bindVboBuffer(webgl);
            for (let i = 0; i < this.drawParams.length; i++) {
                let { start, count, slotTexture, srcRgb, srcAlpha, dstAlpha, dstRgb } = this.drawParams[i]
                this.mesh.bindVboBuffer(webgl);
                this._drawPass.state_blend = true;
                this._drawPass.state_blendEquation = gd3d.render.webglkit.FUNC_ADD;
                this._drawPass.state_blendSrcRGB = srcRgb;
                this._drawPass.state_blendDestRGB = dstRgb;
                this._drawPass.state_blendSrcAlpha = srcAlpha;
                this._drawPass.state_blendDestALpha = dstAlpha;
                this._drawPass.use(webgl);
                this._mat.setTexture("_MainTex", slotTexture)
                this._mat.uploadUnifoms(this._drawPass, context);
                this.mesh.bind(webgl, this._drawPass.program, 0);
                this.mesh.drawElementTris(webgl, start, count);
            }
        }
    }
}