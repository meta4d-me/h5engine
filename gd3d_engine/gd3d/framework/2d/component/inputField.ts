/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本输入框
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class inputField implements I2DComponent, I2DPointListener {
        static readonly ClassName: string = "inputField";
        private static readonly helpV2: gd3d.math.vector2 = new gd3d.math.vector2();

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version gd3d 1.0
         */
        transform: transform2D;

        private _frameImage: image2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 底框显示图像
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("reference", null, "image2D")
        get frameImage() {
            return this._frameImage;
        }
        set frameImage(frameImg: image2D) {
            this._frameImage = frameImg;
        }

        private customRegexStr: string = "";
        private beFocus: boolean = false;
        private inputElement: HTMLInputElement;
        private _text: string = "";
        private static _isIos: boolean;

        /** 选择区域的开始位置 */
        get selectionStart() {
            if (this.inputElement) return this.inputElement.selectionStart;
            return 0;
        }

        /** 选择区域的结束位置 */
        get selectionEnd() {
            if (this.inputElement) return this.inputElement.selectionEnd;
            return 0;
        }

        /** 选择区域的方向 ， forward ：从前往后 backward ：从后往前 */
        get selectionDirection() {
            if (this.inputElement) return this.inputElement.selectionDirection;
            return "forward";
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文字内容
         * @version gd3d 1.0
         */
        get text(): string {
            return this._text;
        }

        /**
         * 清除输入文本
         */
        public clearText() {
            this._text = "";
            this.inputElement.value = this._text;
            this._textLable.text = this._text;
        }

        private _charlimit: number = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 限制输入字符数
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        get characterLimit() { return this._charlimit; }
        set characterLimit(charlimit: number) {
            this._charlimit = parseInt(`${charlimit}`);
            this._charlimit = isNaN(this._charlimit) || this._charlimit < 0 ? 0 : this._charlimit;
        }

        private _lineType: lineType = lineType.SingleLine;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文本行格式
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("number")
        get LineType() { return this._lineType; }
        set LineType(lineType: lineType) {
            this._lineType = lineType;
        }

        private _contentType: number = contentType.None;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 文本内容格式
        * @version gd3d 1.0
        */
        @gd3d.reflect.Field("number")
        get ContentType() { return this._contentType; }
        set ContentType(contentType: number) {
            this._contentType = contentType;
        }

        private _textLable: label;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("reference", null, "label")
        get TextLabel(): label {

            return this._textLable;
        }
        set TextLabel(textLabel: label) {
            textLabel.text = this._text;
            this._textLable = textLabel;
        }

        private _placeholderLabel: label;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("reference", null, "label")
        get PlaceholderLabel(): label {

            return this._placeholderLabel;
        }
        set PlaceholderLabel(placeholderLabel: label) {
            if (placeholderLabel.text == null || placeholderLabel.text == "")
                placeholderLabel.text = "Enter Text...";
            this._placeholderLabel = placeholderLabel;
        }

        private _cursorTrans: transform2D;
        /**
         * 选择 光标 节点对象
         */
        @gd3d.reflect.Field("reference", null, "transform2D")
        get CursorTrans(): transform2D {
            return this._cursorTrans;
        }
        set CursorTrans(val: transform2D) {
            this._cursorTrans = val;
            if (val) { val.visible = false; }
        }

        private _selectionBG: transform2D;
        /**
         * 选择 字符串背景 节点对象
         */
        @gd3d.reflect.Field("reference", null, "transform2D")
        get SelectionBG(): transform2D {
            return this._selectionBG;
        }
        set SelectionBG(val: transform2D) {
            this._selectionBG = val;
            if (val) { val.visible = false; }
        }

        /**
         * 刷新布局
         */
        private layoutRefresh() {
            this.inputElmLayout();

            if (this._placeholderLabel) {
                if (this._placeholderLabel.transform.width != this.transform.width)
                    this._placeholderLabel.transform.width = this.transform.width;
                if (this._placeholderLabel.transform.height != this.transform.height)
                    this._placeholderLabel.transform.height = this.transform.height;
            }
            if (this._textLable) {
                if (this._textLable.transform.width != this.transform.width)
                    this._textLable.transform.width = this.transform.width;
                if (this._textLable.transform.height != this.transform.height)
                    this._textLable.transform.height = this.transform.height;
            }

        }

        /**
         * @private
         */
        start() {
            //ios fix thing
            this.ckIsIos();

            this.inputElement = <HTMLInputElement>document.createElement("Input");
            this.inputElement.style.opacity = "0";
            this.inputElement.style.display = "none";
            this.inputElement.tabIndex = 0;
            this.inputElement.autofocus = true;
            if (this.transform.canvas.scene) {
                let htmlCanv = <HTMLCanvasElement>this.transform.canvas.scene.webgl.canvas;
                if (htmlCanv)
                    htmlCanv.parentElement.appendChild(this.inputElement);
            }

            if (inputField._isIos) {
                this.inputElement.onclick = () => {
                    // console.error(`onclick : ${this.transform.insId.getInsID()} , ${this.inputElement.value}`);
                    this.inputElement.blur();
                    this.inputElement.focus();
                }
            }

            this.inputElement.onblur = (e) => {
                this.beFocus = false;
            }

            this.inputElement.onfocus = (e) => {
                this.beFocus = true;
            }

            this.inputElmLayout();
        }

        private ckIsIos() {
            //ios 有保护 , focus 必须在 dom 事件帧触发。
            if (inputField._isIos == null) {
                if (navigator && navigator.userAgent) {
                    let u = navigator.userAgent;
                    inputField._isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                } else {
                    inputField._isIos = false;
                }
            }
        }

        onPlay() {

        }

        /**
        * @private
        * inputElement 位置、宽高刷新
        */
        private inputElmLayout() {
            if (this.inputElement == null) return;
            let pos = this.transform.getWorldTranslate();
            let cssStyle: CSSStyleDeclaration = this.inputElement.style;
            let p = this.transform.pivot;
            let w = this.transform.width;
            let h = this.transform.height;
            let realX = pos.x - p.x * w;
            let realY = pos.y - p.y * h;
            if (realX + "px" == cssStyle.left && realY + "px" == cssStyle.top && w + "px" == cssStyle.width && h + "px" == cssStyle.height)
                return;

            let scale = this.transform.canvas.scene.app.canvasClientHeight / this.transform.canvas.pixelHeight;
            cssStyle.position = "absolute";
            cssStyle.left = realX * scale + "px";
            cssStyle.top = realY * scale + "px";

            cssStyle.width = w * scale + "px";
            cssStyle.height = h * scale + "px";
        }

        /**
         * @private
         * 输入文本刷新
         */
        private textRefresh() {
            if (!this.beFocus || !this._textLable || !this._placeholderLabel || !this.inputElement || this._text == this.inputElement.value) return;

            if (this._charlimit > 0 && this.inputElement.value.length >= this._charlimit) {
                if (this.inputElement.value != this._text)
                    if (this.inputElement.value.length > this._text.length) {
                        this.inputElement.value = this._text;
                    } else {
                        this._text = this.inputElement.value;
                    }
                return;
            }

            this._text = this.inputElement.value;
            if (this._contentType == contentType.Custom) {
                if (this.customRegexStr != null && this.customRegexStr != "")
                    this._text = this._text.replace(this.customRegexStr, '');
            } else {
                if (this._contentType == contentType.None) {

                }
                //英文字母，数字，汉字，下划线
                else if ((this._contentType & contentType.Number) && (this._contentType & contentType.Word) && (this._contentType & contentType.ChineseCharacter) && (this._contentType & contentType.Underline)) {
                    this._text = this._text.replace(/^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$/ig, '');
                }
                //英文字母，数字，下划线
                else if ((this._contentType & contentType.Number) && (this._contentType & contentType.Word) && (this._contentType & contentType.Underline)) {
                    this._text = this._text.replace(/[^\w\.\/]/ig, '');
                }
                //数字，字符
                else if ((this._contentType & contentType.Number) && (this._contentType & contentType.Word)) {
                    this._text = this._text.replace(/[^(A-Za-z0-9)]/ig, '');
                }
                //汉字，字符
                else if ((this._contentType & contentType.ChineseCharacter) && (this._contentType & contentType.Word)) {
                    this._text = this._text.replace(/[^(A-Za-z\u4E00-\u9FA5)]/ig, '');
                }
                //数字
                else if (this._contentType == contentType.Number) {
                    this._text = this._text.replace(/\D+/g, '');
                }
                //汉字
                else if (this._contentType == contentType.ChineseCharacter) {
                    this._text = this._text.replace(/[^\u4E00-\u9FA5]/g, '');
                }

            }
            this.inputElement.value = this._text;
            if (this._textLable) {
                this._textLable.text = this._text;
                this.filterContentText();
            }

            if (this._text == "") {
                this._placeholderLabel.transform.visible = true;
                this._textLable.transform.visible = false;
            } else {
                this._placeholderLabel.transform.visible = false;
                this._textLable.transform.visible = true;
            }
        }

        private filterContentText() {
            if (!this._textLable || this._text == null) return;
            let lab = this._textLable;
            let rate = lab.fontsize / lab.font.pointSize;
            let font = lab.font;
            let addw = 0;
            let addh = 0;
            let str = "";
            switch (this._lineType) {
                case lineType.SingleLine:
                    for (var i = lab.text.length - 1; i >= 0; i--) {
                        let c = lab.text.charAt(i);
                        let cinfo = font.cmap[c];
                        if (!cinfo) {
                            console.warn(`can't find character "${c}" in ${font.getName()} Font`);
                            continue;
                        }
                        addw += cinfo.xAddvance * rate;

                        if (addw > lab.transform.width) {
                            lab.text = str;
                            break;
                        }
                        str = lab.text[i] + str;
                    }

                    break;
                case lineType.MultiLine:
                    let fristline = true;
                    addh += lab.fontsize * lab.linespace;
                    for (var i = lab.text.length - 1; i >= 0; i--) {
                        let c = lab.text.charAt(i);
                        let cinfo = font.cmap[c];
                        if (!cinfo) {
                            console.warn(`can't find character "${c}" in ${font.getName()} Font`);
                            continue;
                        }
                        addw += cinfo.xAddvance * rate;

                        if (addw > lab.transform.width) {
                            addw = 0;
                            fristline = false;
                            addh += lab.fontsize * lab.linespace;
                        }
                        if (!fristline && addh > lab.transform.height) {
                            lab.text = str;
                            break;
                        }
                        str = lab.text[i] + str;
                    }
                    break;
            }

        }

        private _lastIsCursorMode: boolean = false;
        private _twinkleTime: number = 0.6;
        private _twinkleTimeCount: number = 0;
        private _lastSStart: number = -1;
        private _lastSEnd: number = -1;
        private _currStartX: number = 0;
        private _currEndX: number = 0;
        /** 选择状态刷新 */
        private selectionRefresh(dt: number) {
            let _cNode = this._cursorTrans;
            let _sbgNode = this._selectionBG;
            if (!_cNode && !_sbgNode) return;

            if (!this.beFocus) {
                if (this._selectionBG) this._selectionBG.visible = false;
                if (this._cursorTrans) this._cursorTrans.visible = false;
                this._lastSStart = -1;
                this._lastSEnd = -1;
                this._lastIsCursorMode = false;
                return;
            }
            if (!this.inputElement || !this._textLable || !this._textLable.font) return;
            let sIdx = this.selectionStart;
            let eInx = this.selectionEnd;
            let difLen = sIdx - eInx;
            let isCursorMode = difLen == 0;
            let needSwitch = this._lastIsCursorMode != isCursorMode;
            let selectionDirty = sIdx != this._lastSStart || eInx != this._lastSEnd || needSwitch; //光标有变化
            this._lastIsCursorMode = isCursorMode;
            let lpt = gd3d.framework.layoutOption;
            //switch mode
            if (needSwitch) {
                //hide all 
                if (_sbgNode) _sbgNode.visible = false;
                if (_cNode) _cNode.visible = false;
                //visible
                if (isCursorMode) {
                    if (_cNode) _cNode.visible = true;
                } else {
                    if (_sbgNode) _sbgNode.visible = true;
                }
            }

            //
            this._lastSStart = sIdx;
            this._lastSEnd = eInx;

            //update
            if (isCursorMode) {
                //光标
                if (!_cNode) return;
                if (selectionDirty) {
                    this._twinkleTimeCount = 0;
                    this._currStartX = this.getInputTextXPos(sIdx);
                    if (_cNode) _cNode.visible = true;
                }

                //光标定时闪烁
                this._twinkleTimeCount += dt;
                if (this._twinkleTimeCount >= this._twinkleTime) {
                    _cNode.visible = !_cNode.visible;
                    this._twinkleTimeCount = 0;
                }
                //位置刷新
                _cNode.setLayoutValue(lpt.LEFT, this._currStartX);
                _cNode.markDirty();
            } else {
                if (!_sbgNode) return;
                if (selectionDirty) {
                    this._twinkleTimeCount = 0;
                    this._currStartX = this.getInputTextXPos(sIdx);
                    this._currEndX = this.getInputTextXPos(eInx);
                }
                let bgW = Math.abs(this._currEndX - this._currStartX);

                //位置、宽高 刷新
                _sbgNode.setLayoutValue(lpt.LEFT, this._currStartX);
                _sbgNode.width = bgW;
                _sbgNode.markDirty();
            }
        }

        //获取 输入文本 的坐标的X值
        private getInputTextXPos(strIndex: number): number {
            let result = 0;
            let text = this._textLable.text;
            let f = this._textLable.font;
            var rate = this._textLable.fontsize / f.pointSize;
            //计算字符偏移
            for (let i = 0, len = strIndex; i < len; i++) {
                let c = text[i];
                let cInfo = f.cmap[c];
                if (!cInfo) continue;
                result += cInfo.xAddvance * rate;
            }

            return result;
        }

        /**
         * @private
         */
        update(delta: number) {
            this.layoutRefresh();
            this.textRefresh();
            this.selectionRefresh(delta);
        }

        /**
         * @private
         */
        remove() {
            this._placeholderLabel = null;
            this._textLable = null;
            this.transform = null;
            this._frameImage = null;
            if (this.inputElement) {
                this.inputElement.onfocus = null;
                this.inputElement.onclick = null;
                this.inputElement.onblur = null;
                this.inputElement.disabled = false;
                this.inputElement.value = "";
                this.inputElement.style.display = "none";
                if (this.inputElement.parentElement)
                    this.inputElement.parentElement.removeChild(this.inputElement);
                this.inputElement = null;
            }
        }

        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean) {
            // if(this._isIos) return;
            if (oncap == false) {
                if (ev.type != event.PointEventEnum.PointDown) return;
                var b = this.transform.ContainsCanvasPoint(new math.vector2(ev.x, ev.y));
                this.setFocus(b);
            }
        }

        private setFocus(isFocus: boolean) {
            if (isFocus) {
                this.inputElement.style.display = "";
                if (!this.beFocus) {
                    this.inputElement.focus();
                }
            }
            else {
                if (this.beFocus) this.inputElement.blur();
                this.inputElement.style.display = "none";
            }
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 文本行显示方式
     * @version gd3d 1.0
     */
    export enum lineType {
        SingleLine,
        MultiLine,
    }

    /**
     * @language zh_CN
     * @classdesc
     * 文本内容类型
     * @version gd3d 1.0
     */
    export enum contentType {
        None = 0,
        Number = 1,//数字
        Word = 2,//字母
        Underline = 4,//下划线
        ChineseCharacter = 8,//中文字符
        NoneChineseCharacter = 16,//没有中文字符
        Email = 32,//邮件
        PassWord = 64,//密码
        Custom = 128,//自定义
    }
}