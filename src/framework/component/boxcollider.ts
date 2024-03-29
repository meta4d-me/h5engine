/**
@license
Copyright (c) 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
/// <reference path="../../io/reflect.ts" />

namespace m4m.framework {
    export interface ICollider {
        gameObject: gameObject;
        subTran: transform;
        /** 获取 边界包围数据对象*/
        getBound() : any;
        /**
         * 与一个指定节点检测是否相交
         * @param tran 指定节点对象
         * @returns 是否相交
         */
        intersectsTransform(tran: transform): boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示矩形碰撞盒
     * @version m4m 1.0
     */
    @reflect.nodeComponent
    @reflect.nodeBoxCollider
    export class boxcollider implements INodeComponent, ICollider {
        static readonly ClassName: string = "boxcollider";

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version m4m 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 子transform
         * @version m4m 1.0
         */
        subTran: transform;
        /**
        * @private
        */
        filter: meshFilter;
        /**
        * @private
        */
        obb: obb;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒中心点
        * @version m4m 1.0
        */
        @m4m.reflect.Field("vector3")
        center: math.vector3 = new math.vector3(0, 0, 0);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒大小
        * @version m4m 1.0
        */
        @m4m.reflect.Field("vector3")
        size: math.vector3 = new math.vector3(1, 1, 1);
        /**
        * @private
        */
        getBound() {
            return this.obb;
        }

        private static _tempMatrix = new m4m.math.matrix();
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取该碰撞盒物体的世界矩阵
        * @version m4m 1.0
        */
        public get matrix(): m4m.math.matrix {
            if (this.gameObject)
                return this.gameObject.transform.getWorldMatrix();

            m4m.math.matrixMakeIdentity(boxcollider._tempMatrix);
            return boxcollider._tempMatrix;
        }

        private started = false;
        start() {
            this.filter = this.gameObject.getComponent("meshFilter") as meshFilter;
            this.build();
            this.started = true;
            this.ckBuildColliderMesh();
        }

        onPlay() {

        }

        update(delta: number) {
            if (this.obb) {
                this.obb.update(this.matrix);
            }
        }
        /**
        * @private
        */
        _colliderVisible: boolean = false;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒的可见性
        * @version m4m 1.0
        */
        get colliderVisible(): boolean {
            return this._colliderVisible;
        }
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 设置碰撞盒的可见性
        * @version m4m 1.0
        */
        set colliderVisible(value: boolean) {
            this._colliderVisible = value;
            this.ckBuildColliderMesh();
            if (this.subTran) {
                this.subTran.gameObject.visible = this._colliderVisible;
            }

        }

        /**
         * 检查创建碰撞区域 显示mesh
         */
        private ckBuildColliderMesh() {
            if (this._colliderVisible && this.started) {
                if (!this.subTran) {
                    this.buildMesh();
                }
            }
        }
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 检测碰撞
        * @version m4m 1.0
        */
        intersectsTransform(tran: transform): boolean {
            if (tran.gameObject.collider == null) return false;
            if (this.obb == null || tran.gameObject.collider.getBound() == null) return false;
            var _obb = tran.gameObject.collider.getBound();
            return this.obb.intersects(_obb);
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒
        * @version m4m 1.0
        */
        private build() {
            this.obb = new obb();
            if (this.center && this.size) {
                this.obb.buildByCenterSize(this.center, this.size);
            }
            else {
                let minimum = poolv3();
                let maximum = poolv3();
                if (this.filter) {
                    // let meshdata: m4m.render.meshData = this.filter.getMeshOutput().data;
                    // m4m.math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, minimum);
                    // m4m.math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, maximum);

                    // for (var i = 0; i < meshdata.pos.length; i++)
                    // {
                    //     m4m.math.vec3Max(meshdata.pos[i], maximum, maximum);
                    //     m4m.math.vec3Min(meshdata.pos[i], minimum, minimum);
                    // }
                    // console.log("add obb filter " + minimum + "  " + maximum);

                    this.filter.getMeshOutput().calcVectexMinMax(minimum, maximum);
                }
                else {
                    minimum.x = minimum.y = minimum.z = -1;
                    maximum.x = maximum.y = maximum.z = 1;
                }
                this.obb.buildByMaxMin(minimum, maximum);

                poolv3_del(minimum);
                poolv3_del(maximum);
            }
            //this.buildMesh();
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒mesh 并显示
        * @version m4m 1.0
        */
        private buildMesh() {
            this.subTran = new m4m.framework.transform();
            this.subTran.gameObject.hideFlags = HideFlags.DontSave | HideFlags.HideInHierarchy;
            this.subTran.name = "boxcollider";
            var mesh = this.subTran.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;

            mesh.mesh = this.getColliderMesh();
            var renderer = this.subTran.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;

            this.subTran.gameObject.visible = this._colliderVisible;

            this.gameObject.transform.addChild(this.subTran);
            this.gameObject.transform.markDirty();
            this.subTran.markDirty();//要标记自己脏了，才会更新
            //this.gameObject.transform.updateWorldTran();
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 获取碰撞盒mesh
        * @version m4m 1.0
        */
        private getColliderMesh(): mesh {
            var _mesh: mesh = new mesh();
            _mesh.data = m4m.render.meshData.genBoxByArray_Quad(this.obb.vectors);
            var vf = m4m.render.VertexFormatMask.Position | m4m.render.VertexFormatMask.Normal;
            var v32 = _mesh.data.genVertexDataArray(vf);
            var i16 = _mesh.data.genIndexDataArrayQuad2Line();
            var webgl = this.gameObject.getScene().webgl;

            _mesh.glMesh = new m4m.render.glMesh();
            _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.getVertexCount());
            _mesh.glMesh.uploadVertexData(webgl, v32);

            _mesh.glMesh.addIndex(webgl, i16.length);
            _mesh.glMesh.uploadIndexData(webgl, 0, i16);
            _mesh.glMesh.initVAO();

            _mesh.submesh = [];

            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = true;
                _mesh.submesh.push(sm);
            }
            return _mesh;
        }
        remove() {
            if (this.subTran) {
                this.subTran.dispose();
            }
            if (this.obb) {
                this.obb.dispose();
            }
        }
        /**
        * @private
        */
        clone() {

        }
    }

}