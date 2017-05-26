namespace gd3d.framework
{
    export class TrailSection
    {
        public point: gd3d.math.vector3;
        public upDir: gd3d.math.vector3;
        public time: number;

        constructor(p: gd3d.math.vector3 = new gd3d.math.vector3(), t: number = 0)
        {
            this.point = p;
            this.time = t;
        }
    }
    export class Color {

        a: number;

        r: number;

        g: number;

        b: number;

        static white(): Color
        {
            return new Color(1,1,1,1);
        }

        static black(): Color
        {
            return new Color(0, 0, 0, 1);
        }

        static red(): Color
        {
            return new Color(1,0,0,1);
        }

        static green(): Color
        {
            return new Color(0,1,0,1);
        }

        static blue(): Color
        {
            return new Color(0,0,1,1);
        }
        constructor(r?: number, g?: number, b?: number, a?: number)
        {
            this.a = a;
            this.r = r;
            this.g = g;
            this.b = b;
        }

        //getColor(colorFormat?: number): number;
    }
    export class Trail
    {
        public obj: gd3d.math.vector3;
        //拖尾大小
        public height: number = 200.0;
        //当前拖尾时间长度
        public time: number = 2.0;
        //最小拖尾距离
        public minDistance: number = 0.1;
        //时间变化速度
        public timeTransitionSpeed: number = 1;
        //最终期望拖尾时间长度
        public desiredTime: number = 2.0;
        public startColor: Color = Color.white();
        public endColor: Color = new Color(1, 1, 1, 0);
        //是否为世界坐标上方
        public alwaysUp: boolean = false;

        position: gd3d.math.vector3;
        now: number = 0;
        currentSection: TrailSection;
        //localSpaceTransform: Matrix4_4;

        private mesh: gd3d.framework.mesh;
        //private trailMaterial: MaterialBase;

        private sections: Array<TrailSection> = new Array<TrailSection>();

        //默认的顶点数量上限
        private _defaultcount: number = 256;

        private _maxvercount: number = 0;
        private _vercount: number = 0;
        private _indexcount: number = 0;
        public set maxvercount(value: number)
        {
            //if (this._maxvercount > value) return;
            //this._maxvercount = value;

            //this.mesh.geometry.sharedVertexBuffer = null;
            //this.mesh.geometry.sharedIndexBuffer = null;

            //this.mesh.geometry.vertexArray = new Float32Array(15 * this._maxvercount);
            //this.mesh.geometry.indexArray = new Uint16Array(3 * this._maxvercount);
            //this.mesh.geometry.upload(Egret3DCanvas.context3DProxy, Context3DProxy.gl.DYNAMIC_DRAW);

            //this.mesh.geometry.vertexArray = null;
            //this.mesh.geometry.indexArray = null;
        }
        public get maxvercount(): number
        {
            return this._maxvercount;
        }
        constructor(_obj: gd3d.math.vector3, _mesh: mesh)
        {
            //this.obj = _obj;
            //this.mesh = _mesh;
            //this.mesh.geometry.vertexFormat = VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0;
            //this.mesh.geometry.vertexCount = 0;
            //this.mesh.geometry.indexCount = 0;
            //this.mesh.geometry.drawType = Context3DProxy.gl.DYNAMIC_DRAW;

            //this.maxvercount = this._defaultcount;
        }

        //计算顶点上限
        private caclMaxVercount(_curcount: number)
        {
            if (this.maxvercount < _curcount)
            {
                this.maxvercount = this.maxvercount * 2;
                this.caclMaxVercount(_curcount);
            }
        }

        public startTrail(timeToTweenTo: number, fadeInTime: number)
        {
            this.desiredTime = timeToTweenTo;
            if (this.time != this.desiredTime)
            {
                this.timeTransitionSpeed = Math.abs(this.desiredTime - this.time) / fadeInTime;
            }
            if (this.time <= 0)
            {
                this.time = 0.01;
            }
        }

        //设置拖尾时间
        public setTime(trailTime: number, timeToTweenTo: number, tweenSpeed: number)
        {
            this.time = trailTime;
            this.desiredTime = timeToTweenTo;
            this.timeTransitionSpeed = tweenSpeed;
            if (this.time <= 0)
            {
                //this.dispose();
            }
        }

        //关闭拖尾 fadeTime淡出时间
        public fadeOut(fadeTime: number)
        {
            this.desiredTime = 0;
            if (this.time > 0)
            {
                this.timeTransitionSpeed = this.time / fadeTime;
            }
        }

        public Itterate(itterateTime: number)
        {
            //this.position = this.obj.globalPosition;
            //this.now = itterateTime;

            //if (this.sections.length == 0 || (this.sections[0].point.subtract(this.position)).lengthSquared > this.minDistance * this.minDistance)
            //{
            //    var section: TrailSection = new TrailSection();
            //    section.point.copyFrom(this.position);
            //    if (this.alwaysUp)
            //        section.upDir = Vector3D.Y_AXIS;
            //    else
            //        section.upDir = this.obj.globalOrientation.transformVector(Vector3D.Y_AXIS);

            //    section.time = this.now;
            //    this.sections.unshift(section);

            //}
        }

        public updateTrail(currentTime: number, deltaTime: number)
        {
            if (this.time > this.desiredTime)
            {
                this.time -= deltaTime * this.timeTransitionSpeed;
                if (this.time <= this.desiredTime) this.time = this.desiredTime;
            }
            else if (this.time < this.desiredTime)
            {
                this.time += deltaTime * this.timeTransitionSpeed;
                if (this.time >= this.desiredTime) this.time = this.desiredTime;
            }
            console.log(this.time);
            this._vercount = 0;
            this._indexcount = 0;
            while (this.sections.length > 0 && currentTime > this.sections[this.sections.length - 1].time + this.time)
            {
                this.sections.splice(this.sections.length - 1);
            }

            this.caclMaxVercount(this.sections.length * 2);
            if (this.sections.length < 2) return;

            //this.localSpaceTransform = this.obj.localMatrix;
            for (var i = 0; i < this.sections.length; i++)
            {
                this.currentSection = this.sections[i];
                var u: number = 0.0;
                if (i != 0)
                    u = gd3d.math.floatClamp((currentTime - this.currentSection.time) / this.time, 0, 1);

                //var upDir: Vector3D = new Vector3D();
                //var domDir: Vector3D = new Vector3D();
                //upDir.copyFrom(this.currentSection.upDir);
                //domDir.copyFrom(this.currentSection.upDir);

                //domDir.scaleBy(-1 * this.height / 2);
                //var v1 = this.currentSection.point.add(domDir);//this.localSpaceTransform.transformVector(this.currentSection.point);
                //upDir.scaleBy(this.height / 2);
                //var v2 = this.currentSection.point.add(upDir);//this.localSpaceTransform.transformVector(this.currentSection.point.add(upDir));

                //var uv1 = new Vector3D(u, 0);
                //var uv2 = new Vector3D(u, 1);

                //var interpolatedColor = new Color();
                //interpolatedColor.lerp(this.startColor, this.endColor, u);
                //this.addVertice(v1, uv1, interpolatedColor);
                //this._vercount++;
                //this.addVertice(v2, uv2, interpolatedColor);
                //this._vercount++;
            }

            var triangles: Array<number> = new Array((this.sections.length - 1) * 2 * 3);
            for (var i = 0; i < triangles.length / 6; i++)
            {
                triangles[i * 6 + 0] = i * 2;
                triangles[i * 6 + 1] = i * 2 + 1;
                triangles[i * 6 + 2] = i * 2 + 2;

                triangles[i * 6 + 3] = i * 2 + 2;
                triangles[i * 6 + 4] = i * 2 + 1;
                triangles[i * 6 + 5] = i * 2 + 3;
            }
            this._indexcount = triangles.length;
            //this.mesh.geometry.sharedIndexBuffer.arrayBuffer = new Uint16Array(triangles);

            //this.mesh.geometry["_vertexCount"] = this._vercount;
            //this.mesh.geometry["_indexCount"] = this._indexcount;

            //this.mesh.geometry.bufferDiry = true;
            //if (this.mesh.geometry.subGeometrys.length != 0)
            //{
            //    this.mesh.geometry.subGeometrys[0].start = 0;
            //    this.mesh.geometry.subGeometrys[0].count = this._indexcount;
            //}

        }

        //private addVertice(vec: Vector3D, uv: Vector3D, color: Color)
        //{
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 0] = vec.x;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 1] = vec.y;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 2] = vec.z;

        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 3] = 0;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 4] = 0;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 5] = 1;

        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 6] = 1;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 7] = 0;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 8] = 0;

        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 9] = color.r;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 10] = color.g;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 11] = color.b;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 12] = color.a;

        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 13] = uv.x;
        //    this.mesh.geometry.sharedVertexBuffer.arrayBuffer[this._vercount * this.mesh.geometry.vertexAttLength + 14] = uv.y;
        //}

        //public dispose()
        //{
        //    this.desiredTime = 0;
        //    this.time = 0;
        //    if (this.mesh != null)
        //    {
        //        if (this.mesh.parent != null)
        //        {
        //            this.mesh.parent.removeChild(this.mesh);
        //        }
        //        this.mesh.dispose();
        //        this.sections.splice(0, this.sections.length);
        //    }
        //}
    }

}