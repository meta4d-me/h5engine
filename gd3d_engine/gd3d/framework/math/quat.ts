namespace gd3d.math {
    export function quatIdentity(src:quaternion)
    {
        src.x=0;
        src.y=0;
        src.z=0;
        src.w=1;
    }

    export function quatNormalize(src: quaternion, out: quaternion) {
        var mag: number = 1 / Math.sqrt(src.x * src.x + src.y * src.y + src.z * src.z + src.w * src.w);

        out.x *= mag;
        out.y *= mag;
        out.z *= mag;
        out.w *= mag;
    }

    export function quatTransformVector(src: quaternion, vector: vector3, out: vector3) {
        var x1: number, y1: number, z1: number, w1: number;
        var x2: number = vector.x, y2: number = vector.y, z2: number = vector.z;

        w1 = -src.x * x2 - src.y * y2 - src.z * z2;
        x1 = src.w * x2 + src.y * z2 - src.z * y2;
        y1 = src.w * y2 - src.x * z2 + src.z * x2;
        z1 = src.w * z2 + src.x * y2 - src.y * x2;

        out.x = -w1 * src.x + x1 * src.w - y1 * src.z + z1 * src.y;
        out.y = -w1 * src.y + x1 * src.z + y1 * src.w - z1 * src.x;
        out.z = -w1 * src.z - x1 * src.y + y1 * src.x + z1 * src.w;

    }
    export function quatTransformVectorDataAndQuat(src: Float32Array, srcseek: number, vector: vector3, out: vector3) {
        var x1: number, y1: number, z1: number, w1: number;
        var x2: number = vector.x, y2: number = vector.y, z2: number = vector.z;
        var srcx = src[srcseek]; var srcy = src[srcseek + 1]; var srcz = src[srcseek + 2]; var srcw = src[srcseek + 3];

        w1 = -srcx * x2 - srcy * y2 - srcz * z2;
        x1 = srcw * x2 + srcy * z2 - srcz * y2;
        y1 = srcw * y2 - srcx * z2 + srcz * x2;
        z1 = srcw * z2 + srcx * y2 - srcy * x2;

        out.x = -w1 * srcx + x1 * srcw - y1 * srcz + z1 * srcy;
        out.y = -w1 * srcy + x1 * srcz + y1 * srcw - z1 * srcx;
        out.z = -w1 * srcz - x1 * srcy + y1 * srcx + z1 * srcw;

    }
    export function quatMagnitude(src: quaternion): number {
        return Math.sqrt(src.w * src.w + src.x * src.x + src.y * src.y + src.z * src.z);
    }

    export function quatClone(src: quaternion, out: quaternion) {
        out.x = src.x;
        out.y = src.y;
        out.z = src.z;
        out.w = src.w;
    }
    export function quatToMatrix(src: quaternion, out: matrix) {
        var xy2: number = 2.0 * src.x * src.y, xz2: number = 2.0 * src.x * src.z, xw2: number = 2.0 * src.x * src.w;
        var yz2: number = 2.0 * src.y * src.z, yw2: number = 2.0 * src.y * src.w, zw2: number = 2.0 * src.z * src.w;
        var xx: number = src.x * src.x, yy: number = src.y * src.y, zz: number = src.z * src.z, ww: number = src.w * src.w;

        out.rawData[0] = xx - yy - zz + ww;
        out.rawData[4] = xy2 - zw2;
        out.rawData[8] = xz2 + yw2;
        out.rawData[12] = 0;
        out.rawData[1] = xy2 + zw2;
        out.rawData[5] = -xx + yy - zz + ww;
        out.rawData[9] = yz2 - xw2;
        out.rawData[13] = 0;
        out.rawData[2] = xz2 - yw2;
        out.rawData[6] = yz2 + xw2;
        out.rawData[10] = -xx - yy + zz + ww;
        out.rawData[14] = 0;
        out.rawData[3] = 0.0;
        out.rawData[7] = 0.0;
        out.rawData[11] = 0;
        out.rawData[15] = 1;
    }

    export function quatInverse(src: quaternion, out: quaternion) {
        var norm: number = src.w * src.w + src.x * src.x + src.y * src.y + src.z * src.z;

        if (norm > 0.0) {
            var invNorm = 1.0 / norm;
            out.w = src.w * invNorm;
            out.x = -src.x * invNorm;
            out.y = -src.y * invNorm;
            out.z = -src.z * invNorm;
        }
    }

    export function quatFromYawPitchRoll(yaw: number, pitch: number, roll: number, result: quaternion): void {
        // Produces a quaternion from Euler angles in the z-y-x orientation (Tait-Bryan angles)
        var halfRoll = roll * 0.5;
        var halfPitch = pitch * 0.5;
        var halfYaw = yaw * 0.5;

        var sinRoll = Math.sin(halfRoll);
        var cosRoll = Math.cos(halfRoll);
        var sinPitch = Math.sin(halfPitch);
        var cosPitch = Math.cos(halfPitch);
        var sinYaw = Math.sin(halfYaw);
        var cosYaw = Math.cos(halfYaw);

        result.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
        result.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
        result.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
        result.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);
    }
    export function quatMultiply(srca: quaternion, srcb: quaternion, out: quaternion) {
        var w1: number = srca.w, x1: number = srca.x, y1: number = srca.y, z1: number = srca.z;
        var w2: number = srcb.w, x2: number = srcb.x, y2: number = srcb.y, z2: number = srcb.z;

        out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
        out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

        math.quatNormalize(out, out);
        // out.w = x1 * x2 - y1 * y2 - z1 * z2 + w1 * w2;
        // out.x = x1 * w2 + y1 * z2 - z1 * y2 + w1 * x2;
        // out.y = -x1 * z2 + y1 * w2 + z1 * x2 + w1 * y2;
        // out.z = x1 * y2 - y1 * x2 + z1 * w2 + w1 * z2;
    }
    export function quatMultiplyDataAndQuat(srca: Float32Array, srcaseek: number, srcb: quaternion, out: quaternion) {
        var w1: number = srca[srcaseek + 3], x1: number = srca[srcaseek + 0], y1: number = srca[srcaseek + 1], z1: number = srca[srcaseek + 2];
        var w2: number = srcb.w, x2: number = srcb.x, y2: number = srcb.y, z2: number = srcb.z;

        out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
        out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;

        math.quatNormalize(out, out);
        // out.w = x1 * x2 - y1 * y2 - z1 * z2 + w1 * w2;
        // out.x = x1 * w2 + y1 * z2 - z1 * y2 + w1 * x2;
        // out.y = -x1 * z2 + y1 * w2 + z1 * x2 + w1 * y2;
        // out.z = x1 * y2 - y1 * x2 + z1 * w2 + w1 * z2;
    }
    export function quatMultiplyVector(vector: vector3, scr: quaternion, out: quaternion) {
        var x2: number = vector.x;
        var y2: number = vector.y;
        var z2: number = vector.z;

        out.w = -scr.x * x2 - scr.y * y2 - scr.z * z2;
        out.x = scr.w * x2 + scr.y * z2 - scr.z * y2;
        out.y = scr.w * y2 - scr.x * z2 + scr.z * x2;
        out.z = scr.w * z2 + scr.x * y2 - scr.y * x2;
    }

    export function quatLerp(srca: quaternion, srcb: quaternion, out: quaternion, t: number) {
        var w1: number = srca.w, x1: number = srca.x, y1: number = srca.y, z1: number = srca.z;
        var w2: number = srcb.w, x2: number = srcb.x, y2: number = srcb.y, z2: number = srcb.z;

        if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
            w2 = -w2;
            x2 = -x2;
            y2 = -y2;
            z2 = -z2;
        }

        out.w = w1 + t * (w2 - w1);
        out.x = x1 + t * (x2 - x1);
        out.y = y1 + t * (y2 - y1);
        out.z = z1 + t * (z2 - z1);

        var len: number = 1.0 / Math.sqrt(out.w * out.w + out.x * out.x + out.y * out.y + out.z * out.z);
        out.w *= len;
        out.x *= len;
        out.y *= len;
        out.z *= len;
    }

    export function quatFromAxisAngle(axis: vector3, angle: number, out: quaternion) {
        angle *= Math.PI / 180.0;
        var halfAngle: number = angle * 0.5;
        var sin_a: number = Math.sin(halfAngle);

        out.w = Math.cos(halfAngle);
        out.x = axis.x * sin_a;
        out.y = axis.y * sin_a;
        out.z = axis.z * sin_a;

        math.quatNormalize(out, out);
    }

    export function quatToAxisAngle(src: quaternion, axis: vector3): number {
        var sqrLength: number = src.x * src.x + src.y * src.y + src.z * src.z;
        var angle: number = 0;
        if (sqrLength > 0.0) {
            angle = 2.0 * Math.acos(src.w);
            sqrLength = 1.0 / Math.sqrt(sqrLength);
            axis.x = src.x * sqrLength;
            axis.y = src.y * sqrLength;
            axis.z = src.z * sqrLength;
        }
        else {
            angle = 0;
            axis.x = 1.0;
            axis.y = 0;
            axis.z = 0;
        }
        angle /= Math.PI / 180.0;
        return angle;
    }

    export function quatFromEulerAngles(ax: number, ay: number, az: number, out: quaternion) {
        ax *= Math.PI / 180;
        ay *= Math.PI / 180;
        az *= Math.PI / 180;

        var halfX: number = ax * 0.5, halfY: number = ay * 0.5, halfZ: number = az * 0.5;
        var cosX: number = Math.cos(halfX), sinX: number = Math.sin(halfX);
        var cosY: number = Math.cos(halfY), sinY: number = Math.sin(halfY);
        var cosZ: number = Math.cos(halfZ), sinZ: number = Math.sin(halfZ);

        out.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
        out.x = sinX * cosY * cosZ + cosX * sinY * sinZ;
        out.y = cosX * sinY * cosZ - sinX * cosY * sinZ;
        out.z = cosX * cosY * sinZ - sinX * sinY * cosZ;

        math.quatNormalize(out, out);
    }
    export function quatToEulerAngles(src: quaternion, out: vector3) {
        var temp: number = 2.0 * (src.w * src.x - src.y * src.z);
        temp = math.floatClamp(temp, -1.0, 1.0);
        out.x = Math.asin(temp);

        out.y = Math.atan2(2.0 * (src.w * src.y + src.z * src.x), 1.0 - 2.0 * (src.y * src.y + src.x * src.x));

        out.z = Math.atan2(2.0 * (src.w * src.z + src.y * src.x), 1.0 - 2.0 * (src.x * src.x + src.z * src.z));

        out.x /= Math.PI / 180;
        out.y /= Math.PI / 180;
        out.z /= Math.PI / 180;
    }
    export function quatReset(src: quaternion) {
        src.x = 0;
        src.y = 0;
        src.z = 0;
        src.w = 1;
    }
    //获取一个注视目标的四元数
    export function quatLookat(pos: vector3, targetpos: vector3, out: quaternion) {
        var dir = new vector3();
        math.vec3Subtract(targetpos, pos, dir);
        math.vec3Normalize(dir, dir);

        //dir在xz面上的单位投影             
        var dirxz = new vector3(dir.x, 0, dir.z);
        math.vec3Normalize(dirxz, dirxz);

        var yaw = Math.acos(dirxz.z);// / Math.PI * 180;
        if (dirxz.x < 0) {
            yaw = -yaw;
        }
        //dir在xz面上的投影
        var dirxz1 = new vector3(dir.x, 0, dir.z);
        let v3length = math.vec3Length(dirxz1);
        if (v3length > 0.999)
            v3length = 1;
        if (v3length < -0.999)
            v3length = -1;
        var pitch = Math.acos(v3length);// / Math.PI * 180;
        if (dir.y > 0) {
            pitch = -pitch;
        }
        quatFromYawPitchRoll(yaw, pitch, 0, out);
        math.quatNormalize(out, out);
    }

    export function quat2Lookat(pos: vector3, targetpos: vector3, out: quaternion, updir: gd3d.math.vector3 = gd3d.math.pool.vector3_up) {
        var dir = gd3d.math.pool.new_vector3();
        math.vec3Subtract(targetpos, pos, dir);
        math.vec3Normalize(dir, dir);
        var dot = gd3d.math.vec3Dot(gd3d.math.pool.vector3_forward, dir);
        dot = gd3d.math.floatClamp(dot, -1, 1);
        var rotangle = Math.acos(dot) * 180 / Math.PI;

        if (rotangle < 0.01) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;
            return;
        }
        if (rotangle > 179.9) {
            gd3d.math.quatFromAxisAngle(updir, 180, out);
            return;
        }
        var rotAxis = gd3d.math.pool.new_vector3();
        gd3d.math.vec3Cross(gd3d.math.pool.vector3_forward, dir, rotAxis);
        gd3d.math.vec3Normalize(rotAxis, rotAxis);
        gd3d.math.quatFromAxisAngle(rotAxis, rotangle, out);
    }

    export function quat2LookRotation(pos: vector3, targetpos: vector3, upwards: vector3, out: quaternion) {
        let dir = gd3d.math.pool.new_vector3();
        math.vec3Subtract(targetpos, pos, dir);
        math.vec3Normalize(dir, dir);
  
        let z = gd3d.math.pool.new_vector3();
        z.x = 0; z.y = 0; z.z = 1;
        let ab = math.vec3Dot(dir, z);

        let an_dz = Math.acos(ab);


        let cdz = gd3d.math.pool.new_vector3();
        vec3Cross(dir, z, cdz);
        math.vec3Normalize(cdz, cdz);
        an_dz = 180 / Math.PI * an_dz;
        quatFromAxisAngle(cdz, -an_dz, out);



        let y = z;
        y.x = 0;
        y.y = 1;
        y.z = 0;

        quatTransformVector(out, y, y);

        let cyw = cdz;

        vec3Cross(dir, upwards, cyw);

        math.vec3Normalize(y, y);
        math.vec3Normalize(cyw, cyw);
        let cos2Y = vec3Dot(cyw, y);
        //vec3Normalize(upwards,upwards);

        
        let sin2Y = Math.sqrt(1 - cos2Y * cos2Y);

        if(vec3Dot(y,upwards)<0){
            sin2Y=-sin2Y;
        }

        let siny = Math.sqrt((1 - sin2Y) / 2);
        let cosy = -Math.sqrt((sin2Y + 1) / 2);

        if (cos2Y < 0){
            cosy = -cosy;
        }

        let yq = gd3d.math.pool.new_quaternion();
        yq.x = 0;
        yq.y = 0;
        yq.z = siny;
        yq.w = cosy;

 
        quatMultiply(yq, out, out);
        // if()<0){
        //     yq.z = -siny;
        //     quatMultiply(yq, out1, out);
        // }
            

        gd3d.math.pool.delete_vector3(dir);
        gd3d.math.pool.delete_vector3(z);
        gd3d.math.pool.delete_vector3(cdz);
        gd3d.math.pool.delete_quaternion(yq);


    }

    export function quatYAxis(pos: vector3, targetpos: vector3, out: quaternion) {
        var dir = new vector3();
        math.vec3Subtract(targetpos, pos, dir);
        math.vec3Normalize(dir, dir);

        //dir在xz面上的单位投影             
        var dirxz = new vector3(dir.x, 0, dir.z);
        math.vec3Normalize(dirxz, dirxz);

        var yaw = Math.acos(dirxz.z);// / Math.PI * 180;
        if (dirxz.x < 0) {
            yaw = -yaw;
        }
        // //dir在xz面上的投影
        // var dirxz1 = new vector3(dir.x, 0, dir.z);
        // let v3length = math.vec3Length(dirxz1);
        // if (v3length > 0.999)
        //     v3length = 1;
        // if (v3length < -0.999)
        //     v3length = -1;
        // var pitch = Math.acos(v3length);// / Math.PI * 180;
        // if (dir.y > 0)
        // {
        //     pitch = -pitch;
        // }
        quatFromYawPitchRoll(yaw, 0, 0, out);
        math.quatNormalize(out, out);
    }

    export function rotationTo(from: vector3, to: vector3,out: quaternion)
    {
        var tmpvec3 =new vector3();
        var xUnitVec3 = pool.vector3_right;
        var yUnitVec3 = pool.vector3_up;

        //var dot = vec3.dot(from, to);
        let dot=vec3Dot(from,to);
        if (dot < -0.999999) {
            //vec3.cross(tmpvec3, xUnitVec3, from);
            vec3Cross(xUnitVec3,from,tmpvec3);
            if (vec3Length(tmpvec3) < 0.000001)
            {
                //vec3.cross(tmpvec3, yUnitVec3, from);
                vec3Cross(yUnitVec3,from,tmpvec3);
            } 
            // vec3.normalize(tmpvec3, tmpvec3);
            // quat.AxisAngle(tmpvec3, Math.PI,out);
            vec3Normalize(tmpvec3,tmpvec3);
            quatFromAxisAngle(tmpvec3,180,out);
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
        } else {
            //vec3.cross(tmpvec3, from, to);
            vec3Cross(from, to,tmpvec3);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            quatNormalize(out,out);
            //return quat.normalize(out, out);
        }
    }
    export function myLookRotation(dir:vector3, out:quaternion,up:vector3=pool.vector3_up)
    {
        if(vec3Equal(dir,pool.vector3_zero))
        {
            console.log("Zero direction in MyLookRotation");
            quatIdentity(out);
            return;
        }
        if (!vec3Equal(dir,up)) {

            let tempv=new vector3();
            vec3ScaleByNum(up,vec3Dot(up,dir),tempv);
            vec3Subtract(dir,tempv,tempv);
            let qu=new quaternion();
            this.rotationTo(pool.vector3_forward,tempv,qu);
            let qu2=new quaternion();
            this.rotationTo(tempv,dir,qu2);
            quatMultiply(qu,qu2,out);
        }
        else {
            this.rotationTo(pool.vector3_forward,dir,out);
        }
    }
}