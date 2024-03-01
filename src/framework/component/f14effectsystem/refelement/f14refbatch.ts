/**
@license
Copyright 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
namespace m4m.framework
{
    export class F14RefElementBatch implements F14Basebatch
    {
        type: F14TypeEnum;
        effect: f14EffectSystem;
        private element:F14RefElement;
        /**
         * F14引用元素合批
         * @param effect 特效系统
         * @param element F14引用元素
         */
        public constructor(effect:f14EffectSystem,element:F14RefElement)
        {
            this.type = F14TypeEnum.RefType;
            this.effect = effect;
            this.element = element;
        }
        unRender()
        {
            //this.element.RefEffect.unRender();
        }
        getElementCount()
        {
            return this.element.RefEffect.getElementCount();
        }
        render(context: renderContext, assetmgr: assetMgr, camera: camera, Effqueue: number)
        {
            //this.element.RefEffect.render();
            if (this.element.drawActive)
            {
                this.element.RefEffect.render(context,assetmgr,camera,Effqueue);
            }
            else
            {
                //this.element.RefEffect.unRender();
            }
        }
        dispose()
        {
            this.effect=null;
            this.element=null;
        }
    }
}