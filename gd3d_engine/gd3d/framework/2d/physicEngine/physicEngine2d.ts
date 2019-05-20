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
        private _Matter : any;
        get Matter(){return this._Matter};
        matterEngine: any;
        private engineWorld: any;
        private matterVector: math.Ivec2;
        private eventer : event.Physic2dEvent = new event.Physic2dEvent();
        public constructor(op: IEngine2DOP = null) {
            if (Matter == undefined) {
                console.error(" Matter not found , create physicEngine2D fail");
                return;
            }
            this._Matter = Matter;
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
        removeEventListener(eventEnum: event.Physic2dEventEnum, func: (...args: Array<any>) => void , thisArg:any){
            this.eventer.RemoveListener(event.Physic2dEventEnum[eventEnum],func,thisArg);
        }

        /**
         * 创建一个新的矩形Body
         * @param pBody I2DPhysicsBody 实例
         */
        public createRectBodyByInitData(pBody :I2DPhysicsBody ) : Ibody{
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            // let body = Matter.Bodies.rectangle(pos.x, pos.y, tran.width, tran.height, pBody.options);
            let body = this.createRectangle(pos.x, pos.y, tran.width, tran.height, pBody.options);
            pBody.body = body;
            // this.addBody(pBody);
            return body;
        }

        /**
         * 创建一个新的圆形Body
         * @param pBody I2DPhysicsBody 实例
         * @param radius 半径
         * @param maxSides 最大边
         */
        public createCircleBodyByInitData(pBody :I2DPhysicsBody , radius: number, maxSides: number = 25) : Ibody{
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            // let body = Matter.Bodies.circle(pos.x, pos.y, radius, pBody.options ,maxSides);
            let body = this.createCircle(pos.x, pos.y, radius, pBody.options ,maxSides);
            pBody.body = body;
            // this.addBody(pBody);
            return body;
        }
        /**
         * 使用提供的顶点（或包含多组顶点的数组）创建一个新的物理实体
         * 详细参考： createFromVertices（）
         * @param pBody I2DPhysicsBody 实例
         * @param vertexSets 顶点集合
         * @param flagInternal 内部模式标记
         * @param removeCollinear 共线移除参考值
         * @param minimumArea 最小面积
         */
        ConvexHullBodyByInitData(pBody :I2DPhysicsBody ,vertexSets , flagInternal = false, removeCollinear = 0.01, minimumArea = 10) : Ibody{
            if(!pBody || !pBody.transform) return;
            let tran = pBody.transform;
            let pos = tran.getWorldTranslate();
            // let body = Matter.Bodies.fromVertices(pos.x, pos.y, vertexSets, pBody.options , flagInternal , removeCollinear , minimumArea);
            let body = this.createFromVertices(pos.x, pos.y, vertexSets, pBody.options , flagInternal , removeCollinear , minimumArea);
            pBody.body = body;
            // this.addBody(pBody,);
            return body;
        }

        /**
         * Creates a new rigid body model. The options parameter is an object that specifies any properties you wish to override the defaults.
         * All properties have default values, and many are pre-calculated automatically based on other properties.
         * Vertices must be specified in clockwise order.
         * See the properties section below for detailed information on what you can pass via the `options` object.
         * @param options 
         */
        createBody(options:I2dPhyBodyData) : Ibody{
            return Matter.Body.create(options);
        }

        /**
         * Creates a new rigid body model with a circle hull. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method circle
         * @param {number} x
         * @param {number} y
         * @param {number} radius
         * @param {object} [options]
         * @param {number} [maxSides]
         * @return {body} A new circle body
         */
        createCircle(x :number, y:number, radius:number, options : I2dPhyBodyData, maxSides:number):Ibody{
            return Matter.Bodies.circle(x,y,radius,options,maxSides);
        }

        /**
         * Creates a new rigid body model with a rectangle hull. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method rectangle
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {object} [options]
         * @return {body} A new rectangle body
         */
        createRectangle(x:number, y:number, width:number, height:number, options:I2dPhyBodyData):Ibody{
            return Matter.Bodies.rectangle(x,y,width,height,options);
        }

        /**
         * Creates a new rigid body model with a trapezoid hull. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method trapezoid
         * @param {number} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @param {number} slope
         * @param {object} [options]
         * @return {body} A new trapezoid body
         */
        createTrapezoid(x:number, y:number, width:number, height:number, slope:number, options:I2dPhyBodyData):Ibody{
            return Matter.Bodies.trapezoid(x,y,width,height,slope,options);
        }

        /**
         * Creates a new rigid body model with a regular polygon hull with the given number of sides. 
         * The options parameter is an object that specifies any properties you wish to override the defaults.
         * See the properties section of the `Matter.Body` module for detailed information on what you can pass via the `options` object.
         * @method polygon
         * @param {number} x
         * @param {number} y
         * @param {number} sides
         * @param {number} radius
         * @param {object} [options]
         * @return {body} A new regular polygon body
         */
        createPolygon(x:number, y:number, sides:number, radius:number, options:I2dPhyBodyData):Ibody{
            return Matter.Bodies.polygon(x,y,sides,radius,options);
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
         * @method fromVertices
         * @param {number} x
         * @param {number} y
         * @param [Ivec2] vertexSets
         * @param {object} [options]
         * @param {bool} [flagInternal=false]
         * @param {number} [removeCollinear=0.01]
         * @param {number} [minimumArea=10]
         * @return {body}
         */
        createFromVertices(x:number, y:number, vertexSets : math.Ivec2[] , options : I2dPhyBodyData, flagInternal = false, removeCollinear = 0.01, minimumArea = 10):Ibody{
            return Matter.Bodies.fromVertices(x,y,vertexSets,options,flagInternal,removeCollinear,minimumArea);
        }

        private _physicsBodys : I2DPhysicsBody[]  = [];

        /** 添加 I2DPhysicsBody 实例到 2d物理世界*/
        addBody(_Pbody: I2DPhysicsBody){
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

        public applyForce(body: Ibody, positon:math.Ivec2, force:math.Ivec2): void {
            Matter.Body.applyForce(body, positon , force );
        }

        public applyForceAtCenter(body: Ibody, force: math.Ivec2): void {
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
        
        //-----------------body设置-------------------------
        /** 设置速度
         * Sets the linear velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
         */
        public setVelocity(body: Ibody, velocity: math.Ivec2) {
            Matter.Body.setVelocity(body, velocity);
        }
        /** 设置位置 
         * Moves a body by a given vector relative to its current position, without imparting any velocity.
        */
        public setPosition(body: Ibody, pos: math.Ivec2) {
            Matter.Body.setPosition(body, pos);
        }
        /** 设置质量 
         * Sets the mass of the body. Inverse mass, density and inertia are automatically updated to reflect the change.
        */
        public setMass(body: Ibody, mass: number) {
            Matter.Body.setMass(body, mass);
        }

        /** 设置密度
         * Sets the density of the body. Mass and inertia are automatically updated to reflect the change.
         */
        public setDensity(body: Ibody, Desity: number) {
            Matter.Body.setDensity(body, Desity);
        }

        /**
         * 设置角速度
         * Sets the angular velocity of the body instantly. Position, angle, force etc. are unchanged. See also `Body.applyForce`.
         */
        public setAngularVelocity(body: Ibody, angularVelocity: number) {
            Matter.Body.setAngularVelocity(body, angularVelocity);
        }

        /** 设置静态状态
         * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
         */
        public setStatic(body: Ibody, isStatic: boolean) {
            Matter.Body.setStatic(body, isStatic);
        }

        /** 设置休眠状态
         */
        public setSleeping(body: Ibody, isSleeping: boolean) {
            Matter.Sleeping.set(body, isSleeping);
        }

        /** 设置惯性值
         * Sets the moment of inertia (i.e. second moment of area) of the body. 
         * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
         */
        public setInertia(body: Ibody, Inertia: number) {
            Matter.Body.setInertia(body, Inertia);
        }

        /** 设置顶点
        * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
        * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
        * They are then automatically translated to world space based on `body.position`.
        *
        * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
        * Vertices must form a convex hull, concave hulls are not supported.
        */
        public setVertices(body: Ibody, vertices: math.Ivec2[]) {
            Matter.Body.setVertices(body, vertices);
        }

        /** 设置成员 
        * Sets the parts of the `body` and updates mass, inertia and centroid.
        * Each part will have its parent set to `body`.
        * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
        * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
        */
        public setParts(body: Ibody, parts: Ibody[] , autoHull  = true) {
            Matter.Body.setParts(body, parts,autoHull);
        }

        /** 设置中心点 
        * Set the centre of mass of the body. 
        * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
        * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
        * This is equal to moving `body.position` but not the `body.vertices`.
        * Invalid if the `centre` falls outside the body's convex hull.
        */
        public setCentre(body : Ibody, centre: math.Ivec2, relative = false){
            Matter.Body.setCentre(body, centre,relative);
        }

    }

    export interface Ibody {
        bounds : {max:{x:number,y:number},min:{x:number,y:number}};
        /** 成员 */
        parts: Ibody[];
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
        /** 力*/
        force:math.Ivec2;
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