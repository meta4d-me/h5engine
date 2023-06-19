namespace m4m.framework {
    @m4m.reflect.SerializeType
    export class font_canvas implements IFont {
        _webgl: WebGL2RenderingContext;
        static _canvas: HTMLCanvasElement;
        static _c2d: CanvasRenderingContext2D;
        constructor(webgl: WebGL2RenderingContext, fontname: string, fontsize: number) {
            this.name = new constText(fontname);
            this._webgl = webgl;
            this._texture = new m4m.render.WriteableTexture2D(webgl, render.TextureFormatEnum.RGBA, 2048, 2048, false, false, false, false, false);
            this._restex = new texture(fontname + "_tex");
            this._restex.glTexture = this._texture;

            this.defaultAsset = false;
            this.cmap = {};
            this.fontname = fontname;
            this.pointSize = fontsize;
            this.padding = 0;
            this.baseline =0;
            if (font_canvas._canvas == null) {
                font_canvas._canvas = document.createElement("canvas");
                font_canvas._canvas.width = 64;
                font_canvas._canvas.height = 64;

                font_canvas._c2d = font_canvas._canvas.getContext("2d", {colorSpace:"display-p3", willReadFrequently: true });

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

        EnsureString(text: string): void {
            for (var i = 0; i < text.length; i++) {
                let c = text.charAt(i);
                let cinfo = this.cmap[c];
                 if (cinfo == undefined) {
                     cinfo = new charinfo();
                     font_canvas._c2d.clearRect(0, 0, this.pointSize + this.padding * 2, this.pointSize + this.padding * 2);
                     font_canvas._c2d.fillText(c, 0, 0, this.pointSize);
                     let data = font_canvas._c2d.getImageData(0, 0, this.pointSize, this.pointSize);

                     this._texture.updateRect(data.data, 0, 0, this.pointSize, this.pointSize);
                     cinfo.x =0;
                     cinfo.y=0;
                     cinfo.w= this.pointSize;
                     cinfo.h =this.pointSize;
                     cinfo.xAddvance=this.pointSize;
                     cinfo.xOffset=0;
                     cinfo.yOffset=0;
                     cinfo.xSize =this.pointSize;
                     cinfo.ySize =this.pointSize;
                     this.cmap[c]=cinfo;
                 }

            }

        }
    }

}