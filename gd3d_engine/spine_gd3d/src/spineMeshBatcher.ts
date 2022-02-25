import { BlendMode } from "../node_modules/@esotericsoftware/spine-core/dist/SlotData";

export class SpineMeshBatcher {
    private static VERTEX_SIZE = 9;
    private mesh: gd3d.render.glMesh;
    private vertices: Float32Array;
    private verticesLength = 0;
    private indices: Uint16Array;
    private indicesLength = 0;

    private mats: { mat: gd3d.render.glProgram, start: number, count: number }[] = [];
    private _needUpdate: boolean;

    constructor(maxVertices: number = 10920) {
        if (maxVertices > 10920) throw new Error("Can't have more than 10920 triangles per batch: " + maxVertices);
        this.vertices = new Float32Array(maxVertices * SpineMeshBatcher.VERTEX_SIZE);
        this.indices = new Uint16Array(maxVertices * 3);
    }

    dispose() {

    }

    clear() {

    }

    canBatch(verticesLength: number, indicesLength: number) {
        if (this.indicesLength + indicesLength >= this.indices.length) return false;
        if (this.verticesLength + verticesLength >= this.vertices.length) return false;
        return true;
    }

    begin() {
        this.mesh = null;
        this.verticesLength = 0;
        this.indicesLength = 0;
    }

    batch(vertices: ArrayLike<number>, verticesLength: number, indices: ArrayLike<number>, indicesLength: number, slotBlendMode: BlendMode, slotTexture: gd3d.framework.texture, z: number = 0) {
        let indexStart = this.verticesLength / SpineMeshBatcher.VERTEX_SIZE;
        let vertexBuffer = this.vertices;
        let i = this.verticesLength;
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
            indicesArray[i] = indices[j] + indexStart;
        this.indicesLength += indicesLength;
        //todo
    }

    end() {
        this._needUpdate = true;
    }

    render(webgl: WebGLRenderingContext) {
        if (this._needUpdate) {
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
            for (let i = 0; i < this.mats.length; i++) {
                let { mat, start, count } = this.mats[i]
                this.mesh.bind(webgl, mat, 0)
                this.mesh.drawElementTris(webgl, start, count);
            }
        }
    }
}