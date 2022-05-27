/// <reference path="../lib/m4m.d.ts" />
/// <reference path="../lib/dat.gui.d.ts" />
/// <reference path="../lib/htmlui.d.ts" />
declare class demoList implements IState {
    private static funArr;
    static addBtn(title: string, demo: Function): void;
    start(app: any): void;
    update(): void;
}
declare class demo_ScreenSplit implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cameraCurseHover: number;
    windowRate: number;
    windowHorizon: boolean;
    mouseOver: boolean;
    mouseEnter: boolean;
    mouseDown: boolean;
    mouseMove: boolean;
    outcontainer: HTMLDivElement;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    camera1: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    cube4: m4m.framework.transform;
    timer: number;
    movetarget: m4m.math.vector3;
    targetCamera: m4m.framework.camera;
    inputMgr: m4m.framework.inputMgr;
    pointDown: boolean;
    splitline: HTMLDivElement;
    update(delta: number): void;
}
declare var RVO: any;
declare class demo_navigaionRVO implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    navmeshMgr: m4m.framework.NavMeshLoadManager;
    inputMgr: m4m.framework.inputMgr;
    assetMgr: m4m.framework.assetMgr;
    cubesize: number;
    player: m4m.framework.transform;
    static TestRVO: demo_navigaionRVO;
    rvoMgr: m4m.framework.RVOManager;
    start(app: m4m.framework.application): void;
    private isInitPlayer;
    private initPlayer;
    private loadScene;
    private Goals;
    private PosRayNavmesh;
    pickDown(): void;
    private rayNavMesh;
    private enemys;
    private addEnemy;
    private pos;
    private tryFindingPath;
    private lastLine;
    private drawLine;
    private genLineMesh;
    private createAllPoint;
    private setRoadPoint;
    private points;
    private generateGeomtry;
    baihu: m4m.framework.transform;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    bere: boolean;
    isAKeyDown: boolean;
    private pointDown;
    update(delta: number): void;
    private addbtn;
}
declare class dome_loadaniplayer implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskmgr: m4m.framework.taskMgr;
    role: m4m.framework.transform;
    assetmgr: m4m.framework.assetMgr;
    private roleName;
    private weaponName;
    private skillName;
    private names;
    private ani;
    private loadShader;
    private loadRole;
    private loadSkill;
    private loadWeapon;
    private ctrlBtn;
    private addCam;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare namespace t {
    class light_d1 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private addcube;
        private addCameraAndLight;
        start(app: m4m.framework.application): void;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class localSave {
    private static _instance;
    static get Instance(): localSave;
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
    start(app: m4m.framework.application): any;
    update(delta: number): any;
}
declare class main implements m4m.framework.IUserCode {
    static instance: main;
    app: m4m.framework.application;
    state: IState;
    onStart(app: m4m.framework.application): void;
    private def_x;
    private def_y;
    private x;
    private y;
    private btns;
    addBtn(text: string, act: () => IState): void;
    clearBtn(): void;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare class mini_sample implements IState {
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class test_01 implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
    private testPrefab;
    private testNRes;
    private testEffect;
}
declare class test_loadScene implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    timer: number;
    update(delta: number): void;
}
declare class test_loadMulBundle implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    refreshTexture(tran: m4m.framework.transform): void;
    refreshAniclip(tran: m4m.framework.transform): void;
    refreshLightMap(scene: m4m.framework.scene, rawscene: m4m.framework.rawscene): void;
    start(app: m4m.framework.application): void;
    baihu: m4m.framework.transform;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_pathAsset implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application): void;
        private loadShader;
        private loadTexture;
        private loadpath;
        private loadasset;
        sh: m4m.framework.shader;
        private initscene;
        private parentlist;
        private dragonlist;
        private traillist;
        private guippaths;
        private path;
        private showcamera;
        target: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        angle: number;
        timer: number;
        update(delta: number): void;
        private addbtns;
        private addBtn;
    }
    function DBgetAtrans(mat: m4m.framework.material, meshname?: string): m4m.framework.transform;
    function DBgetMat(texname?: string, shaderstring?: string): m4m.framework.material;
}
declare class test_loadprefab implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    refreshTexture(tran: m4m.framework.transform): void;
    refreshAniclip(tran: m4m.framework.transform, name: string): void;
    start(app: m4m.framework.application): void;
    private changeShader;
    change(sha: m4m.framework.shader): void;
    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class testReload implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    resRoot: string;
    careSubList: string[];
    r_a_Name: string;
    r_b_Name: string;
    start(app: m4m.framework.application): Promise<void>;
    uileft: number;
    createChangeBtn(role: m4m.framework.transform, role1: m4m.framework.transform, o2d: m4m.framework.overlay2D, part: string): void;
    excangeSub(r_a_part: m4m.framework.skinnedMeshRenderer, r_b_part: m4m.framework.skinnedMeshRenderer): void;
    camera: m4m.framework.camera;
    timer: number;
    update(delta: number): void;
}
declare class test_f4skin implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    boneConfig(bone: m4m.framework.transform, yOffset?: number, rotate?: number): void;
    assembSkeleton(segment: number): m4m.framework.transform[];
    createMesh(ctx: WebGLRenderingContext): m4m.framework.mesh;
    start(app: m4m.framework.application): Promise<void>;
    bones: m4m.framework.transform[];
    f4: m4m.framework.transform;
    rotate(bone: m4m.framework.transform, valuey: number, valuez: number): void;
    timer: number;
    update(delta: number): void;
}
declare class test_3DPhysics_baseShape implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    start(app: m4m.framework.application): Promise<any>;
    init(): void;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_compound implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private types;
    private sizes;
    private positions;
    private chairId;
    private crateChair;
    private crateCapsule;
    private targetTran;
    private boxTran;
    private cylinderTran;
    private floor;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private impulseTarget;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    cachePickInfo: m4m.framework.pickinfo;
    cacheRota: m4m.math.quaternion;
    cache_y: number;
    onPonitMove([x, y]: [any, any]): void;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_explode implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    iptMgr: m4m.framework.inputMgr;
    mrs: m4m.framework.meshRenderer[];
    start(app: m4m.framework.application): Promise<any>;
    private redSphere;
    private targetTran;
    private boxTran;
    private floor;
    private boxList;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private enumArr;
    private optStrs;
    private freezeDic;
    private impulseTarget;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private doExplode;
    delta: number;
    movespeed: number;
    keyDown([keyCode]: [any]): void;
    private explodeFroce;
    private explodeRadius;
    explode(point: m4m.math.vector3): void;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_freeze implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    iptMgr: m4m.framework.inputMgr;
    mrs: m4m.framework.meshRenderer[];
    start(app: m4m.framework.application): Promise<any>;
    private targetTran;
    private boxTran;
    private cylinderTran;
    private floor;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private enumArr;
    private optStrs;
    private freezeDic;
    private applyFreezeOpt;
    private impulseTarget;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    cachePickInfo: m4m.framework.pickinfo;
    cacheRota: m4m.math.quaternion;
    cache_y: number;
    onPonitMove([x, y]: [any, any]): void;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_ballandSocket implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_distance implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_hinge implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private applyReset;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_prismatic implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_slider implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_joint_wheel implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private connectedPivot;
    private mainPivot;
    private pole;
    private pole_1;
    addDisplayObj(): void;
    private tempV3;
    syncDisplayRT(): void;
    private guiMsg;
    setGUI(): void;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_kinematic implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    iptMgr: m4m.framework.inputMgr;
    mrs: m4m.framework.meshRenderer[];
    start(app: m4m.framework.application): Promise<any>;
    floor: m4m.framework.transform;
    ctrBox: m4m.framework.transform;
    init(): void;
    cachePickInfo: m4m.framework.pickinfo;
    cacheRota: m4m.math.quaternion;
    cache_y: number;
    onPonitMove([x, y]: [any, any]): void;
    updateRoate(): void;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_motor_hinge implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private motorSpeed;
    private targetMotor;
    private changeMotorSpeed;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_motor_slider implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private guiMsg;
    setGUI(): void;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private tempV3;
    private doImpulse;
    private motorSpeed;
    private targetMotor;
    private changeMotorSpeed;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_3DPhysics_motor_wheel implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    mrs: m4m.framework.meshRenderer[];
    iptMgr: m4m.framework.inputMgr;
    start(app: m4m.framework.application): Promise<any>;
    private boxTran;
    init(): void;
    private connectedPivot;
    private mainPivot;
    private pole;
    private pole_1;
    addDisplayObj(): void;
    private tempV3;
    syncDisplayRT(): void;
    private motorSpeed;
    private targetMotor;
    private changeMotorSpeed;
    private guiMsg;
    setGUI(): void;
    private impulseBox;
    private force;
    private contactlocalPoint;
    private doImpulse;
    private tcount;
    private time;
    update(delta: number): void;
}
declare class test_Decal implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    private buildingPname;
    private texName;
    private inited;
    start(app: m4m.framework.application): Promise<any>;
    private dec;
    private building;
    init(): void;
    private initCamera;
    private Y_ag;
    update(delta: number): void;
}
declare class test_GPU_instancing implements IState {
    private static readonly help_quat;
    private _app;
    private _scene;
    private _mat_ins;
    private createCount;
    private instanceShBase;
    private mats;
    private mrArr;
    private isInstancing;
    private cubeRoot;
    private cam;
    private modelType;
    private subRange;
    start(app: m4m.framework.application): Promise<void>;
    private _batcher;
    batcherSwitch(): void;
    refresh(): void;
    private _isStatic;
    get isStatic(): boolean;
    set isStatic(v: boolean);
    private _needUpdate;
    get needUpdate(): boolean;
    set needUpdate(v: boolean);
    private _needFillRenderer;
    get needFillRenderer(): boolean;
    set needFillRenderer(v: boolean);
    private loadedTest;
    loadTest(modelName: string): Promise<void>;
    createByNum(num: number): void;
    instanceSwitch(): void;
    initMaterails(): void;
    private count;
    createOne(app: any, needInstance: boolean): void;
    private lookAtCamera;
    private getRandom;
    update(delta: number): void;
}
declare type batcherStrct = {
    pass: m4m.render.glDrawPass;
    darr: m4m.math.ExtenArray<Float32Array>;
    renderers: m4m.math.ReuseArray<m4m.framework.IRendererGpuIns>;
};
declare class gpuInstanceMgr {
    private static SetedMap;
    static setToGupInstance(tran: m4m.framework.transform, resUrl?: string, mats?: m4m.framework.material[]): void;
    private static fillParameters;
    private static ckCanUseGpuInstance;
}
declare class HDR_sample implements IState {
    dec: string;
    isEnableGUI: boolean;
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    assetMgr: m4m.framework.assetMgr;
    sceneConfig: string;
    gltfModels: {
        gltfFolder: string;
        file: string;
        scale: number;
        cb: (root: any) => void;
    }[];
    HDRList: string[];
    HDRpath: string;
    _HDR: string;
    _Model: string;
    ModelList: string[];
    _enableLight: boolean;
    lightRoot: m4m.framework.transform;
    modelRoot: m4m.framework.transform;
    _load(path: string, type?: m4m.framework.AssetTypeEnum): Promise<unknown>;
    load<T extends m4m.framework.IAsset>(path: string, name: string, type?: m4m.framework.AssetTypeEnum): Promise<T>;
    loadCubeTexture(folder: string, images?: string[]): Promise<m4m.framework.texture>;
    start(app: m4m.framework.application): Promise<void>;
    toLoadGLTF(gltfModels: any[]): Promise<void>;
    enableGUI(): Promise<void>;
    get Model(): string;
    set Model(val: string);
    get enableLight(): boolean;
    set enableLight(val: boolean);
    toLoad(): void;
    clearGLTF(): void;
    update(delta: number): void;
}
declare class test_LineRenderer implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    lr: m4m.framework.LineRenderer;
    loop: boolean;
    viewcamera: boolean;
    start(app: m4m.framework.application): Promise<void>;
    setGUI(): void;
    private init;
    private initLineRenderer;
    private _showParticle;
    update(delta: number): void;
}
declare namespace m4m.math {
    interface color {
        "__class__"?: "m4m.math.color";
    }
    interface vector3 {
        "__class__"?: "m4m.math.vector3";
    }
}
declare class test_ParticleSystem implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    private _particles;
    private _particle;
    private _isMove;
    private _particleStartPosition;
    private _particleCurrentPosition;
    private _moveRadius;
    private _moveAngle;
    private _moveAngleSpeed;
    start(app: m4m.framework.application): Promise<void>;
    setGUI(): void;
    play(): void;
    stop(): void;
    private get particleName();
    private set particleName(value);
    private _particleName;
    private init;
    private _showParticle;
    update(delta: number): void;
}
declare class test_RangeScreen implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    cube4: m4m.framework.transform;
    timer: number;
    movetarget: m4m.math.vector3;
    inputMgr: m4m.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare var RVO: any;
declare class test_Rvo2 implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    inputMgr: m4m.framework.inputMgr;
    assetMgr: m4m.framework.assetMgr;
    sim: any;
    goals: any[];
    size: number;
    start(app: m4m.framework.application): void;
    spheres: m4m.framework.transform[];
    init(): void;
    camera: m4m.framework.camera;
    update(delta: number): void;
    reachedGoals(sim: any, goals: any): boolean;
    setPreferredVelocities(sim: any, goals: any): void;
    updateVisualization(sim: any): void;
}
declare class test_TrailRenderer implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    lr: m4m.framework.TrailRenderer;
    move: boolean;
    viewcamera: boolean;
    res: string;
    start(app: m4m.framework.application): Promise<void>;
    setGUI(): void;
    private init;
    private initLineRenderer;
    private loadRes;
    private _particleStartPosition;
    private _particleCurrentPosition;
    private _moveRadius;
    private _moveAngle;
    private _moveAngleSpeed;
    update(delta: number): void;
}
declare class test_UIEffect implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    img_3: m4m.framework.image2D;
    img_4: m4m.framework.image2D;
    img_5: m4m.framework.image2D;
    img_7: m4m.framework.image2D;
    img_8: m4m.framework.image2D;
    amount: number;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    timer: number;
    bere: boolean;
    bere1: boolean;
    update(delta: number): void;
}
declare class test_UIGuideMask implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    assetMgr: m4m.framework.assetMgr;
    iptMgr: m4m.framework.inputMgr;
    rooto2d: m4m.framework.overlay2D;
    private inited;
    start(app: m4m.framework.application): Promise<void>;
    private dec;
    init(): void;
    update(delta: number): void;
}
declare var fontjson: string;
declare var fontpng: string;
declare let emoji: string;
declare class test_UI_Component implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    static temp: m4m.framework.transform2D;
    start(app: m4m.framework.application): void;
    private createUI;
    private loadTexture;
    private loadAtlas;
    update(delta: number): void;
    testFun(): void;
}
declare namespace t {
    class test_blend implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        background: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        count: number;
        counttimer: number;
        private angularVelocity;
        private eulerAngle;
        private loadShader;
        private loadText;
        private addcam;
        foreground: m4m.framework.transform;
        private addplane;
        start(app: m4m.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_ETC1_KTX implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    astMgr: m4m.framework.assetMgr;
    private transform;
    start(app: m4m.framework.application): Promise<void>;
    private init;
    private loadPrefabs;
    ry: number;
    update(delta: number): void;
}
declare class test_fakepbr implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    light: m4m.framework.light;
    light2: m4m.framework.light;
    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_keyFrameAni implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskMgr: m4m.framework.taskMgr;
    obj3d: m4m.framework.transform;
    cameraNode: m4m.framework.transform;
    ins: m4m.framework.transform;
    start(app: m4m.framework.application): void;
    private addCamera;
    private loadAsset;
    private addbtns;
    private addbtn;
    update(delta: number): void;
}
declare class testLiChangeMesh implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    uileft: number;
    createChangeBtn(role: m4m.framework.transform, role1: m4m.framework.transform, o2d: m4m.framework.overlay2D, part: string, part2: any): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_rendertexture implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        sh: m4m.framework.shader;
        private initscene;
        private add3dmodelbeforeUi;
        start(app: m4m.framework.application): void;
        wath_camer: m4m.framework.camera;
        target: m4m.framework.transform;
        targetMat: m4m.framework.material;
        show_cube: m4m.framework.transform;
        showcamera: m4m.framework.camera;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        angle: number;
        update(delta: number): void;
    }
}
declare class test_loadCompressUseAssetbundle implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare namespace demo {
    class DragonTest implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        dragon: m4m.framework.transform;
        camTran: m4m.framework.transform;
        cube: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        private loadShader;
        private loadLongPrefab;
        private loadScene;
        private addCameraAndLight;
        start(app: m4m.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_navMesh implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    navmeshMgr: m4m.framework.NavMeshLoadManager;
    inputMgr: m4m.framework.inputMgr;
    assetMgr: m4m.framework.assetMgr;
    cubesize: number;
    start(app: m4m.framework.application): void;
    loadScene(assetName: string, isCompress?: boolean): void;
    private pos;
    pickDown(): void;
    private lastLine;
    private drawLine;
    private genMesh;
    private createAllPoint;
    private setPoint;
    private points;
    private generatePoint;
    baihu: m4m.framework.transform;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    bere: boolean;
    private pointDown;
    update(delta: number): void;
}
declare class test_optimize_size_animationClip implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    prefab: m4m.framework.transform;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    update(delta: number): void;
}
declare class test_pbr implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    cube: m4m.framework.transform;
    static temp: m4m.framework.transform2D;
    start(app: m4m.framework.application): void;
    private init;
    private PBRPath;
    private material;
    private skyName;
    private iblPath;
    private loadpbrRes;
    private loadpbrRes1;
    private loadpbrRes2;
    private loadpbrRes3;
    private loadpbrRes4;
    private loadTexture;
    private addCube;
    update(delta: number): void;
}
declare class test_pbr_scene implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    cube: m4m.framework.transform;
    static temp: m4m.framework.transform2D;
    start(app: m4m.framework.application): void;
    private lightPos1;
    private lightPos2;
    private addSphere;
    private init;
    private PBRPath;
    private material;
    private skyName;
    private iblPath;
    private loadpbrRes;
    private loadpbrRes1;
    private loadpbrRes2;
    private loadpbrRes3;
    private loadpbrRes4;
    private loadTexture;
    timer: number;
    update(delta: number): void;
}
declare namespace demo {
    class test_performance implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        assetMgr: m4m.framework.assetMgr;
        camera: m4m.framework.camera;
        camTran: m4m.framework.transform;
        start(app: m4m.framework.application): void;
        cubes: m4m.framework.transform[];
        count: number;
        all: number;
        tryadd(): void;
        update(delta: number): void;
        randome(): void;
    }
}
declare var RVO: any;
declare class test_pick_boxcollider implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    navmeshMgr: m4m.framework.NavMeshLoadManager;
    inputMgr: m4m.framework.inputMgr;
    assetMgr: m4m.framework.assetMgr;
    cubesize: number;
    player: m4m.framework.transform;
    sim: any;
    goals: any[];
    mods: m4m.framework.transform[];
    astMgr: m4m.framework.assetMgr;
    start(app: m4m.framework.application): void;
    private loadScene;
    private colorMap;
    private getColor;
    private balls;
    private addBall;
    private pickLayer;
    pickDown(): void;
    private rayCollider;
    private points;
    private generateGeomtry;
    camera: m4m.framework.camera;
    timer: number;
    bere: boolean;
    isAKeyDown: boolean;
    private pointDown;
    update(delta: number): void;
}
declare class test_postCamera implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    timer: number;
    update(delta: number): void;
    camTran: m4m.framework.transform;
    postColor: m4m.framework.cameraPostQueue_Color;
    postQuad: m4m.framework.cameraPostQueue_Quad;
    depthColor: m4m.framework.cameraPostQueue_Depth;
    private addCamera;
}
declare class test_softCut implements IState {
    static temp: any;
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    start(app: m4m.framework.application): void;
    private createUI;
    private loadTexture;
    update(delta: number): void;
}
declare class test_spine_additiveBlending implements IState {
    start(app: m4m.framework.application): void;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_changeSkin implements IState {
    start(app: m4m.framework.application): void;
    setGUI(): void;
    private randomSkin;
    private randomGroupSkin;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_change_slot_mesh_tex implements IState {
    assetManager: spine_m4m.SpineAssetMgr;
    private _index;
    start(app: m4m.framework.application): void;
    private changeSlot;
    private clearSlot;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_change_slot_region_tex implements IState {
    assetManager: spine_m4m.SpineAssetMgr;
    private _index;
    start(app: m4m.framework.application): void;
    private changeSlot;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_clip implements IState {
    start(app: m4m.framework.application): void;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_IK implements IState {
    private _inited;
    private controlBones;
    private _temptMat;
    private _temptPos;
    private _chooseBone;
    private bonesPos;
    private _hoverBone;
    start(app: m4m.framework.application): void;
    private fire;
    private jump;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_imageChange implements IState {
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class test_spine_mesh implements IState {
    start(app: m4m.framework.application): void;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare namespace spine_m4m {
    class m4mTexture {
    }
    class spineSkeleton implements m4m.framework.I2DComponent {
        constructor(skeletonData: any);
        state: AnimationState;
        animData: any;
        skeleton: Skeleton;
        onPlay(): any;
        start(): any;
        update(delta: number): any;
        transform: m4m.framework.transform2D;
        remove(): any;
        onUpdate: () => void;
        getToCanvasMatrix(mat?: m4m.math.matrix3x2): m4m.math.matrix3x2;
        changeSlotTexture(slotName: string, texture: m4mTexture): any;
        clearSlot(slotName: string): any;
    }
    class SpineAssetMgr {
        constructor(mgr: m4m.framework.assetMgr, baseUrl?: string);
        loadBinary(path: string, success?: (path: string, binary: Uint8Array) => void, error?: (path: string, message: string) => void): void;
        loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, message: string) => void): void;
        loadJson(path: string, success?: (path: string, object: object) => void, error?: (path: string, message: string) => void): void;
        loadTexture(path: string, success?: (path: string, texture: m4mTexture) => void, error?: (path: string, message: string) => void): void;
        loadTextureAtlas(path: string, success?: (path: string, atlas: any) => void, error?: (path: string, message: string) => void, fileAlias?: {
            [keyword: string]: string;
        }): void;
        get(asset: string): any;
    }
    class AtlasAttachmentLoader {
        constructor(atlas: any);
    }
    class SkeletonJson {
        constructor(json: any);
        readSkeletonData(data: any): any;
        scale: number;
    }
    class AnimationState {
        timeScale: number;
        addAnimation(trackIndex: number, animationName: string, loop?: boolean, delay?: number): TrackEntry;
        setAnimation(trackIndex: number, animationName: string, loop?: boolean): TrackEntry;
        addEmptyAnimation(trackIndex: number, mixDuration?: number, delay?: number): TrackEntry;
        setEmptyAnimations(mixDuration?: number): void;
        setEmptyAnimation(trackIndex: number, mixDuration?: number): TrackEntry;
    }
    class TrackEntry {
        previous: TrackEntry;
        next: TrackEntry;
        mixingFrom: TrackEntry;
        mixingTo: TrackEntry;
        listener: AnimationStateListener;
        trackIndex: number;
        loop: boolean;
        mixBlend: MixBlend;
        alpha: number;
    }
    enum MixBlend {
        setup = 0,
        first = 1,
        replace = 2,
        add = 3
    }
    class AnimationStateListener {
        start?(entry: TrackEntry): void;
        interrupt?(entry: TrackEntry): void;
        end?(entry: TrackEntry): void;
        dispose?(entry: TrackEntry): void;
        complete?(entry: TrackEntry): void;
        event?(entry: TrackEntry, event: Event): void;
    }
    class Skeleton {
        data: SkeletonData;
        slots: Slot[];
        scaleX: number;
        scaleY: number;
        x: number;
        y: number;
        setSkinByName(skinName: string): void;
        setSkin(skin: Skin): void;
        setSlotsToSetupPose(): any;
        findBone(boneName: string): Bone;
    }
    class SkeletonData {
        skins: Skin[];
    }
    class Skin {
        name: string;
        setAttachment(slotIndex: number, name: string, attachment: Attachment): void;
        attachments: {
            [att: string]: Attachment;
        }[];
        constructor(name: string);
    }
    class Bone {
        data: BoneData;
        skeleton: Skeleton;
        parent: Bone;
        children: Bone[];
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        ax: number;
        ay: number;
        arotation: number;
        ascaleX: number;
        ascaleY: number;
        ashearX: number;
        ashearY: number;
        a: number;
        b: number;
        c: number;
        d: number;
        worldY: number;
        worldX: number;
        sorted: boolean;
        active: boolean;
        worldToLocal(world: Vector2): Vector2;
        localToWorld(local: Vector2): Vector2;
        worldToLocalRotation(worldRotation: number): number;
        localToWorldRotation(localRotation: number): number;
        rotateWorld(degrees: number): void;
    }
    class BoneData {
        index: number;
        name: string;
        parent: BoneData;
        length: number;
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
    }
    class Slot {
    }
    abstract class Attachment {
        name: string;
    }
    class Vector2 {
        x: number;
        y: number;
        set(x: number, y: number): any;
    }
}
declare class test_spine_spriteSheet implements IState {
    start(app: m4m.framework.application): void;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_stretchyMan implements IState {
    private _inited;
    private controlBones;
    private _temptMat;
    private _temptPos;
    private _chooseBone;
    private bonesPos;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_tank implements IState {
    start(app: m4m.framework.application): void;
    setGUI(): void;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_transition implements IState {
    start(app: m4m.framework.application): void;
    private setAnimations;
    setGUI(): void;
    private playDie;
    private speed;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_vin implements IState {
    private _inited;
    private controlBones;
    private _temptMat;
    private _temptPos;
    private _chooseBone;
    private bonesPos;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
    private _comp;
}
declare class test_spine_wheelTransform implements IState {
    private _inited;
    private controlBones;
    private _temptMat;
    private _temptPos;
    private _chooseBone;
    private bonesPos;
    private _hoverBone;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
    private _comp;
}
declare class test_sssss implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    taskmgr: m4m.framework.taskMgr;
    cam: m4m.framework.camera;
    start(app: m4m.framework.application): void;
    private init;
    private loadpbrRes;
    private loadIBL;
    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare enum ShockType {
    Vertical = 0,
    Horizontal = 1,
    Both = 2
}
declare class CameraShock implements m4m.framework.INodeComponent {
    gameObject: m4m.framework.gameObject;
    private isPlaying;
    private fade;
    private oldTranslate;
    private shockType;
    private strength;
    private life;
    private ticker;
    start(): void;
    onPlay(): void;
    play(strength?: number, life?: number, fade?: boolean, shockType?: ShockType): void;
    update(delta: number): void;
    remove(): void;
    clone(): void;
}
declare class Joystick {
    app: m4m.framework.application;
    overlay2d: m4m.framework.overlay2D;
    private joystickLeft0;
    private joystickLeft1;
    private joystickRight0;
    private joystickRight1;
    private taskmgr;
    triggerFunc: Function;
    init(app: m4m.framework.application, overlay2d: m4m.framework.overlay2D): void;
    private loadTexture;
    private addJoystick;
    leftAxis: m4m.math.vector2;
    rightAxis: m4m.math.vector2;
    private maxScale;
    private touchLeft;
    private touchRight;
    private mouseLeft;
    private mouseRight;
    get leftTouching(): boolean;
    get rightTouching(): boolean;
    private onMouseDown;
    private onMouseUp;
    private onMouseMove;
    private onTouchStart;
    private onTouchEnd;
    private onTouchMove;
    update(delta: number): void;
}
declare namespace demo {
    class TankGame implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        postQuad: m4m.framework.cameraPostQueue_Quad;
        light: m4m.framework.light;
        heroTank: m4m.framework.transform;
        heroGun: m4m.framework.transform;
        heroSlot: m4m.framework.transform;
        enemyTank: m4m.framework.transform;
        enemyGun: m4m.framework.transform;
        enemySlot: m4m.framework.transform;
        ground: m4m.framework.transform;
        cubes: m4m.framework.transform[];
        walls: m4m.framework.transform[];
        overlay2d: m4m.framework.overlay2D;
        joystick: Joystick;
        taskmgr: m4m.framework.taskMgr;
        tankMoveSpeed: number;
        tankRotateSpeed: m4m.math.vector3;
        gunRotateSpeed: m4m.math.vector3;
        angleLimit: number;
        colVisible: boolean;
        private label;
        private loadShader;
        private loadTexture;
        private loadHeroPrefab;
        private loadEnemyPrefab;
        private loadScene;
        private cameraShock;
        private addCameraAndLight;
        private addJoystick;
        private addObject;
        private keyMap;
        start(app: m4m.framework.application): void;
        update(delta: number): void;
        testTankCol(tran: m4m.framework.transform): boolean;
        tempTran: m4m.framework.transform;
        tankControl(delta: number): void;
        bulletId: number;
        bulletList: any[];
        bulletSpeed: number;
        fireStep: number;
        fireTick: number;
        private fire;
        private updateBullet;
    }
}
declare namespace t {
    class test_three_leaved_rose_curve implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number;
        cube2: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        count: number;
        counttimer: number;
        private loadShader;
        private loadText;
        aniplayer: m4m.framework.aniplayer;
        role: m4m.framework.transform;
        private roleLength;
        private loadRole;
        private addcam;
        private addcube;
        start(app: m4m.framework.application): void;
        private angularVelocity;
        private eulerAngle;
        private zeroPoint;
        update(delta: number): void;
    }
}
declare class test_uiPerfabLoad implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    start(app: m4m.framework.application): void;
    private bgui;
    private createUI;
    targetui: m4m.framework.transform2D;
    private doLoad;
    private loadShaders;
    private loadTexture;
    update(delta: number): void;
}
declare class test_uimove implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
    private test;
}
declare class Rect extends m4m.framework.transform {
    width: number;
    height: number;
    offset: m4m.math.vector3;
    get bParent(): Rect;
    children: Rect[];
    alignType: AlignType;
    points: m4m.math.vector3[];
    alignPos: m4m.math.vector3;
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
    BOTTOM_RIGHT = 9
}
declare class test_anim implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    update(delta: number): void;
}
declare class test_loadAsiprefab implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    trans: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare class test_assestmgr implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    assetName: string;
    count: number;
    start(app: m4m.framework.application): void;
    _prefab: m4m.framework.prefab;
    baihu: m4m.framework.transform[];
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    bere: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_changeshader implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        renderer: m4m.framework.meshRenderer;
        skinrender: m4m.framework.skinnedMeshRenderer;
        objCam: m4m.framework.transform;
        start(app: m4m.framework.application): void;
        private changeShader;
        change(sha: m4m.framework.shader): void;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        cube2: m4m.framework.transform;
        cube3: m4m.framework.transform;
        timer: number;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_clearDepth0 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application): void;
        private loadShader;
        private loadTexture;
        sh: m4m.framework.shader;
        private initscene;
        private fuckLabel;
        private showcamera;
        target: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        angle: number;
        timer: number;
        update(delta: number): void;
    }
}
declare class test_effect implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    timer: number;
    taskmgr: m4m.framework.taskMgr;
    effect: m4m.framework.effectSystem;
    label: HTMLLabelElement;
    private loadShader;
    private loadText;
    private addcube;
    private dragon;
    private loadModel;
    start(app: m4m.framework.application): void;
    private text;
    private loadEffect;
    private addButton;
    private getNameFromURL;
    private addcam;
    tr: m4m.framework.transform;
    ttr: m4m.framework.transform;
    beclone: boolean;
    effectloaded: boolean;
    bestop: boolean;
    bereplay: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_integratedrender implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        aniplayer: m4m.framework.aniplayer;
        role: m4m.framework.transform;
        private roleLength;
        private loadRole;
        private weapon;
        private loadWeapon;
        sh: m4m.framework.shader;
        cube2: m4m.framework.transform;
        private initscene;
        trailrender: m4m.framework.trailRender;
        start(app: m4m.framework.application): void;
        org: m4m.framework.transform;
        cube: m4m.framework.transform;
        camera: m4m.framework.camera;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        grassMat: m4m.framework.material;
        private wind;
        private WaveFrequency;
        private WaveAmplitude;
        play: boolean;
        update(delta: number): void;
        private addbtn;
    }
}
declare namespace t {
    class test_light1 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        tex: m4m.framework.texture;
        private loadText;
        private addCubes;
        private addCube;
        private addCameraAndLight;
        start(app: m4m.framework.application): void;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number;
        update(delta: number): void;
    }
}
declare class testloadImmediate implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace dome {
    class testCJ implements IState {
        private loadShader;
        dragon: m4m.framework.transform;
        cameraPoint: m4m.framework.transform;
        private loadmesh;
        private loadweapon;
        private test;
        camera: m4m.framework.camera;
        private addCamera;
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        taskmgr: m4m.framework.taskMgr;
        assetMgr: m4m.framework.assetMgr;
        start(app: m4m.framework.application): void;
        trans: m4m.framework.transform;
        time: number;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_xinshouMask implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        imageRenderMask: m4m.framework.meshRenderer;
        texture: m4m.framework.texture;
        start(app: m4m.framework.application): void;
        addDomUI(): void;
        camera: m4m.framework.camera;
        timer: number;
        update(delta: number): void;
    }
    function getFileName(url: string): string;
}
declare class test_load implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: any;
    camNode: m4m.framework.transform;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare namespace t {
    class test_metal implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        private addcamandlight;
        private addmetalmodel;
        private addAsiModel;
        start(app: m4m.framework.application): void;
        private addinput;
        private addbtn;
        diffuse: HTMLInputElement;
        emitpower: HTMLInputElement;
        model: m4m.framework.transform;
        cube: m4m.framework.transform;
        cube1render: m4m.framework.meshRenderer;
        cube2render: m4m.framework.meshRenderer;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class test_multipleplayer_anim implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    player: m4m.framework.transform;
    cubes: {
        [id: string]: m4m.framework.transform;
    };
    resName: string;
    get abName(): string;
    get prefabName(): string;
    get resPath(): string;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    aniplayers: m4m.framework.aniplayer[];
    update(delta: number): void;
}
declare namespace t {
    class Test_NormalMap implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        cuber: m4m.framework.meshRenderer;
        private normalCube;
        private addnormalcube;
        private addcube;
        private addcamandlight;
        start(app: m4m.framework.application): void;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        update(delta: number): void;
    }
}
declare class test_pick implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    cube4: m4m.framework.transform;
    timer: number;
    movetarget: m4m.math.vector3;
    inputMgr: m4m.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare class test_pick_4p implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    cube4: m4m.framework.transform;
    timer: number;
    movetarget: m4m.math.vector3;
    inputMgr: m4m.framework.inputMgr;
    pointDown: boolean;
    update(delta: number): void;
}
declare namespace t {
    class test_post_bloom implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        private addcamandlight;
        start(app: m4m.framework.application): void;
        private addbtn;
        camera: m4m.framework.camera;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_posteffect implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        private addcube;
        private addcamandlight;
        start(app: m4m.framework.application): void;
        private addbtn;
        camera: m4m.framework.camera;
        light: m4m.framework.light;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        update(delta: number): void;
    }
}
declare namespace t {
    class TestRotate implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number;
        cube2: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        count: number;
        counttimer: number;
        name: string;
        private loadShader;
        private loadText;
        private loadPvr;
        private changeShader;
        private addcam;
        private addcube;
        cubetrail: m4m.framework.transform;
        start(app: m4m.framework.application): void;
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
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    renderer: m4m.framework.meshRenderer[];
    skinRenders: m4m.framework.skinnedMeshRenderer[];
    assetmgr: m4m.framework.assetMgr;
    start(app: m4m.framework.application): void;
    private shadowSh;
    private mats;
    private collectMat;
    private setmat;
    lightcamera: m4m.framework.camera;
    depthTexture: m4m.framework.texture;
    viewcamera: m4m.framework.camera;
    timer: number;
    posToUV: m4m.math.matrix;
    lightProjection: m4m.math.matrix;
    update(delta: number): void;
    FitToScene(lightCamera: m4m.framework.camera, aabb: m4m.framework.aabb): void;
    asp: number;
    labelNear: HTMLLabelElement;
    labelFar: HTMLLabelElement;
    inputNear: HTMLInputElement;
    inputFar: HTMLInputElement;
    ShowUI(): void;
    ShowCameraInfo(camera: m4m.framework.camera): void;
}
declare namespace t {
    class test_skillsystem implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        parts: m4m.framework.transform;
        timer: number;
        cube2: m4m.framework.transform;
        taskmgr: m4m.framework.taskMgr;
        count: number;
        counttimer: number;
        private role;
        private loadShader;
        private loadText;
        private addcam;
        private addcube;
        private loadRole;
        private playAniAndEffect;
        effect: m4m.framework.effectSystem;
        effect2: m4m.framework.effectSystem;
        private loadEffect;
        start(app: m4m.framework.application): void;
        private angularVelocity;
        private eulerAngle;
        update(delta: number): void;
    }
}
declare namespace t {
    class test_sound implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.transform;
        once1: AudioBuffer;
        once2: AudioBuffer;
        private loadSoundInfe;
        start(app: m4m.framework.application): void;
        update(delta: number): void;
    }
}
declare class test_streamlight implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    player: m4m.framework.transform;
    cubes: {
        [id: string]: m4m.framework.transform;
    };
    start(app: m4m.framework.application): void;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    cube2: m4m.framework.transform;
    cube3: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_trailrenderrecorde implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        aniplayer: m4m.framework.aniplayer;
        role: m4m.framework.transform;
        private roleLength;
        private loadRole;
        private weapon;
        private loadWeapon;
        sh: m4m.framework.shader;
        cube2: m4m.framework.transform;
        private initscene;
        trailrender: m4m.framework.trailRender;
        start(app: m4m.framework.application): void;
        org: m4m.framework.transform;
        cube: m4m.framework.transform;
        camera: m4m.framework.camera;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        grassMat: m4m.framework.material;
        private wind;
        private WaveFrequency;
        private WaveAmplitude;
        play: boolean;
        update(delta: number): void;
        private addbtn;
    }
}
declare class test_texuv implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    private createBaseCube;
    private createUvCube;
    camera: m4m.framework.camera;
    baihu: m4m.framework.transform;
    timer: number;
    update(delta: number): void;
}
declare namespace t {
    class test_trailrender implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        texResName: string;
        private initscene;
        start(app: m4m.framework.application): void;
        org: m4m.framework.transform;
        timer: number;
        play: boolean;
        update(delta: number): void;
        private addUI;
        private addbtn;
    }
}
declare namespace t {
    enum enumcheck {
        AA = 0,
        BB = 1,
        CC = 2
    }
    class test_ui implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        start(app: m4m.framework.application): void;
        img_3: m4m.framework.image2D;
        img_4: m4m.framework.image2D;
        img_5: m4m.framework.image2D;
        img_7: m4m.framework.image2D;
        img_8: m4m.framework.image2D;
        amount: number;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        timer: number;
        bere: boolean;
        bere1: boolean;
        update(delta: number): void;
    }
}
declare class testUserCodeUpdate implements m4m.framework.IUserCode {
    beExecuteInEditorMode: boolean;
    trans: m4m.framework.transform;
    timer: number;
    app: m4m.framework.application;
    onStart(app: m4m.framework.application): void;
    onUpdate(delta: number): void;
    isClosed(): boolean;
}
declare namespace t {
    class test_uvroll implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        private loadShader;
        private loadText;
        private addcube;
        private addcam;
        start(app: m4m.framework.application): void;
        camera: m4m.framework.camera;
        cube: m4m.framework.transform;
        cube1: m4m.framework.transform;
        cube2: m4m.framework.transform;
        timer: number;
        taskmgr: m4m.framework.taskMgr;
        count: number;
        row: number;
        col: number;
        totalframe: number;
        fps: number;
        private cycles;
        update(delta: number): void;
    }
}
declare namespace util {
    function loadShader(assetMgr: m4m.framework.assetMgr): Promise<void>;
    function loadModel(assetMgr: m4m.framework.assetMgr, modelName: string): Promise<m4m.framework.prefab>;
    function addCamera(scene: m4m.framework.scene): m4m.framework.transform;
    function loadTex(url: string, assetMgr: m4m.framework.assetMgr): Promise<void>;
    function loadTextures(urls: string[], assetMgr: m4m.framework.assetMgr): Promise<void[]>;
}
declare class UseAniplayClipDemo implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    aniClip: m4m.framework.animationClip;
    taskMgr: m4m.framework.taskMgr;
    aniplayer: m4m.framework.aniplayer;
    private loadAniplayClip;
    private loadRole;
    private loadShader;
    private addCamera;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UseAssetByLoadDemoList implements IState {
    app: m4m.framework.application;
    state: IState;
    start(app: m4m.framework.application): void;
    private x;
    private y;
    private btns;
    private addBtn;
    private clearBtn;
    update(delta: any): void;
}
declare class UseAudioDemo implements IState {
    audioplay: m4m.framework.AudioPlayer;
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr;
    objCam: m4m.framework.transform;
    audiobuf: AudioBuffer;
    private loadAudio;
    private addCamera;
    private addAudioPlay;
    private loadShader;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UseF14EffectDemo implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr;
    eff: m4m.framework.transform;
    effectSystems: m4m.framework.f14EffectSystem;
    private useF14Effect;
    private loadF14Effect;
    playEffect(): void;
    stopEffect(): void;
    addCtrl(): void;
    private addCamera;
    private loadShader;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UseMeshAndMatDemo implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr;
    private loadMesh;
    private loadMaterial;
    private useMeshAndMat;
    private loadShader;
    private addCamera;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UsePrefebDemo implements IState {
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UsePrefebDemo2 implements IState {
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UseSceneDemo implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr;
    private useRawScene;
    private loadScene;
    private loadShader;
    private addCamera;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class UseTextureDemo implements IState {
    app: m4m.framework.application;
    assetMgr: m4m.framework.assetMgr;
    scene: m4m.framework.scene;
    taskMgr: m4m.framework.taskMgr;
    texture: m4m.framework.texture;
    quad: m4m.framework.transform;
    start(app: m4m.framework.application): void;
    private loadTexture;
    private useTexture;
    private loadShader;
    private loadQuad;
    private addCtrl;
    update(delta: number): void;
}
declare class Test_CameraController {
    private static g_this;
    static instance(): Test_CameraController;
    gameObject: m4m.framework.gameObject;
    app: m4m.framework.application;
    target: m4m.framework.camera;
    moveSpeed: number;
    movemul: number;
    wheelSpeed: number;
    rotateSpeed: number;
    keyMap: {
        [id: number]: boolean;
    };
    beRightClick: boolean;
    update(delta: number): void;
    cameras: m4m.framework.camera[];
    add(camera: m4m.framework.camera): void;
    rotAngle: m4m.math.vector3;
    isInit: boolean;
    decideCam(target: m4m.framework.camera): void;
    init(app: m4m.framework.application): void;
    private moveVector;
    doMove(delta: number): void;
    doRotate(rotateX: number, rotateY: number): void;
    lookat(trans: m4m.framework.transform): void;
    checkOnRightClick(mouseEvent: MouseEvent): boolean;
    private doMouseWheel;
    remove(): void;
}
declare class CameraController {
    private static g_this;
    static instance(): CameraController;
    gameObject: m4m.framework.gameObject;
    app: m4m.framework.application;
    target: m4m.framework.camera;
    moveSpeed: number;
    movemul: number;
    wheelSpeed: number;
    rotateSpeed: number;
    keyMap: {
        [id: number]: boolean;
    };
    beRightClick: boolean;
    update(delta: number): void;
    rotAngle: m4m.math.vector3;
    isInit: boolean;
    init(app: m4m.framework.application, target: m4m.framework.camera): void;
    private moveVector;
    doMove(delta: number): void;
    doRotate(rotateX: number, rotateY: number): void;
    lookat(trans: m4m.framework.transform): void;
    checkOnRightClick(mouseEvent: MouseEvent): boolean;
    private doMouseWheel;
    remove(): void;
}
declare namespace dome {
    class GMesh {
        vf: number;
        vertexByteSize: number;
        mat: m4m.framework.material;
        mesh: m4m.framework.mesh;
        maxVerteCount: number;
        currentVerteCount: number;
        maxVboLen: number;
        realVboLen: number;
        vbodata: Float32Array;
        maxEboLen: number;
        realEboLen: number;
        ebodata: Uint16Array;
        constructor(mat: m4m.framework.material, vCount: number, vf: number, webgl: WebGLRenderingContext);
        reset(): void;
        private temptPos;
        uploadMeshData(mat: m4m.math.matrix, mesh: m4m.framework.mesh, webgl: WebGLRenderingContext): void;
        mixToGLmesh(webgl: WebGLRenderingContext): void;
        private checkMeshCapacity;
    }
    class mixMesh implements IState {
        app: m4m.framework.application;
        prefab: m4m.framework.transform;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        root: m4m.framework.transform;
        picker: any[];
        obs: any;
        flag: boolean;
        start(app: m4m.framework.application): void;
        refresh(): void;
        generateSignelObs(target: any): void;
        load(path: string, cb: any): void;
        loadPrefab(name: string, cb: any): void;
        update(delta: number): void;
        targets: m4m.framework.transform[];
        matDic: {
            [matID: number]: m4m.framework.transform[];
        };
        matinstance: {
            [matID: number]: m4m.framework.material;
        };
        mixmeshDic: {
            [matID: number]: GMesh;
        };
        mixMesh(targets: m4m.framework.transform[], vf?: number): {
            nobatch: m4m.framework.transform[];
            batch: m4m.framework.transform[];
            mixMeshId: number[];
        };
    }
}
declare namespace dome {
    class paowuxian implements IState {
        camera: m4m.framework.camera;
        scene: m4m.framework.scene;
        app: m4m.framework.application;
        assetmgr: m4m.framework.assetMgr;
        taskmgr: m4m.framework.taskMgr;
        private paoLen;
        private paojia;
        private paodan;
        private guiji;
        private guanghuan;
        private orgPos;
        rotEuler: m4m.math.vector3;
        gravity: number;
        speed: number;
        dir: m4m.math.vector3;
        start(app: m4m.framework.application): void;
        private loadShader;
        private gamerun;
        private paoKouPos;
        private timer;
        private forward;
        update(delta: number): void;
        private beNeedRecompute;
        private worldPoints;
        private targets;
        private worldStart;
        private startTrans;
        private worldEnd;
        private endTrans;
        private worldMiddle;
        private middleTrans;
        private detectTarget_2;
        private detectSecond_Colliders;
        private detectSecond_Collider;
        private detectSecond_Meshs;
        private detectSecond_Mesh;
        private linedetectcollider;
        private lineDetectMesh;
        private cam2;
        private camctr;
        private addcam;
        private addcube;
        private cubes;
        private addscaledCube;
        getDirByRotAngle(euler: m4m.math.vector3, dir: m4m.math.vector3): void;
        private mesh;
        private lerpCount;
        private guanghuantoPaoJia;
        private pointArr;
        private endpos;
        private hPos;
        private startPos;
        getMeshData(anglex: number, gravity: number, speed: number, paoLen: number, paojiaPosY?: number): m4m.framework.mesh;
        private initmesh;
        private actived;
        private enableWASD;
        private addUI;
        private apply;
        private addBtn;
        private loadmesh;
        private intersects;
        private intersectCollider;
        private getRotAnlge;
        private fromToRotation;
    }
    class camCtr implements m4m.framework.INodeComponent {
        gameObject: m4m.framework.gameObject;
        type: string;
        private _target;
        private _worldOffset;
        private _distance;
        private _offset;
        private camrotAgnle;
        setTarget(target: m4m.framework.transform, worldOffset?: m4m.math.vector3): void;
        setRotAngle(yanle: number, xangle: number): void;
        setDistanceToTarget(distance: number): void;
        onPlay(): void;
        start(): void;
        private targetpos;
        update(delta: number): void;
        remove(): void;
        clone(): void;
    }
}
declare namespace dome {
    class paowuxian2 implements IState {
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        assetmgr: m4m.framework.assetMgr;
        taskmgr: m4m.framework.taskMgr;
        camera: m4m.framework.camera;
        inputMgr: m4m.framework.inputMgr;
        rooto2d: m4m.framework.overlay2D;
        start(app: m4m.framework.application): void;
        private pointDown;
        update(delta: number): void;
        private loadShader;
        private targets;
        private loadmesh;
        private addcam;
        paojia: m4m.framework.transform;
        paodan: m4m.framework.transform;
        cam2: m4m.framework.gameObject;
        camctr: camCtr;
        testUI: m4m.framework.transform2D;
        beUIFollow: boolean;
        hitPosition: m4m.math.vector3;
        behit: boolean;
        middlePos: m4m.math.vector3;
        gameInit(laststate: m4m.framework.taskstate, state: m4m.framework.taskstate): void;
        addPaoDancam(): void;
        private targetPos;
        private floor;
        fire(): void;
        private beLaunched;
        private time;
        private totaltime;
        private fireBullet;
        private temp_pickInfo;
        private pickScene;
        gameupdate(delta: number): void;
        private temptPos;
        private temptdir;
        private lookpos;
        private lastPos;
        private realDIr;
        private winddisturb;
        private gravitydisturb;
        private onEndCollision;
        private updateBullet;
        private screenpos;
        private updateUI;
        private targetRotation;
        private lastRotaion;
        private paoheight;
        private paoLen;
        private paokouPos;
        private beforeRotatePaojia;
        private onberforeFire;
        private beActiveRot;
        private rotTotalTime;
        private rottime;
        private onRotEnd;
        private updateRotPaojia;
        private scaleAndAdd;
        rayInstersetScene(ray: m4m.framework.ray, fuc: (info: m4m.framework.pickinfo) => void): void;
        intersetMesh(ray: m4m.framework.ray, info: m4m.framework.pickinfo, tran: m4m.framework.transform): boolean;
        intersetColliders(ray: m4m.framework.ray, trans: m4m.framework.transform[]): m4m.framework.pickinfo[];
        addcube(pos: m4m.math.vector3, scale?: m4m.math.vector3): m4m.framework.transform;
        private addBtn;
        private adjustMiddlePoint;
        private bessel;
        private getBeselDir;
        private getRotationByDir;
        private getRotAnlge;
        private fromToRotation;
    }
}
declare class physic2d_dome implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    taskmgr: m4m.framework.taskMgr;
    assetMgr: m4m.framework.assetMgr;
    rooto2d: m4m.framework.overlay2D;
    static temp: m4m.framework.transform2D;
    start(app: m4m.framework.application): void;
    private createUI;
    private crea2dWall;
    private creatbox;
    private loadTexture;
    update(delta: number): void;
}
declare namespace PhysicDemo {
    class physic_01 implements IState {
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        start(app: m4m.framework.application): void;
        update(delta: number): void;
    }
}
declare namespace dome {
    class db_test_f14eff implements IState {
        rotEuler: number;
        app: m4m.framework.application;
        scene: m4m.framework.scene;
        camera: m4m.framework.camera;
        timer: number;
        label: HTMLLabelElement;
        rot: m4m.math.quaternion;
        start(app: m4m.framework.application): void;
        private f14eff;
        private effPrefab;
        effbaseprefab: m4m.framework.prefab;
        private loadEffectPrefab;
        private addUI;
        private addButton;
        private addButton2;
        private addCamera;
        update(delta: number): void;
    }
}
declare class test_ChangeMaterial implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cube: m4m.framework.transform;
    camera: m4m.framework.camera;
    isCube: boolean;
    timer: number;
    material1: m4m.framework.material;
    material2: m4m.framework.material;
    taskmgr: m4m.framework.taskMgr;
    private loadShader;
    private loadTexture;
    private addCam;
    private addCube;
    isMaterial1: boolean;
    private addBtn;
    private setMaterial;
    start(app: m4m.framework.application): void;
    zeroPoint: m4m.math.vector3;
    update(delta: number): void;
}
declare class test_ChangeMesh implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cube: m4m.framework.transform;
    camera: m4m.framework.camera;
    isCube: boolean;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class test_NewGameObject implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    cube: m4m.framework.transform;
    camera: m4m.framework.camera;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class test_NewScene implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class test_Sound implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    taskmgr: m4m.framework.taskMgr;
    camera: m4m.framework.camera;
    cube: m4m.framework.transform;
    time: number;
    private loadShader;
    private loadTexture;
    private addCam;
    private addCube;
    private addBtnLoadSound;
    start(app: m4m.framework.application): void;
    update(delta: number): void;
}
declare class EffectElement extends m4m.framework.transform {
    type: m4m.framework.EffectElementTypeEnum;
    beLoop: boolean;
    name: string;
}
declare class test_effecteditor implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;
    timer: number;
    taskmgr: m4m.framework.taskMgr;
    effect: m4m.framework.effectSystem;
    label: HTMLLabelElement;
    gui: lighttool.htmlui.gui;
    transformRoot: m4m.framework.transform;
    effectSystem: m4m.framework.effectSystem;
    effectSysData: m4m.framework.EffectSystemData;
    setVal(val: string, property: string, data: any): void;
    start(app: m4m.framework.application): void;
    private scaleChecked;
    private positionChecked;
    private eulerChecked;
    private length;
    private addElement;
    private play;
    private loadShader;
    private loadText;
    private loadEffect;
    private addButton;
    private getNameFromURL;
    private addcam;
    tr: m4m.framework.transform;
    ttr: m4m.framework.transform;
    eff: m4m.framework.effectSystem;
    beclone: boolean;
    effectloaded: boolean;
    bestop: boolean;
    bereplay: boolean;
    update(delta: number): void;
}
declare namespace m4m.framework {
    class HoverCameraScript extends m4m.framework.behaviour {
        lookAtPoint: m4m.math.vector3;
        lookAtTarget: m4m.framework.transform;
        distance: number;
        minPanAngle: number;
        maxPanAngle: number;
        minTileAngle: number;
        maxTileAngle: number;
        scaleSpeed: number;
        private inputMgr;
        private _lastMouseX;
        private _lastMouseY;
        private _mouseDown;
        private _lastTouchX;
        private _lastTouchY;
        private _fingerTwo;
        private _lastDistance;
        private _panAngle;
        private _panRad;
        private _cur_panRad;
        private damping;
        private panSpeed;
        set panAngle(value: number);
        get panAngle(): number;
        private _tiltAngle;
        private _tiltRad;
        private _cur_tiltRad;
        set tiltAngle(value: number);
        get tiltAngle(): number;
        private panDir;
        private targetOffset;
        onPlay(): void;
        start(): void;
        private cupTargetV3;
        update(delta: number): void;
        private onPointDown;
        private onPointUp;
        private onPointMove;
        private onWheel;
        lastTouch: math.vector2;
        diffv2: math.vector2;
        touchRotateID: number;
        lastTouches: {
            id: number;
            pos: pointinfo;
        }[];
        panFingers: math.vector2[];
        private onTouch;
        private onTouchMove;
        remove(): void;
    }
}
declare class decalCreater extends m4m.framework.behaviour {
    private static helpv2;
    private static helpv3;
    private static helpv3_1;
    private static helpv3_2;
    private static helpv3_3;
    private static helpqaut;
    sizeN: number;
    tempTex: m4m.framework.meshRenderer;
    camera: m4m.framework.camera;
    targetMF: m4m.framework.meshFilter;
    private app;
    private scene;
    private _assetMgr;
    private _offset;
    private tag_decalRoot;
    onPlay(): void;
    update(delta: number): void;
    remove(): void;
    limitDecalMaxCount: number;
    private size;
    private wdir;
    private rotate;
    private woffsetPos;
    sprayDecal(pinfo: m4m.framework.pickinfo): void;
    private print;
    private calecWorldNormal;
    private calecRoation;
    private static multipleViewFix;
}
declare class decalGeometry {
    tragetMeshf: m4m.framework.meshFilter;
    position: m4m.math.vector3;
    orientation: m4m.math.quaternion;
    size: m4m.math.vector3;
    private static onlyPostion;
    mesh: m4m.framework.mesh;
    meshF: m4m.framework.meshFilter;
    private static id;
    private static planes;
    private projectorMatrix;
    private projectorMatrixInverse;
    private plane;
    private vertices;
    private normals;
    private uvs;
    constructor(tragetMeshf: m4m.framework.meshFilter, position: m4m.math.vector3, orientation: m4m.math.quaternion, size: m4m.math.vector3, webgl: WebGLRenderingContext);
    private generate;
    private pushDecalVertex;
    private clipGeometry;
    private clip;
}
declare class DecalVertex {
    position: m4m.math.vector3;
    normal: m4m.math.vector3;
    constructor(position: m4m.math.vector3, normal?: m4m.math.vector3);
    clone(): DecalVertex;
}
declare class guideMask extends m4m.framework.behaviour2d {
    private _holeRect;
    get holeRect(): m4m.math.rect;
    set holeRect(val: m4m.math.rect);
    template: m4m.framework.transform2D;
    private inited;
    onPlay(): void;
    update(delta: number): void;
    remove(): void;
    private cells;
    private top;
    private bottom;
    private left;
    private right;
    private refreshMask;
}
declare class datGui {
    private static _inited;
    static init(): Promise<void>;
    private static loadJs;
    static example(): void;
}
declare class demoTool {
    static loadbySync(url: string, astMgr: m4m.framework.assetMgr): m4m.threading.gdPromise<any>;
}
declare class physics3dDemoTool {
    static app: m4m.framework.application;
    static scene: m4m.framework.scene;
    static camera: m4m.framework.camera;
    static astMgr: m4m.framework.assetMgr;
    static iptMgr: m4m.framework.inputMgr;
    static mats: {
        [name: string]: m4m.framework.material;
    };
    static init(app: m4m.framework.application): Promise<void>;
    private static initMats;
    private static initCamera;
    private static addMat;
    private static tag_isCompound;
    private static tag_pos;
    private static tag_Rot;
    private static tag_resFun;
    static attachMesh(tran: m4m.framework.transform, mat: m4m.framework.material, meshName: string, isCompound?: boolean): m4m.framework.meshRenderer;
    static resetObj(mrs: m4m.framework.meshRenderer[]): void;
    private static lastsleepTag;
    static ckBodySleeped(mrs: m4m.framework.meshRenderer[]): void;
    private static defMatTag;
    private static cgDefMat;
}
