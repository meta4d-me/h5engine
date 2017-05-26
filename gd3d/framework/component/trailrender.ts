namespace gd3d.framework {
    @reflect.nodeRender
    @reflect.nodeComponent
    export class trailRender implements IRenderer {
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        renderLayer: gd3d.framework.CullingMask = CullingMask.default;
        queue: number = 0;

        //width:number=1;
        startWidth: number = 1;
        endWidth: number = 1;

        time: number = 2;
        material: gd3d.framework.material;
        color: gd3d.math.color = new gd3d.math.color(1, 1, 1, 1);

        private trailTrans: gd3d.framework.transform;
        private nodes: trailNode[] = [];
        private mesh: gd3d.framework.mesh;

        private vertexcount = 24;
        private dataForVbo: Float32Array;
        private dataForEbo: Uint16Array;

        start() {

            this.app = this.gameObject.getScene().app;
            this.webgl = this.app.webgl;

            this.initmesh();
        }
        private app: application;
        private webgl: WebGLRenderingContext;
        update(delta: number) {
            var _time = this.app.getTotalTime();
            this.updateTrail(_time);
        }
        gameObject: gameObject;
        remove() {

        }

        private initmesh() {
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
            //-----------------------------------------------
            var updir = new gd3d.math.vector3();
            this.gameObject.transform.getUpInWorld(updir);

            var pos = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), pos);

            var uppos = new gd3d.math.vector3();
            gd3d.math.vec3Add(pos, updir, uppos);

            var downpos = new gd3d.math.vector3();
            gd3d.math.vec3Subtract(pos, updir, downpos);


            for (var i = 0; i < length; i++) {
                this.dataForVbo[i * 2 * 9] = uppos.x;
                this.dataForVbo[i * 2 * 9 + 1] = uppos.y;
                this.dataForVbo[i * 2 * 9 + 2] = uppos.z;
                this.dataForVbo[i * 2 * 9 + 3] = this.color.r;
                this.dataForVbo[i * 2 * 9 + 4] = this.color.g;
                this.dataForVbo[i * 2 * 9 + 5] = this.color.b;
                this.dataForVbo[i * 2 * 9 + 6] = this.color.a;
                this.dataForVbo[i * 2 * 9 + 7] = i/ (length - 1);
                this.dataForVbo[i * 2 * 9 + 8] = 0;

                this.dataForVbo[(i * 2 + 1) * 9] = downpos.x;
                this.dataForVbo[(i * 2 + 1) * 9 + 1] = downpos.y;
                this.dataForVbo[(i * 2 + 1) * 9 + 2] = downpos.z;
                this.dataForVbo[(i * 2 + 1) * 9 + 3] = this.color.r;
                this.dataForVbo[(i * 2 + 1) * 9 + 4] = this.color.g;
                this.dataForVbo[(i * 2 + 1) * 9 + 5] = this.color.b;
                this.dataForVbo[(i * 2 + 1) * 9 + 6] = this.color.a;
                this.dataForVbo[(i * 2 + 1) * 9 + 7] = i/ (length - 1);
                this.dataForVbo[(i * 2 + 1) * 9 + 8] = 1;

            }
            //--------------------------------------     
            for (var k = 0; k < length - 1; k++) {
                this.dataForEbo[k * 6 + 0] = k * 2;
                this.dataForEbo[k * 6 + 1] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 2] = k * 2 + 1;

                this.dataForEbo[k * 6 + 3] = k * 2 + 1;
                this.dataForEbo[k * 6 + 4] = (k + 1) * 2;
                this.dataForEbo[k * 6 + 5] = (k + 1) * 2 + 1;
            }
            this.mesh.glMesh.uploadVertexSubData(this.webgl, this.dataForVbo);
            this.mesh.glMesh.uploadIndexSubData(this.webgl, 0, this.dataForEbo);
        }

        private notRender: boolean = false;
        public speed: number = 1;
        private updateTrail(curTime: number) 
        {
            var length = this.vertexcount / 2;

            var pos = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(), pos);

            var updir = new gd3d.math.vector3();
            this.gameObject.transform.getUpInWorld(updir);

            var uppos = new gd3d.math.vector3();
            gd3d.math.vec3Add(pos, updir, uppos);

            var downpos = new gd3d.math.vector3();
            gd3d.math.vec3Subtract(pos, updir, downpos);

            this.dataForVbo[0] = uppos.x;
            this.dataForVbo[1] = uppos.y;
            this.dataForVbo[2] = uppos.z;

            this.dataForVbo[9] = downpos.x;
            this.dataForVbo[9 + 1] = downpos.y;
            this.dataForVbo[9 + 2] = downpos.z;

            for (var i = 1; i < length; i++) {
                var xx=this.dataForVbo[(i-1)*2*9]-this.dataForVbo[i*2*9];
                var yy=this.dataForVbo[(i-1)*2*9+1]-this.dataForVbo[i*2*9+1];
                var zz=this.dataForVbo[(i-1)*2*9+2]-this.dataForVbo[i*2*9+2];
                var curspeed=this.speed*(length-i)/length;
                //var curspeed=this.speed;
                this.dataForVbo[i*2*9]+=xx*curspeed;
                this.dataForVbo[i*2*9+1]+=yy*curspeed;
                this.dataForVbo[i*2*9+2]+=zz*curspeed;

                var xx1=this.dataForVbo[((i-1)*2+1)*9]-this.dataForVbo[(i*2+1)*9];
                var yy1=this.dataForVbo[((i-1)*2+1)*9+1]-this.dataForVbo[(i*2+1)*9+1];
                var zz1=this.dataForVbo[((i-1)*2+1)*9+2]-this.dataForVbo[(i*2+1)*9+2];

                this.dataForVbo[(i*2+1)*9]+=xx1*curspeed;
                this.dataForVbo[(i*2+1)*9+1]+=yy1*curspeed;
                this.dataForVbo[(i*2+1)*9+2]+=zz1*curspeed;
            }

        }

        render(context: renderContext, assetmgr: assetMgr, camera: camera) {
            if (this.notRender) return;
            this.layer = this.material.getLayer();
            context.updateModeTrail();
            //this.mesh.glMesh.uploadIndexSubData(this.webgl, 0, this.dataForEbo);
            this.mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            //--------------------------render-------------------------------------------
            this.material.draw(context, this.mesh, this.mesh.submesh[0], "base");
        }
        clone() {

        }

    }
    export class trailNode {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
        time: number;

        constructor(p: gd3d.math.vector3, updir: gd3d.math.vector3, t: number) {
            this.location = p;
            this.updir = updir;
            this.time = t;
        }
    }
}