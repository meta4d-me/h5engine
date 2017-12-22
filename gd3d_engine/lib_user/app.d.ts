/// <reference path="../lib/gd3d.d.ts" />
/// <reference path="../lib/htmlui.d.ts" />
declare class demo_ScreenSplit implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    cameraCurseHover: number;
    windowRate: number;
    windowHorizon: boolean;
    mouseOver: boolean;
    mouseEnter: boolean;
    mouseDown: boolean;
    mouseMove: boolean;
    outcontainer: HTMLDivElement;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    camera1: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    cube4: gd3d.framework.transform;
    timer: number;
    movetarget: gd3d.math.vector3;
    targetCamera: gd3d.framework.camera;
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean;
    splitline: HTMLDivElement;
    update(delta: number): void;
}
declare namespace t {
    class light_d1 implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class localSave {
    private static _instance;
    static readonly Instance: localSave;
    localServerPath: string;
    stringToUtf8Array(str: string): number[];
    file_str2blob(string: string): Blob;
    file_u8array2blob(array: Uint8Array): Blob;
    save(path: string, file: Blob | File): number;
    startDirect(exec: string, path: string, argc: string): any;
    start(path: string): any;
    startnowait(path: string, fun?: (_txt: string, _err: Error) => void): any;
    loadTextImmediate(url: string, fun: (_txt: string, _err: Error) => void): void;
    loadBlobImmediate(url: string, fun: (_blob: Blob, _err: Error) => void): void;
}
interface IState {
    start(app: gd3d.framework.application): any;
    update(delta: number): any;
}
declare class main implements gd3d.framework.IUserCode {
    app: gd3d.framework.application;
    state: IState;
    onStart(app: gd3d.framework.application): void;
    private x;
    private y;
    private btns;
    private addBtn(text, act);
    private clearBtn();
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_blend implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        background: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        counttimer: number;
        private angularVelocity;
        private eulerAngle;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcam(laststate, state);
        foreground: gd3d.framework.transform;
        private addplane(laststate, state);
        start(app: gd3d.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_fakepbr implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    light: gd3d.framework.light;
    light2: gd3d.framework.light;
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_heilongbo implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskMgr: gd3d.framework.taskMgr;
    keyframeanicomponet: gd3d.framework.keyframeanimation;
    keyframeanicomponet1: gd3d.framework.keyframeanimation;
    longtou: gd3d.framework.transform;
    start(app: gd3d.framework.application): void;
    private loadShader(laststate, state);
    private loadTexture(laststate, state);
    private loadCube(laststate, state);
    private loadkeyFrameAnimationPath(laststate, state);
    private loadasset(laststate, state);
    cube: gd3d.framework.transform;
    private iniscene(laststate, state);
    private addbtns();
    private addbtn(text, x, y, func);
    update(delta: number): void;
}
declare class test_keyframeAnimation implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskMgr: gd3d.framework.taskMgr;
    keyframeanicomponet: gd3d.framework.keyframeanimation;
    longtou: gd3d.framework.transform;
    start(app: gd3d.framework.application): void;
    private loadShader(laststate, state);
    private loadTexture(laststate, state);
    private loadkeyFrameAnimationPath(laststate, state);
    private loadasset(laststate, state);
    private iniscene(laststate, state);
    private addbtns();
    private addbtn(text, x, y, func);
    update(delta: number): void;
}
declare class testLiChangeMesh implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    uileft: number;
    createChangeBtn(role: gd3d.framework.transform, role1: gd3d.framework.transform, o2d: gd3d.framework.overlay2D, part: string, part2: any): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_rendertexture implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        sh: gd3d.framework.shader;
        private initscene(laststate, state);
        private add3dmodelbeforeUi(laststate, state);
        start(app: gd3d.framework.application): void;
        wath_camer: gd3d.framework.camera;
        target: gd3d.framework.transform;
        targetMat: gd3d.framework.material;
        show_cube: gd3d.framework.transform;
        showcamera: gd3d.framework.camera;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        angle: number;
        update(delta: number): void;
    }
}
declare class test_loadCompressUseAssetbundle implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    update(delta: number): void;
}
declare namespace demo {
    class DragonTest implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        dragon: gd3d.framework.transform;
        camTran: gd3d.framework.transform;
        cube: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        private loadShader(laststate, state);
        private loadLongPrefab(laststate, state);
        private loadScene(laststate, state);
        private addCameraAndLight(laststate, state);
        start(app: gd3d.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_postCamera implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    timer: number;
    update(delta: number): void;
    camTran: gd3d.framework.transform;
    postColor: gd3d.framework.cameraPostQueue_Color;
    postQuad: gd3d.framework.cameraPostQueue_Quad;
    depthColor: gd3d.framework.cameraPostQueue_Depth;
    private addCamera();
}
declare class test_RangeScreen implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    cube4: gd3d.framework.transform;
    timer: number;
    movetarget: gd3d.math.vector3;
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare class test_softCut implements IState {
    static temp: any;
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr;
    assetMgr: gd3d.framework.assetMgr;
    rooto2d: gd3d.framework.overlay2D;
    start(app: gd3d.framework.application): void;
    private createUI(astState, state);
    private loadTexture(lastState, state);
    update(delta: number): void;
}
declare enum ShockType {
    Vertical = 0,
    Horizontal = 1,
    Both = 2,
}
declare class CameraShock implements gd3d.framework.INodeComponent {
    gameObject: gd3d.framework.gameObject;
    private isPlaying;
    private fade;
    private oldTranslate;
    private shockType;
    private strength;
    private life;
    private ticker;
    start(): void;
    play(strength?: number, life?: number, fade?: boolean, shockType?: ShockType): void;
    update(delta: number): void;
    remove(): void;
    clone(): void;
}
declare class Joystick {
    app: gd3d.framework.application;
    overlay2d: gd3d.framework.overlay2D;
    private joystickLeft0;
    private joystickLeft1;
    private joystickRight0;
    private joystickRight1;
    private taskmgr;
    triggerFunc: Function;
    init(app: gd3d.framework.application, overlay2d: gd3d.framework.overlay2D): void;
    private loadTexture(laststate, state);
    private addJoystick(laststate, state);
    leftAxis: gd3d.math.vector2;
    rightAxis: gd3d.math.vector2;
    private maxScale;
    private touchLeft;
    private touchRight;
    private mouseLeft;
    private mouseRight;
    readonly leftTouching: boolean;
    readonly rightTouching: boolean;
    private onMouseDown(e);
    private onMouseUp(e);
    private onMouseMove(e);
    private onTouchStart(e);
    private onTouchEnd(e);
    private onTouchMove(e);
    update(delta: number): void;
}
declare namespace demo {
    class TankGame implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        postQuad: gd3d.framework.cameraPostQueue_Quad;
        light: gd3d.framework.light;
        heroTank: gd3d.framework.transform;
        heroGun: gd3d.framework.transform;
        heroSlot: gd3d.framework.transform;
        enemyTank: gd3d.framework.transform;
        enemyGun: gd3d.framework.transform;
        enemySlot: gd3d.framework.transform;
        ground: gd3d.framework.transform;
        cubes: gd3d.framework.transform[];
        walls: gd3d.framework.transform[];
        overlay2d: gd3d.framework.overlay2D;
        joystick: Joystick;
        taskmgr: gd3d.framework.taskMgr;
        tankMoveSpeed: number;
        tankRotateSpeed: gd3d.math.vector3;
        gunRotateSpeed: gd3d.math.vector3;
        angleLimit: number;
        colVisible: boolean;
        private label;
        private loadShader(laststate, state);
        private loadTexture(laststate, state);
        private loadHeroPrefab(laststate, state);
        private loadEnemyPrefab(laststate, state);
        private loadScene(laststate, state);
        private cameraShock;
        private addCameraAndLight(laststate, state);
        private addJoystick(laststate, state);
        private addObject(laststate, state);
        private keyMap;
        start(app: gd3d.framework.application): void;
        update(delta: number): void;
        testTankCol(tran: gd3d.framework.transform): boolean;
        tempTran: gd3d.framework.transform;
        tankControl(delta: number): void;
        bulletId: number;
        bulletList: any[];
        bulletSpeed: number;
        fireStep: number;
        fireTick: number;
        private fire();
        private updateBullet(delta);
    }
}
declare namespace t {
    class test_three_leaved_rose_curve implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number;
        cube2: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        counttimer: number;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        aniplayer: gd3d.framework.aniplayer;
        role: gd3d.framework.transform;
        private roleLength;
        private loadRole(laststate, state);
        private addcam(laststate, state);
        private addcube(laststate, state);
        start(app: gd3d.framework.application): void;
        private angularVelocity;
        private eulerAngle;
        private zeroPoint;
        update(delta: number): void;
    }
}
declare class test_UI_Component implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr;
    assetMgr: gd3d.framework.assetMgr;
    rooto2d: gd3d.framework.overlay2D;
    static temp: gd3d.framework.transform2D;
    start(app: gd3d.framework.application): void;
    private createUI(astState, state);
    private loadTexture(lastState, state);
    update(delta: number): void;
}
declare class test_UIEffect implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    img_3: gd3d.framework.image2D;
    img_4: gd3d.framework.image2D;
    img_5: gd3d.framework.image2D;
    img_7: gd3d.framework.image2D;
    img_8: gd3d.framework.image2D;
    amount: number;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    timer: number;
    bere: boolean;
    bere1: boolean;
    update(delta: number): void;
}
declare class test_uimove implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
    private test();
}
declare class Rect extends gd3d.framework.transform {
    width: number;
    height: number;
    offset: gd3d.math.vector3;
    parent: Rect;
    children: Rect[];
    alignType: AlignType;
    points: gd3d.math.vector3[];
    alignPos: gd3d.math.vector3;
    layout(): void;
}
declare enum AlignType {
    NONE = 0,
    CENTER = 1,
    LEFT = 2,
    RIGHT = 3,
    TOP = 4,
    BOTTOM = 5,
    TOP_LEFT = 6,
    BOTTOM_LEFT = 7,
    TOP_RIGHT = 8,
    BOTTOM_RIGHT = 9,
}
declare class test_uiPerfabLoad implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    taskmgr: gd3d.framework.taskMgr;
    assetMgr: gd3d.framework.assetMgr;
    rooto2d: gd3d.framework.overlay2D;
    start(app: gd3d.framework.application): void;
    private bgui;
    private createUI(astState, state);
    targetui: gd3d.framework.transform2D;
    private doLoad(name);
    private loadTexture(lastState, state);
    update(delta: number): void;
}
declare class test_01 implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_anim implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    player: gd3d.framework.transform;
    cubes: {
        [id: string]: gd3d.framework.transform;
    };
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_loadAsiprefab implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_assestmgr implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    _prefab: gd3d.framework.prefab;
    baihu: gd3d.framework.transform[];
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_changeshader implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        renderer: gd3d.framework.meshRenderer;
        skinrender: gd3d.framework.skinnedMeshRenderer;
        objCam: gd3d.framework.transform;
        start(app: gd3d.framework.application): void;
        private changeShader();
        change(sha: gd3d.framework.shader): void;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        cube2: gd3d.framework.transform;
        cube3: gd3d.framework.transform;
        timer: number;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_clearDepth0 implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        start(app: gd3d.framework.application): void;
        private loadShader(laststate, state);
        private loadTexture(laststate, state);
        sh: gd3d.framework.shader;
        private initscene(laststate, state);
        private fuckLabel;
        private showcamera;
        target: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        angle: number;
        timer: number;
        update(delta: number): void;
    }
}
declare class test_effect implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    timer: number;
    taskmgr: gd3d.framework.taskMgr;
    effect: gd3d.framework.effectSystem;
    label: HTMLLabelElement;
    private loadShader(laststate, state);
    private loadText(laststate, state);
    private addcube(laststate, state);
    private dragon;
    private loadModel(laststate, state);
    start(app: gd3d.framework.application): void;
    private text;
    private loadEffect(laststate, state);
    private addButton();
    private getNameFromURL(path);
    private addcam(laststate, state);
    tr: gd3d.framework.transform;
    ttr: gd3d.framework.transform;
    beclone: boolean;
    effectloaded: boolean;
    bestop: boolean;
    bereplay: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_integratedrender implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        aniplayer: gd3d.framework.aniplayer;
        role: gd3d.framework.transform;
        private roleLength;
        private loadRole(laststate, state);
        private weapon;
        private loadWeapon(laststate, state);
        sh: gd3d.framework.shader;
        cube2: gd3d.framework.transform;
        private initscene(laststate, state);
        trailrender: gd3d.framework.trailRender;
        start(app: gd3d.framework.application): void;
        org: gd3d.framework.transform;
        cube: gd3d.framework.transform;
        camera: gd3d.framework.camera;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        grassMat: gd3d.framework.material;
        private wind;
        private WaveFrequency;
        private WaveAmplitude;
        play: boolean;
        update(delta: number): void;
        private addbtn(top, left, text);
    }
}
declare namespace t {
    class test_light1 implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        tex: gd3d.framework.texture;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class testloadImmediate implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace dome {
    class testCJ implements IState {
        private loadShader(laststate, state);
        dragon: gd3d.framework.transform;
        cameraPoint: gd3d.framework.transform;
        private loadmesh(laststate, state);
        private loadweapon(laststate, state);
        private test(laststate, state);
        camera: gd3d.framework.camera;
        private addCamera(laststate, state);
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        taskmgr: gd3d.framework.taskMgr;
        assetMgr: gd3d.framework.assetMgr;
        start(app: gd3d.framework.application): void;
        trans: gd3d.framework.transform;
        time: number;
        update(delta: number): void;
    }
}
declare class test_loadMulBundle implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    refreshTexture(tran: gd3d.framework.transform): void;
    refreshAniclip(tran: gd3d.framework.transform): void;
    refreshLightMap(scene: gd3d.framework.scene, rawscene: gd3d.framework.rawscene): void;
    start(app: gd3d.framework.application): void;
    baihu: gd3d.framework.transform;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
}
declare class test_loadScene implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    baihu: gd3d.framework.transform;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_xinshouMask implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        imageRenderMask: gd3d.framework.meshRenderer;
        texture: gd3d.framework.texture;
        start(app: gd3d.framework.application): void;
        addDomUI(): void;
        camera: gd3d.framework.camera;
        timer: number;
        update(delta: number): void;
    }
    function getFileName(url: string): string;
}
declare class test_load implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_metal implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcamandlight(laststate, state);
        private addmetalmodel(laststate, state);
        private addAsiModel(laststate, state);
        start(app: gd3d.framework.application): void;
        private addinput(top, left, text, type?);
        private addbtn(top, left, text);
        diffuse: HTMLInputElement;
        emitpower: HTMLInputElement;
        model: gd3d.framework.transform;
        cube: gd3d.framework.transform;
        cube1render: gd3d.framework.meshRenderer;
        cube2render: gd3d.framework.meshRenderer;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class test_multipleplayer_anim implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    player: gd3d.framework.transform;
    cubes: {
        [id: string]: gd3d.framework.transform;
    };
    infos: {
        [boneCount: number]: {
            abName: string;
            prefabName: string;
            materialCount: number;
        };
    };
    init(): void;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    aniplayers: gd3d.framework.aniplayer[];
    update(delta: number): void;
}
declare class test_navmesh implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    navMeshLoader: gd3d.framework.NavMeshLoadManager;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    start(app: gd3d.framework.application): void;
    timer: number;
    movetarget: gd3d.math.vector3;
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
    pos: any[];
    pickDown(): void;
}
declare namespace t {
    class Test_NormalMap implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        cuber: gd3d.framework.meshRenderer;
        private normalCube;
        private addnormalcube(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_pathAsset implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        start(app: gd3d.framework.application): void;
        private loadShader(laststate, state);
        private loadTexture(laststate, state);
        private loadpath(laststate, state);
        private loadasset(laststate, state);
        sh: gd3d.framework.shader;
        private initscene(laststate, state);
        private parentlist;
        private dragonlist;
        private traillist;
        private guippaths;
        private path;
        private showcamera;
        target: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        angle: number;
        timer: number;
        update(delta: number): void;
        private addbtns();
        private addBtn(text, x, y, func);
    }
    function DBgetAtrans(mat: gd3d.framework.material, meshname?: string): gd3d.framework.transform;
    function DBgetMat(texname?: string, shaderstring?: string): gd3d.framework.material;
}
declare class test_pick_4p implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    cube4: gd3d.framework.transform;
    timer: number;
    movetarget: gd3d.math.vector3;
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare class test_pick implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    cube4: gd3d.framework.transform;
    timer: number;
    movetarget: gd3d.math.vector3;
    inputMgr: gd3d.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_post_bloom implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        private addbtn(topOffset, textContent, func);
        camera: gd3d.framework.camera;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_posteffect_cc implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        private addbtn(topOffset, textContent, func);
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_posteffect implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcamandlight(laststate, state);
        start(app: gd3d.framework.application): void;
        camera: gd3d.framework.camera;
        light: gd3d.framework.light;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class test_loadprefab implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    renderer: gd3d.framework.meshRenderer[];
    skinRenders: gd3d.framework.skinnedMeshRenderer[];
    refreshTexture(tran: gd3d.framework.transform): void;
    refreshAniclip(tran: gd3d.framework.transform, name: string): void;
    start(app: gd3d.framework.application): void;
    private changeShader();
    change(sha: gd3d.framework.shader): void;
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class testReload implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    uileft: number;
    createChangeBtn(role: gd3d.framework.transform, role1: gd3d.framework.transform, o2d: gd3d.framework.overlay2D, part: string): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class TestRotate implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number;
        cube2: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        counttimer: number;
        name: string;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private loadPvr(laststate, state);
        private changeShader();
        private addcam(laststate, state);
        private addcube(laststate, state);
        cubetrail: gd3d.framework.transform;
        start(app: gd3d.framework.application): void;
        private angularVelocity;
        private eulerAngle;
        private zeroPoint;
        private startdir;
        private enddir;
        private targetdir;
        update(delta: number): void;
    }
}
declare class test_ShadowMap implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    renderer: gd3d.framework.meshRenderer[];
    skinRenders: gd3d.framework.skinnedMeshRenderer[];
    start(app: gd3d.framework.application): void;
    lightcamera: gd3d.framework.camera;
    depthTexture: gd3d.framework.texture;
    viewcamera: gd3d.framework.camera;
    timer: number;
    posToUV: gd3d.math.matrix;
    lightProjection: gd3d.math.matrix;
    update(delta: number): void;
    FitToScene(lightCamera: gd3d.framework.camera, aabb: gd3d.framework.aabb): void;
    asp: number;
    labelNear: HTMLLabelElement;
    labelFar: HTMLLabelElement;
    inputNear: HTMLInputElement;
    inputFar: HTMLInputElement;
    ShowUI(): void;
    ShowCameraInfo(camera: gd3d.framework.camera): void;
}
declare namespace t {
    class test_skillsystem implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number;
        cube2: gd3d.framework.transform;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        counttimer: number;
        private role;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcam(laststate, state);
        private addcube(laststate, state);
        private loadRole(laststate, state);
        private playAniAndEffect(aniplayer, aniName, effectName, playAniDelay, afterAni_PlayEffectDelay);
        effect: gd3d.framework.effectSystem;
        effect2: gd3d.framework.effectSystem;
        private loadEffect(laststate, state);
        start(app: gd3d.framework.application): void;
        private angularVelocity;
        private eulerAngle;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_sound implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        parts: gd3d.framework.transform;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        counttimer: number;
        private angularVelocity;
        private eulerAngle;
        loopedBuffer: AudioBuffer;
        once1: AudioBuffer;
        once2: AudioBuffer;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcam(laststate, state);
        private addcube(laststate, state);
        private loadSoundInfe(laststate, state);
        start(app: gd3d.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_streamlight implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    player: gd3d.framework.transform;
    cubes: {
        [id: string]: gd3d.framework.transform;
    };
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    cube2: gd3d.framework.transform;
    cube3: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_trailrenderrecorde implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        aniplayer: gd3d.framework.aniplayer;
        role: gd3d.framework.transform;
        private roleLength;
        private loadRole(laststate, state);
        private weapon;
        private loadWeapon(laststate, state);
        sh: gd3d.framework.shader;
        cube2: gd3d.framework.transform;
        private initscene(laststate, state);
        trailrender: gd3d.framework.trailRender;
        start(app: gd3d.framework.application): void;
        org: gd3d.framework.transform;
        cube: gd3d.framework.transform;
        camera: gd3d.framework.camera;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        grassMat: gd3d.framework.material;
        private wind;
        private WaveFrequency;
        private WaveAmplitude;
        play: boolean;
        update(delta: number): void;
        private addbtn(top, left, text);
    }
}
declare class test_texuv implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    baihu: gd3d.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_trailrender implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        sh: gd3d.framework.shader;
        private initscene(laststate, state);
        start(app: gd3d.framework.application): void;
        org: gd3d.framework.transform;
        cube: gd3d.framework.transform;
        camera: gd3d.framework.camera;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        grassMat: gd3d.framework.material;
        private wind;
        private WaveFrequency;
        private WaveAmplitude;
        play: boolean;
        update(delta: number): void;
        private addbtn(top, left, text);
    }
}
declare namespace t {
    enum enumcheck {
        AA = 0,
        BB = 1,
        CC = 2,
    }
    class test_ui implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        start(app: gd3d.framework.application): void;
        img_3: gd3d.framework.image2D;
        img_4: gd3d.framework.image2D;
        img_5: gd3d.framework.image2D;
        img_7: gd3d.framework.image2D;
        img_8: gd3d.framework.image2D;
        amount: number;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        timer: number;
        bere: boolean;
        bere1: boolean;
        update(delta: number): void;
    }
}
declare class testUserCodeUpdate implements gd3d.framework.IUserCode {
    beExecuteInEditorMode: boolean;
    trans: gd3d.framework.transform;
    timer: number;
    app: gd3d.framework.application;
    onStart(app: gd3d.framework.application): void;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_uvroll implements IState {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        private loadShader(laststate, state);
        private loadText(laststate, state);
        private addcube(laststate, state);
        private addcam(laststate, state);
        start(app: gd3d.framework.application): void;
        camera: gd3d.framework.camera;
        cube: gd3d.framework.transform;
        cube1: gd3d.framework.transform;
        cube2: gd3d.framework.transform;
        timer: number;
        taskmgr: gd3d.framework.taskMgr;
        count: number;
        row: number;
        col: number;
        totalframe: number;
        fps: number;
        private cycles;
        update(delta: number): void;
    }
}
declare class CameraController {
    private static g_this;
    static instance(): CameraController;
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
declare class Test_CameraController {
    private static g_this;
    static instance(): Test_CameraController;
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
    cameras: gd3d.framework.camera[];
    add(camera: gd3d.framework.camera): void;
    rotAngle: gd3d.math.vector3;
    isInit: boolean;
    decideCam(target: gd3d.framework.camera): void;
    init(app: gd3d.framework.application): void;
    private moveVector;
    doMove(delta: number): void;
    doRotate(rotateX: number, rotateY: number): void;
    lookat(trans: gd3d.framework.transform): void;
    checkOnRightClick(mouseEvent: MouseEvent): boolean;
    private doMouseWheel(ev, isFirefox);
    remove(): void;
}
declare class test_ChangeMaterial implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    cube: gd3d.framework.transform;
    camera: gd3d.framework.camera;
    isCube: boolean;
    timer: number;
    material1: gd3d.framework.material;
    material2: gd3d.framework.material;
    taskmgr: gd3d.framework.taskMgr;
    private loadShader(laststate, state);
    private loadTexture(laststate, state);
    private addCam(laststate, state);
    private addCube(laststate, state);
    isMaterial1: boolean;
    private addBtn();
    private setMaterial(laststate, state);
    start(app: gd3d.framework.application): void;
    zeroPoint: gd3d.math.vector3;
    update(delta: number): void;
}
declare class test_ChangeMesh implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    cube: gd3d.framework.transform;
    camera: gd3d.framework.camera;
    isCube: boolean;
    start(app: gd3d.framework.application): void;
    update(delta: number): void;
}
declare class test_NewGameObject implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    cube: gd3d.framework.transform;
    camera: gd3d.framework.camera;
    start(app: gd3d.framework.application): void;
    update(delta: number): void;
}
declare class test_NewScene implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    start(app: gd3d.framework.application): void;
    update(delta: number): void;
}
declare class test_Sound implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    taskmgr: gd3d.framework.taskMgr;
    camera: gd3d.framework.camera;
    cube: gd3d.framework.transform;
    time: number;
    private loadShader(laststate, state);
    private loadTexture(laststate, state);
    private addCam(laststate, state);
    private addCube(laststate, state);
    private addBtnLoadSound(laststate, state);
    start(app: gd3d.framework.application): void;
    update(delta: number): void;
}
declare class EffectElement extends gd3d.framework.transform {
    type: gd3d.framework.EffectElementTypeEnum;
    beLoop: boolean;
    name: string;
}
declare class test_effecteditor implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    camera: gd3d.framework.camera;
    timer: number;
    taskmgr: gd3d.framework.taskMgr;
    effect: gd3d.framework.effectSystem;
    label: HTMLLabelElement;
    gui: lighttool.htmlui.gui;
    transformRoot: gd3d.framework.transform;
    effectSystem: gd3d.framework.effectSystem;
    effectSysData: gd3d.framework.EffectSystemData;
    setVal(val: string, property: string, data: any): void;
    start(app: gd3d.framework.application): void;
    private scaleChecked;
    private positionChecked;
    private eulerChecked;
    private length;
    private addElement();
    private play();
    private loadShader(laststate, state);
    private loadText(laststate, state);
    private loadEffect(laststate, state);
    private addButton();
    private getNameFromURL(path);
    private addcam(laststate, state);
    tr: gd3d.framework.transform;
    ttr: gd3d.framework.transform;
    eff: gd3d.framework.effectSystem;
    beclone: boolean;
    effectloaded: boolean;
    bestop: boolean;
    bereplay: boolean;
    update(delta: number): void;
}
declare class test_drawMesh implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    timer: number;
    update(delta: number): void;
}
declare class test_LiLoadScene implements IState {
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application): void;
    camera: gd3d.framework.camera;
    timer: number;
    update(delta: number): void;
}
