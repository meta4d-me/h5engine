var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
                main.prototype.loadAssetBundle = function (url) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.assetMgr.load(url, gd3d.framework.AssetTypeEnum.Auto, function (state) {
                            if (state.isfinish) {
                                resolve(url);
                            }
                        });
                    });
                };
                main.prototype.start = function (gameStage) {
                    return __awaiter(this, void 0, void 0, function () {
                        var gdapp, cam, pviewPath, resName, prefab, trans;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    gdapp = new gd3d.framework.application();
                                    gdapp.bePlay = true;
                                    gdapp.startForCanvas(gameStage, gd3d.framework.CanvasFixedType.Free, 720);
                                    this.app = gdapp;
                                    this.assetMgr = this.app.getAssetMgr();
                                    this.scene = gd3d.framework.sceneMgr.scene;
                                    this.root = new gd3d.framework.transform();
                                    this.root.name = "pviewroot";
                                    this.root.gameObject.hideFlags = gd3d.framework.HideFlags.HideAndDontSave;
                                    this.scene.addChild(this.root);
                                    cam = this.createCamera(this.root, "pviewCam");
                                    this.pviewCam = cam;
                                    pviewPath = this.urlParam["pviewPath"];
                                    console.log("pview:Resources/" + pviewPath);
                                    return [4, this.loadAssetBundle("Resources/" + pviewPath)];
                                case 1:
                                    _a.sent();
                                    resName = pviewPath.split("/").pop().replace(".assetbundle.json", "");
                                    prefab = this.assetMgr.getAssetByName(resName + ".cprefab.json", resName + ".assetbundle.json");
                                    trans = prefab.getCloneTrans();
                                    if (trans.constructor.name == "transform2D")
                                        this.pview2DTrans(trans);
                                    else
                                        this.pview3DTrans(trans);
                                    this.handleEvent();
                                    return [2];
                            }
                        });
                    });
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
                    return __awaiter(this, void 0, void 0, function () {
                        var overlay, wwidth, hheight, isLowPix, pixChange, asp, min, max, uiRoot;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.loadAssetBundle("Resources/defFont/defFont.assetbundle.json")];
                                case 1:
                                    _a.sent();
                                    overlay = new gd3d.framework.overlay2D();
                                    overlay.scaleMode = gd3d.framework.UIScaleMode.SCALE_WITH_SCREEN_SIZE;
                                    wwidth = 1280;
                                    hheight = 720;
                                    isLowPix = this.app.canvasClientHeight <= 414;
                                    pixChange = 1;
                                    wwidth = 1280 * pixChange;
                                    hheight = 720 * pixChange;
                                    overlay.matchReference_width = wwidth;
                                    overlay.matchReference_height = hheight;
                                    overlay.screenMatchRate = 1;
                                    asp = this.app.width / this.app.height;
                                    min = 0.6;
                                    max = 1.68;
                                    asp = asp < min ? min : asp;
                                    if (asp < max) {
                                        overlay.screenMatchRate = (asp - min) / (max - min);
                                    }
                                    this.scene.mainCamera.addOverLay(overlay);
                                    uiRoot = overlay.canvas.getRoot();
                                    uiRoot.addChild(trans);
                                    trans.markDirty();
                                    return [2];
                            }
                        });
                    });
                };
                return main;
            }());
            preview.main = main;
        })(preview = plugins.preview || (plugins.preview = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=plug_preview.js.map