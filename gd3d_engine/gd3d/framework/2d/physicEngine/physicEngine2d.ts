namespace gd3d.framework {
    // export declare let physic: PhysicsEngine;
    //export declare let physic2D: physicEngine2D;

    export interface Itiming {
        timeScale?: number;
        timestamp?: number;
    }
    export interface IEngine2DOP {
        constraintIterations?: number;
        timing?: Itiming;
        velocityIterations?: number;
        enableSleeping?:boolean;
    }
    declare var Matter: any;
    export class physicEngine2D {
        matterEngine: any;
        private engineWorld: any;
        private matterVector: math.Ivec2;
        private eventer : event.Physic2dEvent = new event.Physic2dEvent();
        public constructor(op: IEngine2DOP = null) {
            if (Matter == undefined) {
                console.error(" Matter not found , create physicEngine2D fail");
                return;
            }
            if (op != null) {
                this.matterEngine = Matter.Engine.create(op);
            } else {
                this.matterEngine = Matter.Engine.create();
            }
            this.engineWorld = this.matterEngine.world;
            this.matterVector = Matter.Vector;

            //---------run the engine
            Matter.Engine.run(this.matterEngine);

            //Event
            Matter.Events.on(this.matterEngine,"beforeUpdate",this.beforeUpdate.bind(this));
            Matter.Events.on(this.matterEngine,"afterUpdate",this.afterUpdate.bind(this));
            Matter.Events.on(this.matterEngine,"collisionStart",this.collisionStart.bind(this));
            Matter.Events.on(this.matterEngine,"collisionActive",this.collisionActive.bind(this));
            Matter.Events.on(this.matterEngine,"collisionEnd",this.collisionEnd.bind(this));
        }

        update(delta: number) {
            Matter.Engine.update(this.matterEngine, delta);
        }


        /** Matter.Engine update 调用前 */
        private beforeUpdate(ev){
            this.eventer.EmitEnum(event.Physic2dEventEnum.BeforeUpdate , ev);
        }

        /** Matter.Engine update 调用之后 */
        private afterUpdate(ev){
            this.eventer.EmitEnum(event.Physic2dEventEnum.afterUpdate , ev);
        }

        /** 开始碰撞 ， Matter.Engine update 调用之后 */
        private collisionStart(ev){
            this.eventer.EmitEnum(event.Physic2dEventEnum.collisionStart , ev);
        }

        /** 碰撞持续中， Matter.Engine update 调用之后 */
        private collisionActive(ev){
            this.eventer.EmitEnum(event.Physic2dEventEnum.collisionActive , ev);
        }

        /** 碰撞结束 ， Matter.Engine update 调用之后 */
        private collisionEnd(ev){
            this.eventer.EmitEnum(event.Physic2dEventEnum.collisionEnd , ev);
        }

        /**
         * 添加事件监听
         * @param eventEnum 事件类型
         * @param func 事件回调函数
         * @param thisArg 函数持有对象
         */
        addEventListener(eventEnum: event.Physic2dEventEnum ,func: (...args: Array<any>) => void,thisArg:any){
            this.eventer.OnEnum(eventEnum,func,thisArg);
        }

        /**
         * 移除事件监听
         * @param eventEnum 事件类型
         * @param func 事件回调函数
         * @param thisArg 函数持有对象
         */
        removeEventListener(eventEnum: event.UIEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.RemoveListener(event.UIEventEnum[eventEnum],func,thisArg);
        }

        /**
         * Creates a new rigid body model with a circle hull. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @param pBody I2DPhysicsBody 实例
         */
        public creatRectBodyByInitData(pBody :I2DPhysicsBody ) {
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            let body = Matter.Bodies.rectangle(pos.x, pos.y, tran.width, tran.height, pBody.options);
            pBody.body = body;
            this.addBody(pBody);
            return body;
        }

        /**
         * Creates a new rigid body model with a circle hull. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @param pBody I2DPhysicsBody 实例
         * @param radius 半径
         * @param maxSides 最大边
         */
        public creatCircleBodyByInitData(pBody :I2DPhysicsBody , radius: number, maxSides: number = 25) {
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            let body = Matter.Bodies.circle(pos.x, pos.y, radius, pBody.options ,maxSides);
            pBody.body = body;
            this.addBody(pBody);
            return body;
        }
        /**
         * Creates a body using the supplied vertices (or an array containing multiple sets of vertices).
         * If the vertices are convex, they will pass through as supplied.
         * Otherwise if the vertices are concave, they will be decomposed if [poly-decomp.js](https://github.com/schteppe/poly-decomp.js) is available.
         * Note that this process is not guaranteed to support complex sets of vertices (e.g. those with holes may fail).
         * By default the decomposition will discard collinear edges (to improve performance).
         * It can also optionally discard any parts that have an area less than `minimumArea`.
         * If the vertices can not be decomposed, the result will fall back to using the convex hull.
         * The options parameter is an object that specifies any `Matter.Body` properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @param pBody I2DPhysicsBody 实例
         * @param vertexSets 顶点集合
         * @param flagInternal 内部模式标记
         * @param removeCollinear 共线移除参考值
         * @param minimumArea 最小面积
         */
        ConvexHullBodyByInitData(pBody :I2DPhysicsBody ,vertexSets , flagInternal = false, removeCollinear = 0.01, minimumArea = 10){
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            let body = Matter.Bodies.fromVertices(pos.x, pos.y, vertexSets, pBody.options , flagInternal , removeCollinear , minimumArea);
            pBody.body = body;
            this.addBody(pBody,);
            return body;
        }

        private _physicsBodys : I2DPhysicsBody[]  = [];

        /** 添加 I2DPhysicsBody 实例到 2d物理世界*/
        private addBody(_Pbody: I2DPhysicsBody){
            this._physicsBodys.push(_Pbody);
            Matter.World.add(this.engineWorld, _Pbody.body);
        }

        /** 移除 指定 I2DPhysicsBody 实例 */
        removeBody(_Pbody: I2DPhysicsBody) {
            if(!_Pbody) return;
            let idx = this._physicsBodys.indexOf(_Pbody);
            if(idx != -1){
                this._physicsBodys.splice(idx,1);
            }
            Matter.World.remove(this.engineWorld, _Pbody.body);
        }

        /** 清理世界 */
        clearWorld(keepStatic:boolean = false){
            Matter.World.clear(this.engineWorld,keepStatic);
        }

        public applyForce(body: Ibody, positon: math.vector2, force: math.vector2): void {
            Matter.Body.applyForce(body, positon , force );
        }

        public applyForceAtCenter(body: Ibody, force: math.vector2): void {
            Matter.Body.applyForce(body, body.position, force );
        }

        public setGravity(x: number, y: number) {
            this.engineWorld.gravity.x = x;
            this.engineWorld.gravity.y = y;
        }

        set enableSleeping (val:boolean){
            this.matterEngine.enableSleeping = val;
        }

        get enableSleeping(){
            return this.matterEngine.enableSleeping ;
        }

        public setVelocity(body: Ibody, velocity: math.vector2) {
            Matter.Body.setVelocity(body, velocity);
        }

        public setPosition(body: Ibody, pos: math.vector2) {
            Matter.Body.setPosition(body, pos);
        }

        public setMass(body: Ibody, mass: number) {
            Matter.Body.setMass(body, mass);
        }

        public setDensity(body: Ibody, Desity: number) {
            Matter.Body.setDensity(body, Desity);
        }

        public setAngularVelocity(body: Ibody, angularVelocity: number) {
            Matter.Body.setAngularVelocity(body, angularVelocity);
        }
    }

    export interface Ibody {
        bounds : {max:{x:number,y:number},min:{x:number,y:number}};
        /** 睡眠状态 */
        isSleeping:boolean;
        /** 传感器的标志 , 开启时触发碰撞事件*/
        isSensor:boolean;
        /** 静态 */
        isStatic:boolean;
        /** 重心点位置 */
        position: math.Ivec2;
        /** 速率向量 , 想要改变它 需要通过给它施加力*/
        velocity: math.Ivec2;
        /** 碰撞筛选属性对象 */
        collisionFilter: collisionFilter;
        type: string;
        tag: string;
        name: string;
        angle: number;
        speed: number;
        angularSpeed:number;
        frictionAir:number;
        friction:number;
        frictionStatic:number;
        restitution:number;
        angularVelocity:number;
        id:number;
        motion:number;
        force:number;
        torque:number;
        sleepThreshold:number;
        density:number;
        mass:number;
        inverseMass:number;
        inertia:number;
        inverseInertia:number;
        slop:number;
        timeScale:number;
    }

    /**
     * 碰撞筛选属性对象
     * 两个物体之间的碰撞将遵守以下规则：
     * 1.两个物体的group相同且大于0时会执行碰撞，如果负数将永远不会碰撞。
     * 2.当两个物体group不相同或等于0时将执行 类别/位掩码 的规则。
     */
    export interface collisionFilter {
        /** 组号*/
        group?: number;
        /** 类别 (32位 , 范围[1,2^31])*/
        category?: number;
        /** 位掩码（指定此主体可能碰撞的碰撞类别）*/
        mask?: number;
    }
}