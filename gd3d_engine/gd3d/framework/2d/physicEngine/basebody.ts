namespace gd3d.framework {
    export interface I2DPhysicsBody {
        /** body 选项数据*/
        options: I2dPhyBodyData;
        // beStatic:boolean;
        /** 绑定的UI */
        transform: transform2D;
        /** 物理世界body */
        body: Ibody;
        /** 施加力 */
        addForce(Force: math.vector2);
        /**设置 速度*/
        setVelocity(velocity: math.vector2);
        /**设置 密度*/
        setDesity(Desity: number);
        /**设置 空气摩擦系数*/
        setFrictionAir(frictionAir: number);
        setFriction(friction: number);
        /**设置 静态摩擦系数*/
        setFrictionStatic(frictionStatic: number);
        /**设置 恢复系数*/
        setRestitution(restitution: number);
        /** 设置质量 */
        setMass(mass: number);
        /**设置位置 */
        setPosition(pos:math.vector2);
        /**是否睡眠 */
        isSleeping():boolean;
        /** 物理世界body的ID */
        getId():number;
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
        type?: string;
        tag?: string;
        name?: string;
    }
 
    export abstract class physics2DBody implements I2DPhysicsBody {
        /** 2d物理引擎实例对象 */
        get physicsEngine (){
            if(this._physicsEngine){
                return this._physicsEngine;
            }else{
                console.error("Physics not enabled. Please use scene.enable2DPhysics(...) before creating 2dPhysicsBody.");
            }
        };
        protected _physicsEngine : physicEngine2D;
        
        constructor(){
            this._physicsEngine = physics2D;
            this.physicsEngine;
        }
        // beStatic:boolean=false;
        transform: transform2D;
        body: Ibody;
        private m_velocity: math.vector2;
        /**
         * 施加作用力
         * @param Force 
         */
        addForce(Force: math.vector2) {
            this.physicsEngine.applyForceAtCenter(this.body, Force);
        }
        /**
         * 设置速度
         * @param velocity 
         */
        setVelocity(velocity: math.vector2) {
            this.physicsEngine.setVelocity(this.body, velocity);
        }

        setAngularVelocity(velocity: number) {
            this.physicsEngine.setAngularVelocity(this.body, velocity);
        }

        /**获取角速度 */
        get angularVelocity(): number {

            return this.body.angularVelocity;
        }

        /**
         * 获取当前刚体的速度值
         */
        get speed(): number {

            return this.body.speed;
        }

        get velocity(): math.vector2 {
            if (this.m_velocity == null) this.m_velocity = new gd3d.math.vector2()
            this.m_velocity.x = this.body.velocity.x;
            this.m_velocity.y = this.body.velocity.y;
            return this.m_velocity;
        }

        /**
         * 刚体的类型
         */
        public get type(): string {
            return this.body.type;
        }

        public set type(value: string) {

            this.body.type = value;
        }

        /**
         * 碰撞适配类型
         */
        public get collisionFilter() {

            return this.body.collisionFilter;
        }

        /**
         * 刚体的标记
         */
        public get tag(): string {
            return this.body.tag;
        }

        public set tag(value: string) {
            this.body.tag = value;
        }

        /**
       * 刚体的标记
       */
        public get name(): string {
            return this.body.name;
        }

        public set name(value: string) {
            this.body.name = value;
        }


        /**
         * 设置密度
         * @param Desity 
         */
        setDesity(Desity: number) {
            this.physicsEngine.setDesity(this.body, Desity);
        }

        /**
         * 设置空气摩擦力
         * @param frictionAir 
         */
        setFrictionAir(frictionAir: number) {
            this.physicsEngine.setFrictionAir(this.body, frictionAir);
        }
        /**
         * 设置摩擦力
         * @param friction 
         */
        setFriction(friction: number) {
            this.physicsEngine.setFriction(this.body, friction);
        }
        /**
         * 设置静态摩擦力
         * @param frictionStatic 
         */
        setFrictionStatic(frictionStatic: number) {
            this.physicsEngine.setFrictionStatic(this.body, frictionStatic);
        }
        /**
         * 设置还原张力
         * @param restitution 
         */
        setRestitution(restitution: number) {
            this.physicsEngine.setRestitution(this.body, restitution);
        }

        setMass(mass: number) {
            this.physicsEngine.setMass(this.body, mass);
        }

        options: I2dPhyBodyData = {};
        setInitData(att: I2dPhyBodyData) {
            this.options = att;
        }

        setPosition(pos: math.vector2) {
            this.physicsEngine.setPosition(this.body, pos);
        }

        isSleeping(){
            return this.body.isSleeping;
        }

        getId(){
            return this.body.id;
        }

        update(delta: number) {
            if(!this.body)return;
            this.transform.localTranslate.x = this.body.position.x;
            this.transform.localTranslate.y = this.body.position.y;
            this.transform.localRotate = this.body.angle;
            this.transform.markDirty();
        }
        remove() {
            this.physicsEngine.removeBody(this);
            this.body = null;
        }
    }
}