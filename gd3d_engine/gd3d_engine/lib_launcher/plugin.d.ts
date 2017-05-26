/// <reference path="localsave.d.ts" />
/// <reference path="htmlui.d.ts" />
declare namespace gd3d.plugin {
    class file_assetbundle implements gd3d.plugin.IFilePlugin, gd3d.plugin.IPluginConvert {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        container: HTMLElement;
        btn: HTMLElement;
        filepath: string;
        filename: string;
        open(div: HTMLElement, filepath: string, filename: string, operateType: gd3d.plugin.OperateType, node?: any): void;
        close(): void;
        save(path: string, file: Blob): number;
        saveStr(path: string, content: string): number;
        file_str2blob(string: string): Blob;
    }
}
declare namespace gd3d.plugin {
    class file_avi implements gd3d.plugin.IFilePlugin {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        open(div: HTMLDivElement, filepath: string, filename: string, operateType: OperateType): void;
        close(): void;
    }
}
declare namespace gd3d.plugin {
    class file_effect implements gd3d.plugin.IFilePlugin, gd3d.plugin.IPluginConvert {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        container: HTMLElement;
        btn: HTMLElement;
        filepath: string;
        filename: string;
        effectName: string;
        editor: any;
        open(div: HTMLElement, filepath: string, filename: string, operateType: gd3d.plugin.OperateType, node?: any): void;
        beDoubleOpen(): void;
        close(): void;
        save(path: string, file: Blob): number;
        saveStr(path: string, content: string): number;
        file_str2blob(string: string): Blob;
    }
}
declare namespace gd3d.plugin {
    class file_imgdesc implements gd3d.plugin.IFilePlugin {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        open(div: HTMLDivElement, filepath: string, filename: string, operateType: OperateType): void;
        close(): void;
    }
}
declare namespace gd3d.plugin {
    class file_png implements gd3d.plugin.IFilePlugin {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        open(div: HTMLDivElement, filepath: string, filename: string, operateType: OperateType): void;
        close(): void;
    }
    class file_gif extends file_png {
        getExtName(): string;
    }
    class file_jpg extends file_png {
        getExtName(): string;
    }
    class file_jpg2 extends file_png {
        getExtName(): string;
    }
}
declare namespace gd3d.plugin {
    class file_prefab implements gd3d.plugin.IFilePlugin, gd3d.plugin.IPluginConvert {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        container: HTMLElement;
        btn: HTMLElement;
        filepath: string;
        filename: string;
        assetbundle: string;
        prefabName: string;
        editor: any;
        open(div: HTMLElement, filepath: string, filename: string, operateType: gd3d.plugin.OperateType, node?: any): void;
        beDoubleOpen(): void;
        close(): void;
        save(path: string, file: Blob): number;
        saveStr(path: string, content: string): number;
        file_str2blob(string: string): Blob;
    }
}
declare namespace gd3d.plugin {
    class file_scene implements gd3d.plugin.IFilePlugin, gd3d.plugin.IPluginConvert {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): gd3d.plugin.FileUIStyleEnum;
        container: HTMLElement;
        btn: HTMLElement;
        filepath: string;
        filename: string;
        assetbundle: string;
        sceneName: string;
        editor: any;
        open(div: HTMLElement, filepath: string, filename: string, operateType: gd3d.plugin.OperateType, node?: any): void;
        beDoubleOpen(): void;
        openScene(assetbundle?: string, sceneName?: string): void;
        close(): void;
        save(path: string, file: Blob): number;
        saveStr(path: string, content: string): number;
        file_str2blob(string: string): Blob;
    }
}
declare namespace gd3d.plugin {
    class menu01 implements gd3d.plugin.IMenuItem {
        constructor();
        getMenuItem(): {
            path: string;
            action: () => void;
        };
    }
}
declare namespace gd3d.plugin {
    enum EditorModeEnum {
        UnknownMode = 0,
        PlayMode = 1,
        EditMode = 2,
    }
    interface IWindow {
        open(panel: lighttool.htmlui.panel): any;
        setMode(mode: EditorModeEnum): any;
        close(dispose: boolean): any;
        getUIContentType(): UIContentType;
    }
    interface IMenuItem {
        getMenuItem(): {
            path: string;
            action: () => void;
        };
    }
    interface IFilePlugin {
        getExtName(): string;
        getIconStr(): string;
        getFileUIStyle(): FileUIStyleEnum;
        open(div: HTMLElement, filepath: string, filename: string, operateType: OperateType, node?: any): any;
        close(): any;
    }
    interface IPluginConvert {
        file_str2blob(string: string): Blob;
        save(path: string, file: Blob): number;
        saveStr(path: string, content: string): number;
    }
    enum FileUIStyleEnum {
        TextType = 0,
        GameType = 2,
        SceneType = 4,
        InspectorType = 8,
        SceneTreeViewType = 16,
        SelfDefine = 32,
        MediaType = 64,
        PlayType = 128,
        PlayWithDebugType = 256,
    }
    enum OperateType {
        NoneType = 0,
        ClickType = 1,
        DoubleClickType = 2,
        DragType = 3,
    }
    enum UIContentType {
        DivType = 0,
        IFrameType = 1,
    }
}
declare namespace gd3d.plugin {
    class Window_Canvas implements gd3d.plugin.IWindow {
        panel: lighttool.htmlui.panel;
        editwindow: Window;
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        private beInit;
        editor: any;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        pointDownEvent(e: any): void;
        pointHoldEvent(e: any): void;
        pointUpEvent(e: any): void;
        keyDownEvent(e: any): void;
        private resetSaveState();
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
        openSceneEditor(): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Coder implements gd3d.plugin.IWindow {
        private beInit;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Console implements gd3d.plugin.IWindow {
        private beInit;
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_FileMgr implements gd3d.plugin.IWindow {
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Hierarchy {
        private beInited;
        private mode;
        private panel;
        private beChecking;
        editor: any;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        regEvent(): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Inspector implements gd3d.plugin.IWindow {
        panel: lighttool.htmlui.panel;
        mode: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        editor: any;
        private beChecking;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Media implements gd3d.plugin.IWindow {
        editor: any;
        mode: any;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
        openPlayer(url: string): void;
    }
}
declare namespace gd3d.plugin {
    class Window_Profiler implements gd3d.plugin.IWindow {
        panel: lighttool.htmlui.panel;
        mode: gd3d.plugin.EditorModeEnum;
        editor: any;
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Test_Window01 implements gd3d.plugin.IWindow {
        panel: lighttool.htmlui.panel;
        editwindow: Window;
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
    class Test_Window02 implements gd3d.plugin.IWindow {
        panel: lighttool.htmlui.panel;
        editwindow: Window;
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
declare namespace gd3d.plugin {
    class Window_SelfDefine implements gd3d.plugin.IWindow {
        modeC: gd3d.plugin.EditorModeEnum;
        gui: lighttool.htmlui.gui;
        getUIContentType(): gd3d.plugin.UIContentType;
        open(panel: lighttool.htmlui.panel): void;
        setMode(mode: gd3d.plugin.EditorModeEnum): void;
        close(dispose: boolean): void;
    }
}
