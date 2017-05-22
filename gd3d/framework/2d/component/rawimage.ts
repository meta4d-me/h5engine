/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    /**
     * 参照UGUI的思路，rawImage只拿整个图片来显示，不关心Sprite、九宫、填充等。这些统一都在iamge中处理
     */
    @reflect.node2DComponent
    @reflect.nodeRender
    export class rawImage2D implements IRectRenderer
    {
        private datar: number[] = [
            //3 pos  4 color  2 uv 4 color2
            0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
            0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ];
        @gd3d.reflect.Field("texture")
        _image: texture;
        public get image()
        {
            return this._image;
        }
        public set image(_image:texture)
        {
            if(this._image)
            {
                this._image.unuse();
            }
            this._image = _image;
            this._image.use();
        }

        @reflect.Field("color")
        @reflect.UIStyle("vector4")
        color: math.color = new math.color(1.0, 1.0, 1.0, 1.0);

        @gd3d.reflect.Field("material")
        @gd3d.reflect.UIStyle("material")
        mat: material;

        render(canvas: canvas)
        {
            if (this.mat == null)
            {
                this.mat = new material();
                this.mat.setShader(canvas.assetmgr.getShader("shader/defui"));
            }
            var img = this.image;

            // if (img == null)
            // {
            //     var scene = this.transform.canvas.scene;
            //     img = scene.app.getAssetMgr().getDefaultTexture("grid");
            // }
            if (img != null)
            {
                this.mat.setTexture("_MainTex", img);
                canvas.pushRawData(this.mat, this.datar);
            }
            
        }
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
            this._image.unuse(true);
        }
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean)
        {

        }
    }
}