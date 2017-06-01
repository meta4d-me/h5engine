/// <reference path="Reflect.d.ts" />
declare namespace gd3d.framework {
    interface INotify {
        notify(trans: any, type: NotifyType): any;
    }
    enum NotifyType {
        AddChild = 0,
        RemoveChild = 1,
        ChangeVisible = 2,
        AddCamera = 3,
        AddCanvasRender = 4,
    }
    class application {
        webgl: WebGLRenderingContext;
        stats: Stats.Stats;
        container: HTMLDivElement;
        width: number;
        height: number;
        limitFrame: boolean;
        notify: INotify;
        start(div: HTMLDivElement): void;
        markNotify(trans: any, type: NotifyType): void;
        private doNotify(trans, type);
        checkFilter(trans: any): boolean;
        showFps(): void;
        closeFps(): void;
        beStepNumber: number;
        private update(delta);
        private beginTimer;
        private lastTimer;
        private totalTime;
        private deltaTime;
        getTotalTime(): number;
        getDeltaTime(): number;
        private loop();
        private _scene;
        private initScene();
        getScene(): scene;
        private _assetmgr;
        private initAssetMgr();
        getAssetMgr(): assetMgr;
        private _inputmgr;
        private initInputMgr();
        getInputMgr(): inputMgr;
        private _userCode;
        private _userCodeNew;
        private _editorCode;
        private _editorCodeNew;
        private _bePlay;
        be2dstate: boolean;
        curcameraindex: number;
        bePlay: boolean;
        private _bePause;
        bePause: boolean;
        private _beStepForward;
        beStepForward: boolean;
        private updateUserCode(delta);
        updateEditorCode(delta: number): void;
        addUserCodeDirect(program: IUserCode): void;
        addUserCode(classname: string): void;
        addEditorCode(classname: string): void;
        addEditorCodeDirect(program: IEditorCode): void;
    }
    interface IUserCode {
        onStart(app: gd3d.framework.application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
    interface IEditorCode {
        onStart(app: gd3d.framework.application): any;
        onUpdate(delta: number): any;
        isClosed(): boolean;
    }
}
declare namespace gd3d.framework {
    class sceneMgr {
        private static _ins;
        static readonly ins: sceneMgr;
        static app: application;
        static scene: scene;
    }
}
declare namespace Stats {
    class Stats {
        constructor();
        update(): void;
        container: HTMLDivElement;
        private mode;
        private REVISION;
        private beginTime;
        private prevTime;
        private frames;
        private fpsPanel;
        private msPanel;
        private memPanel;
        private showPanel(id);
        private addPanel(panel);
        private begin();
        private end();
    }
}
declare namespace gd3d.reflect {
    function getPrototypes(): {
        [id: string]: any;
    };
    function getPrototype(name: string): any;
    function createInstance(prototype: any, matchTag: {
        [id: string]: string;
    }): any;
    function getClassName(prototype: any): any;
    function getClassTag(prototype: any, tag: string): any;
    function getMeta(prototype: any): any;
    function attr_Class(constructorObj: any): void;
    function attr_Func(customInfo?: {
        [id: string]: string;
    }): (target: any, propertyKey: string, value: any) => void;
    function attr_Field(customInfo?: {
        [id: string]: string;
    }): (target: Object, propertyKey: string) => void;
    function userCode(constructorObj: any): void;
    function editorCode(constructorObj: any): void;
    function selfClone(constructorObj: any): void;
    function nodeComponent(constructorObj: any): void;
    function nodeComponentInspector(constructorObj: any): void;
    function nodeRender(constructorObj: any): void;
    function nodeCamera(constructorObj: any): void;
    function nodeLight(constructorObj: any): void;
    function nodeBoxCollider(constructorObj: any): void;
    function nodeSphereCollider(constructorObj: any): void;
    function nodeEffectBatcher(constructorObj: any): void;
    function nodeMeshCollider(constructorObj: any): void;
    function nodeCanvasRendererCollider(constructorObj: any): void;
    function node2DComponent(constructorObj: any): void;
    function pluginMenuItem(constructorObj: any): void;
    function pluginWindow(constructorObj: any): void;
    function pluginExt(constructorObj: any): void;
    function compValue(integer?: boolean, defvalue?: number, min?: number, max?: number): (target: Object, propertyKey: string) => void;
    function compCall(customInfo?: {
        [id: string]: string;
    }): (target: any, propertyKey: string, value: any) => void;
    function SerializeType(constructorObj: any): void;
    function Field(valueType: string, defaultValue?: any, enumRealType?: string): (target: Object, propertyKey: string) => void;
    function UIComment(comment: string): (target: Object, propertyKey: string) => void;
    enum FieldUIStyle {
        None = 0,
        RangeFloat = 1,
        MultiLineString = 2,
        Enum = 3,
    }
    function UIStyle(style: string, min?: number, max?: number, defvalue?: any): (target: Object, propertyKey: string) => void;
}
declare namespace gd3d.framework {
    class canvas {
        constructor();
        is2dUI: boolean;
        parentTrans: transform;
        batcher: batcher2D;
        webgl: WebGLRenderingContext;
        scene: scene;
        addChild(node: transform2D): void;
        removeChild(node: transform2D): void;
        getChildren(): transform2D[];
        getChildCount(): number;
        getChild(index: number): transform2D;
        private pointDown;
        private pointSelect;
        private pointEvent;
        private pointX;
        private pointY;
        update(delta: number, touch: Boolean, XOnScreenSpace: number, YOnScreenSpace: number): void;
        lastMat: material;
        static defmat: material;
        afterRender: Function;
        render(context: renderContext, assetmgr: assetMgr): void;
        pushRawData(mat: material, data: number[]): void;
        context: renderContext;
        assetmgr: assetMgr;
        drawScene(node: transform2D, context: renderContext, assetmgr: assetMgr): void;
        pixelWidth: number;
        pixelHeight: number;
        private rootNode;
        getRoot(): transform2D;
    }
}
declare namespace gd3d.framework {
    class batcher2D {
        mesh: render.glMesh;
        drawMode: render.DrawModeEnum;
        vboCount: number;
        curPass: render.glDrawPass;
        eboCount: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        initBuffer(webgl: WebGLRenderingContext, vf: render.VertexFormatMask, drawMode: render.DrawModeEnum): void;
        begin(webgl: WebGLRenderingContext, pass: render.glDrawPass): void;
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[]): void;
        end(webgl: WebGLRenderingContext): void;
    }
    class canvasRenderer implements IRenderer, ICollider {
        constructor();
        subTran: transform;
        getBound(): any;
        intersectsTransform(tran: transform): boolean;
        layer: RenderLayerEnum;
        queue: number;
        gameObject: gameObject;
        canvas: canvas;
        inputmgr: inputMgr;
        cameraTouch: camera;
        start(): void;
        addChild(node: transform2D): void;
        removeChild(node: transform2D): void;
        getChildren(): transform2D[];
        getChildCount(): number;
        getChild(index: number): transform2D;
        update(delta: number): void;
        pick2d(ray: gd3d.framework.ray): transform2D;
        dopick2d(outv: math.vector2, tran: transform2D): transform2D;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        jsonToAttribute(json: any, assetmgr: gd3d.framework.assetMgr): void;
        remove(): void;
        clone(): void;
        renderLayer: CullingMask;
    }
}
declare namespace gd3d.framework {
    enum PointEventEnum {
        PointNothing = 0,
        PointDown = 1,
        PointHold = 2,
        PointUp = 3,
    }
    class PointEvent {
        type: PointEventEnum;
        x: number;
        y: number;
        eated: boolean;
        selected: transform2D;
    }
    class UIEvent {
        funcs: Function[];
        addListener(func: Function): void;
        excute(): void;
        clear(): void;
    }
}
declare namespace gd3d.framework {
    class overlay2D implements IOverLay {
        constructor();
        init: boolean;
        camera: camera;
        app: application;
        inputmgr: inputMgr;
        start(camera: camera): void;
        canvas: canvas;
        autoAsp: boolean;
        renderLayer: CullingMask;
        addChild(node: transform2D): void;
        removeChild(node: transform2D): void;
        getChildren(): transform2D[];
        getChildCount(): number;
        getChild(index: number): transform2D;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        update(delta: number): void;
        pick2d(mx: number, my: number): transform2D;
        dopick2d(outv: math.vector2, tran: transform2D): transform2D;
        calScreenPosToCanvasPos(mousePos: gd3d.math.vector2, canvasPos: gd3d.math.vector2): void;
    }
}
declare namespace gd3d.math {
    class vector2 {
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        toString(): string;
    }
    class rect {
        constructor(x?: number, y?: number, w?: number, h?: number);
        x: number;
        y: number;
        w: number;
        h: number;
        toString(): string;
    }
    class border {
        constructor(l?: number, t?: number, r?: number, b?: number);
        l: number;
        t: number;
        r: number;
        b: number;
    }
    class color {
        constructor(r?: number, g?: number, b?: number, a?: number);
        r: number;
        g: number;
        b: number;
        a: number;
        toString(): string;
    }
    class vector3 {
        constructor(x?: number, y?: number, z?: number);
        x: number;
        y: number;
        z: number;
        toString(): string;
    }
    class vector4 {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    class quaternion {
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        toString(): string;
    }
    class matrix {
        rawData: Float32Array;
        constructor(datas?: Float32Array);
        toString(): string;
    }
    class matrix3x2 {
        rawData: Float32Array;
        constructor(datas?: Float32Array);
        toString(): string;
    }
}
declare namespace gd3d.framework {
    interface I2DComponent {
        start(): any;
        update(delta: number): any;
        transform: transform2D;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): any;
        remove(): any;
    }
    interface IRectRenderer extends I2DComponent {
        render(canvas: canvas): any;
        updateTran(): any;
    }
    class C2DComponent {
        comp: I2DComponent;
        init: boolean;
        constructor(comp: I2DComponent, init?: boolean);
    }
    class transform2D {
        private _canvas;
        canvas: canvas;
        name: string;
        parent: transform2D;
        children: transform2D[];
        width: number;
        height: number;
        pivot: math.vector2;
        hideFlags: HideFlags;
        _visible: boolean;
        readonly visibleInScene: boolean;
        visible: boolean;
        readonly transform: this;
        insId: insID;
        private dirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        localTranslate: math.vector2;
        localScale: math.vector2;
        localRotate: number;
        private localMatrix;
        private worldMatrix;
        private worldRotate;
        private worldTranslate;
        private worldScale;
        addChild(node: transform2D): void;
        addChildAt(node: transform2D, index: number): void;
        removeChild(node: transform2D): void;
        removeAllChild(): void;
        markDirty(): void;
        updateTran(parentChange: boolean): void;
        updateWorldTran(): void;
        getWorldTranslate(): math.vector2;
        getWorldScale(): math.vector2;
        getWorldRotate(): math.angelref;
        getLocalMatrix(): gd3d.math.matrix3x2;
        getWorldMatrix(): gd3d.math.matrix3x2;
        setWorldPosition(pos: math.vector2): void;
        dispose(): void;
        renderer: IRectRenderer;
        components: C2DComponent[];
        update(delta: number): void;
        addComponentDirect(comp: I2DComponent): I2DComponent;
        getComponent(type: string): I2DComponent;
        getComponents(): I2DComponent[];
        getComponentsInChildren(type: string): I2DComponent[];
        private getNodeCompoents(node, _type, comps);
        addComponent(type: string): I2DComponent;
        removeComponent(comp: I2DComponent): void;
        removeComponentByTypeName(type: string): C2DComponent;
        removeAllComponents(): void;
        onCapturePointEvent(canvas: canvas, ev: PointEvent): void;
        ContainsPoint(p: math.vector2): boolean;
        ContainsCanvasPoint(pworld: math.vector2): boolean;
        onPointEvent(canvas: canvas, ev: PointEvent): void;
    }
}
declare namespace gd3d.framework {
    enum TransitionType {
        None = 0,
        ColorTint = 1,
        SpriteSwap = 2,
    }
    class button implements IRectRenderer {
        private _transition;
        transition: TransitionType;
        private _originalColor;
        private _originalSprite;
        private _targetImage;
        targetImage: image2D;
        private _pressedSprite;
        pressedGraphic: sprite;
        private _normalColor;
        normalColor: math.color;
        private _pressedColor;
        pressedColor: math.color;
        private _fadeDuration;
        fadeDuration: number;
        render(canvas: canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: transform2D;
        remove(): void;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
        onClick: UIEvent;
        private _downInThis;
        private _dragOut;
        private showNormal();
        private showPress();
        private changeColor(targetColor);
        private changeSprite(sprite);
    }
}
declare namespace gd3d.framework {
    class image2D implements IRectRenderer {
        constructor();
        private datar;
        private _sprite;
        color: math.color;
        mat: material;
        private _imageType;
        imageType: ImageType;
        private _fillMethod;
        fillMethod: FillMethod;
        private _fillAmmount;
        fillAmmount: FillMethod;
        setTexture(texture: texture, border?: math.border, rect?: math.rect): void;
        sprite: sprite;
        render(canvas: canvas): void;
        start(): void;
        update(delta: number): void;
        transform: transform2D;
        remove(): void;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
        private prepareData();
        updateTran(): void;
        private updateQuadData(x0, y0, x1, y1, x2, y2, x3, y3, quadIndex?, mirror?);
        private updateSimpleData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateSlicedData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateFilledData(x0, y0, x1, y1, x2, y2, x3, y3);
        private updateTiledData(x0, y0, x1, y1, x2, y2, x3, y3);
    }
    enum ImageType {
        Simple = 0,
        Sliced = 1,
        Tiled = 2,
        Filled = 3,
    }
    enum FillMethod {
        Horizontal = 0,
        Vertical = 1,
        Radial_90 = 2,
        Radial_180 = 3,
        Radial_360 = 4,
    }
}
declare namespace gd3d.framework {
    class label implements IRectRenderer {
        private _text;
        text: string;
        private _font;
        font: font;
        private _fontsize;
        fontsize: number;
        linespace: number;
        horizontalType: HorizontalType;
        verticalType: VerticalType;
        private indexarr;
        private remainarrx;
        updateData(_font: gd3d.framework.font): void;
        private data_begin;
        datar: number[];
        color: math.color;
        color2: math.color;
        mat: material;
        dirtyData: boolean;
        render(canvas: canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: transform2D;
        remove(): void;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
    }
    enum HorizontalType {
        Center = 0,
        Left = 1,
        Right = 2,
    }
    enum VerticalType {
        Center = 0,
        Top = 1,
        Boom = 2,
    }
}
declare namespace gd3d.framework {
    class rawImage2D implements IRectRenderer {
        private datar;
        _image: texture;
        image: texture;
        color: math.color;
        mat: material;
        render(canvas: canvas): void;
        updateTran(): void;
        start(): void;
        update(delta: number): void;
        transform: transform2D;
        remove(): void;
        onPointEvent(canvas: canvas, ev: PointEvent, oncap: boolean): void;
    }
}
declare namespace gd3d.framework {
    class resID {
        constructor();
        private static idAll;
        private static next();
        private id;
        getID(): number;
    }
    class constText {
        constructor(text: string);
        private name;
        getText(): string;
    }
    interface IAsset {
        defaultAsset: boolean;
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): any;
        caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    enum AssetTypeEnum {
        Unknown = 0,
        Auto = 1,
        Bundle = 2,
        GLVertexShader = 3,
        GLFragmentShader = 4,
        Shader = 5,
        Texture = 6,
        TextureDesc = 7,
        Mesh = 8,
        Prefab = 9,
        Material = 10,
        Aniclip = 11,
        Scene = 12,
        Atlas = 13,
        Font = 14,
        TextAsset = 15,
    }
    class stateLoad {
        iserror: boolean;
        isfinish: boolean;
        resstate: {
            [id: string]: {
                res: IAsset;
                state: number;
            };
        };
        curtask: number;
        totaltask: number;
        readonly progress: number;
        logs: string[];
        errs: Error[];
        url: string;
    }
    class assetBundle {
        name: string;
        private id;
        assetmgr: assetMgr;
        files: {
            name: string;
            length: number;
        }[];
        url: string;
        path: string;
        constructor(url: string);
        parse(json: any): void;
        unload(): void;
        load(assetmgr: assetMgr, onstate: (state: stateLoad) => void, state: stateLoad): void;
        mapNamed: {
            [id: string]: number;
        };
    }
    class assetMgr {
        app: application;
        webgl: WebGLRenderingContext;
        shaderPool: gd3d.render.shaderPool;
        defMesh: defMesh;
        constructor(app: application);
        initDefAsset(): void;
        mapShader: {
            [id: string]: shader;
        };
        getShader(name: string): shader;
        mapDefaultMesh: {
            [id: string]: mesh;
        };
        getDefaultMesh(name: string): mesh;
        mapDefaultTexture: {
            [id: string]: texture;
        };
        getDefaultTexture(name: string): texture;
        mapBundle: {
            [id: string]: assetBundle;
        };
        mapRes: {
            [id: number]: assetRef;
        };
        mapNamed: {
            [id: string]: number[];
        };
        getAsset(id: number): IAsset;
        getAssetByName(name: string, bundlename?: string): IAsset;
        getAssetBundle(bundlename: string): assetBundle;
        unuse(res: IAsset, disposeNow?: boolean): void;
        use(res: IAsset): void;
        releaseUnuseAsset(): void;
        getAssetsRefcount(): {
            [id: string]: number;
        };
        nameDuplicateCheck(name: string): boolean;
        private mapInLoad;
        removeAssetBundle(name: string): void;
        private assetUrlDic;
        getAssetUrl(asset: IAsset): string;
        loadSingleRes(url: string, type: AssetTypeEnum, onstate: (state: stateLoad) => void, state: stateLoad): void;
        private waitStateDic;
        doWaitState(name: string, state: stateLoad): void;
        load(url: string, type?: AssetTypeEnum, onstate?: (state: stateLoad) => void): void;
        unload(url: string, onstate?: () => void): void;
        loadScene(sceneName: string, onComplete: () => void): void;
        parseEffect(effectConfig: string, onComplete: (data: EffectSystemData) => void): void;
        private loadEffectDependAssets(dependAssets, path, onFinish);
        saveScene(fun: (data: SaveInfo, resourses?: string[]) => void): void;
        savePrefab(trans: transform, prefabName: string, fun: (data: SaveInfo, resourses?: string[]) => void): void;
        saveMaterial(mat: material, fun: (data: SaveInfo) => void): void;
        loadSingleResImmediate(url: string, type: AssetTypeEnum): any;
        loadImmediate(url: string, type?: AssetTypeEnum): any;
        getFileName(url: string): string;
        calcType(url: string): AssetTypeEnum;
    }
    class assetRef {
        asset: IAsset;
        refcount: number;
    }
    class SaveInfo {
        files: {
            [key: string]: string;
        };
    }
}
declare namespace gd3d.framework {
    class defMesh {
        static initDefaultMesh(assetmgr: assetMgr): void;
        private static createDefaultMesh(name, meshData, webgl);
    }
}
declare namespace gd3d.framework {
    class defShader {
        static vscode: string;
        static fscode: string;
        static fscode2: string;
        static fscodeui: string;
        static vscodeuifont: string;
        static fscodeuifont: string;
        static vsdiffuse: string;
        static fsdiffuse: string;
        static initDefaultShader(assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class defTexture {
        static initDefaultTexture(assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class animationClip implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        Parse(buf: ArrayBuffer): void;
        fps: number;
        loop: boolean;
        boneCount: number;
        bones: string[];
        frameCount: number;
        frames: {
            [fid: string]: Frame;
        };
        subclipCount: number;
        subclips: subClip[];
    }
    class Frame {
        key: boolean;
        boneInfos: PoseBoneMatrix[];
        caclByteLength(): number;
    }
    class PoseBoneMatrix {
        t: math.vector3;
        r: math.quaternion;
        static caclByteLength(): number;
        Clone(): PoseBoneMatrix;
        load(read: io.binReader): void;
        static createDefault(): PoseBoneMatrix;
        copyFrom(src: PoseBoneMatrix): void;
        invert(): void;
        lerpInWorld(_tpose: PoseBoneMatrix, from: PoseBoneMatrix, to: PoseBoneMatrix, v: number): void;
        static sMultiply(left: PoseBoneMatrix, right: PoseBoneMatrix, target?: PoseBoneMatrix): PoseBoneMatrix;
        static sLerp(left: PoseBoneMatrix, right: PoseBoneMatrix, v: number, target?: PoseBoneMatrix): PoseBoneMatrix;
    }
    class subClip {
        name: string;
        loop: boolean;
        startframe: number;
        endframe: number;
        static caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    class atlas implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        texturewidth: number;
        textureheight: number;
        private _texture;
        texture: texture;
        sprites: {
            [id: string]: sprite;
        };
        Parse(jsonStr: string, assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class font implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private _texture;
        texture: texture;
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
        Parse(jsonStr: string, assetmgr: assetMgr): void;
    }
    class charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
        xAddvance: number;
        static caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    class UniformData {
        type: render.UniformTypeEnum;
        value: any;
        defaultValue: any;
        constructor(type: render.UniformTypeEnum, value: any, defaultValue?: any);
    }
    class material implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        dispose(): void;
        use(): void;
        unuse(disposeNow?: boolean): void;
        caclByteLength(): number;
        initUniformData(passes: render.glDrawPass[]): void;
        setShader(shader: shader): void;
        getLayer(): RenderLayerEnum;
        getQueue(): number;
        getShader(): shader;
        private shader;
        mapUniform: {
            [id: string]: UniformData;
        };
        private mapUniformTemp;
        setFloat(_id: string, _number: number): void;
        setFloatv(_id: string, _numbers: Float32Array): void;
        setVector4(_id: string, _vector4: math.vector4): void;
        setVector4v(_id: string, _vector4v: Float32Array): void;
        setMatrix(_id: string, _matrix: math.matrix): void;
        setMatrixv(_id: string, _matrixv: Float32Array): void;
        setTexture(_id: string, _texture: gd3d.framework.texture): void;
        uploadUniform(pass: render.glDrawPass): void;
        draw(context: renderContext, mesh: mesh, sm: subMeshInfo, basetype?: string): void;
        Parse(assetmgr: assetMgr, json: any): void;
    }
}
declare namespace gd3d.framework {
    class mesh implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        glMesh: gd3d.render.glMesh;
        data: gd3d.render.meshData;
        submesh: subMeshInfo[];
        Parse(buf: ArrayBuffer, webgl: WebGLRenderingContext): void;
        intersects(ray: ray, matrix: gd3d.math.matrix): pickinfo;
    }
    class subMeshInfo {
        matIndex: number;
        useVertexIndex: number;
        line: boolean;
        start: number;
        size: number;
    }
}
declare namespace gd3d.framework {
    class prefab implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        assetbundle: string;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private trans;
        getCloneTrans(): transform;
        apply(trans: transform): void;
        jsonstr: string;
        Parse(jsonStr: string, assetmgr: assetMgr): void;
    }
}
declare namespace gd3d.framework {
    class rawscene implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        assetbundle: string;
        use(): void;
        unuse(disposeNow?: boolean): void;
        caclByteLength(): number;
        Parse(txt: string, assetmgr: assetMgr): void;
        getSceneRoot(): transform;
        useLightMap(scene: scene): void;
        dispose(): void;
        private rootNode;
        private lightmaps;
    }
}
declare namespace gd3d.framework {
    class shader implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        passes: {
            [id: string]: gd3d.render.glDrawPass[];
        };
        defaultValue: {
            [key: string]: {
                type: string;
                value?: any;
                defaultValue?: any;
                min?: number;
                max?: number;
            };
        };
        layer: RenderLayerEnum;
        queue: number;
        parse(assetmgr: assetMgr, json: any): void;
        private _parseProperties(assetmgr, properties);
        private _parsePass(assetmgr, json);
    }
}
declare namespace gd3d.framework {
    class sprite implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        caclByteLength(): number;
        private _texture;
        texture: texture;
        atlas: string;
        rect: math.rect;
        border: math.border;
        private _urange;
        private _vrange;
        readonly urange: math.vector2;
        readonly vrange: math.vector2;
    }
}
declare namespace gd3d.framework {
    class textasset implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(): void;
        dispose(): void;
        content: string;
        caclByteLength(): number;
    }
}
declare namespace gd3d.framework {
    class texture implements IAsset {
        private name;
        private id;
        defaultAsset: boolean;
        constructor(assetName?: string);
        getName(): string;
        getGUID(): number;
        use(): void;
        unuse(disposeNow?: boolean): void;
        dispose(): void;
        glTexture: gd3d.render.ITexture;
        caclByteLength(): number;
        private _realName;
        realName: string;
    }
}
declare namespace gd3d.framework {
    class AudioChannel {
        source: AudioBufferSourceNode;
        gainNode: GainNode;
        pannerNode: PannerNode;
        volume: number;
        isplay: boolean;
        stop(): void;
    }
    class AudioEx {
        private constructor();
        clickInit(): void;
        private static g_this;
        static instance(): AudioEx;
        audioContext: AudioContext;
        private static loadArrayBuffer(url, fun);
        isAvailable(): boolean;
        loadAudioBufferFromArrayBuffer(ab: ArrayBuffer, fun: (buf: AudioBuffer, _err: Error) => void): void;
        loadAudioBuffer(url: string, fun: (buf: AudioBuffer, _err: Error) => void): void;
        private getNewChannel();
        private getFreeChannelOnce();
        private channelOnce;
        playOnce(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        playOnceInterrupt(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        playOnceBlocking(name: string, buf: AudioBuffer, x?: number, y?: number, z?: number): AudioChannel;
        private channelLoop;
        playLooped(name: string, buf: AudioBuffer): void;
        stopLooped(name: string): void;
        private _soundVolume;
        setSoundVolume(val: number): void;
        private _musicVolume;
        setMusicVolume(val: number): void;
    }
}
declare namespace gd3d.framework {
    class aniplayer implements INodeComponent {
        gameObject: gameObject;
        private _clipnameCount;
        private _clipnames;
        readonly clipnames: {
            [key: string]: number;
        };
        clips: animationClip[];
        autoplay: boolean;
        private playIndex;
        private _playClip;
        bones: tPoseInfo[];
        startPos: PoseBoneMatrix[];
        tpose: {
            [key: string]: PoseBoneMatrix;
        };
        nowpose: {
            [key: string]: PoseBoneMatrix;
        };
        lerppose: {
            [key: string]: PoseBoneMatrix;
        };
        carelist: {
            [id: string]: transform;
        };
        private _playFrameid;
        _playTimer: number;
        speed: number;
        crossdelta: number;
        crossspeed: number;
        private beRevert;
        private playStyle;
        private percent;
        private init();
        start(): void;
        update(delta: number): void;
        playByIndex(animIndex: number, speed?: number, beRevert?: boolean): void;
        playCrossByIndex(animIndex: number, crosstimer: number, speed?: number, beRevert?: boolean): void;
        play(animName: string, speed?: number, beRevert?: boolean): void;
        playCross(animName: string, crosstimer: number, speed?: number, beRevert?: boolean): void;
        private playAniamtion(index, speed?, beRevert?);
        stop(): void;
        isPlay(): boolean;
        isStop(): boolean;
        remove(): void;
        clone(): void;
        private finishCallBack;
        private thisObject;
        addFinishedEventListener(finishCallBack: Function, thisObject: any): void;
        private checkFrameId(delay);
        fillPoseData(data: Float32Array, bones: transform[], efficient?: boolean): void;
        care(node: transform): void;
    }
    class tPoseInfo {
        name: string;
        tposep: math.vector3;
        tposeq: math.quaternion;
    }
    enum PlayStyle {
        NormalPlay = 0,
        FramePlay = 1,
        PingPang = 2,
    }
}
declare namespace gd3d.framework {
    class asbone implements INodeComponent {
        constructor();
        gameObject: gameObject;
        start(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    interface ICollider {
        gameObject: gameObject;
        subTran: transform;
        getBound(): any;
        intersectsTransform(tran: transform): boolean;
    }
    class boxcollider implements INodeComponent, ICollider {
        gameObject: gameObject;
        subTran: transform;
        filter: meshFilter;
        obb: obb;
        center: math.vector3;
        size: math.vector3;
        getBound(): obb;
        readonly matrix: gd3d.math.matrix;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        intersectsTransform(tran: transform): boolean;
        private build();
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    interface ICameraPostQueue {
        render(scene: scene, context: renderContext, camera: camera): any;
        renderTarget: render.glRenderTarget;
    }
    class cameraPostQueue_Depth implements ICameraPostQueue {
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    class cameraPostQueue_Quad implements ICameraPostQueue {
        material: material;
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    class cameraPostQueue_Color implements ICameraPostQueue {
        constructor();
        render(scene: scene, context: renderContext, camera: camera): void;
        renderTarget: render.glRenderTarget;
    }
    interface IOverLay {
        init: boolean;
        start(camera: camera): any;
        render(context: renderContext, assetmgr: assetMgr, camera: camera): any;
        update(delta: number): any;
    }
    class camera implements INodeComponent {
        gameObject: gameObject;
        private _near;
        near: number;
        private _far;
        far: number;
        isMainCamera: boolean;
        CullingMask: CullingMask;
        index: number;
        markDirty(): void;
        start(): void;
        update(delta: number): void;
        clearOption_Color: boolean;
        clearOption_Depth: boolean;
        backgroundColor: gd3d.math.color;
        viewport: gd3d.math.rect;
        renderTarget: gd3d.render.glRenderTarget;
        order: number;
        private overlays;
        addOverLay(overLay: IOverLay): void;
        addOverLayAt(overLay: IOverLay, index: number): void;
        getOverLays(): IOverLay[];
        removeOverLay(overLay: IOverLay): void;
        calcViewMatrix(matrix: gd3d.math.matrix): void;
        calcViewPortPixel(app: application, viewPortPixel: math.rect): void;
        calcProjectMatrix(asp: number, matrix: gd3d.math.matrix): void;
        creatRayByScreen(screenpos: gd3d.math.vector2, app: application): ray;
        calcWorldPosFromScreenPos(app: application, screenPos: math.vector3, outWorldPos: math.vector3): void;
        calcScreenPosFromWorldPos(app: application, worldPos: math.vector3, outScreenPos: math.vector2): void;
        private matView;
        private matProjP;
        private matProjO;
        private matProj;
        fov: number;
        size: number;
        opvalue: number;
        getPosAtXPanelInViewCoordinateByScreenPos(screenPos: gd3d.math.vector2, app: application, z: number, out: gd3d.math.vector2): void;
        fillRenderer(scene: scene): void;
        private _fillRenderer(scene, node);
        _targetAndViewport(target: render.glRenderTarget, scene: scene, context: renderContext, withoutClear: boolean): void;
        _renderOnce(scene: scene, context: renderContext, drawtype: string): void;
        postQueues: ICameraPostQueue[];
        renderScene(scene: scene, context: renderContext): void;
        remove(): void;
        clone(): void;
    }
    enum CullingMask {
        ui = 1,
        default = 2,
        editor = 4,
        model = 8,
        everything = 4294967295,
        nothing = 0,
        modelbeforeui = 8,
    }
}
declare namespace gd3d.framework {
    class effectSystem implements IRenderer {
        gameObject: gameObject;
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        queue: number;
        autoplay: boolean;
        beLoop: boolean;
        state: EffectPlayStateEnum;
        private curFrameId;
        frameId: number;
        static fps: number;
        private playTimer;
        private speed;
        private parser;
        vf: number;
        private effectBatchers;
        private particles;
        private matDataGroups;
        setEffect(effectConfig: string): void;
        jsonData: textasset;
        setJsonData(_jsonData: textasset): void;
        data: EffectSystemData;
        private _data;
        start(): void;
        update(delta: number): void;
        private _update(delta);
        mergeLerpAttribData(realUseCurFrameData: EffectAttrsData, curFrameData: EffectFrameData): void;
        private updateEffectBatcher(effectBatcher, curAttrsData, initFrameData, vertexStartIndex);
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        clone(): effectSystem;
        play(speed?: number): void;
        pause(): void;
        stop(): void;
        reset(): void;
        private addElements();
        private addInitFrame(elementData);
        private checkFrameId();
        remove(): void;
        readonly leftLifeTime: number;
    }
}
declare namespace gd3d.framework {
    enum LightTypeEnum {
        Direction = 0,
        Point = 1,
        Spot = 2,
    }
    class light implements INodeComponent {
        gameObject: gameObject;
        isOpen: boolean;
        lightName: string;
        type: LightTypeEnum;
        spotAngelCos: number;
        start(): void;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class meshcollider implements INodeComponent, ICollider {
        gameObject: gameObject;
        subTran: transform;
        mesh: mesh;
        getBound(): mesh;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        intersectsTransform(tran: transform): boolean;
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class meshFilter implements INodeComponent {
        gameObject: gameObject;
        start(): void;
        update(delta: number): void;
        private _mesh;
        mesh: mesh;
        getMeshOutput(): mesh;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class meshRenderer implements IRenderer {
        constructor();
        gameObject: gameObject;
        materials: material[];
        lightmapIndex: number;
        lightmapScaleOffset: math.vector4;
        layer: RenderLayerEnum;
        renderLayer: gd3d.framework.CullingMask;
        private issetq;
        _queue: number;
        queue: number;
        filter: meshFilter;
        start(): void;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class particleSystem implements IRenderer {
        particleData: ParticleData;
        camera: camera;
        private emission;
        private particleMesh;
        private material;
        particleMethodType: ParticleMethodType;
        private meshBatchers;
        private curBather;
        layer: RenderLayerEnum;
        queue: number;
        delayTime: number;
        isTrail: boolean;
        private startLifeTime;
        private timer;
        speed: number;
        private assetmgr;
        start(): void;
        private initByData(assetmgr);
        update(delta: number): void;
        render(context: gd3d.framework.renderContext, assetmgr: gd3d.framework.assetMgr, camera: gd3d.framework.camera): void;
        private batchervercountLimit;
        creatMeshbatcher(mat: gd3d.framework.material, needCount?: number): void;
        checkEmissionBatcher(emission: Emission, count?: number): void;
        remove(): void;
        clone(): void;
        gameObject: gd3d.framework.gameObject;
        renderLayer: CullingMask;
    }
    class Emission {
        emissionType: ParticleEmissionType;
        maxEmissionCount: number;
        emissionCount: number;
        burstDelayTime: number;
        emissionKeepTime: number;
        particleData: ParticleData;
        private curTime;
        private numcount;
        private b;
        private isover;
        private _continueSpaceTime;
        constructor(_type?: ParticleEmissionType, count?: number, time?: number);
        update(delta: number): boolean;
        isOver(): boolean;
    }
}
declare namespace gd3d.framework {
    class skinnedMeshRenderer implements IRenderer {
        constructor();
        gameObject: gameObject;
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        private issetq;
        _queue: number;
        queue: number;
        materials: material[];
        _player: aniplayer;
        readonly player: aniplayer;
        private _mesh;
        mesh: mesh;
        bones: transform[];
        rootBone: transform;
        center: math.vector3;
        size: math.vector3;
        maxBoneCount: number;
        private _skeletonMatrixData;
        private _efficient;
        start(): void;
        getMatByIndex(index: number): math.matrix;
        intersects(ray: ray): pickinfo;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        remove(): void;
        clone(): void;
        useBoneShader(mat: material): number;
    }
}
declare namespace gd3d.framework {
    class spherestruct {
        center: gd3d.math.vector3;
        radius: number;
        srcradius: number;
        private tempScale;
        constructor(_center: math.vector3, _r: number);
        update(worldmatrix: math.matrix): void;
        intersects(bound: any): boolean;
    }
    class spherecollider implements INodeComponent, ICollider {
        gameObject: gameObject;
        subTran: transform;
        filter: meshFilter;
        spherestruct: spherestruct;
        center: math.vector3;
        radius: number;
        getBound(): spherestruct;
        readonly matrix: gd3d.math.matrix;
        start(): void;
        update(delta: number): void;
        _colliderVisible: boolean;
        colliderVisible: boolean;
        intersectsTransform(tran: transform): boolean;
        private build();
        private buildMesh();
        private getColliderMesh();
        remove(): void;
        clone(): void;
    }
}
declare namespace gd3d.framework {
    class trailRender_recorde implements IRenderer {
        layer: RenderLayerEnum;
        renderLayer: gd3d.framework.CullingMask;
        queue: number;
        private _startWidth;
        private _endWidth;
        lifetime: number;
        minvertexDistance: number;
        maxvertexCout: number;
        private _material;
        private _startColor;
        private _endColor;
        private trailTrans;
        private nodes;
        private mesh;
        private dataForVbo;
        private dataForEbo;
        interpolate: boolean;
        material: gd3d.framework.material;
        startColor: gd3d.math.color;
        endColor: gd3d.math.color;
        setWidth(startWidth: number, endWidth?: number): void;
        start(): void;
        private app;
        private webgl;
        update(delta: number): void;
        gameObject: gameObject;
        remove(): void;
        private refreshTrailNode(curTime);
        private notRender;
        private updateTrailData(curTime);
        private checkBufferSize();
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        clone(): void;
    }
    class trailNode {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
        time: number;
        constructor(p: gd3d.math.vector3, updir: gd3d.math.vector3, t: number);
    }
}
declare namespace gd3d.framework {
    class trailRender implements IRenderer {
        layer: RenderLayerEnum;
        renderLayer: gd3d.framework.CullingMask;
        queue: number;
        private width;
        private _material;
        private _color;
        private mesh;
        private vertexcount;
        private dataForVbo;
        private dataForEbo;
        private sticks;
        start(): void;
        private app;
        private webgl;
        private path;
        update(delta: number): void;
        gameObject: gameObject;
        remove(): void;
        material: gd3d.framework.material;
        color: gd3d.math.color;
        setspeed(upspeed: number, lowspeed?: number): void;
        setWidth(Width: number): void;
        private initmesh();
        private speed;
        private lowspeed;
        private updateTrailData();
        render(context: renderContext, assetmgr: assetMgr, camera: camera): void;
        clone(): void;
    }
    class trailStick {
        location: gd3d.math.vector3;
        updir: gd3d.math.vector3;
        follow: trailPathNode;
        speed: number;
        followMove(delta: number): void;
    }
    class trailPathNode {
        pos: gd3d.math.vector3;
        updir: gd3d.math.vector3;
        next: trailPathNode;
    }
    class trailPath {
        add(): trailPathNode;
        end: trailPathNode;
    }
}
declare namespace gd3d.framework {
    class pointinfo {
        id: number;
        touch: boolean;
        x: number;
        y: number;
    }
    class inputMgr {
        private inputlast;
        point: pointinfo;
        touches: {
            [id: number]: pointinfo;
        };
        keyboardMap: {
            [id: number]: boolean;
        };
        constructor(app: application);
    }
}
declare namespace gd3d.io {
    class binBuffer {
        private _buf;
        private _seekWritePos;
        private _seekWriteIndex;
        private _seekReadPos;
        private _bufSize;
        getLength(): number;
        getBufLength(): number;
        getBytesAvailable(): number;
        constructor(bufSize?: number);
        read(target: Uint8Array | number[], offset?: number, length?: number): void;
        write(array: Uint8Array | number[], offset?: number, length?: number): void;
        getBuffer(): Uint8Array;
        getUint8Array(): Uint8Array;
    }
    class converter {
        static getApplyFun(value: any): any;
        private static dataView;
        static ULongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static LongToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float64ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Float32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int32ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Int8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint32toArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint16ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static Uint8ToArray(value: number, target?: Uint8Array | number[], offset?: number): Uint8Array | number[];
        static StringToUtf8Array(str: string): Uint8Array | number[];
        static ArrayToLong(buf: Uint8Array, offset?: number): number;
        static ArrayToULong(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat64(buf: Uint8Array, offset?: number): number;
        static ArrayToFloat32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt32(buf: Uint8Array, offset?: number): number;
        static ArrayToInt16(buf: Uint8Array, offset?: number): number;
        static ArrayToInt8(buf: Uint8Array, offset?: number): number;
        static ArraytoUint32(buf: Uint8Array, offset?: number): number;
        static ArrayToUint16(buf: Uint8Array, offset?: number): number;
        static ArrayToUint8(buf: Uint8Array, offset?: number): number;
        static ArrayToString(buf: Uint8Array, offset?: number): string;
    }
    class binTool extends binBuffer {
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
        readStringUtf8FixLength(length: number): string;
        readUTFBytes(length: number): string;
        readStringAnsi(): string;
        readonly length: number;
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
        writeBytes(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUint8Array(array: Uint8Array | number[], offset?: number, length?: number): void;
        writeUnsignedShort(num: number): void;
        writeUnsignedInt(num: number): void;
        writeFloat(num: number): void;
        writeUTFBytes(str: string): void;
        writeSymbolByte(num: number): void;
        writeShort(num: number): void;
        writeInt(num: number): void;
    }
}
declare namespace gd3d.io {
    function cloneObj(instanceObj: any, clonedObj?: any): any;
    function fillCloneReference(instanceObj: any, clonedObj: any): any;
    function fillCloneReferenceTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    function fillCloneReferenceType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
    function _cloneObj(instanceObj: any, clonedObj?: any): any;
    function cloneOtherTypeOrArray(instanceObj: any, clonedObj: any, key: string): void;
    function cloneOtherType(instanceObj: any, clonedObj: any, key: string, instanceParent?: any, clonedParent?: any, instanceKey?: string): void;
}
declare namespace gd3d.io {
    function stringToBlob(content: string): Blob;
    function stringToUtf8Array(str: string): number[];
}
declare namespace gd3d.io {
    class SerializeDependent {
        static resoursePaths: string[];
        static GetAssetUrl(asset: any, assetMgr: any): void;
    }
    function SerializeForInspector(obj: any): string;
    function serializeObjForInspector(instanceObj: any, beComponent: boolean, serializedObj?: any): any;
    function serializeOtherTypeOrArrayForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean): void;
    function serializeOtherTypeForInspector(instanceObj: any, serializedObj: any, key: string, beComponent: boolean, arrayInst?: any): void;
    function Serialize(obj: any, assetMgr?: any): string;
    function serializeObj(instanceObj: any, serializedObj?: any, assetMgr?: any): any;
    function serializeOtherTypeOrArray(instanceObj: any, serializedObj: any, key: string, assetMgr?: any): void;
    function serializeOtherType(instanceObj: any, serializedObj: any, key: string, arrayInst?: any, assetMgr?: any): void;
    function deSerialize(serializedObj: string, instanceObj: any, assetMgr: any, bundlename?: string): void;
    function fillReference(serializedObj: any, instanceObj: any): void;
    function dofillReferenceOrArray(serializedObj: any, instanceObj: any, key: string): void;
    function dofillReference(serializedObj: any, instanceObj: any, key: string): void;
    function deSerializeObj(serializedObj: any, instanceObj: any, assetMgr: any, bundlename?: string): void;
    function deSerializeOtherTypeOrArray(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    function deSerializeOtherType(serializedObj: any, instanceObj: any, key: string, assetMgr: any, bundlename?: string): void;
    function isArray(type: string): boolean;
    function isArrayOrDic(type: string): boolean;
    function isAsset(type: string): boolean;
    function isAssetInspector(type: string): boolean;
    class referenceInfo {
        static oldmap: {
            [id: number]: any;
        };
        static regtypelist: string[];
        static regDefaultType(): void;
        static regType(type: string): void;
        static isRegType(type: string): boolean;
    }
    class enumMgr {
        static enumMap: {
            [id: string]: any;
        };
    }
}
declare namespace gd3d.io {
    class binReader {
        private _data;
        constructor(buf: ArrayBuffer, seek?: number);
        private _seek;
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
        position: number;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(target?: Uint8Array, offset?: number, length?: number): Uint8Array;
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
        private sureData(addlen);
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
        readonly length: number;
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
    function matrixGetTranslation(src: matrix, out: vector3): void;
    function matrixTranspose(src: matrix, out: matrix): void;
    function matrixDecompose(src: matrix, scale: vector3, rotation: quaternion, translation: vector3): boolean;
    class angelref {
        v: number;
    }
    function matrix3x2Decompose(src: matrix3x2, scale: vector2, rotation: angelref, translation: vector2): boolean;
    function matrix2Quaternion(matrix: matrix, result: quaternion): void;
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
    function matrixMakeRotateAxisAngle(axis: vector3, angle: number, out: matrix): void;
    function matrix3x2MakeRotate(angle: number, out: matrix3x2): void;
    function matrixMultiply(lhs: matrix, rhs: matrix, out: matrix): void;
    function matrix3x2Multiply(lhs: matrix3x2, rhs: matrix3x2, out: matrix3x2): void;
    function matrixProject_PerspectiveLH(fov: number, aspect: number, znear: number, zfar: number, out: matrix): void;
    function matrixProject_OrthoLH(width: number, height: number, znear: number, zfar: number, out: matrix): void;
    function matrixLookatLH(forward: vector3, up: vector3, out: matrix): void;
    function matrixViewLookatLH(eye: vector3, forward: vector3, up: vector3, out: matrix): void;
    function matrixLerp(left: matrix, right: matrix, v: number, out: matrix): void;
    function matrixTransformVector3(vector: vector3, transformation: matrix, result: vector3): void;
    function matrixTransformNormal(vector: vector3, transformation: matrix, result: vector3): void;
    function matrixGetVector3ByOffset(src: matrix, offset: number, result: vector3): void;
    function matrixReset(mat: matrix): void;
    function matrixZero(mat: matrix): void;
    function matrixScaleByNum(value: number, mat: matrix): void;
    function matrixAdd(left: matrix, right: matrix, out: matrix): void;
}
declare namespace gd3d.math {
    function floatClamp(v: number, min?: number, max?: number): number;
    function sign(value: number): number;
    function getKeyCodeByAscii(ev: KeyboardEvent): number;
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
    function quatNormalize(src: quaternion, out: quaternion): void;
    function quatTransformVector(src: quaternion, vector: vector3, out: vector3): void;
    function quatMagnitude(src: quaternion): number;
    function quatClone(src: quaternion, out: quaternion): void;
    function quatToMatrix(src: quaternion, out: matrix): void;
    function quatInverse(src: quaternion, out: quaternion): void;
    function quatFromYawPitchRoll(yaw: number, pitch: number, roll: number, result: quaternion): void;
    function quatMultiply(srca: quaternion, srcb: quaternion, out: quaternion): void;
    function quatMultiplyVector(vector: vector3, scr: quaternion, out: quaternion): void;
    function quatLerp(srca: quaternion, srcb: quaternion, out: quaternion, t: number): void;
    function quatFromAxisAngle(axis: vector3, angle: number, out: quaternion): void;
    function quatToAxisAngle(src: quaternion, axis: vector3): number;
    function quatFromEulerAngles(ax: number, ay: number, az: number, out: quaternion): void;
    function quatToEulerAngles(src: quaternion, out: vector3): void;
    function quatReset(src: quaternion): void;
    function quatLookat(pos: vector3, targetpos: vector3, out: quaternion): void;
    function quat2Lookat(pos: vector3, targetpos: vector3, out: quaternion): void;
    function quatYAxis(pos: vector3, targetpos: vector3, out: quaternion): void;
}
declare namespace gd3d.math {
    function rectSet_One(out: rect): void;
    function rectSet_Zero(out: rect): void;
    function rectEqul(src1: rect, src2: rect): boolean;
    function rectInner(x: number, y: number, src: rect): boolean;
}
declare namespace gd3d.math {
    function caclStringByteLength(value: string): number;
}
declare namespace gd3d.math {
    function spriteAnimation(row: number, column: number, index: number, out: vector4): void;
}
declare namespace gd3d.math {
    function vec2Subtract(a: vector2, b: vector2, out: vector2): void;
    function vec2Add(a: vector2, b: vector2, out: vector2): void;
    function vec2Clone(from: vector2, to: vector2): void;
    function vec2Distance(a: vector2, b: vector2): number;
    function vec2ScaleByNum(from: vector2, scale: number, out: vector2): void;
    function vec4Clone(from: vector4, to: vector4): void;
    function vec2Length(a: vector2): number;
    function vec2SLerp(vector: vector2, vector2: vector2, v: number, out: vector2): void;
    function vec2Normalize(from: vector2, out: vector2): void;
    function vec2Multiply(a: vector2, b: vector2): number;
    function vec2Equal(vector: vector2, vector2: vector2, threshold?: number): boolean;
}
declare namespace gd3d.math {
    function vec3Clone(from: vector3, to: vector3): void;
    function vec3ToString(result: string): void;
    function vec3Add(a: vector3, b: vector3, out: vector3): void;
    function vec3Subtract(a: vector3, b: vector3, out: vector3): void;
    function vec3Minus(a: vector3, out: vector3): void;
    function vec3Length(a: vector3): number;
    function vec3SqrLength(value: vector3): number;
    function vec3Set_One(value: vector3): void;
    function vec3Set_Forward(value: vector3): void;
    function vec3Set_Back(value: vector3): void;
    function vec3Set_Up(value: vector3): void;
    function vec3Set_Down(value: vector3): void;
    function vec3Set_Left(value: vector3): void;
    function vec3Set_Right(value: vector3): void;
    function vec3Normalize(value: vector3, out: vector3): void;
    function vec3ScaleByVec3(from: vector3, scale: vector3, out: vector3): void;
    function vec3ScaleByNum(from: vector3, scale: number, out: vector3): void;
    function vec3Product(a: vector3, b: vector3, out: vector3): void;
    function vec3Cross(lhs: vector3, rhs: vector3, out: vector3): void;
    function vec3Reflect(inDirection: vector3, inNormal: vector3, out: vector3): void;
    function vec3Dot(lhs: vector3, rhs: vector3): number;
    function vec3Project(vector: vector3, onNormal: vector3, out: vector3): void;
    function vec3ProjectOnPlane(vector: vector3, planeNormal: vector3, out: vector3): void;
    function vec3Exclude(excludeThis: vector3, fromThat: vector3, out: vector3): void;
    function vec3Angle(from: vector3, to: vector3): number;
    function vec3Distance(a: vector3, b: vector3): number;
    function vec3ClampLength(vector: vector3, maxLength: number, out: vector3): void;
    function vec3Min(lhs: vector3, rhs: vector3, out: vector3): void;
    function vec3Max(lhs: vector3, rhs: vector3, out: vector3): void;
    function vec3AngleBetween(from: vector3, to: vector3): number;
    function vec3Reset(val: vector3): void;
    function vec3SLerp(vector: vector3, vector2: vector3, v: number, out: vector3): void;
    function vec3SetByFloat(x: number, y: number, z: number, out: vector3): void;
    function vec3Format(vector: vector3, maxDot: number, out: vector3): void;
    function quaternionFormat(vector: quaternion, maxDot: number, out: quaternion): void;
    function floatFormat(num: number, maxDot: number): number;
    function vec3Equal(vector: vector3, vector2: vector3, threshold?: number): boolean;
}
declare namespace gd3d.framework {
    class EffectSystemData {
        life: number;
        elements: EffectElementData[];
        clone(): EffectSystemData;
        dispose(): void;
    }
    class EffectElement {
        gameobject: transform;
        data: EffectElementData;
        name: string;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        ref: string;
        actions: IEffectAction[];
        curAttrData: EffectAttrsData;
        effectBatcher: EffectBatcher;
        startIndex: number;
        actionActive: boolean;
        loopFrame: number;
        active: boolean;
        constructor(_data: EffectElementData);
        private recordElementLerpAttributes();
        private recordLerpValues(effectFrameData);
        private recordLerp(effectFrameData, lerpData, key);
        initActions(): void;
        update(): void;
        private updateElementRotation();
        isActiveFrame(frameIndex: number): boolean;
        setActive(_active: boolean): void;
        dispose(): void;
    }
    class EffectElementData {
        name: string;
        type: EffectElementTypeEnum;
        timelineFrame: {
            [frameIndex: number]: EffectFrameData;
        };
        initFrameData: EffectFrameData;
        ref: string;
        actionData: EffectActionData[];
        emissionData: EmissionNew;
        clone(): EffectElementData;
        dispose(): void;
    }
    class EffectAttrsData {
        pos: math.vector3;
        euler: math.vector3;
        color: math.vector3;
        scale: math.vector3;
        uv: math.vector2;
        alpha: number;
        mat: EffectMatData;
        renderModel: RenderModel;
        matrix: math.matrix;
        tilling: math.vector2;
        rotationByEuler: math.quaternion;
        startEuler: math.vector3;
        startRotation: math.quaternion;
        localRotation: math.quaternion;
        mesh: mesh;
        meshdataVbo: Float32Array;
        setLerpAttribute(attribute: string, val: any): void;
        getAttribute(attribute: string): any;
        initAttribute(attribute: string): void;
        resetMatrix(): void;
        clone(): EffectAttrsData;
    }
    class EffectFrameData {
        frameIndex: number;
        attrsData: EffectAttrsData;
        lerpDatas: EffectLerpData[];
        clone(): EffectFrameData;
        dispose(): void;
    }
    class EffectLerpData {
        type: EffectLerpTypeEnum;
        fromFrame: number;
        toFrame: ValueData;
        attrsData: EffectAttrsData;
        attrsList: any[];
        clone(): EffectLerpData;
    }
    class EffectActionData {
        actionType: string;
        startFrame: number;
        endFrame: number;
        params: any[];
        clone(): EffectActionData;
    }
    class EffectMatData {
        shader: shader;
        diffuseTexture: texture;
        alphaCut: number;
        static beEqual(data0: EffectMatData, data1: EffectMatData): boolean;
        clone(): EffectMatData;
    }
    class EffectBatcher {
        mesh: mesh;
        mat: material;
        beBufferInited: boolean;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        effectElements: EffectElement[];
        private _totalVertexCount;
        curTotalVertexCount: number;
        private _indexStartIndex;
        indexStartIndex: number;
        private _vbosize;
        resizeVboSize(value: number): void;
        dispose(): void;
        vertexSize: number;
        constructor(formate: number);
    }
    enum EffectPlayStateEnum {
        None = 0,
        BeReady = 1,
        Play = 2,
        Pause = 3,
        Stop = 4,
        Dispose = 5,
    }
    enum EffectElementTypeEnum {
        SingleMeshType = 0,
        EmissionType = 1,
        MultiMeshType = 2,
    }
    enum EffectLerpTypeEnum {
        Linear = 0,
    }
}
declare namespace gd3d.framework {
    class EffectData {
        name: string;
        particlelist: Array<ParticleData>;
        dependImgList: Array<string>;
        dependShapeList: Array<string>;
        constructor();
    }
}
declare namespace gd3d.framework {
    enum ParticleEmissionType {
        burst = 0,
        continue = 1,
    }
    class EmissionData {
        type: ParticleEmissionType;
        emissionName: string;
        time: number;
        count: number;
        constructor();
    }
}
declare namespace gd3d.framework {
    class EmissionNew {
        emissionType: ParticleEmissionType;
        maxEmissionCount: number;
        emissionCount: number;
        time: number;
        pos: ParticleNode;
        moveSpeed: ParticleNode;
        gravity: number;
        euler: ParticleNode;
        eulerNodes: Array<ParticleNode>;
        eulerSpeed: ParticleNode;
        scale: ParticleNode;
        scaleNodes: Array<ParticleNode>;
        scaleSpeed: ParticleNode;
        color: ParticleNode;
        colorNodes: Array<ParticleNode>;
        colorSpeed: ParticleNode;
        simulationSpeed: ParticleNodeNumber;
        alpha: ParticleNodeNumber;
        alphaNodes: Array<ParticleNodeNumber>;
        alphaSpeed: ParticleNodeNumber;
        uv: ParticleNodeVec2;
        uvType: UVTypeEnum;
        uvRoll: UVRollNew;
        uvSprite: UVSpriteNew;
        mat: EffectMatData;
        life: ValueData;
        renderModel: RenderModel;
        mesh: mesh;
        particleStartData: gd3d.framework.ParticleStartData;
        private dataForVbo;
        getVboData(vf: number): Float32Array;
        clone(): EmissionNew;
        cloneParticleNodeArray(_array: Array<ParticleNode>): ParticleNode[];
        cloneParticleNodeNumberArray(_array: Array<ParticleNodeNumber>): ParticleNodeNumber[];
    }
    class UVSpriteNew {
        row: number;
        column: number;
        fps: number;
        clone(): UVSpriteNew;
    }
    class UVRollNew {
        uvSpeed: UVSpeedNode;
        uvSpeedNodes: Array<UVSpeedNode>;
        clone(): UVRollNew;
    }
    enum UVTypeEnum {
        NONE = 0,
        UVRoll = 1,
        UVSprite = 2,
    }
}
declare namespace gd3d.framework {
    class MaterialData {
        name: string;
        shaderName: string;
        diffuseTexture: string;
        tiling: gd3d.math.vector2;
        offset: gd3d.math.vector2;
        alphaCut: number;
        mapData: {
            [id: string]: any;
        };
        constructor();
    }
}
declare namespace gd3d.framework {
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
    class AlphaNode {
        alpha: ValueData;
        key: number;
        getValue(): number;
    }
    class UVSpeedNode {
        u: ValueData;
        v: ValueData;
        key: number;
        getValue(): gd3d.math.vector2;
        getValueRandom(): gd3d.math.vector2;
        clone(): UVSpeedNode;
    }
    class ParticleNodeVec2 {
        x: ValueData;
        y: ValueData;
        key: number;
        getValue(): gd3d.math.vector2;
        getValueRandom(): gd3d.math.vector2;
        clone(): ParticleNodeVec2;
    }
    class ParticleNodeNumber {
        num: ValueData;
        key: number;
        getValue(): number;
        getValueRandom(): number;
        clone(): ParticleNodeNumber;
    }
}
declare namespace gd3d.framework {
    enum ParticleSystemShape {
        NORMAL = 0,
        BOX = 1,
        SPHERE = 2,
        HEMISPHERE = 3,
        CONE = 4,
        EDGE = 5,
        CIRCLE = 6,
    }
    class ParticleStartData {
        shapeType: ParticleSystemShape;
        private _position;
        position: gd3d.math.vector3;
        private _direction;
        direction: gd3d.math.vector3;
        private _width;
        width: number;
        private _bottomRadius;
        bottomRadius: number;
        private _height;
        height: number;
        depth: number;
        private _radius;
        radius: number;
        private _angle;
        angle: number;
        randomPosition: gd3d.math.vector3;
        private _randomDirection;
        readonly randomDirection: gd3d.math.vector3;
        private _boxDirection;
        readonly boxDirection: gd3d.math.vector3;
        private _sphereDirection;
        readonly sphereDirection: gd3d.math.vector3;
        private _hemisphereDirection;
        readonly hemisphereDirection: gd3d.math.vector3;
        private bottomRidus;
        private _coneDirection;
        readonly coneDirection: gd3d.math.vector3;
        private _circleDirection;
        readonly circleDirection: gd3d.math.vector3;
        private _edgeDirection;
        readonly edgeDirection: math.vector3;
        constructor();
        private getRandomPosition(dir, length);
        clone(): ParticleStartData;
    }
}
declare namespace gd3d.framework {
    enum RenderModel {
        None = 0,
        BillBoard = 1,
        StretchedBillBoard = 2,
        HorizontalBillBoard = 3,
        VerticalBillBoard = 4,
        Mesh = 5,
    }
    enum ParticleCurveType {
        LINEAR = 0,
        CURVE = 1,
    }
    class ParticleData {
        emissionData: EmissionData;
        materialData: MaterialData;
        particleDetailData: ParticleDetailData;
        constructor();
    }
    enum ParticleMethodType {
        Normal = 0,
        UVSPRITE = 1,
        UVROLL = 2,
    }
    class ParticleDetailData {
        name: string;
        renderModel: RenderModel;
        bindAxis: boolean;
        bindx: boolean;
        bindy: boolean;
        bindz: boolean;
        type: string;
        meshName: string;
        isLoop: boolean;
        isLookAtCamera: boolean;
        gravity: ValueData;
        gravitySpeed: ValueData;
        life: ValueData;
        speed: ValueData;
        startPitchYawRoll: ParticleNode;
        angularVelocity: ParticleNode;
        velocity: ParticleNode;
        acceleration: ParticleNode;
        scale: ParticleNode;
        scaleNode: Array<ParticleNode>;
        color: ParticleNode;
        colorNode: Array<ParticleNode>;
        alpha: ValueData;
        alphaNode: Array<AlphaNode>;
        positionNode: Array<ParticleNode>;
        particleStartData: gd3d.framework.ParticleStartData;
        isRotation: boolean;
        infinite: boolean;
        delayTime: ValueData;
        interpolationType: ParticleCurveType;
        uvSprite: UVSprite;
        uvRoll: UVRoll;
        particleMethodType: ParticleMethodType;
        istrail: boolean;
        angleSpeedForbillboard: ValueData;
        constructor();
    }
    class UVSprite {
        row: number;
        column: number;
        frameOverLifeTime: number;
        startFrame: number;
        cycles: number;
    }
    class UVRoll {
        uvSpeed: UVSpeedNode;
        uvSpeedNodes: Array<UVSpeedNode>;
    }
}
declare namespace gd3d.framework {
    class ValueData {
        isRandom: boolean;
        private _value;
        private _valueLimitMin;
        private _valueLimitMax;
        private beInited;
        value: number;
        valueLimitMin: number;
        valueLimitMax: number;
        clone(): ValueData;
        getValue(): number;
        getValueRandom(): number;
        constructor();
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
    }
}
declare namespace gd3d.framework {
    class Curve3 {
        private _beizerPoints;
        private _bezierPointNum;
        beizerPoints: gd3d.math.vector3[];
        bezierPointNum: number;
        static CreateLinearBezier(start: gd3d.math.vector3, end: gd3d.math.vector3, indices: number): Curve3;
        static GetLerpBezier(nodes: gd3d.framework.ParticleNode[]): Curve3;
        static CreateQuadraticBezier(v0: gd3d.math.vector3, v1: gd3d.math.vector3, v2: gd3d.math.vector3, bezierPointNum: number): Curve3;
        static CreateCubicBezier(v0: gd3d.math.vector3, v1: gd3d.math.vector3, v2: gd3d.math.vector3, v3: gd3d.math.vector3, bezierPointNum: number): Curve3;
        constructor(points: gd3d.math.vector3[], nbPoints: number);
        getPoints(): math.vector3[];
    }
}
declare namespace gd3d.framework {
    interface IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): any;
        update(frameIndex: number): any;
    }
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
    class DestroyAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
    class LoopAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
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
    class UVSpriteAnimationAction implements IEffectAction {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        fps: number;
        row: number;
        colum: number;
        private frameInternal;
        private spriteIndex;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement): void;
        update(frameIndex: number): void;
    }
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
    class EffectParser {
        asMgr: assetMgr;
        Parse(str: string, assetmgr: assetMgr): EffectSystemData;
        _parseSingleMeshTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionTypeData(elementData: any, element: EffectElementData): void;
        _parseEmissionShape(_startdata: any, element: EffectElementData): void;
        _parseToObjData(attrib: string, content: any): any;
        _parseToParticleNode(content: string): ParticleNode;
        _parseToValueData(content: string): ValueData;
        _parseToNumberArray(content: string): number[];
    }
}
declare namespace gd3d.framework {
    class EffectUtil {
        static RandomRange(min: number, max: number, isInteger?: boolean): number;
        static vecMuliNum(vec: gd3d.math.vector3, num: number): gd3d.math.vector3;
        static parseEffectVec3(value: any): ParticleNode;
        static parseEffectVec2(value: any): ParticleNodeVec2;
        static parseEffectNum(value: any): ParticleNodeNumber;
        static parseEffectValueData(value: any): ValueData;
        static parseEffectUVSpeed(value: any): UVSpeedNode;
        static lookat(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up?: gd3d.math.vector3): void;
        static RotateVector3(source: gd3d.math.vector3, direction: gd3d.math.vector3, out: gd3d.math.vector3): void;
        static bindAxisBillboard(localAxis: gd3d.math.vector3, out: gd3d.math.quaternion): void;
        static lookatVerticalBillboard(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up?: gd3d.math.vector3): void;
        static quatLookatZ(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, forward?: gd3d.math.vector3): void;
        static quatLookatX(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, right?: gd3d.math.vector3): void;
    }
}
declare namespace gd3d.framework {
    class MeshBatcher {
        groupMesh: gd3d.framework.mesh;
        camera: gd3d.framework.camera;
        bufferInit: boolean;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        _material: gd3d.framework.material;
        particleSystem: particleSystem;
        private listUVSPeedNode;
        private _vercount;
        readonly vercount: number;
        private _indexcount;
        readonly indexcount: number;
        parlist: Array<Particle>;
        private _maxvercount;
        maxvercount: number;
        constructor(mat: material, maxvercout: number, particle: particleSystem);
        private vf;
        private total;
        AddP(particle: Particle): void;
        addParticle(particleMesh: gd3d.framework.mesh, particleData: gd3d.framework.ParticleData): Particle;
        update(delta: number): void;
        render(context: gd3d.framework.renderContext, assetmgr: gd3d.framework.assetMgr): void;
        bdispose: boolean;
        dispose(): void;
    }
    class Particle {
        vertexStartIndex: number;
        isinit: boolean;
        mesh: gd3d.framework.mesh;
        vertexArr: Float32Array;
        private meshBatcherWorldMatrix;
        private particleSyTrans;
        private centerPosition;
        private _localTranslate;
        localTranslate: gd3d.math.vector3;
        private startAlphaNode;
        private curAlphaNode;
        private _alpha;
        alpha: number;
        private listAlphaNode;
        private startScaleNode;
        private curScaleNode;
        private _scale;
        private _scale_temp;
        localScale: gd3d.math.vector3;
        private listScaleNode;
        private startUVSpeedNode;
        private CurUVSpeedNode;
        private _uvSpeed;
        private _uvSpeed_temp;
        uvSpeed: gd3d.math.vector2;
        private listUvSpeedNode;
        private _alive;
        private startColorNode;
        private curColorNode;
        private _color;
        private _color_temp;
        color: gd3d.math.vector4;
        private listColorNode;
        private curve;
        alive: boolean;
        private lifeTime;
        private curlifeTime;
        readonly lifeLocation: number;
        private isloop;
        private lookatcam;
        private infinite;
        private speed;
        private speedDir;
        private particleDetailData;
        materialData: MaterialData;
        private meshBatcher;
        private curTime;
        private delayTime;
        private time;
        private renderModel;
        private velocity;
        private acceleration;
        private angularVelocity;
        private angularVelocityForBillboard;
        gravitySpeed: number;
        gravityModifier: number;
        private localAxisX;
        private localAxisY;
        private localAxisZ;
        private camera;
        private cameraTransform;
        private startPosition;
        private curPosition;
        private isRotation;
        private startPitchYawRoll;
        private rotation_start;
        private rotation_shape;
        private rotationToCamera;
        private rotation_overLifetime;
        private rotation_overLifetime_temp;
        private rotation;
        private localRotation;
        private worldRotation;
        localMatrix: gd3d.math.matrix;
        worldMatrix: gd3d.math.matrix;
        private interpType;
        private bindAxis;
        private bindx;
        private bindy;
        private bindz;
        trailMatrix: gd3d.math.matrix;
        constructor(_shape: gd3d.framework.mesh, particleData: gd3d.framework.ParticleData, MeshBatcher: MeshBatcher);
        private recordTrailMatrix();
        parseByData(): void;
        private RotAngle;
        private updaterot(delta);
        updatematrix(): void;
        addUVSpeedNode(node: EffectUVSpeedNode): void;
        resetMatrix(): void;
        addAlphaNode(node: EffectAlphaNode): void;
        addColorNode(node: EffectColorNode): void;
        addScaleNode(node: EffectScaleNode): void;
        updategravity(deltaTime: number): void;
        private displacement;
        private updateForce(delta);
        private _tempVec3;
        updateposition(deltaTime: number): void;
        updatescale(deltaTime: number): void;
        curTextureOffset: gd3d.math.vector4;
        private updateUV(deltaTime);
        private updateUVSpriteAnimation(deltaTime);
        updatecolor(deltaTime: number): void;
        updatelifetime(deltaTime: number): boolean;
        update(delta: number): void;
        clear(): void;
        dispose(): void;
    }
    class EffectColorNode {
        lifeLocation: number;
        keyColor: gd3d.math.vector3;
        constructor(_location: number, _color: gd3d.math.vector3);
    }
    class EffectScaleNode {
        lifeLocation: number;
        keyScale: gd3d.math.vector3;
        constructor(_location: number, _scale: gd3d.math.vector3);
    }
    class EffectAlphaNode {
        lifeLocation: number;
        keyAlpha: number;
        constructor(_location: number, _keyAlpha: number);
    }
    class EffectUVSpeedNode {
        lifelocation: number;
        keyUVSpeed: gd3d.math.vector2;
        constructor(_location: number, _uvSpeed: gd3d.math.vector2);
    }
}
declare namespace gd3d.framework {
    class ParticleLoader {
        private emisssionMap;
        private materialMap;
        particleMap: {
            [name: string]: any;
        };
        load(indexurl: string, callback: (effecsystemdata: EffectData) => void): void;
        loadEmission(baseUrl: string, callback: (emissionArray: Array<EmissionData>, _err: Error) => void): void;
        loadMatrial(indexurl: string, callback: (material: Array<MaterialData>, _err: Error) => void): void;
        loadParticle(indexurl: string, callback: (p: Array<ParticleDetailData>, _err: Error) => void): void;
    }
}
declare namespace gd3d.framework {
    class Particles {
        gameObject: gameObject;
        name: string;
        emissionElements: EmissionElement[];
        private vf;
        effectSys: effectSystem;
        loopFrame: number;
        constructor(sys: effectSystem);
        addEmission(_emissionNew: EmissionNew): void;
        update(delta: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
    }
    class EmissionElement {
        gameObject: gameObject;
        emissionBatchers: EmissionBatcher[];
        active: boolean;
        emissionNew: EmissionNew;
        private vf;
        private curTime;
        private numcount;
        private isover;
        private _continueSpaceTime;
        effectSys: effectSystem;
        constructor(_emissionNew: EmissionNew, sys: effectSystem);
        update(delta: number): void;
        updateBatcher(delta: number): void;
        updateEmission(delta: number): void;
        addParticle(count?: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
        isOver(): boolean;
    }
    class EmissionBatcher {
        gameObject: gameObject;
        data: EmissionNew;
        mesh: mesh;
        mat: material;
        beBufferInited: boolean;
        beAddParticle: boolean;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        particles: ParticleNew1[];
        vertexSize: number;
        formate: number;
        effectSys: effectSystem;
        constructor(_data: EmissionNew, effectSys: effectSystem);
        curVerCount: number;
        curIndexCount: number;
        addParticle(): void;
        private _totalVertexCount;
        curTotalVertexCount: number;
        private _indexStartIndex;
        indexStartIndex: number;
        update(delta: number): void;
        private _vbosize;
        resizeVboSize(value: number): void;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): void;
        dispose(): void;
    }
    class ParticleNew1 {
        gameObject: gameObject;
        localTranslate: math.vector3;
        euler: math.vector3;
        color: math.vector3;
        scale: math.vector3;
        uv: math.vector2;
        alpha: number;
        mat: EffectMatData;
        renderModel: RenderModel;
        matrix: math.matrix;
        tilling: math.vector2;
        rotationByEuler: math.quaternion;
        localRotation: math.quaternion;
        rotationByShape: math.quaternion;
        private startPitchYawRoll;
        rotation_start: gd3d.math.quaternion;
        vertexStartIndex: number;
        dataForVbo: Float32Array;
        sourceVbo: Float32Array;
        dataForEbo: Uint16Array;
        data: EmissionNew;
        private vertexCount;
        private vertexSize;
        private curLife;
        private format;
        private uvSpriteFrameInternal;
        private batcher;
        private speedDir;
        private simulationSpeed;
        constructor(batcher: EmissionBatcher);
        uploadData(array: Float32Array): void;
        initByData(): void;
        update(delta: number): void;
        private _updateLocalMatrix(delta);
        private _updateRotation(delta);
        private _updateElementRotation();
        private _updatePos(delta);
        private _updateEuler(delta);
        private _startNode;
        private endNode;
        private _updateScale(delta);
        private _updateColor(delta);
        private tempStartNode;
        private tempEndNode;
        private _updateNode(nodes, life, out);
        private _startNodeNum;
        private _curNodeNum;
        private _updateAlpha(delta);
        private _startUVSpeedNode;
        private _curUVSpeedNode;
        private spriteIndex;
        private _updateUV(delta);
        private _updateVBO();
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class TrailSection {
        point: gd3d.math.vector3;
        upDir: gd3d.math.vector3;
        time: number;
        constructor(p?: gd3d.math.vector3, t?: number);
    }
    class Color {
        a: number;
        r: number;
        g: number;
        b: number;
        static white(): Color;
        static black(): Color;
        static red(): Color;
        static green(): Color;
        static blue(): Color;
        constructor(r?: number, g?: number, b?: number, a?: number);
    }
    class Trail {
        obj: gd3d.math.vector3;
        height: number;
        time: number;
        minDistance: number;
        timeTransitionSpeed: number;
        desiredTime: number;
        startColor: Color;
        endColor: Color;
        alwaysUp: boolean;
        position: gd3d.math.vector3;
        now: number;
        currentSection: TrailSection;
        private mesh;
        private sections;
        private _defaultcount;
        private _maxvercount;
        private _vercount;
        private _indexcount;
        maxvercount: number;
        constructor(_obj: gd3d.math.vector3, _mesh: mesh);
        private caclMaxVercount(_curcount);
        startTrail(timeToTweenTo: number, fadeInTime: number): void;
        setTime(trailTime: number, timeToTweenTo: number, tweenSpeed: number): void;
        fadeOut(fadeTime: number): void;
        Itterate(itterateTime: number): void;
        updateTrail(currentTime: number, deltaTime: number): void;
    }
}
declare namespace gd3d.framework {
    enum HideFlags {
        None = 0,
        HideInHierarchy = 1,
        HideInInspector = 2,
        DontSaveInEditor = 4,
        NotEditable = 8,
        DontSaveInBuild = 16,
        DontUnloadUnusedAsset = 32,
        DontSave = 52,
        HideAndDontSave = 61,
    }
    interface INodeComponent {
        start(): any;
        update(delta: number): any;
        gameObject: gameObject;
        remove(): any;
        clone(): any;
    }
    class nodeComponent {
        comp: INodeComponent;
        init: boolean;
        constructor(comp: INodeComponent, init?: boolean);
    }
    class gameObject {
        getScene(): scene;
        layer: number;
        hideFlags: HideFlags;
        transform: transform;
        components: nodeComponent[];
        renderer: IRenderer;
        camera: camera;
        light: light;
        collider: ICollider;
        private _visible;
        readonly visibleInScene: boolean;
        visible: boolean;
        getName(): string;
        update(delta: number): void;
        addComponentDirect(comp: INodeComponent): INodeComponent;
        getComponent(type: string): INodeComponent;
        getComponents(): INodeComponent[];
        getComponentsInChildren(type: string): INodeComponent[];
        private _getComponentsInChildren(type, obj, array);
        getComponentInParent(type: string): INodeComponent;
        addComponent(type: string): INodeComponent;
        removeComponent(comp: INodeComponent): void;
        remove(comp: INodeComponent): void;
        removeComponentByTypeName(type: string): void;
        removeAllComponents(): void;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class renderContext {
        constructor(webgl: WebGLRenderingContext);
        drawtype: string;
        webgl: WebGLRenderingContext;
        viewPortPixel: gd3d.math.rect;
        eyePos: gd3d.math.vector4;
        matrixView: gd3d.math.matrix;
        matrixProject: gd3d.math.matrix;
        matrixModel: gd3d.math.matrix;
        matrixModelViewProject: gd3d.math.matrix;
        matrixModelView: gd3d.math.matrix;
        matrixViewProject: gd3d.math.matrix;
        floatTimer: number;
        intLightCount: number;
        vec4LightPos: Float32Array;
        vec4LightDir: Float32Array;
        floatLightSpotAngleCos: Float32Array;
        lightmap: gd3d.framework.texture;
        lightmapUV: number;
        lightmapOffset: gd3d.math.vector4;
        updateCamera(app: application, camera: camera): void;
        updateLights(lights: light[]): void;
        updateOverlay(): void;
        updateModel(model: transform): void;
        updateModeTrail(): void;
    }
    enum RenderLayerEnum {
        Common = 0,
        Transparent = 1,
        Overlay = 2,
    }
    interface IRenderer extends INodeComponent {
        layer: RenderLayerEnum;
        renderLayer: CullingMask;
        queue: number;
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera): any;
    }
    class renderList {
        constructor();
        clear(): void;
        addRenderer(renderer: IRenderer): void;
        renderLayers: renderLayer[];
    }
    class renderLayer {
        needSort: boolean;
        list: IRenderer[];
        constructor(_sort?: boolean);
    }
}
declare namespace gd3d.framework {
    class scene {
        app: application;
        webgl: WebGLRenderingContext;
        constructor(app: application);
        name: string;
        private rootNode;
        renderList: renderList;
        private assetmgr;
        renderCameras: camera[];
        private _mainCamera;
        mainCamera: camera;
        private renderContext;
        private renderLights;
        lightmaps: texture[];
        update(delta: number): void;
        private RealCameraNumber;
        private _renderCamera(camindex);
        updateScene(node: transform, delta: any): void;
        addChild(node: transform): void;
        removeChild(node: transform): void;
        getChildren(): transform[];
        getChildCount(): number;
        getChild(index: number): transform;
        getChildByName(name: string): transform;
        getRoot(): transform;
        pickAll(ray: ray, isPickMesh?: boolean): Array<pickinfo>;
        pick(ray: ray, isPickMesh?: boolean): pickinfo;
        private doPick(ray, pickall?, isPickMesh?);
        private pickMesh(ray, tran, pickedList);
        private pickCollider(ray, tran, pickedList);
    }
}
declare namespace gd3d.framework {
    class taskstate {
        finish: boolean;
        error: boolean;
        message: string;
        cancel: boolean;
        taskCall: (taskstate, state: taskstate) => void;
        taskInterface: ITask;
    }
    interface ITask {
        move(delta: number, laststate: taskstate, state: taskstate): any;
    }
    class taskMgr {
        tasks: taskstate[];
        addTaskCall(task: (laststate: taskstate, state: taskstate) => void): void;
        addTask(task: ITask): void;
        laststate: taskstate;
        move(delta: number): void;
        cancel(): void;
    }
}
declare namespace gd3d.framework {
    class aabb {
        minimum: gd3d.math.vector3;
        maximum: gd3d.math.vector3;
        srcmin: gd3d.math.vector3;
        srcmax: gd3d.math.vector3;
        opmin: gd3d.math.vector3;
        opmax: gd3d.math.vector3;
        _center: gd3d.math.vector3;
        constructor(_minimum: gd3d.math.vector3, _maximum: gd3d.math.vector3);
        update(worldmatrix: gd3d.math.matrix): void;
        addVector3(vec: gd3d.math.vector3): void;
        containsVector3(vec: gd3d.math.vector3): boolean;
        intersectAABB(aabb: aabb): boolean;
        addAABB(aabb: gd3d.framework.aabb): void;
        readonly center: gd3d.math.vector3;
        clear(): void;
        clone(): aabb;
        getVec3(vecs: gd3d.math.vector3[]): void;
    }
}
declare namespace gd3d.framework {
    class obb {
        center: gd3d.math.vector3;
        halfsize: gd3d.math.vector3;
        directions: gd3d.math.vector3[];
        vectors: gd3d.math.vector3[];
        constructor();
        buildByMaxMin(minimum: gd3d.math.vector3, maximum: gd3d.math.vector3): void;
        buildByCenterSize(center: gd3d.math.vector3, size: gd3d.math.vector3): void;
        update(worldmatrix: gd3d.math.matrix): void;
        caclWorldVecs(vecs: gd3d.math.vector3[], worldmatrix: gd3d.math.matrix): void;
        intersects(_obb: obb): boolean;
        computeBoxExtents(axis: gd3d.math.vector3, box: obb): math.vector3;
        axisOverlap(axis: gd3d.math.vector3, box0: obb, box1: obb): boolean;
        extentsOverlap(min0: number, max0: number, min1: number, max1: number): boolean;
        clone(): obb;
        dispose(): void;
    }
}
declare namespace gd3d.framework {
    class pickinfo {
        pickedtran: transform;
        distance: number;
        hitposition: gd3d.math.vector3;
        bu: number;
        bv: number;
        faceId: number;
        subMeshId: number;
        constructor(_bu: number, _bv: number, _distance: number);
    }
}
declare namespace gd3d.framework {
    class ray {
        origin: gd3d.math.vector3;
        direction: gd3d.math.vector3;
        constructor(_origin: gd3d.math.vector3, _dir: gd3d.math.vector3);
        intersectAABB(_aabb: aabb): boolean;
        intersectPlaneTransform(tran: transform): pickinfo;
        intersectPlane(planePoint: gd3d.math.vector3, planeNormal: any): gd3d.math.vector3;
        intersectCollider(tran: transform): pickinfo;
        intersectBoxMinMax(minimum: gd3d.math.vector3, maximum: gd3d.math.vector3): boolean;
        intersectsSphere(center: gd3d.math.vector3, radius: number): boolean;
        intersectsTriangle(vertex0: gd3d.math.vector3, vertex1: gd3d.math.vector3, vertex2: gd3d.math.vector3): pickinfo;
    }
}
declare namespace gd3d.framework {
    class transform {
        private _scene;
        scene: scene;
        name: string;
        insId: insID;
        prefab: string;
        private aabbdirty;
        markAABBDirty(): void;
        private aabbchilddirty;
        markAABBChildDirty(): void;
        aabb: aabb;
        aabbchild: aabb;
        caclAABB(): void;
        caclAABBChild(): void;
        buildAABB(): aabb;
        children: transform[];
        parent: transform;
        addChild(node: transform): void;
        addChildAt(node: transform, index: number): void;
        removeAllChild(): void;
        removeChild(node: transform): void;
        find(name: string): transform;
        checkImpactTran(tran: transform): boolean;
        checkImpact(): Array<transform>;
        doImpact(tran: transform, impacted: Array<transform>): void;
        markDirty(): void;
        updateTran(parentChange: boolean): void;
        updateWorldTran(): void;
        updateAABBChild(): void;
        private dirty;
        private dirtyChild;
        private dirtyWorldDecompose;
        localRotate: gd3d.math.quaternion;
        localTranslate: gd3d.math.vector3;
        localScale: gd3d.math.vector3;
        private localMatrix;
        private _localEulerAngles;
        localEulerAngles: gd3d.math.vector3;
        private worldMatrix;
        private worldRotate;
        private worldTranslate;
        private worldScale;
        getWorldTranslate(): math.vector3;
        getWorldScale(): math.vector3;
        getWorldRotate(): math.quaternion;
        getLocalMatrix(): gd3d.math.matrix;
        getWorldMatrix(): gd3d.math.matrix;
        getForwardInWorld(out: gd3d.math.vector3): void;
        getRightInWorld(out: gd3d.math.vector3): void;
        getUpInWorld(out: gd3d.math.vector3): void;
        setWorldMatrix(mat: math.matrix): void;
        setWorldPosition(pos: math.vector3): void;
        lookat(trans: transform): void;
        lookatPoint(point: math.vector3): void;
        private _gameObject;
        readonly gameObject: gameObject;
        clone(): transform;
        dispose(): void;
    }
    class insID {
        constructor();
        private static idAll;
        private static next();
        private id;
        getInsID(): number;
    }
}
declare namespace gd3d.framework {
    class EnumUtil {
        static getEnumObjByType(enumType: string): any;
    }
}
declare namespace gd3d.framework {
    enum PrimitiveType {
        Sphere = 0,
        Capsule = 1,
        Cylinder = 2,
        Cube = 3,
        Plane = 4,
        Quad = 5,
        Pyramid = 6,
    }
    enum Primitive2DType {
        RawImage2D = 0,
        Image2D = 1,
        Label = 2,
        Button = 3,
    }
    class GameObjectUtil {
        static CreatePrimitive(type: PrimitiveType, app: application): gameObject;
        static Create2DPrimitive(type: Primitive2DType, app: application): transform2D;
        private static create2D_rawImage(img, app);
        private static create2D_image2D(img, app);
        private static create2D_label(label, app);
        private static create2D_button(btn, app);
    }
}
declare namespace gd3d.framework {
    class NumberUtil {
        static KEY_A: number;
        static KEY_D: number;
        static KEY_E: number;
        static KEY_Q: number;
        static KEY_R: number;
        static KEY_S: number;
        static KEY_W: number;
        static KEY_a: number;
        static KEY_d: number;
        static KEY_e: number;
        static KEY_q: number;
        static KEY_r: number;
        static KEY_s: number;
        static KEY_w: number;
    }
}
declare namespace gd3d.framework {
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
    class StringUtil {
        static COMPONENT_CAMERA: string;
        static COMPONENT_BOXCOLLIDER: string;
        static COMPONENT_LIGHT: string;
        static COMPONENT_MESHFILTER: string;
        static COMPONENT_MESHRENDER: string;
        static COMPONENT_EFFECTSYSTEM: string;
        static COMPONENT_LABEL: string;
        static COMPONENT_IMAGE: string;
        static COMPONENT_RAWIMAGE: string;
        static COMPONENT_BUTTON: string;
        static COMPONENT_SKINMESHRENDER: string;
        static COMPONENT_CAMERACONTROLLER: string;
        static COMPONENT_CANVASRENDER: string;
        static UIStyle_RangeFloat: string;
        static UIStyle_Enum: string;
        static RESOURCES_MESH_CUBE: string;
        static replaceAll(srcStr: string, fromStr: string, toStr: string): string;
        static trimAll(str: string): string;
        static firstCharToLowerCase(str: string): string;
    }
}
declare namespace gd3d.io {
    function loadText(url: string, fun: (_txt: string, _err: Error) => void): void;
    function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void): void;
    function loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void): void;
    function loadImg(url: string, fun: (_tex: HTMLImageElement, _err: Error) => void, progress: (progre: number) => void): void;
}
declare namespace gd3d.math {
    class pool {
        static collect_all(): void;
        private static _vector4_one;
        static readonly vector4_one: vector4;
        private static unused_vector4;
        static new_vector4(): vector4;
        static clone_vector4(src: vector4): vector4;
        static delete_vector4(v: vector4): void;
        static collect_vector4(): void;
        private static _color_one;
        static readonly color_one: color;
        private static unused_color;
        static new_color(): color;
        static delete_color(v: color): void;
        static collect_color(): void;
        private static _vector3_up;
        static readonly vector3_up: vector3;
        private static _vector3_right;
        static readonly vector3_right: vector3;
        private static _vector3_forward;
        static readonly vector3_forward: vector3;
        n: any;
        private static _vector3_zero;
        static readonly vector3_zero: vector3;
        private static _vector3_one;
        static readonly vector3_one: vector3;
        private static unused_vector3;
        static new_vector3(): vector3;
        static clone_vector3(src: vector3): vector3;
        static delete_vector3(v: vector3): void;
        static collect_vector3(): void;
        private static _vector2_up;
        static readonly vector2_up: vector2;
        private static _vector2_right;
        static readonly vector2_right: vector2;
        private static unused_vector2;
        static new_vector2(): vector2;
        static clone_vector2(src: vector2): vector2;
        static delete_vector2(v: vector2): void;
        static delete_vector2Array(vs: vector2[]): void;
        static collect_vector2(): void;
        private static unused_matrix3x2;
        static new_matrix3x2(): matrix3x2;
        static clone_matrix3x2(src: matrix3x2): matrix3x2;
        static delete_matrix3x2(v: matrix3x2): void;
        static collect_matrix3x2(): void;
        private static unused_matrix;
        static new_matrix(): matrix;
        static clone_matrix(src: matrix): matrix;
        static delete_matrix(v: matrix): void;
        static collect_matrix(): void;
        private static unused_quaternion;
        static new_quaternion(): quaternion;
        static clone_quaternion(src: quaternion): quaternion;
        static delete_quaternion(v: quaternion): void;
        static collect_quaternion(): void;
    }
}
declare namespace gd3d.render {
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
    }
    class webglkit {
        private static _maxVertexAttribArray;
        static SetMaxVertexAttribArray(webgl: WebGLRenderingContext, count: number): void;
        private static _texNumber;
        static GetTextureNumber(webgl: WebGLRenderingContext, index: number): number;
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
    enum ShowFaceStateEnum {
        ALL = 0,
        CCW = 1,
        CW = 2,
    }
    enum DrawModeEnum {
        VboTri = 0,
        VboLine = 1,
        EboTri = 2,
        EboLine = 3,
    }
    enum BlendModeEnum {
        Close = 0,
        Blend = 1,
        Blend_PreMultiply = 2,
        Add = 3,
        Add_PreMultiply = 4,
    }
    class glDrawPass {
        program: glProgram;
        state_showface: ShowFaceStateEnum;
        state_zwrite: boolean;
        state_ztest: boolean;
        state_ztest_method: number;
        state_blend: boolean;
        state_blendEquation: number;
        state_blendSrcRGB: number;
        state_blendDestRGB: number;
        state_blendSrcAlpha: number;
        state_blendDestALpha: number;
        uniforms: {
            [id: string]: {
                change: boolean;
                location: WebGLUniformLocation;
                type: UniformTypeEnum;
                value: any;
            };
        };
        uniformallchange: boolean;
        setProgram(program: glProgram, uniformDefault?: boolean): void;
        setAlphaBlend(mode: BlendModeEnum): void;
        uniformFloat(name: string, number: number): void;
        uniformFloatv(name: string, numbers: Float32Array): void;
        uniformVec4(name: string, vec: math.vector4): void;
        uniformVec4v(name: string, vecdata: Float32Array): void;
        uniformMatrix(name: string, mat: math.matrix): void;
        uniformMatrixV(name: string, matdata: Float32Array): void;
        uniformTexture(name: string, tex: render.ITexture): void;
        static textureID: number[];
        use(webgl: WebGLRenderingContext, applyUniForm?: boolean): void;
        applyUniformSaved(webgl: WebGLRenderingContext): void;
        applyUniform_Float(webgl: WebGLRenderingContext, key: string, value: number): void;
        applyUniform_Floatv(webgl: WebGLRenderingContext, key: string, value: Float32Array): void;
        applyUniform_Float4(webgl: WebGLRenderingContext, key: string, value: math.vector4): void;
        applyUniform_Float4v(webgl: WebGLRenderingContext, key: string, values: Float32Array): void;
        applyUniform_Float4x4(webgl: WebGLRenderingContext, key: string, value: math.matrix): void;
        applyUniform_Float4x4v(webgl: WebGLRenderingContext, key: string, values: Float32Array): void;
        applyUniform_FloatTexture(webgl: WebGLRenderingContext, texindex: number, key: string, value: ITexture): void;
        draw(webgl: WebGLRenderingContext, mesh: glMesh, drawmode?: DrawModeEnum, drawindexindex?: number, drawbegin?: number, drawcount?: number): void;
    }
}
declare namespace gd3d.render {
    enum VertexFormatMask {
        Position = 1,
        Normal = 2,
        Tangent = 4,
        Color = 8,
        UV0 = 16,
        UV1 = 32,
        BlendIndex4 = 64,
        BlendWeight4 = 128,
        ColorEX = 256,
    }
    class number4 {
        v0: number;
        v1: number;
        v2: number;
        v3: number;
    }
    enum MeshTypeEnum {
        Static = 0,
        Dynamic = 1,
        Stream = 2,
    }
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
        bindIndex: number;
        vertexFormat: VertexFormatMask;
        bind(webgl: WebGLRenderingContext, shadercode: glProgram, bindEbo?: number): void;
        uploadVertexSubData(webgl: WebGLRenderingContext, varray: Float32Array, offset?: number): void;
        uploadIndexSubData(webgl: WebGLRenderingContext, eboindex: number, data: Uint16Array, offset?: number): void;
        drawArrayTris(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawArrayLines(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawElementTris(webgl: WebGLRenderingContext, start?: number, count?: number): void;
        drawElementLines(webgl: WebGLRenderingContext, start?: number, count?: number): void;
    }
}
declare namespace gd3d.render {
    class meshData {
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
        static addQuadPos(data: meshData, quad: gd3d.math.vector3[]): void;
        static addQuadPos_Quad(data: meshData, quad: gd3d.math.vector3[]): void;
        static addQuadVec3ByValue(array: gd3d.math.vector3[], value: gd3d.math.vector3): void;
        static addQuadVec3(array: gd3d.math.vector3[], quad: gd3d.math.vector3[]): void;
        static addQuadVec2(array: gd3d.math.vector2[], quad: gd3d.math.vector2[]): void;
        static genQuad(size: number): meshData;
        static genPlaneCCW(size: number): meshData;
        static genCylinderCCW(height: number, radius: number, segment?: number): meshData;
        static genPyramid(height: number, halfsize: number): meshData;
        static genSphereCCW(radius?: number, widthSegments?: number, heightSegments?: number): meshData;
        static genBoxCCW(size: number): meshData;
        static genBoxByArray(array: gd3d.math.vector3[]): meshData;
        static genBoxByArray_Quad(array: gd3d.math.vector3[]): meshData;
        static genCircleLineCCW(radius: number, segment?: number, wide?: number): meshData;
        caclByteLength(): number;
        static calcByteSize(vf: VertexFormatMask): number;
        genVertexDataArray(vf: VertexFormatMask): Float32Array;
        genIndexDataArray(): Uint16Array;
        genIndexDataArrayTri2Line(): Uint16Array;
        genIndexDataArrayQuad2Line(): Uint16Array;
    }
}
declare namespace gd3d.render {
    class staticMeshRenderer {
        material: glDrawPass;
        mesh: glMesh;
        eboIndex: number;
        drawMode: DrawModeEnum;
        drawbegin: number;
        drawcount: number;
        draw(webgl: WebGLRenderingContext): void;
    }
    class batchRenderer {
        curmaterial: glDrawPass;
        mesh: glMesh;
        drawMode: DrawModeEnum;
        vboCount: number;
        eboCount: number;
        dataForVbo: Float32Array;
        dataForEbo: Uint16Array;
        initBuffer(webgl: WebGLRenderingContext, vf: VertexFormatMask, drawMode: DrawModeEnum): void;
        begin(webgl: WebGLRenderingContext, mat: glDrawPass): void;
        push(webgl: WebGLRenderingContext, vbodata: number[], ebodata: number[]): void;
        end(webgl: WebGLRenderingContext): void;
    }
}
declare namespace gd3d.render {
    class glWindow {
        renderTarget: gd3d.render.glRenderTarget;
        clearop_Color: boolean;
        backColor: gd3d.math.color;
        clearop_Depth: boolean;
        clearop_Stencil: boolean;
        viewport: gd3d.math.rect;
        use(webgl: WebGLRenderingContext): void;
    }
}
declare namespace gd3d.render {
    enum UniformTypeEnum {
        Texture = 0,
        Float = 1,
        Floatv = 2,
        Float4 = 3,
        Float4v = 4,
        Float4x4 = 5,
        Float4x4v = 6,
    }
    class uniform {
        name: string;
        type: UniformTypeEnum;
        location: WebGLUniformLocation;
    }
    enum ShaderTypeEnum {
        VS = 0,
        FS = 1,
    }
    class glShader {
        constructor(name: string, type: ShaderTypeEnum, shader: WebGLShader, code: string);
        name: string;
        type: ShaderTypeEnum;
        shader: WebGLShader;
        mapUniform: {
            [id: string]: {
                name: string;
                type: UniformTypeEnum;
            };
        };
        private _scanUniform(txt);
    }
    class glProgram {
        constructor(vs: glShader, fs: glShader, program: WebGLProgram);
        initAttribute(webgl: WebGLRenderingContext): void;
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
    }
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
    }
}
declare namespace gd3d.render {
    enum TextureFormatEnum {
        RGBA = 1,
        RGB = 2,
        Gray = 3,
    }
    class textureReader {
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray?: boolean);
        width: number;
        height: number;
        data: Uint8Array;
        gray: boolean;
        getPixel(u: number, v: number): any;
    }
    interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGLRenderingContext): any;
        caclByteLength(): number;
    }
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
    class glTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format?: TextureFormatEnum, mipmap?: boolean, linear?: boolean);
        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply?: boolean, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array, repeat?: boolean, mirroredU?: boolean, mirroredV?: boolean): void;
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
    }
}
