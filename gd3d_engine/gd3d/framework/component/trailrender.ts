namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class trailRender implements IRenderer
    {
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        queue: number = 0;

        // private startWidth: number = 1;
        // private endWidth: number = 1;
        private width: number = 1.0;

        private _material: gd3d.framework.material;
        private _color: gd3d.math.color;

        private mesh: gd3d.framework.mesh;

        private vertexcount = 24;
        private dataForVbo: Float32Array;
        private dataForEbo: Uint16Array;
        private sticks: trailStick[];
        // private targetpos:Float32Array;
        start()
        {

            this.app = this.gameObject.getScene().app;
            this.webgl = this.app.webgl;

            this.initmesh();
        }
        private app: application;
        private webgl: WebGLRenderingContext;
        update(delta: number)
        {
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), this.sticks[0].location);
            this.gameObject.transform.getUpInWorld(this.sticks[0].updir);
            gd3d.math.vec3ScaleByNum(this.sticks[0].updir, this.width, this.sticks[0].updir);

            var length = this.sticks.length;
            for (var i = 1; i < length; i++)
            {
                gd3d.math.vec3SLerp(this.sticks[i].location, this.sticks[i - 1].location, 0.5, this.sticks[i].location);
                gd3d.math.vec3SLerp(this.sticks[i].updir, this.sticks[i - 1].updir, 0.5, this.sticks[i].updir);
            }
            this.updateTrailData();
        }
        gameObject: gameObject;
        remove()
        {

        }
        //-----------------------------------------------------------------------------------------------
        public set material(material: gd3d.framework.material)
        {
            this._material = material;
            this.layer = this.material.getLayer();
        }
        public get material()
        {
            if (this._material != undefined)
            {
                return this._material;
            }
            else
            {
                var mat = new gd3d.framework.material();
                mat.setShader(this.app.getAssetMgr().getShader("shader/def"));
                this.material = mat;
                return this._material;
            }
        }

        public get color()
        {
            if (this._color == undefined)
            {
                this._color = new gd3d.math.color(1, 1, 1, 1);
            }
            return this._color;
        }
        public set color(color: gd3d.math.color)
        {
            this._color = color;
        }

        public setspeed(upspeed: number, lowspeed: number = 0.1)
        {
            this.speed = upspeed;
            this.lowspeed = lowspeed;
        }
        public setWidth(Width: number)
        {
            this.width = Width;
        }

        //------------------------------------------------------------------------------------------------------
        private initmesh()
        {
            //用棍子去刷顶点
            //用逻辑去刷棍子
            this.sticks = [];
            for (var i = 0; i < this.vertexcount / 2; i++)
            {
                var ts = new trailStick();
                this.sticks.push(ts);
                ts.location = new gd3d.math.vector3();
                gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), ts.location);
                ts.updir = new gd3d.math.vector3();
                this.gameObject.transform.getUpInWorld(ts.updir);
            }

            this.mesh = new gd3d.framework.mesh();
            this.mesh.data = new gd3d.render.meshData();
            this.mesh.glMesh = new gd3d.render.glMesh();

            this.dataForVbo = new Float32Array(this.vertexcount * 9);
            this.dataForEbo = new Uint16Array((this.vertexcount / 2 - 1) * 6);



            var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0;
            this.mesh.glMesh.initBuffer(this.webgl, vf, this.vertexcount, render.MeshTypeEnum.Dynamic);

            this.mesh.glMesh.addIndex(this.webgl, this.dataForEbo.length);

            this.mesh.submesh = [];
            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = this.dataForEbo.length;
                sm.line = false;
                this.mesh.submesh.push(sm);
            }

            var length = this.vertexcount / 2;
            //this.targetpos=new Float32Array(length*2);
            //-----------------------------------------------
            var updir = gd3d.math.pool.new_vector3();
            this.gameObject.transform.getUpInWorld(updir);
            gd3d.math.vec3ScaleByNum(updir, this.width, updir);

            var pos = gd3d.math.pool.new_vector3();
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), pos);

            var uppos = gd3d.math.pool.new_vector3();
            gd3d.math.vec3Add(pos, updir, uppos);

            var downpos = gd3d.math.pool.new_vector3();
            gd3d.math.vec3Subtract(pos, updir, downpos);


            for (var i = 0; i < length; i++)
            {
                this.dataForVbo[i * 2 * 9] = uppos.x;
                this.dataForVbo[i * 2 * 9 + 1] = uppos.y;
                this.dataForVbo[i * 2 * 9 + 2] = uppos.z;
                this.dataForVbo[i * 2 * 9 + 3] = this.color.r;
                this.dataForVbo[i * 2 * 9 + 4] = this.color.g;
                this.dataForVbo[i * 2 * 9 + 5] = this.color.b;
                this.dataForVbo[i * 2 * 9 + 6] = this.color.a;
                this.dataForVbo[i * 2 * 9 + 7] = i / (length - 1);
                this.dataForVbo[i * 2 * 9 + 8] = 0;

                this.dataForVbo[(i * 2 + 1) * 9] = downpos.x;
                this.dataForVbo[(i * 2 + 1) * 9 + 1] = downpos.y;
                this.dataForVbo[(i * 2 + 1) * 9 + 2] = downpos.z;
                this.dataForVbo[(i * 2 + 1) * 9 + 3] = this.color.r;
                this.dataForVbo[(i * 2 + 1) * 9 + 4] = this.color.g;
                this.dataForVbo[(i * 2 + 1) * 9 + 5] = this.color.b;
                this.dataForVbo[(i * 2 + 1) * 9 + 6] = this.color.a;
                this.dataForVbo[(i * 2 + 1) * 9 + 7] = i / (length - 1);
                this.dataForVbo[(i * 2 + 1) * 9 + 8] = 1;

                // this.targetpos[i*3]=uppos.x;
                // this.targetpos[i*3+1]=uppos.y;
                // this.targetpos[i*3+2]=uppos.z;

                // this.targetpos[(i+1)*3]=downpos.x;
                // this.targetpos[(i+1)*3+1]=downpos.y;
                // this.targetpos[(i+1)*3+2]=downpos.z;                
            }
            //--------------------------------------     
            for (var k = 0; k < length - 1; k++)
            {
                this.dataForEbo[k * 6 + 0] = k * 2;
                this.dataForEbo[k * 6 + 1] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 2] = k * 2 + 1;

                this.dataForEbo[k * 6 + 3] = k * 2 + 1;
                this.dataForEbo[k * 6 + 4] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 5] = (k + 1) * 2 + 1;
            }
            this.mesh.glMesh.uploadVertexSubData(this.webgl, this.dataForVbo);
            this.mesh.glMesh.uploadIndexSubData(this.webgl, 0, this.dataForEbo);


            gd3d.math.pool.delete_vector3(updir);
            gd3d.math.pool.delete_vector3(pos);
            gd3d.math.pool.delete_vector3(uppos);
            gd3d.math.pool.delete_vector3(downpos);
        }

        private speed: number = 0.5;
        private lowspeed: number = 0.1;

        private updateTrailData()
        {
            var length = this.vertexcount / 2;
            for (var i = 0; i < length; i++)
            {
                var pos = this.sticks[i].location;
                var up = this.sticks[i].updir;
                this.dataForVbo[i * 2 * 9] = pos.x;
                this.dataForVbo[i * 2 * 9 + 1] = pos.y;
                this.dataForVbo[i * 2 * 9 + 2] = pos.z;

                this.dataForVbo[(i * 2 + 1) * 9] = pos.x + up.x;
                this.dataForVbo[(i * 2 + 1) * 9 + 1] += pos.y + up.y;
                this.dataForVbo[(i * 2 + 1) * 9 + 2] += pos.z + up.z;
            }
        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            context.updateModeTrail();
            this.mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            //--------------------------render-------------------------------------------
            this.material.draw(context, this.mesh, this.mesh.submesh[0], "base");
        }
        clone()
        {

        }



    }
    export class trailStick
    {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
    }
}