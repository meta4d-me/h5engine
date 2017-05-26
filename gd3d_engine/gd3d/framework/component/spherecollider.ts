namespace gd3d.framework
{
    export class spherestruct
    {
        public center:gd3d.math.vector3;
        public radius:number;//缩放处理过的半径
        public srcradius:number;//collider定义的源半径
        private tempScale:gd3d.math.vector3;
        constructor(_center:math.vector3, _r:number)
        {
            this.center = _center;
            this.srcradius = _r;
            this.tempScale = new gd3d.math.vector3();
        }
        public update(worldmatrix:math.matrix)
        {
            gd3d.math.matrixGetTranslation(worldmatrix, this.center);
            gd3d.math.matrixGetScale(worldmatrix, this.tempScale);
            if(this.tempScale.x < this.tempScale.y) this.tempScale.x = this.tempScale.y;
            if(this.tempScale.x < this.tempScale.z) this.tempScale.x = this.tempScale.z;
            this.radius = this.srcradius * this.tempScale.x;
        }
        public intersects(bound:any)
        {
            if(bound instanceof spherestruct)
            {
                let dis = math.vec3Distance(this.center, bound.center);
                if(dis > this.radius + bound.radius)    return false;
                return true;
            }
            else if(bound instanceof obb)
            {

            }
        }
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示球碰撞盒
     * @version gd3d 1.0
     */
    @reflect.nodeComponent
    @reflect.nodeSphereCollider
    export class spherecollider implements INodeComponent, ICollider
    {
        gameObject: gameObject;
        subTran: transform;
        filter: meshFilter;
        spherestruct: spherestruct;
        @gd3d.reflect.Field("vector3")
        center: math.vector3;
        @gd3d.reflect.Field("vector3")
        radius: number;
        getBound()
        {
            return this.spherestruct;
        }
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取该碰撞盒物体的世界矩阵
        * @version gd3d 1.0
        */
        public get matrix(): gd3d.math.matrix
        {
            if (this.gameObject)
                return this.gameObject.transform.getWorldMatrix();
            return new gd3d.math.matrix();
        }
        start()
        {
            this.filter = this.gameObject.getComponent("meshFilter") as meshFilter;
            this.build();
        }
        update(delta: number)
        {
            if (this.spherestruct)
            {
                this.spherestruct.update(this.matrix);
            }
        }

        _colliderVisible: boolean = false;
        get colliderVisible(): boolean
        {
            return this._colliderVisible;
        }
        set colliderVisible(value: boolean)
        {
            this._colliderVisible = value;
            if (this.subTran)
            {
                this.subTran.gameObject.visible = this._colliderVisible;
            }

        }
        intersectsTransform(tran: transform): boolean
        {
            if (tran.gameObject.collider == null) return false;
            if (this.spherestruct == null || tran.gameObject.collider.getBound() == null) return false;
            var _obb = tran.gameObject.collider.getBound();
            return this.spherestruct.intersects(_obb);
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒
        * @version gd3d 1.0
        */
        private build()
        {
            if (this.center && this.radius)
            {
                this.spherestruct = new spherestruct(this.center, this.radius);
            }
            this.buildMesh();
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒mesh 并显示
        * @version gd3d 1.0
        */
        private buildMesh()
        {
            this.subTran = new gd3d.framework.transform();
            this.subTran.gameObject.hideFlags = HideFlags.DontSave | HideFlags.HideInHierarchy;
            this.subTran.name = "spherecollider";
            var mesh = this.subTran.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;

            mesh.mesh = this.getColliderMesh();
            var renderer = this.subTran.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;

            this.subTran.gameObject.visible = this._colliderVisible;

            this.gameObject.transform.addChild(this.subTran);
            this.gameObject.transform.markDirty();
            this.subTran.markDirty();//要标记自己脏了，才会更新
            this.gameObject.transform.updateWorldTran();
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 获取碰撞盒mesh
        * @version gd3d 1.0
        */
        private getColliderMesh(): mesh
        {
            var _mesh: mesh = new mesh();
            // _mesh.data = gd3d.render.meshData.genBoxByArray_Quad(this.obb.vectors);
            // var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Normal;
            // var v32 = _mesh.data.genVertexDataArray(vf);
            // var i16 = _mesh.data.genIndexDataArrayQuad2Line();
            // var webgl = this.gameObject.getScene().webgl;

            // _mesh.glMesh = new gd3d.render.glMesh();
            // _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
            // _mesh.glMesh.uploadVertexSubData(webgl, v32);

            // _mesh.glMesh.addIndex(webgl, i16.length);
            // _mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
            // _mesh.submesh = [];

            // {
            //     var sm = new subMeshInfo();
            //     sm.matIndex = 0;
            //     sm.useVertexIndex = 0;
            //     sm.start = 0;
            //     sm.size = i16.length;
            //     sm.line = true;
            //     _mesh.submesh.push(sm);
            // }
            return _mesh;
        }

        remove()
        {
            if (this.subTran)
            {
                this.subTran.dispose();
            }
        }
        clone()
        {

        }
    }

}