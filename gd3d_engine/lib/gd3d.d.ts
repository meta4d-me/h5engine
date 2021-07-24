declare namespace gd3d {
    class version {
        static readonly VERSION = "0.0.1";
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    interface INotify {
        notify(trans: any, type: NotifyType): any;
    }
    /**
     * @private
     */
    enum NotifyType {
        AddChild = 0,
        RemoveChild = 1,
        ChangeVisible = 2,
        AddCamera = 3,
        AddCanvasRender = 4
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 设定画布的渲染大小，选择长或者宽作为标准锁定画布大小进行渲染。横屏选择FixedWidthType，竖屏选择FixedHeightType。目的是锁定屏幕大小，防止分辨率过高导致渲染压力过大
     * @version gd3d 1.0
     */
    enum CanvasFixedType {
        /** 随着窗口自由适应 */
        Free = 0,
        /** 固定宽度 */
        FixedWidthType = 1,
        /** 固定高度 */
        FixedHeightType = 2
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 引擎的主入口
     * @version gd3d 1.0
     */
    class application {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局webgl实例
         * @version gd3d 1.0
         */
        webgl: WebGLRenderingContext;
        stats: Stats.Stats;
        container: HTMLDivElement;
        outcontainer: HTMLDivElement;
        edModel: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局宏定义
         * @version gd3d 1.0
         */
        readonly globalMacros: string[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 绘制区域宽度 像素单位
         * @version gd3d 1.0
         */
        get width(): number;
        get height(): number;
        limitFrame: boolean;
        notify: INotify;
        private _timeScale;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置timescale
         * @version gd3d 1.0
         */
        set timeScale(val: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取timescale
         * @version gd3d 1.0
         */
        get timeScale(): number;
        private _tar;
        private _standDeltaTime;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置固定帧数 不设置即为不限制帧数
         * @version gd3d 1.0
         */
        set targetFrame(val: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前固定帧数
         * @version gd3d 1.0
         */
        get targetFrame(): number;
        screenAdaptiveType: string;
        private _fixHeight;
        private _fixWidth;
        ccWidth: number;
        ccHeight: number;
        private canvasFixedType;
        private _canvasClientWidth;
        private _canvasClientHeight;
        set canvasFixHeight(val: number);
        set canvasFixWidth(val: number);
        get canvasClientWidth(): number;
        get canvasClientHeight(): number;
        get scaleFromPandding(): number;
        private _scaleFromPandding;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引擎的启动方法
         * @param div 绘制区域的dom
         * @version gd3d 1.0
         */
        start(div: HTMLDivElement, type?: CanvasFixedType, val?: number, webglDebug?: boolean): void;
        startForCanvas(canvas: HTMLCanvasElement, type?: CanvasFixedType, val?: number, webglDebug?: boolean): void;
        markNotify(trans: any, type: NotifyType): void;
        private doNotify;
        /**
         * @private
         * @param trans
         */
        checkFilter(trans: any): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 显示性能参数面板
         * @version gd3d 1.0
         */
        showFps(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 关闭性能参数面板
         * @param div 绘制区域的dom
         * @version gd3d 1.0
         */
        closeFps(): void;
        showDrawCall(): void;
        closeDrawCall(): void;
        private _frameID;
        get frameID(): number;
        private beStepNumber;
        private update;
        private updateScreenAsp;
        private setScreenAsp;
        /**
         * @private
         */
        preusercodetimer: number;
        /**
         * @private
         */
        usercodetime: number;
        /**
         * @private
         */
        getUserUpdateTimer(): number;
        private beginTimer;
        private lastTimer;
        private totalTime;
        /**
         * @private
         */
        getTotalTime(): number;
        private _deltaTime;
        /**
         * @private
         */
        get deltaTime(): number;
        private pretimer;
        private updateTimer;
        /**
         * @private
         */
        getUpdateTimer(): any;
        /**
         * @private
         */
        isFrustumCulling: boolean;
        private loop;
        private _scene;
        private initScene;
        private initRender;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取场景实例
         * @version gd3d 1.0
         */
        getScene(): scene;
        private _assetmgr;
        private initAssetMgr;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源管理器实例
         * @version gd3d 1.0
         */
        getAssetMgr(): assetMgr;
        private _inputmgr;
        private initInputMgr;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取输入管理器实例
         * @version gd3d 1.0
         */
        getInputMgr(): inputMgr;
        private _userCode;
        private _userCodeNew;
        private _editorCode;
        private _editorCodeNew;
        /**
         * @private
         */
        be2dstate: boolean;
        curcameraindex: number;
        /**
         * 运行开关
         */
        bePlay: boolean;
        private _bePause;
        /**
         * @private
         */
        get bePause(): boolean;
        /**
         * @private
         */
        set bePause(value: boolean);
        private _beStepForward;
        /**
         * @private
         */
        get beStepForward(): boolean;
        /**
         * @private
         */
        set beStepForward(value: boolean);
        private updateUserCode;
        private updateEditorCode;
        private _beRendering;
        /**
         * 渲染开关
         */
        get beRendering(): boolean;
        set beRendering(val: boolean);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 直接添加usercode实例
         * @param program usercode实例
         * @version gd3d 1.0
         */
        addUserCodeDirect(program: IUserCode): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据classname添加usercode
         * @param classname usercode类名
         * @version gd3d 1.0
         */
        addUserCode(classname: string): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据classname添加editorcode
         * @param classname editorcode类名
         * @version gd3d 1.0
         */
        addEditorCode(classname: string): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 直接添加editorcode实例
         * @param program editorcode实例
         * @version gd3d 1.0
         */
        addEditorCodeDirect(program: IEditorCode): void;
        orientation: string;
        shouldRotate: boolean;
        private lastWidth;
        private lastHeight;
        OffOrientationUpdate: boolean;
        private updateOrientationMode;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * usercode接口
     * @version gd3d 1.0
     */
    interface IUserCode {
        onStart(app: gd3d.framework.application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * editorcode接口
     * @version gd3d 1.0
     */
    interface IEditorCode {
        onStart(app: gd3d.framework.application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
    const OrientationMode: {
        /**
         * 适配屏幕
         */
        AUTO: string;
        /**
         * 默认竖屏
         */
        PORTRAIT: string;
        /**
         * 默认横屏，舞台顺时针旋转90度
         */
        LANDSCAPE: string;
        /**
         * 默认横屏，舞台逆时针旋转90度
         */
        LANDSCAPE_FLIPPED: string;
    };
    /**
     * @private
     */
    function getPrefixStyleName(name: string, element?: any): string;
    /**
     * @private
     */
    function getPrefix(name: string, element: any): string;
}
declare namespace gd3d.framework {
    class DeviceInfo {
        private static debuginfo;
        private static getExtension;
        /**
         * GPU类型
         */
        static get GraphDevice(): string;
        /**
         * canvas 宽度
         */
        static get CanvasWidth(): number;
        /**
         * canvas 高度
         */
        static get CanvasHeight(): number;
        /**
         * 屏幕自适应方式
         */
        static get ScreenAdaptiveType(): string;
        /**
         * 屏幕宽度
         */
        static get ScreenWidth(): number;
        /**
         * 屏幕高度
         */
        static get ScreenHeight(): number;
    }
    enum DrawCallEnum {
        UI = 0,
        SKinrender = 1,
        Meshrender = 2,
        EffectSystem = 3
    }
    class DrawCallInfo {
        private static _inc;
        static get inc(): DrawCallInfo;
        static BeActived: boolean;
        data: number[];
        currentState: DrawCallEnum;
        reset(): void;
        add(): void;
        private SKinrenderDraw;
        private MeshrenderDraw;
        private EffectrenderDraw;
        private UIrenderDraw;
        private rootdiv;
        private initShowPlane;
        showPerFrame(): void;
        showDrawcallInfo(): void;
        closeDrawCallInfo(): void;
    }
}
declare namespace gd3d.framework {
    class error {
        static openQueue: boolean;
        static onError: (err: Error) => void;
        static push(err: Error): void;
    }
}
declare namespace gd3d.framework {
    interface IEnabled {
        /** 是否启用 */
        enabled: boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 组件实例接口
     * @version gd3d 1.0
     */
    interface INodeComponent {
        onPlay(): any;
        start(): any;
        update(delta: number): any;
        gameObject: gameObject;
        remove(): any;
        clone(): any;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d组件的接口
     * @version gd3d 1.0
     */
    interface I2DComponent {
        onPlay(): any;
        start(): any;
        update(delta: number): any;
        transform: transform2D;
        remove(): any;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d碰撞器接口
     * @version gd3d 1.0
     */
    interface ICollider2d {
        transform: transform2D;
        getBound(): obb2d;
        intersectsTransform(tran: transform2D): boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2D渲染组件的接口
     * @version gd3d 1.0
     */
    interface IRectRenderer extends I2DComponent {
        render(canvas: canvas): any;
        updateTran(): any;
        getMaterial(): material;
        getDrawBounds(): gd3d.math.rect;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 渲染器接口 继承自组件接口
     * @version gd3d 1.0
     */
    interface IRenderer extends INodeComponent {
        layer: RenderLayerEnum;
        renderLayer: number;
        queue: number;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): any;
    }
    /**
     *
     */
    interface IRendererGpuIns extends IRenderer {
        /** 是否开启 GPU Instancing 绘制 */
        isGpuInstancing(): boolean;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class sceneMgr {
        private static _ins;
        static get ins(): sceneMgr;
        static app: application;
        static scene: scene;
    }
}
declare namespace Stats {
    /**
     * @author mrdoob / http://mrdoob.com/
     * @modify lights translate -> typescript
     */
    /**
     * @private
     */
    class Stats {
        constructor(app: gd3d.framework.application);
        update(): void;
        app: gd3d.framework.application;
        container: HTMLDivElement;
        private mode;
        private REVISION;
        private beginTime;
        private prevTime;
        private frames;
        private fpsPanel;
        private msPanel;
        private memPanel;
        private ratePanel;
        private userratePanel;
        private showPanel;
        private addPanel;
        private begin;
        private end;
    }
}
declare namespace gd3d {
    var gd3d_reflect_root: any;
    namespace reflect {
        function isComp(type: string): any;
        /**
         * @private
         */
        function getPrototypes(): {
            [id: string]: any;
        };
        /**
         * @private
         */
        function getPrototype(name: string): any;
        /**
         * @private
         */
        function createInstance(prototype: any, matchTag: {
            [id: string]: string;
        }): any;
        /**
         * @private
         */
        function getClassName(prototype: any): any;
        /**
         * @private
         */
        function getClassTag(prototype: any, tag: string): any;
        /**
         * @private
         */
        function getMeta(prototype: any): any;
        /**
         * @private
         */
        function attr_Class(constructorObj: any): void;
        /**
         * @private
         */
        function attr_Func(customInfo?: {
            [id: string]: string;
        }): (target: any, propertyKey: string, value: any) => void;
        /**
         * @private
         */
        function attr_Field(customInfo?: {
            [id: string]: string;
        }): (target: Object, propertyKey: string) => void;
        /**
         * @private
         */
        function userCode(constructorObj: any): void;
        /**
         * @private
         */
        function editorCode(constructorObj: any): void;
        /**
         * @private
         */
        function selfClone(constructorObj: any): void;
        /**
         * @private
         */
        function nodeComponent(constructorObj: any): void;
        /**
         * @private
         */
        function nodeComponentInspector(constructorObj: any): void;
        /**
         * @private
         */
        function nodeRender(constructorObj: any): void;
        /**
         * @private
         */
        function nodeCamera(constructorObj: any): void;
        /**
         * @private
         */
        function nodeLight(constructorObj: any): void;
        /**
         * @private
         */
        function nodeBoxCollider(constructorObj: any): void;
        /**
         * @private
         */
        function nodeBoxCollider2d(constructorObj: any): void;
        /**
         * @private
         */
        function node2DPhysicsBody(constructorObj: any): void;
        /**
         * @private
         */
        function nodeSphereCollider(constructorObj: any): void;
        /**
         * @private
         */
        function nodeEffectBatcher(constructorObj: any): void;
        /**
         * @private
         */
        function nodeMeshCollider(constructorObj: any): void;
        /**
         * @private
         */
        function nodeCanvasRendererCollider(constructorObj: any): void;
        /**
         * @private
         */
        function node2DComponent(constructorObj: any): void;
        /**
         * @private
         */
        function pluginMenuItem(constructorObj: any): void;
        /**
         * @private
         */
        function pluginWindow(constructorObj: any): void;
        /**
         * @private
         */
        function pluginExt(constructorObj: any): void;
        /**
         * @private
         */
        function compValue(integer?: boolean, defvalue?: number, min?: number, max?: number): (target: Object, propertyKey: string) => void;
        /**
         * @private
         */
        function compCall(customInfo?: {
            [id: string]: string;
        }): (target: any, propertyKey: string, value: any) => void;
        /**
         * @private
         */
        function SerializeType(constructorObj: any): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * Field
         * @version gd3d 1.0
         * @param valueType 值类型
         * @param defaultValue 默认值
         * @param referenceType valueType 为 reference类型时 的具体类型
         */
        function Field(valueType: string, defaultValue?: any, referenceType?: string): (target: Object, propertyKey: string) => void;
        /**
         * Field的引用类型(修饰后，改字段将在 Inspector 中暴露 , 该函数是Field() 的封装 )
         * @param referenceType reference指定类型 支持:"transform"、"transform2D"、@reflect.node2DComponent、@reflect.nodeComponent
         * @param defaultValue 默认值
         */
        function FieldRef(referenceType: string, defaultValue?: any): (target: Object, propertyKey: string) => void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 属性面板提示修饰
         * @version gd3d 1.0
         */
        function UIComment(comment: string): (target: Object, propertyKey: string) => void;
        /**
         * @private
         */
        enum FieldUIStyle {
            None = 0,
            RangeFloat = 1,
            MultiLineString = 2,
            Enum = 3
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 属性面板显示方式修饰
         * @version gd3d 1.0
         */
        function UIStyle(style: string, min?: number, max?: number, defvalue?: any): (target: Object, propertyKey: string) => void;
    }
}
declare namespace gd3d.math {
    interface Ivec2 {
        x: number;
        y: number;
    }
    interface Ivec3 {
        x: number;
        y: number;
        z: number;
    }
    interface Iquat {
        x: number;
        y: number;
        z: number;
        w: number;
    }
    type byte = number;
    type ubyte = number;
    type short = number;
    type int = number;
    type ushort = number;
    type uint = number;
    type float = number;
    type double = number;
    function UByte(v?: number | string): ubyte;
    function Byte(v?: number | string): byte;
    function Int16(v?: number | string): short;
    function Int32(v?: number | string): int;
    function UInt16(v?: number | string): ushort;
    function UInt32(v?: number | string): uint;
    function Float(v?: number | string): float;
    function Double(v?: number | string): double;
    /**
     * @private
     */
    class vector2 implements Ivec2 {
        static readonly ClassName: string;
        constructor(x?: number, y?: number);
        x: number;
        y: number;
    }
    /**
     * @private
     */
    class rect {
        static readonly ClassName: string;
        constructor(x?: float, y?: float, w?: float, h?: float);
        x: number;
        y: number;
        w: number;
        h: number;
        toString(): string;
    }
    /**
     * @private
     */
    class border {
        static readonly ClassName: string;
        constructor(l?: float, t?: float, r?: float, b?: float);
        l: number;
        t: number;
        r: number;
        b: number;
        toString(): string;
    }
    /**
     * @private
     */
    class color {
        static readonly ClassName: string;
        constructor(r?: float, g?: float, b?: float, a?: float);
        r: number;
        g: number;
        b: number;
        a: number;
        toString(): string;
    }
    /**
     * @private
     */
    class vector3 implements Ivec3 {
        static readonly ClassName: string;
        constructor(x?: float, y?: float, z?: float);
        x: number;
        y: number;
        z: number;
        toString(): string;
    }
    /**
     * @private
     */
    class vector4 {
        static readonly ClassName: string;
        constructor(x?: float, y?: float, z?: float, w?: float);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    /**
     * @private
     */
    class quaternion implements Iquat {
        static readonly ClassName: string;
        constructor(x?: float, y?: float, z?: float, w?: float);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    /**
     * @private
     */
    class matrix {
        static readonly ClassName: string;
        rawData: Array<number>;
        constructor(datas?: Array<number>);
        toString(): string;
    }
    /**
     * @private
     */
    class matrix3x2 {
        rawData: Array<number>;
        constructor(datas?: Array<number>);
        toString(): string;
    }
    /**
     * 动态延长 Array
     */
    class ExtenArray<T extends Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array> {
        private bufferType;
        private _buffer;
        private _buoy;
        private _length;
        /** 定长数组 */
        get buffer(): T;
        /** 已经使用到数量 */
        get count(): number;
        set count(val: number);
        /**
         * 动态延长 Array
         * @param bufferType buffer类型
         * @param initSize 初始array 长度
         */
        constructor(bufferType: new (size: number) => T, initSize?: number);
        /** push添加到array */
        push(num: number): void;
        private exlength;
        /** 对象清理 */
        dispose(): void;
    }
    /**
     * 复用数组 ，用于频繁重复创建数组容器的场景(减少GC消耗)
     */
    class ReuseArray<T> {
        private arr;
        private buoy;
        /** 获取 Array 对象 */
        getArray(): T[];
        /** 获取当前长度 */
        get length(): number;
        set length(val: number);
        push(val: T): void;
        /** 获取指定索引的值 */
        get(index: number): T;
        /** 数组所有值置为null  */
        clear(): void;
    }
    function vec4FormJson(json: string, vec4: vector4): void;
    function vec3FormJson(json: string, vec3: vector3): void;
    function vec2FormJson(json: string, vec2: vector2): void;
    function colorFormJson(json: string, _color: color): void;
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d批处理类
     * @version gd3d 1.0
     */
    class batcher2D {
        private mesh;
        private drawMode;
        private vboCount;
        private curPass;
        private eboCount;
        private dataForVbo;
        private dataForEbo;
        /**
         * @private
         */
        initBuffer(webgl: WebGLRenderingContext, vf: render.VertexFormatMask, drawMode: render.DrawModeEnum): void;
        /**
         * @private
         */
        begin(webgl: WebGLRenderingContext, pass: render.glDrawPass): void;
        private static limitCount;
        /**
         * @private
         */
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[]): void;
        /**
         * @private
         */
        end(webgl: WebGLRenderingContext): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d节点的容器类
     * @version gd3d 1.0
     */
    class canvas {
        static readonly ClassName: string;
        private static readonly help_v2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 构造函数
         * @version gd3d 1.0
         */
        constructor();
        private _peCareListBuoy;
        private _pointEventCareList;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 用于区分当前容器是在overlay(2D)还是canvasrenderer(3D)下
         * @version gd3d 1.0
         */
        is2dUI: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * UI绘制使用深度排序规则
         * (可以降低drawcall , 但是会一定程度增加CPU计算量,视情况使用)
         * @version gd3d 1.0
         */
        isDrawByDepth: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         *  强行lable置顶渲染（用于优化Drawcall）
         * @version gd3d 1.0
         */
        isForceLabelTopRender: boolean;
        /**
         * 启用UI事件
         */
        enableUIEvent: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 如果是在canvasrenderer下，这里可以获取到canvasrenderer所在的transform节点
         * @version gd3d 1.0
         */
        parentTrans: transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 2d批处理类，用来收集2d节点，完成绘制
         * @version gd3d 1.0
         */
        batcher: batcher2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * webgl实例
         * @version gd3d 1.0
         */
        webgl: WebGLRenderingContext;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前所在场景
         * @version gd3d 1.0
         */
        scene: scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d节点
         * @param node 要添加的2d节点实例
         * @version gd3d 1.0
         */
        addChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除2d节点
         * @param node 要移除的2d节点实例
         * @version gd3d 1.0
         */
        removeChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所有孩子节点
         * @version gd3d 1.0
         */
        getChildren(): transform2D[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取孩子节点的数量
         * @version gd3d 1.0
         */
        getChildCount(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取指定的孩子节点
         * @param index 位置索引
         * @version gd3d 1.0
         */
        getChild(index: number): transform2D;
        private pointDown;
        private pointEvent;
        private pointX;
        private pointY;
        private lastWidth;
        private lastHeight;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 更新
         * @param delta 两次update的间隔时间
         * @param touch 是否接收到事件
         * @param XOnModelSpace 模型空间下的x偏移
         * @param YOnModelSpace 模型空间下的y偏移
         * @version gd3d 1.0
         */
        update(delta: number, touch: Boolean, XOnModelSpace: number, YOnModelSpace: number): void;
        private capturePointFlow;
        private popPointFlow;
        private objupdate;
        private lastMat;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染完成后的回调
         * @version gd3d 1.0
         */
        afterRender: Function;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染前回调
         * @version gd3d 1.0
         */
        beforeRender: Function;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染
         * @param context 渲染上下文
         * @param assetmgr 资源管理类的实例
         * @version gd3d 1.0
         */
        render(context: renderContext, assetmgr: assetMgr): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 提交原始数据</p>
         * 所有的2d渲染组件将数据提交到这里</p>
         * 最后由批处理完成绘制
         * @param mat 材质
         * @param data 2d渲染组件的顶点数据
         * @version gd3d 1.0
         */
        pushRawData(mat: material, data: number[]): void;
        private context;
        private lastMaskSta;
        private lastMaskV4;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 资源管理类的实例
         * @version gd3d 1.0
         */
        assetmgr: assetMgr;
        private static readonly helpLabelArr;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 绘制2d节点
         * @param node 要绘制的2d节点
         * @param context 渲染上下文
         * @param assetmgr 资源管理类的实例
         * @version gd3d 1.0
         */
        drawScene(node: transform2D, context: renderContext, assetmgr: assetMgr): void;
        private renderTopLabels;
        static readonly depthTag = "__depthTag__";
        static readonly flowIndexTag = "__flowIndexTag__";
        private rendererDic;
        private depthList;
        private sortedList;
        private canvasBounds;
        private readonly qt_maxObjNum;
        private readonly qt_maxlevel;
        private depthQTree;
        /** 按深度层 合批渲染 */
        private drawSceneByDepth;
        private helpMap;
        /** 排序Depth列表 */
        private sortDepthList;
        private flowCount;
        /**收集到深度列表 */
        private collectToDepthL;
        /**
         * 检查BottomUI
         */
        private checkBottomUI;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 画布使用的像素宽度
         * @version gd3d 1.0
         */
        pixelWidth: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 画布使用的像素高度
         * @version gd3d 1.0
         */
        pixelHeight: number;
        private rootNode;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取canvas的根节点
         * @version gd3d 1.0
         */
        getRoot(): transform2D;
        /**
         * [过时接口,完全弃用]
         * @version gd3d 1.0
         */
        ModelPosToCanvasPos(clipPos: math.vector2, outCanvasPos: math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 裁剪空间坐标 转到 canvas 坐标
         * @param clipPos 屏幕空间坐标
         * @param outCanvasPos canvas 坐标
         * @version gd3d 1.0
         */
        clipPosToCanvasPos(clipPos: math.vector2, outCanvasPos: math.vector2): void;
        /**
         * [过时接口,完全弃用]
         * @version gd3d 1.0
         */
        CanvasPosToModelPos(canvasPos: math.vector2, outClipPos: math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * canvas坐标 转到 裁剪空间坐标
         * @param canvasPos canvas坐标
         * @param outClipPos model空间坐标
         * @version gd3d 1.0
         */
        canvasPosToClipPos(canvasPos: math.vector2, outClipPos: math.vector2): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 3DUI的容器类</p>
     * 3d组件</p>
     * 与overlay(2DUI)相对应。
     * @version gd3d 1.0
     */
    class canvasRenderer implements IRenderer, ICollider {
        static readonly ClassName: string;
        /**
         * @private
         */
        constructor();
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 不受视锥剔除
         * @version gd3d 1.0
         */
        get dontFrustumCulling(): boolean;
        set dontFrustumCulling(val: boolean);
        /**
         * @private
         */
        subTran: transform;
        /**
         * @private
         */
        getBound(): any;
        /**
         * @private
         */
        intersectsTransform(tran: transform): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * layer类型
         * @version gd3d 1.0
         */
        layer: RenderLayerEnum;
        /**
         * @private
         */
        queue: number;
        gameObject: gameObject;
        canvas: canvas;
        inputmgr: inputMgr;
        cameraTouch: camera;
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d子节点
         * @version gd3d 1.0
         */
        addChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除2d子节点
         * @version gd3d 1.0
         */
        removeChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所有2d子节点
         * @version gd3d 1.0
         */
        getChildren(): transform2D[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点的数量
         * @version gd3d 1.0
         */
        getChildCount(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点
         * @param index 索引
         * @version gd3d 1.0
         */
        getChild(index: number): transform2D;
        private m_lastAsp;
        /**
         * @private
         */
        update(delta: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 射线碰撞 获取 Model坐标点
         * @param ray 射线
         * @param outModel Pos out获取到的Model坐标
         * @version gd3d 1.0
         */
        pickModelPos(ray: gd3d.framework.ray, outModelPos: math.vector2): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 射线拣选 全部 transform2D
         * @param ray 射线
         * @version gd3d 1.0
         */
        pickAll2d(ray: gd3d.framework.ray): transform2D[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 射线拣选transform2D
         * @param ray 射线
         * @version gd3d 1.0
         */
        pick2d(ray: gd3d.framework.ray): transform2D;
        private cupTans2ds;
        /**
         * Model坐标来拣选transform2D (从下至上递归)
         */
        private dopick2d;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 屏幕空间坐标 转到 canvas坐标
         * @version gd3d 1.0
         */
        calScreenPosToCanvasPos(camera: framework.camera, screenPos: gd3d.math.vector2, outCanvasPos: gd3d.math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * canvas坐标 转到 世界空间坐标
         * @param from Transform2D世界坐标
         * @param out 返回结果v2
         * @version gd3d 1.0
         */
        calCanvasPosToWorldPos(from: math.vector2, out: math.vector3): void;
        /**
         * @private
         */
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * UI 缩放模式
     */
    enum UIScaleMode {
        /** 固定像素尺寸*/
        CONSTANT_PIXEL_SIZE = 0,
        /**参考屏幕尺寸比例缩放*/
        SCALE_WITH_SCREEN_SIZE = 1
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2DUI的容器类，与canvasrender(3DUI)相对应。
     * @version gd3d 1.0
     */
    class overlay2D implements IOverLay {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 构造函数
         * @version gd3d 1.0
         */
        constructor();
        /**
         * @private
         * @language zh_CN
         * @classdesc
         * 是否初始化完成，在执行完start之后设置为true
         * @version gd3d 1.0
         */
        init: boolean;
        private camera;
        private app;
        private inputmgr;
        /**
         * @private
         */
        start(camera: camera): void;
        /**
         * @private
         */
        canvas: canvas;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 屏幕宽高匹配模式 (range 0-1  =0:固定宽  =1:固定高)
         * @version gd3d 1.0
         */
        screenMatchRate: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 屏幕匹配参考宽度
         * @version gd3d 1.0
         */
        matchReference_width: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 屏幕匹配参考高度
         * @version gd3d 1.0
         */
        matchReference_height: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 缩放模式
         *
         * 配合参数 ：
         * matchReference_height
         * matchReference_width
         * screenMatchRate
         * @version gd3d 1.0
         */
        scaleMode: UIScaleMode;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 渲染排序
        * @version gd3d 1.0
        */
        sortOrder: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加2d子节点
         * @param node 2d节点实例
         * @version gd3d 1.0
         */
        addChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除2d子节点
         * @param node 2d节点实例
         * @version gd3d 1.0
         */
        removeChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所有的2d子节点
         * @version gd3d 1.0
         */
        getChildren(): transform2D[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点的数量
         * @version gd3d 1.0
         */
        getChildCount(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取2d子节点
         * @param index 索引
         * @version gd3d 1.0
         */
        getChild(index: number): transform2D;
        /**
         * @private
         */
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        private readonly helpv2;
        private readonly helpv2_1;
        /**
         * @private
         */
        update(delta: number): void;
        private lastVPRect;
        private lastScreenMR;
        private lastMR_width;
        private lastMR_height;
        private ckScaleMode;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 事件检测
         * @param mx x偏移
         * @param my y偏移
         * @version gd3d 1.0
         */
        pick2d(mx: number, my: number, tolerance?: number): transform2D;
        /**
         * @private
         */
        private dopick2d;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 屏幕空间坐标 转到 canvas坐标
        * @version gd3d 1.0
        */
        calScreenPosToCanvasPos(screenPos: gd3d.math.vector2, outCanvasPos: gd3d.math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * canvas坐标 转到 屏幕空间坐标
         * @param canvasPos canvas坐标
         * @param outScreenPos 输出的屏幕空间坐标
         * @version gd3d 1.0
         */
        calCanvasPosToScreenPos(canvasPos: gd3d.math.vector2, outScreenPos: gd3d.math.vector2): void;
        /**
         * [过时接口,完全弃用]
         * @version gd3d 1.0
         */
        calScreenPosToModelPos(screenPos: gd3d.math.vector2, outClipPos: gd3d.math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 屏幕空间坐标 转到 裁剪空间坐标
         * @version gd3d 1.0
         * @param screenPos
         * @param outClipPos
         */
        calScreenPosToClipPos(screenPos: gd3d.math.vector2, outClipPos: gd3d.math.vector2): void;
        /**
         * [过时接口,完全弃用]
         * @version gd3d 1.0
         */
        calModelPosToScreenPos(clipPos: gd3d.math.vector2, outScreenPos: gd3d.math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * Model坐标 转到 屏幕空间坐标
         * @param clipPos 裁剪空间坐标
         * @param outScreenPos 输出的屏幕空间坐标
         * @version gd3d 1.0
         */
        calClipPosToScreenPos(clipPos: gd3d.math.vector2, outScreenPos: gd3d.math.vector2): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * UI布局选项
     * @version gd3d 1.0
     */
    enum layoutOption {
        LEFT = 1,
        TOP = 2,
        RIGHT = 4,
        BOTTOM = 8,
        H_CENTER = 16,
        V_CENTER = 32
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d Point事件流接口
     * @version gd3d 1.0
     */
    interface I2DPointListener {
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): any;
    }
    /**
     * 实例对象是 I2DPointListener
     * @param object
     */
    function instanceOfI2DPointListener(object: any): boolean;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2D组件实例接口
     * @version gd3d 1.0
     */
    class C2DComponent {
        static readonly ClassName: string;
        comp: I2DComponent;
        init: boolean;
        OnPlayed: boolean;
        constructor(comp: I2DComponent, init?: boolean);
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d的节点类<p/>
     * 相当于3d的tranform和gameobject的合集<p/>
     * 自身包含父子关系和组件
     * @version gd3d 1.0
     */
    class transform2D {
        static readonly ClassName: string;
        private static readonly help_v2;
        private static readonly help_v2_1;
        private static readonly help_mtx;
        private static readonly help_mtx_1;
        private _canvas;
        private static _transform2DMap;
        /**
         * 获取transform2D 通过 insID
         * @param id transform2D
         */
        static getTransform2DById(insID: number): transform2D;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 当前节点依赖的prefab路径，如果不依赖，则为空
        * @version gd3d 1.0
        */
        prefab: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点所属的canvas
         * @version gd3d 1.0
         */
        set canvas(val: canvas);
        get canvas(): canvas;
        /**
         * 启用 UI 布局功能
         */
        enableUILayout: boolean;
        /**
         * 启用 UI 矩形遮罩裁剪显示 功能
         */
        enableUIMaskRect: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象layer (取值范围0~31)
         * @version gd3d 1.0
         */
        layer: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象字符标签
         * @version gd3d 1.0
         */
        tag: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的名字
         * @version gd3d 1.0
         */
        name: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象是静态
         * @version gd3d 1.0
         */
        isStatic: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的父亲节点
         * @version gd3d 1.0
         */
        private _parent;
        get parent(): transform2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的孩子节点
         * @version gd3d 1.0
         */
        get children(): transform2D[];
        set children(children: transform2D[]);
        private _children;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的宽
         * @version gd3d 1.0
         */
        width: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的高
         * @version gd3d 1.0
         */
        height: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的中心点位置
         * @version gd3d 1.0
         */
        pivot: math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的hideFlag，用来控制2d节点各种形态下的显示隐藏
         * @version gd3d 1.0
         */
        hideFlags: HideFlags;
        private _visible;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点在场景中是否可见</p>
         * 如果其父节点不可见，其同样不可见
         * @version gd3d 1.0
         */
        get visibleInScene(): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的隐藏状态
         * @version gd3d 1.0
         */
        get visible(): boolean;
        set visible(val: boolean);
        /**
         * @private
         * @language zh_CN
         * @classdesc
         * 获取自身
         * @version gd3d 1.0
         */
        get transform(): this;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点的唯一id
         * @version gd3d 1.0
         */
        insId: insID;
        private dirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的位置
         * @version gd3d 1.0
         */
        localTranslate: math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的缩放
         * @version gd3d 1.0
         */
        localScale: math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前2d节点的旋转
         * @version gd3d 1.0
         */
        localRotate: number;
        private _maskrectId;
        /** 裁剪遮罩矩形 ID */
        get maskRectId(): string;
        private _maskRect;
        private _temp_maskRect;
        /** 裁剪遮罩矩形 */
        get maskRect(): math.rect;
        private _isMask;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点是否是mask
         * @version gd3d 1.0
         */
        get isMask(): boolean;
        set isMask(b: boolean);
        private updateMaskRect;
        private _parentIsMask;
        get parentIsMask(): boolean;
        private localMatrix;
        private worldMatrix;
        private canvasWorldMatrix;
        private worldRotate;
        private worldTranslate;
        private worldScale;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前2d节点添加子节点
         * @param node 要添加的子节点
         * @version gd3d 1.0
         */
        addChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前2d节点添加子节点,并插入到指定位置
         * @param node 要添加的子节点
         * @param index 要插入到的位置
         * @version gd3d 1.0
         */
        addChildAt(node: transform2D, index: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前2d节点移除子节点
         * @param 要移除的子节点
         * @version gd3d 1.0
         */
        removeChild(node: transform2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前2d节点移除所有子节点
         * @version gd3d 1.0
         */
        removeAllChild(needDispose?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 标记自身脏了
         * @version gd3d 1.0
         */
        markDirty(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 用脏机制来检查自身和子节点。更新位置、缩放、旋转等信息
         * @param parentChange 父节点是否发生变化
         * @version gd3d 1.0
         */
        updateTran(parentChange: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 更新整个节点结构
         * @version gd3d 1.0
         */
        updateWorldTran(): void;
        private CalcReCanvasMtx;
        /**
         * @private
         * 转换并拆解canvas坐标空间 RTS
         */
        private decomposeWorldMatrix;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的相对于canvas的位置
         * @version gd3d 1.0
         */
        getWorldTranslate(): math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的相对于canvas的缩放
         * @version gd3d 1.0
         */
        getWorldScale(): math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的相对于canvas的旋转
         * @version gd3d 1.0
         */
        getWorldRotate(): math.angelref;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的本地变换矩阵
         * @version gd3d 1.0
         */
        getLocalMatrix(): gd3d.math.matrix3x2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的世界变换矩阵
         * @version gd3d 1.0
         */
        getWorldMatrix(): gd3d.math.matrix3x2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的Canvas_世界_变换矩阵
         * @version gd3d 1.0
         */
        getCanvasWorldMatrix(): gd3d.math.matrix3x2;
        static getTransInfoInCanvas(trans: transform2D, out: t2dInfo): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置当前节点的相对于canvas的位置
         * @param pos 相对于canvas的位置
         * @version gd3d 1.0
         */
        setWorldPosition(pos: math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform是否被释放掉了
         * @version gd3d 1.0
         */
        get beDispose(): boolean;
        private _beDispose;
        onDispose: () => void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放当前节点，包括其子节点
         * @version gd3d 1.0
         */
        dispose(): void;
        private _dispose;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点的渲染组件，一个节点同时只能存在一个渲染组件
         * @version gd3d 1.0
         */
        renderer: IRectRenderer;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞盒组件 可为空
         * @version gd3d 1.0
         */
        collider: ICollider2d;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞盒组件 可为空
         * @version gd3d 1.0
         */
        physicsBody: I2DPhysicsBody;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点的所有组件
         * @version gd3d 1.0
         */
        components: C2DComponent[];
        componentTypes: {
            [key: string]: boolean;
        };
        private componentsInit;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件的初始化
         * @version gd3d 1.0
         */
        init(bePlay?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前节点添加一个组件
         * @param type 组件名称
         * @version gd3d 1.0
         */
        addComponent(type: string): I2DComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 为当前节点添加组件
         * @param comp 2d组件实例
         * @version gd3d 1.0
         */
        addComponentDirect(comp: I2DComponent): I2DComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除当前节点下的组件
         * @param comp 2d组件实例
         * @version gd3d 1.0
         */
        removeComponent(comp: I2DComponent): void;
        private clearOfCompRemove;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除当前节点下的组件
         * @param type 2d组件名称
         * @version gd3d 1.0
         */
        removeComponentByTypeName(type: string): C2DComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除当前节点下的所有组件
         * @param type 2d组件名称
         * @version gd3d 1.0
         */
        removeAllComponents(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点的指定组件实例
         * @param type 2d组件的名字
         * @version gd3d 1.0
         */
        getComponent(type: string): I2DComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点身上所有的组件
         * @version gd3d 1.0
         */
        getComponents(): I2DComponent[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前节点下所有的特定组件
         * @param type 组件名称
         * @version gd3d 1.0
         */
        getComponentsInChildren(type: string): I2DComponent[];
        /**
         * @private
         * 之前给编辑器开的接口
         * @param node
         * @param _type
         * @param comps
         */
        private getNodeCompoents;
        /**
         * 获取当前节点下及子节点第一个能找到的组件
         * @param type 组件名称
         */
        getFirstComponentInChildren(type: string): I2DComponent;
        /**
         * 获取节点的第一个组件
         * @param node
         * @param type
         */
        private getNodeFirstComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 检测以canvas为参考的位置，是否在节点的范围内
         * @param ModelPos 模型空间位置
         * @version gd3d 1.0
         */
        ContainsCanvasPoint(ModelPos: math.vector2, tolerance?: number): boolean;
        private readonly optionArr;
        private _layoutState;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 布局状态
         * @version gd3d 1.0
         */
        set layoutState(state: number);
        get layoutState(): number;
        private layoutValueMap;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 布局设定值
         * @version gd3d 1.0
         */
        setLayoutValue(option: layoutOption, value: number): void;
        getLayoutValue(option: layoutOption): number;
        private _layoutPercentState;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 布局百分比模式状态
         * @version gd3d 1.0
         */
        set layoutPercentState(state: number);
        get layoutPercentState(): number;
        private layoutDirty;
        private lastWidth;
        private lastHeight;
        private lastParentWidth;
        private lastParentHeight;
        private lastParentPivot;
        private lastPivot;
        private refreshLayout;
        private getLayValue;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置兄弟姐妹序列索引
         * @version gd3d 1.0
         */
        setSiblingIndex(siblingIndex: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取兄弟姐妹序列索引
         * @version gd3d 1.0
         */
        getSiblingIndex(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform2D的克隆
         * @version gd3d 1.0
         */
        clone(): transform2D;
    }
    class t2dInfo {
        pivot: math.vector2;
        pivotPos: math.vector2;
        width: number;
        height: number;
        rot: number;
        static getCenter(info: t2dInfo, outCenter: math.vector2): void;
    }
}
declare namespace gd3d.framework {
    class behaviour2d implements I2DComponent, IEnabled {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件启用
         * @version gd3d 1.0
         */
        enabled: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的transform
         * @version gd3d 1.0
         */
        transform: transform2D;
        /** 初始化使用 */
        start(): void;
        /** 初始化使用  在start 之后*/
        onPlay(): void;
        /** 每帧调用一次 */
        update(delta: number): void;
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 2d矩形碰撞盒
    * @version gd3d 1.0
    */
    class boxcollider2d implements I2DComponent, ICollider2d {
        static readonly ClassName: string;
        transform: transform2D;
        private _obb;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取obb2d
        * @version gd3d 1.0
        */
        getBound(): obb2d;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 检测碰撞
        * @version gd3d 1.0
        */
        intersectsTransform(tran: transform2D): boolean;
        /**
       * @private
       * @language zh_CN
       * @classdesc
       * 构建碰撞盒
       * @version gd3d 1.0
       */
        private build;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 刷新成碰撞框完全覆盖transform
        * @version gd3d 1.0
        */
        refreshTofullOver(): void;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 按钮变换类型
     * @version gd3d 1.0
     */
    enum TransitionType {
        None = 0,
        ColorTint = 1,
        SpriteSwap = 2
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d按钮组件
     * @version gd3d 1.0
     */
    class button implements I2DComponent, event.IUIEventer, I2DPointListener {
        static readonly ClassName: string;
        /** 开启 交互时 路径派发 */
        static enablePathDispatch: boolean;
        /**
         * 按钮交互时 调用路径返回（需要 enablePathDispatch == true）
         */
        static onPath: (path: string) => any;
        private _transition;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按钮变换类型
         * @version gd3d 1.0
         */
        get transition(): TransitionType;
        set transition(transition: TransitionType);
        private _originalColor;
        private _originalSprite;
        private _origianlSpriteName;
        private _pressedSpriteName;
        private _targetImage;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 默认显示图像
         * @version gd3d 1.0
         */
        get targetImage(): image2D;
        set targetImage(graphic: image2D);
        private _pressedSprite;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按下时要显示的sprite
         * @version gd3d 1.0
         */
        get pressedGraphic(): sprite;
        set pressedGraphic(sprite: sprite);
        private _normalColor;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 正常的显示颜色
         * @version gd3d 1.0
         */
        get normalColor(): math.color;
        set normalColor(color: math.color);
        private _pressedColor;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按下后的颜色
         * @version gd3d 1.0
         */
        get pressedColor(): math.color;
        set pressedColor(color: math.color);
        private _fadeDuration;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 颜色淡出持续时间
         * @version gd3d 1.0
         */
        get fadeDuration(): number;
        set fadeDuration(duration: number);
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @private
         */
        update(delta: number): void;
        transform: transform2D;
        /**
         * @private
         */
        remove(): void;
        private downPointV2;
        private isMovedLimit;
        private readonly movedLimit;
        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 点击事件
         * @version gd3d 1.0
         */
        private UIEventer;
        /**
        * 添加UI事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addListener(eventEnum: event.UIEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 移除事件监听者
         * @param event 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeListener(eventEnum: event.UIEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        private _downInThis;
        private _dragOut;
        /**
         * @private
         */
        private showNormal;
        /**
         * @private
         */
        private showPress;
        private tryGetSprite;
        /**
         * @private
         */
        private changeColor;
        /**
         * @private
         */
        private changeSprite;
        /** 计算path */
        private caclePath;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d图片组件
     * @version gd3d 1.0
     */
    class image2D implements IRectRenderer {
        static readonly ClassName: string;
        /**
         * @private
         */
        constructor();
        private _unitLen;
        private datar;
        private _sprite;
        private needRefreshImg;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 颜色
         * @version gd3d 1.0
         */
        color: math.color;
        private static readonly defUIShader;
        private static readonly defMaskUIShader;
        private _CustomShaderName;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置rander Shader名字
         * @version gd3d 1.0
         */
        setShaderByName(shaderName: string): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取rander 的材质
         * @version gd3d 1.0
         */
        getMaterial(): material;
        private _darwRect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取渲染绘制矩形边界
         * @version gd3d 1.0
         */
        getDrawBounds(): math.rect;
        /**
         * @private
         * ui默认材质
         */
        private _uimat;
        private get uimat();
        private _imageType;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 图片显示模式
         * @version gd3d 1.0
         */
        get imageType(): ImageType;
        set imageType(type: ImageType);
        private _fillMethod;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 图片填充方式
         * @version gd3d 1.0
         */
        get fillMethod(): FillMethod;
        set fillMethod(method: FillMethod);
        private _fillAmmount;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 填充率
         * @version gd3d 1.0
         */
        get fillAmmount(): number;
        set fillAmmount(ammount: number);
        transform: transform2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 精灵
         * @version gd3d 1.0
         */
        set sprite(sprite: sprite);
        get sprite(): sprite;
        private _spriteName;
        private _imageBorder;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 9宫格边距
         * @version gd3d 1.0
         */
        get imageBorder(): math.border;
        /**
         * @private
         */
        render(canvas: canvas): void;
        private searchTexture;
        private _cacheMaskV4;
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @private
         */
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         * 根据显示方式来准备数据
         */
        private prepareData;
        /**
         * @private
         */
        updateTran(): void;
        private min_x;
        private max_x;
        private min_y;
        private max_y;
        /** 计算drawRect */
        private calcDrawRect;
        /**
         * @private
         * 更新quad的顶点数据
         */
        private updateQuadData;
        /**
         * @private
         * 更新常规数据
         */
        private updateSimpleData;
        /**
         * @private
         * 更新9宫数据
         */
        private updateSlicedData;
        /**
         * @private
         * 更新填充数据
         */
        private updateFilledData;
        /**
         * @private
         * 更新瓦片数据。这里只是没有border的瓦片。如果有border就要复杂很多
         */
        private updateTiledData;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 贴图的显示方式
     * @version gd3d 1.0
     */
    enum ImageType {
        Simple = 0,
        Sliced = 1,
        Tiled = 2,
        Filled = 3
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 更新瓦片数据。这里只是没有border的瓦片。如果有border就要复杂很多
     * @version gd3d 1.0
     */
    enum FillMethod {
        Horizontal = 0,
        Vertical = 1,
        Radial_90 = 2,
        Radial_180 = 3,
        Radial_360 = 4
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本输入框
     * @version gd3d 1.0
     */
    class inputField implements I2DComponent, I2DPointListener {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version gd3d 1.0
         */
        transform: transform2D;
        private _frameImage;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 底框显示图像
         * @version gd3d 1.0
         */
        get frameImage(): image2D;
        set frameImage(frameImg: image2D);
        private customRegexStr;
        private beFocus;
        private inputElement;
        private _text;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文字内容
         * @version gd3d 1.0
         */
        get text(): string;
        private _charlimit;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 限制输入字符数
         * @version gd3d 1.0
         */
        get characterLimit(): number;
        set characterLimit(charlimit: number);
        private _lineType;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文本行格式
         * @version gd3d 1.0
         */
        get LineType(): lineType;
        set LineType(lineType: lineType);
        private _contentType;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 文本内容格式
        * @version gd3d 1.0
        */
        get ContentType(): number;
        set ContentType(contentType: number);
        private _textLable;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version gd3d 1.0
         */
        get TextLabel(): label;
        set TextLabel(textLabel: label);
        private _placeholderLabel;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version gd3d 1.0
         */
        get PlaceholderLabel(): label;
        set PlaceholderLabel(placeholderLabel: label);
        /**
         * 刷新布局
         */
        private layoutRefresh;
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
        * @private
        * inputElement 位置、宽高刷新
        */
        private inputElmLayout;
        /**
         * @private
         * 输入文本刷新
         */
        private textRefresh;
        private filterContentText;
        /**
         * @private
         */
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 文本行显示方式
     * @version gd3d 1.0
     */
    enum lineType {
        SingleLine = 0,
        MultiLine = 1
    }
    /**
     * @language zh_CN
     * @classdesc
     * 文本内容类型
     * @version gd3d 1.0
     */
    enum contentType {
        None = 0,
        Number = 1,
        Word = 2,
        Underline = 4,
        ChineseCharacter = 8,
        NoneChineseCharacter = 16,
        Email = 32,
        PassWord = 64,
        Custom = 128
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d文本组件
     * @version gd3d 1.0
     */
    class label implements IRectRenderer {
        /** 尝试 动态扩展 字体信息 函数接口 */
        static onTryExpandTexts: (str: string) => void;
        static readonly ClassName: string;
        /**字段 用于快速判断实例是否是label */
        readonly isLabel = true;
        private _text;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文字内容
         * @version gd3d 1.0
         */
        get text(): string;
        set text(text: string);
        private initdater;
        private _font;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体
         * @version gd3d 1.0
         */
        get font(): font;
        set font(font: font);
        private needRefreshFont;
        private _fontName;
        private _fontsize;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体大小
         * @version gd3d 1.0
         */
        get fontsize(): number;
        set fontsize(size: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 行高
         * @version gd3d 1.0
         */
        linespace: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平排列方式
         * @version gd3d 1.0
         */
        horizontalType: HorizontalType;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直排列方式
         * @version gd3d 1.0
         */
        verticalType: VerticalType;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否横向溢出
         * @version gd3d 1.0
         */
        horizontalOverflow: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否竖向溢出
         * @version gd3d 1.0
         */
        verticalOverflow: boolean;
        private indexarr;
        private remainarrx;
        private lastStr;
        /** 检查文字,是否需要 动态添加 */
        private chackText;
        /**
         * @private
         */
        updateData(_font: gd3d.framework.font): void;
        private data_begin;
        private datar;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 填充颜色
         * @version gd3d 1.0
         */
        color: math.color;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 描边颜色
         * @version gd3d 1.0
         */
        color2: math.color;
        /**
         * 描边宽度
         */
        outlineWidth: number;
        private static readonly defUIShader;
        private static readonly defMaskUIShader;
        private _CustomShaderName;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置rander Shader名字
         * @version gd3d 1.0
         */
        setShaderByName(shaderName: string): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取rander 的材质
         * @version gd3d 1.0
         */
        getMaterial(): material;
        private _darwRect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取渲染绘制矩形边界
         * @version gd3d 1.0
         */
        getDrawBounds(): math.rect;
        /**
          * @private
          * ui默认材质
          */
        private _uimat;
        private get uimat();
        private dirtyData;
        /**
         * @private
         */
        render(canvas: canvas): void;
        private searchTexture;
        private _cacheMaskV4;
        /**
         * @private
         */
        updateTran(): void;
        private min_x;
        private max_x;
        private min_y;
        private max_y;
        /** 计算drawRect */
        private calcDrawRect;
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @private
         */
        update(delta: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version gd3d 1.0
         */
        transform: transform2D;
        /**
         * @private
         */
        remove(): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 横向显示方式
     * @version gd3d 1.0
     */
    enum HorizontalType {
        Center = 0,
        Left = 1,
        Right = 2
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 纵向显示方式
     * @version gd3d 1.0
     */
    enum VerticalType {
        Center = 0,
        Top = 1,
        Boom = 2
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 进度条
     * @version gd3d 1.0
     */
    class progressbar implements I2DComponent {
        static readonly ClassName: string;
        private _cutPanel;
        /**
         * 裁切容器
         */
        get cutPanel(): transform2D;
        set cutPanel(trans: transform2D);
        private _barBg;
        /**
         * 进度条 背景图
         */
        get barBg(): image2D;
        set barBg(img: image2D);
        private _barOverImg;
        /**
         * 进度条 上层覆盖图
         */
        get barOverImg(): image2D;
        set barOverImg(img: image2D);
        private _value;
        /**
         * 进度值 0-1
         */
        get value(): number;
        set value(value: number);
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @private
         */
        update(delta: number): void;
        private refreshBar;
        /** 调整overimg 宽高*/
        private adjustOverImg;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version gd3d 1.0
         */
        transform: transform2D;
        /**
         * @private
         */
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d图片组件</p>
     * 参照UGUI的思路，rawImage只拿整个图片来显示，不关心Sprite、九宫、填充等。这些统一都在iamge中处理
     * @version gd3d 1.0
     */
    class rawImage2D implements IRectRenderer {
        static readonly ClassName: string;
        private datar;
        private _image;
        private needRefreshImg;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 图片
         * @version gd3d 1.0
         */
        get image(): texture;
        set image(_image: texture);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 颜色
         * @version gd3d 1.0
         */
        color: math.color;
        private static readonly defUIShader;
        private static readonly defMaskUIShader;
        private _CustomShaderName;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置rander Shader名字
         * @version gd3d 1.0
         */
        setShaderByName(shaderName: string): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取rander 的材质
         * @version gd3d 1.0
         */
        getMaterial(): material;
        private _darwRect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取渲染绘制矩形边界
         * @version gd3d 1.0
         */
        getDrawBounds(): math.rect;
        /**
         * @private
         * ui默认材质
         */
        private _uimat;
        private get uimat();
        /**
         * @private
         */
        render(canvas: canvas): void;
        private _cacheMaskV4;
        /**
         * @private
         */
        updateTran(): void;
        private min_x;
        private max_x;
        private min_y;
        private max_y;
        /** 计算drawRect */
        private calcDrawRect;
        /**
         * @private
         */
        start(): void;
        onPlay(): void;
        /**
         * @private
         */
        update(delta: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前组件的2d节点
         * @version gd3d 1.0
         */
        transform: transform2D;
        /**
         * @private
         */
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 矩形卷轴
    * @version gd3d 1.0
    */
    class scrollRect implements I2DComponent, I2DPointListener {
        static readonly ClassName: string;
        private _content;
        private static helpv2;
        private static helpv2_1;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 输入内容label
         * @version gd3d 1.0
         */
        get content(): transform2D;
        set content(content: transform2D);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平滑动开启
         * @version gd3d 1.0
         */
        horizontal: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直滑动开启
         * @version gd3d 1.0
         */
        vertical: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 滑动惯性
         * @version gd3d 1.0
         */
        inertia: boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 惯性减速率
        * @version gd3d 1.0
        */
        decelerationRate: number;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        transform: transform2D;
        pauseSlide: boolean;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
        private isPointDown;
        private lastPoint;
        private strPoint;
        private strPos;
        private SlideTo;
        private readonly collectNum;
        private points;
        private collectPointing;
        private flyVelocity;
        private onInertiaSliderUp;
        private canfly;
        private readonly threshold;
        private readonly cgTime;
        private cgCount;
        private lastfv;
        private flyingSlidr;
        onMoveFun: (x: number, y: number) => {};
        onDownFun: (x: number, y: number) => {};
        onUpFun: () => {};
        onSlideEndFun: () => {};
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 滑动区域
    * @version gd3d 1.0
    */
    class slideArea implements I2DComponent, I2DPointListener {
        static readonly ClassName: string;
        private static helpv2;
        private static helpv2_1;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 水平滑动开启
         * @version gd3d 1.0
         */
        horizontal: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 垂直滑动开启
         * @version gd3d 1.0
         */
        vertical: boolean;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        transform: transform2D;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
        onMoveFun: (x: number, y: number) => {};
        onDownFun: (x: number, y: number) => {};
        onUpFun: () => {};
        private isPointDown;
        private lastPoint;
        private strPoint;
        remove(): void;
    }
}
declare namespace gd3d.framework {
    class uirect implements I2DComponent {
        static readonly ClassName: string;
        canbeClick: boolean;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        transform: transform2D;
        remove(): void;
    }
}
declare namespace gd3d.math {
    function matrixGetTranslation(src: matrix, out: vector3): void;
    /**
    * @language zh_CN
    * 当前矩阵转置
    * @version gd3d 1.0
    * @platform Web,Native
    */
    function matrixTranspose(src: matrix, out: matrix): void;
    function matrixDecompose(src: matrix, scale: vector3, rotation: quaternion, translation: vector3): boolean;
    class angelref {
        v: number;
    }
    function matrix3x2Decompose(src: matrix3x2, scale: vector2, rotation: angelref, translation: vector2): boolean;
    function matrixGetEuler(src: matrix, order: RotationOrder, rotation: vector3): void;
    function matrixGetRotation(src: matrix, result: quaternion): void;
    function matrix2Quaternion(matrix: matrix, result: quaternion): void;
    function unitxyzToRotation(xAxis: vector3, yAxis: vector3, zAxis: vector3, out: quaternion): void;
    function matrixClone(src: matrix, out: matrix): void;
    function matrix3x2Clone(src: matrix3x2, out: matrix3x2): void;
    function matrixMakeIdentity(out: matrix): void;
    function matrix3x2MakeIdentity(out: matrix3x2): void;
    function matrixInverse(src: matrix, out: matrix): void;
    function matrix3x2Inverse(src: matrix3x2, out: matrix3x2): void;
    function matrixMakeTransformRTS(pos: vector3, scale: vector3, rot: quaternion, out: matrix): void;
    function matrix3x2MakeTransformRTS(pos: vector2, scale: vector2, rot: number, out: matrix3x2): void;
    function matrixMakeTranslate(x: number, y: number, z: number, out: matrix): void;
    function matrix3x2MakeTranslate(x: number, y: number, out: matrix3x2): void;
    function matrixGetScale(src: matrix, scale: vector3): void;
    function matrixMakeScale(xScale: number, yScale: number, zScale: number, out: matrix): void;
    function matrix3x2TransformVector2(mat: matrix, inp: vector2, out: vector2): void;
    function matrix3x2TransformNormal(mat: matrix, inp: vector2, out: vector2): void;
    function matrix3x2MakeScale(xScale: number, yScale: number, out: matrix3x2): void;
    /**
     * 从欧拉旋转初始化矩阵
     *
     * @param rotation 旋转弧度值
     * @param order 旋转顺序
     * @param out 输出矩阵
     */
    function matrixMakeEuler(rotation: vector3, order: RotationOrder, out: matrix): void;
    function matrixMakeRotateAxisAngle(axis: vector3, angle: number, out: matrix): void;
    function matrix3x2MakeRotate(angle: number, out: matrix3x2): void;
    function matrixMultiply(lhs: matrix, rhs: matrix, out: matrix): void;
    function matrix3x2Multiply(lhs: matrix3x2, rhs: matrix3x2, out: matrix3x2): void;
    function matrix3x2Equal(mtx1: matrix3x2, mtx2: matrix3x2, threshold?: number): boolean;
    function matrixProject_PerspectiveLH(fov: number, aspect: number, znear: number, zfar: number, out: matrix): void;
    function matrixProject_OrthoLH(width: number, height: number, znear: number, zfar: number, out: matrix): void;
    /**
     * 看向目标位置
     *
     * @param position  所在位置
     * @param target    目标位置
     * @param upAxis    向上朝向
     */
    function matrixLookat(position: vector3, target: vector3, upAxis: vector3, out: matrix): void;
    function matrixLookatLH(forward: vector3, up: vector3, out: matrix): void;
    function matrixViewLookatLH(eye: vector3, forward: vector3, up: vector3, out: matrix): void;
    function matrixLerp(left: matrix, right: matrix, v: number, out: matrix): void;
    function matrixTransformVector3(vector: vector3, transformation: matrix, result: vector3): void;
    function matrixTransformVector4(src: gd3d.math.vector4, mtx: gd3d.math.matrix, out: gd3d.math.vector4): void;
    function matrixTransformNormal(vector: vector3, transformation: matrix, result: vector3): void;
    function matrixGetVector3ByOffset(src: matrix, offset: number, result: vector3): void;
    function matrixReset(mat: matrix): void;
    function matrixZero(mat: matrix): void;
    function matrixScaleByNum(value: number, mat: matrix): void;
    function matrixAdd(left: matrix, right: matrix, out: matrix): void;
    function matrixEqual(mtx1: matrix, mtx2: matrix, threshold?: number): boolean;
    function matrixIsIdentity(mtx: matrix): boolean;
}
declare namespace gd3d.framework {
    interface I2DPhysicsBody {
        /** 初始化完成回调 */
        onInit: (phy2dBody: I2DPhysicsBody) => any;
        /** 引擎对象 */
        physicsEngine: physicEngine2D;
        /** body 选项数据*/
        options: I2dPhyBodyData;
        /** 绑定的UI */
        transform: transform2D;
        /** 物理世界body */
        body: Ibody;
        /** 施加力 */
        addForce(Force: math.Ivec2): any;
        /**设置 速度*/
        setVelocity(velocity: math.Ivec2): any;
        /**设置 密度*/
        setDensity(Desity: number): any;
        /**设置 空气摩擦系数*/
        setFrictionAir(frictionAir: number): any;
        /**设置 摩擦系数*/
        setFriction(friction: number): any;
        /**设置 静态摩擦系数*/
        setFrictionStatic(frictionStatic: number): any;
        /**设置 恢复系数*/
        setRestitution(restitution: number): any;
        /** 设置质量 */
        setMass(mass: number): any;
        /**设置位置 */
        setPosition(pos: math.Ivec2): any;
        /** 设置旋转角度 */
        setAngle(angle: number): any;
        /** 设置成员 */
        setParts(parts: Ibody[], autoHull: boolean): any;
        /** 设置顶点 */
        setVertices(vertices: math.Ivec2[]): any;
        /** 设置惯性值*/
        setInertia(Inertia: number): any;
        /**设置角速度 */
        setAngularVelocity(velocity: number): any;
        /**是否睡眠 */
        isSleeping(): boolean;
        /** 是否是传感器*/
        isSensor(): boolean;
        /**是否是静态 */
        isStatic(): boolean;
        beforeStep(): any;
        afterStep(): any;
    }
    interface I2dPhyBodyData {
        mass?: number;
        density?: number;
        inertia?: number;
        restitution?: number;
        frictionStatic?: number;
        frictionAir?: number;
        friction?: number;
        collisionFilter?: collisionFilter;
        slop?: number;
        isStatic?: boolean;
        isSensor?: boolean;
        type?: string;
        tag?: string;
        name?: string;
        chamfer?: number;
        label?: string;
        parts?: Ibody[];
        plugin?: {};
        angle?: number;
        vertices?: math.Ivec2[];
        position?: math.Ivec2;
        force?: math.Ivec2;
        torque?: number;
        positionImpulse?: math.Ivec2;
        previousPositionImpulse?: math.Ivec2;
        totalContacts?: number;
        speed?: number;
        angularSpeed?: number;
        velocity?: math.Ivec2;
        angularVelocity?: number;
        isSleeping?: boolean;
        motion?: number;
        sleepThreshold?: number;
        timeScale?: number;
        events?: any;
        bounds?: any;
        circleRadius?: number;
        positionPrev?: any;
        anglePrev?: number;
        parent?: any;
        axes?: any;
        area?: number;
        _original?: any;
    }
    /**
     * 2d 物理引擎Body 组件父对象
     * （本组件不会创建具体物理对象，需要使用子类对象 或者 自行在onInit回调中创建）
     */
    abstract class physics2DBody extends behaviour2d implements I2DPhysicsBody {
        private static helpV2;
        private static helpV2_1;
        private static helpRefAngle;
        /** 2d物理引擎实例对象 */
        get physicsEngine(): physicEngine2D;
        protected _physicsEngine: physicEngine2D;
        constructor();
        private lastScale;
        private beforePos;
        private beforeAngle;
        private _bodyLocalMtx;
        private _bodyWorldMtx;
        private enableBT;
        transform: transform2D;
        body: Ibody;
        /** 物理对象初始化完成回调 */
        onInit: (phy2dBody: I2DPhysicsBody) => any;
        private _positionOffset;
        /** 物理对象 碰撞体位置偏移量 */
        get positionOffset(): math.vector2;
        set positionOffset(pos: math.vector2);
        /** 是否已休眠
        * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
        * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
         */
        isSleeping(): boolean;
        /** 是否是静态
        * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
        * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
         */
        isStatic(): boolean;
        /** 是否是传感器
         * A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
         */
        isSensor(): boolean;
        /**
         * 施加作用力
         * @param Force
         */
        addForce(Force: math.Ivec2): void;
        /**
         * 设置速度
         * @param velocity
         */
        setVelocity(velocity: math.Ivec2): void;
        /**
         * 设置角速度
         * @param velocity
         */
        setAngularVelocity(velocity: number): void;
        /**
         * 设置密度
         * @param Desity
         */
        setDensity(Desity: number): void;
        /**
         * 设置空气摩擦力
         * @param frictionAir
         */
        setFrictionAir(frictionAir: number): void;
        /**
         * 设置摩擦力
         * @param friction
         */
        setFriction(friction: number): void;
        /**
         * 设置静态摩擦力
         * @param frictionStatic
         */
        setFrictionStatic(frictionStatic: number): void;
        /**
         * 设置还原张力
         * @param restitution
         */
        setRestitution(restitution: number): void;
        /**
         * 设置质量
         * @param mass
         */
        setMass(mass: number): void;
        options: I2dPhyBodyData;
        /**
         * 设置选项数据
         * @param options 选项数据
         */
        setInitData(options: I2dPhyBodyData): void;
        /**
         * 设置位置
         * @param pos 位置vec2
         */
        setPosition(pos: math.Ivec2): void;
        private setPositionByPhy;
        /**
         * 设置旋转角度
         * @param angle
         */
        setAngle(angle: number): void;
        private setAngleByPhy;
        private bodyWorldScale;
        setScale(scale: math.Ivec2): void;
        /** 设置静态状态
         * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
         */
        setStatic(isStatic: boolean): void;
        /** 设置休眠状态
         */
        setSleeping(isSleeping: boolean): void;
        /** 设置惯性值
         * Sets the moment of inertia (i.e. second moment of area) of the body.
         * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
         */
        setInertia(Inertia: number): void;
        /** 设置顶点
        * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
        * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
        * They are then automatically translated to world space based on `body.position`.
        *
        * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
        * Vertices must form a convex hull, concave hulls are not supported.
        */
        setVertices(vertices: math.Ivec2[]): void;
        /** 设置成员
        * Sets the parts of the `body` and updates mass, inertia and centroid.
        * Each part will have its parent set to `body`.
        * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
        * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
        */
        setParts(parts: Ibody[], autoHull?: boolean): void;
        /** 设置中心点
        * Set the centre of mass of the body.
        * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
        * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
        * This is equal to moving `body.position` but not the `body.vertices`.
        * Invalid if the `centre` falls outside the body's convex hull.
        */
        setCentre(centre: math.Ivec2, relative?: boolean): void;
        start(): void;
        update(delta: number): void;
        beforeStep(): void;
        afterStep(): void;
        private lastPos;
        private lastRot;
        private setPhyBodyTransformation;
        private setTransformationFormPhyBody;
        remove(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 胶囊体 2d刚体 （图形的朝向会根据 transform 的宽和高来适配）
    * @version gd3d 1.0
    */
    class capsuleBody2d extends physics2DBody {
        static readonly ClassName: string;
        transform: transform2D;
        /** 胶囊体朝向为 Y 轴 */
        get y_Axis(): boolean;
        maxSides: number;
        start(): void;
        onPlay(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 圆形 2d刚体
    * @version gd3d 1.0
    */
    class circleBody2d extends physics2DBody {
        static readonly ClassName: string;
        transform: transform2D;
        /** 圆形的半径（取 宽和高两者之间最大的值为半径） */
        get radius(): number;
        maxSides: number;
        start(): void;
        onPlay(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 复合 2d 刚体
    * @version gd3d 1.0
    */
    class compoundBody2d extends physics2DBody {
        static readonly ClassName: string;
        transform: transform2D;
        private _bodys;
        start(): void;
        /** 添加部分 body */
        addPart(body: Ibody): void;
        onPlay(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 多面凸包 2d刚体
    * @version gd3d 1.0
    */
    class convexHullBody2d extends physics2DBody {
        static readonly ClassName: string;
        vertexSets: math.vector2[];
        flagInternal: boolean;
        removeCollinear: number;
        minimumArea: number;
        transform: transform2D;
        start(): void;
        private fixCenter;
        private calceBoundingCenter;
        onPlay(): void;
    }
}
declare namespace gd3d.framework {
    interface Itiming {
        /** 默认值 ： 0 */
        timeScale?: number;
        /** 默认值 ： 1  */
        timestamp?: number;
    }
    interface IEngine2DOP {
        /** 默认值 ： 6 */
        positionIterations?: number;
        /** 默认值 ： 4 */
        velocityIterations?: number;
        /** 默认值 ： 2  */
        constraintIterations?: number;
        /** 默认值 : fales */
        enableSleeping?: boolean;
        timing?: Itiming;
        /** 默认值 : {bucketWidth: 48, bucketHeight: 48} */
        broadphase?: {
            bucketWidth: number;
            bucketHeight: number;
        };
        /** 循环器的设定帧率 , 默认值 : 60 */
        runnerFps?: any;
        /** 循环器是否应使用固定的timestep（deltaTime），默认值：false   */
        runnerIsFixed?: any;
    }
    interface IWorld {
        gravity: {
            x: number;
            y: number;
            scale: number;
        };
        bounds: {
            min: math.Ivec2;
            max: math.Ivec2;
        };
    }
    interface IRunner {
        tick(delta: number): any;
    }
    class physicEngine2D {
        private _Matter;
        get Matter(): any;
        matterEngine: any;
        engineWorld: IWorld;
        engineRunner: IRunner;
        private eventer;
        private _bodysObjMap;
        constructor(op?: IEngine2DOP);
        private RunnerTick;
        private beforeStep;
        private afterStep;
        update(delta: number): void;
        /** Matter.Engine update 调用前 */
        private beforeUpdate;
        /** Matter.Engine update 调用之后 */
        private afterUpdate;
        /** 开始碰撞 ， Matter.Engine update 调用之后 */
        private collisionStart;
        /** 碰撞持续中， Matter.Engine update 调用之后 */
        private collisionActive;
        /** 碰撞结束 ， Matter.Engine update 调用之后 */
        private collisionEnd;
        /**
         * 添加事件监听
         * @param eventEnum 事件类型
         * @param func 事件回调函数
         * @param thisArg 函数持有对象
         */
        addEventListener(eventEnum: event.Physic2dEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 移除事件监听
         * @param eventEnum 事件类型
         * @param func 事件回调函数
         * @param thisArg 函数持有对象
         */
        removeEventListener(eventEnum: event.Physic2dEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 创建一个新的矩形Body
         * @param pBody I2DPhysicsBody 实例
         */
        createRectByPBody(pBody: I2DPhysicsBody): Ibody;
        /**
         * 创建一个新的圆形Body
         * @param pBody I2DPhysicsBody 实例
         * @param radius 半径
         * @param maxSides 最大边
         */
        createCircleByPBody(pBody: I2DPhysicsBody, maxSides?: number): Ibody;
        /**
         * 使用提供的顶点（或包含多组顶点的数组）创建一个新的物理实体
         * 详细参考： createFromVertices（）
         * @param pBody I2DPhysicsBody 实例
         * @param vertexSets 顶点集合
         * @param flagInternal 内部模式标记
         * @param removeCollinear 共线移除参考值
         * @param minimumArea 最小面积
         */
        ConvexHullByPBody(pBody: I2DPhysicsBody, vertexSets: any, flagInternal?: boolean, removeCollinear?: number, minimumArea?: number): Ibody;
        /**
         * 创建一个新的胶囊体Body
         * @param pBody
         * @param maxSides
         */
        createCapsuleByPBody(pBody: I2DPhysicsBody, maxSides?: number): any;
        /**
         * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
         * All properties have default values, and many are pre-calculated automatically based on other properties.
         * Vertices must be specified in clockwise order.
         * See the properties section below for detailed information on what you can pass via the `options` object.
         * @param options
         */
        createBody(options: I2dPhyBodyData): Ibody;
        /**
         * Creates a new rigid body model with a circle hull.
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {object} [options]
         * @param {number} [maxSides]
         * @return {body} A new circle body
         */
        createCircle(x: number, y: number, radius: number, options: I2dPhyBodyData, maxSides: number): Ibody;
        /**
         * Creates a new rigid body model with a rectangle hull.
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {object} [options]
         * @return {body} A new rectangle body
         */
        createRectangle(x: number, y: number, width: number, height: number, options: I2dPhyBodyData): Ibody;
        /**
         * Creates a new rigid body model with a trapezoid hull.
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method trapezoid
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} slope
         * @param {object} [options]
         * @return {body} A new trapezoid body
         */
        createTrapezoid(x: number, y: number, width: number, height: number, slope: number, options: I2dPhyBodyData): Ibody;
        /**
         * Creates a new rigid body model with a regular polygon hull with the given number of sides.
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method polygon
         * @param {number} x
         * @param {number} y
         * @param {number} sides
         * @param {number} radius
         * @param {object} [options]
         * @return {body} A new regular polygon body
         */
        createPolygon(x: number, y: number, sides: number, radius: number, options: I2dPhyBodyData): Ibody;
        /**
         * Creates a body using the supplied vertices (or an array containing multiple sets of vertices).
         * If the vertices are convex, they will pass through as supplied.
         * Otherwise if the vertices are concave, they will be decomposed if [poly-decomp.js](https://github.com/schteppe/poly-decomp.js) is available.
         * Note that this process is not guaranteed to support complex sets of vertices (e.g. those with holes may fail).
         * By default the decomposition will discard collinear edges (to improve performance).
         * It can also optionally discard any parts that have an area less than `minimumArea`.
         * If the vertices can not be decomposed, the result will fall back to using the convex hull.
         * The options parameter is an object that specifies any `Matter.Body` properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method fromVertices
         * @param {number} x
         * @param {number} y
         * @param [Ivec2] vertexSets
         * @param {object} [options]
         * @param {bool} [flagInternal=false]
         * @param {number} [removeCollinear=0.01]
         * @param {number} [minimumArea=10]
         * @return {body}
         */
        createFromVertices(x: number, y: number, vertexSets: math.Ivec2[], options: I2dPhyBodyData, flagInternal?: boolean, removeCollinear?: number, minimumArea?: number): Ibody;
        /**
         * Creates a new rigid body model with a capsule hull.
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method createCapsule
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {number} height
         * @param {object} [options]
         * @param {number} rotation vertices roate of angle
         * @param {number} [maxSides]
         * @return {body} A new capsule body
         */
        createCapsule(x: number, y: number, radius: number, height: number, options: I2dPhyBodyData, rotation?: number, maxSides?: number): any;
        /** 添加 I2DPhysicsBody 实例到 2d物理世界*/
        addBody(_Pbody: I2DPhysicsBody): void;
        /** 移除 指定 I2DPhysicsBody 实例 */
        removeBody(_Pbody: I2DPhysicsBody): void;
        /** 获取 I2DPhysicsBody 对象通过 Ibody.id */
        getBody(bodyId: number): I2DPhysicsBody;
        /** 清理世界 */
        clearWorld(keepStatic?: boolean): void;
        applyForce(body: Ibody, positon: math.Ivec2, force: math.Ivec2): void;
        applyForceAtCenter(body: Ibody, force: math.Ivec2): void;
        setGravity(x: number, y: number): void;
        set enableSleeping(val: boolean);
        get enableSleeping(): boolean;
        /** 设置速度
         * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
         */
        setVelocity(body: Ibody, velocity: math.Ivec2): void;
        /** 设置位置
         * Moves a body by a given vector relative to its current position, without imparting any velocity.
        */
        setPosition(body: Ibody, pos: math.Ivec2): void;
        /**
         * Sets the angle of the body instantly. Angular velocity, position, force etc. are unchanged.
         * @param body body
         * @param angle 旋转角度
         */
        setAngle(body: Ibody, angle: number): void;
        /** 设置质量
         * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
        */
        setMass(body: Ibody, mass: number): void;
        /** 设置密度
         * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
         */
        setDensity(body: Ibody, Desity: number): void;
        /**
         * 设置角速度
         * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
         */
        setAngularVelocity(body: Ibody, angularVelocity: number): void;
        /** 设置静态状态
         * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
         */
        setStatic(body: Ibody, isStatic: boolean): void;
        /** 设置休眠状态
         */
        setSleeping(body: Ibody, isSleeping: boolean): void;
        /** 设置惯性值
         * Sets the moment of inertia (i.e. second moment of area) of the body.
         * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
         */
        setInertia(body: Ibody, Inertia: number): void;
        /** 设置顶点
        * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
        * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
        * They are then automatically translated to world space based on `body.position`.
        *
        * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
        * Vertices must form a convex hull, concave hulls are not supported.
        */
        setVertices(body: Ibody, vertices: math.Ivec2[]): void;
        /** 设置成员
        * Sets the parts of the `body` and updates mass, inertia and centroid.
        * Each part will have its parent set to `body`.
        * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
        * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
        */
        setParts(body: Ibody, parts: Ibody[], autoHull?: boolean): void;
        /** 设置中心点
        * Set the centre of mass of the body.
        * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
        * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
        * This is equal to moving `body.position` but not the `body.vertices`.
        * Invalid if the `centre` falls outside the body's convex hull.
        */
        setCentre(body: Ibody, centre: math.Ivec2, relative?: boolean): void;
        /**
         * 设置缩放
         * Scales the body, including updating physical properties (mass, area, axes, inertia), from a world-space point (default is body centre).
         */
        setScale(body: Ibody, scaleX: number, scaleY: number, point?: math.Ivec2): void;
        /**
         * 复合体缩放
         * Scales all children in the composite, including updating physical properties (mass, area, axes, inertia), from a world-space point.
         */
        compositeScale(composite: any, scaleX: number, scaleY: number, point: math.Ivec2, recursive?: boolean): void;
    }
    interface Ibody {
        bounds: {
            max: {
                x: number;
                y: number;
            };
            min: {
                x: number;
                y: number;
            };
        };
        /** 成员 */
        parts: Ibody[];
        /** 顶点集合 */
        vertices: math.Ivec2[];
        /** 睡眠状态 */
        isSleeping: boolean;
        /** 传感器的标志 , 开启时触发碰撞事件*/
        isSensor: boolean;
        /** 静态 */
        isStatic: boolean;
        /** 重心点位置 */
        position: math.Ivec2;
        /** 速率向量 , 想要改变它 需要通过给它施加力*/
        velocity: math.Ivec2;
        /** 力*/
        force: math.Ivec2;
        /** 碰撞筛选属性对象 */
        collisionFilter: collisionFilter;
        type: string;
        tag: string;
        name: string;
        /** 旋转角度 */
        angle: number;
        /** 位移速度值 */
        speed: number;
        /** 角速度值 */
        angularSpeed: number;
        /** 空气摩擦力 */
        frictionAir: number;
        /** 摩擦力 */
        friction: number;
        /** 静态摩擦力 */
        frictionStatic: number;
        /** 弹性值 */
        restitution: number;
        /** 角速度向量 */
        angularVelocity: number;
        /** 身份ID */
        id: number;
        motion: number;
        /** 扭矩  */
        torque: number;
        /** 睡眠阈值  */
        sleepThreshold: number;
        /** 密度 */
        density: number;
        /** 质量 */
        mass: number;
        inverseMass: number;
        /** 惯性值 */
        inertia: number;
        inverseInertia: number;
        slop: number;
        /** 时间缩放 */
        timeScale: number;
    }
    /**
     * 碰撞筛选属性对象
     * 两个物体之间的碰撞将遵守以下规则：
     * 1.两个物体的group相同且大于0时会执行碰撞，如果负数将永远不会碰撞。
     * 2.当两个物体group不相同或等于0时将执行 类别/位掩码 的规则。
     */
    interface collisionFilter {
        /** 组号*/
        group?: number;
        /** 类别 (32位 , 范围[1,2^31])*/
        category?: number;
        /** 位掩码（指定此主体可能碰撞的碰撞类别）*/
        mask?: number;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 矩形 2d刚体
    * @version gd3d 1.0
    */
    class rectBody2d extends physics2DBody {
        static readonly ClassName: string;
        transform: transform2D;
        start(): void;
        onPlay(): void;
    }
}
declare namespace gd3d.framework {
    class resID {
        constructor();
        static idAll: number;
        static next(): number;
        private id;
        getID(): number;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 静态text 初始化后不可修改
     * @version gd3d 1.0
     */
    class constText {
        constructor(text: string);
        private name;
        getText(): string;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源接口 扩展资源需要继承此接口
     * @version gd3d 1.0
     */
    interface IAsset {
        bundle?: assetBundle;
        defaultAsset: boolean;
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): any;
        caclByteLength(): number;
        init?(): any;
    }
}
declare namespace gd3d.framework {
    /**
     *
     * astc 格式概述  https://github.com/ARM-software/astc-encoder/blob/main/Docs/FormatOverview.md
     * Khronos Group  astc格式规范 https://www.khronos.org/registry/DataFormat/specs/1.3/dataformat.1.3.html#ASTC
     */
    class ASTCParse {
        private static readonly HEADER_SIZE_X;
        private static readonly HEADER_SIZE_Y;
        private static readonly HEADER_SIZE_Z;
        private static readonly HEADER_MAX;
        private static gLInternalFormat;
        private static pixelWidth;
        private static pixelHeight;
        /**
         *
         * @param gl WebGLRenderingContext
         * @param arrayBuffer contents of the ASTC container file
         */
        static parse(gl: WebGLRenderingContext, arrayBuffer: ArrayBuffer): render.glTexture2D;
        private static decodeBuffer;
        private static getTextureFormat;
    }
}
declare namespace gd3d.framework {
    /**
     *
     * for description see https://www.khronos.org/opengles/sdk/tools/KTX/
     * for file layout see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/
     *
     * ported from https://github.com/BabylonJS/Babylon.js/blob/master/src/Misc/khronosTextureContainer.ts
     */
    class KTXParse {
        private static HEADER_LEN;
        /**
         *
         * @param gl
         * @param arrayBuffer contents of the KTX container file
         * @param facesExpected should be either 1 or 6, based whether a cube texture or or
         */
        static parse(gl: WebGLRenderingContext, arrayBuffer: ArrayBuffer, facesExpected?: number, loadMipmaps?: boolean): gd3d.render.glTexture2D;
    }
}
declare class PvrParse {
    private version;
    private flags;
    private pixelFormatH;
    private pixelFormatL;
    private channelType;
    height: number;
    width: number;
    private depth;
    private numFaces;
    private mipMapCount;
    private metaDataSize;
    private gl;
    constructor(gl: WebGLRenderingContext);
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 解析pvr图片
     * @param _buffer 图片二进制数据
     * @version gd3d 1.0
     */
    parse(_buffer: ArrayBuffer): gd3d.render.glTexture2D;
    private parseV3;
}
declare enum ChannelTypes {
    UnsignedByteNorm = 0,
    SignedByteNorm = 1,
    UnsignedByte = 2,
    SignedByte = 3,
    UnsignedShortNorm = 4,
    SignedShortNorm = 5,
    UnsignedShort = 6,
    SignedShort = 7,
    UnsignedIntegerNorm = 8,
    SignedIntegerNorm = 9,
    UnsignedInteger = 10,
    SignedInteger = 11,
    SignedFloat = 12,
    Float = 12,
    UnsignedFloat = 13
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源类型
     * @version gd3d 1.0
     */
    enum AssetTypeEnum {
        /**
         * @public
         * @language zh_CN
         * 未知
         * @version gd3d 1.0
         */
        Unknown = 0,
        /**
         * @public
         * @language zh_CN
         * 根据后缀 动态识别
         * @version gd3d 1.0
         */
        Auto = 1,
        /**
         * @public
         * @language zh_CN
         * 资源包
         * @version gd3d 1.0
         */
        Bundle = 2,
        /**
         * @public
         * @language zh_CN
         * 压缩的资源包
         * @version gd3d 1.0
         */
        CompressBundle = 3,
        /**
         * @public
         * @language zh_CN
         * glsl vs
         * @version gd3d 1.0
         */
        GLVertexShader = 4,
        /**
         * @public
         * @language zh_CN
         * glsl fs
         * @version gd3d 1.0
         */
        GLFragmentShader = 5,
        /**
         * @public
         * @language zh_CN
         * shader
         * @version gd3d 1.0
         */
        Shader = 6,
        /**
         * @public
         * @language zh_CN
         * 贴图
         * @version gd3d 1.0
         */
        Texture = 7,
        /**
         * @public
         * @language zh_CN
         * 贴图desc
         * @version gd3d 1.0
         */
        TextureDesc = 8,
        /**
         * @public
         * @language zh_CN
         * 模型
         * @version gd3d 1.0
         */
        Mesh = 9,
        /**
         * @public
         * @language zh_CN
         * 材质
         * @version gd3d 1.0
         */
        Material = 10,
        /**
         * @public
         * @language zh_CN
         * 动画片段
         * @version gd3d 1.0
         */
        Aniclip = 11,
        /**
         * @public
         * @language zh_CN
         * 关键帧动画片段
         * @version gd3d 1.0
         */
        KeyFrameAniclip = 12,
        /**
         * @public
         * @language zh_CN
         * 图集
         * @version gd3d 1.0
         */
        Atlas = 13,
        /**
         * @public
         * @language zh_CN
         * 字体
         * @version gd3d 1.0
         */
        Font = 14,
        /**
         * @public
         * @language zh_CN
         * 文本
         * @version gd3d 1.0
         */
        TextAsset = 15,
        /**
         * @private
         */
        PackBin = 16,
        /**
         * @private
         */
        PackTxt = 17,
        /**
         * @public
         * @language zh_CN
         * 可编辑路径
         * @version gd3d 1.0
         */
        PathAsset = 18,
        /**
         * @public
         * @language zh_CN
         * pvr贴图
         * @version gd3d 1.0
         */
        PVR = 19,
        /**
         * Android平台ETC1压缩纹理
         */
        KTX = 20,
        /**
         * ARM 压缩纹理，ios 、android 通用
         */
        ASTC = 21,
        F14Effect = 22,
        /**
         * @public
         * @language zh_CN
         * dds贴图
         * @version gd3d 1.0
         */
        DDS = 23,
        /**
         * @public
         * @language zh_CN
         * 场景
         * @version gd3d 1.0
         */
        Scene = 24,
        /**
         * @public
         * @language zh_CN
         * 预设
         * @version gd3d 1.0
         */
        Prefab = 25,
        cPrefab = 26,
        /**
         * 粒子系统
         */
        ParticleSystem = 27,
        /**
         * 拖尾
         */
        TrailRenderer = 28
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 资源加载状态
     * @version gd3d 1.0
     */
    class ResourceState {
        res: IAsset;
        state: number;
        loadedLength: number;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 带引用的资源加载状态
     * @version gd3d 1.0
     */
    class RefResourceState extends ResourceState {
        refLoadedLength: number;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载状态
     * @version gd3d 1.0
     */
    class stateLoad {
        bundle?: assetBundle;
        /**
         * @public
         * @language zh_CN
         * 加载是否失败
         * @version gd3d 1.0
         */
        isloadFail: boolean;
        /**
         * @public
         * @language zh_CN
         * 加载是否遇到错误
         * @version gd3d 1.0
         */
        iserror: boolean;
        /**
         * @public
         * @language zh_CN
         * 加载是否完成
         * @version gd3d 1.0
         */
        isfinish: boolean;
        /**
         * @public
         * @language zh_CN
         * 记录需要加载的每一个的状态和资源引用
         * @version gd3d 1.0
         */
        resstate: {
            [id: string]: ResourceState;
        };
        /**
         * @public
         * @language zh_CN
         * 记录加载的第一个的状态和资源引用
         * @version gd3d 1.0
         */
        resstateFirst: ResourceState;
        /**
         * @public
         * @language zh_CN
         * 当前的文件数进度
         * @version gd3d 1.0
         */
        curtask: number;
        /**
         * @public
         * @language zh_CN
         * 文件数的总进度
         * @version gd3d 1.0
         */
        totaltask: number;
        /**
         * @public
         * @language zh_CN
         * 获取文件数加载进度
         * @version gd3d 1.0
         */
        get fileProgress(): number;
        /**
         * @public
         * @language zh_CN
         * 已加载的字节长度
         * @version gd3d 1.0
         */
        get curByteLength(): number;
        /**
         * @public
         * @language zh_CN
         * 总字节长度
         * @version gd3d 1.0
         */
        totalByteLength: number;
        /**
         * @public
         * @language zh_CN
         * 获取文件真实加载进度
         * @version gd3d 1.0
         */
        get progress(): number;
        progressCall: boolean;
        compressTextLoaded: number;
        compressBinLoaded: number;
        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的log
         * @version gd3d 1.0
         */
        logs: string[];
        /**
         * @public
         * @language zh_CN
         * 加载过程中记录的错误信息
         * @version gd3d 1.0
         */
        errs: Error[];
        /**
         * @public
         * @language zh_CN
         * 源url地址
         * @version gd3d 1.0
         */
        url: string;
    }
    class assetRef {
        asset: IAsset;
        refcount: number;
    }
}
declare namespace gd3d.framework {
    class assetBundle {
        private assetmgr;
        /** 解析后清理 加载缓存资源数据 */
        static needClearLoadedRes: boolean;
        static idNext: number;
        files: {
            [key: string]: number;
        };
        texs: {
            [name: string]: number;
        };
        pkgs: string[];
        pkgsGuid: number[];
        url: string;
        baseUrl: string;
        keyUrl: string;
        guid: number;
        name: string;
        dw_imgCount: number;
        dw_fileCount: number;
        onReady: () => void;
        onDownloadFinish: () => void;
        ready: boolean;
        isunload: boolean;
        parseResolve: (o?: any) => void;
        parseReject: (o: Error) => void;
        static reTryTest: {};
        constructor(url: string, assetmgr: assetMgr, guid?: number);
        static buildGuid(): number;
        parseBundle(data: string): Promise<unknown>;
        private unpkg;
        parseFile(): Promise<void>;
        unload(disposeNow?: boolean): void;
        fail(error: Error): void;
    }
}
declare namespace gd3d.framework {
    type loadCallback = (state?: stateLoad) => void;
    export const assetParseMap: {
        [key: number]: IAssetFactory;
    };
    export function assetF(type: AssetTypeEnum): (ctor: any) => void;
    export function calcType(url: string | any): AssetTypeEnum;
    export function calcReqType(type: AssetTypeEnum): "text" | "arraybuffer";
    export class assetMgr {
        static urlmapGuid: {
            [key: string]: number;
        };
        static cdnRoot: string;
        static guidlistURL: string;
        static onGuidInit: () => void;
        static Instance: assetMgr;
        static mapLoading: {
            [key: number]: {
                url?: string;
                readyok: boolean;
                data?: any;
                cbQueue?: loadCallback[];
                subRes?: number[];
            };
        };
        static mapGuid: {
            [key: number]: assetRef;
        };
        static mapImage: {
            [key: number]: HTMLImageElement | ArrayBuffer;
        };
        static mapNamed: {
            [key: string]: IAsset;
        };
        static mapBundleNamed: {
            [key: number]: {
                [name: string]: assetRef;
            };
        };
        static noparseBundle: Array<assetBundle>;
        static atonceParse: boolean;
        static openGuid: boolean;
        name_bundles: {
            [key: string]: assetBundle;
        };
        kurl_bundles: {
            [key: string]: assetBundle;
        };
        guid_bundles: {
            [key: string]: assetBundle;
        };
        mapShader: {
            [id: string]: shader;
        };
        static initGuidList(): void;
        static setLoading(guid: number, data: any): void;
        load(url: string, type?: AssetTypeEnum, 
        /** 这是解析完成的回调 */
        onstate?: loadCallback, downloadFinish?: () => void): void;
        static setStateError(state: stateLoad, onstate: (state?: stateLoad) => void, err: Error): void;
        download(guid: number, url: string, type: AssetTypeEnum, finish: () => void, errcb?: (err: Error) => void, bundle?: assetBundle): void;
        loadImg(guid: number, url: string, cb: (img: any, err?: any) => void, bundle?: assetBundle): void;
        protected _loadImg(url: string, cb: (img: any, err?: any) => void): void;
        use(asset: IAsset): void;
        unuse(asset: IAsset, disposeNow?: boolean): void;
        parseRes(asset: {
            guid: number;
            type: number;
            name: string;
            dwguid?: number;
        }, bundle?: assetBundle): Promise<IAsset>;
        getAssetByName<T extends IAsset>(name: string, bundlename?: string): T;
        mapDefaultMesh: {
            [id: string]: mesh;
        };
        mapDefaultTexture: {
            [id: string]: texture;
        };
        mapDefaultCubeTexture: {
            [id: string]: texture;
        };
        mapDefaultSprite: {
            [id: string]: sprite;
        };
        mapMaterial: {
            [id: string]: material;
        };
        getDefaultMesh(name: string): mesh;
        getDefaultTexture(name: string): texture;
        getDefaultCubeTexture(name: string): texture;
        getDefaultSprite(name: string): sprite;
        getMaterial(name: string): material;
        static useBinJs: boolean;
        static txt: string;
        private static bin;
        app: gd3d.framework.application;
        shaderPool: gd3d.render.shaderPool;
        webgl: WebGLRenderingContext;
        mapRes: {
            [id: number]: any;
        };
        constructor(app: application);
        static correctFileName(name: string): string;
        static correctTxtFileName(name: string): string;
        getShader(name: string): gd3d.framework.shader;
        private linerenderermat;
        getDefLineRendererMat(): material;
        private particlemat;
        getDefParticleMat(): material;
        private assetUrlDic;
        setAssetUrl(asset: IAsset, url: string): void;
        getAssetUrl(asset: IAsset): string;
        maploaded: {
            [url: string]: IAsset;
        };
        savePrefab(trans: transform, prefabName: string, fun: (data: SaveInfo, resourses?: string[], contents?: any[]) => void): void;
        loadCompressBundle(url: string, a?: any): void;
        loadImmediate(url: string): any;
        getAssetBundle(url: string): assetBundle;
        releaseUnuseAsset(): void;
        initDefAsset(): void;
        loadScene(sceneName: string, onComplete: (firstChilds: Array<transform>) => void): void;
        unload(url: string): void;
    }
    export class SaveInfo {
        files: {
            [key: string]: string;
        };
    }
    export {};
}
declare namespace gd3d.framework {
    class defmaterial {
        static initDefaultMaterial(assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class defMesh {
        static readonly cube = "cube";
        static readonly quad = "quad";
        static readonly quad_particle = "quad_particle";
        static readonly plane = "plane";
        static readonly sphere = "sphere";
        static readonly sphere_quality = "sphere_quality";
        static readonly pyramid = "pyramid";
        static readonly cylinder = "cylinder";
        static readonly circleline = "circleline";
        static initDefaultMesh(assetmgr: assetMgr): void;
        private static createDefaultMesh;
    }
}
declare namespace gd3d.framework {
    class defShader {
        static shader0: string;
        static vscode: string;
        static fscode: string;
        static fscode2: string;
        static uishader: string;
        static fscodeUI: string;
        static vscodeUI: string;
        static vscodeMaskUI: string;
        static fscodeMaskUI: string;
        static shaderuifront: string;
        static vscodefontUI: string;
        static fscodefontUI: string;
        static vscodeuifontmask: string;
        static fscodeuifontmask: string;
        static diffuseShader: string;
        static vsdiffuse: string;
        static fsdiffuse: string;
        static vsline: string;
        static fsline: string;
        static materialShader: string;
        static vsmaterialcolor: string;
        static vslinetrail: string;
        static linetrailShader: string;
        static fslinetrail: string;
        static initDefaultShader(assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class defsprite {
        static readonly white_sprite = "white_sprite";
        static readonly gray_sprite = "gray_sprite";
        static readonly grid_sprite = "grid_sprite";
        static initDefaultSprite(assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class defTexture {
        static readonly white = "white";
        static readonly gray = "gray";
        static readonly normal = "normal";
        static readonly grid = "grid";
        static readonly particle = "particle";
        static initDefaultTexture(assetmgr: assetMgr): void;
        private static initDefaultCubeTexture;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Aniclip implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, bytes: ArrayBuffer): Promise<animationClip>;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_ASTC implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number): texture;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Atlas implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): atlas;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_cPrefab implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): prefab;
    }
}
declare var WebGLTextureUtil: any;
declare namespace gd3d.framework {
    class AssetFactory_DDS implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, bytes: ArrayBuffer): void;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_ETC1 implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer, dwguid: number): texture;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_f14eff implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): f14eff;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Font implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): font;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_GLFragmentShader implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): void;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_GLVertexShader implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): void;
    }
}
declare namespace gd3d.framework {
    interface IAssetFactory {
        newAsset?(assetName?: string): IAsset;
        load?(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: IAsset, call: (handle: () => void) => void): void;
        loadByPack?(respack: any, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset: IAsset, call: (handle: () => void) => void): void;
        parse(assetMgr: assetMgr, bundle: assetBundle, name: string, data: string | ArrayBuffer, dwguid?: number): IAsset | Promise<IAsset> | void;
        needDownload?(textJSON: string): string;
    }
    class AssetFactoryTools {
        static catchError(err: Error, onstate: (state: stateLoad) => void, state: stateLoad): boolean;
        static useAsset(assetMgr: assetMgr, onstate: (state: stateLoad) => void, state: stateLoad, asset: IAsset, url: string): void;
        static onProgress(loadedLength: number, totalLength: number, onstate: (state: stateLoad) => void, state: stateLoad, filename: string): void;
        static onRefProgress(loadedLength: number, totalLength: number, onstate: (state: stateLoad) => void, state: stateLoad, filename: string): void;
    }
    function getFileName(url: string): string;
}
declare namespace gd3d.framework {
    class assetfactory_keyFrameAniClip implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): keyFrameAniClip;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Material implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string): material;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Mesh implements IAssetFactory {
        parse(assetMgr: assetMgr, bundle: assetBundle, name: string, data: ArrayBuffer): Promise<IAsset>;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_ParticleSystem implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string): ParticleSystemData;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_PathAsset implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string): pathasset;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_PVR implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, bytes: ArrayBuffer): texture;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Scene implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string): Promise<rawscene>;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Shader implements IAssetFactory {
        private TryParseMap;
        private parseShader;
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): shader;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_TextAsset implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string): textasset;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_Texture implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, filename: string, txt: string, dwguid: number): texture;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_TextureDesc implements IAssetFactory {
        private readonly t_Normal;
        private readonly t_PVR;
        private readonly t_DDS;
        private readonly t_KTX;
        private readonly t_ASTC;
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, data: string, dwguid: number): texture;
        needDownload(text: string): any;
    }
}
declare namespace gd3d.framework {
    class AssetFactory_TrailRenderer implements IAssetFactory {
        parse(assetmgr: assetMgr, bundle: assetBundle, name: string, txt: string): TrailRendererData;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 动画片段资源
     * @version gd3d 1.0
     */
    class animationClip implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param buf buffer数组
         * @version gd3d 1.0
         */
        Parse(buf: ArrayBuffer): Promise<animationClip>;
        /**
         * @public
         * @language zh_CN
         * 动画片段的帧率
         * @version gd3d 1.0
         */
        fps: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否循环
         * @version gd3d 1.0
         */
        loop: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否含有缩放
         * @version gd3d 1.0
         */
        hasScaled: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放时长
         * @version gd3d 1.0
         */
        get time(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 骨骼数量
         * @version gd3d 1.0
         */
        boneCount: number;
        /**
         * @private
         */
        bones: string[];
        indexDic: {
            [boneName: string]: number;
        };
        /**
         * @private
         */
        frameCount: number;
        /**
         * @private
         */
        frames: {
            [fid: string]: Float32Array;
        };
        /**
         * @private
         */
        subclipCount: number;
        /**
         * @private
         */
        subclips: subClip[];
    }
    /**
     * @private
     */
    class PoseBoneMatrix {
        static readonly ClassName: string;
        t: math.vector3;
        r: math.quaternion;
        s: math.float;
        static caclByteLength(): number;
        Clone(): PoseBoneMatrix;
        load(read: io.binReader, hasScaled?: boolean): void;
        static createDefault(): PoseBoneMatrix;
        copyFrom(src: PoseBoneMatrix): void;
        copyFromData(src: Float32Array, seek: number): void;
        invert(): void;
        lerpInWorld(_tpose: PoseBoneMatrix, from: PoseBoneMatrix, to: PoseBoneMatrix, v: number): void;
        lerpInWorldWithData(_tpose: PoseBoneMatrix, from: PoseBoneMatrix, todata: Float32Array, toseek: number, v: number): void;
        static sMultiply(left: PoseBoneMatrix, right: PoseBoneMatrix, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sMultiplytpose(left: PoseBoneMatrix, right: tPoseInfo, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sMultiplyDataAndMatrix(leftdata: Float32Array, leftseek: number, right: PoseBoneMatrix, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sLerp(left: PoseBoneMatrix, right: PoseBoneMatrix, v: number, target?: PoseBoneMatrix): PoseBoneMatrix;
        private static poolmats;
        static recycle(mat: PoseBoneMatrix): void;
        static create(): PoseBoneMatrix;
    }
    /**
     * @private
     */
    class subClip {
        name: string;
        loop: boolean;
        startframe: number;
        endframe: number;
        static caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 图集资源
     * @version gd3d 1.0
     */
    class atlas implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 贴图像素宽度
         * @version gd3d 1.0
         */
        texturewidth: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 贴图像素高度
         * @version gd3d 1.0
         */
        textureheight: number;
        private _texture;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前texture
         * @version gd3d 1.0
         */
        get texture(): texture;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置当前texture
         * @param value
         * @version gd3d 1.0
         */
        set texture(value: texture);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析得到的sprite列表 key-->name
         * @version gd3d 1.0
         */
        sprites: {
            [id: string]: sprite;
        };
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param jsonStr json数据
         * @param assetmgr 资源管理实例
         * @version gd3d 1.0
         */
        Parse(jsonStr: string, assetmgr: assetMgr, bundleName?: string): this;
    }
}
declare namespace gd3d.framework {
    class f14node {
        trans: transform;
        f14Effect: f14EffectSystem;
    }
    class f14eff implements IAsset {
        static readonly ClassName: string;
        defaultAsset: boolean;
        private name;
        private id;
        constructor(assetName?: string);
        assetbundle: string;
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        data: F14EffectData;
        delayTime: number;
        Parse(jsonStr: string, assetmgr: assetMgr): F14EffectData;
        /** 获取依赖资源 （mesh 、material） */
        getDependents(): IAsset[];
        private doSearch;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 字体资源
     * @version gd3d 1.0
     */
    class font implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        private _texture;
        get texture(): texture;
        set texture(value: texture);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 字体信息map
         * @version gd3d 1.0
         */
        cmap: {
            [id: string]: charinfo;
        };
        fontname: string;
        pointSize: number;
        padding: number;
        lineHeight: number;
        baseline: number;
        atlasWidth: number;
        atlasHeight: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param jsonStr json数据
         * @param assetmgr 资源管理实例
         * @version gd3d 1.0
         */
        Parse(jsonStr: string, assetmgr: assetMgr, bundleName?: string): this;
    }
    /**
     * @private
     */
    class charinfo {
        /**
         * uv
         */
        x: number;
        /**
         * uv
         */
        y: number;
        /**
         * uv长度
         */
        w: number;
        /**
         * uv长度
         */
        h: number;
        /**
         * 像素
         */
        xSize: number;
        /**
         * 像素
         */
        ySize: number;
        /**
         * 偏移
         */
        xOffset: number;
        /**
         * 相对基线的偏移
         */
        yOffset: number;
        /**
         * 字符宽度
         */
        xAddvance: number;
        static caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * transform类 对应unity中transform概念
     * @version gd3d 1.0
     */
    class transform {
        private static readonly help_v3;
        static readonly ClassName: string;
        private helpLRotate;
        private helpLPos;
        private helpLScale;
        private static helpv2;
        private static helpv3;
        private static helpv3_1;
        private static helpUp;
        private static helpRight;
        private static helpFoward;
        private static helpquat;
        private static helpquat_1;
        private static helpmtx;
        /** 自己是否有渲染器组件 */
        hasRendererComp: boolean;
        /** 子对象是否有渲染器组件 */
        hasRendererCompChild: boolean;
        /**自己是否有需要update方法的组件 */
        hasUpdateComp: boolean;
        /**子对象是否有需要update方法的组件 */
        hasUpdateCompChild: boolean;
        /**自己是否有需要init方法的组件 */
        hasInitComp: boolean;
        /**子对象是否有需要init方法的组件 */
        hasInitCompChild: boolean;
        /**自己是否有需要OnPlay方法的组件 */
        hasOnPlayComp: boolean;
        /**子对象是否有需要OnPlay方法的组件 */
        hasOnPlayCompChild: boolean;
        /** 需要每帧调用组件update , 设置为false 该节点以及子节点都会跳过update 函数的调用（减少消耗）*/
        needUpdate: boolean;
        /** 需要每帧筛查FillRenderer , 设置为false 该节点以及子节点都会跳过FillRenderer 函数的调用（减少消耗）*/
        needFillRenderer: boolean;
        /** 需要gpuInstanceBatcher 模式渲染 (减少渲染消耗 , 仅适合静态物)*/
        needGpuInstancBatcher: boolean;
        private checkLRTSChange;
        private fastEqual;
        private _scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置所在场景实例
         * @param value 场景实例
         * @version gd3d 1.0
         */
        set scene(value: scene);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取所在场景
         * @version gd3d 1.0
         */
        get scene(): scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform名称
         * @version gd3d 1.0
         */
        name: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * transform唯一的insid
         * @version gd3d 1.0
         */
        insId: insID;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前节点依赖的prefab路径，如果不依赖，则为空
         * @version gd3d 1.0
         */
        prefab: string;
        /**
         * [过时接口,完全弃用]
         */
        updateWorldTran(): void;
        /**
         * [过时接口,完全弃用]
         * @param bool
         */
        updateTran(bool: boolean): void;
        private _dirtyAABB;
        private _aabb;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自己的aabb
         * @version gd3d 1.0
         */
        get aabb(): aabb;
        /**
        * @private
        * @language zh_CN
        * 计算aabb
        * @version gd3d 1.0
        */
        /** 创建过的 aabb 缓存 ，避免每次重复构建  */
        private static aabbStoreMap;
        private static readonly aabbCareTypes;
        /**
        * @private
        * @language zh_CN
        * 构建aabb
        * @version gd3d 1.0
        */
        private _buildAABB;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 子物体列表
         * @version gd3d 1.0
         */
        children: transform[];
        private _physicsImpostor;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 物理代理对象
         * @version gd3d 1.0
         */
        get physicsImpostor(): PhysicsImpostor;
        set physicsImpostor(physicsImp: PhysicsImpostor);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 父物体实例
         * @version gd3d 1.0
         */
        private _parent;
        get parent(): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象RTS有变化了,视锥剔除使用
         * @version gd3d 1.0
         */
        dirtiedOfFrustumCulling: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否在任意摄像机视野内
         * @version gd3d 1.0
         */
        inCameraVisible: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 当前物体视锥剔除开关
         * @version gd3d 1.0
         */
        enableCulling: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例
         * @param node 子物体实例
         * @version gd3d 1.0
         */
        addChild(node: transform): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加子物体实例到索引位置
         * @param node 场景实例
         * @param index 索引位置
         * @version gd3d 1.0
         */
        addChildAt(node: transform, index: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除所有子物体
         * @version gd3d 1.0
         */
        removeAllChild(needDispose?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除指定子物体
         * @param node 子物体实例
         * @version gd3d 1.0
         */
        removeChild(node: transform): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 查找自己以及子物体中是否有指定名称的transform
         * @param name
         * @version gd3d 1.0
         */
        find(name: string): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 判断是否与给定的transform有碰撞
         * @param tran 指定的transform
         * @version gd3d 1.0
         */
        checkImpactTran(tran: transform): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回场景中所有与当前tranform碰撞的transform
         * @version gd3d 1.0
         */
        checkImpact(): Array<transform>;
        private doImpact;
        private dirtyLocal;
        private dirtyWorld;
        private dirtify;
        private sync;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * [ 过时接口,现不需要标记变化]
         * @version gd3d 1.0
         */
        markDirty(): void;
        markHaveRendererComp(selfHas?: boolean): void;
        markHaveUpdateComp(selfHas?: boolean): void;
        markHaveInitComp(selfHas?: boolean): void;
        markHaveOnplayComp(selfHas?: boolean): void;
        private _localRotate;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地旋转四元数
         * @version gd3d 1.0
         */
        get localRotate(): math.quaternion;
        set localRotate(rotate: math.quaternion);
        private _localTranslate;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地位移
         * @version gd3d 1.0
         */
        get localTranslate(): math.vector3;
        set localTranslate(position: math.vector3);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 本地位移
        * @version gd3d 1.0
        */
        get localPosition(): math.vector3;
        set localPosition(position: math.vector3);
        private _localScale;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地缩放
         * @version gd3d 1.0
         */
        get localScale(): math.vector3;
        set localScale(scale: math.vector3);
        private localMatrix;
        private _localEulerAngles;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 本地旋转的欧拉角
         * @version gd3d 1.0
         */
        get localEulerAngles(): math.vector3;
        set localEulerAngles(angles: math.vector3);
        private worldMatrix;
        private worldRotate;
        worldTranslate: math.vector3;
        private worldScale;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的旋转
         * @version gd3d 1.0
         */
        getWorldRotate(): math.quaternion;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform世界空间下的旋转
         *
         */
        setWorldRotate(rotate: math.quaternion): void;
        firstCalc: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的位移
         * @version gd3d 1.0
         */
        getWorldTranslate(): math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的位移
         * @version gd3d 1.0
         */
        getWorldPosition(): math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform世界空间下的位移
         * @param pos 世界空间下的坐标
         * @version gd3d 1.0
         */
        setWorldPosition(pos: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下的缩放
         * @version gd3d 1.0
         */
        getWorldScale(): math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置世界坐标系下的缩放
         * @version gd3d 1.0
         */
        setWorldScale(scale: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取本地矩阵
         * @version gd3d 1.0
         */
        getLocalMatrix(): math.matrix;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界矩阵
         * @version gd3d 1.0
         */
        getWorldMatrix(): math.matrix;
        private checkToTop;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前z轴的朝向
         * @version gd3d 1.0
         */
        getForwardInWorld(out: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下当前x轴的朝向
         * @version gd3d 1.0
         */
        getRightInWorld(out: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取世界坐标系下y轴的朝向
         * @version gd3d 1.0
         */
        getUpInWorld(out: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置transform的世界矩阵 通过计算得到本地矩阵实现
         * @param mat 世界空间下矩阵
         * @version gd3d 1.0
         */
        setWorldMatrix(mat: math.matrix): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定transform
         * @param trans 给定的transform
         * @version gd3d 1.0
         */
        lookat(trans: transform): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 旋转当前transform到z轴指向给定坐标
         * @param point 给定的坐标
         * @version gd3d 1.0
         */
        lookatPoint(point: math.vector3): void;
        private calcLookAt;
        constructor();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取绑定的gameObject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform的克隆
         * @version gd3d 1.0
         */
        clone(): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前transform是否被释放掉了
         * @version gd3d 1.0
         */
        get beDispose(): boolean;
        private _beDispose;
        onDispose: () => void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放当前transform
         * @version gd3d 1.0
         */
        dispose(): void;
        private _dispose;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 作为引擎实例的唯一id使用 自增
     * @version gd3d 1.0
     */
    class insID {
        constructor();
        private static idAll;
        private static next;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取唯一id
         * @version gd3d 1.0
         */
        getInsID(): number;
    }
}
declare namespace gd3d.framework {
    interface ICollider {
        gameObject: gameObject;
        subTran: transform;
        getBound(): any;
        intersectsTransform(tran: transform): boolean;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示矩形碰撞盒
     * @version gd3d 1.0
     */
    class boxcollider implements INodeComponent, ICollider {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 子transform
         * @version gd3d 1.0
         */
        subTran: transform;
        /**
        * @private
        */
        filter: meshFilter;
        /**
        * @private
        */
        obb: obb;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒中心点
        * @version gd3d 1.0
        */
        center: math.vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒大小
        * @version gd3d 1.0
        */
        size: math.vector3;
        /**
        * @private
        */
        getBound(): obb;
        private static _tempMatrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取该碰撞盒物体的世界矩阵
        * @version gd3d 1.0
        */
        get matrix(): gd3d.math.matrix;
        private started;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
        * @private
        */
        _colliderVisible: boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞盒的可见性
        * @version gd3d 1.0
        */
        get colliderVisible(): boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 设置碰撞盒的可见性
        * @version gd3d 1.0
        */
        set colliderVisible(value: boolean);
        /**
         * 检查创建碰撞区域 显示mesh
         */
        private ckBuildColliderMesh;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 检测碰撞
        * @version gd3d 1.0
        */
        intersectsTransform(tran: transform): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒
        * @version gd3d 1.0
        */
        private build;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒mesh 并显示
        * @version gd3d 1.0
        */
        private buildMesh;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 获取碰撞盒mesh
        * @version gd3d 1.0
        */
        private getColliderMesh;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 碰撞组件
    * @version gd3d 1.0
    */
    class meshcollider implements INodeComponent, ICollider {
        static readonly ClassName: string;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 挂载的gameobject
        * @version gd3d 1.0
        */
        gameObject: gameObject;
        /**
        * @private
        */
        subTran: transform;
        /**
        * @private
        */
        private _mesh;
        private _filter;
        /**
        * @private
        */
        getBound(): mesh;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
        * @private
        */
        private _colliderVisible;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 碰撞体的可见性
        * @version gd3d 1.0
        */
        get colliderVisible(): boolean;
        /**
        * @public
        * @language zh_CN
        * @param value boolbean
        * @classdesc
        * 碰撞体的可见性
        * @version gd3d 1.0
        */
        set colliderVisible(value: boolean);
        /**
        * @private
        */
        intersectsTransform(tran: transform): boolean;
        private _builded;
        private ckbuildMesh;
        private getColliderMesh;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * mesh组件
    * @version gd3d 1.0
    */
    class meshFilter implements INodeComponent {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        private _mesh;
        /**
         * @private
         */
        get mesh(): mesh;
        /**
        * @public
        * @language zh_CN
        * @param mesh 此组件的mesh
        * @classdesc
        * 设置mesh数据
        * @version gd3d 1.0
        */
        set mesh(mesh: mesh);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 返回mesh数据
        * @version gd3d 1.0
        */
        getMeshOutput(): mesh;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /** meshRenderer GpuInstancing 合批类
     *
     */
    class meshGpuInsBatcher {
        /** 实例数量 */
        count: number;
        /** 渲染使用mesh */
        mesh: gd3d.framework.mesh;
        /** 材质数组（应对submesh） */
        materials: gd3d.framework.material[];
        /** 游戏标记layer */
        gameLayer: number;
        /** batcher 缓存的array */
        bufferDArrs: gd3d.math.ExtenArray<Float32Array>[];
        /** 当前材质上 使用到的通道列表 */
        passArr: gd3d.render.glDrawPass[];
        /** passId 对应 passArr 中的索引map*/
        passIdMap: {
            [id: number]: number;
        };
        constructor(_glayer: number, _mesh: gd3d.framework.mesh, _mats: gd3d.framework.material[]);
        /** 清理 */
        dispose(): void;
    }
    /** mesh  Gpu 实例 绘制info数据类*/
    class meshGpuInstanceDrawInfo implements DrawInstanceInfo {
        instanceCount: number;
        mid: number;
        vbo: WebGLBuffer;
        cacheBuffers: gd3d.math.ExtenArray<Float32Array>[];
        bufferIdMap: {
            [passId: number]: number;
        };
        instanceArray: gd3d.math.ReuseArray<IRendererGpuIns>;
        helpDArray: gd3d.math.ExtenArray<Float32Array>;
        private attSuccess;
        initBuffer(gl: WebGLRenderingContext): void;
        activeAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void;
        disableAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void;
        /** Disable 结束回调 */
        onDisableAttribute: (info: meshGpuInstanceDrawInfo) => any;
        private static _pool;
        /** 池子中取出一个 */
        static new_info(): meshGpuInstanceDrawInfo;
        /** 放回池子 */
        static del_info(info: meshGpuInstanceDrawInfo): void;
    }
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * mesh的渲染组件
    * @version gd3d 1.0
    */
    class meshRenderer implements IRendererGpuIns {
        static readonly ClassName: string;
        constructor();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        materials: material[];
        /**
         * @private
         * 使用全局的lightMap
         */
        useGlobalLightMap: boolean;
        /**
         * @private
         */
        lightmapIndex: number;
        /**
        * @private
        */
        lightmapScaleOffset: math.vector4;
        private lastMat0Id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景渲染层级（common、transparent、overlay）
         * @version gd3d 1.0
         */
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染mask层级（和相机相对应）
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        private issetq;
        /**
        * @private
        */
        private _queue;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回此组件的场景渲染层级排序依据queue大小
         * @version gd3d 1.0
         */
        get queue(): number;
        set queue(value: number);
        private _filter;
        /**
         * 渲染使用 meshFilter
         */
        get filter(): meshFilter;
        set filter(val: meshFilter);
        private static readonly insOffsetMatrixStr;
        private static insOffsetMtxIDMap;
        private static GpuInsAttrignoreMap;
        private static helpDArray;
        private static helpIMatrix;
        start(): void;
        onPlay(): void;
        /**
         * 刷新 渲染layer 和 渲染 queueId （切换了材质时需要手动刷新）
         * *优化了自动处理的消耗
         *  */
        refreshLayerAndQue(): void;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        private static onGpuInsDisableAttribute;
        static GpuInstancingRender(context: renderContext, instanceArray: gd3d.math.ReuseArray<IRendererGpuIns>, cacheBuffer?: Float32Array): void;
        static GpuInstancingRenderBatcher(context: renderContext, batcher: meshGpuInsBatcher): void;
        /**
         * 设置 OffsetMatrix
         * @param tran transform
         * @param mat 材质对象
         * @param pass 绘制通道对象
         */
        static setInstanceOffsetMatrix(tran: gd3d.framework.transform, mat: material, pass: render.glDrawPass): void;
        private static _setInstanceOffsetMatrix;
        static instanceDrawType(): string;
        private static _vbos;
        private static _getVBO;
        isGpuInstancing(): boolean;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 蒙皮网格渲染组件
     * @version gd3d 1.0
     */
    class skinnedMeshRenderer implements IRenderer {
        static readonly ClassName: string;
        private static readonly help_v3;
        private static readonly help_v3_1;
        private static readonly help_v3_2;
        private static readonly help_v3_3;
        private static readonly help_v4;
        private static readonly help_v4_1;
        private static readonly help_v4_2;
        private static readonly help_v4_3;
        private static readonly help_mtx;
        private static readonly help_mtx_1;
        private static readonly help_mtx_2;
        private static readonly help_mtx_3;
        constructor();
        /**
         * 挂载的gameobject
         */
        gameObject: gameObject;
        /**
         * 场景渲染层级（common、transparent、overlay）
         */
        layer: RenderLayerEnum;
        /**
         * 渲染mask层级（和相机相对应）
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        private issetq;
        _queue: number;
        /**
         * 返回此组件的场景渲染层级排序依据queue大小
         */
        get queue(): number;
        /**
         * 设置此组件的场景渲染层级排序number大小
         */
        set queue(value: number);
        /**
         * 材质数组
         */
        materials: material[];
        /**
         * @private
         */
        _player: aniplayer;
        /**
         * 返回动画播放组件
         */
        get player(): aniplayer;
        set player(p: aniplayer);
        private _mesh;
        /**
         * 返回mesh数据
         */
        get mesh(): mesh;
        /**
         * 设置mesh数据
         */
        set mesh(mesh: mesh);
        /**
         * @private
         */
        bones: transform[];
        /**
         * @private
         */
        rootBone: transform;
        /**
         * @private
         */
        center: math.vector3;
        /**
         * @private
         */
        size: math.vector3;
        /**
         * 最大骨骼数量
         * @version gd3d 1.0
         */
        maxBoneCount: number;
        private _efficient;
        private _skeletonMatrixData;
        _aabb: aabb;
        get aabb(): aabb;
        start(): void;
        onPlay(): void;
        /**
         * @private
         * @param index
         */
        getMatByIndex(index: number, outMtx: gd3d.math.matrix): any;
        private static VertexHelpMtx;
        calActualVertexByIndex(index: number, t: gd3d.math.vector3): void;
        private static readonly inteRayHelp_v3;
        private static readonly inteRayHelp_v3_1;
        private static readonly inteRayHelp_v3_2;
        private static readonly inteRayHelp_v3_3;
        private static readonly inteRayHelp_mtx;
        private static readonly inteRayHelp_mtx_1;
        private static readonly inteRayHelp_mtx_2;
        /**
         * @public
         * @language zh_CN
         * @param ray 射线
         * @classdesc
         * 射线检测
         * @version gd3d 1.0
         */
        intersects(ray: ray, outInfo: pickinfo): boolean;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    enum Interpolation {
        Linear = 0,
        Step = 1,
        Curve = 2
    }
    enum WrapMode {
        Default = 0,
        Once = 1,
        Clamp = 1,
        Loop = 2,
        PingPong = 4,
        ClampForever = 8
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 关键帧动画片段资源
     * @version gd3d 1.0
     */
    class keyFrameAniClip implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param jsonStr 动画json数据
         * @version gd3d 1.0
         */
        Parse(jsonStr: string): this;
        private length;
        /**
         * @public
         * @language zh_CN
         * 循环模式
         * @version gd3d 1.0
         */
        get wrapMode(): WrapMode;
        _wrapMode: WrapMode;
        /**
         * @public
         * @language zh_CN
         * 动画片段的帧率
         * @version gd3d 1.0
         */
        get fps(): number;
        private frameRate;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放时长
         * @version gd3d 1.0
         */
        get time(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 最大帧数
         * @version gd3d 1.0
         */
        get frameCount(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 属性变化曲线数组
         * @version gd3d 1.0
         */
        curves: AnimationCurve[];
        private _interpolation;
        get interpolation(): Interpolation;
    }
    class AnimationCurve {
        path: string;
        type: string;
        propertyName: string;
        keyFrames: keyFrame[];
    }
    class keyFrame {
        inTangent: number;
        outTangent: number;
        tangentMode: number;
        time: number;
        value: number;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class UniformData {
        type: render.UniformTypeEnum;
        value: any;
        defaultValue: any;
        resname: string;
        constructor(type: render.UniformTypeEnum, value: any, defaultValue?: any);
    }
    /**
     * 批量渲染相关接口
     */
    interface DrawInstanceInfo {
        /**
         * 渲染数量
         */
        instanceCount: number;
        /**
         * 初始化Buffer
         *
         * @param gl
         */
        initBuffer(gl: WebGLRenderingContext): void;
        /**
         * 启用批量渲染相关顶点属性
         */
        activeAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void;
        /**
         * 禁用批量渲染相关顶点属性
         */
        disableAttributes(gl: WebGLRenderingContext, pass: render.glDrawPass): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 材质资源
     * @param buf buffer数组
     * @version gd3d 1.0
     */
    class material implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        private _enableGpuInstancing;
        get enableGpuInstancing(): boolean;
        set enableGpuInstancing(enable: boolean);
        private _shaderGUID;
        private _textureGUID;
        /** gpuInstancing 材质唯一ID */
        gpuInstancingGUID: string;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        private static sameMatPassMap;
        uploadUnifoms(pass: render.glDrawPass, context: renderContext, lastMatSame?: boolean): void;
        instanceAttribValMap: {
            [id: string]: number[];
        };
        /** gpu instancing 使用值上传 */
        /**
         * 上传InstanceAtteribute 数据
         * @param pass 绘制通道
         * @param darr 数组对象
         * @param ignoreMap 忽略列表
         */
        uploadInstanceAtteribute(pass: render.glDrawPass, darr: gd3d.math.ExtenArray<Float32Array>): void;
        private getInstanceAttribValue;
        private isNotBuildinAttribId;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置shader 不保留原有数据
         * @param shader shader实例
         * @version gd3d 1.0
         */
        setShader(shader: shader): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取shader的layer
         * @version gd3d 1.0
         */
        getLayer(): RenderLayerEnum;
        private queue;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取shader的queue
         * @version gd3d 1.0
         */
        getQueue(): number;
        setQueue(queue: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取shader
         * @version gd3d 1.0
         */
        getShader(): shader;
        private shader;
        /**
         * @private
         */
        defaultMapUniform: {
            [key: string]: {
                type: render.UniformTypeEnum;
                value?: any;
                becolor?: boolean;
                min?: number;
                max?: number;
            };
        };
        statedMapUniforms: {
            [id: string]: any;
        };
        /**
         * @private
         */
        setFloat(_id: string, _number: number): void;
        /**
         * @private
         */
        setFloatv(_id: string, _numbers: Float32Array): void;
        /**
         * @private
         */
        setVector4(_id: string, _vector4: math.vector4): void;
        /**
         * @private
         */
        setVector4v(_id: string, _vector4v: Float32Array): void;
        /**
         * @private
         */
        setMatrix(_id: string, _matrix: math.matrix): void;
        /**
         * @private
         */
        setMatrixv(_id: string, _matrixv: Float32Array): void;
        /**
         * @private
         */
        setTexture(_id: string, _texture: gd3d.framework.texture, resname?: string): void;
        private getTexGuid;
        private getShaderGuid;
        private refreshGpuInstancingGUID;
        setCubeTexture(_id: string, _texture: gd3d.framework.texture): void;
        private uniformDirtyMap;
        private static lastDrawMatID;
        private static lastDrawMeshID;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 绘制
         * @param context 渲染上下文
         * @param mesh 渲染的mesh
         * @param sm 渲染的submesh信息
         *
         * @param instanceCount 批量渲染时绘制数量
         * @version gd3d 1.0
         */
        draw(context: renderContext, mesh: mesh, sm: subMeshInfo, basetype?: string, drawInstanceInfo?: DrawInstanceInfo): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param assetmgr 资源管理实例
         * @param json json数据
         * @version gd3d 1.0
         */
        Parse(assetmgr: assetMgr, json: any, bundleName?: string): this;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 克隆
         * @version gd3d 1.0
         */
        clone(): material;
        save(): string;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * mesh资源
     * @version gd3d 1.0
     */
    class mesh implements IAsset {
        static readonly ClassName: string;
        maximun: math.vector3;
        minimun: math.vector3;
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        /**
         * @private
         */
        glMesh: gd3d.render.glMesh;
        updateByEffect: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh数据实例
         * @version gd3d 1.0
         */
        data: gd3d.render.meshData;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * submesh信息列表
         * @version gd3d 1.0
         */
        submesh: subMeshInfo[];
        /**
         * 是否使用多线程解析
         */
        static useThead: boolean;
        onReadFinish: () => void;
        private reading;
        private readProcess;
        private readFinish;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param buf buffer数组
         * @param webgl webgl实例
         * @version gd3d 1.0
         */
        Parse(inData: ArrayBuffer | any, webgl: WebGLRenderingContext): Promise<IAsset>;
        parseCMesh(inData: any, webgl: any): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         * @version gd3d 1.0
         */
        intersects(ray: ray, matrix: gd3d.math.matrix, outInfo: pickinfo): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 克隆mesh
         * @version gd3d 1.0
         */
        clone(): mesh;
        private _cacheMinP;
        private _cacheMaxP;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算模型顶点的 最大最小值
         * @param outMin 输出最小
         * @param outMax 输出最大
         * @version gd3d 1.0
         */
        calcVectexMinMax(outMin: math.vector3, outMax: math.vector3): void;
    }
    /**
     * @private
     */
    class subMeshInfo {
        matIndex: number;
        useVertexIndex: number;
        line: boolean;
        start: number;
        size: number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 路径编辑资源
     * @version gd3d 1.0
     */
    class pathasset implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 路径节点数据
         * @version gd3d 1.0
         */
        paths: gd3d.math.vector3[];
        private type;
        private instertPointcount;
        private items;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param json json数据
         * @version gd3d 1.0
         */
        Parse(json: JSON): this;
        private lines;
        private getpaths;
        private getBeisaierPointAlongCurve;
        private vec3Lerp;
    }
    /**
     * @private
     */
    enum pathtype {
        once = 0,
        loop = 1,
        pingpong = 2
    }
    /**
     * @private
     */
    enum epointtype {
        VertexPoint = 0,
        ControlPoint = 1
    }
    /**
     * @private
     */
    class pointitem {
        point: gd3d.math.vector3;
        type: epointtype;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 预设资源
     * @version gd3d 1.0
     */
    class prefab implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        isCab: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * prefab依赖的AssetBundle
         * @version gd3d 1.0
         */
        assetbundle: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        private trans;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取克隆的transform
         * @version gd3d 1.0
         */
        getCloneTrans(): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取克隆的transform2D
         * @version gd3d 1.0
         */
        getCloneTrans2D(): transform2D;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置当前指定的transform
         * @param trans transform实例
         * @version gd3d 1.0
         */
        apply(trans: transform): void;
        /**
         * @private
         */
        jsonstr: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param jsonStr json数据
         * @param assetmgr 资源管理实例
         * @version gd3d 1.0
         */
        Parse(jsonStr: string, assetmgr: assetMgr): Promise<unknown>;
        cParse(data: any): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 场景数据资源
     * @version gd3d 1.0
     */
    class rawscene implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 雾效
         * @version gd3d 1.0
         */
        fog: Fog;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 依赖的AssetBundle
         * @version gd3d 1.0
         */
        assetbundle: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        resetLightMap(assetmgr: assetMgr, bundleName?: string): void;
        private lightmapData;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param txt json数据
         * @param assetmgr 资源管理实例
         * @version gd3d 1.0
         */
        Parse(txt: string, assetmgr: assetMgr): Promise<rawscene>;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取场景根节点的克隆
         * @version gd3d 1.0
         */
        getSceneRoot(): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 应用lightmap到场景中
         * @param scene 场景实例
         * @version gd3d 1.0
         */
        useLightMap(scene: scene): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 应用雾效到场景中
         * @param scene 场景实例
         * @version gd3d 1.0
         */
        useFog(scene: scene): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 应用导航网格到场景中
         * @param scene 场景实例
         * @version gd3d 1.0
         */
        useNavMesh(scene: scene): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        private navMeshJson;
        private rootNode;
        private lightmaps;
    }
    /**
     * @private
     */
    class Fog {
        _Start: number;
        _End: number;
        _Color: gd3d.math.vector4;
        _Density: number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * shader资源
     * @version gd3d 1.0
     */
    class shader implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        passes: {
            [id: string]: gd3d.render.glDrawPass[];
        };
        /**
         * @private
         * shader mapunifrom 默认值
         */
        defaultMapUniform: {
            [key: string]: {
                type: render.UniformTypeEnum;
                value?: any;
                becolor?: boolean;
                min?: number;
                max?: number;
            };
        };
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置渲染的层级
         * @version gd3d 1.0
         */
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 解析资源
         * @param buf buffer数组
         * @version gd3d 1.0
         */
        parse(assetmgr: assetMgr, json: any): void;
        _parseProperties(assetmgr: assetMgr, properties: any): void;
        private _parsePass;
        fillUnDefUniform(pass: render.glDrawPass): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * sprite资源
     * @version gd3d 1.0
     */
    class sprite implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        bundle: assetBundle;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        private _texture;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前texture
         * @version gd3d 1.0
         */
        get texture(): texture;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置texture
         * @param value texture实例
         * @version gd3d 1.0
         */
        set texture(value: texture);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 所属图集
         * @version gd3d 1.0
         */
        atlas: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 有效区域
         * @version gd3d 1.0
         */
        rect: math.rect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 边距
         * @version gd3d 1.0
         */
        border: math.border;
        private _urange;
        private _vrange;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * uv的u范围
         * @version gd3d 1.0
         */
        get urange(): math.vector2;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * uv的v范围
         * @version gd3d 1.0
         */
        get vrange(): math.vector2;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 文本资源
     * @version gd3d 1.0
     */
    class textasset implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 文本内容
         * @version gd3d 1.0
         */
        content: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * texture资源
     * @version gd3d 1.0
     */
    class texture implements IAsset {
        static readonly ClassName: string;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @private
         */
        glTexture: gd3d.render.ITexture;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        private _realName;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 如果是imgdesc加载来的图片，通过这个可以获取到真实的图片名字
         * @version gd3d 1.0
         */
        get realName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置图片名称
         * @version gd3d 1.0
         */
        set realName(name: string);
    }
}
declare namespace gd3d.framework {
    class AudioEx {
        private static g_this;
        static instance(): AudioEx;
        audioContext: AudioContext;
        private constructor();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
         * @version gd3d 1.0
         */
        clickInit(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 从arraybuffer转成audiobuffer
         * @version gd3d 1.0
         * @param ab  二进制声音数据
         * @param fun
         */
        loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 从本地文件加载音频数据，返回audiobuffer
         * @version gd3d 1.0
         * @param url  文件地址
         * @param fun
         */
        loadAudioBuffer(url: string, fun: (buf: AudioBuffer, _err: Error) => void): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 初始化声音api，注意：在ios上面必须手动点击某个按钮来调用初始化，否则无法播放声音
        * @version gd3d 1.0
        */
        isAvailable(): boolean;
        createAudioChannel(be3DSound: boolean): AudioChannel;
        private static loadArrayBuffer;
    }
    class AudioChannel {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
        pannerNode: PannerNode;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取音量大小
        * @version gd3d 1.0
        */
        get volume(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置音量大小
         * @param value 音量值
         * @version gd3d 1.0
         */
        set volume(val: number);
        isplay: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止播放声音
         * @version gd3d 1.0
         */
        stop(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 动画播放器
     * @version gd3d 1.0
     */
    class aniplayer implements INodeComponent {
        static readonly ClassName: string;
        gameObject: gameObject;
        clips: animationClip[];
        autoplay: boolean;
        bones: tPoseInfo[];
        startPos: PoseBoneMatrix[];
        private _playClip;
        private clipnames;
        private bePlay;
        speed: number;
        private beCross;
        private beRevert;
        private _playTimer;
        private _playFrameid;
        private _playCount;
        private crossTotalTime;
        private crossRestTimer;
        private crossPercentage;
        private curFrame;
        private lastFrame;
        private carelist;
        private careBoneMat;
        private inversTpos;
        private startepose;
        get PlayFrameID(): number;
        get currentAniclipName(): string;
        get currentAniclip(): animationClip;
        /**
         * 动画循环播放次数
         */
        get playCount(): number;
        private init;
        addToCareList(bone: transform): void;
        private _awaitClips;
        /** 获取待加载的 动画片段名 列表 */
        awaitLoadClipNames(): string[];
        private _allClipNames;
        /** 所有的动画片段名列表，包含待加载的列表 */
        allClipNames(): string[];
        private collected;
        private collectClipNames;
        /** 添加动画片段 通过名字加载 */
        addClipByNameLoad(_assetMgr: assetMgr, resPath: string, clipName: string, callback?: (state: stateLoad, clipName: string) => any): void;
        /** 添加动画片段 */
        addClip(clip: animationClip): void;
        /** 是否有装载指定动画判断 */
        haveClip(name: string): boolean;
        /** 获取动画片段 */
        getClip(name: string): animationClip;
        start(): void;
        onPlay(): void;
        private temptMat;
        frameDirty: boolean;
        update(delta: number): void;
        private playEndDic;
        /**
         * @public
         * @language zh_CN
         * @param animName 动画片段名字
         * @param speed 播放速度
         * @param beRevert 是否倒播
         * @classdesc
         * 根据动画片段名字播放动画
         * @version gd3d 1.0
         */
        play(animName: string, onPlayEnd?: () => void, speed?: number, beRevert?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @param animName 动画片段名字
         * @param crosstimer 融合时间
         * @param speed 播放速度
         * @param beRevert 是否倒播
         * @classdesc
         * 根据动画片段名字播放动画
         * @version gd3d 1.0
         */
        playCross(animName: string, crosstimer: number, onPlayEnd?: () => void, speed?: number, beRevert?: boolean): void;
        private beActivedEndFrame;
        private endFrame;
        playToXFrame(animName: string, endframe: number, crosstimer?: number, onPlayEnd?: () => void, speed?: number): void;
        private recordeLastFrameData;
        private playAniclip;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止播放动画
         * @version gd3d 1.0
         */
        stop(): void;
        pause(): void;
        /**
         * 是否在播放动画
         */
        isPlay(): boolean;
        /**
         * 是否在停止动画
         */
        isStop(): boolean;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
        private checkFrameId;
        private OnClipPlayEnd;
        private beActived;
        private boneCache;
        private recyclecache;
        fillPoseData(data: Float32Array, bones: transform[]): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class tPoseInfo {
        static readonly ClassName: string;
        name: string;
        tposep: math.vector3;
        tposeq: math.quaternion;
    }
    enum PlayStyle {
        NormalPlay = 0,
        FramePlay = 1,
        PingPang = 2
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 骨骼组件
     * @version gd3d 1.0
     */
    class asbone implements INodeComponent {
        static readonly ClassName: string;
        constructor();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class AudioListener implements INodeComponent {
        static readonly ClassName: string;
        private listener;
        start(): void;
        onPlay(): void;
        private lastX;
        private lastY;
        private lastZ;
        private curPos;
        gameObject: gameObject;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class AudioPlayer implements INodeComponent {
        static readonly ClassName: string;
        buffer: AudioBuffer;
        beLoop: boolean;
        be3DSound: boolean;
        private audioChannel;
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放声音
         * @param buffer 音源缓冲对象
         * @param beLoop 是循环播放
         * @param volume 音量 0-1
         * @param onended 音源播放结束回调
         */
        play(buffer: AudioBuffer, beLoop?: boolean, volume?: number, onended?: Function): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 停止播放
        * @version gd3d 1.0
        */
        stop(): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取音量大小
        * @version gd3d 1.0
        */
        get volume(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置音量大小
         * @param value 音量值
         * @version gd3d 1.0
         */
        set volume(val: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获得当前音频播放器是否在播放
         * @version gd3d 1.0
         */
        isPlaying(): boolean;
        start(): void;
        onPlay(): void;
        private lastX;
        private lastY;
        private lastZ;
        private curPos;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class BeBillboard implements INodeComponent {
        static readonly ClassName: string;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        gameObject: gameObject;
        remove(): void;
        clone(): void;
        private beActive;
        setActive(active: boolean): void;
        private target;
        setTarget(trans: transform): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 脚本行文类
     * @version gd3d 1.0
     */
    class behaviour implements INodeComponent, IEnabled {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件启用
         * @version gd3d 1.0
         */
        enabled: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /** 初始化使用 */
        start(): void;
        /** 初始化使用 在start 之后 */
        onPlay(): void;
        /** 每帧调用一次 */
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * Bloom后期效果 控制器
     * @version gd3d 1.0
     */
    class bloomctr implements INodeComponent {
        static readonly ClassName: string;
        private _bloomIntensity;
        private _bloomThreshold;
        private _blurSpread;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 发光阈值 - 图像中亮度高于该阈值的区域将产生泛光效果
         * @version gd3d 1.0
         */
        get bloomThreshold(): number;
        set bloomThreshold(value: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 强度 - 附加光（影响到该特效的光源）的全局光强
         * @version gd3d 1.0
         */
        get bloomIntensity(): number;
        set bloomIntensity(value: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 模糊扩散 - Frag down sample 的偏移距离
         * @version gd3d 1.0
         */
        get blurSpread(): number;
        set blurSpread(value: number);
        private app;
        private scene;
        private camera;
        private material;
        private material_1;
        private material_2;
        private material_3;
        private readonly tag;
        /**
             * @public
             * @language zh_CN
             * @classdesc
             * 挂载的gameobject
             * @version gd3d 1.0
             */
        gameObject: gameObject;
        private _init;
        private init;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    interface ICameraPostQueue {
        render(scene: scene, context: renderContext, camera: camera): any;
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    class cameraPostQueue_Depth implements ICameraPostQueue {
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    class cameraPostQueue_Quad implements ICameraPostQueue {
        material: material;
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    class cameraPostQueue_Color implements ICameraPostQueue {
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    /**
     * @private
     */
    interface IOverLay {
        init: boolean;
        sortOrder: number;
        start(camera: camera): any;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): any;
        update(delta: number): any;
    }
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 视锥剔除组件，作为标记存在
    * @version gd3d 1.0
    */
    class camera implements INodeComponent {
        static readonly ClassName: string;
        constructor();
        private static helpv3;
        private static helpv3_1;
        private static helpv3_2;
        private static helpv3_3;
        private static helpv3_4;
        private static helpv3_5;
        private static helpv3_6;
        private static helpv3_7;
        private static helpmtx;
        private static helpmtx_1;
        private static helpmtx_2;
        private static helpmtx_3;
        private static helprect;
        private projectMatrixDirty;
        /**
         * 相机剔除时，计算 z 轴上的平面 （far & near plane）
         */
        cullZPlane: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        private _near;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机到近裁剪面距离
         * @version gd3d 1.0
         */
        get near(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置相机到近裁剪面距离
         * @version gd3d 1.0
         */
        set near(val: number);
        private _far;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机到远裁剪面距离
         * @version gd3d 1.0
         */
        get far(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置相机到远裁剪面距离
         * @version gd3d 1.0
         */
        set far(val: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机渲染剔除mask
         * @version gd3d 1.0
         */
        CullingMask: CullingMask;
        /**
         * 当前RenderContext 的 Index
         */
        get CurrContextIndex(): number;
        private _contextIdx;
        /**
         * @private
         */
        markDirty(): void;
        isEditorCam: boolean;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /** overLays update */
        private _updateOverLays;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否清除颜色缓冲区
         * @version gd3d 1.0
         */
        clearOption_Color: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否清除深度缓冲区
         * @version gd3d 1.0
         */
        clearOption_Depth: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 背景色
         * @version gd3d 1.0
         */
        backgroundColor: gd3d.math.color;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机视窗
         * @version gd3d 1.0
         */
        viewport: gd3d.math.rect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染目标
         * @version gd3d 1.0
         */
        renderTarget: gd3d.render.glRenderTarget;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * camera 渲染排序标记
         * @version gd3d 1.0
         */
        order: number;
        private overlays;
        /**
         * @public
         * @language zh_CN
         * @param overlay 2d组件
         * @classdesc
         * 添加2d渲染组件
         * @version gd3d 1.0
         */
        addOverLay(overLay: IOverLay): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 返回此相机上的overlays数组
         * @version gd3d 1.0
         */
        getOverLays(): IOverLay[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移除相机上的所有overly
         * @version gd3d 1.0
         */
        removeOverLay(overLay: IOverLay): void;
        private sortOverLays;
        private LastCamWorldMtx;
        /**
        * @public
        * @language zh_CN
        * 计算视矩阵, return 是否有变化
        * @param outMatrix 返回的视矩阵
        * @classdesc
        * 计算相机的viewmatrix（视矩阵）
        * @version gd3d 1.0
        */
        calcViewMatrix(outMatrix?: gd3d.math.matrix): boolean;
        /**
         * 当前的相机视口像素rect
         */
        readonly currViewPixelRect: math.rect;
        /**
         * 当前相机视口像素asp
         */
        currViewPixelASP: number;
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param viewportpixel 视口rect
         * @classdesc
         * 计算相机视口像素rect
         * @version gd3d 1.0
         */
        calcViewPortPixel(app: application, viewPortPixel?: math.rect): void;
        private lastAsp;
        /**
         * @public
         * @language zh_CN
         * 计算投影矩阵, return 是否有变化
         * @param asp
         * @param outMatrix projectmatrix（投影矩阵）
         * @classdesc
         * 计算相机投影矩阵
         * @version gd3d 1.0
         */
        calcProjectMatrix(asp: number, outMatrix: gd3d.math.matrix): boolean;
        /**
         * 计算视窗投影矩阵,return 是否有变化
         * @param app
         * @param outViewProjectMatrix
         * @param outViewMatrix
         * @param outProjectMatrix
         */
        calcViewProjectMatrix(app: application, outViewProjectMatrix?: math.matrix, outViewMatrix?: math.matrix, outProjectMatrix?: math.matrix): boolean;
        private static _shareRay;
        /**
         * @public
         * @language zh_CN
         * @param screenpos 屏幕坐标
         * @param app 主程序
         * @param shareRayCache 返回ray 实例 共用一个缓存射线对象 ，默认开启
         * @classdesc
         * 由屏幕坐标发射射线
         * @version gd3d 1.0
         */
        creatRayByScreen(screenpos: gd3d.math.vector2, app: application, shareRayCache?: boolean): ray;
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param screenpos 屏幕坐标
         * @param outWorldPos model空间坐标
         * @classdesc
         * 由屏幕坐标得到model空间坐标
         * @version gd3d 1.0
         */
        calcModelPosFromScreenPos(app: application, screenPos: math.vector3, outModelPos: math.vector3): void;
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param worldPos 世界坐标
         * @param outScreenPos 屏幕坐标
         * @classdesc
         * 由世界坐标得到屏幕坐标
         * @version gd3d 1.0
         */
        calcScreenPosFromWorldPos(app: application, worldPos: math.vector3, outScreenPos: math.vector2): void;
        /**
         * @public
         * @language zh_CN
         * @param app 主程序
         * @param worldPos 世界坐标
         * @param outScreenPos 屏幕坐标
         * @classdesc
         * 由世界坐标得到屏幕坐标
         * @version gd3d 1.0
         */
        /**
         * @public
         * @language zh_CN
         * @param app application
         * @param worldPos 世界空间坐标
         * @param outClipPos 计算返回裁剪空间坐标
         * @classdesc
         * 由世界坐标得到裁剪空间坐标
         * @version gd3d 1.0
         */
        calcClipPosFromWorldPos(app: application, worldPos: math.vector3, outClipPos: math.vector3): void;
        private lastCamMtx;
        private lastCamRect;
        private paraArr;
        /**
         * @private 计算相机框
         * @param app
         */
        private calcCameraFrame;
        private viewMatrix;
        private matProjP;
        private matProjO;
        private projectMatrix;
        private viewProjectMatrix;
        private InverseViewProjectMatrix;
        private frameVecs;
        private _fov;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 透视投影的fov
         * @version gd3d 1.0
         */
        set fov(val: number);
        get fov(): number;
        _size: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 正交投影的竖向size
         * @version gd3d 1.0
         */
        set size(val: number);
        get size(): number;
        private _opvalue;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         * @version gd3d 1.0
         */
        set opvalue(val: number);
        get opvalue(): number;
        /**
         * @private
         */
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: gd3d.math.vector2, app: application, z: number, out: gd3d.math.vector2): void;
        private cullingMap;
        isLastCamera: boolean;
        /**
        * @private
        */
        fillRenderer(scene: scene): void;
        private static lastFID;
        private needUpdateWpos;
        private _fillRenderer;
        private fruMap;
        private _vec3cache;
        isCulling(node: transform): boolean;
        /**
         * 剔除测试 ，返回 ture 确认为剔除
         * @param radius
         * @param center
         */
        cullTest(radius: number, center: math.vector3): boolean;
        private _edge1;
        private _edge2;
        private isRight;
        /**
         * [过时接口,完全弃用]
        * @private
        */
        testFrustumCulling(scene: scene, node: transform): boolean;
        /**
        * @private
        */
        _targetAndViewport(target: render.glRenderTarget, scene: scene, context: renderContext, withoutClear: boolean): void;
        /**
        * @private
        */
        _renderOnce(scene: scene, context: renderContext, drawtype: string): void;
        /**
        * @private
        */
        postQueues: ICameraPostQueue[];
        /**
        * @private
        */
        renderScene(scene: scene, context: renderContext, contextIdx: number): void;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * UI画布容器组件
     * @version gd3d 1.0
     */
    class canvascontainer implements INodeComponent {
        static readonly ClassName: string;
        constructor();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * UI canvas
         * @version gd3d 1.0
         */
        get canvas(): canvas;
        private _overlay2d;
        setOverLay(lay: overlay2D): void;
        getOverLay(): overlay2D;
        get sortOrder(): number;
        set sortOrder(order: number);
        private isCanvasinit;
        private canvasInit;
        private _lastMode;
        private _renderMode;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * renderMode UI render模式
         * @version gd3d 1.0
         */
        get renderMode(): canvasRenderMode;
        set renderMode(mode: canvasRenderMode);
        private styleToMode;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * UI画布容器RenderMode
     * @version gd3d 1.0
     */
    enum canvasRenderMode {
        ScreenSpaceOverlay = 0,
        ScreenSpaceCamera = 1,
        WorldSpace = 2
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 特效组件
     * @version gd3d 1.0
     */
    class effectSystem implements IRenderer {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同层级渲染排序依据
         * @version gd3d 1.0
         */
        queue: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自动播放
         * @version gd3d 1.0
         */
        autoplay: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效是否循环
         * @version gd3d 1.0
         */
        beLoop: boolean;
        /**
        * @private
        */
        state: EffectPlayStateEnum;
        private curFrameId;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效播放速度
         * @version gd3d 1.0
         */
        static fps: number;
        private playTimer;
        private speed;
        /**
        * @private
        */
        webgl: WebGLRenderingContext;
        private parser;
        /**
        * @private
        */
        vf: number;
        /**
        * @private
        */
        private effectBatchers;
        private particles;
        private matDataGroups;
        private particleElementDic;
        /**
        * @private
        */
        private _textasset;
        set jsonData(text: textasset);
        get jsonData(): textasset;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置特效数据 textasset
         * @version gd3d 1.0
         */
        setJsonData(_jsonData: textasset): void;
        setJsonDataStr(_jsonStr: string): void;
        /**
         * 更新特效数据
         * @param _jsonData
         */
        updateJsonData(_jsonData: textasset): void;
        updateJsonDataStr(_jsonStr: string): void;
        /**
        * @private
        */
        set data(value: EffectSystemData);
        /**
        * @private
        */
        get data(): EffectSystemData;
        /**
        * @private
        */
        init(): void;
        private _data;
        /**
        * @private
        */
        get totalFrameCount(): number;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * 更新特效数据
         *
         * @private
         * @param {number} delta
         *
         * @memberof effectSystem
         */
        private _update;
        /**
         * 将插值信息合并到当前帧数据
         *
         * @param {EffectAttrsData} realUseCurFrameData
         * @param {EffectFrameData} curFrameData
         * @returns
         *
         * @memberof effectSystem
         */
        private mergeLerpAttribData;
        /**
         * 根据当前帧的数据更新EffectBatcher中的vbo，ebo信息
         *
         * @private
         * @param {EffectBatcher} effectBatcher
         * @param {EffectAttrsData} curAttrsData
         * @param {EffectFrameData} initFrameData
         * @param {number} vertexStartIndex
         * @param {number} delta
         * @returns
         *
         * @memberof effectSystem
         */
        private updateEffectBatcher;
        /**
         * 提交各个EffectBatcher中的数据进行渲染
         *
         * @param {renderContext} context
         * @param {assetMgr} assetmgr
         * @param {gd3d.framework.camera} camera
         *
         * @memberof effectSystem
         */
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        /**
         * @private
         */
        clone(): effectSystem;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 播放特效
         * @version gd3d 1.0
         */
        play(speed?: number): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 暂停播放
         * @version gd3d 1.0
         */
        pause(): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 停止播放
         * @version gd3d 1.0
         */
        stop(): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 重置到初始状态
         * @version gd3d 1.0
         */
        reset(restSinglemesh?: boolean, resetParticle?: boolean): void;
        private resetSingleMesh;
        private resetparticle;
        private delayElements;
        private refElements;
        /**
         * 向特效中增加元素
         */
        private addElements;
        private addElement;
        /**
        * 根据初始化帧的数据，初始effectbatcher。根据mesh的材质增加或者合并mesh。同材质的就合并。
        */
        private addInitFrame;
        /**
        * @private
        */
        setFrameId(id: number): void;
        /**
        * @private
        */
        getDelayFrameCount(delayTime: number): number;
        private beExecuteNextFrame;
        /**
         * 计算当前的frameid
         *
         * @private
         *
         * @memberof effectSystem
         */
        private checkFrameId;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        * 临时测试时显示使用
        * @readonly
        * @type {number}
        * @memberof effectSystem
        */
        get leftLifeTime(): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 特效组件
     * @version gd3d 1.0
     */
    class TestEffectSystem implements IRenderer {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同层级渲染排序依据
         * @version gd3d 1.0
         */
        queue: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自动播放
         * @version gd3d 1.0
         */
        autoplay: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效是否循环
         * @version gd3d 1.0
         */
        beLoop: boolean;
        /**
        * @private
        */
        state: EffectPlayStateEnum;
        private curFrameId;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效播放速度
         * @version gd3d 1.0
         */
        static fps: number;
        private playTimer;
        private speed;
        /**
        * @private
        */
        webgl: WebGLRenderingContext;
        private parser;
        /**
        * @private
        */
        vf: number;
        /**
        * @private
        */
        private emissionElement;
        private effectBatchers;
        private particles;
        private matDataGroups;
        private particleElementDic;
        /**
        * @private
        */
        jsonData: textasset;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置特效数据 textasset
         * @version gd3d 1.0
         */
        setJsonData(_jsonData: textasset): void;
        /**
        * @private
        */
        set data(value: EffectSystemData);
        /**
        * @private
        */
        get data(): EffectSystemData;
        /**
        * @private
        */
        init(): void;
        private _data;
        /**
        * @private
        */
        get totalFrameCount(): number;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * 更新特效数据
         *
         * @private
         * @param {number} delta
         *
         * @memberof effectSystem
         */
        private _update;
        /**
         * 提交各个EffectBatcher中的数据进行渲染
         *
         * @param {renderContext} context
         * @param {assetMgr} assetmgr
         * @param {gd3d.framework.camera} camera
         *
         * @memberof effectSystem
         */
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        /**
         * @private
         */
        clone(): effectSystem;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 播放特效
         * @version gd3d 1.0
         */
        play(speed?: number): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 暂停播放
         * @version gd3d 1.0
         */
        pause(): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 停止播放
         * @version gd3d 1.0
         */
        stop(): void;
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 重置到初始状态
         * @version gd3d 1.0
         */
        reset(restSinglemesh?: boolean, resetParticle?: boolean): void;
        private resetSingleMesh;
        private delayElements;
        private refElements;
        /**
         * 向特效中增加元素
         */
        private addElements;
        private addElement;
        addEmissionElement(data?: EffectElementData): void;
        /**
        * @private
        */
        setFrameId(id: number): void;
        /**
        * @private
        */
        getDelayFrameCount(delayTime: number): number;
        private beExecuteNextFrame;
        /**
         * 计算当前的frameid
         *
         * @private
         *
         * @memberof effectSystem
         */
        private checkFrameId;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        * 临时测试时显示使用
        * @readonly
        * @type {number}
        * @memberof effectSystem
        */
        get leftLifeTime(): number;
    }
}
declare namespace gd3d.framework {
    class f4skinnedMeshRenderer implements IRenderer {
        static readonly ClassName: string;
        private static readonly boneSampler;
        private static readonly boneSamplerTexelSize;
        /**
         * 挂载的gameobject
         */
        gameObject: gameObject;
        /**
         * 场景渲染层级（common、transparent、overlay）
         */
        layer: RenderLayerEnum;
        /**
         * 渲染mask层级（和相机相对应）
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        private issetq;
        _queue: number;
        /**
         * 返回此组件的场景渲染层级排序依据queue大小
         */
        get queue(): number;
        /**
         * 设置此组件的场景渲染层级排序number大小
         */
        set queue(value: number);
        /**
         * 材质数组
         */
        materials: material[];
        /**
         * @private
         */
        private _mesh;
        /**
         * 返回mesh数据
         */
        get mesh(): mesh;
        /**
         * 设置mesh数据
         */
        set mesh(mesh: mesh);
        /**
         * @private
         */
        bones: transform[];
        /**
         * @private
         */
        rootBone: transform;
        /**
         * @private
         */
        center: math.vector3;
        /**
         * @private
         */
        size: math.vector3;
        _aabb: aabb;
        get aabb(): aabb;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
        useBoneTexture: boolean;
        ibmContainer: gd3d.math.vector4[];
        ibm: gd3d.math.matrix[];
        private boneMatrices;
        boneMatrixChunks: Float32Array[];
        boneMatricesTexture: gd3d.framework.texture;
        initBoneMatrices(): void;
        initStaticPoseMatrices(): void;
        private boneSamplerTexindex;
        updateBoneTexture(context: renderContext): void;
        tempMatrix: math.matrix;
        inverseRootBone: math.matrix;
        updateBoneMatrix(): void;
        matrixMultiplyToArray(lhs: gd3d.math.matrix, rhs: gd3d.math.matrix, out: Float32Array): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 视锥剔除组件，作为标记存在
     * @version gd3d 1.0
     */
    class frustumculling implements INodeComponent {
        static readonly ClassName: string;
        constructor();
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 挂载的gameobject
        * @version gd3d 1.0
        */
        gameObject: gameObject;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 路径组件
     * @version gd3d 1.0
     */
    class guidpath implements INodeComponent {
        static readonly ClassName: string;
        private paths;
        private _pathasset;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置路径组件需要的路径资源
         * @version gd3d 1.0
         */
        set pathasset(pathasset: pathasset);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 路径组件的pathasset
         * @version gd3d 1.0
         */
        get pathasset(): pathasset;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移动速度
         * @version gd3d 1.0
         */
        speed: number;
        private isactived;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 按照路径开始移动
         * @version gd3d 1.0
         */
        play(loopCount?: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 暂停移动
         * @version gd3d 1.0
         */
        pause(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止移动
         * @version gd3d 1.0
         */
        stop(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 重新按照路径移动
         * @version gd3d 1.0
         */
        replay(loopCount?: number): void;
        private mystrans;
        private datasafe;
        private folowindex;
        isloop: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载此组件的gameobject是否朝向前方
         * @version gd3d 1.0
         */
        lookforward: boolean;
        private loopCount;
        private oncomplete;
        /**
         * @public
         * @language zh_CN
         * @param pathasset 路径资源
         * @param speed 移动速度
         * @param oncomplete 按照路径移动结束需要执行的事件
         * @classdesc
         * 设置路径组件的需要的参数
         * @version gd3d 1.0
         */
        setpathasset(pathasset: pathasset, speed?: number, oncomplete?: () => void): void;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        private adjustDir;
        private followmove;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 挂载的gameobject
        * @version gd3d 1.0
        */
        gameObject: gameObject;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    enum AnimationCullingType {
        /** Animation culling is disabled - object is animated even when offscreen. */
        AlwaysAnimate = 0,
        /** Animation is disabled when renderers are not visible. */
        BasedOnRenderers = 1,
        BasedOnClipBounds = 2,
        BasedOnUserBounds = 3
    }
    class keyFrameAniPlayer implements INodeComponent {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 关键帧动画数组
         * @version gd3d 1.0
         */
        clips: keyFrameAniClip[];
        private clipMap;
        private _nowClip;
        private get nowFrame();
        private nowTime;
        private pathPropertyMap;
        gameObject: gameObject;
        private playEndDic;
        private _currClipName;
        /** 获得当前片段的名字 */
        get currClipName(): string;
        private _speed;
        /** 播放速度 */
        get speed(): number;
        set speed(v: number);
        private _animateOnlyIfVisible;
        /** 动画是否仅仅可显示时 有效播放 */
        get animateOnlyIfVisible(): boolean;
        set animateOnlyIfVisible(v: boolean);
        private _cullingType;
        /** 动画的剔除类型 */
        get cullingType(): AnimationCullingType;
        set cullingType(v: AnimationCullingType);
        private _localBounds;
        /** 动画的剔除类型 */
        get localBounds(): aabb;
        set localBounds(v: aabb);
        /** 播放结束的归一化时间点 范围 0 ~ 1 */
        private endNormalizedTime;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * 获取指定名称的clip 资源
         * @param clipName
         */
        getClip(clipName: string): keyFrameAniClip;
        private displayByTime;
        private static lhvec;
        private static rhvec;
        private static lhquat;
        private static rhquat;
        private static resvec;
        private static resquat;
        private static vec3lerp;
        private static quatSlerp;
        private calcValueByTime;
        private eulerStatusMap;
        private eulerMap;
        private refrasCurveProperty;
        private timeFilterCurves;
        private checkPlayEnd;
        private init;
        /**
         * 动画是否在播放
         * @param ClipName 指定片段名 ，不指定仅判断当前是否在执行
         */
        isPlaying(ClipName?: string): boolean;
        /**
         * 播放动画
         * @param ClipName 指定播放的动画 片段名（为空状态播放队列第一个）
         * @param onPlayEnd 播放结束后回调函数
         * @param normalizedTime 播放结束时间点归一化时间（范围：0~1）
         */
        play(ClipName?: string, onPlayEnd?: () => void, normalizedTime?: number): void;
        /**
         * 播放动画 通过 clip
         * @param clip
         */
        private playByClip;
        /** clip 播放完毕 */
        private OnClipPlayEnd;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止默认动画
         * @version gd3d 1.0
         */
        stop(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 倒带默认动画
         * @version gd3d 1.0
         */
        rewind(): void;
        addClip(clip: keyFrameAniClip): void;
        private collectPropertyObj;
        private collectPathPropertyObj;
        private serchChild;
        clone(): void;
        remove(): void;
    }
}
declare namespace gd3d.framework {
    enum LightTypeEnum {
        Direction = 0,
        Point = 1,
        Spot = 2
    }
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 灯光组件
    * @version gd3d 1.0
    */
    class light implements INodeComponent {
        static readonly ClassName: string;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 挂载的gameobject
        * @version gd3d 1.0
        */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 光源类型
         * @version gd3d 1.0
         */
        type: LightTypeEnum;
        /**
        * @private
        */
        spotAngelCos: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 光源范围
         * @version gd3d 1.0
         */
        range: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 光源强度
         * @version gd3d 1.0
         */
        intensity: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 光源颜色
         * @version gd3d 1.0
         */
        color: math.color;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 光照剔除mask
        * @version gd3d 1.0
        */
        cullingMask: number;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 球形碰撞盒结构体
     * @version gd3d 1.0
     */
    class spherestruct {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 球形碰撞盒中心点
         * @version gd3d 1.0
         */
        center: gd3d.math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 球形碰撞盒半径（缩放处理过的半径）
         * @version gd3d 1.0
         */
        radius: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 球形碰撞盒半径（collider定义的源半径）
         * @version gd3d 1.0
         */
        srcradius: number;
        private tempScale;
        private srcCenter;
        constructor(_center: math.vector3, _r: number);
        update(worldmatrix: math.matrix): void;
        /**
         * @public
         * @language zh_CN
         * @param bound 碰撞体
         * @classdesc
         * 碰撞体检测碰撞
         * @version gd3d 1.0
         */
        intersects(bound: any): boolean;
        /**
         * @public
         * @language zh_CN
         * @param axis 指定轴
         * @param out 长度范围
         * @classdesc
         * 计算到指定轴上投影的长度
         * @version gd3d 1.0
         */
        computeExtentsByAxis(axis: math.vector3, out: math.vector2): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 球形碰撞盒组件
     * @version gd3d 1.0
     */
    class spherecollider implements INodeComponent, ICollider {
        static readonly ClassName: string;
        private static helpMat;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
       * @public
       * @language zh_CN
       * @classdesc
       * 子transform
       * @version gd3d 1.0
       */
        subTran: transform;
        /**
        * @private
        */
        filter: meshFilter;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞球数据
         * @version gd3d 1.0
         */
        spherestruct: spherestruct;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞球中心点
         * @version gd3d 1.0
         */
        center: math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞球大小
         * @version gd3d 1.0
         */
        radius: number;
        /**
         * @private
         */
        _worldCenter: math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞球中心点
         * @version gd3d 1.0
         */
        get worldCenter(): math.vector3;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞球数据
         * @version gd3d 1.0
         */
        getBound(): spherestruct;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取该碰撞盒物体的世界矩阵
        * @version gd3d 1.0
        */
        get matrix(): gd3d.math.matrix;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
        * @private
        */
        _colliderVisible: boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 返回碰撞盒可见性
        * @version gd3d 1.0
        */
        get colliderVisible(): boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 设置碰撞盒是否可见
        * @version gd3d 1.0
        */
        set colliderVisible(value: boolean);
        /**
        * @private
        */
        caclPlaneInDir(v0: math.vector3, v1: math.vector3, v2: math.vector3): boolean;
        /**
        * @public
        * @language zh_CN
        * @param tran 目标transform
        * @classdesc
        * 检测碰撞
        * @version gd3d 1.0
        */
        intersectsTransform(tran: transform): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒
        * @version gd3d 1.0
        */
        private build;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建碰撞盒mesh 并显示
        * @version gd3d 1.0
        */
        private buildMesh;
        private setMeshRenderer;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 获取碰撞盒mesh
        * @version gd3d 1.0
        */
        private getColliderMesh;
        /**
        * @private
        */
        remove(): void;
        /**
        * @private
        */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 拖尾组件
    * @version gd3d 1.0
    */
    class trailRender implements IRenderer {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景渲染层级（common、transparent、overlay）
         * @version gd3d 1.0
         */
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染mask层级（和相机相对应）
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number;
        private width;
        private _material;
        private _color;
        private mesh;
        private vertexcount;
        private dataForVbo;
        private dataForEbo;
        private sticks;
        private active;
        private reInit;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * start
        * @version gd3d 1.0
        */
        start(): void;
        onPlay(): void;
        private app;
        private webgl;
        private camerapositon;
        /**
       * @public
       * @language zh_CN
       * @classdesc
       * 拖尾mesh是否向经过路径的单边延展
       * @version gd3d 1.0
       */
        extenedOneSide: boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * update
        * @version gd3d 1.0
        */
        update(delta: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version gd3d 1.0
         */
        gameObject: gameObject;
        /**
         * @public
         * @language zh_CN
        * @param material 材质
         * @classdesc
         * 设置拖尾的材质
         * @version gd3d 1.0
         */
        set material(material: gd3d.framework.material);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 得到拖尾上的材质
        * @version gd3d 1.0
        */
        get material(): gd3d.framework.material;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        *  返回 matrial调色
        * @version gd3d 1.0
        */
        get color(): gd3d.math.color;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        *设置 matrial颜色
        * @version gd3d 1.0
        */
        set color(color: gd3d.math.color);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 拖尾速度，调节拖尾长短（0-1）
        * @version gd3d 1.0
        */
        setspeed(upspeed: number): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 调节拖尾宽度
        * @version gd3d 1.0
        */
        setWidth(Width: number): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 开始拖尾
        * @version gd3d 1.0
        */
        play(): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 关闭拖尾
        * @version gd3d 1.0
        */
        stop(): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 拖尾是否朝向相机
        * @version gd3d 1.0
        */
        lookAtCamera: boolean;
        private initmesh;
        private reInitdata;
        isAlphaGradual: boolean;
        private inited;
        private intidata;
        private speed;
        private updateTrailData;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * render
        * @version gd3d 1.0
        */
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        /**
        * @private
        */
        clone(): void;
        /**
        * @private
        */
        remove(): void;
    }
    /**
     * @private
     */
    class trailStick {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
    }
}
declare namespace gd3d.framework {
    /**
    * @private
    * @language zh_CN
    * @classdesc
    * 拖尾组件，废弃
    * @version gd3d 1.0
    */
    class trailRender_recorde implements IRenderer {
        static readonly ClassName: string;
        layer: RenderLayerEnum;
        get renderLayer(): number;
        set renderLayer(layer: number);
        queue: number;
        private _startWidth;
        private _endWidth;
        lifetime: number;
        minStickDistance: number;
        maxStickCout: number;
        private _material;
        private _startColor;
        private _endColor;
        private trailTrans;
        private nodes;
        private mesh;
        private dataForVbo;
        private dataForEbo;
        interpolate: boolean;
        interpNumber: number;
        interpPath: trailNode[];
        private targetPath;
        set material(material: gd3d.framework.material);
        get material(): gd3d.framework.material;
        get startColor(): gd3d.math.color;
        set startColor(color: gd3d.math.color);
        set endColor(color: gd3d.math.color);
        get endColor(): gd3d.math.color;
        setWidth(startWidth: number, endWidth?: number): void;
        private activeMaxpointlimit;
        setMaxpointcontroll(value?: boolean): void;
        start(): void;
        onPlay(): void;
        private app;
        private webgl;
        update(delta: number): void;
        gameObject: gameObject;
        /**
        * @private
        */
        remove(): void;
        private refreshTrailNode;
        private notRender;
        private updateTrailData;
        private checkBufferSize;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        /**
        * @private
        */
        clone(): void;
    }
    class trailNode {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
        time: number;
        handle: gd3d.math.vector3;
        trailNodes: trailNode[];
        constructor(p: gd3d.math.vector3, updir: gd3d.math.vector3, t: number);
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * Vignetting后期效果 控制器
     * @version gd3d 1.0
     */
    class vignettingCtr implements INodeComponent {
        static readonly ClassName: string;
        private app;
        private scene;
        private camera;
        private material;
        material_1: material;
        private material_2;
        private material_3;
        private readonly tag;
        /**
             * @public
             * @language zh_CN
             * @classdesc
             * 挂载的gameobject
             * @version gd3d 1.0
             */
        gameObject: gameObject;
        private _init;
        private init;
        start(): void;
        onPlay(): void;
        update(delta: number): void;
        /**
         * @private
         */
        remove(): void;
        /**
         * @private
         */
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class f14EffectSystem implements IRenderer {
        private bundleName;
        static readonly ClassName: string;
        layer: RenderLayerEnum;
        get renderLayer(): number;
        set renderLayer(layer: number);
        queue: number;
        start(): void;
        onPlay(): void;
        gameObject: gameObject;
        private fps;
        data: F14EffectData;
        layers: F14Layer[];
        VF: number;
        webgl: WebGLRenderingContext;
        private _f14eff;
        /**
         * f14eff 资源
         * @private
         */
        get f14eff(): f14eff;
        set f14eff(asset: f14eff);
        private _delayTime;
        /**
         * delaytime
         * @private
         */
        get delay(): number;
        set delay(deley: number);
        setData(data: F14EffectData, bundleName: string): void;
        constructor(bundleName: string);
        /**
         * ref effect 增加transform层控制
         */
        get root(): transform;
        _root: transform;
        private elements;
        renderBatch: F14Basebatch[];
        private loopCount;
        private allTime;
        private renderActive;
        beref: boolean;
        update(deltaTime: number): void;
        private OnEndOnceLoop;
        private _renderCamera;
        get renderCamera(): camera;
        mvpMat: math.matrix;
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue?: number): void;
        private totalTime;
        restartFrame: number;
        totalFrame: number;
        private addF14layer;
        getElementCount(): number;
        private playRate;
        enabletimeFlow: boolean;
        enableDraw: boolean;
        private onFinish;
        play(onFinish?: () => void, PlayRate?: number): void;
        stop(): void;
        pause(): void;
        changeColor(newcolor: math.color): void;
        changeAlpha(newAlpha: number): void;
        reset(): void;
        clone(): void;
        remove(): void;
    }
    enum PlayStateEnum {
        play = 0,
        beReady = 1,
        pause = 2
    }
}
declare namespace gd3d.framework {
    enum F14TypeEnum {
        SingleMeshType = 0,
        particlesType = 1,
        RefType = 2
    }
    interface F14Element {
        type: F14TypeEnum;
        update(deltaTime: number, frame: number, fps: number): any;
        dispose(): any;
        reset(): any;
        OnEndOnceLoop(): any;
        changeColor(value: math.color): any;
        changeAlpha(value: number): any;
        layer: F14Layer;
        drawActive: boolean;
    }
}
declare namespace gd3d.framework {
    class F14Layer {
        active: boolean;
        effect: f14EffectSystem;
        data: F14LayerData;
        type: F14TypeEnum;
        frameList: number[];
        frames: {
            [index: number]: F14Frame;
        };
        Attlines: {
            [name: string]: F14AttTimeLine;
        };
        element: F14Element;
        batch: F14Basebatch;
        constructor(effect: f14EffectSystem, data: F14LayerData);
        addFrame(index: number, framedata: F14FrameData): F14Frame;
        removeFrame(frame: number): void;
        dispose(): void;
    }
    class F14Frame {
        layer: F14Layer;
        data: F14FrameData;
        attDic: {
            [name: string]: any;
        };
        constructor(layer: F14Layer, data: F14FrameData);
        setdata(name: string, obj: any): void;
        removedata(name: string): void;
        getdata(name: string): any;
    }
    class F14AttTimeLine {
        name: string;
        lerpFunc: (from: any, to: any, lerp: any, out: any) => void;
        cloneFunc: (from: any, to: any) => void;
        constructor(name: string, lerpfunc: (from: any, to: any, lerp: any, out: any) => void, clonefunc: (from: any, to: any) => void);
        frameList: number[];
        line: {
            [index: number]: any;
        };
        addNode(frame: number, value: any): void;
        remove(frame: number): void;
        getValue(frame: number, basedate: F14SingleMeshBaseData, out: any): void;
    }
}
declare namespace gd3d.framework {
    class F14EffectData {
        beloop: boolean;
        lifeTime: number;
        layers: F14LayerData[];
        parsejson(json: any, assetmgr: assetMgr, assetbundle: string): this;
    }
    class F14LayerData {
        Name: string;
        type: F14TypeEnum;
        elementdata: F14ElementData;
        frames: {
            [frame: number]: F14FrameData;
        };
        constructor();
        parse(json: any, assetmgr: assetMgr, assetbundle: string): void;
    }
    class F14FrameData {
        frameindex: number;
        singlemeshAttDic: {
            [name: string]: any;
        };
        EmissionData: F14EmissionBaseData;
        constructor(index: number, type: F14TypeEnum);
    }
}
declare namespace gd3d.framework {
    interface F14ElementData {
        parse(json: any, assetmgr: assetMgr, assetbundle: string): any;
    }
}
declare namespace gd3d.framework {
    class NumberData {
        isRandom: boolean;
        _value: number;
        _valueLimitMin: number;
        _valueLimitMax: number;
        beInited: boolean;
        key: number;
        setValue(value: number): void;
        setRandomValue(max: number, min: number): void;
        /**
         * 针对随机类型，只要随机过一次就返回值不变（rerandom=false），返回新的随机值（rerandom=true）
         */
        getValue(reRandom?: boolean): number;
        constructor(value?: number);
        static copyto(from: NumberData, to: NumberData): void;
        static FormJson(json: string, data: NumberData): void;
    }
    class Vector3Data {
        x: NumberData;
        y: NumberData;
        z: NumberData;
        constructor(x?: number, y?: number, z?: number);
        getValue(reRandom?: boolean): math.vector3;
        static copyto(from: Vector3Data, to: Vector3Data): void;
        static FormJson(json: string, data: Vector3Data): void;
    }
    class NumberKey {
        key: number;
        value: number;
        constructor(_key: number, _value: number);
    }
    class Vector3Key {
        key: number;
        value: math.vector3;
        constructor(_key: number, _value: math.vector3);
    }
    class Vector2Key {
        key: number;
        value: math.vector2;
        constructor(_key: number, _value: math.vector2);
    }
}
declare namespace gd3d.framework {
    class F14Emission implements F14Element {
        type: F14TypeEnum;
        layer: F14Layer;
        drawActive: boolean;
        effect: f14EffectSystem;
        baseddata: F14EmissionBaseData;
        currentData: F14EmissionBaseData;
        particlelist: F14Particle[];
        deadParticles: F14Particle[];
        private frameLife;
        private TotalTime;
        private newStartDataTime;
        curTime: number;
        private beover;
        private numcount;
        localMatrix: math.matrix;
        private _worldMatrix;
        private localrot;
        private worldRot;
        vertexCount: number;
        vertexLength: number;
        dataforvboLen: number;
        dataforebo: Uint16Array;
        posArr: math.vector3[];
        colorArr: math.color[];
        uvArr: math.vector2[];
        private frameGap;
        constructor(effect: f14EffectSystem, layer: F14Layer);
        private lastFrame;
        update(deltaTime: number, frame: number, fps: number): void;
        private refreshByFrameData;
        changeCurrentBaseData(data: F14EmissionBaseData): void;
        private initBycurrentdata;
        getWorldMatrix(): math.matrix;
        getWorldRotation(): math.quaternion;
        private updateLife;
        private reInit;
        private bursts;
        private updateEmission;
        private addParticle;
        reset(): void;
        changeColor(value: math.color): void;
        private settedAlpha;
        changeAlpha(value: number): void;
        OnEndOnceLoop(): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    enum RenderModelEnum {
        None = 0,
        BillBoard = 1,
        StretchedBillBoard = 2,
        HorizontalBillBoard = 3,
        VerticalBillBoard = 4,
        Mesh = 5
    }
    class F14EmissionBaseData implements F14ElementData {
        loopenum: LoopEnum;
        mesh: mesh;
        material: material;
        rotPosition: math.vector3;
        rotScale: math.vector3;
        rotEuler: math.vector3;
        rendermodel: RenderModelEnum;
        beloop: boolean;
        lifeTime: NumberData;
        simulateInLocalSpace: boolean;
        startScaleRate: NumberData;
        startScale: Vector3Data;
        startEuler: Vector3Data;
        startColor: Vector3Data;
        startAlpha: NumberData;
        colorRate: number;
        simulationSpeed: NumberData;
        start_tex_st: math.vector4;
        delayTime: number;
        duration: number;
        rateOverTime: NumberData;
        bursts: busrtInfo[];
        shapeType: ParticleSystemShape;
        width: number;
        height: number;
        depth: number;
        radius: number;
        angle: number;
        emitFrom: emitfromenum;
        enableVelocityOverLifetime: boolean;
        moveSpeed: Vector3Data;
        enableSizeOverLifetime: boolean;
        sizeNodes: NumberKey[];
        enableRotOverLifeTime: boolean;
        angleSpeed: NumberData;
        enableColorOverLifetime: boolean;
        colorNodes: Vector3Key[];
        alphaNodes: NumberKey[];
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        uSpeed: number;
        vSpeed: number;
        row: number;
        column: number;
        count: number;
        parse(json: any, assetmgr: assetMgr, assetbundle: string): void;
        static getRandomDirAndPosByZEmission(emission: F14EmissionBaseData, outDir: gd3d.math.vector3, outPos: gd3d.math.vector3): void;
    }
    class busrtInfo {
        time: number;
        count: NumberData;
        private _beburst;
        beburst(): boolean;
        burst(bebusrt?: boolean): void;
        static CreatformJson(json: any): busrtInfo;
    }
}
declare namespace gd3d.framework {
    class F14EmissionBatch implements F14Basebatch {
        type: F14TypeEnum;
        effect: f14EffectSystem;
        emission: F14Emission;
        private mesh;
        private mat;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        curRealVboCount: number;
        curVertexcount: number;
        curIndexCount: number;
        vertexLength: number;
        constructor(effect: f14EffectSystem, element: F14Emission);
        private getMaxParticleCount;
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number): void;
        unRender(): void;
        getElementCount(): number;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class F14Particle {
        private data;
        private element;
        private totalLife;
        private startScaleRate;
        private startScale;
        Starteuler: math.vector3;
        StartPos: math.vector3;
        startColor: math.vector3;
        startAlpha: number;
        colorRate: number;
        private simulationSpeed;
        private simulateInLocalSpace;
        private starTex_ST;
        private speedDir;
        enableVelocityOverLifetime: boolean;
        private movespeed;
        enableSizeOverLifetime: boolean;
        private sizeNodes;
        enableRotOverLifeTime: boolean;
        eulerSpeed: number;
        enableColorOverLifetime: boolean;
        private colorNodes;
        private alphaNodes;
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        tex_ST: math.vector4;
        rotationByEuler: math.quaternion;
        rotationByShape: math.quaternion;
        startRotation: math.quaternion;
        rotAngle: number;
        localMatrix: math.matrix;
        localTranslate: math.vector3;
        localRotation: math.quaternion;
        localScale: math.vector3;
        color: math.vector3;
        alpha: number;
        private Color;
        private curLife;
        private life01;
        actived: boolean;
        private emissionMatToWorld;
        private emissionWorldRotation;
        private getEmissionMatToWorld;
        private getemissionWorldRotation;
        constructor(element: F14Emission, data: F14EmissionBaseData);
        initByEmissionData(data: F14EmissionBaseData): void;
        update(deltaTime: number): void;
        private tempos;
        private temcolor;
        private temUv;
        uploadMeshdata(): void;
        /**
         * 在emission是在simulate in local space 时候，为matTobathcer
         * 在emission是在simulate in world space 时候，为matToWorld
         */
        private transformVertex;
        private updateLocalMatrix;
        private updatePos;
        private updateSize;
        private updateEuler;
        private angleRot;
        private worldpos;
        private tarWorldpos;
        private worldspeeddir;
        private lookDir;
        private temptx;
        private worldRotation;
        private invParWorldRot;
        private worldStartPos;
        private updateRot;
        private updateColor;
        private updateUV;
        getCurTex_ST(data: F14EmissionBaseData): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class F14RefElementBatch implements F14Basebatch {
        type: F14TypeEnum;
        effect: f14EffectSystem;
        private element;
        constructor(effect: f14EffectSystem, element: F14RefElement);
        unRender(): void;
        getElementCount(): number;
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class F14RefBaseData implements F14ElementData {
        beLoop: boolean;
        refdataName: string;
        refData: F14EffectData;
        localPos: math.vector3;
        localEuler: math.vector3;
        localScale: math.vector3;
        parse(json: any, assetmgr: assetMgr, assetbundle: string): void;
    }
}
declare namespace gd3d.framework {
    class F14RefElement implements F14Element {
        type: F14TypeEnum;
        layer: F14Layer;
        drawActive: boolean;
        baseddata: F14RefBaseData;
        startFrame: number;
        endFrame: number;
        effect: f14EffectSystem;
        constructor(effect: f14EffectSystem, layer: F14Layer, bundleName: string);
        RefEffect: f14EffectSystem;
        reset(): void;
        private refreshStartEndFrame;
        update(deltaTime: number, frame: number, fps: number): void;
        OnEndOnceLoop(): void;
        changeColor(value: math.color): void;
        changeAlpha(value: number): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class F14SingleMesh implements F14Element {
        drawActive: boolean;
        type: F14TypeEnum;
        layer: F14Layer;
        private effect;
        RenderBatch: F14SingleMeshBath;
        position: math.vector3;
        scale: math.vector3;
        euler: math.vector3;
        color: math.color;
        tex_ST: math.vector4;
        baseddata: F14SingleMeshBaseData;
        private localRotate;
        startFrame: number;
        endFrame: number;
        private vertexCount;
        private posArr;
        private colorArr;
        private uvArr;
        dataforvbo: Float32Array;
        dataforebo: Uint16Array;
        constructor(effect: f14EffectSystem, layer: F14Layer);
        refreshStartEndFrame(): void;
        update(deltaTime: number, frame: number, fps: number): void;
        OnEndOnceLoop(): void;
        targetMat: math.matrix;
        refreshTargetMatrix(): void;
        private tempos;
        private temColor;
        private temUv;
        uploadMeshdata(): void;
        refreshCurTex_ST(curframe: number, detalTime: number, fps: number): void;
        private eulerRot;
        private worldpos;
        private worldRot;
        private inverseRot;
        private lookDir;
        private worldDirx;
        private worldDiry;
        updateRotByBillboard(): void;
        reset(): void;
        changeColor(value: math.color): void;
        settedAlpha: number;
        changeAlpha(value: number): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    interface F14Basebatch {
        type: F14TypeEnum;
        effect: f14EffectSystem;
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number): any;
        unRender(): any;
        dispose(): any;
        getElementCount(): number;
    }
    class F14SingleMeshBath implements F14Basebatch {
        type: F14TypeEnum;
        effect: f14EffectSystem;
        ElementMat: gd3d.framework.material;
        meshlist: F14SingleMesh[];
        private activemeshlist;
        private mesh;
        indices: number[];
        vertices: math.vector3[];
        colors: math.color[];
        uv: math.vector2[];
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        curRealVboCount: number;
        curVertexcount: number;
        curIndexCount: number;
        vertexLength: number;
        constructor(mat: material, effect: f14EffectSystem);
        private noBatch;
        OnEndCollectElement(): void;
        reInit(mat: material, effect: f14EffectSystem): void;
        addElement(mesh: F14SingleMesh, insert?: boolean): void;
        canBatch(mesh: F14SingleMesh): boolean;
        getElementCount(): number;
        private mat;
        private defST;
        private temptColorv4;
        private uploadData;
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number): void;
        unRender(): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    enum LoopEnum {
        Restart = 0,
        TimeContinue = 1
    }
    enum BindAxis {
        X = 0,
        Y = 1,
        NONE = 2
    }
    class F14SingleMeshBaseData implements F14ElementData {
        loopenum: LoopEnum;
        mesh: mesh;
        material: material;
        position: gd3d.math.vector3;
        scale: gd3d.math.vector3;
        euler: gd3d.math.vector3;
        color: gd3d.math.color;
        tex_ST: gd3d.math.vector4;
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        uSpeed: number;
        vSpeed: number;
        row: number;
        column: number;
        count: number;
        beBillboard: boolean;
        bindAxis: BindAxis;
        firtstFrame: number;
        constructor(firstFrame: number);
        parse(json: any, assetmgr: assetMgr, assetbundle: string): void;
    }
}
declare namespace gd3d.framework {
    class starCamCtr implements INodeComponent {
        static readonly ClassName: string;
        moveDuration: number;
        minSpeed: number;
        relativelocation: math.vector3;
        relativeEuler: math.vector3;
        private relativeRot;
        private starteCamRot;
        private targetCamPos;
        private targetCamRot;
        private distance;
        private movedir;
        private moveSpeed;
        private eulerSpeed;
        private active;
        start(): void;
        onPlay(): void;
        private moveDis;
        update(delta: number): void;
        gameObject: gameObject;
        remove(): void;
        clone(): void;
        moveTo(to: transform): void;
    }
}
declare namespace gd3d.framework {
    /**
     * The line renderer is used to draw free-floating lines in 3D space.
     *
     * 线渲染器用于在三维空间中绘制自由浮动的线。
     */
    class LineRenderer implements IRenderer {
        static readonly ClassName: string;
        private mesh;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        material: material;
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number;
        get transform(): transform;
        gameObject: gameObject;
        /**
         * Connect the start and end positions of the line together to form a continuous loop.
         *
         * 将直线的起点和终点连接在一起，形成一个连续的回路。
         */
        loop: boolean;
        /**
         * 顶点列表。
         */
        positions: math.vector3[];
        /**
         * 曲线宽度。
         */
        lineWidth: MinMaxCurve;
        /**
         *
         * 线条颜色。
         */
        lineColor: MinMaxGradient;
        /**
         * Set this to a value greater than 0, to get rounded corners between each segment of the line.
         *
         * 将此值设置为大于0的值，以在直线的每个线段之间获取圆角。
         */
        numCornerVertices: number;
        /**
         * Set this to a value greater than 0, to get rounded corners on each end of the line.
         *
         * 将此值设置为大于0的值，以在行的两端获得圆角。
         */
        numCapVertices: number;
        /**
         * Select whether the line will face the camera, or the orientation of the Transform Component.
         *
         * 选择线是否将面对摄像机，或转换组件的方向。
         */
        alignment: LineAlignment;
        /**
         * Choose whether the U coordinate of the line texture is tiled or stretched.
         *
         * 选择是平铺还是拉伸线纹理的U坐标。
         */
        textureMode: LineTextureMode;
        /**
         * Apply a shadow bias to prevent self-shadowing artifacts. The specified value is the proportion of the line width at each segment.
         *
         * 应用阴影偏差以防止自阴影伪影。指定的值是每段线宽的比例。
         */
        shadowBias: number;
        /**
         * Configures a line to generate Normals and Tangents. With this data, Scene lighting can affect the line via Normal Maps and the Unity Standard Shader, or your own custom-built Shaders.
         *
         * 是否自动生成灯光所需的法线与切线。
         */
        generateLightingData: boolean;
        /**
         * If enabled, the lines are defined in world space.
         *
         * 如果启用，则在世界空间中定义线。
         */
        useWorldSpace: boolean;
        /**
         * Set the curve describing the width of the line at various points along its length.
         *
         * 设置曲线，以描述沿线长度在各个点处的线宽。
         */
        get widthCurve(): AnimationCurve1;
        /**
         * Set an overall multiplier that is applied to the LineRenderer.widthCurve to get the final width of the line.
         *
         * 设置一个应用于LineRenderer.widthCurve的总乘数，以获取线的最终宽度。
         */
        get widthMultiplier(): number;
        set widthMultiplier(v: number);
        /**
         * Set the color gradient describing the color of the line at various points along its length.
         *
         * 设置颜色渐变，以描述线条沿其长度的各个点的颜色。
         */
        get colorGradient(): Gradient;
        /**
         * Set the color at the end of the line.
         *
         * 设置线尾颜色。
         */
        get endColor(): math.color;
        set endColor(v: math.color);
        /**
         * Set the width at the end of the line.
         *
         * 设置线尾宽度。
         */
        get endWidth(): number;
        set endWidth(v: number);
        /**
         * Set/get the number of vertices.
         *
         * 设置/获取顶点数。
         */
        get positionCount(): number;
        set positionCount(v: number);
        /**
         * Set the color at the start of the line.
         *
         * 设置行线头颜色。
         */
        get startColor(): math.color;
        set startColor(v: math.color);
        /**
         * Set the width at the start of the line.
         *
         * 设置线头宽度
         */
        get startWidth(): number;
        set startWidth(v: number);
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        onPlay(): void;
        start(): void;
        /**
         * 每帧执行
         */
        update(interval?: number): void;
        remove(): void;
        clone(): void;
        /**
         * Creates a snapshot of LineRenderer and stores it in mesh.
         *
         * 创建LineRenderer的快照并将其存储在网格中。
         *
         * @param mesh	A static mesh that will receive the snapshot of the line.
         * @param camera	The camera used for determining which way camera-space lines will face.
         * @param useTransform	Include the rotation and scale of the Transform in the baked mesh.
         */
        BakeMesh(mesh: mesh, camera: camera, useTransform: boolean): void;
        /**
         * Get the position of a vertex in the line.
         *
         * 获取直线在顶点的位置。
         *
         * @param index	The index of the position to retrieve.
         */
        GetPosition(index: number): math.vector3;
        /**
         * Get the positions of all vertices in the line.
         *
         * 获取行中所有顶点的位置。
         *
         * @param positions	The array of positions to retrieve. The array passed should be of at least positionCount in size.
         *
         * @returns How many positions were actually stored in the output array.
         */
        GetPositions(positions?: math.vector3[]): math.vector3[];
        /**
         * Set the position of a vertex in the line.
         *
         * 设置顶点在直线中的位置。
         *
         * @param index	Which position to set.
         * @param position	The new position.
         */
        setPosition(index: number, position: math.vector3): void;
        /**
         * Set the positions of all vertices in the line.
         *
         * 设置线中所有顶点的位置。
         *
         * @param positions	The array of positions to set.
         */
        SetPositions(positions: math.vector3[]): void;
        /**
         * Generates a simplified version of the original line by removing points that fall within the specified tolerance.
         *
         * 通过删除落在指定公差范围内的点，生成原始线的简化版本。
         *
         * @param tolerance	This value is used to evaluate which points should be removed from the line. A higher value results in a simpler line (less points). A positive value close to zero results in a line with little to no reduction. A value of zero or less has no effect.
         *
         * @todo
         */
        Simplify(tolerance: number): void;
        private localToWorldMatrix;
        private worldToLocalMatrix;
        /**
         * 绘制
         *
         * @param context
         * @param go 游戏对象
         * @param mesh 网格
         * @param material 材质
         */
        static draw(context: renderContext, go: gameObject, mesh: mesh, material: material): void;
        /**
         * 清理网格
         *
         * @param mesh
         */
        static clearMesh(mesh: mesh): void;
        static uploadMesh(_mesh: mesh, webgl: WebGLRenderingContext): void;
        /**
         * 计算网格
         *
         * @param positionVectex 顶点列表
         * @param rateAtLines 顶点所在线条位置
         * @param textureMode 纹理模式
         * @param totalLength 线条总长度
         * @param mesh 保存网格数据的对象
         */
        static calcMesh(positionVectex: {
            vertexs: math.vector3[];
            tangent: math.vector3;
            normal: math.vector3;
            rateAtLine: number;
        }[], textureMode: LineTextureMode, colorGradient: Gradient, totalLength: number, mesh: mesh): void;
        /**
         * 计算结点的三角形顶点列表
         *
         * @param positions 结点列表
         * @param loop 是否成换线
         * @param rateAtLines 结点所在线条位置
         * @param lineWidth 线条宽度曲线
         * @param alignment 朝向方式
         * @param cameraPosition 摄像机局部坐标
         */
        static calcPositionVectex(positions: math.vector3[], loop: boolean, rateAtLines: number[], lineWidth: MinMaxCurve, alignment: LineAlignment, cameraPosition: math.vector3): {
            vertexs: math.vector3[];
            tangent: math.vector3;
            normal: math.vector3;
            rateAtLine: number;
        }[];
        /**
         * 计算线条总长度
         *
         * @param positions 顶点列表
         * @param loop 是否循环
         */
        static calcTotalLength(positions: math.vector3[], loop: boolean): number;
        /**
         * 计算结点所在线段位置
         *
         * @param positions 顶点列表
         * @param loop 是否循环
         */
        static calcRateAtLines(positions: math.vector3[], loop: boolean, textureMode: LineTextureMode): number[];
    }
}
declare namespace gd3d.framework {
    /**
     * The trail renderer is used to make trails behind objects in the Scene as they move about.
     *
     * 拖尾染器
     */
    class TrailRenderer implements IRenderer {
        static readonly ClassName: string;
        private mesh;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        material: material;
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number;
        get transform(): transform;
        gameObject: gameObject;
        /**
         * 结点列表。
         */
        private positions;
        /**
         * 曲线宽度。
         */
        lineWidth: MinMaxCurve;
        /**
         *
         * 线条颜色。
         */
        lineColor: MinMaxGradient;
        /**
         * Set this to a value greater than 0, to get rounded corners between each segment of the line.
         *
         * 将此值设置为大于0的值，以在直线的每个线段之间获取圆角。
         */
        numCornerVertices: number;
        /**
         * Set this to a value greater than 0, to get rounded corners on each end of the line.
         *
         * 将此值设置为大于0的值，以在行的两端获得圆角。
         */
        numCapVertices: number;
        /**
         * Select whether the line will face the camera, or the orientation of the Transform Component.
         *
         * 选择线是否将面对摄像机，或转换组件的方向。
         */
        alignment: LineAlignment;
        /**
         * Does the GameObject of this Trail Renderer auto destruct?
         */
        autodestruct: boolean;
        /**
         * Creates trails when the GameObject moves.
         */
        emitting: boolean;
        /**
         * Set the minimum distance the trail can travel before a new vertex is added to it.
         */
        minVertexDistance: number;
        /**
         * How long does the trail take to fade out.
         */
        time: number;
        /**
         * Choose whether the U coordinate of the line texture is tiled or stretched.
         *
         * 选择是平铺还是拉伸线纹理的U坐标。
         */
        textureMode: LineTextureMode;
        /**
         * Apply a shadow bias to prevent self-shadowing artifacts. The specified value is the proportion of the line width at each segment.
         *
         * 应用阴影偏差以防止自阴影伪影。指定的值是每段线宽的比例。
         */
        shadowBias: number;
        /**
         * Configures a line to generate Normals and Tangents. With this data, Scene lighting can affect the line via Normal Maps and the Unity Standard Shader, or your own custom-built Shaders.
         *
         * 是否自动生成灯光所需的法线与切线。
         */
        generateLightingData: boolean;
        /**
         * Set the curve describing the width of the line at various points along its length.
         *
         * 设置曲线，以描述沿线长度在各个点处的线宽。
         */
        get widthCurve(): AnimationCurve1;
        set widthCurve(v: AnimationCurve1);
        /**
         * Set an overall multiplier that is applied to the LineRenderer.widthCurve to get the final width of the line.
         *
         * 设置一个应用于LineRenderer.widthCurve的总乘数，以获取线的最终宽度。
         */
        get widthMultiplier(): number;
        set widthMultiplier(v: number);
        /**
         * Set the color gradient describing the color of the line at various points along its length.
         *
         * 设置颜色渐变，以描述线条沿其长度的各个点的颜色。
         */
        get colorGradient(): Gradient;
        set colorGradient(v: Gradient);
        /**
         * Set the color at the end of the line.
         *
         * 设置线尾颜色。
         */
        get endColor(): math.color;
        set endColor(v: math.color);
        /**
         * Set the width at the end of the line.
         *
         * 设置线尾宽度。
         */
        get endWidth(): number;
        set endWidth(v: number);
        /**
         * Set/get the number of vertices.
         *
         * 设置/获取顶点数。
         */
        get positionCount(): number;
        set positionCount(v: number);
        /**
         * Set the color at the start of the line.
         *
         * 设置行线头颜色。
         */
        get startColor(): math.color;
        set startColor(v: math.color);
        /**
         * Set the width at the start of the line.
         *
         * 设置线头宽度
         */
        get startWidth(): number;
        set startWidth(v: number);
        get trailRendererData(): TrailRendererData;
        set trailRendererData(v: TrailRendererData);
        private _trailRendererData;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        onPlay(): void;
        start(): void;
        remove(): void;
        clone(): void;
        /**
         * 每帧执行
         */
        update(interval?: number): void;
        /**
         * Creates a snapshot of LineRenderer and stores it in mesh.
         *
         * 创建LineRenderer的快照并将其存储在网格中。
         *
         * @param mesh	A static mesh that will receive the snapshot of the line.
         * @param camera	The camera used for determining which way camera-space lines will face.
         * @param useTransform	Include the rotation and scale of the Transform in the baked mesh.
         */
        BakeMesh(mesh: mesh, camera: camera, useTransform: boolean): void;
        /**
         * Adds a position to the trail.
         *
         * @param position	The position to add to the trail.
         */
        AddPosition(position: math.vector3): void;
        /**
         * Add an array of positions to the trail.
         *
         * All points inside a TrailRenderer store a timestamp when they are born. This, together with the TrailRenderer.time property, is used to determine when they will be removed. For trails to disappear smoothly, each position must have a unique, increasing timestamp. When positions are supplied from script and the current time is identical for multiple points, position timestamps are adjusted to interpolate smoothly between the timestamp of the newest existing point in the trail and the current time.
         *
         * @param positions	The positions to add to the trail.
         */
        AddPositions(positions: math.vector3[]): void;
        /**
         * Removes all points from the TrailRenderer. Useful for restarting a trail from a new position.
         */
        Clear(): void;
        /**
         * Get the position of a vertex in the line.
         *
         * 获取直线在顶点的位置。
         *
         * @param index	The index of the position to retrieve.
         */
        GetPosition(index: number): {
            position: math.vector3;
            birthTime: number;
        };
        /**
         * Get the positions of all vertices in the line.
         *
         * 获取行中所有顶点的位置。
         *
         * @param positions	The array of positions to retrieve. The array passed should be of at least positionCount in size.
         *
         * @returns How many positions were actually stored in the output array.
         */
        GetPositions(positions?: math.vector3[]): math.vector3[];
        /**
         * Set the position of a vertex in the line.
         *
         * 设置顶点在直线中的位置。
         *
         * @param index	Which position to set.
         * @param position	The new position.
         */
        setPosition(index: number, position: math.vector3): void;
        /**
         * Set the positions of all vertices in the line.
         *
         * 设置线中所有顶点的位置。
         *
         * @param positions	The array of positions to set.
         */
        SetPositions(positions: math.vector3[]): void;
        /**
         * 上次结点位置
         */
        private _preworldPos;
        private localToWorldMatrix;
        private worldToLocalMatrix;
    }
}
declare namespace gd3d.framework {
    /**
     * 拖尾染器数据
     */
    class TrailRendererData implements IAsset {
        static readonly ClassName: string;
        private static _datas;
        trailRenderer: TrailRenderer;
        /**
         * 获取已经创建了的粒子系统数据
         *
         * @param valueName
         */
        static get(valueName: string): TrailRendererData;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        /**
         * 粒子系统资源名称
         */
        get value(): string;
        set value(v: string);
        private _value;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        setData(v: string): void;
        objectData: any;
    }
}
declare namespace gd3d.framework {
    /**
     * Control the direction lines face, when using the LineRenderer or TrailRenderer.
     *
     * 使用LineRenderer或TrailRenderer时，控制方向线的面。
     */
    enum LineAlignment {
        /**
         * Lines face the camera.
         *
         * 线面向相机。
         */
        View = 0,
        /**
         * Lines face the Z axis of the Transform Component.
         *
         * 线面向变换组件的Z轴。
         */
        TransformZ = 1
    }
}
declare namespace gd3d.framework {
    /**
     * Choose how textures are applied to Lines and Trails.
     *
     * 选择如何将纹理应用于线和迹线。
     */
    enum LineTextureMode {
        /**
         * Map the texture once along the entire length of the line.
         *
         * 沿线的整个长度映射一次纹理。
         */
        Stretch = 0,
        /**
         * Repeat the texture along the line, based on its length in world units. To set the tiling rate, use Material.SetTextureScale.
         *
         * 根据纹理的长度（以世界单位为单位），沿线重复纹理。要设置平铺率，请使用Material.SetTextureScale。
         */
        Tile = 1,
        /**
         * Map the texture once along the entire length of the line, assuming all vertices are evenly spaced.
         *
         * 假设所有顶点均等分布，则沿着线的整个长度映射一次纹理。
         */
        DistributePerSegment = 2,
        /**
         * Repeat the texture along the line, repeating at a rate of once per line segment. To adjust the tiling rate, use Material.SetTextureScale.
         *
         * 沿线重复纹理，每个线段重复一次。要调整平铺率，请使用Material.SetTextureScale。
         */
        RepeatPerSegment = 3
    }
}
declare namespace gd3d {
    abstract class AEvent {
        private events;
        /**
         * 监听事件添加
         * @param event 事件类型
         * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
         * @param thisArg 回调方法执行者
         */
        On(event: string, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 发出事件
         * @param event 事件类型
         * @param args 传递参数
         */
        Emit(event: string, ...args: Array<any>): void;
        /**
         * 移除事件监听者
         * @param event 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        RemoveListener(event: string, func: Function, thisArg: any): void;
        /**
         * 移除所有监听者
         */
        RemoveListenerAll(): void;
        /**
         * 指定事件监听者的数量
         */
        listenerCount(event: string): number;
    }
}
declare namespace gd3d.event {
    /**
     * UI 事件枚举
     */
    enum UIEventEnum {
        PointerDown = 0,
        PointerUp = 1,
        PointerClick = 2,
        PointerEnter = 3,
        PointerExit = 4
    }
    /**
     * 点事件枚举
     */
    enum PointEventEnum {
        PointDown = 0,
        PointHold = 1,
        PointUp = 2,
        PointMove = 3,
        PointClick = 4,
        MouseWheel = 5
    }
    /**
     * 按键事件枚举
     */
    enum KeyEventEnum {
        KeyDown = 0,
        KeyUp = 1
    }
    /**
     * Key codes returned by Event keyCode These map directly to a physical key on
     * he keyboard
     * */
    enum KeyCode {
        Numpad4 = 100,
        Numpad5 = 101,
        Numpad6 = 102,
        Numpad7 = 103,
        Numpad8 = 104,
        Numpad9 = 105,
        NumpadMultiply = 106,
        NumpadAdd = 107,
        NumpadSubtract = 109,
        NumpadDecimal = 110,
        NumpadDivide = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        Enter = 13,
        NumLock = 144,
        ScrollLock = 145,
        ShiftLeft = 16,
        ControlRight = 17,
        AltRight = 18,
        Semicolon = 186,
        Comma = 188,
        Pause = 19,
        Period = 190,
        Slash = 191,
        CapsLock = 20,
        BracketLeft = 219,
        Backslash = 220,
        BracketRight = 221,
        Quote = 222,
        Escape = 27,
        Space = 32,
        PageUp = 33,
        PageDown = 34,
        End = 35,
        Home = 36,
        ArrowLeft = 37,
        ArrowUp = 38,
        ArrowRight = 39,
        ArrowDown = 40,
        Insert = 45,
        Delete = 46,
        Digit1 = 49,
        Digit2 = 50,
        Digit3 = 51,
        Digit4 = 52,
        KeyA = 65,
        KeyB = 66,
        KeyC = 67,
        KeyD = 68,
        KeyE = 69,
        KeyF = 70,
        KeyG = 71,
        KeyH = 72,
        KeyI = 73,
        KeyJ = 74,
        KeyK = 75,
        KeyL = 76,
        KeyM = 77,
        KeyN = 78,
        KeyO = 79,
        KeyP = 80,
        KeyQ = 81,
        KeyR = 82,
        KeyS = 83,
        KeyT = 84,
        KeyU = 85,
        KeyV = 86,
        KeyW = 87,
        KeyX = 88,
        KeyY = 89,
        Tab = 9,
        KeyZ = 90,
        MetaLeft = 91,
        ContextMenu = 93,
        Numpad0 = 96,
        Numpad1 = 97,
        Numpad2 = 98,
        Numpad3 = 99
    }
    /**
     * 2d Physics 事件枚举
     */
    enum Physic2dEventEnum {
        /** 物理引擎更新前 */
        BeforeUpdate = 0,
        /** 物理引擎更新后 */
        afterUpdate = 1,
        /** 开始碰撞 （触发在update 之后）*/
        collisionStart = 2,
        /** 碰撞持续中 （触发在update 之后）*/
        collisionActive = 3,
        /** 碰撞结束 （触发在update 之后）*/
        collisionEnd = 4
    }
}
declare namespace gd3d.event {
    /** 输入事件 */
    class InputEvent extends AEvent {
        OnEnum_key(event: KeyEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        EmitEnum_key(event: KeyEventEnum, ...args: Array<any>): void;
        OnEnum_point(event: PointEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        EmitEnum_point(event: PointEventEnum, ...args: Array<any>): void;
    }
    /** 输入htmlElement 原生事件类型集合 */
    interface inputHtmlNativeEventMap {
        "blur": FocusEvent;
        "keydown": KeyboardEvent;
        "keyup": KeyboardEvent;
        "mousedown": MouseEvent;
        "mousemove": MouseEvent;
        "mouseup": MouseEvent;
        "touchcancel": TouchEvent;
        "touchend": TouchEvent;
        "touchmove": TouchEvent;
        "touchstart": TouchEvent;
        "wheel": WheelEvent;
    }
    /** 输入htmlElement 原生事件 */
    class inputHtmlNativeEvent extends AEvent {
        On<K extends keyof inputHtmlNativeEventMap>(tagName: K, func: (ev: any) => void, thisArg: any): void;
        Emit<K extends keyof inputHtmlNativeEventMap>(tagName: K, ev: any): void;
    }
}
declare namespace gd3d.event {
    class Physic2dEvent extends AEvent {
        OnEnum(event: Physic2dEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        EmitEnum(event: Physic2dEventEnum, ...args: Array<any>): void;
    }
}
declare namespace gd3d.event {
    interface IUIEventer {
        /**
        * 添加事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addListener(eventEnum: UIEventEnum, func: (...args: Array<any>) => void, thisArg: any): any;
        /**
         * 移除事件监听者
         * @param eventEnum 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeListener(eventEnum: UIEventEnum, func: (...args: Array<any>) => void, thisArg: any): any;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * ui事件
     * @version gd3d 1.0
     */
    class UIEvent extends AEvent {
        OnEnum(event: UIEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        EmitEnum(event: UIEventEnum, ...args: Array<any>): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 2d事件对象
     * @version gd3d 1.0
     */
    class PointEvent {
        type: event.PointEventEnum;
        x: number;
        y: number;
        eated: boolean;
        selected: transform2D;
        c_x: number;
        c_y: number;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 鼠标(触屏)点击信息
     * @version gd3d 1.0
     */
    class pointinfo {
        id: number;
        touch: boolean;
        x: number;
        y: number;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 键盘、鼠标(触屏)事件管理类 应用状态机区分状态
     * @version gd3d 1.0
     */
    class inputMgr {
        private app;
        private _element;
        private _buttons;
        private _lastbuttons;
        private eventer;
        private HtmlNativeEventer;
        private inputlast;
        private keyboardMap;
        private handlers;
        private _wheel;
        get wheel(): number;
        private _point;
        get point(): pointinfo;
        private _touches;
        get touches(): {
            [id: number]: pointinfo;
        };
        private rMtr_90;
        private rMtr_n90;
        constructor(app: application);
        private attach;
        private detach;
        private _mousedown;
        private _mouseup;
        private _mousemove;
        private _mousewheel;
        private tryAddTouchP;
        private syncPointByTouches;
        private _touchstart;
        private _touchmove;
        private _touchend;
        private _touchcancel;
        private _keydown;
        private _keyup;
        private _blur;
        private readonly moveTolerance;
        private lastTouch;
        private hasPointDown;
        private hasPointUP;
        private hasPointMove;
        private downPoint;
        private lastPoint;
        update(delta: any): void;
        private pointCk;
        private keyDownCode;
        private keyUpCode;
        private keyCodeCk;
        private hasWheel;
        private lastWheel;
        private mouseWheelCk;
        /**
         * 按键是否在按下状态
         * @param button 按键, 0: 左键；1: 中键；2: 右键
         */
        isPressed(button: number): boolean;
        /**
         * 按键被按下一次
         * @param button 按键, 0: 左键；1: 中键；2: 右键
         */
        wasPressed(button: number): boolean;
        private _contextMenu;
        /**
         * 禁用右键菜单
         */
        disableContextMenu(): void;
        /**
         * 启用右键菜单
         */
        enableContextMenu(): void;
        /**
        * 添加point事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addPointListener(eventEnum: event.PointEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 移除point事件监听者
         * @param eventEnum 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removePointListener(eventEnum: event.PointEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
        * 添加按键事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addKeyListener(eventEnum: event.KeyEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
         * 移除按键事件监听者
         * @param eventEnum 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeKeyListener(eventEnum: event.KeyEventEnum, func: (...args: Array<any>) => void, thisArg: any): void;
        /**
        * 添加HTMLElement原生事件监听者
        * @param tagName 事件类型名字
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addHTMLElementListener<K extends keyof event.inputHtmlNativeEventMap>(tagName: K, func: (ev: any) => void, thisArg: any): void;
        /**
         * 移除HTMLElement原生事件监听者
         * @param tagName 事件类型名字
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeHTMLElementListener<K extends keyof event.inputHtmlNativeEventMap>(tagName: K, func: (ev: any) => void, thisArg: any): void;
        /**
         * 任意一按键被按下
         */
        anyKey(): boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取 指定按键是否Down
        * @version gd3d 1.0
        */
        GetKeyDown(name: string): any;
        GetKeyDown(key: event.KeyCode): any;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取 指定按键是否UP
        * @version gd3d 1.0
        */
        GetKeyUP(name: string): any;
        GetKeyUP(key: event.KeyCode): any;
        /**
         * 按键按下的数量
         */
        KeyDownCount(): number;
        private tempV2_0;
        private tempV2_1;
        private devicePixelRatio;
        /**
         * 计算校准html 输入坐标点
         * @param clientX 输入x
         * @param clientY 输入y
         * @param out 返回pointinfo
         */
        CalcuPoint(clientX: number, clientY: number, out: pointinfo): void;
    }
}
declare namespace gd3d.io {
    class converter {
        static getApplyFun(value: any): any;
        private static dataBuffer;
        private static dataView;
        static ULongToArray(value: number, target?: Uint8Array, offset?: number): Uint8Array | number[];
        static LongToArray(value: number, t?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float64ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint32toArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static StringToUtf8Array(str: string): Uint8Array;
        static ArrayToLong(buf: Uint8Array, offset?: number): number;
        static ArrayToULong(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat64(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt32(buf: Uint8Array, offset?: number): number;
        static ArrayToUint32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt16(buf: Uint8Array, offset?: number): number;
        static ArrayToUint16(buf: Uint8Array, offset?: number): number;
        static ArrayToInt8(buf: Uint8Array, offset?: number): number;
        static ArrayToString(buf: Uint8Array, offset?: number): string;
    }
    class binTool {
        private buffer;
        r_offset: number;
        w_offset: number;
        constructor(size?: number);
        private ckl;
        readSingle(): number;
        readLong(): number;
        readULong(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
        readBytes(length: number): Uint8Array;
        readStringUtf8(): string;
        readUTFBytes(): string;
        readUTFByLen(length: number): string;
        readStringUtf8FixLength(length: number): string;
        readStringAnsi(): string;
        getLength(): number;
        getBytesAvailable(): number;
        get length(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeLong(num: number): void;
        writeULong(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        writeStringUtf8DataOnly(str: string): void;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[] | number, offset?: number, length?: number): void;
        writeUint8Array(array: Uint8Array | number[] | number, offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
        write(array: Uint8Array | number[] | number | any, offset?: number, length?: number): void;
        dispose(): void;
        getBuffer(): Uint8Array;
        getUint8Array(): Uint8Array;
    }
}
declare namespace gd3d.io {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 对可序列化实例的克隆
     * @param instanceObj 被克隆实例
     * @param clonedObj 克隆实例引用
     * @version gd3d 1.0
     */
    function cloneObj(instanceObj: any, clonedObj?: any): any;
    /**
     * @private
     */
    function fillCloneReference(instanceObj: any, clonedObj: any): any;
    /**
     * @private
     */
    function fillCloneReferenceTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    /**
     * @private
     */
    function fillCloneReferenceType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
    /**
     * @private
     */
    function _cloneObj(instanceObj: any, clonedObj?: any): any;
    /**
     * @private
     */
    function cloneOtherTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    /**
     * @private
     */
    function cloneOtherType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
}
declare namespace gd3d.io {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * string转换为blob
     * @version gd3d 1.0
     */
    function stringToBlob(content: string): Blob;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * string转换为utf8数组
     * @version gd3d 1.0
     */
    function stringToUtf8Array(str: string): number[];
}
declare namespace gd3d.io {
    function ndeSerialize<T extends framework.transform | framework.transform2D>(json: any, assetbundle: string, useAsset?: boolean): T;
}
declare namespace gd3d.io {
    enum SaveAssetType {
        FullUrl = 0,
        NameAndContent = 1,
        DefaultAssets = 2
    }
    /**
     * @private
     */
    class SerializeDependent {
        static resourseDatas: any[];
        static GetAssetContent(asset: any): {
            name: string;
            value: string;
            type: SaveAssetType;
        };
        static GetAssetUrl(asset: any, assetMgr: any): void;
    }
    /**
     * @private
     */
    function SerializeForInspector(obj: any): string;
    /**
     * @private
     */
    function serializeObjForInspector(instanceObj: any, beComponent: boolean, serializedObj?: any): any;
    /**
     * @private
     */
    function serializeOtherTypeOrArrayForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean): void;
    /**
     * @private
     */
    function serializeOtherTypeForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean, arrayInst?: any): void;
    /**
     * 序列化
     */
    /**
     * @private
     */
    function Serialize(obj: any, assetMgr?: any): string;
    /**
     * @private
     */
    function serializeObj(instanceObj: any, serializedObj?: any, assetMgr?: any): any;
    /**
     * @private
     */
    function serializeOtherTypeOrArray(instanceObj: any, serializedObj: any, key: string, assetMgr?: any): void;
    /**
     * @private
     */
    function serializeOtherType(instanceObj: any, serializedObj: any, key: string, arrayInst?: any, assetMgr?: any): void;
    /**
     * 反序列化  传入的源数据为json
     */
    /**
     * @private
     */
    function deSerialize(serializedObj: string, instanceObj: any, assetMgr: any, bundlename?: string): void;
    /**
     * @private
     */
    function fillReference(serializedObj: any, instanceObj: any): void;
    /**
     * @private
     */
    function dofillReferenceOrArray(serializedObj: any, instanceObj: any, key: string): void;
    /**
     * @private
     */
    function dofillReference(serializedObj: any, instanceObj: any, key: string): void;
    /**
     * @private
     */
    function deSerializeObj(serializedObj: any, instanceObj: any, assetMgr: any, bundlename?: string): void;
    /**
     * @private
     */
    function deSerializeOtherTypeOrArray(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    /**
     * @private
     */
    function deSerializeOtherType(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    /**
     * @private
     */
    function isArray(type: string): boolean;
    /**
     * @private
     */
    function isArrayOrDic(type: string): boolean;
    /**
     * @private
     */
    function isAsset(type: string): boolean;
    /**
     * @private
     */
    function isAssetInspector(type: string): boolean;
    /**
     * @private
     */
    class referenceInfo {
        static oldmap: {
            [id: number]: any;
        };
        static regtypelist: string[];
        static regDefaultType(): void;
        static regType(type: string): void;
        static isRegType(type: string): boolean;
    }
    /**
     * @private
     */
    class enumMgr {
        static enumMap: {
            [id: string]: any;
        };
    }
}
declare namespace gd3d.io {
    /**
     * @private
     */
    class binReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        _seek: number;
        seek(seek: number): void;
        peek(): number;
        length(): number;
        canread(): number;
        readStringAnsi(): string;
        static utf8ArrayToString(array: Uint8Array | number[]): string;
        readStringUtf8(): string;
        readStringUtf8FixLength(length: number): string;
        readSingle(): number;
        readDouble(): number;
        readInt8(): number;
        readUInt8(): number;
        readInt16(): number;
        readUInt16(): number;
        readInt32(): number;
        readUInt32(): number;
        readUint8Array(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readUint8ArrayByOffset(target: Uint8Array, offset: number, length?: number): Uint8Array;
        set position(value: number);
        get position(): number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
        readBytesRef(length?: number): Uint8Array;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readUTFBytes(length: number): string;
        readSymbolByte(): number;
        readShort(): number;
        readInt(): number;
    }
    class binWriter {
        _buf: Uint8Array;
        private _data;
        private _length;
        private _seek;
        constructor();
        private sureData;
        getLength(): number;
        getBuffer(): ArrayBuffer;
        seek(seek: number): void;
        peek(): number;
        writeInt8(num: number): void;
        writeUInt8(num: number): void;
        writeInt16(num: number): void;
        writeUInt16(num: number): void;
        writeInt32(num: number): void;
        writeUInt32(num: number): void;
        writeSingle(num: number): void;
        writeDouble(num: number): void;
        writeStringAnsi(str: string): void;
        writeStringUtf8(str: string): void;
        static stringToUtf8Array(str: string): number[];
        writeStringUtf8DataOnly(str: string): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        get length(): number;
        writeByte(num: number): void;
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 方程求解
     *
     * 求解方程 f(x) == 0 在[a, b]上的解
     *
     * 参考：高等数学 第七版上册 第三章第八节 方程的近似解
     * 当f(x)在区间 [a, b] 上连续，且f(a) * f(b) <= 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
     *
     * 当f(x)在区间 [a, b] 上连续，且 (f(a) - y) * (f(b) - y) < 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == y
     *
     * @author feng / http://feng3d.com 05/06/2018
     */
    class EquationSolving {
        /**
         * 获取数字的(正负)符号
         * @param n 数字
         */
        private static getSign;
        /**
         * 比较 a 与 b 是否相等
         * @param a 值a
         * @param b 值b
         * @param precision 比较精度
         */
        private static equalNumber;
        /**
         * 获取近似导函数 f'(x)
         *
         * 导函数定义
         * f'(x) = (f(x + Δx) - f(x)) / Δx , Δx → 0
         *
         * 注：通过测试Δx不能太小，由于方程内存在x的n次方问题（比如0.000000000000001的10次方为0），过小会导致计算机计算进度不够反而导致求导不准确！
         *
         * 另外一种办法是还原一元多次函数，然后求出导函数。
         *
         * @param f 函数
         * @param delta Δx，进过测试该值太小或者过大都会导致求导准确率降低（个人猜测是计算机计算精度问题导致）
         */
        static getDerivative(f: (x: number) => number, delta?: number): (x: number) => number;
        /**
         * 函数是否连续
         * @param f 函数
         */
        private static isContinuous;
        /**
         * 方程 f(x) == 0 在 [a, b] 区间内是否有解
         *
         * 当f(x)在区间 [a, b] 上连续，且f(a) * f(b) <= 0 时，f(x)在区间 [a, b] 上至少存在一个解使得 f(x) == 0
         *
         * @param f 函数f(x)
         * @param a 区间起点
         * @param b 区间终点
         * @param errorcallback  错误回调函数
         *
         * @returns 是否有解
         */
        private static hasSolution;
        /**
         * 连线法 求解 f(x) == 0
         *
         * 连线法是我自己想的方法，自己取的名字，目前没有找到相应的资料（这方法大家都能够想得到。）
         *
         * 用曲线弧两端的连线来代替曲线弧与X轴交点作为边界来逐步缩小求解区间，最终获得解
         *
         * 通过 A，B两点连线与x轴交点来缩小求解区间最终获得解
         *
         * A，B两点直线方程 f(x) = f(a) + (f(b) - f(a)) / (b - a) * (x-a) ,求 f(x) == 0 解得 x = a - fa * (b - a)/ (fb - fa)
         *
         * @param f 函数f(x)
         * @param a 区间起点
         * @param b 区间终点
         * @param precision 求解精度
         * @param errorcallback  错误回调函数
         *
         * @returns 不存在解时返回 undefined ，存在时返回 解
         */
        static line(f: (x: number) => number, a: number, b: number, precision?: number, errorcallback?: (err: Error) => void): number;
    }
}
declare namespace gd3d.framework {
    /**
     * 噪音
     */
    var noise: Noise;
    /**
     * 柏林噪音
     *
     * 用于生产随机的噪音贴图
     *
     * @see http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
     * @see https://mrl.nyu.edu/~perlin/noise/
     * @see https://gitee.com/feng3d_admin/noise
     */
    class Noise {
        /**
         * 构建柏林噪音
         *
         * @param seed 随机种子
         */
        constructor(seed?: number);
        /**
         * 1D 经典噪音
         *
         * @param x X轴数值
         */
        perlin1(x: number): number;
        /**
         * 2D 经典噪音
         *
         * @param x X轴数值
         * @param y Y轴数值
         */
        perlin2(x: number, y: number): number;
        /**
         * 3D 经典噪音
         *
         * @param x X轴数值
         * @param y Y轴数值
         * @param z Z轴数值
         */
        perlin3(x: number, y: number, z: number): number;
        /**
         * N阶经典噪音
         *
         * 如果是1D，2D，3D噪音，最好选用对于函数，perlinN中存在for循环因此效率比perlin3等性能差3到5（8）倍！
         *
         * 满足以下运算
         * perlinN(x) == perlin1(x)
         * perlinN(x,y) == perlin2(x,y)
         * perlinN(x,y,z) == perlin3(x,y,z)
         *
         * @param ps 每个轴的数值
         */
        perlinN(...ps: number[]): number;
        /**
         * This isn't a very good seeding function, but it works ok. It supports 2^16
         * different seed values. Write something better if you need more seeds.
         */
        get seed(): number;
        set seed(v: number);
        private _seed;
        private _p;
    }
    /**
     *
     * @param n
     *
     * len = 2^(n-1) * n
     */
    function createGrad(n: number): number[][];
    function getBits(n: number): number[][];
}
declare namespace gd3d.math {
    /**
     * 用于表示欧拉角的旋转顺序
     *
     * 如果顺序为XYZ，则依次按 ZYZ 轴旋转。为什么循序与定义相反？因为three.js中都这么定义，他们为什么这么定义就不清楚了。
     */
    enum RotationOrder {
        /**
         * 依次按 ZYX 轴旋转。
         *
         * three.js默认旋转顺序。
         */
        XYZ = 0,
        /**
         * 依次按 YXZ 轴旋转。
         */
        ZXY = 1,
        /**
         * 依次按 XYZ 轴旋转。
         *
         * playcanvas默认旋转顺序。
         */
        ZYX = 2,
        /**
         * 依次按 ZXY 轴旋转。
         *
         * unity默认旋转顺序。
         */
        YXZ = 3,
        /**
         * 依次按 XZY 轴旋转。
         */
        YZX = 4,
        /**
         * 依次按 YZX 轴旋转。
         */
        XZY = 5
    }
    /**
    * 引擎中使用的旋转顺序。
    *
    * unity YXZ
    * playcanvas ZYX
    * three.js XYZ
    */
    var defaultRotationOrder: RotationOrder;
}
declare namespace gd3d.math {
    function colorSet_White(out: color): void;
    function colorSet_Black(out: color): void;
    function colorSet_Gray(out: color): void;
    function colorMultiply(srca: color, srcb: color, out: color): void;
    function scaleToRef(src: color, scale: number, out: color): void;
    function colorClone(src: color, out: color): void;
    function colorLerp(srca: color, srcb: color, t: number, out: color): void;
}
declare namespace gd3d.math {
    function calPlaneLineIntersectPoint(planeVector: vector3, planePoint: vector3, lineVector: vector3, linePoint: vector3, out: vector3): void;
    function isContain(p1: vector2, p2: vector2, p3: vector2, p4: vector2, mp: vector2): boolean;
    function Multiply(p1: vector2, p2: vector2, p0: vector2): number;
}
declare namespace gd3d.math {
    function floatClamp(v: number, min?: number, max?: number): number;
    function sign(value: number): number;
    function getKeyCodeByAscii(ev: KeyboardEvent): number;
    var DEG2RAD: number;
    var RAD2DEG: number;
    /**
     * 角度转换为弧度
     *
     * @param degrees 角度
     */
    function degToRad(degrees: number): number;
    /**
     * 弧度转换为角度
     *
     * @param radians 弧度
     */
    function radToDeg(radians: number): number;
    /**
     * 使 x 值从区间 <a1, a2> 线性映射到区间 <b1, b2>
     *
     * @param x 第一个区间中值
     * @param a1 第一个区间起始值
     * @param a2 第一个区间终止值
     * @param b1 第二个区间起始值
     * @param b2 第二个区间起始值
     */
    function mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number;
    function numberLerp(fromV: number, toV: number, v: number): number;
    function x_AXIS(): vector3;
    function y_AXIS(): vector3;
    function z_AXIS(): vector3;
    class commonStatic {
        static x_axis: gd3d.math.vector3;
        static y_axis: gd3d.math.vector3;
        static z_axis: gd3d.math.vector3;
    }
}
declare namespace gd3d.math {
    function quatIdentity(src: quaternion): void;
    function quatNormalize(src: quaternion, out: quaternion): void;
    function quatTransformVector(src: quaternion, vector: vector3, out: vector3): void;
    function quatTransformVectorDataAndQuat(src: Float32Array, srcseek: number, vector: vector3, out: vector3): void;
    function quatMagnitude(src: quaternion): number;
    function quatClone(src: quaternion, out: quaternion): void;
    function quatEqual(quat: quaternion, quat2: quaternion, threshold?: number): boolean;
    function quatToMatrix(src: quaternion, out: matrix): void;
    function quatInverse(src: quaternion, out: quaternion): void;
    function quatFromYawPitchRoll(yaw: number, pitch: number, roll: number, result: quaternion): void;
    function quatMultiply(srca: quaternion, srcb: quaternion, out: quaternion): void;
    function quatMultiplyDataAndQuat(srca: Float32Array, srcaseek: number, srcb: quaternion, out: quaternion): void;
    function quatMultiplyVector(vector: vector3, scr: quaternion, out: quaternion): void;
    function quatLerp(srca: quaternion, srcb: quaternion, out: quaternion, t: number): void;
    function quatFromAxisAngle(axis: vector3, angle: number, out: quaternion): void;
    function quatToAxisAngle(src: quaternion, axis: vector3): number;
    function quatFromEulerAngles(ax: number, ay: number, az: number, out: quaternion): void;
    function quatToEulerAngles(src: quaternion, result: vector3): void;
    function quatReset(src: quaternion): void;
    function quatLookat(pos: vector3, targetpos: vector3, out: quaternion): void;
    function quat2Lookat(pos: vector3, targetpos: vector3, out: quaternion, updir?: gd3d.math.vector3): void;
    function quat2LookRotation(pos: vector3, targetpos: vector3, upwards: vector3, out: quaternion): void;
    function quatLookRotation(dir: vector3, upwards: vector3, out: quaternion): void;
    function quatYAxis(pos: vector3, targetpos: vector3, out: quaternion): void;
    /** 计算 从 start 到 end 旋转的四元数 */
    function quatRotationTo(start: vector3, end: vector3, out: quaternion): void;
    function myLookRotation(dir: vector3, out: quaternion, up?: vector3): void;
}
declare namespace gd3d.math {
    function rectSet_One(out: rect): void;
    function rectSet_Zero(out: rect): void;
    function rectEqul(src1: rect, src2: rect): boolean;
    function rectInner(x: number, y: number, src: rect): boolean;
    /**
     * 检测两个矩形是否相碰
     * @param r1
     * @param r2
     */
    function rectCollided(r1: rect, r2: rect): boolean;
    function rectClone(src: rect, out: rect): void;
}
declare namespace gd3d.math {
    function caclStringByteLength(value: string): number;
}
declare namespace gd3d.math {
    function spriteAnimation(row: number, column: number, index: number, out: vector4): void;
    function GetPointAlongCurve(curveStart: vector3, curveStartHandle: vector3, curveEnd: vector3, curveEndHandle: vector3, t: number, out: vector3, crease?: number): void;
}
declare namespace gd3d.math {
    function vec2Subtract(a: vector2, b: vector2, out: vector2): void;
    function vec2Add(a: vector2, b: vector2, out: vector2): void;
    function vec2Clone(from: vector2, to: vector2): void;
    function vec2Distance(a: vector2, b: vector2): number;
    function vec2ScaleByNum(from: vector2, scale: number, out: vector2): void;
    function vec2ScaleByVec2(from: vector2, scale: vector2, out: vector2): void;
    function vec2Length(a: vector2): number;
    function vec2SLerp(vector: vector2, vector2: vector2, v: number, out: vector2): void;
    function vec2Normalize(from: vector2, out: vector2): void;
    function vec2Multiply(a: vector2, b: vector2): number;
    function vec2Dot(lhs: vector2, rhs: vector2): number;
    function vec2Equal(vector: vector2, vector2: vector2, threshold?: number): boolean;
    function vec2SetAll(vector: vector2, value: number): void;
    function vec2Set(vector: vector2, x: number, y: number): void;
}
declare namespace gd3d.math {
    function vec3Clone(from: vector3, to: vector3): void;
    function vec3Add(a: vector3, b: vector3, out: vector3): void;
    function vec3Subtract(a: vector3, b: vector3, out: vector3): void;
    function vec3Minus(a: vector3, out: vector3): void;
    function vec3Length(a: vector3): number;
    function vec3SqrLength(value: vector3): number;
    function vec3Set_One(out: vector3): void;
    function vec3Set_Forward(out: vector3): void;
    function vec3Set_Back(out: vector3): void;
    function vec3Set_Up(out: vector3): void;
    function vec3Set_Down(out: vector3): void;
    function vec3Set_Left(out: vector3): void;
    function vec3Set_Right(out: vector3): void;
    function vec3Normalize(value: vector3, out: vector3): void;
    function vec3ScaleByVec3(from: vector3, scale: vector3, out: vector3): void;
    function vec3ScaleByNum(from: vector3, scale: number, out: vector3): void;
    function vec3Product(a: vector3, b: vector3, out: vector3): void;
    function vec3Cross(lhs: vector3, rhs: vector3, out: vector3): void;
    /**
     * 指定两个向量是否平行
     *
     * @param lhs 向量
     * @param rhs 向量
     * @param precision 精度
     */
    function vec3IsParallel(lhs: vector3, rhs: vector3, precision?: number): boolean;
    function vec3Reflect(inDirection: vector3, inNormal: vector3, out: vector3): void;
    function vec3Dot(lhs: vector3, rhs: vector3): number;
    function vec3Project(vector: vector3, onNormal: vector3, out: vector3): void;
    function vec3ProjectOnPlane(vector: vector3, planeNormal: vector3, out: vector3): void;
    function vec3Exclude(excludeThis: vector3, fromThat: vector3, out: vector3): void;
    function vec3Angle(from: vector3, to: vector3): number;
    function vec3Distance(a: vector3, b: vector3): number;
    function vec3ClampLength(vector: vector3, maxLength: number, out: vector3): void;
    function vec3Min(v0: vector3, v1: vector3, out: vector3): void;
    function vec3Max(v0: vector3, v1: vector3, out: vector3): void;
    function vec3AngleBetween(from: vector3, to: vector3): number;
    function vec3Reset(out: vector3): void;
    function vec3SLerp(vector: vector3, vector2: vector3, v: number, out: vector3): void;
    function vec3SetByFloat(x: number, y: number, z: number, out: vector3): void;
    function vec3Format(vector: vector3, maxDot: number, out: vector3): void;
    function quaternionFormat(vector: quaternion, maxDot: number, out: quaternion): void;
    function floatFormat(num: number, maxDot: number): number;
    function vec3Equal(vector: vector3, vector2: vector3, threshold?: number): boolean;
    function vec3SetAll(vector: vector3, value: number): void;
    function vec3Set(vector: vector3, x: number, y: number, z: number): void;
    /** 获取指定 向量的 垂直向量 */
    function vec3Perpendicular(vector: vector3, out: vector3): void;
    function countStart(tag: string): void;
    function count(tag: string): void;
    function countEnd(tag: string): void;
}
declare namespace gd3d.math {
    function vec4Clone(from: vector4, to: vector4): void;
    function vec4SLerp(vector: vector4, vector2: vector4, v: number, out: vector4): void;
    function vec4Add(a: gd3d.math.vector4, b: gd3d.math.vector4, out: gd3d.math.vector4): void;
    function vec4ScaleByNum(from: gd3d.math.vector4, scale: number, out: gd3d.math.vector4): void;
    function vec4SetAll(vector: vector4, value: number): void;
    function vec4Set(vector: vector4, x: number, y: number, z: number, w: number): void;
}
declare namespace gd3d.framework {
    class navVec3 {
        x: number;
        y: number;
        z: number;
        realy: number;
        clone(): navVec3;
        static DistAZ(start: navVec3, end: navVec3): number;
        static NormalAZ(start: navVec3, end: navVec3): navVec3;
        static Cross(start: navVec3, end: navVec3): navVec3;
        static DotAZ(start: navVec3, end: navVec3): number;
        static Angle(start: navVec3, end: navVec3): number;
        static Border(start: navVec3, end: navVec3, dist: number): navVec3;
        static lerp(from: navVec3, to: navVec3, lerp: number, out: navVec3): void;
    }
    class navNode {
        nodeID: number;
        poly: number[];
        borderByPoly: string[];
        borderByPoint: string[];
        center: navVec3;
        genBorder(): void;
        isLinkTo(info: navMeshInfo, nid: number): string;
        getLinked(info: navMeshInfo): number[];
        genCenter(info: navMeshInfo): void;
    }
    class navBorder {
        borderName: string;
        nodeA: number;
        nodeB: number;
        pointA: number;
        pointB: number;
        length: number;
        center: navVec3;
    }
    class navMeshInfo {
        vecs: navVec3[];
        nodes: navNode[];
        borders: {
            [id: string]: navBorder;
        };
        min: navVec3;
        max: navVec3;
        calcBound(): void;
        private static cross;
        inPoly(p: navVec3, poly: number[]): boolean;
        genBorder(): void;
        static LoadMeshInfo(s: string): navMeshInfo;
    }
}
declare namespace gd3d.framework {
    class NavMeshLoadManager {
        private static _instance;
        /**
        *  navMesh偏移量,为方便地图与NavMesh重合设置的临时变量
        */
        private navMeshVertexOffset;
        /**
        *场景中的寻路Mesh
        */
        navMesh: gd3d.framework.mesh;
        private app;
        navigate: gd3d.framework.Navigate;
        navTrans: gd3d.framework.transform;
        /**
         * 导航网格Json数据
         */
        get navmeshJson(): string;
        private _navmeshJson;
        /**
        * 加载NavMesh
        * @param navMeshUrl 要加载的navMesh完整路径
        * @param app
        * @param onstate 加载反馈信息
        */
        loadNavMesh(navMeshUrl: string, app: gd3d.framework.application, onstate?: (state: stateLoad) => void): void;
        /**
        * 通过数据 装载NavMesh
        * @param dataStr navmesh 的字符串数据
        * @param callback 完成回调
        */
        loadNavMeshByDate(dataStr: string, app: gd3d.framework.application, callback: () => any): void;
        /**
         * 地图寻路网格加载完成
         * @param dataStr 寻路网格信息
         */
        private navmeshLoaded;
        private createMesh;
        showNavmesh(isshow: boolean, material?: gd3d.framework.material): void;
        dispose(): void;
        static get Instance(): NavMeshLoadManager;
        moveToPoints(startPos: gd3d.math.vector3, endPos: gd3d.math.vector3): Array<gd3d.math.vector3>;
        /** 获取指定位置的三角形索引*/
        static findtriIndex(point: gd3d.math.vector3, trans: gd3d.framework.transform): number;
    }
}
declare namespace gd3d.framework {
    class Navigate {
        navindexmap: {
            [id: number]: number;
        };
        navinfo: navMeshInfo;
        constructor(navinfo: gd3d.framework.navMeshInfo, navindexmap: any);
        pathPoints(start: gd3d.math.vector3, end: gd3d.math.vector3, startIndex: number, endIndex: number): Array<gd3d.math.vector3>;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class pathFinding {
        static calcAStarPolyPath(info: navMeshInfo, startPoly: number, endPoly: number, endPos?: navVec3, offset?: number): number[];
        private static NearAngle;
        static FindPath(info: navMeshInfo, startPos: navVec3, endPos: navVec3, offset?: number): navVec3[];
        static calcWayPoints(info: navMeshInfo, startPos: navVec3, endPos: navVec3, polyPath: number[], offset?: number): navVec3[];
        static intersectBorder(a: navVec3, b: navVec3, c: navVec3, d: navVec3): navVec3;
    }
}
declare var RVO: any;
declare namespace gd3d.framework {
    class RVOManager {
        sim: any;
        transforms: gd3d.framework.transform[];
        goals: any[];
        radius: number[];
        attackRanges: number[];
        speeds: number[];
        private map;
        private isRunning;
        private currGoal;
        private lastGoal;
        private currMoveDir;
        private _RoadPoints;
        setRoadPoints(goalQueue: gd3d.math.vector3[]): void;
        addAgent(key: number, transform: gd3d.framework.transform, radius: number, attackRanges: number, speed: number): void;
        removeAgent(key: number): void;
        private reBuildHashMap;
        getTransformByKey(key: number): gd3d.framework.transform;
        setRadius(id: number, value: number): void;
        setSpeed(id: number, value: number): void;
        setAttackRange(id: number, value: number): void;
        disable(): void;
        enable(): void;
        update(): void;
        private isAlmostStatic;
        private RVO_walking;
        private updateTransform;
        private RVO_check;
        private cal2dDir;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class EffectSystemData {
        life: number;
        beLoop: boolean;
        elementDic: {
            [name: string]: EffectElementData;
        };
        clone(): EffectSystemData;
        dispose(): void;
    }
    /**
     * @private
     */
    class EffectElement {
        /**整个特效 */
        transform: transform;
        data: EffectElementData;
        name: string;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        ref: string;
        actions: IEffectAction[];
        curAttrData: EffectAttrsData;
        effectBatcher: EffectBatcher;
        startVboIndex: number;
        startEboIndex: number;
        endEboIndex: number;
        delayTime: number;
        actionActive: boolean;
        loopFrame: number;
        active: boolean;
        constructor(_data: EffectElementData);
        private recordElementLerpAttributes;
        /**
         * 录制插值数据
         *
         * @private
         * @param {EffectElementData} elementData
         * @param {EffectFrameData} effectFrameData
         *
         * @memberof effectSystem
         */
        private recordLerpValues;
        /**
         * 记录插值
         */
        private recordLerp;
        initActions(): void;
        update(): void;
        private updateElementRotation;
        /**
         * 当前帧的数据是否有变化，有变化才需要去刷新batcher，否则直接用当前batcher中的数据去提交渲染即可。
         * 在以下三种情况下，数据都是变化的，都需要刷新bacther：
         * 1、timeline中有当前帧
         * 2、renderModel不是none
         * 3、有action在刷新
         * @param frameIndex
         */
        isCurFrameNeedRefresh(frameIndex: number): boolean;
        setActive(_active: boolean): void;
        dispose(): void;
    }
    /**
     * @private
     */
    class EffectElementData {
        name: string;
        type: EffectElementTypeEnum;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        refFrom: string;
        beloop: boolean;
        delayTime: number;
        actionData: EffectActionData[];
        emissionData: Emission;
        initFrameData: EffectFrameData;
        clone(): EffectElementData;
        dispose(): void;
    }
    /**
     * @private
     */
    class EffectAttrsData {
        pos: math.vector3;
        euler: math.vector3;
        color: math.vector3;
        colorRate: number;
        scale: math.vector3;
        uv: math.vector2;
        alpha: number;
        mat: EffectMatData;
        renderModel: RenderModel;
        matrix: math.matrix;
        tilling: math.vector2;
        /**
         * lerp，action更新euler，再由euler合成rotationByEuler。
         * 下一步拿rotationByEuler乘以billboard生成的四元数得到最终的localRotation。
         * 再用localRotation,pos，scale计算出最终的matrix。
         * matrix作用每个顶点，然后去渲染。
         *
         * @type {math.quaternion}
         * @memberof EffectAttrsData
         */
        rotationByEuler: math.quaternion;
        /**
         * 本地旋转(经过各种lerp和action后计算的最终值)
         *
         * @type {math.quaternion}
         * @memberof EffectAttrsData
         */
        localRotation: math.quaternion;
        mesh: mesh;
        meshdataVbo: Float32Array;
        /**
         * 将计算出来的插值存入到帧属性数据
         *
         * @param {string} attribute
         * @param {*} val
         *
         * @memberof EffectAttrsData
         */
        setLerpAttribute(attribute: string, val: any): void;
        getAttribute(attribute: string): any;
        initAttribute(attribute: string): void;
        resetMatrix(): void;
        copyandinit(): EffectAttrsData;
        clone(): EffectAttrsData;
    }
    /**
     * @private
     */
    class EffectFrameData {
        frameIndex: number;
        attrsData: EffectAttrsData;
        lerpDatas: EffectLerpData[];
        delayTime: number;
        clone(): EffectFrameData;
        dispose(): void;
    }
    /**
     * @private
     */
    class EffectLerpData {
        type: EffectLerpTypeEnum;
        fromFrame: number;
        toFrame: ValueData;
        attrsData: EffectAttrsData;
        attrsList: any[];
        clone(): EffectLerpData;
    }
    /**
     * @private
     */
    class EffectActionData {
        actionType: string;
        startFrame: number;
        endFrame: number;
        params: any;
        clone(): EffectActionData;
    }
    /**
     * @private
     */
    class EffectMatData {
        shader: shader;
        diffuseTexture: texture;
        alphaTexture: texture;
        alphaCut: number;
        static beEqual(data0: EffectMatData, data1: EffectMatData): boolean;
        clone(): EffectMatData;
    }
    enum EffectBatcherState {
        NotInitedStateType = 0,
        InitedStateType = 1,
        ResizeCapacityStateType = 2
    }
    /**
     * @private
     */
    class EffectBatcher {
        mesh: mesh;
        mat: material;
        state: EffectBatcherState;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        effectElements: EffectElement[];
        /**
         * 当前总的顶点数量
         *
         * @private
         * @type {number}
         * @memberof effect
         */
        private _totalVertexCount;
        get curTotalVertexCount(): number;
        set curTotalVertexCount(val: number);
        private _indexStartIndex;
        get indexStartIndex(): number;
        set indexStartIndex(value: number);
        private _vbosize;
        /**
         * 动态设定vbo大小
         *
         * @param {number} value
         * @returns
         *
         * @memberof effect
         */
        resizeVboSize(value: number): void;
        dispose(): void;
        /**
         * 顶点大小
         * @public
         * @type {number}
         * @memberof effect
         */
        vertexSize: number;
        constructor(formate: number);
    }
    /**
     * @private
     */
    enum EffectPlayStateEnum {
        None = 0,
        BeReady = 1,
        Play = 2,
        Pause = 3,
        Stop = 4,
        Dispose = 5
    }
    /**
     * @private
     */
    enum EffectElementTypeEnum {
        SingleMeshType = 0,
        EmissionType = 1,
        MultiMeshType = 2
    }
    /**
     * @private
     */
    enum EffectLerpTypeEnum {
        Linear = 0
    }
    /**
     * @private
     */
    enum RenderModel {
        None = 0,
        BillBoard = 1,
        StretchedBillBoard = 2,
        HorizontalBillBoard = 3,
        VerticalBillBoard = 4,
        Mesh = 5
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    enum ParticleEmissionType {
        burst = 0,
        continue = 1
    }
    /**
     * @private
     */
    class EmissionData {
        /**
        * 发射器类型
        */
        type: ParticleEmissionType;
        /**
        * 发射器名字
        */
        emissionName: string;
        /**
        * 发射器持续发射时间或者延迟爆发时间
        */
        time: number;
        /**
        *  在发射时间内发射粒子个数
        */
        count: number;
        constructor();
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class Emission {
        /**
         * 发射器类型
         */
        emissionType: ParticleEmissionType;
        simulateInLocalSpace: boolean;
        rootpos: gd3d.math.vector3;
        rootRotAngle: gd3d.math.vector3;
        rootScale: gd3d.math.vector3;
        /**
         * 最大发射粒子数（全类型）
         */
        maxEmissionCount: number;
        /**
         * 发射数量（全类型）
         */
        emissionCount: number;
        /**
         * 发射时间（continue类型时表示持续发射时间，burst时表示延时发射时间）
         */
        time: number;
        /**
         * 位置相关
         *
         * @type {gd3d.math.vector3}
         * @memberof EmissionNew
         */
        /**
         * 沿着本地坐标轴不同方向的速度
         *
         * @type {number}
         * @memberof EmissionNew
         */
        moveSpeed: ParticleNode;
        /**
         * 重力
         *
         * @type {number}
         * @memberof EmissionNew
         */
        gravity: number;
        /**
         * 旋转相关
         *
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        euler: ParticleNode;
        eulerNodes: Array<ParticleNode>;
        eulerSpeed: ParticleNode;
        /**
         * 缩放相关
         *
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        scale: ParticleNode;
        scaleNodes: Array<ParticleNodeNumber>;
        scaleSpeed: ParticleNode;
        /**
         * 颜色相关
         *
         * @type {ParticleNode}
         * @memberof EmissionNew
         */
        color: ParticleNode;
        colorRate: number;
        colorNodes: Array<ParticleNode>;
        colorSpeed: ParticleNode;
        /**
         * 随机方向上的速度
         *
         * @type {number}
         * @memberof EmissionNew
         */
        simulationSpeed: ParticleNodeNumber;
        /**
         * 透明度相关
         *
         * @type {AlphaNode}
         * @memberof EmissionNew
         */
        alpha: ParticleNodeNumber;
        alphaNodes: Array<ParticleNodeNumber>;
        alphaSpeed: ParticleNodeNumber;
        /**
         * uv相关
         *
         * @type {UVSpeedNode}
         * @memberof EmissionNew
         */
        uv: ParticleNodeVec2;
        uvType: UVTypeEnum;
        uvRoll: UVRoll;
        uvSprite: UVSprite;
        tilling: math.vector2;
        /**
         * 材质相关
         *
         * @type {EffectMatData}
         * @memberof EmissionNew
         */
        mat: EffectMatData;
        /**
         * 生命周期x
         *
         * @type {ValueData}
         * @memberof EmissionNew
         */
        life: ValueData;
        renderModel: RenderModel;
        mesh: mesh;
        particleStartData: gd3d.framework.ParticleStartData;
        private dataForVbo;
        getVboData(vf: number): Float32Array;
        clone(): Emission;
        getworldRotation(): void;
        cloneParticleNodeArray(_array: Array<ParticleNode>): ParticleNode[];
        cloneParticleNodeNumberArray(_array: Array<ParticleNodeNumber>): ParticleNodeNumber[];
    }
    class UVSprite {
        row: number;
        column: number;
        totalCount: number;
        clone(): UVSprite;
    }
    class UVRoll {
        /**
        * uv滚动
        */
        uvSpeed: UVSpeedNode;
        uvSpeedNodes: Array<UVSpeedNode>;
        clone(): UVRoll;
    }
    enum UVTypeEnum {
        NONE = 0,
        UVRoll = 1,
        UVSprite = 2
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子节点
     */
    /**
     * @private
     */
    class ParticleNode {
        x: ValueData;
        y: ValueData;
        z: ValueData;
        key: number;
        constructor();
        getValue(): gd3d.math.vector3;
        getValueRandom(): gd3d.math.vector3;
        clone(): ParticleNode;
    }
    /**
     * @private
     */
    class AlphaNode {
        alpha: ValueData;
        key: number;
        getValue(): number;
    }
    /**
     * @private
     */
    class UVSpeedNode {
        u: ValueData;
        v: ValueData;
        key: number;
        getValue(): gd3d.math.vector2;
        getValueRandom(): gd3d.math.vector2;
        clone(): UVSpeedNode;
    }
    /**
     * @private
     */
    class ParticleNodeVec2 {
        x: ValueData;
        y: ValueData;
        key: number;
        getValue(): gd3d.math.vector2;
        getValueRandom(): gd3d.math.vector2;
        clone(): ParticleNodeVec2;
    }
    /**
     * @private
     */
    class ParticleNodeNumber {
        num: ValueData;
        key: number;
        getValue(): number;
        getValueRandom(): number;
        clone(): ParticleNodeNumber;
    }
}
declare namespace gd3d.framework {
    /**
    * 粒子初始方向类型
    */
    /**
     * @private
     */
    enum ParticleSystemShape {
        NORMAL = 0,
        BOX = 1,
        SPHERE = 2,
        HEMISPHERE = 3,
        CONE = 4,
        EDGE = 5,
        CIRCLE = 6
    }
    /**
     *  粒子初始数据
     */
    /**
     * @private
     */
    class ParticleStartData {
        shapeType: ParticleSystemShape;
        private _position;
        set position(_pos: gd3d.math.vector3);
        get position(): gd3d.math.vector3;
        private _direction;
        set direction(_dir: gd3d.math.vector3);
        get direction(): gd3d.math.vector3;
        private _width;
        set width(_w: number);
        get width(): number;
        private _height;
        set height(_h: number);
        get height(): number;
        depth: number;
        private _radius;
        set radius(_r: number);
        get radius(): number;
        private _angle;
        set angle(_a: number);
        get angle(): number;
        get randomDirection(): gd3d.math.vector3;
        get boxDirection(): gd3d.math.vector3;
        get sphereDirection(): gd3d.math.vector3;
        get hemisphereDirection(): gd3d.math.vector3;
        emitFrom: emitfromenum;
        get coneDirection(): gd3d.math.vector3;
        get circleDirection(): gd3d.math.vector3;
        get edgeDirection(): math.vector3;
        private getposition;
        clone(): ParticleStartData;
    }
    /**
     * @private
     */
    enum emitfromenum {
        base = 0,
        volume = 1
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class ValueData {
        isRandom: boolean;
        private _value;
        private _valueLimitMin;
        private _valueLimitMax;
        private beInited;
        set value(_v: number);
        set valueLimitMin(_v: number);
        set valueLimitMax(_v: number);
        clone(): ValueData;
        /**
         * 针对随机类型，只要随机过一次就保持这个值不变
         *
         * @returns
         *
         * @memberof ValueData
         */
        getValue(): number;
        /**
         * 针对随机类型，调用一次就随机一个值
         *
         * @returns
         *
         * @memberof ValueData
         */
        getValueRandom(): number;
        constructor();
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class Particle_new {
        gameObject: gameObject;
        private emisson;
        private batcher;
        private startScale;
        startRotation: gd3d.math.quaternion;
        rotationByShape: math.quaternion;
        Starteuler: math.vector3;
        rotAngle: number;
        eulerSpeed: number;
        rotationByEuler: math.quaternion;
        localMatrix: math.matrix;
        localTranslate: math.vector3;
        localRotation: math.quaternion;
        localScale: math.vector3;
        startColor: math.color;
        color: math.vector3;
        alpha: number;
        tex_ST: math.vector4;
        private totalLife;
        private curLife;
        private life;
        private speedDir;
        private movespeed;
        private simulationSpeed;
        sourceVbo: Float32Array;
        vertexStartIndex: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        private emissionMatToWorld;
        private emissionWorldRotation;
        private sizeNodes;
        private colorNodes;
        private alphaNodes;
        constructor(batcher: EmissionBatcher_new);
        uploadData(array: Float32Array): void;
        initByData(): void;
        actived: boolean;
        update(delta: number): void;
        /**
         * 在emission是在simulate in local space 时候，为matTobathcer
         * 在emission是在simulate in world space 时候，为matToWorld
         */
        private transformVertex;
        private _updateLocalMatrix;
        private matToworld;
        private refreshEmissionData;
        private _updateRotation;
        private _updatePos;
        private _updateEuler;
        private _updateScale;
        private _updateColor;
        private spriteIndex;
        private _updateUV;
        private _updateVBO;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    interface IAttributeData {
        uiState: AttributeUIState;
        data: {
            [frameIndex: number]: FrameKeyPointData;
        };
        frameIndexs: number[];
        attributeValType: AttributeValType;
        attributeType: AttributeType;
        actions: {
            [frameIndex: number]: IEffectAction[];
        };
        init(): any;
    }
    class Vector3AttributeData implements IAttributeData, ILerpAttributeInterface {
        uiState: AttributeUIState;
        attributeValType: AttributeValType;
        attributeType: AttributeType;
        data: {
            [frameIndex: number]: FrameKeyPointData;
        };
        frameIndexs: number[];
        actions: {
            [frameIndex: number]: IEffectAction[];
        };
        constructor();
        init(): void;
        addFramePoint(data: FrameKeyPointData, func?: Function): void;
        removeFramePoint(frameId: number, data: any, func?: Function): void;
        updateFramePoint(data: any, func?: Function): void;
    }
    class Vector2AttributeData implements IAttributeData, ILerpAttributeInterface {
        uiState: AttributeUIState;
        attributeValType: AttributeValType;
        attributeType: AttributeType;
        frameIndexs: number[];
        data: {
            [frameIndex: number]: FrameKeyPointData;
        };
        actions: {
            [frameIndex: number]: IEffectAction[];
        };
        constructor();
        init(): void;
        addFramePoint(data: FrameKeyPointData, func?: Function): void;
        removeFramePoint(frameId: number, data: gd3d.math.vector2, func?: Function): void;
        updateFramePoint(data: any, func?: Function): void;
    }
    class NumberAttributeData implements IAttributeData, ILerpAttributeInterface {
        uiState: AttributeUIState;
        attributeValType: AttributeValType;
        attributeType: AttributeType;
        data: {
            [frameIndex: number]: FrameKeyPointData;
        };
        frameIndexs: number[];
        timeLine: {
            [frameIndex: number]: number;
        };
        actions: {
            [frameIndex: number]: IEffectAction[];
        };
        constructor();
        init(): void;
        addFramePoint(data: any, func?: Function): void;
        removeFramePoint(frameId: number, data: number, func?: Function): void;
        updateFramePoint(data: any, func?: Function): void;
    }
    interface ILerpAttributeInterface {
        addFramePoint(data: any, func?: Function): any;
        removeFramePoint(frameId: number, data: any, func?: Function): any;
        updateFramePoint(data: any, func?: Function): any;
    }
    enum AttributeUIState {
        None = 0,
        Show = 1,
        Hide = 2
    }
    enum AttributeUIType {
        Number = 0,
        Vector2 = 1,
        Vector3 = 2,
        Vector4 = 3
    }
    enum AttributeValType {
        FixedValType = 0,
        LerpType = 1
    }
    class FrameKeyPointData {
        frameIndex: number;
        val: any;
        actions: IEffectAction[];
        constructor(frameIndex: number, val: any);
    }
    class AttributeUtil {
        static addFrameIndex(datas: number[], index: number): void;
    }
}
declare namespace gd3d.framework {
    interface IEffectElement {
        name: string;
        elementType: EffectElementTypeEnum;
        beloop: boolean;
        delayTime: number;
        mat: material;
        mesh: mesh;
        writeToJson(obj: any): any;
        dispose(): any;
    }
    enum AttributeType {
        PositionType = 1,
        EulerType = 2,
        ScaleType = 3,
        ColorType = 4,
        ColorRateType = 5,
        AlphaType = 6,
        TillingType = 7
    }
    class EffectElementSingleMesh implements IEffectElement {
        name: string;
        elementType: gd3d.framework.EffectElementTypeEnum;
        beloop: boolean;
        delayTime: number;
        life: number;
        mat: gd3d.framework.material;
        mesh: gd3d.framework.mesh;
        colorRate: number;
        renderModel: gd3d.framework.RenderModel;
        tex_ST: math.vector4;
        position: Vector3Key[];
        euler: Vector3Key[];
        scale: Vector3Key[];
        color: Vector3Key[];
        alpha: NumberKey[];
        actions: IEffectAction[];
        curAttrData: EffectAttrsData;
        loopFrame: number;
        active: boolean;
        transform: transform;
        private mgr;
        private effectSys;
        rotationByEuler: math.quaternion;
        localRotation: math.quaternion;
        constructor(sys: TestEffectSystem, data?: EffectElementData);
        private initByElementdata;
        private initByDefData;
        writeToJson(obj: any): any;
        update(): void;
        private updateElementRotation;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class EffectElementEmission implements IEffectElement {
        webgl: WebGLRenderingContext;
        gameObject: gameObject;
        effectSys: TestEffectSystem;
        active: boolean;
        vf: number;
        private maxVertexCount;
        rotTranslate: gd3d.math.vector3;
        rotScale: gd3d.math.vector3;
        rotRotation: gd3d.math.vector3;
        private rotQuta;
        name: string;
        elementType: EffectElementTypeEnum;
        delayTime: number;
        beloop: boolean;
        lifeTime: NumberData;
        simulateInLocalSpace: boolean;
        startScale: Vector3Data;
        startEuler: Vector3Data;
        startColor: math.color;
        colorRate: number;
        duration: NumberData;
        emissionCount: NumberData;
        emissionType: ParticleEmissionType;
        shapeType: ParticleSystemShape;
        simulationSpeed: NumberData;
        width: number;
        height: number;
        depth: number;
        radius: number;
        angle: number;
        emitFrom: emitfromenum;
        rendermodel: RenderModel;
        mat: material;
        mesh: gd3d.framework.mesh;
        enableVelocityOverLifetime: boolean;
        moveSpeed: Vector3Data;
        enableSizeOverLifetime: boolean;
        sizeNodes: NumberKey[];
        enableRotOverLifeTime: boolean;
        angleSpeed: NumberData;
        enableColorOverLifetime: boolean;
        colorNodes: Vector3Key[];
        alphaNodes: NumberKey[];
        enableTexAnimation: boolean;
        uvType: UVTypeEnum;
        uSpeed: number;
        vSpeed: number;
        row: number;
        column: number;
        count: number;
        private _continueSpaceTime;
        perVertexCount: number;
        perIndexxCount: number;
        vertexSize: number;
        emissionBatchers: EmissionBatcher_new[];
        private curbatcher;
        deadParticles: Particle_new[];
        private curTime;
        private beBurst;
        private numcount;
        private beover;
        constructor(sys: TestEffectSystem, data?: EffectElementData);
        private initDefparticleData;
        private initByEmissonData;
        private worldRotation;
        getWorldRotation(): gd3d.math.quaternion;
        matToObj: gd3d.math.matrix;
        private matToWorld;
        getmatrixToObj(): void;
        getmatrixToWorld(): gd3d.math.matrix;
        update(delta: number): void;
        private updateBatcher;
        private updateLife;
        private reInit;
        private updateEmission;
        private addParticle;
        private addBatcher;
        private _renderCamera;
        get renderCamera(): camera;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
        vbo: Float32Array;
        private ebo;
        private getMesh;
        cloneMeshVBO(): Float32Array;
        cloneMeshEBO(): Uint16Array;
        writeToJson(obj: any): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class EmissionBatcher_new {
        emission: EffectElementEmission;
        private webgl;
        mesh: mesh;
        mat: material;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        particles: Particle_new[];
        constructor(emissionElement: EffectElementEmission);
        private initMesh;
        curVerCount: number;
        curIndexCount: number;
        addParticle(): void;
        private refreshBuffer;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class effTools {
        static getRandomDirAndPosByZEmission(emission: EffectElementEmission, outDir: gd3d.math.vector3, outPos: gd3d.math.vector3): void;
        static getTex_ST(emission: EffectElementEmission, out_St: math.vector4): void;
    }
}
declare namespace gd3d.framework {
    /**
 * 贝塞尔曲线，目前定义了三种：线性贝塞尔曲线(两个点形成),二次方贝塞尔曲线（三个点形成），三次方贝塞尔曲线（四个点形成）
 */
    /**
     * @private
     */
    class Curve3 {
        /**
        * 贝塞尔曲线上的，不包含第一个点
        */
        private _beizerPoints;
        /**
        * 贝塞尔曲线上所有的个数
        */
        private _bezierPointNum;
        get beizerPoints(): gd3d.math.vector3[];
        set beizerPoints(value: gd3d.math.vector3[]);
        get bezierPointNum(): number;
        set bezierPointNum(value: number);
        /**
         * 线性贝塞尔曲线
         * @param start
         * @param end
         * @param indices
         */
        static CreateLinearBezier(start: gd3d.math.vector3, end: gd3d.math.vector3, indices: number): Curve3;
        static GetLerpBezier(nodes: gd3d.framework.ParticleNode[]): Curve3;
        /**
         * 二次方贝塞尔曲线路径
         * @param v0 起始点
         * @param v1 选中的节点
         * @param v2 结尾点
         * @param nbPoints 将贝塞尔曲线拆分nbPoints段，一共有nbPoints+1个点
         */
        static CreateQuadraticBezier(v0: gd3d.math.vector3, v1: gd3d.math.vector3, v2: gd3d.math.vector3, bezierPointNum: number): Curve3;
        /**
         * 三次方贝塞尔曲线路径
         * @param v0
         * @param v1
         * @param v2
         * @param v3
         * @param nbPoints
         */
        static CreateCubicBezier(v0: gd3d.math.vector3, v1: gd3d.math.vector3, v2: gd3d.math.vector3, v3: gd3d.math.vector3, bezierPointNum: number): Curve3;
        constructor(points: gd3d.math.vector3[], nbPoints: number);
        /**
         * 贝塞尔曲线上的点
         */
        getPoints(): math.vector3[];
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    interface IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): any;
        update(frameIndex: number): any;
    }
    /**
     * @private
     */
    class LinearAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        attriname: string;
        attrival: any;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class DestroyAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class LoopAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class UVRollAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        speedu: number;
        speedv: number;
        startu: number;
        startv: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class UVSpriteAnimationAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        /**
         * 控制播放速度
         *
         * @type {number}
         * @memberof UISpriteAnimation
         */
        fps: number;
        /**
         * 行
         *
         * @type {number}
         * @memberof UISpriteAnimation
         */
        row: number;
        /**
         * 列
         *
         * @type {number}
         * @memberof UISpriteAnimation
         */
        colum: number;
        totalCount: number;
        private frameInternal;
        private spriteIndex;
        private tex_ST;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class RotationAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        velocity: any;
        frameInternal: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class RoseCurveAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        radius: number;
        polar: any;
        level: number;
        frameInternal: number;
        speed: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class TrailAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        radius: number;
        position: any;
        eular: any;
        width: number;
        frameInternal: number;
        speed: number;
        transform: gd3d.framework.transform;
        startRotation: gd3d.math.quaternion;
        color: any;
        alpha: number;
        offsetTransalte: gd3d.math.vector3;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    /**
     * @private
     */
    class BreathAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        attriname: string;
        startvalue: any;
        targetvalue: any;
        loopframe: number;
        halfloopframe: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        curTargetFrame: number;
        update(frameIndex: number): void;
        swap(): void;
        getLerpValue(frameIndex: number): any;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class EffectParser {
        asMgr: assetMgr;
        /**
         * 解析特效数据
         *
         * @param {string} str
         * @param {assetMgr} assetmgr
         * @returns
         *
         * @memberof Effect
         */
        Parse(str: string, assetmgr: assetMgr): EffectSystemData;
        /**
         * 解析特效中单个元素数据
         * @param elementData
         */
        private _parse;
        /**
         * 处理特效中元素之间的ref，同时保留ref出来的数据同样根据配置被随机出来的功能
         * @param srcData
         * @param desData
         */
        private copyAndOverWrite;
        /**
         * 解析单mesh类型的特效数据
         */
        _parseSingleMeshTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionShape(_startdata: any, element: EffectElementData): void;
        /**
         * 解析属性数据
         *
         * @param {string} attrib
         * @param {*} content
         * @returns
         *
         * @memberof Effect
         */
        _parseToObjData(attrib: string, content: any): any;
        /**
         * 字符串解析成ParticleNode
         *
         * @param {string} content
         * @returns {ParticleNode}
         *
         * @memberof Effect
         */
        _parseToParticleNode(content: string): ParticleNode;
        /**
         * 字符串转ValueData
         *
         * @param {string} content
         * @returns {ValueData}
         *
         * @memberof Effect
         */
        _parseToValueData(content: string): ValueData;
        /**
         * 字符串转number数组
         *
         * @param {string} content
         * @returns {number[]}
         *
         * @memberof Effect
         */
        _parseToNumberArray(content: string): number[];
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class EffectUtil {
        static lookatbyXAxis(pos: gd3d.math.vector3, xAxis: gd3d.math.vector3, yAxis: gd3d.math.vector3, zAxis: gd3d.math.vector3, targetpos: gd3d.math.vector3, quat: gd3d.math.quaternion): void;
        static eulerFromQuaternion(out: math.vector3, q: math.quaternion, order: any): void;
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
        static vecMuliNum(vec: gd3d.math.vector3, num: number): gd3d.math.vector3;
        static parseVector3(value: any): gd3d.math.vector3;
        static parseEffectVec3(value: any): ParticleNode;
        static parseEffectVec2(value: any): ParticleNodeVec2;
        static parseEffectNum(value: any): ParticleNodeNumber;
        static parseEffectNumNode(value: any): ParticleNodeNumber;
        static parseEffectValueData(value: any): ValueData;
        static parseEffectUVSpeed(value: any): UVSpeedNode;
        static lookat(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up?: gd3d.math.vector3): void;
        static RotateVector3(source: gd3d.math.vector3, direction: gd3d.math.vector3, out: gd3d.math.vector3): void;
        static bindAxisBillboard(localAxis: gd3d.math.vector3, out: gd3d.math.quaternion): void;
        static lookatVerticalBillboard(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up?: gd3d.math.vector3): void;
        /**
        * 沿Z轴旋转
        * @param eye 注视点
        * @param targetpos 目标点
        * @param forward Z轴朝向
        * @param out 旋转得到的四元数
        */
        static quatLookatZ(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, forward?: gd3d.math.vector3): void;
        /**
         * 沿X轴旋转
         * @param eye 注视点
         * @param targetpos 目标点
         * @param right X轴朝向
         * @param out 旋转得到的四元数
         */
        static quatLookatX(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, right?: gd3d.math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class EmissionBatcher {
        emissionElement: EmissionElement;
        private webgl;
        gameObject: gameObject;
        data: Emission;
        mesh: mesh;
        mat: material;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        particles: Particle[];
        private vertexSize;
        vf: number;
        constructor(emissionElement: EmissionElement);
        initMesh(): void;
        curVerCount: number;
        curIndexCount: number;
        addParticle(): void;
        private refreshBuffer;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class Particle {
        private batcher;
        gameObject: gameObject;
        private emisson;
        private vf;
        renderModel: RenderModel;
        private startScale;
        startRotation: gd3d.math.quaternion;
        rotationByShape: math.quaternion;
        euler: math.vector3;
        rotationByEuler: math.quaternion;
        localMatrix: math.matrix;
        localTranslate: math.vector3;
        localRotation: math.quaternion;
        localScale: math.vector3;
        color: math.vector3;
        colorRate: number;
        uv: math.vector2;
        alpha: number;
        tilling: math.vector2;
        private totalLife;
        private curLife;
        private speedDir;
        private movespeed;
        private simulationSpeed;
        data: Emission;
        private vertexSize;
        private vertexCount;
        sourceVbo: Float32Array;
        vertexStartIndex: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        private emissionMatToWorld;
        private emissionWorldRotation;
        constructor(batcher: EmissionBatcher);
        uploadData(array: Float32Array): void;
        initByData(): void;
        actived: boolean;
        update(delta: number): void;
        /**
         * 在emission是在simulate in local space 时候，为matTobathcer
         * 在emission是在simulate in world space 时候，为matToWorld
         */
        private transformVertex;
        private _updateLocalMatrix;
        private matToworld;
        private refreshEmissionData;
        private _updateRotation;
        private _updateElementRotation;
        private _updatePos;
        private _updateEuler;
        private _startNode;
        private endNode;
        private _updateScale;
        private _updateColor;
        private tempStartNode;
        private tempEndNode;
        private _updateNode;
        private _startNodeNum;
        private _curNodeNum;
        private _updateAlpha;
        private _startUVSpeedNode;
        private _curUVSpeedNode;
        private spriteIndex;
        private _updateUV;
        private tex_ST;
        private _updateVBO;
        dispose(): void;
    }
    /**
     * @private
     */
    enum nodeType {
        none = 0,
        alpha = 1,
        scale = 2
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class Particles {
        emissionElements: EmissionElement[];
        vf: number;
        effectSys: effectSystem;
        constructor(sys: effectSystem);
        addEmission(_emissionNew: EffectElementData): void;
        updateForEmission(delta: number): void;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
    }
    /**
     * @private
     */
    class EmissionElement {
        webgl: WebGLRenderingContext;
        gameObject: gameObject;
        effectSys: effectSystem;
        ParticleMgr: Particles;
        vf: number;
        emissionData: Emission;
        private maxVertexCount;
        private localtranslate;
        private localScale;
        private localrotate;
        private eluerAngle;
        private beloop;
        simulateInLocalSpace: boolean;
        active: boolean;
        private _continueSpaceTime;
        perVertexCount: number;
        perIndexxCount: number;
        emissionBatchers: EmissionBatcher[];
        private curbatcher;
        deadParticles: Particle[];
        private curTime;
        private numcount;
        private isover;
        constructor(_emission: EffectElementData, sys: effectSystem, mgr: Particles);
        private worldRotation;
        getWorldRotation(): gd3d.math.quaternion;
        matToBatcher: gd3d.math.matrix;
        private matToWorld;
        getmatrixToWorld(): gd3d.math.matrix;
        update(delta: number): void;
        private testtime;
        updateForEmission(delta: number): void;
        updateBatcher(delta: number): void;
        updateEmission(delta: number): void;
        addParticle(count?: number): void;
        private addBatcher;
        renderCamera: camera;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
        isOver(): boolean;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子
     *
     * @author feng3d
     */
    class Particle1 {
        /**
         * 出生时间
         */
        birthTime: number;
        /**
         * 寿命
         */
        lifetime: number;
        /**
         * 位置
         */
        position: math.vector3;
        /**
         * 速度
         */
        velocity: math.vector3;
        /**
         * 加速度
         */
        acceleration: math.vector3;
        /**
         * 旋转角度
         */
        rotation: math.vector3;
        /**
         * 角速度
         */
        angularVelocity: math.vector3;
        /**
         * 尺寸
         */
        size: math.vector3;
        /**
         * 起始尺寸
         */
        startSize: math.vector3;
        /**
         * 颜色
         */
        color: math.color;
        /**
         * 起始颜色
         */
        startColor: math.color;
        /**
         * 纹理UV缩放和偏移。
         */
        tilingOffset: math.vector4;
        /**
         * 在粒子上翻转UV坐标，使它们呈现水平镜像。
         */
        flipUV: math.vector2;
        /**
         * 出生时在周期的位置（在发射时被更新）
         */
        birthRateAtDuration: number;
        /**
         * 此时粒子在生命周期的位置（在更新状态前被更新）
         */
        rateAtLifeTime: number;
        /**
         * 缓存，用于存储计算时临时数据
         */
        cache: {};
        /**
         * 更新状态
         */
        updateState(preTime: number, time: number): void;
    }
}
declare namespace gd3d.framework {
    interface ComponentMap {
        ParticleSystem: ParticleSystem;
    }
    interface GameObjectEventMap {
        /**
         * 粒子效果播放结束
         */
        particleCompleted: ParticleSystem;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * ui事件
     * @version gd3d 1.0
     */
    class ParticleSystemEvent extends AEvent {
        On<K extends keyof GameObjectEventMap>(event: K, func: (args: GameObjectEventMap[K]) => void, thisArg: any): void;
        Off<K extends keyof GameObjectEventMap>(event: K, func: (args: GameObjectEventMap[K]) => void, thisArg: any): void;
        Emit<K extends keyof GameObjectEventMap>(event: K, args: GameObjectEventMap[K]): void;
    }
    /**
     * 粒子系统
     *
     * @author feng3d
     */
    class ParticleSystem implements IRenderer {
        static readonly ClassName: string;
        __class__: "gd3d.framework.ParticleSystem";
        layer: RenderLayerEnum;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        get renderLayer(): number;
        set renderLayer(layer: number);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number;
        /**
         * Biases Particle System sorting amongst other transparencies.
         *
         * Use lower (negative) numbers to prioritize the Particle System to draw closer to the front, and use higher numbers to prioritize other transparent objects.
         */
        sortingFudge: number;
        /**
         * 参考Unity ParticleSystemRenderer.pivot
         *
         * Modify the pivot point used for rotating particles.
         *
         * The units are expressed as a multiplier of the particle sizes, relative to their diameters. For example, a value of 0.5 adjusts the pivot by the particle radius, allowing particles to rotate around their edges.
         */
        pivot: math.vector3;
        get transform(): transform;
        /**
         * Is the particle system playing right now ?
         *
         * 粒子系统正在运行吗?
         */
        get isPlaying(): boolean;
        private _isPlaying;
        /**
         * Is the particle system stopped right now ?
         *
         * 粒子系统现在停止了吗?
         */
        get isStopped(): boolean;
        /**
         * Is the particle system paused right now ?
         *
         * 粒子系统现在暂停了吗?
         */
        get isPaused(): boolean;
        /**
         * The current number of particles (Read Only).
         *
         * 当前粒子数(只读)。
         */
        get particleCount(): number;
        /**
         * Playback position in seconds.
         *
         * 回放位置(秒)
         */
        time: number;
        get main(): ParticleMainModule;
        set main(v: ParticleMainModule);
        private _main;
        get emission(): ParticleEmissionModule;
        set emission(v: ParticleEmissionModule);
        private _emission;
        get shape(): ParticleShapeModule;
        set shape(v: ParticleShapeModule);
        private _shape;
        get velocityOverLifetime(): ParticleVelocityOverLifetimeModule;
        set velocityOverLifetime(v: ParticleVelocityOverLifetimeModule);
        private _velocityOverLifetime;
        get limitVelocityOverLifetime(): ParticleLimitVelocityOverLifetimeModule;
        set limitVelocityOverLifetime(v: ParticleLimitVelocityOverLifetimeModule);
        private _limitVelocityOverLifetime;
        /**
         * Script interface for the Particle System velocity inheritance module.
         *
         * 粒子系统速度继承模块。
         */
        get inheritVelocity(): ParticleInheritVelocityModule;
        set inheritVelocity(v: ParticleInheritVelocityModule);
        private _inheritVelocity;
        get forceOverLifetime(): ParticleForceOverLifetimeModule;
        set forceOverLifetime(v: ParticleForceOverLifetimeModule);
        private _forceOverLifetime;
        get colorOverLifetime(): ParticleColorOverLifetimeModule;
        set colorOverLifetime(v: ParticleColorOverLifetimeModule);
        private _colorOverLifetime;
        /**
         * 颜色随速度变化模块。
         */
        get colorBySpeed(): ParticleColorBySpeedModule;
        set colorBySpeed(v: ParticleColorBySpeedModule);
        private _colorBySpeed;
        get sizeOverLifetime(): ParticleSizeOverLifetimeModule;
        set sizeOverLifetime(v: ParticleSizeOverLifetimeModule);
        private _sizeOverLifetime;
        /**
         * 缩放随速度变化模块
         */
        get sizeBySpeed(): ParticleSizeBySpeedModule;
        set sizeBySpeed(v: ParticleSizeBySpeedModule);
        private _sizeBySpeed;
        get rotationOverLifetime(): ParticleRotationOverLifetimeModule;
        set rotationOverLifetime(v: ParticleRotationOverLifetimeModule);
        private _rotationOverLifetime;
        /**
         * 旋转角度随速度变化模块
         */
        get rotationBySpeed(): ParticleRotationBySpeedModule;
        set rotationBySpeed(v: ParticleRotationBySpeedModule);
        private _rotationBySpeed;
        /**
         * 旋转角度随速度变化模块
         */
        get noise(): ParticleNoiseModule;
        set noise(v: ParticleNoiseModule);
        private _noise;
        /**
         * 粒子系统纹理表动画模块。
         */
        get textureSheetAnimation(): ParticleTextureSheetAnimationModule;
        set textureSheetAnimation(v: ParticleTextureSheetAnimationModule);
        private _textureSheetAnimation;
        private _mesh;
        private _meshAABB;
        /**
         * @private
         */
        get mesh(): mesh;
        /**
        * @public
        * @language zh_CN
        * @param mesh 此组件的mesh
        * @classdesc
        * 设置mesh数据
        * @version gd3d 1.0
        */
        set mesh(mesh: mesh);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        material: material;
        get single(): boolean;
        /**
         * Start delay in seconds.
         * 启动延迟(以秒为单位)。在调用.play()时初始化值。
         */
        startDelay: number;
        get particleSystemData(): ParticleSystemData;
        set particleSystemData(v: ParticleSystemData);
        private _particleSystemData;
        /**
         * 用于处理事件的监听与派发
         */
        private aEvent;
        /**
        * 添加UI事件监听者
        * @param eventEnum 事件类型
        * @param func 事件触发回调方法 (Warn: 不要使用 func.bind() , 它会导致相等判断失败)
        * @param thisArg 回调方法执行者
        */
        addListener<K extends keyof GameObjectEventMap>(event: K, func: (args: GameObjectEventMap[K]) => void, thisArg: any): void;
        /**
         * 移除事件监听者
         * @param event 事件类型
         * @param func 事件触发回调方法
         * @param thisArg 回调方法执行者
         */
        removeListener<K extends keyof GameObjectEventMap>(event: K, func: (args: GameObjectEventMap[K]) => void, thisArg: any): void;
        onPlay(): void;
        start(): void;
        remove(): void;
        clone(): void;
        gameObject: gameObject;
        constructor();
        update(interval: number): void;
        /**
         * 停止
         */
        stop(): void;
        /**
         * 播放
         */
        play(): void;
        private _startDelay_rate;
        /**
         * @private
         */
        updateStartDelay(): void;
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 继续
         */
        continue(): void;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        private _vbos;
        private _getVBO;
        private _attributes;
        private _awaked;
        /**
         * 当前真实时间（time - startDelay）
         */
        private _realTime;
        /**
         * 上次真实时间
         */
        private _preRealTime;
        /**
         * 粒子池，用于存放未发射或者死亡粒子
         */
        private _particlePool;
        /**
         * 活跃的粒子列表
         */
        private _activeParticles;
        private readonly _modules;
        /**
         * 此时在周期中的位置
         */
        get rateAtDuration(): number;
        /**
         * 发射粒子
         * @param time 当前粒子时间
         */
        private _emit;
        /**
         * 发射粒子
         * @param birthTime 发射时间
         * @param num 发射数量
         */
        private _emitParticles;
        /**
         * 更新活跃粒子状态
         */
        private _updateActiveParticlesState;
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        private _initParticleState;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        private _updateParticleState;
        _simulationSpaceChanged(): void;
        /**
         * 给指定粒子添加指定空间的位移。
         *
         * @param particle 粒子。
         * @param position 速度。
         * @param space 速度所在空间。
         * @param name  速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticlePosition(particle: Particle1, position: math.vector3, space: ParticleSystemSimulationSpace, name?: string): void;
        /**
         * 移除指定粒子上的位移
         *
         * @param particle 粒子。
         * @param name 位移名称。
         */
        removeParticlePosition(particle: Particle1, name: string): void;
        /**
         * 给指定粒子添加指定空间的速度。
         *
         * @param particle 粒子。
         * @param velocity 速度。
         * @param space 速度所在空间。
         * @param name  速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticleVelocity(particle: Particle1, velocity: math.vector3, space: ParticleSystemSimulationSpace, name?: string): void;
        /**
         * 移除指定粒子上的速度
         *
         * @param particle 粒子。
         * @param name 速度名称。
         */
        removeParticleVelocity(particle: Particle1, name: string): void;
        /**
         * 给指定粒子添加指定空间的速度。
         *
         * @param particle 粒子。
         * @param acceleration 加速度。
         * @param space 加速度所在空间。
         * @param name  加速度名称。如果不为 undefined 时保存，调用 removeParticleVelocity 可以移除该部分速度。
         */
        addParticleAcceleration(particle: Particle1, acceleration: math.vector3, space: ParticleSystemSimulationSpace, name?: string): void;
        /**
         * 移除指定粒子上的加速度
         *
         * @param particle 粒子。
         * @param name 加速度名称。
         */
        removeParticleAcceleration(particle: Particle1, name: string): void;
        /**
         * 上次移动发射的位置
         */
        private _preworldPos;
        private _isRateOverDistance;
        private _leftRateOverDistance;
        worldPos: math.vector3;
        moveVec: math.vector3;
        speed: math.vector3;
        localToWorldMatrix: math.matrix;
        worldToLocalMatrix: math.matrix;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统数据
     */
    class ParticleSystemData implements IAsset {
        static readonly ClassName: string;
        private static _datas;
        particleSystem: ParticleSystem;
        /**
         * 获取已经创建了的粒子系统数据
         *
         * @param valueName
         */
        static get(valueName: string): ParticleSystemData;
        private name;
        private id;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version gd3d 1.0
         */
        defaultAsset: boolean;
        /**
         * 粒子系统资源名称
         */
        get value(): string;
        set value(v: string);
        private _value;
        constructor(assetName?: string);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version gd3d 1.0
         */
        getGUID(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version gd3d 1.0
         */
        dispose(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version gd3d 1.0
         */
        use(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version gd3d 1.0
         */
        unuse(disposeNow?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version gd3d 1.0
         */
        caclByteLength(): number;
        setData(v: string): void;
        objectData: any;
    }
}
declare namespace gd3d.framework {
    /**
     * The animation type.
     *
     * 动画类型。
     *
     * @author feng3d
     */
    enum ParticleSystemAnimationType {
        /**
         * Animate over the whole texture sheet from left to right, top to bottom.
         *
         * 从左到右，从上到下动画整个纹理表。
         */
        WholeSheet = 0,
        /**
         * Animate a single row in the sheet from left to right.
         *
         * 从左到右移动工作表中的一行。
         */
        SingleRow = 1
    }
}
declare namespace gd3d.framework {
    /**
     * How to apply emitter velocity to particles.
     *
     * 如何将发射体速度应用于粒子。
     *
     * @author feng3d
     */
    enum ParticleSystemInheritVelocityMode {
        /**
         * Each particle inherits the emitter's velocity on the frame when it was initially emitted.
         *
         * 每个粒子在最初发射时都继承了发射体在帧上的速度。
         */
        Initial = 0,
        /**
         * Each particle's velocity is set to the emitter's current velocity value, every frame.
         *
         * 每一帧，每个粒子的速度都设定为发射器的当前速度值。
         */
        Current = 1
    }
}
declare namespace gd3d.framework {
    /**
     * The mesh emission type.
     *
     * 网格发射类型。
     *
     * @author feng3d
     */
    enum ParticleSystemMeshShapeType {
        /**
         * Emit from the vertices of the mesh.
         *
         * 从网格的顶点发出。
         */
        Vertex = 0,
        /**
         * Emit from the edges of the mesh.
         *
         * 从网格的边缘发出。
         */
        Edge = 1,
        /**
         * Emit from the surface of the mesh.
         *
         * 从网格表面发出。
         */
        Triangle = 2
    }
}
declare namespace gd3d.framework {
    /**
     * The quality of the generated noise.
     *
     * 产生的噪音的质量。
     */
    enum ParticleSystemNoiseQuality {
        /**
         * Low quality 1D noise.
         *
         * 低质量的一维噪声。
         */
        Low = 0,
        /**
         * Medium quality 2D noise.
         *
         * 中等质量2D噪音。
         */
        Medium = 1,
        /**
         * High quality 3D noise.
         *
         * 高品质3D噪音。
         */
        High = 2
    }
}
declare namespace gd3d.framework {
    /**
     * Control how particle systems apply transform scale.
     *
     * 控制粒子系统如何应用变换尺度。
     *
     * @author feng3d
     */
    enum ParticleSystemScalingMode {
        /**
         * Scale the particle system using the entire transform hierarchy.
         *
         * 使用整个转换层次来缩放粒子系统。
         */
        Hierarchy = 0,
        /**
         * Scale the particle system using only its own transform scale. (Ignores parent scale).
         *
         * 尺度粒子系统只使用自己的变换尺度。(忽略了父母规模)。
         */
        Local = 1,
        /**
         * Only apply transform scale to the shape component, which controls where particles are spawned, but does not affect their size or movement.
         *
         * 只对形状组件应用变换比例，它控制生成粒子的位置，但不影响粒子的大小或移动。
         */
        Shape = 2
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统圆锥体发射类型，用于定义基于圆锥体的发射类型。
     */
    enum ParticleSystemShapeConeEmitFrom {
        /**
         * 从圆锥体底面发射。
         */
        Base = 0,
        /**
         * 从圆锥体底面边缘沿着曲面发射。
         */
        BaseShell = 1,
        /**
         * 从圆锥体内部发射。
         */
        Volume = 2,
        /**
         * 从圆锥体曲面沿着曲面发射。
         */
        VolumeShell = 3
    }
}
declare namespace gd3d.framework {
    /**
     * The mode used to generate new points in a shape (Shuriken).
     *
     * 用于在形状中生成新点的模式
     */
    enum ParticleSystemShapeMultiModeValue {
        /**
         * Generate points randomly. (Default)
         *
         * 生成随机点。(默认)
         */
        Random = 0,
        /**
         * Animate the emission point around the shape.
         *
         * 使发射点围绕形状运动。
         */
        Loop = 1,
        /**
         * Animate the emission point around the shape, alternating between clockwise and counter-clockwise directions.
         *
         * 使发射点围绕形状运动，在顺时针和逆时针方向之间交替。
         */
        PingPong = 2,
        /**
         * Distribute new particles around the shape evenly.
         *
         * 在形状周围均匀分布新粒子。
         *
         * @todo
         */
        BurstSpread = 3
    }
}
declare namespace gd3d.framework {
    /**
     * 发射形状
     *
     * @author feng3d
     */
    enum ParticleSystemShapeType {
        /**
         * Emit from a sphere.
         *
         * 从球体的体积中发射。
         */
        Sphere = 0,
        /**
         * Emit from the surface of a sphere.
         *
         * 从球体表面发射。
         */
        SphereShell = 1,
        /**
         * Emit from a half-sphere.
         *
         * 从半球体的体积发射。
         */
        Hemisphere = 2,
        /**
         * Emit from the surface of a half-sphere.
         *
         * 从半球体的表面发射。
         */
        HemisphereShell = 3,
        /**
         * Emit from a cone.
         *
         * 从圆锥体发射。
         */
        Cone = 4,
        /**
         * Emit from the base surface of a cone.
         *
         * 从圆锥体的基面发射。
         */
        ConeShell = 7,
        /**
         * Emit from the volume of a cone.
         *
         * 从一个圆锥体的体积发出。
         */
        ConeVolume = 8,
        /**
         * Emit from the surface of a cone.
         *
         * 从一个圆锥体的表面发射。
         */
        ConeVolumeShell = 9,
        /**
         * Emit from the volume of a box.
         *
         * 从一个盒子的体积中发出。
         */
        Box = 5,
        /**
         * Emit from the surface of a box.
         *
         * 从盒子表面发射。
         */
        BoxShell = 15,
        /**
         * Emit from the edges of a box.
         *
         * 从盒子的边缘发出。
         */
        BoxEdge = 16,
        /**
         * Emit from a mesh.
         *
         * 从一个网格中发出。
         *
         * @todo
         */
        Mesh = 6,
        /**
         * Emit from a mesh renderer.
         *
         * 从一个网格渲染器发射。
         *
         * @todo
         */
        MeshRenderer = 13,
        /**
         * Emit from a skinned mesh renderer.
         *
         * 从蒙皮网格渲染器发出。
         *
         * @todo
         */
        SkinnedMeshRenderer = 14,
        /**
         * Emit from a circle.
         *
         * 从一个圆发出。
         */
        Circle = 10,
        /**
         * Emit from the edge of a circle.
         *
         * 从圆的边缘发出。
         */
        CircleEdge = 11,
        /**
         * Emit from an edge.
         *
         * 从边缘发出。
         */
        SingleSidedEdge = 12
    }
}
declare namespace gd3d.framework {
    /**
     * The emission shape (Shuriken).
     *
     * 发射的形状
     *
     * @author feng3d
     */
    enum ParticleSystemShapeType1 {
        /**
         * Emit from a sphere.
         *
         * 从球体的体积中发射。
         */
        Sphere = 0,
        /**
         * Emit from a half-sphere.
         *
         * 从半球体的体积发射。
         */
        Hemisphere = 1,
        /**
         * Emit from a cone.
         *
         * 从圆锥体发射。
         */
        Cone = 2,
        /**
         * Emit from the volume of a box.
         *
         * 从一个盒子的体积中发出。
         */
        Box = 3,
        /**
         * Emit from a mesh.
         *
         * 从一个网格中发出。
         *
         * @todo
         */
        Mesh = 4,
        /**
         * Emit from a mesh renderer.
         *
         * 从一个网格渲染器发射。
         *
         * @todo
         */
        MeshRenderer = 5,
        /**
         * Emit from a skinned mesh renderer.
         *
         * 从蒙皮网格渲染器发出。
         *
         * @todo
         */
        SkinnedMeshRenderer = 6,
        /**
         * Emit from a circle.
         *
         * 从一个圆发出。
         */
        Circle = 7,
        /**
         * Emit from an edge.
         *
         * 从边缘发出。
         */
        Edge = 8
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子模拟空间
     *
     * @author feng3d
     */
    enum ParticleSystemSimulationSpace {
        /**
         * Simulate particles in local space.
         *
         * 模拟局部空间中的粒子。
         */
        Local = 0,
        /**
         * Simulate particles in world space.
         *
         * 模拟世界空间中的粒子。
         */
        World = 1
    }
}
declare namespace gd3d.framework {
    /**
     * A flag representing each UV channel.
     * 一个代表每个紫外线频道的旗子。
     *
     * @author feng3d
     */
    enum UVChannelFlags {
        /**
         * 无通道。
         */
        Nothing = 0,
        /**
         * First UV channel.
         * 第一UV通道。
         */
        UV0 = 1,
        /**
         * Second UV channel.
         * 第二UV通道。
         */
        UV1 = 2,
        /**
         * Third UV channel.
         * 第三UV通道。
         */
        UV2 = 4,
        /**
         * Fourth UV channel.
         * 第四UV通道。
         */
        UV3 = 8,
        /**
         * All channel.
         * 所有通道。
         */
        Everything = 15
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子模块
     *
     * @author feng3d
     */
    class ParticleModule {
        /**
         * 是否开启
         */
        enabled: boolean;
        /**
         * 粒子系统
         */
        particleSystem: ParticleSystem;
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * the Color By Speed module.
     *
     * 颜色随速度变化模块。
     */
    class ParticleColorBySpeedModule extends ParticleModule {
        /**
         * The gradient controlling the particle colors.
         *
         * 控制粒子颜色的梯度。
         */
        color: MinMaxGradient;
        /**
         * Apply the color gradient between these minimum and maximum speeds.
         *
         * 在这些最小和最大速度之间应用颜色渐变。
         */
        range: math.vector2;
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 颜色随时间变化模块
     *
     * @author feng3d
     */
    class ParticleColorOverLifetimeModule extends ParticleModule {
        /**
         * The gradient controlling the particle colors.
         * 控制粒子颜色的梯度。
         */
        color: MinMaxGradient;
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统发射模块。
     *
     * @author feng3d
     */
    class ParticleEmissionModule extends ParticleModule {
        __class__: "gd3d.framework.ParticleEmissionModule";
        /**
         * 随着时间的推移，新粒子产生的速度。
         */
        rateOverTime: MinMaxCurve;
        /**
         * Change the rate over time multiplier.
         * This is more efficient than accessing the whole curve, if you only want to change the overall rate multiplier.
         *
         * 改变率随时间的乘数。
         * 如果您只想更改整体的速率乘数，那么这比访问整个曲线更有效。
         * 只在
         */
        get rateOverTimeMultiplier(): number;
        set rateOverTimeMultiplier(v: number);
        /**
         * The rate at which new particles are spawned, over distance.
         * New particles will only be emitted when the emitter moves.
         *
         * 产生新粒子的速度，通过距离。
         * 新粒子只有在发射器移动时才会被发射出来。
         *
         * @todo
         */
        rateOverDistance: MinMaxCurve;
        /**
         * Change the rate over distance multiplier.
         * This is more efficient than accessing the whole curve, if you only want to change the overall rate multiplier.
         *
         * 改变速率随距离变化的乘数。
         * 如果您只想更改整体的速率乘数，那么这比访问整个曲线更有效。
         */
        get rateOverDistanceMultiplier(): number;
        set rateOverDistanceMultiplier(v: number);
        /**
         * 爆发数组
         */
        bursts: ParticleEmissionBurst[];
        /**
         * The current number of bursts.
         *
         * 当前的爆发次数。
         */
        get burstCount(): number;
        /**
         * Get the burst array.
         * 获取爆发数组。
         *
         * @param bursts Array of bursts to be filled in.要填充的爆发数组。
         * @returns The number of bursts in the array.数组中的爆发次数。
         */
        getBursts(bursts: ParticleEmissionBurst[]): number;
        /**
         * Set the burst array.
         * 设置爆发数组。
         *
         * @param bursts Array of bursts.爆发的数组。
         * @param size Optional array size, if burst count is less than array size.可选的数组大小，如果爆发计数小于数组大小。
         */
        setBursts(bursts: ParticleEmissionBurst[], size?: number): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 作用在粒子上的力随时间变化模块
     *
     * 控制每个粒子在其生命周期内的力。
     * Script interface for the Force Over Lifetime module.
     *
     * @author feng3d
     */
    class ParticleForceOverLifetimeModule extends ParticleModule {
        /**
         * 作用在粒子上的力
         */
        force: MinMaxCurveVector3;
        /**
         * Are the forces being applied in local or world space?
         *
         * 这些力是作用于局部空间还是世界空间
         */
        space: ParticleSystemSimulationSpace;
        /**
         * When randomly selecting values between two curves or constants, this flag will cause a new random force to be chosen on each frame.
         *
         * 当在两条曲线或常数之间随机选择值时，此标志将导致在每一帧上选择一个新的随机力。
         *
         * @todo
         */
        randomized: boolean;
        /**
         * The curve defining particle forces in the X axis.
         *
         * 在X轴上定义粒子力的曲线。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * Change the X axis mulutiplier.
         *
         * 改变X轴的乘数。
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * The curve defining particle forces in the Y axis.
         *
         * 在Y轴上定义粒子力的曲线。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Change the Y axis mulutiplier.
         *
         * 改变Y轴的乘数。
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * The curve defining particle forces in the Z axis.
         *
         * 在Z轴上定义粒子力的曲线。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Change the Z axis mulutiplier.
         *
         * 改变Z轴的乘数。
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * The Inherit Velocity Module controls how the velocity of the emitter is transferred to the particles as they are emitted.
     *
     * 遗传速度模块控制发射体的速度在粒子发射时如何传递到粒子上。（只有粒子系统在世界空间中模拟时生效）
     */
    class ParticleInheritVelocityModule extends ParticleModule {
        "__class__": "gd3d.framework.ParticleInheritVelocityModule";
        /**
         * How to apply emitter velocity to particles.
         *
         * 如何将发射体速度应用于粒子。
         */
        mode: ParticleSystemInheritVelocityMode;
        /**
         * Curve to define how much emitter velocity is applied during the lifetime of a particle.
         *
         * 曲线，用来定义在粒子的生命周期内应用了多少发射速度。
         */
        multiplier: MinMaxCurve;
        /**
         * Curve to define how much emitter velocity is applied during the lifetime of a particle.
         *
         * 曲线，用来定义在粒子的生命周期内应用了多少发射速度。
         */
        get curve(): MinMaxCurve;
        set curve(v: MinMaxCurve);
        /**
         * Change the curve multiplier.
         *
         * 改变曲线的乘数。
         */
        get curveMultiplier(): number;
        set curveMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * Limit Velocity Over Lifetime module.
     *
     * 基于时间轴限制速度模块。
     *
     * @author feng3d
     */
    class ParticleLimitVelocityOverLifetimeModule extends ParticleModule {
        __class__: "gd3d.framework.ParticleLimitVelocityOverLifetimeModule";
        /**
         * Set the size over lifetime on each axis separately.
         *
         * 在每个轴上分别设置生命周期内的大小。
         */
        separateAxes: boolean;
        /**
         * Maximum velocity curve, when not using one curve per axis.
         *
         * 最大速度曲线，当不使用每轴一个曲线时。
         */
        limit: MinMaxCurve;
        /**
         * Maximum velocity.
         *
         * 最高速度。
         */
        limit3D: MinMaxCurveVector3;
        /**
         * Specifies if the velocities are in local space (rotated with the transform) or world space.
         *
         * 指定速度是在局部空间(与变换一起旋转)还是在世界空间。
         */
        space: ParticleSystemSimulationSpace;
        /**
         * Controls how much the velocity that exceeds the velocity limit should be dampened.
         *
         * 控制多少速度，超过速度限制应该被抑制。
         */
        dampen: number;
        /**
         * Change the limit multiplier.
         *
         * 改变限制乘法因子。
         */
        get limitMultiplier(): number;
        set limitMultiplier(v: number);
        /**
         * Maximum velocity curve for the X axis.
         *
         * X轴的最大速度曲线。
         */
        get limitX(): MinMaxCurve;
        set limitX(v: MinMaxCurve);
        /**
         * Change the limit multiplier on the X axis.
         *
         * 改变X轴上的极限乘法器。
         */
        get limitXMultiplier(): number;
        set limitXMultiplier(v: number);
        /**
         * Maximum velocity curve for the Y axis.
         *
         * Y轴的最大速度曲线。
         */
        get limitY(): MinMaxCurve;
        set limitY(v: MinMaxCurve);
        /**
         * Change the limit multiplier on the Y axis.
         *
         * 改变Y轴上的极限乘法器。
         */
        get limitYMultiplier(): number;
        set limitYMultiplier(v: number);
        /**
         * Maximum velocity curve for the Z axis.
         *
         * Z轴的最大速度曲线。
         */
        get limitZ(): MinMaxCurve;
        set limitZ(v: MinMaxCurve);
        /**
         * Change the limit multiplier on the Z axis.
         *
         * 更改Z轴上的极限乘法器。
         */
        get limitZMultiplier(): number;
        set limitZMultiplier(v: number);
        /**
         * 初始化粒子状态
         *
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         *
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子主模块
     *
     * @author feng3d
     */
    class ParticleMainModule extends ParticleModule {
        __class__: "gd3d.framework.ParticleMainModule";
        enabled: boolean;
        /**
         * 粒子系统的持续时间(秒)。
         */
        duration: number;
        /**
         * 粒子系统在循环吗?
         */
        loop: boolean;
        /**
         * When looping is enabled, this controls whether this particle system will look like it has already simulated for one loop when first becoming visible.
         *
         * 当循环被激活时，它控制这个粒子系统在第一次出现时是否看起来像已经模拟了一个循环。
         */
        prewarm: boolean;
        /**
         * Start delay in seconds.
         *
         * 启动延迟(以秒为单位)。
         */
        startDelay: MinMaxCurve;
        /**
         * Start delay multiplier in seconds.
         *
         * 启动延迟乘数(以秒为单位)。
         */
        get startDelayMultiplier(): number;
        /**
         * The total lifetime in seconds that each new particle will have.
         *
         * 每个新粒子的总寿命(以秒计)。
         */
        startLifetime: MinMaxCurve;
        /**
         * Start lifetime multiplier.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall lifetime multiplier.
         *
         * 起始寿命乘数。
         * 如果您只想更改总体寿命乘数，则此方法比访问整个曲线更有效。
         */
        get startLifetimeMultiplier(): number;
        set startLifetimeMultiplier(v: number);
        /**
         * The initial speed of particles when emitted.
         *
         * 粒子发射时的初始速度。
         */
        startSpeed: MinMaxCurve;
        /**
         * A multiplier of the initial speed of particles when emitted.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall speed multiplier.
         *
         * 粒子发射时的初始速度的乘子。
         * 这种方法比访问整个曲线更有效，如果你只想改变整体速度乘数。
         */
        get startSpeedMultiplier(): number;
        set startSpeedMultiplier(v: number);
        /**
         * A flag to enable specifying particle size individually for each axis.
         *
         * 允许为每个轴分别指定粒度大小的标志。
         */
        useStartSize3D: boolean;
        /**
         * The initial size of particles when emitted.
         *
         * 粒子发射时的初始大小。
         */
        get startSize(): MinMaxCurve;
        set startSize(v: MinMaxCurve);
        /**
         * Start size multiplier.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall size multiplier.
         *
         * 开始尺寸乘数。
         * 如果您只想更改整体尺寸倍增器，则此方法比访问整个曲线更有效。
         */
        get startSizeMultiplier(): number;
        set startSizeMultiplier(v: number);
        /**
         * The initial size of particles when emitted.
         *
         * 发射时粒子的初始大小。
         */
        startSize3D: MinMaxCurveVector3;
        /**
         * The initial size of particles along the X axis when emitted.
         *
         * 发射时沿X轴的粒子的初始大小。
         */
        get startSizeX(): MinMaxCurve;
        set startSizeX(v: MinMaxCurve);
        /**
         * Start rotation multiplier along the X axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall size multiplier.
         *
         * 启动旋转乘法器沿X轴。
         * 如果您只想更改整体大小倍增器，则此方法比访问整个曲线更有效。
         */
        get startSizeXMultiplier(): number;
        set startSizeXMultiplier(v: number);
        /**
         * The initial size of particles along the Y axis when emitted.
         *
         * 发射时沿Y轴的粒子的初始大小。
         */
        get startSizeY(): MinMaxCurve;
        set startSizeY(v: MinMaxCurve);
        /**
         * Start rotation multiplier along the Y axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall size multiplier.
         *
         * 启动旋转乘法器沿Y轴。
         * 如果您只想更改整体大小倍增器，则此方法比访问整个曲线更有效。
         */
        get startSizeYMultiplier(): number;
        set startSizeYMultiplier(v: number);
        /**
         * The initial size of particles along the Z axis when emitted.
         *
         * 发射时沿Z轴的粒子的初始大小。
         */
        get startSizeZ(): MinMaxCurve;
        set startSizeZ(v: MinMaxCurve);
        /**
         * Start rotation multiplier along the Z axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall size multiplier.
         *
         * 启动旋转乘法器沿Z轴。
         * 如果您只想更改整体大小倍增器，则此方法比访问整个曲线更有效。
         */
        get startSizeZMultiplier(): number;
        set startSizeZMultiplier(v: number);
        /**
         * A flag to enable 3D particle rotation.
         * 一个启用粒子3D旋转的标记。
         */
        useStartRotation3D: boolean;
        /**
         * The initial rotation of particles when emitted.
         * 粒子发射时的初始旋转。
         */
        get startRotation(): MinMaxCurve;
        set startRotation(v: MinMaxCurve);
        /**
         * Start rotation multiplier.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall rotation multiplier.
         *
         * 开始旋转乘数。
         * 这种方法比访问整个曲线更有效，如果你只想改变整体旋转乘数。
         */
        get startRotationMultiplier(): number;
        set startRotationMultiplier(v: number);
        /**
         * The initial rotation of particles when emitted.
         *
         * 粒子发射时的初始旋转。
         */
        startRotation3D: MinMaxCurveVector3;
        /**
         * The initial rotation of particles around the X axis when emitted.
         *
         * 发射时粒子围绕X轴的初始旋转。
         */
        get startRotationX(): MinMaxCurve;
        set startRotationX(v: MinMaxCurve);
        /**
         * Start rotation multiplier around the X axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall rotation multiplier.
         *
         * 开始绕X轴旋转乘法器。
         * 这种方法比访问整个曲线更有效，如果你只想改变整体旋转乘数。
         */
        get startRotationXMultiplier(): number;
        set startRotationXMultiplier(v: number);
        /**
         * The initial rotation of particles around the Y axis when emitted.
         *
         * 发射时粒子围绕Y轴的初始旋转。
         */
        get startRotationY(): MinMaxCurve;
        set startRotationY(v: MinMaxCurve);
        /**
         * Start rotation multiplier around the Y axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall rotation multiplier.
         *
         * 开始绕Y轴旋转乘法器。
         * 这种方法比访问整个曲线更有效，如果你只想改变整体旋转乘数。
         */
        get startRotationYMultiplier(): number;
        set startRotationYMultiplier(v: number);
        /**
         * The initial rotation of particles around the Z axis when emitted.
         *
         * 发射时粒子围绕Z轴的初始旋转。
         */
        get startRotationZ(): MinMaxCurve;
        set startRotationZ(v: MinMaxCurve);
        /**
         * Start rotation multiplier around the Z axis.
         * This method is more efficient than accessing the whole curve, if you only want to change the overall rotation multiplier.
         *
         * 开始绕Z轴旋转乘法器。
         * 这种方法比访问整个曲线更有效，如果你只想改变整体旋转乘数。
         */
        get startRotationZMultiplier(): number;
        set startRotationZMultiplier(v: number);
        /**
         * Cause some particles to spin in the opposite direction. Set between 0 and 1, where higher values will cause a higher proportion of particles to spin in the opposite direction.
         *
         * 导致一些粒子向相反的方向旋转。设置在0和1之间，数值越大，粒子朝相反方向旋转的比例越大。
         */
        randomizeRotationDirection: number;
        /**
         * The initial color of particles when emitted.
         *
         * 粒子发射时的初始颜色。
         */
        startColor: MinMaxGradient;
        /**
         * Scale applied to the gravity.
         *
         * 应用于重力加速度的缩放。
         */
        gravityModifier: MinMaxCurve;
        /**
         * This selects the space in which to simulate particles. It can be either world or local space.
         *
         * 模拟空间，使粒子位置模拟在世界，本地或自定义空间。在本地空间中，它们相对于自己的转换而存在，在自定义空间中，它们相对于自定义转换。
         *
         * @todo
         */
        get simulationSpace(): ParticleSystemSimulationSpace;
        set simulationSpace(v: ParticleSystemSimulationSpace);
        private _simulationSpace;
        /**
         * Simulate particles relative to a custom transform component.
         *
         * 模拟相对于自定义转换组件的粒子。
         *
         * @todo
         */
        customSimulationSpace: transform;
        /**
         * Override the default playback speed of the Particle System.
         *
         * 重写粒子系统的默认播放速度。
         */
        simulationSpeed: number;
        /**
         * Control how the particle system's Transform Component is applied to the particle system.
         *
         * 控制粒子系统的变换组件如何应用于粒子系统。
         */
        scalingMode: ParticleSystemScalingMode;
        /**
         * If set to true, the particle system will automatically start playing on startup.
         *
         * 如果设置为真，粒子系统将自动开始播放启动。
         */
        playOnAwake: boolean;
        /**
         * The maximum number of particles to emit.
         *
         * 发射粒子的最大数量。
         */
        maxParticles: number;
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * Script interface for the Noise Module.
     *
     * The Noise Module allows you to apply turbulence to the movement of your particles. Use the low quality settings to create computationally efficient Noise, or simulate smoother, richer Noise with the higher quality settings. You can also choose to define the behavior of the Noise individually for each axis.
     *
     * 噪声模块
     *
     * 噪声模块允许你将湍流应用到粒子的运动中。使用低质量设置来创建计算效率高的噪声，或者使用高质量设置来模拟更平滑、更丰富的噪声。您还可以选择为每个轴分别定义噪声的行为。
     */
    class ParticleNoiseModule extends ParticleModule {
        /**
         * Control the noise separately for each axis.
         *
         * 分别控制每个轴的噪声。
         */
        separateAxes: boolean;
        /**
         * How strong the overall noise effect is.
         *
         * 整体噪音效应有多强。
         */
        get strength(): MinMaxCurve;
        set strength(v: MinMaxCurve);
        /**
         * How strong the overall noise effect is.
         *
         * 整体噪音效应有多强。
         */
        strength3D: MinMaxCurveVector3;
        /**
         * Define the strength of the effect on the X axis, when using separateAxes option.
         *
         * 在使用分别控制每个轴时，在X轴上定义效果的强度。
         */
        get strengthX(): MinMaxCurve;
        set strengthX(v: MinMaxCurve);
        /**
         * Define the strength of the effect on the Y axis, when using separateAxes option.
         *
         * 在使用分别控制每个轴时，在Y轴上定义效果的强度。
         */
        get strengthY(): MinMaxCurve;
        set strengthY(v: MinMaxCurve);
        /**
         * Define the strength of the effect on the Z axis, when using separateAxes option.
         *
         * 在使用分别控制每个轴时，在Z轴上定义效果的强度。
         */
        get strengthZ(): MinMaxCurve;
        set strengthZ(v: MinMaxCurve);
        /**
         * Low values create soft, smooth noise, and high values create rapidly changing noise.
         *
         * 低值产生柔和、平滑的噪声，高值产生快速变化的噪声。
         */
        frequency: number;
        /**
         * Scroll the noise map over the particle system.
         *
         * 在粒子系统上滚动噪声图。
         */
        scrollSpeed: MinMaxCurve;
        /**
         * Higher frequency noise will reduce the strength by a proportional amount, if enabled.
         *
         * 如果启用高频率噪音，将按比例减少强度。
         */
        damping: boolean;
        /**
         * Layers of noise that combine to produce final noise.
         *
         * 一层一层的噪声组合在一起产生最终的噪声。
         */
        octaveCount: number;
        /**
         * When combining each octave, scale the intensity by this amount.
         *
         * 当组合每个八度时，按这个比例调整强度。
         */
        octaveMultiplier: number;
        /**
         * When combining each octave, zoom in by this amount.
         *
         * 当组合每个八度时，放大这个数字。
         */
        octaveScale: number;
        /**
         * Generate 1D, 2D or 3D noise.
         *
         * 生成一维、二维或三维噪声。
         */
        quality: ParticleSystemNoiseQuality;
        /**
         * Enable remapping of the final noise values, allowing for noise values to be translated into different values.
         *
         * 允许重新映射最终的噪声值，允许将噪声值转换为不同的值。
         */
        remapEnabled: boolean;
        /**
         * Define how the noise values are remapped.
         *
         * 定义如何重新映射噪声值。
         */
        get remap(): MinMaxCurve;
        set remap(v: MinMaxCurve);
        /**
         * Define how the noise values are remapped.
         *
         * 定义如何重新映射噪声值。
         */
        remap3D: MinMaxCurveVector3;
        /**
         * Define how the noise values are remapped on the X axis, when using the ParticleSystem.NoiseModule.separateAxes option.
         *
         * 在使用分别控制每个轴时，如何在X轴上重新映射噪声值。
         */
        get remapX(): MinMaxCurve;
        set remapX(v: MinMaxCurve);
        /**
         * Define how the noise values are remapped on the Y axis, when using the ParticleSystem.NoiseModule.separateAxes option.
         *
         * 在使用分别控制每个轴时，如何在Y轴上重新映射噪声值。
         */
        get remapY(): MinMaxCurve;
        set remapY(v: MinMaxCurve);
        /**
         * Define how the noise values are remapped on the Z axis, when using the ParticleSystem.NoiseModule.separateAxes option.
         *
         * 在使用分别控制每个轴时，如何在Z轴上重新映射噪声值。
         */
        get remapZ(): MinMaxCurve;
        set remapZ(v: MinMaxCurve);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
        static _frequencyScale: number;
        static _strengthScale: number;
        static _timeScale: number;
        /**
         * 绘制噪音到图片
         *
         * @param image 图片数据
         */
        drawImage(image: ImageData): void;
        private _getDrawImageStrength;
        /**
         * 获取噪音值
         *
         * @param x
         * @param y
         */
        private _getNoiseValue;
        /**
         * 获取单层噪音值
         *
         * @param x
         * @param y
         */
        private _getNoiseValueBase;
        /**
         * 更新
         *
         * @param interval
         */
        update(interval: number): void;
        private _scrollValue;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 旋转角度随速度变化模块
     */
    class ParticleRotationBySpeedModule extends ParticleModule {
        /**
         * Set the rotation by speed on each axis separately.
         * 在每个轴上分别设置随速度变化的旋转。
         */
        separateAxes: boolean;
        /**
         * 角速度，随速度变化的旋转。
         */
        angularVelocity: MinMaxCurveVector3;
        /**
         * Apply the rotation curve between these minimum and maximum speeds.
         *
         * 在这些最小和最大速度之间应用旋转曲线。
         */
        range: math.vector2;
        /**
         * Rotation by speed curve for the X axis.
         *
         * X轴的旋转随速度变化曲线。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * Rotation multiplier around the X axis.
         *
         * 绕X轴旋转乘法器
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * Rotation by speed curve for the Y axis.
         *
         * Y轴的旋转随速度变化曲线。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Rotation multiplier around the Y axis.
         *
         * 绕Y轴旋转乘法器
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * Rotation by speed curve for the Z axis.
         *
         * Z轴的旋转随速度变化曲线。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Rotation multiplier around the Z axis.
         *
         * 绕Z轴旋转乘法器
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 旋转角度随时间变化模块
     *
     * @author feng3d
     */
    class ParticleRotationOverLifetimeModule extends ParticleModule {
        /**
         * Set the rotation over lifetime on each axis separately.
         * 在每个轴上分别设置基于生命周期的旋转。
         */
        separateAxes: boolean;
        /**
         * 角速度，基于生命周期的旋转。
         */
        angularVelocity: MinMaxCurveVector3;
        /**
         * Rotation over lifetime curve for the X axis.
         *
         * X轴的旋转寿命曲线。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * Rotation multiplier around the X axis.
         *
         * 绕X轴旋转乘法器
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * Rotation over lifetime curve for the Y axis.
         *
         * Y轴的旋转寿命曲线。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Rotation multiplier around the Y axis.
         *
         * 绕Y轴旋转乘法器
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * Rotation over lifetime curve for the Z axis.
         *
         * Z轴的旋转寿命曲线。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Rotation multiplier around the Z axis.
         *
         * 绕Z轴旋转乘法器
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * Shape of the emitter volume, which controls where particles are emitted and their initial direction.
     * 发射体体积的形状，它控制粒子发射的位置和初始方向。
     *
     * @author feng3d
     */
    class ParticleShapeModule extends ParticleModule {
        __class__: "gd3d.framework.ParticleShapeModule";
        /**
         * Type of shape to emit particles from.
         * 发射粒子的形状类型。
         */
        get shapeType(): ParticleSystemShapeType;
        set shapeType(v: ParticleSystemShapeType);
        private _shapeType;
        /**
         * Type of shape to emit particles from.
         * 发射粒子的形状类型。
         */
        get shape(): ParticleSystemShapeType1;
        set shape(v: ParticleSystemShapeType1);
        private _shape;
        /**
         * 当前使用的发射形状
         */
        activeShape: ParticleSystemShapeBase;
        /**
         * Align particles based on their initial direction of travel.
         * 根据粒子的初始运动方向排列粒子。
         *
         * Using align to Direction in the Shape module forces the system to be rendered using Local Billboard Alignment.
         * 在形状模块中使用align to Direction迫使系统使用本地看板对齐方式呈现。
         */
        alignToDirection: boolean;
        /**
         * Randomizes the starting direction of particles.
         * 随机化粒子的起始方向。
         */
        randomDirectionAmount: number;
        /**
         * Spherizes the starting direction of particles.
         * 使粒子的起始方向球面化。
         */
        sphericalDirectionAmount: number;
        /**
         * Angle of the cone.
         *
         * 圆锥的角度。
         */
        angle: number;
        /**
         * Circle arc angle.
         *
         * 圆弧角。
         */
        arc: number;
        /**
         * The mode used for generating particles around the arc.
         *
         * 在弧线周围产生粒子的模式。
         */
        arcMode: ParticleSystemShapeMultiModeValue;
        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         *
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        arcSpeed: MinMaxCurve;
        /**
         * A multiplier of the arc speed of the emission shape.
         *
         * 发射形状的电弧速度的乘数。
         */
        get arcSpeedMultiplier(): number;
        set arcSpeedMultiplier(v: number);
        /**
         * Control the gap between emission points around the arc.
         *
         * 控制弧线周围发射点之间的间隙。
         */
        arcSpread: number;
        /**
         * Scale of the box.
         *
         * 盒子的缩放。
         */
        box: math.vector3;
        /**
         * Length of the cone.
         *
         * 圆锥的长度（高度）。
         */
        length: number;
        /**
         * Mesh to emit particles from.
         *
         * 发射粒子的网格。
         *
         * @todo
         */
        mesh: any;
        /**
         * Emit from a single material, or the whole mesh.
         *
         * 从一个单一的材料，或整个网格发射。
         *
         * @todo
         */
        useMeshMaterialIndex: boolean;
        /**
         * Emit particles from a single material of a mesh.
         *
         * 从一个网格的单一材料发射粒子。
         *
         * @todo
         */
        meshMaterialIndex: number;
        /**
         * MeshRenderer to emit particles from.
         *
         * 从 MeshRenderer 发射粒子。
         *
         * @todo
         */
        meshRenderer: any;
        /**
         * SkinnedMeshRenderer to emit particles from.
         *
         * 从 SkinnedMeshRenderer 发射粒子。
         *
         * @todo
         */
        skinnedMeshRenderer: any;
        /**
         * Apply a scaling factor to the mesh used for generating source positions.
         *
         * 对用于生成源位置的网格应用缩放因子。
         *
         * @todo
         */
        meshScale: number;
        /**
         * Where on the mesh to emit particles from.
         *
         * 从网格的什么地方发射粒子。
         *
         * @todo
         */
        meshShapeType: ParticleSystemMeshShapeType;
        /**
         * Modulate the particle colors with the vertex colors, or the material color if no vertex colors exist.
         *
         * 用顶点颜色调节粒子颜色，如果没有顶点颜色，则调节材质颜色。
         *
         * @todo
         */
        useMeshColors: boolean;
        /**
         * Move particles away from the surface of the source mesh.
         *
         * 将粒子从源网格的表面移开。
         */
        normalOffset: number;
        /**
         * Radius of the shape.
         *
         * 形状的半径。
         */
        radius: number;
        /**
         * The mode used for generating particles around the radius.
         *
         * 在弧线周围产生粒子的模式。
         */
        radiusMode: ParticleSystemShapeMultiModeValue;
        /**
         * When using one of the animated modes, how quickly to move the emission position along the radius.
         *
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        radiusSpeed: MinMaxCurve;
        /**
         * A multiplier of the radius speed of the emission shape.
         *
         * 发射形状的半径速度的乘法器。
         */
        get radiusSpeedMultiplier(): number;
        set radiusSpeedMultiplier(v: number);
        /**
         * Control the gap between emission points around the radius.
         *
         * 控制弧线周围发射点之间的间隙。
         */
        radiusSpread: number;
        private _shapeSphere;
        private _shapeHemisphere;
        private _shapeCone;
        private _shapeBox;
        private _shapeCircle;
        private _shapeEdge;
        constructor();
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        private _onShapeTypeChanged;
        private _onShapeChanged;
    }
}
declare namespace gd3d.framework {
    /**
     * Script interface for the Size By Speed module.
     *
     * 粒子系统 缩放随速度变化模块
     */
    class ParticleSizeBySpeedModule extends ParticleModule {
        /**
         * Set the size over speed on each axis separately.
         *
         * 在每个轴上分别设置生命周期内的大小。
         */
        separateAxes: boolean;
        /**
         * Curve to control particle size based on speed.
         *
         * 基于速度的粒度控制曲线。
         */
        get size(): MinMaxCurve;
        set size(v: MinMaxCurve);
        /**
         * Curve to control particle size based on speed.
         *
         * 基于寿命的粒度控制曲线。
         */
        size3D: MinMaxCurveVector3;
        /**
         * Apply the size curve between these minimum and maximum speeds.
         *
         * 在这些最小和最大速度之间应用尺寸变化。
         */
        range: math.vector2;
        /**
         * Size multiplier.
         *
         * 尺寸的乘数。
         */
        get sizeMultiplier(): number;
        set sizeMultiplier(v: number);
        /**
         * Size over speed curve for the X axis.
         *
         * X轴的尺寸随生命周期变化曲线。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * X axis size multiplier.
         *
         * X轴尺寸的乘数。
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * Size over speed curve for the Y axis.
         *
         * Y轴的尺寸随生命周期变化曲线。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Y axis size multiplier.
         *
         * Y轴尺寸的乘数。
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * Size over speed curve for the Z axis.
         *
         * Z轴的尺寸随生命周期变化曲线。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Z axis size multiplier.
         *
         * Z轴尺寸的乘数。
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 缩放随时间变化模块
     *
     * @author feng3d
     */
    class ParticleSizeOverLifetimeModule extends ParticleModule {
        /**
         * Set the size over lifetime on each axis separately.
         *
         * 在每个轴上分别设置生命周期内的大小。
         */
        separateAxes: boolean;
        /**
         * Curve to control particle size based on lifetime.
         *
         * 基于寿命的粒度控制曲线。
         */
        get size(): MinMaxCurve;
        set size(v: MinMaxCurve);
        /**
         * Size multiplier.
         *
         * 尺寸的乘数。
         */
        get sizeMultiplier(): number;
        set sizeMultiplier(v: number);
        /**
         * Curve to control particle size based on lifetime.
         *
         * 基于寿命的粒度控制曲线。
         */
        size3D: MinMaxCurveVector3;
        /**
         * Size over lifetime curve for the X axis.
         *
         * X轴的尺寸随生命周期变化曲线。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * X axis size multiplier.
         *
         * X轴尺寸的乘数。
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * Size over lifetime curve for the Y axis.
         *
         * Y轴的尺寸随生命周期变化曲线。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Y axis size multiplier.
         *
         * Y轴尺寸的乘数。
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * Size over lifetime curve for the Z axis.
         *
         * Z轴的尺寸随生命周期变化曲线。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Z axis size multiplier.
         *
         * Z轴尺寸的乘数。
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统纹理表动画模块。
     *
     * @author feng3d
     */
    class ParticleTextureSheetAnimationModule extends ParticleModule {
        /**
         * Defines the tiling of the texture.
         *
         * 定义纹理的平铺。
         */
        tiles: math.vector2;
        /**
         * Specifies the animation type.
         *
         * 指定动画类型。
         */
        animation: ParticleSystemAnimationType;
        /**
         * Curve to control which frame of the texture sheet animation to play.
         *
         * 曲线控制哪个帧的纹理表动画播放。
         */
        frameOverTime: MinMaxCurve;
        /**
         * Use a random row of the texture sheet for each particle emitted.
         *
         * 对每个发射的粒子使用纹理表的随机行。
         */
        useRandomRow: boolean;
        /**
         * Explicitly select which row of the texture sheet is used, when useRandomRow is set to false.
         *
         * 当useRandomRow设置为false时，显式选择使用纹理表的哪一行。
         */
        get rowIndex(): number;
        set rowIndex(v: number);
        private _rowIndex;
        /**
         * Define a random starting frame for the texture sheet animation.
         *
         * 为纹理表动画定义一个随机的起始帧。
         */
        startFrame: MinMaxCurve;
        /**
         * Specifies how many times the animation will loop during the lifetime of the particle.
         *
         * 指定在粒子的生命周期内动画将循环多少次。
         */
        cycleCount: number;
        /**
         * Flip the UV coordinate on particles, causing them to appear mirrored.
         *
         * 在粒子上翻转UV坐标，使它们呈现镜像翻转。
         */
        flipUV: math.vector2;
        /**
         * Choose which UV channels will receive texture animation.
         *
         * 选择哪个UV通道将接收纹理动画。
         *
         * todo 目前引擎中只有一套UV
         */
        uvChannelMask: UVChannelFlags;
        /**
         * Flip the U coordinate on particles, causing them to appear mirrored horizontally.
         *
         * 在粒子上翻转U坐标，使它们呈现水平镜像。
         */
        get flipU(): number;
        set flipU(v: number);
        /**
         * Flip the V coordinate on particles, causing them to appear mirrored vertically.
         *
         * 在粒子上翻转V坐标，使它们垂直镜像。
         */
        get flipV(): number;
        set flipV(v: number);
        /**
         * Frame over time mutiplier.
         *
         * 帧随时间变化的乘数。
         */
        get frameOverTimeMultiplier(): number;
        set frameOverTimeMultiplier(v: number);
        /**
         * Defines the tiling of the texture in the X axis.
         *
         * 定义纹理在X轴上的平铺。
         */
        get numTilesX(): number;
        set numTilesX(v: number);
        /**
         * Defines the tiling of the texture in the Y axis.
         *
         * 定义纹理在Y轴上的平铺。
         */
        get numTilesY(): number;
        set numTilesY(v: number);
        /**
         * Starting frame multiplier.
         *
         * 起始帧乘数。
         */
        get startFrameMultiplier(): number;
        set startFrameMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 速度随时间变化模块
     *
     * Controls the velocity of each particle during its lifetime.
     * 控制每个粒子在其生命周期内的速度。
     *
     * @author feng3d
     */
    class ParticleVelocityOverLifetimeModule extends ParticleModule {
        __class__: "gd3d.framework.ParticleVelocityOverLifetimeModule";
        /**
         * Curve to control particle speed based on lifetime.
         *
         * 基于寿命的粒子速度控制曲线。
         */
        velocity: MinMaxCurveVector3;
        /**
         * Specifies if the velocities are in local space (rotated with the transform) or world space.
         *
         * 指定速度是在局部空间(与变换一起旋转)还是在世界空间。
         */
        space: ParticleSystemSimulationSpace;
        /**
         * Curve to control particle speed based on lifetime, on the X axis.
         *
         * 曲线控制粒子速度基于寿命，在X轴上。
         */
        get x(): MinMaxCurve;
        set x(v: MinMaxCurve);
        /**
         * X axis speed multiplier.
         *
         * X轴速度倍增器。
         */
        get xMultiplier(): number;
        set xMultiplier(v: number);
        /**
         * Curve to control particle speed based on lifetime, on the Y axis.
         *
         * 曲线控制粒子速度基于寿命，在Y轴上。
         */
        get y(): MinMaxCurve;
        set y(v: MinMaxCurve);
        /**
         * Y axis speed multiplier.
         *
         * Y轴速度倍增器。
         */
        get yMultiplier(): number;
        set yMultiplier(v: number);
        /**
         * Curve to control particle speed based on lifetime, on the Z axis.
         *
         * 曲线控制粒子速度基于寿命，在Z轴上。
         */
        get z(): MinMaxCurve;
        set z(v: MinMaxCurve);
        /**
         * Z axis speed multiplier.
         *
         * Z轴速度倍增器。
         */
        get zMultiplier(): number;
        set zMultiplier(v: number);
        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle1): void;
        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle1): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @author feng3d
     */
    class ParticleEmissionBurst {
        __class__: "gd3d.framework.ParticleEmissionBurst";
        /**
         * The time that each burst occurs.
         * 每次爆炸发生的时间。
         */
        time: number;
        /**
         * 要发射的粒子数。
         */
        count: MinMaxCurve;
        /**
         * Minimum number of bursts to be emitted.
         * 要发射的最小爆发数量。
         */
        get minCount(): number;
        set minCount(v: number);
        /**
         * Maximum number of bursts to be emitted.
         *
         * 要发射的最大爆发数量。
         */
        get maxCount(): number;
        set maxCount(v: number);
        /**
         * How many times to play the burst. (0 means infinitely).
         * 爆发次数。(0意味着无限)。
         *
         * @todo
         */
        cycleCount: number;
        /**
         * How often to repeat the burst, in seconds.
         *
         * 多久重复一次，以秒为单位。
         *
         * @todo
         */
        repeatInterval: number;
        /**
         * 喷发被触发的几率。
         */
        probability: number;
        /**
         * 是否喷发
         */
        get isProbability(): boolean;
        private _isProbability;
        /**
         * 通过触发的几率计算是否喷发。
         */
        calculateProbability(): boolean;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 发射形状
     *
     * @author feng3d
     */
    class ParticleSystemShapeBase {
        protected _module: ParticleShapeModule;
        constructor(module: ParticleShapeModule);
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @author feng3d
     */
    enum ParticleSystemShapeBoxEmitFrom {
        /**
         * 从盒子内部发射。
         */
        Volume = 0,
        /**
         * 从盒子外壳发射。
         */
        Shell = 1,
        /**
         * 从盒子边缘发射。
         */
        Edge = 2
    }
    /**
     * 粒子系统 发射盒子
     *
     * @author feng3d
     */
    class ParticleSystemShapeBox extends ParticleSystemShapeBase {
        /**
         * 盒子X方向缩放。
         */
        get boxX(): number;
        set boxX(v: number);
        /**
         * 盒子Y方向缩放。
         */
        get boxY(): number;
        set boxY(v: number);
        /**
         * 盒子Z方向缩放。
         */
        get boxZ(): number;
        set boxZ(v: number);
        /**
         * 粒子系统盒子发射类型。
         */
        emitFrom: ParticleSystemShapeBoxEmitFrom;
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 发射圆盘
     *
     * @author feng3d
     */
    class ParticleSystemShapeCircle extends ParticleSystemShapeBase {
        get radius(): number;
        set radius(v: number);
        get arc(): number;
        set arc(v: number);
        /**
         * The mode used for generating particles around the arc.
         *
         * 在弧线周围产生粒子的模式。
         */
        get arcMode(): ParticleSystemShapeMultiModeValue;
        set arcMode(v: ParticleSystemShapeMultiModeValue);
        /**
         * Control the gap between emission points around the arc.
         *
         * 控制弧线周围发射点之间的间隙。
         */
        get arcSpread(): number;
        set arcSpread(v: number);
        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        get arcSpeed(): MinMaxCurve;
        set arcSpeed(v: MinMaxCurve);
        /**
         * 是否从圆形边缘发射。
         */
        emitFromEdge: boolean;
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统发射圆锥体，用于定义基于圆锥体的粒子发射时的初始状态。
     *
     * @author feng3d
     */
    class ParticleSystemShapeCone extends ParticleSystemShapeBase {
        /**
         * Angle of the cone.
         * 圆锥的角度。
         */
        get angle(): number;
        set angle(v: number);
        /**
         * 圆锥体底部半径。
         */
        get radius(): number;
        set radius(v: number);
        /**
         * Length of the cone.
         *
         * 圆锥的长度（高度）。
         */
        get length(): number;
        set length(v: number);
        /**
         * Circle arc angle.
         */
        get arc(): number;
        set arc(v: number);
        /**
         * The mode used for generating particles around the arc.
         * 在弧线周围产生粒子的模式。
         */
        get arcMode(): ParticleSystemShapeMultiModeValue;
        set arcMode(v: ParticleSystemShapeMultiModeValue);
        /**
         * Control the gap between emission points around the arc.
         * 控制弧线周围发射点之间的间隙。
         */
        get arcSpread(): number;
        set arcSpread(v: number);
        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        get arcSpeed(): MinMaxCurve;
        set arcSpeed(v: MinMaxCurve);
        /**
         * 粒子系统圆锥体发射类型。
         */
        emitFrom: ParticleSystemShapeConeEmitFrom;
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 粒子系统 发射边
     *
     * @author feng3d
     */
    class ParticleSystemShapeEdge extends ParticleSystemShapeBase {
        /**
         * 边长的一半。
         */
        get radius(): number;
        set radius(v: number);
        /**
         * The mode used for generating particles around the radius.
         *
         * 在弧线周围产生粒子的模式。
         */
        get radiusMode(): ParticleSystemShapeMultiModeValue;
        set radiusMode(v: ParticleSystemShapeMultiModeValue);
        /**
         * Control the gap between emission points around the radius.
         *
         * 控制弧线周围发射点之间的间隙。
         */
        get radiusSpread(): number;
        set radiusSpread(v: number);
        /**
         * When using one of the animated modes, how quickly to move the emission position around the radius.
         *
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        get radiusSpeed(): MinMaxCurve;
        set radiusSpeed(v: MinMaxCurve);
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    /**
     * 从球体的体积中发射。
     *
     * @author feng3d
     */
    class ParticleSystemShapeSphere extends ParticleSystemShapeBase {
        /**
         * 球体半径
         */
        get radius(): number;
        set radius(v: number);
        /**
         * 是否从球面发射
         */
        emitFromShell: boolean;
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
    /**
     * 从半球体的体积中发出。
     */
    class ParticleSystemShapeHemisphere extends ParticleSystemShapeBase {
        radius: number;
        /**
         * 是否从球面发射
         */
        emitFromShell: boolean;
        /**
         * 计算粒子的发射位置与方向
         *
         * @param particle
         * @param position
         * @param dir
         */
        calcParticlePosDir(particle: Particle1, position: math.vector3, dir: math.vector3): void;
    }
}
declare namespace gd3d.framework {
    class CannonJSPlugin implements IPhysicsEnginePlugin {
        private _useDeltaForWorldStep;
        BJSCANNON: any;
        world: any;
        name: string;
        private _physicsMaterials;
        private _fixedTimeStep;
        private static helpv3;
        constructor(_useDeltaForWorldStep?: boolean, iterations?: number);
        setGravity(gravity: math.vector3): void;
        setTimeStep(timeStep: number): void;
        getTimeStep(): number;
        executeStep(delta: number, impostors: Array<PhysicsImpostor>): void;
        applyImpulse(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        applyForce(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        generatePhysicsBody(impostor: PhysicsImpostor): void;
        removePhysicsBody(impostor: PhysicsImpostor): void;
        generateJoint(impostorJoint: PhysicsImpostorJoint): void;
        removeJoint(impostorJoint: PhysicsImpostorJoint): void;
        private _addMaterial;
        private _checkWithEpsilon;
        private _createShape;
        private vec3Copy;
        private QuatCopy;
        setTransformationFromPhysicsBody(impostor: PhysicsImpostor): void;
        setPhysicsBodyTransformation(impostor: PhysicsImpostor, newPosition: math.vector3, newRotation: math.vector3): void;
        isSupported(): boolean;
        setLinearVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        setAngularVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        getLinearVelocity(impostor: PhysicsImpostor): math.vector3;
        getAngularVelocity(impostor: PhysicsImpostor): math.vector3;
        setBodyMass(impostor: PhysicsImpostor, mass: number): void;
        getBodyMass(impostor: PhysicsImpostor): number;
        getBodyFriction(impostor: PhysicsImpostor): number;
        setBodyFriction(impostor: PhysicsImpostor, friction: number): void;
        getBodyRestitution(impostor: PhysicsImpostor): number;
        setBodyRestitution(impostor: PhysicsImpostor, restitution: number): void;
        sleepBody(impostor: PhysicsImpostor): void;
        isSleeping(impostor: PhysicsImpostor): boolean;
        wakeUpBody(impostor: PhysicsImpostor): void;
        updateDistanceJoint(joint: PhysicsJoint, maxDistance: number, minDistance?: number): void;
        setMotor(joint: IMotorEnabledJoint, speed?: number, maxForce?: number, motorIndex?: number): void;
        setLimit(joint: IMotorEnabledJoint, upperLimit: number, lowerLimit?: number): void;
        getRadius(impostor: PhysicsImpostor): number;
        getBoxSizeToRef(impostor: PhysicsImpostor, result: math.vector3): void;
        dispose(): void;
        private _extendNamespace;
    }
}
declare namespace gd3d.framework {
    /** OimoJS physic engine Plugin  */
    class OimoJSPlugin implements IPhysicsEnginePlugin {
        world: any;
        name: string;
        private _physicsMaterials;
        private _fixedTimeStep;
        BJSOIMO: any;
        private static helpquat;
        private static helpv3;
        private static helpv3_1;
        private static helpv3_2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * OimoJS 物理引擎插件
        * @param option Oimo world 构造选项
        * @param oimoInjection Omio对象
        * @version gd3d 1.0
        */
        constructor(iterations?: number, oimoInjection?: any);
        setGravity(gravity: math.vector3): void;
        setTimeStep(timeStep: number): void;
        getTimeStep(): number;
        private _tmpImpostorsArray;
        executeStep(delta: number, impostors: Array<PhysicsImpostor>): void;
        /** 申请 冲量 */
        applyImpulse(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        applyForce(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        private checkWithEpsilon;
        generatePhysicsBody(impostor: PhysicsImpostor): void;
        private _tmpPositionVector;
        removePhysicsBody(impostor: PhysicsImpostor): void;
        generateJoint(impostorJoint: PhysicsImpostorJoint): void;
        removeJoint(impostorJoint: PhysicsImpostorJoint): void;
        setTransformationFromPhysicsBody(impostor: PhysicsImpostor): void;
        setPhysicsBodyTransformation(impostor: PhysicsImpostor, newPosition: math.vector3, newRotation: math.quaternion): void;
        isSupported(): boolean;
        setLinearVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        setAngularVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        getLinearVelocity(impostor: PhysicsImpostor): math.vector3;
        getAngularVelocity(impostor: PhysicsImpostor): math.vector3;
        setBodyMass(impostor: PhysicsImpostor, mass: number): void;
        getBodyMass(impostor: PhysicsImpostor): number;
        getBodyFriction(impostor: PhysicsImpostor): number;
        setBodyFriction(impostor: PhysicsImpostor, friction: number): void;
        getBodyRestitution(impostor: PhysicsImpostor): number;
        setBodyRestitution(impostor: PhysicsImpostor, restitution: number): void;
        sleepBody(impostor: PhysicsImpostor): void;
        isSleeping(impostor: PhysicsImpostor): any;
        wakeUpBody(impostor: PhysicsImpostor): void;
        updateDistanceJoint(joint: PhysicsJoint, maxDistance: number, minDistance?: number): void;
        setMotor(joint: IMotorEnabledJoint, speed?: number, force?: number, motorIndex?: number): void;
        setLimit(joint: IMotorEnabledJoint, upperLimit: number, lowerLimit?: number, motorIndex?: number): void;
        getRadius(impostor: PhysicsImpostor): number;
        getBoxSizeToRef(impostor: PhysicsImpostor, result: math.vector3): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    interface PhysicsImpostorJoint {
        mainImpostor: PhysicsImpostor;
        connectedImpostor: PhysicsImpostor;
        joint: PhysicsJoint;
    }
    class PhysicsEngine {
        private _physicsPlugin;
        gravity: math.vector3;
        /**
         * Creates a new Physics Engine
         * @param gravity defines the gravity vector used by the simulation
         * @param _physicsPlugin defines the plugin to use (CannonJS by default)
         */
        constructor(gravity?: math.vector3, _physicsPlugin?: IPhysicsEnginePlugin);
        /**
         * Sets the gravity vector used by the simulation
         * @param gravity defines the gravity vector to use
         */
        setGravity(gravity: math.vector3): void;
        /**
         * Set the time step of the physics engine.
         * default is 1/60.
         * To slow it down, enter 1/600 for example.
         * To speed it up, 1/30
         * @param {number} newTimeStep the new timestep to apply to this world.
         */
        setTimeStep(newTimeStep?: number): void;
        /**
         * Get the time step of the physics engine.
         */
        getTimeStep(): number;
        /**
         * dispose all impostor of the physics engine.
         */
        dispose(): void;
        getPhysicsPluginName(): string;
        static Epsilon: number;
        private _impostors;
        private _joints;
        /**
         * Adding a new impostor for the impostor tracking.
         * This will be done by the impostor itself.
         * @param {PhysicsImpostor} impostor the impostor to add
         */
        addImpostor(impostor: PhysicsImpostor): void;
        /**
         * Remove an impostor from the engine.
         * This impostor and its mesh will not longer be updated by the physics engine.
         * @param {PhysicsImpostor} impostor the impostor to remove
         */
        removeImpostor(impostor: PhysicsImpostor): void;
        /**
         * Add a joint to the physics engine
         * @param {PhysicsImpostor} mainImpostor the main impostor to which the joint is added.
         * @param {PhysicsImpostor} connectedImpostor the impostor that is connected to the main impostor using this joint
         * @param {PhysicsJoint} the joint that will connect both impostors.
         */
        addJoint(mainImpostor: PhysicsImpostor, connectedImpostor: PhysicsImpostor, joint: PhysicsJoint): void;
        /**
         * Removes a joint from the simulation
         * @param mainImpostor defines the impostor used with the joint
         * @param connectedImpostor defines the other impostor connected to the main one by the joint
         * @param joint defines the joint to remove
         */
        removeJoint(mainImpostor: PhysicsImpostor, connectedImpostor: PhysicsImpostor, joint: PhysicsJoint): void;
        /**
         * Called by the scene. no need to call it.
         */
        _step(delta: number): void;
        /**
         * Gets the current plugin used to run the simulation
         * @returns current plugin
         */
        getPhysicsPlugin(): IPhysicsEnginePlugin;
        /**
         * Gets the list of physic impostors
         * @returns an array of PhysicsImpostor
         */
        getImpostors(): Array<PhysicsImpostor>;
        /**
         * Gets the impostor for a physics enabled object
         * @param object defines the object impersonated by the impostor
         * @returns the PhysicsImpostor or null if not found
         */
        getImpostorForPhysicsObject(object: transform): PhysicsImpostor;
        /**
         * Gets the impostor for a physics body object
         * @param body defines physics body used by the impostor
         * @returns the PhysicsImpostor or null if not found
         */
        getImpostorWithPhysicsBody(body: any): PhysicsImpostor;
    }
    interface IPhysicsEnginePlugin {
        world: any;
        name: string;
        setGravity(gravity: math.vector3): void;
        setTimeStep(timeStep: number): void;
        getTimeStep(): number;
        executeStep(delta: number, impostors: Array<PhysicsImpostor>): void;
        applyImpulse(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        applyForce(impostor: PhysicsImpostor, force: math.vector3, contactPoint: math.vector3): void;
        generatePhysicsBody(impostor: PhysicsImpostor): void;
        removePhysicsBody(impostor: PhysicsImpostor): void;
        generateJoint(joint: PhysicsImpostorJoint): void;
        removeJoint(joint: PhysicsImpostorJoint): void;
        isSupported(): boolean;
        setTransformationFromPhysicsBody(impostor: PhysicsImpostor): void;
        setPhysicsBodyTransformation(impostor: PhysicsImpostor, newPosition: math.vector3, newRotation: math.quaternion): void;
        setLinearVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        setAngularVelocity(impostor: PhysicsImpostor, velocity: math.vector3): void;
        getLinearVelocity(impostor: PhysicsImpostor): math.vector3;
        getAngularVelocity(impostor: PhysicsImpostor): math.vector3;
        setBodyMass(impostor: PhysicsImpostor, mass: number): void;
        getBodyMass(impostor: PhysicsImpostor): number;
        getBodyFriction(impostor: PhysicsImpostor): number;
        setBodyFriction(impostor: PhysicsImpostor, friction: number): void;
        getBodyRestitution(impostor: PhysicsImpostor): number;
        setBodyRestitution(impostor: PhysicsImpostor, restitution: number): void;
        sleepBody(impostor: PhysicsImpostor): void;
        isSleeping(impostor: PhysicsImpostor): boolean;
        wakeUpBody(impostor: PhysicsImpostor): void;
        updateDistanceJoint(joint: PhysicsJoint, maxDistance: number, minDistance?: number): void;
        setMotor(joint: IMotorEnabledJoint, speed: number, maxForce?: number, motorIndex?: number): void;
        setLimit(joint: IMotorEnabledJoint, upperLimit: number, lowerLimit?: number, motorIndex?: number): void;
        getRadius(impostor: PhysicsImpostor): number;
        getBoxSizeToRef(impostor: PhysicsImpostor, result: math.vector3): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    interface PhysicsImpostorParameters {
        mass: number;
        /** The friction of the physics imposter*/
        friction?: number;
        /**
         * The coefficient of restitution of the physics imposter
         */
        restitution?: number;
        /**
         * The native options of the physics imposter
         */
        nativeOptions?: any;
        /**
         * Specifies if the parent should be ignored
         */
        ignoreParent?: boolean;
        /**
         * Specifies if bi-directional transformations should be disabled
         */
        disableBidirectionalTransformation?: boolean;
        /**
         * kinematic
         */
        kinematic?: boolean;
        heightFieldMatrix?: number[][];
        heightFieldOptions?: {
            minValue?: number;
            maxValue?: number;
            elementSize?: number;
        };
    }
    interface IPhysicsEnabledObject {
        position: math.vector3;
        rotationQuaternion: math.quaternion;
        scaling: math.vector3;
        rotation?: math.vector3;
        parent?: any;
        getWorldMatrix?(): math.matrix;
        getAbsolutePosition(): math.vector3;
        getAbsolutePivotPoint(): math.vector3;
    }
    class PhysicsImpostor {
        object: transform;
        type: ImpostorType;
        _options: PhysicsImpostorParameters;
        static DEFAULT_OBJECT_SIZE: math.vector3;
        static IDENTITY_QUATERNION: math.quaternion;
        private _physicsEngine;
        private _physicsBody;
        private _bodyUpdateRequired;
        private _onBeforePhysicsStepCallbacks;
        private _onAfterPhysicsStepCallbacks;
        private _onPhysicsCollideCallbacks;
        private _deltaPosition;
        private _deltaRotation;
        private _deltaRotationConjugated;
        private _parent;
        private _isDisposed;
        private static _tmpVecs;
        private static _tmpQuat;
        private static helpquat;
        private static helpv3;
        private static helpv3_1;
        get isDisposed(): boolean;
        get mass(): number;
        set mass(value: number);
        get friction(): number;
        set friction(value: number);
        get restitution(): number;
        set restitution(value: number);
        uniqueId: number;
        private _joints;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * PhysicsImpostor
         * @param object    transform 对象
         * @param type  shape types.
         * @param _options Body Parameters
         */
        constructor(object: transform, type: ImpostorType, _options?: PhysicsImpostorParameters);
        /**
         * This function will completly initialize this impostor.
         * It will create a new body - but only if this mesh has no parent.
         * If it has, this impostor will not be used other than to define the impostor
         * of the child mesh.
         */
        _init(): void;
        private _getPhysicsParent;
        /**
         * Should a new body be generated.
         */
        isBodyInitRequired(): boolean;
        setScalingUpdated(updated: boolean): void;
        /**
         * Force a regeneration of this or the parent's impostor's body.
         * Use under cautious - This will remove all joints already implemented.
         */
        forceUpdate(): void;
        /**
         * Gets the body that holds this impostor. Either its own, or its parent.
         */
        get physicsBody(): any;
        /**
         * Get the parent of the physics imposter
         * @returns Physics imposter or null
         */
        get parent(): PhysicsImpostor;
        /**
         * Sets the parent of the physics imposter
         */
        set parent(value: PhysicsImpostor);
        /**
         * Set the physics body. Used mainly by the physics engine/plugin
         */
        set physicsBody(physicsBody: any);
        resetUpdateFlags(): void;
        private _obb;
        private getObb;
        private _cacheSizeWorld;
        /**
        * Gets the object extend size
        * @returns the object extend size
        */
        getObjectExtendSize(): math.vector3;
        /**
         * Gets the object center
         * @returns The object center
         */
        getObjectCenter(): math.vector3;
        /**
         * Get a specific parametes from the options parameter.
         */
        getParam(paramName: string): any;
        /**
         * Sets a specific parameter in the options given to the physics plugin
         */
        setParam(paramName: string, value: number): void;
        /**
         * Specifically change the body's mass option. Won't recreate the physics body object
         */
        setMass(mass: number): void;
        getLinearVelocity(): math.vector3;
        setLinearVelocity(velocity: math.vector3): void;
        getAngularVelocity(): math.vector3;
        setAngularVelocity(velocity: math.vector3): void;
        /**
         * Execute a function with the physics plugin native code.
         * Provide a function the will have two variables - the world object and the physics body object.
         */
        executeNativeFunction(func: (world: any, physicsBody: any) => void): void;
        /**
         * Register a function that will be executed before the physics world is stepping forward.
         */
        registerBeforePhysicsStep(func: (impostor: PhysicsImpostor) => void): void;
        unregisterBeforePhysicsStep(func: (impostor: PhysicsImpostor) => void): void;
        /**
         * Register a function that will be executed after the physics step
         */
        registerAfterPhysicsStep(func: (impostor: PhysicsImpostor) => void): void;
        unregisterAfterPhysicsStep(func: (impostor: PhysicsImpostor) => void): void;
        /**
         * register a function that will be executed when this impostor collides against a different body.
         */
        registerOnPhysicsCollide(collideAgainst: PhysicsImpostor | Array<PhysicsImpostor>, func: (collider: PhysicsImpostor, collidedAgainst: PhysicsImpostor) => void): void;
        unregisterOnPhysicsCollide(collideAgainst: PhysicsImpostor | Array<PhysicsImpostor>, func: (collider: PhysicsImpostor, collidedAgainst: PhysicsImpostor | Array<PhysicsImpostor>) => void): void;
        private lastObjwPos;
        private lastObjwRot;
        /**
         * this function is executed by the physics engine.
         */
        beforeStep: () => void;
        private _freezeMask;
        /**
         * 设置 位移、旋转 冻结选项
         * @param option 冻结类型
         * @param beSelect 是否选上
         */
        setFreeze(option: FreezeType, beSelect: boolean): void;
        /**
         * 获取 位移、旋转 冻结选项
         * @param option 冻结类型
         */
        getFreeze(option: FreezeType): number;
        private lastbodywPos;
        private lastbodywRot;
        private lastEuler;
        private lastRotMask;
        /**
         * this function is executed by the physics engine
         */
        afterStep: () => void;
        /**
         * Legacy collision detection event support
         */
        onCollideEvent: (collider: PhysicsImpostor, collidedWith: PhysicsImpostor) => void;
        onCollide: (e: {
            body: any;
        }) => void;
        /**
         * Apply a force
         */
        applyForce(force: math.vector3, contactPoint: math.vector3): PhysicsImpostor;
        /**
         * Apply an impulse
         */
        applyImpulse(force: math.vector3, contactPoint: math.vector3): PhysicsImpostor;
        /**
         * A help function to create a joint.
         */
        createJoint(otherImpostor: PhysicsImpostor, jointType: number, jointData: PhysicsJointData): PhysicsImpostor;
        /**
         * Add a joint to this impostor with a different impostor.
         */
        addJoint(otherImpostor: PhysicsImpostor, joint: PhysicsJoint): PhysicsImpostor;
        /**
         * Will keep this body still, in a sleep mode.
         */
        sleep(): PhysicsImpostor;
        /**
         * result body is sleeping
         */
        get isSleeping(): boolean;
        /**
         * Wake the body up.
         */
        wakeUp(): PhysicsImpostor;
        clone(newObject: transform): PhysicsImpostor;
        dispose(): void;
        setDeltaPosition(position: math.vector3): void;
        setDeltaRotation(rotation: math.quaternion): void;
        getBoxSizeToRef(result: math.vector3): PhysicsImpostor;
        getRadius(): number;
        /**
         * 设置动力学的 位置
         */
        kinematicSetPosition(position: math.vector3): void;
        /**
         * 设置动力学的 旋转
         */
        kinematicSetRotation(rotation: math.quaternion): void;
    }
    /** Impostor types */
    enum ImpostorType {
        /** No-Imposter type */
        NoImpostor = 0,
        /** Sphere-Imposter type */
        SphereImpostor = 1,
        /** Box-Imposter type */
        BoxImpostor = 2,
        /** Plane-Imposter type */
        PlaneImpostor = 3,
        /** Mesh-Imposter type */
        MeshImpostor = 4,
        /** Cylinder-Imposter type */
        CylinderImpostor = 7,
        /** Particle-Imposter type */
        ParticleImpostor = 8,
        /** Heightmap-Imposter type */
        HeightmapImpostor = 9,
        /** ConvexHull-Imposter type */
        ConvexHullImpostor = 10,
        /** Rope-Imposter type */
        RopeImpostor = 101,
        /** Cloth-Imposter type */
        ClothImpostor = 102,
        /** Softbody-Imposter type */
        SoftbodyImpostor = 103
    }
    /**
     * physicImpostor 冻结类型
     */
    enum FreezeType {
        Position_x = 1,
        Position_y = 2,
        Position_z = 4,
        Rotation_x = 8,
        Rotation_y = 16,
        Rotation_z = 32
    }
}
declare namespace gd3d.framework {
    interface PhysicsJointData {
        /**
         * The main pivot of the joint
         */
        mainPivot?: math.vector3;
        /**
         * The connected pivot of the joint
         */
        connectedPivot?: math.vector3;
        /**
         * The main axis of the joint
         */
        mainAxis?: math.vector3;
        /**
         * The connected axis of the joint
         */
        connectedAxis?: math.vector3;
        /**
         * The collision of the joint
         */
        collision?: boolean;
        /**
         * Native Oimo/Cannon/Energy data
         */
        nativeParams?: any;
    }
    /**
     * This is a holder class for the physics joint created by the physics plugin.
     * It holds a set of functions to control the underlying joint.
     */
    class PhysicsJoint {
        type: number;
        jointData: PhysicsJointData;
        private _physicsJoint;
        protected _physicsPlugin: IPhysicsEnginePlugin;
        constructor(type: number, jointData: PhysicsJointData);
        get physicsJoint(): any;
        set physicsJoint(newJoint: any);
        set physicsPlugin(physicsPlugin: IPhysicsEnginePlugin);
        /**
         * Execute a function that is physics-plugin specific.
         * @param {Function} func the function that will be executed.
         *                        It accepts two parameters: the physics world and the physics joint.
         */
        executeNativeFunction(func: (world: any, physicsJoint: any) => void): void;
        /**
         * Distance-Joint type
         */
        static DistanceJoint: number;
        /**
         * Hinge-Joint type
         */
        static HingeJoint: number;
        /**
         * Ball-and-Socket joint type
         */
        static BallAndSocketJoint: number;
        /**
         * Wheel-Joint type
         */
        static WheelJoint: number;
        /**
         * Slider-Joint type
         */
        static SliderJoint: number;
        /**
         * Prismatic-Joint type
         */
        static PrismaticJoint: number;
        /**
         * Universal-Joint type
         */
        static UniversalJoint: number;
        /**
         * Hinge-Joint 2 type
         */
        static Hinge2Joint: number;
        /**
         * Point to Point Joint type.  Similar to a Ball-Joint.  Different in parameters
         */
        static PointToPointJoint: number;
        /**
         * Spring-Joint type
         */
        static SpringJoint: number;
        /**
         * Lock-Joint type
         */
        static LockJoint: number;
    }
    /**
     * A class representing a physics distance joint.
     */
    class DistanceJoint extends PhysicsJoint {
        constructor(jointData: DistanceJointData);
        /**
         * Update the predefined distance.
         */
        updateDistance(maxDistance: number, minDistance?: number): void;
    }
    /**
     * Represents a Motor-Enabled Joint
     */
    class MotorEnabledJoint extends PhysicsJoint implements IMotorEnabledJoint {
        constructor(type: number, jointData: PhysicsJointData);
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         */
        setMotor(force?: number, maxForce?: number): void;
        /**
         * Set the motor's limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         */
        setLimit(upperLimit: number, lowerLimit?: number): void;
    }
    /**
     * This class represents a single hinge physics joint
     */
    class HingeJoint extends MotorEnabledJoint {
        constructor(jointData: PhysicsJointData);
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         */
        setMotor(force?: number, maxForce?: number): void;
        /**
         * Set the motor's limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         */
        setLimit(upperLimit: number, lowerLimit?: number): void;
    }
    /**
     * This class represents a dual hinge physics joint (same as wheel joint)
     */
    class Hinge2Joint extends MotorEnabledJoint {
        constructor(jointData: PhysicsJointData);
        /**
         * Set the motor values.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} force the force to apply
         * @param {number} maxForce max force for this motor.
         * @param {motorIndex} the motor's index, 0 or 1.
         */
        setMotor(force?: number, maxForce?: number, motorIndex?: number): void;
        /**
         * Set the motor limits.
         * Attention, this function is plugin specific. Engines won't react 100% the same.
         * @param {number} upperLimit the upper limit
         * @param {number} lowerLimit lower limit
         * @param {motorIndex} the motor's index, 0 or 1.
         */
        setLimit(upperLimit: number, lowerLimit?: number, motorIndex?: number): void;
    }
    /**
     * Interface for a motor enabled joint
     */
    interface IMotorEnabledJoint {
        physicsJoint: any;
        setMotor(force?: number, maxForce?: number, motorIndex?: number): void;
        setLimit(upperLimit: number, lowerLimit?: number, motorIndex?: number): void;
    }
    /**
     * Joint data for a Distance-Joint
     */
    interface DistanceJointData extends PhysicsJointData {
        maxDistance: number;
    }
    /**
     * Joint data from a spring joint
     */
    interface SpringJointData extends PhysicsJointData {
        length: number;
        stiffness: number;
        damping: number;
    }
}
declare namespace gd3d.framework {
    /**
     * tool of physic
     */
    class physicTool {
        static Ivec3Equal(a: math.Ivec3, b: math.Ivec3): boolean;
        static Ivec2Equal(a: math.Ivec2, b: math.Ivec2): boolean;
        static IQuatEqual(a: math.Iquat, b: math.Iquat): boolean;
        static Ivec3Copy(from: math.Ivec3, to: math.Ivec3): void;
        static Ivec2Copy(from: math.Ivec2, to: math.Ivec2): void;
        static IQuatCopy(from: math.Iquat, to: math.Iquat): void;
        static vec3AsArray(vec3: math.vector3): any[];
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     */
    enum HideFlags {
        None = 0,
        /** Hierarchy 中隐藏 */
        HideInHierarchy = 1,
        /** Inspector 中隐藏 */
        HideInInspector = 2,
        /** 在Editor中不可保存 */
        DontSaveInEditor = 4,
        /** 不可编辑的 */
        NotEditable = 8,
        /** Build时不保存 */
        DontSaveInBuild = 16,
        /** 不卸载 不使用的资源 */
        DontUnloadUnusedAsset = 32,
        /** 不受视锥剔除 */
        DontFrustumCulling = 64,
        /** 不保存 */
        DontSave = 52,
        /** 隐藏并不保存 */
        HideAndDontSave = 61
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 组件接口
     * @version gd3d 1.0
     */
    class nodeComponent {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件实例
         * @version gd3d 1.0
         */
        comp: INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否初始化过
         * @version gd3d 1.0
         */
        init: boolean;
        /**
         * onPlay是否调用过了
         */
        OnPlayed: boolean;
        constructor(comp: INodeComponent, init?: boolean);
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * gameObject类 对应unity中gameObject概念
     * @version gd3d 1.0
     */
    class gameObject {
        static readonly ClassName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取物体所在场景实例
         * @version gd3d 1.0
         */
        getScene(): scene;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象layer (取值范围0~31)
         * @version gd3d 1.0
         */
        layer: number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象字符标签
         * @version gd3d 1.0
         */
        tag: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 隐匿标记
         * @version gd3d 1.0
         */
        hideFlags: HideFlags;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 对象是静态
         * @version gd3d 1.0
         */
        isStatic: boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * gameObject必须依赖transform存在
         * @version gd3d 1.0
         */
        transform: transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 组件列表
         * @version gd3d 1.0
         */
        components: nodeComponent[];
        componentTypes: {
            [key: string]: boolean;
        };
        private componentsInit;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染组件 可为空
         * @version gd3d 1.0
         */
        renderer: IRenderer;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 相机组件 可为空
         * @version gd3d 1.0
         */
        camera: camera;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 灯光组件 可为空
         * @param
         * @version gd3d 1.0
         */
        light: light;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 碰撞盒组件 可为空
         * @version gd3d 1.0
         */
        collider: ICollider;
        private _visible;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取在场景中的可见状态
         * @version gd3d 1.0
         */
        get visibleInScene(): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取自身的可见状态
         * @version gd3d 1.0
         */
        get visible(): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置自身的可见状态
         * @param val
         * @version gd3d 1.0
         */
        set visible(val: boolean);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取对应transform的name
         * @version gd3d 1.0
         */
        getName(): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 初始化 主要是组件的初始化
         * @version gd3d 1.0
         */
        init(bePlay?: boolean): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 主update
         * @param delta
         * @version gd3d 1.0
         */
        update(delta: number): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加组件实例
         * @param comp 组件实例
         * @version gd3d 1.0
         */
        addComponentDirect(comp: INodeComponent): INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据类型获取组件 只是自己身上找到的第一个
         * @param type 组件类型
         * @version gd3d 1.0
         */
        getComponent(type: string): INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取身上所有的组件
         * @version gd3d 1.0
         */
        getComponents(): INodeComponent[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取自己和所有子物体中 所有该类型的组件
         * @param type 组件类型
         * @version gd3d 1.0
         */
        getComponentsInChildren(type: string): INodeComponent[];
        private _getComponentsInChildren;
        /**
        * 获取当前节点下及子节点第一个能找到的组件
        * @param type 组件名称
        */
        getFirstComponentInChildren(type: string): INodeComponent;
        /**
         * 获取节点的第一个组件
         * @param node
         * @param _type
         */
        private getNodeFirstComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据组件类型获取自己这条分支上父物体中该类型的组件 一直上溯到根节点
         * @param type 组件类型
         * @version gd3d 1.0
         */
        getComponentInParent(type: string): INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据组件类型添加一个组件
         * @param type 组件类型
         * @version gd3d 1.0
         */
        addComponent(type: string): INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据组件实例移出组件
         * @param comp 组件实例
         * @version gd3d 1.0
         */
        removeComponent(comp: INodeComponent): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据组件类型移出组件
         * @param type 组件类型
         * @version gd3d 1.0
         */
        removeComponentByTypeName(type: string): INodeComponent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 移出所有组件
         * @version gd3d 1.0
         */
        removeAllComponents(): void;
        private clearOfCompRemove;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放gameObject
         * @version gd3d 1.0
         */
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class renderContext {
        constructor(webgl: WebGLRenderingContext);
        drawtype: string;
        webgl: WebGLRenderingContext;
        viewPortPixel: gd3d.math.rect;
        eyePos: gd3d.math.vector4;
        matrixView: gd3d.math.matrix;
        matrixProject: gd3d.math.matrix;
        matrixModel: gd3d.math.matrix;
        private _lastM_IT;
        private _matrixWorld2Object;
        /** M 矩阵的逆矩阵 */
        get matrixWorld2Object(): math.matrix;
        matrixModelViewProject: gd3d.math.matrix;
        private _matrixModelView;
        get matrixModelView(): math.matrix;
        private _matrixInverseModelView;
        private _lastMV_IT;
        /** MV 矩阵的逆转置矩阵 */
        get matrixInverseModelView(): math.matrix;
        matrixViewProject: gd3d.math.matrix;
        floatTimer: number;
        intLightCount: number;
        vec4LightPos: Float32Array;
        vec4LightDir: Float32Array;
        vec4LightColor: Float32Array;
        floatLightRange: Float32Array;
        floatLightIntensity: Float32Array;
        floatLightSpotAngleCos: Float32Array;
        private _intLightCount;
        private _lightCullingMask;
        private _vec4LightPos;
        private _vec4LightDir;
        private _vec4LightColor;
        private _floatLightRange;
        private _floatLightIntensity;
        private _floatLightSpotAngleCos;
        lightmap: gd3d.framework.texture;
        lightmapUV: number;
        lightmapOffset: gd3d.math.vector4;
        fog: Fog;
        vec4_bones: Float32Array;
        matrix_bones: Float32Array;
        updateCamera(app: application, camera: camera): void;
        updateLights(lights: light[]): void;
        updateOverlay(): void;
        updateModel(model: transform): void;
        updateModelByMatrix(m_matrix: gd3d.math.matrix): void;
        updateModeTrail(): void;
        updateLightMask(layer: number): void;
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 渲染的层级
     * @version gd3d 1.0
     */
    enum RenderLayerEnum {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 不透明
         * @version gd3d 1.0
         */
        Common = 0,
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 半透明
         * @version gd3d 1.0
         */
        Transparent = 1,
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * Overlay层
         * @version gd3d 1.0
         */
        Overlay = 2
    }
    /**
     * @private
     */
    class renderList {
        constructor();
        clear(): void;
        clearBatcher(): void;
        addRenderer(renderer: IRenderer, webgl: WebGLRenderingContext): void;
        addStaticInstanceRenderer(renderer: IRendererGpuIns, webgl: WebGLRenderingContext, isStatic: boolean): void;
        renderLayers: renderLayer[];
    }
    /**
     * @private
     */
    class renderLayer {
        needSort: boolean;
        list: IRenderer[];
        constructor(_sort?: boolean);
        /** gpu instance map*/
        gpuInstanceMap: {
            [sID: string]: math.ReuseArray<IRendererGpuIns>;
        };
        gpuInstanceBatcherMap: {
            [sID: string]: meshGpuInsBatcher;
        };
        addInstance(r: IRendererGpuIns): void;
        addInstanceToBatcher(r: IRendererGpuIns): void;
        private static gpuInsRandererGUID;
        private static gpuInsRandererGUIDMap;
        /** gpuInstancing 唯一ID */
        private static getRandererGUID;
    }
}
declare namespace gd3d.framework {
    let physics: PhysicsEngine;
    let physics2D: physicEngine2D;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 场景是基础的功能，有场景图，相当于Unity的Level
     * @version gd3d 1.0
     */
    class scene {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局的application实例
         * @version gd3d 1.0
         */
        app: application;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 全局的webgl实例
         * @version gd3d 1.0
         */
        webgl: WebGLRenderingContext;
        /**
         * @private
         * @param app
         */
        constructor(app: application);
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景名称
         * @version gd3d 1.0
         */
        name: string;
        /** 自动收集场景中灯光 和 相机 */
        autoCollectlightCamera: boolean;
        private rootNode;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染列表
         * @version gd3d 1.0
         */
        renderList: renderList;
        private assetmgr;
        private _overlay2ds;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 添加ScreenSpaceOverlay
         * @version gd3d 1.0
         */
        addScreenSpaceOverlay(overlay: overlay2D): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 删除ScreenSpaceOverlay
         * @version gd3d 1.0
         */
        removeScreenSpaceOverlay(overlay: any): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 参与渲染的相机
         * @version gd3d 1.0
         */
        renderCameras: camera[];
        private _mainCamera;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取当前主相机
         * @version gd3d 1.0
         */
        get mainCamera(): camera;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置当前主相机
         * @param _camera 相机组件实例
         * @version gd3d 1.0
         */
        set mainCamera(_camera: camera);
        renderContext: renderContext[];
        private renderLights;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * lightmap列表
         * @version gd3d 1.0
         */
        lightmaps: texture[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 雾效
         * @version gd3d 1.0
         */
        fog: Fog;
        onLateUpdate: (delta: number) => any;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景的刷新函数
         * @param delta
         * @version gd3d 1.0
         */
        update(delta: number): void;
        private rendererSceneOverLay;
        private updateSceneOverLay;
        private RealCameraNumber;
        private _renderCamera;
        private sortOverLays;
        private updateScene;
        private objupdateInEditor;
        private objupdate;
        private collectCameraAndLight;
        /**
         * 添加灯光到场景中（autoCollectlightCamera : false 时  有效 ）
         * @param l 灯光组件
         */
        addLight(l: light): void;
        /**
         * 清除场景中添加过的灯光 （autoCollectlightCamera : false 时  有效 ）
        */
        clearLights(): void;
        /**
         * 添加相机到场景中（autoCollectlightCamera : false 时  有效 ）
         * @param l 灯光组件
         */
        addCamera(cam: camera): void;
        /**
         * 清除场景中添加过的相机 （autoCollectlightCamera : false 时 有效 ）
        */
        clearCameras(): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景根节点下添加物体
         * @param node 要添加的transform
         * @version gd3d 1.0
         */
        addChild(node: transform): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 场景根节点下移出物体
         * @param node 要移出的transform
         * @version gd3d 1.0
         */
        removeChild(node: transform): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取children列表
         * @version gd3d 1.0
         */
        getChildren(): transform[];
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取children数量
         * @version gd3d 1.0
         */
        getChildCount(): number;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据索引获取child
         * @param index 索引
         * @version gd3d 1.0
         */
        getChild(index: number): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 根据name获取child
         * @param name
         * @version gd3d 1.0
         */
        getChildByName(name: string): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取场景根节点
         * @version gd3d 1.0
         */
        getRoot(): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取射线路径上的所有物体
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh 否为拾取collider
         * @version gd3d 1.0
         */
        pickAll(ray: ray, outInfos: pickinfo[], isPickMesh?: boolean, root?: transform, layermask?: number): boolean;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取射线拾取到的最近物体
         * @param ray 射线实例
         * @param isPickMesh 是否为拾取mesh 否为拾取collider
         * @version gd3d 1.0
         */
        pick(ray: ray, outInfo: pickinfo, isPickMesh?: boolean, root?: transform, layermask?: number): boolean;
        private doPick;
        private pickMesh;
        private pickCollider;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 启用物理到当前场景
         * @param gravity 定义场景物理世界的重力向量
         * @param plugin 定义场景物理世界引擎插件
         * @version gd3d 1.0
         */
        enablePhysics(gravity: math.vector3, plugin?: IPhysicsEnginePlugin): boolean;
        enable2DPhysics(gravity: math.vector2, physicOption?: IEngine2DOP): boolean;
        /**
         * 刷新 GpuInstancBatcher
         * 被 batcher 条件[isStatic= true , visible = true , needGpuInstancBatcher = true , isGpuInstancing() = true]
         */
        /**
         * 刷新 GpuInstancBatcher
         * 被 batcher 条件[isStatic= true , visible = true , needGpuInstancBatcher = true , isGpuInstancing() = true]
         * @param rootNode 指定刷新节点（默认为 场景根节点）
         */
        refreshGpuInstancBatcher(rootNode?: gd3d.framework.transform): void;
        private fillGpuInsBatcher;
    }
}
declare namespace gd3d.framework {
    class uniformSetter {
        static autoUniformDic: {
            [name: string]: (context: renderContext) => any;
        };
        static initAutouniform(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     */
    class taskstate {
        finish: boolean;
        error: boolean;
        message: string;
        cancel: boolean;
        taskCall: (taskstate: any, state: taskstate) => void;
        taskInterface: ITask;
    }
    /**
     * @private
     */
    interface ITask {
        move(delta: number, laststate: taskstate, state: taskstate): any;
    }
    /**
     * @private
     */
    class taskMgr {
        tasks: taskstate[];
        addTaskCall(task: (laststate: taskstate, state: taskstate) => void): void;
        addTask(task: ITask): void;
        laststate: taskstate;
        move(delta: number): void;
        cancel(): void;
    }
}
declare namespace gd3d.threading {
    class gdPromise<T> {
        private execQueue;
        private catchMethod;
        constructor(executor: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void);
        resolve(value?: T): void;
        reject(reason?: any): void;
        then(thenCall: (value?: T) => void): gdPromise<T>;
        catch(callbcack: (val: any) => void): gdPromise<T>;
    }
}
declare namespace gd3d.threading {
    class thread {
        static workerInstance: Worker;
        private static instance;
        static get Instance(): thread;
        private worker;
        private callID;
        private callMap;
        constructor();
        OnMessage(e: MessageEvent): void;
        Call(name: string, data: any, callback: (result: any) => void): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示轴对称包围盒
     * @version gd3d 1.0
     */
    class aabb {
        /**
        * @public
        * @language zh_CN
        * 最小点
        * @version gd3d 1.0
        * @platform Web,Native
        */
        minimum: gd3d.math.vector3;
        /**
        * @public
        * @language zh_CN
        * 最大点
        * @version gd3d 1.0
        * @platform Web,Native
        */
        maximum: gd3d.math.vector3;
        private srcmin;
        private srcmax;
        private opmin;
        private opmax;
        private _center;
        /**
        * @public
        * @language zh_CN
        * 构建轴对称包围盒
        * @param _minimum 最小点
        * @param _maximum 最大点
        * @version gd3d 1.0
        * @platform Web,Native
        */
        constructor(_minimum: gd3d.math.vector3, _maximum: gd3d.math.vector3);
        /**
        * @public
        * @language zh_CN
        * 刷新轴对称包围盒
        * @param worldmatrix 物体的世界矩阵
        * @version gd3d 1.0
        * @platform Web,Native
        */
        update(worldmatrix: gd3d.math.matrix): void;
        /**
        * @public
        * @language zh_CN
        * 包含一个点
        * @param vec 世界坐标
        * @version gd3d 1.0
        * @platform Web,Native
        */
        addVector3(vec: gd3d.math.vector3): void;
        /**
        * @public
        * @language zh_CN
        * 检查是否包含点
        * @param vec 世界坐标
        * @version gd3d 1.0
        * @platform Web,Native
        */
        containsVector3(vec: gd3d.math.vector3): boolean;
        /**
        * @public
        * @language zh_CN
        * 检查是否与aabb相交
        * @param aabb 轴对称包围盒
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectAABB(aabb: aabb): boolean;
        /**
        * @public
        * @language zh_CN
        * 包含一个aabb
        * @param aabb 轴对称包围盒
        * @version gd3d 1.0
        * @platform Web,Native
        */
        addAABB(aabb: gd3d.framework.aabb): void;
        /**
        * @public
        * @language zh_CN
        * 计算包围盒的中心位置
        * @version gd3d 1.0
        * @platform Web,Native
        */
        get center(): gd3d.math.vector3;
        /**
        * @public
        * @language zh_CN
        * 清空
        * @version gd3d 1.0
        * @platform Web,Native
        */
        clear(): void;
        /**
        * @public
        * @language zh_CN
        * 克隆
        * @version gd3d 1.0
        * @platform Web,Native
        */
        clone(): aabb;
        cloneTo(to: aabb): void;
        /**
        * @public
        * @language zh_CN
        * 获取包围盒顶点数据
        * @param vecs 引用数组
        * @version gd3d 1.0
        * @platform Web,Native
        */
        getVec3(vecs: gd3d.math.vector3[]): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 碰撞检测Tool
     * @version gd3d 1.0
     */
    class collision {
        private static helpv3;
        private static helpv3_1;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * obb 碰 obb
        * @version gd3d 1.0
        */
        static obbVsObb(a: obb, b: obb): boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * sphere 碰 sphere
        * @version gd3d 1.0
        */
        static sphereVsSphere(a: spherestruct, b: spherestruct): boolean;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * obb 碰 sphere
        * @version gd3d 1.0
        */
        static obbVsSphere(a: obb, b: spherestruct): boolean;
        private static helpv2;
        private static helpv2_1;
        private static obb_SphereOverLap;
        private static obbOverLap;
        private static extentsOverlap;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示定向包围盒
     * @version gd3d 1.0
     */
    class obb {
        private static helpv3;
        private static helpv3_1;
        /** xyz 轴 方向  */
        private _directions;
        /** 世界坐标顶半长 */
        private _halfSizeWorld;
        /** 世界坐标顶点数据 */
        private _vectorsWorld;
        /** 世界坐标中心点 */
        private _worldCenter;
        /** 世界坐标矩阵 */
        private _worldMatrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒中心坐标
        * @version gd3d 1.0
        */
        center: math.vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒各轴向半长
        * @version gd3d 1.0
        */
        halfsize: math.vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒世界空间下各个点坐标
        * @version gd3d 1.0
        */
        vectors: math.vector3[];
        private static tag_wCenter;
        private static tag_wVectors;
        private static tag_wHalfSize;
        private static tag_directions;
        private static tags;
        private dirtyMap;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒世界空间下各个点坐标
        * @version gd3d 1.0
        */
        get vectorsWorld(): math.vector3[];
        /**
       * @public
       * @language zh_CN
       * @classdesc
       * 在世界空间的中心点
       * @version gd3d 1.0
       */
        get worldCenter(): math.vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒在世界坐标中各轴向半长
        * @version gd3d 1.0
        */
        get halfSizeWorld(): math.vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * x,y,z 轴方向
        * @version gd3d 1.0
        */
        get directions(): math.vector3[];
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取obb世界矩阵
        * @version gd3d 1.0
         */
        getWorldMatrix(): math.matrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 由最大最小点构建定向包围盒
        * @param minimum 最小点坐标
        * @param maximum 最大点坐标
        * @version gd3d 1.0
        */
        buildByMaxMin(minimum: math.vector3, maximum: math.vector3): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 由中心点和各轴向长度构建定向包围盒
        * @param center 中心点坐标
        * @param size 各轴向长度
        * @version gd3d 1.0
        */
        buildByCenterSize(center: math.vector3, size: math.vector3): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 刷新定向包围盒
        * @param worldmatrix 物体的世界矩阵
        * @version gd3d 1.0
        */
        update(worldmatrix: math.matrix): void;
        /**
         * @public
         * @language zh_CN
         * @param bound 碰撞体
         * @classdesc
         * 碰撞体检测碰撞
         * @version gd3d 1.0
         */
        intersects(bound: any): boolean;
        /**
         * @public
         * @language zh_CN
         * @param axis 指定轴
         * @param out 长度范围
         * @classdesc
         * 计算到指定轴上投影的长度
         * @version gd3d 1.0
         */
        computeExtentsByAxis(axis: math.vector3, out: math.vector2): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 克隆一个obb
        * @version gd3d 1.0
        */
        clone(): obb;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 释放
        * @version gd3d 1.0
        */
        dispose(): void;
    }
}
declare namespace gd3d.framework { /**
     * @public
     * @language zh_CN
     * @classdesc
     * 2d定向包围盒
     * @version gd3d 1.0
     */
    class obb2d {
        private rotate;
        private scale;
        private center;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 中心点偏移量
        * @version gd3d 1.0
        */
        offset: gd3d.math.vector2;
        private halfWidth;
        private halfHeight;
        private directions;
        private _size;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 包围盒大小
        * @version gd3d 1.0
        */
        get size(): gd3d.math.vector2;
        set size(size: gd3d.math.vector2);
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 由最大最小点构建定向包围盒
        * @param center 中心点坐标
        * @param width 包围盒宽度
        * @param height 包围盒高度
        * @version gd3d 1.0
        */
        buildByCenterSize(center: gd3d.math.vector2, width: number, height: number): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 刷新定向包围盒
        * @param canvasWorldMtx Canvas世界矩阵
        * @version gd3d 1.0
        */
        update(canvasWorldMtx: gd3d.math.matrix3x2): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * obb2d的碰撞检测
        * @param _obb 待检测obb2d
        * @version gd3d 1.0
        */
        intersects(_obb: obb2d): boolean;
        private computeBoxExtents;
        private axisOverlap;
        private extentsOverlap;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 克隆一个obb
        * @version gd3d 1.0
        */
        clone(): obb2d;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 释放
        * @version gd3d 1.0
        */
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    /**
    * @private
    * @language zh_CN
    * @classdesc
    * 拾取到的信息
    * @version gd3d 1.0
    */
    class pickinfo {
        normal: math.vector3;
        pickedtran: transform;
        distance: number;
        hitposition: math.vector3;
        bu: number;
        bv: number;
        faceId: number;
        subMeshId: number;
        constructor(_bu?: number, _bv?: number, _distance?: number);
        init(): void;
        cloneFrom(from: pickinfo): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 四叉树
     * @version gd3d 1.0
     */
    class quadTree {
        private rootNode;
        private readonly MAX_OBJECTS;
        private readonly MAX_LEVELS;
        /**
         * @public
         * @language zh_CN
         * 四叉树
         * @param bounds 全局的矩形范围
         * @param maxObjNum 每个节点(象限) 能包含的最大物体数量
         * @param maxLevel 树的最大深度
         * @version gd3d 1.0
         */
        constructor(bounds: math.rect, maxObjNum?: number, maxLevel?: number);
        /**
        * @public
        * @language zh_CN
        * 插入节点
        * @param rect 矩形区域
        * @version gd3d 1.0
        */
        insert(rect: math.rect): void;
        private cacheArr;
        /**
         * @public
         * @language zh_CN
         * 检索结果
         * @param bounds 检测矩形
         * @param outRects 返回结果矩形数组
         * @version gd3d 1.0
         */
        retrieve(bounds: math.rect, outRects: math.rect[]): void;
        /**
        * @public
        * @language zh_CN
        * 清理所有节点
        * @version gd3d 1.0
        */
        clear(): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 射线
     * @version gd3d 1.0
     */
    class ray {
        origin: math.vector3;
        direction: math.vector3;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建射线
        * @param _origin 射线起点
        * @param _dir 射线方向
        * @version gd3d 1.0
        * @platform Web,Native
        */
        constructor(_origin: gd3d.math.vector3, _dir: gd3d.math.vector3);
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 设置射线的属性
        * @param _origin 射线起点
        * @param _dir 射线方向
        * @version gd3d 1.0
        * @platform Web,Native
        */
        set(_origin: gd3d.math.vector3, _dir: gd3d.math.vector3): void;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与aabb碰撞相交检测
        * @param _aabb 待检测aabb
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectAABB(_aabb: aabb): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与transform表示的plane碰撞相交检测，主要用于2d检测
        * @param tran transform
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectPlaneTransform(tran: transform, outInfo: pickinfo): boolean;
        intersectPlane(planePoint: gd3d.math.vector3, planeNormal: gd3d.math.vector3, outHitPoint: gd3d.math.vector3): boolean;
        private static tempMData;
        private static tempVecs;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与碰撞盒相交检测
        * @param tran 待检测带碰撞盒的transform
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectCollider(tran: transform, outInfo: pickinfo): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与最大最小点表示的box相交检测
        * @param minimum
        * @param maximum
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectBoxMinMax(minimum: gd3d.math.vector3, maximum: gd3d.math.vector3): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与球相交检测
        * @param center 球圆心坐标
        * @param radius 球半径
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectsSphere(center: gd3d.math.vector3, radius: number): boolean;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与三角形相交检测
        * @param vertex0
        * @param vertex1
        * @param vertex2
        * @param outInfo
        * @version gd3d 1.0
        * @platform Web,Native
        */
        intersectsTriangle(vertex0: gd3d.math.vector3, vertex1: gd3d.math.vector3, vertex2: gd3d.math.vector3, outInfo: pickinfo): boolean;
    }
}
declare namespace gd3d.framework {
    /**
     * tween 工具
     */
    class tweenUtil {
        /**
         * 获取缓动计算后的进度值
         * @param ease_type 缓动类型
         * @param linear_progress   当前进度值(范围: 0 - 1)
         */
        static GetEaseProgress(ease_type: tweenMethod, linear_progress: number): number;
        /**
         * Easing equation function for a simple linear tweening, with no easing.
         * @param t Current time in seconds.
         * @param b Starting value.
         * @param c Final value.
         * @param d Duration of
         */
        static Linear(t: number, b: number, c: number, d: number): number;
        /**
        Easing equation function for an exponential (2^t) easing out:
        decelerating from zero velocity.
         */
        static ExpoEaseOut(t: number, b: number, c: number, d: number): number;
        /**
        Easing equation function for an exponential (2^t) easing in:
        accelerating from zero velocity.
         */
        static ExpoEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an exponential (2^t) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static ExpoEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an exponential (2^t) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static ExpoEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a circular (sqrt(1-t^2)) easing out:
         decelerating from zero velocity.
        */
        static CircEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a circular (sqrt(1-t^2)) easing in:
         accelerating from zero velocity.
        */
        static CircEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a circular (sqrt(1-t^2)) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static CircEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a circular (sqrt(1-t^2)) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static CircEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quadratic (t^2) easing out:
         decelerating from zero velocity.
        */
        static QuadEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quadratic (t^2) easing in:
         accelerating from zero velocity.
        */
        static QuadEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quadratic (t^2) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static QuadEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quadratic (t^2) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static QuadEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a sinusoidal (sin(t)) easing out:
         decelerating from zero velocity.
        */
        static SineEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a sinusoidal (sin(t)) easing in:
         accelerating from zero velocity.
        */
        static SineEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a sinusoidal (sin(t)) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static SineEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a sinusoidal (sin(t)) easing in/out:
         deceleration until halfway, then acceleration.
        */
        static SineEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a cubic (t^3) easing out:
         decelerating from zero velocity.
        */
        static CubicEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a cubic (t^3) easing in:
         accelerating from zero velocity.
        */
        static CubicEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a cubic (t^3) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static CubicEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a cubic (t^3) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static CubicEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quartic (t^4) easing out:
         decelerating from zero velocity.
        */
        static QuartEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quartic (t^4) easing in:
         accelerating from zero velocity.
        */
        static QuartEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quartic (t^4) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static QuartEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quartic (t^4) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static QuartEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quintic (t^5) easing out:
         decelerating from zero velocity.
        */
        static QuintEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quintic (t^5) easing in:
         accelerating from zero velocity.
        */
        static QuintEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quintic (t^5) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static QuintEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a quintic (t^5) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static QuintEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an elastic (exponentially decaying sine wave) easing out:
         decelerating from zero velocity.
        */
        static ElasticEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an elastic (exponentially decaying sine wave) easing in:
         accelerating from zero velocity.
        */
        static ElasticEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an elastic (exponentially decaying sine wave) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static ElasticEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for an elastic (exponentially decaying sine wave) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static ElasticEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out:
         decelerating from zero velocity.
        */
        static BounceEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in:
         accelerating from zero velocity.
        */
        static BounceEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a bounce (exponentially decaying parabolic bounce) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static BounceEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a bounce (exponentially decaying parabolic bounce) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static BounceEaseOutIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out:
         decelerating from zero velocity.
        */
        static BackEaseOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in:
         accelerating from zero velocity.
        */
        static BackEaseIn(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing in/out:
         acceleration until halfway, then deceleration.
        */
        static BackEaseInOut(t: number, b: number, c: number, d: number): number;
        /**
         Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2) easing out/in:
         deceleration until halfway, then acceleration.
        */
        static BackEaseOutIn(t: number, b: number, c: number, d: number): number;
    }
    /**
     * tween 方法
     */
    enum tweenMethod {
        /** 正常线性*/
        Linear = 0,
        /** 指数曲线*/
        ExpoEaseOut = 1,
        ExpoEaseIn = 2,
        ExpoEaseInOut = 3,
        ExpoEaseOutIn = 4,
        /** 圆形曲线*/
        CircEaseOut = 5,
        CircEaseIn = 6,
        CircEaseInOut = 7,
        CircEaseOutIn = 8,
        /** 二次方曲线*/
        QuadEaseOut = 9,
        QuadEaseIn = 10,
        QuadEaseInOut = 11,
        QuadEaseOutIn = 12,
        /** 正弦曲线*/
        SineEaseOut = 13,
        SineEaseIn = 14,
        SineEaseInOut = 15,
        SineEaseOutIn = 16,
        /** 三次方曲线*/
        CubicEaseOut = 17,
        CubicEaseIn = 18,
        CubicEaseInOut = 19,
        CubicEaseOutIn = 20,
        /** 四次方曲线*/
        QuartEaseOut = 21,
        QuartEaseIn = 22,
        QuartEaseInOut = 23,
        QuartEaseOutIn = 24,
        /** 五次方曲线*/
        QuintEaseOut = 25,
        QuintEaseIn = 26,
        QuintEaseInOut = 27,
        QuintEaseOutIn = 28,
        /** 橡皮筋弹性曲线*/
        ElasticEaseOut = 29,
        ElasticEaseIn = 30,
        ElasticEaseInOut = 31,
        ElasticEaseOutIn = 32,
        /** 乒乓球弹性曲线*/
        BounceEaseOut = 33,
        BounceEaseIn = 34,
        BounceEaseInOut = 35,
        BounceEaseOutIn = 36,
        /** 回退曲线*/
        BackEaseOut = 37,
        BackEaseIn = 38,
        BackEaseInOut = 39,
        BackEaseOutIn = 40
    }
}
declare namespace gd3d.framework {
    /**
     * 数组工具
     */
    class ArrayUtil {
        /**
         * 使用b元素替换数组中第一个a元素。
         *
         * @param arr 被操作数组
         * @param a 被替换的元素
         * @param b 用于替换的元素
         * @param isAdd 当数组中没有找到a元素时，是否需要把b元素添加到数组尾部。默认值为true。
         */
        static replace<T>(arr: T[], a: T, b: T, isAdd?: boolean): T[];
        /**
         * 连接一个或多个数组到自身
         *
         * @param self 被操作数组
         * @param items 要添加到数组末尾的其他项。
         * @returns 返回自身
         */
        static concatToSelf<T>(self: T[], ...items: (T | ConcatArray<T>)[]): T[];
        /**
         * 使数组变得唯一，不存在两个相等的元素
         *
         * @param arr 被操作数组
         * @param compare 比较函数
         */
        static unique<T>(arr: T[], compare?: (a: T, b: T) => boolean): T[];
    }
}
declare namespace gd3d.framework {
    /**
     * 类工具
     *
     * @author feng3d
     */
    class ClassUtils {
        /**
         * 返回对象的完全限定类名。
         * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
         * （如number)和类对象
         * @returns 包含完全限定类名称的字符串。
         */
        static getQualifiedClassName(value: any): string;
        /**
         * 返回 name 参数指定的类的类对象引用。
         * @param name 类的名称。
         */
        static getDefinitionByName(name: string, readCache?: boolean): any;
        private static defaultInstMap;
        /**
         * 获取默认实例
         *
         * @param name 类名称
         */
        static getDefaultInstanceByName(name: string): any;
        /**
         * 获取实例
         *
         * @param name 类名称
         */
        static getInstanceByName(name: string): any;
        /**
         * 新增反射对象所在的命名空间，使得getQualifiedClassName能够得到正确的结果
         */
        static addClassNameSpace(namespace: string): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * layer mask
     * @version gd3d 1.0
     */
    enum CullingMask {
        nothing = 0,
        default = 1,
        transparentFx = 2,
        IgnoreRaycast = 4,
        editor = 8,
        water = 16,
        ui = 32,
        preview = 64,
        builtin_0 = 1,
        builtin_1 = 2,
        builtin_2 = 4,
        builtin_3 = 8,
        builtin_4 = 16,
        builtin_5 = 32,
        builtin_6 = 64,
        builtin_7 = 128,
        modelbeforeui = 256,
        user_8 = 256,
        user_9 = 512,
        user_10 = 1024,
        user_11 = 2048,
        user_12 = 4096,
        user_13 = 8192,
        user_14 = 16384,
        user_15 = 32768,
        user_16 = 65536,
        user_17 = 131072,
        user_18 = 262144,
        user_19 = 524288,
        user_20 = 1048576,
        user_21 = 2097152,
        user_22 = 4194304,
        user_23 = 8388608,
        user_24 = 16777216,
        user_25 = 33554432,
        user_26 = 67108864,
        user_27 = 134217728,
        user_28 = 268435456,
        user_29 = 536870912,
        user_30 = 1073741824,
        user_31 = 2147483648,
        everything = 4294967295
    }
    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 剔除mask工具类
     * @version gd3d 1.0
     */
    class cullingmaskutil {
        static maskTolayer(mask: number): number;
        static layerToMask(layer: number): number;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 给编辑器用的工具类，用eval方式获取enum对象
     * @version gd3d 1.0
     */
    class EnumUtil {
        static getEnumObjByType(enumType: string): any;
    }
}
interface WebGLRenderingContext {
    /**
     * 扩展
     */
    extensions: gd3d.framework.GLExtension;
    /**
     * The WebGL2RenderingContext.vertexAttribDivisor() method of the WebGL 2 API modifies the rate at which generic vertex attributes advance when rendering multiple instances of primitives with gl.drawArraysInstanced() and gl.drawElementsInstanced().
     *
     * WebGL2 API的WebGL2RenderingContext.vertexAttribDivisor()方法在使用gl. drawarraysinstated()和gl. drawelementsinstated()呈现多个原语实例时，修改了通用顶点属性的提升速度。
     *
     * @param index A GLuint specifying the index of the generic vertex attributes. 指定一般顶点属性的索引的GLuint。
     * @param divisor 指定将在通用属性的更新之间传递的实例数的GLuint。
     *
     * @see WebGL2RenderingContextBase.vertexAttribDivisor
     * @see ANGLE_instanced_arrays.vertexAttribDivisorANGLE
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext/vertexAttribDivisor
     */
    vertexAttribDivisor(index: GLuint, divisor: GLuint): void;
    /**
     * The WebGL2RenderingContext.drawElementsInstanced() method of the WebGL 2 API renders primitives from array data like the gl.drawElements() method. In addition, it can execute multiple instances of a set of elements.
     *
     * WebGL2 API的webgl2renderingcontext . drawelementsinstance()方法呈现来自数组数据的原语，如gl.drawElements()方法。此外，它可以执行一组元素的多个实例。
     *
     * @param mode A GLenum specifying the type primitive to render. 指定要呈现的类型基元的GLenum。
     * @param count A GLsizei specifying the number of elements to be rendered. 指定要呈现的元素数量的GLsizei。
     * @param type A GLenum specifying the type of the values in the element array buffer. 指定元素数组缓冲区中值的类型的GLenum。
     * @param offset A GLintptr specifying an offset in the element array buffer. Must be a valid multiple of the size of the given type. 指定元素数组缓冲区中的偏移量的GLintptr。必须是给定类型大小的有效倍数。
     * @param instanceCount A GLsizei specifying the number of instances of the set of elements to execute. 指定要执行的元素集的实例数的GLsizei。
     *
     * @see WebGL2RenderingContextBase.drawElementsInstanced
     */
    drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void;
    /**
     * The WebGL2RenderingContext.drawArraysInstanced() method of the WebGL 2 API renders primitives from array data like the gl.drawArrays() method. In addition, it can execute multiple instances of the range of elements.
     *
     * WebGL2 API的webgl2renderingcontext . drawarraysinstance()方法呈现来自数组数据的原语，比如gl.drawArrays()方法。此外，它可以执行元素范围的多个实例。
     *
     * @param mode A GLenum specifying the type primitive to render. 指定要呈现的类型基元的GLenum。
     * @param first A GLint specifying the starting index in the array of vector points. 在向量点数组中指定起始索引的位置。
     * @param count A GLsizei specifying the number of indices to be rendered. 指定要呈现的索引数量的GLsizei。
     * @param instanceCount A GLsizei specifying the number of instances of the range of elements to execute. 指定要执行的元素集的实例数的GLsizei。
     */
    drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void;
}
declare namespace gd3d.framework {
    /**
     * GL扩展
     *
     * @author feng3d
     */
    class GLExtension {
        ANGLE_instanced_arrays: ANGLE_instanced_arrays;
        EXT_blend_minmax: EXT_blend_minmax;
        EXT_color_buffer_half_float: any;
        EXT_frag_depth: EXT_frag_depth;
        EXT_sRGB: EXT_sRGB;
        EXT_shader_texture_lod: EXT_shader_texture_lod;
        EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic;
        OES_element_index_uint: OES_element_index_uint;
        OES_standard_derivatives: OES_standard_derivatives;
        OES_texture_float: OES_texture_float;
        OES_texture_float_linear: OES_texture_float_linear;
        OES_texture_half_float: OES_texture_half_float;
        OES_texture_half_float_linear: OES_texture_half_float_linear;
        OES_vertex_array_object: OES_vertex_array_object;
        WEBGL_color_buffer_float: WEBGL_color_buffer_float;
        WEBGL_compressed_texture_atc: any;
        WEBGL_compressed_texture_etc1: any;
        WEBGL_compressed_texture_pvrtc: any;
        WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc;
        WEBGL_debug_renderer_info: WEBGL_debug_renderer_info;
        WEBGL_debug_shaders: WEBGL_debug_shaders;
        WEBGL_depth_texture: WEBGL_depth_texture;
        WEBGL_draw_buffers: WEBGL_draw_buffers;
        WEBGL_lose_context: any;
        constructor(gl: WebGLRenderingContext);
        private initExtensions;
        /**
         * 缓存GL查询
         * @param gl GL实例
         */
        private cacheGLQuery;
        private wrap;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * Number类型的工具类
     * @version gd3d 1.0
     */
    class NumberUtil {
        /**
         * @public
         * @language zh_CN
         * 获取键值A对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_A: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值D对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_D: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值E对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_E: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值Q对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_Q: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值R对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_R: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值S对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_S: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值W对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_W: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值a对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_a: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值d对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_d: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值e对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_e: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值q对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_q: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值r对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_r: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值s对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_s: number;
        /**
         * @public
         * @language zh_CN
         * 获取键值w对应的codevalue
         * @version gd3d 1.0
         */
        static KEY_w: number;
    }
}
declare namespace gd3d.framework {
    /**
     * Object 工具
     */
    class ObjectUtil {
        /**
         * 判断是否为基础类型 undefined,null,boolean,string,number
         */
        static isBaseType(object: any): boolean;
        /**
         * 判断是否为Object对象，构造函数是否为Object， 检测 object.constructor == Object
         *
         * @param obj 用于判断的对象
         */
        static isObject(obj: any): boolean;
    }
}
declare namespace gd3d.framework {
    /**
     * @private
     * @language zh_CN
     * @classdesc
     * 正则表达式的工具类，提供一些引擎用到的正则表达式
     * @version gd3d 1.0
     */
    class RegexpUtil {
        static textureRegexp: RegExp;
        static vectorRegexp: RegExp;
        static floatRegexp: RegExp;
        static rangeRegexp: RegExp;
        static vector4Regexp: RegExp;
        static vector3FloatOrRangeRegexp: RegExp;
    }
}
declare namespace gd3d.framework {
    /**
     * 默认序列化工具
     */
    var serialization: Serialization;
    /**
     * 序列化属性函数项
     */
    interface PropertyHandler {
        /**
         * 序列化属性函数项
         *
         * @param target 序列化后的对象，存放序列化后属性值的对象。
         * @param source 被序列化的对象，提供序列化前属性值的对象。
         * @param property 序列化属性名称
         * @param handlers 序列化属性函数列表
         * @param serialization 序列化工具自身
         *
         * @returns 返回true时结束该属性后续处理。
         */
        (target: any, source: any, property: string, handlers: PropertyHandler[], serialization: Serialization): boolean;
    }
    /**
     * 序列化属性函数项
     */
    interface DifferentPropertyHandler {
        /**
         * 序列化属性函数项
         *
         * @param target 序列化后的对象，存放序列化后属性值的对象。
         * @param source 被序列化的对象，提供序列化前属性值的对象。
         * @param property 序列化属性名称
         * @param handlers 序列化属性函数列表
         * @param serialization 序列化工具自身
         *
         * @returns 返回true时结束该属性后续处理。
         */
        (target: any, source: any, property: string, different: Object, handlers: DifferentPropertyHandler[], serialization: Serialization): boolean;
    }
    /**
     * 序列化
     *
     * @author feng3d
     */
    class Serialization {
        /**
         * 序列化函数列表
         */
        serializeHandlers: {
            priority: number;
            handler: PropertyHandler;
        }[];
        /**
         * 反序列化函数列表
         */
        deserializeHandlers: {
            priority: number;
            handler: PropertyHandler;
        }[];
        /**
         * 比较差异函数列表
         */
        differentHandlers: {
            priority: number;
            handler: DifferentPropertyHandler;
        }[];
        /**
         * 设置函数列表
         */
        setValueHandlers: {
            priority: number;
            handler: PropertyHandler;
        }[];
        /**
         * 序列化对象
         *
         * 过程中使用 different与默认值作比较减少结果中的数据。
         *
         * @param target 被序列化的对象
         *
         * @returns 序列化后简单数据对象（由Object与Array组合可 JSON.stringify 的简单结构）
         */
        serialize<T>(target: T): gPartial<T>;
        /**
         * 反序列化对象为基础对象数据（由Object与Array组合）
         *
         * @param object 换为Json的对象
         * @returns 反序列化后的数据
         */
        deserialize<T>(object: gPartial<T>): T;
        /**
         * 比较两个对象的不同，提取出不同的数据(可能会经过反序列化处理)
         *
         * @param target 用于检测不同的数据
         * @param source   模板（默认）数据
         * @param different 比较得出的不同（简单结构）数据
         *
         * @returns 比较得出的不同数据（由Object与Array组合可 JSON.stringify 的简单结构）
         */
        different<T>(target: T, source: T): gPartial<T>;
        /**
         * 从数据对象中提取数据给目标对象赋值（可能会经过序列化处理）
         *
         * @param target 目标对象
         * @param source 数据对象 可由Object与Array以及自定义类型组合
         */
        setValue<T>(target: T, source: gPartial<T>): T;
        /**
         * 克隆
         * @param target 被克隆对象
         */
        clone<T>(target: T): T;
    }
    var CLASS_KEY: string;
    interface SerializationTempInfo {
        loadingNum?: number;
        onLoaded?: () => void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 正则表达式的工具类，提供一些引擎用到的正则表达式
     * @version gd3d 1.0
     */
    class StringUtil {
        /** 启用标记 */
        static readonly ENABLED = "enabled";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 内建TAG “Untagged”
         * @version gd3d 1.0
         */
        static readonly builtinTag_Untagged = "Untagged";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 内建TAG “Player”
         * @version gd3d 1.0
         */
        static readonly builtinTag_Player = "Player";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 内建TAG “EditorOnly”
         * @version gd3d 1.0
         */
        static readonly builtinTag_EditorOnly = "EditorOnly";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 内建TAG “MainCamera”
         * @version gd3d 1.0
         */
        static readonly builtinTag_MainCamera = "MainCamera";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取camera组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_CAMERA = "camera";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取boxcollider组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_BOXCOLLIDER = "boxcollider";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取light组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_LIGHT = "light";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取meshFilter组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_MESHFILTER = "meshFilter";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取meshRenderer组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_MESHRENDER = "meshRenderer";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取effectSystem组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_EFFECTSYSTEM = "effectSystem";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取label组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_LABEL = "label";
        static readonly COMPONENT_uirect = "uirect";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取image2D组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_IMAGE = "image2D";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取rawImage2D组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_RAWIMAGE = "rawImage2D";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取button组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_BUTTON = "button";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取skinnedMeshRenderer组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_SKINMESHRENDER = "skinnedMeshRenderer";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取AudioPlayer组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_AUDIOPLAYER = "AudioPlayer";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取cameraController组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_CAMERACONTROLLER = "cameraController";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取canvasRenderer组件的名字
         * @version gd3d 1.0
         */
        static readonly COMPONENT_CANVASRENDER = "canvasRenderer";
        /**
         * @private
         */
        static readonly UIStyle_RangeFloat = "rangeFloat";
        /**
         * @private
         */
        static readonly UIStyle_Enum = "enum";
        /**
         * @private
         */
        static readonly RESOURCES_MESH_CUBE = "cube";
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 将一个字符串中的所有指定字符替换为指定字符
         * @param srcStr 要处理的字符串
         * @param fromStr 原字符串中的指定字符串
         * @param toStr 将被替换为的字符串
         * @version gd3d 1.0
         */
        static replaceAll(srcStr: string, fromStr: string, toStr: string): string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 剔除掉字符串中所有的空格
         * @param str 要处理的字符串
         * @version gd3d 1.0
         */
        static trimAll(str: string): string;
        /**
         * @private
         * @language zh_CN
         * @classdesc
         * 将一个字符串中的第一个字符转为小写
         * @param str 要处理的字符串
         * @version gd3d 1.0
         */
        static firstCharToLowerCase(str: string): string;
        static isNullOrEmptyObject(obj: any): boolean;
    }
}
declare namespace gd3d.framework {
    class textureutil {
        static loadUtil(path: string): void;
    }
}
declare namespace gd3d.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 原生3d模型类型
     * @version gd3d 1.0
     */
    enum PrimitiveType {
        Sphere = 0,
        Capsule = 1,
        Cylinder = 2,
        Cube = 3,
        Plane = 4,
        Quad = 5,
        Pyramid = 6
    }
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 原生2d类型
     * @version gd3d 1.0
     */
    enum Primitive2DType {
        RawImage2D = 0,
        Image2D = 1,
        Label = 2,
        Button = 3
    }
    /**
     * 判断 函数对象代码实现内容是否是空的
     * @param fun
     */
    function functionIsEmpty(fun: Function): boolean;
    /**
     * 获取实例对象的类名字符串
     * @param obj 对象实例
     */
    function getClassName(obj: Object): any;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * Transform工具类
     * @version gd3d 1.0
     */
    class TransformUtil {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 创建默认的3d对象
         * @param type 原生3d对象类型
         * @param app application的实例
         * @version gd3d 1.0
         */
        static CreatePrimitive(type: PrimitiveType, app: application): transform;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 创建默认的2d控件
         * @param type 2d控件类型
         * @param app application的实例
         * @version gd3d 1.0
         */
        static Create2DPrimitive(type: Primitive2DType, app: application): transform2D;
        private static create2D_rawImage;
        private static create2D_image2D;
        private static create2D_label;
        private static create2D_button;
    }
}
declare namespace gd3d.framework {
    /**
     * 让T中以及所有属性中的所有属性都是可选的
     */
    type gPartial<T> = {
        [P in keyof T]?: gPartial<T[P]>;
    };
    type Lazy<T> = T | (() => T);
    type LazyObject<T> = {
        [P in keyof T]: Lazy<T[P]>;
    };
    var lazy: {
        getvalue: <T>(lazyItem: Lazy<T>) => T;
    };
    /**
     * 可销毁对象
     */
    interface IDisposable {
        /**
         * 是否已销毁
         */
        readonly disposed: boolean;
        /**
         * 销毁
         */
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class WebGLDebugUtils {
        /**
     * Wrapped logging function.
     * @param {string} msg Message to log.
     */
        private log;
        /**
         * Which arguements are enums.
         * @type {!Object.<number, string>}
         */
        static readonly glValidEnumContexts: {
            enable: {
                0: boolean;
            };
            disable: {
                0: boolean;
            };
            getParameter: {
                0: boolean;
            };
            drawArrays: {
                0: boolean;
            };
            drawElements: {
                0: boolean;
                2: boolean;
            };
            createShader: {
                0: boolean;
            };
            getShaderParameter: {
                1: boolean;
            };
            getProgramParameter: {
                1: boolean;
            };
            getVertexAttrib: {
                1: boolean;
            };
            vertexAttribPointer: {
                2: boolean;
            };
            bindTexture: {
                0: boolean;
            };
            activeTexture: {
                0: boolean;
            };
            getTexParameter: {
                0: boolean;
                1: boolean;
            };
            texParameterf: {
                0: boolean;
                1: boolean;
            };
            texParameteri: {
                0: boolean;
                1: boolean;
                2: boolean;
            };
            texImage2D: {
                0: boolean;
                2: boolean;
                6: boolean;
                7: boolean;
            };
            texSubImage2D: {
                0: boolean;
                6: boolean;
                7: boolean;
            };
            copyTexImage2D: {
                0: boolean;
                2: boolean;
            };
            copyTexSubImage2D: {
                0: boolean;
            };
            generateMipmap: {
                0: boolean;
            };
            bindBuffer: {
                0: boolean;
            };
            bufferData: {
                0: boolean;
                2: boolean;
            };
            bufferSubData: {
                0: boolean;
            };
            getBufferParameter: {
                0: boolean;
                1: boolean;
            };
            pixelStorei: {
                0: boolean;
                1: boolean;
            };
            readPixels: {
                4: boolean;
                5: boolean;
            };
            bindRenderbuffer: {
                0: boolean;
            };
            bindFramebuffer: {
                0: boolean;
            };
            checkFramebufferStatus: {
                0: boolean;
            };
            framebufferRenderbuffer: {
                0: boolean;
                1: boolean;
                2: boolean;
            };
            framebufferTexture2D: {
                0: boolean;
                1: boolean;
                2: boolean;
            };
            getFramebufferAttachmentParameter: {
                0: boolean;
                1: boolean;
                2: boolean;
            };
            getRenderbufferParameter: {
                0: boolean;
                1: boolean;
            };
            renderbufferStorage: {
                0: boolean;
                1: boolean;
            };
            clear: {
                0: boolean;
            };
            depthFunc: {
                0: boolean;
            };
            blendFunc: {
                0: boolean;
                1: boolean;
            };
            blendFuncSeparate: {
                0: boolean;
                1: boolean;
                2: boolean;
                3: boolean;
            };
            blendEquation: {
                0: boolean;
            };
            blendEquationSeparate: {
                0: boolean;
                1: boolean;
            };
            stencilFunc: {
                0: boolean;
            };
            stencilFuncSeparate: {
                0: boolean;
                1: boolean;
            };
            stencilMaskSeparate: {
                0: boolean;
            };
            stencilOp: {
                0: boolean;
                1: boolean;
                2: boolean;
            };
            stencilOpSeparate: {
                0: boolean;
                1: boolean;
                2: boolean;
                3: boolean;
            };
            cullFace: {
                0: boolean;
            };
            frontFace: {
                0: boolean;
            };
        };
        /**
         * Map of numbers to names.
         * @type {Object}
         */
        private glEnums;
        /**
         * Initializes this module. Safe to call more than once.
         * @param {!WebGLRenderingContext} ctx A WebGL context. If
         *    you have more than one context it doesn't matter which one
         *    you pass in, it is only used to pull out constants.
         */
        private init;
        /**
         * Checks the utils have been initialized.
         */
        private checkInit;
        /**
         * Returns true or false if value matches any WebGL enum
         * @param {*} value Value to check if it might be an enum.
         * @return {boolean} True if value matches one of the WebGL defined enums
         */
        private mightBeEnum;
        /**
         * Gets an string version of an WebGL enum.
         *
         * Example:
         *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
         *
         * @param {number} value Value to return an enum for
         * @return {string} The string version of the enum.
         */
        private glEnumToString;
        /**
         * Returns the string version of a WebGL argument.
         * Attempts to convert enum arguments to strings.
         * @param {string} functionName the name of the WebGL function.
         * @param {number} argumentIndx the index of the argument.
         * @param {*} value The value of the argument.
         * @return {string} The value as a string.
         */
        private glFunctionArgToString;
        /**
         * Given a WebGL context returns a wrapped context that calls
         * gl.getError after every command and calls a function if the
         * result is not gl.NO_ERROR.
         *
         * @param {!WebGLRenderingContext} ctx The webgl context to
         *        wrap.
         * @param {!function(err, funcName, args): void} opt_onErrorFunc
         *        The function to call when gl.getError returns an
         *        error. If not specified the default function calls
         *        console.log with a message.
         */
        makeDebugContext(ctx: WebGLRenderingContext, opt_onErrorFunc?: (err: any, funcName: any, args: any) => void): WebGLRenderingContext;
        private resetToInitialState;
        private makeLostContextSimulatingContext;
    }
}
declare namespace gd3d.framework {
    class WebGLUtils {
        /**
     * Creates the HTLM for a failure message
     * @param {string} canvasContainerId id of container of th
     *        canvas.
     * @return {string} The html.
     */
        private makeFailHTML;
        /**
       * Mesasge for getting a webgl browser
       * @type {string}
       */
        private GET_A_WEBGL_BROWSER;
        /**
        * Mesasge for need better hardware
        * @type {string}
        */
        private OTHER_PROBLEM;
        /**
         * Creates a webgl context. If creation fails it will
         * change the contents of the container of the <canvas>
         * tag to an error message with the correct links for WebGL.
         * @param {Element} canvas. The canvas element to create a
         *     context from.
         * @param {WebGLContextCreationAttirbutes} opt_attribs Any
         *     creation attributes you want to pass in.
         * @param {function:(msg)} opt_onError An function to call
         *     if there is an error during creation.
         * @return {WebGLRenderingContext} The created context.
         */
        setupWebGL(canvas: Element, opt_attribs?: WebGLContextAttributes, opt_onError?: (msg: string) => void): any;
        /**
         * Creates a webgl context.
         * @param {!Canvas} canvas The canvas tag to get context
         *     from. If one is not passed in one will be created.
         * @return {!WebGLContext} The created context.
         */
        create3DContext(canvas: any, opt_attribs: any): any;
        constructor();
    }
}
declare namespace gd3d.framework {
    /**
     * 动画曲线
     *
     * 基于时间轴的连续三阶Bézier曲线
     *
     * @author feng3d
     */
    class AnimationCurve1 {
        __class__: "gd3d.framework.AnimationCurve1";
        /**
         * 最大tan值，超出该值后将会变成分段
         */
        maxtan: number;
        /**
         * The behaviour of the animation before the first keyframe.
         *
         * 在第一个关键帧之前的动画行为。
         */
        preWrapMode: AnimationCurveWrapMode;
        /**
         * The behaviour of the animation after the last keyframe.
         *
         * 动画在最后一个关键帧之后的行为。
         */
        postWrapMode: AnimationCurveWrapMode;
        /**
         * All keys defined in the animation curve.
         *
         * 动画曲线上所有关键字定义。
         *
         * 注： 该值已对时间排序，否则赋值前请使用 sort((a, b) => a.time - b.time) 进行排序
         */
        keys: AnimationCurveKeyframe[];
        /**
         * 关键点数量
         */
        get numKeys(): number;
        /**
         * 添加关键点
         *
         * 添加关键点后将会执行按t进行排序
         *
         * @param key 关键点
         */
        addKey(key: AnimationCurveKeyframe): void;
        /**
         * 关键点排序
         *
         * 当移动关键点或者新增关键点时需要再次排序
         */
        sort(): void;
        /**
         * 删除关键点
         * @param key 关键点
         */
        deleteKey(key: AnimationCurveKeyframe): void;
        /**
         * 获取关键点
         * @param index 索引
         */
        getKey(index: number): AnimationCurveKeyframe;
        /**
         * 获取关键点索引
         * @param key 关键点
         */
        indexOfKeys(key: AnimationCurveKeyframe): number;
        /**
         * 获取曲线上点信息
         * @param t 时间轴的位置 [0,1]
         */
        getPoint(t: number): AnimationCurveKeyframe;
        /**
         * 获取值
         * @param t 时间轴的位置 [0,1]
         */
        getValue(t: number): number;
        /**
         * 查找关键点
         * @param t 时间轴的位置 [0,1]
         * @param y 值
         * @param precision 查找精度
         */
        findKey(t: number, y: number, precision: number): AnimationCurveKeyframe;
        /**
         * 添加曲线上的关键点
         *
         * 如果该点在曲线上，则添加关键点
         *
         * @param time 时间轴的位置 [0,1]
         * @param value 值
         * @param precision 查找进度
         */
        addKeyAtCurve(time: number, value: number, precision: number): AnimationCurveKeyframe;
        /**
         * 获取曲线样本数据
         *
         * 这些点可用于连线来拟合曲线。
         *
         * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
         */
        getSamples(num?: number): AnimationCurveKeyframe[];
    }
}
declare namespace gd3d.framework {
    /**
     * 动画关键帧
     *
     * @author feng3d
     */
    interface AnimationCurveKeyframe {
        /**
         * The time of the keyframe.
         *
         * 关键帧的时间。
         */
        time: number;
        /**
         * 曲线在关键帧处的值。
         */
        value: number;
        /**
         * Describes the tangent when approaching this point from the previous point in the curve.
         *
         * 描述从曲线上的前一点接近该点时的切线。
         */
        inTangent: number;
        /**
         * Describes the tangent when leaving this point towards the next point in the curve.
         *
         * 描述从这个点到曲线上下一个点的切线。
         */
        outTangent: number;
    }
}
declare namespace gd3d.framework {
    /**
     * 动画曲线Wrap模式，处理超出范围情况
     *
     * @author feng3d
     */
    enum AnimationCurveWrapMode {
        /**
         * 夹紧; 0>-<1
         */
        Clamp = 1,
        /**
         * 循环; 0->1,0->1
         */
        Loop = 2,
        /**
         * 来回循环; 0->1,1->0
         */
        PingPong = 4
    }
}
declare namespace gd3d.framework {
    /**
     * Bézier曲线
     * @see https://en.wikipedia.org/wiki/B%C3%A9zier_curve
     *
     * @author feng3d
     */
    class BezierCurve {
        /**
         * 线性Bézier曲线
         * 给定不同的点P0和P1，线性Bézier曲线就是这两个点之间的直线。曲线由下式给出
         * ```
         * B(t) = p0 + t * (p1 - p0) = (1 - t) * p0 + t * p1 , 0 <= t && t <= 1
         * ```
         * 相当于线性插值
         *
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         */
        static linear(t: number, p0: number, p1: number): number;
        /**
         * 线性Bézier曲线关于t的导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         */
        static linearDerivative(t: number, p0: number, p1: number): number;
        /**
         * 线性Bézier曲线关于t的二阶导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         */
        static linearSecondDerivative(t: number, p0: number, p1: number): number;
        /**
         * 二次Bézier曲线
         *
         * 二次Bézier曲线是由函数B（t）跟踪的路径，给定点P0，P1和P2，
         * ```
         * B(t) = (1 - t) * ((1 - t) * p0 + t * p1) + t * ((1 - t) * p1 + t * p2) , 0 <= t && t <= 1
         * ```
         * 这可以解释为分别从P0到P1和从P1到P2的线性Bézier曲线上相应点的线性插值。重新排列前面的等式得出：
         * ```
         * B(t) = (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2 , 0 <= t && t <= 1
         * ```
         * Bézier曲线关于t的导数是
         * ```
         * B'(t) = 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1)
         * ```
         * 从中可以得出结论：在P0和P2处曲线的切线在P 1处相交。随着t从0增加到1，曲线沿P1的方向从P0偏离，然后从P1的方向弯曲到P2。
         *
         * Bézier曲线关于t的二阶导数是
         * ```
         * B''(t) = 2 * (p2 - 2 * p1 + p0)
         * ```
         *
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         */
        static quadratic(t: number, p0: number, p1: number, p2: number): number;
        /**
         * 二次Bézier曲线关于t的导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         */
        static quadraticDerivative(t: number, p0: number, p1: number, p2: number): number;
        /**
         * 二次Bézier曲线关于t的二阶导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         */
        static quadraticSecondDerivative(t: number, p0: number, p1: number, p2: number): number;
        /**
         * 立方Bézier曲线
         *
         * 平面中或高维空间中（其实一维也是成立的，这里就是使用一维计算）的四个点P0，P1，P2和P3定义了三次Bézier曲线。
         * 曲线开始于P0朝向P1并且从P2的方向到达P3。通常不会通过P1或P2; 这些点只是为了提供方向信息。
         * P1和P2之间的距离在转向P2之前确定曲线向P1移动的“多远”和“多快” 。
         *
         * 对于由点Pi，Pj和Pk定义的二次Bézier曲线，可以将Bpipjpk(t)写成三次Bézier曲线，它可以定义为两条二次Bézier曲线的仿射组合：
         * ```
         * B(t) = (1 - t) * Bp0p1p2(t) + t * Bp1p2p3(t) , 0 <= t && t <= 1
         * ```
         * 曲线的显式形式是：
         * ```
         * B(t) = (1 - t) * (1 - t) * (1 - t) * p0 + 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t * p3 , 0 <= t && t <= 1
         * ```
         * 对于P1和P2的一些选择，曲线可以相交，或者包含尖点。
         *
         * 三次Bézier曲线相对于t的导数是
         * ```
         * B'(t) = 3 * (1 - t) * (1 - t) * (p1 - p0) + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (p3 - p2);
         * ```
         * 三次Bézier曲线关于t的二阶导数是
         * ```
         * 6 * (1 - t) * (p2 - 2 * p1 + p0) + 6 * t * (p3 - 2 * p2 + p1);
         * ```
         *
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         * @param p3 点3
         */
        static cubic(t: number, p0: number, p1: number, p2: number, p3: number): number;
        /**
         * 三次Bézier曲线关于t的导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         * @param p3 点3
         */
        static cubicDerivative(t: number, p0: number, p1: number, p2: number, p3: number): number;
        /**
         * 三次Bézier曲线关于t的二阶导数
         * @param t 插值度
         * @param p0 点0
         * @param p1 点1
         * @param p2 点2
         */
        static cubicSecondDerivative(t: number, p0: number, p1: number, p2: number, p3: number): number;
        /**
         * n次Bézier曲线
         *
         * 一般定义
         *
         * Bézier曲线可以定义为任意度n。
         *
         * @param t 插值度
         * @param ps 点列表 ps.length == n+1
         * @param processs 收集中间过程数据，可用作Bézier曲线动画数据
         */
        static bn(t: number, ps: number[], processs?: number[][]): number;
        /**
         * n次Bézier曲线关于t的导数
         *
         * 一般定义
         *
         * Bézier曲线可以定义为任意度n。
         *
         * @param t 插值度
         * @param ps 点列表 ps.length == n+1
         */
        static bnDerivative(t: number, ps: number[]): number;
        /**
         * n次Bézier曲线关于t的二阶导数
         *
         * 一般定义
         *
         * Bézier曲线可以定义为任意度n。
         *
         * @param t 插值度
         * @param ps 点列表 ps.length == n+1
         */
        static bnSecondDerivative(t: number, ps: number[]): number;
        /**
         * n次Bézier曲线关于t的dn阶导数
         *
         * Bézier曲线可以定义为任意度n。
         *
         * @param t 插值度
         * @param dn 求导次数
         * @param ps 点列表     ps.length == n+1
         */
        static bnND(t: number, dn: number, ps: number[]): number;
        /**
         * 获取曲线在指定插值度上的值
         * @param t 插值度
         * @param ps 点列表
         */
        static getValue(t: number, ps: number[]): number;
        /**
         * 获取曲线在指定插值度上的导数(斜率)
         * @param t 插值度
         * @param ps 点列表
         */
        static getDerivative(t: number, ps: number[]): number;
        /**
         * 获取曲线在指定插值度上的二阶导数
         * @param t 插值度
         * @param ps 点列表
         */
        static getSecondDerivative(t: number, ps: number[]): number;
        /**
         * 查找区间内极值列表
         *
         * @param ps 点列表
         * @param numSamples 采样次数，用于分段查找极值
         * @param precision  查找精度
         *
         * @returns 极值列表 {} {ts: 极值插值度列表,vs: 极值值列表}
         */
        static getExtremums(ps: number[], numSamples?: number, precision?: number): {
            ts: number[];
            vs: number[];
        };
        /**
         * 获取单调区间列表
         * @returns {} {ts: 区间结点插值度列表,vs: 区间结点值列表}
         */
        static getMonotoneIntervals(ps: number[], numSamples?: number, precision?: number): {
            ts: number[];
            vs: number[];
        };
        /**
         * 获取目标值所在的插值度T
         *
         * @param targetV 目标值
         * @param ps 点列表
         * @param numSamples 分段数量，用于分段查找，用于解决寻找多个解、是否无解等问题；过少的分段可能会造成找不到存在的解决，过多的分段将会造成性能很差。
         * @param precision  查找精度
         *
         * @returns 返回解数组
         */
        static getTFromValue(targetV: number, ps: number[], numSamples?: number, precision?: number): number[];
        /**
         * 分割曲线
         *
         * 在曲线插值度t位置分割为两条连接起来与原曲线完全重合的曲线
         *
         * @param t 分割位置（插值度）
         * @param ps 被分割曲线点列表
         * @returns 返回两条曲线组成的数组
         */
        static split(t: number, ps: number[]): number[][];
        /**
         * 合并曲线
         *
         * 合并两条连接的曲线为一条曲线并且可以还原为分割前的曲线
         *
         * @param fps 第一条曲线点列表
         * @param sps 第二条曲线点列表
         * @param mergeType 合并方式。mergeType = 0时进行还原合并，还原拆分之前的曲线；mergeType = 1时进行拟合合并，合并后的曲线会经过两条曲线的连接点；
         */
        static merge(fps: number[], sps: number[], mergeType?: number): number[];
        /**
         * 获取曲线样本数据
         *
         * 这些点可用于连线来拟合曲线。
         *
         * @param ps 点列表
         * @param num 采样次数 ，采样点分别为[0,1/num,2/num,....,(num-1)/num,1]
         */
        static getSamples(ps: number[], num?: number): {
            t: number;
            v: number;
        }[];
    }
}
declare namespace gd3d.framework {
    /**
     * 最大最小曲线
     *
     * @author feng3d
     */
    class MinMaxCurve {
        __class__: "gd3d.framework.MinMaxCurve";
        /**
         * 模式
         */
        mode: MinMaxCurveMode;
        /**
         * Set the constant value.
         *
         * 设置常数值。
         */
        constant: number;
        /**
         * Set a constant for the lower bound.
         *
         * 为下界设置一个常数。
         */
        constantMin: number;
        /**
         * Set a constant for the upper bound.
         *
         * 为上界设置一个常数。
         */
        constantMax: number;
        /**
         * Set the curve.
         *
         * 设置曲线。
         */
        curve: AnimationCurve1;
        /**
         * Set a curve for the lower bound.
         *
         * 为下界设置一条曲线。
         */
        curveMin: AnimationCurve1;
        /**
         * Set a curve for the upper bound.
         *
         * 为上界设置一条曲线。
         */
        curveMax: AnimationCurve1;
        /**
         * Set a multiplier to be applied to the curves.
         *
         * 设置一个乘数应用于曲线。
         */
        curveMultiplier: number;
        /**
         * 是否在编辑器中只显示Y轴 0-1 区域，例如 lifetime 为非负，需要设置为true
         */
        between0And1: boolean;
        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number, randomBetween?: number): number;
    }
}
declare namespace gd3d.framework {
    /**
     * 曲线模式
     *
     * @author feng3d
     */
    enum MinMaxCurveMode {
        /**
         * Use a single constant for the MinMaxCurve.
         *
         * 使用单个常数。
         */
        Constant = 0,
        /**
         * Use a single curve for the MinMaxCurve.
         *
         * 使用一条曲线
         */
        Curve = 1,
        /**
         * Use a random value between 2 constants for the MinMaxCurve.
         *
         * 在两个常量之间使用一个随机值
         */
        TwoConstants = 3,
        /**
         * Use a random value between 2 curves for the MinMaxCurve.
         *
         * 在两条曲线之间使用一个随机值。
         */
        TwoCurves = 2
    }
}
declare namespace gd3d.framework {
    /**
     *
     * @author feng3d
     */
    class MinMaxCurveVector3 {
        /**
         * x 曲线
         */
        xCurve: MinMaxCurve;
        /**
         * y 曲线
         */
        yCurve: MinMaxCurve;
        /**
         * z 曲线
         */
        zCurve: MinMaxCurve;
        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number, randomBetween?: number): math.vector3;
    }
}
declare namespace gd3d.framework {
    /**
     * 颜色渐变
     *
     * @author feng3d
     */
    class Gradient {
        __class__: "gd3d.framework.Gradient";
        /**
         * 渐变模式
         */
        mode: GradientMode;
        /**
         * 在渐变中定义的所有alpha键。
         *
         * 注： 该值已对时间排序，否则赋值前请使用 sort((a, b) => a.time - b.time) 进行排序
         */
        alphaKeys: GradientAlphaKey[];
        /**
         * 在渐变中定义的所有color键。
         *
         * 注： 该值已对时间排序，否则赋值前请使用 sort((a, b) => a.time - b.time) 进行排序
         */
        colorKeys: GradientColorKey[];
        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number): math.color;
        /**
         * 获取透明度
         * @param time 时间
         */
        getAlpha(time: number): number;
        /**
         * 获取透明度
         * @param time 时间
         */
        getColor(time: number): math.color;
    }
}
declare namespace gd3d.framework {
    /**
     * 渐变透明键
     *
     * @author feng3d
     */
    interface GradientAlphaKey {
        /**
         * 透明值
         */
        alpha: number;
        /**
         * 时间
         */
        time: number;
    }
}
declare namespace gd3d.framework {
    /**
     * 渐变颜色键
     *
     * @author feng3d
     */
    interface GradientColorKey {
        /**
         * 颜色值
         */
        color: math.color;
        /**
         * 时间
         */
        time: number;
    }
}
declare namespace gd3d.framework {
    /**
     * 渐变模式
     *
     * @author feng3d
     */
    enum GradientMode {
        /**
         * 混合
         */
        Blend = 0,
        /**
         * 阶梯
         */
        Fixed = 1
    }
}
declare namespace gd3d.framework {
    /**
     * 最大最小颜色渐变
     *
     * @author feng3d
     */
    class MinMaxGradient {
        __class__: "gd3d.framework.MinMaxGradient";
        /**
         * Set the mode that the min-max gradient will use to evaluate colors.
         *
         * 设置最小-最大梯度将用于评估颜色的模式。
         */
        mode: MinMaxGradientMode;
        /**
         * Set a constant color.
         *
         * 常量颜色值
         */
        color: math.color;
        /**
         * Set a constant color for the lower bound.
         *
         * 为下界设置一个常量颜色。
         */
        colorMin: math.color;
        /**
         * Set a constant color for the upper bound.
         *
         * 为上界设置一个常量颜色。
         */
        colorMax: math.color;
        /**
         * Set the gradient.
         *
         * 设置渐变。
         */
        gradient: Gradient;
        /**
         * Set a gradient for the lower bound.
         *
         * 为下界设置一个渐变。
         */
        gradientMin: Gradient;
        /**
         * Set a gradient for the upper bound.
         *
         * 为上界设置一个渐变。
         */
        gradientMax: Gradient;
        /**
         * 获取值
         * @param time 时间
         */
        getValue(time: number, randomBetween?: number, out?: math.color): math.color;
    }
}
declare namespace gd3d.framework {
    /**
     * 最大最小颜色渐变模式
     *
     * @author feng3d
     */
    enum MinMaxGradientMode {
        /**
         * Use a single color for the MinMaxGradient.
         *
         * 使用单一颜色的。
         */
        Color = 0,
        /**
         * Use a single color gradient for the MinMaxGradient.
         *
         * 使用单一颜色渐变。
         */
        Gradient = 1,
        /**
         * Use a random value between 2 colors for the MinMaxGradient.
         *
         * 在两种颜色之间使用一个随机值。
         */
        TwoColors = 2,
        /**
         * Use a random value between 2 color gradients for the MinMaxGradient.
         *
         * 在两个颜色梯度之间使用一个随机值。
         */
        TwoGradients = 3,
        /**
         * Define a list of colors in the MinMaxGradient, to be chosen from at random.
         *
         * 在一个颜色列表中随机选择。
         */
        RandomColor = 4
    }
}
declare namespace gd3d.io {
    /**
     *
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @param loadedFun 正常加载完成后回调
     */
    function xhrLoad(url: string, fun: (ContentData: any, _err: Error, isloadFail?: boolean) => void, onprocess: (curLength: number, totalLength: number) => void, responseType: XMLHttpRequestResponseType, loadedFun: (req: XMLHttpRequest) => void): void;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载text资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version gd3d 1.0
     */
    function loadText(url: string, fun: (_txt: string, _err: Error, isloadFail?: boolean) => void, onprocess?: (curLength: number, totalLength: number) => void): void;
    function JSONParse(text: string): Promise<any>;
    function loadJSON(url: string, fun: (_txt: any, _err: Error, isloadFail?: boolean) => void, onprocess?: (curLength: number, totalLength: number) => void): Promise<unknown>;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载arraybuffer资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version gd3d 1.0
     */
    function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error, isloadFail?: boolean) => void, onprocess?: (curLength: number, totalLength: number) => void): void;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载二进制资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version gd3d 1.0
     */
    function loadBlob(url: string, fun: (_blob: Blob, _err: Error, isloadFail?: boolean) => void, onprocess?: (curLength: number, totalLength: number) => void): void;
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载图片资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param progress 加载进度
     * @version gd3d 1.0
     */
    function loadImg(url: string, fun: (_tex: HTMLImageElement, _err?: Error, loadFail?: boolean) => void, onprocess?: (curLength: number, totalLength: number) => void): void;
}
declare namespace gd3d {
    /** 从池中取一个 vector2 */
    function poolv2(clone?: math.vector2): math.vector2;
    /** 删除释放一个 vector2 */
    function poolv2_del(data: math.vector2): void;
    /** 从池中取一个 vector3 */
    function poolv3(clone?: math.vector3): math.vector3;
    /** 删除释放一个 vector3 */
    function poolv3_del(data: math.vector3): void;
    /** 从池中取一个 vector4 */
    function poolv4(clone?: math.vector4): math.vector4;
    /** 删除释放一个 vector4 */
    function poolv4_del(data: math.vector4): void;
    /** 从池中取一个 quaternion */
    function poolquat(clone?: math.quaternion): math.quaternion;
    /** 删除释放一个 quaternion */
    function poolquat_del(data: math.quaternion): void;
    /** 从池中取一个 matrix */
    function poolmtx(clone?: math.matrix): math.matrix;
    /** 删除释放一个 matrix */
    function poolmtx_del(data: math.matrix): void;
    /** 从池中取一个 matrix3x2 */
    function poolmtx3x2(clone?: math.matrix3x2): math.matrix3x2;
    /** 删除释放一个 matrix3x2 */
    function poolmtx3x2_del(data: math.matrix3x2): void;
    /** 从池中取一个 rect */
    function poolrect(clone?: math.rect): math.rect;
    /** 删除释放一个 rect */
    function poolrect_del(data: math.rect): void;
    /** 从池中取一个 color */
    function poolcolor(clone?: math.color): math.color;
    /** 删除释放一个 color */
    function poolcolor_del(data: math.color): void;
}
declare namespace gd3d.math {
    /**
    * @public
    * @language zh_CN
    * @classdesc
    * 对常用结构类型数据进行池化处理，
    * 在大量使用结构类型数据的逻辑中尽量使用该结构
    * @version gd3d 1.0
    */
    class pool {
        private static helpDataMap;
        static genHelpData(type: string, id: number): any;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 释放所有池
        * @version gd3d 1.0
        */
        static collect_all(): void;
        private static _vector4_one;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取1填充的v4
        * @version gd3d 1.0
        */
        static get vector4_one(): vector4;
        private static unused_vector4;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个v4
        * @version gd3d 1.0
        */
        static new_vector4(x?: number, y?: number, z?: number, w?: number): vector4;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 有返回值的v4克隆
        * @version gd3d 1.0
        */
        static clone_vector4(src: vector4): vector4;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个v4
        * @version gd3d 1.0
        */
        static delete_vector4(v: vector4): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除v4池
        * @version gd3d 1.0
        */
        static collect_vector4(): void;
        private static _color_one;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取1填充的color
        * @version gd3d 1.0
        */
        static get color_one(): color;
        private static unused_color;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个color
        * @version gd3d 1.0
        */
        static new_color(r?: number, g?: number, b?: number, a?: number): color;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * clone一个color
        * @version gd3d 1.0
        */
        static clone_color(col: color): color;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收color
        * @version gd3d 1.0
        */
        static delete_color(v: color): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除color池
        * @version gd3d 1.0
        */
        static collect_color(): void;
        private static _vector3_up;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v3朝y轴正向
        * @version gd3d 1.0
        */
        static get vector3_up(): vector3;
        private static _vector3_right;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v3朝x轴正向
        * @version gd3d 1.0
        */
        static get vector3_right(): vector3;
        private static _vector3_forward;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v3朝z轴正向
        * @version gd3d 1.0
        */
        static get vector3_forward(): vector3;
        private static _vector3_zero;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取0填充的v3
        * @version gd3d 1.0
        */
        static get vector3_zero(): vector3;
        private static _vector3_one;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取1填充的v3
        * @version gd3d 1.0
        */
        static get vector3_one(): vector3;
        private static unused_vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个v3
        * @version gd3d 1.0
        */
        static new_vector3(x?: number, y?: number, z?: number): vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的v3克隆
        * @version gd3d 1.0
        */
        static clone_vector3(src: vector3): vector3;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个v3
        * @version gd3d 1.0
        */
        static delete_vector3(v: vector3): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个v3数组
        * @version gd3d 1.0
        */
        static delete_vector3Array(vs: vector3[]): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除v3池
        * @version gd3d 1.0
        */
        static collect_vector3(): void;
        private static _vector2_zero;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v2 zero
        * @version gd3d 1.0
        */
        static get vector2_zero(): vector2;
        private static _vector2_up;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v2朝y轴正向
        * @version gd3d 1.0
        */
        static get vector2_up(): vector2;
        private static _vector2_right;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取v2朝x轴正向
        * @version gd3d 1.0
        */
        static get vector2_right(): vector2;
        private static unused_vector2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个v2
        * @version gd3d 1.0
        */
        static new_vector2(x?: number, y?: number): vector2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的v2克隆
        * @version gd3d 1.0
        */
        static clone_vector2(src: vector2): vector2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个v2
        * @version gd3d 1.0
        */
        static delete_vector2(v: vector2): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个v2数组
        * @version gd3d 1.0
        */
        static delete_vector2Array(vs: vector2[]): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除v2池
        * @version gd3d 1.0
        */
        static collect_vector2(): void;
        private static unused_matrix3x2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个3x2matrix
        * @version gd3d 1.0
        */
        static new_matrix3x2(): matrix3x2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的3x2matrix克隆
        * @version gd3d 1.0
        */
        static clone_matrix3x2(src: matrix3x2): matrix3x2;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个3x2matrix
        * @version gd3d 1.0
        */
        static delete_matrix3x2(v: matrix3x2): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除3x2matrix池
        * @version gd3d 1.0
        */
        static collect_matrix3x2(): void;
        private static unused_matrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个matrix
        * @version gd3d 1.0
        */
        static new_matrix(): matrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的matrix克隆
        * @version gd3d 1.0
        */
        static clone_matrix(src: matrix): matrix;
        static readonly identityMat: matrix;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个matrix
        * @version gd3d 1.0
        */
        static delete_matrix(v: matrix): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除matrix池
        * @version gd3d 1.0
        */
        static collect_matrix(): void;
        private static unused_quaternion;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个quat
        * @version gd3d 1.0
        */
        static new_quaternion(x?: number, y?: number, z?: number, w?: number): quaternion;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的quat克隆
        * @version gd3d 1.0
        */
        static clone_quaternion(src: quaternion): quaternion;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个quat
        * @version gd3d 1.0
        */
        static delete_quaternion(v: quaternion): void;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 清除quat池
        * @version gd3d 1.0
        */
        static collect_quaternion(): void;
        private static unused_pickInfo;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个pickInfo
        * @version gd3d 1.0
        */
        static new_pickInfo(bu?: number, bv?: number, distance?: number): framework.pickinfo;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 回收一个pickInfo
        * @version gd3d 1.0
        */
        static delete_pickInfo(v: framework.pickinfo): void;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 清除pickInfo池
         * @version gd3d 1.0
         */
        static collect_pickInfo(): void;
        private static unused_rect;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 获取一个rect
        * @version gd3d 1.0
        */
        static new_rect(x?: number, y?: number, w?: number, h?: number): rect;
        /**
        * @public
        * @language zh_CN
        * @classdesc
        * 带返回值的rect克隆
        * @version gd3d 1.0
        */
        static clone_rect(src: rect): rect;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 回收一个rect
         * @version gd3d 1.0
         */
        static delete_rect(v: rect): void;
        /**
          * @public
          * @language zh_CN
          * @classdesc
          * 清除rect池
          * @version gd3d 1.0
          */
        static collect_rect(): void;
    }
}
declare namespace gd3d.render {
    /**
     * @private
     */
    class caps {
        maxTexturesImageUnits: number;
        maxTextureSize: number;
        maxCubemapTextureSize: number;
        maxRenderTextureSize: number;
        standardDerivatives: boolean;
        s3tc: WEBGL_compressed_texture_s3tc;
        textureFloat: boolean;
        textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        maxAnisotropy: number;
        instancedArrays: ANGLE_instanced_arrays;
        uintIndices: boolean;
        highPrecisionShaderSupported: boolean;
        fragmentDepthSupported: boolean;
        textureFloatLinearFiltering: boolean;
        textureLOD: boolean;
        drawBuffersExtension: any;
        pvrtcExtension: any;
        atcExtension: any;
    }
    /**
     * @private
     */
    class webglkit {
        private static _maxVertexAttribArray;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number): void;
        private static _texNumber;
        static GetTextureNumber(index: number): number;
        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static caps: caps;
        static initConst(webgl: WebGLRenderingContext): void;
    }
}
declare namespace gd3d.render {
    /**
     * @private
     */
    enum ShowFaceStateEnum {
        ALL = 0,
        CCW = 1,
        CW = 2
    }
    /**
     * @private
     */
    enum DrawModeEnum {
        VboTri = 0,
        VboLine = 1,
        EboTri = 2,
        EboLine = 3
    }
    /**
     * @private
     */
    enum BlendModeEnum {
        Close = 0,
        Blend = 1,
        Blend_PreMultiply = 2,
        Add = 3,
        Add_PreMultiply = 4
    }
    /**
     * @private
     */
    class glDrawPass {
        id: framework.resID;
        static lastShowFace: number;
        static lastZWrite: boolean;
        static lastZTest: boolean;
        static lastZTestMethod: number;
        static lastBlend: boolean;
        static lastBlendMode: BlendModeEnum;
        program: glProgram;
        state_showface: ShowFaceStateEnum;
        state_zwrite: boolean;
        state_ztest: boolean;
        state_ztest_method: number;
        state_blend: boolean;
        state_blendMode: BlendModeEnum;
        state_blendEquation: number;
        state_blendSrcRGB: number;
        state_blendDestRGB: number;
        state_blendSrcAlpha: number;
        state_blendDestALpha: number;
        mapuniforms: {
            [id: string]: uniform;
        };
        setProgram(program: glProgram, uniformDefault?: boolean): void;
        setAlphaBlend(mode: BlendModeEnum): void;
        /**
         * 因为ui那边会改变state，所以每次开始渲染场景先将laststatereset。
         */
        static resetLastState(): void;
        private static useStateMap;
        private static lastPassID;
        use(webgl: WebGLRenderingContext): void;
        draw(webgl: WebGLRenderingContext, mesh: glMesh, drawmode?: DrawModeEnum, drawindexindex?: number, drawbegin?: number, drawcount?: number): void;
        private getCurDrawState;
        private getCurBlendVal;
        private formate;
    }
}
declare namespace gd3d.render {
    /**
     * @private
     */
    enum VertexFormatMask {
        Position = 1,
        Normal = 2,
        Tangent = 4,
        Color = 8,
        UV0 = 16,
        UV1 = 32,
        BlendIndex4 = 64,
        BlendWeight4 = 128,
        ColorEX = 256
    }
    /**
     * @private
     */
    class number4 {
        v0: number;
        v1: number;
        v2: number;
        v3: number;
    }
    /**
     * @private
     */
    enum MeshTypeEnum {
        Static = 0,
        Dynamic = 1,
        Stream = 2
    }
    /**
     * @private
     */
    class drawInfo {
        private static _ins;
        static get ins(): drawInfo;
        triCount: number;
        vboCount: number;
        renderCount: number;
    }
    /**
     * @private
     */
    class glMesh {
        initBuffer(webgl: WebGLRenderingContext, vf: VertexFormatMask, vertexCount: number, mode?: MeshTypeEnum): void;
        addIndex(webgl: WebGLRenderingContext, indexcount: number): number;
        resetVboSize(webgl: WebGLRenderingContext, vertexCount: number): void;
        resetEboSize(webgl: WebGLRenderingContext, eboindex: number, indexcount: number): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        mode: number;
        vbo: WebGLBuffer;
        vertexCount: number;
        vertexByteSize: number;
        ebos: WebGLBuffer[];
        indexCounts: number[];
        lineMode: number;
        bindVboBuffer(webgl: WebGLRenderingContext): void;
        bindIndex: number;
        vertexFormat: VertexFormatMask;
        bind(webgl: WebGLRenderingContext, shadercode: glProgram, bindEbo?: number): void;
        uploadVertexSubData(webgl: WebGLRenderingContext, varray: Float32Array, offset?: number): void;
        uploadVertexData(webgl: WebGLRenderingContext, varray: Float32Array): void;
        uploadIndexSubData(webgl: WebGLRenderingContext, eboindex: number, data: Uint16Array, offset?: number): void;
        uploadIndexData(webgl: WebGLRenderingContext, eboindex: number, data: Uint16Array): void;
        drawArrayTris(webgl: WebGLRenderingContext, start?: number, count?: number, instanceCount?: number): void;
        drawArrayLines(webgl: WebGLRenderingContext, start?: number, count?: number, instanceCount?: number): void;
        drawElementTris(webgl: WebGLRenderingContext, start?: number, count?: number, instanceCount?: number): void;
        drawElementLines(webgl: WebGLRenderingContext, start?: number, count?: number, instanceCount?: number): void;
    }
}
declare namespace gd3d.render {
    /**
     * @private
     */
    class meshData {
        originVF: number;
        pos: gd3d.math.vector3[];
        color: gd3d.math.color[];
        colorex: gd3d.math.color[];
        uv: gd3d.math.vector2[];
        uv2: gd3d.math.vector2[];
        normal: gd3d.math.vector3[];
        tangent: gd3d.math.vector3[];
        blendIndex: number4[];
        blendWeight: number4[];
        trisindex: number[];
        tmpVArr: Float32Array;
        tmpInxArr: Uint16Array;
        static addQuadPos(data: meshData, quad: gd3d.math.vector3[]): void;
        static addQuadPos_Quad(data: meshData, quad: gd3d.math.vector3[]): void;
        static addQuadVec3ByValue(array: gd3d.math.vector3[], value: gd3d.math.vector3): void;
        static addQuadVec3(array: gd3d.math.vector3[], quad: gd3d.math.vector3[]): void;
        static addQuadVec2(array: gd3d.math.vector2[], quad: gd3d.math.vector2[]): void;
        static genQuad(size: number): meshData;
        static genQuad_forparticle(size: number): meshData;
        static genPlaneCCW(size: number): meshData;
        static genCylinderCCW(height: number, radius: number, segment?: number): meshData;
        static genPyramid(height: number, halfsize: number): meshData;
        static genSphereCCW(radius?: number, widthSegments?: number, heightSegments?: number): meshData;
        static genBoxCCW(size: number): meshData;
        static genBoxByArray(array: gd3d.math.vector3[], outData: meshData): void;
        static genBoxByArray_Quad(array: gd3d.math.vector3[]): meshData;
        static genCircleLineCCW(radius: number, segment?: number, wide?: number): meshData;
        caclByteLength(): number;
        static calcByteSize(vf: VertexFormatMask): number;
        static timer: number;
        genVertexDataArray(vf: VertexFormatMask): Float32Array;
        genIndexDataArray(): Uint16Array;
        genIndexDataArrayTri2Line(): Uint16Array;
        genIndexDataArrayQuad2Line(): Uint16Array;
        static cloneByObj(target: meshData): meshData;
        /**
         * 获取AABB
         *
         * @param recalculate 是否重新计算AABB
         */
        getAABB(recalculate?: boolean): framework.aabb;
        private _aabb;
    }
}
declare namespace gd3d.render {
    class shaderUniform {
        static texindex: number;
        static applyuniformFunc: {
            [type: number]: (location: any, value: any) => void;
        };
        static webgl: WebGLRenderingContext;
        static initApplyUnifmFunc(): void;
    }
}
declare namespace gd3d.render {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * uniform类型枚举
     * @version gd3d 1.0
     */
    enum UniformTypeEnum {
        Texture = 0,
        Float = 1,
        Floatv = 2,
        Float4 = 3,
        Float4v = 4,
        Float4x4 = 5,
        Float4x4v = 6,
        CubeTexture = 7
    }
    /**
     * @private
     */
    class uniform {
        name: string;
        type: UniformTypeEnum;
        location: WebGLUniformLocation;
    }
    class attribute {
        name: string;
        size: number;
        location: number;
    }
    /**
     * @private
     */
    enum ShaderTypeEnum {
        VS = 0,
        FS = 1
    }
    /**
     * @private
     */
    class glShader {
        constructor(name: string, type: ShaderTypeEnum, shader: WebGLShader, code: string);
        name: string;
        type: ShaderTypeEnum;
        shader: WebGLShader;
    }
    /**
     * @private
     */
    class glProgram {
        private static buildInAtrribute;
        /**
         * 是否是引擎系统内建的 attrib ID
         * @param attribID
         */
        static isBuildInAttrib(attribID: string): boolean;
        constructor(vs: glShader, fs: glShader, program: WebGLProgram);
        /** attribute map */
        mapAttrib: {
            [id: string]: attribute;
        };
        /** 自定义 attribute map */
        mapCustomAttrib: {
            [id: string]: attribute;
        };
        private _strideInsAttrib;
        get strideInsAttrib(): number;
        initAttribute(webgl: WebGLRenderingContext): void;
        private tryGetLocation;
        vs: glShader;
        fs: glShader;
        program: WebGLProgram;
        posPos: number;
        posNormal: number;
        posTangent: number;
        posColor: number;
        posUV0: number;
        posUV2: number;
        posBlendIndex4: number;
        posBlendWeight4: number;
        posColorEx: number;
        mapUniform: {
            [id: string]: uniform;
        };
        use(webgl: WebGLRenderingContext): void;
        initUniforms(webgl: WebGLRenderingContext): void;
    }
    /**
     * @private
     */
    class shaderPool {
        mapVS: {
            [id: string]: glShader;
        };
        mapFS: {
            [id: string]: glShader;
        };
        mapProgram: {
            [id: string]: glProgram;
        };
        disposeVS(webgl: WebGLRenderingContext, id: string): void;
        disposeFS(webgl: WebGLRenderingContext, id: string): void;
        disposeProgram(webgl: WebGLRenderingContext, id: string): void;
        disposeAll(webgl: WebGLRenderingContext): void;
        compileVS(webgl: WebGLRenderingContext, name: string, code: string): glShader;
        compileFS(webgl: WebGLRenderingContext, name: string, code: string): glShader;
        linkProgram(webgl: WebGLRenderingContext, nameVS: string, nameFS: string): glProgram;
        mapVSString: {
            [id: string]: string;
        };
        mapFSString: {
            [id: string]: string;
        };
        linkProgrambyPassType(webgl: WebGLRenderingContext, type: string, nameVS: string, nameFS: string, globalMacros: string[]): glProgram;
    }
}
declare namespace gd3d.render {
    /** 是否全局关闭，贴图mipmap */
    let mipmapCancel: boolean;
    /**
     * @private
     */
    enum TextureFormatEnum {
        RGBA = 1,
        RGB = 2,
        Gray = 3,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
        KTX = 5,
        ASTC_RGBA_4x4 = 6,
        ASTC_RGBA_5x4 = 7,
        ASTC_RGBA_5x5 = 8,
        ASTC_RGBA_6x5 = 9,
        ASTC_RGBA_6x6 = 10,
        ASTC_RGBA_8x5 = 11,
        ASTC_RGBA_8x6 = 12,
        ASTC_RGBA_8x8 = 13,
        ASTC_RGBA_10x5 = 14,
        ASTC_RGBA_10x6 = 15,
        ASTC_RGBA_10x8 = 16,
        ASTC_RGBA_10x10 = 17,
        ASTC_RGBA_12x10 = 18,
        ASTC_RGBA_12x12 = 19
    }
    /**
     * @private
     */
    class textureReader {
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        private webgl;
        private _width;
        get width(): number;
        private _height;
        get height(): number;
        private _data;
        private _grayData;
        get data(): Uint8Array;
        private _gray;
        get gray(): boolean;
        getPixel(u: number, v: number): any;
        /** 刷新data数据 */
        refresh(texRGBA: WebGLTexture): void;
    }
    /**
     * @private
     */
    interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGLRenderingContext): any;
        caclByteLength(): number;
    }
    /**
     * @private
     */
    class glRenderTarget implements ITexture {
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth?: boolean, stencil?: boolean);
        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;
        use(webgl: WebGLRenderingContext): void;
        static useNull(webgl: WebGLRenderingContext): void;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
        isFrameBuffer(): boolean;
    }
    /**
     * @private
     */
    class glTexture2D implements ITexture {
        ext: any;
        private linear;
        private premultiply;
        private repeat;
        private mirroredU;
        private mirroredV;
        constructor(webgl: WebGLRenderingContext, format?: TextureFormatEnum, mipmap?: boolean, linear?: boolean);
        private getExt;
        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array | Float32Array, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean, premultiplyAlpha?: boolean, flipY?: boolean, dataType?: number): void;
        webgl: WebGLRenderingContext;
        loaded: boolean;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number;
        height: number;
        mipmap: boolean;
        caclByteLength(): number;
        reader: textureReader;
        getReader(redOnly?: boolean): textureReader;
        dispose(webgl: WebGLRenderingContext): void;
        isFrameBuffer(): boolean;
        private static mapTexture;
        static formGrayArray(webgl: WebGLRenderingContext, array: number[] | Float32Array | Float64Array, width: number, height: number): glTexture2D;
        static staticTexture(webgl: WebGLRenderingContext, name: string): glTexture2D;
        static particleTexture(webgl: WebGLRenderingContext, name?: string): glTexture2D;
    }
    class glTextureCube implements ITexture {
        constructor(webgl: WebGLRenderingContext, format?: TextureFormatEnum, mipmap?: boolean, linear?: boolean);
        uploadImages(Texture_NEGATIVE_X: framework.texture, Texture_NEGATIVE_Y: framework.texture, Texture_NEGATIVE_Z: framework.texture, Texture_POSITIVE_X: framework.texture, Texture_POSITIVE_Y: framework.texture, Texture_POSITIVE_Z: framework.texture): void;
        private upload;
        webgl: WebGLRenderingContext;
        loaded: boolean;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number;
        height: number;
        mipmap: boolean;
        linear: boolean;
        caclByteLength(): number;
        dispose(webgl: WebGLRenderingContext): void;
        isFrameBuffer(): boolean;
    }
    /**
     * @private
     */
    class WriteableTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format: TextureFormatEnum, width: number, height: number, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean);
        linear: boolean;
        premultiply: boolean;
        repeat: boolean;
        mirroredU: boolean;
        mirroredV: boolean;
        updateRect(data: Uint8Array, x: number, y: number, width: number, height: number): void;
        updateRectImg(data: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement, x: number, y: number): void;
        isFrameBuffer(): boolean;
        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        formatGL: number;
        width: number;
        height: number;
        dispose(webgl: WebGLRenderingContext): void;
        caclByteLength(): number;
    }
}
//# sourceMappingURL=gd3d.d.ts.map