/// <reference path="../lib/gd3d.d.ts" />

namespace effectshow
{
    //用于特效特性展示
    export class test_effectmain implements IState
    {
        app: gd3d.framework.application;
        scene: gd3d.framework.scene;
        feature: Ifeature;

        basePath: string = "proj_sample/scene_test/";
        resPath: string = "res/effectShow/";
        effecteditor: effectshowMgr;
        start(app: gd3d.framework.application)
        {
            this.app = app;
            this.scene = this.app.getScene();
            this.effecteditor = new effectshowMgr(app);


            this.addBtn("emissionType", () => new effectShow_emissionType())

            // this.addBtn("emissionShape", () => new Test_EffectEditor(this.basePath, this.resPath + "emissionShape/"));
            // this.addBtn("billboard", () => new Test_EffectEditor(this.basePath, this.resPath + "billboard/"));
        }
        private x: number = 0;
        private y: number = 100;
        private btns: HTMLButtonElement[] = [];
        private addBtn(text: string, act: () => Ifeature)
        {
            var btn = document.createElement("button");
            this.btns.push(btn);
            btn.textContent = text;
            btn.onclick = () =>
            {
                this.clearBtn();
                this.feature = act();
                this.feature.init(this.effecteditor);
            }
            btn.style.top = this.y + "px";
            btn.style.left = this.x + "px";
            if (this.y + 24 > 400)
            {
                this.y = 100;
                this.x += 200;
            }
            else
            {
                this.y += 24;
            }
            btn.style.position = "absolute";
            this.app.container.appendChild(btn);

        }
        private clearBtn()
        {
            for (var i = 0; i < this.btns.length; i++)
            {
                this.app.container.removeChild(this.btns[i]);
            }
            this.btns.length = 0;
        }
        update(delta: number)
        {
            // if (this.state != null)
            //     this.state.update(delta);
            this.effecteditor.onUpdate(delta);
        }
    }

    export interface Ifeature
    {
        path:string;
        init(effecteditor: effectshowMgr): void;

    }

    export function addbtn(top: string, left: string, text: string): HTMLButtonElement
    {
        var btn = document.createElement("button");
        btn.style.top = top;
        btn.style.left = left;
        btn.style.position = "absolute";
        btn.textContent = text;
        gd3d.framework.sceneMgr.app.container.appendChild(btn);
        return btn;
    }

    class effectShow_emissionType implements Ifeature
    {
        path: string="emissionType/";
        effectmgr: effectshowMgr;
        init(effecteditor: effectshowMgr): void
        {
            this.effectmgr = effecteditor;
            //---------------//这边修改effecteditor中的list--------------------------------
            this.addbtn("emissionType_burst",()=>{this.burstFuntion});
            this.addbtn("emissionType_burst",()=>{});
            this.addbtn("emissionType_burst",()=>{});
        }
        top = 40;
        left = "0px";
        private addbtn(text: string,fuc:()=>void )
        {
            var btn = addbtn(this.top + "px", this.left, text);
            this.top += 40;
            btn.onclick = () =>
            {
                // fuc();
                this.burstFuntion();
            }

        }

        private burstFuntion()
        {
            var basepath:string="res/effectShow/";
            var realpath=basepath+this.path+"burst/burst.assetbundle.json"
            this.effectmgr.loadeffect(realpath,"burst.effect.json");
        }


    }

}