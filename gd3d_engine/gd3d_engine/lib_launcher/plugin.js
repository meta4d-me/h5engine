var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_assetbundle = (function () {
            function file_assetbundle() {
            }
            file_assetbundle.prototype.getExtName = function () {
                return ".assetbundle.json";
            };
            file_assetbundle.prototype.getIconStr = function () {
                return "glyphicon glyphicon-folder-close";
            };
            file_assetbundle.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.TextType;
            };
            file_assetbundle.prototype.open = function (div, filepath, filename, operateType, node) {
                this.filepath = filepath;
                this.filename = filename;
                this.container = div;
                var editor = document["editor"];
                if (operateType == gd3d.plugin.OperateType.ClickType) {
                    console.log("open assetbundle");
                    var _node_1 = node;
                    if (_node_1.children == null || _node_1.children.length == 0) {
                        gd3d.io.loadText(filepath + filename, function (_txt, _err) {
                            _node_1.divArrow.className = "arrow-down";
                            _node_1.divIcon.className = "glyphicon glyphicon-folder-open";
                            var _json = JSON.parse(_txt);
                            var files = _json["files"];
                            var _fileTreeFilter = editor.fileMgr.getFileTreeFilter();
                            var _treeView = editor.fileMgr.getTreeView();
                            _node_1.MakeLength(files.length);
                            for (var i = 0; i < files.length; i++) {
                                var relativePath = "";
                                if (filename.indexOf("/") >= 0) {
                                    relativePath = filename.substring(0, filename.lastIndexOf("/") + 1);
                                }
                                var name = files[i].name;
                                var type = 0;
                                if (name.indexOf(".shader.json") >= 0) {
                                    type = 5;
                                }
                                else if (name.indexOf(".png") >= 0 || name.indexOf(".jpg") >= 0) {
                                    type = 6;
                                }
                                else if (name.indexOf(".imgdesc.json") >= 0) {
                                    type = 7;
                                }
                                else if (name.indexOf(".mesh.bin") >= 0) {
                                    type = 8;
                                }
                                else if (name.indexOf(".prefab.json") >= 0) {
                                    type = 9;
                                }
                                else if (name.indexOf(".mat.json") >= 0) {
                                    type = 10;
                                }
                                else if (name.indexOf(".aniclip.bin") >= 0) {
                                    type = 11;
                                }
                                else if (name.indexOf(".atlas.json") >= 0) {
                                    type = 13;
                                }
                                else if (name.indexOf(".font.json") >= 0) {
                                    type = 14;
                                }
                                if (editor.assetbundleFilesMap[filename] == undefined) {
                                    editor.assetbundleFilesMap[filename] = {};
                                }
                                if (editor.assetbundleFilesMap[filename][type] == undefined) {
                                    editor.assetbundleFilesMap[filename][type] = [];
                                }
                                var splitIndex = name.lastIndexOf("/") + 1;
                                var _name = name.substring(splitIndex);
                                if (editor.assetbundleFilesMap[filename][type][_name] == undefined) {
                                    editor.assetbundleFilesMap[filename][type].push(_name);
                                }
                                var childNode = {};
                                childNode["name"] = _name;
                                childNode["path"] = filepath + relativePath + name.substring(0, splitIndex);
                                childNode["txtcolor"] = "#ccc";
                                childNode["icon"] = editor.getIcon(name);
                                childNode["assetbundle"] = filename;
                                _node_1.children[i].left = node.left + 14;
                                _node_1.children[i].show();
                                _node_1.children[i].FillData(_treeView, _fileTreeFilter, childNode);
                            }
                        });
                    }
                }
            };
            file_assetbundle.prototype.close = function () {
                if (this.btn != null) {
                    this.container.removeChild(this.btn);
                    this.btn = null;
                }
            };
            file_assetbundle.prototype.save = function (path, file) {
                return localsave.save(this.filepath + path, file);
            };
            file_assetbundle.prototype.saveStr = function (path, content) {
                return localsave.saveStr(this.filepath + path, content);
            };
            file_assetbundle.prototype.file_str2blob = function (string) {
                return localsave.file_str2blob(string);
            };
            return file_assetbundle;
        }());
        file_assetbundle = __decorate([
            gd3d.reflect.pluginExt
        ], file_assetbundle);
        plugin.file_assetbundle = file_assetbundle;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_avi = (function () {
            function file_avi() {
            }
            file_avi.prototype.getExtName = function () {
                return ".avi";
            };
            file_avi.prototype.getIconStr = function () {
                return "glyphicon glyphicon-film";
            };
            file_avi.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.MediaType;
            };
            file_avi.prototype.open = function (div, filepath, filename, operateType) {
                var editor = document["editor"];
            };
            file_avi.prototype.close = function () {
            };
            return file_avi;
        }());
        file_avi = __decorate([
            gd3d.reflect.pluginExt
        ], file_avi);
        plugin.file_avi = file_avi;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_effect = (function () {
            function file_effect() {
            }
            file_effect.prototype.getExtName = function () {
                return ".effect.json";
            };
            file_effect.prototype.getIconStr = function () {
                return "glyphicon glyphicon-file";
            };
            file_effect.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.SelfDefine;
            };
            file_effect.prototype.open = function (div, filepath, filename, operateType, node) {
                this.filepath = filepath;
                this.filename = filename;
                console.log("filePath: " + filepath);
                console.log("filename: " + filename);
                this.editor = document["editor"];
                if (operateType == gd3d.plugin.OperateType.DoubleClickType) {
                    this.beDoubleOpen();
                }
            };
            file_effect.prototype.beDoubleOpen = function () {
                var names = this.editor.layoutWindows(gd3d.plugin.FileUIStyleEnum.SceneType);
                this.effectName = this.filename.substring(this.filename.lastIndexOf("/") + 1);
                document["_url_"] = "proj_sample/scene_test/launcher_scene_edit.html?effectName=" + this.effectName + "&type=0";
                this.editor.showWindows(names);
            };
            file_effect.prototype.close = function () {
                if (this.btn != null) {
                    this.container.removeChild(this.btn);
                    this.btn = null;
                }
            };
            file_effect.prototype.save = function (path, file) {
                return localsave.save(this.filepath + path, file);
            };
            file_effect.prototype.saveStr = function (path, content) {
                return localsave.saveStr(this.filepath + path, content);
            };
            file_effect.prototype.file_str2blob = function (string) {
                return localsave.file_str2blob(string);
            };
            return file_effect;
        }());
        file_effect = __decorate([
            gd3d.reflect.pluginExt
        ], file_effect);
        plugin.file_effect = file_effect;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_imgdesc = (function () {
            function file_imgdesc() {
            }
            file_imgdesc.prototype.getExtName = function () {
                return ".imgdesc.json";
            };
            file_imgdesc.prototype.getIconStr = function () {
                return "glyphicon glyphicon-picture";
            };
            file_imgdesc.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.MediaType;
            };
            file_imgdesc.prototype.open = function (div, filepath, filename, operateType) {
                var editor = document["editor"];
                var path = filename.substring(0, filename.lastIndexOf("/") + 1);
                gd3d.io.loadText(filepath + filename, function (_txt, _err) {
                    var _json = JSON.parse(_txt);
                    var name = _json["name"];
                    var url = filepath + path + name;
                    var img = editor.inspector.assetView.getImage();
                    img.src = url;
                    editor.inspector.showFile({ "type": "file_image" });
                });
            };
            file_imgdesc.prototype.close = function () {
            };
            return file_imgdesc;
        }());
        file_imgdesc = __decorate([
            gd3d.reflect.pluginExt
        ], file_imgdesc);
        plugin.file_imgdesc = file_imgdesc;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_png = (function () {
            function file_png() {
            }
            file_png.prototype.getExtName = function () {
                return ".png";
            };
            file_png.prototype.getIconStr = function () {
                return "glyphicon glyphicon-picture";
            };
            file_png.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.MediaType;
            };
            file_png.prototype.open = function (div, filepath, filename, operateType) {
                var editor = document["editor"];
                var img = editor.inspector.assetView.getImage();
                img.src = filepath + filename;
                editor.inspector.showFile({ "type": "file_image" });
            };
            file_png.prototype.close = function () {
            };
            return file_png;
        }());
        file_png = __decorate([
            gd3d.reflect.pluginExt
        ], file_png);
        plugin.file_png = file_png;
        var file_gif = (function (_super) {
            __extends(file_gif, _super);
            function file_gif() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            file_gif.prototype.getExtName = function () {
                return ".gif";
            };
            return file_gif;
        }(file_png));
        file_gif = __decorate([
            gd3d.reflect.pluginExt
        ], file_gif);
        plugin.file_gif = file_gif;
        var file_jpg = (function (_super) {
            __extends(file_jpg, _super);
            function file_jpg() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            file_jpg.prototype.getExtName = function () {
                return ".jpg";
            };
            return file_jpg;
        }(file_png));
        file_jpg = __decorate([
            gd3d.reflect.pluginExt
        ], file_jpg);
        plugin.file_jpg = file_jpg;
        var file_jpg2 = (function (_super) {
            __extends(file_jpg2, _super);
            function file_jpg2() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            file_jpg2.prototype.getExtName = function () {
                return ".jpeg";
            };
            return file_jpg2;
        }(file_png));
        file_jpg2 = __decorate([
            gd3d.reflect.pluginExt
        ], file_jpg2);
        plugin.file_jpg2 = file_jpg2;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_prefab = (function () {
            function file_prefab() {
            }
            file_prefab.prototype.getExtName = function () {
                return ".prefab.json";
            };
            file_prefab.prototype.getIconStr = function () {
                return "glyphicon glyphicon-file";
            };
            file_prefab.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.SelfDefine;
            };
            file_prefab.prototype.open = function (div, filepath, filename, operateType, node) {
                this.filepath = filepath;
                this.filename = filename;
                this.assetbundle = node["data"]["assetbundle"];
                this.editor = document["editor"];
                if (operateType == gd3d.plugin.OperateType.DoubleClickType) {
                    this.beDoubleOpen();
                }
            };
            file_prefab.prototype.beDoubleOpen = function () {
                var names = this.editor.layoutWindows(gd3d.plugin.FileUIStyleEnum.SceneType);
                this.prefabName = this.filename.substring(this.filename.lastIndexOf("/") + 1);
                document["_url_"] = "proj_sample/scene_test/launcher_scene_edit.html?assetBundleName=" + this.assetbundle + "&prefabName=" + this.prefabName + "&type=0";
                this.editor.showWindows(names);
            };
            file_prefab.prototype.close = function () {
                if (this.btn != null) {
                    this.container.removeChild(this.btn);
                    this.btn = null;
                }
            };
            file_prefab.prototype.save = function (path, file) {
                return localsave.save(this.filepath + path, file);
            };
            file_prefab.prototype.saveStr = function (path, content) {
                return localsave.saveStr(this.filepath + path, content);
            };
            file_prefab.prototype.file_str2blob = function (string) {
                return localsave.file_str2blob(string);
            };
            return file_prefab;
        }());
        file_prefab = __decorate([
            gd3d.reflect.pluginExt
        ], file_prefab);
        plugin.file_prefab = file_prefab;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var file_scene = (function () {
            function file_scene() {
            }
            file_scene.prototype.getExtName = function () {
                return ".scene.json";
            };
            file_scene.prototype.getIconStr = function () {
                return "glyphicon glyphicon-file";
            };
            file_scene.prototype.getFileUIStyle = function () {
                return gd3d.plugin.FileUIStyleEnum.SelfDefine;
            };
            file_scene.prototype.open = function (div, filepath, filename, operateType, node) {
                this.filepath = filepath;
                this.filename = filename;
                this.assetbundle = node["data"]["assetbundle"];
                this.editor = document["editor"];
                if (operateType == gd3d.plugin.OperateType.DoubleClickType) {
                    this.beDoubleOpen();
                }
            };
            file_scene.prototype.beDoubleOpen = function () {
                this.sceneName = this.filename.substring(this.filename.lastIndexOf("/") + 1);
                this.openScene(this.assetbundle, this.sceneName);
            };
            file_scene.prototype.openScene = function (assetbundle, sceneName) {
                if (assetbundle === void 0) { assetbundle = ""; }
                if (sceneName === void 0) { sceneName = ""; }
                if (this.editor == null)
                    this.editor = document["editor"];
                var names = this.editor.layoutWindows(gd3d.plugin.FileUIStyleEnum.SceneType);
                document["_url_"] = "proj_sample/scene_test/launcher_scene_edit.html?assetBundleName=" + assetbundle + "&sceneName=" + sceneName + "&type=0";
                this.editor.showWindows(names);
            };
            file_scene.prototype.close = function () {
                if (this.btn != null) {
                    this.container.removeChild(this.btn);
                    this.btn = null;
                }
            };
            file_scene.prototype.save = function (path, file) {
                return localsave.save(this.filepath + path, file);
            };
            file_scene.prototype.saveStr = function (path, content) {
                return localsave.saveStr(this.filepath + path, content);
            };
            file_scene.prototype.file_str2blob = function (string) {
                return localsave.file_str2blob(string);
            };
            return file_scene;
        }());
        file_scene = __decorate([
            gd3d.reflect.pluginExt
        ], file_scene);
        plugin.file_scene = file_scene;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var menu01 = (function () {
            function menu01() {
            }
            menu01.prototype.getMenuItem = function () {
                return {
                    path: "mymenu/abc",
                    action: function () {
                        alert("abc");
                    }
                };
            };
            return menu01;
        }());
        menu01 = __decorate([
            gd3d.reflect.pluginMenuItem,
            __metadata("design:paramtypes", [])
        ], menu01);
        plugin.menu01 = menu01;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var EditorModeEnum;
        (function (EditorModeEnum) {
            EditorModeEnum[EditorModeEnum["UnknownMode"] = 0] = "UnknownMode";
            EditorModeEnum[EditorModeEnum["PlayMode"] = 1] = "PlayMode";
            EditorModeEnum[EditorModeEnum["EditMode"] = 2] = "EditMode";
        })(EditorModeEnum = plugin.EditorModeEnum || (plugin.EditorModeEnum = {}));
        var FileUIStyleEnum;
        (function (FileUIStyleEnum) {
            FileUIStyleEnum[FileUIStyleEnum["TextType"] = 0] = "TextType";
            FileUIStyleEnum[FileUIStyleEnum["GameType"] = 2] = "GameType";
            FileUIStyleEnum[FileUIStyleEnum["SceneType"] = 4] = "SceneType";
            FileUIStyleEnum[FileUIStyleEnum["InspectorType"] = 8] = "InspectorType";
            FileUIStyleEnum[FileUIStyleEnum["SceneTreeViewType"] = 16] = "SceneTreeViewType";
            FileUIStyleEnum[FileUIStyleEnum["SelfDefine"] = 32] = "SelfDefine";
            FileUIStyleEnum[FileUIStyleEnum["MediaType"] = 64] = "MediaType";
            FileUIStyleEnum[FileUIStyleEnum["PlayType"] = 128] = "PlayType";
            FileUIStyleEnum[FileUIStyleEnum["PlayWithDebugType"] = 256] = "PlayWithDebugType";
        })(FileUIStyleEnum = plugin.FileUIStyleEnum || (plugin.FileUIStyleEnum = {}));
        var OperateType;
        (function (OperateType) {
            OperateType[OperateType["NoneType"] = 0] = "NoneType";
            OperateType[OperateType["ClickType"] = 1] = "ClickType";
            OperateType[OperateType["DoubleClickType"] = 2] = "DoubleClickType";
            OperateType[OperateType["DragType"] = 3] = "DragType";
        })(OperateType = plugin.OperateType || (plugin.OperateType = {}));
        var UIContentType;
        (function (UIContentType) {
            UIContentType[UIContentType["DivType"] = 0] = "DivType";
            UIContentType[UIContentType["IFrameType"] = 1] = "IFrameType";
        })(UIContentType = plugin.UIContentType || (plugin.UIContentType = {}));
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Canvas = (function () {
            function Window_Canvas() {
                this.beInit = false;
            }
            Window_Canvas.prototype.getUIContentType = function () {
                return plugin.UIContentType.IFrameType;
            };
            Window_Canvas.prototype.open = function (panel) {
                this.editor = document["editor"];
                if (!this.beInit) {
                    this.beInit = true;
                }
                this.openSceneEditor();
                panel.show();
            };
            Window_Canvas.prototype.pointDownEvent = function (e) {
                var func = document["pointDownEvent"];
                if (func != null)
                    func(e);
            };
            Window_Canvas.prototype.pointHoldEvent = function (e) {
                var func = document["pointHoldEvent"];
                if (func != null)
                    func(e);
            };
            Window_Canvas.prototype.pointUpEvent = function (e) {
                var func = document["pointUpEvent"];
                if (func != null)
                    func(e);
            };
            Window_Canvas.prototype.keyDownEvent = function (e) {
                var func = document["keyDownEvent"];
                if (func != null)
                    func(e);
            };
            Window_Canvas.prototype.resetSaveState = function () {
                var titleDiv = document.getElementById("engineName");
                var text = titleDiv.innerText;
                if (text.substring(text.length - 1) == "*") {
                    titleDiv.innerText = text.substring(0, text.length - 1);
                }
            };
            Window_Canvas.prototype.setMode = function (mode) {
                this.modeC = mode;
            };
            Window_Canvas.prototype.close = function (dispose) {
            };
            Window_Canvas.prototype.openSceneEditor = function () {
                var _this = this;
                var scene = this.editor.getPluginWindow(this.editor.NAME_CANVAS);
                var frame = scene.data.ele;
                frame.hidden = false;
                frame.onload = function () {
                    if (_this.editor.myConsole) {
                        _this.editor.myConsole.initDebugPanelFrame(frame.contentWindow);
                    }
                    frame.contentWindow.document["_editor_"] = _this.editor;
                    frame.contentWindow.document["_divtitle_"] = document.getElementById("engineName");
                };
                var url = document["_url_"];
                if (frame.contentDocument.URL == "about:blank")
                    window.open(url, this.editor.NAME_CANVAS);
                else
                    frame.contentWindow.location.reload(true);
            };
            return Window_Canvas;
        }());
        Window_Canvas = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Canvas);
        plugin.Window_Canvas = Window_Canvas;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Coder = (function () {
            function Window_Coder() {
                this.beInit = false;
            }
            Window_Coder.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_Coder.prototype.open = function (panel) {
                if (!this.beInit) {
                    this.beInit = true;
                }
                panel.show();
            };
            Window_Coder.prototype.setMode = function (mode) {
            };
            Window_Coder.prototype.close = function (dispose) {
            };
            return Window_Coder;
        }());
        Window_Coder = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Coder);
        plugin.Window_Coder = Window_Coder;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Console = (function () {
            function Window_Console() {
                this.beInit = false;
            }
            Window_Console.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_Console.prototype.open = function (panel) {
                panel.show();
            };
            Window_Console.prototype.setMode = function (mode) {
                this.modeC = mode;
            };
            Window_Console.prototype.close = function (dispose) {
            };
            return Window_Console;
        }());
        Window_Console = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Console);
        plugin.Window_Console = Window_Console;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_FileMgr = (function () {
            function Window_FileMgr() {
            }
            Window_FileMgr.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_FileMgr.prototype.open = function (panel) {
                panel.show();
            };
            Window_FileMgr.prototype.setMode = function (mode) {
            };
            Window_FileMgr.prototype.close = function (dispose) {
            };
            return Window_FileMgr;
        }());
        Window_FileMgr = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_FileMgr);
        plugin.Window_FileMgr = Window_FileMgr;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Hierarchy = (function () {
            function Window_Hierarchy() {
                this.beChecking = false;
            }
            Window_Hierarchy.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_Hierarchy.prototype.open = function (panel) {
                var _this = this;
                this.panel = panel;
                this.panel.divContent.style.overflowY = "auto";
                this.editor = document["editor"];
                this.regEvent();
                if (this.beChecking)
                    return;
                var id = setInterval(function () {
                    if (_this.mode == plugin.EditorModeEnum.UnknownMode) {
                        _this.beChecking = true;
                    }
                    else {
                        var win = void 0;
                        if (_this.mode == plugin.EditorModeEnum.EditMode) {
                            win = _this.editor.getPluginWindow(_this.editor.NAME_CANVAS);
                        }
                        else {
                            win = _this.editor.getPluginWindow(_this.editor.NAME_MEDIA);
                        }
                        var iframe = win.data.ele;
                        if (iframe.contentWindow == null)
                            return;
                        var func = iframe.contentWindow.document["hierarchy"];
                        if (func) {
                            clearInterval(id);
                            func(_this.panel.divContent);
                            _this.beChecking = false;
                            _this.panel.show();
                        }
                        else {
                            _this.beChecking = true;
                        }
                    }
                }, 200);
                this.panel.show();
            };
            Window_Hierarchy.prototype.regEvent = function () {
                var _this = this;
                document["_onctrlsdown"] = function (e) {
                    var scene = _this.editor.getPluginWindow(_this.editor.NAME_CANVAS);
                    var frame = scene.data.ele;
                    var func = frame.contentWindow.document["_saveFunc_"];
                    if (func != null)
                        func();
                    return false;
                };
                document["_deletedown"] = function (e) {
                    var scene = _this.editor.getPluginWindow(_this.editor.NAME_CANVAS);
                    var frame = scene.data.ele;
                    var func = frame.contentWindow.document["_deletenode_"];
                    if (func != null)
                        func();
                    return false;
                };
                this.editor.myConsole.initDebugPanel();
            };
            Window_Hierarchy.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Window_Hierarchy.prototype.close = function (dispose) {
            };
            return Window_Hierarchy;
        }());
        Window_Hierarchy = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Hierarchy);
        plugin.Window_Hierarchy = Window_Hierarchy;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Inspector = (function () {
            function Window_Inspector() {
                this.beChecking = false;
            }
            Window_Inspector.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_Inspector.prototype.open = function (panel) {
                var _this = this;
                this.panel = panel;
                this.editor = document["editor"];
                if (this.beChecking)
                    return;
                var id = setInterval(function () {
                    if (_this.mode == plugin.EditorModeEnum.UnknownMode) {
                        _this.beChecking = true;
                    }
                    else {
                        var win = void 0;
                        if (_this.mode == plugin.EditorModeEnum.EditMode) {
                            win = _this.editor.getPluginWindow(_this.editor.NAME_CANVAS);
                        }
                        else {
                            win = _this.editor.getPluginWindow(_this.editor.NAME_MEDIA);
                        }
                        var iframe = win.data.ele;
                        if (iframe.contentWindow == null)
                            return;
                        var func = iframe.contentWindow.document["inspector"];
                        _this.panel.container.divRoot.onclick = function (ev) {
                            ev.stopPropagation();
                        };
                        if (func) {
                            clearInterval(id);
                            func(_this.panel);
                            _this.beChecking = false;
                        }
                        else {
                            _this.beChecking = true;
                        }
                    }
                }, 200);
                this.panel.show();
            };
            Window_Inspector.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Window_Inspector.prototype.close = function (dispose) {
            };
            return Window_Inspector;
        }());
        Window_Inspector = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Inspector);
        plugin.Window_Inspector = Window_Inspector;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Media = (function () {
            function Window_Media() {
            }
            Window_Media.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.IFrameType;
            };
            Window_Media.prototype.open = function (panel) {
                this.editor = document["editor"];
                var url = document["_url_"];
                this.openPlayer(url);
                panel.show();
            };
            Window_Media.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Window_Media.prototype.close = function (dispose) {
            };
            Window_Media.prototype.openPlayer = function (url) {
                var _this = this;
                var scene = this.editor.getPluginWindow(this.editor.NAME_MEDIA);
                var frame = scene.data.ele;
                frame.hidden = false;
                frame.onload = function () {
                    _this.editor.myConsole.initDebugPanelFrame(frame.contentWindow);
                    frame.contentWindow.document["_editor_"] = _this.editor;
                    frame.contentWindow.document.onkeydown = function (e) {
                        if (e.keyCode == 116) {
                            console.log("Media-F5");
                            frame.contentWindow.location.reload(true);
                            e.preventDefault();
                        }
                    };
                };
                if (frame.contentDocument.URL == "about:blank")
                    frame.contentWindow.open(url, this.editor.NAME_MEDIA);
                else
                    frame.contentWindow.location.reload(true);
            };
            return Window_Media;
        }());
        Window_Media = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Media);
        plugin.Window_Media = Window_Media;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_Profiler = (function () {
            function Window_Profiler() {
            }
            Window_Profiler.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_Profiler.prototype.open = function (panel) {
                var _this = this;
                var id = setInterval(function () {
                    _this.editor = document["editor"];
                    _this.panel = panel;
                    panel.show();
                    var win;
                    if (_this.mode == plugin.EditorModeEnum.EditMode) {
                        win = _this.editor.getPluginWindow(_this.editor.NAME_CANVAS);
                    }
                    else {
                        win = _this.editor.getPluginWindow(_this.editor.NAME_MEDIA);
                    }
                    var iframe = win.data.ele;
                    if (iframe.contentWindow == null)
                        return;
                    var func = iframe.contentWindow.document["profiler"];
                    if (func) {
                        clearInterval(id);
                        func(_this.panel);
                    }
                });
            };
            Window_Profiler.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Window_Profiler.prototype.close = function (dispose) {
            };
            return Window_Profiler;
        }());
        Window_Profiler = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_Profiler);
        plugin.Window_Profiler = Window_Profiler;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Test_Window01 = (function () {
            function Test_Window01() {
            }
            Test_Window01.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Test_Window01.prototype.open = function (panel) {
                var _this = this;
                if (this.panel != null) {
                    this.panel.show();
                    return;
                }
                this.panel = panel;
                panel.setTitleText("mywindow");
                panel.show();
                this.gui = new lighttool.htmlui.gui(panel.divContent);
                setInterval(function () {
                    _this.gui.update();
                }, 100);
            };
            Test_Window01.prototype.setMode = function (mode) {
                this.modeC = mode;
            };
            Test_Window01.prototype.close = function (dispose) {
            };
            return Test_Window01;
        }());
        Test_Window01 = __decorate([
            gd3d.reflect.pluginWindow
        ], Test_Window01);
        plugin.Test_Window01 = Test_Window01;
        var Test_Window02 = (function () {
            function Test_Window02() {
            }
            Test_Window02.prototype.getUIContentType = function () {
                return plugin.UIContentType.DivType;
            };
            Test_Window02.prototype.open = function (panel) {
                var _this = this;
                if (this.panel != null) {
                    this.panel.show();
                    return;
                }
                this.panel = panel;
                panel.setTitleText("mywindow02");
                panel.show();
                this.gui = new lighttool.htmlui.gui(panel.divContent);
                this.gui.onchange = function () {
                    if (_this.modeC == gd3d.plugin.EditorModeEnum.UnknownMode) {
                        _this.gui.add_Span("can not use in this mode");
                        return;
                    }
                    _this.gui.add_Span("我是第二个.");
                    {
                    }
                };
                setInterval(function () {
                    _this.gui.update();
                }, 100);
            };
            Test_Window02.prototype.setMode = function (mode) {
                this.modeC = mode;
                if (mode == gd3d.plugin.EditorModeEnum.PlayMode) {
                    console.log("play");
                }
                else if (mode == gd3d.plugin.EditorModeEnum.EditMode) {
                    console.log("edit");
                }
            };
            Test_Window02.prototype.close = function (dispose) {
            };
            return Test_Window02;
        }());
        Test_Window02 = __decorate([
            gd3d.reflect.pluginWindow
        ], Test_Window02);
        plugin.Test_Window02 = Test_Window02;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugin;
    (function (plugin) {
        var Window_SelfDefine = (function () {
            function Window_SelfDefine() {
            }
            Window_SelfDefine.prototype.getUIContentType = function () {
                return gd3d.plugin.UIContentType.DivType;
            };
            Window_SelfDefine.prototype.open = function (panel) {
            };
            Window_SelfDefine.prototype.setMode = function (mode) {
                this.modeC = mode;
            };
            Window_SelfDefine.prototype.close = function (dispose) {
            };
            return Window_SelfDefine;
        }());
        Window_SelfDefine = __decorate([
            gd3d.reflect.pluginWindow
        ], Window_SelfDefine);
        plugin.Window_SelfDefine = Window_SelfDefine;
    })(plugin = gd3d.plugin || (gd3d.plugin = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=plugin.js.map