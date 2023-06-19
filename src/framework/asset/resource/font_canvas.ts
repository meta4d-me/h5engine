namespace m4m.framework {
    @m4m.reflect.SerializeType
    export class font_canvas implements IFont {
        _webgl: WebGL2RenderingContext;
        static _canvas: HTMLCanvasElement;
        static _c2d: CanvasRenderingContext2D;
        constructor(webgl: WebGL2RenderingContext, fontname: string="serif", fontsize: number=16) {
            this.name = new constText("canvasfont_" + fontname + "_" + fontsize);
            this._webgl = webgl;
            let cachefontsize = 256;
            this._texture = new m4m.render.WriteableTexture2D(webgl, render.TextureFormatEnum.RGBA, cachefontsize, cachefontsize, false, false, false, false, false);


            //填个黑底 
            // let tdata = new Uint8Array(cachefontsize * cachefontsize * 4);
            // for (var i = 0; i < tdata.length / 4; i++) {
            //     tdata[i * 4 + 0] = 255;
            //     tdata[i * 4 + 1] = 0;
            //     tdata[i * 4 + 2] = 255;
            //     tdata[i * 4 + 3] = 127;
            // }
            // this._texture.updateRect(tdata, 0, 0, cachefontsize, cachefontsize);

            this._restex = new texture(this.name.getText());
            this._restex.glTexture = this._texture;

            this.defaultAsset = false;
            this.cmap = {};
            this.fontname = fontname;
            this.pointSize = fontsize;
            this.padding = 0;
            this.baseline = 0;
            if (font_canvas._canvas == null) {
                font_canvas._canvas = document.createElement("canvas");
                font_canvas._canvas.width = 64;
                font_canvas._canvas.height = 64;

                font_canvas._c2d = font_canvas._canvas.getContext("2d", { willReadFrequently: true });

            }

        }
        IsSDF(): boolean {
            return false;
        }
        private name: constText;
        private id: resID = new resID();

        defaultAsset: boolean;//是否为系统默认资源
        getName(): string {
            return this.name.getText();
        }

        getGUID(): number {
            return this.id.getID();
        }
        use() {
            sceneMgr.app.getAssetMgr().use(this);
        }

        unuse(disposeNow: boolean = false) {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        private _texture: m4m.render.WriteableTexture2D;
        private _restex: texture;
        dispose() {
            this._texture.dispose(this._webgl);
            delete this.cmap;
        }
        GetTexture(): texture {
            return this._restex;
        }

        caclByteLength(): number {
            let total = 0;
            return total;
        }

        cmap: { [id: string]: charinfo };
        /** 字体名 */
        fontname: string;
        /** 像素尺寸 */
        pointSize: number;
        /** 填充间隔 */
        padding: number;
        /**行高 */
        lineHeight: number;
        /** 基线 */
        baseline: number;
        /** 字符容器图的宽度 */
        atlasWidth: number;
        /** 字符容器图的高度 */
        atlasHeight: number;

        _posx: number = 0;
        _posy: number = 0;
        EnsureString(text: string): void {
            let _2d = font_canvas._c2d;
            let updatecount = 0;
            for (var i = 0; i < text.length; i++) {
                let c = text.charAt(i);
                let cinfo = this.cmap[c];
                if (cinfo == undefined) {
                    cinfo = new charinfo();

                    _2d.clearRect(0, 0, this.pointSize, this.pointSize);

                    // //加一个调试用背景
                    // _2d.fillStyle = "rgba(0,0,0,255)";
                    // _2d.fillRect(0, 0, this.pointSize, this.pointSize);

                    _2d.fillStyle = "rgba(255,255,255,255)";
                    _2d.font = ((this.pointSize) | 0) + "px "+this.fontname;
                    _2d.textBaseline = "bottom";
                    _2d.fillText(c, 0, this.pointSize, this.pointSize);
                    let mr = _2d.measureText(c);
                    if (this._posx + mr.width > this._texture.width) {
                        this._posx = 0;
                        this._posy += this.pointSize;
                        if ((this._posy + this.pointSize) > this._texture.height)
                            throw new Error("no cache area in font tex.");
                    }
                    let data = _2d.getImageData(0, 0,  mr.width, this.pointSize);

                    this._texture.updateRect(data.data, this._posx, this._texture.height - this.pointSize - this._posy,  mr.width, this.pointSize);

                    cinfo.x = this._posx / this._texture.width;
                    cinfo.y = (this._posy / this._texture.height) * 1.0;
                    cinfo.w = mr.width / this._texture.width;
                    cinfo.h = this.pointSize / this._texture.height;
                    cinfo.xAddvance = mr.width;
                    cinfo.xOffset = 0;
                    cinfo.yOffset = 0;
                    cinfo.xSize = mr.width;
                    cinfo.ySize = this.pointSize;


                    this.cmap[c] = cinfo;
                    updatecount++;
                    //偏移像素
                    this._posx += mr.width;

                }

            }
            if (updatecount > 0)
                console.log("update font:" + updatecount);

        }
    }

}