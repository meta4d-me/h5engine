namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * mesh资源
     * @version egret-gd3d 1.0
     */
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
            this.name = new constText(assetName);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version egret-gd3d 1.0
         */
        getName(): string
        {
            if (!this.name)
            {
                return null;
            }
            return this.name.getText();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version egret-gd3d 1.0
         */
        getGUID(): number
        {
            return this.id.getID();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version egret-gd3d 1.0
         */
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version egret-gd3d 1.0
         */
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version egret-gd3d 1.0
         */
        dispose()
        {
            this.glMesh.dispose(sceneMgr.app.getAssetMgr().webgl);
            this.data = null;
            delete this.submesh;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version egret-gd3d 1.0
         */
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
        /**
         * @private
         */
        glMesh: gd3d.render.glMesh;
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh数据实例
         * @version egret-gd3d 1.0
         */
        data: gd3d.render.meshData;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * submesh信息列表
         * @version egret-gd3d 1.0
         */
        submesh: subMeshInfo[] = [];

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param buf buffer数组
         * @param webgl webgl实例
         * @version egret-gd3d 1.0
         */
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

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         * @version egret-gd3d 1.0
         */
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
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 克隆mesh
         * @version egret-gd3d 1.0
         */
        clone(): mesh
        {
            let _result = new mesh(this.getName());
            var vf = this.glMesh.vertexFormat;//顶点属性
            var data: gd3d.render.meshData = new gd3d.render.meshData();

            if (this.data.pos != undefined)
            {
                data.pos = [];
                for (var i = 0; i < this.data.pos.length; i++)
                {
                    var _position = new gd3d.math.vector3();
                    _position.x = this.data.pos[i].x;
                    _position.y = this.data.pos[i].y;
                    _position.z = this.data.pos[i].z;
                    data.pos.push(_position);
                }
            }
            if (this.data.color != undefined)
            {
                data.color = [];
                for (var i = 0; i < this.data.color.length; i++)
                {
                    var _color = new gd3d.math.color();
                    _color.a = this.data.color[i].a;
                    _color.r = this.data.color[i].r;
                    _color.g = this.data.color[i].g;
                    _color.b = this.data.color[i].b;
                    data.color.push(_color);
                }
            }
            if (this.data.normal != undefined)
            {
                data.normal = [];
                for (var i = 0; i < this.data.normal.length; i++)
                {
                    var _normal = new gd3d.math.vector3();
                    _normal.x = this.data.normal[i].x;
                    _normal.y = this.data.normal[i].y;
                    _normal.z = this.data.normal[i].z;
                    data.normal.push(_normal);
                }
            }
            if (this.data.uv != undefined)
            {
                data.uv = [];
                for (var i = 0; i < this.data.uv.length; i++)
                {
                    var uv = new gd3d.math.vector2();
                    uv.x = this.data.uv[i].x;
                    uv.y = this.data.uv[i].y;
                    data.uv.push(uv);
                }
            }
            if (this.data.uv2 != undefined)
            {
                data.uv2 = [];
                for (var i = 0; i < this.data.uv2.length; i++)
                {
                    var uv = new gd3d.math.vector2();
                    uv.x = this.data.uv2[i].x;
                    uv.y = this.data.uv2[i].y;
                    data.uv2.push(uv);
                }
            }
            if (this.data.tangent != undefined)
            {
                data.tangent = [];
                for (var i = 0; i < this.data.tangent.length; i++)
                {
                    var tangent = new gd3d.math.vector3();
                    tangent.x = this.data.tangent[i].x;
                    tangent.y = this.data.tangent[i].y;
                    tangent.z = this.data.tangent[i].z;
                    data.tangent.push(tangent);
                }
            }
            if (this.data.blendIndex != undefined)
            {
                data.blendIndex = [];
                for (var i = 0; i < this.data.blendIndex.length; i++)
                {
                    var _boneIndex = new render.number4();
                    _boneIndex.v0 = this.data.blendIndex[i].v0;
                    _boneIndex.v1 = this.data.blendIndex[i].v1;
                    _boneIndex.v2 = this.data.blendIndex[i].v2;
                    _boneIndex.v3 = this.data.blendIndex[i].v3;
                    data.blendIndex.push(_boneIndex);
                }
            }
            if (this.data.blendWeight != undefined)
            {
                data.blendWeight = [];
                for (var i = 0; i < this.data.blendWeight.length; i++)
                {

                    var _boneWeight = new render.number4();
                    _boneWeight.v0 = this.data.blendWeight[i].v0;
                    _boneWeight.v1 = this.data.blendWeight[i].v1;
                    _boneWeight.v2 = this.data.blendWeight[i].v2;
                    _boneWeight.v3 = this.data.blendWeight[i].v3;
                    data.blendWeight.push(_boneWeight);
                }
            }

            _result.submesh = [];
            for (var i = 0; i < this.submesh.length; i++)
            {
                var _submeshinfo: subMeshInfo = new subMeshInfo();

                _submeshinfo.start = this.submesh[i].start;
                _submeshinfo.size = this.submesh[i].size;
                _submeshinfo.matIndex = i;
                _result.submesh.push(_submeshinfo);
            }
            data.trisindex = this.data.trisindex.slice();

            _result.data = data;
            _result.glMesh = new gd3d.render.glMesh();

            var vertexs = _result.data.genVertexDataArray(vf);
            var indices = _result.data.genIndexDataArray();

            _result.glMesh.initBuffer(sceneMgr.app.getAssetMgr().webgl, vf, this.data.pos.length);
            _result.glMesh.uploadVertexSubData(sceneMgr.app.getAssetMgr().webgl, vertexs);
            _result.glMesh.addIndex(sceneMgr.app.getAssetMgr().webgl, indices.length);
            _result.glMesh.uploadIndexSubData(sceneMgr.app.getAssetMgr().webgl, 0, indices);
            return _result;
        }
    }
    /**
     * @private
     */
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