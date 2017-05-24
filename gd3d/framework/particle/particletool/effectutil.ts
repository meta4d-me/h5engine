namespace gd3d.framework
{
    export class EffectUtil
    {
        //范围内随机  isInteger是否为整数
        public static RandomRange(min: number, max: number, isInteger: boolean = false)
        {
            if (isInteger)
            {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            return Math.random() * (max - min) + min;
        }
        public static vecMuliNum(vec: gd3d.math.vector3, num: number): gd3d.math.vector3
        {
            var v = new gd3d.math.vector4(vec.x * num, vec.y * num, vec.z * num);
            return v;
        }
        public static parseEffectVec3(value: any): ParticleNode
        {
            let node: ParticleNode = new ParticleNode();
            for (let key in value)
            {
                if (value[key] instanceof Array)
                {
                    node[key].valueLimitMin = value[key][0];
                    node[key].valueLimitMax = value[key][1];
                    node[key].isRandom = true;
                }
                else
                {
                    if (key == "key")
                    {
                        node[key] = value[key];
                    } else
                    {
                        node[key].value = value[key];
                        node[key].isRandom = false;
                    }
                }
            }
            return node;
        }
        public static parseEffectVec2(value: any): ParticleNodeVec2
        {
            let node: ParticleNodeVec2 = new ParticleNodeVec2();
            for (let key in value)
            {
                if (value[key] instanceof Array)
                {
                    node[key].valueLimitMin = value[key][0];
                    node[key].valueLimitMax = value[key][1];
                    node[key].isRandom = true;
                }
                else
                {
                    if (key == "key")
                    {
                        node[key] = value[key];
                    } else
                    {
                        node[key].value = value[key];
                        node[key].isRandom = false;
                    }
                }
            }
            return node;
        }
        public static parseEffectNum(value: any): ParticleNodeNumber
        {
            let node = new ParticleNodeNumber();
            if (value instanceof Array)
            {
                node.num.valueLimitMin = value[0];
                node.num.valueLimitMax = value[1];
                node.num.isRandom = true;
            } else
            {
                node.num.value = value;
                node.num.isRandom = false;
            }
            return node;
        }

        public static parseEffectValueData(value: any): ValueData
        {
            let val = new ValueData();
            if (value instanceof Array)
            {
                val.valueLimitMin = value[0];
                val.valueLimitMax = value[1];
                val.isRandom = true;
            } else
            {
                val.value = value;
                val.isRandom = false;
            }
            return val;
        }
        public static parseEffectUVSpeed(value: any): UVSpeedNode
        {
            let node: UVSpeedNode = new UVSpeedNode();
            for (let key in value)
            {
                node[key].value = value[key];
            }
            return node;
        }
        public static lookat(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up: gd3d.math.vector3 = gd3d.math.pool.vector3_up)
        {

            let dir = new gd3d.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            //dir在xz面上的单位投影          
            let unitprojectedXZ = new gd3d.math.vector3(dir.x, 0, dir.z);
            math.vec3Normalize(unitprojectedXZ, unitprojectedXZ);


            var yaw = Math.acos(unitprojectedXZ.z) / Math.PI * 180;
            if (unitprojectedXZ.x < 0)
            {
                yaw = -yaw;
            }
            gd3d.math.quatFromAxisAngle(up, yaw, out);

            let right = gd3d.math.pool.new_vector3();
            math.vec3Cross(up, dir, right);
            math.vec3Normalize(right, right);

            //dir在xz面上的投影   
            let projectedXZ = new gd3d.math.vector3(dir.x, 0, dir.z);
            let length = math.vec3Length(projectedXZ);
            var pitch = Math.acos(length) / Math.PI * 180;
            if (dir.y < 0)
            {
                pitch = -pitch;
            }
            var quadRight = gd3d.math.pool.new_quaternion();
            math.quatFromAxisAngle(right, pitch, quadRight);
            // math.quatMultiply(quadRight,out,out);

        }


        public static RotateVector3(source: gd3d.math.vector3, direction: gd3d.math.vector3, out: gd3d.math.vector3)
        {
            math.vec3Normalize(source, source);
            math.vec3Normalize(direction, direction);

            let forward = new gd3d.math.vector3(0, 0, 1);
            let axis = gd3d.math.pool.new_vector3();
            math.vec3Cross(forward, direction, axis);
            math.vec3Normalize(axis, axis);

            if (axis.x == 0 && axis.y == 0 && axis.z == 0)
            {
                // axis = new gd3d.math.vector3(1, 0, 0);
                axis.x = 1;
                axis.y = 0;
                axis.z = 0;
            }

            let cos = math.vec3Dot(forward, direction);

            let angle = Math.acos(cos) * 180 / Math.PI;
            if (cos < 0)
            {
                angle = -angle;
            }

            let quatertion = gd3d.math.pool.new_quaternion();
            gd3d.math.quatFromAxisAngle(axis, angle, quatertion);
            gd3d.math.quatTransformVector(quatertion, source, out);
            gd3d.math.pool.delete_vector3(axis);
            gd3d.math.pool.delete_quaternion(quatertion);
        }

        public static bindAxisBillboard(localAxis:gd3d.math.vector3,out:gd3d.math.quaternion)
        {
            math.vec3Normalize(localAxis, localAxis);

            let yAxis = gd3d.math.pool.vector3_up;
            let normal = gd3d.math.pool.new_vector3();

            math.vec3Cross(yAxis, localAxis, normal);
            math.vec3Normalize(normal, normal);

            if (normal.x == 0 && normal.y == 0 && normal.z == 0)
            {
                // axis = new gd3d.math.vector3(1, 0, 0);
                normal.x = 1;
                normal.y = 0;
                normal.z = 0;
            }

            let cos = math.vec3Dot(yAxis, localAxis);

            let angle = Math.acos(cos) * 180 / Math.PI;
            if (cos < 0)
            {
                angle = -angle;
            }

            // let quatertion = gd3d.math.pool.new_quaternion();
            gd3d.math.quatFromAxisAngle(normal, angle, out);

        }


        public static lookatVerticalBillboard(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, up: gd3d.math.vector3 = gd3d.math.pool.vector3_up)
        {
            let dir = new gd3d.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            //dir在xz面上的单位投影          
            let dirxz = new gd3d.math.vector3(dir.x, 0, dir.z);
            math.vec3Normalize(dirxz, dirxz);


            var yaw = Math.acos(dirxz.z) / Math.PI * 180;
            if (dirxz.x < 0)
            {
                yaw = -yaw;
            }
            gd3d.math.quatFromAxisAngle(up, yaw, out);
        }

        /**
        * 沿Z轴旋转
        * @param eye 注视点  
        * @param targetpos 目标点 
        * @param forward Z轴朝向
        * @param out 旋转得到的四元数
        */
        public static quatLookatZ(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, forward: gd3d.math.vector3 = gd3d.math.pool.vector3_forward)
        {
            let dir = new gd3d.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            let dirxy = new gd3d.math.vector3(-dir.x, dir.y, 0);
            math.vec3Normalize(dirxy, dirxy);

            let roll = Math.acos(dirxy.y) / Math.PI * 180;
            if (dirxy.x < 0)
            {
                roll = -roll;
            }
            gd3d.math.quatFromAxisAngle(forward, roll, out);
        }

        /**
         * 沿X轴旋转
         * @param eye 注视点  
         * @param targetpos 目标点 
         * @param right X轴朝向
         * @param out 旋转得到的四元数
         */
        public static quatLookatX(eye: gd3d.math.vector3, targetpos: gd3d.math.vector3, out: gd3d.math.quaternion, right: gd3d.math.vector3 = gd3d.math.pool.vector3_right)
        {
            // let dir = new gd3d.math.vector3();
            let dir = gd3d.math.pool.new_vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            let diryz = new gd3d.math.vector3(0, -dir.y, dir.z);
            math.vec3Normalize(diryz, diryz);

            let pitch = Math.acos(diryz.z) / Math.PI * 180;
            if (diryz.y < 0)
            {
                pitch = -pitch;
            }
            gd3d.math.quatFromAxisAngle(right, pitch, out);
        }


        //public static cacldir(pn: gd3d.math.vector3, pos: gd3d.math.vector3, time: number): gd3d.math.vector3
        //{
        //    //var dir = pn.subtract(pos);
        //    //var x = dir.length;
        //    //dir.normalize(x * EffectSystem.fps / time);
        //    var dir: gd3d.math.vector3 = new gd3d.math.vector3();
        //    gd3d.math.vec3Subtract(pn, pos, dir);
        //    var x = gd3d.math.vec3Length(dir) * EffectSystem.fps / time;
        //    gd3d.math.vec3Normalize(dir, dir);
        //    gd3d.math.vec3ScaleByNum(dir, x, dir);

        //    return dir;
        //}
    }
}