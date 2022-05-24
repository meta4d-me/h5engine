import { AnimationState, VertexEffect, SkeletonData, AnimationStateData, SkeletonClipping, Vector2, Color, RegionAttachment, TextureAtlasRegion, MeshAttachment, ClippingAttachment, NumberArrayLike, Skeleton, TextureAtlasPage } from "@esotericsoftware/spine-core";
import { m4mTexture } from "./assetMgr";
import { setting } from "./setting";
import { ortho, SpineMeshBatcher } from "./spineMeshBatcher";


@m4m.reflect.node2DComponent
@m4m.reflect.nodeRender
export class spineSkeleton implements m4m.framework.I2DComponent {
    static readonly ClassName: string = "spineSkeleton";
    skeleton: Skeleton;
    state: AnimationState;
    animData: AnimationStateData;
    vertexEffect: VertexEffect;
    private _shader: m4m.framework.shader;
    mainColor = new m4m.math.vector4(1, 1, 1, 1);
    constructor(skeletonData: SkeletonData) {
        this.skeleton = new Skeleton(skeletonData);
        this.animData = new AnimationStateData(skeletonData);
        this.state = new AnimationState(this.animData);
    }

    set shader(shader: m4m.framework.shader) {
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


    changeSlotTexture(slotName: string, texture: m4mTexture) {
        let slot = this.skeleton.findSlot(slotName);
        if (slot == null) {
            console.warn(`changeSlotTexture failed, cannot find slot by name=${slotName}`);
            return;
        }
        let att = this.skeleton.getAttachmentByName(slotName, slotName)
        if (att == null) {
            console.warn(`changeSlotTexture failed, cannot find attachment by name=${slotName}`);
            return;
        }
        // let att = slot.attachment;
        if (att instanceof MeshAttachment) {
            let copy = att.copy() as MeshAttachment;
            let region = this.createTextureRegion(texture);
            copy.region = region;
            copy.updateUVs();
            slot.setAttachment(copy);
        } else if (att instanceof RegionAttachment) {
            let copy = att.copy() as RegionAttachment;
            let region = this.createTextureRegion(texture);
            copy.setRegion(region);
            copy.updateOffset();
            slot.setAttachment(copy);
        } else {
            console.warn("changeSlotTexture failed,unsupported attachment type", att);
        }
    }

    clearSlot(slotName: string) {
        let slot = this.skeleton.findSlot(slotName)
        if (slot == null) {
            console.warn(`clearSlot failed, cannot find slot by name=${slotName}`);
            return;
        }
        slot.setAttachment(null);
    }

    private createTextureRegion(texture: m4mTexture) {
        let page = new TextureAtlasPage()
        page.width = texture.width;
        page.height = texture.height;
        page.setTexture(texture);
        let region = new TextureAtlasRegion()
        region.page = page
        region.width = texture.width
        region.height = texture.height
        region.originalWidth = texture.width
        region.originalHeight = texture.height
        region.degrees = 0;
        region.u = 0
        region.v = 0
        region.u2 = 1
        region.v2 = 1
        region.renderObject = region;
        return region;
    }

    private _toTransFormMatrix = new m4m.math.matrix3x2([1, 0, 0, -1, 0, 0]);
    get toTransformMatrix() {
        return this._toTransFormMatrix;
    }

    private _pivotMat = new m4m.math.matrix3x2();
    getToCanvasMatrix(mat = new m4m.math.matrix3x2()): m4m.math.matrix3x2 {
        m4m.math.matrix3x2MakeTranslate((0.5 - this.transform.pivot.x) * this.transform.width, (0.5 - this.transform.pivot.y) * this.transform.height, this._pivotMat);
        m4m.math.matrix3x2Multiply(this.transform.getCanvasWorldMatrix(), this._pivotMat, mat);
        m4m.math.matrix3x2Multiply(mat, this._toTransFormMatrix, mat);
        return mat;
    }

    private _spineToWorld = new m4m.math.matrix3x2();
    private _spineToWorld2 = new m4m.math.matrix();
    render(canvas: m4m.framework.canvas) {

        canvas["lastMat"] = null;
        canvas.batcher.end(canvas.webgl);

        let app = canvas.scene.app;
        let context: m4m.framework.renderContext = canvas["context"];
        let worldMat = this.transform.getWorldMatrix();
        let spineToWorld = this._spineToWorld;

        m4m.math.matrix3x2Multiply(worldMat, this._toTransFormMatrix, spineToWorld);

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
        // m4m.math.quatFromAxisAngle(m4m.math.z_AXIS(), worldRot.v * 180 / Math.PI, this._quat)
        // m4m.math.matrixMakeTransformRTS(new m4m.math.vector3(worldPos.x, worldPos.y, 0), new m4m.math.vector3(worldScale.x, worldScale.y, 1.0), this._quat, this._modelMat);
        // let pmat = new m4m.math.matrix();
        // ortho(0, app.width, 0, app.height, -1, 1, pmat);
        // m4m.math.matrixMultiply(pmat, this._modelMat, this._modelMat);
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
            let texture: m4mTexture = null;
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
                texture = <m4mTexture>(<TextureAtlasRegion>region.region.renderObject).page.texture;
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
                texture = <m4mTexture>(<TextureAtlasRegion>mesh.region.renderObject).page.texture;
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


    transform: m4m.framework.transform2D;
    remove() {
        this.transform = null;
    }
}