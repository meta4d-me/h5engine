﻿/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本组件
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class label implements IRectRenderer
    {
        private _text: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文字内容
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("string")
        get text(): string
        {
            return this._text;
        }
        set text(text: string)
        {
            text = text == null? "": text;
            this._text = text;
            //设置缓存长度
            this.initdater();
            this.dirtyData = true;
        }

        private initdater(){
            var cachelen = 6 * 13 * this._text.length;
            this.datar.splice(0, this.datar.length);
            while (this.datar.length < cachelen)
            {   // {pos,color1,uv,color2}
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
        }

        private _font: font;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体
         * @version egret-gd3d 1.0
         */
        get font()
        {
            return this._font;
        }
        set font(font: font)
        {
            if(font == this._font) return;

            this.needRefreshFont = true;
            if(this._font)
            {
                this._font.unuse();
            }
            this._font = font;
            if(font){
                this._font.use();
                this._fontName = this._font.getName();
            }else{
                this._fontName = "";
            }
        }
        private needRefreshFont = false;

        @gd3d.reflect.Field("string")
        private _fontName = "defFont";
        private _fontsize: number = 14;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体大小
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        get fontsize()
        {
            return this._fontsize;
        }
        set fontsize(size: number)
        {
            this._fontsize = size;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 行高
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        linespace: number = 1;//fontsize的倍数

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平排列方式
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        horizontalType: HorizontalType = HorizontalType.Left;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直排列方式
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        verticalType: VerticalType = VerticalType.Center;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否横向溢出
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("boolean")
        horizontalOverflow :boolean = false;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否竖向溢出
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("boolean")
        verticalOverflow :boolean = false;

        //计算数组
        private indexarr = [];
        private remainarrx = [];
        
        /**
         * @private
         */
        updateData(_font: gd3d.framework.font)
        {
            this.dirtyData = false;

            var rate = this._fontsize / _font.lineHeight;
            var m = this.transform.getWorldMatrix();
            var m11 = m.rawData[0];
            var m12 = m.rawData[2];
            var m21 = m.rawData[1];
            var m22 = m.rawData[3];

            var bx = this.data_begin.x ;
            var by = this.data_begin.y ;

            //计算出排列数据
            var txadd = 0;
            var tyadd = 0;
            this.indexarr = [];
            this.remainarrx = [];
            var remainy = 0;
            tyadd += this._fontsize * this.linespace;
            let contrast_w = this.horizontalOverflow ? Number.MAX_VALUE: this.transform.width; 
            let contrast_h = this.verticalOverflow ? Number.MAX_VALUE: this.transform.height; 
            for (var i = 0; i < this._text.length; i++)
            {
                let c = this._text.charAt(i);
                let cinfo = _font.cmap[c];
                if (cinfo == undefined)
                {
                    continue;
                }
                if (txadd + cinfo.xAddvance * rate > contrast_w)
                {
                    if (tyadd + this._fontsize * this.linespace > contrast_h)
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

            //清理缓存
            this.initdater();
            for (var arri = 0; arri < this.indexarr.length; arri++)
            {
                //一行
                xadd = 0;
                if (this.horizontalType == HorizontalType.Center)
                {
                    xadd += this.remainarrx[arri] / 2;
                }
                else if (this.horizontalType == HorizontalType.Right)
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

        private datar: number[] = [];

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 填充颜色
         * @version egret-gd3d 1.0
         */
        @reflect.Field("color")
        @reflect.UIStyle("color")
        color: math.color = new math.color(1, 1, 1, 1);

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 描边颜色
         * @version egret-gd3d 1.0
         */
        @reflect.Field("color")
        @reflect.UIStyle("color")
        color2: math.color = new math.color(0, 0, 0.5, 0.5);
        
       /**
         * @private
         * ui默认材质
         */
        _uimat: material;
        private get uimat(){
            if (this.font  && this.font.texture ){
                let rectPostfix = this.transform.parentIsMask? `_(${this.transform.insId})`: ""; //when parentIsMask,can't multiplexing material
                let matName = this.font.texture.getName()+"_fontmask" + rectPostfix;
                let canvas = this.transform.canvas;
                if(!canvas.assetmgr) return;
                let mat = this._uimat;
                if(!mat || mat.getName() != matName){
                    if(mat) mat.unuse(); 
                    mat = canvas.assetmgr.getAssetByName(matName) as gd3d.framework.material;
                    if(mat) mat.use();
                }
                if(mat == null){
                    mat = new material(matName);
                    mat.setShader(canvas.assetmgr.getShader("shader/defmaskfont"));
                    mat.use();
                }
                mat.setFloat("MaskState", this.transform.parentIsMask? 1 : 0);
                this._uimat = mat;
            }
            return this._uimat;
        }


        private dirtyData: boolean = true;

        /**
         * @private
         */
        render(canvas: canvas)
        {
            if(this._font == null ){
                let temp = canvas.assetmgr.mapNamed[this._fontName];
                if(temp != null){
                    let tfont = canvas.assetmgr.getAssetByName(this._fontName) as gd3d.framework.font;
                    if(tfont){
                        this.font = tfont;
                        this.needRefreshFont = true;
                    }
                }
            }

            if (this._font != null)
            {
                if (this.dirtyData == true)
                {
                    this.updateData(this._font);
                    this.dirtyData = false;
                }

                let mat = this.uimat;
                if(!mat) return;

                var img;
                if (this._font != null)
                {
                    img = this._font.texture;
                }

                if (img != null)
                {
                    if(this.needRefreshFont){
                        mat.setTexture("_MainTex", img);
                        this.needRefreshFont = false;
                    }

                    if(this.transform.parentIsMask){
                        if(this._cacheMaskV4 == null) this._cacheMaskV4 = new math.vector4();
                        let rect = this.transform.maskRect;
                        if(this._cacheMaskV4.x != rect.x || this._cacheMaskV4.y != rect.y || this._cacheMaskV4.w != rect.w || this._cacheMaskV4.z != rect.h){
                            this._cacheMaskV4.x = rect.x; this._cacheMaskV4.y = rect.y;this._cacheMaskV4.z = rect.w;this._cacheMaskV4.w = rect.h;
                            mat.setVector4("_maskRect",this._cacheMaskV4);
                        }
                    }

                    if (this.datar.length != 0)
                        canvas.pushRawData(mat, this.datar);
                }
            }
        }

        private _cacheMaskV4:math.vector4;

        /**
         * @private
         */
        updateTran()
        {
            var m = this.transform.getWorldMatrix();

            var l = -this.transform.pivot.x * this.transform.width;
            var t = -this.transform.pivot.y * this.transform.height;
            this.data_begin.x = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
            this.data_begin.y = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
            //只把左上角算出来
            this.dirtyData = true;
        }

        /**
         * @private
         */
        start()
        {

        }

        /**
         * @private
         */
        update(delta: number)
        {

        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version egret-gd3d 1.0
         */
        transform: transform2D;

        /**
         * @private
         */
        remove()
        {
            if(this._font)  this._font.unuse(true);
            if(this._uimat) this._uimat.unuse(true);
            this.indexarr.length = 0;
            this.remainarrx.length = 0;
            this.datar.length = 0;
            this.transform = null;
            this._cacheMaskV4 = null;
        }
        
        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {

        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 横向显示方式
     * @version egret-gd3d 1.0
     */
    export enum HorizontalType
    {
        Center,
        Left,
        Right
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 纵向显示方式
     * @version egret-gd3d 1.0
     */
    export enum VerticalType
    {
        Center,
        Top,
        Boom
    }
}