namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * mesh资源
     * @version gd3d 1.0
     */
    @gd3d.reflect.SerializeType
    export class mesh implements IAsset
    {
        static readonly ClassName: string = "mesh";

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
         * @version gd3d 1.0
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
         * @version gd3d 1.0
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
         * @version gd3d 1.0
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
         * @version gd3d 1.0
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
         * @version gd3d 1.0
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
         * @version gd3d 1.0
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

        updateByEffect: boolean = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh数据实例
         * @version gd3d 1.0
         */
        data: gd3d.render.meshData;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * submesh信息列表
         * @version gd3d 1.0
         */
        submesh: subMeshInfo[] = [];

        /**
         * 是否使用多线程解析
         */
        static useThead: boolean = true;
        //加载完成事件
        public onReadFinish: () => void;
        // //分片加载状态变量
        private reading = false;
        // //分片加载器
        private readProcess(read, data, objVF, vcount, vec10tpose, callback)
        {

            if (this.reading) return;

            var tag = read.readUInt8();
            //end
            if (tag == 255) 
            {
                callback();
                return;
            }
            if (tag == 1)//pos
            {
                if (data.pos == undefined)
                {
                    data.pos = [];
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Position;
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
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Color;
                }
                for (var i = 0; i < vcount; i++)
                {
                    var _color = new gd3d.math.color();
                    _color.a = math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                    _color.r = math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                    _color.g = math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                    _color.b = math.floatClamp(read.readUInt8() / 255, 0, 1.0);
                    data.color.push(_color);
                }
            }
            else if (tag == 3)//normal
            {
                if (data.normal == undefined)
                {
                    data.normal = [];
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Normal;
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
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.UV0;
                }
                for (var i = 0; i < vcount; i++)
                {
                    var uv = new gd3d.math.vector2();
                    uv.x = read.readSingle();
                    uv.y = read.readSingle();
                    data.uv.push(uv);
                }
            }
            else if (tag == 5)//uv1
            {
                if (data.uv2 == undefined)
                {
                    data.uv2 = [];
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.UV1;
                }
                for (var i = 0; i < vcount; i++)
                {
                    var uv = new gd3d.math.vector2();
                    uv.x = read.readSingle();
                    uv.y = read.readSingle();
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
                    read.readSingle();//v

                }
            }
            else if (tag == 7)//tangent
            {
                if (data.tangent == undefined)
                {
                    data.tangent = [];
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.Tangent;
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
                    read.readSingle();//v

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
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.BlendIndex4;
                }
                if (data.blendWeight == undefined)
                {
                    data.blendWeight = [];
                    objVF.vf = objVF.vf | gd3d.render.VertexFormatMask.BlendWeight4;
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
            this.reading = false;
            setTimeout(() =>
            {
                this.readProcess(read, data, objVF, vcount, vec10tpose, () =>
                {
                    callback();
                });
            });
        }
        //分片加载完成
        private readFinish(read, data, buf, objVF, webgl)
        {
            var subcount = read.readUInt8();
            data.trisindex = [];
            this.submesh = [];
            for (var i = 0; i < subcount; i++)
            {
                var _submeshinfo: subMeshInfo = new subMeshInfo();

                // var tv = read.readUInt32();//代表之前submesh中的drawstyle
                read.readUInt32();

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
            data.originVF = objVF.vf;
            this.data = data;
            this.glMesh = new gd3d.render.glMesh();
            var vertexs = this.data.genVertexDataArray(objVF.vf);
            var indices = this.data.genIndexDataArray();

            this.glMesh.initBuffer(webgl, objVF.vf, this.data.pos.length);
            this.glMesh.uploadVertexData(webgl, vertexs);
            this.glMesh.addIndex(webgl, indices.length);
            this.glMesh.uploadIndexData(webgl, 0, indices);

            // this.onReadFinish();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param buf buffer数组
         * @param webgl webgl实例
         * @version gd3d 1.0
         */
        Parse(inData: ArrayBuffer | any, webgl: WebGLRenderingContext)
        {
            return new Promise<IAsset>((reslove, reject) =>
            {
                try
                {
                    this.parseCMesh(inData, webgl);
                } catch (error)
                {
                    reject(error.stack);
                    return;
                }
                reslove(this);
            });
        }

        parseCMesh(inData, webgl)
        {
            // console.log(`parseCMesh:${this.name.getText()}`);
            var data: gd3d.render.meshData = new gd3d.render.meshData();
            var read: gd3d.io.binReader = new gd3d.io.binReader(inData);
            data.originVF = read.readUInt16();
            let vertexCount = read.readUInt32();
            let fmt = gd3d.render.VertexFormatMask;
            data.pos = [];
            for (let i = 0; i < vertexCount; ++i)
            {
                data.pos.push({
                    x: read.readSingle(),
                    y: read.readSingle(),
                    z: read.readSingle()
                });
                if (data.originVF & fmt.Normal)
                {
                    data.normal = data.normal || [];
                    data.normal.push({
                        x: read.readSingle(),
                        y: read.readSingle(),
                        z: read.readSingle()
                    });
                }
                if (data.originVF & fmt.Tangent)
                {
                    data.tangent = data.tangent || [];
                    data.tangent.push({
                        x: read.readSingle(),
                        y: read.readSingle(),
                        z: read.readSingle()
                    });
                }

                if (data.originVF & fmt.Color)
                {
                    data.color = data.color || [];
                    data.color.push({
                        r: read.readSingle(),
                        g: read.readSingle(),
                        b: read.readSingle(),
                        a: read.readSingle()
                    });
                }
                if (data.originVF & fmt.UV0)
                {
                    data.uv = data.uv || [];
                    data.uv.push({
                        x: read.readSingle(),
                        y: read.readSingle()
                    });
                }
                if (data.originVF & fmt.UV1)
                {
                    data.uv2 = data.uv2 || [];
                    data.uv2.push({
                        x: read.readSingle(),
                        y: read.readSingle()
                    });
                }
                if (data.originVF & fmt.BlendIndex4)
                {
                    data.blendIndex = data.blendIndex || [];
                    data.blendIndex.push({
                        v0: read.readUInt32(),
                        v1: read.readUInt32(),
                        v2: read.readUInt32(),
                        v3: read.readUInt32()
                    });
                }
                if (data.originVF & fmt.BlendWeight4)
                {
                    data.blendWeight = data.blendWeight || [];
                    data.blendWeight.push({
                        v0: read.readSingle(),
                        v1: read.readSingle(),
                        v2: read.readSingle(),
                        v3: read.readSingle()
                    });
                }
                if (data.originVF & fmt.ColorEX)
                {
                    data.colorex = data.colorex || [];
                    data.colorex.push({
                        r: read.readSingle(),
                        g: read.readSingle(),
                        b: read.readSingle(),
                        a: read.readSingle()
                    })
                }
            }

            var len = read.readUInt8();
            data.trisindex = [];
            this.submesh = [];
            for (var i = 0; i < len; ++i)
            {
                var _submeshinfo: subMeshInfo = new subMeshInfo();
                _submeshinfo.start = read.readUInt16();
                _submeshinfo.size = read.readUInt32();
                _submeshinfo.matIndex = i;//read.readUInt8();
                this.submesh.push(_submeshinfo);
                for (var j = 0; j < _submeshinfo.size; j++)
                {
                    data.trisindex.push(read.readUInt32());
                }

            }

            this.data = data;
            this.glMesh = new gd3d.render.glMesh();
            var vertexs = this.data.genVertexDataArray(this.data.originVF);
            var indices = this.data.genIndexDataArray();

            this.glMesh.initBuffer(webgl, this.data.originVF, this.data.pos.length);
            this.glMesh.uploadVertexData(webgl, vertexs);
            this.glMesh.addIndex(webgl, indices.length);
            this.glMesh.uploadIndexData(webgl, 0, indices);
        }

        // parseTMesh(inData, webgl, reslove)
        // {
        //     threading.thread.Instance.Call("meshDataHandle", inData, (result) =>
        //     {
        //         let objVF = result.objVF;
        //         let data = result.meshData;
        //         data.originVF = objVF.vf;
        //         // this.data = new gd3d.render.meshData();
        //         this.data = render.meshData.cloneByObj(data);
        //         // for (let k in data)
        //         //     this.data[k] = data[k];
        //         this.submesh = result.subMesh;

        //         this.glMesh = new gd3d.render.glMesh();
        //         var vertexs = this.data.genVertexDataArray(objVF.vf);
        //         var indices = this.data.genIndexDataArray();

        //         // let __webgl = sceneMgr.app.getAssetMgr().webgl;
        //         this.glMesh.initBuffer(webgl, objVF.vf, this.data.pos.length);
        //         this.glMesh.uploadVertexData(webgl, vertexs);
        //         this.glMesh.addIndex(webgl, indices.length);
        //         this.glMesh.uploadIndexData(webgl, 0, indices);
        //         reslove();
        //     });
        // }
        // parseMesh(inData, webgl, reslove)
        // {
        //     var objVF = { vf: 0 };//顶点属性
        //     var data: gd3d.render.meshData = new gd3d.render.meshData();
        //     var read: gd3d.io.binReader = new gd3d.io.binReader(inData);
        //     // var meshName = read.readStringAnsi();
        //     read.readStringAnsi();

        //     read.position = read.position + 24;

        //     var vcount = read.readUInt32();

        //     var vec10tpose: number[] = [];

        //     //分片加载 
        //     this.readProcess(read, data, objVF, vcount, vec10tpose, () =>
        //     {
        //         this.readFinish(read, data, inData, objVF, webgl);
        //         reslove();
        //     });
        // }
        // parseCMesh(inData, webgl)
        // {
        //     var data: gd3d.render.meshData = new gd3d.render.meshData();
        //     var read: gd3d.io.binReader = new gd3d.io.binReader(inData);
        //     data.originVF = read.readUInt16();
        //     data.pos = [];

        //     let vector3 = math.vector3, color = math.color, vector2 = math.vector2, number4 = render.number4;
        //     var len;

        //     len = read.readUInt32();
        //     for (var i = 0; i < len; ++i)
        //     {
        //         var v3 = new vector3(read.readSingle(), read.readSingle(), read.readSingle());
        //         data.pos.push(v3);
        //     }


        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.color = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var c = new color(read.readSingle(), read.readSingle(), read.readSingle(), read.readSingle());
        //             data.color.push(c);
        //         }
        //     }
        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.uv = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var uv = new vector2(read.readSingle(), read.readSingle());
        //             data.uv.push(uv);
        //         }
        //     }

        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.uv2 = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var uv2 = new vector2(read.readSingle(), read.readSingle());
        //             data.uv2.push(uv2);
        //         }
        //     }

        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.normal = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var normal = new vector3(read.readSingle(), read.readSingle(), read.readSingle());
        //             data.normal.push(normal);
        //         }
        //     }

        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.tangent = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var tangent = new vector3(read.readSingle(), read.readSingle(), read.readSingle());
        //             data.tangent.push(tangent);
        //         }
        //     }
        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.blendIndex = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var bi = new number4();
        //             bi.v0 = read.readUInt32();
        //             bi.v1 = read.readUInt32();
        //             bi.v2 = read.readUInt32();
        //             bi.v3 = read.readUInt32();
        //             data.blendIndex.push(bi);
        //         }
        //     }
        //     len = read.readUInt32();
        //     if (len > 0)
        //     {
        //         data.blendWeight = [];
        //         for (var i = 0; i < len; ++i)
        //         {
        //             var bi = new number4();
        //             bi.v0 = read.readSingle();
        //             bi.v1 = read.readSingle();
        //             bi.v2 = read.readSingle();
        //             bi.v3 = read.readSingle();
        //             data.blendWeight.push(bi);
        //         }
        //     }

        //     data.trisindex = [];
        //     this.submesh = [];
        //     len = read.readUInt8();
        //     for (var i = 0; i < len; ++i)
        //     {
        //         var _submeshinfo: subMeshInfo = new subMeshInfo();
        //         _submeshinfo.start = read.readUInt16();
        //         _submeshinfo.size = read.readUInt32();
        //         _submeshinfo.matIndex = i;//read.readUInt8();
        //         this.submesh.push(_submeshinfo);
        //         for (var j = 0; j < _submeshinfo.size; j++)
        //         {
        //             data.trisindex.push(read.readUInt32());
        //         }

        //     }

        //     this.data = data;
        //     this.glMesh = new gd3d.render.glMesh();
        //     var vertexs = this.data.genVertexDataArray(this.data.originVF);
        //     var indices = this.data.genIndexDataArray();

        //     this.glMesh.initBuffer(webgl, this.data.originVF, this.data.pos.length);
        //     this.glMesh.uploadVertexData(webgl, vertexs);
        //     this.glMesh.addIndex(webgl, indices.length);
        //     this.glMesh.uploadIndexData(webgl, 0, indices);

        // }
        /*
        parseJSON(inData, webgl)
        {
            this.data = new gd3d.render.meshData();
            this.data.originVF = inData.meshData.originVF;
            this.data.pos = inData.meshData.pos;
            this.data.color = inData.meshData.color;
            this.data.colorex = inData.meshData.colorex;
            this.data.uv = inData.meshData.uv;
            this.data.uv2 = inData.meshData.uv2;
            this.data.normal = inData.meshData.normal;
            this.data.tangent = inData.meshData.tangent;
            this.data.blendIndex = inData.meshData.blendIndex;
            this.data.blendWeight = inData.meshData.blendWeight;
            this.data.trisindex = inData.meshData.trisindex;
            this.submesh = inData.submesh;

            this.glMesh = new gd3d.render.glMesh();
            var vertexs = this.data.genVertexDataArray(this.data.originVF);
            var indices = this.data.genIndexDataArray();
            this.glMesh.initBuffer(webgl, this.data.originVF, this.data.pos.length);
            this.glMesh.uploadVertexData(webgl, vertexs);
            this.glMesh.addIndex(webgl, indices.length);
            this.glMesh.uploadIndexData(webgl, 0, indices);
        }*/
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         * @version gd3d 1.0
         */
        intersects(ray: ray, matrix: gd3d.math.matrix, outInfo: pickinfo): boolean
        {
            let ishided = false;
            if (!this.submesh) return ishided;
            let lastDistance = Number.MAX_VALUE;
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

                            let tempinfo = math.pool.new_pickInfo();
                            var bool = ray.intersectsTriangle(t0, t1, t2, tempinfo);
                            if (bool)
                            {
                                if (tempinfo.distance < 0) continue;
                                if (lastDistance > tempinfo.distance)
                                {
                                    ishided = true;
                                    outInfo.cloneFrom(tempinfo);
                                    lastDistance = outInfo.distance;
                                    outInfo.faceId = index / 3;
                                    outInfo.subMeshId = i;
                                    var tdir = gd3d.math.pool.new_vector3();
                                    math.vec3ScaleByNum(ray.direction, outInfo.distance, tdir);
                                    math.vec3Add(ray.origin, tdir, outInfo.hitposition);
                                    math.pool.delete_vector3(tdir);
                                }
                            }
                            math.pool.delete_pickInfo(tempinfo);
                        }
                        math.pool.delete_vector3(t0);
                        math.pool.delete_vector3(t1);
                        math.pool.delete_vector3(t2);
                    }
                }
            }
            return ishided;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 克隆mesh
         * @version gd3d 1.0
         */
        clone(): mesh
        {
            let _result = new mesh(this.getName());
            var vf = this.glMesh.vertexFormat;//顶点属性
            // var data: gd3d.render.meshData = new gd3d.render.meshData();
            var data: gd3d.render.meshData = render.meshData.cloneByObj(this.data);

            _result.data = data;
            _result.glMesh = new gd3d.render.glMesh();

            var vertexs = _result.data.genVertexDataArray(vf);
            var indices = _result.data.genIndexDataArray();

            _result.glMesh.initBuffer(sceneMgr.app.getAssetMgr().webgl, vf, this.data.pos.length);
            _result.glMesh.uploadVertexData(sceneMgr.app.getAssetMgr().webgl, vertexs);
            _result.glMesh.addIndex(sceneMgr.app.getAssetMgr().webgl, indices.length);
            _result.glMesh.uploadIndexData(sceneMgr.app.getAssetMgr().webgl, 0, indices);
            return _result;
        }

        private _cacheMinP: math.vector3;
        private _cacheMaxP: math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算模型顶点的 最大最小值
         * @param outMin 输出最小
         * @param outMax 输出最大
         * @version gd3d 1.0
         */
        calcVectexMinMax(outMin: math.vector3, outMax: math.vector3)
        {
            if (!outMin || !outMax) return;
            if (!this._cacheMinP || !this._cacheMaxP)
            {
                this._cacheMinP = new math.vector3();
                this._cacheMaxP = new math.vector3();
                let meshdata = this.data;
                gd3d.math.vec3SetByFloat(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, this._cacheMinP);
                gd3d.math.vec3SetByFloat(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, this._cacheMaxP);
                for (var i = 0; i < meshdata.pos.length; i++)
                {
                    gd3d.math.vec3Max(meshdata.pos[i], this._cacheMaxP, this._cacheMaxP);
                    gd3d.math.vec3Min(meshdata.pos[i], this._cacheMinP, this._cacheMinP);
                }
            }
            math.vec3Clone(this._cacheMinP, outMin);
            math.vec3Clone(this._cacheMaxP, outMax);
        }
    }
    /**
     * @private
     */
    export class subMeshInfo
    {
        matIndex: number = 0;
        useVertexIndex: number = 0;//-1 表示不用indexbuffer,>=0 表示第几个，
        //通常都是用第一个indexbuffer，只有用wireframe显示模式，使用第二个部分
        line: boolean = false;
        start: number = 0;
        size: number = 0;
    }


}