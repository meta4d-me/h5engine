/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本输入框
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class inputField implements IRectRenderer
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version egret-gd3d 1.0
         */
        transform: transform2D;
        
        private _frameImage: image2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 底框显示图像
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("image2D")
        get frameImage()
        {
            return this._frameImage;
        }
        set frameImage(frameImg : image2D){
            this._frameImage = frameImg;
        }

        private customRegexStr:string = "";
        private beFocus:boolean = false;
        private inputElement:HTMLInputElement;
        private _text: string = "";
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
            if(this._textLable){
                this._textLable.text = text;
            }
        }
        
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文本行格式
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("lineType")
         myLineType :lineType = lineType.SingleLine;

         /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文本行格式
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("contentType")
        myContentType :contentType = contentType.None;
        
        private _textLable : label;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("label")
        get TextLabel():label{

            return this._textLable;
        }
        set TextLabel(textLabel:label){
            textLabel.text = this._text;
            this._textLable = textLabel;
        }

        private _placeholderLabel:label;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("label")
        get PlaceholderLabel():label{

            return this._placeholderLabel;
        }
        set PlaceholderLabel(placeholderLabel:label){
            if(placeholderLabel.text ==null || placeholderLabel.text == "")
                placeholderLabel.text = "Enter Text...";
            this._placeholderLabel = placeholderLabel;
        }



        /**
         * @private
         */
        updateData(_font: gd3d.framework.font)
        {

        }

        /**
         * @private
         */
        render(canvas: canvas)
        {
          
        }

        /**
         * @private
         */
        updateTran()
        {
            this.inputElmLayout();
            
            if(this._placeholderLabel){
                if(this._placeholderLabel.transform.width != this.transform.width)
                    this._placeholderLabel.transform.width = this.transform.width;
                if(this._placeholderLabel.transform.height != this.transform.height)
                    this._placeholderLabel.transform.height = this.transform.height;
            }
            if(this._textLable){
                if(this._textLable.transform.width != this.transform.width)
                    this._textLable.transform.width = this.transform.width;
                if(this._textLable.transform.height != this.transform.height)
                    this._textLable.transform.height = this.transform.height;
            }

        }

        /**
         * @private
         */
        start()
        {
            this.inputElement = <HTMLInputElement>document.createElement("Input");
            this.inputElement.style.opacity = "0";
            this.inputElement.style.visibility = "hidden";
            if (this.transform.canvas.webgl)
                this.transform.canvas.webgl.canvas.parentElement.appendChild(this.inputElement);
            
            this.inputElement.onblur = (e)=>{
                this.beFocus = false;
            }

            this.inputElement.onfocus = (e)=>{
                this.beFocus = true;
            }

            this.inputElmLayout();
        }
        
         /**
         * @private
         * inputElement 位置、宽高刷新
         */
        private inputElmLayout(){
            if(this.inputElement == null )   return;
            let pos = this.transform.getWorldTranslate();
            this.transform.localTranslate;
            let cssStyle:CSSStyleDeclaration = this.inputElement.style;
            if(pos.x +"px" == cssStyle.left && pos.y + "px" == cssStyle.top && this.transform.width + "px" == cssStyle.width && this.transform.height + "px" == cssStyle.height)
                return;
            
            let scale = this.transform.canvas.scene.app.canvasClientHeight/this.transform.canvas.pixelHeight;
            cssStyle.position = "absolute";
            cssStyle.left = pos.x * scale + "px";
            cssStyle.top = pos.y * scale + "px";

            cssStyle.width = this.transform.width * scale + "px";
            cssStyle.height = this.transform.height * scale + "px";
        }

        /**
         * @private
         * 输入文本刷新
         */
        private textRefresh(){
            if(!this.beFocus || !this._textLable || !this._placeholderLabel || !this.inputElement || this._text == this.inputElement.value) return;

            this._text = this.inputElement.value;
            if (this.myContentType == contentType.Custom)
            {
                if(this.customRegexStr != null && this.customRegexStr != "")
                    this._text = this._text.replace(this.customRegexStr, '');
            }else{
                if (this.myContentType == contentType.None)
                {

                }
                //英文字母，数字，汉字，下划线
                else if ((this.myContentType & contentType.Number) && (this.myContentType & contentType.Word) && (this.myContentType & contentType.ChineseCharacter) && (this.myContentType & contentType.Underline)) {
                    this._text = this._text.replace(/^[\u4E00-\u9FA5a-zA-Z0-9_]{3,20}$/ig, '');
                }
                //英文字母，数字，下划线
                else if ((this.myContentType & contentType.Number) && (this.myContentType & contentType.Word) && (this.myContentType & contentType.Underline))
                {
                    this._text = this._text.replace(/[^\w\.\/]/ig, '');
                }
                //数字，字符
                else if ((this.myContentType & contentType.Number) && (this.myContentType & contentType.Word))
                {
                    this._text = this._text.replace(/[^(A-Za-z0-9)]/ig, '');
                }
                //数字
                else if (this.myContentType == contentType.Number)
                {
                    this._text = this._text.replace(/\D+/g, '');
                }
                //汉字
                else if (this.myContentType == contentType.ChineseCharacter)
                {
                    this._text = this._text.replace(/[^\u4E00-\u9FA5]/g, '');
                }

            }
            this.inputElement.value = this._text;
            this.text = this._text;

            if(this._text == ""){
                this._placeholderLabel.transform.visible = true;
                this._textLable.transform.visible = false;
            }else{
                this._placeholderLabel.transform.visible = false;
                this._textLable.transform.visible = true;
            }
        }

        /**
         * @private
         */
        update(delta: number)
        {
            this.textRefresh();

        }

        /**
         * @private
         */
        remove()
        {
            
            this.inputElement.disabled = false;
            this.inputElement.value = "";
            this.inputElement.style.visibility = "hidden";
            this.inputElement = null;

        }
        
        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {
            if(oncap == false ){
                if(ev.type != PointEventEnum.PointDown )    return;
                
                var b = this.transform.ContainsCanvasPoint(new math.vector2(ev.x, ev.y));
                if(b){
                    this.inputElement.style.visibility = "visible";
                    this.inputElement.focus();
                }else{
                    if(this.beFocus)
                        this.inputElement.blur();

                    if(this.inputElement.style.visibility != "hidden")
                        this.inputElement.style.visibility = "hidden";
                }       
            }
        }
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 文本行显示方式
     * @version egret-gd3d 1.0
     */
    export enum lineType
    {
        SingleLine,
        MultiLineSubmit,
        MultiLineNewline
    }
    
    /**
     * @language zh_CN
     * @classdesc
     * 文本内容类型
     * @version egret-gd3d 1.0
     */
    export enum contentType
    {
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