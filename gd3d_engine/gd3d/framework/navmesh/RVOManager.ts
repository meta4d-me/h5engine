//导航RVO_防挤Demo
declare var RVO;
﻿namespace gd3d.framework {
    export class RVOManager {

        public sim = new RVO.Simulator(1, 40, 10, 20, 5, 1.0, 0.1, [0, 0]);

        public transforms:gd3d.framework.transform[] = [];
        public goals = [];
        public radius: number[] = [];
        public attackRadius: number[] = [];
        public speeds: number[] = [];

        public playerIndex: number;

        public isRunning: boolean;

        public init(transforms: gd3d.framework.transform[], goals, radius: number[], attackRadius: number[], speeds: number[]) {
            this.playerIndex    = 0;
            this.transforms     = transforms;
            this.goals          = goals;
            this.radius         = radius;
            this.attackRadius   = attackRadius;
            this.speeds         = speeds;

// (timeStep, neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocity)
            for (let i in this.transforms) {
                let current_position = [this.transforms[i].localTranslate.x, this.transforms[i].localTranslate.z];
                this.sim.addAgent(current_position);
                this.goals[i] = current_position;

                // Customize current agent
                this.sim.agents[i].radius = this.radius[i];
                this.sim.agents[i].maxSpeed = this.speeds[i];
            }
            // 玩家特殊定义
            this.sim.agents[this.playerIndex].neighborDist = 0; // 玩家不会让路
            this.isRunning = true;
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

        public update() {
            if(this.isRunning) {

            }
        }

        // private RVO_walking(sim, goals) {
        //     // 据当前目标重新获取目标方向向量
        //     for (var i = 0, len = sim.agents.length; i < len; i ++) {
        //         var goalVector = RVO.Vector.subtract(goals[i], sim.agents[i].position);
        //         if (RVO.Vector.absSq(goalVector) > 1) {
        //             goalVector = RVO.Vector.normalize(goalVector);
        //         }
        //         sim.agents[i].prefVelocity = goalVector; // 更新
        //     }
        //     sim.doStep();
        //     for(let i = 0; i < sim.agents.length; i++) {
        //         this.mods[i].localTranslate.x = sim.agents[i].position[0];
        //         this.mods[i].localTranslate.z = sim.agents[i].position[1];
        //         if(i == 0 && currGoal && lastGoal){
        //             let pos = this.mods[i].localTranslate;
        //             let nowDir = gd3d.math.pool.new_vector2();
        //             this.cal2dDir(lastGoal,pos,nowDir);
        //             let nowLen = gd3d.math.vec2Length(nowDir);
        //             let tLen = gd3d.math.vec2Length(this.currMoveDir);
        //             pos.y = gd3d.math.numberLerp(lastGoal.y,currGoal.y,nowLen/tLen);
        //             //console.error(`nowLen/tLen :${nowLen}/${tLen}   ,  pos y:${pos.y}  ,lastGoal: ${lastGoal.x} ,${lastGoal.y} ,${lastGoal.z} `);
        //             gd3d.math.pool.delete_vector2(nowDir);
        //         }
        //
        //         this.mods[i].markDirty();
        //     }
        //
        // }
        private RVO_check(sim, goals, currGoal:gd3d.math.vector3, lastGoal:gd3d.math.vector3, goalQueue:gd3d.math.vector3[], currMoveDir:gd3d.math.vector2) {
            if(currGoal){
                let player = this.transforms[0];
                //达到目标点
                let v2_0 = gd3d.math.pool.new_vector2();
                v2_0.x = player.localTranslate.x; v2_0.y = player.localTranslate.z;
                let v2_1 = gd3d.math.pool.new_vector2();
                v2_1.x = currGoal.x; v2_1.y = currGoal.z;
                let dis = gd3d.math.vec2Distance(v2_0,v2_1);
                if(dis<0.01){
                    if(currGoal){
                        if(lastGoal) gd3d.math.pool.delete_vector3(lastGoal);
                        lastGoal = currGoal;
                        currGoal = null;
                        goals[0] = sim.agents[0].position;
                        sim.agents[0].radius = 1;
                    }
                    if(goalQueue && goalQueue.length >0) {
                        currGoal = goalQueue.pop();
                        this.cal2dDir(lastGoal,currGoal,this.currMoveDir);
                        goals[0] = [currGoal.x, currGoal.z];
                        sim.agents[0].radius = 0.1;
                    }
                }

            }else if(goalQueue && goalQueue.length >0){
                //切换下一目标
                currGoal = goalQueue.pop();
                goals[0] = [currGoal.x, currGoal.z];
                sim.agents[0].radius = 0.1;

            }

            for (var i = 1, len = sim.agents.length; i < len; i ++) {
                let range = RVO.Vector.absSq(RVO.Vector.subtract(sim.agents[i].position, sim.agents[0].position));
                if (range < this.attackRadius[i] ) {
                    // console.log(i + ' in position');
                    goals[i] = sim.agents[i].position;  // Stop
                } else {
                    goals[i] = sim.agents[0].position;
                }
            }

        }


    }
}
