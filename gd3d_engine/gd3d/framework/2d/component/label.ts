/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.node2DComponent
    @reflect.nodeRender

    export class label implements IRectRenderer
    {
        //文字内容
        private _text: string;
        @gd3d.reflect.Field("string")
        get text(): string
        {
            return this._text;
        }
        set text(text: string)
        {
            this._text = text;
            //设置缓存长度
            var cachelen = 6 * 13 * this._text.length;
            this.datar.splice(0, this.datar.length);
            while (this.datar.length < cachelen)
            {
                this.datar.push(
                    0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                );
            }
            while (this.datar.length < cachelen)
            {
                this.datar.pop();
            }
            this.dirtyData = true;
        }

        //字体
        private _font: font;
        @gd3d.reflect.Field("font")
        get font()
        {
            return this._font;
        }
        set font(font: font)
        {
            if(this._font)
            {
                this._font.unuse();
            }
            this._font = font;
            this._font.use();
        }

        //字体大小
        private _fontsize: number = 14;
        @gd3d.reflect.Field("number")
        get fontsize()
        {
            return this._fontsize;
        }
        set fontsize(size: number)
        {
            this._fontsize = size;
        }

        linespace: number = 1;//fontsize的倍数
        horizontalType: HorizontalType = HorizontalType.Center;//水平排列方式
        verticalType: VerticalType = VerticalType.Center;//垂直排列方式

        //计算数组
        private indexarr = [];
        private remainarrx = [];
        //原来代码写的太冗余，堆栈也太深了，改写
        updateData(_font: gd3d.framework.font)
        {
            this.dirtyData = false;

            var rate = this._fontsize / _font.lineHeight;
            var m = this.transform.getWorldMatrix();
            var m11 = m.rawData[0];
            var m12 = m.rawData[2];
            var m21 = m.rawData[1];
            var m22 = m.rawData[3];

            var bx = this.data_begin.x;
            var by = this.data_begin.y;

            //计算出排列数据
            var txadd = 0;
            var tyadd = 0;
            this.indexarr = [];
            this.remainarrx = [];
            var remainy = 0;
            for (var i = 0; i < this._text.length; i++)
            {
                let c = this._text.charAt(i);
                let cinfo = _font.cmap[c];
                if (cinfo == undefined)
                {
                    continue;
                }
                if (txadd + cinfo.xAddvance * rate > this.transform.width)
                {
                    if (tyadd + this._fontsize * this.linespace > this.transform.height)
                    {
                        break;
                    }
                    else
                    {
                        this.indexarr.push(i);
                        this.remainarrx.push(this.transform.width - txadd);
                        txadd = 0;
                        tyadd += this._fontsize * this.linespace;
                    }
                }
                txadd += cinfo.xAddvance * rate;
            }
            this.indexarr.push(i);
            this.remainarrx.push(this.transform.width - txadd);
            remainy = this.transform.height - tyadd;

            var i = 0;
            var xadd = 0;
            var yadd = 0;
            if (this.verticalType == VerticalType.Center)
            {
                yadd += remainy / 2;
            }
            else if (this.verticalType == VerticalType.Boom)
            {
                yadd += remainy;
            }
            for (var arri = 0; arri < this.indexarr.length; arri++)
            {
                //一行
                xadd = 0;
                if (this.horizontalType == HorizontalType.Center)
                {
                    xadd += this.remainarrx[arri] / 2;
                }
                else if (this.horizontalType = HorizontalType.Right)
                {
                    xadd += this.remainarrx[arri];
                }

                for (; i < this.indexarr[arri]; i++)
                {
                    let c = this._text.charAt(i);
                    let cinfo = _font.cmap[c];
                    if (cinfo == undefined)
                    {
                        continue;
                    }

                    var cx = xadd + cinfo.xOffset * rate;
                    var cy = yadd - cinfo.yOffset * rate + _font.baseline * rate;

                    var ch = rate * cinfo.ySize;
                    var cw = rate * cinfo.xSize;
                    xadd += cinfo.xAddvance * rate;
                    var x1 = cx + cw;
                    var y1 = cy;
                    var x2 = cx;
                    var y2 = cy + ch;
                    var x3 = cx + cw;
                    var y3 = cy + ch;

                    this.datar[i * 6 * 13 + 0] = bx + cx * m11 + cy * m12;//x
                    this.datar[i * 6 * 13 + 1] = by + cx * m21 + cy * m22;//y
                    this.datar[i * 6 * 13 + 13 * 1 + 0] = bx + x1 * m11 + y1 * m12;//x
                    this.datar[i * 6 * 13 + 13 * 1 + 1] = by + x1 * m21 + y1 * m22;//y
                    this.datar[i * 6 * 13 + 13 * 2 + 0] = bx + x2 * m11 + y2 * m12;//x
                    this.datar[i * 6 * 13 + 13 * 2 + 1] = by + x2 * m21 + y2 * m22;//y
                    this.datar[i * 6 * 13 + 13 * 3 + 0] = bx + x2 * m11 + y2 * m12;//x
                    this.datar[i * 6 * 13 + 13 * 3 + 1] = by + x2 * m21 + y2 * m22;//y
                    this.datar[i * 6 * 13 + 13 * 4 + 0] = bx + x1 * m11 + y1 * m12;//x
                    this.datar[i * 6 * 13 + 13 * 4 + 1] = by + x1 * m21 + y1 * m22;//y
                    this.datar[i * 6 * 13 + 13 * 5 + 0] = bx + x3 * m11 + y3 * m12;//x
                    this.datar[i * 6 * 13 + 13 * 5 + 1] = by + x3 * m21 + y3 * m22;//y


                    //uv
                    var u0 = cinfo.x;
                    var v0 = cinfo.y;
                    var u1 = cinfo.x + cinfo.w;
                    var v1 = cinfo.y;
                    var u2 = cinfo.x;
                    var v2 = cinfo.y + cinfo.h;
                    var u3 = cinfo.x + cinfo.w;
                    var v3 = cinfo.y + cinfo.h;

                    this.datar[i * 6 * 13 + 7] = u0;
                    this.datar[i * 6 * 13 + 8] = v0;
                    this.datar[i * 6 * 13 + 13 * 1 + 7] = u1;
                    this.datar[i * 6 * 13 + 13 * 1 + 8] = v1;
                    this.datar[i * 6 * 13 + 13 * 2 + 7] = u2;
                    this.datar[i * 6 * 13 + 13 * 2 + 8] = v2;
                    this.datar[i * 6 * 13 + 13 * 3 + 7] = u2;
                    this.datar[i * 6 * 13 + 13 * 3 + 8] = v2;
                    this.datar[i * 6 * 13 + 13 * 4 + 7] = u1;
                    this.datar[i * 6 * 13 + 13 * 4 + 8] = v1;
                    this.datar[i * 6 * 13 + 13 * 5 + 7] = u3;
                    this.datar[i * 6 * 13 + 13 * 5 + 8] = v3;

                    //主color
                    for (var j = 0; j < 6; j++)
                    {
                        this.datar[i * 6 * 13 + 13 * j + 3] = this.color.r;
                        this.datar[i * 6 * 13 + 13 * j + 4] = this.color.g;
                        this.datar[i * 6 * 13 + 13 * j + 5] = this.color.b;
                        this.datar[i * 6 * 13 + 13 * j + 6] = this.color.a;

                        this.datar[i * 6 * 13 + 13 * j + 9] = this.color2.r;
                        this.datar[i * 6 * 13 + 13 * j + 10] = this.color2.g;
                        this.datar[i * 6 * 13 + 13 * j + 11] = this.color2.b;
                        this.datar[i * 6 * 13 + 13 * j + 12] = this.color2.a;
                    }
                }
                yadd += this._fontsize * this.linespace;
            }

            //for (var i = 0; i < this._text.length; i++)
            //{
            //    let c = this._text.charAt(i);
            //    let cinfo = _font.cmap[c];
            //    if (cinfo == undefined)
            //    {
            //        continue;
            //    }

            //    if (xadd + cinfo.xAddvance * rate > this.transform.width)
            //    {
            //        if (yadd + this._fontsize * this.linespace > this.transform.height)
            //        {
            //            break;
            //        }
            //        else
            //        {
            //            xadd = 0;
            //            yadd += this._fontsize * this.linespace;
            //        }
            //    }

            //    var cx = xadd + cinfo.xOffset * rate;
            //    var cy = yadd - cinfo.yOffset * rate + _font.baseline * rate;

            //    var ch = rate * cinfo.ySize;
            //    var cw = rate * cinfo.xSize;
            //    xadd += cinfo.xAddvance * rate;
            //    var x1 = cx + cw;
            //    var y1 = cy;
            //    var x2 = cx;
            //    var y2 = cy + ch;
            //    var x3 = cx + cw;
            //    var y3 = cy + ch;

            //    this.datar[i * 6 * 13 + 0] = bx + cx * m11 + cy * m12;//x
            //    this.datar[i * 6 * 13 + 1] = by + cx * m21 + cy * m22;//y
            //    this.datar[i * 6 * 13 + 13 * 1 + 0] = bx + x1 * m11 + y1 * m12;//x
            //    this.datar[i * 6 * 13 + 13 * 1 + 1] = by + x1 * m21 + y1 * m22;//y
            //    this.datar[i * 6 * 13 + 13 * 2 + 0] = bx + x2 * m11 + y2 * m12;//x
            //    this.datar[i * 6 * 13 + 13 * 2 + 1] = by + x2 * m21 + y2 * m22;//y
            //    this.datar[i * 6 * 13 + 13 * 3 + 0] = bx + x2 * m11 + y2 * m12;//x
            //    this.datar[i * 6 * 13 + 13 * 3 + 1] = by + x2 * m21 + y2 * m22;//y
            //    this.datar[i * 6 * 13 + 13 * 4 + 0] = bx + x1 * m11 + y1 * m12;//x
            //    this.datar[i * 6 * 13 + 13 * 4 + 1] = by + x1 * m21 + y1 * m22;//y
            //    this.datar[i * 6 * 13 + 13 * 5 + 0] = bx + x3 * m11 + y3 * m12;//x
            //    this.datar[i * 6 * 13 + 13 * 5 + 1] = by + x3 * m21 + y3 * m22;//y


            //    //uv
            //    var u0 = cinfo.x;
            //    var v0 = cinfo.y;
            //    var u1 = cinfo.x + cinfo.w;
            //    var v1 = cinfo.y;
            //    var u2 = cinfo.x;
            //    var v2 = cinfo.y + cinfo.h;
            //    var u3 = cinfo.x + cinfo.w;
            //    var v3 = cinfo.y + cinfo.h;

            //    this.datar[i * 6 * 13 + 7] = u0;
            //    this.datar[i * 6 * 13 + 8] = v0;
            //    this.datar[i * 6 * 13 + 13 * 1 + 7] = u1;
            //    this.datar[i * 6 * 13 + 13 * 1 + 8] = v1;
            //    this.datar[i * 6 * 13 + 13 * 2 + 7] = u2;
            //    this.datar[i * 6 * 13 + 13 * 2 + 8] = v2;
            //    this.datar[i * 6 * 13 + 13 * 3 + 7] = u2;
            //    this.datar[i * 6 * 13 + 13 * 3 + 8] = v2;
            //    this.datar[i * 6 * 13 + 13 * 4 + 7] = u1;
            //    this.datar[i * 6 * 13 + 13 * 4 + 8] = v1;
            //    this.datar[i * 6 * 13 + 13 * 5 + 7] = u3;
            //    this.datar[i * 6 * 13 + 13 * 5 + 8] = v3;

            //    //主color
            //    for (var j = 0; j < 6; j++)
            //    {
            //        this.datar[i * 6 * 13 + 13 * j + 3] = this.color.r;
            //        this.datar[i * 6 * 13 + 13 * j + 4] = this.color.g;
            //        this.datar[i * 6 * 13 + 13 * j + 5] = this.color.b;
            //        this.datar[i * 6 * 13 + 13 * j + 6] = this.color.a;

            //        this.datar[i * 6 * 13 + 13 * j + 9] = this.color2.r;
            //        this.datar[i * 6 * 13 + 13 * j + 10] = this.color2.g;
            //        this.datar[i * 6 * 13 + 13 * j + 11] = this.color2.b;
            //        this.datar[i * 6 * 13 + 13 * j + 12] = this.color2.a;
            //    }

            //}

        }
        private data_begin: math.vector2 = new math.vector2(0, 0);


        // selfdatar: number[];
        datar: number[] = [];

        color: math.color = new math.color(1, 1, 1, 1);
        color2: math.color = new math.color(0, 0, 0.5, 0.5);
        
        mat: material;
        dirtyData: boolean = true;
        render(canvas: canvas)
        {
            if (this._font != null)
            {
                if (this.dirtyData = true)
                {
                    this.updateData(this._font);
                    this.dirtyData = false;
                }

                if (this.mat == null)
                {
                    this.mat = new material();
                    this.mat.setShader(canvas.assetmgr.getShader("shader/defuifont"));
                }

                var img;
                if (this._font != null)
                {
                    img = this._font.texture;
                }

                if (img == null)
                {
                    var scene = this.transform.canvas.scene;
                    img = scene.app.getAssetMgr().getDefaultTexture("grid");
                }
                this.mat.setTexture("_MainTex", img);
                if (this.datar.length != 0)
                {
                    canvas.pushRawData(this.mat, this.datar);
                }
            }
        }

        updateTran()
        {
            var m = this.transform.getWorldMatrix();

            var l = -this.transform.pivot.x * this.transform.width;
            var t = -this.transform.pivot.y * this.transform.height;
            this.data_begin.x = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
            this.data_begin.y = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
            //只把左上角算出来
            //this.dirtyData = true;
        }
        //2d使用固定的顶点格式
        //pos[0,1,2]color[3,4,5,6]uv[7,8]color2[9,10,11,12] length=13
        start()
        {

        }
        update(delta: number)
        {

        }
        transform: transform2D;

        remove()
        {
            this._font.unuse(true);
            this.indexarr.length = 0;
            this.remainarrx.length = 0;
            this.datar.length = 0;
        }
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {

        }
    }
    export enum HorizontalType
    {
        Center,
        Left,
        Right
    }
    export enum VerticalType
    {
        Center,
        Top,
        Boom
    }
}