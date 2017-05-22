namespace gd3d.framework
{
    @reflect.nodeComponent
    export class trailRender implements INodeComponent
    {
        // layer: RenderLayerEnum=RenderLayerEnum.Common;
        // renderLayer: CullingMask=CullingMask.default;
        // queue: number;

        private trailTrans:gd3d.framework.transform;
        private meshf:gd3d.framework.meshFilter;
        private meshrender:gd3d.framework.meshRenderer;
        //width:number=1;
        startWidth:number=0.1;
        endWidth:number=1;

        time:number=2;
        material:gd3d.framework.material;

        startColor:gd3d.math.color=new gd3d.math.color(1,1,1,1);
        endColor:gd3d.math.color=new gd3d.math.color(1,1,1,1);

        private nodes:trailNode[]=[];
        private mesh:gd3d.framework.mesh;
        start()
        {
            this.trailTrans=new gd3d.framework.transform();
            this.gameObject.transform.addChild(this.trailTrans);

            this.meshf=this.trailTrans.gameObject.addComponent(StringUtil.COMPONENT_MESHFILTER)as gd3d.framework.meshFilter;
            this.meshrender=this.trailTrans.gameObject.addComponent(StringUtil.COMPONENT_MESHRENDER)as gd3d.framework.meshRenderer;
            if(this.material!=undefined)
            {
                this.meshrender.materials=[];
                this.meshrender.materials.push(this.material);
            }
            else
            {
                var mat=new gd3d.framework.material();
                var shader=this.gameObject.getScene().app.getAssetMgr().getShader("shader/def2");
                mat.setShader(shader);
                this.meshrender.materials=[];
                this.meshrender.materials.push(mat);
            }
            // this.mesh=new gd3d.framework.mesh();
            this.meshf.mesh=this.mesh;

            this.app=this.gameObject.getScene().app;
        }
        private app:application;

        update(delta: number)
        {
            var _time=this.app.getTotalTime();
            this.recordTrailNode(_time);
            this.updateTrail(_time);
            this.meshf.mesh=this.mesh;
        }
        gameObject: gameObject;
        remove()
        {
            
        }

        private recordTrailNode(time:number)
        {
            var pos=new gd3d.math.vector3();
            gd3d.math.vec3Clone(this.gameObject.transform.getWorldTranslate(),pos);

            var length=this.nodes.length;
            if(length!=0)
            {
                if(gd3d.math.vec3Distance(pos,this.nodes[0].location)<0.02) return;
            }

            var updir=new gd3d.math.vector3();
            this.gameObject.transform.getUpInWorld(updir);
           
            var newNode=new trailNode(pos,updir,time);
            this.nodes.splice(0,0,newNode);
        }

        private updateTrail(curTime:number)
        {
            if(this.mesh!=undefined)
            {
                this.mesh.dispose();
            }

            while(this.nodes.length>0&&curTime>this.nodes[this.nodes.length-1].time+this.time)
            {
                this.nodes.pop();
            }

            if(this.nodes.length<2) return;

            this.mesh=new gd3d.framework.mesh();

            var positons:gd3d.math.vector3[]=[];
            var colors:gd3d.math.color[]=[];
            var uvs:gd3d.math.vector2[]=[];
            var trisindex:number[]=[];
            

            var worldMat=this.gameObject.transform.getWorldMatrix();
            var matrixToLocal=gd3d.math.pool.clone_matrix(worldMat);
            gd3d.math.matrixInverse(matrixToLocal,matrixToLocal);

            for(var i=0;i<this.nodes.length;i++)
            {
                var curNode=this.nodes[i];
                var u=gd3d.math.floatClamp((curTime-curNode.time)/this.time,0,1.0);
                var localpos0=new gd3d.math.vector3();
                gd3d.math.matrixTransformVector3(curNode.location,matrixToLocal,localpos0);

                var _updir=new gd3d.math.vector3();
                gd3d.math.vec3Clone(curNode.updir,_updir);
                var _width:number=this.startWidth+(this.endWidth-this.startWidth)*u;
                
                gd3d.math.vec3ScaleByNum(_updir,_width,_updir);

                var localpos1=new gd3d.math.vector3();
                gd3d.math.vec3Add(curNode.location,_updir,localpos1);
                gd3d.math.matrixTransformVector3(localpos1,matrixToLocal,localpos1);

                positons[i*2+0]=localpos0;
                positons[i*2+1]=localpos1;

                uvs[i*2+0]=new gd3d.math.vector2(u,0);
                uvs[i*2+1]=new gd3d.math.vector2(u,1);

                var color=new gd3d.math.color();
                gd3d.math.colorLerp(this.startColor,this.endColor,u,color);
                colors[i*2+0]=color;
                colors[i*2+1]=color;
            }
            for(var k=0;k<this.nodes.length-1;k++)
            {
                trisindex[k*6+0]=k*2;
                trisindex[k*6+1]=(k+1)*2;
                trisindex[k*6+2]=k*2+1;

                trisindex[k*6+3]=k*2+1;
                trisindex[k*6+4]=(k+1)*2;
                trisindex[k*6+5]=(k+1)*2+1;
            }


            var meshdata:gd3d.render.meshData=new gd3d.render.meshData();
            meshdata.pos=positons;
            meshdata.color=colors;
            meshdata.uv=uvs;
            meshdata.trisindex=trisindex;


            this.mesh.data=meshdata;
            var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0;
            var v32 = this.mesh.data.genVertexDataArray(vf);
            var i16 = this.mesh.data.genIndexDataArray();

            var webgl=this.gameObject.getScene().app.webgl;
            this.mesh.glMesh = new gd3d.render.glMesh();
            this.mesh.glMesh.initBuffer(webgl, vf, this.mesh.data.pos.length);
            this.mesh.glMesh.uploadVertexSubData(webgl, v32);

            this.mesh.glMesh.addIndex(webgl, i16.length);
            this.mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
            this.mesh.submesh = [];

            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = false;
                this.mesh.submesh.push(sm);
            }
        }

        clone()
        {

        }

    }
    export class trailNode
    {
        location:gd3d.math.vector3;
        updir:gd3d.math.vector3;
        time:number;

        constructor(p:gd3d.math.vector3,updir:gd3d.math.vector3,t:number)
        {
            this.location=p;
            this.updir=updir;
            this.time=t;
        }
    }
}