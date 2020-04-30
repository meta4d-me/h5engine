namespace gd3d.plugins.remoteDebug
{

    export enum HookEventType
    {
        initScene,
        addChildAt,
        removeChild,
        removeAllChild,
        addComponentDirect,
        removeComponent,
        dirtify
    }

    export type HookTransType = "2d" | "3d";



    export class EngineHook
    {
        public OnEvent: (transType: HookTransType, eventType: HookEventType, value: any) => void;

        private Event(transType: HookTransType, eventType: HookEventType, value: any)
        {
            if (this.OnEvent)
                this.OnEvent(transType, eventType, value);
        }

        private Hook3d()
        {
            var _this = this;

            var initScene = framework.application.prototype["initScene"];
            framework.application.prototype["initScene"] = function ()
            {
                initScene.call(this);

                var root = framework.sceneMgr.scene.getRoot();

                _this.Event("3d", HookEventType.initScene, {
                    id: root.insId.getInsID(),
                    name: root.name
                });
            };

            var addChildAt = framework.transform.prototype.addChildAt;
            framework.transform.prototype.addChildAt = function (node: framework.transform, index: number)
            {
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

            var removeChild = framework.transform.prototype.removeChild;
            framework.transform.prototype.removeChild = function (node) 
            {
                removeChild.call(this, node);
                _this.Event("3d", HookEventType.removeChild, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    parent: node.parent ? node.parent.insId.getInsID() : 0,
                });

            };

            var removeAllChild = framework.transform.prototype.removeAllChild;
            framework.transform.prototype.removeAllChild = function (needDispose: boolean)
            {
                removeAllChild.call(this, needDispose);

                _this.Event("3d", HookEventType.removeAllChild, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    needDispose: needDispose,
                });
            };

            var addComponentDirect = framework.gameObject.prototype.addComponentDirect;
            framework.gameObject.prototype.addComponentDirect = function (comp)
            {
                var ret = addComponentDirect.call(this, comp);

                _this.Event("3d", HookEventType.addComponentDirect, {
                    id: this.transform.insId.getInsID(),
                    name: this.transform.name,
                    comp: comp.constructor.name
                });
                return ret;
            };
            var removeComponent = framework.gameObject.prototype.removeComponent;
            framework.gameObject.prototype.removeComponent = function (comp) 
            {
                removeComponent.call(this, comp);
                _this.Event("3d", HookEventType.removeComponent, {
                    id: this.transform.insId.getInsID(),
                    name: this.transform.name,
                    comp: comp.constructor.name
                });
            };

            var dirtify = framework.transform.prototype["dirtify"];
            framework.transform.prototype["dirtify"] = function (local: boolean) 
            {
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

        }


        private Hook2d()
        {
            var _this = this;

            var addChildAt = framework.transform2D.prototype.addChildAt;
            framework.transform2D.prototype.addChildAt = function (node, index) 
            {
                addChildAt.call(this, node, index);

                _this.Event("2d", HookEventType.addChildAt, {
                    id: node.insId.getInsID(),
                    name: node.name,
                    parent: node.parent ? node.parent.insId.getInsID() : 0,
                    index: index
                });
            };

            var removeChild = framework.transform2D.prototype.removeChild;
            framework.transform2D.prototype.removeChild = function (node) 
            {
                removeChild.call(this, node);

                _this.Event("2d", HookEventType.removeComponent, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    parent: node.insId.getInsID()
                });
            };

            var removeAllChild = framework.transform2D.prototype.removeAllChild;
            framework.transform2D.prototype.removeAllChild = function (needDispose: boolean) 
            {
                removeAllChild.call(this, needDispose);

                _this.Event("2d", HookEventType.removeAllChild, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    needDispose: needDispose
                });
            };

            var addComponentDirect = framework.transform2D.prototype.addComponentDirect;
            framework.transform2D.prototype.addComponentDirect = function (comp) 
            {
                var ret = addComponentDirect.call(this, comp);

                _this.Event("2d", HookEventType.addComponentDirect, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    comp: comp.constructor.name
                });

                return ret;
            };
            var removeComponent = framework.transform2D.prototype.removeComponent;
            framework.transform2D.prototype.removeComponent = function (comp)
            {
                removeComponent.call(this, comp);

                _this.Event("2d", HookEventType.removeComponent, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    comp: comp.constructor.name
                });
            };

            var dirtify = framework.transform2D.prototype["dirtify"];
            framework.transform2D.prototype["dirtify"] = function (local: boolean) 
            {
                dirtify.call(this, local);
                _this.Event("2d", HookEventType.dirtify, {
                    id: this.insId.getInsID(),
                    name: this.name,
                    local: local
                });
            };
        }


        public Init()
        {
            if (!framework)
            {
                throw new Error("尚未加载引擎js!!");
            }
            this.Hook3d();
            this.Hook2d();
        }
    }
}