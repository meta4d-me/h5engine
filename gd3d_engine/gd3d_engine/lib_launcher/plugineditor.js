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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var EditorCameraController = (function () {
            function EditorCameraController() {
                this.moveSpeed = 10;
                this.movemul = 5;
                this.wheelSpeed = 1;
                this.rotateSpeed = 0.1;
                this.keyMap = {};
                this.beRightClick = false;
                this.isInit = false;
                this.moveVector = new gd3d.math.vector3(0, 0, 1);
            }
            EditorCameraController.instance = function () {
                if (EditorCameraController.g_this == null) {
                    EditorCameraController.g_this = new EditorCameraController();
                }
                return EditorCameraController.g_this;
            };
            EditorCameraController.prototype.update = function (delta) {
                if (this.beRightClick) {
                    this.doMove(delta);
                }
            };
            EditorCameraController.prototype.init = function (app, target) {
                var _this = this;
                this.isInit = true;
                this.app = app;
                this.target = target;
                this.rotAngle = new gd3d.math.vector3();
                gd3d.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
                this.app.webgl.canvas.addEventListener("mousedown", function (ev) {
                    _this.checkOnRightClick(ev);
                }, false);
                this.app.webgl.canvas.addEventListener("mouseup", function (ev) {
                    _this.beRightClick = false;
                }, false);
                this.app.webgl.canvas.addEventListener("mousemove", function (ev) {
                    if (_this.beRightClick) {
                        _this.doRotate(ev.movementX, ev.movementY);
                    }
                }, false);
                this.app.webgl.canvas.addEventListener("keydown", function (ev) {
                    _this.keyMap[ev.keyCode] = true;
                }, false);
                this.app.webgl.canvas.addEventListener("keyup", function (ev) {
                    _this.moveSpeed = 10;
                    _this.keyMap[ev.keyCode] = false;
                }, false);
                if (navigator.userAgent.indexOf('Firefox') >= 0) {
                    this.app.webgl.canvas.addEventListener("DOMMouseScroll", function (ev) {
                        _this.doMouseWheel(ev, true);
                    }, false);
                }
                else {
                    this.app.webgl.canvas.addEventListener("mousewheel", function (ev) {
                        _this.doMouseWheel(ev, false);
                    }, false);
                }
                this.app.webgl.canvas.addEventListener("mouseout", function (ev) {
                    _this.beRightClick = false;
                }, false);
            };
            EditorCameraController.prototype.doMove = function (delta) {
                if (this.target == null)
                    return;
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_W] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_W])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_w] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_w])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_S] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_S])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_s] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_s])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_A] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_A])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_a] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_a])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getRightInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_D] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_D])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_d] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_d])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getRightInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_Q] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_Q])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_q] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_q])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getUpInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, -this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                if ((this.keyMap[gd3d.framework.NumberUtil.KEY_E] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_E])
                    || (this.keyMap[gd3d.framework.NumberUtil.KEY_e] != undefined && this.keyMap[gd3d.framework.NumberUtil.KEY_e])) {
                    this.moveSpeed += this.movemul * delta;
                    this.target.gameObject.transform.getUpInWorld(this.moveVector);
                    gd3d.math.vec3ScaleByNum(this.moveVector, this.moveSpeed * delta, this.moveVector);
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                }
                this.target.gameObject.transform.markDirty();
            };
            EditorCameraController.prototype.doRotate = function (rotateX, rotateY) {
                this.rotAngle.x += rotateY * this.rotateSpeed;
                this.rotAngle.y += rotateX * this.rotateSpeed;
                this.rotAngle.x %= 360;
                this.rotAngle.y %= 360;
                gd3d.math.quatFromEulerAngles(this.rotAngle.x, this.rotAngle.y, this.rotAngle.z, this.target.gameObject.transform.localRotate);
            };
            EditorCameraController.prototype.lookat = function (trans) {
                this.target.gameObject.transform.lookat(trans);
                this.target.gameObject.transform.markDirty();
                gd3d.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
            };
            EditorCameraController.prototype.checkOnRightClick = function (mouseEvent) {
                var value = mouseEvent.button;
                if (value == 2) {
                    this.beRightClick = true;
                    return true;
                }
                else if (value == 0) {
                    this.beRightClick = false;
                    return false;
                }
            };
            EditorCameraController.prototype.doMouseWheel = function (ev, isFirefox) {
                if (!this.target)
                    return;
                if (this.target.opvalue == 0) {
                }
                else {
                    this.target.gameObject.transform.getForwardInWorld(this.moveVector);
                    if (isFirefox) {
                        gd3d.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * (ev.detail * (-0.5)), this.moveVector);
                    }
                    else {
                        gd3d.math.vec3ScaleByNum(this.moveVector, this.wheelSpeed * ev.deltaY * (-0.01), this.moveVector);
                    }
                    gd3d.math.vec3Add(this.target.gameObject.transform.localTranslate, this.moveVector, this.target.gameObject.transform.localTranslate);
                    this.target.gameObject.transform.markDirty();
                }
            };
            EditorCameraController.prototype.remove = function () {
            };
            return EditorCameraController;
        }());
        editor.EditorCameraController = EditorCameraController;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Hierarchy = (function () {
            function Hierarchy(div, onOperate, thisObj) {
                var _this = this;
                this.map = {};
                this.nodeMap = {};
                this.needSave = false;
                this.app = gd3d.editor.gdApp;
                this.app.notify = this;
                this.scene = this.app.getScene();
                this.onOperate = onOperate;
                this.main = thisObj;
                this.treeview = new editor.SceneTreeView(div, this);
                this.filter = new gd3d.editor.SceneTreeFilter();
                this.regEvent();
                this.fileTitleDiv = gd3d.editor.title;
                editor.WidgetMgr.ins().beOnRemoveComponentFunc = function (dataIns, title) {
                    if (dataIns instanceof gd3d.framework.transform) {
                        if (title == gd3d.framework.StringUtil.COMPONENT_CANVASRENDER) {
                            var canvasRen = dataIns.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                            if (canvasRen != null) {
                                dataIns.gameObject.removeComponentByTypeName(title);
                                var canv = canvasRen;
                                if (canv.canvas.getRoot().children != null && canv.canvas.getRoot().children.length > 0)
                                    gd3d.framework.sceneMgr.app.markNotify(canv.canvas.getRoot(), gd3d.framework.NotifyType.RemoveChild);
                                var rootId = canv.canvas.getRoot().insId.getInsID();
                                var rootNode = _this.treeview.nodeMap[rootId];
                                _this.treeview.nodeMap[dataIns.insId.getInsID()].removeChildTreeNode(rootNode);
                                _this.treeview.nodeMap[dataIns.insId.getInsID()].refresh();
                            }
                        }
                        else if (title == gd3d.framework.StringUtil.COMPONENT_CAMERA) {
                            var cam = dataIns.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                            if (cam != null) {
                                dataIns.gameObject.removeComponentByTypeName(title);
                                var camera = cam;
                                var overlays = camera.getOverLays();
                                if (overlays.length > 0) {
                                    for (var i = overlays.length - 1; i >= 0; i--) {
                                        var overlay = overlays[i];
                                        var trans2dChildren = overlay.canvas.getRoot().children;
                                        for (var index = trans2dChildren.length - 1; index >= 0; index--) {
                                            overlay.canvas.getRoot().removeChild(trans2dChildren[index]);
                                        }
                                        var selfNode = _this.treeview.nodeMap[overlay.canvas.getRoot().insId.getInsID()];
                                        selfNode.parent.removeChildTreeNode(selfNode);
                                        camera.removeOverLay(overlay);
                                        overlays.splice(i, 1);
                                        if (overlays.length == 0) {
                                            selfNode.parent.parent.removeChildTreeNode(selfNode.parent);
                                            selfNode.parent.parent.refresh();
                                        }
                                    }
                                }
                                else {
                                    var children = _this.treeview.nodeMap[dataIns.insId.getInsID()].children;
                                    for (var i in children) {
                                        if (children[i].nodeType == editor.NodeTypeEnum.Transform2DOverLayRoot) {
                                            _this.treeview.nodeMap[dataIns.insId.getInsID()].removeChildTreeNode(children[i]);
                                        }
                                    }
                                }
                                delete _this.filter.map[dataIns.insId.getInsID()];
                            }
                        }
                    }
                };
            }
            Hierarchy.prototype.notify = function (trans, type) {
                switch (type) {
                    case gd3d.framework.NotifyType.AddChild:
                        this.treeview.addChild(trans.parent, trans);
                        break;
                    case gd3d.framework.NotifyType.RemoveChild:
                        this.treeview.removeChild(trans.parent, trans);
                        break;
                    case gd3d.framework.NotifyType.ChangeVisible:
                        this.treeview.changeVisible(trans);
                        break;
                    case gd3d.framework.NotifyType.AddCamera:
                        this.treeview.refreshNode(trans, gd3d.framework.StringUtil.COMPONENT_CAMERA);
                        break;
                    case gd3d.framework.NotifyType.AddCanvasRender:
                        this.treeview.refreshNode(trans, gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                        break;
                }
                this.needSave = true;
                this.changeUISaveState();
            };
            Hierarchy.prototype.onUpdate = function (delta) {
            };
            Hierarchy.prototype.refresh = function () {
                this.treeview.updateData(this.filter, this.scene);
            };
            Hierarchy.prototype.showInspector = function (trans) {
                if (this.main.inspector != null || this.main.inspector != undefined) {
                    this.main.inspector.showTrans(trans);
                }
            };
            Hierarchy.prototype.regEvent = function () {
                var _this = this;
                document["_sceneeditorctrls"] = function (e) {
                    if (_this.needSave) {
                        _this.save();
                    }
                };
                document["_saveFunc_"] = function () {
                    if (_this.needSave)
                        _this.save();
                };
                document["_clickFunc_"] = function (trans) {
                    if (trans == null) {
                        _this.clearselect();
                    }
                    else {
                        var node = _this.nodeMap[trans.insId.getInsID()];
                        if (node != null) {
                            node.divText.style.background = "#696969";
                        }
                        _this.showInspector(trans);
                        _this.treeview.markBgHighLight(trans);
                    }
                };
                document["_deletenode_"] = function () {
                    _this.delete();
                };
                this.treeview.onSelectItem = function (node) {
                    _this.showInspector(node.data.trans);
                    if (_this.onOperate != null) {
                        _this.onOperate(node.data.trans, 0);
                    }
                };
                this.treeview.onDoubleClickItem = function (node) {
                    _this.showInspector(node.data.trans);
                    if (_this.onOperate != null) {
                        _this.onOperate(node.data.trans, 1);
                    }
                };
                this.treeview.onDragStartItem = function (node) {
                    _this.showInspector(node.data.trans);
                    if (_this.onOperate != null) {
                        _this.onOperate(node.data.trans, 2);
                    }
                };
                this.treeview.onDragOverItem = function (node, sceneDivLineType) {
                    _this.curOnMoveNode = node;
                    _this.sceneDivLineType = sceneDivLineType;
                    if (sceneDivLineType == editor.SceneDivLineType.SceneDivLineNoneType) {
                    }
                    else if (sceneDivLineType == editor.SceneDivLineType.SceneDivLineHeadType) {
                    }
                    else if (sceneDivLineType == editor.SceneDivLineType.SceneDivLineTailType) {
                        if (node != null) {
                        }
                    }
                };
                this.treeview.onDragDropItem = function (node) {
                    _this.curOnMoveNode = node;
                    if (_this.checkDragResult()) {
                        _this.refreshTreeView();
                    }
                };
            };
            Hierarchy.prototype.deleteNode = function () {
                if (this.treeview.curSelectItem.data.trans != null) {
                    switch (this.treeview.curSelectItem.nodeType) {
                        case editor.NodeTypeEnum.TransformCamera:
                            var trans0 = this.treeview.curSelectItem.data.trans;
                            var camera = trans0.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                            if (camera != null && camera.getOverLays() != null && camera.getOverLays().length > 0) {
                                var overlays_1 = camera.getOverLays();
                                for (var index = overlays_1.length - 1; index >= 0; index--) {
                                    var overlay_1 = overlays_1[index];
                                    var trans2dChildren_1 = overlay_1.canvas.getRoot().children;
                                    for (var index_1 = trans2dChildren_1.length - 1; index_1 >= 0; index_1--) {
                                        overlay_1.canvas.getRoot().removeChild(trans2dChildren_1[index_1]);
                                    }
                                    var selfNode_1 = this.treeview.nodeMap[overlay_1.canvas.getRoot().insId.getInsID()];
                                    selfNode_1.parent.removeChildTreeNode(selfNode_1);
                                    camera.removeOverLay(overlay_1);
                                    overlays_1.splice(index, 1);
                                    if (overlays_1.length == 0) {
                                        selfNode_1.parent.parent.removeChildTreeNode(selfNode_1.parent);
                                        selfNode_1.parent.parent.refresh();
                                    }
                                }
                            }
                            if (this.treeview.curSelectItem.data.trans.parent != null)
                                this.treeview.curSelectItem.data.trans.parent.removeChild(this.treeview.curSelectItem.data.trans);
                            break;
                        case editor.NodeTypeEnum.Transform2DOverLayCanvas:
                            var cameraData = this.getCurSeleteCameraData(editor.NodeTypeEnum.Transform2DOverLayCanvas);
                            var overlays = cameraData.camera.getOverLays();
                            var overlay = overlays[cameraData.index];
                            var trans2dChildren = overlay.canvas.getRoot().children;
                            for (var index = trans2dChildren.length - 1; index >= 0; index--) {
                                overlay.canvas.getRoot().removeChild(trans2dChildren[index]);
                            }
                            var selfNode = this.treeview.nodeMap[overlay.canvas.getRoot().insId.getInsID()];
                            selfNode.parent.removeChildTreeNode(selfNode);
                            cameraData.camera.removeOverLay(overlay);
                            if (overlays.length == 0)
                                selfNode.parent.refresh();
                            break;
                        case editor.NodeTypeEnum.Transform2DOverLayRoot:
                            break;
                        case editor.NodeTypeEnum.TransformCanvasRender:
                            var trans_1 = this.treeview.curSelectItem.data.trans;
                            var canvasRen = trans_1.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                            if (canvasRen != null) {
                                var trans2dChildren_2 = canvasRen.canvas.getRoot().children;
                                for (var index = trans2dChildren_2.length - 1; index >= 0; index--) {
                                    canvasRen.canvas.getRoot().removeChild(trans2dChildren_2[index]);
                                }
                                var selfNode_2 = this.treeview.nodeMap[canvasRen.canvas.getRoot().insId.getInsID()];
                                selfNode_2.parent.removeChildTreeNode(selfNode_2);
                            }
                            if (this.treeview.curSelectItem.data.trans.parent != null)
                                this.treeview.curSelectItem.data.trans.parent.removeChild(this.treeview.curSelectItem.data.trans);
                            break;
                        case editor.NodeTypeEnum.TransformCamera | editor.NodeTypeEnum.TransformCanvasRender:
                            var trans1 = this.treeview.curSelectItem.data.trans;
                            var camera1 = trans1.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                            if (camera1 != null && camera1.getOverLays() != null && camera1.getOverLays().length > 0) {
                                var overlays_2 = camera1.getOverLays();
                                for (var index = overlays_2.length - 1; index >= 0; index--) {
                                    var overlay_2 = overlays_2[index];
                                    var trans2dChildren_3 = overlay_2.canvas.getRoot().children;
                                    for (var index_2 = trans2dChildren_3.length - 1; index_2 >= 0; index_2--) {
                                        overlay_2.canvas.getRoot().removeChild(trans2dChildren_3[index_2]);
                                    }
                                    var selfNode_3 = this.treeview.nodeMap[overlay_2.canvas.getRoot().insId.getInsID()];
                                    selfNode_3.parent.removeChildTreeNode(selfNode_3);
                                    camera1.removeOverLay(overlay_2);
                                    overlays_2.splice(index, 1);
                                    if (overlays_2.length == 0) {
                                        selfNode_3.parent.parent.removeChildTreeNode(selfNode_3.parent);
                                    }
                                }
                            }
                            var trans2 = this.treeview.curSelectItem.data.trans;
                            var canvasRen2 = trans2.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                            if (canvasRen2 != null) {
                                var trans2dChildren_4 = canvasRen2.canvas.getRoot().children;
                                for (var index = trans2dChildren_4.length - 1; index >= 0; index--) {
                                    canvasRen2.canvas.getRoot().removeChild(trans2dChildren_4[index]);
                                }
                                var selfNode_4 = this.treeview.nodeMap[canvasRen2.canvas.getRoot().insId.getInsID()];
                                selfNode_4.parent.removeChildTreeNode(selfNode_4);
                            }
                            if (this.treeview.curSelectItem.data.trans.parent != null)
                                this.treeview.curSelectItem.data.trans.parent.removeChild(this.treeview.curSelectItem.data.trans);
                            break;
                        case editor.NodeTypeEnum.TransformNormal:
                        case editor.NodeTypeEnum.Transform2DNormal:
                            if (this.treeview.curSelectItem.data.trans.parent != null) {
                                var parentNode = this.treeview.curSelectItem.parent;
                                this.treeview.curSelectItem.data.trans.parent.removeChild(this.treeview.curSelectItem.data.trans);
                                if (parentNode != null) {
                                    parentNode.children.splice(parentNode.children.indexOf(this.treeview.curSelectItem), 1);
                                }
                                if (parentNode != null)
                                    parentNode.refresh();
                            }
                            break;
                        case editor.NodeTypeEnum.Transform2DCanvasRenderCanvas:
                            break;
                    }
                }
            };
            Hierarchy.prototype.getCurSeleteCameraData = function (nodeType) {
                var curNode = this.treeview.nodeMap[this.treeview.curSelectItem.data.trans.insId.getInsID()];
                var cameraTrans;
                if (nodeType == editor.NodeTypeEnum.TransformCamera)
                    cameraTrans = curNode.data.trans;
                else if (nodeType == editor.NodeTypeEnum.Transform2DOverLayRoot)
                    cameraTrans = curNode.treeNode.parent.data;
                else if (nodeType == editor.NodeTypeEnum.Transform2DOverLayCanvas) {
                    cameraTrans = curNode.parent.treeNode.parent.data;
                }
                var camera1 = cameraTrans.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                var overlays = camera1.getOverLays();
                for (var index = 0; index < overlays.length; index++) {
                    var overlay = overlays[index];
                    var root = overlay.canvas.getRoot();
                    if (root.insId.getInsID() == this.treeview.curSelectItem.data.trans.insId.getInsID()) {
                        return { "camera": camera1, "index": index };
                    }
                }
                return null;
            };
            Hierarchy.prototype.changeUISaveState = function () {
                if (this.fileTitleDiv == null || this.fileTitleDiv == undefined)
                    return;
                document["needSave"] = this.needSave;
                var text = this.fileTitleDiv.innerText;
                if (this.needSave) {
                    if (text.substring(text.length - 1) != "*") {
                        this.fileTitleDiv.innerText = text + "*";
                    }
                }
                else {
                    if (text.substring(text.length - 1) == "*") {
                        this.fileTitleDiv.innerText = text.substring(0, text.length - 1);
                    }
                }
            };
            Hierarchy.prototype.checkDragResult = function () {
                var fromTrans = this.treeview.curSelectItem.data.trans;
                if (this.curOnMoveNode == null) {
                    return true;
                }
                var toTrans = this.curOnMoveNode.data.trans;
                if (fromTrans == toTrans)
                    return false;
                if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineNoneType) {
                    if (toTrans == null) {
                        return false;
                    }
                    if (fromTrans == toTrans) {
                        return false;
                    }
                    if (fromTrans.children != undefined && fromTrans.children.indexOf(toTrans) >= 0) {
                        return false;
                    }
                    if (fromTrans.parent != undefined && fromTrans.parent == toTrans) {
                        return false;
                    }
                    return this.checkNodeDragByType();
                }
                else if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineHeadType) {
                    return this.checkNodeDragByType();
                }
                else if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineTailType) {
                    return this.checkNodeDragByType();
                }
                return true;
            };
            Hierarchy.prototype.checkNodeDragByType = function () {
                var fromTrans = this.treeview.curSelectItem.data.trans;
                var fromNodeType = this.treeview.curSelectItem.nodeType;
                var toTrans = this.curOnMoveNode.data.trans;
                var toNodeType = this.curOnMoveNode.nodeType;
                if (fromNodeType == editor.NodeTypeEnum.Transform2DCanvasRenderCanvas)
                    return false;
                if (fromNodeType == editor.NodeTypeEnum.Transform2DOverLayRoot)
                    return false;
                if (fromNodeType == editor.NodeTypeEnum.Transform2DOverLayCanvas && toNodeType != editor.NodeTypeEnum.Transform2DOverLayRoot)
                    return false;
                if (fromTrans instanceof gd3d.framework.transform && toTrans instanceof gd3d.framework.transform2D)
                    return false;
                if (fromTrans instanceof gd3d.framework.transform2D && toTrans instanceof gd3d.framework.transform)
                    return false;
                return true;
            };
            Hierarchy.prototype.refreshTreeView = function () {
                if (this.treeview.curSelectItem.nodeType == editor.NodeTypeEnum.Transform2DOverLayCanvas && this.curOnMoveNode.nodeType == editor.NodeTypeEnum.Transform2DOverLayRoot) {
                    this.refresh2DNode();
                    return;
                }
                if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineNoneType) {
                    if (this.treeview.curSelectItem.parent != undefined || this.treeview.curSelectItem.parent != null) {
                        var self_1 = this.treeview.curSelectItem.data.trans;
                        var toParent = this.curOnMoveNode.data.trans;
                        toParent.addChild(self_1);
                        this.treeview.nodeMap[self_1.insId.getInsID()].refresh();
                    }
                }
                else if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineHeadType) {
                    var selfTr = this.treeview.curSelectItem.data.trans;
                    var toTr = this.curOnMoveNode.data.trans;
                    if (selfTr.parent == toTr.parent) {
                        this._changeTransformItem(selfTr, toTr);
                    }
                    else {
                        var toIndex = toTr.parent.children.indexOf(toTr);
                        toTr.parent.addChildAt(selfTr, toIndex);
                        this.treeview.nodeMap[selfTr.insId.getInsID()].refresh();
                    }
                }
                else if (this.sceneDivLineType == editor.SceneDivLineType.SceneDivLineTailType) {
                    var selfTr = this.treeview.curSelectItem.data.trans;
                    if (this.curOnMoveNode == null) {
                        this.scene.addChild(selfTr);
                    }
                    else {
                        var toTr = this.curOnMoveNode.data.trans;
                        if (selfTr.parent == toTr.parent) {
                            this._changeTransformItem(this.treeview.curSelectItem.data.trans, this.curOnMoveNode.data.trans);
                        }
                        else {
                            var toIndex = toTr.parent.children.indexOf(toTr) + 1;
                            toTr.parent.addChildAt(selfTr, toIndex);
                            this.treeview.nodeMap[selfTr.insId.getInsID()].refresh();
                        }
                    }
                }
            };
            Hierarchy.prototype.refresh2DNode = function () {
                var curData = this.treeview.curSelectItem.data;
                var toData = this.curOnMoveNode.data;
                var curNode = this.treeview.nodeMap[this.treeview.curSelectItem.data.trans.insId.getInsID()];
                var cameraTrans = curNode.parent.treeNode.parent.data;
                var camera1 = cameraTrans.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                var overlays = camera1.getOverLays();
                var beHave = false;
                var index = -1;
                for (var ind = 0; ind < overlays.length; ind++) {
                    var overlay = overlays[ind];
                    var root = overlay.canvas.getRoot();
                    if (root.insId.getInsID() == this.treeview.curSelectItem.data.trans.insId.getInsID()) {
                        beHave = true;
                        index = ind;
                    }
                }
                if (beHave) {
                    if (curNode.parent.treeNode.data == toData.trans) {
                        var overLay = overlays[index];
                        if (overLay instanceof gd3d.framework.overlay2D) {
                            var lay = overLay;
                            if (lay.camera != null) {
                                lay.camera.removeOverLay(lay);
                                var selfNode = this.treeview.nodeMap[overLay.canvas.getRoot().insId.getInsID()];
                                selfNode.parent.removeChildTreeNode(selfNode);
                            }
                        }
                        camera1.addOverLayAt(overLay, 0);
                    }
                    else {
                    }
                }
                else {
                    if (curNode.parent.treeNode.data == toData.trans) {
                        var overLay = overlays[index];
                        if (overLay instanceof gd3d.framework.overlay2D) {
                            var lay = overLay;
                            if (lay.camera != null) {
                                lay.camera.removeOverLay(lay);
                                var selfNode = this.treeview.nodeMap[overLay.canvas.getRoot().insId.getInsID()];
                                selfNode.parent.removeChildTreeNode(selfNode);
                            }
                        }
                        camera1.addOverLayAt(overLay, 0);
                    }
                    else {
                    }
                }
                var id = editor.trans.insId.getInsID();
                if (this.nodeMap[camera1.gameObject.transform.insId.getInsID()] != undefined) {
                    this.nodeMap[camera1.gameObject.transform.insId.getInsID()].refresh();
                }
            };
            Hierarchy.prototype._changeTransformItem = function (fromTr, toTr) {
                var fromIndex = fromTr.parent.children.indexOf(fromTr);
                var toIndex = fromTr.parent.children.indexOf(toTr);
                if (fromIndex < toIndex) {
                    fromTr.parent.addChildAt(fromTr, toIndex);
                }
                else if (fromIndex > toIndex) {
                    fromTr.parent.addChildAt(fromTr, toIndex) + 1;
                }
            };
            Hierarchy.prototype.save = function () {
                if (gd3d.editor.sceneName != null) {
                    if (gd3d.editor.sceneName.length > 0)
                        this.saveScene();
                    else
                        console.log("目前没有新场景的保存机制");
                }
                else if (gd3d.editor.prefabName != null && gd3d.editor.prefabName.length > 0) {
                    var _transName = gd3d.editor.prefabName.replace(".prefab.json", "");
                    this.savePrefab(this.app.getScene().getRoot().find(_transName));
                }
            };
            Hierarchy.prototype.saveScene = function () {
                var _this = this;
                var value = this.app.getAssetMgr().saveScene(function (info) {
                    var saveSuccess = true;
                    for (var key in info.files) {
                        var val = info.files[key];
                        {
                            var blob = localsave.file_str2blob(val);
                            var saveResult = localsave.save(gd3d.editor.edit.rootPath + key, blob);
                            if (saveResult != 0) {
                                alert("保存失败：" + saveResult);
                                saveSuccess = false;
                            }
                        }
                    }
                    if (saveSuccess) {
                        _this.needSave = false;
                        _this.changeUISaveState();
                    }
                });
            };
            Hierarchy.prototype.savePrefab = function (trans) {
                var _this = this;
                var value = this.app.getAssetMgr().savePrefab(trans, gd3d.editor.prefabName, function (info) {
                    var saveSuccess = true;
                    for (var key in info.files) {
                        var val = info.files[key];
                        var blob = localsave.file_str2blob(val);
                        var saveResult = localsave.save(gd3d.editor.edit.rootPath + key, blob);
                        if (saveResult != 0) {
                            alert("保存失败：" + saveResult);
                            saveSuccess = false;
                        }
                    }
                    if (saveSuccess) {
                        _this.needSave = false;
                        _this.changeUISaveState();
                    }
                });
            };
            Hierarchy.prototype.clearselect = function () {
                var func = document["_selectTarget_"];
                if (func != null)
                    func(null);
                this.treeview.ChangeItem(null);
            };
            Hierarchy.prototype.endChangeNodeName = function () {
                this.treeview.endChangeNodeName();
            };
            Hierarchy.prototype.delete = function () {
                if (this.treeview.curSelectItem) {
                    var func = document["_selectTarget_"];
                    if (func != null)
                        func(null);
                    this.deleteNode();
                }
                this.main.inspector.clear();
            };
            Hierarchy.prototype.copy = function (node) {
                this.copyNode = node.data.trans;
            };
            Hierarchy.prototype.paste = function (node) {
                if (this.copyNode != null) {
                    var clonedObj = gd3d.io.cloneObj(this.copyNode);
                    if (node.data.trans.parent != null) {
                        node.data.trans.parent.addChild(clonedObj);
                    }
                    else {
                        node.data.trans.addChild(clonedObj);
                    }
                    clonedObj.setWorldMatrix(this.copyNode.getWorldMatrix());
                    clonedObj.markDirty();
                    clonedObj.updateTran(false);
                    this.treeview.SelectNodeByTransform(clonedObj);
                }
            };
            Hierarchy.prototype.duplicate = function (node) {
                if (node.data.trans.parent != null) {
                    var clonedObj = gd3d.io.cloneObj(node.data.trans);
                    node.data.trans.parent.addChild(clonedObj);
                    clonedObj.markDirty();
                    clonedObj.updateTran(false);
                    this.treeview.SelectNodeByTransform(clonedObj);
                }
            };
            Hierarchy.prototype.createEmpty = function (node) {
                if (node.data.trans instanceof gd3d.framework.transform) {
                    var trans_2 = new gd3d.framework.transform();
                    trans_2.name = "empty";
                    node.data.trans.addChild(trans_2);
                }
                if (node.data.trans instanceof gd3d.framework.transform2D) {
                    var trans_3 = new gd3d.framework.transform2D();
                    trans_3.name = "empty";
                    node.data.trans.addChild(trans_3);
                }
            };
            Hierarchy.prototype.create3D = function (type, node) {
                if (node.data.trans instanceof gd3d.framework.transform) {
                    var obj = gd3d.framework.GameObjectUtil.CreatePrimitive(type, this.app);
                    node.data.trans.addChild(obj.transform);
                }
            };
            Hierarchy.prototype.create2D = function (type, node) {
                var t2d = gd3d.framework.GameObjectUtil.Create2DPrimitive(type, this.app);
                switch (node.nodeType) {
                    case editor.NodeTypeEnum.Transform2DOverLayRoot:
                        var cameraNode = this.treeview.nodeMap[node.treeNode.parent.data.insId.getInsID()];
                        var camera = cameraNode.data.trans.gameObject.getComponent("camera");
                        {
                            var o2d = new gd3d.framework.overlay2D();
                            camera.addOverLay(o2d);
                            o2d.addChild(t2d);
                        }
                        t2d.markDirty();
                        t2d.updateTran(false);
                        cameraNode.refresh();
                        break;
                    default:
                        if (node.data.trans instanceof gd3d.framework.transform2D) {
                            var _trans2d = node.data.trans;
                            _trans2d.addChild(t2d);
                            t2d.markDirty();
                            t2d.updateTran(false);
                        }
                        break;
                }
            };
            return Hierarchy;
        }());
        editor.Hierarchy = Hierarchy;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var NodeTypeEnum;
        (function (NodeTypeEnum) {
            NodeTypeEnum[NodeTypeEnum["TransformNormal"] = 1] = "TransformNormal";
            NodeTypeEnum[NodeTypeEnum["TransformCanvasRender"] = 2] = "TransformCanvasRender";
            NodeTypeEnum[NodeTypeEnum["TransformCamera"] = 4] = "TransformCamera";
            NodeTypeEnum[NodeTypeEnum["Transform2DNormal"] = 8] = "Transform2DNormal";
            NodeTypeEnum[NodeTypeEnum["Transform2DCanvasRenderCanvas"] = 16] = "Transform2DCanvasRenderCanvas";
            NodeTypeEnum[NodeTypeEnum["Transform2DOverLayRoot"] = 32] = "Transform2DOverLayRoot";
            NodeTypeEnum[NodeTypeEnum["Transform2DOverLayCanvas"] = 64] = "Transform2DOverLayCanvas";
            NodeTypeEnum[NodeTypeEnum["TransVirtual"] = 128] = "TransVirtual";
        })(NodeTypeEnum = editor.NodeTypeEnum || (editor.NodeTypeEnum = {}));
        var SceneTreeNode = (function () {
            function SceneTreeNode() {
                this.left = -12;
                this.beFolded = false;
                this.beRemoved = false;
                this.nodeType = NodeTypeEnum.TransformNormal;
            }
            SceneTreeNode.prototype.MarkBgHighLight = function (hightLight) {
                if (hightLight) {
                    if (this.divText != null) {
                        this.divText.style.background = SceneTreeView.itemBgSelectColor;
                    }
                }
                else {
                    if (this.divText != null) {
                        this.divText.style.background = SceneTreeView.itemBgNormalColor;
                    }
                }
            };
            SceneTreeNode.prototype.MarkTextVisible = function (visible) {
                if (visible) {
                    if (this.divText != null) {
                        this.divText.childNodes[1].style.color = SceneTreeView.textNormalColor;
                        this.divArrow.style.color = SceneTreeView.textNormalColor;
                    }
                }
                else {
                    if (this.divText != null) {
                        this.divText.childNodes[1].style.color = SceneTreeView.textUnVisibleColor;
                        this.divArrow.style.color = SceneTreeView.textUnVisibleColor;
                    }
                }
            };
            SceneTreeNode.prototype.MakeLength = function (len) {
                if (this.children == null) {
                    this.children = [];
                }
                for (var i = this.children.length; i < len; i++) {
                    var nnode = new SceneTreeNode();
                    nnode.treeView = this.treeView;
                    nnode.parent = this;
                    this.children.push(nnode);
                }
                for (var i = len; i < this.children.length; i++) {
                    this.children[i].hide();
                }
            };
            SceneTreeNode.prototype.refresh = function () {
                if (this.label == null)
                    return;
                this.divChildButton.style.left = this.left + "px";
                this.label.style.left = this.left + "px";
                var children = this.filter.getChildren(this.data.trans);
                if (children.length == 0) {
                    this.divArrow.className = "arrow-none";
                }
                else {
                    if (this.beFolded)
                        this.divArrow.className = "arrow-right";
                    else
                        this.divArrow.className = "arrow-down";
                }
                for (var i = children.length - 1; i >= 0; i--) {
                    var id = children[i].trans.insId.getInsID();
                    this.children[i] = this.treeView.nodeMap[id];
                    if (this.children[i].treeNode == undefined) {
                        var node = new TreeNode(children[i].trans);
                        this.treeNode.AddChildAtIndex(node, i);
                        this.children[i].treeNode = node;
                    }
                    if (this.children[i].beRemoved) {
                        this.children[i].beRemoved = false;
                        this.children[i].beFolded = this.beFolded;
                        if (this.beFolded) {
                            this.children[i].hide();
                        }
                        else {
                            this.children[i].show();
                        }
                    }
                    else {
                        if (this.beFolded)
                            this.children[i].hide();
                    }
                    this.children[i].parent = this;
                    this.treeView.divRoot3d.insertBefore(this.children[i].divNode, this.treeView.divRoot3d.ownerDocument.getElementById(this.data.trans.insId.getInsID()).nextElementSibling);
                    this.children[i].left = this.left + 14;
                    this.children[i].refresh();
                }
            };
            SceneTreeNode.prototype.SpreadOrFold = function (flag) {
                if (this.children != undefined) {
                    for (var i in this.children) {
                        if (this.children[i] != undefined) {
                            this.children[i].beFolded = flag;
                            this.children[i].divNode.hidden = flag;
                            this.children[i].SpreadOrFold(flag);
                        }
                    }
                }
            };
            SceneTreeNode.prototype.append = function () {
                var preBrotherTreeNode = this.tree.findPreNodeInArray(this.treeNode);
                if (preBrotherTreeNode == null) {
                    this.treeView.divRoot3d.appendChild(this.divNode);
                }
                else {
                    var div = this.treeView.divRoot3d.ownerDocument.getElementById(preBrotherTreeNode.data.insId.getInsID());
                    if (div.nextElementSibling == null)
                        this.treeView.divRoot3d.appendChild(this.divNode);
                    else
                        this.treeView.divRoot3d.insertBefore(this.divNode, div.nextElementSibling);
                }
            };
            SceneTreeNode.prototype.changeNodeName = function () {
                var _this = this;
                this.label.hidden = true;
                if (!this.input) {
                    this.input = document.createElement("input");
                    this.input.style.cursor = "default";
                    this.input.style.position = "relative";
                    this.input.onclick = this.input.ondblclick = function (ev) {
                        ev.stopPropagation();
                    };
                    this.input.onkeydown = function (ev) {
                        if (ev.keyCode == 13) {
                            _this.treeView.endChangeNodeName();
                            if (_this.treeView.onSelectItem != null) {
                                _this.treeView.onSelectItem(_this);
                            }
                        }
                    };
                    this.divText.appendChild(this.input);
                }
                this.input.style.left = this.left + "px";
                this.input.value = this.data.trans.name;
                this.input.hidden = false;
                this.input.focus();
            };
            SceneTreeNode.prototype.endChangeNodeName = function () {
                if (this.input) {
                    this.input.hidden = true;
                    this.data.trans.name = this.input.value == "" ? this.data.trans.name : this.input.value;
                    this.label.textContent = this.data.trans.name;
                    this.label.hidden = false;
                }
            };
            SceneTreeNode.prototype.FillData = function (tre, filter, tree, data, beVirtualNode) {
                var _this = this;
                if (beVirtualNode === void 0) { beVirtualNode = false; }
                this.tree = tree;
                this.treeView = tre;
                this.filter = filter;
                this.data = data;
                this.data["node"] = this;
                this.nodeType = data.nodeType;
                if (this.divNode == null) {
                    this.divNode = document.createElement("div");
                    this.divNode.style.position = "relative";
                    this.divNode.style.overflow = "auto";
                    this.divNode.style.overflowX = "hidden";
                    this.divNode.style.overflowY = "auto";
                    this.divNode.setAttribute("id", data.trans.insId.getInsID().toString());
                    this.append();
                }
                if (this.divText == null) {
                    this.divArrow = document.createElement("span");
                    this.divArrow.className = "arrow-down";
                    this.divChildButton = document.createElement("div");
                    this.divChildButton.style.display = "inline";
                    this.divChildButton.style.position = "relative";
                    this.divChildButton.style.width = "14px";
                    this.divChildButton.style.left = this.left + "px";
                    this.divChildButton.onclick = function (ev) {
                        ev.stopPropagation();
                        if (_this.children == null || _this.children.length == 0)
                            return;
                        _this.beFolded = !_this.beFolded;
                        if (_this.beFolded)
                            _this.divArrow.className = "arrow-right";
                        else
                            _this.divArrow.className = "arrow-down";
                        _this.SpreadOrFold(_this.beFolded);
                    };
                    this.divChildButton.ondblclick = function (ev) {
                        ev.stopPropagation();
                    };
                    this.divText = document.createElement("div");
                    this.divText.setAttribute("divText", "divText");
                    this.divText.style.position = "relative";
                    this.divText.style.overflow = "auto";
                    this.divText.style.overflowX = "hidden";
                    this.divText.style.overflowY = "auto";
                    this.divText.style.width = "2000px";
                    this.label = document.createElement("label");
                    this.label.style.cursor = "default";
                    this.label.style.position = "relative";
                    this.label.style.left = this.left + "px";
                    this.label.style.fontWeight = "normal";
                    this.label.hidden = false;
                    this.divChildButton.appendChild(this.divArrow);
                    this.divText.appendChild(this.divChildButton);
                    this.divText.appendChild(this.label);
                    this.divNode.appendChild(this.divText);
                }
                this.label.textContent = data.trans.name == "" ? " (noname)" : data.trans.name;
                this.label.style.color = data.txtcolor;
                this.divArrow.style.color = data.txtcolor;
                if (this.divTailLine == null) {
                    this.divTailLine = this.treeView.createDivLine();
                    this.divTailLine.setAttribute("divTailLine", "tail222222222");
                    this.divNode.appendChild(this.divTailLine);
                }
                this.treeView.nodeMap[data.trans.insId.getInsID()] = this;
                if (beVirtualNode)
                    this.divNode.hidden = true;
                var children = filter.getChildren(data.trans);
                if (beVirtualNode) {
                    this.divArrow.className = "arrow-down";
                }
                else {
                    if (children.length == 0)
                        this.divArrow.className = "arrow-none";
                    else {
                        if (this.beFolded)
                            this.divArrow.className = "arrow-right";
                        else
                            this.divArrow.className = "arrow-down";
                    }
                }
                this.MakeLength(children.length);
                for (var i = 0; i < children.length; i++) {
                    if (this.treeNode.childrenDatas.indexOf(children[i].trans) < 0) {
                        var node = new TreeNode(children[i].trans);
                        this.treeNode.AddChildAtIndex(node, i);
                        this.children[i].treeNode = node;
                    }
                    this.children[i].left = this.left + 14;
                    if (this.children[i].beRemoved) {
                        this.children[i].beRemoved = false;
                        this.children[i].beFolded = this.beFolded;
                        if (this.beFolded) {
                            this.children[i].hide();
                        }
                        else {
                            this.children[i].show();
                        }
                    }
                    else {
                        if (this.beFolded)
                            this.children[i].hide();
                    }
                    this.children[i].FillData(this.treeView, filter, this.tree, children[i]);
                }
                this.treeView.makeEvent(this, data.trans.name);
            };
            SceneTreeNode.prototype.hide = function () {
                if (this.divNode != null) {
                    this.divNode.hidden = true;
                }
            };
            SceneTreeNode.prototype.show = function () {
                if (this.divNode != null) {
                    this.divNode.hidden = false;
                }
            };
            SceneTreeNode.prototype.hideDivForChild = function (flag) {
                if (flag) {
                    this.divArrow.className = "arrow-right";
                }
                else {
                    this.divArrow.className = "arrow-down";
                }
            };
            SceneTreeNode.prototype.removeChildTreeNode = function (node) {
                if (this.children != undefined && this.children != null) {
                    var index = this.children.indexOf(node);
                    this.children.splice(index, 1);
                }
                node.beRemoved = true;
                node.hide();
                if (node.nodeType == NodeTypeEnum.Transform2DOverLayCanvas) {
                    if (node.children != undefined && node.children != null) {
                        for (var i = node.children.length - 1; i >= 0; i--) {
                            node.removeChildTreeNode(node.children[i]);
                        }
                    }
                }
            };
            return SceneTreeNode;
        }());
        editor.SceneTreeNode = SceneTreeNode;
        var Tree = (function () {
            function Tree() {
            }
            Tree.prototype.setRootNode = function (node) {
                this.rootNode = node;
            };
            Tree.prototype.MLR = function (node) {
                var nodes = [];
                this._MLR(node, nodes);
                return nodes;
            };
            Tree.prototype._MLR = function (node, nodes) {
                nodes.push(node);
                if (node.children != null) {
                    for (var key in node.children) {
                        this._MLR(node.children[key], nodes);
                    }
                }
            };
            Tree.prototype.findPreNodeInArray = function (node) {
                if (node.parent == null)
                    return null;
                var array = this.MLR(node.parent);
                for (var i = 0; i < array.length; i++) {
                    if (array[i].data == node.data) {
                        if (i == 0)
                            return node.parent;
                        else
                            return array[i - 1];
                    }
                }
                return null;
            };
            return Tree;
        }());
        editor.Tree = Tree;
        var TreeNode = (function () {
            function TreeNode(data) {
                this.children = [];
                this.childrenDatas = [];
                this.data = data;
            }
            TreeNode.prototype.AddChild = function (node) {
                node.parent = this;
                this.children.push(node);
                this.childrenDatas.push(node.data);
            };
            TreeNode.prototype.AddChildAtIndex = function (node, index) {
                node.parent = this;
                this.children.splice(index, 0, node);
                this.childrenDatas.splice(index, 0, node.data);
            };
            TreeNode.prototype.RemoveChild = function (node) {
                if (this.children == undefined)
                    return;
                if (this.children.indexOf(node) >= 0)
                    this.children.splice(this.children.indexOf(node), 1);
                if (this.childrenDatas.indexOf(node.data) >= 0)
                    this.childrenDatas.splice(this.childrenDatas.indexOf(node.data), 1);
            };
            return TreeNode;
        }());
        editor.TreeNode = TreeNode;
        var SceneTreeView = (function () {
            function SceneTreeView(parent, hierarchy) {
                var _this = this;
                this.nodeMap = {};
                this.onDoubleClickItem = null;
                this.onSelectItem = null;
                this.onContextMenuItem = null;
                this.onDragStartItem = null;
                this.onDragOverItem = null;
                this.onDragDropItem = null;
                this.selectItem = null;
                this.curSelectAnchor = null;
                this.curChangeAnchor = null;
                this.beDoubleClick = false;
                this.parent = parent;
                parent.ondragover = function (event) {
                    event.preventDefault();
                    _this.onDragOver(null, SceneDivLineType.SceneDivLineTailType);
                };
                parent.ondrop = function () {
                    _this.onDragDrop(null);
                };
                parent.oncontextmenu = function (ev) {
                    _this.ChangeItem(null);
                    gd3d.editor.edit.hideAllContextMenu(ev);
                    gd3d.editor.edit.hierarchyContextMenu.showMenu(ev.pageX, ev.pageY, _this.rootNode);
                    _this.doWithOutTransform(gd3d.editor.edit.hierarchyContextMenu);
                };
                this.close();
                this.hierarchy = hierarchy;
                this.divRoot3d = document.createElement("div");
                this.divRoot3d.className = "full";
                this.divRoot3d.style.position = "relative";
                this.divRoot3d.style.overflow = "auto";
                this.divRoot3d.style.overflowX = "hidden";
                this.divRoot3d.style.overflowY = "auto";
                this.divRoot3d["inv"] = this;
                parent.appendChild(this.divRoot3d);
                this.initContextMenu(gd3d.editor.edit.hierarchyContextMenu);
            }
            SceneTreeView.prototype.close = function () {
                if (this.parent.children != null) {
                    for (var i = this.parent.children.length - 1; i >= 0; i--) {
                        this.parent.children[i].remove();
                    }
                }
            };
            Object.defineProperty(SceneTreeView.prototype, "curSelectItem", {
                get: function () {
                    return this.selectItem;
                },
                enumerable: true,
                configurable: true
            });
            SceneTreeView.prototype.onDragDrop = function (node) {
                if (this.onDragDropItem != null) {
                    this.onDragDropItem(node);
                }
            };
            SceneTreeView.prototype.onDragOver = function (node, divLineType) {
                if (this.onDragOverItem != null) {
                    this.onDragOverItem(node, divLineType);
                }
            };
            SceneTreeView.prototype.spreadParent = function (node) {
                if (node.parent != null && node.parent.divChildButton) {
                    node.parent.divChildButton.textContent = "-";
                    this.spreadParent(node.parent);
                }
            };
            SceneTreeView.prototype.makeEventForTailLine = function (divTailLine, node) {
                var _this = this;
                if (node === void 0) { node = null; }
                if (divTailLine != undefined || divTailLine != null) {
                    divTailLine.draggable = true;
                    divTailLine.ondragover = function (event) {
                        _this.onDragOver(node, SceneDivLineType.SceneDivLineTailType);
                    };
                    divTailLine.ondrop = function (event) {
                        event.stopPropagation();
                        _this.onDragDrop(node);
                    };
                }
            };
            SceneTreeView.prototype.endChangeNodeName = function () {
                if (this.curChangeAnchor) {
                    this.curChangeAnchor.endChangeNodeName();
                    this.curChangeAnchor = null;
                }
            };
            SceneTreeView.prototype.SelectNodeByTransform = function (trans) {
                var _node = this.nodeMap[trans.insId.getInsID()];
                this.ChangeItem(_node);
                if (this.onSelectItem != null) {
                    this.onSelectItem(_node);
                }
            };
            SceneTreeView.prototype.ChangeItem = function (node) {
                this.endChangeNodeName();
                if (this.selectItem != null) {
                    this.selectItem.MarkBgHighLight(false);
                }
                this.selectItem = node;
                this.curSelectAnchor = node;
                if (this.selectItem != null) {
                    this.selectItem.MarkBgHighLight(true);
                }
            };
            SceneTreeView.prototype.makeEvent = function (node, name) {
                var _this = this;
                if (name.indexOf("(canvasRenderer)") >= 0 || name.indexOf("(overlay2D)") >= 0) {
                    return;
                }
                node.divText.draggable = true;
                this.makeEventForTailLine(node.divTailLine, node);
                node.divText.onclick = function (ev) {
                    _this.beDoubleClick = false;
                    setTimeout(function () {
                        if (_this.beDoubleClick)
                            return;
                        var needChangeName = false;
                        if (_this.curSelectAnchor == node && _this.curChangeAnchor != node)
                            needChangeName = true;
                        _this.ChangeItem(node);
                        if (needChangeName) {
                            node.changeNodeName();
                            _this.curChangeAnchor = node;
                        }
                        if (_this.onSelectItem != null) {
                            _this.onSelectItem(node);
                        }
                    }, 200);
                    ev.stopPropagation();
                };
                node.divText.ondblclick = function (ev) {
                    _this.beDoubleClick = true;
                    _this.ChangeItem(node);
                    if (_this.onDoubleClickItem != null) {
                        _this.onDoubleClickItem(node);
                    }
                    ev.stopPropagation();
                };
                node.divText.ondragstart = function (ev) {
                    _this.ChangeItem(node);
                    if (_this.onDragStartItem != null) {
                        _this.onDragStartItem(node);
                    }
                    ev.stopPropagation();
                };
                node.divText.ondragover = function (event) {
                    event.preventDefault();
                    if (_this.selectItem != null) {
                        _this.selectItem.MarkBgHighLight(false);
                    }
                    _this.onDragOver(node, SceneDivLineType.SceneDivLineNoneType);
                    event.stopPropagation();
                };
                node.divText.ondrop = function (event) {
                    if (_this.selectItem != null) {
                        _this.selectItem.MarkBgHighLight(false);
                    }
                    _this.onDragDrop(node);
                    event.stopPropagation();
                };
                node.divText.oncontextmenu = function (ev) {
                    ev.preventDefault();
                    _this.ChangeItem(node);
                    gd3d.editor.edit.hideAllContextMenu(ev);
                    gd3d.editor.edit.hierarchyContextMenu.showMenu(ev.pageX, ev.pageY, node);
                    _this.doWithTransform(gd3d.editor.edit.hierarchyContextMenu);
                };
            };
            SceneTreeView.prototype.fold = function (nodeRoot) {
                if (nodeRoot.children != null) {
                    for (var i = 0; i < nodeRoot.children.length; i++) {
                        var node = nodeRoot.children[i];
                        node.hideDivForChild(true);
                        this.fold(node);
                    }
                }
            };
            SceneTreeView.prototype.fordAll = function () {
            };
            SceneTreeView.prototype.spread = function (nodeRoot) {
                if (nodeRoot.children != null) {
                    for (var i = 0; i < nodeRoot.children.length; i++) {
                        var node = nodeRoot.children[i];
                        node.hideDivForChild(false);
                        this.spread(node);
                    }
                }
            };
            SceneTreeView.prototype.spreadAll = function () {
            };
            SceneTreeView.prototype.updateData = function (filter, scene) {
                this.filter = filter;
                this.tree = new Tree();
                var child3d = filter.getChildren(scene);
                var data = child3d[0];
                if (this.nodeMap[data.trans.insId.getInsID()] != undefined) {
                    this.rootNode = this.nodeMap[data.trans.insId.getInsID()];
                }
                else {
                    this.rootNode = new SceneTreeNode();
                    this.rootNode.data = data;
                    this.rootNode.parent = null;
                    var treeNode = new TreeNode(data.trans);
                    this.rootNode.treeNode = treeNode;
                    this.tree.setRootNode(treeNode);
                }
                this.rootNode.FillData(this, filter, this.tree, this.rootNode.data, true);
                if (this.divTailLine == null) {
                    this.divTailLine = this.createDivLine();
                    this.divTailLine.setAttribute("divTailLine", "tail");
                }
                this.makeEventForTailLine(this.divTailLine);
            };
            SceneTreeView.prototype.addChild = function (parTran, childTran) {
                var childId = childTran.insId.getInsID();
                if (parTran == null) {
                    parTran = this.rootNode.data.trans;
                }
                var parentId = parTran.insId.getInsID();
                var parentNode = this.nodeMap[parentId];
                if (this.nodeMap[childId] != undefined) {
                    var node = this.nodeMap[childId];
                    node.parent = parentNode;
                    node.left = parentNode.left + 14;
                    parentNode.refresh();
                }
                else {
                    while (parentNode == null) {
                        parTran = parTran.parent;
                        if (parTran == null)
                            parentNode = this.rootNode;
                        else
                            parentNode = this.nodeMap[parTran.insId.getInsID()];
                    }
                    if (parentNode != null)
                        parentNode.FillData(this, this.filter, this.tree, parentNode.data);
                }
            };
            SceneTreeView.prototype.removeChild = function (parentTrans, childTrans) {
                var childId = childTrans.insId.getInsID();
                var childNode = this.nodeMap[childId];
                if (parentTrans == null) {
                    childNode.treeNode.parent = null;
                    childNode.parent.treeNode.RemoveChild(childNode.treeNode);
                    childNode.parent.removeChildTreeNode(childNode);
                }
                else {
                    var parentId = parentTrans.insId.getInsID();
                    var parentNode = this.nodeMap[parentId];
                    if (parentNode != undefined && childNode != undefined) {
                        childNode.treeNode.parent = null;
                        parentNode.treeNode.RemoveChild(childNode.treeNode);
                        parentNode.removeChildTreeNode(childNode);
                        if ((childNode.nodeType & NodeTypeEnum.TransformCamera) && childNode.children != null) {
                            for (var i = childNode.children.length - 1; i >= 0; i--) {
                                childNode.removeChildTreeNode(childNode.children[i]);
                            }
                        }
                    }
                }
            };
            SceneTreeView.prototype.changeVisible = function (trans) {
                var id = trans.insId.getInsID();
                if (this.nodeMap[id] != undefined) {
                    if (trans instanceof gd3d.framework.transform)
                        this.nodeMap[id].MarkTextVisible(trans.gameObject.visibleInScene);
                    else
                        this.nodeMap[id].MarkTextVisible(trans.isvisibleInScene);
                }
            };
            SceneTreeView.prototype.refreshNode = function (trans, name) {
                var id = trans.insId.getInsID();
                if (this.nodeMap[id] != undefined) {
                    var trans_4 = this.nodeMap[id].data.trans;
                    if (trans_4 instanceof gd3d.framework.transform) {
                        switch (name) {
                            case gd3d.framework.StringUtil.COMPONENT_CAMERA:
                                var camera = trans_4.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                                if (camera != null && (camera.getOverLays().length == 0)) {
                                    var children = this.filter.getChildren(trans_4);
                                    for (var i = 0; i < children.length; i++) {
                                        if (children[i].nodeType == NodeTypeEnum.Transform2DOverLayRoot) {
                                            var nnode = new SceneTreeNode();
                                            nnode.treeView = this;
                                            nnode.parent = this.nodeMap[id];
                                            nnode.data = children[i];
                                            this.nodeMap[id].children.push(nnode);
                                            var node = new TreeNode(children[i].trans);
                                            this.nodeMap[id].treeNode.AddChild(node);
                                            nnode.treeNode = node;
                                            gd3d.framework.sceneMgr.app.markNotify(children[i].trans, gd3d.framework.NotifyType.AddChild);
                                        }
                                    }
                                }
                                break;
                            case gd3d.framework.StringUtil.COMPONENT_CANVASRENDER:
                                var canvasrender = trans_4.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                                if (canvasrender != null && (canvasrender.canvas.getRoot().children == null || canvasrender.canvas.getRoot().children.length == 0)) {
                                    var nnode = new SceneTreeNode();
                                    nnode.treeView = this;
                                    nnode.parent = this.nodeMap[id];
                                    this.nodeMap[id].children.push(nnode);
                                    var node = new TreeNode(canvasrender.canvas.getRoot());
                                    this.nodeMap[id].treeNode.AddChild(node);
                                    nnode.treeNode = node;
                                    gd3d.framework.sceneMgr.app.markNotify(canvasrender.canvas.getRoot(), gd3d.framework.NotifyType.AddChild);
                                }
                                break;
                            default:
                                this.nodeMap[id].refresh();
                                break;
                        }
                    }
                    else
                        this.nodeMap[id].refresh();
                }
            };
            SceneTreeView.prototype.markBgHighLight = function (trans) {
                if (this.selectItem != null) {
                    this.selectItem.MarkBgHighLight(false);
                }
                var id = trans.insId.getInsID();
                if (this.nodeMap[id] != undefined) {
                    this.selectItem = this.nodeMap[id];
                    this.selectItem.MarkBgHighLight(true);
                }
            };
            SceneTreeView.prototype.checkFilter = function (trans) {
                if (trans instanceof gd3d.framework.transform) {
                    if (trans.gameObject.hideFlags & gd3d.framework.HideFlags.HideInHierarchy) {
                        return false;
                    }
                }
                if (trans instanceof gd3d.framework.transform2D) {
                    if (trans.hideFlags & gd3d.framework.HideFlags.HideInHierarchy) {
                        return false;
                    }
                }
                return true;
            };
            SceneTreeView.prototype.createDivLine = function () {
                var divLine = document.createElement("div");
                divLine.style.position = "relative";
                divLine.style.overflow = "auto";
                divLine.style.overflowX = "hidden";
                divLine.style.overflowY = "auto";
                divLine.style.height = "3px";
                return divLine;
            };
            SceneTreeView.prototype.initContextMenu = function (hierarchyContextMenu) {
                var _this = this;
                hierarchyContextMenu.clear();
                hierarchyContextMenu.addItem("Copy", function (node) {
                    _this.hierarchy.copy(node);
                });
                hierarchyContextMenu.addItem("Paste", function (node) {
                    _this.hierarchy.paste(node);
                });
                hierarchyContextMenu.addLine();
                hierarchyContextMenu.addItem("Rename", function (node) {
                    _this.curChangeAnchor = node;
                    node.changeNodeName();
                });
                hierarchyContextMenu.addItem("Duplicate", function (node) {
                    _this.hierarchy.duplicate(node);
                });
                hierarchyContextMenu.addItem("Delete", function (node) {
                    _this.selectItem = node;
                    _this.hierarchy.delete();
                });
                hierarchyContextMenu.addLine();
                hierarchyContextMenu.addItem("Create Empty", function (node) {
                    _this.hierarchy.createEmpty(node);
                });
                hierarchyContextMenu.addItem("3D Object/Cube", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Cube, node);
                });
                hierarchyContextMenu.addItem("3D Object/Sphere", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Sphere, node);
                });
                hierarchyContextMenu.addItem("3D Object/Plane", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Plane, node);
                });
                hierarchyContextMenu.addItem("3D Object/Quad", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Quad, node);
                });
                hierarchyContextMenu.addItem("3D Object/Cylinder", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Cylinder, node);
                });
                hierarchyContextMenu.addItem("3D Object/Pyramid", function (node) {
                    _this.hierarchy.create3D(gd3d.framework.PrimitiveType.Pyramid, node);
                });
                hierarchyContextMenu.addItem("UI/RawImage2D", function (node) {
                    if (node.nodeType == NodeTypeEnum.Transform2DCanvasRenderCanvas || node.nodeType == NodeTypeEnum.Transform2DOverLayRoot
                        || node.nodeType == NodeTypeEnum.Transform2DOverLayCanvas || node.nodeType == NodeTypeEnum.Transform2DNormal)
                        _this.hierarchy.create2D(gd3d.framework.Primitive2DType.RawImage2D, node);
                });
                hierarchyContextMenu.addItem("UI/Image2D", function (node) {
                    if (node.nodeType == NodeTypeEnum.Transform2DCanvasRenderCanvas || node.nodeType == NodeTypeEnum.Transform2DOverLayRoot
                        || node.nodeType == NodeTypeEnum.Transform2DOverLayCanvas || node.nodeType == NodeTypeEnum.Transform2DNormal)
                        _this.hierarchy.create2D(gd3d.framework.Primitive2DType.Image2D, node);
                });
                hierarchyContextMenu.addItem("UI/Label", function (node) {
                    if (node.nodeType == NodeTypeEnum.Transform2DCanvasRenderCanvas || node.nodeType == NodeTypeEnum.Transform2DOverLayRoot
                        || node.nodeType == NodeTypeEnum.Transform2DOverLayCanvas || node.nodeType == NodeTypeEnum.Transform2DNormal)
                        _this.hierarchy.create2D(gd3d.framework.Primitive2DType.Label, node);
                });
                hierarchyContextMenu.addItem("UI/Button", function (node) {
                    if (node.nodeType == NodeTypeEnum.Transform2DCanvasRenderCanvas || node.nodeType == NodeTypeEnum.Transform2DOverLayRoot
                        || node.nodeType == NodeTypeEnum.Transform2DOverLayCanvas || node.nodeType == NodeTypeEnum.Transform2DNormal)
                        _this.hierarchy.create2D(gd3d.framework.Primitive2DType.Button, node);
                });
            };
            SceneTreeView.prototype.doWithOutTransform = function (hierarchyContextMenu) {
                hierarchyContextMenu.disableItem("Copy");
                hierarchyContextMenu.disableItem("Rename");
                hierarchyContextMenu.disableItem("Duplicate");
                hierarchyContextMenu.disableItem("Delete");
            };
            SceneTreeView.prototype.doWithTransform = function (hierarchyContextMenu) {
                hierarchyContextMenu.enableItem("Copy");
                hierarchyContextMenu.enableItem("Rename");
                hierarchyContextMenu.enableItem("Duplicate");
                hierarchyContextMenu.enableItem("Delete");
            };
            return SceneTreeView;
        }());
        SceneTreeView.textNormalColor = "#cccccc";
        SceneTreeView.textUnVisibleColor = "#969696";
        SceneTreeView.itemBgNormalColor = "transparent";
        SceneTreeView.itemBgSelectColor = "#3f3f46";
        editor.SceneTreeView = SceneTreeView;
        var SceneTreeFilter = (function () {
            function SceneTreeFilter() {
                this.map = {};
                this.rootList = [];
            }
            SceneTreeFilter.prototype.getChildren = function (rootObj) {
                if (rootObj == null) {
                    return this.rootList;
                }
                else {
                    this.rootList = [];
                    if (rootObj instanceof gd3d.framework.scene) {
                        var scene = rootObj;
                        var node = {};
                        var tempTrans = scene.getRoot();
                        if (this.checkFilter(tempTrans)) {
                            node["trans"] = tempTrans;
                            node["txtcolor"] = SceneTreeView.textNormalColor;
                            node["nodeType"] = NodeTypeEnum.TransVirtual;
                            this.rootList.push(node);
                        }
                    }
                    else if (rootObj instanceof gd3d.framework.transform) {
                        var canvasRender = rootObj.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                        if (canvasRender != null) {
                            var node = {};
                            var tr = canvasRender.canvas.getRoot();
                            tr.name = "CanvasRenderRoot(Canvas)";
                            node["trans"] = tr;
                            node["txtcolor"] = SceneTreeView.textNormalColor;
                            node["nodeType"] = NodeTypeEnum.Transform2DCanvasRenderCanvas;
                            this.rootList.push(node);
                            this.map[tr.name] = tr;
                        }
                        var camera = rootObj.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                        if (camera != null) {
                            var node = {};
                            if (this.map[rootObj.gameObject.transform.insId.getInsID()] != undefined) {
                                node["trans"] = this.map[rootObj.gameObject.transform.insId.getInsID()];
                            }
                            else {
                                var tr = new gd3d.framework.transform2D();
                                tr.name = "OverlayRoot";
                                node["trans"] = tr;
                                this.map[tr.insId.getInsID()] = camera;
                                this.map[rootObj.gameObject.transform.insId.getInsID()] = tr;
                            }
                            node["txtcolor"] = SceneTreeView.textNormalColor;
                            node["nodeType"] = NodeTypeEnum.Transform2DOverLayRoot;
                            this.rootList.push(node);
                        }
                        var trans_5 = rootObj;
                        for (var index in trans_5.children) {
                            var node = {};
                            var tempTrans = trans_5.children[index];
                            if (this.checkFilter(tempTrans)) {
                                node["trans"] = tempTrans;
                                node["txtcolor"] = SceneTreeView.textNormalColor;
                                var canvasrender = tempTrans.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CANVASRENDER);
                                var camera_1 = tempTrans.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                                if (canvasrender != null && camera_1 != null) {
                                    node["nodeType"] = NodeTypeEnum.TransformCanvasRender | NodeTypeEnum.TransformCamera;
                                }
                                else if (canvasrender != null && camera_1 == null) {
                                    node["nodeType"] = NodeTypeEnum.TransformCanvasRender;
                                }
                                else if (camera_1 != null && canvasrender != null) {
                                    node["nodeType"] = NodeTypeEnum.TransformCamera;
                                }
                                else
                                    node["nodeType"] = NodeTypeEnum.TransformNormal;
                                this.rootList.push(node);
                            }
                        }
                    }
                    else if (rootObj instanceof gd3d.framework.transform2D) {
                        if (rootObj.name == "CanvasRenderRoot(Canvas)" && this.map[rootObj.insId.getInsID()] != undefined) {
                            var trans_6 = this.map[rootObj.insId.getInsID()];
                            for (var index in trans_6.children) {
                                var node = {};
                                var tempTrans = trans_6.children[index];
                                if (this.checkFilter(tempTrans)) {
                                    node["trans"] = tempTrans;
                                    node["txtcolor"] = SceneTreeView.textNormalColor;
                                    node["nodeType"] = NodeTypeEnum.Transform2DCanvasRenderCanvas;
                                    this.rootList.push(node);
                                }
                            }
                        }
                        else if (rootObj.name.indexOf("OverlayRoot") >= 0 && this.map[rootObj.insId.getInsID()] != undefined) {
                            var camera = this.map[rootObj.insId.getInsID()];
                            camera = camera.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                            if (camera.getOverLays() != null) {
                                var overLays = camera.getOverLays();
                                for (var key in overLays) {
                                    var overlay = overLays[key];
                                    if (overlay != null) {
                                        var node = {};
                                        var tr = overlay.canvas.getRoot();
                                        {
                                            tr.name = "overlay2D(Canvas)";
                                        }
                                        node["trans"] = tr;
                                        node["txtcolor"] = SceneTreeView.textNormalColor;
                                        node["nodeType"] = NodeTypeEnum.Transform2DOverLayCanvas;
                                        this.rootList.push(node);
                                        this.map[tr.insId.getInsID()] = overlay;
                                    }
                                }
                            }
                            else {
                            }
                        }
                        else {
                            var trans_7 = rootObj;
                            for (var index in trans_7.children) {
                                if (trans_7.children[index] == null)
                                    continue;
                                var node = {};
                                var tempTrans = trans_7.children[index];
                                node["trans"] = tempTrans;
                                node["txtcolor"] = SceneTreeView.textNormalColor;
                                node["nodeType"] = NodeTypeEnum.Transform2DNormal;
                                this.rootList.push(node);
                            }
                        }
                    }
                    return this.rootList;
                }
            };
            SceneTreeFilter.prototype.checkFilter = function (trans) {
                var flag;
                if (trans instanceof gd3d.framework.transform) {
                    flag = trans.gameObject.hideFlags;
                }
                else {
                    flag = trans.hideFlags;
                }
                if (flag == null) {
                    console.log(trans.name);
                    return false;
                }
                if (flag & gd3d.framework.HideFlags.HideInHierarchy) {
                    return false;
                }
                return true;
            };
            return SceneTreeFilter;
        }());
        editor.SceneTreeFilter = SceneTreeFilter;
        var SceneDivLineType;
        (function (SceneDivLineType) {
            SceneDivLineType[SceneDivLineType["SceneDivLineNoneType"] = 0] = "SceneDivLineNoneType";
            SceneDivLineType[SceneDivLineType["SceneDivLineHeadType"] = 1] = "SceneDivLineHeadType";
            SceneDivLineType[SceneDivLineType["SceneDivLineTailType"] = 2] = "SceneDivLineTailType";
            SceneDivLineType[SceneDivLineType["SceneDivLineHeadAndTailType"] = 3] = "SceneDivLineHeadAndTailType";
        })(SceneDivLineType = editor.SceneDivLineType || (editor.SceneDivLineType = {}));
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector_Base = (function () {
            function Inspector_Base() {
            }
            Inspector_Base.prototype.init = function (inspector, dataIns) {
                this.inspector = inspector;
                this.dataIns = dataIns;
            };
            Inspector_Base.prototype.onInspectorUI = function (seriaObj, widgetIns) {
                Inspector_Base.pase(seriaObj, widgetIns, this.dataIns, []);
            };
            Inspector_Base.pase = function (seriaObj, widgetIns, dataIns, keys) {
                if (seriaObj["type"] != undefined) {
                    var _title = keys[keys.length - 1];
                    var _type = seriaObj["type"];
                    var _style = seriaObj["UIStyle"];
                    var _val = null;
                    if (seriaObj["value"] != undefined) {
                        _val = seriaObj["value"];
                    }
                    else {
                    }
                    if (_type.indexOf('[]') >= 0) {
                        for (var key in _val) {
                            var _keys = [];
                            _keys = _keys.concat(keys);
                            _keys.push(key);
                            Inspector_Base.pase(_val[key], widgetIns, dataIns, _keys);
                            _keys.splice(_keys.length - 1, 1);
                        }
                    }
                    else {
                        seriaObj["title"] = _title;
                        seriaObj["dataIns"] = dataIns;
                        seriaObj["keys"] = keys;
                        seriaObj["defaultVal"] = _val;
                        {
                            var panel = editor.Inspector.getCompInspector(seriaObj["type"]);
                            if (panel != null) {
                                panel.onInspectorUI(seriaObj, widgetIns);
                                return;
                            }
                            else {
                                var widgetName = _style == undefined ? _type : _type + _style;
                                if (editor.WidgetMgr.ins().getWidget(widgetName) != null) {
                                    editor.WidgetMgr.ins().addWidget(widgetName, widgetIns, seriaObj);
                                }
                                else {
                                    for (var key in _val) {
                                        keys.push(key);
                                        Inspector_Base.pase(_val[key], widgetIns, dataIns, keys);
                                        keys.splice(keys.length - 1, 1);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    for (var key in seriaObj) {
                        keys.push(key);
                        Inspector_Base.pase(seriaObj[key], widgetIns, dataIns, keys);
                        keys.splice(keys.length - 1, 1);
                    }
                }
            };
            return Inspector_Base;
        }());
        editor.Inspector_Base = Inspector_Base;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector_File_Image = (function (_super) {
            __extends(Inspector_File_Image, _super);
            function Inspector_File_Image() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Inspector_File_Image.prototype.onInspectorUI = function (data, widgetIns) {
                editor.WidgetMgr.ins().addWidget("string", null, { "defaultVal": "helloworld" });
            };
            return Inspector_File_Image;
        }(editor.Inspector_Base));
        Inspector_File_Image = __decorate([
            gd3d.reflect.nodeComponentInspector
        ], Inspector_File_Image);
        editor.Inspector_File_Image = Inspector_File_Image;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector_image2D = (function (_super) {
            __extends(Inspector_image2D, _super);
            function Inspector_image2D() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Inspector_image2D.prototype.onInspectorUI = function (data, widgetIns) {
                _super.prototype.onInspectorUI.call(this, data, widgetIns);
            };
            return Inspector_image2D;
        }(editor.Inspector_Base));
        Inspector_image2D = __decorate([
            gd3d.reflect.nodeComponentInspector
        ], Inspector_image2D);
        editor.Inspector_image2D = Inspector_image2D;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector_material = (function (_super) {
            __extends(Inspector_material, _super);
            function Inspector_material() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shaderData = {};
                _this.texData = {};
                return _this;
            }
            Inspector_material.prototype.onInspectorUI = function (data, widgetIns) {
                var _this = this;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var material = this.getMaterial(data);
                var shader = material.shader;
                var malterialName = material.name == null ? "" : material.name.name;
                var shaderName = shader.name == null ? "" : shader.name.name;
                data["defaultVal"] = malterialName;
                data["title"] = "material";
                data["type"] = "material";
                editor.WidgetMgr.ins().addWidgetByStyle("string", "WidgetDragSelect", widgetIns, data);
                editor.WidgetMgr.ins().addWidget("nodeComponent", null, { "keys": [editor.WidgetMgr.ins().getKey(data)], "title": "Shader", "operate": this.getShaderComponentOperates() }, [function (_widgetIns) {
                        keys.push("shader");
                        _this.shaderData["title"] = "shader";
                        _this.shaderData["keys"] = keys;
                        _this.shaderData["defaultVal"] = shaderName;
                        _this.shaderData["type"] = "shader";
                        _this.shaderData["dataIns"] = dataIns;
                        editor.WidgetMgr.ins().addWidgetByStyle("string", "WidgetDragSelect", _widgetIns, _this.shaderData);
                        var uniformMap = material.mapUniform;
                        for (var key in uniformMap) {
                            if (shader.defaultValue[key] != undefined) {
                                var property = shader.defaultValue[key];
                                switch (property.type) {
                                    case gd3d.render.UniformTypeEnum.Texture:
                                        var mainTexName = null;
                                        if (material.mapUniform[key].value != undefined && material.mapUniform[key].value.name != undefined) {
                                            mainTexName = material.mapUniform[key].value.name.name;
                                        }
                                        keys.push(key);
                                        _this.texData["keys"] = keys;
                                        _this.texData["defaultVal"] = mainTexName;
                                        _this.texData["type"] = "texture";
                                        _this.texData["title"] = key;
                                        _this.texData["dataIns"] = dataIns;
                                        editor.WidgetMgr.ins().addWidgetByStyle("string", "WidgetDragSelect", _widgetIns, _this.texData);
                                        break;
                                    case gd3d.render.UniformTypeEnum.Float4:
                                        break;
                                }
                            }
                        }
                    }]);
            };
            Inspector_material.prototype.getShaderComponentOperates = function () {
                return editor.ComponentOperateEnum.ResetType | editor.ComponentOperateEnum.EditorShaderType;
            };
            Inspector_material.prototype.getIns = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                for (var key in keys) {
                    if (!isNaN(parseInt(keys[key])))
                        break;
                    dataIns = dataIns[keys[key]];
                }
                return dataIns;
            };
            Inspector_material.prototype.getIndex = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                for (var key in keys) {
                    if (!isNaN(parseInt(keys[key]))) {
                        return keys[key];
                    }
                    dataIns = dataIns[keys[key]];
                }
                return -1;
            };
            Inspector_material.prototype.getMaterial = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                for (var key in keys) {
                    dataIns = dataIns[keys[key]];
                    if (key == "material")
                        break;
                }
                return dataIns;
            };
            return Inspector_material;
        }(editor.Inspector_Base));
        Inspector_material = __decorate([
            gd3d.reflect.nodeComponentInspector
        ], Inspector_material);
        editor.Inspector_material = Inspector_material;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector_shader = (function (_super) {
            __extends(Inspector_shader, _super);
            function Inspector_shader() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Inspector_shader.prototype.onInspectorUI = function (data, widgetIns) {
            };
            Inspector_shader.prototype.getComponentOperates = function () {
                return editor.ComponentOperateEnum.ResetType | editor.ComponentOperateEnum.EditorShaderType;
            };
            Inspector_shader.prototype.getIns = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var ins;
                for (var key in keys) {
                    if (key == "shader")
                        break;
                    ins = dataIns[key];
                }
                return ins;
            };
            return Inspector_shader;
        }(editor.Inspector_Base));
        Inspector_shader = __decorate([
            gd3d.reflect.nodeComponentInspector
        ], Inspector_shader);
        editor.Inspector_shader = Inspector_shader;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Inspector = (function () {
            function Inspector(app, panel) {
                this.hide = false;
                this.beTransform2d = false;
                this.tempVec3 = new gd3d.math.vector3(0, 0, 0);
                this.app = app;
                this.panel = panel;
                this.init();
            }
            Inspector.prototype.init = function () {
                var _this = this;
                this.gui = new lighttool.htmlui.gui(this.panel.divContent);
                lighttool.htmlui.panelMgr.instance().init(this.panel.divContent);
                var assetViewPanel = lighttool.htmlui.panelMgr.instance().createPanel("asset Label");
                this.panel.splitWith(assetViewPanel, lighttool.htmlui.direction.V_Bottom, 0.8);
                this.assetView = new Inspector_AssetView(assetViewPanel);
                editor.WidgetMgr.ins().init(this.panel.divContent);
                this.regDefaultInspector();
                this.baseEditor = new editor.Inspector_Base();
                editor.WidgetMgr.ins().beChangeShaderFunc = function (mat) {
                    _this.saveMat(mat);
                };
            };
            Inspector.prototype.saveMat = function (mat) {
                var value = this.app.getAssetMgr().saveMaterial(mat, function (info) {
                    for (var key in info.files) {
                        var val = info.files[key];
                        {
                            var blob = localsave.file_str2blob(val);
                            var saveResult = localsave.save(gd3d.editor.edit.rootPath + key, blob);
                            if (saveResult != 0) {
                                alert("保存失败：" + saveResult);
                            }
                        }
                    }
                });
            };
            Inspector.prototype.regComponentInspector = function (type, panel) {
                Inspector.inspectorPanelMap[type] = panel;
            };
            Inspector.prototype.regDefaultInspector = function () {
                this.regComponentInspector("image2D", new editor.Inspector_image2D());
                this.regComponentInspector("material", new editor.Inspector_material());
                this.regComponentInspector("file_image", new editor.Inspector_File_Image());
            };
            Inspector.getCompInspector = function (type) {
                if (Inspector.inspectorPanelMap[type] != undefined)
                    return Inspector.inspectorPanelMap[type];
                return null;
            };
            Inspector.prototype.onUpdate = function (delta) {
                this.assetView.scale();
            };
            Inspector.prototype.showTrans = function (trans) {
                var _this = this;
                this.assetView.hide();
                editor.WidgetMgr.ins().show(trans);
                if (trans instanceof gd3d.framework.transform2D) {
                    this.beTransform2d = true;
                }
                else {
                    this.beTransform2d = false;
                }
                this.trans = trans;
                editor.WidgetMgr.ins().clear();
                this.gui.onchange = function () {
                    if (_this.trans == null)
                        return;
                    _this.rootObj = gd3d.io.serializeObjForInspector(_this.trans, false);
                    if (_this.rootObj == null) {
                    }
                    else {
                        _this.showTitleArea(_this.rootObj);
                        _this.showTransform(_this.rootObj);
                        _this.parseGameObject(_this.rootObj);
                        editor.WidgetMgr.ins().addWidget("floatsearchselect", null, { "keys": ["Add Component"], "dataIns": _this.trans, "options": _this.getSelectOptions(), "title": "Add Component" });
                    }
                    editor.WidgetMgr.ins().reset();
                };
                setInterval(function () {
                    _this.gui.update();
                }, 300);
            };
            Inspector.prototype.showFile = function (data) {
                var _this = this;
                this.assetView.show();
                editor.WidgetMgr.ins().clear();
                this.gui.onchange = function () {
                    if (data == null)
                        return;
                    var panel = Inspector.getCompInspector(data.type);
                    if (panel != null) {
                        panel.onInspectorUI(null, null);
                    }
                    editor.WidgetMgr.ins().reset();
                };
                setInterval(function () {
                    _this.gui.update();
                }, 300);
            };
            Inspector.prototype.showFileInfo = function () {
            };
            Inspector.prototype.getSelectOptions = function () {
                var be2d = false;
                if (this.trans instanceof gd3d.framework.transform2D)
                    be2d = true;
                var datas = document["__gdmeta__"];
                var array = [];
                var index = 0;
                for (var key in datas) {
                    var obj = datas[key]["__gdmeta__"]["class"]["custom"];
                    if (be2d) {
                        if (obj["2dcomp"] != undefined) {
                            index++;
                            array.push({ "key": key, "value": index });
                        }
                    }
                    else {
                        if (obj["nodecomp"] != undefined) {
                            index++;
                            array.push({ "key": key, "value": index });
                        }
                    }
                }
                return array;
            };
            Inspector.prototype.showTitleArea = function (obj) {
                var _this = this;
                var name = obj["name"].value;
                if (this.beTransform2d) {
                    editor.WidgetMgr.ins().addWidget("boolean", null, { "dataIns": this.trans, "keys": ["isvisible"], "options": [{ key: name, value: 0, checked: this.trans.visible }] });
                    if (this.btn) {
                        this.btn.hidden = true;
                    }
                }
                else {
                    editor.WidgetMgr.ins().addWidget("boolean", null, { "dataIns": this.trans.gameObject, "keys": ["isvisible"], "options": [{ key: name, value: 0, checked: this.trans.gameObject.visible }] });
                    var layer = obj["gameObject"]["value"]["layer"].value;
                    var options = [{ key: "default", value: 0, selected: false }, { key: "UI", value: 1, selected: false }];
                    for (var i = 0; i < options.length; i++) {
                        if (this.trans.gameObject.layer == i)
                            options[i].selected = true;
                    }
                    editor.WidgetMgr.ins().addWidgetByStyle("number", "Layer", null, { "title": "Layer", "dataIns": this.trans.gameObject, "keys": ["layer"], "options": options });
                    if (this.trans.gameObject.camera) {
                        if (this.btn == undefined) {
                            this.creatbtn();
                        }
                        if (this.btn.hidden) {
                            this.btn.hidden = false;
                        }
                        if (this.app.be2dstate) {
                            this.btn.textContent = "切换到3d模式";
                            this.btn.onclick = function () {
                                _this.app.be2dstate = false;
                                console.log("切换到3d");
                            };
                        }
                        else {
                            this.btn.textContent = "切换到2d模式";
                            this.btn.onclick = function () {
                                _this.app.be2dstate = true;
                                console.log("切换到2d");
                            };
                        }
                    }
                }
            };
            Inspector.prototype.creatbtn = function () {
                this.btn = document.createElement("button");
                this.btn.setAttribute("id", "fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
                this.btn.style.position = "absolute";
                this.btn.scrollLeft = 1;
                this.btn.name = "funcks_hou";
                this.btn.style.width = "300px";
                this.btn.style.height = "30px";
                this.panel.divRoot.appendChild(this.btn);
            };
            Inspector.prototype.showTransform = function (obj) {
                var _this = this;
                if (this.beTransform2d) {
                    editor.WidgetMgr.ins().addWidget("nodeComponent", null, { "keys": ["transform"], "title": "Transform2D" }, [function (e) {
                            var localTranslate = obj["localTranslate"]["value"];
                            var localScale = obj["localScale"]["value"];
                            var pivot = obj["pivot"]["value"];
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Position", "keys": ["localTranslate"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    for (var key in localTranslate) {
                                        editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["localTranslate", key], "defaultVal": _this.trans.localTranslate[key] });
                                    }
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Rotate", "keys": ["localRotate"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    var tempt = _this.trans.localRotate * 180 / Math.PI % 360;
                                    if (tempt > 180) {
                                        tempt = tempt - 360;
                                    }
                                    editor.WidgetMgr.ins().addWidgetByStyle("number", "trans", e, { "dataIns": _this.trans, keys: ["localRotate"], "defaultVal": tempt });
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Scale", "keys": ["localScale"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    for (var key in localScale) {
                                        editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["localScale", key], "defaultVal": _this.trans.localScale[key] });
                                    }
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "width", "keys": ["width"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["width"], "defaultVal": _this.trans.width });
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "height", "keys": ["height"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["height"], "defaultVal": _this.trans.height });
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "pivot", "keys": ["pivot"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    for (var key in pivot) {
                                        editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["pivot", key], "defaultVal": _this.trans.pivot[key] });
                                    }
                                }]);
                        }]);
                }
                else {
                    editor.WidgetMgr.ins().addWidget("nodeComponent", null, { "keys": ["transform"], "title": "Transform" }, [function (e) {
                            var localTranslate = obj["localTranslate"]["value"];
                            var localScale = obj["localScale"]["value"];
                            var localRotate = obj["localRotate"]["value"];
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Position", "keys": ["localTranslate"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    for (var key in localTranslate) {
                                        editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["localTranslate", key], "defaultVal": _this.trans.localTranslate[key] });
                                    }
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Rotate", "keys": ["localRotate"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    var quat_tempt = gd3d.math.pool.new_quaternion();
                                    for (var key in localRotate) {
                                        quat_tempt[key] = localRotate[key]["value"];
                                    }
                                    var angle_tempt = gd3d.math.pool.new_vector3();
                                    gd3d.math.quatToEulerAngles(quat_tempt, angle_tempt);
                                    editor.WidgetMgr.ins().addWidgetByStyle("number", "trans", e, { "dataIns": _this.trans, keys: ["localRotate", "x"], "defaultVal": angle_tempt.x });
                                    editor.WidgetMgr.ins().addWidgetByStyle("number", "trans", e, { "dataIns": _this.trans, keys: ["localRotate", "y"], "defaultVal": angle_tempt.y });
                                    editor.WidgetMgr.ins().addWidgetByStyle("number", "trans", e, { "dataIns": _this.trans, keys: ["localRotate", "z"], "defaultVal": angle_tempt.z });
                                    gd3d.math.pool.delete_quaternion(quat_tempt);
                                    gd3d.math.pool.delete_vector3(angle_tempt);
                                }]);
                            editor.WidgetMgr.ins().addWidget("grid", e, { "title": "Scale", "keys": ["localScale"], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, data) {
                                    for (var key in localScale) {
                                        editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": _this.trans, keys: ["localScale", key], "defaultVal": _this.trans.localScale[key] });
                                    }
                                }]);
                        }]);
                }
            };
            Inspector.prototype.parseGameObject = function (_obj) {
                if (this.beTransform2d) {
                    var _comObj = _obj["components"];
                    if (_comObj["value"] != undefined) {
                        var components = _comObj["value"];
                        for (var com in components) {
                            var realCom = components[com]["value"]["comp"];
                            this.parseComponent(realCom);
                        }
                    }
                }
                else {
                    _obj = _obj["gameObject"]["value"];
                    var _comObj = _obj["components"];
                    if (_comObj["value"] != undefined) {
                        var components = _comObj["value"];
                        for (var com in components) {
                            var realCom = components[com]["value"]["comp"];
                            this.parseComponent(realCom);
                        }
                    }
                }
            };
            Inspector.prototype.getComponentOperates = function (name) {
                return editor.ComponentOperateEnum.RemoveType | editor.ComponentOperateEnum.ResetType;
            };
            Inspector.prototype.parseComponent = function (root) {
                var _this = this;
                this.name = root["type"];
                editor.WidgetMgr.ins().addWidget("nodeComponent", null, { "keys": [this.name], "title": this.name, "operate": this.getComponentOperates(this.name), "dataIns": this.trans }, [function (e) {
                        var seriaObj = root["value"];
                        var panel = Inspector.getCompInspector(_this.name);
                        var dataIns;
                        if (_this.beTransform2d) {
                            dataIns = _this.trans.getComponent(_this.name);
                        }
                        else {
                            dataIns = _this.trans.gameObject.getComponent(_this.name);
                        }
                        if (panel != null) {
                            panel.init(_this, dataIns);
                            panel.onInspectorUI(seriaObj, e);
                        }
                        else {
                            _this.baseEditor.init(_this, dataIns);
                            _this.baseEditor.onInspectorUI(seriaObj, e);
                        }
                    }]);
            };
            Inspector.prototype.close = function () {
                editor.WidgetMgr.ins().reset();
            };
            Inspector.prototype.clear = function () {
                this.trans = null;
                editor.WidgetMgr.ins().clear();
            };
            return Inspector;
        }());
        Inspector.inspectorPanelMap = {};
        editor.Inspector = Inspector;
        var Inspector_AssetView = (function () {
            function Inspector_AssetView(panel) {
                var _this = this;
                this.imgWidth = 0;
                this.imgHeight = 0;
                this.lastWidth = 0;
                this.lastheight = 0;
                this.panel = panel;
                this.panel.divContent.style.backgroundColor = "#555555";
                this.panel.btnFloat.hidden = true;
                this.panel.btnClose.hidden = true;
                this.img = this.createElement("img");
                this.img.onload = function (ev) {
                    _this.imgWidth = _this.img.width;
                    _this.imgHeight = _this.img.height;
                    _this.scaleTexture();
                    _this.img.hidden = false;
                };
                this.canvas = this.createElement("canvas");
            }
            Inspector_AssetView.prototype.createElement = function (type) {
                var element = document.createElement(type);
                this.panel.divContent.appendChild(element);
                element.hidden = true;
                element.style.position = "absolute";
                element.style.left = "0";
                element.style.top = "0";
                element.style.right = "0";
                element.style.bottom = "0";
                element.style.margin = "auto";
                return element;
            };
            Inspector_AssetView.prototype.center = function () {
            };
            Inspector_AssetView.prototype.hide = function () {
                this.lastWidth = this.panel.divContent.clientWidth;
                this.lastheight = this.panel.divContent.clientHeight;
            };
            Inspector_AssetView.prototype.show = function () {
            };
            Inspector_AssetView.prototype.getImage = function () {
                this.showtype = ShowAssetType.IMAGE;
                this.img.hidden = true;
                this.canvas.hidden = true;
                return this.img;
            };
            Inspector_AssetView.prototype.getCanvas = function () {
                this.showtype = ShowAssetType.CANVAS;
                this.img.hidden = true;
                this.canvas.hidden = true;
                return this.canvas;
            };
            Inspector_AssetView.prototype.scale = function () {
                if (this.showtype == ShowAssetType.IMAGE) {
                    this.scaleTexture();
                }
                else {
                    this.scaleCanvas();
                }
            };
            Inspector_AssetView.prototype.scaleTexture = function () {
                var asp = this.imgWidth / this.imgHeight;
                if (this.panel.divContent.clientWidth / this.panel.divContent.clientHeight > asp) {
                    if (this.panel.divContent.clientHeight < this.imgHeight) {
                        this.img.style.height = this.panel.divContent.clientHeight + "px";
                        this.img.style.width = this.panel.divContent.clientHeight * asp + "px";
                    }
                    else {
                        this.img.style.height = this.imgHeight + "px";
                        this.img.style.width = this.imgWidth + "px";
                    }
                }
                else {
                    if (this.panel.divContent.clientWidth < this.imgWidth) {
                        this.img.style.width = this.panel.divContent.clientWidth + "px";
                        this.img.style.height = this.panel.divContent.clientWidth / asp + "px";
                    }
                    else {
                        this.img.style.height = this.imgHeight + "px";
                        this.img.style.width = this.imgWidth + "px";
                    }
                }
            };
            Inspector_AssetView.prototype.scaleCanvas = function () {
                var length = this.panel.divContent.clientWidth > this.panel.divContent.clientHeight ? this.panel.divContent.clientHeight : this.panel.divContent.clientWidth;
                this.canvas.style.height = length + "px";
                this.canvas.style.width = length + "px";
            };
            return Inspector_AssetView;
        }());
        editor.Inspector_AssetView = Inspector_AssetView;
        var ShowAssetType;
        (function (ShowAssetType) {
            ShowAssetType[ShowAssetType["IMAGE"] = 0] = "IMAGE";
            ShowAssetType[ShowAssetType["CANVAS"] = 1] = "CANVAS";
        })(ShowAssetType = editor.ShowAssetType || (editor.ShowAssetType = {}));
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var JQueryUI = (function () {
            function JQueryUI(div) {
                this.mapIndex = {};
                this.mapVal = {};
                this.mapInputLockState = {};
                this.selectOption = [];
                this.checkBoxOption = [];
                this.div = div;
                this.div.style.overflowY = "scroll";
                this.elementJqury = $(div).elementBuilder();
            }
            JQueryUI.prototype.clear = function () {
                $(this.div).empty();
                for (var key in this.mapIndex) {
                    this.mapIndex[key] = 0;
                }
                for (var index in this.mapInputLockState) {
                    this.mapInputLockState[index] = false;
                }
                this.mapVal = {};
            };
            JQueryUI.prototype.reset = function () {
                for (var key in this.mapIndex) {
                    var index = this.mapIndex[key];
                    var map = this.mapVal[key];
                    for (var i in map) {
                        if (Number(i) > index) {
                            this.mapVal[key][i].hide();
                        }
                    }
                    this.mapIndex[key] = 0;
                }
            };
            JQueryUI.prototype.addInput = function (text, type, defaultVal, onblur, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["input"] != undefined) {
                    data = this.mapVal["input"];
                    index = this.mapIndex["input"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshInput(instance, text, defaultVal, type, onblur, index, _data);
                    }
                    else {
                        this.createInput(instance, text, defaultVal, type, onblur, index, _data);
                    }
                }
                else {
                    index += 1;
                    this.createInput(instance, text, defaultVal, type, onblur, index, _data);
                }
            };
            JQueryUI.prototype.addGrid = function (gridTitle, layoutDirType, onfinished, instance) {
                if (layoutDirType === void 0) { layoutDirType = LayoutDirectionEnum.VerticalType; }
                if (instance === void 0) { instance = null; }
                var data;
                var index = 0;
                if (this.mapVal["grid"] != undefined) {
                    data = this.mapVal["grid"];
                    index = this.mapIndex["grid"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshGrid(instance, gridTitle, layoutDirType, onfinished, index);
                    }
                    else {
                        this.createGrid(instance, gridTitle, layoutDirType, onfinished, index);
                    }
                }
                else {
                    index += 1;
                    this.createGrid(instance, gridTitle, layoutDirType, onfinished, index);
                }
            };
            JQueryUI.prototype.addComponent = function (compTitle, onfinished, operateNum, onOpereate, instance) {
                if (instance === void 0) { instance = null; }
                var data;
                var index = 0;
                if (this.mapVal["component"] != undefined) {
                    data = this.mapVal["component"];
                    index = this.mapIndex["component"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshComponent(instance, compTitle, onfinished, onOpereate, index);
                    }
                    else {
                        this.createComponent(instance, compTitle, onfinished, operateNum, onOpereate, index);
                    }
                }
                else {
                    index += 1;
                    this.createComponent(instance, compTitle, onfinished, operateNum, onOpereate, index);
                }
            };
            JQueryUI.prototype.addButton = function (text, onClick, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["button"] != undefined) {
                    data = this.mapVal["button"];
                    index = this.mapIndex["button"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshButton(instance, text, onClick, index, _data);
                    }
                    else {
                        this.createButton(instance, text, onClick, index, _data);
                    }
                }
                else {
                    index += 1;
                    this.createButton(instance, text, onClick, index, _data);
                }
            };
            JQueryUI.prototype.addTextArea = function (text, onblur, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["textarea"] != undefined) {
                    data = this.mapVal["textarea"];
                    index = this.mapIndex["textarea"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshTextArea(instance, text, onblur, index, _data);
                    }
                    else {
                        this.createTextArea(instance, text, onblur, index, _data);
                    }
                }
                else {
                    index += 1;
                    this.createTextArea(instance, text, onblur, index, _data);
                }
            };
            JQueryUI.prototype.addCheckBox = function (name, options, onchange, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["checkbox"] != undefined) {
                    data = this.mapVal["checkbox"];
                    index = this.mapIndex["checkbox"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshCheckBox(instance, name, options, onchange, index, _data);
                    }
                    else {
                        this.createCheckBox(instance, name, options, onchange, index, _data);
                    }
                }
                else {
                    index += 1;
                    this.createCheckBox(instance, name, options, onchange, index, _data);
                }
            };
            JQueryUI.prototype.addSelect = function (name, options, onchange, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["select"] != undefined) {
                    data = this.mapVal["select"];
                    index = this.mapIndex["select"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshSelect(instance, name, options, onchange, index, _data);
                    }
                    else {
                        this.createSelect(instance, name, options, onchange, index, _data);
                    }
                }
                else {
                    index += 1;
                    this.createSelect(instance, name, options, onchange, index, _data);
                }
            };
            JQueryUI.prototype.addFloatSearchSelect = function (title, options, onclick, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["floatSearchSelect"] != undefined) {
                    data = this.mapVal["floatSearchSelect"];
                    index = this.mapIndex["floatSearchSelect"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refeshFloatSearchSelect(title, options, onclick, instance, _data, index);
                    }
                    else {
                        this.createFloatSearchSelect(title, options, onclick, instance, _data, index);
                    }
                }
                else {
                    index += 1;
                    this.createFloatSearchSelect(title, options, onclick, instance, _data, index);
                }
            };
            JQueryUI.prototype.createFloatSearchSelect = function (title, options, onclick, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.chosen({
                            "value": title, options: options, onclick: onclick
                        });
                    }
                    else {
                        data = instance.chosen({
                            "value": title, options: options, onclick: onclick
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.chosen({
                            "value": title, options: options, data: _data, onclick: onclick
                        });
                    }
                    else {
                        data = instance.chosen({
                            "value": title, options: options, data: _data, onclick: onclick
                        });
                    }
                }
                this.saveToMap("floatSearchSelect", index, data);
            };
            JQueryUI.prototype.refeshFloatSearchSelect = function (title, options, onclick, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                instance.reload({
                    options: this.selectOption
                });
                this.mapIndex["floatSearchSelect"] = index;
            };
            JQueryUI.prototype.addImageCut = function (url, onchange, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["imageCut"] != undefined) {
                    data = this.mapVal["imageCut"];
                    index = this.mapIndex["imageCut"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refeshImageCut(url, onchange, instance, _data, index);
                    }
                    else {
                        this.createImageCut(url, onchange, instance, _data, index);
                    }
                }
                else {
                    index += 1;
                    this.createImageCut(url, onchange, instance, _data, index);
                }
            };
            JQueryUI.prototype.createImageCut = function (url, onchange, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.imageCut({
                            "imageUrl": url, onchange: onchange
                        });
                    }
                    else {
                        data = instance.imageCut({
                            "imageUrl": url, onchange: onchange
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.imageCut({
                            "imageUrl": url, data: _data, onchange: onchange
                        });
                    }
                    else {
                        data = instance.imageCut({
                            "imageUrl": url, data: _data, onchange: onchange
                        });
                    }
                }
                this.saveToMap("imageCut", index, data);
            };
            JQueryUI.prototype.refeshImageCut = function (title, onchange, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                instance.show();
                this.mapIndex["imageCut"] = index;
            };
            JQueryUI.prototype.addBlockSlice = function (onchange, instance, _data) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data;
                var index = 0;
                if (this.mapVal["blockSlice"] != undefined) {
                    data = this.mapVal["blockSlice"];
                    index = this.mapIndex["blockSlice"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refeshBlockSlice(onchange, instance, _data, index);
                    }
                    else {
                        this.createBlockSlice(onchange, instance, _data, index);
                    }
                }
                else {
                    index += 1;
                    this.createBlockSlice(onchange, instance, _data, index);
                }
            };
            JQueryUI.prototype.createBlockSlice = function (onchange, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.block({ onchange: onchange });
                    }
                    else {
                        data = instance.block({ onchange: onchange });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.block({ data: _data, onchange: onchange });
                    }
                    else {
                        data = instance.block({ data: _data, onchange: onchange });
                    }
                }
                this.saveToMap("blockSlice", index, data);
            };
            JQueryUI.prototype.refeshBlockSlice = function (onchange, instance, _data, index) {
                if (instance === void 0) { instance = null; }
                if (_data === void 0) { _data = null; }
                instance.show();
                this.mapIndex["blockSlice"] = index;
            };
            JQueryUI.prototype.addSpaceLine = function (instance) {
                if (instance === void 0) { instance = null; }
                var data;
                var index = 0;
                if (this.mapVal["spaceline"] != undefined) {
                    data = this.mapVal["spaceline"];
                    index = this.mapIndex["spaceline"];
                    index += 1;
                    if (data[index] != undefined) {
                        instance = data[index];
                        this.refreshSpaceLine(instance, index);
                    }
                    else {
                        this.createSpaceLine(instance, index);
                    }
                }
                else {
                    index += 1;
                    this.createSpaceLine(instance, index);
                }
            };
            JQueryUI.prototype.createSpaceLine = function (instance, index) {
                var data;
                if (instance == null) {
                    data = this.elementJqury.line();
                }
                else {
                    data = instance.line();
                }
                this.saveToMap("spaceline", index, data);
            };
            JQueryUI.prototype.createSelect = function (instance, name, options, onselected, index, _data) {
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.select({
                            "title": name, options: options, onchange: onselected
                        });
                    }
                    else {
                        data = instance.select({
                            "title": name, options: options, onchange: onselected
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.select({
                            "title": name, options: options, data: _data, onchange: onselected
                        });
                    }
                    else {
                        data = instance.select({
                            "title": name, options: options, data: _data, onchange: onselected
                        });
                    }
                }
                this.saveToMap("select", index, data);
            };
            JQueryUI.prototype.refreshSelect = function (instance, name, options, onselected, index, _data) {
                if (_data === void 0) { _data = null; }
                this.selectOption = [];
                instance.show();
                for (var index_3 in options) {
                    this.selectOption.push(options[index_3].selected);
                }
                instance.reload({
                    options: this.selectOption
                });
                this.mapIndex["select"] = index;
            };
            JQueryUI.prototype.createButton = function (instance, text, onClick, index, _data) {
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.button({
                            "value": text, onclick: onClick
                        });
                    }
                    else {
                        data = instance.button({
                            "value": text, onclick: onClick
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.button({
                            "value": text, onclick: onClick, data: _data
                        });
                    }
                    else {
                        data = instance.button({
                            "value": text, onclick: onClick, data: _data
                        });
                    }
                }
                this.saveToMap("button", index, data);
            };
            JQueryUI.prototype.createTextArea = function (instance, text, onblur, index, _data) {
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data != null) {
                    if (instance == null) {
                        data = this.elementJqury.textarea({
                            "value": text, onblur: onblur, data: _data
                        });
                    }
                    else {
                        data = instance.textarea({
                            "value": text, onblur: onblur, data: _data
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.textarea({
                            "value": text, onblur: onblur
                        });
                    }
                    else {
                        data = instance.textarea({
                            "value": text, onblur: onblur
                        });
                    }
                }
                this.saveToMap("textarea", index, data);
            };
            JQueryUI.prototype.createInput = function (instance, text, defaultVal, type, _onblur, index, _data) {
                var _this = this;
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.input({
                            "title": text, "value": defaultVal, onblur: function (e, params) {
                                if (_onblur != null) {
                                    _onblur(e, params);
                                }
                                _this.mapInputLockState[index] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[index] = true;
                            }
                        });
                    }
                    else {
                        data = instance.input({
                            "title": text, "value": defaultVal, onblur: function (e, params) {
                                if (_onblur != null) {
                                    _onblur(e, params);
                                }
                                _this.mapInputLockState[index] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[index] = true;
                            }
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.input({
                            "title": text, "value": defaultVal, onblur: function (e, params) {
                                if (_onblur != null) {
                                    _onblur(e, params);
                                }
                                _this.mapInputLockState[index] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[index] = true;
                            }, data: _data
                        });
                    }
                    else {
                        data = instance.input({
                            "title": text, "value": defaultVal, onblur: function (e, params) {
                                if (_onblur != null) {
                                    _onblur(e, params);
                                }
                                _this.mapInputLockState[index] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[index] = true;
                            }, data: _data
                        });
                    }
                }
                this.mapInputLockState[index] = false;
                this.saveToMap("input", index, data);
            };
            JQueryUI.prototype.createComponent = function (instance, compTitle, onfinished, operate, onOpereate, index) {
                var data;
                if (instance == null) {
                    data = this.elementJqury.compent({
                        title: compTitle,
                        after: function (e) {
                            if (onfinished != null) {
                                onfinished(e);
                            }
                        }, operate: operate, onoperate: onOpereate
                    });
                }
                else {
                    data = instance.compent({
                        title: compTitle,
                        after: function (e) {
                            if (onfinished != null) {
                                onfinished(e);
                            }
                        }, operate: operate, onoperate: onOpereate
                    });
                }
                this.saveToMap("component", index, data);
            };
            JQueryUI.prototype.saveToMap = function (widgetName, index, widget) {
                if (this.mapVal[widgetName] == undefined)
                    this.mapVal[widgetName] = {};
                this.mapIndex[widgetName] = index;
                this.mapVal[widgetName][index] = widget;
            };
            JQueryUI.prototype.createGrid = function (instance, gridTitle, layoutDirType, onfinished, index) {
                if (layoutDirType === void 0) { layoutDirType = LayoutDirectionEnum.VerticalType; }
                var data;
                if (instance == null) {
                    data = this.elementJqury.grid({
                        "title": gridTitle, "layout": layoutDirType, after: function (e) {
                            if (onfinished != null) {
                                onfinished(e);
                            }
                        }
                    });
                }
                else {
                    data = instance.grid({
                        "title": gridTitle, "layout": layoutDirType, after: function (e) {
                            if (onfinished != null) {
                                onfinished(e);
                            }
                        }
                    });
                }
                this.saveToMap("grid", index, data);
            };
            JQueryUI.prototype.createCheckBox = function (instance, name, options, onselected, index, _data) {
                if (_data === void 0) { _data = null; }
                var data = null;
                if (_data == null) {
                    if (instance == null) {
                        data = this.elementJqury.checkbox({
                            "title": name, options: options, onchange: onselected
                        });
                    }
                    else {
                        data = instance.checkbox({
                            "title": name, options: options, onchange: onselected
                        });
                    }
                }
                else {
                    if (instance == null) {
                        data = this.elementJqury.checkbox({
                            "title": name, options: options, data: _data, onchange: onselected
                        });
                    }
                    else {
                        data = instance.checkbox({
                            "title": name, options: options, data: _data, onchange: onselected
                        });
                    }
                }
                this.saveToMap("checkbox", index, data);
            };
            JQueryUI.prototype.refreshCheckBox = function (instance, name, options, onselected, index, _data) {
                if (_data === void 0) { _data = null; }
                this.checkBoxOption = [];
                for (var inde in options) {
                    this.checkBoxOption.push(options[inde].checked);
                }
                instance.show();
                instance.reload({ options: this.checkBoxOption });
                this.mapIndex["checkbox"] = index;
            };
            JQueryUI.prototype.refreshGrid = function (instance, gridTitle, layoutDirType, onfinished, index) {
                if (layoutDirType === void 0) { layoutDirType = LayoutDirectionEnum.VerticalType; }
                instance.show();
                if (onfinished != null) {
                    onfinished(instance);
                }
                this.mapIndex["grid"] = index;
            };
            JQueryUI.prototype.refreshInput = function (instance, text, defaultVal, type, _onblur, index, _data) {
                var _this = this;
                if (_data === void 0) { _data = null; }
                this.mapIndex["input"] = index;
                instance.show();
                if (this.mapInputLockState[index])
                    return;
                var data = null;
                if (_data == null) {
                    data = instance.reload({
                        "title": text, "value": defaultVal, onblur: function (e, params) {
                            if (_onblur != null) {
                                _onblur(e, params);
                            }
                            _this.mapInputLockState[index] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[index] = true;
                        }
                    });
                }
                else {
                    data = instance.reload({
                        "title": text, "value": defaultVal, onblur: function (e, params) {
                            if (_onblur != null) {
                                _onblur(e, params);
                            }
                            _this.mapInputLockState[index] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[index] = true;
                        }, data: _data
                    });
                }
            };
            JQueryUI.prototype.refreshComponent = function (instance, compTitle, onfinished, onOpereate, index) {
                instance.show();
                if (onfinished != null) {
                    onfinished(instance);
                }
                this.mapIndex["component"] = index;
            };
            JQueryUI.prototype.refreshButton = function (instance, text, onClick, index, _data) {
                if (_data === void 0) { _data = null; }
                instance.show();
                var data = null;
                if (_data == null) {
                    data = instance.reload({
                        "value": text, onclick: onClick
                    });
                }
                else {
                    data = instance.reload({
                        "value": text, onclick: onClick, data: _data
                    });
                }
                this.mapIndex["button"] = index;
            };
            JQueryUI.prototype.refreshTextArea = function (instance, text, onblur, index, data) {
                if (data === void 0) { data = null; }
                instance.show();
                if (data != null) {
                    instance.reload({
                        "value": text, onblur: onblur, data: data
                    });
                }
                else {
                    instance.reload({
                        "value": text, onblur: onblur
                    });
                }
                this.mapIndex["textarea"] = index;
            };
            JQueryUI.prototype.refreshSpaceLine = function (instance, index) {
                instance.show();
                this.mapIndex["spaceline"] = index;
            };
            return JQueryUI;
        }());
        editor.JQueryUI = JQueryUI;
        var LayoutDirectionEnum;
        (function (LayoutDirectionEnum) {
            LayoutDirectionEnum[LayoutDirectionEnum["VerticalType"] = 0] = "VerticalType";
            LayoutDirectionEnum[LayoutDirectionEnum["HorizontalType"] = 1] = "HorizontalType";
        })(LayoutDirectionEnum = editor.LayoutDirectionEnum || (editor.LayoutDirectionEnum = {}));
        var WidgetInputEnum;
        (function (WidgetInputEnum) {
            WidgetInputEnum[WidgetInputEnum["IntType"] = 0] = "IntType";
            WidgetInputEnum[WidgetInputEnum["FloatType"] = 2] = "FloatType";
            WidgetInputEnum[WidgetInputEnum["StringType"] = 4] = "StringType";
            WidgetInputEnum[WidgetInputEnum["AudioType"] = 8] = "AudioType";
            WidgetInputEnum[WidgetInputEnum["MeshType"] = 16] = "MeshType";
            WidgetInputEnum[WidgetInputEnum["AnimatorType"] = 32] = "AnimatorType";
            WidgetInputEnum[WidgetInputEnum["ObjType"] = 64] = "ObjType";
        })(WidgetInputEnum = editor.WidgetInputEnum || (editor.WidgetInputEnum = {}));
        var ComponentOperateEnum;
        (function (ComponentOperateEnum) {
            ComponentOperateEnum[ComponentOperateEnum["NoneType"] = 1] = "NoneType";
            ComponentOperateEnum[ComponentOperateEnum["RemoveType"] = 2] = "RemoveType";
            ComponentOperateEnum[ComponentOperateEnum["ResetType"] = 4] = "ResetType";
            ComponentOperateEnum[ComponentOperateEnum["CopyComponentType"] = 8] = "CopyComponentType";
            ComponentOperateEnum[ComponentOperateEnum["PasteValuesType"] = 16] = "PasteValuesType";
            ComponentOperateEnum[ComponentOperateEnum["PasteAsNewComponentType"] = 32] = "PasteAsNewComponentType";
            ComponentOperateEnum[ComponentOperateEnum["ResetPositionType"] = 64] = "ResetPositionType";
            ComponentOperateEnum[ComponentOperateEnum["ResetRotationType"] = 128] = "ResetRotationType";
            ComponentOperateEnum[ComponentOperateEnum["ResetScaleType"] = 256] = "ResetScaleType";
            ComponentOperateEnum[ComponentOperateEnum["MoveUpType"] = 512] = "MoveUpType";
            ComponentOperateEnum[ComponentOperateEnum["MoveDownType"] = 1024] = "MoveDownType";
            ComponentOperateEnum[ComponentOperateEnum["EditorShaderType"] = 2048] = "EditorShaderType";
        })(ComponentOperateEnum = editor.ComponentOperateEnum || (editor.ComponentOperateEnum = {}));
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Main = (function () {
            function Main() {
                this.stepForward = 0;
            }
            Main.prototype.onStart = function (app) {
                var _this = this;
                this.app = app;
                document["hierarchy"] = function (div) {
                    _this.hierarchy = new gd3d.editor.Hierarchy(div, _this.onOperate, _this);
                    _this.hierarchy.refresh();
                    gd3d.editor.edit.onContextMenuFuncs.push(function (ev, type) { _this.hierarchy.endChangeNodeName(); });
                    gd3d.editor.edit.onClickFuncs.push(function (ev, type) { _this.hierarchy.endChangeNodeName(); });
                    gd3d.editor.edit.onClickFuncs.push(function (ev, type) {
                        if (type == 1 && _this.hierarchy)
                            _this.hierarchy.clearselect();
                    });
                    gd3d.editor.edit.onClickFuncs.push(function (ev, type) {
                        if (type == 1 && _this.inspector)
                            _this.inspector.clear();
                    });
                };
                document["inspector"] = function (panel) {
                    _this.inspector = new gd3d.editor.Inspector(app, panel);
                    gd3d.editor.edit.inspector = _this.inspector;
                };
                document["profiler"] = function (panel) {
                    _this.profiler = new gd3d.editor.Profiler(app, panel);
                };
                switch (gd3d.editor.type) {
                    case "0":
                        this.envMgr = new editor.SceneEnvMgr();
                        this.envMgr.onStart(app);
                        this.editorMgr = new editor.SceneEditorMgr(this);
                        this.editorMgr.onStart(app);
                        break;
                    case "1":
                        this.envMgr = new editor.PlayDebugMgr();
                        this.envMgr.onStart(app);
                        break;
                }
            };
            Main.prototype.onUpdate = function (delta) {
                if (this.envMgr)
                    this.envMgr.onUpdate(delta);
                if (this.editorMgr)
                    this.editorMgr.onUpdate(delta);
                if (this.hierarchy)
                    this.hierarchy.onUpdate(delta);
                if (this.inspector)
                    this.inspector.onUpdate(delta);
                if (this.profiler)
                    this.profiler.onUpdate(delta);
            };
            Main.prototype.onOperate = function (data, type) {
                if (type == 1) {
                    var func_1 = document["_cameraMoveToTarget_"];
                    if (func_1 != null)
                        func_1(data);
                }
                var func = document["_selectTarget_"];
                if (func != null)
                    func(data);
            };
            Main.prototype.isClosed = function () {
                return false;
            };
            return Main;
        }());
        Main = __decorate([
            gd3d.reflect.editorCode
        ], Main);
        editor.Main = Main;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var PlayDebugMgr = (function () {
            function PlayDebugMgr() {
                this.frameWidth = 100;
                this.frameHeight = 100;
                this.scale = 5;
                this.isinitDebugTool = false;
                this._bePlay = false;
                this._bePause = false;
                this._beStepForward = false;
                this.resetCamera = false;
            }
            PlayDebugMgr.prototype.onStart = function (app) {
                var _this = this;
                this.app = app;
                this.scene = app.getScene();
                this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.init();
                    }
                });
            };
            PlayDebugMgr.prototype.init = function () {
                var _this = this;
                document["_selectTarget_"] = function (target) {
                    _this.selectTarget(target);
                };
                this.showPlayArea(true);
                this.bePlay = true;
                this.bePause = false;
            };
            PlayDebugMgr.prototype.initDebugTool = function () {
                if (this.scene.renderCameras[0] && !this.isinitDebugTool) {
                    this.isinitDebugTool = true;
                    this.debugTool = new editor.DebugTool(this.app, this.scene.renderCameras[0], function (trans) {
                        var func = document["_clickFunc_"];
                        if (func)
                            func(trans);
                    });
                }
            };
            Object.defineProperty(PlayDebugMgr.prototype, "bePlay", {
                get: function () {
                    return this._bePlay;
                },
                set: function (value) {
                    this._bePlay = value;
                    this.app.bePlay = this._bePlay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayDebugMgr.prototype, "bePause", {
                get: function () {
                    return this._bePause;
                },
                set: function (value) {
                    this._bePause = value;
                    if (this._bePause) {
                        this.divPause.style.backgroundColor = "#0099FF";
                    }
                    else {
                        this.divPause.style.backgroundColor = "#FFFFFF";
                    }
                    this.app.bePause = this._bePause;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayDebugMgr.prototype, "beStepForward", {
                get: function () {
                    return this._beStepForward;
                },
                set: function (value) {
                    this._beStepForward = value;
                    if (this._beStepForward) {
                        this.divStepForward.style.backgroundColor = "#0099FF";
                    }
                    else {
                        this.divStepForward.style.backgroundColor = "#FFFFFF";
                    }
                    this.app.beStepForward = this._beStepForward;
                },
                enumerable: true,
                configurable: true
            });
            PlayDebugMgr.prototype.showPlayArea = function (show) {
                var _this = this;
                if (this.divPause == undefined)
                    this.divPause = document.getElementById("editorpause");
                if (this.divStepForward == undefined)
                    this.divStepForward = document.getElementById("editorstempforward");
                if (show) {
                    document.getElementById("playarea").hidden = false;
                    this.divPause.style.backgroundColor = "#FFFFFF";
                    this.divStepForward.style.backgroundColor = "#FFFFFF";
                }
                else {
                    document.getElementById("playarea").hidden = true;
                    return;
                }
                this.divPause.onclick = function () {
                    if (!_this.bePlay)
                        return;
                    _this.bePause = !_this.bePause;
                    if (_this.bePause) {
                    }
                    else {
                        _this.beStepForward = false;
                        _this.app.beStepNumber = 0;
                    }
                };
                this.divStepForward.onclick = function () {
                    if (!_this.bePlay)
                        return;
                    _this.bePause = true;
                    _this.beStepForward = true;
                    _this.app.beStepNumber++;
                };
            };
            PlayDebugMgr.prototype.onUpdate = function (delta) {
                this.initDebugTool();
                if (this.debugTool) {
                    if (this.app.bePause) {
                        this.debugTool.update(delta);
                    }
                    else {
                        this.debugTool.axisObj.setTarget(null);
                        this.debugTool.update(delta);
                    }
                }
            };
            PlayDebugMgr.prototype.selectTarget = function (target) {
                if (!this.debugTool)
                    return;
                this.debugTool.axisObj.setTarget(target);
                if (target instanceof gd3d.framework.transform && target.gameObject.camera != null) {
                    this.debugTool.cameraEdit.tartgetCamera = target.gameObject.camera;
                }
                else {
                    this.debugTool.cameraEdit.tartgetCamera = null;
                }
            };
            PlayDebugMgr.prototype.isClosed = function () {
                return false;
            };
            return PlayDebugMgr;
        }());
        editor.PlayDebugMgr = PlayDebugMgr;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Profiler = (function () {
            function Profiler(app, panel) {
                this.timer = 0;
                this.timespace = 2;
                this.app = app;
                this.panel = panel;
                this.list = new lighttool.htmlui.listBox(this.panel.divContent);
                this.refreshData();
            }
            Profiler.prototype.refreshData = function () {
                this.list.clear();
                var assetmgr = this.app.getAssetMgr();
                var mapins = assetmgr.getAssetsRefcount();
                for (var k in mapins) {
                    var btyeslen = assetmgr.getAssetByName(k).caclByteLength();
                    this.list.addLine(k + ": " + mapins[k].toString() + "  " + btyeslen + "  " + this.getPrintSize(btyeslen));
                }
            };
            Profiler.prototype.onUpdate = function (delta) {
                this.timer += delta;
                if (this.timer > this.timespace) {
                    this.refreshData();
                    this.timer = 0;
                }
            };
            Profiler.prototype.getPrintSize = function (size) {
                if (size < 1024) {
                    return size + "B";
                }
                else {
                    size = size / 1024;
                }
                if (size < 1024) {
                    return size + "KB";
                }
                else {
                    size = size / 1024;
                }
                if (size < 1024) {
                    return size + "MB";
                }
                else {
                    size = size / 1024;
                    return size + "GB";
                }
            };
            return Profiler;
        }());
        editor.Profiler = Profiler;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var SceneEditorMgr = (function () {
            function SceneEditorMgr(main) {
                this.timer = 0;
                this.main = main;
                this.taskManager = new gd3d.framework.taskMgr();
            }
            SceneEditorMgr.prototype.onStart = function (app) {
                this.app = app;
                this.scene = this.app.getScene();
                this.taskManager.addTaskCall(this.loadShader.bind(this));
                this.taskManager.addTaskCall(this.loadAssetBundle.bind(this));
                this.taskManager.addTaskCall(this.loadScene.bind(this));
                this.taskManager.addTaskCall(this.loadPrefab.bind(this));
            };
            SceneEditorMgr.prototype.loadShader = function (lastState, state) {
                this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                    if (s1.isfinish) {
                        state.finish = true;
                    }
                });
            };
            SceneEditorMgr.prototype.loadAssetBundle = function (lastState, state) {
                if (gd3d.editor.assetbundleName != null && gd3d.editor.assetbundleName.length > 0) {
                    this.app.getAssetMgr().load(gd3d.editor.assetbundleName, gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                        if (s1.isfinish) {
                            state.finish = true;
                        }
                    });
                }
                else {
                    state.finish = true;
                }
            };
            SceneEditorMgr.prototype.loadScene = function (lastState, state) {
                if (gd3d.editor.sceneName != null) {
                    this.app.getAssetMgr().loadScene(gd3d.editor.sceneName, function () {
                        state.finish = true;
                    });
                }
                else {
                    state.finish = true;
                }
            };
            SceneEditorMgr.prototype.loadPrefab = function (lastState, state) {
                if (gd3d.editor.prefabName != null && gd3d.editor.prefabName.length > 0) {
                    var _prefab = this.app.getAssetMgr().getAssetByName(gd3d.editor.prefabName);
                    var _trans = _prefab.getCloneTrans();
                    this.scene.addChild(_trans);
                    _trans.markDirty();
                    state.finish = true;
                }
                else {
                    state.finish = true;
                }
            };
            SceneEditorMgr.prototype.onUpdate = function (delta) {
                this.timer += delta * 15;
                this.taskManager.move(delta);
            };
            SceneEditorMgr.prototype._testCamera = function () {
                var cam = new gd3d.framework.transform();
                this.scene.addChild(cam);
                var camera = cam.gameObject.addComponent("camera");
                camera.near = 0.01;
                camera.far = 30;
                cam.localTranslate = new gd3d.math.vector3(0, 10, -10);
                gd3d.math.quatFromEulerAngles(45, 0, 0, cam.localRotate);
                cam.markDirty();
            };
            SceneEditorMgr.prototype._testInitOneCube = function () {
                var cube = new gd3d.framework.transform();
                cube.name = "testcube";
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                var mesh = cube.gameObject.addComponent("meshFilter");
                cube.localScale = new gd3d.math.vector3(1, 1, 1);
                gd3d.math.quatFromEulerAngles(45, 45, 0, cube.localRotate);
                cube.localTranslate = new gd3d.math.vector3(10, 0, 0);
                mesh.mesh = (smesh);
                cube.gameObject.addComponent("meshRenderer");
                cube.gameObject.addComponent("boxcollider");
                this.scene.addChild(cube);
                cube.markDirty();
            };
            SceneEditorMgr.prototype._testInitManyCube = function () {
                var _this = this;
                var _loop_1 = function (i) {
                    cube = new gd3d.framework.transform();
                    cube.name = "testcube" + i;
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5 * (i + 1);
                    cube.localTranslate.x = -5 + i;
                    var meshFilter = cube.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER);
                    meshFilter.mesh = (this_1.app.getAssetMgr().getDefaultMesh(gd3d.framework.StringUtil.RESOURCES_MESH_CUBE));
                    var render_1 = cube.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER);
                    sh = this_1.app.getAssetMgr().getShader("color.shader.json");
                    if (sh != null) {
                        render_1.materials = [];
                        render_1.materials.push(new gd3d.framework.material());
                        render_1.materials[0].setShader(sh);
                        this_1.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("zg256.png");
                                render_1.materials[0].setTexture("_MainTex", texture);
                            }
                        });
                        cube.markDirty();
                        this_1.scene.addChild(cube);
                    }
                };
                var this_1 = this, cube, sh;
                for (var i = 0; i < 5; i++) {
                    _loop_1(i);
                }
            };
            SceneEditorMgr.prototype._testOverlay = function () {
                var _this = this;
                var objCam = new gd3d.framework.transform();
                objCam.name = "camera";
                var gameCamera = objCam.gameObject.addComponent("camera");
                gameCamera.order = 1;
                gameCamera.CullingMask = gd3d.framework.CullingMask.ui;
                gameCamera.clearOption_Color = false;
                gameCamera.clearOption_Depth = false;
                gameCamera.near = 5;
                gameCamera.far = 10;
                objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
                gd3d.math.quatFromEulerAngles(0, 0, 0, objCam.localRotate);
                objCam.markDirty();
                for (var i = 0; i < 2; i++) {
                    var o2d = new gd3d.framework.overlay2D();
                    gameCamera.addOverLay(o2d);
                    {
                        var t2d = new gd3d.framework.transform2D();
                        t2d.localTranslate.x = 300;
                        t2d.localTranslate.y = 300;
                        t2d.name = "rawimage2d";
                        t2d.width = 60;
                        t2d.height = 60;
                        t2d.pivot.x = 0.3;
                        t2d.pivot.y = 0.3;
                        t2d.markDirty();
                        var raw = t2d.addComponent("rawImage2D");
                        o2d.addChild(t2d);
                    }
                    var tima = new gd3d.framework.transform2D();
                    tima.name = "ima2d_0";
                    tima.pivot.x = 0.5;
                    tima.width = 100;
                    tima.height = 100;
                    var ima = tima.addComponent("image2D");
                    tima.localTranslate.x = 300;
                    o2d.addChild(tima);
                    this.app.getAssetMgr().load("res/1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                        if (s.isfinish) {
                            _this.app.getAssetMgr().load("res/resources/1.atlas.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
                                var atlas = _this.app.getAssetMgr().getAssetByName("1.atlas.json");
                                ima.sprite = atlas.sprites["card_role_1_face"];
                                ima.sprite.border = new gd3d.math.border(10, 10, 10, 10);
                                raw.image = atlas.texture;
                            });
                        }
                    });
                    var lab = new gd3d.framework.transform2D();
                    lab.name = "lab111";
                    lab.width = 150;
                    lab.height = 50;
                    lab.pivot.x = 0;
                    lab.pivot.y = 0;
                    lab.markDirty();
                    var label = lab.addComponent("label");
                    label.text = "我好晕！";
                    label.fontsize = 25;
                    label.color = new gd3d.math.color(1, 0, 0, 1);
                    o2d.addChild(lab);
                    this.app.getAssetMgr().load("res/STXINGKA.TTF.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                        if (s.isfinish) {
                            _this.app.getAssetMgr().load("res/resources/STXINGKA.font.json", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                                label.font = _this.app.getAssetMgr().getAssetByName("STXINGKA.font.json");
                            });
                        }
                    });
                }
                var c2d = objCam.gameObject.addComponent("canvasRenderer");
                var t2d = new gd3d.framework.transform2D();
                t2d.width = 400;
                t2d.height = 400;
                t2d.pivot.x = 0.2;
                t2d.pivot.y = 0.2;
                t2d.markDirty();
                var img = t2d.addComponent("rawImage2D");
                img.image = this.app.getAssetMgr().getDefaultTexture("gray");
                c2d.addChild(t2d);
                this.scene.addChild(objCam);
            };
            SceneEditorMgr.prototype._testCanvasRender = function () {
                var t = new gd3d.framework.transform();
                t.name = "fuck";
                t.localScale.x = t.localScale.y = t.localScale.z = 1;
                var c2d = t.gameObject.addComponent("canvasRenderer");
                t.localTranslate.y = 1;
                t.markDirty();
                this.scene.addChild(t);
                {
                    var t2d = new gd3d.framework.transform2D();
                    t2d.width = 400;
                    t2d.height = 400;
                    t2d.pivot.x = 0.2;
                    t2d.pivot.y = 0.2;
                    t2d.markDirty();
                    var img = t2d.addComponent("rawImage2D");
                    img.image = this.app.getAssetMgr().getDefaultTexture("gray");
                    c2d.addChild(t2d);
                }
            };
            SceneEditorMgr.prototype._testButton = function () {
                var _this = this;
                var t = new gd3d.framework.transform();
                t.name = "fuck";
                t.localScale.x = t.localScale.y = t.localScale.z = 1;
                var c2d = t.gameObject.addComponent("canvasRenderer");
                t.localTranslate.y = 1;
                this.scene.addChild(t);
                var t2d_9 = new gd3d.framework.transform2D();
                t2d_9.width = 150;
                t2d_9.height = 50;
                t2d_9.pivot.x = 0;
                t2d_9.pivot.y = 0;
                t2d_9.localTranslate.x = 150;
                t2d_9.localTranslate.y = 300;
                var btn = t2d_9.addComponent("button");
                var img9 = t2d_9.addComponent("image2D");
                img9.imageType = gd3d.framework.ImageType.Sliced;
                btn.targetImage = img9;
                btn.transition = gd3d.framework.TransitionType.ColorTint;
                btn.onClick.addListener(function () {
                    console.log("按钮点下了");
                });
                this.app.getAssetMgr().load("res/uisprite.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var texture = _this.app.getAssetMgr().getAssetByName("uisprite.png");
                        img9.setTexture(texture, new gd3d.math.border(15, 15, 15, 15));
                    }
                });
                c2d.addChild(t2d_9);
            };
            return SceneEditorMgr;
        }());
        editor.SceneEditorMgr = SceneEditorMgr;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var SceneEnvMgr = (function () {
            function SceneEnvMgr() {
                this.frameWidth = 100;
                this.frameHeight = 100;
                this.scale = 5;
                this.resetCamera = false;
            }
            SceneEnvMgr.prototype.onStart = function (app) {
                var _this = this;
                this.app = app;
                this.scene = app.getScene();
                this.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.init();
                    }
                });
            };
            SceneEnvMgr.prototype.init = function () {
                var _this = this;
                this.app.bePlay = false;
                this.app.bePause = false;
                if (this.sceneEditorCamera == null) {
                    var objCam = new gd3d.framework.transform();
                    objCam.name = "______EditorCamera";
                    objCam.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
                    this.scene.addChild(objCam);
                    this.sceneEditorCamera = objCam.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_CAMERA);
                    this.sceneEditorCamera.near = 0.01;
                    this.sceneEditorCamera.far = 2000;
                    this.sceneEditorCamera.CullingMask = gd3d.framework.CullingMask.everything;
                    objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
                    objCam.markDirty();
                    this.sceneEditorCamera.gameObject.transform.lookat(this.scene.getRoot());
                    this.sceneEditorCamera.gameObject.transform.markDirty();
                    this.sceneEditorCamera.gameObject.transform.updateWorldTran();
                    editor.EditorCameraController.instance().init(this.app, this.sceneEditorCamera);
                }
                this.sceneFrame = this.initSceneFrame();
                this.debugTool = new editor.DebugTool(this.app, this.sceneEditorCamera, function (trans) {
                    var func = document["_clickFunc_"];
                    if (func)
                        func(trans);
                });
                document["_cameraMoveToTarget_"] = function (trans) {
                    _this.cameraMoveToTarget(trans);
                };
                document["_selectTarget_"] = function (target) {
                    _this.selectTarget(target);
                };
            };
            SceneEnvMgr.prototype.onUpdate = function (delta) {
                if (this.debugTool)
                    this.debugTool.update(delta);
                if (editor.EditorCameraController.instance().isInit) {
                    editor.EditorCameraController.instance().update(delta);
                }
                if (this.app.be2dstate) {
                    this.sceneEditorCamera.near = 0;
                    this.sceneEditorCamera.opvalue = 0;
                    this.sceneEditorCamera.gameObject.transform.localTranslate = new gd3d.math.vector3(0, 10, -10);
                    gd3d.math.quatReset(this.sceneEditorCamera.gameObject.transform.localRotate);
                    this.sceneEditorCamera.gameObject.transform.markDirty();
                    this.resetCamera = true;
                }
                else {
                    if (this.resetCamera) {
                        this.sceneEditorCamera.near = 0.01;
                        this.sceneEditorCamera.opvalue = 1;
                        this.sceneEditorCamera.gameObject.transform.lookat(this.scene.getRoot());
                        this.sceneEditorCamera.gameObject.transform.markDirty();
                        this.sceneEditorCamera.gameObject.transform.updateTran(false);
                        this.debugTool.mouseUICtr.SetOverLayVisiable(false);
                        gd3d.math.quatToEulerAngles(this.sceneEditorCamera.gameObject.transform.localRotate, editor.EditorCameraController.instance().rotAngle);
                        this.resetCamera = false;
                    }
                }
            };
            SceneEnvMgr.prototype.initSceneFrame = function () {
                var _mesh = new gd3d.framework.mesh();
                var data = new gd3d.render.meshData();
                _mesh.data = data;
                data.pos = [];
                data.trisindex = [];
                data.color = [];
                for (var i = 0; i <= this.frameWidth; i++) {
                    for (var j = 0; j <= this.frameHeight; j++) {
                        data.pos.push(new gd3d.math.vector3((i - this.frameWidth / 2) * this.scale, 0, (j - this.frameHeight / 2) * this.scale));
                    }
                }
                for (var i = 0; i < data.pos.length; i++) {
                    data.color.push(new gd3d.math.color(0.2, 0.2, 0.2, 0.5));
                }
                for (var i = 0; i <= this.frameWidth; i++) {
                    data.trisindex.push(i);
                    data.trisindex.push(i + this.frameHeight * (this.frameWidth + 1));
                }
                for (var i = 0; i <= this.frameHeight; i++) {
                    data.trisindex.push(i * (this.frameWidth + 1));
                    data.trisindex.push(i * (this.frameWidth + 1) + this.frameWidth);
                }
                var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color;
                var vbo32 = _mesh.data.genVertexDataArray(vf);
                var ibo16 = new Uint16Array(data.trisindex);
                var webgl = this.scene.webgl;
                _mesh.glMesh = new gd3d.render.glMesh();
                _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
                _mesh.glMesh.uploadVertexSubData(webgl, vbo32);
                _mesh.glMesh.addIndex(webgl, ibo16.length);
                _mesh.glMesh.uploadIndexSubData(webgl, 0, ibo16);
                _mesh.submesh = [];
                {
                    var sm = new gd3d.framework.subMeshInfo();
                    sm.matIndex = 0;
                    sm.useVertexIndex = 0;
                    sm.start = 0;
                    sm.size = ibo16.length;
                    sm.line = true;
                    _mesh.submesh.push(sm);
                }
                var trans = new gd3d.framework.transform();
                trans.name = "______EditorFrame";
                trans.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
                var filter = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER);
                filter.mesh = (_mesh);
                var render = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER);
                var material = new gd3d.framework.material();
                material.setShader(this.app.getAssetMgr().getShader("line.shader.json"));
                render.materials = [];
                render.materials.push(material);
                render.renderLayer = gd3d.framework.CullingMask.editor;
                this.scene.addChild(trans);
                editor.EditorCameraController.instance().lookat(trans);
                trans.markDirty();
                return trans;
            };
            SceneEnvMgr.prototype.cameraMoveToTarget = function (target) {
                this.sceneEditorCamera.gameObject.transform.lookat(target);
                this.sceneEditorCamera.gameObject.transform.markDirty();
                this.sceneEditorCamera.gameObject.transform.updateTran(false);
                gd3d.math.quatToEulerAngles(this.sceneEditorCamera.gameObject.transform.localRotate, editor.EditorCameraController.instance().rotAngle);
                this.selectTarget(target);
            };
            SceneEnvMgr.prototype.selectTarget = function (target) {
                this.debugTool.axisObj.setTarget(target);
                if (target instanceof gd3d.framework.transform && target.gameObject.camera != null) {
                    this.debugTool.cameraEdit.tartgetCamera = target.gameObject.camera;
                    this.app.curcameraindex = target.gameObject.camera.index;
                }
                else {
                    this.debugTool.cameraEdit.tartgetCamera = null;
                }
            };
            SceneEnvMgr.prototype.isClosed = function () {
                return false;
            };
            return SceneEnvMgr;
        }());
        editor.SceneEnvMgr = SceneEnvMgr;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        function getQueryStringByName(name) {
            var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]*)", "i"));
            if (result == null || result.length < 1) {
                return null;
            }
            return result[1];
        }
        editor.getQueryStringByName = getQueryStringByName;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
window.onload = function () {
    requestAnimationFrame(function () {
        gd3d.jsLoader.instance().addImportScript("lib/Reflect.js");
        gd3d.jsLoader.instance().addImportScript("lib/gd3d.js");
        gd3d.jsLoader.instance().addImportScript("lib_launcher/editor.js");
        gd3d.jsLoader.instance().addImportScript("lib_launcher/plugin.js");
        gd3d.jsLoader.instance().addImportScript("lib_launcher/localsave.js");
        gd3d.jsLoader.instance().addImportScript("lib_launcher/htmlui.js");
        gd3d.jsLoader.instance().addImportScript("lib_user/app.js");
        gd3d.jsLoader.instance().preload(function () {
            gd3d.editor.edit = document["_editor_"];
            gd3d.editor.title = document["_divtitle_"];
            gd3d.editor.type = gd3d.editor.getQueryStringByName("type");
            gd3d.editor.edit.setMode(2);
            if (gd3d.editor.type == "0") {
                gd3d.editor.assetbundleName = gd3d.editor.getQueryStringByName("assetBundleName");
                gd3d.editor.sceneName = gd3d.editor.getQueryStringByName("sceneName");
                gd3d.editor.prefabName = gd3d.editor.getQueryStringByName("prefabName");
                gd3d.editor.effectName = gd3d.editor.getQueryStringByName("effectName");
                var div = document.getElementById("scenePanel");
                gd3d.editor.gdApp = new gd3d.framework.application();
                gd3d.editor.gdApp.start(div);
                gd3d.editor.gdApp.showFps();
                var main = new gd3d.editor.Main();
                gd3d.editor.gdApp.addEditorCodeDirect(main);
            }
            else if (gd3d.editor.type == "1") {
                var div = document.getElementById("scenePanel");
                gd3d.editor.gdApp = new gd3d.framework.application();
                gd3d.editor.gdApp.start(div);
                gd3d.editor.gdApp.showFps();
                gd3d.editor.gdApp.addUserCode("main");
                var main = new gd3d.editor.Main();
                gd3d.editor.gdApp.addEditorCodeDirect(main);
            }
        });
        var fun;
        document.onkeydown = function (e) {
            if (e.ctrlKey && e.keyCode == 83) {
                fun = document["_sceneeditorctrls"];
                if (fun != null)
                    fun(e);
                return false;
            }
            if (e.keyCode == 46) {
                fun = document["_deletenode_"];
                if (fun != null)
                    fun();
                return false;
            }
            if (e.keyCode == 116) {
                console.log("screenmgr-F5");
                gd3d.editor.edit.refreshWindows();
                e.preventDefault();
            }
        };
        document.oncontextmenu = function (ev) {
            for (var key in gd3d.editor.edit.onContextMenuFuncs) {
                gd3d.editor.edit.onContextMenuFuncs[key](ev, 2);
            }
        };
        document.addEventListener("click", function (ev) {
            for (var key in gd3d.editor.edit.onClickFuncs) {
                gd3d.editor.edit.onClickFuncs[key](ev, 2);
            }
        });
    });
};
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var DebugTool = (function () {
            function DebugTool(_app, _mainCam, clickFunc) {
                var _this = this;
                this.mainCam = _mainCam;
                this.clickFunc = clickFunc;
                this.scene = this.mainCam.gameObject.getScene();
                this.app = _app;
                this.scene.app.getAssetMgr().load("res/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                    if (_state.isfinish) {
                        _this.axisObj = new AxisObject(_app, _this.mainCam, _this);
                        _this.mouseUICtr = new UIMouseCTR(_app, _mainCam, _this);
                        _this.cameraEdit = new cameraEdit(_app, _mainCam, _this);
                        _this.inited = true;
                    }
                });
            }
            DebugTool.prototype.update = function (delta) {
                if (this.inited) {
                    this.axisObj.update(delta);
                    this.mouseUICtr.update(delta);
                    this.cameraEdit.update();
                }
            };
            return DebugTool;
        }());
        editor.DebugTool = DebugTool;
        var DebugModel;
        (function (DebugModel) {
            DebugModel[DebugModel["null"] = 0] = "null";
            DebugModel[DebugModel["translate"] = 1] = "translate";
            DebugModel[DebugModel["rotation"] = 2] = "rotation";
            DebugModel[DebugModel["scale"] = 3] = "scale";
        })(DebugModel || (DebugModel = {}));
        var SelectModel;
        (function (SelectModel) {
            SelectModel[SelectModel["null"] = 0] = "null";
            SelectModel[SelectModel["Axis_X"] = 1] = "Axis_X";
            SelectModel[SelectModel["Axis_Y"] = 2] = "Axis_Y";
            SelectModel[SelectModel["Axis_Z"] = 3] = "Axis_Z";
        })(SelectModel || (SelectModel = {}));
        var AxisObject = (function () {
            function AxisObject(_app, _mainCam, _debugTool) {
                this.anisSize = 1;
                this.debugMode = DebugModel.null;
                this.selectMode = SelectModel.null;
                this.pointLeftDown = false;
                this.pointRightDown = false;
                this.mousePosInScreen = new gd3d.math.vector2();
                this.contrastDir = new gd3d.math.vector2();
                this.offset = new gd3d.math.vector3();
                this.MouseStartPoint = new gd3d.math.vector3();
                this.targetStartPoint = new gd3d.math.vector3();
                this.targetStartScale = new gd3d.math.vector3();
                this.targetStartRotate = new gd3d.math.quaternion();
                this.app = _app;
                this.inputMgr = this.app.getInputMgr();
                this.mainCam = _mainCam;
                this.scene = this.mainCam.gameObject.getScene();
                this.debugTool = _debugTool;
                this._tran = new gd3d.framework.transform();
                this._tran.localScale.x = this._tran.localScale.y = this._tran.localScale.z = 1;
                this._pyr = new gd3d.framework.transform();
                this._line = new gd3d.framework.transform();
                this._box = new gd3d.framework.transform();
                this._circle = new gd3d.framework.transform();
                this._pyr.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                this._line.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                this._box.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                this._circle.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                this._tran.name = "axisObject";
                var sh = this.app.getAssetMgr().getShader("materialcolor.shader.json");
                var pyramidmesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
                var cubemesh = this.app.getAssetMgr().getDefaultMesh("cube");
                var circlemesh = this.app.getAssetMgr().getDefaultMesh("circleline");
                {
                    this._pyrX = new gd3d.framework.transform();
                    this._pyrX.name = "_pyrX";
                    var mesh = this._pyrX.gameObject.addComponent("meshFilter");
                    this._pyrX.gameObject.addComponent("meshcollider");
                    this._pyrX.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (pyramidmesh);
                    var renderer = this._pyrX.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(1, 0, 0, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, -90, this._pyrX.localRotate);
                    this._pyrX.localScale.x = this._pyrX.localScale.y = this._pyrX.localScale.z = 0.2;
                    this._pyrX.localTranslate.x = 1;
                    this._pyr.addChild(this._pyrX);
                    this._pyrY = new gd3d.framework.transform();
                    this._pyrY.name = "_pyrY";
                    var mesh = this._pyrY.gameObject.addComponent("meshFilter");
                    this._pyrY.gameObject.addComponent("meshcollider");
                    this._pyrY.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (pyramidmesh);
                    var renderer = this._pyrY.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 1, 0, 1));
                    this._pyrY.localScale.x = this._pyrY.localScale.y = this._pyrY.localScale.z = 0.2;
                    this._pyrY.localTranslate.y = 1;
                    this._pyr.addChild(this._pyrY);
                    this._pyrZ = new gd3d.framework.transform();
                    this._pyrZ.name = "_pyrZ";
                    var mesh = this._pyrZ.gameObject.addComponent("meshFilter");
                    this._pyrZ.gameObject.addComponent("meshcollider");
                    this._pyrZ.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (pyramidmesh);
                    var renderer = this._pyrZ.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 0, 1, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_right, 90, this._pyrZ.localRotate);
                    this._pyrZ.localScale.x = this._pyrZ.localScale.y = this._pyrZ.localScale.z = 0.2;
                    this._pyrZ.localTranslate.z = 1;
                    this._pyr.addChild(this._pyrZ);
                }
                {
                    this._boxX = new gd3d.framework.transform();
                    this._boxX.name = "_boxX";
                    var mesh = this._boxX.gameObject.addComponent("meshFilter");
                    this._boxX.gameObject.addComponent("meshcollider");
                    this._boxX.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._boxX.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(1, 0, 0, 1));
                    this._boxX.localScale.x = this._boxX.localScale.y = this._boxX.localScale.z = 0.2;
                    this._boxX.localTranslate.x = 1;
                    this._box.addChild(this._boxX);
                    this._boxY = new gd3d.framework.transform();
                    this._boxY.name = "_boxY";
                    var mesh = this._boxY.gameObject.addComponent("meshFilter");
                    this._boxY.gameObject.addComponent("meshcollider");
                    this._boxY.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._boxY.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 1, 0, 1));
                    this._boxY.localScale.x = this._boxY.localScale.y = this._boxY.localScale.z = 0.2;
                    this._boxY.localTranslate.y = 1;
                    this._box.addChild(this._boxY);
                    this._boxZ = new gd3d.framework.transform();
                    this._boxZ.name = "_boxZ";
                    var mesh = this._boxZ.gameObject.addComponent("meshFilter");
                    this._boxZ.gameObject.addComponent("meshcollider");
                    this._boxZ.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._boxZ.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 0, 1, 1));
                    this._boxZ.localScale.x = this._boxZ.localScale.y = this._boxZ.localScale.z = 0.2;
                    this._boxZ.localTranslate.z = 1;
                    this._box.addChild(this._boxZ);
                }
                {
                    this._lineX = new gd3d.framework.transform();
                    this._lineX.name = "_lineX";
                    var mesh = this._lineX.gameObject.addComponent("meshFilter");
                    this._lineX.gameObject.addComponent("meshcollider");
                    this._lineX.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._lineX.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(1, 0, 0, 1));
                    this._lineX.localScale.x = 1;
                    this._lineX.localScale.y = this._lineX.localScale.z = 0.01;
                    this._lineX.localTranslate.x = 0.5;
                    this._line.addChild(this._lineX);
                    this._lineY = new gd3d.framework.transform();
                    this._lineY.name = "_lineY";
                    var mesh = this._lineY.gameObject.addComponent("meshFilter");
                    this._lineY.gameObject.addComponent("meshcollider");
                    this._lineY.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._lineY.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 1, 0, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, -90, this._lineY.localRotate);
                    this._lineY.localScale.x = 1;
                    this._lineY.localScale.y = this._lineY.localScale.z = 0.01;
                    this._lineY.localTranslate.y = 0.5;
                    this._line.addChild(this._lineY);
                    this._lineZ = new gd3d.framework.transform();
                    this._lineZ.name = "_lineZ";
                    var mesh = this._lineZ.gameObject.addComponent("meshFilter");
                    this._lineZ.gameObject.addComponent("meshcollider");
                    this._lineZ.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (cubemesh);
                    var renderer = this._lineZ.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 0, 1, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, 90, this._lineZ.localRotate);
                    this._lineZ.localScale.x = 1;
                    this._lineZ.localScale.y = this._lineZ.localScale.z = 0.01;
                    this._lineZ.localTranslate.z = 0.5;
                    this._line.addChild(this._lineZ);
                }
                {
                    this._circleX = new gd3d.framework.transform();
                    this._circleX.name = "_circleX";
                    var mesh = this._circleX.gameObject.addComponent("meshFilter");
                    this._circleX.gameObject.addComponent("meshcollider");
                    this._circleX.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (circlemesh);
                    var renderer = this._circleX.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(1, 0, 0, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, 90, this._circleX.localRotate);
                    this._circleX.localScale.x = 1;
                    this._circleX.localScale.y = this._circleX.localScale.z = 1;
                    this._circle.addChild(this._circleX);
                    this._circleY = new gd3d.framework.transform();
                    this._circleY.name = "_circleY";
                    var mesh = this._circleY.gameObject.addComponent("meshFilter");
                    this._circleY.gameObject.addComponent("meshcollider");
                    this._circleY.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (circlemesh);
                    var renderer = this._circleY.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 1, 0, 1));
                    this._circleY.localScale.x = 1;
                    this._circleY.localScale.y = this._circleY.localScale.z = 1;
                    this._circle.addChild(this._circleY);
                    this._circleZ = new gd3d.framework.transform();
                    this._circleZ.name = "_circleZ";
                    var mesh = this._circleZ.gameObject.addComponent("meshFilter");
                    this._circleZ.gameObject.addComponent("meshcollider");
                    this._circleZ.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    mesh.mesh = (circlemesh);
                    var renderer = this._circleZ.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    renderer.materials.push(new gd3d.framework.material());
                    renderer.materials[0].setShader(sh);
                    renderer.materials[0].setVector4("_Color", new gd3d.math.vector4(0, 0, 1, 1));
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_right, 90, this._circleZ.localRotate);
                    this._circleZ.localScale.x = 1;
                    this._circleZ.localScale.y = this._circleZ.localScale.z = 1;
                    this._circle.addChild(this._circleZ);
                }
                this._tran.addChild(this._box);
                this._tran.addChild(this._line);
                this._tran.addChild(this._pyr);
                this._tran.addChild(this._circle);
                this._tran.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                this._tran.gameObject.visible = false;
                this._tran.markDirty();
                this.scene.addChild(this._tran);
                this.setDebugModel(DebugModel.translate);
                this.attachControll();
            }
            Object.defineProperty(AxisObject.prototype, "tran", {
                get: function () {
                    return this._tran;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AxisObject.prototype, "target", {
                get: function () {
                    return this._target;
                },
                set: function (tar) {
                    this._target = tar;
                    if (this.target instanceof gd3d.framework.transform2D) {
                        this.tempTran2Parent = this.target.canvas.parentTrans;
                    }
                },
                enumerable: true,
                configurable: true
            });
            AxisObject.prototype.setTarget = function (target) {
                if (target == null) {
                    this.target = null;
                    return;
                }
                if (target instanceof gd3d.framework.transform) {
                    this.target = target;
                }
                else if (target instanceof gd3d.framework.transform2D) {
                    if (target.canvas == null || target.canvas.is2dUI) {
                        this.target = null;
                    }
                    else {
                        this.target = target;
                    }
                }
            };
            AxisObject.prototype.attachControll = function () {
                var _this = this;
                document.addEventListener("mousedown", function (e) { _this.pointDownEvent(e); });
                document.addEventListener("mousemove", function (e) { _this.pointHoldEvent(e); });
                document.addEventListener("mouseup", function (e) { _this.pointUpEvent(e); });
                document.addEventListener("keydown", function (e) { _this.keyDownEvent(e); });
            };
            AxisObject.prototype.update = function (delta) {
                if (this.target) {
                    this._tran.gameObject.visible = true;
                    if (this.target instanceof gd3d.framework.transform) {
                        gd3d.math.vec3Clone(this.target.getWorldTranslate(), this._tran.localTranslate);
                        gd3d.math.quatClone(this.target.getWorldRotate(), this._tran.localRotate);
                    }
                    else if (this.target instanceof gd3d.framework.transform2D) {
                        this._tran.localTranslate.x = this.target.getWorldTranslate().x;
                        this._tran.localTranslate.y = this.target.getWorldTranslate().y;
                        this._tran.localTranslate.z = 0;
                        this.tempTran2Parent = this.target.canvas.parentTrans;
                        if (this.tempTran2Parent != null) {
                            gd3d.math.matrixTransformVector3(this._tran.localTranslate, this.tempTran2Parent.getWorldMatrix(), this._tran.localTranslate);
                        }
                        gd3d.math.quatReset(this._tran.localRotate);
                    }
                    this._tran.markDirty();
                }
                else {
                    this._tran.gameObject.visible = false;
                }
                if (this._tran.gameObject.visible) {
                    var distance = gd3d.math.vec3Distance(this._tran.getWorldTranslate(), this.mainCam.gameObject.transform.getWorldTranslate());
                    this._tran.localScale.x = distance * 0.1;
                    this._tran.localScale.y = distance * 0.1;
                    this._tran.localScale.z = distance * 0.1;
                }
            };
            AxisObject.prototype.intersectionWith2Line = function (p1, d1, p2, d2) {
                var tvec = gd3d.math.pool.new_vector3();
                var tvec1 = gd3d.math.pool.new_vector3();
                gd3d.math.vec3Cross(d1, d2, tvec);
                gd3d.math.vec3Cross(d1, tvec, tvec1);
                gd3d.math.vec3Normalize(tvec1, tvec1);
                var ray1 = new gd3d.framework.ray(p2, d2);
                var result = ray1.intersectPlane(p1, tvec1);
                gd3d.math.pool.delete_vector3(tvec1);
                gd3d.math.pool.delete_vector3(tvec);
                return result;
            };
            AxisObject.prototype.isPickAxis = function (ray) {
                if (this.debugMode != DebugModel.rotation) {
                    if (ray.intersectCollider(this._pyrX) || ray.intersectCollider(this._lineX) || ray.intersectCollider(this._boxX)) {
                        this.selectMode = SelectModel.Axis_X;
                        return true;
                    }
                    else if (ray.intersectCollider(this._pyrY) || ray.intersectCollider(this._lineY) || ray.intersectCollider(this._boxY)) {
                        this.selectMode = SelectModel.Axis_Y;
                        return true;
                    }
                    else if (ray.intersectCollider(this._pyrZ) || ray.intersectCollider(this._lineZ) || ray.intersectCollider(this._boxZ)) {
                        this.selectMode = SelectModel.Axis_Z;
                        return true;
                    }
                    else {
                        this.selectMode = SelectModel.null;
                        return false;
                    }
                }
                else if (this.debugMode == DebugModel.rotation) {
                    if (ray.intersectCollider(this._circleX)) {
                        this.selectMode = SelectModel.Axis_X;
                        return true;
                    }
                    else if (ray.intersectCollider(this._circleY)) {
                        this.selectMode = SelectModel.Axis_Y;
                        return true;
                    }
                    else if (ray.intersectCollider(this._circleZ)) {
                        this.selectMode = SelectModel.Axis_Z;
                        return true;
                    }
                    else {
                        this.selectMode = SelectModel.null;
                        return false;
                    }
                }
                return false;
            };
            AxisObject.prototype.pointDownEvent = function (e) {
                if (e.button == 0) {
                    this.pointLeftDown = true;
                    var ray = this.mainCam.creatRayByScreen(new gd3d.math.vector2(e.x, e.y), this.app);
                    if (this.isPickAxis(ray)) {
                        if (this.target == null)
                            return;
                        if (this.target instanceof gd3d.framework.transform) {
                            if (this.debugMode == DebugModel.translate || this.debugMode == DebugModel.scale) {
                                var dir = gd3d.math.pool.new_vector3();
                                if (this.selectMode == SelectModel.Axis_X) {
                                    gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_right, this.target.getWorldMatrix(), dir);
                                }
                                else if (this.selectMode == SelectModel.Axis_Y) {
                                    gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_up, this.target.getWorldMatrix(), dir);
                                }
                                else if (this.selectMode == SelectModel.Axis_Z) {
                                    gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_forward, this.target.getWorldMatrix(), dir);
                                }
                                var ori = gd3d.math.pool.new_vector3();
                                gd3d.math.vec3Clone(this.target.getWorldTranslate(), ori);
                                var t = this.intersectionWith2Line(ray.origin, ray.direction, ori, dir);
                                if (t != null) {
                                    gd3d.math.vec3Clone(t, this.MouseStartPoint);
                                    if (this.debugMode == DebugModel.translate) {
                                        gd3d.math.vec3Clone(this.target.getWorldTranslate(), this.targetStartPoint);
                                    }
                                    else if (this.debugMode == DebugModel.scale) {
                                        this.targetStartScale = gd3d.math.pool.clone_vector3(this.target.localScale);
                                    }
                                }
                                gd3d.math.pool.delete_vector3(dir);
                                gd3d.math.pool.delete_vector3(ori);
                            }
                            else if (this.debugMode == DebugModel.rotation) {
                                this.mousePosInScreen.x = e.x;
                                this.mousePosInScreen.y = e.y;
                                var matToWorld = this.target.getWorldMatrix();
                                var dirStartInWord = gd3d.math.pool.new_vector3();
                                gd3d.math.vec3Clone(this.target.getWorldTranslate(), dirStartInWord);
                                var dirEndInWord = gd3d.math.pool.new_vector3();
                                if (this.selectMode == SelectModel.Axis_X) {
                                    gd3d.math.matrixTransformVector3(gd3d.math.pool.vector3_right, matToWorld, dirEndInWord);
                                }
                                else if (this.selectMode == SelectModel.Axis_Y) {
                                    gd3d.math.matrixTransformVector3(gd3d.math.pool.vector3_up, matToWorld, dirEndInWord);
                                }
                                else if (this.selectMode == SelectModel.Axis_Z) {
                                    gd3d.math.matrixTransformVector3(gd3d.math.pool.vector3_forward, matToWorld, dirEndInWord);
                                }
                                var dirStartInScreen = gd3d.math.pool.new_vector2();
                                var dirEndInScreen = gd3d.math.pool.new_vector2();
                                this.mainCam.calcScreenPosFromWorldPos(this.app, dirStartInWord, dirStartInScreen);
                                this.mainCam.calcScreenPosFromWorldPos(this.app, dirEndInWord, dirEndInScreen);
                                var temptDir = gd3d.math.pool.new_vector2();
                                gd3d.math.vec2Subtract(dirEndInScreen, dirStartInScreen, temptDir);
                                gd3d.math.vec2Normalize(temptDir, temptDir);
                                this.contrastDir.x = -temptDir.y;
                                this.contrastDir.y = temptDir.x;
                                gd3d.math.quatClone(this.target.localRotate, this.targetStartRotate);
                                gd3d.math.pool.delete_vector3(dirStartInWord);
                                gd3d.math.pool.delete_vector3(dirEndInWord);
                                gd3d.math.pool.delete_vector2(dirStartInScreen);
                                gd3d.math.pool.delete_vector2(dirEndInScreen);
                                gd3d.math.pool.delete_vector2(temptDir);
                            }
                        }
                        else if (this.target instanceof gd3d.framework.transform2D) {
                            if (this.debugMode == DebugModel.translate || this.debugMode == DebugModel.scale) {
                                var dir = gd3d.math.pool.new_vector3();
                                if (this.selectMode == SelectModel.Axis_X) {
                                    dir.x = 1;
                                    dir.y = 0;
                                }
                                else if (this.selectMode == SelectModel.Axis_Y) {
                                    dir.x = 0;
                                    dir.y = 1;
                                }
                                var ori2 = gd3d.math.pool.new_vector2();
                                gd3d.math.vec2Clone(this.target.getWorldTranslate(), ori2);
                                var ori23 = gd3d.math.pool.new_vector3();
                                ori23.x = ori2.x;
                                ori23.y = ori2.y;
                                ori23.z = 0;
                                gd3d.math.matrixTransformVector3(ori23, this.tempTran2Parent.getWorldMatrix(), ori23);
                                var t = this.intersectionWith2Line(ray.origin, ray.direction, ori23, dir);
                                if (t != null) {
                                    this.MouseStartPoint.x = t.x;
                                    this.MouseStartPoint.y = t.y;
                                    this.MouseStartPoint.z = 0;
                                    if (this.debugMode == DebugModel.translate) {
                                        this.targetStartPoint.x = this.target.getWorldTranslate().x;
                                        this.targetStartPoint.y = this.target.getWorldTranslate().y;
                                        this.targetStartPoint.z = 0;
                                        gd3d.math.vec3Subtract(ori23, t, this.offset);
                                    }
                                    else if (this.debugMode == DebugModel.scale) {
                                        this.targetStartScale.x = this.target.localScale.x;
                                        this.targetStartScale.y = this.target.localScale.y;
                                    }
                                }
                                gd3d.math.pool.delete_vector3(dir);
                                gd3d.math.pool.delete_vector2(ori2);
                                gd3d.math.pool.delete_vector3(ori23);
                            }
                        }
                    }
                    else {
                        var pickinfo = this.scene.pick(ray, true);
                        if (pickinfo == null || pickinfo.pickedtran == null) {
                            var tran2d = this.pick2d(ray);
                            if (tran2d != null) {
                                this.target = tran2d;
                                if (this.debugTool.clickFunc != null) {
                                    this.debugTool.clickFunc(this.target);
                                }
                            }
                            else {
                                if (this.target != null) {
                                }
                                this.target = null;
                                if (this.debugTool.clickFunc != null) {
                                    this.debugTool.clickFunc(this.target);
                                }
                            }
                        }
                        else {
                            if (pickinfo.pickedtran.parent != null && pickinfo.pickedtran.parent.name == "editor---camera---frame--??")
                                return;
                            this.target = pickinfo.pickedtran;
                            if (this.debugTool.clickFunc != null) {
                                this.debugTool.clickFunc(this.target);
                            }
                        }
                    }
                }
                else if (e.button == 2) {
                    this.pointRightDown = true;
                }
            };
            AxisObject.prototype.pick2d = function (ray) {
                var tran = this.dopick2d(ray, this.scene.getRoot());
                return tran;
            };
            AxisObject.prototype.dopick2d = function (ray, tran) {
                var canvasRender = tran.gameObject.getComponent("canvasRenderer");
                if (canvasRender != null) {
                    var tran2 = canvasRender.pick2d(ray);
                    if (tran2 != null) {
                        this.tempTran2Parent = tran;
                        return tran2;
                    }
                }
                if (tran.children != null) {
                    for (var i = 0; i < tran.children.length; i++) {
                        var trans2 = this.dopick2d(ray, tran.children[i]);
                        if (trans2 != null)
                            return trans2;
                    }
                }
                return null;
            };
            AxisObject.prototype.pointHoldEvent = function (e) {
                if (this.target == null || !this.pointLeftDown)
                    return;
                if (this.target instanceof gd3d.framework.transform) {
                    if (this.debugMode == DebugModel.translate || this.debugMode == DebugModel.scale) {
                        var ray = this.mainCam.creatRayByScreen(new gd3d.math.vector2(e.x, e.y), this.app);
                        var dir = gd3d.math.pool.new_vector3();
                        if (this.selectMode == SelectModel.Axis_X) {
                            gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_right, this.target.getWorldMatrix(), dir);
                        }
                        else if (this.selectMode == SelectModel.Axis_Y) {
                            gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_up, this.target.getWorldMatrix(), dir);
                        }
                        else if (this.selectMode == SelectModel.Axis_Z) {
                            gd3d.math.matrixTransformNormal(gd3d.math.pool.vector3_forward, this.target.getWorldMatrix(), dir);
                        }
                        var ori = gd3d.math.pool.new_vector3();
                        gd3d.math.vec3Clone(this.target.getWorldTranslate(), ori);
                        var t = this.intersectionWith2Line(ray.origin, ray.direction, ori, dir);
                        var pworld = gd3d.math.pool.new_matrix();
                        if (this.target.parent != null) {
                            gd3d.math.matrixClone(this.target.parent.getWorldMatrix(), pworld);
                        }
                        else {
                            gd3d.math.matrixMakeIdentity(pworld);
                        }
                        var matinv = new gd3d.math.matrix();
                        gd3d.math.matrixInverse(pworld, matinv);
                        if (t != null) {
                            if (this.debugMode == DebugModel.translate) {
                                t.x -= this.MouseStartPoint.x - this.targetStartPoint.x;
                                t.y -= this.MouseStartPoint.y - this.targetStartPoint.y;
                                t.z -= this.MouseStartPoint.z - this.targetStartPoint.z;
                                this.target.setWorldPosition(t);
                            }
                            else if (this.debugMode == DebugModel.scale) {
                                if (this.selectMode == SelectModel.Axis_X) {
                                    this.target.localScale.x = this.targetStartScale.x * (t.x - ori.x) / (this.MouseStartPoint.x - ori.x);
                                }
                                else if (this.selectMode == SelectModel.Axis_Y) {
                                    this.target.localScale.y = this.targetStartScale.y * (t.y - ori.y) / (this.MouseStartPoint.y - ori.y);
                                }
                                else if (this.selectMode == SelectModel.Axis_Z) {
                                    this.target.localScale.z = this.targetStartScale.z * (t.z - ori.z) / (this.MouseStartPoint.z - ori.z);
                                }
                            }
                            this.target.markDirty();
                        }
                        gd3d.math.pool.delete_vector3(dir);
                    }
                    else if (this.debugMode == DebugModel.rotation && this.selectMode != SelectModel.null) {
                        var endScreenPos = gd3d.math.pool.new_vector2();
                        endScreenPos.x = e.x;
                        endScreenPos.y = e.y;
                        var moveDir = gd3d.math.pool.new_vector2();
                        gd3d.math.vec2Subtract(endScreenPos, this.mousePosInScreen, moveDir);
                        var contrastValue = gd3d.math.vec2Multiply(moveDir, this.contrastDir);
                        var RotSpeed = 0.5;
                        var rotAngle = RotSpeed * contrastValue;
                        var localRot = gd3d.math.pool.new_quaternion();
                        if (this.selectMode == SelectModel.Axis_X) {
                            gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_right, rotAngle, localRot);
                        }
                        else if (this.selectMode == SelectModel.Axis_Y) {
                            gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, rotAngle, localRot);
                        }
                        else if (this.selectMode == SelectModel.Axis_Z) {
                            gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, rotAngle, localRot);
                        }
                        gd3d.math.quatMultiply(this.targetStartRotate, localRot, this.target.localRotate);
                        this.target.markDirty();
                        gd3d.math.pool.delete_vector2(endScreenPos);
                        gd3d.math.pool.delete_vector2(moveDir);
                    }
                }
                else if (this.target instanceof gd3d.framework.transform2D) {
                    var ray = this.mainCam.creatRayByScreen(new gd3d.math.vector2(e.x, e.y), this.app);
                    var dir = gd3d.math.pool.new_vector3();
                    if (this.selectMode == SelectModel.Axis_X) {
                        dir.x = 1;
                        dir.y = 0;
                        dir.z = 0;
                    }
                    else if (this.selectMode == SelectModel.Axis_Y) {
                        dir.x = 0;
                        dir.y = 1;
                        dir.z = 0;
                    }
                    var ori2 = gd3d.math.pool.new_vector2();
                    gd3d.math.vec2Clone(this.target.getWorldTranslate(), ori2);
                    var ori23 = gd3d.math.pool.new_vector3();
                    ori23.x = ori2.x;
                    ori23.y = ori2.y;
                    ori23.z = 0;
                    gd3d.math.matrixTransformVector3(ori23, this.tempTran2Parent.getWorldMatrix(), ori23);
                    var t = this.intersectionWith2Line(ray.origin, ray.direction, ori23, dir);
                    if (t != null) {
                        var matinv = gd3d.math.pool.new_matrix();
                        gd3d.math.matrixInverse(this.tempTran2Parent.getWorldMatrix(), matinv);
                        var tt = gd3d.math.pool.new_vector3();
                        gd3d.math.matrixTransformVector3(t, matinv, tt);
                        var pworld = gd3d.math.pool.new_matrix3x2();
                        if (this.target.parent != null) {
                            gd3d.math.matrix3x2Clone(this.target.parent.getWorldMatrix(), pworld);
                        }
                        else {
                            gd3d.math.matrix3x2MakeIdentity(pworld);
                        }
                        var matinv32 = new gd3d.math.matrix3x2();
                        gd3d.math.matrix3x2Inverse(pworld, matinv32);
                        if (this.debugMode == DebugModel.translate) {
                            this.target.setWorldPosition(new gd3d.math.vector2(tt.x + this.offset.x, tt.y + this.offset.y));
                        }
                        else if (this.debugMode == DebugModel.scale) {
                            if (this.selectMode == SelectModel.Axis_X) {
                                this.target.localScale.x = this.targetStartScale.x * (t.x - ori2.x) / (this.MouseStartPoint.x - ori23.x);
                            }
                            else if (this.selectMode == SelectModel.Axis_Y) {
                                this.target.localScale.y = this.targetStartScale.y * (t.y - ori2.y) / (this.MouseStartPoint.y - ori23.y);
                            }
                        }
                        this.target.markDirty();
                    }
                    gd3d.math.pool.delete_vector3(dir);
                    gd3d.math.pool.delete_vector3(ori23);
                    gd3d.math.pool.delete_vector3(tt);
                    gd3d.math.pool.delete_vector2(ori2);
                    gd3d.math.pool.delete_matrix3x2(pworld);
                    gd3d.math.pool.delete_matrix(matinv);
                }
            };
            AxisObject.prototype.pointUpEvent = function (e) {
                if (e.button == 0) {
                    this.pointLeftDown = false;
                }
                else if (e.button == 2) {
                    this.pointRightDown = false;
                }
                this.selectMode = SelectModel.null;
            };
            AxisObject.prototype.keyDownEvent = function (e) {
                if (this.pointLeftDown || this.pointRightDown)
                    return;
                switch (e.keyCode) {
                    case gd3d.framework.NumberUtil.KEY_W:
                        this.setDebugModel(DebugModel.translate);
                        break;
                    case gd3d.framework.NumberUtil.KEY_E:
                        this.setDebugModel(DebugModel.rotation);
                        break;
                    case gd3d.framework.NumberUtil.KEY_R:
                        this.setDebugModel(DebugModel.scale);
                        break;
                }
            };
            AxisObject.prototype.setDebugModel = function (_model) {
                if (this.debugMode == _model)
                    return;
                this.debugMode = _model;
                if (this.debugMode == DebugModel.translate) {
                    this._pyr.gameObject.visible = true;
                    this._box.gameObject.visible = false;
                    this._line.gameObject.visible = true;
                    this._circle.gameObject.visible = false;
                }
                else if (this.debugMode == DebugModel.scale) {
                    this._pyr.gameObject.visible = false;
                    this._box.gameObject.visible = true;
                    this._line.gameObject.visible = true;
                    this._circle.gameObject.visible = false;
                }
                else if (this.debugMode == DebugModel.rotation) {
                    this._pyr.gameObject.visible = false;
                    this._box.gameObject.visible = false;
                    this._line.gameObject.visible = false;
                    this._circle.gameObject.visible = true;
                }
            };
            return AxisObject;
        }());
        editor.AxisObject = AxisObject;
        var UIMouseCTR = (function () {
            function UIMouseCTR(_app, _mainCam, _debugTool) {
                this.lineArr = [];
                this.pointArr = [];
                this.LineWide = 2;
                this.LineHeight = 100;
                this.PointWide = 5;
                this.localTransLate = new gd3d.math.vector2();
                this.pivot = new gd3d.math.vector2();
                this.center = new gd3d.math.vector2();
                this.mouseStartPoint = new gd3d.math.vector2();
                this.mouseEndPoint = new gd3d.math.vector2();
                this.PickedTransStartPoint = new gd3d.math.vector2();
                this.TransGroupStartPos = new gd3d.math.vector2();
                this.pointLeftDown = false;
                this.mapFunc = {};
                this.app = _app;
                this.scene = this.app.getScene();
                this.DebugTool = _debugTool;
                this.initUIFrameData();
                this.attachControll();
            }
            UIMouseCTR.prototype.initUIFrameData = function () {
                var _this = this;
                this.TransGroup = new gd3d.framework.transform2D();
                this.TransGroup.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                var defImaLine = this.app.getAssetMgr().getDefaultTexture("white");
                var defImaPoint = this.app.getAssetMgr().getDefaultTexture("grid");
                this.overLay = new gd3d.framework.overlay2D();
                this.overLay.renderLayer = gd3d.framework.CullingMask.editor;
                this.SetOverLayVisiable(false);
                this._LLine = new gd3d.framework.transform2D();
                this._LLine.name = "LLine";
                this.mapFunc[this._LLine.name] = function () { _this.lLine(); };
                this._RLine = new gd3d.framework.transform2D();
                this._RLine.name = "RLine";
                this.mapFunc[this._RLine.name] = function () { _this.rLine(); };
                this._TLine = new gd3d.framework.transform2D();
                this._TLine.name = "TLine";
                this.mapFunc[this._TLine.name] = function () { _this.tLine(); };
                this._DLine = new gd3d.framework.transform2D();
                this._DLine.name = "DLine";
                this.mapFunc[this._DLine.name] = function () { _this.dLine(); };
                this.lineArr.push(this._LLine, this._RLine, this._TLine, this._DLine);
                this._RTPoint = new gd3d.framework.transform2D();
                this._RTPoint.name = "RTPoint";
                this.mapFunc[this._RTPoint.name] = function () { _this.rtPoint(); };
                this._RDPoint = new gd3d.framework.transform2D();
                this._RDPoint.name = "RDPoint";
                this.mapFunc[this._RDPoint.name] = function () { _this.rdPoint(); };
                this._LTPoint = new gd3d.framework.transform2D();
                this._LTPoint.name = "LTPoint";
                this.mapFunc[this._LTPoint.name] = function () { _this.ltPoint(); };
                this._LDPoint = new gd3d.framework.transform2D();
                this._LDPoint.name = "LDPoint";
                this.mapFunc[this._LDPoint.name] = function () { _this.ldPoint(); };
                this.pointArr.push(this._RTPoint, this._RDPoint, this._LTPoint, this._LDPoint);
                for (var k = 0; k < this.lineArr.length; k++) {
                    if (k < 2) {
                        this.lineArr[k].width = this.LineWide;
                        this.lineArr[k].height = this.LineHeight;
                        this.lineArr[k].pivot.x = 0.5;
                        this.lineArr[k].pivot.y = 0.5;
                    }
                    else {
                        this.lineArr[k].width = this.LineHeight;
                        this.lineArr[k].height = this.LineWide;
                        this.lineArr[k].pivot.x = 0.5;
                        this.lineArr[k].pivot.y = 0.5;
                    }
                    var lineIma = this.lineArr[k].addComponent("rawImage2D");
                    lineIma.image = defImaLine;
                    lineIma.mat = new gd3d.framework.material();
                    lineIma.mat.setShader(this.app.getAssetMgr().getShader("shader/defui"));
                    this.lineArr[k].hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    this.TransGroup.addChild(this.lineArr[k]);
                }
                for (var j in this.pointArr) {
                    this.pointArr[j].width = this.PointWide;
                    this.pointArr[j].height = this.PointWide;
                    this.pointArr[j].pivot.x = 0.5;
                    this.pointArr[j].pivot.y = 0.5;
                    var pointIma = this.pointArr[j].addComponent("rawImage2D");
                    pointIma.image = defImaPoint;
                    pointIma.mat = new gd3d.framework.material();
                    pointIma.mat.setShader(this.app.getAssetMgr().getShader("shader/defui"));
                    this.pointArr[j].hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    ;
                    this.TransGroup.addChild(this.pointArr[j]);
                }
                this.overLay.addChild(this.TransGroup);
                this.TransGroup.markDirty();
                this.DebugTool.mainCam.addOverLay(this.overLay);
            };
            UIMouseCTR.prototype.attachControll = function () {
                var _this = this;
                document.addEventListener("mousedown", function (e) { _this.pointDownEvent(e); });
                document.addEventListener("mousemove", function (e) { _this.pointHoldEvent(e); });
                document.addEventListener("mouseup", function (e) { _this.pointUpEvent(e); });
                document.addEventListener("keydown", function (e) { _this.keyDownEvent(e); });
            };
            UIMouseCTR.prototype.SetOverLayVisiable = function (value) {
                this.overLay.canvas.getRoot().visible = value;
            };
            UIMouseCTR.prototype.refreshFrameData = function (center, wide, height) {
                gd3d.math.vec2Clone(center, this.TransGroup.localTranslate);
                this.TransGroup.markDirty();
                this.lineArr[0].localTranslate.x = -0.5 * wide;
                this.lineArr[1].localTranslate.x = 0.5 * wide;
                this.lineArr[2].localTranslate.y = -0.5 * height;
                this.lineArr[3].localTranslate.y = 0.5 * height;
                this.pointArr[0].localTranslate.x = 0.5 * wide;
                this.pointArr[0].localTranslate.y = -0.5 * height;
                this.pointArr[1].localTranslate.x = 0.5 * wide;
                this.pointArr[1].localTranslate.y = 0.5 * height;
                this.pointArr[2].localTranslate.x = -0.5 * wide;
                this.pointArr[2].localTranslate.y = -0.5 * height;
                this.pointArr[3].localTranslate.x = -0.5 * wide;
                this.pointArr[3].localTranslate.y = 0.5 * height;
                this.lineArr[0].localScale.y = height / this.LineHeight;
                this.lineArr[1].localScale.y = height / this.LineHeight;
                this.lineArr[2].localScale.x = wide / this.LineHeight;
                this.lineArr[3].localScale.x = wide / this.LineHeight;
                for (var i in this.lineArr) {
                    this.lineArr[i].markDirty();
                }
                for (var i in this.pointArr) {
                    this.pointArr[i].markDirty();
                }
            };
            UIMouseCTR.prototype.recordInitialValue = function (pivot, wide, height, center, _tranlate) {
                gd3d.math.vec2Clone(_tranlate, this.localTransLate);
                gd3d.math.vec2Clone(pivot, this.pivot);
                this.wide = wide;
                this.height = height;
                gd3d.math.vec2Clone(center, this.center);
            };
            UIMouseCTR.prototype.pointDownEvent = function (e) {
                if (!this.app.be2dstate)
                    return;
                if (e.button == 0) {
                    this.mouseStartPoint.x = e.x;
                    this.mouseStartPoint.y = e.y;
                    this.pointLeftDown = true;
                    if (this.PickedTrans == null) {
                        if (this.pick2dTransCam(e.x, e.y)) {
                            this.pickedTransAndRefreshData(e);
                            if (this.DebugTool.clickFunc != null) {
                                this.DebugTool.clickFunc(this.PickedTrans);
                            }
                        }
                        else {
                            this.SetOverLayVisiable(false);
                        }
                    }
                    else {
                        if (this.isPickerCtrEreal(e.x, e.y)) { }
                        else {
                            if (this.pick2dTransCam(e.x, e.y)) {
                                this.pickedTransAndRefreshData(e);
                                if (this.DebugTool.clickFunc != null) {
                                    this.DebugTool.clickFunc(this.PickedTrans);
                                }
                            }
                            else {
                                this.SetOverLayVisiable(false);
                            }
                        }
                    }
                }
            };
            UIMouseCTR.prototype.pickedTransAndRefreshData = function (e) {
                {
                    gd3d.math.vec2Clone(this.PickedTrans.localTranslate, this.PickedTransStartPoint);
                }
                var wide = this.PickedTrans.width;
                var height = this.PickedTrans.height;
                var temptCenter = gd3d.math.pool.new_vector2();
                temptCenter.x = this.PickedTrans.localTranslate.x - this.PickedTrans.pivot.x * this.PickedTrans.width + 0.5 * wide;
                temptCenter.y = this.PickedTrans.localTranslate.y - this.PickedTrans.pivot.y * this.PickedTrans.height + 0.5 * height;
                this.recordInitialValue(this.PickedTrans.pivot, wide, height, temptCenter, this.PickedTrans.localTranslate);
                this.refreshFrameData(temptCenter, wide, height);
                gd3d.math.vec2Clone(this.TransGroup.localTranslate, this.TransGroupStartPos);
                this.SetOverLayVisiable(true);
                gd3d.math.pool.delete_vector2(temptCenter);
            };
            UIMouseCTR.prototype.pick2dTransCam = function (ex, ey) {
                if (this.isPick2dTrans(ex, ey, this.scene.renderCameras[this.app.curcameraindex])) {
                    return true;
                }
                else {
                    return false;
                }
            };
            UIMouseCTR.prototype.isPick2dTrans = function (ex, ey, cam) {
                var overlays = cam.getOverLays();
                for (var i in overlays) {
                    var trans = overlays[i].pick2d(ex, ey);
                    if (trans != null) {
                        this.PickedTrans = trans;
                        return true;
                    }
                    else {
                        this.PickedTrans = null;
                        return false;
                    }
                }
            };
            UIMouseCTR.prototype.isPickerCtrEreal = function (ex, ey) {
                var overlays = this.DebugTool.mainCam.getOverLays();
                for (var i in overlays) {
                    var trans = overlays[i].pick2d(ex, ey);
                    if (trans != null) {
                        this.PickedEreal = trans;
                        return true;
                    }
                    else {
                        this.PickedEreal = null;
                        return false;
                    }
                }
            };
            UIMouseCTR.prototype.calRealMoveVector = function (mouseStart, mouseEnd, out) {
                var temptStart = gd3d.math.pool.new_vector2();
                this.overLay.calScreenPosToCanvasPos(mouseStart, temptStart);
                var temptEnd = gd3d.math.pool.new_vector2();
                this.overLay.calScreenPosToCanvasPos(mouseEnd, temptEnd);
                gd3d.math.vec2Subtract(temptEnd, temptStart, out);
                gd3d.math.pool.delete_vector2(temptStart);
                gd3d.math.pool.delete_vector2(temptEnd);
            };
            UIMouseCTR.prototype.pointHoldEvent = function (e) {
                if (e.button == 0 && this.pointLeftDown && this.PickedTrans != null) {
                    this.mouseEndPoint.x = e.x;
                    this.mouseEndPoint.y = e.y;
                    if (this.PickedEreal == null) {
                        this.pickAndMoveUI();
                    }
                    else {
                        var func = this.mapFunc[this.PickedEreal.name];
                        func();
                    }
                }
            };
            UIMouseCTR.prototype.pickAndMoveUI = function () {
                {
                    var RealMove = gd3d.math.pool.new_vector2();
                    this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, RealMove);
                }
                gd3d.math.vec2Add(this.PickedTransStartPoint, RealMove, this.PickedTrans.localTranslate);
                this.PickedTrans.markDirty();
                gd3d.math.vec2Add(this.TransGroupStartPos, RealMove, this.TransGroup.localTranslate);
                this.TransGroup.markDirty();
                gd3d.math.pool.delete_vector2(RealMove);
            };
            UIMouseCTR.prototype.pointUpEvent = function (e) {
                if (e.button == 0) {
                    this.pointLeftDown = false;
                    if (this.PickedTrans != null) {
                        var wide = this.PickedTrans.width;
                        var height = this.PickedTrans.height;
                        var temptCenter = gd3d.math.pool.new_vector2();
                        temptCenter.x = this.PickedTrans.localTranslate.x - this.PickedTrans.pivot.x * this.PickedTrans.width + 0.5 * wide;
                        temptCenter.y = this.PickedTrans.localTranslate.y - this.PickedTrans.pivot.y * this.PickedTrans.height + 0.5 * height;
                        this.recordInitialValue(this.PickedTrans.pivot, wide, height, temptCenter, this.PickedTrans.localTranslate);
                    }
                }
            };
            UIMouseCTR.prototype.keyDownEvent = function (e) {
            };
            UIMouseCTR.prototype.update = function (delta) {
            };
            UIMouseCTR.prototype.rLine = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                moveDir.y = 0;
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide + moveDir.x;
                trans.localTranslate.x = locatranlate.x + trans.pivot.x * moveDir.x;
                trans.markDirty();
                var curWidth = this.wide + moveDir.x;
                center.x += moveDir.x * 0.5;
                this.refreshFrameData(center, curWidth, this.height);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.lLine = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                moveDir.y = 0;
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide - moveDir.x;
                trans.localTranslate.x = locatranlate.x + (1 - trans.pivot.x) * moveDir.x;
                trans.markDirty();
                var curWidth = this.wide - moveDir.x;
                center.x += moveDir.x * 0.5;
                this.refreshFrameData(center, curWidth, this.height);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.tLine = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                moveDir.x = 0;
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.height = this.height - moveDir.y;
                trans.localTranslate.y = locatranlate.y + (1 - trans.pivot.y) * moveDir.y;
                trans.markDirty();
                var curHeight = this.height - moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, this.wide, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.dLine = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                moveDir.x = 0;
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.height = this.height + moveDir.y;
                trans.localTranslate.y = locatranlate.y + trans.pivot.y * moveDir.y;
                trans.markDirty();
                var curHeight = this.height + moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, this.wide, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.rtPoint = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide + moveDir.x;
                trans.localTranslate.x = locatranlate.x + trans.pivot.x * moveDir.x;
                trans.height = this.height - moveDir.y;
                trans.localTranslate.y = locatranlate.y + (1 - trans.pivot.y) * moveDir.y;
                trans.markDirty();
                var curWidth = this.wide + moveDir.x;
                center.x += moveDir.x * 0.5;
                var curHeight = this.height - moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, curWidth, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.rdPoint = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide + moveDir.x;
                trans.localTranslate.x = locatranlate.x + trans.pivot.x * moveDir.x;
                trans.height = this.height + moveDir.y;
                trans.localTranslate.y = locatranlate.y + trans.pivot.y * moveDir.y;
                trans.markDirty();
                var curWidth = this.wide + moveDir.x;
                center.x += moveDir.x * 0.5;
                var curHeight = this.height + moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, curWidth, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.ltPoint = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide - moveDir.x;
                trans.localTranslate.x = locatranlate.x + (1 - trans.pivot.x) * moveDir.x;
                trans.height = this.height - moveDir.y;
                trans.localTranslate.y = locatranlate.y + (1 - trans.pivot.y) * moveDir.y;
                trans.markDirty();
                var curWidth = this.wide - moveDir.x;
                center.x += moveDir.x * 0.5;
                var curHeight = this.height - moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, curWidth, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            UIMouseCTR.prototype.ldPoint = function () {
                var moveDir = gd3d.math.pool.new_vector2();
                this.calRealMoveVector(this.mouseStartPoint, this.mouseEndPoint, moveDir);
                var locatranlate = gd3d.math.pool.new_vector2();
                var center = gd3d.math.pool.new_vector2();
                gd3d.math.vec2Clone(this.localTransLate, locatranlate);
                gd3d.math.vec2Clone(this.center, center);
                var trans = this.PickedTrans;
                trans.width = this.wide - moveDir.x;
                trans.localTranslate.x = locatranlate.x + (1 - trans.pivot.x) * moveDir.x;
                trans.height = this.height + moveDir.y;
                trans.localTranslate.y = locatranlate.y + trans.pivot.y * moveDir.y;
                trans.markDirty();
                var curWidth = this.wide - moveDir.x;
                center.x += moveDir.x * 0.5;
                var curHeight = this.height + moveDir.y;
                center.y += moveDir.y * 0.5;
                this.refreshFrameData(center, curWidth, curHeight);
                gd3d.math.pool.delete_vector2(center);
            };
            return UIMouseCTR;
        }());
        editor.UIMouseCTR = UIMouseCTR;
        var cameraEdit = (function () {
            function cameraEdit(_app, _mainCam, _debugTool) {
                this.pickeEidtorCube = false;
                this.cubeArr = [];
                this.app = _app;
                this.scene = this.app.getScene();
                this.DebugTool = _debugTool;
                this.editorCamera = _mainCam;
                this.attachControll();
                this.frameInit();
            }
            Object.defineProperty(cameraEdit.prototype, "tartgetCamera", {
                get: function () {
                    return this._tartgetCamera;
                },
                set: function (came) {
                    this._tartgetCamera = came;
                    if (came == null) {
                        this.frameTrans.gameObject.visible = false;
                    }
                },
                enumerable: true,
                configurable: true
            });
            cameraEdit.prototype.attachControll = function () {
                var _this = this;
                document.addEventListener("mousedown", function (e) { _this.pointDownEvent(e); });
                document.addEventListener("mousemove", function (e) { _this.pointHoldEvent(e); });
                document.addEventListener("mouseup", function (e) { _this.pointUpEvent(e); });
            };
            cameraEdit.prototype.pointDownEvent = function (e) {
                if (this.tartgetCamera == null || this.app.be2dstate)
                    return;
                var ray = this.editorCamera.creatRayByScreen(new gd3d.math.vector2(e.x, e.y), this.app);
                var pickinfo = this.scene.pick(ray, true);
                if (pickinfo == null || pickinfo.pickedtran == null) {
                    this.tartgetCamera == null;
                    this.pickeEidtorCube = false;
                    this.hideFrame();
                }
                else {
                    if (pickinfo.pickedtran != null) {
                        if (pickinfo.pickedtran.parent != null && pickinfo.pickedtran.parent.name == "editor---camera---frame--??") {
                            this.pickeEidtorCube = true;
                            this.pickedCube = pickinfo.pickedtran;
                        }
                    }
                }
            };
            cameraEdit.prototype.pointHoldEvent = function (e) {
                if (this.tartgetCamera == null || this.app.be2dstate)
                    return;
                if (this.pickeEidtorCube) {
                    var mousePoint = gd3d.math.pool.new_vector2();
                    mousePoint.x = e.x;
                    mousePoint.y = e.y;
                    var ray = this.editorCamera.creatRayByScreen(mousePoint, this.app);
                    var matrix = this.tartgetCamera.gameObject.transform.getWorldMatrix();
                    var PlaneOrigin = new gd3d.math.vector3(0, 0, this.tartgetCamera.far);
                    gd3d.math.matrixTransformVector3(PlaneOrigin, matrix, PlaneOrigin);
                    var planeNormal = new gd3d.math.vector3(0, 0, 1);
                    gd3d.math.matrixTransformNormal(planeNormal, matrix, planeNormal);
                    var rayRes = new gd3d.math.vector3();
                    rayRes = ray.intersectPlane(PlaneOrigin, planeNormal);
                    var dir = new gd3d.math.vector3();
                    gd3d.math.vec3Subtract(rayRes, PlaneOrigin, dir);
                    var viewMatrix = gd3d.math.pool.new_matrix();
                    this.tartgetCamera.calcViewMatrix(viewMatrix);
                    gd3d.math.matrixTransformNormal(dir, viewMatrix, dir);
                    gd3d.math.pool.delete_vector2(mousePoint);
                    gd3d.math.pool.delete_matrix(viewMatrix);
                    {
                        var _vpp = new gd3d.math.rect();
                        this.tartgetCamera.calcViewPortPixel(this.app, _vpp);
                        var asp = _vpp.w / _vpp.h;
                    }
                    if (rayRes != null) {
                        switch (this.pickedCube.name) {
                            case "cubeTM":
                            case "cubeDM":
                                var Halfheight = Math.abs(dir.y);
                                this.tartgetCamera.fov = 2 * Math.atan2(Halfheight, this.tartgetCamera.far);
                                break;
                            case "cubeRM":
                            case "cubeLM":
                                var HalfWidth = Math.abs(dir.x);
                                var halfheigth2 = HalfWidth / asp;
                                this.tartgetCamera.fov = 2 * Math.atan2(halfheigth2, this.tartgetCamera.far);
                                break;
                        }
                    }
                }
            };
            cameraEdit.prototype.pointUpEvent = function (e) {
                if (this.tartgetCamera == null || this.app.be2dstate)
                    return;
                this.pickeEidtorCube = false;
            };
            cameraEdit.prototype.update = function () {
                if (this.tartgetCamera != null) {
                    this.showFrame();
                }
            };
            cameraEdit.prototype.frameInit = function () {
                this.frameTrans = new gd3d.framework.transform();
                this.frameTrans.gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                ;
                this.frameTrans.name = "editor---camera---frame--??";
                var meshFilter = this.frameTrans.gameObject.addComponent("meshFilter");
                var meshrender = this.frameTrans.gameObject.addComponent("meshRenderer");
                for (var i = 0; i < 4; i++) {
                    this.cubeArr[i] = new gd3d.framework.transform();
                    this.cubeArr[i].gameObject.hideFlags = gd3d.framework.HideFlags.HideInHierarchy;
                    ;
                    this.cubeArr[i].localScale.x = 0.1;
                    this.cubeArr[i].localScale.y = 0.1;
                    this.cubeArr[i].localScale.z = 0.1;
                    var meshFilter = this.cubeArr[i].gameObject.addComponent("meshFilter");
                    var meshrender = this.cubeArr[i].gameObject.addComponent("meshRenderer");
                    var sh = this.app.getAssetMgr().getShader("materialcolor.shader.json");
                    var mat = new gd3d.framework.material();
                    mat.setShader(sh);
                    mat.setVector4("_Color", new gd3d.math.vector4(0.75, 0.75, 0.75, 1));
                    meshrender.materials = [];
                    meshrender.materials.push(mat);
                    meshFilter.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    this.frameTrans.addChild(this.cubeArr[i]);
                }
                this.cubeArr[0].name = "cubeTM";
                this.cubeArr[1].name = "cubeDM";
                this.cubeArr[2].name = "cubeRM";
                this.cubeArr[3].name = "cubeLM";
            };
            cameraEdit.prototype.showFrame = function () {
                if (this.frameTrans.parent == null) {
                    this.scene.addChild(this.frameTrans);
                }
                gd3d.math.vec3Clone(this.tartgetCamera.gameObject.transform.getWorldTranslate(), this.frameTrans.localTranslate);
                this.frameTrans.updateWorldTran();
                this.refreshOrBuildFrameMesh();
                this.frameTrans.gameObject.visible = true;
            };
            cameraEdit.prototype.hideFrame = function () {
                this.frameTrans.gameObject.visible = false;
            };
            cameraEdit.prototype.refreshOrBuildFrameMesh = function () {
                var meshFilter = this.frameTrans.gameObject.getComponent("meshFilter");
                if (meshFilter.mesh == null) {
                    var _mesh = new gd3d.framework.mesh();
                    _mesh.data = new gd3d.render.meshData();
                    meshFilter.mesh = _mesh;
                }
                else {
                    meshFilter.mesh.data.pos.splice(0, meshFilter.mesh.data.pos.length);
                    meshFilter.mesh.data.trisindex.splice(0, meshFilter.mesh.data.trisindex.length);
                }
                var _vpp = new gd3d.math.rect();
                this.tartgetCamera.calcViewPortPixel(this.app, _vpp);
                var near_h = this.tartgetCamera.near * Math.tan(this.tartgetCamera.fov * 0.5);
                var asp = _vpp.w / _vpp.h;
                var near_w = near_h * asp;
                var nearLT = new gd3d.math.vector3(-near_w, near_h, this.tartgetCamera.near);
                var nearLD = new gd3d.math.vector3(-near_w, -near_h, this.tartgetCamera.near);
                var nearRT = new gd3d.math.vector3(near_w, near_h, this.tartgetCamera.near);
                var nearRD = new gd3d.math.vector3(near_w, -near_h, this.tartgetCamera.near);
                var far_h = this.tartgetCamera.far * Math.tan(this.tartgetCamera.fov * 0.5);
                var far_w = far_h * asp;
                var farLT = new gd3d.math.vector3(-far_w, far_h, this.tartgetCamera.far);
                var farLD = new gd3d.math.vector3(-far_w, -far_h, this.tartgetCamera.far);
                var farRT = new gd3d.math.vector3(far_w, far_h, this.tartgetCamera.far);
                var farRD = new gd3d.math.vector3(far_w, -far_h, this.tartgetCamera.far);
                var array = [];
                array[0] = farLD;
                array[1] = nearLD;
                array[2] = farRD;
                array[3] = nearRD;
                array[4] = farLT;
                array[5] = nearLT;
                array[6] = farRT;
                array[7] = nearRT;
                meshFilter.mesh.data = gd3d.render.meshData.genBoxByArray_Quad(array);
                var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Color;
                var v32 = meshFilter.mesh.data.genVertexDataArray(vf);
                var i16 = meshFilter.mesh.data.genIndexDataArray();
                var webgl = this.app.webgl;
                meshFilter.mesh.glMesh = new gd3d.render.glMesh();
                meshFilter.mesh.glMesh.initBuffer(webgl, vf, meshFilter.mesh.data.pos.length);
                meshFilter.mesh.glMesh.uploadVertexSubData(webgl, v32);
                meshFilter.mesh.glMesh.addIndex(webgl, i16.length);
                meshFilter.mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
                meshFilter.mesh.submesh = [];
                {
                    var sm = new gd3d.framework.subMeshInfo();
                    sm.matIndex = 0;
                    sm.useVertexIndex = 0;
                    sm.start = 0;
                    sm.size = i16.length;
                    sm.line = true;
                    meshFilter.mesh.submesh.push(sm);
                }
                {
                    this.cubeArr[0].localTranslate.y = far_h;
                    this.cubeArr[1].localTranslate.y = -far_h;
                    this.cubeArr[2].localTranslate.x = far_w;
                    this.cubeArr[3].localTranslate.x = -far_w;
                    for (var i = 0; i < this.cubeArr.length; i++) {
                        this.cubeArr[i].localTranslate.z = this.tartgetCamera.far;
                        this.cubeArr[i].markDirty();
                    }
                }
            };
            return cameraEdit;
        }());
        editor.cameraEdit = cameraEdit;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var Button = (function () {
            function Button() {
            }
            Button.prototype.createWidget = function (instance, data, fun, func) {
                var widget = null;
                var dataIns = data["dataIns"];
                if (dataIns == null) {
                    if (instance == null) {
                        widget = this.elementJqury.button({ "value": editor.title, onclick: fun[0] });
                    }
                    else {
                        widget = instance.button({ "value": editor.title, onclick: fun[0] });
                    }
                }
                else {
                    if (instance == null) {
                        widget = this.elementJqury.button({ "value": editor.title, onclick: fun[0], data: dataIns });
                    }
                    else {
                        widget = instance.button({ "value": editor.title, onclick: fun[0], data: dataIns });
                    }
                }
                func(widget);
            };
            Button.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                instance.show();
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var widget = null;
                if (dataIns == null) {
                    data = instance.reload({ "value": editor.title, onclick: funs[0] });
                }
                else {
                    data = instance.reload({ "value": editor.title, onclick: funs[0], data: { "dataIns": dataIns, "keys": keys } });
                }
            };
            Button.prototype.clear = function () {
            };
            return Button;
        }());
        editor.Button = Button;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetCheckBox = (function () {
            function WidgetCheckBox() {
                this.checkBoxOption = [];
            }
            WidgetCheckBox.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var name = data["title"];
                var dataIns = data["dataIns"];
                var options = data["options"];
                var keys = data["keys"];
                if (options == undefined || options.length == 0) {
                    options = [];
                    options.push({ key: "", value: 0, checked: dataIns[keys.length - 1] });
                    data["options"] = options;
                }
                var widgetIns = instance == null ? this.elementJqury : instance;
                if (dataIns == null) {
                    if (funs == undefined) {
                        widget = widgetIns.checkbox({ "title": name, options: options });
                    }
                    else {
                        widget = widgetIns.checkbox({ "title": name, options: options, onchange: funs[0] });
                    }
                }
                else {
                    widget = widgetIns.checkbox({
                        "title": name, options: options, data: { "dataIns": dataIns, "keys": keys }, onchange: function (e, d) {
                            _this.widgetMgr.setVal(d, e[0]);
                            if (funs != null && funs[0] != null)
                                funs[0];
                        }
                    });
                }
                func(widget);
            };
            WidgetCheckBox.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                this.checkBoxOption = [];
                var options = data["options"];
                for (var inde in options) {
                    this.checkBoxOption.push(options[inde].checked);
                }
                if (options == undefined || options.length == 0) {
                    var dataIns = data["dataIns"];
                    var keys = data["keys"];
                    this.checkBoxOption.push(dataIns[keys[keys.length - 1]]);
                }
                instance.show();
                instance.reload({ options: this.checkBoxOption });
            };
            WidgetCheckBox.prototype.clear = function () {
            };
            return WidgetCheckBox;
        }());
        editor.WidgetCheckBox = WidgetCheckBox;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetComponent = (function () {
            function WidgetComponent() {
                this.map = {};
            }
            WidgetComponent.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget;
                var title;
                var operate;
                if (data != null && data["title"] != undefined) {
                    title = data["title"];
                }
                if (data != null && data["operate"] != undefined) {
                    operate = data["operate"];
                }
                var dataIns = data["dataIns"];
                var ins = instance == null ? this.elementJqury : instance;
                widget = ins.compent({
                    title: title,
                    after: function (e, t) {
                        func(t, e);
                        if (funs != null && funs[0] != null)
                            funs[0](e);
                    },
                    operate: operate,
                    data: { "dataIns": dataIns },
                    onoperate: function (eventType, d, widgetIns) {
                        _this.doOperate(dataIns, title, eventType, widgetIns);
                    }
                });
            };
            WidgetComponent.prototype.doOperate = function (dataIns, title, eventType, widgetIns) {
                if (eventType & editor.ComponentOperateEnum.RemoveType) {
                    if (this.widgetMgr.beOnRemoveComponentFunc != null) {
                        this.widgetMgr.beOnRemoveComponentFunc(dataIns, title);
                    }
                    this.widgetMgr.clear();
                }
            };
            WidgetComponent.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                if (funs[0] != null) {
                    funs[0](pointIns);
                }
            };
            WidgetComponent.prototype.clear = function () {
            };
            return WidgetComponent;
        }());
        editor.WidgetComponent = WidgetComponent;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetDragSelect = (function () {
            function WidgetDragSelect() {
            }
            WidgetDragSelect.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var title = data["title"];
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = this.getDefaultVal(data);
                var assetType = this.getAssetType(data);
                var options = this.getOptions(assetType, defaultVal);
                var widgetIns = instance == null ? this.elementJqury : instance;
                editor.WidgetMgr.ins().addWidget("grid", widgetIns, { "title": title, "keys": [this.getKey(data)], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (ele, d) {
                        if (dataIns == null) {
                            widget = ele.drag({
                                "type": _this.getIconName(assetType),
                                "chosen": {
                                    "search": true, "options": options, onclick: function (e, drag, dragData) {
                                        drag.val(e);
                                        _this.setVal(dragData, e);
                                        if (funs != null && funs.length > 0)
                                            funs[0](e, dragData);
                                    }
                                }
                            });
                        }
                        else {
                            widget = ele.drag({
                                "type": _this.getIconName(assetType),
                                "chosen": {
                                    "search": true, "options": options, onclick: function (e, drag, dragData) {
                                        drag.val(e);
                                        _this.setVal(dragData, e);
                                        if (funs != null && funs.length > 0)
                                            funs[0](e, dragData);
                                    }
                                }, data: data
                            });
                        }
                        func(widget, ele);
                    }]);
            };
            WidgetDragSelect.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                editor.WidgetMgr.ins().addWidget("grid", pointIns, { "keys": [this.getKey(data)], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (ele, d) {
                    }]);
            };
            WidgetDragSelect.prototype.clear = function () {
            };
            WidgetDragSelect.prototype.getAssetType = function (data) {
                var typeName = data["type"];
                var type = gd3d.framework.AssetTypeEnum.Unknown;
                switch (typeName) {
                    case "mesh":
                        type = gd3d.framework.AssetTypeEnum.Mesh;
                        break;
                    case "shader":
                        type = gd3d.framework.AssetTypeEnum.Shader;
                        break;
                    case "material":
                    case "materials":
                        type = gd3d.framework.AssetTypeEnum.Material;
                        break;
                    case "texture":
                        type = gd3d.framework.AssetTypeEnum.Texture;
                        break;
                }
                return type;
            };
            WidgetDragSelect.prototype.getIconName = function (assetType) {
                switch (assetType) {
                    case gd3d.framework.AssetTypeEnum.Material:
                        return "dot";
                    case gd3d.framework.AssetTypeEnum.Shader:
                        return "shader";
                    case gd3d.framework.AssetTypeEnum.Mesh:
                        return "num";
                    case gd3d.framework.AssetTypeEnum.Prefab:
                        return "box";
                    case gd3d.framework.AssetTypeEnum.Texture:
                    case gd3d.framework.AssetTypeEnum.TextureDesc:
                        return "shu";
                    default:
                        return "shu";
                }
            };
            WidgetDragSelect.prototype.getOptions = function (type, defaultVal) {
                var array = [];
                if (type == gd3d.framework.AssetTypeEnum.Shader) {
                    var mapShader = gd3d.framework.sceneMgr.app.getAssetMgr().mapShader;
                    for (var key in mapShader) {
                        this.name = mapShader[key].getName();
                        var selected = this.name == defaultVal ? true : false;
                        array.push({ key: this.name, value: this.name, selected: selected });
                    }
                }
                else {
                    if (type == gd3d.framework.AssetTypeEnum.Texture || type == gd3d.framework.AssetTypeEnum.TextureDesc) {
                        var bundleMap = gd3d.editor.edit.assetbundleFilesMap[gd3d.editor.assetbundleName];
                        if (bundleMap == null)
                            return;
                        var map = bundleMap[gd3d.framework.AssetTypeEnum.Texture];
                        if (map != undefined) {
                            for (var key in map) {
                                array.push({ key: map[key], value: map[key], selected: map[key] == defaultVal });
                            }
                        }
                        map = bundleMap[gd3d.framework.AssetTypeEnum.TextureDesc];
                        if (map != undefined) {
                            for (var key in map) {
                                array.push({ key: map[key], value: map[key], selected: map[key] == defaultVal });
                            }
                        }
                    }
                    else {
                        var bundleMap = gd3d.editor.edit.assetbundleFilesMap[gd3d.editor.assetbundleName];
                        if (bundleMap == null)
                            return;
                        if (bundleMap[type] != undefined) {
                            for (var key in bundleMap[type]) {
                                array.push({ key: bundleMap[type][key], value: bundleMap[type][key], selected: bundleMap[type][key] == defaultVal });
                            }
                        }
                    }
                }
                return array;
            };
            WidgetDragSelect.prototype.setVal = function (data, val) {
                var assetType = this.getAssetType(data);
                var ins = this.getIns(data, assetType);
                if (assetType == gd3d.framework.AssetTypeEnum.Material) {
                    var index = this.getMaterialIndex(data);
                    if (index == -1)
                        return;
                    var mat = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName(val);
                    ins[index] = mat;
                }
                else if (assetType == gd3d.framework.AssetTypeEnum.Shader) {
                    var shader = gd3d.framework.sceneMgr.app.getAssetMgr().mapShader[val];
                    var material = this.getMaterial(data);
                    var mapUniform = material.mapUniform;
                    material.setShader(shader);
                    var _newmapUniform = material.mapUniform;
                    for (var key in _newmapUniform) {
                        if (mapUniform[key] != undefined) {
                            _newmapUniform[key] = mapUniform[key];
                        }
                    }
                    if (this.widgetMgr.beChangeShaderFunc != null)
                        this.widgetMgr.beChangeShaderFunc(material);
                }
                else if (assetType == gd3d.framework.AssetTypeEnum.Texture || assetType == gd3d.framework.AssetTypeEnum.TextureDesc) {
                    var tex = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName(val);
                    var material = this.getMaterial(data);
                    var keys = data["keys"];
                    material.setTexture(keys[keys.length - 1], tex);
                    if (this.widgetMgr.beChangeShaderFunc != null)
                        this.widgetMgr.beChangeShaderFunc(material);
                }
                else if (assetType == gd3d.framework.AssetTypeEnum.Mesh) {
                    var mesh = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName(val);
                    ins.mesh = mesh;
                }
            };
            WidgetDragSelect.prototype.getIns = function (data, assetType) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                if (assetType == gd3d.framework.AssetTypeEnum.Shader) {
                    for (var key in keys) {
                        dataIns = dataIns[keys[key]];
                        if (key == "material") {
                            break;
                        }
                    }
                }
                else if (assetType == gd3d.framework.AssetTypeEnum.Material) {
                    for (var key in keys) {
                        if (!isNaN(parseInt(keys[key]))) {
                            break;
                        }
                        dataIns = dataIns[keys[key]];
                    }
                }
                return dataIns;
            };
            WidgetDragSelect.prototype.getMaterial = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                for (var key in keys) {
                    dataIns = dataIns[keys[key]];
                    if (!isNaN(parseInt(keys[key]))) {
                        break;
                    }
                }
                return dataIns;
            };
            WidgetDragSelect.prototype.getMaterialIndex = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                for (var key in keys) {
                    if (!isNaN(parseInt(keys[key]))) {
                        return keys[key];
                    }
                    dataIns = dataIns[keys[key]];
                }
                return -1;
            };
            WidgetDragSelect.prototype.getKey = function (data) {
                var keys = data["keys"];
                var key = "";
                for (var i = 0; i < keys.length; i++) {
                    key += keys[i];
                }
                return key;
            };
            WidgetDragSelect.prototype.getDefaultVal = function (data) {
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var _ins = dataIns;
                keys.forEach(function (element) {
                    if (element == "shader" && keys[keys.length - 1] != "shader") {
                        _ins = _ins["mapUniform"];
                    }
                    else {
                        _ins = _ins[element];
                    }
                });
                if (_ins != null && _ins["value"] != null && _ins["value"]["name"] != null && _ins["value"]["name"] instanceof gd3d.framework.constText) {
                    return _ins["value"]["name"]["name"];
                }
                if (_ins != null && _ins["name"] != null && _ins["name"] instanceof gd3d.framework.constText) {
                    return _ins["name"]["name"];
                }
                return "";
            };
            return WidgetDragSelect;
        }());
        editor.WidgetDragSelect = WidgetDragSelect;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetFloatSearchSelect = (function () {
            function WidgetFloatSearchSelect() {
            }
            WidgetFloatSearchSelect.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var title = data["title"];
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var options = data["options"];
                if (dataIns == null) {
                    if (instance == null) {
                        widget = this.elementJqury.chosen({
                            "value": title, options: options, onclick: function (e, d) {
                                _this.addComponent(options[e - 1].key, dataIns);
                            }
                        });
                    }
                    else {
                        widget = instance.chosen({
                            "value": title, options: options, onclick: function (e, d) {
                                _this.addComponent(options[e - 1].key, dataIns);
                            }
                        });
                    }
                }
                else {
                    if (instance == null) {
                        widget = this.elementJqury.chosen({
                            "value": title, options: options, data: { "dataIns": dataIns }, onclick: function (e, d) {
                                _this.addComponent(options[e - 1].key, dataIns);
                            }
                        });
                    }
                    else {
                        widget = instance.chosen({
                            "value": title, options: options, data: { "dataIns": dataIns }, onclick: function (e, d) {
                                _this.addComponent(options[e - 1].key, dataIns);
                            }
                        });
                    }
                }
                func(widget);
            };
            WidgetFloatSearchSelect.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                this.widgetMgr.divFloatSelect.hidden = false;
            };
            WidgetFloatSearchSelect.prototype.clear = function () {
            };
            WidgetFloatSearchSelect.prototype.addComponent = function (comName, dataIns) {
                if (dataIns instanceof gd3d.framework.transform2D) {
                    if (dataIns.getComponent(comName) != null)
                        return;
                    dataIns.addComponent(comName);
                }
                else {
                    var obj = dataIns.gameObject;
                    if (obj.getComponent(comName) != null)
                        return;
                    obj.addComponent(comName);
                }
            };
            return WidgetFloatSearchSelect;
        }());
        editor.WidgetFloatSearchSelect = WidgetFloatSearchSelect;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetGrid = (function () {
            function WidgetGrid() {
            }
            WidgetGrid.prototype.createWidget = function (instance, data, funs, func) {
                var widget;
                var title = data["title"];
                var layoutDirType = data["layout"];
                var ins = instance == null ? this.elementJqury : instance;
                widget = ins.grid({
                    "title": title, "layout": layoutDirType, after: function (e, t) {
                        func(t, e);
                        if (funs != null && funs[0] != null)
                            funs[0](e, t);
                    }
                });
            };
            WidgetGrid.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                instance.show();
                if (funs[0] != null) {
                    funs[0](pointIns, instance);
                }
            };
            WidgetGrid.prototype.clear = function () {
            };
            return WidgetGrid;
        }());
        editor.WidgetGrid = WidgetGrid;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetImage = (function () {
            function WidgetImage() {
                this.mapInputLockState = {};
            }
            WidgetImage.prototype.createWidget = function (instance, data, funs, func) {
                var widget = null;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                var title = data["title"];
                if (dataIns != null) {
                    if (instance == null) {
                        widget = this.elementJqury.imageCut({
                            imageUrl: 'http://i-7.vcimg.com/crop/73eec6f7a25c1793e4f30d8f4ca566ce645328(600x)/thumb.jpg', onchange: function (e, params) {
                            }
                        });
                    }
                    else {
                        widget = instance.imageCut({
                            imageUrl: 'http://i-7.vcimg.com/crop/73eec6f7a25c1793e4f30d8f4ca566ce645328(600x)/thumb.jpg', onchange: function (e, params) {
                            }
                        });
                    }
                }
                else {
                    console.log("创建一个不与任何实例关联的input没有任何意义！！");
                }
                func(widget);
            };
            WidgetImage.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                instance.show();
            };
            WidgetImage.prototype.refreshValue = function (e, params) {
                var ins = params["dataIns"];
                var keys = params["keys"];
                var texture = ins[keys];
                var trans = this.widgetMgr.trans;
                var url = trans.canvas.scene.app.getAssetMgr().getAssetUrl(texture);
            };
            WidgetImage.prototype.clear = function () {
                for (var index in this.mapInputLockState) {
                    this.mapInputLockState[index] = false;
                }
            };
            return WidgetImage;
        }());
        editor.WidgetImage = WidgetImage;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetInput = (function () {
            function WidgetInput() {
                this.mapInputLockState = {};
            }
            WidgetInput.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var key = data["_____key"];
                var defaultVal = data["defaultVal"];
                var title = data["title"];
                if (dataIns != null) {
                    if (instance == null) {
                        widget = this.elementJqury.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.widgetMgr.setVal(params, e.val());
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                    else {
                        widget = instance.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.widgetMgr.setVal(params, e.val());
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                    this.mapInputLockState[key] = false;
                }
                else {
                    console.log("创建一个不与任何实例关联的input没有任何意义！！");
                    if (instance == null) {
                        widget = this.elementJqury.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }
                        });
                    }
                    else {
                        widget = instance.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }
                        });
                    }
                }
                func(widget);
            };
            WidgetInput.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                var _this = this;
                instance.show();
                var key = data["_____key"];
                if (this.mapInputLockState[key])
                    return;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                var widget = null;
                if (dataIns == null) {
                    widget = instance.reload({
                        "value": defaultVal, onblur: function (e, params) {
                            _this.mapInputLockState[key] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[key] = true;
                        }
                    });
                }
                else {
                    widget = instance.reload({
                        "value": defaultVal, onblur: function (e, params) {
                            _this.widgetMgr.setVal(params, e.val());
                            _this.mapInputLockState[key] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[key] = true;
                        }, data: { "dataIns": dataIns, "keys": keys }
                    });
                }
            };
            WidgetInput.prototype.clear = function () {
                for (var index in this.mapInputLockState) {
                    this.mapInputLockState[index] = false;
                }
            };
            return WidgetInput;
        }());
        editor.WidgetInput = WidgetInput;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetInputArray = (function () {
            function WidgetInputArray() {
                this.mapInputLockState = {};
            }
            WidgetInputArray.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var title = data["title"];
                editor.WidgetMgr.ins().addWidget("grid", instance, { "keys": [this.getKey(data)], "title": title, "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, t) {
                        func(t, e);
                        var ins = _this.getIns(data);
                        for (var key in ins) {
                            if (key != "__gdmeta__" && key != "toString") {
                                editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": ins, keys: [key], "title": key, "defaultVal": ins[key] });
                            }
                        }
                    }]);
            };
            WidgetInputArray.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                var _this = this;
                editor.WidgetMgr.ins().addWidget("grid", instance, { "keys": [this.getKey(data)], "layout": editor.LayoutDirectionEnum.HorizontalType }, [function (e, t) {
                        var ins = _this.getIns(data);
                        for (var key in ins) {
                            if (key != "__gdmeta__" && key != "toString") {
                                editor.WidgetMgr.ins().addWidget("number", e, { "dataIns": ins, keys: [key], "title": key, "defaultVal": ins[key] });
                            }
                        }
                    }]);
            };
            WidgetInputArray.prototype.clear = function () {
                for (var index in this.mapInputLockState) {
                    this.mapInputLockState[index] = false;
                }
            };
            WidgetInputArray.prototype.getIns = function (data) {
                var ins = data["dataIns"];
                var keys = data["keys"];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    {
                        if (ins[key] != undefined) {
                            ins = ins[key];
                        }
                        else {
                            if (typeof (key) == "number") {
                                ins[0] = [];
                                ins = ins[0];
                            }
                            else {
                                ins[key] = {};
                            }
                        }
                    }
                }
                return ins;
            };
            WidgetInputArray.prototype.getKey = function (data) {
                var keys = data["keys"];
                var key = "";
                for (var i = 0; i < keys.length; i++) {
                    key += keys[i];
                }
                return key;
            };
            return WidgetInputArray;
        }());
        editor.WidgetInputArray = WidgetInputArray;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetInputSpecial = (function () {
            function WidgetInputSpecial() {
                this.mapInputLockState = {};
            }
            WidgetInputSpecial.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                var title = data["title"];
                var key = data["_____key"];
                if (dataIns != null) {
                    if (instance == null) {
                        widget = this.elementJqury.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.refreshValue(params, e);
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                    else {
                        widget = instance.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.refreshValue(params, e);
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                    this.mapInputLockState[key] = false;
                }
                else {
                    console.log("创建一个不与任何实例关联的input没有任何意义！！");
                    if (instance == null) {
                        widget = this.elementJqury.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }
                        });
                    }
                    else {
                        widget = instance.input({
                            "title": title, "value": defaultVal, onblur: function (e, params) {
                                _this.mapInputLockState[key] = false;
                            }, onfocus: function (e, params) {
                                _this.mapInputLockState[key] = true;
                            }
                        });
                    }
                }
                func(widget);
            };
            WidgetInputSpecial.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                var _this = this;
                instance.show();
                var key = data["_____key"];
                if (this.mapInputLockState[key])
                    return;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                var widget = null;
                if (dataIns == null) {
                    widget = instance.reload({
                        "value": defaultVal, onblur: function (e, params) {
                            _this.mapInputLockState[key] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[key] = true;
                        }
                    });
                }
                else {
                    widget = instance.reload({
                        "value": defaultVal, onblur: function (e, params) {
                            _this.refreshValue(params, e);
                            _this.mapInputLockState[key] = false;
                        }, onfocus: function (e, params) {
                            _this.mapInputLockState[key] = true;
                        }, data: { "dataIns": dataIns, "keys": keys }
                    });
                }
            };
            WidgetInputSpecial.prototype.refreshValue = function (params, e) {
                var ins = params["dataIns"];
                var keys = params["keys"];
                if (ins instanceof gd3d.framework.transform) {
                    if (keys[0] == "localRotate") {
                        var tempt = gd3d.math.pool.new_vector3();
                        gd3d.math.quatToEulerAngles(ins["localRotate"], tempt);
                        var angle = e.val();
                        angle = angle % 360;
                        tempt[keys[1]] = angle;
                        gd3d.math.quatFromEulerAngles(tempt.x, tempt.y, tempt.z, ins["localRotate"]);
                        ins.markDirty();
                        gd3d.math.pool.delete_vector3(tempt);
                    }
                }
                else if (ins instanceof gd3d.framework.transform2D) {
                    if (keys[0] == "localRotate") {
                        var angle = e.val();
                        angle = angle % 360;
                        if (angle > 180) {
                            angle = angle - 360;
                        }
                        angle = angle * Math.PI / 180;
                        ins["localRotate"] = angle;
                        ins.markDirty();
                    }
                }
            };
            WidgetInputSpecial.prototype.clear = function () {
                for (var index in this.mapInputLockState) {
                    this.mapInputLockState[index] = false;
                }
            };
            return WidgetInputSpecial;
        }());
        editor.WidgetInputSpecial = WidgetInputSpecial;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetLayer = (function () {
            function WidgetLayer() {
                this.selectOption = [];
            }
            WidgetLayer.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var dataIns = data["dataIns"];
                var options = data["options"];
                var keys = data["keys"];
                var title = data["title"];
                var style = data["UIStyle"];
                var defaultVal = data["defaultVal"];
                var enumMap = gd3d.io.enumMgr.enumMap[style];
                if (options == undefined) {
                    options = [];
                    for (var key in enumMap) {
                        if (!isNaN(parseInt(key))) {
                            options.push({ "key": enumMap[key], "value": parseInt(key), "selected": key == defaultVal ? true : false });
                        }
                    }
                }
                var widget = null;
                if (dataIns == null) {
                    if (instance == null) {
                        widget = this.elementJqury.select({
                            "title": title, options: options, onchange: function (e, params) {
                                _this.widgetMgr.setVal(params, e);
                            }
                        });
                    }
                    else {
                        widget = instance.select({
                            "title": title, options: options, onchange: function (e, params) {
                                _this.widgetMgr.setVal(params, e);
                            }
                        });
                    }
                }
                else {
                    if (instance == null) {
                        widget = this.elementJqury.select({
                            "title": title, options: options, data: { "dataIns": dataIns, "keys": keys }, onchange: function (e, params) {
                                _this.widgetMgr.setVal(params, e);
                            }
                        });
                    }
                    else {
                        widget = instance.select({
                            "title": title, options: options, data: { "dataIns": dataIns, "keys": keys }, onchange: function (e, params) {
                                _this.widgetMgr.setVal(params, e);
                            }
                        });
                    }
                }
                func(widget);
            };
            WidgetLayer.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                this.selectOption = [];
                instance.show();
                var options = data["options"];
                for (var index in options) {
                    this.selectOption.push(options[index].selected);
                }
                instance.reload({
                    options: this.selectOption
                });
            };
            WidgetLayer.prototype.clear = function () {
            };
            return WidgetLayer;
        }());
        editor.WidgetLayer = WidgetLayer;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgeBlankLine = (function () {
            function WidgeBlankLine() {
            }
            WidgeBlankLine.prototype.createWidget = function (instance, data, funs, func) {
                var widget;
                if (instance == null) {
                    widget = this.elementJqury.line();
                }
                else {
                    widget = instance.line();
                }
                func(widget);
            };
            WidgeBlankLine.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                instance.show();
            };
            WidgeBlankLine.prototype.clear = function () {
            };
            return WidgeBlankLine;
        }());
        editor.WidgeBlankLine = WidgeBlankLine;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetMgr = (function () {
            function WidgetMgr() {
                this.map = {};
                this.allMap = {};
                this.tempMap = {};
            }
            WidgetMgr.ins = function () {
                if (WidgetMgr._ins == null)
                    WidgetMgr._ins = new WidgetMgr();
                return WidgetMgr._ins;
            };
            WidgetMgr.prototype.init = function (div) {
                this.divRoot = div;
                $(this.divRoot).empty();
                this.divRoot.style.overflowY = "scroll";
                if (this.divOther == undefined) {
                    this.divOther = document.createElement("div");
                    this.divRoot.appendChild(this.divOther);
                    this.elementJqury = $(this.divOther).elementBuilder();
                }
                this.regAllWidget();
            };
            WidgetMgr.prototype.show = function (trans) {
                this.trans = trans;
            };
            WidgetMgr.prototype.clear = function () {
                this.allMap = {};
                for (var index in this.map) {
                    this.map[index].clear();
                }
                if (this.divOther == undefined) {
                    this.divOther = document.createElement("div");
                    this.divRoot.appendChild(this.divFloatSelect);
                    this.elementJqury = $(this.divOther).elementBuilder();
                }
                if (this.divComponents == undefined) {
                    this.divComponents = document.createElement("div");
                    this.divRoot.appendChild(this.divComponents);
                    this.elementJquryComponents = $(this.divComponents).elementBuilder();
                }
                if (this.divFloatSelect == undefined) {
                    this.divFloatSelect = document.createElement("div");
                    this.divRoot.appendChild(this.divFloatSelect);
                    this.elementJquryFloatSelect = $(this.divFloatSelect).elementBuilder();
                }
                $(this.divOther).empty();
                $(this.divComponents).empty();
                $(this.divFloatSelect).empty();
            };
            WidgetMgr.prototype.reset = function () {
                for (var key in this.allMap) {
                    var _map = this.allMap[key];
                    for (var ind in _map) {
                        if (_map[ind].used == false) {
                            _map[ind].widgetIns.hide();
                            _map[ind].widgetIns.remove();
                            delete _map[ind];
                        }
                        else {
                            _map[ind].used = false;
                        }
                    }
                }
                for (var key in this.tempMap) {
                    this.tempMap[key] = 0;
                }
            };
            WidgetMgr.prototype.regDefaultWidget = function (type, widget) {
                if (this.map[type] != undefined) {
                    console.error("此类型的控件已经注册：" + type);
                    return;
                }
                this.map[type] = widget;
            };
            WidgetMgr.prototype.regWidget = function (type, uistyle, widget) {
                var key = type + uistyle;
                if (this.map[key] != undefined) {
                    console.error("此类型的控件已经注册：" + type + "  " + uistyle);
                    return;
                }
                this.map[key] = widget;
            };
            WidgetMgr.prototype.getWidget = function (name) {
                return this.map[name];
            };
            WidgetMgr.prototype.addWidgetByStyle = function (type, uistyle, widgetInstance, data, funs) {
                this.addWidget(type + uistyle, widgetInstance, data, funs);
            };
            WidgetMgr.prototype.addWidget = function (type, widgetInstance, data, funs) {
                var _this = this;
                var widgetIns = this.map[type];
                if (widgetIns == null) {
                    console.error("这是个未知的组件类型：" + type);
                    return;
                }
                var singleWidgetMap;
                var widget;
                if (type == "nodeComponent") {
                    widgetIns.elementJqury = this.elementJquryComponents;
                }
                else if (type == "floatsearchselect") {
                    widgetIns.elementJqury = this.elementJquryFloatSelect;
                }
                else {
                    widgetIns.elementJqury = this.elementJqury;
                }
                widgetIns.widgetMgr = this;
                var key = this.getKey(data);
                if (data != null)
                    data["_____key"] = key;
                if (this.allMap[type] != undefined) {
                    singleWidgetMap = this.allMap[type];
                    if (singleWidgetMap[key] != undefined) {
                        var _data = singleWidgetMap[key];
                        _data.used = true;
                        widgetInstance = _data["widgetIns"];
                        var pointIns = _data["createPointIns"];
                        if (pointIns != null) {
                            widgetIns.refreshWidget(widgetInstance, data, funs, pointIns);
                        }
                        else {
                            widgetIns.refreshWidget(widgetInstance, data, funs, 0);
                        }
                    }
                    else {
                        widgetIns.createWidget(widgetInstance, data, funs, function (e, t) {
                            _this.saveToMap(type, key, e, t);
                        });
                    }
                }
                else {
                    widgetIns.createWidget(widgetInstance, data, funs, function (e, t) {
                        _this.saveToMap(type, key, e, t);
                    });
                }
            };
            WidgetMgr.prototype.getKey = function (data) {
                if (data == null || data["keys"] == undefined)
                    return "";
                var keys = data["keys"];
                var key = "";
                for (var i = 0; i < keys.length; i++) {
                    key += keys[i];
                }
                return key;
            };
            WidgetMgr.prototype.setVal = function (data, val) {
                var ins = data["dataIns"];
                var keys = data["keys"];
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (i < keys.length - 1) {
                        if (ins[key] != undefined) {
                            ins = ins[key];
                        }
                        else {
                            if (typeof (key) == "number") {
                                ins[0] = [];
                                ins = ins[0];
                            }
                            else {
                                ins[key] = {};
                            }
                        }
                    }
                    else {
                        if (typeof (ins[key]) == "boolean") {
                            ins[key] = val > 0 ? true : false;
                        }
                        else if (typeof (ins[key]) == "number") {
                            ins[key] = Number(val);
                        }
                        else {
                            ins[key] = val;
                        }
                    }
                }
                this.trans.markDirty();
            };
            WidgetMgr.prototype.saveToMap = function (widgetName, key, widget, pointIns) {
                if (this.allMap[widgetName] == undefined)
                    this.allMap[widgetName] = {};
                if (this.allMap[widgetName][key] != undefined)
                    return;
                this.allMap[widgetName][key] = { widgetIns: widget, createPointIns: pointIns, used: true };
            };
            WidgetMgr.prototype.regAllWidget = function () {
                this.regDefaultWidget("nodeComponent", new gd3d.editor.WidgetComponent());
                this.regDefaultWidget("grid", new gd3d.editor.WidgetGrid());
                this.regDefaultWidget("string", new gd3d.editor.WidgetInput());
                this.regDefaultWidget("number", new gd3d.editor.WidgetInput());
                this.regDefaultWidget("texture", new gd3d.editor.WidgetInput());
                this.regDefaultWidget("boolean", new gd3d.editor.WidgetCheckBox());
                this.regDefaultWidget("blankline", new gd3d.editor.WidgeBlankLine());
                this.regDefaultWidget("floatsearchselect", new gd3d.editor.WidgetFloatSearchSelect());
                this.regWidget("number", "Layer", new gd3d.editor.WidgetLayer());
                this.regWidget("number", "ImageType", new gd3d.editor.WidgetLayer());
                this.regWidget("number", "FillMethod", new gd3d.editor.WidgetLayer());
                this.regWidget("number", "UniformTypeEnum", new gd3d.editor.WidgetLayer());
                this.regWidget("color", "vector4", new gd3d.editor.WidgetInputArray());
                this.regDefaultWidget("vector4", new gd3d.editor.WidgetInputArray());
                this.regWidget("number", "trans", new gd3d.editor.WidgetInputSpecial());
                this.regWidget("string", "WidgetDragSelect", new gd3d.editor.WidgetDragSelect());
                this.regWidget("mesh", "WidgetDragSelect", new gd3d.editor.WidgetDragSelect());
            };
            return WidgetMgr;
        }());
        editor.WidgetMgr = WidgetMgr;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var editor;
    (function (editor) {
        var WidgetTextArea = (function () {
            function WidgetTextArea() {
            }
            WidgetTextArea.prototype.createWidget = function (instance, data, funs, func) {
                var _this = this;
                var widget = null;
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                if (dataIns != null) {
                    if (instance == null) {
                        widget = this.elementJqury.textarea({
                            "value": defaultVal, onblur: function (e, d) {
                                _this.widgetMgr.setVal(d, e.val());
                                if (funs != undefined && funs.length > 0)
                                    funs[0]();
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                    else {
                        widget = instance.textarea({
                            "value": defaultVal, onblur: function (e, d) {
                                _this.widgetMgr.setVal(d, e.val());
                                if (funs != undefined && funs.length > 0)
                                    funs[0]();
                            }, data: { "dataIns": dataIns, "keys": keys }
                        });
                    }
                }
                else {
                    if (instance == null) {
                        widget = this.elementJqury.textarea({
                            "value": defaultVal, onblur: funs != undefined && funs.length > 0 ? funs[0] : null
                        });
                    }
                    else {
                        widget = instance.textarea({
                            "value": defaultVal, onblur: funs != undefined && funs.length > 0 ? funs[0] : null
                        });
                    }
                }
                func(widget);
            };
            WidgetTextArea.prototype.refreshWidget = function (instance, data, funs, pointIns) {
                instance.show();
                var dataIns = data["dataIns"];
                var keys = data["keys"];
                var defaultVal = data["defaultVal"];
                if (dataIns != null) {
                    instance.reload({
                        "value": defaultVal, data: { "dataIns": dataIns, "keys": keys }
                    });
                }
                else {
                    instance.reload({
                        "value": defaultVal
                    });
                }
            };
            WidgetTextArea.prototype.clear = function () {
            };
            return WidgetTextArea;
        }());
        editor.WidgetTextArea = WidgetTextArea;
    })(editor = gd3d.editor || (gd3d.editor = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=plugineditor.js.map