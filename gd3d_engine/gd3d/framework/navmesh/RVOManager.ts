//导航RVO_防挤Demo
declare var RVO;
namespace gd3d.framework {
    export class RVOManager {

        public sim = new RVO.Simulator(1, 40, 10, 20, 5, 1.0, 0.1, [0, 0]);

        public transforms:gd3d.framework.transform[] = [];
        public goals = [];
        public radius: number[] = [];
        public attackRadius: number[] = [];
        public speeds: number[] = [];

        private map: { [key: number]: number } = {};

        private isRunning: boolean = false;
        public currGoal:gd3d.math.vector3;
        private lastGoal:gd3d.math.vector3;

        public addAgent(key: number, transform: gd3d.framework.transform, radius: number, attackRadius: number, speed: number) {
            let index = this.sim.agents.length;
            let current_position = [transform.localTranslate.x, transform.localTranslate.z];

            this.transforms.push(transform);
            this.attackRadius.push(attackRadius);
            this.radius.push(radius);
            this.speeds.push(speed);
            this.goals.push(current_position);

            this.sim.addAgent(current_position);

            this.sim.agents[index].id = key;
            this.sim.agents[index].radius = radius;
            this.sim.agents[index].maxSpeed = speed;

            this.map[key] = index;  // 添加 key

            if(index == 0) {
                this.sim.agents[0].neighborDist = 0; // 玩家无视小怪
            }
            this.isRunning = true;
        }

        public removeAgent(key: number) {
            let offset = this.map[key];

            this.transforms.splice(offset, 1);
            this.attackRadius.splice(offset, 1);
            this.radius.splice(offset, 1);
            this.speeds.splice(offset, 1);
            this.goals.splice(offset, 1);
            this.sim.agents.splice(offset, 1);

            this.reBuildHashMap();
        }

        public reBuildHashMap() {
            for(let i = 0; i < this.sim.agents.length; i++) {
                this.map[this.sim.agents[i].id] = i;
            }
            this.sim.kdTree = new RVO.KdTree(this.sim);

        }

        public getTransformByKey(key: number): gd3d.framework.transform {
            let offset = this.map[key];
            return this.transforms[offset];
        }

        public disable() {
            this.isRunning = false;
        }

        public enable() {
            this.isRunning = true;
            // 更新位置
            for(let i in this.transforms) {
                this.sim.agents[i].position = [this.transforms[i].localTranslate.x, this.transforms[i].localTranslate.z];
            }
        }

        public update(goalQueue:gd3d.math.vector3[], currMoveDir:gd3d.math.vector2) {
            if(this.isRunning && (this.transforms.length >= 1)) {
                this.RVO_check(this.sim, this.goals, goalQueue, currMoveDir);
                this.RVO_walking(this.sim, this.goals, currMoveDir);
            }
        }

        private RVO_walking(sim, goals, currMoveDir:gd3d.math.vector2) {
            // 据当前目标重新获取目标方向向量
            for (var i = 0, len = sim.agents.length; i < len; i ++) {
                if(sim.agents[i] != null) {
                    var goalVector = RVO.Vector.subtract(goals[i], sim.agents[i].position);
                    if (RVO.Vector.absSq(goalVector) > 1) {
                        goalVector = RVO.Vector.normalize(goalVector);
                    }
                    sim.agents[i].prefVelocity = goalVector; // 更新速度向量
                }
            }
            sim.doStep();   // 移动一帧
            for(let i = 0; i < sim.agents.length; i++) {
                this.transforms[i].localTranslate.x = sim.agents[i].position[0];
                this.transforms[i].localTranslate.z = sim.agents[i].position[1];
                if(i == 0 && this.currGoal && this.lastGoal){
                    let pos = this.transforms[i].localTranslate;
                    let nowDir = gd3d.math.pool.new_vector2();
                    this.cal2dDir(this.lastGoal,pos,nowDir);
                    let nowLen = gd3d.math.vec2Length(nowDir);
                    let tLen = gd3d.math.vec2Length(currMoveDir);
                    let y = gd3d.math.numberLerp(this.lastGoal.y,this.currGoal.y,nowLen/tLen);
                    if(!isNaN(y)) {
                        pos.y = gd3d.math.numberLerp(this.lastGoal.y,this.currGoal.y,nowLen/tLen);
                    }
                    //console.error(`nowLen/tLen :${nowLen}/${tLen}   ,  pos y:${pos.y}  ,this.lastGoal: ${this.lastGoal.x} ,${this.lastGoal.y} ,${this.lastGoal.z} `);
                    gd3d.math.pool.delete_vector2(nowDir);
                }

                this.transforms[i].markDirty();
            }

        }



        private RVO_check(sim, goals, goalQueue:gd3d.math.vector3[], currMoveDir:gd3d.math.vector2) {
            // 玩家根据 NavMesh 切换目标
            if(this.currGoal){
                let player = this.transforms[0];
                //达到目标点
                let v2_0 = gd3d.math.pool.new_vector2();
                v2_0.x = player.localTranslate.x; v2_0.y = player.localTranslate.z;
                let v2_1 = gd3d.math.pool.new_vector2();
                v2_1.x = this.currGoal.x; v2_1.y = this.currGoal.z;
                let dis = gd3d.math.vec2Distance(v2_0,v2_1);
                if(dis<0.01){
                    if(this.currGoal){
                        if(this.lastGoal) gd3d.math.pool.delete_vector3(this.lastGoal);
                        this.lastGoal = this.currGoal;
                        this.currGoal = null;
                        goals[0] = sim.agents[0].position;
                        sim.agents[0].radius = this.radius[0];
                    }
                    if(goalQueue && goalQueue.length >0) {
                        this.currGoal = goalQueue.pop();
                        this.cal2dDir(this.lastGoal, this.currGoal, currMoveDir);
                        goals[0] = [this.currGoal.x, this.currGoal.z];
                        sim.agents[0].radius = 0.1;
                    }
                }

            }else if(goalQueue && goalQueue.length >0){
                //切换下一目标
                this.currGoal = goalQueue.pop();
                goals[0] = [this.currGoal.x, this.currGoal.z];
                sim.agents[0].radius = 0.1;

            }

            // 小怪的目标
            for (var i = 1, len = sim.agents.length; i < len; i ++) {
                let range = RVO.Vector.absSq(RVO.Vector.subtract(sim.agents[i].position, sim.agents[0].position));
                if (range < this.attackRadius[i] ) {
                    goals[i] = sim.agents[i].position;  // Stop
                } else {
                    goals[i] = sim.agents[0].position;
                }
            }

        }

        public cal2dDir(oPos:gd3d.math.vector3,tPos:gd3d.math.vector3,out:gd3d.math.vector2){
            if(!oPos || !tPos || !out)  return;
            let ov2 = gd3d.math.pool.new_vector2();
            ov2.x = oPos.x; ov2.y = oPos.z;
            let tv2 = gd3d.math.pool.new_vector2();
            tv2.x = tPos.x; tv2.y = tPos.z;
            gd3d.math.vec2Subtract(tv2,ov2,out);
            gd3d.math.pool.delete_vector2(ov2);
            gd3d.math.pool.delete_vector2(tv2);
        }

    }
}
