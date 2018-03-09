namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 射线
     * @version egret-gd3d 1.0
     */
    export class ray
    {
        public origin: gd3d.math.vector3;
        public direction: gd3d.math.vector3;
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 构建射线
        * @param _origin 射线起点
        * @param _dir 射线方向
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        constructor(_origin: gd3d.math.vector3, _dir: gd3d.math.vector3)
        {
            this.origin = gd3d.math.pool.clone_vector3(_origin);
            this.direction = gd3d.math.pool.clone_vector3(_dir);
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与aabb碰撞相交检测
        * @param _aabb 待检测aabb
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectAABB(_aabb: aabb): boolean
        {
            return this.intersectBoxMinMax(_aabb.minimum, _aabb.maximum);
        }
        
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与transform表示的plane碰撞相交检测，主要用于2d检测
        * @param tran transform
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectPlaneTransform(tran: transform): pickinfo
        {
            var pickinfo = null;
            var panelpoint = tran.getWorldTranslate();
            var forward = gd3d.math.pool.new_vector3();
            tran.getForwardInWorld(forward);
            var hitposition = this.intersectPlane(panelpoint, forward);
            if (hitposition)
            {
                pickinfo = new gd3d.framework.pickinfo(0, 0, 0);
                pickinfo.hitposition = hitposition;
                pickinfo.distance = gd3d.math.vec3Distance(pickinfo.hitposition, this.origin);
            }
            gd3d.math.pool.delete_vector3(forward);
            return pickinfo;
        }

        public intersectPlane(planePoint: gd3d.math.vector3, planeNormal:gd3d.math.vector3): gd3d.math.vector3
        {
            var vp1 = planeNormal.x;
            var vp2 = planeNormal.y;
            var vp3 = planeNormal.z;
            var n1 = planePoint.x;
            var n2 = planePoint.y;
            var n3 = planePoint.z;
            var v1 = this.direction.x;
            var v2 = this.direction.y;
            var v3 = this.direction.z;
            var m1 = this.origin.x;
            var m2 = this.origin.y;
            var m3 = this.origin.z;
            var vpt = v1 * vp1 + v2 * vp2 + v3 * vp3;
            if (vpt === 0)
            {
                return null;
            }
            else
            {
                var t = ((n1 - m1) * vp1 + (n2 - m2) * vp2 + (n3 - m3) * vp3) / vpt;
                return new gd3d.math.vector3(m1 + v1 * t, m2 + v2 * t, m3 + v3 * t);
            }
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与碰撞盒相交检测
        * @param tran 待检测带碰撞盒的transform
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectCollider(tran: transform): pickinfo
        {
            let _collider: ICollider = tran.gameObject.collider;

            let pickinfo = null;
            if (_collider instanceof boxcollider)
            {
                let obb = _collider.getBound() as obb;
                if(!obb)    return null;
                let vecs: gd3d.math.vector3[] = [];
                obb.caclWorldVecs(vecs, _collider.gameObject.transform.getWorldMatrix());
                let data = gd3d.render.meshData.genBoxByArray(vecs);

                for (var index = 0; index < data.trisindex.length; index += 3)
                {
                    var p0 = data.pos[data.trisindex[index]];
                    var p1 = data.pos[data.trisindex[index + 1]];
                    var p2 = data.pos[data.trisindex[index + 2]];
                    
                    var result = this.intersectsTriangle(p0, p1, p2);
                    if (result)
                    {
                        if (result.distance < 0) continue;
                        if (!pickinfo || pickinfo.distance > result.distance)
                        {
                            pickinfo = result;
                            var tdir = gd3d.math.pool.new_vector3();
                            gd3d.math.vec3ScaleByNum(this.direction, result.distance, tdir);
                            gd3d.math.vec3Add(this.origin, tdir, pickinfo.hitposition);
                            gd3d.math.pool.delete_vector3(tdir);
                        }
                    }
                }
            }
            else if (_collider instanceof meshcollider)
            {
                let mesh = _collider.getBound();
                if (mesh != null)
                {
                    pickinfo = mesh.intersects(this, tran.getWorldMatrix());
                }
            }
            else if (_collider instanceof canvasRenderer)
            {
                pickinfo = this.intersectPlaneTransform(tran);
            }
            return pickinfo;
        }

        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与最大最小点表示的box相交检测
        * @param minimum
        * @param maximum
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectBoxMinMax(minimum: gd3d.math.vector3, maximum: gd3d.math.vector3): boolean
        {
            var d = 0.0;
            var maxValue = Number.MAX_VALUE;
            var inv: number;
            var min: number;
            var max: number;
            var temp: number;
            if (Math.abs(this.direction.x) < 0.0000001)
            {
                if (this.origin.x < minimum.x || this.origin.x > maximum.x)
                {
                    return false;
                }
            }
            else
            {
                inv = 1.0 / this.direction.x;
                min = (minimum.x - this.origin.x) * inv;
                max = (maximum.x - this.origin.x) * inv;
                if (max === -Infinity)
                {
                    max = Infinity;
                }

                if (min > max)
                {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue)
                {
                    return false;
                }
            }

            if (Math.abs(this.direction.y) < 0.0000001)
            {
                if (this.origin.y < minimum.y || this.origin.y > maximum.y)
                {
                    return false;
                }
            }
            else
            {
                inv = 1.0 / this.direction.y;
                min = (minimum.y - this.origin.y) * inv;
                max = (maximum.y - this.origin.y) * inv;

                if (max === -Infinity)
                {
                    max = Infinity;
                }

                if (min > max)
                {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue)
                {
                    return false;
                }
            }

            if (Math.abs(this.direction.z) < 0.0000001)
            {
                if (this.origin.z < minimum.z || this.origin.z > maximum.z)
                {
                    return false;
                }
            }
            else
            {
                inv = 1.0 / this.direction.z;
                min = (minimum.z - this.origin.z) * inv;
                max = (maximum.z - this.origin.z) * inv;

                if (max === -Infinity)
                {
                    max = Infinity;
                }

                if (min > max)
                {
                    temp = min;
                    min = max;
                    max = temp;
                }

                d = Math.max(min, d);
                maxValue = Math.min(max, maxValue);

                if (d > maxValue)
                {
                    return false;
                }
            }
            return true;
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与球相交检测
        * @param center 球圆心坐标
        * @param radius 球半径
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectsSphere(center: gd3d.math.vector3, radius: number): boolean
        {
            var center_ori = gd3d.math.pool.new_vector3();
            gd3d.math.vec3Subtract(center, this.origin, center_ori);
            var raydist = gd3d.math.vec3Dot(this.direction, center_ori);

            if (orilen2 < rad2) return true;//射线起点在球里

            if (raydist < 0) return false;//到圆心的向量在方向向量上的投影为负  夹角不在-90 90

            var orilen2 = gd3d.math.vec3SqrLength(center_ori);
            gd3d.math.pool.delete_vector3(center_ori);
            var rad2 = radius * radius;

            var d = rad2 - (orilen2 - raydist * raydist);
            if (d < 0) return false;

            return true;
        }
        /**
        * @private
        * @language zh_CN
        * @classdesc
        * 与三角形相交检测
        * @param vertex0 
        * @param vertex1 
        * @param vertex2 
        * @version egret-gd3d 1.0
        * @platform Web,Native
        */
        public intersectsTriangle(vertex0: gd3d.math.vector3, vertex1: gd3d.math.vector3, vertex2: gd3d.math.vector3): pickinfo
        {
            var _edge1 = gd3d.math.pool.new_vector3();
            var _edge2 = gd3d.math.pool.new_vector3();
            var _pvec = gd3d.math.pool.new_vector3();
            var _tvec = gd3d.math.pool.new_vector3();
            var _qvec = gd3d.math.pool.new_vector3();
         

            gd3d.math.vec3Subtract(vertex1, vertex0, _edge1);
            gd3d.math.vec3Subtract(vertex2, vertex0, _edge2);
            gd3d.math.vec3Cross(this.direction, _edge2, _pvec);
            var det = gd3d.math.vec3Dot(_edge1, _pvec);

            if (det === 0)
            {
                return null;
            }

            var invdet = 1 / det;

            gd3d.math.vec3Subtract(this.origin, vertex0, _tvec);

            var bu = gd3d.math.vec3Dot(_tvec, _pvec) * invdet;

            if (bu < 0 || bu > 1.0)
            {
                return null;
            }

            gd3d.math.vec3Cross(_tvec, _edge1, _qvec);

            var bv = gd3d.math.vec3Dot(this.direction, _qvec) * invdet;

            if (bv < 0 || bu + bv > 1.0)
            {
                return null;
            }

            var distance = gd3d.math.vec3Dot(_edge2, _qvec) * invdet;


            gd3d.math.pool.delete_vector3(_edge1);
            gd3d.math.pool.delete_vector3(_edge2);
            gd3d.math.pool.delete_vector3(_pvec);
            gd3d.math.pool.delete_vector3(_tvec);
            gd3d.math.pool.delete_vector3(_qvec);
            return new pickinfo(bu, bv, distance);
        }
    }
}