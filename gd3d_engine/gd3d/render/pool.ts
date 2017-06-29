namespace gd3d.math
{
    export class pool
    {
        static collect_all()
        {
            pool.collect_vector4();
            pool.collect_vector3();
            pool.collect_vector2();
            pool.collect_matrix();
            pool.collect_quaternion();
            pool.collect_color();
        }
        //需要用啥照着这个加
        //for vector4
        private static _vector4_one: vector4;
        static get vector4_one(): vector4
        {
            if (pool._vector4_one == null)
            {
                pool._vector4_one = new vector4(1, 1, 1, 1);
            }
            return pool._vector4_one;
        }

        private static unused_vector4: vector4[] = []
        static new_vector4(): vector4
        {
            if (pool.unused_vector4.length > 0)
                return pool.unused_vector4.pop();
            else
                return new vector4();
        }
        static clone_vector4(src: vector4): vector4
        {
            if (pool.unused_vector4.length > 0)
            {
                var v = pool.unused_vector4.pop();
                v.x = src.x;
                v.y = src.y;
                v.z = src.z;
                v.w = src.w;
                return v;
            }
            else
                return new vector4(src.x, src.y, src.z);
        }
        static delete_vector4(v: vector4): void
        {
            if (v == null) return;
            if (v instanceof vector4)
            {
                v.x = v.y = v.z = 0;
                v.w = 1;
                pool.unused_vector4.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是vector4吗？");
        }
        static collect_vector4()
        {
            pool.unused_vector4.length = 0;//清除未使用的vector 池子
        }

        //for color
        private static _color_one: color;
        static get color_one(): color
        {
            if (pool._color_one == null)
            {
                pool._color_one = new color(1, 1, 1, 1);
            }
            return pool._color_one;
        }

        private static unused_color: color[] = [];
        static new_color(): color
        {
            if (pool.unused_color.length > 0)
                return pool.unused_color.pop();
            else
                return new color();
        }
        static delete_color(v: color): void
        {
            if (v == null) return;
            if (v instanceof color)
            {
                v.r = v.g = v.b = 0;
                v.a = 1;
                pool.unused_color.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是color吗？");
        }
        static collect_color()
        {
            pool.unused_color.length = 0;//清除未使用的vector 池子
        }

        //for vector3
        private static _vector3_up: vector3;
        static get vector3_up(): vector3
        {
            if (pool._vector3_up == null)
            {
                pool._vector3_up = new vector3(0, 1, 0);
            }
            return pool._vector3_up;
        }
        private static _vector3_right: vector3;
        static get vector3_right(): vector3
        {
            if (pool._vector3_right == null)
            {
                pool._vector3_right = new vector3(1, 0, 0);
            }
            return pool._vector3_right;
        }
        private static _vector3_forward: vector3;
        static get vector3_forward(): vector3
        {
            if (pool._vector3_forward == null)
            {
                pool._vector3_forward = new vector3(0, 0, 1);
            }
            return pool._vector3_forward;
        } n
        private static _vector3_zero: vector3;
        static get vector3_zero(): vector3
        {
            if (pool._vector3_zero == null)
            {
                pool._vector3_zero = new vector3(0, 0, 0);
            }
            return pool._vector3_zero;
        }
        private static _vector3_one: vector3;
        static get vector3_one(): vector3
        {
            if (pool._vector3_one == null)
            {
                pool._vector3_one = new vector3(1, 1, 1);
            }
            return pool._vector3_one;
        }

        private static unused_vector3: vector3[] = []
        static new_vector3(): vector3
        {
            if (pool.unused_vector3.length > 0)
            {
                let v = pool.unused_vector3.pop();
                return v;
            }
            else
                return new vector3();
        }
        static clone_vector3(src: vector3): vector3
        {
            if (pool.unused_vector3.length > 0)
            {
                var v = pool.unused_vector3.pop();
                v.x = src.x;
                v.y = src.y;
                v.z = src.z;
                return v;
            }
            else
                return new vector3(src.x, src.y, src.z);
        }
        static delete_vector3(v: vector3): void
        {
            if (v == null) return;
            if (v instanceof vector3)
            {
                v.x = v.y = v.z = 0;
                pool.unused_vector3.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是vector3吗？");
        }
        static collect_vector3()
        {
            pool.unused_vector3.length = 0;//清除未使用的vector 池子
        }

        //for vector2
        private static _vector2_up: vector2;
        static get vector2_up(): vector2
        {
            if (pool._vector2_up == null)
            {
                pool._vector2_up = new vector2(0, 1);
            }
            return pool._vector2_up;
        }
        private static _vector2_right: vector2;
        static get vector2_right(): vector2
        {
            if (pool._vector2_right == null)
            {
                pool._vector2_right = new vector2(1, 0);
            }
            return pool._vector2_right;
        }
        private static unused_vector2: vector2[] = []
        static new_vector2(): vector2
        {
            if (pool.unused_vector2.length > 0)
                return pool.unused_vector2.pop();
            else
                return new vector2();
        }
        static clone_vector2(src: vector2): vector2
        {
            if (pool.unused_vector2.length > 0)
            {
                var v = pool.unused_vector2.pop();
                v.x = src.x;
                v.y = src.y;

                return v;
            }
            else
                return new vector2(src.x, src.y);
        }
        static delete_vector2(v: vector2): void
        {
            if (v == null) return;
            if (v instanceof vector2)
            {
                v.x = v.y = 0;
                pool.unused_vector2.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是vector2吗？");
        }
        static delete_vector2Array(vs: vector2[]): void
        {
            for (let i = 0; i < vs.length; i++)
            {
                if (vs[i] != undefined)
                {
                    vs[i].x = vs[i].y = 0;
                    pool.unused_vector2.push(vs[i]);
                }
            }
            vs.length = 0;
        }
        static collect_vector2()
        {
            pool.unused_vector2.length = 0;//清除未使用的vector 池子
        }

        //for matrix3x2
        private static unused_matrix3x2: matrix3x2[] = []
        static new_matrix3x2(): matrix3x2
        {
            if (pool.unused_matrix3x2.length > 0)
                return pool.unused_matrix3x2.pop();
            else
                return new matrix3x2();
        }
        static clone_matrix3x2(src: matrix3x2): matrix3x2
        {
            var v: matrix3x2 = pool.new_matrix();
            for (var i = 0; i < 6; i++)
                v.rawData[i] = src.rawData[i];
            return v;
        }
        static delete_matrix3x2(v: matrix3x2): void
        {
            if (v == null) return;
            if (v instanceof matrix3x2)
            {
                v.rawData[0] = 1;
                v.rawData[1] = 0;
                v.rawData[2] = 0;
                v.rawData[3] = 0;
                v.rawData[4] = 1;
                v.rawData[5] = 0;
                pool.unused_matrix3x2.push(v);
            } else
            {
                console.error("kindding me?确定你要回收的是matrix3x2吗？");
            }
        }
        static collect_matrix3x2()
        {
            pool.unused_matrix3x2.length = 0;//清除未使用的池子
        }

        //for matrix
        private static unused_matrix: matrix[] = []
        static new_matrix(): matrix
        {
            if (pool.unused_matrix.length > 0)
                return pool.unused_matrix.pop();
            else
                return new matrix();
        }
        static clone_matrix(src: matrix): matrix
        {
            var v: matrix = pool.new_matrix();
            for (var i = 0; i < 16; i++)
                v.rawData[i] = src.rawData[i];
            return v;
        }
        static delete_matrix(v: matrix): void
        {
            if (v == null) return;
            if (v instanceof matrix)
            {
                v.rawData[0] = 1;
                v.rawData[1] = 0;
                v.rawData[2] = 0;
                v.rawData[3] = 0;

                v.rawData[4] = 0;
                v.rawData[5] = 1;
                v.rawData[6] = 0;
                v.rawData[7] = 0;

                v.rawData[8] = 0;
                v.rawData[9] = 0;
                v.rawData[10] = 1;
                v.rawData[11] = 0;

                v.rawData[12] = 0;
                v.rawData[13] = 0;
                v.rawData[14] = 0;
                v.rawData[15] = 1;
                pool.unused_matrix.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是matrix吗？");
        }
        static collect_matrix()
        {
            pool.unused_matrix.length = 0;//清除未使用的池子
        }

        //for quaternion
        private static unused_quaternion: quaternion[] = []
        static new_quaternion(): quaternion
        {
            if (pool.unused_quaternion.length > 0)
                return pool.unused_quaternion.pop();
            else
                return new quaternion();
        }
        static clone_quaternion(src: quaternion): quaternion
        {
            if (pool.unused_quaternion.length > 0)
            {
                var v = pool.unused_quaternion.pop();
                v.x = src.x;
                v.y = src.y;
                v.z = src.z;
                v.w = src.w;
                return v;
            }
            else
                return new quaternion(src.x, src.y, src.z, src.w);
        }
        static delete_quaternion(v: quaternion): void
        {
            if (v == null) return;
            if (v instanceof quaternion)
            {
                v.x = v.y = v.z = 0;
                v.w = 1;
                pool.unused_quaternion.push(v);
            }
            else
                console.error("kindding me?确定你要回收的是quaternion吗？");
        }
        static collect_quaternion()
        {
            pool.unused_quaternion.length = 0;//清除未使用的池子
        }
    }
}