/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d图片组件</p>
     * 参照UGUI的思路，rawImage只拿整个图片来显示，不关心Sprite、九宫、填充等。这些统一都在iamge中处理
     * @version egret-gd3d 1.0
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class rawImage2D implements IRectRenderer
    {
        static readonly ClassName:string="rawImage2D";

        private datar: number[] = [
            //3 pos  4 color  2 uv 4 color2
            0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        
        private _image: texture;

        private needRefreshImg = false;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 图片
         * @version egret-gd3d 1.0
         */
        @gd3d.reflect.Field("texture")
        public get image()
        {
            return this._image;
        }
        public set image(_image:texture)
        {
            if(this._image == _image) return;
            this.needRefreshImg = true;
            if(this._image)
            {
                this._image.unuse();
            }
            this._image = _image;
            if(_image){
                this._image.use();
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 颜色
         * @version egret-gd3d 1.0
         */
        @reflect.Field("color")
        @reflect.UIStyle("vector4")
        color: math.color = new math.color(1.0, 1.0, 1.0, 1.0);


        private static readonly defUIShader = `shader/defmaskui`;

        private _shaderName = `shader/defmaskui`;

        private _shaderDirty = false;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置rander Shader名字
         * @version egret-gd3d 1.0
         */
        setShaderByName(shaderName:string){
            this._shaderName = shaderName;
            this._shaderDirty = true;
        }

        /**
         * @private
         * ui默认材质
         */
        private _uimat: material;
        private _lastMask = false;
        private get uimat(){
            if (this._image ){
                let canvas = this.transform.canvas;
                if(!canvas.assetmgr) return;
                let assetmgr = canvas.assetmgr;
                let pMask = this.transform.parentIsMask;
                let mat = this._uimat;
                let rectPostfix = pMask ? `_(${this.transform.parent.insId})`: ""; //when parentIsMask,can't multiplexing material , can be multiplexing when parent equal
                let matName =this._image.getName() + "_uimask" + rectPostfix;
                let matChanged = false;
                if(!mat || mat.getName() != matName){
                    if(mat) mat.unuse(); 
                    mat = assetmgr.getAssetByName(matName) as gd3d.framework.material;
                    if(mat) mat.use();
                }
                if(mat == null){
                    mat = new material(matName);
                    let sh = assetmgr.getShader(this._shaderName);
                    sh = !sh? assetmgr.getShader(rawImage2D.defUIShader) : sh;
                    mat.setShader(sh);
                    mat.use();
                    matChanged = true;
                }
                if(matChanged || this._lastMask != pMask){
                    mat.setFloat("MaskState", this.transform.parentIsMask? 1 : 0);
                    this._lastMask = pMask;
                }
                this._uimat = mat;
            }
            return this._uimat;
        }
        // /**
        //  * @private
        //  * ui默认材质
        //  */
        // _uimat: material;
        // private get uimat(){
        //     if (this.image != null ){
        //         let rectPostfix = this.transform.parentIsMask? `_(${this.transform.insId})`: ""; //when parentIsMask,can't multiplexing material
        //         let matName =this._image.getName() + "_uimask" + rectPostfix;
        //         let canvas = this.transform.canvas;
        //         if(!canvas.assetmgr) return;
        //         let mat = this._uimat;
        //         if(!mat || mat.getName() != matName){
        //             if(mat) mat.unuse(); 
        //             mat = canvas.assetmgr.getAssetByName(matName) as gd3d.framework.material;
        //             if(mat) mat.use();
        //         }
        //         if(mat == null){
        //             mat = new material(matName);
        //             mat.setShader(canvas.assetmgr.getShader("shader/defmaskui"));
        //             mat.use();
        //         }
        //         mat.setFloat("MaskState", this.transform.parentIsMask? 1 : 0);
        //         this._uimat = mat;
        //     }
        //     return this._uimat;
        // }

        /**
         * @private
         */
        render(canvas: canvas)
        {
            let img = this.image;
            let mat = this.uimat;
            if(!mat) return;
            // if (img == null)
            // {
            //     var scene = this.transform.canvas.scene;
            //     img = scene.app.getAssetMgr().getDefaultTexture("grid");
            // }
            if(img != null){
                if(this.needRefreshImg){
                    mat.setTexture("_MainTex", img);
                    this.needRefreshImg = false;
                }

                if(this.transform.parentIsMask){
                    if(this._cacheMaskV4 == null) this._cacheMaskV4 = new math.vector4();
                    let rect = this.transform.maskRect;
                    if(this._cacheMaskV4.x != rect.x || this._cacheMaskV4.y != rect.y || this._cacheMaskV4.w != rect.w || this._cacheMaskV4.z != rect.h){
                        this._cacheMaskV4.x = rect.x; this._cacheMaskV4.y = rect.y;this._cacheMaskV4.z = rect.w;this._cacheMaskV4.w = rect.h;
                        mat.setVector4("_maskRect",this._cacheMaskV4);
                    }
                }

                canvas.pushRawData(mat , this.datar);
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
            var r = this.transform.width + l;
            var t = -this.transform.pivot.y * this.transform.height;
            var b = this.transform.height + t;

            var x0 = l * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
            var y0 = l * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
            var x1 = r * m.rawData[0] + t * m.rawData[2] + m.rawData[4];
            var y1 = r * m.rawData[1] + t * m.rawData[3] + m.rawData[5];
            var x2 = l * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
            var y2 = l * m.rawData[1] + b * m.rawData[3] + m.rawData[5];
            var x3 = r * m.rawData[0] + b * m.rawData[2] + m.rawData[4];
            var y3 = r * m.rawData[1] + b * m.rawData[3] + m.rawData[5];

            this.datar[0 * 13] = x0;
            this.datar[0 * 13 + 1] = y0;
            this.datar[1 * 13] = x1;
            this.datar[1 * 13 + 1] = y1;
            this.datar[2 * 13] = x2;
            this.datar[2 * 13 + 1] = y2;
            this.datar[3 * 13] = x2;
            this.datar[3 * 13 + 1] = y2;
            this.datar[4 * 13] = x1;
            this.datar[4 * 13 + 1] = y1;
            this.datar[5 * 13] = x3;
            this.datar[5 * 13 + 1] = y3;
            //主color
            for (var i = 0; i < 6; i++)
            {
                this.datar[i * 13 + 3] = this.color.r;
                this.datar[i * 13 + 4] = this.color.g;
                this.datar[i * 13 + 5] = this.color.b;
                this.datar[i * 13 + 6] = this.color.a;
            }

        }
        
        /**
         * @private
         */
        start()
        {

        }

        onPlay(){

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
            if(this._image) this._image.unuse(true);
            if(this._uimat) this._uimat.unuse(true);
            this._image = null;   
            this._cacheMaskV4 = null; 
            this.transform = null;
            this.datar.length = 0;
        }

        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {

        }
    }
}