import { BlendMode } from "@esotericsoftware/spine-core";
import { defSpineShaderName, m4mTexture } from "./assetMgr";
import { setting } from "./setting";

const ONE = 1;
const ONE_MINUS_SRC_COLOR = 0x0301;
const SRC_ALPHA = 0x0302;
const ONE_MINUS_SRC_ALPHA = 0x0303;
const ONE_MINUS_DST_ALPHA = 0x0305;
const DST_COLOR = 0x0306;

export function BlendParamToName(param: number) {
    if (param == 1) return "ONE";
    if (param == 0x0301) return "ONE_MINUS_SRC_COLOR";
    if (param == 0x0302) return "SRC_ALPHA";
    if (param == 0x0303) return "ONE_MINUS_SRC_ALPHA";
    if (param == 0x0305) return "ONE_MINUS_DST_ALPHA";
    if (param == 0x0306) return "DST_COLOR";
}

export class SpineMeshBatcher {
    private static VERTEX_SIZE = 13;
    private mesh: m4m.render.glMesh;
    private vertices: Float32Array;
    private verticesLength = 0;
    private indices: Uint16Array;
    private indicesLength = 0;

    private drawParams: { start: number, count: number, slotTexture: m4mTexture, slotBlendMode: BlendMode, srcRgb: number, srcAlpha: number, dstRgb: number, dstAlpha: number }[] = [];
    private _needUpdate: boolean;
    private _shader: m4m.framework.shader;
    private _color: m4m.math.vector4;
    constructor(shader: m4m.framework.shader, color: m4m.math.vector4, maxVertices: number = 10920) {
        if (maxVertices > 10920) throw new Error("Can't have more than 10920 triangles per batch: " + maxVertices);
        this.vertices = new Float32Array(maxVertices * SpineMeshBatcher.VERTEX_SIZE);
        this.indices = new Uint16Array(maxVertices * 3);
        this._shader = shader;
        this._color = color;
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

    batch(vertices: ArrayLike<number>, verticesLength: number, indices: ArrayLike<number>, indicesLength: number, z: number = 0, slotBlendMode: BlendMode, slotTexture: m4mTexture) {
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
            vertexBuffer[i++] = vertices[j++];//r
            vertexBuffer[i++] = vertices[j++];//g
            vertexBuffer[i++] = vertices[j++];//b
            vertexBuffer[i++] = vertices[j++];//a
        }
        this.verticesLength = i;

        let indicesArray = this.indices;
        for (i = this.indicesLength, j = 0; j < indicesLength; i++, j++)
            indicesArray[i] = indices[j] + indexAdd;
        this.indicesLength += indicesLength;
        this.addDrawParams(indexStart, indicesLength, slotBlendMode, slotTexture)
    }

    private addDrawParams(start: number, count: number, slotBlendMode: BlendMode, slotTexture: m4mTexture) {
        if (this.drawParams.length > 0) {
            let last = this.drawParams[this.drawParams.length - 1];
            if (last.slotTexture == slotTexture && last.slotBlendMode == slotBlendMode) {
                last.count += count;
                return;
            }
        }
        let srcRgb, srcAlpha, dstRgb, dstAlpha;
        switch (slotBlendMode) {
            case BlendMode.Normal:
                srcRgb = setting.premultipliedAlpha ? ONE : SRC_ALPHA;
                srcAlpha = ONE;
                dstRgb = dstAlpha = ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode.Additive:
                srcRgb = setting.premultipliedAlpha ? ONE : SRC_ALPHA;
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
        this.drawParams.push({ start, count, slotTexture, slotBlendMode, srcRgb, srcAlpha, dstRgb, dstAlpha });
    }

    end() {
        this._needUpdate = true;
    }

    private _projectMat = new m4m.math.matrix();
    private _mat = new m4m.framework.material();
    render(context: m4m.framework.renderContext, app: m4m.framework.application) {
        let { webgl } = context;
        if (this._needUpdate) {
            this._needUpdate = false;
            if (this.mesh == null) {
                let mesh = new m4m.render.glMesh();
                let vf = m4m.render.VertexFormatMask.Position
                    | m4m.render.VertexFormatMask.Color
                    | m4m.render.VertexFormatMask.UV0
                    | m4m.render.VertexFormatMask.ColorEX
                mesh.initBuffer(webgl, vf, this.vertices.length / SpineMeshBatcher.VERTEX_SIZE, m4m.render.MeshTypeEnum.Dynamic);
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
            let shader = this._shader ?? app.getAssetMgr().getShader(defSpineShaderName);
            this._mat.setShader(shader);
            // ortho(0, app.width, 0, app.height, -1, 1, this._projectMat);
            // m4m.math.matrixMakeIdentity(this._projectMat);
            this.mesh.bindVboBuffer(webgl);
            let pass = shader.passes["base"][0];
            this.mesh.bind(webgl, pass.program, 0);
            for (let i = 0; i < this.drawParams.length; i++) {
                let { start, count, slotTexture, srcRgb, srcAlpha, dstAlpha, dstRgb } = this.drawParams[i];
                pass.state_blend = true;
                pass.state_blendEquation = m4m.render.webglkit.FUNC_ADD;
                pass.state_blendSrcRGB = srcRgb;
                pass.state_blendSrcAlpha = srcAlpha;
                pass.state_blendDestRGB = dstRgb;
                pass.state_blendDestALpha = dstAlpha;
                //强制blend
                m4m.render.glDrawPass["lastPassID"] = null;
                pass.state_blendMode = 1;
                m4m.render.glDrawPass.lastBlendMode = null;
                pass.use(webgl);
                this._mat.setTexture("_MainTex", slotTexture.texture);
                this._mat.setVector4("MainColor", this._color);
                // this._mat.setMatrix("_SpineMvp", this._projectMat);
                this._mat.uploadUnifoms(pass, context);
                this.mesh.drawElementTris(webgl, start, count);
            }
        }
    }


}

export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number, out: m4m.math.matrix) {
    let x_orth = 2 / (right - left);
    let y_orth = 2 / (top - bottom);
    let z_orth = -2 / (far - near);

    let tx = -(right + left) / (right - left);
    let ty = -(top + bottom) / (top - bottom);
    let tz = -(far + near) / (far - near);

    out.rawData[0] = x_orth;
    out.rawData[1] = 0;
    out.rawData[2] = 0;
    out.rawData[3] = 0;
    out.rawData[4] = 0;
    out.rawData[5] = y_orth;
    out.rawData[6] = 0;
    out.rawData[7] = 0;
    out.rawData[8] = 0;
    out.rawData[9] = 0;
    out.rawData[10] = z_orth;
    out.rawData[11] = 0;
    out.rawData[12] = tx;
    out.rawData[13] = ty;
    out.rawData[14] = tz;
    out.rawData[15] = 1;
    return out;
}