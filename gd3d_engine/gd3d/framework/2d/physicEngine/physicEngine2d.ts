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
    }
    declare var Matter: any;
    export class physicEngine2D {
        matterEngine: any;
        private engineWorld: any;
        private matterVector: matterVector;
        public constructor(op: IEngine2DOP = null) {
            if (Matter == undefined) {
                console.error("2d physic not supportted");
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
            Matter.Events.on(this.matterEngine,"afterRender",this.afterRender.bind(this));
        }

        /** Matter.Engine update 调用前 */
        private beforeUpdate(event){

        }

        /** Matter.Engine update 调用之后 */
        private afterRender(event){

        }

        update(delta: number) {
            Matter.Engine.update(this.matterEngine, delta);
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
            let body = Matter.Bodies.fromVertices(pos.x, pos.y, vertexSets, pBody.options, flagInternal , removeCollinear , minimumArea);
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
            Matter.Body.applyForce(body, this.matterVector.create(positon.x, positon.y), this.matterVector.create(force.x, force.y));
        }

        public applyForceAtCenter(body: Ibody, force: math.vector2): void {
            Matter.Body.applyForce(body, body.position, this.matterVector.create(force.x, force.y));
        }

        public setGravity(x: number, y: number) {
            this.engineWorld.gravity.x = x;
            this.engineWorld.gravity.y = y;
        }

        public setVelocity(body: Ibody, velocity: math.vector2) {
            Matter.Body.setVelocity(body, this.matterVector.create(velocity.x, velocity.y));
        }

        public setPosition(body: Ibody, pos: math.vector2) {
            Matter.Body.setPosition(body, this.matterVector.create(pos.x, pos.y));
        }

        public setMass(body: Ibody, mass: number) {
            Matter.Body.setMass(body, mass);
        }

        public setDesity(body: Ibody, Desity: number) {
            this.set(body, "desity", Desity);
        }
        public setFrictionAir(body: Ibody, frictionAir: number) {
            this.set(body, "frictionAir", frictionAir);
        }
        public setFriction(body: Ibody, friction: number) {
            this.set(body, "friction", friction);
        }
        public setFrictionStatic(body: Ibody, frictionStatic: number) {
            this.set(body, "frictionStatic", frictionStatic);
        }
        public setRestitution(body: Ibody, restitution: number) {
            this.set(body, "restitution", restitution);
        }

        public setAngularVelocity(body: Ibody, angularVelocity: number) {
            this.set(body, "angularVelocity", angularVelocity);
        }
        private set(body: Ibody, settings: string, value: any) {
            Matter.Body.set(body, settings, value)
        }

        public addEvent(eventname: string, callback: Function) {
            Matter.Events.on(this.matterEngine, eventname, callback);
        }

        public removeEvent(eventname: string, callback: Function) {
            Matter.Events.off(this.matterEngine, eventname, callback);
        }

        
    }

    export interface Ibody {
        bounds : {max:{x:number,y:number},min:{x:number,y:number}};
        angle: number;
        position: matterVector;
        speed: number;
        type: string;
        tag: string;
        name: string;
        angularVelocity:number;
        velocity:matterVector;
        collisionFilter: collisionFilter;
        applyForce(body: Ibody, positon: matterVector, force: matterVector): void;
    }

    export interface matterVector {
        x: number;
        y: number;
        create(x: number, y: number): matterVector
    }

    export interface collisionFilter {
        group?: number;
        category?: number;
        mask?: number;
    }
}