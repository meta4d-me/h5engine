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
var t;
(function (t) {
    var light_d1 = (function () {
        function light_d1() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        light_d1.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        light_d1.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/rock_n256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        light_d1.prototype.addcube = function (laststate, state) {
            var _this = this;
            var sphereString = "res/prefabs/sphere/resources/Sphere.mesh.bin";
            var cubeString = "res/prefabs/cube/resources/Cube.mesh.bin";
            this.app.getAssetMgr().load(sphereString, gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    for (var i = -4; i < 5; i++) {
                        for (var j = -4; j < 5; j++) {
                            var baihu = new gd3d.framework.transform();
                            _this.scene.addChild(baihu);
                            baihu.localScale = new gd3d.math.vector3(0.5, 0.5, 0.5);
                            baihu.localTranslate.x = i;
                            baihu.localTranslate.y = j;
                            baihu.markDirty();
                            var smesh1 = _this.app.getAssetMgr().getAssetByName("Sphere.mesh.bin");
                            var mesh1 = baihu.gameObject.addComponent("meshFilter");
                            mesh1.mesh = (smesh1);
                            var renderer = baihu.gameObject.addComponent("meshRenderer");
                            baihu.markDirty();
                            var sh = _this.app.getAssetMgr().getShader("light3.shader.json");
                            renderer.materials = [];
                            renderer.materials.push(new gd3d.framework.material());
                            renderer.materials[0].setShader(sh);
                            var texture = _this.app.getAssetMgr().getAssetByName("rock256.png");
                            renderer.materials[0].setTexture("_MainTex", texture);
                            var tex2 = _this.app.getAssetMgr().getAssetByName("rock_n256.png");
                            renderer.materials[0].setTexture("_NormalTex", tex2);
                        }
                    }
                    state.finish = true;
                }
            });
        };
        light_d1.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
            }
            state.finish = true;
        };
        light_d1.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        light_d1.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 4, -z2 * 5);
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 3, 3, z * 3);
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objlight.markDirty();
            }
        };
        return light_d1;
    }());
    t.light_d1 = light_d1;
})(t || (t = {}));
var localSave = (function () {
    function localSave() {
    }
    Object.defineProperty(localSave, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new localSave();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    localSave.prototype.stringToUtf8Array = function (str) {
        var bstr = [];
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            var cc = c.charCodeAt(0);
            if (cc > 0xFFFF) {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80) {
                if (cc < 0x07FF) {
                    var c1 = (cc >>> 6) | 0xC0;
                    var c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else {
                    var c1 = (cc >>> 12) | 0xE0;
                    var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    var c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else {
                bstr.push(cc);
            }
        }
        return bstr;
    };
    localSave.prototype.file_str2blob = function (string) {
        var u8 = new Uint8Array(this.stringToUtf8Array(string));
        var blob = new Blob([u8]);
        return blob;
    };
    localSave.prototype.file_u8array2blob = function (array) {
        var blob = new Blob([array]);
        return blob;
    };
    localSave.prototype.save = function (path, file) {
        var req = new XMLHttpRequest();
        req.open("POST", this.localServerPath + "/hybirdapi/upload" + "?r=" + Math.random(), false);
        var fdata = new FormData();
        fdata.append("path", path);
        fdata.append("file", file);
        req.send(fdata);
        var json = JSON.parse(req.responseText);
        if (json["code"] != 0)
            throw new Error(json["error"]);
        return json["code"];
    };
    localSave.prototype.startDirect = function (exec, path, argc) {
        var req = new XMLHttpRequest();
        req.open("GET", this.localServerPath + "/hybirdapi/startdirect" +
            "?exec=" + exec +
            "&path=" + path +
            "&argc=" + argc +
            "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    };
    localSave.prototype.start = function (path) {
        var req = new XMLHttpRequest();
        req.open("GET", this.localServerPath + "/hybirdapi/start?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    };
    localSave.prototype.startnowait = function (path, fun) {
        if (fun === void 0) { fun = null; }
        var req = new XMLHttpRequest();
        req.open("GET", this.localServerPath + "/hybirdapi/start?path=" + path + "&r=" + Math.random(), true);
        req.onreadystatechange = function (ev) {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    if (fun != null)
                        fun(null, new Error("got a 404:" + path));
                    return;
                }
                if (fun != null)
                    fun(req.responseText, null);
            }
        };
        req.onerror = function () {
            if (fun != null)
                fun(null, new Error("onerr in req:"));
        };
        req.send(null);
    };
    localSave.prototype.loadTextImmediate = function (url, fun) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.responseText, null);
            }
        };
        req.onerror = function () {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    };
    localSave.prototype.loadBlobImmediate = function (url, fun) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "blob";
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.response, null);
            }
        };
        req.onerror = function () {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    };
    return localSave;
}());
var main = (function () {
    function main() {
        this.x = 0;
        this.y = 100;
        this.btns = [];
    }
    main.prototype.onStart = function (app) {
        console.log("i am here.");
        this.app = app;
        this.addBtn("test_ui", function () { return new t.test_ui(); });
        this.addBtn("test_load", function () { return new test_load(); });
        this.addBtn("test_loadimmediate", function () { return new testloadImmediate(); });
        this.addBtn("test_loadprefab", function () { return new test_loadprefab(); });
        this.addBtn("test_loadScene", function () { return new test_loadScene(); });
        this.addBtn("test_loadMulBundle", function () { return new test_loadMulBundle(); });
        this.addBtn("test_pick", function () { return new test_pick(); });
        this.addBtn("test_anim", function () { return new test_anim(); });
        this.addBtn("test_multipleplayer_anim", function () { return new test_multipleplayer_anim(); });
        this.addBtn("test_reload", function () { return new testReload(); });
        this.addBtn("test_uvroll", function () { return new t.test_uvroll(); });
        this.addBtn("test_light1", function () { return new t.test_light1(); });
        this.addBtn("test_light_d1", function () { return new t.light_d1(); });
        this.addBtn("test_changeshader", function () { return new t.test_changeshader(); });
        this.addBtn("test_normalmap", function () { return new t.Test_NormalMap(); });
        this.addBtn("test_assestmgr", function () { return new test_assestmgr(); });
        this.addBtn("test_posteffect", function () { return new t.test_posteffect(); });
        this.addBtn("test_streamlight", function () { return new test_streamlight(); });
        this.addBtn("test_trailRender", function () { return new t.test_trailrender(); });
        this.addBtn("test_rendertexture", function () { return new t.test_rendertexture(); });
        this.addBtn("test_sound", function () { return new t.test_sound(); });
        this.addBtn("test_cleardepth", function () { return new t.test_clearDepth0(); });
        this.addBtn("test_fakepbr", function () { return new test_fakepbr(); });
        this.addBtn("test_metalModel", function () { return new t.test_metal(); });
        this.addBtn("test_tank", function () { return new demo.TankGame(); });
        this.addBtn("test_long", function () { return new demo.DragonTest(); });
        this.addBtn("test_lookAt", function () { return new t.TestRotate(); });
        this.addBtn("test_skillsystem", function () { return new t.test_skillsystem(); });
        this.addBtn("test_integratedrender", function () { return new t.test_integratedrender(); });
        this.addBtn("test_blend", function () { return new t.test_blend(); });
        this.addBtn("TestRotate", function () { return new t.TestRotate(); });
        this.addBtn("testtrailrenderRecorde", function () { return new t.test_trailrenderrecorde(); });
        this.addBtn("effect", function () { return new test_effect(); });
        this.addBtn("pathasset", function () { return new t.test_pathAsset(); });
        this.addBtn("test_Asi_prefab", function () { return new test_loadAsiprefab(); });
        this.addBtn("test_tex_uv", function () { return new test_texuv(); });
        this.addBtn("test_uimove", function () { return new test_uimove(); });
        this.addBtn("post_景深", function () { return new t.test_posteffect_cc(); });
        this.addBtn("test_effecteditor", function () { return new test_effecteditor(); });
        this.addBtn("test_shadowmap", function () { return new test_ShadowMap(); });
    };
    main.prototype.addBtn = function (text, act) {
        var _this = this;
        var btn = document.createElement("button");
        this.btns.push(btn);
        btn.textContent = text;
        btn.onclick = function () {
            _this.clearBtn();
            _this.state = act();
            _this.state.start(_this.app);
        };
        btn.style.top = this.y + "px";
        btn.style.left = this.x + "px";
        if (this.y + 24 > 400) {
            this.y = 100;
            this.x += 200;
        }
        else {
            this.y += 24;
        }
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
    };
    main.prototype.clearBtn = function () {
        for (var i = 0; i < this.btns.length; i++) {
            this.app.container.removeChild(this.btns[i]);
        }
        this.btns.length = 0;
    };
    main.prototype.onUpdate = function (delta) {
        if (this.state != null)
            this.state.update(delta);
    };
    main.prototype.isClosed = function () {
        return false;
    };
    main = __decorate([
        gd3d.reflect.userCode
    ], main);
    return main;
}());
var t;
(function (t_1) {
    var test_blend = (function () {
        function test_blend() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new gd3d.math.vector3(10, 0, 0);
            this.eulerAngle = gd3d.math.pool.new_vector3();
        }
        test_blend.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_blend.prototype.loadText = function (laststate, state) {
            var t = 2;
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/trailtest2.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    t--;
                    if (t == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
        };
        test_blend.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, 10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_blend.prototype.addplane = function (laststate, state) {
            {
                {
                    var background = new gd3d.framework.transform();
                    background.name = "background";
                    background.localScale.x = background.localScale.y = 5;
                    background.localTranslate.z = -1;
                    this.scene.addChild(background);
                    background.markDirty();
                    background.updateWorldTran();
                    var mesh = background.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = background.gameObject.addComponent("meshRenderer");
                    var meshRender = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json");
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new gd3d.framework.material());
                        meshRender.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.background = background;
                }
            }
            {
                {
                    var foreground = new gd3d.framework.transform();
                    foreground.name = "foreground ";
                    foreground.localScale.x = foreground.localScale.y = 5;
                    this.scene.addChild(foreground);
                    foreground.markDirty();
                    foreground.updateWorldTran();
                    var mesh = foreground.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("quad");
                    mesh.mesh = (smesh);
                    var renderer = foreground.gameObject.addComponent("meshRenderer");
                    var meshRender = renderer;
                    var sh = this.app.getAssetMgr().getShader("particles_additive.shader.json");
                    if (sh != null) {
                        meshRender.materials = [];
                        meshRender.materials.push(new gd3d.framework.material());
                        meshRender.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("trailtest2.png");
                        meshRender.materials[0].setTexture("_MainTex", texture);
                    }
                    this.foreground = foreground;
                }
            }
            state.finish = true;
        };
        test_blend.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addplane.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_blend.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.background != undefined) {
                var x = Math.cos(this.timer * 1);
                var y = Math.sin(this.timer * 1);
                this.background.localTranslate.x = 1.5 * x;
                this.background.localTranslate.y = 1.5 * y;
                this.background.markDirty();
            }
        };
        return test_blend;
    }());
    t_1.test_blend = test_blend;
})(t || (t = {}));
var test_fakepbr = (function () {
    function test_fakepbr() {
        this.timer = 0;
    }
    test_fakepbr.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/fakepbr/zhanshen.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("zhanshen.prefab.json");
                        _this.baihu = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.baihu);
                        objCam.lookat(_this.baihu);
                        objCam.markDirty();
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 0, -5);
        objCam.markDirty();
        {
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
        }
        {
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light2 = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
        }
    };
    test_fakepbr.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 2, 2, -z2 * 2);
        if (this.baihu) {
            objCam.lookatPoint(new gd3d.math.vector3(0, 1.5, 0));
            objCam.markDirty();
        }
        if (this.light != null) {
            var objlight = this.light.gameObject.transform;
            objlight.localTranslate = new gd3d.math.vector3(x * 5, 3, z * 5);
            objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            var objlight2 = this.light.gameObject.transform;
            objlight2.localTranslate = new gd3d.math.vector3(z * 5, 10, x * 5);
            objlight2.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        }
    };
    return test_fakepbr;
}());
var t;
(function (t) {
    var test_rendertexture = (function () {
        function test_rendertexture() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_rendertexture.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                state.finish = true;
            });
        };
        test_rendertexture.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_rendertexture.prototype.initscene = function (laststate, state) {
            {
                var objCam = new gd3d.framework.transform();
                objCam.name = "cam_show";
                this.scene.addChild(objCam);
                this.showcamera = objCam.gameObject.addComponent("camera");
                this.showcamera.order = 0;
                this.showcamera.near = 0.01;
                this.showcamera.far = 30;
                this.showcamera.fov = Math.PI * 0.3;
                objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
            }
            {
                var o2ds = new gd3d.framework.overlay2D();
                this.showcamera.addOverLay(o2ds);
                {
                    var t2d = new gd3d.framework.transform2D();
                    t2d.name = "ceng1";
                    t2d.localTranslate.x = 200;
                    t2d.localTranslate.y = 200;
                    t2d.width = 300;
                    t2d.height = 300;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("rawImage2D");
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png");
                    o2ds.addChild(t2d);
                }
                {
                    var cube1 = new gd3d.framework.transform();
                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 8;
                    cube1.localScale.y = 1;
                    cube1.localScale.z = 1;
                    cube1.markDirty();
                    var mesh1 = cube1.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("meshRenderer");
                }
            }
            state.finish = true;
        };
        test_rendertexture.prototype.add3dmodelbeforeUi = function (laststate, state) {
            {
                var modelcam = new gd3d.framework.transform();
                modelcam.name = "modelcam";
                this.scene.addChild(modelcam);
                this.wath_camer = modelcam.gameObject.addComponent("camera");
                this.wath_camer.order = 1;
                this.wath_camer.clearOption_Color = false;
                this.wath_camer.clearOption_Depth = true;
                this.wath_camer.CullingMask = gd3d.framework.CullingMask.modelbeforeui | gd3d.framework.CullingMask.ui;
                modelcam.localTranslate = new gd3d.math.vector3(0, 10, -10);
                modelcam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                modelcam.markDirty();
            }
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                this.scene.addChild(cube);
                cube.localScale.x = 3;
                cube.localScale.y = 3;
                cube.localScale.z = 3;
                cube.markDirty();
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                renderer.renderLayer = gd3d.framework.CullingMask.modelbeforeui;
                var cuber = renderer;
                this.sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (this.sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(this.sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.target = cube;
                {
                    var o2d1 = new gd3d.framework.overlay2D();
                    this.wath_camer.addOverLay(o2d1);
                    {
                        var t2d = new gd3d.framework.transform2D();
                        t2d.name = "ceng2";
                        t2d.localTranslate.x = 300;
                        t2d.localTranslate.y = 100;
                        t2d.width = 150;
                        t2d.height = 150;
                        t2d.pivot.x = 0;
                        t2d.pivot.y = 0;
                        t2d.markDirty();
                        var rawiamge = t2d.addComponent("rawImage2D");
                        rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("zg256.png");
                        o2d1.addChild(t2d);
                    }
                }
            }
            state.finish = true;
        };
        test_rendertexture.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.add3dmodelbeforeUi.bind(this));
        };
        test_rendertexture.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            if (this.target == undefined)
                return;
            this.timer += delta;
            gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();
        };
        return test_rendertexture;
    }());
    t.test_rendertexture = test_rendertexture;
})(t || (t = {}));
var demo;
(function (demo) {
    var DragonTest = (function () {
        function DragonTest() {
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        DragonTest.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        };
        DragonTest.prototype.loadLongPrefab = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/long/long.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("long.prefab.json");
                    _this.dragon = _prefab.getCloneTrans();
                    _this.scene.addChild(_this.dragon);
                    _this.dragon.markDirty();
                    _this.camTran = _this.dragon.find("Dummy001");
                    state.finish = true;
                }
            });
        };
        DragonTest.prototype.loadScene = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/scenes/test_scene/test_scene.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _scene = _this.app.getAssetMgr().getAssetByName("test_scene.scene.json");
                    var _root = _scene.getSceneRoot();
                    _this.scene.addChild(_root);
                    _root.localTranslate.y = -0.1;
                    _this.app.getScene().lightmaps = [];
                    _scene.useLightMap(_this.app.getScene());
                    state.finish = true;
                }
            });
        };
        DragonTest.prototype.addCameraAndLight = function (laststate, state) {
            var tranCam = new gd3d.framework.transform();
            tranCam.name = "Cam";
            this.camTran.addChild(tranCam);
            tranCam.localEulerAngles = new gd3d.math.vector3(0, 270, 0);
            this.camera = tranCam.gameObject.addComponent("camera");
            this.camera.near = 0.001;
            this.camera.far = 200;
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3);
            tranCam.markDirty();
            var tranLight = new gd3d.framework.transform();
            tranLight.name = "light";
            this.scene.addChild(tranLight);
            this.light = tranLight.gameObject.addComponent("light");
            this.light.type = gd3d.framework.LightTypeEnum.Direction;
            tranLight.localTranslate.x = 5;
            tranLight.localTranslate.y = 5;
            tranLight.localTranslate.z = -5;
            tranLight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            tranLight.markDirty();
            state.finish = true;
        };
        DragonTest.prototype.start = function (app) {
            this.app = app;
            this.scene = app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadLongPrefab.bind(this));
            this.taskmgr.addTaskCall(this.addCameraAndLight.bind(this));
        };
        DragonTest.prototype.update = function (delta) {
            this.taskmgr.move(delta);
        };
        return DragonTest;
    }());
    demo.DragonTest = DragonTest;
})(demo || (demo = {}));
var ShockType;
(function (ShockType) {
    ShockType[ShockType["Vertical"] = 0] = "Vertical";
    ShockType[ShockType["Horizontal"] = 1] = "Horizontal";
    ShockType[ShockType["Both"] = 2] = "Both";
})(ShockType || (ShockType = {}));
var CameraShock = (function () {
    function CameraShock() {
    }
    CameraShock.prototype.start = function () {
        this.isPlaying = false;
    };
    CameraShock.prototype.play = function (strength, life, fade, shockType) {
        if (strength === void 0) { strength = 0.2; }
        if (life === void 0) { life = 0.5; }
        if (fade === void 0) { fade = false; }
        if (shockType === void 0) { shockType = ShockType.Both; }
        if (this.oldTranslate == null)
            this.oldTranslate = new gd3d.math.vector3();
        gd3d.math.vec3Clone(this.gameObject.transform.localTranslate, this.oldTranslate);
        this.isPlaying = true;
        this.strength = strength;
        this.ticker = this.life = life;
        this.fade = fade;
        this.shockType = shockType;
    };
    CameraShock.prototype.update = function (delta) {
        if (this.isPlaying) {
            if (this.ticker > 0) {
                this.ticker -= delta;
                var s = this.fade ? this.strength * (this.ticker / this.life) : this.strength;
                if (this.shockType == ShockType.Horizontal || this.shockType == ShockType.Both)
                    this.gameObject.transform.localTranslate.x = this.oldTranslate.x + (Math.random() - 0.5) * s;
                if (this.shockType == ShockType.Vertical || this.shockType == ShockType.Both)
                    this.gameObject.transform.localTranslate.y = this.oldTranslate.y + (Math.random() - 0.5) * s;
                this.gameObject.transform.markDirty();
            }
            else {
                this.gameObject.transform.localTranslate.x = this.oldTranslate.x;
                this.gameObject.transform.localTranslate.y = this.oldTranslate.y;
                this.isPlaying = false;
            }
        }
    };
    CameraShock.prototype.remove = function () {
    };
    CameraShock.prototype.clone = function () {
    };
    CameraShock = __decorate([
        gd3d.reflect.nodeComponent
    ], CameraShock);
    return CameraShock;
}());
var Joystick = (function () {
    function Joystick() {
        this.taskmgr = new gd3d.framework.taskMgr();
        this.leftAxis = new gd3d.math.vector2(0, 0);
        this.rightAxis = new gd3d.math.vector2(0, 0);
        this.maxScale = 128;
        this.touchLeft = 0;
        this.touchRight = 0;
        this.mouseLeft = false;
        this.mouseRight = false;
    }
    Joystick.prototype.init = function (app, overlay2d) {
        var _this = this;
        this.app = app;
        this.overlay2d = overlay2d;
        this.taskmgr.addTaskCall(this.loadTexture.bind(this));
        this.taskmgr.addTaskCall(this.addJoystick.bind(this));
        document.addEventListener("mousedown", function (e) { _this.onMouseDown(e); });
        document.addEventListener("mouseup", function (e) { _this.onMouseUp(e); });
        document.addEventListener("mousemove", function (e) { _this.onMouseMove(e); });
        document.addEventListener("touchstart", function (e) { _this.onTouchStart(e); e.preventDefault(); });
        document.addEventListener("touchend", function (e) { _this.onTouchEnd(e); e.preventDefault(); });
        document.addEventListener("touchmove", function (e) { _this.onTouchMove(e); e.preventDefault(); });
    };
    Joystick.prototype.loadTexture = function (laststate, state) {
        var _this = this;
        this.app.getAssetMgr().load("res/joystick0.png", gd3d.framework.AssetTypeEnum.Auto, function (s0) {
            if (s0.isfinish) {
                _this.app.getAssetMgr().load("res/joystick1.png", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                    if (s1.isfinish) {
                        state.finish = true;
                    }
                    else {
                        state.error = true;
                    }
                });
            }
            else {
                state.error = true;
            }
        });
    };
    Joystick.prototype.addJoystick = function (laststate, state) {
        {
            this.joystickLeft0 = new gd3d.framework.transform2D();
            this.joystickLeft0.name = "left0";
            this.joystickLeft0.width = 256;
            this.joystickLeft0.height = 256;
            this.joystickLeft0.pivot = new gd3d.math.vector2(0.5, 0.5);
            this.joystickLeft0.localTranslate = new gd3d.math.vector2(window.innerWidth * 0.16, window.innerHeight * 0.75);
            var img0 = this.joystickLeft0.addComponent("image2D");
            img0.imageType = gd3d.framework.ImageType.Simple;
            var tex0 = this.app.getAssetMgr().getAssetByName("joystick0.png");
            img0.setTexture(tex0);
            this.overlay2d.addChild(this.joystickLeft0);
            this.joystickLeft0.markDirty();
            this.joystickLeft1 = new gd3d.framework.transform2D();
            this.joystickLeft1.name = "left1";
            this.joystickLeft1.width = 256;
            this.joystickLeft1.height = 256;
            this.joystickLeft1.pivot = new gd3d.math.vector2(0.5, 0.5);
            this.joystickLeft1.localTranslate = new gd3d.math.vector2(window.innerWidth * 0.16, window.innerHeight * 0.75);
            var img1 = this.joystickLeft1.addComponent("image2D");
            img1.imageType = gd3d.framework.ImageType.Simple;
            var tex1 = this.app.getAssetMgr().getAssetByName("joystick1.png");
            img1.setTexture(tex1);
            this.overlay2d.addChild(this.joystickLeft1);
            this.joystickLeft1.markDirty();
        }
        {
            this.joystickRight0 = new gd3d.framework.transform2D();
            this.joystickRight0.name = "right0";
            this.joystickRight0.width = 256;
            this.joystickRight0.height = 256;
            this.joystickRight0.pivot = new gd3d.math.vector2(0.5, 0.5);
            this.joystickRight0.localTranslate = new gd3d.math.vector2(window.innerWidth * 0.84, window.innerHeight * 0.75);
            var img0 = this.joystickRight0.addComponent("image2D");
            img0.imageType = gd3d.framework.ImageType.Simple;
            var tex0 = this.app.getAssetMgr().getAssetByName("joystick0.png");
            img0.setTexture(tex0);
            this.overlay2d.addChild(this.joystickRight0);
            this.joystickRight0.markDirty();
            this.joystickRight1 = new gd3d.framework.transform2D();
            this.joystickRight1.name = "right1";
            this.joystickRight1.width = 256;
            this.joystickRight1.height = 256;
            this.joystickRight1.pivot = new gd3d.math.vector2(0.5, 0.5);
            this.joystickRight1.localTranslate = new gd3d.math.vector2(window.innerWidth * 0.84, window.innerHeight * 0.75);
            var img1 = this.joystickRight1.addComponent("image2D");
            img1.imageType = gd3d.framework.ImageType.Simple;
            var tex1 = this.app.getAssetMgr().getAssetByName("joystick1.png");
            img1.setTexture(tex1);
            this.overlay2d.addChild(this.joystickRight1);
            this.joystickRight1.markDirty();
        }
        state.finish = true;
    };
    Object.defineProperty(Joystick.prototype, "leftTouching", {
        get: function () {
            return this.touchLeft != 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Joystick.prototype, "rightTouching", {
        get: function () {
            return this.touchRight != 0;
        },
        enumerable: true,
        configurable: true
    });
    Joystick.prototype.onMouseDown = function (e) {
        if (e.clientX <= this.overlay2d.canvas.pixelWidth / 2) {
            this.mouseLeft = true;
            var v = new gd3d.math.vector2(e.clientX, e.clientY);
            gd3d.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.clientX;
                this.joystickLeft1.localTranslate.y = e.clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else {
            this.mouseRight = true;
            var v = new gd3d.math.vector2(e.clientX, e.clientY);
            gd3d.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.clientX;
                this.joystickRight1.localTranslate.y = e.clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    };
    Joystick.prototype.onMouseUp = function (e) {
        if (this.mouseRight) {
            if (this.triggerFunc != null) {
                this.triggerFunc();
            }
        }
        this.mouseLeft = false;
        this.joystickLeft1.localTranslate.x = this.joystickLeft0.localTranslate.x;
        this.joystickLeft1.localTranslate.y = this.joystickLeft0.localTranslate.y;
        this.leftAxis = new gd3d.math.vector2(0, 0);
        this.joystickLeft1.markDirty();
        this.mouseRight = false;
        this.joystickRight1.localTranslate.x = this.joystickRight0.localTranslate.x;
        this.joystickRight1.localTranslate.y = this.joystickRight0.localTranslate.y;
        this.rightAxis = new gd3d.math.vector2(0, 0);
        this.joystickRight1.markDirty();
    };
    Joystick.prototype.onMouseMove = function (e) {
        if (this.mouseLeft) {
            var v = new gd3d.math.vector2(e.clientX, e.clientY);
            gd3d.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.clientX;
                this.joystickLeft1.localTranslate.y = e.clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        if (this.mouseRight) {
            var v = new gd3d.math.vector2(e.clientX, e.clientY);
            gd3d.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.clientX;
                this.joystickRight1.localTranslate.y = e.clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    };
    Joystick.prototype.onTouchStart = function (e) {
        if (e.touches[0].clientX <= this.overlay2d.canvas.pixelWidth / 2) {
            this.touchLeft = e.touches[0].identifier;
            var v = new gd3d.math.vector2(e.touches[0].clientX, e.touches[0].clientY);
            gd3d.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.touches[0].clientX;
                this.joystickLeft1.localTranslate.y = e.touches[0].clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else {
            this.touchRight = e.touches[0].identifier;
            var v = new gd3d.math.vector2(e.touches[0].clientX, e.touches[0].clientY);
            gd3d.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.touches[0].clientX;
                this.joystickRight1.localTranslate.y = e.touches[0].clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
        if (e.touches[1] != null && e.touches[1].clientX <= this.overlay2d.canvas.pixelWidth / 2 && this.touchLeft == 0) {
            this.touchLeft = e.touches[1].identifier;
            var v = new gd3d.math.vector2(e.touches[1].clientX, e.touches[1].clientY);
            gd3d.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
            }
            else {
                this.joystickLeft1.localTranslate.x = e.touches[1].clientX;
                this.joystickLeft1.localTranslate.y = e.touches[1].clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
            this.joystickLeft1.markDirty();
        }
        else if (e.touches[1] != null && e.touches[1].clientX > this.overlay2d.canvas.pixelWidth / 2 && this.touchRight == 0) {
            this.touchRight = e.touches[1].identifier;
            var v = new gd3d.math.vector2(e.touches[1].clientX, e.touches[1].clientY);
            gd3d.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
            if (gd3d.math.vec2Length(v) > this.maxScale) {
                gd3d.math.vec2Normalize(v, v);
                gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                gd3d.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
            }
            else {
                this.joystickRight1.localTranslate.x = e.touches[1].clientX;
                this.joystickRight1.localTranslate.y = e.touches[1].clientY;
            }
            gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
            this.joystickRight1.markDirty();
        }
    };
    Joystick.prototype.onTouchEnd = function (e) {
        if (this.touchLeft) {
            var flag = false;
            for (var i = 0; i < e.touches.length; i++) {
                if (this.touchLeft == e.touches[i].identifier) {
                    flag = true;
                }
            }
            if (!flag) {
                this.touchLeft = 0;
                this.joystickLeft1.localTranslate.x = this.joystickLeft0.localTranslate.x;
                this.joystickLeft1.localTranslate.y = this.joystickLeft0.localTranslate.y;
                this.leftAxis.x = 0;
                this.leftAxis.y = 0;
                this.joystickLeft1.markDirty();
            }
        }
        if (this.touchRight) {
            var flag = false;
            for (var i = 0; i < e.touches.length; i++) {
                if (this.touchRight == e.touches[i].identifier) {
                    flag = true;
                }
            }
            if (!flag) {
                this.touchRight = 0;
                this.joystickRight1.localTranslate.x = this.joystickRight0.localTranslate.x;
                this.joystickRight1.localTranslate.y = this.joystickRight0.localTranslate.y;
                this.rightAxis.x = 0;
                this.rightAxis.y = 0;
                this.joystickRight1.markDirty();
                if (this.triggerFunc != null) {
                    this.triggerFunc();
                }
            }
        }
    };
    Joystick.prototype.onTouchMove = function (e) {
        if (this.touchLeft != 0) {
            var index = -1;
            if (this.touchLeft == e.touches[0].identifier) {
                index = 0;
            }
            else if (e.touches[1] != null && this.touchLeft == e.touches[1].identifier) {
                index = 1;
            }
            if (index != -1) {
                var v = new gd3d.math.vector2(e.touches[index].clientX, e.touches[index].clientY);
                gd3d.math.vec2Subtract(v, this.joystickLeft0.localTranslate, v);
                if (gd3d.math.vec2Length(v) > this.maxScale) {
                    gd3d.math.vec2Normalize(v, v);
                    gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                    gd3d.math.vec2Add(this.joystickLeft0.localTranslate, v, this.joystickLeft1.localTranslate);
                }
                else {
                    this.joystickLeft1.localTranslate.x = e.touches[index].clientX;
                    this.joystickLeft1.localTranslate.y = e.touches[index].clientY;
                }
                gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.leftAxis);
                this.joystickLeft1.markDirty();
            }
        }
        if (this.touchRight != 0) {
            var index = -1;
            if (this.touchRight == e.touches[0].identifier) {
                index = 0;
            }
            else if (e.touches[1] != null && this.touchRight == e.touches[1].identifier) {
                index = 1;
            }
            if (index != -1) {
                var v = new gd3d.math.vector2(e.touches[index].clientX, e.touches[index].clientY);
                gd3d.math.vec2Subtract(v, this.joystickRight0.localTranslate, v);
                if (gd3d.math.vec2Length(v) > this.maxScale) {
                    gd3d.math.vec2Normalize(v, v);
                    gd3d.math.vec2ScaleByNum(v, this.maxScale, v);
                    gd3d.math.vec2Add(this.joystickRight0.localTranslate, v, this.joystickRight1.localTranslate);
                }
                else {
                    this.joystickRight1.localTranslate.x = e.touches[index].clientX;
                    this.joystickRight1.localTranslate.y = e.touches[index].clientY;
                }
                gd3d.math.vec2ScaleByNum(v, 1.0 / this.maxScale, this.rightAxis);
                this.joystickRight1.markDirty();
            }
        }
    };
    Joystick.prototype.update = function (delta) {
        this.taskmgr.move(delta);
    };
    return Joystick;
}());
var demo;
(function (demo) {
    var TankGame = (function () {
        function TankGame() {
            this.cubes = [];
            this.walls = [];
            this.taskmgr = new gd3d.framework.taskMgr();
            this.tankMoveSpeed = 4;
            this.tankRotateSpeed = new gd3d.math.vector3(0, 72, 0);
            this.gunRotateSpeed = new gd3d.math.vector3(0, 150, 0);
            this.angleLimit = 5;
            this.colVisible = false;
            this.keyMap = {};
            this.bulletId = 0;
            this.bulletList = [];
            this.bulletSpeed = 30;
            this.fireStep = 0.5;
            this.fireTick = 0;
        }
        TankGame.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        };
        TankGame.prototype.loadTexture = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        };
        TankGame.prototype.loadHeroPrefab = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/tank01/tank01.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("tank01.prefab.json");
                    _this.heroTank = _prefab.getCloneTrans();
                    _this.scene.addChild(_this.heroTank);
                    _this.heroTank.localScale = new gd3d.math.vector3(4, 4, 4);
                    _this.heroTank.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    var col = _this.heroTank.gameObject.addComponent("boxcollider");
                    col.center = new gd3d.math.vector3(0, 0.2, 0);
                    col.size = new gd3d.math.vector3(0.46, 0.4, 0.54);
                    col.colliderVisible = _this.colVisible;
                    _this.heroGun = _this.heroTank.find("tank_up");
                    _this.heroSlot = _this.heroGun.find("slot");
                    state.finish = true;
                }
            });
        };
        TankGame.prototype.loadEnemyPrefab = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/tank02/tank02.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("tank02.prefab.json");
                    _this.enemyTank = _prefab.getCloneTrans();
                    _this.scene.addChild(_this.enemyTank);
                    _this.enemyTank.localScale = new gd3d.math.vector3(4, 4, 4);
                    _this.enemyTank.localTranslate = new gd3d.math.vector3(0, 0, -6);
                    var col = _this.enemyTank.gameObject.addComponent("boxcollider");
                    col.center = new gd3d.math.vector3(0, 0.2, 0);
                    col.size = new gd3d.math.vector3(0.46, 0.4, 0.54);
                    col.colliderVisible = _this.colVisible;
                    _this.enemyGun = _this.enemyTank.find("tank_up");
                    _this.enemySlot = _this.enemyGun.find("slot");
                    state.finish = true;
                }
            });
        };
        TankGame.prototype.loadScene = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/scenes/test_scene/test_scene.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _scene = _this.app.getAssetMgr().getAssetByName("test_scene.scene.json");
                    var _root = _scene.getSceneRoot();
                    _this.scene.addChild(_root);
                    _root.localTranslate.y = -0.1;
                    for (var i = 0; i < 8; i++) {
                        var tran = _root.find("wall" + i);
                        var col = tran.gameObject.getComponent("boxcollider");
                        col.colliderVisible = _this.colVisible;
                        _this.walls.push(tran);
                    }
                    _this.app.getScene().lightmaps = [];
                    _scene.useLightMap(_this.app.getScene());
                    state.finish = true;
                }
            });
        };
        TankGame.prototype.addCameraAndLight = function (laststate, state) {
            var _this = this;
            var tranCam = new gd3d.framework.transform();
            tranCam.name = "Cam";
            this.scene.addChild(tranCam);
            this.camera = tranCam.gameObject.addComponent("camera");
            this.camera.near = 0.1;
            this.camera.far = 200;
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3);
            this.cameraShock = tranCam.gameObject.addComponent("CameraShock");
            tranCam.localTranslate = new gd3d.math.vector3(0, 20, -16);
            tranCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            tranCam.markDirty();
            var list = [
                "标准",
                "马赛克",
                "径向模糊",
                "旋转扭曲",
                "桶模糊",
                "灰度图",
                "棕褐色调",
                "反色",
                "高斯滤波",
                "均值滤波",
                "锐化",
                "膨胀",
                "腐蚀",
                "HDR"
            ];
            var select = document.createElement("select");
            select.style.top = "240px";
            select.style.right = "0px";
            select.style.position = "absolute";
            this.app.container.appendChild(select);
            for (var i = 0; i < list.length; i++) {
                var op = document.createElement("option");
                op.value = i.toString();
                op.innerText = list[i];
                select.appendChild(op);
            }
            select.onchange = function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 2048, 2048, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                if (select.value == "0") {
                    _this.camera.postQueues = [];
                }
                else if (select.value == "1") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("mask.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "2") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("radial_blur.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_Level", 25);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "3") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("contort.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_UD", 120);
                    _this.postQuad.material.setFloat("_UR", 0.3);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "4") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("barrel_blur.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_Power", 0.3);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "5") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 1);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "6") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 2);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "7") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 3);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "8") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 4);
                    _this.postQuad.material.setFloat("_Step", 2);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "9") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 5);
                    _this.postQuad.material.setFloat("_Step", 2);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "10") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 6);
                    _this.postQuad.material.setFloat("_Step", 0.1);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "11") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 7);
                    _this.postQuad.material.setFloat("_Step", 0.3);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "12") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("filter_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_FilterType", 8);
                    _this.postQuad.material.setFloat("_Step", 0.3);
                    _this.camera.postQueues.push(_this.postQuad);
                }
                else if (select.value == "13") {
                    _this.postQuad = new gd3d.framework.cameraPostQueue_Quad();
                    _this.postQuad.material.setShader(_this.scene.app.getAssetMgr().getShader("hdr_quad.shader.json"));
                    _this.postQuad.material.setTexture("_MainTex", textcolor);
                    _this.postQuad.material.setFloat("_K", 1.5);
                    _this.camera.postQueues.push(_this.postQuad);
                }
            };
            var tranLight = new gd3d.framework.transform();
            tranLight.name = "light";
            this.scene.addChild(tranLight);
            this.light = tranLight.gameObject.addComponent("light");
            this.light.type = gd3d.framework.LightTypeEnum.Direction;
            tranLight.localTranslate.x = 5;
            tranLight.localTranslate.y = 5;
            tranLight.localTranslate.z = -5;
            tranLight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            tranLight.markDirty();
            state.finish = true;
        };
        TankGame.prototype.addJoystick = function (laststate, state) {
            var _this = this;
            this.overlay2d = new gd3d.framework.overlay2D();
            this.overlay2d.autoAsp = false;
            this.overlay2d.canvas.pixelWidth = window.innerWidth;
            this.overlay2d.canvas.pixelHeight = window.innerHeight;
            this.camera.addOverLay(this.overlay2d);
            this.joystick = new Joystick();
            this.joystick.init(this.app, this.overlay2d);
            this.joystick.triggerFunc = function () {
                if (_this.fireTick >= _this.fireStep) {
                    _this.fireTick = 0;
                    _this.fire();
                }
            };
            state.finish = true;
        };
        TankGame.prototype.addObject = function (laststate, state) {
            {
                var n = 2;
                for (var i = 0; i < n; i++) {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube" + i;
                    cube.localScale = new gd3d.math.vector3(3, 3, 3);
                    cube.localTranslate = new gd3d.math.vector3(-2 * (n - 1) + i * 4, 2, 16);
                    this.scene.addChild(cube);
                    var filter = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    filter.mesh = smesh;
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var shader = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (shader != null) {
                        renderer.materials = [];
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials[0].setShader(shader);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        renderer.materials[0].setTexture("_MainTex", texture);
                    }
                    var col = cube.gameObject.addComponent("boxcollider");
                    col.colliderVisible = this.colVisible;
                    cube.markDirty();
                    this.cubes.push(cube);
                }
            }
            state.finish = true;
        };
        TankGame.prototype.start = function (app) {
            var _this = this;
            this.label = document.getElementById("Label");
            this.app = app;
            this.scene = app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.loadHeroPrefab.bind(this));
            this.taskmgr.addTaskCall(this.loadEnemyPrefab.bind(this));
            this.taskmgr.addTaskCall(this.loadScene.bind(this));
            this.taskmgr.addTaskCall(this.addCameraAndLight.bind(this));
            this.taskmgr.addTaskCall(this.addObject.bind(this));
            this.taskmgr.addTaskCall(this.addJoystick.bind(this));
            document.addEventListener("keydown", function (e) { _this.keyMap[e.keyCode] = true; });
        };
        TankGame.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            if (this.joystick != null) {
                this.joystick.update(delta);
            }
            this.tankControl(delta);
            this.updateBullet(delta);
            for (var i = 0; i < this.bulletList.length; i++) {
                var col = this.bulletList[i].transform.gameObject.getComponent("boxcollider");
                for (var j = 0; j < this.cubes.length; j++) {
                    var c = this.cubes[j];
                    if (c != null && col.intersectsTransform(c)) {
                        this.scene.removeChild(c);
                        c.dispose();
                        this.bulletList[i].life = 0;
                        break;
                    }
                }
            }
            this.fireTick += delta;
        };
        TankGame.prototype.testTankCol = function (tran) {
            var col = tran.gameObject.getComponent("boxcollider");
            for (var i = 0; i < this.cubes.length; i++) {
                var c_1 = this.cubes[i].gameObject.getComponent("boxcollider");
                if (c_1 != null && col.obb.intersects(c_1.obb)) {
                    return true;
                }
            }
            for (var i = 0; i < this.walls.length; i++) {
                var c_2 = this.walls[i].gameObject.getComponent("boxcollider");
                if (col.obb.intersects(c_2.obb)) {
                    return true;
                }
            }
            var c = this.enemyTank.gameObject.getComponent("boxcollider");
            if (col.obb.intersects(c.obb)) {
                return true;
            }
            return false;
        };
        TankGame.prototype.tankControl = function (delta) {
            if (this.joystick != null) {
                var targetAngle = new gd3d.math.vector3();
                var goForward = true;
                if (gd3d.math.vec2Length(this.joystick.leftAxis) > 0.05) {
                    var point = new gd3d.math.vector3(this.joystick.leftAxis.x, 0, -this.joystick.leftAxis.y);
                    gd3d.math.vec3Add(this.heroTank.getWorldTranslate(), point, point);
                    var quat = new gd3d.math.quaternion();
                    gd3d.math.quatLookat(this.heroTank.getWorldTranslate(), point, quat);
                    gd3d.math.quatToEulerAngles(quat, targetAngle);
                    var rotateSpeed = new gd3d.math.vector3();
                    gd3d.math.vec3ScaleByNum(this.tankRotateSpeed, delta, rotateSpeed);
                    var d = Math.abs(this.heroTank.localEulerAngles.y - targetAngle.y);
                    if (d > 180) {
                        d = 360 - d;
                    }
                    if (d <= 90) {
                        goForward = true;
                    }
                    else {
                        if (targetAngle.y > 0) {
                            targetAngle.y -= 180;
                        }
                        else {
                            targetAngle.y += 180;
                        }
                        goForward = false;
                    }
                    if (d > rotateSpeed.y) {
                        var vec = new gd3d.math.vector3();
                        if (this.heroTank.localEulerAngles.y > targetAngle.y && this.heroTank.localEulerAngles.y - targetAngle.y < 180
                            || targetAngle.y > this.heroTank.localEulerAngles.y && targetAngle.y - this.heroTank.localEulerAngles.y >= 180) {
                            gd3d.math.vec3Subtract(this.heroTank.localEulerAngles, rotateSpeed, vec);
                        }
                        else {
                            gd3d.math.vec3Add(this.heroTank.localEulerAngles, rotateSpeed, vec);
                        }
                        this.heroTank.localEulerAngles = vec;
                    }
                    else {
                        this.heroTank.localEulerAngles = targetAngle;
                    }
                    this.heroTank.markDirty();
                }
                if (gd3d.math.vec2Length(this.joystick.leftAxis) > 0.05) {
                    var speed = 0;
                    if (Math.abs(this.heroTank.localEulerAngles.y - targetAngle.y) < this.angleLimit) {
                        speed = this.tankMoveSpeed * delta;
                    }
                    else {
                        speed = this.tankMoveSpeed * delta * 0.8;
                    }
                    var v = new gd3d.math.vector3();
                    this.heroTank.getForwardInWorld(v);
                    gd3d.math.vec3ScaleByNum(v, speed, v);
                    if (!goForward) {
                        gd3d.math.vec3ScaleByNum(v, -1, v);
                    }
                    var col = this.heroTank.gameObject.getComponent("boxcollider");
                    var f = false;
                    var r = false;
                    var l = false;
                    gd3d.math.vec3Add(col.obb.center, v, col.obb.center);
                    f = this.testTankCol(this.heroTank);
                    gd3d.math.vec3Subtract(col.obb.center, v, col.obb.center);
                    var q = new gd3d.math.quaternion();
                    var v1 = new gd3d.math.vector3();
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, 45, q);
                    gd3d.math.quatTransformVector(q, v, v1);
                    gd3d.math.vec3ScaleByNum(v1, 0.5, v1);
                    gd3d.math.vec3Add(col.obb.center, v1, col.obb.center);
                    r = this.testTankCol(this.heroTank);
                    gd3d.math.vec3Subtract(col.obb.center, v1, col.obb.center);
                    var v2 = new gd3d.math.vector3();
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, -45, q);
                    gd3d.math.quatTransformVector(q, v, v2);
                    gd3d.math.vec3ScaleByNum(v2, 0.5, v2);
                    gd3d.math.vec3Add(col.obb.center, v2, col.obb.center);
                    l = this.testTankCol(this.heroTank);
                    gd3d.math.vec3Subtract(col.obb.center, v2, col.obb.center);
                    if (!f) {
                        gd3d.math.vec3Add(this.heroTank.localTranslate, v, this.heroTank.localTranslate);
                    }
                    else if (!r && l) {
                        gd3d.math.vec3Add(this.heroTank.localTranslate, v1, this.heroTank.localTranslate);
                    }
                    else if (r && !l) {
                        gd3d.math.vec3Add(this.heroTank.localTranslate, v2, this.heroTank.localTranslate);
                    }
                    this.heroTank.markDirty();
                }
                if (gd3d.math.vec2Length(this.joystick.rightAxis) > 0.2) {
                    var point = new gd3d.math.vector3(this.joystick.rightAxis.x, 0, -this.joystick.rightAxis.y);
                    gd3d.math.vec3Add(this.heroGun.getWorldTranslate(), point, point);
                    var quat = new gd3d.math.quaternion();
                    gd3d.math.quatLookat(this.heroGun.getWorldTranslate(), point, quat);
                    var vec = new gd3d.math.vector3();
                    gd3d.math.quatToEulerAngles(quat, vec);
                    gd3d.math.vec3Subtract(vec, this.heroTank.localEulerAngles, vec);
                    if (vec.y > 180) {
                        vec.y -= 360;
                    }
                    if (vec.y < -180) {
                        vec.y += 360;
                    }
                    var rotateSpeed = new gd3d.math.vector3();
                    gd3d.math.vec3ScaleByNum(this.gunRotateSpeed, delta, rotateSpeed);
                    if (Math.abs(this.heroGun.localEulerAngles.y - vec.y) > rotateSpeed.y) {
                        if (this.heroGun.localEulerAngles.y > vec.y && this.heroGun.localEulerAngles.y - vec.y < 180
                            || vec.y > this.heroGun.localEulerAngles.y && vec.y - this.heroGun.localEulerAngles.y >= 180) {
                            gd3d.math.vec3Subtract(this.heroGun.localEulerAngles, rotateSpeed, vec);
                        }
                        else {
                            gd3d.math.vec3Add(this.heroGun.localEulerAngles, rotateSpeed, vec);
                        }
                        this.heroGun.localEulerAngles = vec;
                    }
                    else {
                        this.heroGun.localEulerAngles = vec;
                    }
                    this.heroGun.markDirty();
                }
                if (this.camera != null) {
                    this.camera.gameObject.transform.localTranslate.x = this.heroTank.localTranslate.x;
                    this.camera.gameObject.transform.localTranslate.y = this.heroTank.localTranslate.y + 20;
                    this.camera.gameObject.transform.localTranslate.z = this.heroTank.localTranslate.z - 16;
                    this.camera.gameObject.transform.markDirty();
                }
            }
        };
        TankGame.prototype.fire = function () {
            var tran = new gd3d.framework.transform();
            tran.name = "bullet" + this.bulletId;
            tran.localScale = new gd3d.math.vector3(0.2, 0.2, 0.2);
            tran.localTranslate = this.heroSlot.getWorldTranslate();
            this.scene.addChild(tran);
            var filter = tran.gameObject.addComponent("meshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("sphere");
            filter.mesh = smesh;
            var renderer = tran.gameObject.addComponent("meshRenderer");
            var shader = this.app.getAssetMgr().getShader("light1.shader.json");
            if (shader != null) {
                renderer.materials = [];
                renderer.materials.push(new gd3d.framework.material());
                renderer.materials[0].setShader(shader);
                var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                renderer.materials[0].setTexture("_MainTex", texture);
            }
            var col = tran.gameObject.addComponent("boxcollider");
            col.size = new gd3d.math.vector3(0.2, 0.2, 0.2);
            col.colliderVisible = this.colVisible;
            tran.markDirty();
            var dir = new gd3d.math.vector3();
            this.heroGun.getForwardInWorld(dir);
            var bullet = {
                id: this.bulletId++,
                transform: tran,
                direction: dir,
                life: 3
            };
            this.bulletList.push(bullet);
        };
        TankGame.prototype.updateBullet = function (delta) {
            for (var i = 0; i < this.bulletList.length; i++) {
                var b = this.bulletList[i];
                var v = gd3d.math.pool.new_vector3();
                var speed = gd3d.math.pool.new_vector3();
                gd3d.math.vec3ScaleByNum(b.direction, this.bulletSpeed * delta, speed);
                gd3d.math.vec3Add(b.transform.localTranslate, speed, v);
                b.transform.localTranslate = v;
                b.transform.markDirty();
                b.life -= delta;
            }
            for (var i = 0; i < this.bulletList.length; i++) {
                var b = this.bulletList[i];
                if (b.life <= 0) {
                    this.bulletList.splice(i, 1);
                    this.scene.removeChild(b.transform);
                    b.transform.dispose();
                }
            }
        };
        return TankGame;
    }());
    demo.TankGame = TankGame;
})(demo || (demo = {}));
var t;
(function (t) {
    var test_three_leaved_rose_curve = (function () {
        function test_three_leaved_rose_curve() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new gd3d.math.vector3(10, 0, 0);
            this.eulerAngle = gd3d.math.pool.new_vector3();
            this.zeroPoint = new gd3d.math.vector3(0, 0, 0);
        }
        test_three_leaved_rose_curve.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/trailtest2_00000.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.loadRole = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/dragon/dragon.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("dragon.prefab.json");
                    _this.role = _prefab.getCloneTrans();
                    _this.role.name = "dragon";
                    _this.scene.addChild(_this.role);
                    var trailtrans = new gd3d.framework.transform();
                    trailtrans.localTranslate.y = 0.005;
                    _this.role.addChild(trailtrans);
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender");
                    trailrender.setspeed(0.35);
                    trailrender.setWidth(0.5);
                    var mat = new gd3d.framework.material();
                    var shader = _this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = _this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                    state.finish = true;
                }
            });
        };
        test_three_leaved_rose_curve.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 1000;
            objCam.localTranslate = new gd3d.math.vector3(0, 10, 10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_three_leaved_rose_curve.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = 0.5;
                    cube.localScale.z = 2;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                    var trailtrans = new gd3d.framework.transform();
                    trailtrans.localTranslate.z = -0.5;
                    this.cube.addChild(trailtrans);
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, 90, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender");
                    trailrender.setspeed(0.25);
                    trailrender.setWidth(0.25);
                    var mat = new gd3d.framework.material();
                    var shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                }
                {
                    var ref_cube = new gd3d.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 1;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("shader/def");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = ref_cube;
                }
            }
            state.finish = true;
        };
        test_three_leaved_rose_curve.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_three_leaved_rose_curve.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.role != null) {
                var a = 5;
                {
                    var theta = this.timer * 0.5;
                    this.role.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.role.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    var deltaTheta = this.timer * 0.5 + 0.001;
                    var targetPoint = gd3d.math.pool.new_vector3();
                    targetPoint.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.role.lookatPoint(targetPoint);
                    gd3d.math.pool.delete_vector3(targetPoint);
                    var q = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatFromEulerAngles(-90, 0, 0, q);
                    gd3d.math.quatMultiply(this.role.localRotate, q, this.role.localRotate);
                    gd3d.math.pool.delete_quaternion(q);
                }
                this.role.markDirty();
                this.role.updateWorldTran();
            }
            if (this.cube != null) {
                var a = 5;
                {
                    var theta = this.timer * 0.5;
                    this.cube.localTranslate.x = a * Math.cos(3 * theta) * Math.cos(theta);
                    this.cube.localTranslate.z = a * Math.cos(3 * theta) * Math.sin(theta);
                }
                {
                    var deltaTheta = this.timer * 0.5 + 0.001;
                    var targetPoint = gd3d.math.pool.new_vector3();
                    targetPoint.x = a * Math.cos(3 * deltaTheta) * Math.cos(deltaTheta);
                    targetPoint.z = a * Math.cos(3 * deltaTheta) * Math.sin(deltaTheta);
                    this.cube.lookatPoint(targetPoint);
                    gd3d.math.pool.delete_vector3(targetPoint);
                }
                this.cube.markDirty();
                this.cube.updateWorldTran();
            }
            if (this.cube2) {
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
        };
        return test_three_leaved_rose_curve;
    }());
    t.test_three_leaved_rose_curve = test_three_leaved_rose_curve;
})(t || (t = {}));
var test_uimove = (function () {
    function test_uimove() {
        this.timer = 0;
    }
    test_uimove.prototype.start = function (app) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.markDirty();
        this.test();
    };
    test_uimove.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
    };
    test_uimove.prototype.test = function () {
        var parentRect = new Rect();
        parentRect.width = 600;
        parentRect.height = 400;
        parentRect.children = [];
        var childRect = new Rect();
        childRect.width = 300;
        childRect.height = 200;
        parentRect.children.push(childRect);
        childRect.parent = parentRect;
        childRect.alignType = AlignType.CENTER;
        parentRect.layout();
        childRect.localEulerAngles = new gd3d.math.vector3(0, 90, 0);
        var matrix = gd3d.math.pool.new_matrix();
        var qua = gd3d.math.pool.new_quaternion();
        var vec = gd3d.math.pool.new_vector3();
        gd3d.math.quatFromEulerAngles(childRect.localEulerAngles.x, childRect.localEulerAngles.y, childRect.localEulerAngles.z, qua);
        gd3d.math.vec3Add(childRect.localTranslate, childRect.alignPos, vec);
        gd3d.math.matrixMakeTransformRTS(vec, childRect.localScale, qua, matrix);
        gd3d.math.pool.delete_vector3(vec);
        gd3d.math.pool.delete_quaternion(qua);
        console.log(matrix.toString());
        for (var i = 0; i < childRect.points.length; i++) {
            console.log(i + " before: " + childRect.points[i]);
            gd3d.math.matrixTransformVector3(childRect.points[i], matrix, childRect.points[i]);
            console.log(i + " after: " + childRect.points[i]);
        }
        gd3d.math.pool.delete_matrix(matrix);
        console.log(matrix.toString());
    };
    return test_uimove;
}());
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = new gd3d.math.vector3();
        _this.children = [];
        _this.alignType = AlignType.NONE;
        _this.points = [];
        _this.alignPos = new gd3d.math.vector3();
        return _this;
    }
    Rect.prototype.layout = function () {
        if (this.parent != null && this.alignType != null) {
            switch (this.alignType) {
                case AlignType.CENTER:
                    this.alignPos = new gd3d.math.vector3(0, 0, 0);
                    break;
                case AlignType.LEFT:
                    this.alignPos = new gd3d.math.vector3(0, (this.parent.height - this.height) / 2);
                    break;
                case AlignType.RIGHT:
                    this.alignPos = new gd3d.math.vector3(this.parent.width - this.width, (this.parent.height - this.height) / 2);
                    break;
                case AlignType.TOP:
                    this.alignPos = new gd3d.math.vector3((this.parent.width - this.width) / 2, 0);
                    break;
                case AlignType.BOTTOM:
                    this.alignPos = new gd3d.math.vector3((this.parent.width - this.width) / 2, this.parent.height - this.height);
                    break;
                case AlignType.TOP_LEFT:
                    this.alignPos = new gd3d.math.vector3(0, 0);
                    break;
                case AlignType.BOTTOM_LEFT:
                    this.alignPos = new gd3d.math.vector3(0, this.parent.height - this.height);
                    break;
                case AlignType.TOP_RIGHT:
                    this.alignPos = new gd3d.math.vector3(this.parent.width - this.width, 0);
                    break;
                case AlignType.BOTTOM_RIGHT:
                    this.alignPos = new gd3d.math.vector3(this.parent.width - this.width, this.parent.height - this.height);
                    break;
            }
        }
        var pos = gd3d.math.pool.new_vector3();
        gd3d.math.vec3Add(this.alignPos, this.localTranslate, pos);
        this.points[0] = new gd3d.math.vector3(pos.x - this.width / 2, pos.y + this.height / 2, pos.z);
        this.points[1] = new gd3d.math.vector3(pos.x - this.width / 2, pos.y - this.height / 2, pos.z);
        this.points[2] = new gd3d.math.vector3(pos.x + this.width / 2, pos.y - this.height / 2, pos.z);
        this.points[3] = new gd3d.math.vector3(pos.x + this.width / 2, pos.y - this.height / 2, pos.z);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].layout();
        }
    };
    return Rect;
}(gd3d.framework.transform));
var AlignType;
(function (AlignType) {
    AlignType[AlignType["NONE"] = 0] = "NONE";
    AlignType[AlignType["CENTER"] = 1] = "CENTER";
    AlignType[AlignType["LEFT"] = 2] = "LEFT";
    AlignType[AlignType["RIGHT"] = 3] = "RIGHT";
    AlignType[AlignType["TOP"] = 4] = "TOP";
    AlignType[AlignType["BOTTOM"] = 5] = "BOTTOM";
    AlignType[AlignType["TOP_LEFT"] = 6] = "TOP_LEFT";
    AlignType[AlignType["BOTTOM_LEFT"] = 7] = "BOTTOM_LEFT";
    AlignType[AlignType["TOP_RIGHT"] = 8] = "TOP_RIGHT";
    AlignType[AlignType["BOTTOM_RIGHT"] = 9] = "BOTTOM_RIGHT";
})(AlignType || (AlignType = {}));
var test_01 = (function () {
    function test_01() {
        this.timer = 0;
    }
    test_01.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var cuber;
        for (var i = 0; i < 5; i++) {
            var cube = new gd3d.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
            cube.localTranslate.x = 2;
            var collider = cube.gameObject.addComponent("boxcollider");
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = smesh;
            var renderer = cube.gameObject.addComponent("meshRenderer");
            cube.markDirty();
            cuber = renderer;
            console.warn("Finish it.");
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
                if (state.isfinish) {
                    var sh = _this.app.getAssetMgr().getShader("color.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        _this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                console.warn("Finish load img.");
                                var texture = _this.app.getAssetMgr().getAssetByName("zg256.png");
                                cuber.materials[0].setTexture("_MainTex", texture);
                            }
                        });
                    }
                }
            });
            gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(0, 0, 1), 45, cube.localRotate);
            this.cube = cube;
            this.cube.setWorldPosition(new gd3d.math.vector3(i, 0, 0));
        }
        {
            this.cube2 = new gd3d.framework.transform();
            this.cube2.name = "cube2";
            this.scene.addChild(this.cube2);
            this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 0.5;
            var mesh = this.cube2.gameObject.addComponent("meshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube2.gameObject.addComponent("meshRenderer");
            var collider = this.cube2.gameObject.addComponent("boxcollider");
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cubesub";
                this.cube2.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                cube.localTranslate.z = 1;
                cube.localScale.x = 0.5;
                cube.localScale.y = 0.5;
                var collider = cube.gameObject.addComponent("boxcollider");
                cube.markDirty();
            }
        }
        {
        }
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(cube);
        objCam.markDirty();
        {
            var testQuat = gd3d.math.pool.new_quaternion();
        }
    };
    test_01.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        this.cube2.localTranslate = new gd3d.math.vector3(this.timer, 0, 0);
        this.cube2.markDirty();
    };
    return test_01;
}());
var test_anim = (function () {
    function test_anim() {
        this.cubes = {};
        this.timer = 0;
    }
    test_anim.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;
        this.scene.addChild(baihu);
        {
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
        }
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/elong/elong.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("elong.prefab.json");
                        baihu = _prefab.getCloneTrans();
                        _this.player = baihu;
                        _this.scene.addChild(baihu);
                        baihu.localScale = new gd3d.math.vector3(0.2, 0.2, 0.2);
                        baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        objCam.lookat(baihu);
                        objCam.markDirty();
                        var ap = baihu.gameObject.getComponent("aniplayer");
                        document.onkeydown = function (ev) {
                            if (ev.code == "KeyM") {
                                ap.playCrossByIndex(0, 0.2);
                            }
                            else if (ev.code == "KeyN") {
                                ap.playCrossByIndex(1, 0.2);
                            }
                        };
                        var wingroot = baihu.find("Bip001 Xtra17Nub");
                        var trans = new gd3d.framework.transform();
                        trans.name = "cube11";
                        var mesh = trans.gameObject.addComponent("meshFilter");
                        var smesh = _this.app.getAssetMgr().getDefaultMesh("cube");
                        mesh.mesh = smesh;
                        var renderer = trans.gameObject.addComponent("meshRenderer");
                        wingroot.addChild(trans);
                        trans.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        renderer.materials = [];
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials[0].setShader(_this.app.getAssetMgr().getShader("shader/def"));
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    test_anim.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return test_anim;
}());
var test_loadAsiprefab = (function () {
    function test_loadAsiprefab() {
        this.timer = 0;
    }
    test_loadAsiprefab.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/0001_archangel@idle_none/0001_archangel@idle_none.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("0001_archangel@idle_none.prefab.json");
                        _this.baihu = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.baihu);
                        var test = _this.baihu;
                        objCam.lookat(_this.baihu);
                        objCam.markDirty();
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 5, 5);
        objCam.markDirty();
    };
    test_loadAsiprefab.prototype.update = function (delta) {
    };
    return test_loadAsiprefab;
}());
var test_assestmgr = (function () {
    function test_assestmgr() {
        this.timer = 0;
        this.bere = false;
    }
    test_assestmgr.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.cube = new gd3d.framework.transform();
        this.scene.addChild(this.cube);
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/baihu/baihu.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.baihu = [];
                        _this._prefab = _this.app.getAssetMgr().getAssetByName("baihu.prefab.json");
                        for (var i = 0; i < 100; i++) {
                            _this.baihu[i] = _this._prefab.getCloneTrans();
                            _this.scene.addChild(_this.baihu[i]);
                            _this.baihu[i].localScale = new gd3d.math.vector3(10, 10, 10);
                            _this.baihu[i].localTranslate = new gd3d.math.vector3(0.2 * (i - 50), 0, 0);
                            _this.baihu[i].markDirty();
                            _this.scene.addChild(_this.baihu[i]);
                        }
                        objCam.lookat(_this.baihu[50]);
                        objCam.markDirty();
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        objCam.localTranslate = new gd3d.math.vector3(50, 82, -84);
        objCam.lookat(this.cube);
        objCam.markDirty();
        this.cube.localTranslate = new gd3d.math.vector3(40, 0, 10);
    };
    test_assestmgr.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 30, -z2 * 10);
        if (this.timer > 20 && !this.bere) {
            this.bere = true;
            for (var i = 0; i < 100; i++) {
                this.baihu[i].dispose();
            }
            this.app.getAssetMgr().getAssetBundle("baihu.assetbundle.json").unload();
            this.app.getAssetMgr().releaseUnuseAsset();
        }
    };
    return test_assestmgr;
}());
var t;
(function (t) {
    var test_changeshader = (function () {
        function test_changeshader() {
            this.timer = 0;
        }
        test_changeshader.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var baihu = new gd3d.framework.transform();
            baihu.name = "baihu";
            baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 20;
            this.scene.addChild(baihu);
            this.changeShader();
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
                if (state.isfinish) {
                    var prefabname = "0123_limingshibing";
                    _this.app.getAssetMgr().load("res/prefabs/0123_limingshibing/0123_limingshibing.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                        if (s.isfinish) {
                            var shizi = _this.app.getAssetMgr().getAssetByName("0123_limingshibing.prefab.json");
                            var shizi01 = shizi.getCloneTrans();
                            shizi01.localTranslate = new gd3d.math.vector3();
                            _this.scene.addChild(shizi01);
                            shizi01.markDirty();
                            var renderer = shizi01.gameObject.getComponentsInChildren(gd3d.framework.StringUtil.COMPONENT_SKINMESHRENDER);
                            _this.skinrender = renderer[0];
                        }
                    });
                }
            });
            this.cube = baihu;
            this.objCam = new gd3d.framework.transform();
            this.objCam.name = "sth.";
            this.scene.addChild(this.objCam);
            this.camera = this.objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.objCam.localTranslate = new gd3d.math.vector3(0, 12, 12);
            this.objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            this.objCam.markDirty();
        };
        test_changeshader.prototype.changeShader = function () {
            var _this = this;
            var btn = document.createElement("button");
            btn.textContent = "切换Shader到：diffuse.shader.json";
            btn.onclick = function () {
                var sh = _this.app.getAssetMgr().getShader("diffuse.shader.json");
                _this.change(sh);
            };
            btn.style.top = "160px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            var btn2 = document.createElement("button");
            btn2.textContent = "切换Shader到：transparent-diffuse.shader.json";
            btn2.onclick = function () {
                var shader = "transparent-diffuse.shader.json";
                var addshader = "transparent_additive.shader.json";
                var sh = _this.app.getAssetMgr().getShader(addshader);
                _this.change(sh);
            };
            btn2.style.top = "124px";
            btn2.style.position = "absolute";
            this.app.container.appendChild(btn2);
        };
        test_changeshader.prototype.change = function (sha) {
            var materials = this.skinrender.materials;
            for (var i = 0; i < materials.length; i++) {
                materials[i] = materials[i].clone();
                materials[i].changeShader(sha);
            }
        };
        test_changeshader.prototype.update = function (delta) {
        };
        return test_changeshader;
    }());
    t.test_changeshader = test_changeshader;
})(t || (t = {}));
var t;
(function (t) {
    var test_clearDepth0 = (function () {
        function test_clearDepth0() {
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_clearDepth0.prototype.start = function (app) {
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
        };
        test_clearDepth0.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_clearDepth0.prototype.loadTexture = function (laststate, state) {
            this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_clearDepth0.prototype.initscene = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "cam_show";
            this.scene.addChild(objCam);
            this.showcamera = objCam.gameObject.addComponent("camera");
            this.showcamera.order = 0;
            this.showcamera.near = 0.01;
            this.showcamera.far = 30;
            this.showcamera.fov = Math.PI * 0.3;
            console.log(this.showcamera.fov);
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            {
                var o2ds = new gd3d.framework.overlay2D();
                this.showcamera.addOverLay(o2ds);
                {
                    var t2d = new gd3d.framework.transform2D();
                    t2d.name = "ceng1";
                    t2d.localTranslate.x = 0;
                    t2d.localTranslate.y = 0;
                    t2d.width = 150;
                    t2d.height = 150;
                    t2d.pivot.x = 0;
                    t2d.pivot.y = 0;
                    t2d.markDirty();
                    var rawiamge = t2d.addComponent("rawImage2D");
                    rawiamge.image = this.scene.app.getAssetMgr().getAssetByName("rock256.png");
                    t2d.markDirty();
                    o2ds.addChild(t2d);
                }
                {
                    var cube1 = new gd3d.framework.transform();
                    cube1.localTranslate.x = -3;
                    cube1.name = "cube1";
                    this.scene.addChild(cube1);
                    cube1.localScale.x = 4;
                    cube1.localScale.y = 4;
                    cube1.localScale.z = 1;
                    cube1.markDirty();
                    var mesh1 = cube1.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
                    mesh1.mesh = (smesh);
                    var renderer = cube1.gameObject.addComponent("meshRenderer");
                    renderer.materials = [];
                    var mat = new gd3d.framework.material();
                    renderer.materials[0] = mat;
                    mat.setShader(this.app.getAssetMgr().getShader("diffuse.shader.json"));
                    mat.setTexture("_MainTex", this.app.getAssetMgr().getAssetByName("rock256.png"));
                }
            }
            state.finish = true;
        };
        test_clearDepth0.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            if (this.target == undefined)
                return;
            this.timer += delta;
            gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, this.timer * 3, this.target.localRotate);
            this.target.markDirty();
        };
        return test_clearDepth0;
    }());
    t.test_clearDepth0 = test_clearDepth0;
})(t || (t = {}));
var test_effect = (function () {
    function test_effect() {
        this.timer = 0;
        this.taskmgr = new gd3d.framework.taskMgr();
        this.beclone = false;
        this.effectloaded = false;
        this.bestop = false;
        this.bereplay = false;
    }
    test_effect.prototype.loadShader = function (laststate, state) {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
            if (_state.isfinish) {
                state.finish = true;
            }
        });
    };
    test_effect.prototype.loadText = function (laststate, state) {
        this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                state.finish = true;
            }
            else {
                state.error = true;
            }
        });
    };
    test_effect.prototype.addcube = function (laststate, state) {
        {
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localTranslate.x = 0;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
        }
        state.finish = true;
    };
    test_effect.prototype.loadModel = function (laststate, state) {
        var _this = this;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/fx_shuijing_cj/fx_shuijing_cj.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_s) {
                    if (_s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("fx_shuijing_cj.prefab.json");
                        _this.dragon = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.dragon);
                        state.finish = true;
                    }
                });
            }
        });
    };
    test_effect.prototype.start = function (app) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
    };
    test_effect.prototype.loadEffect = function (laststate, state) {
        var _this = this;
        var names = ["0fx_boss_02", "fx_boss_02", "fx_shengji_jiaose", "fx_ss_female@attack_03", "fx_ss_female@attack_02", "fx_0_zs_male@attack_02", "fx_shuijing_cj", "fx_fs_female@attack_02", "fx_0005_sword_sword", "fx_0005_sword_sword", "fx_0_zs_male@attack_02", "fx_fs_female@attack_02"];
        var name = names[0];
        this.app.getAssetMgr().load("res/particleEffect/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
            if (_state.isfinish) {
                _this.tr = new gd3d.framework.transform();
                _this.effect = _this.tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                var text = _this.app.getAssetMgr().getAssetByName(name + ".effect.json");
                _this.effect.setJsonData(text);
                _this.scene.addChild(_this.tr);
                _this.tr.markDirty();
                state.finish = true;
                _this.effectloaded = true;
                _this.addButton();
            }
        });
    };
    test_effect.prototype.addButton = function () {
        var _this = this;
        var btn = document.createElement("button");
        btn.textContent = "Play";
        btn.onclick = function () {
        };
        btn.style.top = "160px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
        var btn1 = document.createElement("button");
        btn1.textContent = "Save To Prefab";
        btn1.onclick = function () {
            var name = _this.tr.name;
            var _prefab = new gd3d.framework.prefab(name);
            _this.app.getAssetMgr().use(_prefab);
            _prefab.assetbundle = name;
            var path = "";
            _this.app.getAssetMgr().savePrefab(_this.tr, name, function (data, resourses) {
                console.log(data.files);
                console.log(resourses.length);
                var _loop_1 = function (key) {
                    var val = data.files[key];
                    var blob = localSave.Instance.file_str2blob(val);
                    var files = [];
                    var resPath = path + "/resources/";
                    var _loop_2 = function (i) {
                        var resourceUrl = resourses[i];
                        var resourceName = _this.getNameFromURL(resourceUrl);
                        var resourceLength = 0;
                        if (resourceName.indexOf(".txt") != -1 || resourceName.indexOf(".json")) {
                            localSave.Instance.loadTextImmediate(resourceUrl, function (_txt, _err) {
                                var blob = localSave.Instance.file_str2blob(_txt);
                                localSave.Instance.save(resPath + resourceName, blob);
                            });
                        }
                        else {
                            localSave.Instance.loadBlobImmediate(resourceUrl, function (_blob, _err) {
                                localSave.Instance.save(resPath + resourceName, _blob);
                            });
                        }
                        var fileInfo_1 = { "name": "resources/" + resourceName, "length": 100 };
                        files.push(fileInfo_1);
                    };
                    for (var i = 0; i < resourses.length; i++) {
                        _loop_2(i);
                    }
                    localSave.Instance.save(resPath + name + ".prefab.json", blob);
                    var fileInfo = { "name": "resources/" + name + ".prefab.json", "length": 100 };
                    files.push(fileInfo);
                    var assetBundleStr = JSON.stringify({ "files": files });
                    var assetBundleBlob = localSave.Instance.file_str2blob(assetBundleStr);
                    localSave.Instance.save(path + "/" + name + ".assetbundle.json", assetBundleBlob);
                };
                for (var key in data.files) {
                    _loop_1(key);
                }
            });
        };
        btn1.style.top = "320px";
        btn1.style.position = "absolute";
        this.app.container.appendChild(btn1);
    };
    test_effect.prototype.getNameFromURL = function (path) {
        var index = path.lastIndexOf("/");
        return path.substring(index + 1);
    };
    test_effect.prototype.addcam = function (laststate, state) {
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 200;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 20, 20);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    };
    test_effect.prototype.update = function (delta) {
        this.taskmgr.move(delta);
    };
    return test_effect;
}());
var t;
(function (t) {
    var test_integratedrender = (function () {
        function test_integratedrender() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.WaveFrequency = 4.0;
            this.WaveAmplitude = 0.05;
            this.play = true;
        }
        test_integratedrender.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_integratedrender.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/trailtest2_00000.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/swingFX.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_integratedrender.prototype.loadRole = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json");
                    _this.role = _prefab.getCloneTrans();
                    _this.role.name = "role";
                    _this.roleLength = _this.role.children.length;
                    _this.scene.addChild(_this.role);
                    _this.role.localScale = new gd3d.math.vector3(1, 1, 1);
                    _this.role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    _this.role.gameObject.visible = true;
                    _this.role.markDirty();
                    _this.role.updateWorldTran();
                    _this.aniplayer = _this.role.gameObject.getComponent("aniplayer");
                    state.finish = true;
                }
            });
        };
        test_integratedrender.prototype.loadWeapon = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/0002_sword_sword/0002_sword_sword.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    if (_this.weapon)
                        _this.weapon.parent.removeChild(_this.weapon);
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0002_sword_sword.prefab.json");
                    _this.weapon = _prefab.getCloneTrans();
                    _this.weapon.localScale = new gd3d.math.vector3(1, 1, 1);
                    _this.weapon.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    var obj = _this.role.find("Bip001 Prop1");
                    obj.addChild(_this.weapon);
                    state.finish = true;
                }
            });
        };
        test_integratedrender.prototype.initscene = function (laststate, state) {
            {
                var objCam = new gd3d.framework.transform();
                objCam.name = "sth.";
                this.scene.addChild(objCam);
                this.camera = objCam.gameObject.addComponent("camera");
                this.camera.near = 0.01;
                this.camera.far = 100;
                this.camera.fov = Math.PI * 0.3;
                this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
                objCam.localTranslate = new gd3d.math.vector3(0, 5, -5);
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
                {
                    var org = new gd3d.framework.transform();
                    org.name = "org";
                    this.org = org;
                    this.scene.addChild(org);
                }
                {
                    var ref_cube = new gd3d.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 5;
                    ref_cube.localTranslate.y = -2;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("rock256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = ref_cube;
                }
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    this.cube = cube;
                    org.addChild(cube);
                    cube.localTranslate.x = -5;
                    cube.markDirty();
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var trailtrans = new gd3d.framework.transform();
                    trailtrans.localTranslate.z = 2;
                    this.weapon.addChild(trailtrans);
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_right, 270, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender");
                    trailrender.setWidth(2);
                    var mat = new gd3d.framework.material();
                    var shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                    this.trailrender = trailrender;
                }
            }
            state.finish = true;
        };
        test_integratedrender.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.wind = new gd3d.math.vector4();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.loadWeapon.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            var tbn1 = this.addbtn("80px", "0px", "attack_01");
            tbn1.onclick = function () {
                _this.trailrender.play();
                var name = "attack_01.FBAni.aniclip.bin";
                _this.aniplayer.playCross(name, 0.2);
            };
            var btn = this.addbtn("120px", "0px", "attack_02");
            btn.onclick = function () {
                _this.trailrender.play();
                var name = "attack_02.FBAni.aniclip.bin";
                _this.aniplayer.playCross(name, 0.2);
            };
            var btn3 = this.addbtn("200px", "0px", "stop");
            btn3.onclick = function () {
                _this.trailrender.stop();
            };
            {
                var btn2 = this.addbtn("160px", "0px", "playAttackAni");
                btn2.onclick = function () {
                    _this.trailrender.play();
                    var name = "attack_04.FBAni.aniclip.bin";
                    _this.aniplayer.playCross(name, 0.2);
                };
            }
        };
        test_integratedrender.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
        };
        test_integratedrender.prototype.addbtn = function (top, left, text) {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = text;
            this.app.container.appendChild(btn);
            return btn;
        };
        return test_integratedrender;
    }());
    t.test_integratedrender = test_integratedrender;
})(t || (t = {}));
var t;
(function (t) {
    var test_light1 = (function () {
        function test_light1() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_light1.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_light1.prototype.loadText = function (laststate, state) {
            this.tex = new gd3d.framework.texture();
            this.tex.glTexture = new gd3d.render.WriteableTexture2D(this.app.webgl, gd3d.render.TextureFormatEnum.RGBA, 512, 512, true);
            var wt = this.tex.glTexture;
            var da = new Uint8Array(256 * 256 * 4);
            for (var x = 0; x < 256; x++)
                for (var y = 0; y < 256; y++) {
                    var seek = y * 256 * 4 + x * 4;
                    da[seek] = 235;
                    da[seek + 1] = 50;
                    da[seek + 2] = 230;
                    da[seek + 3] = 230;
                }
            wt.updateRect(da, 256, 256, 256, 256);
            var img = new Image();
            img.onload = function (e) {
                state.finish = true;
                wt.updateRectImg(img, 0, 0);
            };
            img.src = "res/zg256.png";
        };
        test_light1.prototype.addcube = function (laststate, state) {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        cuber.materials[0].setTexture("_MainTex", this.tex);
                    }
                }
            }
            state.finish = true;
        };
        test_light1.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        test_light1.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        _this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_light1.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
        };
        return test_light1;
    }());
    t.test_light1 = test_light1;
})(t || (t = {}));
var testloadImmediate = (function () {
    function testloadImmediate() {
        this.timer = 0;
    }
    testloadImmediate.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        gd3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
        this.scene.addChild(baihu);
        this.cube = baihu;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var smesh1 = _this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin");
                        var mesh1 = baihu.gameObject.addComponent("meshFilter");
                        mesh1.mesh = (smesh1);
                        var renderer = baihu.gameObject.addComponent("meshRenderer");
                        var sh = _this.app.getAssetMgr().getShader("diffuse.shader.json");
                        renderer.materials = [];
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials[0].setShader(sh);
                        renderer.materials[1].setShader(sh);
                        renderer.materials[2].setShader(sh);
                        renderer.materials[3].setShader(sh);
                        var texture1 = _this.app.getAssetMgr().loadImmediate("res/prefabs/baihu/resources/baihu.png");
                        var texture2 = _this.app.getAssetMgr().loadImmediate("res/prefabs/baihu/resources/baihuan.png");
                        var texture3 = _this.app.getAssetMgr().loadImmediate("res/prefabs/baihu/resources/baihuya.png");
                        var texture4 = _this.app.getAssetMgr().loadImmediate("res/prefabs/baihu/resources/baihumao.png");
                        renderer.materials[0].setTexture("_MainTex", texture1);
                        renderer.materials[1].setTexture("_MainTex", texture2);
                        renderer.materials[2].setTexture("_MainTex", texture3);
                        renderer.materials[3].setTexture("_MainTex", texture4);
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    testloadImmediate.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return testloadImmediate;
}());
var test_loadMulBundle = (function () {
    function test_loadMulBundle() {
        this.timer = 0;
        this.bere = false;
    }
    test_loadMulBundle.prototype.refreshTexture = function (tran) {
        var meshrenderer = tran.gameObject.getComponentsInChildren("meshRenderer");
        var skinnmeshrenderer = tran.gameObject.getComponentsInChildren("skinnedMeshRenderer");
        for (var i = 0; i < meshrenderer.length; i++) {
            var v = meshrenderer[i];
            for (var j = 0; j < v.materials.length; j++) {
                for (var k in v.materials[j].mapUniform) {
                    if (v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture) {
                        var textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname);
                        v.materials[j].setTexture(k, textur);
                    }
                }
            }
        }
        for (var i = 0; i < skinnmeshrenderer.length; i++) {
            var v = skinnmeshrenderer[i];
            for (var j = 0; j < v.materials.length; j++) {
                for (var k in v.materials[j].mapUniform) {
                    if (v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture) {
                        var textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname);
                        v.materials[j].setTexture(k, textur);
                    }
                }
            }
        }
    };
    test_loadMulBundle.prototype.refreshAniclip = function (tran) {
        var anipalyer = tran.gameObject.getComponentsInChildren("aniplayer");
        for (var i = 0; i < anipalyer.length; i++) {
            for (var j = 0; j < anipalyer[i].clips.length; j++) {
                var v = anipalyer[i].clips[j];
                anipalyer[i].clips[j] = this.app.getAssetMgr().getAssetByName(v.getName());
            }
            anipalyer[i].playByIndex(0);
        }
    };
    test_loadMulBundle.prototype.refreshLightMap = function (scene, rawscene) {
        scene.lightmaps = [];
        rawscene.resetLightMap(this.app.getAssetMgr());
        rawscene.useLightMap(this.app.getScene());
        rawscene.useFog(this.app.getScene());
    };
    test_loadMulBundle.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var names = ["MainCity", "1042_pata_shenyuan_01", "1030_huodongchuangguan", "xinshoucun_fuben_day", "chuangjue-01"];
        var name = names[0];
        var isloaded = false;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/scenes/" + name + "/meshprefab/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                    if (s1.isfinish) {
                        var _scene = _this.app.getAssetMgr().getAssetByName(name + ".scene.json");
                        var _root = _scene.getSceneRoot();
                        _this.scene.addChild(_root);
                        _root.localEulerAngles = new gd3d.math.vector3(0, 0, 0);
                        _root.markDirty();
                        _this.app.getAssetMgr().load("res/scenes/" + name + "/textures/" + name + "texture.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                _this.refreshTexture(_this.app.getScene().getRoot());
                                _this.refreshLightMap(_this.app.getScene(), _scene);
                            }
                        });
                        _this.app.getAssetMgr().load("res/scenes/" + name + "/aniclip/" + name + "aniclip.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                _this.refreshAniclip(_this.app.getScene().getRoot());
                            }
                        });
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        objCam.localTranslate = new gd3d.math.vector3(-20, 50, -20);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();
        CameraController.instance().init(this.app, this.camera);
    };
    test_loadMulBundle.prototype.update = function (delta) {
        this.timer += delta;
        CameraController.instance().update(delta);
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
    };
    return test_loadMulBundle;
}());
var test_loadScene = (function () {
    function test_loadScene() {
        this.timer = 0;
        this.bere = false;
    }
    test_loadScene.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var names = ["city", "1042_pata_shenyuan_01", "1030_huodongchuangguan", "xinshoucun_fuben_day", "chuangjue-01"];
        var name = names[0];
        var isloaded = false;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/scenes/citycompress/index.json.txt", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                    if (s1.isfinish) {
                        var index = JSON.parse(_this.app.getAssetMgr().getAssetByName("index.json.txt").content);
                        var totalLength_1 = index[name + ".assetbundle.json"];
                        _this.app.getAssetMgr().loadCompressBundle("res/scenes/citycompress/" + name + ".assetbundle.json", function (s) {
                            console.log(s.curtask + "/" + s.totaltask);
                            console.log(s.curByteLength + "/" + totalLength_1);
                            console.log(s.bundleLoadState);
                            if (s.bundleLoadState & gd3d.framework.AssetBundleLoadState.Scene && !isloaded) {
                                isloaded = true;
                                console.log(s.isfinish);
                                var _scene = _this.app.getAssetMgr().getAssetByName(name + ".scene.json");
                                var _root = _scene.getSceneRoot();
                                _this.scene.addChild(_root);
                                _root.localEulerAngles = new gd3d.math.vector3(0, 0, 0);
                                _root.markDirty();
                                _this.app.getScene().lightmaps = [];
                                _scene.useLightMap(_this.app.getScene());
                                _scene.useFog(_this.app.getScene());
                            }
                        });
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        objCam.localTranslate = new gd3d.math.vector3(-20, 50, -20);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();
        CameraController.instance().init(this.app, this.camera);
    };
    test_loadScene.prototype.update = function (delta) {
        this.timer += delta;
        CameraController.instance().update(delta);
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.5);
        var z2 = Math.cos(this.timer * 0.5);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 30, z2 * 10);
        objCam.markDirty();
    };
    return test_loadScene;
}());
var test_load = (function () {
    function test_load() {
        this.timer = 0;
    }
    test_load.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        gd3d.math.quatFromEulerAngles(-90, 0, 0, baihu.localRotate);
        this.scene.addChild(baihu);
        var lighttran = new gd3d.framework.transform();
        this.scene.addChild(lighttran);
        var light = lighttran.gameObject.addComponent("light");
        lighttran.localTranslate.x = 50;
        lighttran.localTranslate.y = 50;
        lighttran.markDirty();
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/baihu/resources/res_baihu_baihu.FBX_baihu.mesh.bin", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var smesh1 = _this.app.getAssetMgr().getAssetByName("res_baihu_baihu.FBX_baihu.mesh.bin");
                        var mesh1 = baihu.gameObject.addComponent("meshFilter");
                        mesh1.mesh = smesh1.clone();
                        var renderer = baihu.gameObject.addComponent("meshRenderer");
                        var collider = baihu.gameObject.addComponent("boxcollider");
                        baihu.markDirty();
                        var sh = _this.app.getAssetMgr().getShader("diffuse.shader.json");
                        renderer.materials = [];
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials.push(new gd3d.framework.material());
                        renderer.materials[0].setShader(sh);
                        renderer.materials[1].setShader(sh);
                        renderer.materials[2].setShader(sh);
                        renderer.materials[3].setShader(sh);
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihu.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihu.imgdesc.json");
                                renderer.materials[0].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuan.png", gd3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihuan.png");
                                renderer.materials[1].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihuya.png", gd3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihuya.png");
                                renderer.materials[2].setTexture("_MainTex", texture);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/baihu/resources/baihumao.png", gd3d.framework.AssetTypeEnum.Auto, function (s2) {
                            if (s2.isfinish) {
                                var texture = _this.app.getAssetMgr().getAssetByName("baihumao.png");
                                renderer.materials[3].setTexture("_MainTex", texture);
                            }
                        });
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    test_load.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return test_load;
}());
var t;
(function (t) {
    var test_metal = (function () {
        function test_metal() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_metal.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_metal.prototype.loadText = function (laststate, state) {
            var c = 0;
            c++;
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/rock_n256_1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/cube_texture_1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/cube_specular_1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/prefabs/cube/resources/Cube.mesh.bin", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_metal.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 3, -3);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                var tex1 = this.app.getAssetMgr().getDefaultTexture("grid");
                var mat = new gd3d.framework.material();
                mat.setShader(sh);
                mat.setTexture("_MainTex", tex1);
                renderer.materials = [];
                renderer.materials.push(mat);
                var cuber = renderer;
            }
            state.finish = true;
        };
        test_metal.prototype.addmetalmodel = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/specular/0122_huanghunshibing.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0122_huanghunshibing.prefab.json");
                    var model = _prefab.getCloneTrans();
                    model.localTranslate.x = 0;
                    model.localTranslate.y = 0;
                    model.localTranslate.z = 0;
                    _this.scene.addChild(model);
                    model.markDirty();
                    _this.model = model;
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_metal.prototype.addAsiModel = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/asi_streamlight/asi_streamlight.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("asi_streamlight.prefab.json");
                    var model = _prefab.getCloneTrans();
                    model.localTranslate.x = 0;
                    model.localTranslate.y = 0;
                    model.localTranslate.z = 0;
                    _this.scene.addChild(model);
                    model.markDirty();
                    _this.model = model;
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_metal.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addAsiModel.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
            this.addinput("260px", "0px", "diffuse", "string");
            var input = this.addinput("260px", "100px", "1");
            this.addinput("300px", "0px", "emitpower", "string");
            var input1 = this.addinput("300px", "100px", "1");
            this.diffuse = input;
            this.emitpower = input1;
        };
        test_metal.prototype.addinput = function (top, left, text, type) {
            if (type === void 0) { type = "number"; }
            var input = document.createElement("input");
            input.type = type;
            this.app.container.appendChild(input);
            input.style.top = top;
            input.style.left = left;
            input.style.position = "absolute";
            input.value = text;
            return input;
        };
        test_metal.prototype.addbtn = function (top, left, text) {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = "diffuse";
            this.app.container.appendChild(btn);
            return btn;
        };
        test_metal.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 3, 3, z * 3);
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objlight.markDirty();
            }
            if (this.model != undefined) {
                gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, this.timer * 5, this.model.localRotate);
                this.model.markDirty();
                var ss = this.model.find("0107_lmsb");
                if (ss) {
                    var meshrender = ss.gameObject.getComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER);
                    meshrender.materials[0].setFloat("_diffuse", this.diffuse.valueAsNumber);
                    meshrender.materials[0].setFloat("_emitPow", this.emitpower.valueAsNumber);
                }
            }
        };
        return test_metal;
    }());
    t.test_metal = test_metal;
})(t || (t = {}));
var test_multipleplayer_anim = (function () {
    function test_multipleplayer_anim() {
        this.cubes = {};
        this.infos = {};
        this.timer = 0;
        this.aniplayers = [];
    }
    test_multipleplayer_anim.prototype.init = function () {
        this.infos[53] = { abName: "prefabs/elong/elong.assetbundle.json", prefabName: "elong.prefab.json", materialCount: 1 };
    };
    test_multipleplayer_anim.prototype.start = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        this.init();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;
        this.scene.addChild(baihu);
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                var data_1 = _this.infos[53];
                _this.app.getAssetMgr().load("res/" + data_1.abName, gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName(data_1.prefabName);
                        var a = 10;
                        var b = 10;
                        for (var i = -10; i <= 10; i++) {
                            for (var j = -10; j <= 10; j++) {
                                var trans = _prefab.getCloneTrans();
                                _this.scene.addChild(trans);
                                trans.localScale = new gd3d.math.vector3(1, 1, 1);
                                trans.localTranslate = new gd3d.math.vector3(i * 5, 0, j * 5);
                                if (i == 0 && j == 0) {
                                    objCam.lookat(trans);
                                }
                                var ap = trans.gameObject.getComponent("aniplayer");
                                _this.aniplayers.push(ap);
                            }
                        }
                        objCam.markDirty();
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 199;
        objCam.localTranslate = new gd3d.math.vector3(0, 86, 0);
        objCam.markDirty();
        var tipsLabel = document.createElement("label");
        tipsLabel.style.top = "300px";
        tipsLabel.style.position = "absolute";
        tipsLabel.textContent = "开启cache";
        this.app.container.appendChild(tipsLabel);
        var cacheOpenCheckBox = document.createElement("input");
        cacheOpenCheckBox.type = "checkbox";
        cacheOpenCheckBox.checked = false;
        cacheOpenCheckBox.onchange = function () {
            for (var key in _this.aniplayers) {
                _this.aniplayers[key].isCache = cacheOpenCheckBox.checked;
            }
        };
        cacheOpenCheckBox.style.top = "350px";
        cacheOpenCheckBox.style.position = "absolute";
        this.app.container.appendChild(cacheOpenCheckBox);
    };
    test_multipleplayer_anim.prototype.update = function (delta) {
    };
    return test_multipleplayer_anim;
}());
var test_navmesh = (function () {
    function test_navmesh() {
        this.timer = 0;
    }
    test_navmesh.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        gd3d.io.loadText("res/navinfo.json", function (text, error) {
            _this.navmeshLoaded(text);
            objCam.lookat(_this.navObj);
            objCam.markDirty();
        });
    };
    test_navmesh.prototype.navmeshLoaded = function (dataStr) {
        console.warn("navmeshLoaded");
        this.navObj = new gd3d.framework.transform();
        this.navObj.name = "navMesh";
        var meshD = new gd3d.render.meshData();
        meshD.pos = [];
        meshD.trisindex = [];
        var navinfo = lighttool.NavMesh.navMeshInfo.LoadMeshInfo(dataStr);
        for (var i = 0; i < navinfo.vecs.length; i++) {
            var v = navinfo.vecs[i];
            meshD.pos[i] = new gd3d.math.vector3(v.x, v.y, v.z);
        }
        var navindexmap = {};
        var indexDatas = [];
        for (var i = 0; i < navinfo.nodes.length; i++) {
            var poly = navinfo.nodes[i].poly;
            for (var fc = 0; fc < poly.length - 2; fc++) {
                var sindex = indexDatas.length / 3;
                navindexmap[sindex] = i;
                indexDatas.push(poly[0]);
                indexDatas.push(poly[fc + 2]);
                indexDatas.push(poly[fc + 1]);
            }
        }
        meshD.trisindex = indexDatas;
        var meshFiter = this.navObj.gameObject.addComponent("meshFilter");
        var mesh = this.createMesh(meshD, this.app.webgl);
        meshFiter.mesh = mesh;
        var renderer = this.navObj.gameObject.addComponent("meshRenderer");
        this.app.getScene().addChild(this.navObj);
        this.navObj.markDirty();
    };
    test_navmesh.prototype.createMesh = function (meshData, webgl) {
        var _mesh = new gd3d.framework.mesh("NavMesh" + ".mesh.bin");
        _mesh.data = meshData;
        var vf = gd3d.render.VertexFormatMask.Position;
        var v32 = _mesh.data.genVertexDataArray(vf);
        var i16 = _mesh.data.genIndexDataArray();
        _mesh.glMesh = new gd3d.render.glMesh();
        _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexSubData(webgl, v32);
        _mesh.glMesh.addIndex(webgl, i16.length);
        _mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
        _mesh.submesh = [];
        {
            var sm = new gd3d.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = i16.length;
            sm.line = false;
            _mesh.submesh.push(sm);
        }
        return _mesh;
    };
    test_navmesh.prototype.update = function (delta) {
    };
    return test_navmesh;
}());
var lighttool;
(function (lighttool) {
    var NavMesh;
    (function (NavMesh) {
        var navVec3 = (function () {
            function navVec3() {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            navVec3.prototype.clone = function () {
                var navVec = new navVec3();
                navVec.x = this.x;
                navVec.y = this.y;
                navVec.z = this.z;
                return navVec;
            };
            navVec3.DistAZ = function (start, end) {
                var num = end.x - start.x;
                var num2 = end.z - start.z;
                return Math.sqrt(num * num + num2 * num2);
            };
            navVec3.NormalAZ = function (start, end) {
                var num = end.x - start.x;
                var num2 = end.z - start.z;
                var num3 = Math.sqrt(num * num + num2 * num2);
                var navVec = new navVec3();
                navVec.x = num / num3;
                navVec.y = 0.0;
                navVec.z = num2 / num3;
                return navVec;
            };
            navVec3.Cross = function (start, end) {
                var navVec = new navVec3();
                navVec.x = start.y * end.z - start.z * end.y;
                navVec.y = start.z * end.x - start.x * end.z;
                navVec.z = start.x * end.y - start.y * end.x;
                return navVec;
            };
            navVec3.DotAZ = function (start, end) {
                return start.x * end.x + start.z * end.z;
            };
            navVec3.Angle = function (start, end) {
                var d = start.x * end.x + start.z * end.z;
                var navVec = navVec3.Cross(start, end);
                var num = Math.acos(d);
                var flag = navVec.y < 0.0;
                if (flag) {
                    num = -num;
                }
                return num;
            };
            navVec3.Border = function (start, end, dist) {
                var navVec = navVec3.NormalAZ(start, end);
                var navVec2 = new navVec3();
                navVec2.x = start.x + navVec.x * dist;
                navVec2.y = start.y + navVec.y * dist;
                navVec2.z = start.z + navVec.z * dist;
                return navVec2;
            };
            return navVec3;
        }());
        NavMesh.navVec3 = navVec3;
        var navNode = (function () {
            function navNode() {
                this.nodeID = 0;
                this.poly = null;
                this.borderByPoly = null;
                this.borderByPoint = null;
                this.center = null;
            }
            navNode.prototype.genBorder = function () {
                var list = [];
                for (var i = 0; i < this.poly.length; i = i + 1) {
                    var num = i;
                    var num2 = i + 1;
                    var flag = num2 >= this.poly.length;
                    if (flag) {
                        num2 = 0;
                    }
                    var num3 = this.poly[num];
                    var num4 = this.poly[num2];
                    var flag2 = num3 < num4;
                    if (flag2) {
                        list.push(num3 + "-" + num4);
                    }
                    else {
                        list.push(num4 + "-" + num3);
                    }
                }
                this.borderByPoint = list;
            };
            navNode.prototype.isLinkTo = function (info, nid) {
                var flag = this.nodeID === nid;
                var result;
                if (flag) {
                    result = null;
                }
                else {
                    var flag2 = nid < 0;
                    if (flag2) {
                        result = null;
                    }
                    else {
                        var array = this.borderByPoly;
                        for (var i = 0; i < array.length; i = i + 1) {
                            var text = array[i];
                            var flag3 = (info.borders[text] == undefined);
                            if (!flag3) {
                                var flag4 = info.borders[text].nodeA === nid || info.borders[text].nodeB === nid;
                                if (flag4) {
                                    result = text;
                                    return result;
                                }
                            }
                        }
                        result = null;
                    }
                }
                return result;
            };
            navNode.prototype.getLinked = function (info) {
                var list = [];
                var array = this.borderByPoly;
                for (var i = 0; i < array.length; i = i + 1) {
                    var key = array[i];
                    var flag = (info.borders[key] == undefined);
                    if (!flag) {
                        var flag2 = info.borders[key].nodeA === this.nodeID;
                        var num;
                        if (flag2) {
                            num = info.borders[key].nodeB;
                        }
                        else {
                            num = info.borders[key].nodeA;
                        }
                        var flag3 = num >= 0;
                        if (flag3) {
                            list.push(num);
                        }
                    }
                }
                return list;
            };
            navNode.prototype.genCenter = function (info) {
                this.center = new navVec3();
                this.center.x = 0.0;
                this.center.y = 0.0;
                this.center.z = 0.0;
                var array = this.poly;
                for (var i = 0; i < array.length; i = i + 1) {
                    var num = array[i];
                    this.center.x += info.vecs[num].x;
                    this.center.y += info.vecs[num].y;
                    this.center.z += info.vecs[num].z;
                }
                this.center.x /= this.poly.length;
                this.center.y /= this.poly.length;
                this.center.z /= this.poly.length;
            };
            return navNode;
        }());
        NavMesh.navNode = navNode;
        var navBorder = (function () {
            function navBorder() {
                this.borderName = null;
                this.nodeA = 0;
                this.nodeB = 0;
                this.pointA = 0;
                this.pointB = 0;
                this.length = 0;
                this.center = null;
            }
            return navBorder;
        }());
        NavMesh.navBorder = navBorder;
        var navMeshInfo = (function () {
            function navMeshInfo() {
                this.vecs = null;
                this.nodes = null;
                this.borders = null;
                this.min = null;
                this.max = null;
            }
            navMeshInfo.prototype.calcBound = function () {
                this.min = new navVec3();
                this.max = new navVec3();
                this.min.x = 1.7976931348623157E+308;
                this.min.y = 1.7976931348623157E+308;
                this.min.z = 1.7976931348623157E+308;
                this.max.x = -1.7976931348623157E+308;
                this.max.y = -1.7976931348623157E+308;
                this.max.z = -1.7976931348623157E+308;
                for (var i = 0; i < this.vecs.length; i = i + 1) {
                    var flag = this.vecs[i].x < this.min.x;
                    if (flag) {
                        this.min.x = this.vecs[i].x;
                    }
                    var flag2 = this.vecs[i].y < this.min.y;
                    if (flag2) {
                        this.min.y = this.vecs[i].y;
                    }
                    var flag3 = this.vecs[i].z < this.min.z;
                    if (flag3) {
                        this.min.z = this.vecs[i].z;
                    }
                    var flag4 = this.vecs[i].x > this.max.x;
                    if (flag4) {
                        this.max.x = this.vecs[i].x;
                    }
                    var flag5 = this.vecs[i].y > this.max.y;
                    if (flag5) {
                        this.max.y = this.vecs[i].y;
                    }
                    var flag6 = this.vecs[i].z > this.max.z;
                    if (flag6) {
                        this.max.z = this.vecs[i].z;
                    }
                }
            };
            navMeshInfo.cross = function (p0, p1, p2) {
                return (p1.x - p0.x) * (p2.z - p0.z) - (p2.x - p0.x) * (p1.z - p0.z);
            };
            navMeshInfo.prototype.inPoly = function (p, poly) {
                var num = 0;
                var flag = poly.length < 3;
                var result;
                if (flag) {
                    result = false;
                }
                else {
                    var flag2 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[1]]) < (-num);
                    if (flag2) {
                        result = false;
                    }
                    else {
                        var flag3 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[poly.length - 1]]) > num;
                        if (flag3) {
                            result = false;
                        }
                        else {
                            var i = 2;
                            var num2 = poly.length - 1;
                            var num3 = -1;
                            while (i <= num2) {
                                var num4 = i + num2 >> 1;
                                var flag4 = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[num4]]) < (-num);
                                if (flag4) {
                                    num3 = num4;
                                    num2 = num4 - 1;
                                }
                                else {
                                    i = num4 + 1;
                                }
                            }
                            var num5 = navMeshInfo.cross(this.vecs[poly[num3 - 1]], p, this.vecs[poly[num3]]);
                            result = (num5 > num);
                        }
                    }
                }
                return result;
            };
            navMeshInfo.prototype.genBorder = function () {
                var __border = {};
                for (var i0 = 0; i0 < this.nodes.length; i0 = i0 + 1) {
                    var n = this.nodes[i0];
                    for (var i1 = 0; i1 < n.borderByPoint.length; i1 = i1 + 1) {
                        var b = n.borderByPoint[i1];
                        if (__border[b] == undefined) {
                            __border[b] = new navBorder();
                            __border[b].borderName = b;
                            __border[b].nodeA = n.nodeID;
                            __border[b].nodeB = -1;
                            __border[b].pointA = -1;
                        }
                        else {
                            __border[b].nodeB = n.nodeID;
                            if (__border[b].nodeA > __border[b].nodeB) {
                                __border[b].nodeB = __border[b].nodeA;
                                __border[b].nodeB = n.nodeID;
                            }
                            var na = this.nodes[__border[b].nodeA];
                            var nb = this.nodes[__border[b].nodeB];
                            for (var i2 = 0; i2 < na.poly.length; i2 = i2 + 1) {
                                var i = na.poly[i2];
                                if (nb.poly.indexOf(i) >= 0) {
                                    if (__border[b].pointA == -1)
                                        __border[b].pointA = i;
                                    else
                                        __border[b].pointB = i;
                                }
                            }
                            var left = __border[b].pointA;
                            var right = __border[b].pointB;
                            var xd = this.vecs[left].x - this.vecs[right].x;
                            var yd = this.vecs[left].y - this.vecs[right].y;
                            var zd = this.vecs[left].z - this.vecs[right].z;
                            __border[b].length = Math.sqrt(xd * xd + yd * yd + zd * zd);
                            __border[b].center = new navVec3();
                            __border[b].center.x = this.vecs[left].x * 0.5 + this.vecs[right].x * 0.5;
                            __border[b].center.y = this.vecs[left].y * 0.5 + this.vecs[right].y * 0.5;
                            __border[b].center.z = this.vecs[left].z * 0.5 + this.vecs[right].z * 0.5;
                            __border[b].borderName = __border[b].nodeA + "-" + __border[b].nodeB;
                        }
                    }
                }
                var namechange = {};
                for (var key in __border) {
                    if (__border[key].nodeB < 0) {
                    }
                    else {
                        namechange[key] = __border[key].borderName;
                    }
                }
                this.borders = {};
                for (var key in __border) {
                    if (namechange[key] != undefined) {
                        this.borders[namechange[key]] = __border[key];
                    }
                }
                for (var m = 0; m < this.nodes.length; m = m + 1) {
                    var v = this.nodes[m];
                    var newborder = [];
                    for (var nnn = 0; nnn < v.borderByPoint.length; nnn = nnn + 1) {
                        var b = v.borderByPoint[nnn];
                        if (namechange[b] != undefined) {
                            newborder.push(namechange[b]);
                        }
                    }
                    v.borderByPoly = newborder;
                }
            };
            navMeshInfo.LoadMeshInfo = function (s) {
                var j = JSON.parse(s);
                var info = new navMeshInfo();
                var listVec = [];
                for (var jsonid in j["v"]) {
                    var v3 = new navVec3();
                    v3.x = j["v"][jsonid][0];
                    v3.y = j["v"][jsonid][1];
                    v3.z = j["v"][jsonid][2];
                    listVec.push(v3);
                }
                info.vecs = listVec;
                var polys = [];
                var list = j["p"];
                for (var i = 0; i < list.length; i++) {
                    var json = list[i];
                    var node = new navNode();
                    node.nodeID = i;
                    var poly = [];
                    for (var tt in json) {
                        poly.push(json[tt]);
                    }
                    node.poly = poly;
                    node.genBorder();
                    node.genCenter(info);
                    polys.push(node);
                }
                info.nodes = polys;
                info.calcBound();
                info.genBorder();
                return info;
            };
            return navMeshInfo;
        }());
        NavMesh.navMeshInfo = navMeshInfo;
    })(NavMesh = lighttool.NavMesh || (lighttool.NavMesh = {}));
})(lighttool || (lighttool = {}));
var t;
(function (t) {
    var Test_NormalMap = (function () {
        function Test_NormalMap() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        Test_NormalMap.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        Test_NormalMap.prototype.loadText = function (laststate, state) {
            var c = 0;
            c++;
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/map_diffuse.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            c++;
            this.app.getAssetMgr().load("res/map_normal.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    c--;
                    if (c == 0)
                        state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        Test_NormalMap.prototype.addnormalcube = function (laststate, state) {
            this.normalCube = new gd3d.framework.transform();
            this.normalCube.name = "cube";
            this.normalCube.localScale.x = this.normalCube.localScale.y = this.normalCube.localScale.z = 3;
            this.scene.addChild(this.normalCube);
            var mesh = this.normalCube.gameObject.addComponent("meshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = this.normalCube.gameObject.addComponent("meshRenderer");
            this.cuber = renderer;
            var sh = this.app.getAssetMgr().getShader("normalmap.shader.json");
            if (sh != null) {
                this.cuber.materials = [];
                this.cuber.materials.push(new gd3d.framework.material());
                this.cuber.materials[0].setShader(sh);
                var texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png");
                this.cuber.materials[0].setTexture("_MainTex", texture);
                var normalTexture = this.app.getAssetMgr().getAssetByName("map_normal.png");
                this.cuber.materials[0].setTexture("_NormalTex", normalTexture);
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.addcube = function (laststate, state) {
            var cube = new gd3d.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 2;
            cube.localTranslate.x = 3;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("meshRenderer");
            var cuber = renderer;
            var sh = this.app.getAssetMgr().getShader("light1.shader.json");
            if (sh != null) {
                cuber.materials = [];
                cuber.materials.push(new gd3d.framework.material());
                cuber.materials[0].setShader(sh);
                var texture = this.app.getAssetMgr().getAssetByName("map_diffuse.png");
                cuber.materials[0].setTexture("_MainTex", texture);
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -5);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        Test_NormalMap.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            btn.style.top = "124px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addnormalcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        Test_NormalMap.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 5, 3, z * 5);
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
        };
        return Test_NormalMap;
    }());
    t.Test_NormalMap = Test_NormalMap;
})(t || (t = {}));
var t;
(function (t) {
    var test_pathAsset = (function () {
        function test_pathAsset() {
            this.parentlist = [];
            this.dragonlist = [];
            this.traillist = [];
            this.guippaths = [];
            this.taskmgr = new gd3d.framework.taskMgr();
            this.timer = 0;
        }
        test_pathAsset.prototype.start = function (app) {
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadTexture.bind(this));
            this.taskmgr.addTaskCall(this.loadpath.bind(this));
            this.taskmgr.addTaskCall(this.loadasset.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            this.taskmgr.addTaskCall(this.addbtns.bind(this));
        };
        test_pathAsset.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_pathAsset.prototype.loadTexture = function (laststate, state) {
            var texnumber = 2;
            this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    texnumber--;
                    if (texnumber == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/sd_hlb_1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    texnumber--;
                    if (texnumber == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
        };
        test_pathAsset.prototype.loadpath = function (laststate, state) {
            var pathnumber = 2;
            this.app.getAssetMgr().load("res/path/circlepath.path.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    pathnumber--;
                    if (pathnumber == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/path/circlepath_2.path.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    pathnumber--;
                    if (pathnumber == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
        };
        test_pathAsset.prototype.loadasset = function (laststate, state) {
            this.app.getAssetMgr().load("res/prefabs/rotatedLongTou/rotatedLongTou.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_pathAsset.prototype.initscene = function (laststate, state) {
            var _this = this;
            var objCam = new gd3d.framework.transform();
            objCam.name = "cam_show";
            this.scene.addChild(objCam);
            this.showcamera = objCam.gameObject.addComponent("camera");
            this.showcamera.order = 0;
            this.showcamera.near = 0.01;
            this.showcamera.far = 1000;
            objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var mat = DBgetMat("rock256.png");
            var trans = DBgetAtrans(mat);
            this.scene.addChild(trans);
            trans.localScale.y = 0.1;
            trans.localScale.x = trans.localScale.z = 40;
            trans.localTranslate.y = -1;
            trans.markDirty();
            var longtouprefab = this.app.getAssetMgr().getAssetByName("rotatedLongTou.prefab.json");
            var path = this.app.getAssetMgr().getAssetByName("circlepath.path.json");
            var path2 = this.app.getAssetMgr().getAssetByName("circlepath_2.path.json");
            {
                for (var i = 0; i < 3; i++) {
                    var parent = new gd3d.framework.transform();
                    parent.gameObject.visible = false;
                    this.scene.addChild(parent);
                    this.parentlist.push(parent);
                    var head = longtouprefab.getCloneTrans();
                    head.localScale.x = head.localScale.y = head.localScale.z = 4;
                    parent.addChild(head);
                    this.dragonlist.push(head);
                    var guidp = head.gameObject.addComponent("guidpath");
                    this.guippaths.push(guidp);
                    var trans = new gd3d.framework.transform();
                    head.addChild(trans);
                    var trailmat = new gd3d.framework.material();
                    var shader = this.app.getAssetMgr().getShader("particles_blend.shader.json");
                    var tex1 = this.app.getAssetMgr().getAssetByName("sd_hlb_1.png");
                    trailmat.setShader(shader);
                    trailmat.setTexture("_MainTex", tex1);
                    var trailrender = trans.gameObject.addComponent("trailRender");
                    this.traillist.push(trailrender);
                    trailrender.material = trailmat;
                    trailrender.setWidth(1.0);
                    trailrender.lookAtCamera = true;
                    trailrender.extenedOneSide = false;
                    trailrender.setspeed(0.25);
                }
                this.guippaths[0].setpathasset(path2, 50, function () {
                });
                this.guippaths[1].setpathasset(path, 50, function () {
                    _this.parentlist[1].gameObject.visible = false;
                });
                this.guippaths[2].setpathasset(path2, 50, function () {
                });
            }
            state.finish = true;
        };
        test_pathAsset.prototype.update = function (delta) {
            this.taskmgr.move(delta);
        };
        test_pathAsset.prototype.addbtns = function () {
            var _this = this;
            this.addBtn("play", 10, 100, function () {
                for (var i = 0; i < _this.parentlist.length; i++) {
                    _this.parentlist[i].gameObject.visible = true;
                }
                for (var i_1 = 0; i_1 < _this.traillist.length; i_1++) {
                    _this.traillist[i_1].play();
                }
                _this.guippaths[0].play(2);
                _this.guippaths[1].play();
                _this.guippaths[2].play(2);
            });
            this.addBtn("stop", 10, 200, function () {
                for (var i = 0; i < _this.parentlist.length; i++) {
                    _this.parentlist[i].gameObject.visible = false;
                }
                for (var i_2 = 0; i_2 < _this.guippaths.length; i_2++) {
                    _this.traillist[i_2].stop();
                    _this.guippaths[i_2].stop();
                }
            });
        };
        test_pathAsset.prototype.addBtn = function (text, x, y, func) {
            var btn = document.createElement("button");
            btn.textContent = text;
            btn.onclick = function () {
                func();
            };
            btn.style.top = y + "px";
            btn.style.left = x + "px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
        };
        return test_pathAsset;
    }());
    t.test_pathAsset = test_pathAsset;
    function DBgetAtrans(mat, meshname) {
        if (meshname === void 0) { meshname = null; }
        var trans = new gd3d.framework.transform();
        var meshf = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHFILTER);
        var meshr = trans.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_MESHRENDER);
        meshr.materials = [];
        meshr.materials.push(mat);
        if (meshname == null) {
            var mesh = gd3d.framework.sceneMgr.app.getAssetMgr().getDefaultMesh("cube");
            meshf.mesh = mesh;
        }
        else {
            var mesh = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName(meshname);
            meshf.mesh = mesh;
        }
        return trans;
    }
    t.DBgetAtrans = DBgetAtrans;
    function DBgetMat(texname, shaderstring) {
        if (texname === void 0) { texname = null; }
        if (shaderstring === void 0) { shaderstring = null; }
        var mat = new gd3d.framework.material();
        if (shaderstring == null) {
            shaderstring = "diffuse.shader.json";
        }
        var shader = gd3d.framework.sceneMgr.app.getAssetMgr().getShader(shaderstring);
        mat.setShader(shader);
        if (texname != null) {
            var tex = gd3d.framework.sceneMgr.app.getAssetMgr().getAssetByName(texname);
            mat.setTexture("_MainTex", tex);
        }
        return mat;
    }
    t.DBgetMat = DBgetMat;
})(t || (t = {}));
var test_pick = (function () {
    function test_pick() {
        this.timer = 0;
        this.movetarget = new gd3d.math.vector3();
        this.pointDown = false;
    }
    test_pick.prototype.start = function (app) {
        console.log("i am here.");
        this.app = app;
        this.inputMgr = this.app.getInputMgr();
        this.scene = this.app.getScene();
        var cuber;
        console.warn("Finish it.");
        var cube = new gd3d.framework.transform();
        cube.name = "cube";
        cube.localScale.x = 10;
        cube.localScale.y = 0.1;
        cube.localScale.z = 10;
        this.scene.addChild(cube);
        var mesh = cube.gameObject.addComponent("meshFilter");
        var smesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
        mesh.mesh = (this.app.getAssetMgr().getDefaultMesh("cube"));
        var renderer = cube.gameObject.addComponent("meshRenderer");
        cube.gameObject.addComponent("boxcollider");
        cube.markDirty();
        cuber = renderer;
        this.cube = cube;
        {
            this.cube2 = new gd3d.framework.transform();
            this.cube2.name = "cube2";
            this.scene.addChild(this.cube2);
            this.cube2.localScale.x = this.cube2.localScale.y = this.cube2.localScale.z = 1;
            this.cube2.localTranslate.x = -5;
            this.cube2.markDirty();
            var mesh = this.cube2.gameObject.addComponent("meshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube2.gameObject.addComponent("meshRenderer");
            var coll = this.cube2.gameObject.addComponent("spherecollider");
            coll.center = new gd3d.math.vector3(0, 1, 0);
            coll.radius = 1;
        }
        this.cube3 = this.cube2.clone();
        this.scene.addChild(this.cube3);
        {
            this.cube3 = new gd3d.framework.transform();
            this.cube3.name = "cube3";
            this.scene.addChild(this.cube3);
            this.cube3.localScale.x = this.cube3.localScale.y = this.cube3.localScale.z = 1;
            this.cube3.localTranslate.x = -5;
            this.cube3.markDirty();
            var mesh = this.cube3.gameObject.addComponent("meshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube3.gameObject.addComponent("meshRenderer");
            var coll = this.cube3.gameObject.addComponent("boxcollider");
            coll.colliderVisible = true;
        }
        {
            this.cube4 = new gd3d.framework.transform();
            this.cube4.name = "cube4";
            this.scene.addChild(this.cube4);
            this.cube4.localScale.x = this.cube4.localScale.y = this.cube4.localScale.z = 1;
            this.cube4.localTranslate.x = 5;
            this.cube4.markDirty();
            var mesh = this.cube4.gameObject.addComponent("meshFilter");
            mesh.mesh = (smesh);
            var renderer = this.cube4.gameObject.addComponent("meshRenderer");
            var coll = this.cube4.gameObject.addComponent("boxcollider");
            coll.colliderVisible = true;
        }
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(this.cube);
        objCam.markDirty();
    };
    test_pick.prototype.update = function (delta) {
        if (this.pointDown == false && this.inputMgr.point.touch == true) {
            var ray = this.camera.creatRayByScreen(new gd3d.math.vector2(this.inputMgr.point.x, this.inputMgr.point.y), this.app);
            var pickinfo = this.scene.pick(ray);
            if (pickinfo != null) {
                this.movetarget = pickinfo.hitposition;
                this.timer = 0;
            }
        }
        this.pointDown = this.inputMgr.point.touch;
        if (this.cube3.gameObject.getComponent("boxcollider").intersectsTransform(this.cube4)) {
            return;
        }
        this.timer += delta;
        this.cube3.localTranslate.x += delta;
        this.cube3.markDirty();
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
    };
    return test_pick;
}());
var t;
(function (t) {
    var test_post_bloom = (function () {
        function test_post_bloom() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_post_bloom.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_post_bloom.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_post_bloom.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 1;
            this.camera.far = 15;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_post_bloom.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.addbtn("50px", "normal", function () {
                _this.camera.postQueues = [];
            });
            this.addbtn("150px", "模糊", function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                var texsize = 512;
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post.material.setTexture("_MainTex", textcolor);
                post.material.setVector4("sample_offsets", new gd3d.math.vector4(0, 1.0, 0, -1.0));
                post.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post);
                var texBlur0 = new gd3d.framework.texture("_blur0");
                texBlur0.glTexture = post.renderTarget;
                var post1 = new gd3d.framework.cameraPostQueue_Quad();
                post1.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post1.material.setTexture("_MainTex", texBlur0);
                post1.material.setVector4("sample_offsets", new gd3d.math.vector4(1.0, 0, -1.0, 0));
                post1.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post1);
            });
            this.addbtn("350px", "景深", function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                var depth = new gd3d.framework.cameraPostQueue_Depth();
                depth.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(depth);
                var depthcolor = new gd3d.framework.texture("_depthcolor");
                depthcolor.glTexture = depth.renderTarget;
                var texsize = 512;
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post.material.setTexture("_MainTex", textcolor);
                post.material.setVector4("sample_offsets", new gd3d.math.vector4(0, 1.0, 0, -1.0));
                post.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post);
                var texBlur0 = new gd3d.framework.texture("_blur0");
                texBlur0.glTexture = post.renderTarget;
                var post1 = new gd3d.framework.cameraPostQueue_Quad();
                post1.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post1.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post1.material.setTexture("_MainTex", texBlur0);
                post1.material.setVector4("sample_offsets", new gd3d.math.vector4(1.0, 0, -1.0, 0));
                post1.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post1);
                var texBlur = new gd3d.framework.texture("_blur");
                texBlur.glTexture = post1.renderTarget;
                var post2 = new gd3d.framework.cameraPostQueue_Quad();
                post2.material.setShader(_this.scene.app.getAssetMgr().getShader("dof.shader.json"));
                post2.material.setTexture("_MainTex", textcolor);
                post2.material.setTexture("_BlurTex", texBlur);
                post2.material.setTexture("_DepthTex", depthcolor);
                var focalDistance = 0.96;
                post2.material.setFloat("_focalDistance", focalDistance);
                _this.camera.postQueues.push(post2);
            });
            this.addbtn("350px", "bloom", function () {
                _this.camera.postQueues = [];
            });
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_post_bloom.prototype.addbtn = function (topOffset, textContent, func) {
            var _this = this;
            var btn = document.createElement("button");
            btn.style.top = topOffset;
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            btn.textContent = textContent;
            btn.onclick = function () {
                _this.camera.postQueues = [];
                func();
            };
        };
        test_post_bloom.prototype.update = function (delta) {
            this.taskmgr.move(delta);
        };
        return test_post_bloom;
    }());
    t.test_post_bloom = test_post_bloom;
})(t || (t = {}));
var t;
(function (t) {
    var test_posteffect_cc = (function () {
        function test_posteffect_cc() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_posteffect_cc.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_posteffect_cc.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_posteffect_cc.prototype.addcube = function (laststate, state) {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                }
            }
            state.finish = true;
        };
        test_posteffect_cc.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 1;
            this.camera.far = 15;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        test_posteffect_cc.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.style.left = "50px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        _this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            this.addbtn("50px", "normal", function () {
                _this.camera.postQueues = [];
            });
            this.addbtn("150px", "模糊", function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                var texsize = 512;
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post.material.setTexture("_MainTex", textcolor);
                post.material.setVector4("sample_offsets", new gd3d.math.vector4(0, 1.0, 0, -1.0));
                post.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post);
                var texBlur0 = new gd3d.framework.texture("_blur0");
                texBlur0.glTexture = post.renderTarget;
                var post1 = new gd3d.framework.cameraPostQueue_Quad();
                post1.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post1.material.setTexture("_MainTex", texBlur0);
                post1.material.setVector4("sample_offsets", new gd3d.math.vector4(1.0, 0, -1.0, 0));
                post1.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post1);
            });
            this.addbtn("250px", "深度图", function () {
                _this.camera.postQueues = [];
                var depth = new gd3d.framework.cameraPostQueue_Depth();
                _this.camera.postQueues.push(depth);
            });
            this.addbtn("350px", "景深", function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                var depth = new gd3d.framework.cameraPostQueue_Depth();
                depth.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(depth);
                var depthcolor = new gd3d.framework.texture("_depthcolor");
                depthcolor.glTexture = depth.renderTarget;
                var texsize = 512;
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post.material.setTexture("_MainTex", textcolor);
                post.material.setVector4("sample_offsets", new gd3d.math.vector4(0, 1.0, 0, -1.0));
                post.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post);
                var texBlur0 = new gd3d.framework.texture("_blur0");
                texBlur0.glTexture = post.renderTarget;
                var post1 = new gd3d.framework.cameraPostQueue_Quad();
                post1.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post1.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post1.material.setTexture("_MainTex", texBlur0);
                post1.material.setVector4("sample_offsets", new gd3d.math.vector4(1.0, 0, -1.0, 0));
                post1.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post1);
                var texBlur = new gd3d.framework.texture("_blur");
                texBlur.glTexture = post1.renderTarget;
                var post2 = new gd3d.framework.cameraPostQueue_Quad();
                post2.material.setShader(_this.scene.app.getAssetMgr().getShader("dof.shader.json"));
                post2.material.setTexture("_MainTex", textcolor);
                post2.material.setTexture("_BlurTex", texBlur);
                post2.material.setTexture("_DepthTex", depthcolor);
                var focalDistance = 0.96;
                post2.material.setFloat("_focalDistance", focalDistance);
                _this.camera.postQueues.push(post2);
            });
            this.addbtn("450px", "bloom", function () {
                _this.camera.postQueues = [];
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                _this.camera.postQueues.push(color);
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                var post0 = new gd3d.framework.cameraPostQueue_Quad();
                post0.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                post0.material.setShader(_this.scene.app.getAssetMgr().getShader("threshold.shader.json"));
                post0.material.setTexture("_MainTex", textcolor);
                _this.camera.postQueues.push(post0);
                var specucolor = new gd3d.framework.texture("_specucolor");
                specucolor.glTexture = post0.renderTarget;
                var texsize = 512;
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post.material.setTexture("_MainTex", specucolor);
                post.material.setVector4("sample_offsets", new gd3d.math.vector4(0, 1.0, 0, 0.0));
                post.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post);
                var texBlur0 = new gd3d.framework.texture("_blur0");
                texBlur0.glTexture = post.renderTarget;
                var post1 = new gd3d.framework.cameraPostQueue_Quad();
                post1.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, texsize, texsize, true, false);
                post1.material.setShader(_this.scene.app.getAssetMgr().getShader("separate_blur.shader.json"));
                post1.material.setTexture("_MainTex", texBlur0);
                post1.material.setVector4("sample_offsets", new gd3d.math.vector4(1.0, 0, 0.0, 0));
                post1.material.setVector4("_MainTex_TexelSize", new gd3d.math.vector4(1.0 / texsize, 1.0 / texsize, texsize, texsize));
                _this.camera.postQueues.push(post1);
                var texBlur = new gd3d.framework.texture("_blur");
                texBlur.glTexture = post1.renderTarget;
                var post2 = new gd3d.framework.cameraPostQueue_Quad();
                post2.material.setShader(_this.scene.app.getAssetMgr().getShader("bloom.shader.json"));
                post2.material.setTexture("_MainTex", textcolor);
                post2.material.setTexture("_BlurTex", specucolor);
                _this.camera.postQueues.push(post2);
            });
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_posteffect_cc.prototype.addbtn = function (topOffset, textContent, func) {
            var _this = this;
            var btn = document.createElement("button");
            btn.style.top = topOffset;
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            btn.textContent = textContent;
            btn.onclick = function () {
                _this.camera.postQueues = [];
                func();
            };
        };
        test_posteffect_cc.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
        };
        return test_posteffect_cc;
    }());
    t.test_posteffect_cc = test_posteffect_cc;
})(t || (t = {}));
var t;
(function (t) {
    var test_posteffect = (function () {
        function test_posteffect() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
        }
        test_posteffect.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_posteffect.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_posteffect.prototype.addcube = function (laststate, state) {
            for (var i = -4; i < 5; i++) {
                for (var j = -4; j < 5; j++) {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                    cube.localTranslate.x = i;
                    cube.localTranslate.z = j;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                }
            }
            state.finish = true;
        };
        test_posteffect.prototype.addcamandlight = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 1;
            this.camera.far = 15;
            this.camera.fov = Math.PI * 0.3;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            {
                var color = new gd3d.framework.cameraPostQueue_Color();
                color.renderTarget = new gd3d.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(color);
                var depth = new gd3d.framework.cameraPostQueue_Depth();
                depth.renderTarget = new gd3d.render.glRenderTarget(this.scene.webgl, 1024, 1024, true, false);
                this.camera.postQueues.push(depth);
                var post = new gd3d.framework.cameraPostQueue_Quad();
                post.material.setShader(this.scene.app.getAssetMgr().getShader("diffuse.shader.json"));
                var text = new gd3d.framework.texture("_depth");
                text.glTexture = depth.renderTarget;
                var textcolor = new gd3d.framework.texture("_color");
                textcolor.glTexture = color.renderTarget;
                post.material.setTexture("_MainTex", textcolor);
                post.material.setTexture("_DepthTex", text);
                this.camera.postQueues.push(post);
            }
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            this.light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 0.5;
                lighttran.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("light1.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
            }
            state.finish = true;
        };
        test_posteffect.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var btn = document.createElement("button");
            btn.textContent = "切换光源类型";
            btn.style.top = "120px";
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);
            btn.onclick = function () {
                if (_this.light != null) {
                    if (_this.light.type == gd3d.framework.LightTypeEnum.Direction) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Point;
                        console.log("点光源");
                    }
                    else if (_this.light.type == gd3d.framework.LightTypeEnum.Point) {
                        _this.light.type = gd3d.framework.LightTypeEnum.Spot;
                        _this.light.spotAngelCos = Math.cos(0.2 * Math.PI);
                        console.log("聚光灯");
                    }
                    else {
                        _this.light.type = gd3d.framework.LightTypeEnum.Direction;
                        console.log("方向光");
                    }
                }
            };
            var list = [
                "灰度+描边",
                "马赛克",
                "均值模糊",
                "高斯模糊",
                "径向模糊",
                "旋转扭曲",
                "桶模糊"
            ];
            var select = document.createElement("select");
            select.style.top = "240px";
            select.style.position = "absolute";
            this.app.container.appendChild(select);
            for (var i = 0; i < list.length; i++) {
                var op = document.createElement("option");
                op.value = i.toString();
                op.innerText = list[i];
                select.appendChild(op);
            }
            select.onchange = function () {
                _this.camera.postQueues = [];
                if (select.value == "0") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var depth = new gd3d.framework.cameraPostQueue_Depth();
                    depth.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(depth);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("diffuse.shader.json"));
                    var text = new gd3d.framework.texture("_depth");
                    text.glTexture = depth.renderTarget;
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setTexture("_DepthTex", text);
                    _this.camera.postQueues.push(post);
                    console.log("灰度+描边");
                }
                else if (select.value == "1") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("mask.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    _this.camera.postQueues.push(post);
                    console.log("马赛克");
                }
                else if (select.value == "2") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("blur.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_BlurGap", 1);
                    _this.camera.postQueues.push(post);
                    console.log("均值模糊");
                }
                else if (select.value == "3") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("GaussianBlur.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_BlurGap", 2);
                    post.material.setFloat("_BlurSigma", 6);
                    post.material.setFloat("_BlurLayer", 10);
                    _this.camera.postQueues.push(post);
                    console.log("高斯模糊");
                }
                else if (select.value == "4") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("radial_blur.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    post.material.setFloat("_Level", 50);
                    _this.camera.postQueues.push(post);
                    console.log("径向模糊");
                }
                else if (select.value == "5") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("contort.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    _this.camera.postQueues.push(post);
                    console.log("旋转扭曲");
                }
                else if (select.value == "6") {
                    var color = new gd3d.framework.cameraPostQueue_Color();
                    color.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                    _this.camera.postQueues.push(color);
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("barrel_blur.shader.json"));
                    var textcolor = new gd3d.framework.texture("_color");
                    textcolor.glTexture = color.renderTarget;
                    post.material.setTexture("_MainTex", textcolor);
                    _this.camera.postQueues.push(post);
                    console.log("桶模糊");
                }
            };
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcamandlight.bind(this));
        };
        test_posteffect.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.localTranslate = new gd3d.math.vector3(x2 * 10, 2.25, -z2 * 10);
                objCam.updateWorldTran();
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
            if (this.light != null) {
                var objlight = this.light.gameObject.transform;
                objlight.localTranslate = new gd3d.math.vector3(x * 5, 3, z * 5);
                objlight.updateWorldTran();
                objlight.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            }
        };
        return test_posteffect;
    }());
    t.test_posteffect = test_posteffect;
})(t || (t = {}));
var test_loadprefab = (function () {
    function test_loadprefab() {
        this.timer = 0;
    }
    test_loadprefab.prototype.refreshTexture = function (tran) {
        var meshrenderer = tran.gameObject.getComponentsInChildren("meshRenderer");
        var skinnmeshrenderer = tran.gameObject.getComponentsInChildren("skinnedMeshRenderer");
        for (var i = 0; i < meshrenderer.length; i++) {
            var v = meshrenderer[i];
            for (var j = 0; j < v.materials.length; j++) {
                for (var k in v.materials[j].mapUniform) {
                    if (v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture) {
                        var textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname);
                        v.materials[j].setTexture(k, textur);
                    }
                }
            }
        }
        for (var i = 0; i < skinnmeshrenderer.length; i++) {
            var v = skinnmeshrenderer[i];
            for (var j = 0; j < v.materials.length; j++) {
                for (var k in v.materials[j].mapUniform) {
                    if (v.materials[j].mapUniform[k].type == gd3d.render.UniformTypeEnum.Texture) {
                        var textur = this.app.getAssetMgr().getAssetByName(v.materials[j].mapUniform[k].resname);
                        v.materials[j].setTexture(k, textur);
                    }
                }
            }
        }
    };
    test_loadprefab.prototype.refreshAniclip = function (tran) {
        var anipalyer = tran.gameObject.getComponentsInChildren("aniplayer");
        for (var i = 0; i < anipalyer.length; i++) {
            for (var j = 0; j < anipalyer[i].clips.length; j++) {
                var v = anipalyer[i].clips[j];
                anipalyer[i].clips[j] = this.app.getAssetMgr().getAssetByName(v.getName());
            }
            anipalyer[i].playByIndex(0);
        }
    };
    test_loadprefab.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        var names = ["elongmul", "0060_duyanshou", "Cube", "0001_fashion", "193_meirenyu"];
        var name = names[0];
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/" + name + "/meshprefab/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName(name + ".prefab.json");
                        _this.baihu = _prefab.getCloneTrans();
                        _this.scene.addChild(_this.baihu);
                        _this.baihu.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        _this.baihu.localEulerAngles = new gd3d.math.vector3(0, 180, 0);
                        objCam.localTranslate = new gd3d.math.vector3(0, 20, -10);
                        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                        objCam.markDirty();
                        _this.app.getAssetMgr().load("res/prefabs/" + name + "/textures/" + name + "texture.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                _this.refreshTexture(_this.baihu);
                            }
                        });
                        _this.app.getAssetMgr().load("res/prefabs/" + name + "/aniclip/" + name + "aniclip.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                            if (s.isfinish) {
                                _this.refreshAniclip(_this.baihu);
                            }
                        });
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        this.camera.backgroundColor = new gd3d.math.color(0.11, 0.11, 0.11, 1.0);
        objCam.markDirty();
    };
    test_loadprefab.prototype.changeShader = function () {
        var _this = this;
        var btn = document.createElement("button");
        btn.textContent = "切换Shader到：diffuse.shader.json";
        btn.onclick = function () {
            var sh = _this.app.getAssetMgr().getShader("diffuse.shader.json");
            _this.change(sh);
        };
        btn.style.top = "160px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
        var btn2 = document.createElement("button");
        btn2.textContent = "切换Shader到：additive_alpha.shader.json";
        btn2.onclick = function () {
            var sh = _this.app.getAssetMgr().getShader("additive_alpha.shader.json");
            _this.change(sh);
        };
        btn2.style.top = "124px";
        btn2.style.position = "absolute";
        this.app.container.appendChild(btn2);
    };
    test_loadprefab.prototype.change = function (sha) {
        for (var j = 0; j < this.renderer.length; j++) {
            for (var i = 0; i < this.renderer[j].materials.length; i++) {
                this.renderer[j].materials[i].changeShader(sha);
            }
        }
        for (var j = 0; j < this.skinRenders.length; j++) {
            for (var i = 0; i < this.skinRenders[j].materials.length; i++) {
                this.skinRenders[j].materials[i].changeShader(sha);
            }
        }
    };
    test_loadprefab.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        if (this.baihu) {
            objCam.lookat(this.baihu);
            objCam.markDirty();
        }
    };
    return test_loadprefab;
}());
var testReload = (function () {
    function testReload() {
        this.uileft = 0;
        this.timer = 0;
    }
    testReload.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var role;
        var role1;
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/fs/fs.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("fs.prefab.json");
                        role = _prefab.getCloneTrans();
                        _this.scene.addChild(role);
                        role.localScale = new gd3d.math.vector3(1, 1, 1);
                        role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                        var _aniplayer = role.gameObject.getComponent("aniplayer");
                        _aniplayer.autoplay = true;
                        _this.cube = role;
                        if (role1 != null) {
                            _this.createChangeBtn(role, role1, o2d, "body");
                            _this.createChangeBtn(role, role1, o2d, "handL");
                            _this.createChangeBtn(role, role1, o2d, "handR");
                            _this.createChangeBtn(role, role1, o2d, "head");
                            _this.createChangeBtn(role, role1, o2d, "leg");
                        }
                    }
                });
                _this.app.getAssetMgr().load("res/prefabs/0001_shengyi_male/0001_shengyi_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("0001_shengyi_male.prefab.json");
                        role1 = _prefab.getCloneTrans();
                        if (role != null) {
                            _this.createChangeBtn(role, role1, o2d, "body");
                            _this.createChangeBtn(role, role1, o2d, "handL");
                            _this.createChangeBtn(role, role1, o2d, "handR");
                            _this.createChangeBtn(role, role1, o2d, "head");
                            _this.createChangeBtn(role, role1, o2d, "leg");
                        }
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        var o2d = new gd3d.framework.overlay2D();
        this.camera.addOverLay(o2d);
    };
    testReload.prototype.createChangeBtn = function (role, role1, o2d, part) {
        var _this = this;
        var t2d_9 = new gd3d.framework.transform2D();
        t2d_9.width = 150;
        t2d_9.height = 50;
        t2d_9.pivot.x = 0;
        t2d_9.pivot.y = 0;
        t2d_9.localTranslate.x = this.uileft;
        t2d_9.localTranslate.y = 300;
        var btn = t2d_9.addComponent("button");
        var img9 = t2d_9.addComponent("image2D");
        img9.imageType = gd3d.framework.ImageType.Sliced;
        btn.targetImage = img9;
        btn.transition = gd3d.framework.TransitionType.ColorTint;
        var role_part;
        var role1_part;
        btn.onClick.addListener(function () {
            if (role_part == null) {
                var role_skinMeshRenders = role.gameObject.getComponentsInChildren("skinnedMeshRenderer");
                var role1_skinMeshRenders = role1.gameObject.getComponentsInChildren("skinnedMeshRenderer");
                for (var key in role_skinMeshRenders) {
                    if (role_skinMeshRenders[key].gameObject.getName().indexOf("_" + part) >= 0) {
                        role_part = role_skinMeshRenders[key];
                    }
                }
                for (var key in role1_skinMeshRenders) {
                    if (role1_skinMeshRenders[key].gameObject.getName().indexOf("_" + part) >= 0) {
                        role1_part = role1_skinMeshRenders[key];
                    }
                }
            }
            var role_part_parent = role_part.gameObject.transform.parent;
            role1_part.gameObject.transform.parent.addChild(role_part.gameObject.transform);
            role_part_parent.addChild(role1_part.gameObject.transform);
            var role_part_player = role_part.player;
            role_part._player = role1_part.player;
            role1_part._player = role_part_player;
        });
        o2d.addChild(t2d_9);
        var lab = new gd3d.framework.transform2D();
        lab.name = "lab111";
        lab.width = 150;
        lab.height = 50;
        lab.pivot.x = 0;
        lab.pivot.y = 0;
        lab.markDirty();
        var label = lab.addComponent("label");
        label.text = "换" + part;
        label.fontsize = 25;
        label.color = new gd3d.math.color(1, 0, 0, 1);
        t2d_9.addChild(lab);
        this.app.getAssetMgr().load("res/uisprite.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                var texture = _this.app.getAssetMgr().getAssetByName("uisprite.png");
                img9.setTexture(texture, new gd3d.math.border(15, 15, 15, 15));
            }
        });
        this.app.getAssetMgr().load("res/STXINGKA.TTF.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                _this.app.getAssetMgr().load("res/resources/STXINGKA.font.json", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                    if (s1.isfinish)
                        label.font = _this.app.getAssetMgr().getAssetByName("STXINGKA.font.json");
                });
            }
        });
        this.uileft += 150;
    };
    testReload.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 0.1);
        var z2 = Math.cos(this.timer * 0.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        if (this.cube != null) {
            objCam.lookat(this.cube);
            objCam.markDirty();
            objCam.updateWorldTran();
        }
    };
    return testReload;
}());
var t;
(function (t) {
    var TestRotate = (function () {
        function TestRotate() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.name = "10004_grass.pvr";
            this.angularVelocity = new gd3d.math.vector3(10, 0, 0);
            this.eulerAngle = gd3d.math.pool.new_vector3();
            this.zeroPoint = new gd3d.math.vector3(0, 0, 0);
            this.startdir = new gd3d.math.vector3(-1, 0, 0);
            this.enddir = new gd3d.math.vector3(0, 0, -1);
            this.targetdir = new gd3d.math.vector3();
        }
        TestRotate.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                state.finish = true;
            });
        };
        TestRotate.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        TestRotate.prototype.loadPvr = function (laststate, state) {
            this.app.getAssetMgr().load("res/resources/" + this.name, gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
            });
        };
        TestRotate.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 1000;
            objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        TestRotate.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName(this.name);
                        if (texture == null)
                            console.error("为什么他是空的呀");
                        else
                            cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                }
                {
                    var ref_cube = new gd3d.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 1;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("shader/def");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = ref_cube;
                }
                {
                    this.cubetrail = new gd3d.framework.transform();
                    this.cubetrail.localScale.x = this.cubetrail.localScale.y = this.cubetrail.localScale.z = 0.2;
                    this.cubetrail.localTranslate.x = -3;
                    var mesh = this.cubetrail.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = smesh;
                    this.cubetrail.gameObject.addComponent("meshRenderer");
                    this.scene.addChild(this.cubetrail);
                    this.cubetrail.markDirty();
                }
            }
            state.finish = true;
        };
        TestRotate.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadPvr.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        TestRotate.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null) {
                this.cube.localTranslate.x = Math.cos(this.timer) * 3.0;
                this.cube.localTranslate.z = Math.sin(this.timer) * 3.0;
                this.cube.lookatPoint(this.zeroPoint);
                this.cube.markDirty();
            }
            if (this.cube2) {
                this.cube2.lookatPoint(this.cube.getWorldTranslate());
                this.cube2.markDirty();
            }
            if (this.cubetrail) {
                var cube = this.cubetrail.clone();
                this.scene.addChild(cube);
                gd3d.math.vec3ScaleByNum(this.targetdir, 3, this.targetdir);
                gd3d.math.vec3Clone(this.targetdir, cube.localTranslate);
                cube.markDirty();
            }
        };
        return TestRotate;
    }());
    t.TestRotate = TestRotate;
})(t || (t = {}));
var test_ShadowMap = (function () {
    function test_ShadowMap() {
        this.timer = 0;
        this.posToUV = new gd3d.math.matrix();
        this.lightProjection = new gd3d.math.matrix();
    }
    test_ShadowMap.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        var name = "baihu";
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/scenes/testshadowmap/testshadowmap.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _scene = _this.app.getAssetMgr().getAssetByName("testshadowmap.scene.json");
                        var _root = _scene.getSceneRoot();
                        _this.scene.addChild(_root);
                        _root.markDirty();
                        _root.updateTran(false);
                        _root.updateAABBChild();
                        var _aabb = _root.aabbchild;
                        console.log(_aabb.maximum + " : " + _aabb.minimum);
                        _this.FitToScene(_this.lightcamera, _aabb);
                        _this.ShowCameraInfo(_this.lightcamera);
                        {
                            var depth = new gd3d.framework.cameraPostQueue_Depth();
                            depth.renderTarget = new gd3d.render.glRenderTarget(_this.scene.webgl, 1024, 1024, true, false);
                            _this.lightcamera.postQueues.push(depth);
                            _this.depthTexture = new gd3d.framework.texture("_depth");
                            _this.depthTexture.glTexture = depth.renderTarget;
                            gd3d.framework.shader.setGlobalTexture("_Light_Depth", _this.depthTexture);
                        }
                        {
                        }
                    }
                });
            }
        });
        var lightCamObj = new gd3d.framework.transform();
        lightCamObj.name = "LightCamera";
        this.scene.addChild(lightCamObj);
        lightCamObj.localTranslate = new gd3d.math.vector3(10, 10, -10);
        this.lightcamera = lightCamObj.gameObject.addComponent("camera");
        this.lightcamera.opvalue = 0;
        this.lightcamera.gameObject.transform.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        lightCamObj.markDirty();
        var viewCamObj = new gd3d.framework.transform();
        viewCamObj.name = "ViewCamera";
        this.scene.addChild(viewCamObj);
        viewCamObj.localTranslate = new gd3d.math.vector3(20, 20, 20);
        viewCamObj.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        this.viewcamera = viewCamObj.gameObject.addComponent("camera");
        this.viewcamera.backgroundColor = new gd3d.math.color(1, 0.11, 0.11, 1.0);
        viewCamObj.markDirty();
        this.ShowUI();
    };
    test_ShadowMap.prototype.update = function (delta) {
        this.posToUV.rawData[0] = 0.5;
        this.posToUV.rawData[1] = 0.0;
        this.posToUV.rawData[2] = 0.0;
        this.posToUV.rawData[3] = 0.0;
        this.posToUV.rawData[4] = 0.0;
        this.posToUV.rawData[5] = 0.5;
        this.posToUV.rawData[6] = 0.0;
        this.posToUV.rawData[7] = 0.0;
        this.posToUV.rawData[8] = 0.0;
        this.posToUV.rawData[9] = 0.0;
        this.posToUV.rawData[10] = 1.0;
        this.posToUV.rawData[11] = 0.0;
        this.posToUV.rawData[12] = 0.5;
        this.posToUV.rawData[13] = 0.5;
        this.posToUV.rawData[14] = 0.0;
        this.posToUV.rawData[15] = 1.0;
        var worldToView = gd3d.math.pool.new_matrix();
        this.lightcamera.calcViewMatrix(worldToView);
        var vpp = new gd3d.math.rect();
        this.lightcamera.calcViewPortPixel(this.app, vpp);
        this.asp = vpp.w / vpp.h;
        var projection = gd3d.math.pool.new_matrix();
        this.lightcamera.calcProjectMatrix(this.asp, projection);
        gd3d.math.matrixMultiply(projection, worldToView, this.lightProjection);
        gd3d.math.matrixMultiply(this.posToUV, this.lightProjection, this.lightProjection);
        gd3d.framework.shader.setGlobalMatrix("_LightProjection", this.lightProjection);
        gd3d.framework.shader.setGlobalFloat("_bias", 0.001);
    };
    test_ShadowMap.prototype.FitToScene = function (lightCamera, aabb) {
        lightCamera.gameObject.transform.setWorldPosition(new gd3d.math.vector3(aabb.center.x, aabb.center.y, aabb.center.z));
        var _vec3 = gd3d.math.pool.new_vector3();
        gd3d.math.vec3Subtract(aabb.maximum, aabb.minimum, _vec3);
        var maxLength = gd3d.math.vec3Length(_vec3);
        lightCamera.size = maxLength;
        lightCamera.near = -maxLength / 2;
        lightCamera.far = maxLength / 2;
    };
    test_ShadowMap.prototype.ShowUI = function () {
        var _this = this;
        document.addEventListener("keydown", function (ev) {
            if (ev.key === "c") {
                if (_this.viewcamera.postQueues.length > 0)
                    _this.viewcamera.postQueues = [];
                else {
                    var post = new gd3d.framework.cameraPostQueue_Quad();
                    post.material.setShader(_this.scene.app.getAssetMgr().getShader("mask.shader.json"));
                    post.material.setTexture("_MainTex", _this.depthTexture);
                    _this.viewcamera.postQueues.push(post);
                }
            }
        });
        this.labelNear = document.createElement("label");
        this.labelNear.style.top = "100px";
        this.labelNear.style.position = "absolute";
        this.app.container.appendChild(this.labelNear);
        this.inputNear = document.createElement("input");
        this.inputNear.type = "range";
        this.inputNear.min = "-15";
        this.inputNear.max = "15";
        this.inputNear.step = "0.1";
        this.inputNear.oninput = function () {
            var _value = parseFloat(_this.inputNear.value);
            if (_value > _this.lightcamera.far) {
                _value = _this.lightcamera.far;
                _this.inputNear.value = _value.toString();
            }
            _this.labelNear.textContent = "near :" + _value;
            _this.lightcamera.near = _value;
        };
        this.inputNear.style.top = "124px";
        this.inputNear.style.position = "absolute";
        this.app.container.appendChild(this.inputNear);
        this.labelFar = document.createElement("label");
        this.labelFar.style.top = "225px";
        this.labelFar.style.position = "absolute";
        this.app.container.appendChild(this.labelFar);
        this.inputFar = document.createElement("input");
        this.inputFar.type = "range";
        this.inputFar.min = "-15";
        this.inputFar.max = "15";
        this.inputFar.step = "0.1";
        this.inputFar.oninput = function () {
            var _value = parseFloat(_this.inputFar.value);
            if (_value < _this.lightcamera.near) {
                _value = _this.lightcamera.near;
                _this.inputFar.value = _value.toString();
            }
            _this.labelFar.textContent = "far :" + _value;
            _this.lightcamera.far = _value;
        };
        this.inputFar.style.top = "250px";
        this.inputFar.style.position = "absolute";
        this.app.container.appendChild(this.inputFar);
        var cameraRotateLabel = document.createElement("label");
        cameraRotateLabel.style.top = "375px";
        cameraRotateLabel.style.position = "absolute";
        cameraRotateLabel.textContent = "改变灯光角度";
        this.app.container.appendChild(cameraRotateLabel);
        var inputCameraRotateY = document.createElement("input");
        inputCameraRotateY.type = "range";
        inputCameraRotateY.min = "-180";
        inputCameraRotateY.max = "180";
        inputCameraRotateY.step = "1";
        inputCameraRotateY.oninput = function () {
            var _value = parseFloat(inputCameraRotateY.value);
            var _angle = _this.lightcamera.gameObject.transform.localEulerAngles;
            _this.lightcamera.gameObject.transform.localEulerAngles = new gd3d.math.vector3(_angle.x, _value, _angle.z);
            _this.lightcamera.gameObject.transform.markDirty();
        };
        inputCameraRotateY.style.top = "400px";
        inputCameraRotateY.style.position = "absolute";
        this.app.container.appendChild(inputCameraRotateY);
    };
    test_ShadowMap.prototype.ShowCameraInfo = function (camera) {
        var near = camera.near.toString();
        var far = camera.far.toString();
        this.inputNear.value = near;
        this.inputFar.value = far;
        this.labelNear.textContent = "near :" + near;
        this.labelFar.textContent = "far :" + far;
    };
    return test_ShadowMap;
}());
var t;
(function (t) {
    var test_skillsystem = (function () {
        function test_skillsystem() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.role = new gd3d.framework.transform();
            this.angularVelocity = new gd3d.math.vector3(0, 10, 0);
            this.eulerAngle = gd3d.math.pool.new_vector3();
        }
        test_skillsystem.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_skillsystem.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_skillsystem.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new gd3d.math.vector3(0, 10, 0);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
            state.finish = true;
        };
        test_skillsystem.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                }
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = cube;
                }
            }
            state.finish = true;
        };
        test_skillsystem.prototype.loadRole = function (laststate, state) {
            var _this = this;
            this.role.name = "role";
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json");
                    _this.role = _prefab.getCloneTrans();
                    _this.scene.addChild(_this.role);
                    _this.role.localScale = new gd3d.math.vector3(1, 1, 1);
                    _this.role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    _this.role.gameObject.visible = true;
                    var ap = _this.role.gameObject.getComponent("aniplayer");
                    ap.autoplay = true;
                    {
                        var play = document.createElement("button");
                        play.textContent = "play1";
                        play.onclick = function () {
                            _this.playAniAndEffect(ap, "attack_01", "fx_zs_male@attack_01", 0, 0);
                            _this.playAniAndEffect(ap, "attack_02", "fx_zs_male@attack_02", 1000, 1000);
                            _this.playAniAndEffect(ap, "attack_04", "fx_zs_male@attack_03", 3000, 1000);
                            setInterval(function () {
                                _this.playAniAndEffect(ap, "attack_01", "fx_zs_male@attack_01", 0, 0);
                                _this.playAniAndEffect(ap, "attack_02", "fx_zs_male@attack_02", 1000, 1000);
                                _this.playAniAndEffect(ap, "attack_04", "fx_zs_male@attack_03", 3000, 1000);
                            }, 6000);
                        };
                        play.style.left = "0px";
                        play.style.top = "240px";
                        play.style.position = "absolute";
                        _this.app.container.appendChild(play);
                    }
                }
                state.finish = true;
            });
        };
        test_skillsystem.prototype.playAniAndEffect = function (aniplayer, aniName, effectName, playAniDelay, afterAni_PlayEffectDelay) {
            var _this = this;
            {
                setTimeout(function () {
                    var aniclipName = aniName + ".FBAni.aniclip.bin";
                    aniplayer.playCross(aniclipName, 0.2);
                    setTimeout(function () {
                        if (_this.effect != null) {
                            _this.effect.gameObject.transform.dispose();
                        }
                        var path = "res/particleEffect/" + effectName + "/" + effectName + ".assetbundle.json";
                        _this.app.getAssetMgr().load(path, gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                            if (_state.isfinish) {
                                var tr = new gd3d.framework.transform();
                                _this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                                var text = _this.app.getAssetMgr().getAssetByName(effectName + ".effect.json");
                                _this.effect.setJsonData(text);
                                _this.role.addChild(tr);
                                var rotateVelocity = gd3d.math.pool.new_quaternion();
                                gd3d.math.quatFromEulerAngles(180, 0, 0, rotateVelocity);
                                gd3d.math.quatMultiply(rotateVelocity, tr.localRotate, tr.localRotate);
                                gd3d.math.pool.delete_quaternion(rotateVelocity);
                                tr.markDirty();
                                tr.updateWorldTran();
                            }
                        });
                    }, afterAni_PlayEffectDelay);
                }, playAniDelay);
            }
        };
        test_skillsystem.prototype.loadEffect = function (laststate, state) {
            var _this = this;
            var name = "fx_zs_male@attack_01";
            var path = "res/particleEffect/" + name + "/" + name + ".assetbundle.json";
            this.app.getAssetMgr().load(path, gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    var tr = new gd3d.framework.transform();
                    _this.effect = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                    var text = _this.app.getAssetMgr().getAssetByName(name + ".effect.json");
                    _this.effect.setJsonData(text);
                    _this.role.addChild(tr);
                    var rotateVelocity = gd3d.math.pool.new_quaternion();
                    gd3d.math.quatFromEulerAngles(180, 0, 0, rotateVelocity);
                    gd3d.math.quatMultiply(rotateVelocity, tr.localRotate, tr.localRotate);
                    gd3d.math.pool.delete_quaternion(rotateVelocity);
                    tr.markDirty();
                    tr.updateWorldTran();
                    state.finish = true;
                }
            });
        };
        test_skillsystem.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.loadEffect.bind(this));
        };
        test_skillsystem.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.role != null) {
                var cubeTransform = this.role.gameObject.transform;
                this.eulerAngle.x = delta * this.angularVelocity.x;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;
                var rotateVelocity = gd3d.math.pool.new_quaternion();
                gd3d.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);
                gd3d.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                gd3d.math.pool.delete_quaternion(rotateVelocity);
                cubeTransform.markDirty();
            }
        };
        return test_skillsystem;
    }());
    t.test_skillsystem = test_skillsystem;
})(t || (t = {}));
var t;
(function (t) {
    var test_sound = (function () {
        function test_sound() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.counttimer = 0;
            this.angularVelocity = new gd3d.math.vector3(10, 0, 0);
            this.eulerAngle = gd3d.math.pool.new_vector3();
            this.looped = null;
            this.once1 = null;
            this.once2 = null;
        }
        test_sound.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                state.finish = true;
            });
        };
        test_sound.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_sound.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 120;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_sound.prototype.addcube = function (laststate, state) {
            {
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                    cube.localTranslate.x = 0;
                    this.scene.addChild(cube);
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube = cube;
                }
            }
            state.finish = true;
        };
        test_sound.prototype.loadSoundInfe = function (laststate, state) {
            var _this = this;
            {
                var tr = new gd3d.framework.transform();
                var player_1 = tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_AUDIOPLAYER);
                this.app.getScene().addChild(tr);
                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/music1.mp3", function (buf, err) {
                    _this.looped = buf;
                    player_1.init("abc", gd3d.framework.AudioEx.instance().createAudioChannel(), false);
                    player_1.play(buf, 0);
                });
                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound1.mp3", function (buf, err) {
                    _this.once1 = buf;
                });
                gd3d.framework.AudioEx.instance().loadAudioBuffer("res/audio/sound2.mp3", function (buf, err) {
                    _this.once2 = buf;
                    player_1.init("once2", gd3d.framework.AudioEx.instance().createAudioChannel(), false);
                    player_1.play(buf, 0);
                });
                {
                    var button = document.createElement("button");
                    button.textContent = "play once1";
                    button.onclick = function () {
                        player_1.init("once1", gd3d.framework.AudioEx.instance().createAudioChannel(), false);
                        player_1.play(_this.once1, 0);
                    };
                    button.style.top = "130px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play once2";
                    button.onclick = function () {
                        player_1.init("once2", gd3d.framework.AudioEx.instance().createAudioChannel(), false);
                        player_1.play(_this.once2, 0);
                    };
                    button.style.top = "130px";
                    button.style.left = "90px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "play loop";
                    button.onclick = function () {
                        player_1.init("abc", gd3d.framework.AudioEx.instance().createAudioChannel(), true);
                        player_1.play(_this.looped, 0);
                    };
                    button.style.top = "160px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    var button = document.createElement("button");
                    button.textContent = "stop loop";
                    button.onclick = function () {
                        player_1.stop();
                    };
                    button.style.top = "160px";
                    button.style.left = "90px";
                    button.style.position = "absolute";
                    this.app.container.appendChild(button);
                }
                {
                    document.body.appendChild(document.createElement("p"));
                    var input = document.createElement("input");
                    input.type = "range";
                    input.valueAsNumber = 10;
                    player_1.volume = -0.2;
                    input.oninput = function (e) {
                        var value = (input.valueAsNumber - 50) / 50;
                        player_1.volume = value;
                    };
                    input.style.top = "190px";
                    input.style.position = "absolute";
                    this.app.container.appendChild(input);
                }
            }
            state.finish = true;
        };
        test_sound.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
            this.taskmgr.addTaskCall(this.loadSoundInfe.bind(this));
            gd3d.framework.AudioEx.instance().clickInit();
        };
        test_sound.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null) {
                var cubeTransform = this.cube.gameObject.transform;
                this.eulerAngle.x = delta * this.angularVelocity.x * 10;
                this.eulerAngle.y = delta * this.angularVelocity.y;
                this.eulerAngle.z = delta * this.angularVelocity.z;
                var rotateVelocity = gd3d.math.pool.new_quaternion();
                gd3d.math.quatFromEulerAngles(this.eulerAngle.x, this.eulerAngle.y, this.eulerAngle.z, rotateVelocity);
                gd3d.math.quatMultiply(rotateVelocity, cubeTransform.localRotate, cubeTransform.localRotate);
                cubeTransform.markDirty();
            }
        };
        return test_sound;
    }());
    t.test_sound = test_sound;
})(t || (t = {}));
var test_streamlight = (function () {
    function test_streamlight() {
        this.cubes = {};
        this.timer = 0;
    }
    test_streamlight.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        var baihu = new gd3d.framework.transform();
        baihu.name = "baihu";
        baihu.localScale.x = baihu.localScale.y = baihu.localScale.z = 1;
        this.scene.addChild(baihu);
        {
            var lighttran = new gd3d.framework.transform();
            this.scene.addChild(lighttran);
            var light = lighttran.gameObject.addComponent("light");
            lighttran.localTranslate.x = 2;
            lighttran.localTranslate.z = 1;
            lighttran.localTranslate.y = 3;
            lighttran.markDirty();
        }
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/prefabs/streamlight/anim/0001_shengyi_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var _prefab = _this.app.getAssetMgr().getAssetByName("0001_shengyi_male.prefab.json");
                        baihu = _prefab.getCloneTrans();
                        _this.player = baihu;
                        _this.scene.addChild(baihu);
                        objCam.lookat(baihu);
                        objCam.markDirty();
                        var bb = _prefab.getCloneTrans();
                        _this.scene.addChild(bb);
                        bb.localTranslate = new gd3d.math.vector3(2, 0, 0);
                        bb.markDirty();
                        var bodyRenderer = bb.children[0].gameObject.getComponent("skinnedMeshRenderer");
                        var mat = bodyRenderer.materials[0].clone();
                        bodyRenderer.materials[0] = mat;
                        mat.setVector4("_LightTex_ST", new gd3d.math.vector4(2, 2, 0, 0));
                        console.log("aaa");
                    }
                });
            }
        });
        this.cube = baihu;
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        objCam.lookat(baihu);
        objCam.markDirty();
    };
    test_streamlight.prototype.update = function (delta) {
        this.timer += delta;
        var x = Math.sin(this.timer);
        var z = Math.cos(this.timer);
        var x2 = Math.sin(this.timer * 1.1);
        var z2 = Math.cos(this.timer * 1.1);
        var objCam = this.camera.gameObject.transform;
        objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
        objCam.lookat(this.cube);
        objCam.markDirty();
        objCam.updateWorldTran();
    };
    return test_streamlight;
}());
var t;
(function (t) {
    var test_trailrenderrecorde = (function () {
        function test_trailrenderrecorde() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.WaveFrequency = 4.0;
            this.WaveAmplitude = 0.05;
            this.play = true;
        }
        test_trailrenderrecorde.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_trailrenderrecorde.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/trailtest2_00000.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/rock256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/swingFX.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_trailrenderrecorde.prototype.loadRole = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/0000_zs_male/0000_zs_male.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0000_zs_male.prefab.json");
                    _this.role = _prefab.getCloneTrans();
                    _this.role.name = "role";
                    _this.roleLength = _this.role.children.length;
                    _this.scene.addChild(_this.role);
                    _this.role.localScale = new gd3d.math.vector3(1, 1, 1);
                    _this.role.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    _this.role.gameObject.visible = true;
                    _this.role.markDirty();
                    _this.role.updateWorldTran();
                    _this.aniplayer = _this.role.gameObject.getComponent("aniplayer");
                    state.finish = true;
                }
            });
        };
        test_trailrenderrecorde.prototype.loadWeapon = function (laststate, state) {
            var _this = this;
            this.app.getAssetMgr().load("res/prefabs/0002_sword_sword/0002_sword_sword.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    if (_this.weapon)
                        _this.weapon.parent.removeChild(_this.weapon);
                    var _prefab = _this.app.getAssetMgr().getAssetByName("0002_sword_sword.prefab.json");
                    _this.weapon = _prefab.getCloneTrans();
                    _this.weapon.localScale = new gd3d.math.vector3(1, 1, 1);
                    _this.weapon.localTranslate = new gd3d.math.vector3(0, 0, 0);
                    var obj = _this.role.find("Bip001 Prop1");
                    obj.addChild(_this.weapon);
                    state.finish = true;
                }
            });
        };
        test_trailrenderrecorde.prototype.initscene = function (laststate, state) {
            {
                var objCam = new gd3d.framework.transform();
                objCam.name = "sth.";
                this.scene.addChild(objCam);
                this.camera = objCam.gameObject.addComponent("camera");
                this.camera.near = 0.01;
                this.camera.far = 100;
                this.camera.fov = Math.PI * 0.3;
                this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
                objCam.localTranslate = new gd3d.math.vector3(0, 5, -5);
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
                {
                    var org = new gd3d.framework.transform();
                    org.name = "org";
                    this.org = org;
                    this.scene.addChild(org);
                }
                {
                    var ref_cube = new gd3d.framework.transform();
                    ref_cube.name = "ref_cube";
                    ref_cube.localScale.x = ref_cube.localScale.y = ref_cube.localScale.z = 5;
                    ref_cube.localTranslate.y = -2;
                    this.scene.addChild(ref_cube);
                    var mesh = ref_cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("plane");
                    mesh.mesh = (smesh);
                    var renderer = ref_cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var sh = this.app.getAssetMgr().getShader("diffuse_bothside.shader.json");
                    if (sh != null) {
                        cuber.materials = [];
                        cuber.materials.push(new gd3d.framework.material());
                        cuber.materials[0].setShader(sh);
                        var texture = this.app.getAssetMgr().getAssetByName("rock256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                    this.cube2 = ref_cube;
                }
                {
                    var cube = new gd3d.framework.transform();
                    cube.name = "cube";
                    this.cube = cube;
                    org.addChild(cube);
                    cube.localTranslate.x = -5;
                    cube.markDirty();
                    var mesh = cube.gameObject.addComponent("meshFilter");
                    var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                    mesh.mesh = (smesh);
                    var renderer = cube.gameObject.addComponent("meshRenderer");
                    var cuber = renderer;
                    var trailtrans = new gd3d.framework.transform();
                    trailtrans.localTranslate.z = 0.5;
                    this.weapon.addChild(trailtrans);
                    gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_right, 270, trailtrans.localRotate);
                    trailtrans.markDirty();
                    var trailrender = trailtrans.gameObject.addComponent("trailRender_recorde");
                    trailrender.setWidth(1);
                    var mat = new gd3d.framework.material();
                    var shader = this.app.getAssetMgr().getShader("transparent_bothside.shader.json");
                    var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                    mat.setShader(shader);
                    mat.setTexture("_MainTex", tex);
                    trailrender.material = mat;
                    trailrender.setWidth(1, 1);
                }
            }
            state.finish = true;
        };
        test_trailrenderrecorde.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.wind = new gd3d.math.vector4();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.loadRole.bind(this));
            this.taskmgr.addTaskCall(this.loadWeapon.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            var tbn1 = this.addbtn("80px", "0px", "attack_01");
            tbn1.onclick = function () {
                var name = "attack_01.FBAni.aniclip.bin";
                _this.aniplayer.playCross(name, 0.2);
            };
            var btn = this.addbtn("120px", "0px", "attack_02");
            btn.onclick = function () {
                var name = "attack_02.FBAni.aniclip.bin";
                _this.aniplayer.playCross(name, 0.2);
            };
            {
                var btn2 = this.addbtn("160px", "0px", "playAttackAni");
                btn2.onclick = function () {
                    var name = "attack_04.FBAni.aniclip.bin";
                    _this.aniplayer.playCross(name, 0.2);
                };
            }
        };
        test_trailrenderrecorde.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
        };
        test_trailrenderrecorde.prototype.addbtn = function (top, left, text) {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = text;
            this.app.container.appendChild(btn);
            return btn;
        };
        return test_trailrenderrecorde;
    }());
    t.test_trailrenderrecorde = test_trailrenderrecorde;
})(t || (t = {}));
var test_texuv = (function () {
    function test_texuv() {
        this.timer = 0;
    }
    test_texuv.prototype.start = function (app) {
        var _this = this;
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        this.scene.getRoot().localTranslate = new gd3d.math.vector3(0, 0, 0);
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
            if (state.isfinish) {
                _this.app.getAssetMgr().load("res/trailtest_yellow.png", gd3d.framework.AssetTypeEnum.Auto, function (state) {
                    if (state.isfinish) {
                        var mat = t.DBgetMat("trailtest_yellow.png");
                        var trans1 = t.DBgetAtrans(mat);
                        _this.scene.addChild(trans1);
                        var mat2 = t.DBgetMat(null, "testtexuv.shader.json");
                        var trans2 = t.DBgetAtrans(mat2);
                        _this.scene.addChild(trans2);
                        trans1.localTranslate.x = -1;
                        trans2.localTranslate.x = 1;
                        trans1.markDirty();
                        trans2.markDirty();
                    }
                });
            }
        });
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 2, 5);
        objCam.lookatPoint(new gd3d.math.vector3());
        objCam.markDirty();
    };
    test_texuv.prototype.update = function (delta) {
    };
    return test_texuv;
}());
var t;
(function (t) {
    var test_trailrender = (function () {
        function test_trailrender() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.WaveFrequency = 4.0;
            this.WaveAmplitude = 0.05;
            this.play = true;
        }
        test_trailrender.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish) {
                    state.finish = true;
                }
            });
        };
        test_trailrender.prototype.loadText = function (laststate, state) {
            var i = 2;
            this.app.getAssetMgr().load("res/swingFX.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    i--;
                    if (i == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
            this.app.getAssetMgr().load("res/trailtest2_00000.imgdesc.json", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    i--;
                    if (i == 0) {
                        state.finish = true;
                    }
                }
                else {
                    state.error = true;
                }
            });
        };
        test_trailrender.prototype.initscene = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 100;
            this.camera.fov = Math.PI * 0.3;
            this.camera.backgroundColor = new gd3d.math.color(0, 0, 0, 1);
            objCam.localTranslate = new gd3d.math.vector3(0, 20, -20);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            {
                var org = new gd3d.framework.transform();
                org.name = "org";
                this.org = org;
                this.scene.addChild(org);
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                this.cube = cube;
                org.addChild(cube);
                cube.localTranslate.x = -5;
                cube.localScale.y = 0.1;
                cube.localScale.z = 0.5;
                cube.localScale.x = 5;
                cube.markDirty();
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var trailtrans = new gd3d.framework.transform();
                trailtrans.localTranslate.x = -0.1;
                cube.addChild(trailtrans);
                gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_forward, 90, trailtrans.localRotate);
                trailtrans.markDirty();
                var trailrender = trailtrans.gameObject.addComponent("trailRender_recorde");
                var mat = new gd3d.framework.material();
                var shader = this.app.getAssetMgr().getShader("particles_additive_premultiply.shader.json");
                var tex = this.app.getAssetMgr().getAssetByName("trailtest2_00000.imgdesc.json");
                mat.setShader(shader);
                mat.setTexture("_MainTex", tex);
                trailrender.material = mat;
                trailrender.lifetime = 1.5;
                trailrender.minStickDistance = 1.3;
                trailrender.interpolate = true;
                trailrender.setWidth(1, 1);
            }
            state.finish = true;
        };
        test_trailrender.prototype.start = function (app) {
            var _this = this;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.wind = new gd3d.math.vector4();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.initscene.bind(this));
            var tbn = this.addbtn("80px", "0px", "start");
            tbn.onclick = function () {
                _this.play = true;
            };
            var btn = this.addbtn("120px", "0px", "stop");
            btn.onclick = function () {
                _this.play = false;
            };
        };
        test_trailrender.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            if (this.org != undefined && this.play) {
                this.timer++;
                gd3d.math.quatFromAxisAngle(gd3d.math.pool.vector3_up, this.timer * 5, this.org.localRotate);
                this.org.markDirty();
            }
        };
        test_trailrender.prototype.addbtn = function (top, left, text) {
            var btn = document.createElement("button");
            btn.style.top = top;
            btn.style.left = left;
            btn.style.position = "absolute";
            btn.textContent = text;
            this.app.container.appendChild(btn);
            return btn;
        };
        return test_trailrender;
    }());
    t.test_trailrender = test_trailrender;
})(t || (t = {}));
var t;
(function (t_2) {
    var enumcheck;
    (function (enumcheck) {
        enumcheck[enumcheck["AA"] = 0] = "AA";
        enumcheck[enumcheck["BB"] = 1] = "BB";
        enumcheck[enumcheck["CC"] = 2] = "CC";
    })(enumcheck = t_2.enumcheck || (t_2.enumcheck = {}));
    var enummap = {};
    var test_ui = (function () {
        function test_ui() {
            this.amount = 1;
            this.timer = 0;
            this.bere = false;
            this.bere1 = false;
        }
        test_ui.prototype.start = function (app) {
            var _this = this;
            enummap["enumcheck"] = enumcheck;
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            var cuber;
            console.warn("Finish it.");
            this.app.getAssetMgr().load("res/zg256.png");
            var sh = this.app.getAssetMgr().getShader("color");
            if (sh != null) {
                cuber.materials = [];
                cuber.materials.push(new gd3d.framework.material());
                cuber.materials[0].setShader(sh);
                this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        console.warn("Finish load img.");
                        var texture = _this.app.getAssetMgr().getAssetByName("zg256.png");
                        cuber.materials[0].setTexture("_MainTex", texture);
                    }
                });
            }
            var cube = new gd3d.framework.transform();
            cube.name = "cube";
            cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
            this.scene.addChild(cube);
            var mesh = cube.gameObject.addComponent("meshFilter");
            var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
            mesh.mesh = (smesh);
            var renderer = cube.gameObject.addComponent("meshRenderer");
            cuber = renderer;
            this.cube = cube;
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 10;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookat(cube);
            objCam.markDirty();
            var o2d = new gd3d.framework.overlay2D();
            this.camera.addOverLay(o2d);
            {
                var t2d = new gd3d.framework.transform2D();
                t2d.width = 150;
                t2d.height = 150;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.markDirty();
                t2d.addComponent("rawImage2D");
                o2d.addChild(t2d);
            }
            {
                var t2d_1 = new gd3d.framework.transform2D();
                t2d_1.width = 150;
                t2d_1.height = 150;
                t2d_1.pivot.x = 0;
                t2d_1.pivot.y = 0;
                t2d_1.localTranslate.x = 150;
                var img_1_1 = t2d_1.addComponent("image2D");
                img_1_1.imageType = gd3d.framework.ImageType.Simple;
                o2d.addChild(t2d_1);
                var t2d_2 = new gd3d.framework.transform2D();
                t2d_2.width = 150;
                t2d_2.height = 150;
                t2d_2.pivot.x = 0;
                t2d_2.pivot.y = 0;
                t2d_2.localTranslate.x = 300;
                var img_2_1 = t2d_2.addComponent("image2D");
                img_2_1.imageType = gd3d.framework.ImageType.Sliced;
                o2d.addChild(t2d_2);
                var t2d_3 = new gd3d.framework.transform2D();
                t2d_3.width = 150;
                t2d_3.height = 150;
                t2d_3.pivot.x = 0;
                t2d_3.pivot.y = 0;
                t2d_3.localTranslate.x = 450;
                this.img_3 = t2d_3.addComponent("image2D");
                this.img_3.imageType = gd3d.framework.ImageType.Filled;
                this.img_3.fillMethod = gd3d.framework.FillMethod.Vertical;
                this.img_3.fillAmmount = 1;
                o2d.addChild(t2d_3);
                var t2d_4 = new gd3d.framework.transform2D();
                t2d_4.width = 150;
                t2d_4.height = 150;
                t2d_4.pivot.x = 0;
                t2d_4.pivot.y = 0;
                t2d_4.localTranslate.x = 600;
                this.img_4 = t2d_4.addComponent("image2D");
                this.img_4.imageType = gd3d.framework.ImageType.Filled;
                this.img_4.fillMethod = gd3d.framework.FillMethod.Horizontal;
                this.img_4.fillAmmount = 1;
                o2d.addChild(t2d_4);
                var t2d_5 = new gd3d.framework.transform2D();
                t2d_5.width = 150;
                t2d_5.height = 150;
                t2d_5.pivot.x = 0;
                t2d_5.pivot.y = 0;
                t2d_5.localTranslate.x = 750;
                this.img_5 = t2d_5.addComponent("image2D");
                this.img_5.imageType = gd3d.framework.ImageType.Filled;
                this.img_5.fillMethod = gd3d.framework.FillMethod.Radial_90;
                this.img_5.fillAmmount = 1;
                o2d.addChild(t2d_5);
                var t2d_6 = new gd3d.framework.transform2D();
                t2d_6.width = 150;
                t2d_6.height = 150;
                t2d_6.pivot.x = 0;
                t2d_6.pivot.y = 0;
                t2d_6.localTranslate.x = 150;
                t2d_6.localTranslate.y = 150;
                var img_6_1 = t2d_6.addComponent("image2D");
                img_6_1.imageType = gd3d.framework.ImageType.Tiled;
                o2d.addChild(t2d_6);
                var t2d_7 = new gd3d.framework.transform2D();
                t2d_7.width = 150;
                t2d_7.height = 150;
                t2d_7.pivot.x = 0;
                t2d_7.pivot.y = 0;
                t2d_7.localTranslate.x = 300;
                t2d_7.localTranslate.y = 150;
                this.img_7 = t2d_7.addComponent("image2D");
                this.img_7.imageType = gd3d.framework.ImageType.Filled;
                this.img_7.fillMethod = gd3d.framework.FillMethod.Radial_180;
                this.img_7.fillAmmount = 1;
                o2d.addChild(t2d_7);
                var t2d_8 = new gd3d.framework.transform2D();
                t2d_8.width = 150;
                t2d_8.height = 150;
                t2d_8.pivot.x = 0;
                t2d_8.pivot.y = 0;
                t2d_8.localTranslate.x = 450;
                t2d_8.localTranslate.y = 150;
                this.img_8 = t2d_8.addComponent("image2D");
                this.img_8.imageType = gd3d.framework.ImageType.Filled;
                this.img_8.fillMethod = gd3d.framework.FillMethod.Radial_360;
                this.img_8.fillAmmount = 1;
                o2d.addChild(t2d_8);
                var t2d_9 = new gd3d.framework.transform2D();
                t2d_9.width = 150;
                t2d_9.height = 50;
                t2d_9.pivot.x = 0;
                t2d_9.pivot.y = 0;
                t2d_9.localTranslate.x = 150;
                t2d_9.localTranslate.y = 300;
                var btn = t2d_9.addComponent("button");
                var img9_1 = t2d_9.addComponent("image2D");
                img9_1.imageType = gd3d.framework.ImageType.Sliced;
                btn.targetImage = img9_1;
                btn.transition = gd3d.framework.TransitionType.ColorTint;
                btn.onClick.addListener(function () {
                    console.log("按钮点下了");
                });
                o2d.addChild(t2d_9);
                var lab = new gd3d.framework.transform2D();
                lab.name = "lab111";
                lab.width = 150;
                lab.height = 50;
                lab.pivot.x = 0;
                lab.pivot.y = 0;
                lab.localTranslate.y = -10;
                lab.markDirty();
                var label = lab.addComponent("label");
                label.text = "这是按钮";
                label.fontsize = 25;
                label.color = new gd3d.math.color(1, 0, 0, 1);
                t2d_9.addChild(lab);
                this.app.getAssetMgr().load("res/1.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.app.getAssetMgr().load("res/resources/1.atlas.json", gd3d.framework.AssetTypeEnum.Auto, function (state) {
                            if (state.isfinish) {
                                var atlas = _this.app.getAssetMgr().getAssetByName("1.atlas.json");
                                img_1_1.setTexture(atlas.texture);
                                img_2_1.sprite = atlas.sprites["card_role_1_face"];
                                img_2_1.sprite.border = new gd3d.math.border(10, 10, 10, 10);
                                _this.img_3.sprite = atlas.sprites["card_role_1_face"];
                                _this.img_4.sprite = atlas.sprites["card_role_1_face"];
                                _this.img_5.sprite = atlas.sprites["card_role_1_face"];
                                img_6_1.sprite = atlas.sprites["card_role_1_face"];
                                _this.img_7.sprite = atlas.sprites["card_role_1_face"];
                                _this.img_8.sprite = atlas.sprites["card_role_1_face"];
                            }
                        });
                    }
                });
                this.app.getAssetMgr().load("res/uisprite.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        var texture = _this.app.getAssetMgr().getAssetByName("uisprite.png");
                        img9_1.setTexture(texture, new gd3d.math.border(15, 15, 15, 15));
                    }
                });
                this.app.getAssetMgr().load("res/STXINGKA.TTF.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                    if (s.isfinish) {
                        _this.app.getAssetMgr().load("res/resources/STXINGKA.font.json", gd3d.framework.AssetTypeEnum.Auto, function (s1) {
                            if (s1.isfinish)
                                label.font = _this.app.getAssetMgr().getAssetByName("STXINGKA.font.json");
                        });
                    }
                });
            }
            var t = new gd3d.framework.transform();
            t.localScale.x = t.localScale.y = t.localScale.z = 1;
            var c2d = t.gameObject.addComponent("canvasRenderer");
            t.localTranslate.y = 1;
            this.scene.addChild(t);
            {
                var t2d = new gd3d.framework.transform2D();
                t2d.width = 400;
                t2d.height = 400;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.markDirty();
                t2d.addComponent("rawImage2D");
                c2d.addChild(t2d);
            }
            for (var i = 0; i < 10; i++) {
                var t2d = new gd3d.framework.transform2D();
                t2d.width = 50;
                t2d.height = 50;
                t2d.pivot.x = 0;
                t2d.pivot.y = 0;
                t2d.localTranslate.x = 100 * i;
                t2d.localRotate = i;
                t2d.markDirty();
                var img = t2d.addComponent("rawImage2D");
                img.color.b = i * 0.1;
                img.image = this.app.getAssetMgr().getDefaultTexture("white");
                c2d.addChild(t2d);
            }
        };
        test_ui.prototype.update = function (delta) {
            this.timer += delta;
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            var objCam = this.camera.gameObject.transform;
            objCam.localTranslate = new gd3d.math.vector3(x2 * 5, 2.25, -z2 * 5);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            if (this.timer > 5 && !this.bere) {
                this.bere = true;
                this.app.closeFps();
            }
            if (this.timer > 10 && !this.bere1) {
                this.bere1 = true;
                this.app.showFps();
            }
            if ((this.amount + delta / 2) > 1)
                this.amount = 0;
            else
                this.amount += delta / 2;
            this.img_3.fillAmmount = this.amount;
            this.img_4.fillAmmount = this.amount;
            this.img_5.fillAmmount = this.amount;
            this.img_7.fillAmmount = this.amount;
            this.img_8.fillAmmount = this.amount;
        };
        return test_ui;
    }());
    t_2.test_ui = test_ui;
})(t || (t = {}));
var testUserCodeUpdate = (function () {
    function testUserCodeUpdate() {
        this.beExecuteInEditorMode = false;
        this.timer = 0;
    }
    testUserCodeUpdate.prototype.onStart = function (app) {
        this.app = app;
    };
    testUserCodeUpdate.prototype.onUpdate = function (delta) {
        if (this.trans == null || this.trans == undefined) {
            this.trans = this.app.getScene().getChildByName("Cube");
        }
        if (this.trans == null || this.trans == undefined)
            return;
        this.timer += delta * 15;
        gd3d.math.quatFromAxisAngle(new gd3d.math.vector3(0, 1, 0), this.timer, this.trans.localRotate);
        this.trans.markDirty();
    };
    testUserCodeUpdate.prototype.isClosed = function () {
        return false;
    };
    testUserCodeUpdate = __decorate([
        gd3d.reflect.userCode
    ], testUserCodeUpdate);
    return testUserCodeUpdate;
}());
var t;
(function (t) {
    var test_uvroll = (function () {
        function test_uvroll() {
            this.timer = 0;
            this.taskmgr = new gd3d.framework.taskMgr();
            this.count = 0;
            this.row = 3;
            this.col = 3;
            this.totalframe = 9;
            this.fps = 2;
        }
        test_uvroll.prototype.loadShader = function (laststate, state) {
            this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
                if (_state.isfinish)
                    state.finish = true;
            });
        };
        test_uvroll.prototype.loadText = function (laststate, state) {
            this.app.getAssetMgr().load("res/uvSprite.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
                if (s.isfinish) {
                    state.finish = true;
                }
                else {
                    state.error = true;
                }
            });
        };
        test_uvroll.prototype.addcube = function (laststate, state) {
            {
                var cube = new gd3d.framework.transform();
                cube.name = "cube";
                cube.localScale.x = cube.localScale.y = cube.localScale.z = 1;
                cube.localTranslate.x = -1;
                this.scene.addChild(cube);
                var mesh = cube.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh.mesh = (smesh);
                var renderer = cube.gameObject.addComponent("meshRenderer");
                var cuber = renderer;
                var sh = this.app.getAssetMgr().getShader("sample_uvsprite.shader.json");
                if (sh != null) {
                    cuber.materials = [];
                    cuber.materials.push(new gd3d.framework.material());
                    cuber.materials[0].setShader(sh);
                    var texture = this.app.getAssetMgr().getAssetByName("uvSprite.png");
                    cuber.materials[0].setTexture("_MainTex", texture);
                }
                this.cube = cube;
            }
            {
                var cube1 = new gd3d.framework.transform();
                cube1.name = "cube1";
                cube1.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube1.localTranslate.x = 1;
                this.scene.addChild(cube1);
                var mesh1 = cube1.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer1 = cube1.gameObject.addComponent("meshRenderer");
                var cuber1 = renderer1;
                var sh = this.app.getAssetMgr().getShader("uvroll.shader.json");
                if (sh != null) {
                    cuber1.materials = [];
                    cuber1.materials.push(new gd3d.framework.material());
                    cuber1.materials[0].setShader(sh);
                    var texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png");
                    cuber1.materials[0].setTexture("_MainTex", texture1);
                    cuber1.materials[0].setFloat("_SpeedU", 3);
                    cuber1.materials[0].setFloat("_SpeedV", 1);
                    this.cube1 = cube1;
                }
            }
            {
                var cube2 = new gd3d.framework.transform();
                cube2.name = "cube2222";
                cube2.localScale.x = cube1.localScale.y = cube1.localScale.z = 1;
                cube2.localTranslate.y = 1;
                this.scene.addChild(cube2);
                var mesh1 = cube2.gameObject.addComponent("meshFilter");
                var smesh = this.app.getAssetMgr().getDefaultMesh("cube");
                mesh1.mesh = (smesh);
                var renderer2 = cube2.gameObject.addComponent("meshRenderer");
                var sh = this.app.getAssetMgr().getShader("selftimer_uvroll.shader.json");
                if (sh != null) {
                    renderer2.materials = [];
                    renderer2.materials.push(new gd3d.framework.material());
                    renderer2.materials[0].setShader(sh);
                    var texture1 = this.app.getAssetMgr().getAssetByName("uvSprite.png");
                    renderer2.materials[0].setTexture("_MainTex", texture1);
                }
                this.cube2 = cube2;
            }
            state.finish = true;
        };
        test_uvroll.prototype.addcam = function (laststate, state) {
            var objCam = new gd3d.framework.transform();
            objCam.name = "sth.";
            this.scene.addChild(objCam);
            this.camera = objCam.gameObject.addComponent("camera");
            this.camera.near = 0.01;
            this.camera.far = 30;
            objCam.localTranslate = new gd3d.math.vector3(0, 0, -10);
            objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
            objCam.markDirty();
            state.finish = true;
        };
        test_uvroll.prototype.start = function (app) {
            console.log("i am here.");
            this.app = app;
            this.scene = this.app.getScene();
            this.taskmgr.addTaskCall(this.loadShader.bind(this));
            this.taskmgr.addTaskCall(this.loadText.bind(this));
            this.taskmgr.addTaskCall(this.addcube.bind(this));
            this.taskmgr.addTaskCall(this.addcam.bind(this));
        };
        test_uvroll.prototype.update = function (delta) {
            this.taskmgr.move(delta);
            this.timer += delta;
            if (this.cube != null) {
                var curframe = Math.floor(this.timer * this.fps);
                curframe = curframe % this.totalframe;
                var vec41 = new gd3d.math.vector4();
                gd3d.math.spriteAnimation(3, 3, curframe, vec41);
                var renderer = this.cube.gameObject.getComponent("meshRenderer");
                renderer.materials[0].setVector4("_MainTex_ST", vec41);
            }
            if (this.cube2 != null) {
                var renderer2 = this.cube2.gameObject.getComponent("meshRenderer");
                renderer2.materials[0].setVector4("_MainTex_ST", new gd3d.math.vector4(1.0, 1.0, 0, 0));
                renderer2.materials[0].setFloat("_SpeedU", 3.0);
                renderer2.materials[0].setFloat("_SpeedV", 1.0);
                renderer2.materials[0].setFloat("self_timer", this.timer);
            }
            var x = Math.sin(this.timer);
            var z = Math.cos(this.timer);
            var x2 = Math.sin(this.timer * 0.1);
            var z2 = Math.cos(this.timer * 0.1);
            if (this.camera != null) {
                var objCam = this.camera.gameObject.transform;
                objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
                objCam.markDirty();
            }
        };
        return test_uvroll;
    }());
    t.test_uvroll = test_uvroll;
})(t || (t = {}));
var CameraController = (function () {
    function CameraController() {
        this.moveSpeed = 10;
        this.movemul = 5;
        this.wheelSpeed = 1;
        this.rotateSpeed = 0.1;
        this.keyMap = {};
        this.beRightClick = false;
        this.isInit = false;
        this.moveVector = new gd3d.math.vector3(0, 0, 1);
    }
    CameraController.instance = function () {
        if (CameraController.g_this == null) {
            CameraController.g_this = new CameraController();
        }
        return CameraController.g_this;
    };
    CameraController.prototype.update = function (delta) {
        if (this.beRightClick) {
            this.doMove(delta);
        }
    };
    CameraController.prototype.init = function (app, target) {
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
        document.oncontextmenu = function (ev) {
            ev.preventDefault();
        };
    };
    CameraController.prototype.doMove = function (delta) {
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
    CameraController.prototype.doRotate = function (rotateX, rotateY) {
        this.rotAngle.x += rotateY * this.rotateSpeed;
        this.rotAngle.y += rotateX * this.rotateSpeed;
        this.rotAngle.x %= 360;
        this.rotAngle.y %= 360;
        gd3d.math.quatFromEulerAngles(this.rotAngle.x, this.rotAngle.y, this.rotAngle.z, this.target.gameObject.transform.localRotate);
    };
    CameraController.prototype.lookat = function (trans) {
        this.target.gameObject.transform.lookat(trans);
        this.target.gameObject.transform.markDirty();
        gd3d.math.quatToEulerAngles(this.target.gameObject.transform.localRotate, this.rotAngle);
    };
    CameraController.prototype.checkOnRightClick = function (mouseEvent) {
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
    CameraController.prototype.doMouseWheel = function (ev, isFirefox) {
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
    CameraController.prototype.remove = function () {
    };
    return CameraController;
}());
var EffectElement = (function (_super) {
    __extends(EffectElement, _super);
    function EffectElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = gd3d.framework.EffectElementTypeEnum.SingleMeshType;
        _this.beLoop = false;
        return _this;
    }
    return EffectElement;
}(gd3d.framework.transform));
var test_effecteditor = (function () {
    function test_effecteditor() {
        this.timer = 0;
        this.taskmgr = new gd3d.framework.taskMgr();
        this.length = 0;
        this.beclone = false;
        this.effectloaded = false;
        this.bestop = false;
        this.bereplay = false;
    }
    test_effecteditor.prototype.setVal = function (val, property, data) {
        if (val != "") {
            try {
                var v = parseFloat(val);
                data[property] = v;
            }
            catch (e) {
            }
        }
    };
    test_effecteditor.prototype.start = function (app) {
        var _this = this;
        this.app = app;
        this.scene = this.app.getScene();
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = "20px";
        this.app.container.appendChild(div);
        this.gui = new lighttool.htmlui.gui(div);
        lighttool.htmlui.panelMgr.instance().init(div);
        this.gui.onchange = function () {
        };
        setInterval(function () {
            _this.gui.update();
        }, 300);
        this.taskmgr.addTaskCall(this.loadShader.bind(this));
        this.taskmgr.addTaskCall(this.loadText.bind(this));
        this.taskmgr.addTaskCall(this.addcam.bind(this));
        this.taskmgr.addTaskCall(this.loadEffect.bind(this));
    };
    test_effecteditor.prototype.addElement = function () {
        var element = new gd3d.framework.EffectElementData();
        element.name = "element" + this.length;
        this.effectSysData.elementDic[element.name] = (element);
        this.length++;
        element.type = gd3d.framework.EffectElementTypeEnum.SingleMeshType;
        element.initFrameData = new gd3d.framework.EffectFrameData();
        element.initFrameData.frameIndex = -1;
        element.initFrameData.attrsData = new gd3d.framework.EffectAttrsData();
        element.initFrameData.attrsData.pos = new gd3d.math.vector3();
        element.initFrameData.attrsData.scale = new gd3d.math.vector3(1, 1, 1);
        element.initFrameData.attrsData.euler = new gd3d.math.vector3();
    };
    test_effecteditor.prototype.play = function () {
        this.effectSystem.data = this.effectSysData;
        this.app.getScene().addChild(this.transformRoot);
        this.transformRoot.markDirty();
        this.effectSystem.reset();
        this.effectSystem.play();
    };
    test_effecteditor.prototype.loadShader = function (laststate, state) {
        this.app.getAssetMgr().load("res/shader/shader.assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
            if (_state.isfinish) {
                state.finish = true;
            }
        });
    };
    test_effecteditor.prototype.loadText = function (laststate, state) {
        this.app.getAssetMgr().load("res/zg256.png", gd3d.framework.AssetTypeEnum.Auto, function (s) {
            if (s.isfinish) {
                state.finish = true;
            }
            else {
                state.error = true;
            }
        });
    };
    test_effecteditor.prototype.loadEffect = function (laststate, state) {
        var _this = this;
        var names = ["fx_ss_female@attack_01", "fx_shengji_jiaose", "fx_ss_female@attack_03", "fx_ss_female@attack_02", "fx_0_zs_male@attack_02", "fx_shuijing_cj", "fx_fs_female@attack_02", "fx_0005_sword_sword", "fx_0005_sword_sword", "fx_0_zs_male@attack_02", "fx_fs_female@attack_02"];
        var name = names[0];
        this.app.getAssetMgr().load("res/particleEffect/" + name + "/" + name + ".assetbundle.json", gd3d.framework.AssetTypeEnum.Auto, function (_state) {
            if (_state.isfinish) {
                _this.tr = new gd3d.framework.transform();
                _this.effect = _this.tr.gameObject.addComponent(gd3d.framework.StringUtil.COMPONENT_EFFECTSYSTEM);
                var text = _this.app.getAssetMgr().getAssetByName(name + ".effect.json");
                _this.effect.setJsonData(text);
                _this.scene.addChild(_this.tr);
                _this.tr.markDirty();
                state.finish = true;
                _this.effectloaded = true;
            }
        });
    };
    test_effecteditor.prototype.addButton = function () {
        var _this = this;
        var btn = document.createElement("button");
        btn.textContent = "Load Prefab";
        btn.onclick = function () {
            _this.app.getAssetMgr().savePrefab(_this.tr, "prefabName", function (data, resourses) {
                console.log(data.files);
                console.log(resourses.length);
            });
        };
        btn.style.top = "160px";
        btn.style.position = "absolute";
        this.app.container.appendChild(btn);
        var btn1 = document.createElement("button");
        btn1.textContent = "Save To Prefab";
        btn1.onclick = function () {
            var name = _this.tr.name;
            var _prefab = new gd3d.framework.prefab(name);
            _this.app.getAssetMgr().use(_prefab);
            _prefab.assetbundle = name;
            var path = "";
            _this.app.getAssetMgr().savePrefab(_this.tr, name, function (data, resourses) {
                console.log(data.files);
                console.log(resourses.length);
                var _loop_3 = function (key) {
                    var val = data.files[key];
                    var blob = localSave.Instance.file_str2blob(val);
                    var files = [];
                    var resPath = path + "/resources/";
                    var _loop_4 = function (i) {
                        var resourceUrl = resourses[i];
                        var resourceName = _this.getNameFromURL(resourceUrl);
                        var resourceLength = 0;
                        if (resourceName.indexOf(".txt") != -1 || resourceName.indexOf(".json")) {
                            localSave.Instance.loadTextImmediate(resourceUrl, function (_txt, _err) {
                                var blob = localSave.Instance.file_str2blob(_txt);
                                localSave.Instance.save(resPath + resourceName, blob);
                            });
                        }
                        else {
                            localSave.Instance.loadBlobImmediate(resourceUrl, function (_blob, _err) {
                                localSave.Instance.save(resPath + resourceName, _blob);
                            });
                        }
                        var fileInfo_2 = { "name": "resources/" + resourceName, "length": 100 };
                        files.push(fileInfo_2);
                    };
                    for (var i = 0; i < resourses.length; i++) {
                        _loop_4(i);
                    }
                    localSave.Instance.save(resPath + name + ".prefab.json", blob);
                    var fileInfo = { "name": "resources/" + name + ".prefab.json", "length": 100 };
                    files.push(fileInfo);
                    var assetBundleStr = JSON.stringify({ "files": files });
                    var assetBundleBlob = localSave.Instance.file_str2blob(assetBundleStr);
                    localSave.Instance.save(path + "/" + name + ".assetbundle.json", assetBundleBlob);
                };
                for (var key in data.files) {
                    _loop_3(key);
                }
            });
        };
        btn1.style.top = "320px";
        btn1.style.position = "absolute";
        this.app.container.appendChild(btn1);
    };
    test_effecteditor.prototype.getNameFromURL = function (path) {
        var index = path.lastIndexOf("/");
        return path.substring(index + 1);
    };
    test_effecteditor.prototype.addcam = function (laststate, state) {
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera");
        this.camera.near = 0.01;
        this.camera.far = 200;
        this.camera.fov = Math.PI * 0.3;
        this.camera.backgroundColor = new gd3d.math.color(0.3, 0.3, 0.3, 1);
        objCam.localTranslate = new gd3d.math.vector3(0, 20, 20);
        objCam.lookatPoint(new gd3d.math.vector3(0, 0, 0));
        objCam.markDirty();
        state.finish = true;
    };
    test_effecteditor.prototype.update = function (delta) {
        this.taskmgr.move(delta);
    };
    return test_effecteditor;
}());
//# sourceMappingURL=app.js.map