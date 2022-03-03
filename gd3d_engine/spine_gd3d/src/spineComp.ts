import { AnimationState, VertexEffect, SkeletonData, AnimationStateData, SkeletonClipping, Vector2, Color, RegionAttachment, TextureAtlasRegion, MeshAttachment, ClippingAttachment, NumberArrayLike, Skeleton } from "@esotericsoftware/spine-core";
import { Gd3dTexture } from "./assetMgr";
import { SpineMeshBatcher } from "./spineMeshBatcher";


@gd3d.reflect.node2DComponent
@gd3d.reflect.nodeRender
export class spineSkeleton implements gd3d.framework.I2DComponent {
    static readonly ClassName: string = "spineSkeleton";
    static shader: gd3d.framework.shader;
    static premultipliedAlpha: boolean = false;
    skeleton: Skeleton;
    state: AnimationState;
    vertexEffect: VertexEffect;
    private _shader: gd3d.framework.shader;
    constructor(skeletonData: SkeletonData) {
        this.skeleton = new Skeleton(skeletonData);
        let animData = new AnimationStateData(skeletonData);
        this.state = new AnimationState(animData);
    }

    set shader(shader: gd3d.framework.shader) {
        this._shader = shader;
    }

    private datar: number[] = [
        //3 pos  4 color  2 uv 4 color2
        0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

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
    }
    render(canvas: gd3d.framework.canvas) {
        let app = canvas.scene.app;
        let context: gd3d.framework.renderContext = canvas["context"];
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
    private vertices = new Float32Array(1024);
    private zOffset: number = 0.1;
    static VERTEX_SIZE = 2 + 2 + 4;
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
        let batch = this.nextBatch();
        batch.begin();
        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let vertexSize = clipper.isClipping() ? 2 : spineSkeleton.VERTEX_SIZE;
            let slot = drawOrder[i];
            if (!slot.bone.active) continue;
            let attachment = slot.getAttachment();
            let attachmentColor: Color = null;
            let texture: Gd3dTexture = null;
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
                let skeleton = slot.bone.skeleton;
                let skeletonColor = skeleton.color;
                let slotColor = slot.color;
                let alpha = skeletonColor.a * slotColor.a * attachmentColor.a;
                let color = this.tempColor;
                color.set(skeletonColor.r * slotColor.r * attachmentColor.r,
                    skeletonColor.g * slotColor.g * attachmentColor.g,
                    skeletonColor.b * slotColor.b * attachmentColor.b,
                    alpha);

                let finalVertices: NumberArrayLike;
                let finalVerticesLength: number;
                let finalIndices: NumberArrayLike;
                let finalIndicesLength: number;

                if (clipper.isClipping()) {
                    clipper.clipTriangles(vertices, numFloats, triangles, triangles.length, uvs, color, null, false);
                    let clippedVertices = clipper.clippedVertices;
                    let clippedTriangles = clipper.clippedTriangles;
                    if (this.vertexEffect != null) {
                        let vertexEffect = this.vertexEffect;
                        let verts = clippedVertices;
                        for (let v = 0, n = clippedVertices.length; v < n; v += vertexSize) {
                            tempPos.x = verts[v];
                            tempPos.y = verts[v + 1];
                            tempLight.setFromColor(color);
                            tempDark.set(0, 0, 0, 0);
                            tempUv.x = verts[v + 6];
                            tempUv.y = verts[v + 7];
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y;
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
                            tempLight.setFromColor(color);
                            tempDark.set(0, 0, 0, 0);
                            tempUv.x = uvs[u];
                            tempUv.y = uvs[u + 1];
                            vertexEffect.transform(tempPos, tempUv, tempLight, tempDark);
                            verts[v] = tempPos.x;
                            verts[v + 1] = tempPos.y;
                            verts[v + 2] = tempLight.r;
                            verts[v + 3] = tempLight.g;
                            verts[v + 4] = tempLight.b;
                            verts[v + 5] = tempLight.a;
                            verts[v + 6] = tempUv.x;
                            verts[v + 7] = tempUv.y;
                        }
                    } else {
                        for (let v = 2, u = 0, n = numFloats; v < n; v += vertexSize, u += 2) {
                            verts[v] = color.r;
                            verts[v + 1] = color.g;
                            verts[v + 2] = color.b;
                            verts[v + 3] = color.a;
                            verts[v + 4] = uvs[u];
                            verts[v + 5] = uvs[u + 1];
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
            let batch = new SpineMeshBatcher(this._shader ?? spineSkeleton.shader);
            this.batches.push(batch);
        }
        let batch = this.batches[this.nextBatchIndex++];
        return batch;
    }

    private _darwRect: any;
    // color: any;
    private _cacheMaskV4: gd3d.math.vector4;
    updateTran() {
        var m = this.transform.getWorldMatrix();

        var l = -this.transform.pivot.x * this.transform.width;
        var r = this.transform.width + l;
        var t = -this.transform.pivot.y * this.transform.height;
        var b = this.transform.height + t;

        var x0 = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
        var y0 = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
        var x1 = r * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
        var y1 = r * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
        var x2 = l * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
        var y2 = l * m.rawData[1] + b * m.rawData[3] + m.rawData[5];
        var x3 = r * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
        var y3 = r * m.rawData[1] + b * m.rawData[3] + m.rawData[5];

        this.datar[0 * 13] = x0;
        this.datar[0 * 13 + 1] = y0;
        this.datar[1 * 13] = x1;
        this.datar[1 * 13 + 1] = y1;
        this.datar[2 * 13] = x2;
        this.datar[2 * 13 + 1] = y2;
        this.datar[3 * 13] = x2;
        this.datar[3 * 13 + 1] = y2;
        this.datar[4 * 13] = x1;
        this.datar[4 * 13 + 1] = y1;
        this.datar[5 * 13] = x3;
        this.datar[5 * 13 + 1] = y3;
        //主color
        // for (var i = 0; i < 6; i++) {
        //     this.datar[i * 13 + 3] = this.color.r;
        //     this.datar[i * 13 + 4] = this.color.g;
        //     this.datar[i * 13 + 5] = this.color.b;
        //     this.datar[i * 13 + 6] = this.color.a;
        // }

        //drawRect 
        this.min_x = Math.min(x0, x1, x2, x3, this.min_x);
        this.min_y = Math.min(y0, y1, y2, y3, this.min_y);
        this.max_x = Math.max(x0, x1, x2, x3, this.max_x);
        this.max_y = Math.max(y0, y1, y2, y3, this.max_y);
        this.calcDrawRect();
    }


    private min_x: number = Number.MAX_VALUE;
    private max_x: number = Number.MAX_VALUE * -1;
    private min_y: number = Number.MAX_VALUE;
    private max_y: number = Number.MAX_VALUE * -1;
    /** 计算drawRect */
    private calcDrawRect() {
        if (!this._darwRect) return;
        //drawBounds (y 轴反向)
        let canvas = this.transform.canvas;
        if (!canvas) return;
        let minPos = gd3d.poolv2();
        minPos.x = this.min_x;
        minPos.y = this.max_y;
        canvas.clipPosToCanvasPos(minPos, minPos);

        let maxPos = gd3d.poolv2();
        maxPos.x = this.max_x;
        maxPos.y = this.min_y;
        canvas.clipPosToCanvasPos(maxPos, maxPos);

        this._darwRect.x = minPos.x;
        this._darwRect.y = minPos.y;
        this._darwRect.w = maxPos.x - minPos.x;
        this._darwRect.h = maxPos.y - minPos.y;

        this.min_x = this.min_y = Number.MAX_VALUE;
        this.max_x = this.max_y = Number.MAX_VALUE * -1;

        gd3d.poolv2_del(minPos);
        gd3d.poolv2_del(maxPos);
    }


    transform: gd3d.framework.transform2D;
    remove() {
        this._cacheMaskV4 = null;
        this.transform = null;
        this.datar.length = 0;
    }
}