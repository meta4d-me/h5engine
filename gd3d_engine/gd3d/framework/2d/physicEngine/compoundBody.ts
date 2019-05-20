/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
     /**
     * @public
     * @language zh_CN
     * @classdesc
     * 复合 2d 刚体
     * @version gd3d 1.0
     */
    @reflect.node2DComponent
    export class compoundBody2d extends physics2DBody 
    {
        static readonly ClassName:string="compoundBody2d";
        transform: transform2D;

        private _bodys : Ibody[] = [];

        start() {
            let data = this.options || {};
            // let body = this.physicsEngine.createCircleBodyByInitData(this,this.radius,this.maxSides);

            let engine = this.physicsEngine;

            //校准位置
            let pos = this.transform.getWorldTranslate();
            let tempv2 = poolv2();
            let len = this._bodys.length;
            for(var i=0;i < len ;i++){
                let body = this._bodys[i];
                tempv2.x = body.position.x + pos.x;
                tempv2.y = body.position.y + pos.y;
                engine.setPosition(body,tempv2);
            }

            this.options.parts = this._bodys;

            //root body
            this.body  = engine.createBody(this.options);

            engine.addBody(this);
            if(this.onInit) this.onInit(this);
            poolv2_del(tempv2);
        }

        /** 添加部分 body */
        addPart(body:Ibody){
            if(!body) return;
            this._bodys.push(body);
        }

        onPlay(){

        }

    }
}