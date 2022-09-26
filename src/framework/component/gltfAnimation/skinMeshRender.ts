/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 蒙皮网格渲染组件
     * @version m4m 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class skinMeshRender implements IRenderer {
        static readonly ClassName: string = "skinMeshRender";
        constructor() {
        }

        /**
         * 挂载的gameobject
         */
        gameObject: gameObject;
        /**
         * 场景渲染层级（common、transparent、overlay）
         */
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        /**
         * 渲染mask层级（和相机相对应）
         */
        get renderLayer() { return this.gameObject.layer; }
        set renderLayer(layer: number) { this.gameObject.layer = layer; }
        private issetq = false;
        _queue: number = 0;
        /**
         * 返回此组件的场景渲染层级排序依据queue大小
         */
        get queue(): number {
            return this._queue;
        }
        /**
         * 设置此组件的场景渲染层级排序number大小
         */
        set queue(value: number) {
            this._queue = value;
            this.issetq = true;
        }
        /**
         * 材质数组
         */
        @m4m.reflect.Field("material[]")
        materials: material[];
        private _mesh: mesh;
        /**
         * 返回mesh数据
         */
        @m4m.reflect.Field("mesh")
        get mesh() {
            return this._mesh;
        }
        /**
         * 设置mesh数据
         */
        set mesh(mesh: mesh) {
            if (this._mesh != null) {
                this._mesh.unuse();
            }
            this._mesh = mesh;
            if (this._mesh != null) {
                this._mesh.use();
            }
        }
        /**
         * @private
         */
        @m4m.reflect.Field("transform[]")
        bones: transform[];
        /**
         * @private
         */
        @m4m.reflect.Field("transform")
        rootBone: transform;
        /**
         * @private
         */
        @m4m.reflect.Field("vector3")
        center: math.vector3;
        /**
         * @private
         */
        @m4m.reflect.Field("vector3")
        size: math.vector3;
        /**
         * 最大骨骼数量
         * @version m4m 1.0
         */
        maxBoneCount: number = 55;
        private boneMatrices = new Float32Array(16 * this.maxBoneCount);
        inverseBindMatrices: m4m.math.matrix[] = [];
        _aabb: aabb;
        get aabb() {
            if (!this._aabb) {
                // calculate aabb from bounds
                const { size, center } = this;
                let max = m4m.math.pool.new_vector3();
                let min = m4m.math.pool.new_vector3();
                let temp = m4m.math.pool.new_vector3();
                m4m.math.vec3ScaleByNum(size, 0.5, min); // temp
                // Ensure extent
                min.x = Math.abs(min.x);
                min.y = Math.abs(min.y);
                min.z = Math.abs(min.z);

                m4m.math.vec3Add(center, min, max);
                m4m.math.vec3Subtract(center, min, min);

                // Apply root bone matrix
                // 骨骼可能有旋转之类的操作, aabb默认只会计算位移
                const rootboneMat = this.rootBone.getWorldMatrix();
                m4m.math.matrixTransformVector3(max, rootboneMat, max);
                m4m.math.matrixTransformVector3(min, rootboneMat, min);

                m4m.math.vec3Max(max, min, temp);
                m4m.math.vec3Min(max, min, min);
                m4m.math.vec3Clone(temp, max);

                this._aabb = new aabb(max, min);
                m4m.math.pool.delete_vector3(max);
                m4m.math.pool.delete_vector3(min);
                m4m.math.pool.delete_vector3(temp);
            }
            return this._aabb;
        }
        onPlay() {
        }
        start() {
        }
        update(delta: number) {
            if (this.bones == null || this.inverseBindMatrices == null) return;
            if (this.materials != null && this.materials.length > 0) {
                let _mat = this.materials[0];
                if (_mat) {
                    this.layer = _mat.getLayer();
                    if (!this.issetq)
                        this._queue = _mat.getQueue();
                }
            }
            let inverseRootMat = m4m.math.pool.new_matrix();
            let rootMat = this.rootBone.getWorldMatrix();
            m4m.math.matrixInverse(rootMat, inverseRootMat);

            let temptMat = m4m.math.pool.new_matrix();
            let temptScale = m4m.math.pool.new_vector3();
            let temptRot = m4m.math.pool.new_quaternion();
            let temptPos = m4m.math.pool.new_quaternion();

            for (let i = 0; i < this.bones.length; i++) {
                let boneWorldMatrix = this.bones[i].getWorldMatrix();
                m4m.math.matrixMultiply(boneWorldMatrix, this.inverseBindMatrices[i], temptMat);
                m4m.math.matrixMultiply(inverseRootMat, temptMat, temptMat);
                m4m.math.matrixDecompose(temptMat, temptScale, temptRot, temptPos);

                this.boneMatrices[i * 8 + 0] = temptRot.x;
                this.boneMatrices[i * 8 + 1] = temptRot.y;
                this.boneMatrices[i * 8 + 2] = temptRot.z;
                this.boneMatrices[i * 8 + 3] = temptRot.w;
                this.boneMatrices[i * 8 + 4] = temptPos.x;
                this.boneMatrices[i * 8 + 5] = temptPos.y;
                this.boneMatrices[i * 8 + 6] = temptPos.z;
                this.boneMatrices[i * 8 + 7] = temptScale.x;
            }
            m4m.math.pool.delete_matrix(inverseRootMat);
            m4m.math.pool.delete_matrix(temptMat);
        }

        render(context: renderContext, assetMgr: assetMgr, camera: m4m.framework.camera) {
            if (this.bones == null || this.inverseBindMatrices == null) return;
            DrawCallInfo.inc.currentState = DrawCallEnum.SKinrender;
            context.updateLightMask(this.gameObject.layer);
            context.updateModel(this.rootBone);
            context.vec4_bones = this.boneMatrices;
            if (this._mesh && this.mesh.glMesh) {
                if (this._mesh.submesh != null) {
                    for (let i = 0; i < this._mesh.submesh.length; i++) {
                        let sm = this._mesh.submesh[i];
                        let mid = sm.matIndex;
                        let targetMat = this.materials[mid];
                        if (targetMat != null) {
                            if (this.gameObject.transform.scene.fog) {
                                targetMat.draw(context, this._mesh, sm, "skin_fog");
                            } else {
                                targetMat.draw(context, this._mesh, sm, "skin");
                            }
                        }
                    }
                }
            }
        }
        /**
         * @private
         */
        remove() {
            this.materials.forEach(element => {
                if (element) element.unuse();
            });
            if (this.mesh)
                this.mesh.unuse();
            this.bones.length = 0;
            this.boneMatrices = null;
        }
        /**
         * @private
         */
        clone() {

        }
    }
}