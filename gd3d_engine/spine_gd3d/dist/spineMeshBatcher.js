import { BlendMode } from "@esotericsoftware/spine-core";
import { defSpineShaderName } from ".";
import { spineSkeleton } from "./spineComp";
const ONE = 1;
const ONE_MINUS_SRC_COLOR = 0x0301;
const SRC_ALPHA = 0x0302;
const ONE_MINUS_SRC_ALPHA = 0x0303;
const ONE_MINUS_DST_ALPHA = 0x0305;
const DST_COLOR = 0x0306;
export function BlendParamToName(param) {
    if (param == 1)
        return "ONE";
    if (param == 0x0301)
        return "ONE_MINUS_SRC_COLOR";
    if (param == 0x0302)
        return "SRC_ALPHA";
    if (param == 0x0303)
        return "ONE_MINUS_SRC_ALPHA";
    if (param == 0x0305)
        return "ONE_MINUS_DST_ALPHA";
    if (param == 0x0306)
        return "DST_COLOR";
}
export class SpineMeshBatcher {
    constructor(shader, maxVertices = 10920) {
        this.verticesLength = 0;
        this.indicesLength = 0;
        this.drawParams = [];
        this._projectMat = new gd3d.math.matrix();
        this._mat = new gd3d.framework.material();
        if (maxVertices > 10920)
            throw new Error("Can't have more than 10920 triangles per batch: " + maxVertices);
        this.vertices = new Float32Array(maxVertices * SpineMeshBatcher.VERTEX_SIZE);
        this.indices = new Uint16Array(maxVertices * 3);
        this._shader = shader;
    }
    dispose() {
    }
    clear() {
        this.drawParams = [];
    }
    canBatch(verticesLength, indicesLength) {
        if (this.indicesLength + indicesLength >= this.indices.length)
            return false;
        if (this.verticesLength + verticesLength >= this.vertices.length)
            return false;
        return true;
    }
    begin() {
        this.verticesLength = 0;
        this.indicesLength = 0;
        this.drawParams = [];
    }
    batch(vertices, verticesLength, indices, indicesLength, z = 0, slotBlendMode, slotTexture) {
        let indexAdd = this.verticesLength / SpineMeshBatcher.VERTEX_SIZE;
        let indexStart = this.indicesLength;
        let i = this.verticesLength;
        let vertexBuffer = this.vertices;
        let j = 0;
        for (; j < verticesLength;) {
            vertexBuffer[i++] = vertices[j++]; //x
            vertexBuffer[i++] = vertices[j++]; //y
            vertexBuffer[i++] = z;
            vertexBuffer[i++] = vertices[j++]; //r
            vertexBuffer[i++] = vertices[j++]; //g
            vertexBuffer[i++] = vertices[j++]; //b
            vertexBuffer[i++] = vertices[j++]; //a
            vertexBuffer[i++] = vertices[j++]; //u
            vertexBuffer[i++] = vertices[j++]; //v
            vertexBuffer[i++] = vertices[j++]; //r
            vertexBuffer[i++] = vertices[j++]; //g
            vertexBuffer[i++] = vertices[j++]; //b
            vertexBuffer[i++] = vertices[j++]; //a
        }
        this.verticesLength = i;
        let indicesArray = this.indices;
        for (i = this.indicesLength, j = 0; j < indicesLength; i++, j++)
            indicesArray[i] = indices[j] + indexAdd;
        this.indicesLength += indicesLength;
        this.addDrawParams(indexStart, indicesLength, slotBlendMode, slotTexture);
    }
    addDrawParams(start, count, slotBlendMode, slotTexture) {
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
        this.drawParams.push({ start, count, slotTexture, slotBlendMode, srcRgb, srcAlpha, dstRgb, dstAlpha });
    }
    end() {
        this._needUpdate = true;
    }
    render(context, app) {
        var _a;
        let { webgl } = context;
        if (this._needUpdate) {
            this._needUpdate = false;
            if (this.mesh == null) {
                let mesh = new gd3d.render.glMesh();
                let vf = gd3d.render.VertexFormatMask.Position
                    | gd3d.render.VertexFormatMask.Color
                    | gd3d.render.VertexFormatMask.UV0
                    | gd3d.render.VertexFormatMask.ColorEX;
                mesh.initBuffer(webgl, vf, this.vertices.length / SpineMeshBatcher.VERTEX_SIZE, gd3d.render.MeshTypeEnum.Dynamic);
                mesh.uploadVertexData(webgl, this.vertices);
                mesh.addIndex(webgl, this.indices.length);
                mesh.uploadIndexData(webgl, 0, this.indices);
                this.mesh = mesh;
            }
            else {
                this.mesh.uploadVertexData(webgl, this.vertices);
                this.mesh.uploadIndexData(webgl, 0, this.indices);
            }
        }
        if (this.mesh) {
            let shader = (_a = this._shader) !== null && _a !== void 0 ? _a : app.getAssetMgr().getShader(defSpineShaderName);
            this._mat.setShader(shader);
            ortho(-app.width / 2, app.width / 2, -app.height / 2, app.height / 2, -1, 1, this._projectMat);
            this.mesh.bindVboBuffer(webgl);
            let pass = shader.passes["base"][0];
            this.mesh.bind(webgl, pass.program, 0);
            for (let i = 0; i < this.drawParams.length; i++) {
                let { start, count, slotTexture, srcRgb, srcAlpha, dstAlpha, dstRgb } = this.drawParams[i];
                pass.state_blend = true;
                pass.state_blendEquation = gd3d.render.webglkit.FUNC_ADD;
                pass.state_blendSrcRGB = srcRgb;
                pass.state_blendSrcAlpha = srcAlpha;
                pass.state_blendDestRGB = dstRgb;
                pass.state_blendDestALpha = dstAlpha;
                //强制blend
                gd3d.render.glDrawPass["lastPassID"] = null;
                pass.state_blendMode = 1;
                gd3d.render.glDrawPass.lastBlendMode = null;
                pass.use(webgl);
                this._mat.setTexture("_MainTex", slotTexture.texture);
                this._mat.setMatrix("_SpineMvp", this._projectMat);
                this._mat.uploadUnifoms(pass, context);
                this.mesh.drawElementTris(webgl, start, count);
            }
        }
    }
}
SpineMeshBatcher.VERTEX_SIZE = 13;
function ortho(left, right, bottom, top, near, far, out) {
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
//# sourceMappingURL=spineMeshBatcher.js.map