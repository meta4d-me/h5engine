/// <reference path="../lib/gd3d.d.ts" />
/// <reference path="localsave.d.ts" />
/// <reference path="htmlui.d.ts" />
/// <reference path="../lib/gd3d_jsloader.d.ts" />
declare namespace gd3d.editor {
    class EditorCameraController {
        private static g_this;
        static instance(): EditorCameraController;
        gameObject: gd3d.framework.gameObject;
        app: gd3d.framework.application;
        target: gd3d.framework.camera;
        moveSpeed: number;
        movemul: number;
        wheelSpeed: number;
        rotateSpeed: number;
        keyMap: {
            [id: number]: boolean;
        };
        beRightClick: boolean;
        update(delta: number): void;
        rotAngle: gd3d.math.vector3;
        isInit: boolean;
        init(app: gd3d.framework.application, target: gd3d.framework.camera): void;
        private moveVector;
        doMove(delta: number): void;
        doRotate(rotateX: number, rotateY: number): void;
        lookat(trans: gd3d.framework.transform): void;
        checkOnRightClick(mouseEvent: MouseEvent): boolean;
        private doMouseWheel(ev, isFirefox);
        remove(): void;
    }
}
declare namespace gd3d.editor {
    class Hierarchy implements gd3d.framework.INotify {
        map: {
            [id: number]: {
                selfDirty: boolean;
                childDirty: boolean;
            };
        };
        private app;
        private scene;
        treeview: SceneTreeView;
        nodeMap: {
            [key: number]: SceneTreeNode;
        };
        private curOnMoveNode;
        private sceneDivLineType;
        needSave: boolean;
        curSceneName: string;
        private fileTitleDiv;
        private filter;
        private onOperate;
        private main;
        constructor(div: HTMLDivElement, onOperate: Function, thisObj: Main);
        notify(trans: any, type: gd3d.framework.NotifyType): void;
        onUpdate(delta: number): void;
        refresh(): void;
        showInspector(trans: any): void;
        regEvent(): void;
        deleteNode(): void;
        getCurSeleteCameraData(nodeType: NodeTypeEnum): {
            "camera": framework.camera;
            "index": number;
        };
        changeUISaveState(): void;
        checkDragResult(): Boolean;
        checkNodeDragByType(): boolean;
        refreshTreeView(): void;
        refresh2DNode(): void;
        _changeTransformItem(fromTr: any, toTr: any): void;
        save(): void;
        saveScene(): void;
        savePrefab(trans: gd3d.framework.transform): void;
        clearselect(): void;
        endChangeNodeName(): void;
        delete(): void;
        private copyNode;
        copy(node: SceneTreeNode): void;
        paste(node: SceneTreeNode): void;
        duplicate(node: SceneTreeNode): void;
        createEmpty(node: SceneTreeNode): void;
        create3D(type: gd3d.framework.PrimitiveType, node: SceneTreeNode): void;
        create2D(type: gd3d.framework.Primitive2DType, node: SceneTreeNode): void;
    }
}
declare namespace gd3d.editor {
    interface ISceneTreeViewFilter {
        getChildren(rootObj: any): {
            trans: gd3d.framework.transform;
            txtcolor: string;
            nodeType: NodeTypeEnum;
        }[];
    }
    enum NodeTypeEnum {
        TransformNormal = 1,
        TransformCanvasRender = 2,
        TransformCamera = 4,
        Transform2DNormal = 8,
        Transform2DCanvasRenderCanvas = 16,
        Transform2DOverLayRoot = 32,
        Transform2DOverLayCanvas = 64,
        TransVirtual = 128,
    }
    class SceneTreeNode {
        treeNode: TreeNode;
        divNode: HTMLDivElement;
        divText: HTMLDivElement;
        label: HTMLLabelElement;
        input: HTMLInputElement;
        divChildButton: HTMLDivElement;
        divArrow: HTMLSpanElement;
        text: string;
        children: SceneTreeNode[];
        parent: SceneTreeNode;
        left: number;
        data: any;
        divTailLine: HTMLDivElement;
        beFolded: boolean;
        beRemoved: boolean;
        nodeType: NodeTypeEnum;
        MarkBgHighLight(hightLight: boolean): void;
        MarkTextVisible(visible: boolean): void;
        MakeLength(len: number): void;
        treeView: SceneTreeView;
        private filter;
        tree: Tree;
        refresh(): void;
        SpreadOrFold(flag: boolean): void;
        append(): void;
        changeNodeName(): void;
        endChangeNodeName(): void;
        FillData(tre: SceneTreeView, filter: ISceneTreeViewFilter, tree: Tree, data: {
            trans: gd3d.framework.transform;
            txtcolor: string;
            nodeType: NodeTypeEnum;
        }, beVirtualNode?: boolean): void;
        hide(): void;
        show(): void;
        hideDivForChild(flag: boolean): void;
        removeChildTreeNode(node: SceneTreeNode): void;
    }
    class Tree {
        rootNode: TreeNode;
        setRootNode(node: TreeNode): void;
        MLR(node: TreeNode): TreeNode[];
        private _MLR(node, nodes);
        findPreNodeInArray(node: TreeNode): TreeNode;
    }
    class TreeNode {
        data: any;
        parent: TreeNode;
        children: TreeNode[];
        childrenDatas: any[];
        constructor(data: any);
        AddChild(node: TreeNode): void;
        AddChildAtIndex(node: TreeNode, index: number): void;
        RemoveChild(node: TreeNode): void;
    }
    class SceneTreeView {
        static textNormalColor: string;
        static textUnVisibleColor: string;
        static itemBgNormalColor: string;
        static itemBgSelectColor: string;
        parent: HTMLDivElement;
        tree: Tree;
        constructor(parent: HTMLDivElement, hierarchy: Hierarchy);
        close(): void;
        divRoot3d: HTMLDivElement;
        hierarchy: Hierarchy;
        nodeMap: {
            [key: number]: SceneTreeNode;
        };
        onDoubleClickItem: (data: any) => void;
        onSelectItem: (data: any) => void;
        onContextMenuItem: (data: any) => void;
        onDragStartItem: (data: any) => void;
        onDragOverItem: (data: any, divLineType: SceneDivLineType) => void;
        onDragDropItem: (data: any) => void;
        private selectItem;
        readonly curSelectItem: SceneTreeNode;
        private onDragDrop(node);
        private onDragOver(node, divLineType);
        private spreadParent(node);
        makeEventForTailLine(divTailLine: HTMLDivElement, node?: SceneTreeNode): void;
        private curSelectAnchor;
        private curChangeAnchor;
        private beDoubleClick;
        endChangeNodeName(): void;
        SelectNodeByTransform(trans: gd3d.framework.transform): void;
        ChangeItem(node: SceneTreeNode): void;
        makeEvent(node: SceneTreeNode, name: string): void;
        private fold(nodeRoot);
        fordAll(): void;
        private spread(nodeRoot);
        spreadAll(): void;
        private divTailLine;
        private filter;
        uirootId: number;
        private rootNode;
        updateData(filter: ISceneTreeViewFilter, scene: gd3d.framework.scene): void;
        addChild(parTran: any, childTran: any): void;
        removeChild(parentTrans: any, childTrans: any): void;
        changeVisible(trans: any): void;
        refreshNode(trans: any, name: string): void;
        markBgHighLight(trans: any): void;
        checkFilter(trans: any): boolean;
        createDivLine(): HTMLDivElement;
        initContextMenu(hierarchyContextMenu: lighttool.htmlui.ContextMenu): void;
        doWithOutTransform(hierarchyContextMenu: lighttool.htmlui.ContextMenu): void;
        doWithTransform(hierarchyContextMenu: lighttool.htmlui.ContextMenu): void;
    }
    class SceneTreeFilter implements ISceneTreeViewFilter {
        rootList: any[];
        rootList2d: any[];
        scene: gd3d.framework.scene;
        map: {
            [id: string]: any;
        };
        constructor();
        getChildren(rootObj: any): {
            trans: any;
            txtcolor: string;
            nodeType: NodeTypeEnum;
        }[];
        checkFilter(trans: any): boolean;
    }
    enum SceneDivLineType {
        SceneDivLineNoneType = 0,
        SceneDivLineHeadType = 1,
        SceneDivLineTailType = 2,
        SceneDivLineHeadAndTailType = 3,
    }
}
declare namespace gd3d.editor {
    class Inspector_Base {
        private dataIns;
        inspector: Inspector;
        init(inspector: Inspector, dataIns: any): void;
        onInspectorUI(seriaObj: any, widgetIns: any): void;
        static pase(seriaObj: any, widgetIns: any, dataIns: any, keys: string[]): void;
    }
}
declare namespace gd3d.editor {
    class Inspector_File_Image extends Inspector_Base {
        onInspectorUI(data: any, widgetIns: any): void;
    }
}
declare namespace gd3d.editor {
    class Inspector_image2D extends Inspector_Base {
        onInspectorUI(data: any, widgetIns: any): void;
    }
}
declare namespace gd3d.editor {
    class Inspector_material extends Inspector_Base {
        shaderData: any;
        texData: any;
        onInspectorUI(data: any, widgetIns: any): void;
        getShaderComponentOperates(): number;
        getIns(data: any): any;
        getIndex(data: any): number;
        getMaterial(data: any): any;
    }
}
declare namespace gd3d.editor {
    class Inspector_shader extends Inspector_Base {
        onInspectorUI(data: any, widgetIns: any): void;
        getComponentOperates(): number;
        getIns(data: any): any;
    }
}
declare var $: any;
declare namespace gd3d.editor {
    class Inspector {
        panel: lighttool.htmlui.panel;
        assetView: Inspector_AssetView;
        gui: lighttool.htmlui.gui;
        trans: any;
        hide: boolean;
        app: gd3d.framework.application;
        beTransform2d: boolean;
        static inspectorPanelMap: {
            [type: string]: Inspector_Base;
        };
        baseEditor: Inspector_Base;
        private btn;
        constructor(app: gd3d.framework.application, panel: lighttool.htmlui.panel);
        private init();
        saveMat(mat: gd3d.framework.material): void;
        regComponentInspector(type: string, panel: Inspector_Base): void;
        private regDefaultInspector();
        static getCompInspector(type: string): Inspector_Base;
        onUpdate(delta: number): void;
        rootObj: any;
        showTrans(trans: any): void;
        showFile(data: any): void;
        showFileInfo(): void;
        private getSelectOptions();
        private showTitleArea(obj);
        private creatbtn();
        tempVec3: gd3d.math.vector3;
        angel: number;
        private showTransform(obj);
        private parseGameObject(_obj);
        name: string;
        getComponentOperates(name: string): number;
        private parseComponent(root);
        close(): void;
        clear(): void;
    }
    class Inspector_AssetView {
        panel: lighttool.htmlui.panel;
        img: HTMLImageElement;
        canvas: HTMLCanvasElement;
        showtype: ShowAssetType;
        imgWidth: number;
        imgHeight: number;
        lastWidth: number;
        lastheight: number;
        lastcontainer: lighttool.htmlui.panelContainer;
        constructor(panel: lighttool.htmlui.panel);
        createElement(type: string): HTMLElement;
        center(): void;
        hide(): void;
        show(): void;
        getImage(): HTMLImageElement;
        getCanvas(): HTMLCanvasElement;
        scale(): void;
        scaleTexture(): void;
        scaleCanvas(): void;
    }
    enum ShowAssetType {
        IMAGE = 0,
        CANVAS = 1,
    }
}
declare var $: any;
declare namespace gd3d.editor {
    class JQueryUI {
        private elementJqury;
        private mapIndex;
        private mapVal;
        private mapInputLockState;
        private div;
        constructor(div: HTMLDivElement);
        clear(): void;
        reset(): void;
        addInput(text: string, type: WidgetInputEnum, defaultVal: any, onblur: (e, params: any) => void, instance?: any, _data?: any): void;
        addGrid(gridTitle: string, layoutDirType: LayoutDirectionEnum, onfinished: (_this: any) => void, instance?: any): void;
        addComponent(compTitle: string, onfinished: (e: any) => void, operateNum: number, onOpereate: (eventType: number, val: any) => void, instance?: any): void;
        addButton(text: string, onClick: (e, params: any) => void, instance?: any, _data?: any): void;
        addTextArea(text: string, onblur: (e, params: any) => void, instance?: any, _data?: any): void;
        addCheckBox(name: string, options: {
            key: any;
            value: any;
            checked: boolean;
        }[], onchange: (e, d) => void, instance?: any, _data?: any): void;
        addSelect(name: string, options: {
            key: any;
            value: any;
            selected: boolean;
        }[], onchange: (e, d) => void, instance?: any, _data?: any): void;
        addFloatSearchSelect(title: string, options: {
            key: string;
            value: number;
        }[], onclick: (e, d) => void, instance?: any, _data?: any): void;
        createFloatSearchSelect(title: string, options: {
            key: string;
            value: number;
        }[], onclick: (e, d) => void, instance: any, _data: any, index: number): void;
        refeshFloatSearchSelect(title: string, options: {
            key: string;
            value: number;
        }[], onclick: (e, d) => void, instance: any, _data: any, index: number): void;
        addImageCut(url: string, onchange: (e, d) => void, instance?: any, _data?: any): void;
        createImageCut(url: string, onchange: (e, d) => void, instance: any, _data: any, index: number): void;
        refeshImageCut(title: string, onchange: (e, d) => void, instance: any, _data: any, index: number): void;
        addBlockSlice(onchange: (e, d) => void, instance?: any, _data?: any): void;
        createBlockSlice(onchange: (e, d) => void, instance: any, _data: any, index: number): void;
        refeshBlockSlice(onchange: (e, d) => void, instance: any, _data: any, index: number): void;
        addSpaceLine(instance?: any): void;
        createSpaceLine(instance: any, index: number): void;
        private createSelect(instance, name, options, onselected, index, _data?);
        private selectOption;
        private refreshSelect(instance, name, options, onselected, index, _data?);
        private createButton(instance, text, onClick, index, _data?);
        private createTextArea(instance, text, onblur, index, _data?);
        private createInput(instance, text, defaultVal, type, _onblur, index, _data?);
        private createComponent(instance, compTitle, onfinished, operate, onOpereate, index);
        saveToMap(widgetName: string, index: number, widget: any): void;
        private createGrid(instance, gridTitle, layoutDirType, onfinished, index);
        private createCheckBox(instance, name, options, onselected, index, _data?);
        private checkBoxOption;
        private refreshCheckBox(instance, name, options, onselected, index, _data?);
        private refreshGrid(instance, gridTitle, layoutDirType, onfinished, index);
        private refreshInput(instance, text, defaultVal, type, _onblur, index, _data?);
        private refreshComponent(instance, compTitle, onfinished, onOpereate, index);
        private refreshButton(instance, text, onClick, index, _data?);
        private refreshTextArea(instance, text, onblur, index, data?);
        refreshSpaceLine(instance: any, index: number): void;
    }
    enum LayoutDirectionEnum {
        VerticalType = 0,
        HorizontalType = 1,
    }
    enum WidgetInputEnum {
        IntType = 0,
        FloatType = 2,
        StringType = 4,
        AudioType = 8,
        MeshType = 16,
        AnimatorType = 32,
        ObjType = 64,
    }
    enum ComponentOperateEnum {
        NoneType = 1,
        RemoveType = 2,
        ResetType = 4,
        CopyComponentType = 8,
        PasteValuesType = 16,
        PasteAsNewComponentType = 32,
        ResetPositionType = 64,
        ResetRotationType = 128,
        ResetScaleType = 256,
        MoveUpType = 512,
        MoveDownType = 1024,
        EditorShaderType = 2048,
    }
}
declare namespace gd3d.editor {
    class Main implements gd3d.framework.IEditorCode {
        editorMgr: SceneEditorMgr;
        envMgr: any;
        hierarchy: Hierarchy;
        inspector: Inspector;
        profiler: Profiler;
        trans: any;
        app: gd3d.framework.application;
        stepForward: number;
        onStart(app: gd3d.framework.application): void;
        onUpdate(delta: number): void;
        onOperate(data: any, type: number): void;
        isClosed(): boolean;
    }
}
declare namespace gd3d.editor {
    class PlayDebugMgr {
        scene: gd3d.framework.scene;
        app: gd3d.framework.application;
        sceneFrame: gd3d.framework.transform;
        debugTool: DebugTool;
        frameWidth: number;
        frameHeight: number;
        scale: number;
        isinitDebugTool: boolean;
        onStart(app: gd3d.framework.application): void;
        init(): void;
        initDebugTool(): void;
        private _bePlay;
        bePlay: boolean;
        private _bePause;
        bePause: boolean;
        private _beStepForward;
        beStepForward: boolean;
        divPause: HTMLButtonElement;
        divStepForward: HTMLButtonElement;
        showPlayArea(show: boolean): void;
        resetCamera: boolean;
        onUpdate(delta: number): void;
        private lastPickTrans;
        selectTarget(target: any): void;
        isClosed(): boolean;
    }
}
declare namespace gd3d.editor {
    class Profiler {
        app: gd3d.framework.application;
        panel: lighttool.htmlui.panel;
        list: lighttool.htmlui.listBox;
        constructor(app: gd3d.framework.application, panel: lighttool.htmlui.panel);
        refreshData(): void;
        timer: number;
        timespace: number;
        onUpdate(delta: number): void;
        getPrintSize(size: number): string;
    }
}
declare namespace gd3d.editor {
    class SceneEditorMgr {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        main: Main;
        envMgr: any;
        taskManager: gd3d.framework.taskMgr;
        constructor(main: Main);
        onStart(app: gd3d.framework.application): void;
        private loadShader(lastState, state);
        private loadAssetBundle(lastState, state);
        private loadScene(lastState, state);
        private loadPrefab(lastState, state);
        timer: number;
        root: gd3d.framework.transform;
        onUpdate(delta: number): void;
        private _testCamera();
        private _testInitOneCube();
        private _testInitManyCube();
        private _testOverlay();
        private _testCanvasRender();
        private _testButton();
    }
}
declare namespace gd3d.editor {
    class SceneEnvMgr {
        scene: gd3d.framework.scene;
        app: gd3d.framework.application;
        sceneFrame: gd3d.framework.transform;
        sceneEditorCamera: gd3d.framework.camera;
        sceneOrthographicCamera: gd3d.framework.camera;
        debugTool: DebugTool;
        frameWidth: number;
        frameHeight: number;
        scale: number;
        onStart(app: gd3d.framework.application): void;
        init(): void;
        resetCamera: boolean;
        onUpdate(delta: number): void;
        private lastPickTrans;
        private initSceneFrame();
        cameraMoveToTarget(target: any): void;
        selectTarget(target: any): void;
        isClosed(): boolean;
    }
}
declare namespace gd3d.editor {
    function getQueryStringByName(name: string): string;
    var edit: any;
    var assetbundleName: string;
    var sceneName: string;
    var prefabName: string;
    var effectName: string;
    var title: HTMLDivElement;
    var gdApp: gd3d.framework.application;
    var type: string;
    var trans: gd3d.framework.transform;
}
declare namespace gd3d.editor {
    class DebugTool {
        mainCam: gd3d.framework.camera;
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        axisObj: AxisObject;
        mouseUICtr: UIMouseCTR;
        cameraEdit: cameraEdit;
        inited: boolean;
        clickFunc: Function;
        constructor(_app: gd3d.framework.application, _mainCam: gd3d.framework.camera, clickFunc: Function);
        update(delta: number): void;
    }
    class AxisObject {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        inputMgr: gd3d.framework.inputMgr;
        debugTool: DebugTool;
        private _tran;
        readonly tran: gd3d.framework.transform;
        private _pyr;
        private _pyrX;
        private _pyrY;
        private _pyrZ;
        private _box;
        private _boxX;
        private _boxY;
        private _boxZ;
        private _line;
        private _lineX;
        private _lineY;
        private _lineZ;
        private _circle;
        private _circleX;
        private _circleY;
        private _circleZ;
        private _colorX;
        private _colorY;
        private _colorZ;
        private _colorO;
        private anisSize;
        private debugMode;
        private selectMode;
        private _target;
        target: any;
        private subTran;
        mainCam: gd3d.framework.camera;
        constructor(_app: gd3d.framework.application, _mainCam: gd3d.framework.camera, _debugTool: DebugTool);
        setTarget(target: any): void;
        attachControll(): void;
        update(delta: number): void;
        intersectionWith2Line(p1: gd3d.math.vector3, d1: gd3d.math.vector3, p2: gd3d.math.vector3, d2: gd3d.math.vector3): gd3d.math.vector3;
        isPickAxis(ray: gd3d.framework.ray): boolean;
        pointLeftDown: boolean;
        pointRightDown: boolean;
        mousePosInScreen: gd3d.math.vector2;
        contrastDir: gd3d.math.vector2;
        private offset;
        pointDownEvent(e: MouseEvent): void;
        pick2d(ray: gd3d.framework.ray): gd3d.framework.transform2D;
        tempTran2Parent: gd3d.framework.transform;
        dopick2d(ray: gd3d.framework.ray, tran: gd3d.framework.transform): gd3d.framework.transform2D;
        MouseStartPoint: gd3d.math.vector3;
        targetStartPoint: gd3d.math.vector3;
        targetStartScale: gd3d.math.vector3;
        targetStartRotate: gd3d.math.quaternion;
        pointHoldEvent(e: MouseEvent): void;
        pointUpEvent(e: MouseEvent): void;
        keyDownEvent(e: KeyboardEvent): void;
        setDebugModel(_model: number): void;
    }
    class UIMouseCTR {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        DebugTool: DebugTool;
        constructor(_app: gd3d.framework.application, _mainCam: gd3d.framework.camera, _debugTool: DebugTool);
        overLay: gd3d.framework.overlay2D;
        private eventMgr;
        _LLine: gd3d.framework.transform2D;
        _RLine: gd3d.framework.transform2D;
        _TLine: gd3d.framework.transform2D;
        _DLine: gd3d.framework.transform2D;
        private lineArr;
        _RTPoint: gd3d.framework.transform2D;
        _RDPoint: gd3d.framework.transform2D;
        _LTPoint: gd3d.framework.transform2D;
        _LDPoint: gd3d.framework.transform2D;
        private pointArr;
        private TransGroup;
        private LineWide;
        private LineHeight;
        private PointWide;
        private initUIFrameData();
        attachControll(): void;
        SetOverLayVisiable(value: boolean): void;
        refreshFrameData(center: gd3d.math.vector2, wide: number, height: number): void;
        localTransLate: gd3d.math.vector2;
        pivot: gd3d.math.vector2;
        wide: number;
        height: number;
        center: gd3d.math.vector2;
        private recordInitialValue(pivot, wide, height, center, _tranlate);
        private mouseStartPoint;
        private mouseEndPoint;
        private PickedTransStartPoint;
        private TransGroupStartPos;
        PickedTrans: gd3d.framework.transform2D;
        PickedEreal: gd3d.framework.transform2D;
        pointDownEvent(e: any): void;
        private pickedTransAndRefreshData(e);
        private pick2dTransCam(ex, ey);
        private isPick2dTrans(ex, ey, cam);
        private isPickerCtrEreal(ex, ey);
        private pointLeftDown;
        private calRealMoveVector(mouseStart, mouseEnd, out);
        pointHoldEvent(e: any): void;
        private pickAndMoveUI();
        pointUpEvent(e: any): void;
        keyDownEvent(e: any): void;
        update(delta: number): void;
        mapFunc: {
            [name: string]: Function;
        };
        private rLine();
        private lLine();
        private tLine();
        private dLine();
        private rtPoint();
        private rdPoint();
        private ltPoint();
        private ldPoint();
    }
    class cameraEdit {
        editorCamera: gd3d.framework.camera;
        DebugTool: DebugTool;
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private _tartgetCamera;
        tartgetCamera: gd3d.framework.camera;
        constructor(_app: gd3d.framework.application, _mainCam: gd3d.framework.camera, _debugTool: DebugTool);
        private attachControll();
        private pickeEidtorCube;
        private pickedCube;
        pointDownEvent(e: any): void;
        pointHoldEvent(e: any): void;
        pointUpEvent(e: any): void;
        update(): void;
        private frameTrans;
        private cubeArr;
        private frameInit();
        private showFrame();
        private hideFrame();
        private refreshOrBuildFrameMesh();
    }
}
declare namespace gd3d.editor {
    class Button implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, fun: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetCheckBox implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        private checkBoxOption;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetComponent implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        map: {
            [key: string]: any;
        };
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        doOperate(dataIns: any, title: string, eventType: ComponentOperateEnum, widgetIns: any): void;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetDragSelect implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
        getAssetType(data: any): gd3d.framework.AssetTypeEnum;
        getIconName(assetType: gd3d.framework.AssetTypeEnum): "shader" | "dot" | "num" | "box" | "shu";
        name: string;
        getOptions(type: gd3d.framework.AssetTypeEnum, defaultVal: any): {
            key: string;
            value: string;
            selected: boolean;
        }[];
        setVal(data: any, val: any): void;
        getIns(data: any, assetType: gd3d.framework.AssetTypeEnum): any;
        getMaterial(data: any): any;
        getMaterialIndex(data: any): number;
        getKey(data: any): string;
        getDefaultVal(data: any): any;
    }
}
declare namespace gd3d.editor {
    class WidgetFloatSearchSelect implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
        addComponent(comName: string, dataIns: any): void;
    }
}
declare namespace gd3d.editor {
    class WidgetGrid implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetImage implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        private mapInputLockState;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        private refreshValue(e, params);
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetInput implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        private mapInputLockState;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetInputArray implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        private mapInputLockState;
        createWidget(instance: any, data: any, funs: Function[], func: Function): void;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
        getIns(data: any): any;
        getKey(data: any): string;
    }
}
declare namespace gd3d.editor {
    class WidgetInputSpecial implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        private mapInputLockState;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        private refreshValue(params, e);
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgetLayer implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): any;
        private selectOption;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare namespace gd3d.editor {
    class WidgeBlankLine implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): void;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
declare var $: any;
declare namespace gd3d.editor {
    class WidgetMgr {
        private static _ins;
        static ins(): WidgetMgr;
        map: {
            [key: string]: IWidget;
        };
        private elementJqury;
        private elementJquryComponents;
        private elementJquryFloatSelect;
        private allMap;
        private tempMap;
        private divRoot;
        divOther: HTMLDivElement;
        divComponents: HTMLDivElement;
        divFloatSelect: HTMLDivElement;
        trans: any;
        beOnRemoveComponentFunc: Function;
        beChangeShaderFunc: Function;
        init(div: HTMLDivElement): void;
        show(trans: any): void;
        clear(): void;
        reset(): void;
        regDefaultWidget(type: string, widget: IWidget): void;
        regWidget(type: string, uistyle: string, widget: IWidget): void;
        getWidget(name: string): IWidget;
        addWidgetByStyle(type: string, uistyle: string, widgetInstance: any, data: any, funs?: Function[]): void;
        addWidget(type: string, widgetInstance: any, data: any, funs?: Function[]): void;
        getKey(data: any): string;
        setVal(data: any, val: any): void;
        private saveToMap(widgetName, key, widget, pointIns?);
        regAllWidget(): void;
    }
    interface IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, fun: Function[], func: Function): void;
        refreshWidget(instance: any, data: any, fun: Function[], pointIns?: any): void;
        clear(): any;
    }
}
declare namespace gd3d.editor {
    class WidgetTextArea implements IWidget {
        widgetMgr: WidgetMgr;
        elementJqury: any;
        createWidget(instance: any, data: any, funs: Function[], func: Function): void;
        refreshWidget(instance: any, data: any, funs: Function[], pointIns?: any): void;
        clear(): void;
    }
}
