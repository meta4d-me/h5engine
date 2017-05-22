namespace gd3d.framework
{    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 表示定向包围盒
     * @version gd3d 1.0
     */
    export class obb
    {
        center: gd3d.math.vector3;
        halfsize: gd3d.math.vector3;
        directions: gd3d.math.vector3[];
        vectors: gd3d.math.vector3[] = new Array<gd3d.math.vector3>();
        /**
        * @private
        * @language zh_CN
        * 构建定向包围盒
        * @param minimum 最小点
        * @param maximum 最大点
        * @version gd3d 1.0
        * @platform Web,Native
        */
        constructor()
        {

        }

        buildByMaxMin(minimum: gd3d.math.vector3, maximum: gd3d.math.vector3)
        {
            this.vectors[0] = math.pool.clone_vector3(minimum);
            this.vectors[1] = math.pool.clone_vector3(minimum);
            this.vectors[1].z = maximum.z;
            this.vectors[2] = math.pool.clone_vector3(minimum);
            this.vectors[2].x = maximum.x;
            this.vectors[3] = math.pool.clone_vector3(maximum);
            this.vectors[3].y = minimum.y;
            this.vectors[4] = math.pool.clone_vector3(minimum);
            this.vectors[4].y = maximum.y;
            this.vectors[5] = math.pool.clone_vector3(maximum);
            this.vectors[5].x = minimum.x;
            this.vectors[6] = math.pool.clone_vector3(maximum);
            this.vectors[6].z = minimum.z;
            this.vectors[7] = math.pool.clone_vector3(maximum);

            this.center = new gd3d.math.vector3();
            gd3d.math.vec3Add(maximum, minimum, this.center);
            gd3d.math.vec3ScaleByNum(this.center, 0.5, this.center);

            this.halfsize = new gd3d.math.vector3();
            gd3d.math.vec3Subtract(maximum, minimum, this.halfsize);
            gd3d.math.vec3ScaleByNum(this.halfsize, 0.5, this.halfsize);

            this.directions = [new gd3d.math.vector3(), new gd3d.math.vector3(), new gd3d.math.vector3()];
        }
        buildByCenterSize(center:gd3d.math.vector3, size:gd3d.math.vector3)
        {
            this.center = math.pool.clone_vector3(center);
            this.halfsize = math.pool.clone_vector3(size);
            gd3d.math.vec3ScaleByNum(this.halfsize, 0.5, this.halfsize);
            let hsx = this.halfsize.x;
            let hsy = this.halfsize.y;
            let hsz = this.halfsize.z;
            let cenx = this.center.x;
            let ceny = this.center.y;
            let cenz = this.center.z;
            this.vectors[0] = new math.vector3(cenx - hsx, ceny - hsy, cenz - hsz);
            this.vectors[1] = new math.vector3(cenx - hsx, ceny - hsy, cenz + hsz);
            this.vectors[2] = new math.vector3(cenx + hsx, ceny - hsy, cenz - hsz);
            this.vectors[3] = new math.vector3(cenx + hsx, ceny - hsy, cenz + hsz);
            this.vectors[4] = new math.vector3(cenx - hsx, ceny + hsy, cenz - hsz);
            this.vectors[5] = new math.vector3(cenx - hsx, ceny + hsy, cenz + hsz);
            this.vectors[6] = new math.vector3(cenx + hsx, ceny + hsy, cenz - hsz);
            this.vectors[7] = new math.vector3(cenx + hsx, ceny + hsy, cenz + hsz);
            this.directions = [new gd3d.math.vector3(), new gd3d.math.vector3(), new gd3d.math.vector3()];
        }
        /**
        * @private
        * @language zh_CN
        * 刷新定向包围盒
        * @param worldmatrix 物体的世界矩阵
        * @version gd3d 1.0
        * @platform Web,Native
        */
        public update(worldmatrix: gd3d.math.matrix)
        {
            gd3d.math.matrixGetTranslation(worldmatrix, this.center);
            gd3d.math.matrixGetVector3ByOffset(worldmatrix, 0, this.directions[0]);
            gd3d.math.matrixGetVector3ByOffset(worldmatrix, 4, this.directions[1]);
            gd3d.math.matrixGetVector3ByOffset(worldmatrix, 8, this.directions[2]);
        }

        public caclWorldVecs(vecs: gd3d.math.vector3[], worldmatrix: gd3d.math.matrix)
        {
            for (var index = 0; index < this.vectors.length; index++)
            {
                vecs[index] = new gd3d.math.vector3();
                gd3d.math.matrixTransformVector3(this.vectors[index], worldmatrix, vecs[index]);
            }
        }

        public intersects(_obb: obb)
        {
            if (_obb == null) return false;

            var box0 = this;
            var box1 = _obb;

            if (!this.axisOverlap(box0.directions[0], box0, box1)) return false;
            if (!this.axisOverlap(box0.directions[1], box0, box1)) return false;
            if (!this.axisOverlap(box0.directions[2], box0, box1)) return false;
            if (!this.axisOverlap(box1.directions[0], box0, box1)) return false;
            if (!this.axisOverlap(box1.directions[1], box0, box1)) return false;
            if (!this.axisOverlap(box1.directions[2], box0, box1)) return false;

            var crossresult = gd3d.math.pool.new_vector3();

            gd3d.math.vec3Cross(box0.directions[0], box1.directions[0], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[0], box1.directions[1], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[0], box1.directions[2], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[1], box1.directions[0], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[1], box1.directions[1], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[1], box1.directions[2], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[2], box1.directions[0], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[2], box1.directions[1], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;
            gd3d.math.vec3Cross(box0.directions[2], box1.directions[2], crossresult);
            if (!this.axisOverlap(crossresult, box0, box1)) return false;

            return true;
        }
        
        computeBoxExtents(axis: gd3d.math.vector3, box: obb)
        {
            var p = gd3d.math.vec3Dot(box.center, axis);

            var r0 = Math.abs(gd3d.math.vec3Dot(box.directions[0], axis)) * box.halfsize.x;
            var r1 = Math.abs(gd3d.math.vec3Dot(box.directions[1], axis)) * box.halfsize.y;
            var r2 = Math.abs(gd3d.math.vec3Dot(box.directions[2], axis)) * box.halfsize.z;

            var r = r0 + r1 + r2;
            var result = gd3d.math.pool.new_vector3();
            result.x = p - r;
            result.y = p + r;
            return result;
        }
        
        axisOverlap(axis: gd3d.math.vector3, box0: obb, box1: obb): boolean
        {
            var result0 = this.computeBoxExtents(axis, box0);
            var result1 = this.computeBoxExtents(axis, box1);
            return this.extentsOverlap(result0.x, result0.y, result1.x, result1.y);
        }
        
        extentsOverlap(min0: number, max0: number, min1: number, max1: number): boolean
        {
            return !(min0 > max1 || min1 > max0);
        }
    }

}