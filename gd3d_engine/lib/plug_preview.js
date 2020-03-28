var gd3d;
(function (gd3d) {
    var plugins;
    (function (plugins) {
        var preview;
        (function (preview) {
            var main = (function () {
                function main() {
                    this.urlParam = {};
                    window.oncontextmenu = function (e) { e.preventDefault(); };
                    this.initParam();
                }
                main.prototype.createCamera = function (parent, name) {
                    var objCam = new gd3d.framework.transform();
                    objCam.name = name;
                    parent.addChild(objCam);
                    var camera = objCam.gameObject.addComponent("camera");
                    camera.near = 0.01;
                    camera.far = 1000;
                    camera.CullingMask = gd3d.framework.CullingMask.everything;
                    objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
                    objCam.markDirty();
                    return objCam;
                };
                main.prototype.start = function (gameStage) {
                    var _this = this;
                    var gdapp = new gd3d.framework.application();
                    gdapp.bePlay = true;
                    gdapp.startForCanvas(gameStage, gd3d.framework.CanvasFixedType.Free, 720);
                    this.app = gdapp;
                    this.assetMgr = this.app.getAssetMgr();
                    this.scene = gd3d.framework.sceneMgr.scene;
                    this.root = new gd3d.framework.transform();
                    this.root.name = "pviewroot";
                    this.root.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
                    this.scene.addChild(this.root);
                    var cam = this.createCamera(this.root, "pviewCam");
                    this.pviewCam = cam;
                    var pviewPath = this.urlParam["pviewPath"];
                    console.log("pview:Resources/" + pviewPath);
                    this.assetMgr.load("Resources/" + pviewPath, gd3d.framework.AssetTypeEnum.Auto, function (state) {
                        if (state.isfinish) {
                            var resName = pviewPath.split("/").pop().replace(".assetbundle.json", "");
                            var prefab = _this.assetMgr.getAssetByName(resName + ".cprefab.json", resName + ".assetbundle.json");
                            var trans = prefab.getCloneTrans();
                            if (trans.constructor.name == "transform2D")
                                _this.pview2DTrans(trans);
                            else
                                _this.pview3DTrans(trans);
                        }
                    });
                    this.handleEvent();
                };
                main.prototype.initParam = function () {
                    var params = window.location.href.replace("?", "&").split("&");
                    for (var i = 1; i < params.length; ++i) {
                        var pair = params[i].split("=");
                        this.urlParam[pair[0]] = pair[1];
                    }
                    console.log("\u53C2\u6570:", this.urlParam);
                };
                main.prototype.handleEvent = function () {
                    var _this = this;
                    document.onmousewheel = function (e) {
                        _this.pviewCam.localTranslate.z += e.deltaY / 100;
                        _this.pviewCam.lookat(_this.root);
                        _this.pviewCam.markDirty();
                    };
                    var thita = 0;
                    document.onmousedown = function (event) {
                        event.preventDefault();
                        var ev = event;
                        document.onmousemove = function (e) {
                            e.preventDefault();
                            if (!_this.target)
                                return;
                            var ry = ev.clientY - e.clientY;
                            var rx = ev.clientX - e.clientX;
                            var vc3 = new gd3d.math.vector3(0, 0.4, 0);
                            var quat = new gd3d.math.quaternion();
                            gd3d.math.quatFromAxisAngle(vc3, rx, quat);
                            gd3d.math.quatNormalize(quat, quat);
                            gd3d.math.quatMultiply(_this.target.localRotate, quat, _this.target.localRotate);
                            gd3d.math.quatNormalize(_this.target.localRotate, _this.target.localRotate);
                            if (ry != 0) {
                                thita += ry * 0.4;
                                if (thita >= -90 && thita <= 90) {
                                    var vc3x = new gd3d.math.vector3(0.4, 0, 0);
                                    var q = new gd3d.math.quaternion();
                                    q.w = _this.target.localRotate.w;
                                    q.x = -_this.target.localRotate.x;
                                    q.y = -_this.target.localRotate.y;
                                    q.z = -_this.target.localRotate.z;
                                    gd3d.math.quatTransformVector(q, vc3x, vc3x);
                                    var quatx = new gd3d.math.quaternion();
                                    gd3d.math.quatFromAxisAngle(vc3x, -ry, quatx);
                                    gd3d.math.quatNormalize(quatx, quatx);
                                    gd3d.math.quatMultiply(_this.target.localRotate, quatx, _this.target.localRotate);
                                    gd3d.math.quatNormalize(_this.target.localRotate, _this.target.localRotate);
                                }
                                else {
                                    thita -= ry * 0.4;
                                }
                            }
                            _this.target.markDirty();
                            ev = e;
                        };
                        document.onmouseup = function (e) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            document.onmouseup = null;
                        };
                        document.onmouseout = function (e) {
                            document.onmousemove = null;
                            document.onmouseup = null;
                            document.onmouseup = null;
                        };
                    };
                };
                main.prototype.pview3DTrans = function (trans) {
                    trans.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    this.root.addChild(trans);
                    this.pviewCam.localTranslate = new gd3d.math.vector3(0, 0, 5);
                    this.pviewCam.lookat(trans);
                    this.target = trans;
                };
                main.prototype.pview2DTrans = function (trans) {
                    var overlay = new gd3d.framework.overlay2D();
                    overlay.scaleMode = gd3d.framework.UIScaleMode.SCALE_WITH_SCREEN_SIZE;
                    var wwidth = 1280;
                    var hheight = 720;
                    var isLowPix = this.app.canvasClientHeight <= 414;
                    var pixChange = 1;
                    wwidth = 1280 * pixChange;
                    hheight = 720 * pixChange;
                    overlay.matchReference_width = wwidth;
                    overlay.matchReference_height = hheight;
                    overlay.screenMatchRate = 1;
                    var asp = this.app.width / this.app.height;
                    var min = 0.6;
                    var max = 1.68;
                    asp = asp < min ? min : asp;
                    if (asp < max) {
                        overlay.screenMatchRate = (asp - min) / (max - min);
                    }
                    this.scene.mainCamera.addOverLay(overlay);
                    var uiRoot = overlay.canvas.getRoot();
                    uiRoot.addChild(trans);
                    trans.markDirty();
                };
                return main;
            }());
            preview.main = main;
        })(preview = plugins.preview || (plugins.preview = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=plug_preview.js.map