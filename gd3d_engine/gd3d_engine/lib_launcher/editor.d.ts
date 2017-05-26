/// <reference path="../lib/gd3d_framework.d.ts" />
/// <reference path="plugin.d.ts" />
declare namespace gd3d.editor {
    class Coder {
        private coder;
        private codeText;
        private codeChanged;
        private rootPath;
        private fileName;
        private savePath;
        private saveName;
        private editor;
        constructor(editor: gd3d.editor.Editor);
        start(): void;
        private _initPanelCode();
        private _setEditorOptions();
        private disposableList;
        private _loadEditorRes();
        private lang;
        private _setCode(language);
        private pathList;
        private _getLibPath(path);
        private _getLibPathRec(path);
        private _getRefLibPath(path);
        regEvent(): void;
        checkCoderState(): void;
        showInCoder(path: string, name: string): void;
        checkCodeChange(): void;
    }
}
declare namespace gd3d.editor {
    class MyConsole {
        private editor;
        constructor(editor: gd3d.editor.Editor);
        initLog(): void;
        consolebox: lighttool.htmlui.listBox;
        initDebugPanel(): void;
        initDebugPanelFrame(window: Window): void;
    }
}
declare namespace gd3d.editor {
    class Editor {
        private panelMgr;
        private plugin;
        NAME_INSPECTOR: string;
        NAME_CANVAS: string;
        NAME_HIERARCHY: string;
        NAME_FILETREE: string;
        NAME_CONSOLE: string;
        NAME_CODER: string;
        NAME_SELFDEFINE: string;
        NAME_MEDIA: string;
        engineTool: EngineTool;
        fileMgr: FileTreeMgr;
        myConsole: MyConsole;
        coder: Coder;
        curAssetBundleName: string;
        curSceneName: string;
        start(): void;
        regEvent(): void;
        initMenu(): void;
        curStyle: any;
        loadLayoutWindows(style: gd3d.plugin.FileUIStyleEnum): HTMLElement;
        showLayoutWindows(names: string[]): void;
        regPlugin(p: gd3d.plugin.IFilePlugin): void;
        getPlugin(name: string): gd3d.plugin.IFilePlugin;
        getIcon(name: string): string;
        filePath: string;
        rootPath: string;
        private fileName;
        private pluginLast;
        setTitle(title: string): void;
        beOnClick(node: any): void;
        beOnDoubleClick(node: any): void;
        menu: menuitem;
        private resetMenu();
        private appendMenu(item);
        private hideMenu();
        userMenu: {
            [id: string]: gd3d.plugin.IMenuItem;
        };
        userWindow: {
            [id: string]: {
                user: gd3d.plugin.IWindow;
                panel: lighttool.htmlui.panel;
                data: {
                    ele: HTMLElement;
                    url: string;
                    id: string;
                    other: any;
                };
            };
        };
        private _clearUserPlugin();
        private _LoadSystemPlugin(fun);
        private _LoadUserPlugin(fun);
        getPluginWindow(name: string): {
            user: gd3d.plugin.IWindow;
            panel: lighttool.htmlui.panel;
            data: {
                ele: HTMLElement;
                other: any;
            };
        };
        showPluginWindow(name: string): void;
        private close(ifm);
        modeC: gd3d.plugin.EditorModeEnum;
        setMode(m: gd3d.plugin.EditorModeEnum): void;
        gdapp: gd3d.framework.application;
        beApplicationStarted: boolean;
        startApplication(div: HTMLDivElement): void;
        addUserCode(className: string): void;
        fileState: FileStateEnum;
        modifyFunc: Function;
        setModify(fun: Function): void;
        cancelmodify(): void;
        changeSaveState(beSave: boolean): void;
    }
    class menuitem {
        text: string;
        action: () => void;
        submenus: menuitem[];
        x: number;
        y: number;
        addItem(text: string, act?: () => void): menuitem;
    }
}
declare namespace gd3d.editor {
    class EngineTool {
        getBuildPathList(path: string, buildPathList: string[]): void;
        format(txt: string, compress: boolean): string;
        updateBuildInfo(path: string, status: string): void;
        createIframe(): HTMLIFrameElement;
        createDiv(): HTMLDivElement;
    }
}
declare namespace gd3d.editor {
    class FileTreeMgr {
        private treeView;
        private _fileTreeFilter;
        private beInit;
        private filePath;
        private fileName;
        private data;
        private editor;
        private needSave;
        constructor(editor: gd3d.editor.Editor);
        _initTreeView(): void;
        refresh(): void;
        getFileTreeFilter(): fileTreeFilter;
        getTreeView(): treeView;
    }
    interface ITreeViewFilter {
        getChildren(rootObj: any): {
            name: string;
            path: string;
            txtcolor: string;
            icon: string;
        }[];
    }
    class treeNode {
        divNode: HTMLDivElement;
        divText: HTMLDivElement;
        divForChild: HTMLDivElement;
        divChildButton: HTMLDivElement;
        divArrow: HTMLSpanElement;
        divIcon: HTMLSpanElement;
        text: string;
        children: treeNode[];
        parent: treeNode;
        left: number;
        data: any;
        getDivForChild(): HTMLDivElement;
        MakeLength(len: number): void;
        FillData(treeview: treeView, filter: ITreeViewFilter, data: {
            name: string;
            path: string;
            txtcolor: string;
            icon: string;
        }): void;
        hide(): void;
        show(): void;
        hideDivForChild(flag: boolean): void;
    }
    class treeView {
        constructor(parent: HTMLDivElement);
        private treeArea;
        private nodeRoot;
        onSelectItem: (node: any) => void;
        onContextMenuItem: (node: any) => void;
        onDoubleClickItem: (node: any) => void;
        private selectItem;
        private beDoubleClick;
        private onSelect(node);
        private onDoubleClick(node);
        private spreadParent(node);
        makeEvent(node: treeNode): void;
        private fold(nodeRoot);
        fordAll(): void;
        private spread(nodeRoot);
        spreadAll(): void;
        updateData(filter: ITreeViewFilter): void;
    }
    class fileTreeFilter implements ITreeViewFilter {
        rootList: any[];
        e: gd3d.editor.Editor;
        constructor(path: string, editor: Editor);
        getChildren(rootObj: any): {
            name: string;
            path: string;
            txtcolor: string;
            icon: string;
        }[];
    }
    enum FileStateEnum {
        FreeType = 0,
        LockType = 1,
    }
}
