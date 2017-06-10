namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class mesh implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "mesh_" + this.getGUID();
            }
            if (!sceneMgr.app.getAssetMgr().nameDuplicateCheck(assetName))
            {
                throw new Error("already have name.");
            }
            this.name = new constText(assetName);
        }
        getName(): string
        {
            if (!this.name)
            {
                return null;
            }
            return this.name.getText();
        }
        getGUID(): number
        {
            return this.id.getID();
        }
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        dispose()
        {
            this.glMesh.dispose(sceneMgr.app.getAssetMgr().webgl);
            this.data = null;
            delete this.submesh;
        }
        caclByteLength(): number
        {
            let total = 0;
            total += this.glMesh.caclByteLength();
            if (this.data)
            {
                total += this.data.caclByteLength();
            }
            return total;
        }
        glMesh: gd3d.render.glMesh;
        data: gd3d.render.meshData;
        submesh: subMeshInfo[] = [];

        Parse(buf: ArrayBuffer, webgl: WebGLRenderingContext)
        {
            var vf = 0;//顶点属性
            var data: gd3d.render.meshData = new gd3d.render.meshData();
            var read: gd3d.io.binReader = new gd3d.io.binReader(buf);
            //meshdata.name = read.readString();
            //var bound = read.readBound();

            var meshName = read.readStringAnsi();
            //this.setName(read.readStringAnsi());
            read.position = read.position + 24;

            var vcount = read.readUInt32();

            var vec10tpose: number[] = [];
            while (true)
            {
                var tag = read.readUInt8();
                if (tag == 255) break;
                if (tag == 1)//pos
                {
                    if (data.pos == undefined)
                    {
                        data.pos = [];
                        vf = vf | gd3d.render.VertexFormatMask.Position;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var _position = new gd3d.math.vector3();
                        _position.x = read.readSingle();
                        _position.y = read.readSingle();
                        _position.z = read.readSingle();
                        data.pos.push(_position);
                    }
                }
                else if (tag == 2)//color
                {
                    if (data.color == undefined)
                    {
                        data.color = [];
                        vf = vf | gd3d.render.VertexFormatMask.Color;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var _color = new gd3d.math.color();
                        _color.a = read.readUInt8();
                        _color.r = read.readUInt8();
                        _color.g = read.readUInt8();
                        _color.b = read.readUInt8();
                        data.color.push(_color);
                    }
                }
                else if (tag == 3)//normal
                {
                    if (data.normal == undefined)
                    {
                        data.normal = [];
                        vf = vf | gd3d.render.VertexFormatMask.Normal;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var _normal = new gd3d.math.vector3();
                        _normal.x = read.readSingle();
                        _normal.y = read.readSingle();
                        _normal.z = read.readSingle();
                        data.normal.push(_normal);
                    }
                }
                else if (tag == 4)//uv
                {
                    if (data.uv == undefined)
                    {
                        data.uv = [];
                        vf = vf | gd3d.render.VertexFormatMask.UV0;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var uv = new gd3d.math.vector2();
                        uv.x = read.readSingle();
                        uv.y = 1 - read.readSingle();
                        data.uv.push(uv);
                    }
                }
                else if (tag == 5)//uv1
                {
                    if (data.uv2 == undefined)
                    {
                        data.uv2 = [];
                        vf = vf | gd3d.render.VertexFormatMask.UV1;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var uv = new gd3d.math.vector2();
                        uv.x = read.readSingle();
                        uv.y = 1 - read.readSingle();
                        data.uv2.push(uv);

                    }
                }
                else if (tag == 6)//uv2
                {
                    //meshdata.vec2uvs2 = new Float32Array(vcount * 2);
                    for (var i = 0; i < vcount; i++)
                    {
                        //meshdata.vec2uvs2[i * 2 + 0] =
                        read.readSingle();//u
                        //meshdata.vec2uvs2[i * 2 + 1] =
                        1 - read.readSingle();//v

                    }
                }
                else if (tag == 7)//tangent
                {
                    if (data.tangent == undefined)
                    {
                        data.tangent = [];
                        vf = vf | gd3d.render.VertexFormatMask.Tangent;
                    }
                    for (var i = 0; i < vcount; i++)
                    {

                        var tangent = new gd3d.math.vector3();
                        var x = read.readSingle();
                        var y = read.readSingle();
                        var z = read.readSingle();
                        var w = read.readSingle();
                        tangent.x = x / w;
                        tangent.y = y / w;
                        tangent.z = z / w;
                        data.tangent.push(tangent);
                    }
                }
                else if (tag == 8)//uv3
                {
                    for (var i = 0; i < vcount; i++)
                    {
                        //meshdata.vec2uvs2[i * 2 + 0] =
                        read.readSingle();//u
                        //meshdata.vec2uvs2[i * 2 + 1] =
                        1 - read.readSingle();//v

                    }
                }
                else if (tag == 16)//tpose
                {
                    var tposelen = read.readUInt8();
                    //meshdata.vec10tpose = new Float32Array(tposelen * 10);
                    for (var i = 0; i < tposelen; i++)
                    {
                        vec10tpose[i * 10 + 0] = read.readSingle();//posx;
                        vec10tpose[i * 10 + 1] = read.readSingle();//posy;
                        vec10tpose[i * 10 + 2] = read.readSingle();//posz;
                        vec10tpose[i * 10 + 3] = read.readSingle();//scalex;
                        vec10tpose[i * 10 + 4] = read.readSingle();//scaley;
                        vec10tpose[i * 10 + 5] = read.readSingle();//scalez;
                        vec10tpose[i * 10 + 6] = read.readSingle();//quatx;
                        vec10tpose[i * 10 + 7] = read.readSingle();//quaty;
                        vec10tpose[i * 10 + 8] = read.readSingle();//quatz;
                        vec10tpose[i * 10 + 9] = read.readSingle();//quatw;
                    }
                }
                else if (tag == 17)//skinwidget;
                {
                    if (data.blendIndex == undefined)
                    {
                        data.blendIndex = [];
                        vf = vf | gd3d.render.VertexFormatMask.BlendIndex4;
                    }
                    if (data.blendWeight == undefined)
                    {
                        data.blendWeight = [];
                        vf = vf | gd3d.render.VertexFormatMask.BlendWeight4;
                    }
                    for (var i = 0; i < vcount; i++)
                    {
                        var _boneIndex = new render.number4();
                        _boneIndex.v0 = read.readUInt32();
                        _boneIndex.v1 = read.readUInt32();
                        _boneIndex.v2 = read.readUInt32();
                        _boneIndex.v3 = read.readUInt32();

                        var _boneWeight = new render.number4();
                        _boneWeight.v0 = read.readSingle();
                        _boneWeight.v1 = read.readSingle();
                        _boneWeight.v2 = read.readSingle();
                        _boneWeight.v3 = read.readSingle();

                        data.blendIndex.push(_boneIndex);
                        data.blendWeight.push(_boneWeight);
                    }
                }
                else
                {
                    throw "notwrite" + tag;
                }
            }

            var subcount = read.readUInt8();
            data.trisindex = [];
            this.submesh = [];
            for (var i = 0; i < subcount; i++)
            {
                var _submeshinfo: subMeshInfo = new subMeshInfo();
                var tv = read.readUInt32();//代表之前submesh中的drawstyle

                var sublen = read.readUInt32();
                _submeshinfo.start = data.trisindex.length;
                _submeshinfo.size = sublen;
                _submeshinfo.matIndex = i;
                this.submesh.push(_submeshinfo);
                for (var j = 0; j < sublen; j++)
                {
                    var index = read.readUInt32();
                    data.trisindex.push(index);
                }

            }

            buf = null;
            this.data = data;
            this.glMesh = new gd3d.render.glMesh();
            var vertexs = this.data.genVertexDataArray(vf);
            var indices = this.data.genIndexDataArray();

            this.glMesh.initBuffer(webgl, vf, this.data.pos.length);
            this.glMesh.uploadVertexSubData(webgl, vertexs);
            this.glMesh.addIndex(webgl, indices.length);
            this.glMesh.uploadIndexSubData(webgl, 0, indices);
        }

        intersects(ray: ray, matrix: gd3d.math.matrix): pickinfo
        {
            var pickinfo = null;
            for (var i = 0; i < this.submesh.length; i++)
            {
                var submesh = this.submesh[i];
                if (submesh.line)
                {

                }
                else
                {
                    if (submesh.useVertexIndex < 0)
                    {
                        //不使用index
                    }
                    else
                    {
                        var t0 = gd3d.math.pool.new_vector3();
                        var t1 = gd3d.math.pool.new_vector3();
                        var t2 = gd3d.math.pool.new_vector3();
                        for (var index = submesh.start; index < submesh.size; index += 3)
                        {
                            var p0 = this.data.pos[this.data.trisindex[index]];
                            var p1 = this.data.pos[this.data.trisindex[index + 1]];
                            var p2 = this.data.pos[this.data.trisindex[index + 2]];

                            gd3d.math.matrixTransformVector3(p0, matrix, t0);
                            gd3d.math.matrixTransformVector3(p1, matrix, t1);
                            gd3d.math.matrixTransformVector3(p2, matrix, t2);

                            var result = ray.intersectsTriangle(t0, t1, t2);
                            if (result)
                            {
                                if (result.distance < 0) continue;
                                if (!pickinfo || pickinfo.distance > result.distance)
                                {
                                    pickinfo = result;
                                    pickinfo.faceId = index / 3;
                                    pickinfo.subMeshId = i;
                                    var tdir = gd3d.math.pool.new_vector3();
                                    gd3d.math.vec3ScaleByNum(ray.direction, result.distance, tdir);
                                    gd3d.math.vec3Add(ray.origin, tdir, pickinfo.hitposition);
                                }
                            }
                        }
                        gd3d.math.pool.delete_vector3(t0);
                        gd3d.math.pool.delete_vector3(t1);
                        gd3d.math.pool.delete_vector3(t2);
                    }
                }
            }
            return pickinfo;
        }
    }
    export class subMeshInfo
    {
        matIndex: number;
        useVertexIndex: number = 0;//-1 表示不用indexbuffer,>=0 表示第几个，
        //通常都是用第一个indexbuffer，只有用wireframe显示模式，使用第二个部分
        line: boolean = false;
        start: number;
        size: number;
    }


}