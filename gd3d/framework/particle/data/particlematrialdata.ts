namespace gd3d.framework
{
    /**
     * 材质数据
     */
    export class MaterialData
    {
        /**
        * 材质名字
        */
        public name: string;
        /**
         * shader名字
         */
        public shaderName: string;
        /**
        * 漫反射贴图
        */
        public diffuseTexture: string;

        public tiling: gd3d.math.vector2 = new gd3d.math.vector2(1.0, 1.0);
        public offset: gd3d.math.vector2 = new gd3d.math.vector2(0, 0);
        public alphaCut: number = 0.5;
        public mapData: { [id: string]: any } = {};
        constructor()
        {

        }
    }
}

