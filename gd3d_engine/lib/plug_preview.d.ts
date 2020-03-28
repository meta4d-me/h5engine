/// <reference types="../../lib/gd3d" />
declare namespace gd3d.plugins.preview {
    class main {
        urlParam: {
            [key: string]: string;
        };
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        assetMgr: gd3d.framework.assetMgr;
        root: gd3d.framework.transform;
        pviewCam: gd3d.framework.transform;
        target: gd3d.framework.transform;
        constructor();
        createCamera(parent: any, name: any): framework.transform;
        start(gameStage: HTMLCanvasElement): void;
        initParam(): void;
        handleEvent(): void;
        pview3DTrans(trans: framework.transform): void;
        pview2DTrans(trans: framework.transform2D): void;
    }
}
//# sourceMappingURL=plug_preview.d.ts.map