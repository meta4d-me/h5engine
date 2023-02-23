﻿/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本组件
     * @version m4m 1.0
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class label implements IRectRenderer {

        private static readonly defUIShader = `shader/defuifont`;
        private static readonly defMaskUIShader = `shader/defmaskfont`;
        private static readonly defImgUIShader = `shader/defui`;
        private static readonly defImgMaskUIShader = `shader/defmaskui`;
        private static readonly helpOptObj: { i: boolean, b: boolean, u: boolean, color: math.color, img: string } = {} as any;
        private static readonly helpColor: math.color = new math.color();

        /** 尝试 动态扩展 字体信息 函数接口 */
        static onTryExpandTexts: (str: string) => void;

        static readonly ClassName: string = "label";
        /**字段 用于快速判断实例是否是label */
        readonly isLabel = true;

        /** 当需渲染字符被 加入排列时 的回调*/
        public onAddRendererText: (x: number, y: number) => void;

        /** 有图片字符需要渲染 */
        private _hasImageChar: boolean = false;

        private _text: string = "";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文字内容
         * @version m4m 1.0
         */
        @m4m.reflect.Field("string")
        get text(): string {
            return this._text;
        }
        set text(text: string) {
            text = text == null ? "" : text;
            let hasChange = text != this._text;
            this._text = text;
            //设置缓存长度
            // this.initdater(this._text.length);
            this._dirtyData = true;
            this._drityRich = hasChange;
        }

        private initdater(textLen: number, datar: number[]) {
            let size = 6 * 13;
            let cachelen = size * textLen;
            //少了补充
            while (datar.length < cachelen) {   // {pos,color1,uv,color2}
                datar.push(
                    0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
                    0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                );
            }
            //多了弹出
            while (datar.length > cachelen) {
                // datar.pop();
                datar.splice(datar.length - size, size);
            }
        }

        private _font: font;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体
         * @version m4m 1.0
         */
        get font() {
            return this._font;
        }
        set font(font: font) {
            if (font == this._font) return;

            this.needRefreshFont = true;
            if (this._font) {
                this._font.unuse();
            }
            this._font = font;
            if (font) {
                this._font.use();
                this._fontName = this._font.getName();
            } else {
                this._fontName = "";
            }
        }
        private needRefreshFont = false;
        private needRefreshAtlas = false;

        @m4m.reflect.Field("string")
        private _fontName = "defFont.font.json";

        private _fontsize: number = 14;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体大小
         * @version m4m 1.0
         */
        @m4m.reflect.Field("number")
        get fontsize() {
            return this._fontsize;
        }
        set fontsize(size: number) {
            if (this._fontsize == size) return;
            this._fontsize = size;
            this._dirtyData = this._drityRich = true;
        }

        private _linespace = 1;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 行高
         * @version m4m 1.0
         */
        @m4m.reflect.Field("number")
        get linespace() {
            return this._linespace;//fontsize的倍数
        }
        set linespace(val: number) {
            if (this._linespace == val) return;
            this._linespace = val;
            this._dirtyData = this._drityRich = true;
        }

        private _horizontalType: HorizontalType = HorizontalType.Left;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平排列方式
         * @version m4m 1.0
         */
        @m4m.reflect.Field("number")
        get horizontalType() {
            return this._horizontalType;
        }
        set horizontalType(val: number) {
            if (this._horizontalType == val) return;
            this._horizontalType = val;
            this._dirtyData = this._drityRich = true;
        }

        private _verticalType: VerticalType = VerticalType.Center;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直排列方式
         * @version m4m 1.0
         */
        @m4m.reflect.Field("number")
        get verticalType() {
            return this._verticalType;
        }
        set verticalType(val: number) {
            if (this._verticalType == val) return;
            this._verticalType = val;
            this._dirtyData = this._drityRich = true;
        }

        private _horizontalOverflow: boolean = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否横向溢出
         * @version m4m 1.0
         */
        @m4m.reflect.Field("boolean")
        get horizontalOverflow() {
            return this._horizontalOverflow;
        }
        set horizontalOverflow(val: boolean) {
            if (this._horizontalOverflow == val) return;
            this._horizontalOverflow = val;
            this._dirtyData = this._drityRich = true;
        }


        private _verticalOverflow: boolean = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否竖向溢出
         * @version m4m 1.0
         */
        @m4m.reflect.Field("boolean")
        get verticalOverflow() {
            return this._verticalOverflow;
        }
        set verticalOverflow(val: boolean) {
            if (this._verticalOverflow == val) return;
            this._verticalOverflow = val;
            this._dirtyData = this._drityRich = true;
        }

        private lastStr: string = "";
        /** 检查文字,是否需要 动态添加 */
        private chackText(str: string) {
            let _font = this.font;
            if (!_font || !str || str == this.lastStr) return;
            let missingStr: string = "";
            for (var i = 0, len = this._text.length; i < len; i++) {
                let c = this._text.charAt(i);
                if (_font.cmap[c]) continue;
                missingStr += c;
            }

            if (label.onTryExpandTexts) label.onTryExpandTexts(missingStr);

            this.lastStr = str;
        }

        /**
         * @private
         */
        updateData(_font: m4m.framework.font) {
            if (label.onTryExpandTexts) { this.chackText(this._text); } //检查 依赖文本(辅助 自动填充字体)
            //set data
            let b = this._defTextBlocks[0];
            b.text = this._text;
            this.setDataByBlock(_font, this._defTextBlocks);
        }

        // _updateData(_font: m4m.framework.font)
        // {
        //     if (label.onTryExpandTexts) { this.chackText(this._text); } //检查 依赖文本(辅助 自动填充字体)

        //     // this.dirtyData = false;

        //     //字符的 label尺寸 与 像素尺寸 的比值。
        //     let rate = this._fontsize / _font.pointSize;
        //     //矩阵信息
        //     let m = this.transform.getWorldMatrix();
        //     let m11 = m.rawData[0];
        //     let m12 = m.rawData[2];
        //     let m21 = m.rawData[1];
        //     let m22 = m.rawData[3];

        //     //顶点开始位置
        //     let bx = this.data_begin.x;
        //     let by = this.data_begin.y;

        //     //计算出排列数据
        //     let txadd = 0;                                  //字符x偏移量
        //     let tyadd = 0;                                  //字符y偏移量
        //     let lineEndIndexs: number[] = [];              //每行结束位置的索引列表
        //     let lineWidths: number[] = [];                 //每行字符宽度之和列表
        //     let contrast_w = this.horizontalOverflow ? Number.MAX_VALUE : this.transform.width;     //最大宽度限制
        //     let contrast_h = this.verticalOverflow ? Number.MAX_VALUE : this.transform.height;      //最大高度限制
        //     let lineHeight = this._fontsize * this.linespace;                                       //一行的高度
        //     let renderTextCount = 0;
        //     tyadd += lineHeight;
        //     let i = 0;
        //     for (let len = this._text.length; i < len; i++)
        //     {
        //         let c = this._text.charAt(i);
        //         let isNewline = c == `\n`; //换行符
        //         let cinfo = _font.cmap[c];
        //         if (!isNewline && cinfo == undefined) { continue; }
        //         let cWidth = cinfo ? cinfo.xAddvance * rate : 0;                 //字符的宽度

        //         //需要换行了
        //         if (isNewline || txadd + cWidth > contrast_w)
        //         {
        //             if (tyadd + lineHeight > contrast_h) { break; }             //高度超限制了

        //             lineEndIndexs.push(i);
        //             lineWidths.push(this.transform.width - txadd);
        //             txadd = 0;                                                  //文本x偏移置0
        //             tyadd += lineHeight;                                        //文本y偏移增加
        //         }

        //         if (cinfo)
        //         {
        //             txadd += cWidth;                                     //文本x偏移增加
        //             renderTextCount++;
        //         }
        //     }
        //     //最后的字符存入
        //     lineEndIndexs.push(i);
        //     lineWidths.push(this.transform.width - txadd);

        //     //文本渲染所占高度 和 transfrom节点高度的相差值
        //     let diffY = this.transform.height - tyadd;

        //     //相对transfrom X坐标的偏移
        //     let xadd = 0;
        //     //相对transfrom Y坐标的偏移
        //     let yadd = 0;
        //     if (this.verticalType == VerticalType.Center)               //垂直居中布局
        //     {
        //         yadd += diffY / 2;
        //     }
        //     else if (this.verticalType == VerticalType.Boom)            //垂直靠下布局
        //     {
        //         yadd += diffY;
        //     }

        //     //清理缓存
        //     this.initdater(renderTextCount, this.datar);
        //     i = 0;
        //     let rI = 0;
        //     for (let lineI = 0; lineI < lineEndIndexs.length; lineI++)
        //     {
        //         //一行
        //         xadd = 0;
        //         if (this.horizontalType == HorizontalType.Center)       //水平居中布局
        //         {
        //             xadd += lineWidths[lineI] / 2;
        //         }
        //         else if (this.horizontalType == HorizontalType.Right)   //水平靠右布局
        //         {
        //             xadd += lineWidths[lineI];
        //         }

        //         //遍历一行字符
        //         for (; i < lineEndIndexs[lineI]; i++)
        //         {
        //             let c = this._text.charAt(i);
        //             let cinfo = _font.cmap[c];
        //             if (cinfo == undefined) { continue; }

        //             var cx = xadd + cinfo.xOffset * rate;
        //             var cy = yadd - cinfo.yOffset * rate + _font.baseline * rate;

        //             var ch = rate * cinfo.ySize;
        //             var cw = rate * cinfo.xSize;
        //             xadd += cinfo.xAddvance * rate;
        //             var x1 = cx + cw;
        //             var y1 = cy;
        //             var x2 = cx;
        //             var y2 = cy + ch;
        //             var x3 = cx + cw;
        //             var y3 = cy + ch;

        //             //pos
        //             let _x0 = this.datar[rI * 6 * 13 + 0] = bx + cx * m11 + cy * m12;//x
        //             let _y0 = this.datar[rI * 6 * 13 + 1] = by + cx * m21 + cy * m22;//y
        //             let _x1 = this.datar[rI * 6 * 13 + 13 * 1 + 0] = bx + x1 * m11 + y1 * m12;//x
        //             let _y1 = this.datar[rI * 6 * 13 + 13 * 1 + 1] = by + x1 * m21 + y1 * m22;//y
        //             let _x2 = this.datar[rI * 6 * 13 + 13 * 2 + 0] = bx + x2 * m11 + y2 * m12;//x
        //             let _y2 = this.datar[rI * 6 * 13 + 13 * 2 + 1] = by + x2 * m21 + y2 * m22;//y
        //             this.datar[rI * 6 * 13 + 13 * 3 + 0] = bx + x2 * m11 + y2 * m12;//x
        //             this.datar[rI * 6 * 13 + 13 * 3 + 1] = by + x2 * m21 + y2 * m22;//y
        //             this.datar[rI * 6 * 13 + 13 * 4 + 0] = bx + x1 * m11 + y1 * m12;//x
        //             this.datar[rI * 6 * 13 + 13 * 4 + 1] = by + x1 * m21 + y1 * m22;//y
        //             let _x3 = this.datar[rI * 6 * 13 + 13 * 5 + 0] = bx + x3 * m11 + y3 * m12;//x
        //             let _y3 = this.datar[rI * 6 * 13 + 13 * 5 + 1] = by + x3 * m21 + y3 * m22;//y


        //             //uv
        //             var u0 = cinfo.x;
        //             var v0 = cinfo.y;
        //             var u1 = cinfo.x + cinfo.w;
        //             var v1 = cinfo.y;
        //             var u2 = cinfo.x;
        //             var v2 = cinfo.y + cinfo.h;
        //             var u3 = cinfo.x + cinfo.w;
        //             var v3 = cinfo.y + cinfo.h;

        //             this.datar[rI * 6 * 13 + 7] = u0;
        //             this.datar[rI * 6 * 13 + 8] = v0;
        //             this.datar[rI * 6 * 13 + 13 * 1 + 7] = u1;
        //             this.datar[rI * 6 * 13 + 13 * 1 + 8] = v1;
        //             this.datar[rI * 6 * 13 + 13 * 2 + 7] = u2;
        //             this.datar[rI * 6 * 13 + 13 * 2 + 8] = v2;
        //             this.datar[rI * 6 * 13 + 13 * 3 + 7] = u2;
        //             this.datar[rI * 6 * 13 + 13 * 3 + 8] = v2;
        //             this.datar[rI * 6 * 13 + 13 * 4 + 7] = u1;
        //             this.datar[rI * 6 * 13 + 13 * 4 + 8] = v1;
        //             this.datar[rI * 6 * 13 + 13 * 5 + 7] = u3;
        //             this.datar[rI * 6 * 13 + 13 * 5 + 8] = v3;

        //             //主color
        //             for (var j = 0; j < 6; j++)
        //             {
        //                 this.datar[rI * 6 * 13 + 13 * j + 3] = this.color.r;
        //                 this.datar[rI * 6 * 13 + 13 * j + 4] = this.color.g;
        //                 this.datar[rI * 6 * 13 + 13 * j + 5] = this.color.b;
        //                 this.datar[rI * 6 * 13 + 13 * j + 6] = this.color.a;

        //                 this.datar[rI * 6 * 13 + 13 * j + 9] = this.color2.r;
        //                 this.datar[rI * 6 * 13 + 13 * j + 10] = this.color2.g;
        //                 this.datar[rI * 6 * 13 + 13 * j + 11] = this.color2.b;
        //                 this.datar[rI * 6 * 13 + 13 * j + 12] = this.color2.a;
        //             }

        //             //drawRect 
        //             this.min_x = Math.min(_x0, _x1, _x2, _x3, this.min_x);
        //             this.min_y = Math.min(_y0, _y1, _y2, _y3, this.min_y);
        //             this.max_x = Math.max(_x0, _x1, _x2, _x3, this.max_x);
        //             this.max_y = Math.max(_y0, _y1, _y2, _y3, this.max_y);

        //             //有效渲染字符 索引递增
        //             rI++;
        //         }
        //         yadd += lineHeight;
        //     }

        //     //debug log
        //     // console.log(`lable text: 实际填充数 ：${rI} , 容器尺寸 ：${renderTextCount} \r text:${this._text}`);

        //     this.calcDrawRect();
        // }

        /** 更新数据 富文本 模式 */
        private updateDataRich(_font: m4m.framework.font) {
            //检查 依赖文本(辅助 自动填充字体)
            if (label.onTryExpandTexts) { this.chackText(this._text); }

            //set data
            this.setDataByBlock(_font, this._richTextBlocks);
        }

        /**
         * 通过 block 设置数据
         * @param _font 
         * @param blocks 
         */
        private setDataByBlock(_font: font, blocks: IBlock[]) {
            //字符的 label尺寸 与 像素尺寸 的比值。
            let fontSize = this._fontsize;
            let rate = fontSize / _font.pointSize;
            let rBaseLine = _font.baseline * rate;
            let imgSize = fontSize * 0.8;
            let imgHalfGap = (fontSize - imgSize) / 2;
            let italicMoveX = fontSize * 0.3;
            //矩阵信息
            let m = this.transform.getWorldMatrix();
            let m11 = m.rawData[0];
            let m12 = m.rawData[2];
            let m21 = m.rawData[1];
            let m22 = m.rawData[3];

            //顶点开始位置
            let bx = this.data_begin.x;
            let by = this.data_begin.y;
            let atlas = this._imageTextAtlas;

            //计算出排列数据
            let txadd = 0;                                  //字符x偏移量
            let tyadd = 0;                                  //字符y偏移量
            let lineEndIndexs: number[] = [];              //每行结束位置的索引列表
            let lineWidths: number[] = [];                 //每行字符宽度之和列表
            let contrast_w = this.horizontalOverflow ? Number.MAX_VALUE : this.transform.width;     //最大宽度限制
            let contrast_h = this.verticalOverflow ? Number.MAX_VALUE : this.transform.height;      //最大高度限制
            let lineHeight = fontSize * this.linespace;                                       //一行的高度
            tyadd += lineHeight;
            let rI = 0;
            let imgCharCount = 0;

            let fullText = "";
            //筛选能渲染的数据,处理分行
            for (let i = 0, len = blocks.length; i < len; i++) {
                let block = blocks[i];
                let text = block.text;
                let opts = block.opts;
                if (text == null || text.length < 1) continue;

                //是否是 字符图
                let hasImg = false;
                let imgOpt = this.getImgOpt(opts);
                if (atlas && imgOpt) {
                    //图集中是否能找到 该sprite
                    let sp = atlas.sprites[imgOpt.value];
                    hasImg = sp != null;
                }

                let forceBreak = false;
                //遍历字符串
                for (let j = 0, len1 = text.length; j < len1; j++) {
                    let hasC = false;
                    let cWidth = 0;
                    let c = "";
                    let isNewline = false;
                    if (!hasImg) {
                        c = text.charAt(j);
                        isNewline = c == `\n`; //换行符
                        let cinfo = _font.cmap[c];
                        if (!isNewline && !cinfo) { continue; }
                        if (cinfo) {
                            cWidth = cinfo.xAddvance * rate;                            //字符的宽度
                            hasC = true;
                        }
                    } else {
                        hasC = true;
                        cWidth = fontSize;
                        c = "*";
                    }

                    //需要换行了
                    if (isNewline || txadd + cWidth > contrast_w) {
                        if (tyadd + lineHeight > contrast_h) { forceBreak = true; break; }             //高度超限制了

                        lineEndIndexs.push(rI);
                        lineWidths.push(this.transform.width - txadd);
                        txadd = 0;                                                  //文本x偏移置0
                        tyadd += lineHeight;                                        //文本y偏移增加
                    }

                    if (hasC) {
                        txadd += cWidth;                                            //文本x偏移增加
                        fullText += c;
                        rI++;
                        if (hasImg) { imgCharCount++; }
                    }

                    if (hasImg) { break; }                                          //是图片跳出当前 block
                }

                if (forceBreak) { break; }          //强制退出
            }
            //最后一行结尾的字符存入
            lineEndIndexs.push(rI);
            lineWidths.push(this.transform.width - txadd);

            //文本渲染所占高度 和 transfrom节点高度的相差值
            let diffY = this.transform.height - tyadd;

            let yOffset = 0;
            //垂直居中布局
            if (this.verticalType == VerticalType.Center) { yOffset += diffY / 2; }
            //垂直靠下布局
            else if (this.verticalType == VerticalType.Boom) { yOffset += diffY; }

            //相对transfrom X坐标的偏移
            let xadd = 0;
            //相对transfrom Y坐标的偏移
            let yadd = yOffset;

            //准备容器
            this.initdater(fullText.length - imgCharCount, this.datar);
            if (imgCharCount) {
                this.initdater(imgCharCount, this.imgDatar);    //字符图 数据容器
            }
            //
            this._hasImageChar = false;
            rI = 0;
            let textI = 0;
            let imgI = 0;
            let lineI = lineEndIndexs.shift();
            let lineWidth = lineWidths.shift();
            let forceBreak = false;
            let toNewLine = true;
            let lineCount = 0;
            //填充顶点数据
            for (let i = 0, len = blocks.length; i < len; i++) {
                let block = blocks[i];
                let text = block.text;
                let opts = block.opts;
                let optObj = label.helpOptObj;
                this.getOptObj(opts, optObj);
                //是图片字符
                //color 选项
                let color = optObj.color != null ? optObj.color : this.color;
                let color2: math.color;
                if (optObj.color) {
                    color2 = label.helpColor;
                    math.colorClone(optObj.color, color2);
                    color2.a *= 0.5;
                } else {
                    color2 = this.color2;
                }
                //粗体
                //斜体
                let moveX = optObj.i ? italicMoveX : 0;
                //下划线

                //遍历字符串
                for (let j = 0, len1 = text.length; j < len1; j++) {
                    if (lineI == null) { forceBreak = true; break; }

                    if (rI >= lineI) {
                        lineI = lineEndIndexs.shift();
                        lineWidth = lineWidths.shift();
                        if (lineI == null || lineWidth == null) { forceBreak = true; break; }
                        toNewLine = true;
                    }

                    if (toNewLine) {
                        //换行了
                        xadd = 0;
                        //水平居中布局
                        if (this.horizontalType == HorizontalType.Center) { xadd += lineWidth / 2; }
                        //水平靠右布局
                        else if (this.horizontalType == HorizontalType.Right) { xadd += lineWidth; }
                        //y 偏移值
                        yadd = yOffset + lineHeight * lineCount;
                        //行数增加
                        lineCount++;
                        toNewLine = false;
                    }

                    let hasImg = fullText[rI] == "*" && optObj.img;
                    let _I = 0;
                    let datar: number[];
                    let c: string;
                    if (!hasImg) {
                        _I = textI;
                        c = text.charAt(j);
                        let cinfo = _font.cmap[c];
                        if (cinfo == undefined) { continue; }
                        //填充字符数据
                        datar = this.datar;
                        //pos
                        var ch = rate * cinfo.ySize;
                        var cw = rate * cinfo.xSize;
                        var x0 = xadd + cinfo.xOffset * rate;
                        var y0 = yadd - cinfo.yOffset * rate + rBaseLine;

                        //uv
                        var u0 = cinfo.x;
                        var v0 = cinfo.y;
                        var u1 = cinfo.x + cinfo.w;
                        var v1 = cinfo.y;
                        var u2 = cinfo.x;
                        var v2 = cinfo.y + cinfo.h;
                        var u3 = cinfo.x + cinfo.w;
                        var v3 = cinfo.y + cinfo.h;

                        //主color
                        for (let k = 0; k < 6; k++) {
                            datar[_I * 6 * 13 + 13 * k + 3] = color.r;
                            datar[_I * 6 * 13 + 13 * k + 4] = color.g;
                            datar[_I * 6 * 13 + 13 * k + 5] = color.b;
                            datar[_I * 6 * 13 + 13 * k + 6] = color.a;

                            datar[_I * 6 * 13 + 13 * k + 9] = color2.r;
                            datar[_I * 6 * 13 + 13 * k + 10] = color2.g;
                            datar[_I * 6 * 13 + 13 * k + 11] = color2.b;
                            datar[_I * 6 * 13 + 13 * k + 12] = color2.a;
                        }

                        //x 偏移增加
                        xadd += cinfo.xAddvance * rate;
                    } else {
                        this._hasImageChar = true;
                        c = fullText[rI];
                        _I = imgI;
                        datar = this.imgDatar;
                        //填充字符图数据
                        let sp = atlas.sprites[optObj.img];

                        //pos
                        var ch = imgSize;
                        var cw = imgSize;
                        var x0 = xadd + imgHalfGap;
                        var y0 = yadd + imgHalfGap;

                        //uv
                        let urange = sp.urange;
                        let vrange = sp.vrange;

                        var u0 = urange.x;
                        var v0 = vrange.x;
                        var u1 = urange.y;
                        var v1 = vrange.x;
                        var u2 = urange.x;
                        var v2 = vrange.y;
                        var u3 = urange.y;
                        var v3 = vrange.y;

                        //主color
                        for (let k = 0; k < 6; k++) {
                            datar[_I * 6 * 13 + 13 * k + 3] = 1;
                            datar[_I * 6 * 13 + 13 * k + 4] = 1;
                            datar[_I * 6 * 13 + 13 * k + 5] = 1;
                            datar[_I * 6 * 13 + 13 * k + 6] = 1;
                        }

                        xadd += fontSize;
                    }

                    //填充数据
                    //pos
                    var x1 = x0 + cw;
                    var y1 = y0;
                    var x2 = x0;
                    var y2 = y0 + ch;
                    var x3 = x0 + cw;
                    var y3 = y0 + ch;

                    let _x0 = datar[_I * 6 * 13 + 0] = bx + (x0 + moveX) * m11 + y0 * m12;//x0
                    let _y0 = datar[_I * 6 * 13 + 1] = by + x0 * m21 + y0 * m22;//y0
                    let _x1 = datar[_I * 6 * 13 + 13 * 1 + 0] = bx + (x1 + moveX) * m11 + y1 * m12;//x1
                    let _y1 = datar[_I * 6 * 13 + 13 * 1 + 1] = by + x1 * m21 + y1 * m22;//y1
                    let _x2 = datar[_I * 6 * 13 + 13 * 2 + 0] = bx + x2 * m11 + y2 * m12;//x2
                    let _y2 = datar[_I * 6 * 13 + 13 * 2 + 1] = by + x2 * m21 + y2 * m22;//y2
                    datar[_I * 6 * 13 + 13 * 3 + 0] = _x2;//x
                    datar[_I * 6 * 13 + 13 * 3 + 1] = _y2;//y
                    datar[_I * 6 * 13 + 13 * 4 + 0] = _x1;//x
                    datar[_I * 6 * 13 + 13 * 4 + 1] = _y1;//y
                    let _x3 = datar[_I * 6 * 13 + 13 * 5 + 0] = bx + x3 * m11 + y3 * m12;//x3
                    let _y3 = datar[_I * 6 * 13 + 13 * 5 + 1] = by + x3 * m21 + y3 * m22;//y3

                    //uv
                    datar[_I * 6 * 13 + 7] = u0;
                    datar[_I * 6 * 13 + 8] = v0;
                    datar[_I * 6 * 13 + 13 * 1 + 7] = u1;
                    datar[_I * 6 * 13 + 13 * 1 + 8] = v1;
                    datar[_I * 6 * 13 + 13 * 2 + 7] = u2;
                    datar[_I * 6 * 13 + 13 * 2 + 8] = v2;
                    datar[_I * 6 * 13 + 13 * 3 + 7] = u2;
                    datar[_I * 6 * 13 + 13 * 3 + 8] = v2;
                    datar[_I * 6 * 13 + 13 * 4 + 7] = u1;
                    datar[_I * 6 * 13 + 13 * 4 + 8] = v1;
                    datar[_I * 6 * 13 + 13 * 5 + 7] = u3;
                    datar[_I * 6 * 13 + 13 * 5 + 8] = v3;

                    //drawRect 
                    this.min_x = Math.min(_x0, _x1, _x2, _x3, this.min_x);
                    this.min_y = Math.min(_y0, _y1, _y2, _y3, this.min_y);
                    this.max_x = Math.max(_x0, _x1, _x2, _x3, this.max_x);
                    this.max_y = Math.max(_y0, _y1, _y2, _y3, this.max_y);

                    //字符加入渲染队列
                    if (this.onAddRendererText) this.onAddRendererText(x3, y3);

                    //有效渲染字符 索引递增
                    rI++;
                    if (!hasImg) {
                        textI++;
                    } else {
                        imgI++;
                        break;  //是图片字符 跳出该block
                    }
                }

                if (forceBreak) break;
            }

            //debug log
            // console.log(`lable text: 实际填充数 ：${rI} , 容器尺寸 ：${fullText.length} \r text:${fullText}`);

            this.calcDrawRect();
        }

        /**获取 图片字符 选项 */
        private getImgOpt(opts: IRichTextOpt[]) {
            if (opts == null) return;
            for (let i = 0, len = opts.length; i < len; i++) {
                let val = opts[i];
                if (val && val.getType() == RichOptType.Image) return val;
            }
        }

        /** 获取富文本选项 对象 */
        private getOptObj(opts: IRichTextOpt[], out: { i: boolean, b: boolean, u: boolean, color: math.color, img: string }) {
            out.i = false;
            out.b = false;
            out.u = false;
            if (out.color) {
                math.pool.delete_color(out.color);
                out.color = null;
            }
            out.img = "";
            if (!opts) return;
            opts.forEach((val) => {
                if (val) {
                    switch (val.getType()) {
                        case RichOptType.Italic: out.i = true; break;
                        case RichOptType.Color:
                            let c = val.value as math.color;
                            out.color = math.pool.new_color(c.r, c.g, c.b, c.a);
                            break;
                        case RichOptType.Image: out.img = val.value; break;
                        case RichOptType.Bold: out.b = true; break;
                        case RichOptType.Underline: out.u = true; break;
                    }
                }
            });

            return out;
        }

        private data_begin: math.vector2 = new math.vector2(0, 0);
        private _lastBegin: math.vector2 = new math.vector2(0, 0);
        /** 文本顶点数据 */
        private datar: number[] = [];
        /** 字符图 顶点数据 */
        private imgDatar: number[] = [];

        private _color: math.color = new math.color(1, 1, 1, 1);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 填充颜色
         * @version m4m 1.0
         */
        @reflect.Field("color")
        @reflect.UIStyle("color")
        get color() {
            return this._color;
        }
        set color(val: math.color) {
            if (this._color != val) {
                if (math.colorEqual(this._color, val)) return;  //数值相同
                math.colorClone(val, this._color);
            }
            this._dirtyData = this._drityRich = true;
        }

        private _color2: math.color = new math.color(0, 0, 0.5, 0.5);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 描边颜色
         * @version m4m 1.0
         */
        @reflect.Field("color")
        @reflect.UIStyle("color")
        get color2() {
            return this._color2;
        }
        set color2(val: math.color) {
            if (this._color2 != val) {
                if (math.colorEqual(this._color2, val)) return;  //数值相同
                math.colorClone(val, this._color2);
            }
            this._dirtyData = this._drityRich = true;
        }

        private _outlineWidth = 0.75;
        /**
         * 描边宽度
         */
        @reflect.Field("number")
        get outlineWidth() {
            return this._outlineWidth;
        }
        set outlineWidth(val: number) {
            if (this._outlineWidth == val) return;
            this._outlineWidth = val;
            this._dirtyData = this._drityRich = true;
        }

        private _richText: boolean = false;
        /**
         * 富文本模式 , 通过特定标签使用。
         * 
         * 文字颜色             <color=#ffffffff>文本</color>       (已经支持);
         * 文字斜体             \<i>文本\</i>                       (已经支持);
         * 图片字符（表情）     [imgName]                           (已经支持);
         * 文字加粗             \<b>文本\</b>                       (支持中);
         * 文字加下划线         \<u>文本\</u>                       (支持中);
         */
        @reflect.Field("boolean")
        public get richText() { return this._richText; }
        public set richText(val: boolean) { this._richText = val; }


        @m4m.reflect.Field("string")
        private _imageTextAtlasName = ``;

        private _imageTextAtlas: atlas;
        /**
         * 图像文字图集
         * (例如 表情)
         */
        public get imageTextAtlas() { return this._imageTextAtlas; }
        public set imageTextAtlas(val: atlas) {
            if (val == this._imageTextAtlas) return;
            this._drityRich = true;
            this._imageTextAtlas = val;
            if (this._imageTextAtlas) {
                this._imageTextAtlasName = this._imageTextAtlas.getName();
            }
            this.needRefreshAtlas = true;
        }

        /** 富文本 块列表 */
        private _richTextBlocks: IBlock[] = [];
        /** 纯文本默认 块列表 */
        private _defTextBlocks: IBlock[] = [{ text: "", opts: null }];

        /**富文本 脏标记  */
        private _drityRich: boolean = true;

        private _CustomShaderName = ``;//自定义UIshader
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置rander Shader名字
         * @version m4m 1.0
         */
        setShaderByName(shaderName: string) {
            this._CustomShaderName = shaderName;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取rander 的材质
         * @version m4m 1.0
         */
        getMaterial() {
            if (!this._uimat) {
                return this.uimat;
            }
            return this._uimat;
        }

        private _darwRect: m4m.math.rect;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取渲染绘制矩形边界
         * @version m4m 1.0
         */
        getDrawBounds() {
            if (!this._darwRect) {
                this._darwRect = new math.rect();
                this.calcDrawRect();
            }
            return this._darwRect;
        }

        /** 获取材质 通过 shaderName*/
        private getMatByShader(oldMat: material, _tex: texture, cShaderName: string, defMaskSh: string, defSh: string, newMatCB?: Function) {
            let transform = this.transform;
            let assetmgr = sceneMgr.app.getAssetMgr();
            let pMask = transform.parentIsMask;
            let mat = oldMat;
            let rectTag = "";
            let uiTag = "_ui";
            if (pMask) {
                //when parentIsMask,can't multiplexing material , can be multiplexing when parent equal
                let rId = transform.maskRectId;
                rectTag = `mask(${rId})`;
            }
            let useShaderName = cShaderName ? cShaderName : pMask ? defMaskSh : defSh;
            let matName = useShaderName + _tex.getName() + uiTag + rectTag;
            if (!mat || mat.getName() != matName) {
                if (mat) mat.unuse();
                mat = assetmgr.getAssetByName(matName) as m4m.framework.material;
                if (mat) mat.use();
            }
            if (!mat) {
                mat = new material(matName);
                let sh = assetmgr.getShader(cShaderName);
                sh = sh ? sh : assetmgr.getShader(pMask ? defMaskSh : defSh);
                mat.setShader(sh);
                mat.use();
                if (newMatCB) newMatCB();
                // this.needRefreshFont = true;
            }

            return mat;
        }

        /**
          * @private
          * ui默认材质
          */
        private _uimat: material;
        private get uimat() {
            let assetmgr = sceneMgr.app.getAssetMgr();
            if (!assetmgr) return this._uimat;

            this.searchTexture();

            if (!this.font || !this.font.texture) return this._uimat;
            //获取材质
            this._uimat = this.getMatByShader(this._uimat, this.font.texture,
                this._CustomShaderName, label.defMaskUIShader, label.defUIShader, () => {
                    //材质资源对象 刷新了
                    this.needRefreshFont = true;
                });

            return this._uimat;
        }

        /**
         * 字符图材质
         */
        private _imgUIMat: material;
        private get imgUIMat() {
            let assetmgr = sceneMgr.app.getAssetMgr();
            if (!assetmgr) return this._imgUIMat;

            this.searchTextureAtlas();

            if (!this._imageTextAtlas || !this._imageTextAtlas.texture) return this._imgUIMat;
            this._imgUIMat = this.getMatByShader(this._imgUIMat, this._imageTextAtlas.texture,
                "", label.defImgMaskUIShader, label.defImgUIShader, () => {
                    //材质资源对象 刷新了
                    this.needRefreshAtlas = true;
                });

            return this._imgUIMat;
        }


        private _dirtyData: boolean = true;

        /**
         * @private
         */
        render(canvas: canvas) {
            let mat = this.uimat;
            if (!mat) return;

            if (!this._font) return;
            if (this._richText) {
                if (this._drityRich) {
                    //富文本模式
                    this.parseRichText(this.text);
                    this.updateDataRich(this._font);
                    this._drityRich = false;
                }
            } else if (this._dirtyData) {
                this.updateData(this._font);
                this._dirtyData = false;
            }

            let img;
            if (this._font) {
                img = this._font.texture;
            }

            if (img) {
                let forceRMask = false;
                if (this.needRefreshFont) {
                    mat.setTexture("_MainTex", img);
                    this.needRefreshFont = false;
                    forceRMask = true;
                }

                if (this.transform.parentIsMask) {
                    //mask uniform 上传
                    this.setMaskData(mat, forceRMask);
                } else {
                    mat.setFloat("_outlineWidth", this.outlineWidth);
                }

                if (this.datar.length != 0)
                    canvas.pushRawData(mat, this.datar);
            }

            if (!this._hasImageChar || !this._richText || !this.imgDatar || this.imgDatar.length < 1) return;
            //字符图绘制
            let imgMat = this.imgUIMat;
            if (!imgMat) return;

            let _img: texture;
            if (this._imageTextAtlas) { _img = this._imageTextAtlas.texture; }

            if (!_img) return;
            let forceRMask = false;
            if (this.needRefreshAtlas) {
                imgMat.setTexture("_MainTex", _img);
                this.needRefreshAtlas = false;
                forceRMask = true;
            }

            if (this.transform.parentIsMask) {
                //mask uniform 上传
                this.setMaskData(imgMat, forceRMask);
            }

            //提交 字符图顶点数据
            if (this.imgDatar.length > 0) {
                canvas.pushRawData(imgMat, this.imgDatar);
            }
        }

        private setMaskData(mat: material, needRMask: boolean) {
            //mask uniform 上传
            if (this._cacheMaskV4 == null) this._cacheMaskV4 = new math.vector4();
            let rect = this.transform.maskRect;
            if (this._cacheMaskV4.x != rect.x || this._cacheMaskV4.y != rect.y || this._cacheMaskV4.w != rect.w || this._cacheMaskV4.z != rect.h || needRMask) {
                this._cacheMaskV4.x = rect.x; this._cacheMaskV4.y = rect.y; this._cacheMaskV4.z = rect.w; this._cacheMaskV4.w = rect.h;
                mat.setVector4("_maskRect", this._cacheMaskV4);
            }
        }

        //资源管理器中寻找 指定的贴图资源
        private searchTexture() {
            //font  不存在，但有名字，在资源管理器中搜索
            if (!this._font && this._fontName) {
                //字体
                let assetmgr = sceneMgr.app.getAssetMgr();
                let resName = this._fontName;
                let abname = resName.replace(".font.json", ".assetbundle.json");
                let temp = assetmgr.getAssetByName(resName, abname);
                if (!temp) {
                    resName = `${this._fontName}.font.json`
                    temp = assetmgr.getAssetByName(resName, abname);
                }
                if (temp != null) {
                    let tfont = assetmgr.getAssetByName(resName, abname) as m4m.framework.font;
                    if (tfont) {
                        this.font = tfont;
                        this.needRefreshFont = true;
                    }
                }
            }


        }

        private searchTextureAtlas() {
            //字符图集
            if (!this._imageTextAtlas && this._imageTextAtlasName) {
                let assetmgr = sceneMgr.app.getAssetMgr();
                let atlasName = this._imageTextAtlasName;
                let abname = atlasName.replace(".atlas.json", ".assetbundle.json");
                let temp = assetmgr.getAssetByName(atlasName, abname) as atlas;
                if (temp) {
                    this.imageTextAtlas = temp;
                }
            }
        }

        private _cacheMaskV4: math.vector4;

        /**
         * @private
         */
        updateTran() {
            var m = this.transform.getWorldMatrix();

            var l = -this.transform.pivot.x * this.transform.width;
            var t = -this.transform.pivot.y * this.transform.height;
            let _b = this._lastBegin;
            let d_b = this.data_begin;
            d_b.x = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
            d_b.y = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
            //data_begin 有变化需要dirty
            if (!math.vec2Equal(_b, d_b, 0.00001)) {
                this._dirtyData = true;
                this._drityRich = true;
            }

            m4m.math.vec2Clone(d_b, _b);
        }

        private min_x: number = Number.MAX_VALUE;
        private max_x: number = Number.MAX_VALUE * -1;
        private min_y: number = Number.MAX_VALUE;
        private max_y: number = Number.MAX_VALUE * -1;
        /** 计算drawRect */
        private calcDrawRect() {
            if (!this._darwRect) return;
            //drawBounds (y 轴反向)
            let canvas = this.transform.canvas;
            if (!canvas) return;

            let minPos = poolv2();
            minPos.x = this.min_x;
            minPos.y = this.max_y;
            canvas.clipPosToCanvasPos(minPos, minPos);

            let maxPos = poolv2();
            maxPos.x = this.max_x;
            maxPos.y = this.min_y;
            canvas.clipPosToCanvasPos(maxPos, maxPos);

            this._darwRect.x = minPos.x;
            this._darwRect.y = minPos.y;
            this._darwRect.w = maxPos.x - minPos.x;
            this._darwRect.h = maxPos.y - minPos.y;

            this.min_x = this.min_y = Number.MAX_VALUE;
            this.max_x = this.max_y = Number.MAX_VALUE * -1;

            poolv2_del(minPos);
            poolv2_del(maxPos);
        }

        /**
         * 解析 富文本
         * @param text 
         */
        private parseRichText(text: string) {
            //Color <color=#ffffffff></color>   文字颜色
            //Bold <b>text</b>                  文字加粗
            //Underline <u>text</u>             文字加下划线
            //Italic <u>text</u>                文字斜体
            //Image [imgName]                   图片字符（表情）

            //遍历字符串
            let len = text.length;
            let xmlStart = false;
            let imgStart = false;
            let strStack: string[] = [];
            let optStack: IRichTextOpt[] = [];
            let blockDatas: { text: string, opts: IRichTextOpt[] }[] = this._richTextBlocks;
            blockDatas.length = 0;
            let atlas = this._imageTextAtlas;

            let genBlockFun = () => {
                let str = strStack.shift();
                //没有数据跳过
                if (!str || str.length < 1) return;
                let opts = optStack.length > 0 ? optStack.concat() : null;
                blockDatas.push({ text: str, opts: opts });
            };
            for (let i = 0; i < len; i++) {
                let char = text[i];

                if (char == "<") {
                    genBlockFun();
                    xmlStart = true;
                } else if (char == "[") {
                    genBlockFun();
                    imgStart = true;
                }

                if (strStack.length < 1) strStack.push("");
                strStack[strStack.length - 1] += char;

                if (char == ">" && xmlStart) {
                    xmlStart = false;
                    // let xmlStr = strStack.pop();
                    let xmlStr = strStack[strStack.length - 1];
                    let isValid = false;
                    //判断 标签是开始 还是结束
                    if (xmlStr[1] == "/") {
                        let endOpt = optStack[optStack.length - 1];
                        if (endOpt) {
                            //选项确认有效
                            switch (xmlStr) {
                                case "</color>": isValid = endOpt.getType() == RichOptType.Color; break;
                                case "</i>": isValid = endOpt.getType() == RichOptType.Italic; break;
                                case "</b>": isValid = endOpt.getType() == RichOptType.Bold; break;
                                case "</u>": isValid = endOpt.getType() == RichOptType.Underline; break;
                            }
                        }
                        if (isValid) { optStack.pop(); }//结束标记 弹栈
                    } else {
                        //判断 标签类型
                        switch (xmlStr) {
                            case "<i>": isValid = true; optStack.push(new richOptItalic()); break;
                            case "<b>": isValid = true; optStack.push(new richOptBold()); break;
                            case "<u>": isValid = true; optStack.push(new richOptUnderline()); break;
                            default:
                                if (xmlStr.indexOf("color") == -1) continue;
                                let _sIdx = xmlStr.indexOf("#");
                                if (_sIdx == -1) continue;
                                let colorVal = xmlStr.substring(_sIdx + 1, xmlStr.length - 1);
                                let vLen = colorVal.length;
                                if (vLen != 8 && vLen != 6) continue;
                                let r = Number(`0x${colorVal.substring(0, 2)}`);
                                let g = Number(`0x${colorVal.substring(2, 4)}`);
                                let b = Number(`0x${colorVal.substring(4, 6)}`);
                                let a = vLen == 6 ? this.color.a * 255 : Number(`0x${colorVal.substring(6, 8)}`);
                                if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) continue;
                                optStack.push(new richOptColor(new m4m.math.color(r / 255, g / 255, b / 255, a / 255)));
                                isValid = true;
                                break;
                        }
                    }

                    if (isValid) { strStack.pop(); }    //选项有效 弹栈
                } else if (char == "]" && imgStart) {
                    let str = strStack[strStack.length - 1];
                    let imgStr = str.substring(1, str.length - 1);
                    let isValid = atlas && atlas.sprites[imgStr];//图集中是否能找到 该sprite
                    let imgOpt = new richOptImage(imgStr);
                    if (isValid) {
                        strStack.pop();
                        blockDatas.push({ text: str, opts: [imgOpt] });
                    }
                    imgStart = false;
                }
            }
            //最后的数据
            while (strStack.length > 0) {
                genBlockFun();
            }
        }

        /**
         * @private
         */
        start() {

        }

        onPlay() {

        }

        /**
         * @private
         */
        update(delta: number) {

        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version m4m 1.0
         */
        transform: transform2D;

        /**
         * @private
         */
        remove() {
            if (this._font) this._font.unuse();
            if (this._imageTextAtlas) this._imageTextAtlas.unuse();
            if (this._uimat) this._uimat.unuse();
            if (this._imgUIMat) this._imgUIMat.unuse();
            this.datar.length = 0;
            this.imgDatar.length = 0;
            this._richTextBlocks.length = 0;
            this._defTextBlocks.length = 0;
            this.transform = null;
            this._cacheMaskV4 = null;
            this.onAddRendererText = null;
            this.data_begin = null;
            this._lastBegin = null;
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 横向显示方式
     * @version m4m 1.0
     */
    export enum HorizontalType {
        Center,
        Left,
        Right
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 纵向显示方式
     * @version m4m 1.0
     */
    export enum VerticalType {
        Center,
        Top,
        Boom
    }

    /** 富文本类型 */
    enum RichOptType {
        /** 颜色 */
        Color,
        /** 下划线 */
        Underline,
        /** 字体加粗 */
        Bold,
        /** 字体斜体 */
        Italic,
        /** 图片 */
        Image
    }

    /** 富文本选项接口 */
    interface IRichTextOpt {
        /** 值 */
        value: any;
        /** 获取类型 */
        getType(): RichOptType;
    }

    /**
     * 富文本选项 颜色
     */
    class richOptColor implements IRichTextOpt {
        constructor(_c: math.color) {
            this.value = new math.color();
            math.colorClone(_c, this.value);
        }
        value: math.color;
        getType(): RichOptType { return RichOptType.Color; }
    }

    /**
     * 富文本选项 下划线
     */
    class richOptUnderline implements IRichTextOpt {
        value: boolean = true;
        getType(): RichOptType { return RichOptType.Underline; }
    }

    /**
     * 富文本选项 加粗
     */
    class richOptBold implements IRichTextOpt {
        value: boolean = true;
        getType(): RichOptType { return RichOptType.Bold; }
    }

    /**
     * 富文本选项 斜体
     */
    class richOptItalic implements IRichTextOpt {
        value: boolean = true;
        getType(): RichOptType { return RichOptType.Italic; }
    }

    /**
     * 富文本选项 文本图
     */
    class richOptImage implements IRichTextOpt {
        constructor(imgSrc: string) {
            this.value = imgSrc;
        }
        value: string;
        getType(): RichOptType { return RichOptType.Image; }
    }

    interface IBlock {
        text: string,
        opts: IRichTextOpt[]
    };
}