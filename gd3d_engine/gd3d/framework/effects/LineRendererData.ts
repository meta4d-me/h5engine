namespace gd3d.framework
{
    /**
     * 线条染器数据
     */
    @gd3d.reflect.SerializeType
    export class LineRendererData implements IAsset
    {
        static readonly ClassName: string = "LineRendererData";

        private static _datas: { [name: string]: LineRendererData } = {};

        lineRenderer: LineRenderer;

        /**
         * 获取已经创建了的粒子系统数据
         * 
         * @param valueName 
         */
        static get(valueName: string)
        {
            return this._datas[valueName];
        }

        @gd3d.reflect.Field("constText")
        private name: constText = null;
        private id: resID = new resID();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean = false;

        /**
         * 粒子系统资源名称
         */
        @gd3d.reflect.Field("string")
        get value()
        {
            return this._value;
        }
        set value(v)
        {
            this._value = v;

            if (LineRendererData._datas[v])
            {
                return;
            }
            LineRendererData._datas[v] = this;
        }
        private _value: string;

        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "LineRenderer_" + this.getGUID();
            }
            this.name = new constText(assetName);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string
        {
            if (this.name == undefined)
            {
                return null;
            }
            return this.name.getText();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number
        {
            return this.id.getID();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose()
        {
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number
        {
            let total = 0;
            return total;
        }

        setData(v: string)
        {
            this.objectData = JSON.parse(v);
            if (this.lineRenderer)
            {
                serialization.setValue(this.lineRenderer, this.objectData);
            }
        }

        objectData: any;
    }
}