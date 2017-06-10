namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class trailRender implements IRenderer
    {
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        queue: number = 0;

        private width: number = 1.0;
        private _material: gd3d.framework.material;
        private _color: gd3d.math.color;

        private mesh: gd3d.framework.mesh;

        private vertexcount = 24;
        private dataForVbo: Float32Array;
        private dataForEbo: Uint16Array;
        private sticks: trailStick[];
        // private targetpos:Float32Array;
        private active:boolean=false;
        private reInit:boolean=false;
        start()
        {
            this.app = this.gameObject.getScene().app;
            this.webgl = this.app.webgl;
            this.initmesh();
        }
        private app: application;
        private webgl: WebGLRenderingContext;

        private camerapositon:gd3d.math.vector3;
        
        extenedOneSide:boolean=true;//延展方向
        update(delta: number)
        {
            if(!this.active) return;
            if(this.reInit)
            {
                this.intidata();
                this.reInit=false;
            }
            var targetpos=this.gameObject.transform.getWorldTranslate();
            if(this.lookAtCamera)
            {
                this.camerapositon=sceneMgr.app.getScene().mainCamera.gameObject.transform.getWorldTranslate();
                var camdir=gd3d.math.pool.new_vector3();
                gd3d.math.vec3Subtract(this.camerapositon,this.sticks[0].location,camdir);
                gd3d.math.vec3Normalize(camdir,camdir);

                var direction:gd3d.math.vector3=gd3d.math.pool.new_vector3();
                gd3d.math.vec3Subtract(targetpos,this.sticks[0].location,direction);
                gd3d.math.vec3Normalize(direction,direction);
                gd3d.math.vec3Cross(camdir,direction,this.sticks[0].updir);
                gd3d.math.vec3ScaleByNum(this.sticks[0].updir, this.width, this.sticks[0].updir);
                gd3d.math.pool.delete_vector3(direction);
            }
            gd3d.math.vec3Clone(targetpos, this.sticks[0].location);
            
            var length = this.sticks.length;
            for (var i = 1; i < length; i++)
            {
                gd3d.math.vec3SLerp(this.sticks[i].location, this.sticks[i - 1].location, this.speed, this.sticks[i].location);
            }
            //--------------------------------延展面片方向-------------------------------------------------
            if(this.lookAtCamera)
            {
                for(var i=1;i<length;i++)
                {
                    var tocamdir=gd3d.math.pool.new_vector3();
                    gd3d.math.vec3Subtract(this.camerapositon,this.sticks[i].location,tocamdir);
                    gd3d.math.vec3Normalize(tocamdir,tocamdir);
                    var movedir=gd3d.math.pool.new_vector3();
                    gd3d.math.vec3Subtract(this.sticks[i-1].location,this.sticks[i].location,movedir);
                    gd3d.math.vec3Normalize(movedir,movedir);
                    gd3d.math.vec3Cross(tocamdir,movedir,this.sticks[i].updir);
                    gd3d.math.vec3ScaleByNum(this.sticks[i].updir, this.width, this.sticks[i].updir);
                    gd3d.math.pool.delete_vector3(tocamdir);
                }
            }
            else
            {
                this.gameObject.transform.getUpInWorld(this.sticks[0].updir);
                gd3d.math.vec3ScaleByNum(this.sticks[0].updir, this.width, this.sticks[0].updir);
                for(var i=1;i<length;i++)
                {
                    gd3d.math.vec3SLerp(this.sticks[i].updir, this.sticks[i - 1].updir, this.speed, this.sticks[i].updir);
                }
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

        public setspeed(upspeed: number)
        {
            this.speed = upspeed;
        }
        public setWidth(Width: number)
        {
            this.width = Width;
        }
        //播放
        public play()
        {
            //this.intidata();//项目喜欢添加组件后立刻播放，会报错，此时组件的start还没走
            this.reInit=true;
            this.active=true;
        }
        //停止
        public stop()
        {
            this.active=false;
        }
        lookAtCamera:boolean=false;
        //------------------------------------------------------------------------------------------------------
        private initmesh()
        {
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
            //this.intidata();
        }

        private intidata()
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
                gd3d.math.vec3ScaleByNum(ts.updir,this.width,ts.updir);
            }

            var length = this.vertexcount / 2;
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

        private updateTrailData()
        {
            var length = this.vertexcount / 2;

            if(this.extenedOneSide)
            {
                for (var i = 0; i < length; i++)
                {
                    var pos = this.sticks[i].location;
                    var up = this.sticks[i].updir;
                    this.dataForVbo[i * 2 * 9] = pos.x;
                    this.dataForVbo[i * 2 * 9 + 1] = pos.y;
                    this.dataForVbo[i * 2 * 9 + 2] = pos.z;

                    this.dataForVbo[(i * 2 + 1) * 9] = pos.x + up.x;
                    this.dataForVbo[(i * 2 + 1) * 9 + 1] = pos.y + up.y;
                    this.dataForVbo[(i * 2 + 1) * 9 + 2] = pos.z + up.z;
                }
            }
            else
            {
                for (var i = 0; i < length; i++)
                {
                    var pos = this.sticks[i].location;
                    var up = this.sticks[i].updir;
                    this.dataForVbo[i * 2 * 9] = pos.x-up.x;
                    this.dataForVbo[i * 2 * 9 + 1] = pos.y-up.y;
                    this.dataForVbo[i * 2 * 9 + 2] = pos.z-up.z;

                    this.dataForVbo[(i * 2 + 1) * 9] = pos.x + up.x;
                    this.dataForVbo[(i * 2 + 1) * 9 + 1] = pos.y + up.y;
                    this.dataForVbo[(i * 2 + 1) * 9 + 2] = pos.z + up.z;
                }
            }

        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            if(!this.active) return;
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