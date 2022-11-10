var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var spineSkeleton_1;
import { AnimationState, AnimationStateData, SkeletonClipping, Vector2, Color, RegionAttachment, MeshAttachment, ClippingAttachment, Skeleton } from "@esotericsoftware/spine-core";
import { SpineMeshBatcher } from "./spineMeshBatcher";
let spineSkeleton = spineSkeleton_1 = class spineSkeleton {
    constructor(skeletonData) {
        this._quat = new gd3d.math.quaternion();
        this._modelMat = new gd3d.math.matrix();
        this.batches = new Array();
        this.nextBatchIndex = 0;
        this.clipper = new SkeletonClipping();
        this.tempPos = new Vector2();
        this.tempUv = new Vector2();
        this.tempLight = new Color();
        this.tempDark = new Color();
        this.tempColor = new Color();
        this.tempColor2 = new Color();
        this.vertices = new Float32Array(1024);
        this.zOffset = 0.1;
        this.skeleton = new Skeleton(skeletonData);
        this.animData = new AnimationStateData(skeletonData);
        this.state = new AnimationState(this.animData);
    }
    set shader(shader) {
        this._shader = shader;
    }
    start() {
    }
    onPlay() {
    }
    update(delta) {
        var _a;
        let state = this.state;
        let skeleton = this.skeleton;
        state.update(delta);
        state.apply(skeleton);
        skeleton.updateWorldTransform();
        this.updateGeometry();
        (_a = this.onUpdate) === null || _a === void 0 ? void 0 : _a.call(this, delta);
    }
    render(canvas) {
        let app = canvas.scene.app;
        let context = canvas["context"];
        let worldPos = this.transform.getWorldTranslate();
        let worldRot = this.transform.getWorldRotate();
        let worldScale = this.transform.getWorldScale();
        gd3d.math.quatFromAxisAngle(gd3d.math.z_AXIS(), worldRot.v * 180 / Math.PI, this._quat);
        gd3d.math.matrixMakeTransformRTS(new gd3d.math.vector3(worldPos.x, worldPos.y, 0), new gd3d.math.vector3(worldScale.x, worldScale.y, 1.0), this._quat, this._modelMat);
        context.matrixModel = this._modelMat;
        for (let i = 0; i < this.batches.length; i++) {
            this.batches[i].render(context, app);
        }
    }
    updateGeometry() {
        this.clearBatches();
        let tempPos = this.tempPos;
        let tempUv = this.tempUv;
        let tempLight = this.tempLight;
        let tempDark = this.tempDark;
        let clipper = this.clipper;
        let vertices = this.vertices;
        let triangles = null;
        let uvs = null;
        let drawOrder = this.skeleton.drawOrder;
        let skeletonColor = this.skeleton.color;
        let batch = this.nextBatch();
        batch.begin();
        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let vertexSize = clipper.isClipping() ? 2 : spineSkeleton_1.VERTEX_SIZE;
            let slot = drawOrder[i];
            if (!slot.bone.active)
                continue;
            let attachment = slot.getAttachment();
            let texture = null;
            let attachmentColor = null;
            let numFloats = 0;
            if (attachment instanceof RegionAttachment) {
                let region = attachment;
                attachmentColor = region.color;
                vertices = this.vertices;
                numFloats = vertexSize * 4;
                region.computeWorldVertices(slot.bone, vertices, 0, vertexSize);
                triangles = spineSkeleton_1.QUAD_TRIANGLES;
                uvs = region.uvs;
                texture = region.region.renderObject.page.texture;
            }
            else if (attachment instanceof MeshAttachment) {
                let mesh = attachment;
                attachmentColor = mesh.color;
                vertices = this.vertices;
                numFloats = (mesh.worldVerticesLength >> 1) * vertexSize;
                if (numFloats > vertices.length) {
                    vertices = this.vertices = new Float32Array(numFloats);
                }
                mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, vertexSize);
                triangles = mesh.triangles;
                uvs = mesh.uvs;
                texture = mesh.region.renderObject.page.texture;
            }
            else if (attachment instanceof ClippingAttachment) {
                let clip = (attachment);
                clipper.clipStart(slot, clip);
                continue;
            }
            else
                continue;
            if (texture != null) {
                let slotColor = slot.color;
                let finalColor = this.tempColor;
                finalColor.r = skeletonColor.r * slotColor.r * attachmentColor.r;
                finalColor.g = skeletonColor.g * slotColor.g * attachmentColor.g;
                finalColor.b = skeletonColor.b * slotColor.b * attachmentColor.b;
                finalColor.a = skeletonColor.a * slotColor.a * attachmentColor.a;
                if (spineSkeleton_1.premultipliedAlpha) {
                    finalColor.r *= finalColor.a;
                    finalColor.g *= finalColor.a;
                    finalColor.b *= finalColor.a;
                }
                let darkColor = this.tempColor2;
                if (!slot.darkColor)
                    darkColor.set(0, 0, 0, 1.0);
                else {
                    if (spineSkeleton_1.premultipliedAlpha) {
                        darkColor.r = slot.darkColor.r * finalColor.a;
                        darkColor.g = slot.darkColor.g * finalColor.a;
                        darkColor.b = slot.darkColor.b * finalColor.a;
                    }
                    else {
                        darkColor.setFromColor(slot.darkColor);
                    }
                    darkColor.a = spineSkeleton_1.premultipliedAlpha ? 1.0 : 0.0;
                }
                let finalVertices;
                let finalVerticesLength;
                let finalIndices;
                let finalIndicesLength;
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
                            verts[v + 7] = tempUv.y;
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
                }
                else {
                    let verts = vertices;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        for (let v = 0, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempUv.x = uvs[u];
                            tempUv.y = uvs[u + 1];
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
                            verts[v + 7] = tempUv.y;
                            verts[v + 8] = tempDark.r;
                            verts[v + 9] = tempDark.g;
                            verts[v + 10] = tempDark.b;
                            verts[v + 11] = tempDark.a;
                        }
                    }
                    else {
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
    clearBatches() {
        for (var i = 0; i < this.batches.length; i++) {
            this.batches[i].clear();
        }
        this.nextBatchIndex = 0;
    }
    nextBatch() {
        if (this.batches.length == this.nextBatchIndex) {
            let batch = new SpineMeshBatcher(this._shader);
            this.batches.push(batch);
        }
        let batch = this.batches[this.nextBatchIndex++];
        return batch;
    }
    updateTran() {
        var m = this.transform.getWorldMatrix();
    }
    remove() {
        this.transform = null;
    }
};
spineSkeleton.ClassName = "spineSkeleton";
spineSkeleton.premultipliedAlpha = false;
spineSkeleton.VERTEX_SIZE = 2 + 2 + 4 + 4;
spineSkeleton.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
spineSkeleton = spineSkeleton_1 = __decorate([
    gd3d.reflect.node2DComponent,
    gd3d.reflect.nodeRender
], spineSkeleton);
export { spineSkeleton };
function ortho(arg0, arg1, arg2, arg3, arg4, arg5, vpMat) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=spineComp.js.map