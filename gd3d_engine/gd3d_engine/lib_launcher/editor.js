var gd3d;
(function (gd3d) {
    var editor;
    (function (editor_1) {
        var Coder = (function () {
            function Coder(editor) {
                this.fileName = "";
                this.savePath = "";
                this.saveName = "";
                this.disposableList = [];
                this.editor = editor;
            }
            Coder.prototype.start = function () {
                this.regEvent();
                this._initPanelCode();
                this._setEditorOptions();
            };
            Coder.prototype._initPanelCode = function () {
                var code = this.editor.getPluginWindow(this.editor.NAME_CODER);
                var divCode = document.getElementById("codePanel");
                divCode.hidden = false;
                code.panel.divContent.appendChild(divCode);
                this.coder = monaco.editor.create(divCode, { automaticLayout: true, theme: "vs-dark", fontSize: 18 });
            };
            Coder.prototype._setEditorOptions = function () {
                var dd = monaco.languages.typescript.typescriptDefaults;
                var cm = dd["_compilerOptions"];
                cm.experimentalDecorators = true;
                cm.emitDecoratorMetadata = true;
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions(cm);
            };
            Coder.prototype._loadEditorRes = function () {
                var _this = this;
                for (var k in this.disposableList) {
                    this.disposableList[k].dispose();
                }
                this.disposableList = [];
                this.pathList = [];
                if (this.rootPath != window.location.hash.substring(1) + "/lib/") {
                    this._getLibPath(this.rootPath);
                    for (var i in this.pathList) {
                        localsave.load(this.pathList[i], function (url, txt, err) {
                            var d = monaco.languages.typescript.typescriptDefaults.addExtraLib(txt);
                            _this.disposableList.push(d);
                        });
                    }
                }
                this.pathList = [];
                this._getRefLibPath(this.fileName);
            };
            Coder.prototype._setCode = function (language) {
                var _this = this;
                this.editor.loadLayoutWindows(gd3d.plugin.FileUIStyleEnum.TextType);
                this.coder.updateOptions({ readOnly: true });
                this.savePath = this.rootPath;
                this.saveName = this.fileName;
                var addr = (this.rootPath + this.fileName).replace(this.editor.rootPath, "");
                this.editor.setTitle(addr);
                localsave.load(this.rootPath + this.fileName, function (url, txt, err) {
                    _this.lang = language;
                    var model = monaco.editor.createModel(txt, "");
                    _this.coder.setModel(model);
                    _this.codeText = _this.coder.getValue();
                    _this.codeChanged = false;
                });
            };
            Coder.prototype._getLibPath = function (path) {
                var json = localsave.list(path);
                if (json["subfile"] != null) {
                    var list2 = json["subfile"];
                    for (var i = 0; i < list2.length; i++) {
                        var file = list2[i]["name"];
                        if (file.match(/\.ts$/) && file != this.fileName) {
                            this.pathList.push(file);
                        }
                    }
                }
            };
            Coder.prototype._getLibPathRec = function (path) {
                var json = localsave.list(path);
                if (json["subpath"] != null) {
                    var list1 = json["subpath"];
                    for (var i = 0; i < list1.length; i++) {
                        this._getLibPathRec(path + list1[i]["name"] + "/");
                    }
                }
                if (json["subfile"] != null) {
                    var list2 = json["subfile"];
                    for (var i = 0; i < list2.length; i++) {
                        var file = list2[i]["name"];
                        if (file.match(/\.ts$/) && file != this.fileName) {
                            this.pathList.push(path + file);
                        }
                    }
                }
            };
            Coder.prototype._getRefLibPath = function (path) {
                var _this = this;
                localsave.load(path, function (url, txt, err) {
                    var str = txt.split("\n");
                    for (var i in str) {
                        if (str[i].match("<reference path=")) {
                            var f = str[i].indexOf("/lib");
                            var l = str[i].indexOf("\"", f);
                            var s = str[i].substring(f, l);
                            s = window.location.hash.substring(1) + s.replace("../", "");
                            localsave.load(s, function (_url, _txt, _err) {
                                var file = "inmemory:/" + _url.substring(window.location.hash.substring(1).length);
                                var d = monaco.languages.typescript.typescriptDefaults.addExtraLib(_txt, file);
                                _this.disposableList.push(d);
                            });
                        }
                    }
                });
            };
            Coder.prototype.regEvent = function () {
                var _this = this;
                document.onkeydown = function (e) {
                    if (e.ctrlKey && e.keyCode == 83) {
                        if (_this.codeChanged) {
                            _this.codeText = _this.coder.getValue();
                            var file = localsave.file_str2blob(_this.codeText);
                            localsave.save(_this.savePath + _this.saveName, file);
                            _this.codeChanged = false;
                            var str = document.getElementById("engineName").innerText;
                            document.getElementById("engineName").innerText = str.replace("*", "");
                        }
                        return false;
                    }
                    if (_this.saveName != "" && _this.codeText != _this.coder.getValue() && !_this.codeChanged) {
                        document.getElementById("engineName").innerText += "*";
                        _this.codeChanged = true;
                    }
                };
                document.getElementById("edit").onclick = function () {
                    var str = _this.coder.getValue();
                    var oldModel = _this.coder.getModel();
                    if (oldModel) {
                        oldModel.dispose();
                    }
                    var model = monaco.editor.createModel(str, _this.lang);
                    _this.coder.setModel(model);
                    _this.coder.updateOptions({ readOnly: false });
                };
                document.getElementById("open").onclick = function () {
                    var path = (_this.rootPath + _this.fileName).replace(_this.editor.rootPath, "");
                    var str = "@start \"\" \"c:\\Program Files (x86)\\Microsoft VS Code\\code\" ../ ../" + path;
                    var file = localsave.file_str2blob(str);
                    var filename = window.location.hash.substring(1) + "/_buildcmd/open.cmd";
                    localsave.save(filename, file);
                    localsave.start(filename);
                    localsave.remove(filename);
                };
            };
            Coder.prototype.checkCoderState = function () {
            };
            Coder.prototype.showInCoder = function (path, name) {
                this.rootPath = path;
                this.fileName = name;
                if (this.fileName.match(/\.html$/)) {
                    this._setCode("html");
                }
                else if (this.fileName.match(/\.ts$/)) {
                    this._loadEditorRes();
                    this._setCode("typescript");
                }
                else if (this.fileName.match(/\.js$/)) {
                    this._setCode("javascript");
                }
                else if (this.fileName.match(/\.css$/)) {
                    this._setCode("css");
                }
                else if (this.fileName.match(/\.json$/)) {
                    this._setCode("json");
                }
                else if (this.fileName.match(/\.txt$/)) {
                    this._setCode("");
                }
                else if (this.fileName.match(/\.cmd$/)) {
                    this._setCode("");
                }
                else if (!this.fileName.match(/\./)) {
                    this.rootPath += this.fileName + "/";
                }
            };
            Coder.prototype.checkCodeChange = function () {
                if (this.codeChanged) {
                    if (confirm("Do you want to save the change?")) {
                        this.codeText = this.coder.getValue();
                        var file = localsave.file_str2blob(this.codeText);
                        localsave.save(this.savePath + this.saveName, file);
                    }
                    this.codeChanged = false;
                }
            };
            return Coder;
        }());
        editor_1.Coder = Coder;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor_2) {
        var MyConsole = (function () {
            function MyConsole(editor) {
                this.editor = editor;
            }
            MyConsole.prototype.initLog = function () {
                var debugPanel = document.getElementById("debug");
                debugPanel.hidden = false;
                debugPanel.style.msUserSelect = "text";
                debugPanel.style.webkitUserSelect = "text";
                var textbox = new lighttool.htmlui.listBox(debugPanel);
                console.log = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#fff");
                };
                console.warn = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#ff0");
                };
                console.error = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#f00");
                };
                document.getElementById("clear_debug").onclick = function () {
                    textbox.clear();
                };
                console.log("first log");
            };
            MyConsole.prototype.initDebugPanel = function () {
                var conso = this.editor.getPluginWindow(this.editor.NAME_CONSOLE);
                var debugPanel = document.getElementById("debug");
                debugPanel.hidden = false;
                conso.panel.divContent.appendChild(debugPanel);
                conso.panel.divContent.appendChild(document.getElementById("clear_debug"));
                debugPanel.style.msUserSelect = "text";
                debugPanel.style.webkitUserSelect = "text";
                var textbox = new lighttool.htmlui.listBox(debugPanel);
                this.consolebox = textbox;
                console.log = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#fff");
                };
                console.warn = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#ff0");
                };
                console.error = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#f00");
                };
                document.getElementById("clear_debug").onclick = function () {
                    textbox.clear();
                };
                console.log("first log");
            };
            MyConsole.prototype.initDebugPanelFrame = function (window) {
                var textbox = this.consolebox;
                window.console.log = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#fff");
                };
                window.console.warn = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#ff0");
                };
                window.console.error = function (msg) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    if (textbox.txtArea.children.length > 500)
                        textbox.txtArea.removeChild(textbox.txtArea.children[0]);
                    textbox.addLine(msg + rest.join(" "), "#f00");
                };
            };
            return MyConsole;
        }());
        editor_2.MyConsole = MyConsole;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
window.onload = function () {
    require.config({ paths: { "vs": "lib_launcher/vs" } });
    require(["vs/editor/editor.main"], function () {
        var e = new gd3d.editor.Editor();
        e.start();
    });
};
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Editor = (function () {
            function Editor() {
                this.plugin = {};
                this.NAME_INSPECTOR = "Window_Inspector";
                this.NAME_CANVAS = "Window_Canvas";
                this.NAME_HIERARCHY = "Window_Hierarchy";
                this.NAME_FILETREE = "Window_FileMgr";
                this.NAME_CONSOLE = "Window_Console";
                this.NAME_CODER = "Window_Coder";
                this.NAME_SELFDEFINE = "Window_SelfDefine";
                this.NAME_MEDIA = "Window_Media";
                this.filePath = "";
                this.rootPath = "";
                this.fileName = "";
                this.userMenu = {};
                this.userWindow = {};
                this.modeC = gd3d.plugin.EditorModeEnum.UnknownMode;
                this.fileState = editor.FileStateEnum.FreeType;
            }
            Editor.prototype.start = function () {
                var _this = this;
                document["editor"] = this;
                this.engineTool = new editor.EngineTool();
                this.fileMgr = new editor.FileTreeMgr(this);
                this.myConsole = new editor.MyConsole(this);
                this.coder = new editor.Coder(this);
                this.filePath = window.location.hash.substring(1) + "/";
                this.rootPath = this.filePath;
                this.panelMgr = lighttool.htmlui.panelMgr.instance();
                this.panelMgr.init(document.getElementById("editarea"));
                this.regEvent();
                this.initMenu();
                this.resetMenu();
                this._LoadSystemPlugin(function () {
                    _this.myConsole.initDebugPanel();
                    _this.fileMgr._initTreeView();
                    _this.coder.start();
                    _this.loadLayoutWindows(gd3d.plugin.FileUIStyleEnum.TextType);
                });
            };
            Editor.prototype.regEvent = function () {
                var _this = this;
                document.oncontextmenu = function () {
                    return false;
                };
                document.getElementById("delete").onclick = function () {
                    if (_this.fileName == "") {
                        return;
                    }
                    var path = "";
                    if (!_this.fileName.match(/\./)) {
                        path = _this.filePath;
                    }
                    else {
                        path = _this.filePath + _this.fileName;
                    }
                    if (confirm("Do you want to delete " + _this.fileName + "?")) {
                        var json = localsave.remove(path);
                        if (json["code"] != 0) {
                            console.error(json["error"]);
                        }
                        else {
                            _this.fileMgr.refresh();
                        }
                    }
                };
                document.getElementById("new").onclick = function () {
                    document.getElementById("filepath").textContent = _this.filePath;
                    document.getElementById("filename").textContent = "";
                };
                document.getElementById("confirm").onclick = function () {
                    var input = document.getElementById("filename");
                    var name = input.value;
                    if (name != "" && !name.match(/[@#\$%\^&\*]+/g)) {
                        if (name.match(/\./)) {
                            document.getElementById("confirm").setAttribute("data-dismiss", "modal");
                            var file = localsave.file_str2blob(" ");
                            localsave.save(_this.filePath + name, file);
                            _this.fileMgr.refresh();
                        }
                        else
                            console.error("you can't create this kind of file!");
                    }
                    else
                        console.error("error filename");
                };
            };
            Editor.prototype.initMenu = function () {
                var _this = this;
                this.menu = new menuitem();
                this.menu.addItem("play", function () {
                    if (document.getElementById("edit") != null) {
                        document.getElementById("edit").style.visibility = "hidden";
                        document.getElementById("open").style.visibility = "hidden";
                    }
                    _this.setTitle("play mode");
                    var sceneWindow = _this.getPluginWindow(_this.NAME_MEDIA);
                    var m = sceneWindow.data.ele;
                    _this.loadLayoutWindows(gd3d.plugin.FileUIStyleEnum.MediaType);
                    m.onload = function () {
                        console.log("@@@@@@@@@");
                        _this.myConsole.initDebugPanelFrame(m.contentWindow);
                    };
                    window.open(window.location.hash.substring(1) + "/index.html", _this.NAME_MEDIA);
                });
                var playex = this.menu.addItem("高级play");
                playex.addItem("在独立debug窗口play", function () {
                    window.open("launcher_play.html#" + window.location.hash.substring(1), "_blank");
                });
                playex.addItem("非debug play", function () {
                    window.open(window.location.hash.substring(1) + "/index.html", "_blank");
                });
                var buildMenu = this.menu.addItem("build");
                var buildPathList = [];
                this.engineTool.getBuildPathList(this.rootPath, buildPathList);
                var _loop_1 = function () {
                    var p = buildPathList[i];
                    buildMenu.addItem(p.replace(this_1.rootPath, ""), function () {
                        document.getElementById("loading").hidden = false;
                        setTimeout(function () {
                            var filename = p + "build.cmd";
                            var got = localsave.start(filename);
                            try {
                                JSON.parse(got);
                                console.log("build ok");
                                document.getElementById("loading").hidden = true;
                                _this.engineTool.updateBuildInfo(p.replace(_this.rootPath, ""), "succ");
                            }
                            catch (e) {
                                console.error(got);
                                document.getElementById("loading").hidden = true;
                                _this.engineTool.updateBuildInfo(p.replace(_this.rootPath, ""), "err");
                            }
                        }, 100);
                    });
                };
                var this_1 = this;
                for (var i in buildPathList) {
                    _loop_1();
                }
                var customCMD = this.menu.addItem("自定义cmd");
                var json = localsave.list(window.location.hash.substring(1) + "/_buildcmd/");
                var projs = json["subfile"];
                var _loop_2 = function () {
                    f = projs[i]["name"];
                    if (f.match(/\.cmd$/)) {
                        var text_1 = f;
                        customCMD.addItem(f, function () {
                            if (text_1.indexOf(".nowait") >= 0) {
                                var filename = window.location.hash.substring(1) + "/_buildcmd/" + text_1;
                                localsave.startnowait(filename);
                                return;
                            }
                            document.getElementById("loading").hidden = false;
                            setTimeout(function () {
                                var filename = window.location.hash.substring(1) + "/_buildcmd/" + text_1;
                                var got = localsave.start(filename);
                                try {
                                    JSON.parse(got);
                                    console.log("cmd ok");
                                    document.getElementById("loading").hidden = true;
                                }
                                catch (e) {
                                    console.error(got);
                                    document.getElementById("loading").hidden = true;
                                }
                            }, 100);
                        });
                    }
                };
                var f;
                for (var i in projs) {
                    _loop_2();
                }
            };
            Editor.prototype.loadLayoutWindows = function (style) {
                if (this.curStyle != null && this.curStyle == style)
                    return;
                var coder = this.getPluginWindow(this.NAME_CODER);
                var hierarchy = this.getPluginWindow(this.NAME_HIERARCHY);
                var inspector = this.getPluginWindow(this.NAME_INSPECTOR);
                var canvas = this.getPluginWindow(this.NAME_CANVAS);
                var fileMgr = this.getPluginWindow(this.NAME_FILETREE);
                var consol = this.getPluginWindow(this.NAME_CONSOLE);
                var selfDefine = this.getPluginWindow(this.NAME_SELFDEFINE);
                var media = this.getPluginWindow(this.NAME_MEDIA);
                var names = [];
                if (style == gd3d.plugin.FileUIStyleEnum.TextType) {
                    this.setMode(gd3d.plugin.EditorModeEnum.UnknownMode);
                    this.panelMgr.removeAllPanel();
                    names.push(this.NAME_FILETREE);
                    names.push(this.NAME_CONSOLE);
                    names.push(this.NAME_CODER);
                    this.panelMgr.fillPanel(coder.panel);
                    coder.panel.splitWith(fileMgr.panel, lighttool.htmlui.direction.H_Left, 0.2);
                    coder.panel.splitWith(consol.panel, lighttool.htmlui.direction.V_Bottom, 0.7);
                    document.getElementById("edit").style.visibility = "visible";
                    document.getElementById("open").style.visibility = "visible";
                    this.showLayoutWindows(names);
                    return coder.data.ele;
                }
                else if (style == gd3d.plugin.FileUIStyleEnum.MediaType) {
                    this.setMode(gd3d.plugin.EditorModeEnum.UnknownMode);
                    this.panelMgr.removeAllPanel();
                    names.push(this.NAME_FILETREE);
                    names.push(this.NAME_CONSOLE);
                    names.push(this.NAME_MEDIA);
                    this.panelMgr.fillPanel(media.panel);
                    media.panel.splitWith(fileMgr.panel, lighttool.htmlui.direction.H_Left, 0.2);
                    media.panel.splitWith(consol.panel, lighttool.htmlui.direction.V_Bottom, 0.7);
                    this.showLayoutWindows(names);
                    return media.data.ele;
                }
                else if (style == gd3d.plugin.FileUIStyleEnum.SelfDefine) {
                    this.setMode(gd3d.plugin.EditorModeEnum.UnknownMode);
                    this.panelMgr.removeAllPanel();
                    names.push(this.NAME_FILETREE);
                    names.push(this.NAME_CONSOLE);
                    names.push(this.NAME_SELFDEFINE);
                    this.panelMgr.fillPanel(selfDefine.panel);
                    selfDefine.panel.splitWith(fileMgr.panel, lighttool.htmlui.direction.H_Left, 0.2);
                    selfDefine.panel.splitWith(consol.panel, lighttool.htmlui.direction.V_Bottom, 0.7);
                    this.showLayoutWindows(names);
                    return selfDefine.data.ele;
                }
                else if (style & gd3d.plugin.FileUIStyleEnum.SceneType || style & gd3d.plugin.FileUIStyleEnum.GameType) {
                    this.setMode(gd3d.plugin.EditorModeEnum.UnknownMode);
                    this.panelMgr.removeAllPanel();
                    names.push(this.NAME_FILETREE);
                    names.push(this.NAME_CONSOLE);
                    names.push(this.NAME_CANVAS);
                    names.push(this.NAME_INSPECTOR);
                    names.push(this.NAME_HIERARCHY);
                    this.panelMgr.fillPanel(canvas.panel);
                    canvas.panel.splitWith(fileMgr.panel, lighttool.htmlui.direction.H_Left, 0.15);
                    canvas.panel.splitWith(hierarchy.panel, lighttool.htmlui.direction.H_Left, 0.25);
                    canvas.panel.splitWith(inspector.panel, lighttool.htmlui.direction.H_Right, 0.7);
                    canvas.panel.splitWith(consol.panel, lighttool.htmlui.direction.V_Bottom, 0.7);
                    this.showLayoutWindows(names);
                    return canvas.data.ele;
                }
                this.curStyle = style;
            };
            Editor.prototype.showLayoutWindows = function (names) {
                for (var key in this.userWindow) {
                    var win = this.getPluginWindow(key);
                    if (names.indexOf(key) >= 0) {
                        win.panel.show();
                        win.user.open(win.panel);
                    }
                    else {
                        win.panel.hide();
                    }
                }
            };
            Editor.prototype.regPlugin = function (p) {
                var key = p.getExtName();
                this.plugin[key] = p;
            };
            Editor.prototype.getPlugin = function (name) {
                for (var i = 0; i < 10; i++) {
                    var iext = name.indexOf(".", 1);
                    if (iext >= 0) {
                        name = name.substr(iext);
                        if (this.plugin[name] != undefined) {
                            return this.plugin[name];
                        }
                    }
                }
                return null;
            };
            Editor.prototype.getIcon = function (name) {
                var p = this.getPlugin(name);
                if (p != null) {
                    return p.getIconStr();
                }
                else {
                    return "glyphicon glyphicon-file";
                }
            };
            Editor.prototype.setTitle = function (title) {
                var address = document.getElementById("fileaddress");
                if (address != null || address != undefined) {
                    address.innerText = title;
                }
            };
            Editor.prototype.beOnClick = function (node) {
                var data = node.data;
                if (this.filePath == data.path && this.fileName == data.name) {
                    return;
                }
                this.filePath = data.path;
                this.fileName = data.name;
                this.coder.checkCodeChange();
                if (this.pluginLast != null) {
                    this.pluginLast.close();
                }
                var plugin = this.getPlugin(data.name);
                this.pluginLast = plugin;
                var name = this.filePath + this.fileName;
                if (plugin != null) {
                    var addr = name.replace(this.rootPath, "");
                    this.setTitle(addr);
                    var style = plugin.getFileUIStyle();
                    if ((style & gd3d.plugin.FileUIStyleEnum.SelfDefine) && (style != gd3d.plugin.FileUIStyleEnum.SelfDefine)) {
                        style = gd3d.plugin.FileUIStyleEnum.SelfDefine;
                    }
                    var div = this.loadLayoutWindows(style);
                    plugin.open(div, this.rootPath, name.substr(this.rootPath.length), gd3d.plugin.OperateType.ClickType, node);
                    this.setMode(gd3d.plugin.EditorModeEnum.UnknownMode);
                }
                else {
                    this.coder.showInCoder(this.rootPath, name.substr(this.rootPath.length));
                }
            };
            Editor.prototype.beOnDoubleClick = function (node) {
                var data = node.data;
                if (this.filePath == data.path && this.fileName == data.name) {
                    return;
                }
                this.filePath = data.path;
                this.fileName = data.name;
                if (this.pluginLast != null) {
                    this.pluginLast.close();
                }
                var plugin = this.getPlugin(data.name);
                this.pluginLast = plugin;
                if (plugin != null) {
                    var name = this.filePath + this.fileName;
                    name = name.substr(this.rootPath.length);
                    this.setTitle(name);
                    var div = this.loadLayoutWindows(plugin.getFileUIStyle());
                    plugin.open(div, this.rootPath, name, gd3d.plugin.OperateType.DoubleClickType, node);
                }
                else {
                    console.log("plugin is null");
                }
            };
            Editor.prototype.resetMenu = function () {
                var _this = this;
                for (var i = 0; i < this.menu.submenus.length; i++) {
                    if (this.menu.submenus[i].text == "自定义window") {
                        this.menu.submenus.splice(i, 1);
                    }
                }
                var windowMenu = null;
                var _loop_3 = function () {
                    if (windowMenu == null) {
                        windowMenu = this_2.menu.addItem("自定义window");
                    }
                    var windowname = key.toString();
                    windowMenu.addItem(windowname, function () {
                        _this.showPluginWindow(windowname);
                    });
                };
                var this_2 = this;
                for (var key in this.userWindow) {
                    _loop_3();
                }
                for (var i = 0; i < this.menu.submenus.length; i++) {
                    if (this.menu.submenus[i].text == "自定义菜单") {
                        this.menu.submenus.splice(i, 1);
                    }
                }
                var funcMenu = null;
                for (var key in this.userMenu) {
                    if (funcMenu == null) {
                        funcMenu = this.menu.addItem("自定义菜单");
                    }
                    var userm = this.userMenu[key].getMenuItem();
                    var path = userm.path.split("/");
                    for (var i = 0; i < path.length; i++) {
                        if (i == path.length - 1)
                            funcMenu.addItem(path[i], userm.action);
                        else {
                            funcMenu = funcMenu.addItem(path[i]);
                        }
                    }
                }
                if (this.menu.submenus)
                    var div = document.getElementById("menuarea");
                var list = [];
                for (var i = 0; i < div.children.length; i++) {
                    list.push(div.children[i]);
                }
                for (var i = 0; i < list.length; i++) {
                    div.removeChild(list[i]);
                }
                var _loop_4 = function () {
                    var m = this_3.menu.submenus[key];
                    if (m.action != null) {
                        btn = document.createElement("button");
                        btn.textContent = m.text;
                        btn.type = "button";
                        btn.className = "btn btn-primary";
                        btn.onclick = m.action;
                        div.appendChild(btn);
                        pos = lighttool.htmlui.panelMgr.instance()._calcRootPos(btn);
                        m.x = pos.x;
                        m.y = pos.y;
                    }
                    else {
                        btn = document.createElement("button");
                        btn.textContent = m.text + " ";
                        s = document.createElement("span");
                        s.className = "caret";
                        btn.appendChild(s);
                        btn.type = "button";
                        btn.className = "btn btn-default";
                        btn.onclick = function () {
                            _this.appendMenu(m);
                        };
                        div.appendChild(btn);
                        pos = lighttool.htmlui.panelMgr.instance()._calcRootPos(btn);
                        m.x = pos.x;
                        m.y = pos.y;
                    }
                };
                var this_3 = this, btn, pos, btn, s, pos;
                for (var key in this.menu.submenus) {
                    _loop_4();
                }
                this.hideMenu();
            };
            Editor.prototype.appendMenu = function (item) {
                var _this = this;
                if (item.submenus.length == 0) {
                    this.hideMenu();
                    return;
                }
                var back = document.getElementById("menuback");
                back.hidden = false;
                var divClose = document.createElement("div");
                divClose.style.position = "absolute";
                divClose.style.width = "100%";
                divClose.style.height = "100%";
                divClose.style.left = "0px";
                divClose.style.top = "0px";
                divClose.onmousedown = function () {
                    _this.hideMenu();
                };
                back.appendChild(divClose);
                var divMenu = document.createElement("div");
                divMenu.style.position = "absolute";
                divMenu.style.width = "200px";
                divMenu.style.left = (item.x + 36).toString() + "px";
                divMenu.style.top = (item.y + 36).toString() + "px";
                back.appendChild(divMenu);
                var _loop_5 = function () {
                    var m = item.submenus[key];
                    divLine = document.createElement("div");
                    divLine.style.width = "100%";
                    divLine.style.height = "36px";
                    divMenu.appendChild(divLine);
                    if (m.action != null) {
                        btn = document.createElement("button");
                        btn.textContent = m.text;
                        btn.type = "button";
                        btn.className = "btn btn-primary";
                        btn.onclick = function () {
                            m.action();
                            _this.hideMenu();
                        };
                        divLine.appendChild(btn);
                        pos = lighttool.htmlui.panelMgr.instance()._calcRootPos(btn);
                        m.x = pos.x;
                        m.y = pos.y;
                    }
                    else {
                        btn = document.createElement("button");
                        btn.textContent = m.text + " ";
                        s = document.createElement("span");
                        s.className = "caret";
                        btn.appendChild(s);
                        btn.type = "button";
                        btn.className = "btn btn-default";
                        btn.onclick = function () {
                            _this.appendMenu(m);
                        };
                        divLine.appendChild(btn);
                        pos = lighttool.htmlui.panelMgr.instance()._calcRootPos(btn);
                        m.x = pos.x;
                        m.y = pos.y;
                    }
                };
                var divLine, btn, pos, btn, s, pos;
                for (var key in item.submenus) {
                    _loop_5();
                }
            };
            Editor.prototype.hideMenu = function () {
                document.getElementById("menuback").hidden = true;
                var divm = document.getElementById("menuback");
                var list = [];
                for (var i = 0; i < divm.children.length; i++) {
                    list.push(divm.children[i]);
                }
                for (var i = 0; i < list.length; i++) {
                    divm.removeChild(list[i]);
                }
            };
            Editor.prototype._clearUserPlugin = function () {
                var all = gd3d.reflect.getPrototypes();
                for (var key in this.userMenu) {
                    delete all[key];
                }
                this.userMenu = {};
                for (var key in this.userWindow) {
                    this.userWindow[key].panel.hide();
                    this.userWindow[key].user.close(true);
                    delete all[key];
                }
                this.userWindow = {};
                this.resetMenu();
            };
            Editor.prototype._LoadSystemPlugin = function (fun) {
                var _this = this;
                this._clearUserPlugin();
                var pluginlibname = "lib_launcher/plugin.js";
                console.warn("userplugin=" + pluginlibname);
                var script = document.createElement("script");
                script.src = pluginlibname;
                script.onload = function (e) {
                    console.warn("load user plugin.");
                    var all = gd3d.reflect.getPrototypes();
                    for (var key in all) {
                        var m = gd3d.reflect.getMeta(all[key]);
                        if (m.class.custom.plugin_menuitem == "1") {
                            _this.userMenu[key] = gd3d.reflect.createInstance(all[key], null);
                        }
                        else if (m.class.custom.plugin_window == "1") {
                            _this.userWindow[key] = { user: gd3d.reflect.createInstance(all[key], null), panel: null, data: { ele: null, url: "", id: "", other: null } };
                        }
                        else if (m.class.custom.plugin_ext == "1") {
                            _this.regPlugin(gd3d.reflect.createInstance(all[key], null));
                        }
                    }
                    _this.resetMenu();
                    if (fun != null) {
                        fun();
                    }
                    document.getElementById("loading").hidden = true;
                };
                script.onerror = function (e) {
                    console.error("script load fail:" + pluginlibname);
                };
                document.head.appendChild(script);
            };
            Editor.prototype._LoadUserPlugin = function (fun) {
                var _this = this;
                this._clearUserPlugin();
                var pluginlibname = this.filePath + "lib_edit/launcher_plugin.js";
                console.warn("userplugin=" + pluginlibname);
                var script = document.createElement("script");
                script.src = pluginlibname;
                script.onload = function (e) {
                    console.warn("load user plugin.");
                    var all = gd3d.reflect.getPrototypes();
                    for (var key in all) {
                        var m = gd3d.reflect.getMeta(all[key]);
                        if (m.class.custom.plugin_menuitem == "1") {
                            _this.userMenu[key] = gd3d.reflect.createInstance(all[key], null);
                        }
                        else if (m.class.custom.plugin_window == "1") {
                            _this.userWindow[key] = { user: gd3d.reflect.createInstance(all[key], null), panel: null, data: { ele: null, url: "", id: "", other: null } };
                        }
                        else if (m.class.custom.plugin_ext == "1") {
                            _this.regPlugin(gd3d.reflect.createInstance(all[key], null));
                        }
                    }
                    _this.resetMenu();
                    if (fun != null) {
                        fun();
                    }
                    document.getElementById("loading").hidden = true;
                };
                script.onerror = function (e) {
                    console.error("script load fail:" + pluginlibname);
                };
                document.head.appendChild(script);
            };
            Editor.prototype.getPluginWindow = function (name) {
                var panel = this.userWindow[name].panel;
                var user = this.userWindow[name].user;
                var _data = this.userWindow[name].data;
                if (panel == null) {
                    panel = lighttool.htmlui.panelMgr.instance().createPanel(name);
                    panel.btnClose.hidden = false;
                    panel.divContent.style.backgroundColor = "#555555";
                    this.userWindow[name].panel = panel;
                    panel.onClose = function () {
                        panel.hide();
                        user.close(false);
                    };
                }
                if (_data.ele == null) {
                    var contentType = user.getUIContentType();
                    if (contentType == gd3d.plugin.UIContentType.IFrameType) {
                        _data.ele = this.engineTool.createIframe();
                        _data.ele.setAttribute('id', name);
                        _data.ele.setAttribute('name', name);
                    }
                    else if (contentType == gd3d.plugin.UIContentType.DivType) {
                        _data.ele = this.engineTool.createDiv();
                        _data.ele.setAttribute('id', name);
                        _data.ele.setAttribute('name', name);
                    }
                    panel.divContent.appendChild(_data.ele);
                }
                return this.userWindow[name];
            };
            Editor.prototype.showPluginWindow = function (name) {
                var win = this.getPluginWindow(name);
                win.user.open(win.panel);
            };
            Editor.prototype.close = function (ifm) {
                ifm.remove();
            };
            Editor.prototype.setMode = function (m) {
                if (m == this.modeC)
                    return;
                this.modeC = m;
                for (var key in this.userWindow) {
                    if (this.userWindow[key].panel != null) {
                        this.userWindow[key].user.setMode(this.modeC);
                    }
                }
            };
            Editor.prototype.startApplication = function (div) {
                if (!this.beApplicationStarted) {
                    this.gdapp = new gd3d.framework.application();
                    this.gdapp.start(div);
                    this.gdapp.showFps();
                    this.beApplicationStarted = true;
                }
            };
            Editor.prototype.addUserCode = function (className) {
                this.gdapp.addUserCode(className);
            };
            Editor.prototype.setModify = function (fun) {
                this.fileState = editor.FileStateEnum.LockType;
                this.modifyFunc = fun;
            };
            Editor.prototype.cancelmodify = function () {
                this.fileState = editor.FileStateEnum.FreeType;
            };
            Editor.prototype.changeSaveState = function (beSave) {
                var titleDiv = document.getElementById("engineName");
                var text = titleDiv.innerText;
                if (beSave) {
                    if (text.substring(text.length - 1) != "*") {
                        titleDiv.innerText = text + "*";
                    }
                }
                else {
                    if (text.substring(text.length - 1) == "*") {
                        titleDiv.innerText = text.substring(0, text.length - 1);
                    }
                }
            };
            return Editor;
        }());
        editor.Editor = Editor;
        var menuitem = (function () {
            function menuitem() {
                this.submenus = [];
            }
            menuitem.prototype.addItem = function (text, act) {
                if (act === void 0) { act = null; }
                var sm = this.submenus[text];
                if (sm == null)
                    sm = new menuitem();
                sm.text = text;
                sm.action = act;
                this.submenus.push(sm);
                return sm;
            };
            return menuitem;
        }());
        editor.menuitem = menuitem;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var EngineTool = (function () {
            function EngineTool() {
            }
            EngineTool.prototype.getBuildPathList = function (path, buildPathList) {
                var json = localsave.list(path);
                if (json["subpath"] != null) {
                    var list1 = json["subpath"];
                    for (var i = 0; i < list1.length; i++) {
                        this.getBuildPathList(path + list1[i]["name"] + "/", buildPathList);
                    }
                }
                if (json["subfile"] != null) {
                    var list2 = json["subfile"];
                    for (var i = 0; i < list2.length; i++) {
                        var file = list2[i]["name"];
                        if (file == "tsconfig.json") {
                            buildPathList.push(path);
                            var str = "@tsc";
                            var file_1 = localsave.file_str2blob(str);
                            var filename = path + "/build.cmd";
                            localsave.save(filename, file_1);
                        }
                    }
                }
            };
            EngineTool.prototype.format = function (txt, compress) {
                var indentChar = '    ';
                if (/^\s*$/.test(txt)) {
                    return "";
                }
                try {
                    var data = eval('(' + txt + ')');
                }
                catch (e) {
                    return "error";
                }
                var draw = [];
                var last = false;
                var line = compress ? '' : '\n';
                var nodeCount = 0;
                var maxDepth = 0;
                var notify = function (name, value, isLast, indent, formObj) {
                    nodeCount++;
                    var tab = '';
                    for (var i = 0; i < indent; i++) {
                        tab += indentChar;
                    }
                    tab = compress ? '' : tab;
                    maxDepth = ++indent;
                    if (value && value.constructor == Array) {
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
                        for (var i = 0; i < value.length; i++) {
                            notify(i.toString(), value[i], i == value.length - 1, indent, false);
                        }
                        draw.push(tab + ']' + (isLast ? line : (',' + line)));
                    }
                    else if (value && typeof value == 'object') {
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
                        var len = 0, i = 0;
                        for (var key in value) {
                            len++;
                        }
                        for (var key in value) {
                            notify(key, value[key], ++i == len, indent, true);
                        }
                        draw.push(tab + '}' + (isLast ? line : (',' + line)));
                    }
                    else {
                        if (typeof value == 'string') {
                            value = '"' + value + '"';
                        }
                        draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
                    }
                    ;
                };
                var isLast = true, indent = 0;
                notify('', data, isLast, indent, false);
                return draw.join('');
            };
            EngineTool.prototype.updateBuildInfo = function (path, status) {
                var _this = this;
                localsave.load("buildinfo.json", function (url, txt, err) {
                    if (err != null) {
                        var file_2 = localsave.file_str2blob(" ");
                        localsave.save("buildinfo.json", file_2);
                        txt = "{}";
                    }
                    var json = JSON.parse(txt);
                    if (json[path] == null) {
                        var n = {};
                        n["buildid"] = 1000;
                        json[path] = n;
                    }
                    var node = json[path];
                    node["buildid"] = node["buildid"] + 1;
                    node["ver"] = "0.1";
                    node["status"] = status;
                    var time = new Date(Date.now());
                    node["buildtime"] = time.getFullYear() + "-"
                        + (time.getMonth() + 1) + "-"
                        + time.getDate() + " "
                        + (time.getHours().toString().length == 1 ? "0" : "")
                        + time.getHours() + ":"
                        + (time.getMinutes().toString().length == 1 ? "0" : "")
                        + time.getMinutes() + ":"
                        + (time.getSeconds().toString().length == 1 ? "0" : "")
                        + time.getSeconds();
                    var str = _this.format(JSON.stringify(json), false);
                    var file = localsave.file_str2blob(str);
                    localsave.save("buildinfo.json", file);
                });
            };
            EngineTool.prototype.createIframe = function () {
                var ifm = document.createElement("iframe");
                ifm.setAttribute('frameborder', "0px");
                ifm.style.width = "100%";
                ifm.style.height = "100%";
                return ifm;
            };
            EngineTool.prototype.createDiv = function () {
                var div = document.createElement("div");
                return div;
            };
            return EngineTool;
        }());
        editor.EngineTool = EngineTool;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor_3) {
        var FileTreeMgr = (function () {
            function FileTreeMgr(editor) {
                this.beInit = false;
                this.fileName = "";
                this.editor = editor;
            }
            FileTreeMgr.prototype._initTreeView = function () {
                var _this = this;
                var file = this.editor.getPluginWindow(this.editor.NAME_FILETREE);
                var divtree = document.createElement("htmllist");
                file.panel.divContent.appendChild(divtree);
                this.treeView = new gd3d.editor.treeView(divtree);
                this._fileTreeFilter = new gd3d.editor.fileTreeFilter(this.editor.filePath, this.editor);
                this.treeView.updateData(this._fileTreeFilter);
                this.treeView.fordAll();
                this.treeView.onSelectItem = function (node) {
                    _this.data = node.data;
                    if (_this.editor.fileState == FileStateEnum.FreeType) {
                        _this.editor.beOnClick(node);
                    }
                    else {
                        if (confirm("Do you want to save the change?")) {
                            if (_this.editor.modifyFunc != null)
                                _this.editor.modifyFunc();
                            _this.editor.beOnClick(node);
                            _this.editor.changeSaveState(false);
                        }
                        else {
                            _this.editor.beOnClick(node);
                            _this.editor.changeSaveState(false);
                        }
                    }
                    _this.treeView.onDoubleClickItem = function (node) {
                        _this.data = node.data;
                        if (_this.editor.fileState == FileStateEnum.FreeType) {
                            _this.editor.beOnDoubleClick(node);
                        }
                        else {
                            if (confirm("Do you want to save the change?")) {
                                if (_this.editor.modifyFunc != null)
                                    _this.editor.modifyFunc();
                                _this.editor.changeSaveState(false);
                                _this.editor.beOnDoubleClick(node);
                            }
                            else {
                                _this.editor.beOnDoubleClick(node);
                                _this.editor.changeSaveState(false);
                            }
                        }
                        _this.treeView.onContextMenuItem = function (node) {
                            alert("onContextMenu " + node.data.name);
                        };
                    };
                };
            };
            FileTreeMgr.prototype.refresh = function () {
                this.treeView.updateData(this._fileTreeFilter);
            };
            FileTreeMgr.prototype.getFileTreeFilter = function () {
                return this._fileTreeFilter;
            };
            FileTreeMgr.prototype.getTreeView = function () {
                return this.treeView;
            };
            return FileTreeMgr;
        }());
        editor_3.FileTreeMgr = FileTreeMgr;
        var treeNode = (function () {
            function treeNode() {
                this.left = 2;
            }
            treeNode.prototype.getDivForChild = function () {
                if (this.divForChild != null)
                    return this.divForChild;
                this.divForChild = document.createElement("div");
                this.divForChild.style.position = "relative";
                this.divForChild.style.overflow = "auto";
                this.divForChild.style.overflowX = "hidden";
                this.divForChild.style.overflowY = "auto";
                this.divForChild.style.left = "0px";
                this.divNode.appendChild(this.divForChild);
                return this.divForChild;
            };
            treeNode.prototype.MakeLength = function (len) {
                if (this.children == null) {
                    this.children = [];
                }
                for (var i = this.children.length; i < len; i++) {
                    var nnode = new treeNode();
                    nnode.parent = this;
                    this.children.push(nnode);
                }
                for (var i = len; i < this.children.length; i++) {
                    this.children[i].hide();
                }
            };
            treeNode.prototype.FillData = function (treeview, filter, data) {
                var _this = this;
                this.data = data;
                this.data["node"] = this;
                if (this.divNode == null) {
                    this.divNode = document.createElement("div");
                    this.divNode.style.position = "relative";
                    this.divNode.style.overflow = "auto";
                    this.divNode.style.overflowX = "hidden";
                    this.divNode.style.overflowY = "auto";
                    this.divNode.draggable = true;
                    this.divNode.ondragstart = function (ev) {
                        console.log("开始拖拽");
                    };
                    this.divNode.ondragend = function (ev) {
                        console.log("拖拽结束");
                    };
                    this.divNode.ondragover = function (ev) {
                        ev.preventDefault();
                    };
                    this.divNode.ondrop = function (ev) {
                        ev.preventDefault();
                    };
                    this.parent.getDivForChild().appendChild(this.divNode);
                }
                if (this.divText == null) {
                    this.divArrow = document.createElement("span");
                    this.divArrow.className = "arrow-down";
                    this.divIcon = document.createElement("span");
                    this.divIcon.className = "glyphicon glyphicon-folder-open";
                    this.divIcon.style.position = "relative";
                    this.divIcon.style.left = this.left + "px";
                    this.divChildButton = document.createElement("div");
                    this.divChildButton.style.display = "inline";
                    this.divChildButton.style.position = "relative";
                    this.divChildButton.style.width = "14px";
                    this.divChildButton.style.left = this.left + "px";
                    this.divChildButton.onclick = function () {
                        if (_this.divForChild == null)
                            return;
                        _this.divForChild.hidden = !_this.divForChild.hidden;
                        if (_this.divForChild.hidden == true) {
                            _this.divArrow.className = "arrow-right";
                            _this.divIcon.className = "glyphicon glyphicon-folder-close";
                        }
                        else {
                            _this.divArrow.className = "arrow-down";
                            _this.divIcon.className = "glyphicon glyphicon-folder-open";
                        }
                    };
                    this.divChildButton.appendChild(this.divArrow);
                    this.divText = document.createElement("div");
                    this.divText.style.position = "relative";
                    this.divText.style.overflow = "auto";
                    this.divText.style.overflowX = "hidden";
                    this.divText.style.overflowY = "auto";
                    var text = document.createElement("a");
                    text.style.cursor = "default";
                    text.style.position = "relative";
                    text.style.left = this.left + "px";
                    text.hidden = false;
                    this.divText.appendChild(this.divChildButton);
                    this.divText.appendChild(this.divIcon);
                    this.divText.appendChild(text);
                    this.divNode.appendChild(this.divText);
                }
                treeview.makeEvent(this);
                this.divText.childNodes[2].text = data.name == "" ? " (noname)" : " " + data.name;
                this.divText.childNodes[2].style.color = data.txtcolor;
                this.divArrow.style.color = data.txtcolor;
                this.divIcon.style.color = data.txtcolor;
                var children = filter.getChildren(data);
                if (children.length == 0) {
                    if (data.name.indexOf("assetbundle.json") < 0) {
                        this.divArrow.className = "arrow-none";
                    }
                    else {
                        this.divArrow.className = "arrow-right";
                    }
                    this.divIcon.className = data.icon;
                }
                else {
                    this.divArrow.className = "arrow-down";
                    this.divIcon.className = "glyphicon glyphicon-folder-open";
                }
                this.MakeLength(children.length);
                for (var i = 0; i < children.length; i++) {
                    this.children[i].left = this.left + 14;
                    this.children[i].show();
                    this.children[i].FillData(treeview, filter, children[i]);
                }
            };
            treeNode.prototype.hide = function () {
                if (this.divNode != null) {
                    this.divNode.hidden = true;
                }
            };
            treeNode.prototype.show = function () {
                if (this.divNode != null) {
                    this.divNode.hidden = false;
                }
            };
            treeNode.prototype.hideDivForChild = function (flag) {
                if (this.divForChild == null)
                    return;
                this.divForChild.hidden = flag;
                if (flag) {
                    this.divArrow.className = "arrow-right";
                    this.divIcon.className = "glyphicon glyphicon-folder-close";
                }
                else {
                    this.divArrow.className = "arrow-down";
                    this.divIcon.className = "glyphicon glyphicon-folder-open";
                }
            };
            return treeNode;
        }());
        editor_3.treeNode = treeNode;
        var treeView = (function () {
            function treeView(parent) {
                this.nodeRoot = new treeNode();
                this.onSelectItem = null;
                this.onContextMenuItem = null;
                this.onDoubleClickItem = null;
                this.selectItem = null;
                this.beDoubleClick = false;
                this.treeArea = document.createElement("div");
                this.treeArea.className = "full";
                this.treeArea.style.overflow = "auto";
                this.treeArea.style.overflowX = "hidden";
                this.treeArea.style.overflowY = "auto";
                this.treeArea["inv"] = this;
                this.nodeRoot.divForChild = this.treeArea;
                parent.textContent = "";
                parent.appendChild(this.treeArea);
            }
            treeView.prototype.onSelect = function (node) {
                this.selectItem = node;
                if (this.onSelectItem != null) {
                    this.onSelectItem(node);
                }
            };
            treeView.prototype.onDoubleClick = function (node) {
                this.selectItem = node;
                if (this.onDoubleClickItem != null) {
                    this.onDoubleClickItem(node);
                }
            };
            treeView.prototype.spreadParent = function (node) {
                if (node.parent != null && node.parent.divChildButton) {
                    node.parent.divChildButton.textContent = "-";
                    node.parent.divForChild.hidden = false;
                    this.spreadParent(node.parent);
                }
            };
            treeView.prototype.makeEvent = function (node) {
                var _this = this;
                node.divText.onclick = function () {
                    _this.beDoubleClick = false;
                    setTimeout(function () {
                        if (_this.beDoubleClick)
                            return;
                        if (_this.selectItem != null) {
                            _this.selectItem.divText.style.background = "transparent";
                        }
                        _this.onSelect(node);
                        if (_this.selectItem != null) {
                            _this.selectItem.divText.style.background = "#3f3f46";
                        }
                    }, 200);
                };
                node.divText.ondblclick = function () {
                    _this.beDoubleClick = true;
                    if (_this.selectItem != null) {
                        _this.selectItem.divText.style.background = "transparent";
                    }
                    _this.onDoubleClick(node);
                    if (_this.selectItem != null) {
                        _this.selectItem.divText.style.background = "#3f3f46";
                    }
                };
                node.divText.oncontextmenu = function () {
                    if (_this.onContextMenuItem != null) {
                        _this.onContextMenuItem(node);
                    }
                };
            };
            treeView.prototype.fold = function (nodeRoot) {
                if (nodeRoot.children != null) {
                    for (var i = 0; i < nodeRoot.children.length; i++) {
                        var node = nodeRoot.children[i];
                        node.hideDivForChild(true);
                        this.fold(node);
                    }
                }
            };
            treeView.prototype.fordAll = function () {
                this.fold(this.nodeRoot);
            };
            treeView.prototype.spread = function (nodeRoot) {
                if (nodeRoot.children != null) {
                    for (var i = 0; i < nodeRoot.children.length; i++) {
                        var node = nodeRoot.children[i];
                        node.hideDivForChild(false);
                        this.spread(node);
                    }
                }
            };
            treeView.prototype.spreadAll = function () {
                this.spread(this.nodeRoot);
            };
            treeView.prototype.updateData = function (filter) {
                var child = filter.getChildren(null);
                var ccount = child.length;
                this.nodeRoot.MakeLength(ccount);
                if (this.nodeRoot.children != null) {
                    for (var i = 0; i < ccount; i++) {
                        var node = this.nodeRoot.children[i];
                        node.show();
                        node.FillData(this, filter, child[i]);
                    }
                }
            };
            return treeView;
        }());
        editor_3.treeView = treeView;
        var fileTreeFilter = (function () {
            function fileTreeFilter(path, editor) {
                this.e = editor;
                this.rootList = [];
                var node = {};
                node["name"] = path;
                node["path"] = "";
                node["txtcolor"] = "#ccc";
                node["icon"] = "glyphicon glyphicon-folder-close";
                this.rootList.push(node);
            }
            fileTreeFilter.prototype.getChildren = function (rootObj) {
                if (rootObj == null) {
                    return this.rootList;
                }
                else {
                    var list = [];
                    var path = rootObj["path"] + rootObj["name"];
                    if (path.substr(path.length - 1, 1) != "/") {
                        path += "/";
                    }
                    var json = localsave.list(path);
                    if (json["subpath"] != null) {
                        var list1 = json["subpath"];
                        for (var i = 0; i < list1.length; i++) {
                            var node = {};
                            node["name"] = list1[i]["name"];
                            node["path"] = path;
                            node["txtcolor"] = "#ccc";
                            node["icon"] = "glyphicon glyphicon-folder-close";
                            list.push(node);
                        }
                    }
                    if (json["subfile"] != null) {
                        var list2 = json["subfile"];
                        for (var i = 0; i < list2.length; i++) {
                            {
                                var node = {};
                                var name = list2[i]["name"];
                                node["name"] = name;
                                node["path"] = path;
                                node["txtcolor"] = "#ccc";
                                node["icon"] = this.e.getIcon(name);
                                list.push(node);
                            }
                        }
                    }
                    return list;
                }
            };
            return fileTreeFilter;
        }());
        editor_3.fileTreeFilter = fileTreeFilter;
        var FileStateEnum;
        (function (FileStateEnum) {
            FileStateEnum[FileStateEnum["FreeType"] = 0] = "FreeType";
            FileStateEnum[FileStateEnum["LockType"] = 1] = "LockType";
        })(FileStateEnum = editor_3.FileStateEnum || (editor_3.FileStateEnum = {}));
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=editor.js.map