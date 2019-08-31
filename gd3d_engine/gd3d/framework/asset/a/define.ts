namespace gd3d.framework
{

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源类型
     * @version gd3d 1.0
     */
    export enum AssetTypeEnum
    {
        /**
         * @public
         * @language zh_CN
         * 未知
         * @version gd3d 1.0
         */
        Unknown,
        /**
         * @public
         * @language zh_CN
         * 根据后缀 动态识别
         * @version gd3d 1.0
         */
        Auto,
        /**
         * @public
         * @language zh_CN
         * 资源包
         * @version gd3d 1.0
         */
        Bundle,
        /**
         * @public
         * @language zh_CN
         * 压缩的资源包
         * @version gd3d 1.0
         */
        CompressBundle,
        /**
         * @public
         * @language zh_CN
         * glsl vs
         * @version gd3d 1.0
         */
        GLVertexShader,
        /**
         * @public
         * @language zh_CN
         * glsl fs
         * @version gd3d 1.0
         */
        GLFragmentShader,
        /**
         * @public
         * @language zh_CN
         * shader
         * @version gd3d 1.0
         */
        Shader,
        /**
         * @public
         * @language zh_CN
         * 贴图
         * @version gd3d 1.0
         */
        Texture,
        /**
         * @public
         * @language zh_CN
         * 贴图desc
         * @version gd3d 1.0
         */
        TextureDesc,
        /**
         * @public
         * @language zh_CN
         * 模型
         * @version gd3d 1.0
         */
        Mesh,
        /**
         * @public
         * @language zh_CN
         * 材质
         * @version gd3d 1.0
         */
        Material,
        /**
         * @public
         * @language zh_CN
         * 动画片段
         * @version gd3d 1.0
         */
        Aniclip,
        /**
         * @public
         * @language zh_CN
         * 关键帧动画片段
         * @version gd3d 1.0
         */
        KeyFrameAniclip,
        /**
         * @public
         * @language zh_CN
         * 图集
         * @version gd3d 1.0
         */
        Atlas,
        /**
         * @public
         * @language zh_CN
         * 字体
         * @version gd3d 1.0
         */
        Font,
        /**
         * @public
         * @language zh_CN
         * 文本
         * @version gd3d 1.0
         */
        TextAsset,
        /**
         * @private
         */
        PackBin,
        /**
         * @private
         */
        PackTxt,
        /**
         * @public
         * @language zh_CN
         * 可编辑路径
         * @version gd3d 1.0
         */
        PathAsset,
        /**
         * @public
         * @language zh_CN
         * pvr贴图
         * @version gd3d 1.0
         */
        PVR,

        F14Effect,

        /**
         * @public
         * @language zh_CN
         * dds贴图
         * @version gd3d 1.0
         */
        DDS,
        /**
         * @public
         * @language zh_CN
         * 场景
         * @version gd3d 1.0
         */
        Scene,
        /**
         * @public
         * @language zh_CN
         * 预设
         * @version gd3d 1.0
         */
        Prefab,
        cPrefab,
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源加载状态
     * @version gd3d 1.0
     */
    export class ResourceState
    {
        res: IAsset = null;
        state: number = 0;
        loadedLength: number = 0;
        // totalLength: number = 0;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 带引用的资源加载状态
     * @version gd3d 1.0
     */
    export class RefResourceState extends ResourceState
    {
        refLoadedLength: number = 0;
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载状态
     * @version gd3d 1.0
     */
    export class stateLoad
    {
        /**
         * @public
         * @language zh_CN
         * 加载是否失败
         * @version gd3d 1.0
         */
        isloadFail: boolean = false;

        /**
         * @public
         * @language zh_CN
         * 加载是否遇到错误
         * @version gd3d 1.0
         */
        iserror: boolean = false;
        /**
         * @public
         * @language zh_CN
         * 加载是否完成
         * @version gd3d 1.0
         */
        isfinish: boolean = false;

        /**
         * @public
         * @language zh_CN
         * 记录需要加载的每一个的状态和资源引用
         * @version gd3d 1.0
         */
        resstate: { [id: string]: ResourceState } = {};

        /**
         * @public
         * @language zh_CN
         * 记录加载的第一个的状态和资源引用
         * @version gd3d 1.0
         */
        resstateFirst: ResourceState = null;
        /**
         * @public
         * @language zh_CN
         * 当前的文件数进度
         * @version gd3d 1.0
         */
        curtask: number = 0;
        /**
         * @public
         * @language zh_CN
         * 文件数的总进度
         * @version gd3d 1.0
         */
        totaltask: number = 0;

        /**
         * @public
         * @language zh_CN
         * 获取文件数加载进度
         * @version gd3d 1.0
         */
        get fileProgress(): number
        {
            return this.curtask / this.totaltask;
        }

        /**
         * @public
         * @language zh_CN
         * 已加载的字节长度
         * @version gd3d 1.0
         */
        get curByteLength(): number
        {
            let result = 0;
            for (let key in this.resstate)
            {
                let _resState = this.resstate[key];
                result += _resState.loadedLength;
                if (_resState instanceof RefResourceState)
                {
                    result += _resState.refLoadedLength;
                }
            }
            result += this.compressTextLoaded + this.compressBinLoaded;
            return result;
        }

        /**
         * @public
         * @language zh_CN
         * 总字节长度
         * @version gd3d 1.0
         */
        totalByteLength: number = 0;

        /**
         * @public
         * @language zh_CN
         * 获取文件真实加载进度
         * @version gd3d 1.0
         */
        get progress(): number
        {
            return this.curByteLength / this.totalByteLength;
        }

        progressCall: boolean = false;

        compressTextLoaded: number = 0;

        compressBinLoaded: number = 0;

        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的log
         * @version gd3d 1.0
         */
        logs: string[] = [];
        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的错误信息
         * @version gd3d 1.0
         */
        errs: Error[] = [];
        /**
         * @public
         * @language zh_CN
         * 源url地址
         * @version gd3d 1.0
         */
        url: string;
    }

    export class assetRef
    {
        asset: IAsset;
        refcount: number;
    }
}