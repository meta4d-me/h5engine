namespace gd3d.framework {
    export interface I2DPhysicsBody {
        /** body 选项数据*/
        options: I2dPhyBodyData;
        /** 绑定的UI */
        transform: transform2D;
        /** 物理世界body */
        body: Ibody;
        /** 施加力 */
        addForce(Force: math.vector2);
        /**设置 速度*/
        setVelocity(velocity: math.vector2);
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
        setPosition(pos:math.vector2);
        /**是否睡眠 */
        isSleeping():boolean;
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

        update(delta: number) {
            if(!this.body)return;
            physicTool.Ivec2Copy(this.body.position , this.transform.localTranslate);
            this.transform.localRotate = this.body.angle;
            this.transform.markDirty();
        }
        remove() {
            this.physicsEngine.removeBody(this);
            this.body = null;
        }
    }
}