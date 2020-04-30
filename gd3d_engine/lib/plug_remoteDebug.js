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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var gd3d;
(function (gd3d) {
    var plugins;
    (function (plugins) {
        var remoteDebug;
        (function (remoteDebug) {
            var HookEventType;
            (function (HookEventType) {
                HookEventType[HookEventType["initScene"] = 0] = "initScene";
                HookEventType[HookEventType["addChildAt"] = 1] = "addChildAt";
                HookEventType[HookEventType["removeChild"] = 2] = "removeChild";
                HookEventType[HookEventType["removeAllChild"] = 3] = "removeAllChild";
                HookEventType[HookEventType["addComponentDirect"] = 4] = "addComponentDirect";
                HookEventType[HookEventType["removeComponent"] = 5] = "removeComponent";
                HookEventType[HookEventType["dirtify"] = 6] = "dirtify";
            })(HookEventType = remoteDebug.HookEventType || (remoteDebug.HookEventType = {}));
            var EngineHook = (function () {
                function EngineHook() {
                }
                EngineHook.prototype.Event = function (transType, eventType, value) {
                    if (this.OnEvent)
                        this.OnEvent(transType, eventType, value);
                };
                EngineHook.prototype.Hook3d = function () {
                    var _this = this;
                    var initScene = gd3d.framework.application.prototype["initScene"];
                    gd3d.framework.application.prototype["initScene"] = function () {
                        initScene.call(this);
                        var root = gd3d.framework.sceneMgr.scene.getRoot();
                        _this.Event("3d", HookEventType.initScene, {
                            id: root.insId.getInsID(),
                            name: root.name
                        });
                    };
                    var addChildAt = gd3d.framework.transform.prototype.addChildAt;
                    gd3d.framework.transform.prototype.addChildAt = function (node, index) {
                        addChildAt.call(this, node, index);
                        _this.Event("3d", HookEventType.addChildAt, {
                            id: node.insId.getInsID(),
                            name: node.name,
                            parent: this.insId.getInsID(),
                            index: index,
                            localScale: this.localScale,
                            localTranslate: this.localTranslate,
                            localRotate: this.localRotate
                        });
                    };
                    var removeChild = gd3d.framework.transform.prototype.removeChild;
                    gd3d.framework.transform.prototype.removeChild = function (node) {
                        removeChild.call(this, node);
                        _this.Event("3d", HookEventType.removeChild, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            parent: node.parent ? node.parent.insId.getInsID() : 0,
                        });
                    };
                    var removeAllChild = gd3d.framework.transform.prototype.removeAllChild;
                    gd3d.framework.transform.prototype.removeAllChild = function (needDispose) {
                        removeAllChild.call(this, needDispose);
                        _this.Event("3d", HookEventType.removeAllChild, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            needDispose: needDispose,
                        });
                    };
                    var addComponentDirect = gd3d.framework.gameObject.prototype.addComponentDirect;
                    gd3d.framework.gameObject.prototype.addComponentDirect = function (comp) {
                        var ret = addComponentDirect.call(this, comp);
                        _this.Event("3d", HookEventType.addComponentDirect, {
                            id: this.transform.insId.getInsID(),
                            name: this.transform.name,
                            comp: comp.constructor.name
                        });
                        return ret;
                    };
                    var removeComponent = gd3d.framework.gameObject.prototype.removeComponent;
                    gd3d.framework.gameObject.prototype.removeComponent = function (comp) {
                        removeComponent.call(this, comp);
                        _this.Event("3d", HookEventType.removeComponent, {
                            id: this.transform.insId.getInsID(),
                            name: this.transform.name,
                            comp: comp.constructor.name
                        });
                    };
                    var dirtify = gd3d.framework.transform.prototype["dirtify"];
                    gd3d.framework.transform.prototype["dirtify"] = function (local) {
                        dirtify.call(this, local);
                        _this.Event("3d", HookEventType.removeComponent, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            local: local,
                            localScale: this.localScale,
                            localTranslate: this.localTranslate,
                            localRotate: this.localRotate
                        });
                    };
                };
                EngineHook.prototype.Hook2d = function () {
                    var _this = this;
                    var addChildAt = gd3d.framework.transform2D.prototype.addChildAt;
                    gd3d.framework.transform2D.prototype.addChildAt = function (node, index) {
                        addChildAt.call(this, node, index);
                        _this.Event("2d", HookEventType.addChildAt, {
                            id: node.insId.getInsID(),
                            name: node.name,
                            parent: node.parent ? node.parent.insId.getInsID() : 0,
                            index: index
                        });
                    };
                    var removeChild = gd3d.framework.transform2D.prototype.removeChild;
                    gd3d.framework.transform2D.prototype.removeChild = function (node) {
                        removeChild.call(this, node);
                        _this.Event("2d", HookEventType.removeComponent, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            parent: node.insId.getInsID()
                        });
                    };
                    var removeAllChild = gd3d.framework.transform2D.prototype.removeAllChild;
                    gd3d.framework.transform2D.prototype.removeAllChild = function (needDispose) {
                        removeAllChild.call(this, needDispose);
                        _this.Event("2d", HookEventType.removeAllChild, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            needDispose: needDispose
                        });
                    };
                    var addComponentDirect = gd3d.framework.transform2D.prototype.addComponentDirect;
                    gd3d.framework.transform2D.prototype.addComponentDirect = function (comp) {
                        var ret = addComponentDirect.call(this, comp);
                        _this.Event("2d", HookEventType.addComponentDirect, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            comp: comp.constructor.name
                        });
                        return ret;
                    };
                    var removeComponent = gd3d.framework.transform2D.prototype.removeComponent;
                    gd3d.framework.transform2D.prototype.removeComponent = function (comp) {
                        removeComponent.call(this, comp);
                        _this.Event("2d", HookEventType.removeComponent, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            comp: comp.constructor.name
                        });
                    };
                    var dirtify = gd3d.framework.transform2D.prototype["dirtify"];
                    gd3d.framework.transform2D.prototype["dirtify"] = function (local) {
                        dirtify.call(this, local);
                        _this.Event("2d", HookEventType.dirtify, {
                            id: this.insId.getInsID(),
                            name: this.name,
                            local: local
                        });
                    };
                };
                EngineHook.prototype.Init = function () {
                    if (!gd3d.framework) {
                        throw new Error("尚未加载引擎js!!");
                    }
                    this.Hook3d();
                    this.Hook2d();
                };
                return EngineHook;
            }());
            remoteDebug.EngineHook = EngineHook;
        })(remoteDebug = plugins.remoteDebug || (plugins.remoteDebug = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugins;
    (function (plugins) {
        var remoteDebug;
        (function (remoteDebug) {
            var conn;
            var failCount;
            var maxFailCount = 5;
            var hook;
            var log;
            var warn;
            var error;
            var sendQueue = [];
            function initConsole() {
                var log = console.log;
                var warn = console.warn;
                var error = console.error;
                console.log = function (message) {
                    var optionalParams = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        optionalParams[_i - 1] = arguments[_i];
                    }
                    log(message, optionalParams);
                    sendLog(1, message);
                };
                console.warn = function (message) {
                    var optionalParams = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        optionalParams[_i - 1] = arguments[_i];
                    }
                    warn(message, optionalParams);
                    sendLog(2, message);
                };
                console.error = function (message) {
                    var optionalParams = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        optionalParams[_i - 1] = arguments[_i];
                    }
                    error(message, optionalParams);
                    sendLog(3, message);
                };
            }
            function initConn(host) {
                return __awaiter(this, void 0, void 0, function () {
                    var success;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                conn = new remoteDebug.WSConnect(host);
                                return [4, conn.Connect()];
                            case 1:
                                success = _a.sent();
                                return [2];
                        }
                    });
                });
            }
            function sendEvent(transType, eventType, value) {
                var msg = new remoteDebug.EngineEventMessage();
                msg.eventType = eventType;
                msg.transType = transType;
                msg.data = JSON.stringify(value);
                sendCmd(msg);
            }
            function sendLog(type, message) {
                var text = message;
                if (typeof (message) != "string")
                    text = JSON.stringify(message);
                var msg = new remoteDebug.LogMessage();
                msg.type = type;
                msg.text = text;
                sendCmd(msg);
            }
            function sendCmd(msg) {
                if (!conn || !conn.IsConnect)
                    sendQueue.push(msg);
                else
                    conn.Send(msg);
            }
            function checkConnect() {
                return __awaiter(this, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(conn && !conn.IsConnect)) return [3, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, conn.Connect()];
                            case 2:
                                _a.sent();
                                return [3, 4];
                            case 3:
                                e_1 = _a.sent();
                                error(e_1);
                                ++failCount;
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                });
            }
            function update() {
                if (failCount > maxFailCount)
                    return;
                checkConnect();
                if (conn && conn.IsConnect) {
                    while (sendQueue.length > 0) {
                        var msg = sendQueue.shift();
                        conn.Send(msg);
                    }
                }
            }
            function init(host) {
                var _this = this;
                initConn(host);
                initConsole();
                hook = new remoteDebug.EngineHook();
                hook.Init();
                hook.OnEvent = function (tType, eType, value) {
                    sendEvent(tType, eType, value);
                };
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        update();
                        return [2];
                    });
                }); }, 2000);
            }
            remoteDebug.init = init;
        })(remoteDebug = plugins.remoteDebug || (plugins.remoteDebug = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugins;
    (function (plugins) {
        var remoteDebug;
        (function (remoteDebug) {
            var startTime = Date.now();
            var Message = (function () {
                function Message() {
                }
                return Message;
            }());
            remoteDebug.Message = Message;
            var ExecMessage = (function (_super) {
                __extends(ExecMessage, _super);
                function ExecMessage() {
                    var _this = _super.call(this) || this;
                    _this.curTime = Date.now();
                    _this.execTime = _this.curTime - startTime;
                    return _this;
                }
                return ExecMessage;
            }(Message));
            remoteDebug.ExecMessage = ExecMessage;
            var EngineEventMessage = (function (_super) {
                __extends(EngineEventMessage, _super);
                function EngineEventMessage() {
                    var _this = _super.call(this) || this;
                    _this.__ptlNum__ = 6;
                    return _this;
                }
                return EngineEventMessage;
            }(ExecMessage));
            remoteDebug.EngineEventMessage = EngineEventMessage;
            var LogMessage = (function (_super) {
                __extends(LogMessage, _super);
                function LogMessage() {
                    var _this = _super.call(this) || this;
                    _this.__ptlNum__ = 7;
                    return _this;
                }
                return LogMessage;
            }(ExecMessage));
            remoteDebug.LogMessage = LogMessage;
        })(remoteDebug = plugins.remoteDebug || (plugins.remoteDebug = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
var gd3d;
(function (gd3d) {
    var plugins;
    (function (plugins) {
        var remoteDebug;
        (function (remoteDebug) {
            var WSConnect = (function () {
                function WSConnect(host) {
                    this.host = host;
                    this.IsConnect = false;
                }
                WSConnect.prototype.Connect = function () {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.socket = new WebSocket(_this.host);
                        _this.socket.onclose = function () {
                            if (!_this.IsConnect)
                                resolve(false);
                            _this._Close();
                        };
                        _this.socket.onmessage = function (e) {
                            if (_this.OnRecv)
                                _this.OnRecv(e.data);
                        };
                        _this.socket.onerror = function () {
                            if (!_this.IsConnect)
                                resolve(false);
                            _this._Close();
                        };
                        _this.socket.onopen = function () {
                            _this.IsConnect = true;
                            resolve(true);
                        };
                    });
                };
                WSConnect.prototype._Close = function () {
                    this.IsConnect = false;
                    if (this.OnClose)
                        this.OnClose();
                };
                WSConnect.prototype.Send = function (data) {
                    if (this.IsConnect) {
                        this.socket.send(JSON.stringify(data));
                    }
                };
                return WSConnect;
            }());
            remoteDebug.WSConnect = WSConnect;
        })(remoteDebug = plugins.remoteDebug || (plugins.remoteDebug = {}));
    })(plugins = gd3d.plugins || (gd3d.plugins = {}));
})(gd3d || (gd3d = {}));
//# sourceMappingURL=plug_remoteDebug.js.map