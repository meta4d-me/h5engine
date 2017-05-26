namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class trailRender2 implements IRenderer
    {
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        queue: number=0;

        //width:number=1;
        startWidth: number = 1;
        endWidth: number = 1;

        time: number = 2;
        material: gd3d.framework.material;
        color: gd3d.math.color = new gd3d.math.color(1, 1, 1, 1);

        private trailTrans: gd3d.framework.transform;
        private nodes: trailNode[] = [];
        private mesh: gd3d.framework.mesh;

        private dataForVbo: Float32Array;
        private dataForEbo: Uint16Array;

        start()
        {

            this.app = this.gameObject.getScene().app;
            this.webgl=this.app.webgl;
            this.mesh = new gd3d.framework.mesh();
            this.mesh.data = new gd3d.render.meshData();
            this.mesh.glMesh = new gd3d.render.glMesh();

            this.dataForVbo = new Float32Array(128);
            this.dataForEbo = new Uint16Array(128);

            var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0;
            this.mesh.glMesh.initBuffer(this.webgl, vf,128, render.MeshTypeEnum.Dynamic);

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
        }
        private app: application;
        private webgl:WebGLRenderingContext;
        update(delta: number)
        {
            var _time = this.app.getTotalTime();
            this.recordTrailNode(_time);
            this.updateTrail(_time);
        }
        gameObject: gameObject;
        remove()
        {

        }

        private recordTrailNode(time: number)
        {
            var pos = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), pos);

            var length = this.nodes.length;
            if (length != 0)
            {
                if (gd3d.math.vec3Distance(pos, this.nodes[0].location) < 0.02) return;
            }

            var updir = new gd3d.math.vector3();
            this.gameObject.transform.getUpInWorld(updir);

            var newNode = new trailNode(pos, updir, time);
            this.nodes.unshift(newNode);
        }
        private notRender:boolean=false;

        private updateTrail(curTime: number)
        {

            while (this.nodes.length > 0 && curTime > this.nodes[this.nodes.length - 1].time + this.time)
            {
                this.nodes.pop();
            }

            if (this.nodes.length < 2)
            {
                this.notRender=true;
                return;
            }
            else
            {
                this.notRender=false;
            }

            this.checkBufferSize();
            for (var i = 0; i < this.nodes.length; i++)
            {
                var curNode = this.nodes[i];
                var u = i / this.nodes.length;

                var _updir = new gd3d.math.vector3();
                gd3d.math.vec3Clone(curNode.updir, _updir);
                var _width: number = this.startWidth + (this.endWidth - this.startWidth) * u;
                gd3d.math.vec3ScaleByNum(_updir, _width, _updir);


                var tempPos = gd3d.math.pool.new_vector3();
                gd3d.math.vec3Add(curNode.location, _updir, tempPos);
                this.dataForVbo[2 * i * 9 + 0] = tempPos.x;
                this.dataForVbo[2 * i * 9 + 1] = tempPos.y;
                this.dataForVbo[2 * i * 9 + 2] = tempPos.z;

                this.dataForVbo[2 * i * 9 + 3] = this.color.r;
                this.dataForVbo[2 * i * 9 + 4] = this.color.g;
                this.dataForVbo[2 * i * 9 + 5] = this.color.b;
                this.dataForVbo[2 * i * 9 + 6] = this.color.a;


                this.dataForVbo[2 * i * 9 + 7] = u;
                this.dataForVbo[2 * i * 9 + 8] = 1.0;


                gd3d.math.vec3Subtract(curNode.location, _updir, tempPos);
                this.dataForVbo[(2 * i + 1) * 9 + 0] = tempPos.x;
                this.dataForVbo[(2 * i + 1) * 9 + 1] = tempPos.y;
                this.dataForVbo[(2 * i + 1) * 9 + 2] = tempPos.z;

                this.dataForVbo[(2 * i + 1) * 9 + 3] = this.color.r;
                this.dataForVbo[(2 * i + 1) * 9 + 4] = this.color.g;
                this.dataForVbo[(2 * i + 1) * 9 + 5] = this.color.b;
                this.dataForVbo[(2 * i + 1) * 9 + 6] = this.color.a;

                var u = i / this.nodes.length;
                this.dataForVbo[(2 * i + 1) * 9 + 7] = u;
                this.dataForVbo[(2 * i + 1) * 9 + 8] = 0;

            }
            for (var k = 0; k < this.nodes.length - 1; k++)
            {
                this.dataForEbo[k * 6 + 0] = k * 2;
                this.dataForEbo[k * 6 + 1] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 2] = k * 2 + 1;

                this.dataForEbo[k * 6 + 3] = k * 2 + 1;
                this.dataForEbo[k * 6 + 4] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 5] = (k + 1) * 2 + 1;
            }
        }

        private checkBufferSize()
        {
            if(this.nodes.length*2*9>this.dataForVbo.length)
            {
                var length=this.dataForVbo.length;
                this.mesh.glMesh.resetVboSize(this.webgl,length*2);
                this.dataForVbo=new Float32Array(length*2);
            }
            if((this.nodes.length-1)*6>this.dataForEbo.length)
            {
                var length=this.dataForEbo.length;
                this.mesh.glMesh.resetEboSize(this.webgl, 0,length*2);
                this.dataForEbo=new Uint16Array(length*2);
            }
        }
        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            if(this.notRender) return;

            context.updateModeTrail();
            this.mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            this.mesh.glMesh.uploadIndexSubData(context.webgl, 0, this.dataForEbo);

            this.mesh.submesh[0].size=(this.nodes.length-1)*6;

            //--------------------------render-------------------------------------------
            this.material.draw(context, this.mesh,this.mesh.submesh[0], "base");
        }
        clone()
        {

        }

    }
    // export class trailNode
    // {
    //     location: gd3d.math.vector3;
    //     updir: gd3d.math.vector3;
    //     time: number;

    //     constructor(p: gd3d.math.vector3, updir: gd3d.math.vector3, t: number)
    //     {
    //         this.location = p;
    //         this.updir = updir;
    //         this.time = t;
    //     }
    // }
}