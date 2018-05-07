namespace gd3d.threading
{
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


    @threadHandle()
    export class meshDataHandle implements IHandle
    {
        handle(buf: ArrayBuffer)
        {
            let data: any = {};
            //console.log("hello world");
            var objVF = { vf: 0 };//顶点属性
            // var data: gd3d.render.meshData = new gd3d.render.meshData();
            var read: gd3d.io.binReader = new gd3d.io.binReader(buf);
            //meshdata.name = read.readString();
            //var bound = read.readBound();

            var meshName = read.readStringAnsi();
            //this.setName(read.readStringAnsi());
            read.position = read.position + 24;

            var vcount = read.readUInt32();

            var vec10tpose: number[] = [];

            var tag = read.readUInt8();
            while (tag && tag < 18)
            {
               
                //end
                if (tag == 255) 
                {
                    break;
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
                tag = read.readUInt8();
            }


            var subcount = read.readUInt8();
            data.trisindex = [];
            var submesh = [];
            for (var i = 0; i < subcount; i++)
            {
                var _submeshinfo: subMeshInfo = new subMeshInfo();
                var tv = read.readUInt32();//代表之前submesh中的drawstyle

                var sublen = read.readUInt32();
                _submeshinfo.start = data.trisindex.length;
                _submeshinfo.size = sublen;
                _submeshinfo.matIndex = i;
                submesh.push(_submeshinfo);
                for (var j = 0; j < sublen; j++)
                {
                    var index = read.readUInt32();
                    data.trisindex.push(index);
                }
            }

            return {
                meshData: data,
                subMesh: submesh,
                objVF: objVF
            };
        }

    }
}


