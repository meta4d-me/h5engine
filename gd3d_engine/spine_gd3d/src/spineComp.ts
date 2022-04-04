import { AnimationState, VertexEffect, SkeletonData, AnimationStateData, SkeletonClipping, Vector2, Color, RegionAttachment, TextureAtlasRegion, MeshAttachment, ClippingAttachment, NumberArrayLike, Skeleton } from "@esotericsoftware/spine-core";
import { Gd3dTexture } from "./assetMgr";
import { setting } from "./setting";
import { ortho, SpineMeshBatcher } from "./spineMeshBatcher";


@gd3d.reflect.node2DComponent
@gd3d.reflect.nodeRender
export class spineSkeleton implements gd3d.framework.I2DComponent {
    static readonly ClassName: string = "spineSkeleton";
    skeleton: Skeleton;
    state: AnimationState;
    animData: AnimationStateData;
    vertexEffect: VertexEffect;
    private _shader: gd3d.framework.shader;
    mainColor = new gd3d.math.vector4(1, 1, 1, 1);
    constructor(skeletonData: SkeletonData) {
        this.skeleton = new Skeleton(skeletonData);
        this.animData = new AnimationStateData(skeletonData);
        this.state = new AnimationState(this.animData);
    }

    set shader(shader: gd3d.framework.shader) {
        this._shader = shader;
    }

    start() {

    }

    onPlay() {

    }
    update(delta: number) {
        let state = this.state;
        let skeleton = this.skeleton;

        state.update(delta);
        state.apply(skeleton);
        skeleton.updateWorldTransform();
        this.updateGeometry();

        this.onUpdate?.(delta);
    }
    onUpdate: (delta: number) => void

    private _toTransFormMatrix = new gd3d.math.matrix3x2([1, 0, 0, -1, 0, 0]);
    get toTransformMatrix() {
        return this._toTransFormMatrix;
    }

    getToCanvasMatrix(mat = new gd3d.math.matrix3x2()): gd3d.math.matrix3x2 {
        gd3d.math.matrix3x2Multiply(this.transform.getCanvasWorldMatrix(), this._toTransFormMatrix, mat)
        return mat;
    }

    private _spineToWorld = new gd3d.math.matrix3x2();
    private _spineToWorld2 = new gd3d.math.matrix();
    render(canvas: gd3d.framework.canvas) {
        let app = canvas.scene.app;
        let context: gd3d.framework.renderContext = canvas["context"];
        let worldMat = this.transform.getWorldMatrix();
        let spineToWorld = this._spineToWorld;

        gd3d.math.matrix3x2Multiply(worldMat, this._toTransFormMatrix, spineToWorld);

        let mat = this._spineToWorld2;
        mat.rawData[0] = spineToWorld.rawData[0];
        mat.rawData[1] = spineToWorld.rawData[1];
        mat.rawData[4] = spineToWorld.rawData[2];
        mat.rawData[5] = spineToWorld.rawData[3];
        mat.rawData[12] = spineToWorld.rawData[4];
        mat.rawData[13] = spineToWorld.rawData[5];
        context.matrixModel = mat;

        // let worldPos = this.transform.getWorldTranslate();
        // let worldRot = this.transform.getWorldRotate();
        // let worldScale = this.transform.getWorldScale();
        // gd3d.math.quatFromAxisAngle(gd3d.math.z_AXIS(), worldRot.v * 180 / Math.PI, this._quat)
        // gd3d.math.matrixMakeTransformRTS(new gd3d.math.vector3(worldPos.x, worldPos.y, 0), new gd3d.math.vector3(worldScale.x, worldScale.y, 1.0), this._quat, this._modelMat);
        // let pmat = new gd3d.math.matrix();
        // ortho(0, app.width, 0, app.height, -1, 1, pmat);
        // gd3d.math.matrixMultiply(pmat, this._modelMat, this._modelMat);
        // context.matrixModel = this._modelMat;

        for (let i = 0; i < this.batches.length; i++) {
            this.batches[i].render(context, app);
        }
    }

    private batches = new Array<SpineMeshBatcher>();
    private nextBatchIndex = 0;
    private clipper = new SkeletonClipping();

    private tempPos = new Vector2();
    private tempUv = new Vector2();
    private tempLight = new Color();
    private tempDark = new Color();
    private tempColor = new Color();
    private tempColor2 = new Color();
    private vertices = new Float32Array(1024);
    private zOffset: number = 0.1;
    static VERTEX_SIZE = 2 + 2 + 4 + 4;
    static QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
    private updateGeometry() {
        this.clearBatches();
        let tempPos = this.tempPos;
        let tempUv = this.tempUv;
        let tempLight = this.tempLight;
        let tempDark = this.tempDark;
        let clipper = this.clipper;

        let vertices = this.vertices;
        let triangles: Array<number> = null;
        let uvs = null;
        let drawOrder = this.skeleton.drawOrder;
        let skeletonColor = this.skeleton.color;
        let batch = this.nextBatch();
        batch.begin();
        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let vertexSize = clipper.isClipping() ? 2 : spineSkeleton.VERTEX_SIZE;
            let slot = drawOrder[i];
            if (!slot.bone.active) continue
            let attachment = slot.getAttachment();
            let texture: Gd3dTexture = null;
            let attachmentColor: Color = null;
            let numFloats = 0;
            if (attachment instanceof RegionAttachment) {
                let region = <RegionAttachment>attachment;
                attachmentColor = region.color;
                vertices = this.vertices;
                numFloats = vertexSize * 4;
                region.computeWorldVertices(slot.bone, vertices, 0, vertexSize);
                triangles = spineSkeleton.QUAD_TRIANGLES;
                uvs = region.uvs;
                texture = <Gd3dTexture>(<TextureAtlasRegion>region.region.renderObject).page.texture;
            } else if (attachment instanceof MeshAttachment) {
                let mesh = <MeshAttachment>attachment;
                attachmentColor = mesh.color;
                vertices = this.vertices;
                numFloats = (mesh.worldVerticesLength >> 1) * vertexSize;
                if (numFloats > vertices.length) {
                    vertices = this.vertices = new Float32Array(numFloats);
                }
                mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, vertexSize);
                triangles = mesh.triangles;
                uvs = mesh.uvs;
                texture = <Gd3dTexture>(<TextureAtlasRegion>mesh.region.renderObject).page.texture;
            } else if (attachment instanceof ClippingAttachment) {
                let clip = <ClippingAttachment>(attachment);
                clipper.clipStart(slot, clip);
                continue;
            } else continue;

            if (texture != null) {
                let slotColor = slot.color;
                let finalColor = this.tempColor;
                finalColor.r = skeletonColor.r * slotColor.r * attachmentColor.r;
                finalColor.g = skeletonColor.g * slotColor.g * attachmentColor.g;
                finalColor.b = skeletonColor.b * slotColor.b * attachmentColor.b;
                finalColor.a = skeletonColor.a * slotColor.a * attachmentColor.a;
                if (setting.premultipliedAlpha) {
                    finalColor.r *= finalColor.a;
                    finalColor.g *= finalColor.a;
                    finalColor.b *= finalColor.a;
                }
                let darkColor = this.tempColor2;
                if (!slot.darkColor)
                    darkColor.set(0, 0, 0, 1.0);
                else {
                    if (setting.premultipliedAlpha) {
                        darkColor.r = slot.darkColor.r * finalColor.a;
                        darkColor.g = slot.darkColor.g * finalColor.a;
                        darkColor.b = slot.darkColor.b * finalColor.a;
                    } else {
                        darkColor.setFromColor(slot.darkColor);
                    }
                    darkColor.a = setting.premultipliedAlpha ? 1.0 : 0.0;
                }


                let finalVertices: NumberArrayLike;
                let finalVerticesLength: number;
                let finalIndices: NumberArrayLike;
                let finalIndicesLength: number;

                if (clipper.isClipping()) {
                    clipper.clipTriangles(vertices, numFloats, triangles, triangles.length, uvs, finalColor, darkColor, true);
                    let clippedVertices = clipper.clippedVertices;
                    let clippedTriangles = clipper.clippedTriangles;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        let verts = clippedVertices;
                        for (let v = 0, n = clippedVertices.length; v < n; v += vertexSize) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempLight.set(verts[v + 2], verts[v + 3], verts[v + 4], verts[v + 5]);
                            tempUv.x = verts[v + 6];
                            tempUv.y = verts[v + 7];
                            tempDark.set(verts[v + 8], verts[v + 9], verts[v + 10], verts[v + 11]);
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y
                            verts[v + 8] = tempDark.r;
                            verts[v + 9] = tempDark.g;
                            verts[v + 10] = tempDark.b;
                            verts[v + 11] = tempDark.a;
                        }
                    }
                    finalVertices = clippedVertices;
                    finalVerticesLength = clippedVertices.length;
                    finalIndices = clippedTriangles;
                    finalIndicesLength = clippedTriangles.length;
                } else {
                    let verts = vertices;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        for (let v = 0, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempUv.x = uvs[u];
                            tempUv.y = uvs[u + 1]
                            tempLight.setFromColor(finalColor);
                            tempDark.setFromColor(darkColor);
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y
                            verts[v + 8] = tempDark.r;
                            verts[v + 9] = tempDark.g;
                            verts[v + 10] = tempDark.b;
                            verts[v + 11] = tempDark.a;
                        }
                    } else {
                        for (let v = 2, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            verts[v] = finalColor.r;
                            verts[v + 1] = finalColor.g;
                            verts[v + 2] = finalColor.b;
                            verts[v + 3] = finalColor.a;
                            verts[v + 4] = uvs[u];
                            verts[v + 5] = uvs[u + 1];
                            verts[v + 6] = darkColor.r;
                            verts[v + 7] = darkColor.g;
                            verts[v + 8] = darkColor.b;
                            verts[v + 9] = darkColor.a;
                        }
                    }
                    finalVertices = vertices;
                    finalVerticesLength = numFloats;
                    finalIndices = triangles;
                    finalIndicesLength = triangles.length;
                }

                if (finalVerticesLength == 0 || finalIndicesLength == 0)
                    continue;

                if (!batch.canBatch(finalVerticesLength, finalIndicesLength)) {
                    batch.end();
                    batch = this.nextBatch();
                    batch.begin();
                }

                batch.batch(finalVertices, finalVerticesLength, finalIndices, finalIndicesLength, 0, slot.data.blendMode, texture);
                // z += zOffset;
            }

            clipper.clipEndWithSlot(slot);
        }
        clipper.clipEnd();
        batch.end();
    }

    private clearBatches() {
        for (var i = 0; i < this.batches.length; i++) {
            this.batches[i].clear();
        }
        this.nextBatchIndex = 0;
    }

    private nextBatch() {
        if (this.batches.length == this.nextBatchIndex) {
            let batch = new SpineMeshBatcher(this._shader, this.mainColor);
            this.batches.push(batch);
        }
        let batch = this.batches[this.nextBatchIndex++];
        return batch;
    }

    updateTran() {
        var m = this.transform.getWorldMatrix();
    }


    transform: gd3d.framework.transform2D;
    remove() {
        this.transform = null;
    }
}