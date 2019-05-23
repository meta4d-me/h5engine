namespace gd3d.framework {
    export interface I2DPhysicsBody {
        /** 初始化完成回调 */
        onInit : (phy2dBody : I2DPhysicsBody)=>any;
        /** 引擎对象 */
        physicsEngine: physicEngine2D;
        /** body 选项数据*/
        options: I2dPhyBodyData;
        /** 绑定的UI */
        transform: transform2D;
        /** 物理世界body */
        body: Ibody;
        /** 施加力 */
        addForce(Force: math.Ivec2);
        /**设置 速度*/
        setVelocity(velocity: math.Ivec2);
        /**设置 密度*/
        setDensity(Desity: number);
        /**设置 空气摩擦系数*/
        setFrictionAir(frictionAir: number);
        /**设置 摩擦系数*/
        setFriction(friction: number);
        /**设置 静态摩擦系数*/
        setFrictionStatic(frictionStatic: number);
        /**设置 恢复系数*/
        setRestitution(restitution: number);
        /** 设置质量 */
        setMass(mass: number);
        /**设置位置 */
        setPosition(pos: math.Ivec2);
        /** 设置成员 */
        setParts(parts: Ibody[], autoHull:boolean);
        /** 设置顶点 */
        setVertices(vertices: math.Ivec2[]);
        /** 设置惯性值*/
        setInertia(Inertia: number);
        /**设置角速度 */
        setAngularVelocity(velocity: number) ;
        /**是否睡眠 */
        isSleeping(): boolean;
        /** 是否是传感器*/
        isSensor():boolean;
        /**是否是静态 */
        isStatic():boolean;
    }
    export interface I2dPhyBodyData {
        mass?: number;
        density?: number;
        inertia?: number;
        restitution?: number;
        frictionStatic?: number;
        frictionAir?: number;
        friction?: number;
        collisionFilter?: collisionFilter;
        slop?: number;
        isStatic?: boolean;
        isSensor?: boolean;
        type?: string;
        tag?: string;
        name?: string;
        chamfer?:number;
        label?: string,
        parts?: Ibody[],
        plugin?: {},
        angle?: number,
        vertices?: math.Ivec2[],
        position?: math.Ivec2,
        force?: math.Ivec2,
        torque?: number,
        positionImpulse?: math.Ivec2,
        previousPositionImpulse?: math.Ivec2,
        totalContacts?: number,
        speed?: number,
        angularSpeed?: number,
        velocity?: math.Ivec2,
        angularVelocity?: number,
        isSleeping?: boolean,
        motion?: number,
        sleepThreshold?: number,
        timeScale?: number,
        events?: any,
        bounds?: any,
        circleRadius?: number,
        positionPrev?: any,
        anglePrev?: number,
        parent?: any,
        axes?: any,
        area?: number,
        _original?: any
    }

    /**
     * 2d 物理引擎Body 组件父对象
     * （本组件不会创建具体物理对象，需要使用子类对象 或者 自行在onInit回调中创建）
     */
    export abstract class physics2DBody extends behaviour2d implements I2DPhysicsBody {
        /** 2d物理引擎实例对象 */
        get physicsEngine() {
            if (this._physicsEngine) {
                return this._physicsEngine;
            } else {
                console.error("Physics not enabled. Please use scene.enable2DPhysics(...) before creating 2dPhysicsBody.");
            }
        };
        protected _physicsEngine: physicEngine2D;

        constructor() {
            super();
            this._physicsEngine = physics2D;
        }
        // beStatic:boolean=false;
        transform: transform2D;
        body: Ibody;
        /** 物理对象初始化完成回调 */
        onInit : (phy2dBody : I2DPhysicsBody)=>any;

        /** 是否已休眠
        * A flag that indicates whether the body is considered sleeping. A sleeping body acts similar to a static body, except it is only temporary and can be awoken.
        * If you need to set a body as sleeping, you should use `Sleeping.set` as this requires more than just setting this flag.
         */
        isSleeping() {
            return this.body.isSleeping;
        }
        
        /** 是否是静态
        * A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
        * If you need to set a body as static after its creation, you should use `Body.setStatic` as this requires more than just setting this flag.
         */
        isStatic() {
            return this.body.isStatic;
        }

        /** 是否是传感器
         * A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
         */
        isSensor() {
            return this.body.isSensor;
        }

        /**
         * 施加作用力
         * @param Force 
         */
        addForce(Force: math.Ivec2) {
            this.physicsEngine.applyForceAtCenter(this.body, Force);
        }
        /**
         * 设置速度
         * @param velocity 
         */
        setVelocity(velocity: math.Ivec2) {
            this.physicsEngine.setVelocity(this.body, velocity);
        }

        /**
         * 设置角速度
         * @param velocity 
         */
        setAngularVelocity(velocity: number) {
            this.physicsEngine.setAngularVelocity(this.body, velocity);
        }

        /**
         * 设置密度
         * @param Desity 
         */
        setDensity(Desity: number) {
            this.physicsEngine.setDensity(this.body, Desity);
        }

        /**
         * 设置空气摩擦力
         * @param frictionAir 
         */
        setFrictionAir(frictionAir: number) {
            this.body.frictionAir = frictionAir;
        }
        /**
         * 设置摩擦力
         * @param friction 
         */
        setFriction(friction: number) {
            this.body.friction = friction;
        }
        /**
         * 设置静态摩擦力
         * @param frictionStatic 
         */
        setFrictionStatic(frictionStatic: number) {
            this.body.frictionStatic = frictionStatic;
        }
        /**
         * 设置还原张力
         * @param restitution 
         */
        setRestitution(restitution: number) {
            this.body.restitution = restitution;
        }

        /**
         * 设置质量
         * @param mass 
         */
        setMass(mass: number) {
            this.physicsEngine.setMass(this.body, mass);
        }

        options: I2dPhyBodyData = {};
        /**
         * 设置选项数据
         * @param options 选项数据
         */
        setInitData(options: I2dPhyBodyData) {
            this.options = options;
        }

        /**
         * 设置位置 
         * @param pos 位置vec2
         */
        setPosition(pos: math.Ivec2) {
            this.physicsEngine.setPosition(this.body, pos);
        }

        /** 设置静态状态
         * Sets the body as static, including isStatic flag and setting mass and inertia to Infinity.
         */
        public setStatic(isStatic: boolean) {
            this.physicsEngine.setStatic(this.body, isStatic);
        }

        /** 设置休眠状态
         */
        public setSleeping(isSleeping: boolean) {
            this.physicsEngine.setSleeping(this.body, isSleeping);
        }

        /** 设置惯性值
         * Sets the moment of inertia (i.e. second moment of area) of the body. 
         * Inverse inertia is automatically updated to reflect the change. Mass is not changed.
         */
        public setInertia(Inertia: number) {
            this.physicsEngine.setInertia(this.body, Inertia);
        }

        /** 设置顶点
        * Sets the body's vertices and updates body properties accordingly, including inertia, area and mass (with respect to `body.density`).
        * Vertices will be automatically transformed to be orientated around their centre of mass as the origin.
        * They are then automatically translated to world space based on `body.position`.
        *
        * The `vertices` argument should be passed as an array of `Matter.Vector` points (or a `Matter.Vertices` array).
        * Vertices must form a convex hull, concave hulls are not supported.
        */
        public setVertices(vertices: math.Ivec2[]) {
            this.physicsEngine.setVertices(this.body, vertices);
        }

        /** 设置成员 
        * Sets the parts of the `body` and updates mass, inertia and centroid.
        * Each part will have its parent set to `body`.
        * By default the convex hull will be automatically computed and set on `body`, unless `autoHull` is set to `false.`
        * Note that this method will ensure that the first part in `body.parts` will always be the `body`.
        */
        public setParts(parts: Ibody[], autoHull = true) {
            this.physicsEngine.setParts(this.body, parts, autoHull);
        }

        /** 设置中心点 
        * Set the centre of mass of the body. 
        * The `centre` is a vector in world-space unless `relative` is set, in which case it is a translation.
        * The centre of mass is the point the body rotates about and can be used to simulate non-uniform density.
        * This is equal to moving `body.position` but not the `body.vertices`.
        * Invalid if the `centre` falls outside the body's convex hull.
        */
        public setCentre(centre: math.Ivec2, relative = false) {
            this.physicsEngine.setCentre(this.body, centre, relative);
        }

        start (){
            if(this.onInit) this.onInit(this);
        }

        update(delta: number) {
            if (!this.body) return;
            physicTool.Ivec2Copy(this.body.position, this.transform.localTranslate);
            this.transform.localRotate = this.body.angle;
            this.transform.markDirty();
        }
        remove() {
            this.physicsEngine.removeBody(this);
            this.body = null;
        }
    }
}