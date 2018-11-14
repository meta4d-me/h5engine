namespace dome
{
    export class GMesh
    {
        vf:number;
        vertexByteSize:number;
        mesh:gd3d.framework.mesh;

        maxVerteCount:number;
        currentVerteCount:number=0;

        maxVboLen:number;
        realVboLen:number=0;
        vbodata:Float32Array;

        maxEboLen:number;
        realEboLen:number=0;
        ebodata:Uint16Array;

        constructor(vCount:number,vf:number,webgl:WebGLRenderingContext)
        {
            let total = gd3d.render.meshData.calcByteSize(vf) / 4;
            let gmesh=new gd3d.framework.mesh();
            this.vbodata= new Float32Array(total*2048);
            this.ebodata= new Uint16Array(2048);
            this.vf=vf;

            this.maxVerteCount=vCount;
            this.maxVboLen=this.vbodata.length;
            this.maxEboLen=this.ebodata.length;

            gmesh.glMesh = new gd3d.render.glMesh();
            gmesh.glMesh.initBuffer(webgl, vf, vCount,gd3d.render.MeshTypeEnum.Dynamic);
            // gmesh.glMesh.uploadVertexData(webgl, vboArr);

            gmesh.glMesh.addIndex(webgl, this.ebodata.length);
            // gmesh.glMesh.uploadIndexData(webgl, 0, eboArr);
            gmesh.submesh = [];
            {
                var sm = new gd3d.framework.subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = this.ebodata.length;
                sm.line = false;
                gmesh.submesh.push(sm);
            }
            this.mesh=gmesh;
            this.vertexByteSize=gmesh.glMesh.vertexByteSize;
        }


        private temptPos:gd3d.math.vector3=new gd3d.math.vector3();
        uploadMeshData(mat:gd3d.math.matrix,mesh:gd3d.framework.mesh,webgl:WebGLRenderingContext)
        {
            let data=mesh.data;

            this.checkMeshCapacity(data.pos.length,data.trisindex.length,webgl);

            let vertexcount=data.pos.length;
            let size=this.vertexByteSize/4;
            
            let vbodata=this.vbodata;
            for(let i=0;i<vertexcount;i++)
            {
                let seek = 0;
                gd3d.math.matrixTransformVector3(data.pos[i],mat,this.temptPos);
                vbodata[this.realVboLen+i*size]=this.temptPos.x;
                vbodata[this.realVboLen+i*size+1]=this.temptPos.x;
                vbodata[this.realVboLen+i*size+2]=this.temptPos.x;
                seek+=3;

                if (this.vf & gd3d.render.VertexFormatMask.Normal)
                {
                    vbodata[this.realVboLen+i*size+seek]=data.normal[i].x;
                    vbodata[this.realVboLen+i*size+seek+1]=data.normal[i].y;
                    vbodata[this.realVboLen+i*size+seek+2]=data.normal[i].z;
                    seek+=3;
                }

                if (this.vf & gd3d.render.VertexFormatMask.Tangent)
                {
                    vbodata[this.realVboLen+i*size+seek]=data.tangent[i].x;
                    vbodata[this.realVboLen+i*size+seek+1]=data.tangent[i].y;
                    vbodata[this.realVboLen+i*size+seek+2]=data.tangent[i].z;
                    seek+=3;
                }

                if (this.vf & gd3d.render.VertexFormatMask.Color)
                {
                    if(data.color!=null)
                    {
                        vbodata[this.realVboLen+i*size+seek]=data.color[i].r;
                        vbodata[this.realVboLen+i*size+seek+1]=data.color[i].g;
                        vbodata[this.realVboLen+i*size+seek+2]=data.color[i].b;
                        vbodata[this.realVboLen+i*size+seek+3]=data.color[i].a;
                    }else
                    {
                        vbodata[this.realVboLen+i*size+seek]=1;
                        vbodata[this.realVboLen+i*size+seek+1]=1;
                        vbodata[this.realVboLen+i*size+seek+2]=1;
                        vbodata[this.realVboLen+i*size+seek+3]=1;
                    }
                    seek+=4;
                }

                if (this.vf & gd3d.render.VertexFormatMask.UV0)
                {
                    vbodata[this.realVboLen+i*size+seek]=data.uv[i].x;
                    vbodata[this.realVboLen+i*size+seek+1]=data.uv[i].y;
                    seek+=2;
                }
            }

            let ebodata=this.ebodata;
            let len=data.trisindex.length;
            for(let i=0;i<len;i++)
            {
                ebodata[this.realEboLen+i]=data.trisindex[i]+this.currentVerteCount;
            }

            this.realVboLen+=size*vertexcount;
            this.realEboLen+=len;
            this.currentVerteCount+=vertexcount;
        }
        mixToGLmesh(webgl:WebGLRenderingContext)
        {
            this.mesh.glMesh.uploadVertexData(webgl,this.vbodata);
            this.mesh.glMesh.uploadIndexData(webgl, 0, this.ebodata);
        }

        private checkMeshCapacity(vertexcount:number,eboLen:number,webgl:WebGLRenderingContext)
        {
            if(this.currentVerteCount+vertexcount>this.maxVerteCount)
            {
                this.maxVerteCount*=2;
                this.maxVboLen=this.vbodata.length*2;
                let newVbo=new Float32Array(this.maxVboLen);
                newVbo.set(this.vbodata);
                this.mesh.glMesh.resetVboSize(webgl,this.maxVerteCount);

                this.vbodata=newVbo;
            }
            if(this.realEboLen+eboLen>this.maxEboLen)
            {
                this.maxEboLen=this.ebodata.length*2;
                let newebo=new Float32Array(this.maxEboLen);
                newebo.set(this.ebodata);
                this.mesh.glMesh.resetEboSize(webgl,0,this.maxEboLen);

                this.ebodata=newebo;
            }

        }

    }
    export class mixMesh implements IState
    {
        app:gd3d.framework.application;
        start(app: gd3d.framework.application) {


        }        
        update(delta: number) {


        }

        targets:gd3d.framework.transform[];
        matDic:{[matID:number]:gd3d.framework.transform[]}={};
        mixmeshDic:{[matID:number]:GMesh}={};


        mixMesh(targets:gd3d.framework.transform[],vf:number=gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Normal| gd3d.render.VertexFormatMask.Tangent| gd3d.render.VertexFormatMask.UV0):{nobatch:gd3d.framework.transform[],batch:gd3d.framework.transform[],mixMeshId:number[]}
        {
            let nobatchArr:gd3d.framework.transform[]=[];
            let batchArr:gd3d.framework.transform[]=[];
            let mixmeshid:number[]=[];

            for(let i=0;i<targets.length;i++)
            {
                let meshf=targets[i].gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
                let meshr=targets[i].gameObject.getComponent("meshRenderer") as gd3d.framework.meshRenderer;
                if(meshr.materials.length>1)
                {
                    this.targets.push(targets[i]);
                }else
                {
                    this.matDic[meshr.materials[0].getGUID()].push(targets[i]);
                }
            }

            
            for(let key in this.matDic)
            {
                let transArr=this.matDic[key];
                if(transArr.length>2)
                {
                    for(let i=0;i< transArr.length;i++)
                    {
                        let meshf=transArr[i].gameObject.getComponent("meshFilter") as gd3d.framework.meshFilter;
                        if(this.mixmeshDic[key]==null)
                        {
                            this.mixmeshDic[key]=new GMesh(2048,vf,this.app.webgl);
                            mixmeshid.push(i);
                        }
                        this.mixmeshDic[key].uploadMeshData(transArr[i].getWorldMatrix(),meshf.mesh,this.app.webgl);

                        batchArr.push(transArr[i]);
                    }
                }else
                {
                    if(transArr[0]!=null)
                    {
                        nobatchArr.push(transArr[0]);
                    }
                }
            }

            for(let key in this.mixmeshDic)
            {
                this.mixmeshDic[key].mixToGLmesh(this.app.webgl);
            }

            return {batch:batchArr,nobatch:nobatchArr,mixMeshId:mixmeshid};
        }


    }
}