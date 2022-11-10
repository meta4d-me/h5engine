namespace m4m.framework
{
    /**
     * @private
     */
    export class EffectUtil
    {

        public static lookatbyXAxis(pos:m4m.math.vector3,xAxis:m4m.math.vector3,yAxis:m4m.math.vector3,zAxis:m4m.math.vector3,targetpos:m4m.math.vector3,quat:m4m.math.quaternion)
        {
            var dir=m4m.math.pool.new_vector3();
            m4m.math.vec3Subtract(targetpos,pos,dir);
            m4m.math.vec3Normalize(dir,dir);

            var crossup=m4m.math.pool.new_vector3();
            m4m.math.vec3Cross(dir,xAxis,crossup);
            m4m.math.vec3Normalize(crossup,crossup);

            var anglerot=m4m.math.vec3Dot(yAxis,crossup);
            anglerot=Math.acos(anglerot)*180/Math.PI;

            var dot=m4m.math.vec3Dot(zAxis,crossup);
            dot=Math.acos(dot)*180/Math.PI;
            if(dot>90)
            {
                anglerot=-anglerot;
            }
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right,anglerot,quat);

            m4m.math.pool.delete_vector3(dir);
            m4m.math.pool.delete_vector3(crossup);
        }
        public static eulerFromQuaternion(out:math.vector3, q:math.quaternion, order) {
            // Borrowed from Three.JS :)
            // q is assumed to be normalized
            // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
            var sqx = q.x * q.x;
            var sqy = q.y * q.y;
            var sqz = q.z * q.z;
            var sqw = q.w * q.w;

            if ( order === 'XYZ' ) {
                out.x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
                out.y = Math.asin(  m4m.math.floatClamp( 2 * ( q.x * q.z + q.y * q.w ), -1, 1 ) );
                out.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );
            } else if ( order ===  'YXZ' ) {
                out.x = Math.asin(   m4m.math.floatClamp( 2 * ( q.x * q.w - q.y * q.z ), -1, 1 ) );
                out.y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw - sqx - sqy + sqz ) );
                out.z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw - sqx + sqy - sqz ) );
            } else if ( order === 'ZXY' ) {
                out.x = Math.asin(   m4m.math.floatClamp( 2 * ( q.x * q.w + q.y * q.z ), -1, 1 ) );
                out.y = Math.atan2( 2 * ( q.y * q.w - q.z * q.x ), ( sqw - sqx - sqy + sqz ) );
                out.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw - sqx + sqy - sqz ) );
            } else if ( order === 'ZYX' ) {
                out.x = Math.atan2( 2 * ( q.x * q.w + q.z * q.y ), ( sqw - sqx - sqy + sqz ) );
                out.y = Math.asin(   m4m.math.floatClamp( 2 * ( q.y * q.w - q.x * q.z ), -1, 1 ) );
                out.z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw + sqx - sqy - sqz ) );
            } else if ( order === 'YZX' ) {
                out.x = Math.atan2( 2 * ( q.x * q.w - q.z * q.y ), ( sqw - sqx + sqy - sqz ) );
                out.y = Math.atan2( 2 * ( q.y * q.w - q.x * q.z ), ( sqw + sqx - sqy - sqz ) );
                out.z = Math.asin(   m4m.math.floatClamp( 2 * ( q.x * q.y + q.z * q.w ), -1, 1 ) );
            } else if ( order === 'XZY' ) {
                out.x = Math.atan2( 2 * ( q.x * q.w + q.y * q.z ), ( sqw - sqx + sqy - sqz ) );
                out.y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw + sqx - sqy - sqz ) );
                out.z = Math.asin(   m4m.math.floatClamp( 2 * ( q.z * q.w - q.x * q.y ), -1, 1 ) );
            } else {
                console.log('No order given for quaternion to euler conversion.');
                return;
            }
        }

        //范围内随机  isInteger是否为整数
        public static RandomRange(min: number, max: number, isInteger: boolean = false)
        {
            if (isInteger)
            {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            return Math.random() * (max - min) + min;
        }
        public static vecMuliNum(vec: m4m.math.vector3, num: number): m4m.math.vector3
        {
            var v = new m4m.math.vector3(vec.x * num, vec.y * num, vec.z * num);
            return v;
        }

        public static parseVector3(value:any):m4m.math.vector3
        {
            var vector3=new m4m.math.vector3();
            vector3.x=value["x"];
            vector3.y=value["y"];
            vector3.z=value["z"];
            return vector3;
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

        public static parseEffectNumNode(value:any):ParticleNodeNumber
        {
            let node = new ParticleNodeNumber();
            for (let key in value)
            {
                if(value[key] instanceof Array)
                {
                    node[key].valueLimitMin=value[key][0];
                    node[key].valueLimitMax=value[key][1];
                }
                else
                {
                    if(key=="key")
                    {
                        node[key]=value[key];
                    }else
                    {
                        node.num.value=value[key];
                    }
                }
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
        public static lookat(eye: m4m.math.vector3, targetpos: m4m.math.vector3, out: m4m.math.quaternion, up: m4m.math.vector3 = m4m.math.pool.vector3_up)
        {

            let dir = new m4m.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            //dir在xz面上的单位投影          
            let unitprojectedXZ = new m4m.math.vector3(dir.x, 0, dir.z);
            math.vec3Normalize(unitprojectedXZ, unitprojectedXZ);


            var yaw = Math.acos(unitprojectedXZ.z) / Math.PI * 180;
            if (unitprojectedXZ.x < 0)
            {
                yaw = -yaw;
            }
            m4m.math.quatFromAxisAngle(up, yaw, out);

            let right = m4m.math.pool.new_vector3();
            math.vec3Cross(up, dir, right);
            math.vec3Normalize(right, right);

            //dir在xz面上的投影   
            let projectedXZ = new m4m.math.vector3(dir.x, 0, dir.z);
            let length = math.vec3Length(projectedXZ);
            var pitch = Math.acos(length) / Math.PI * 180;
            if (dir.y < 0)
            {
                pitch = -pitch;
            }
            var quadRight = m4m.math.pool.new_quaternion();
            math.quatFromAxisAngle(right, pitch, quadRight);
            // math.quatMultiply(quadRight,out,out);

        }


        public static RotateVector3(source: m4m.math.vector3, direction: m4m.math.vector3, out: m4m.math.vector3)
        {
            math.vec3Normalize(source, source);
            math.vec3Normalize(direction, direction);

            let forward = new m4m.math.vector3(0, 0, 1);
            let axis = m4m.math.pool.new_vector3();
            math.vec3Cross(forward, direction, axis);
            math.vec3Normalize(axis, axis);

            if (axis.x == 0 && axis.y == 0 && axis.z == 0)
            {
                // axis = new m4m.math.vector3(1, 0, 0);
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
            let quatertion = m4m.math.pool.new_quaternion();
            m4m.math.quatFromAxisAngle(axis, angle, quatertion);
            m4m.math.quatTransformVector(quatertion, source, out);
            m4m.math.pool.delete_vector3(axis);
            m4m.math.pool.delete_quaternion(quatertion);
        }

        public static bindAxisBillboard(localAxis:m4m.math.vector3,out:m4m.math.quaternion)
        {
            math.vec3Normalize(localAxis, localAxis);

            let yAxis = m4m.math.pool.vector3_up;
            let normal = m4m.math.pool.new_vector3();

            math.vec3Cross(yAxis, localAxis, normal);
            math.vec3Normalize(normal, normal);

            if (normal.x == 0 && normal.y == 0 && normal.z == 0)
            {
                // axis = new m4m.math.vector3(1, 0, 0);
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

            // let quatertion = m4m.math.pool.new_quaternion();
            m4m.math.quatFromAxisAngle(normal, angle, out);

        }


        public static lookatVerticalBillboard(eye: m4m.math.vector3, targetpos: m4m.math.vector3, out: m4m.math.quaternion, up: m4m.math.vector3 = m4m.math.pool.vector3_up)
        {
            let dir = new m4m.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            //dir在xz面上的单位投影          
            let dirxz = new m4m.math.vector3(dir.x, 0, dir.z);
            math.vec3Normalize(dirxz, dirxz);


            var yaw = Math.acos(dirxz.z) / Math.PI * 180;
            if (dirxz.x < 0)
            {
                yaw = -yaw;
            }
            m4m.math.quatFromAxisAngle(up, yaw, out);
        }

        /**
        * 沿Z轴旋转
        * @param eye 注视点  
        * @param targetpos 目标点 
        * @param forward Z轴朝向
        * @param out 旋转得到的四元数
        */
        public static quatLookatZ(eye: m4m.math.vector3, targetpos: m4m.math.vector3, out: m4m.math.quaternion, forward: m4m.math.vector3 = m4m.math.pool.vector3_forward)
        {
            let dir = new m4m.math.vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            let dirxy = new m4m.math.vector3(-dir.x, dir.y, 0);
            math.vec3Normalize(dirxy, dirxy);

            let roll = Math.acos(dirxy.y) / Math.PI * 180;
            if (dirxy.x < 0)
            {
                roll = -roll;
            }
            m4m.math.quatFromAxisAngle(forward, roll, out);
        }

        /**
         * 沿X轴旋转
         * @param eye 注视点  
         * @param targetpos 目标点 
         * @param right X轴朝向
         * @param out 旋转得到的四元数
         */
        public static quatLookatX(eye: m4m.math.vector3, targetpos: m4m.math.vector3, out: m4m.math.quaternion, right: m4m.math.vector3 = m4m.math.pool.vector3_right)
        {
            // let dir = new m4m.math.vector3();
            let dir = m4m.math.pool.new_vector3();
            math.vec3Subtract(targetpos, eye, dir);
            math.vec3Normalize(dir, dir);

            let diryz = new m4m.math.vector3(0, -dir.y, dir.z);
            math.vec3Normalize(diryz, diryz);

            let pitch = Math.acos(diryz.z) / Math.PI * 180;
            if (diryz.y < 0)
            {
                pitch = -pitch;
            }
            m4m.math.quatFromAxisAngle(right, pitch, out);
        }


        //public static cacldir(pn: m4m.math.vector3, pos: m4m.math.vector3, time: number): m4m.math.vector3
        //{
        //    //var dir = pn.subtract(pos);
        //    //var x = dir.length;
        //    //dir.normalize(x * EffectSystem.fps / time);
        //    var dir: m4m.math.vector3 = new m4m.math.vector3();
        //    m4m.math.vec3Subtract(pn, pos, dir);
        //    var x = m4m.math.vec3Length(dir) * EffectSystem.fps / time;
        //    m4m.math.vec3Normalize(dir, dir);
        //    m4m.math.vec3ScaleByNum(dir, x, dir);

        //    return dir;
        //}
    }
}