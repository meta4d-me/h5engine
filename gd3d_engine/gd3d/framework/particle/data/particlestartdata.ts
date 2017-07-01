namespace gd3d.framework
{
    /**
    * 粒子初始方向类型
    */
    export enum ParticleSystemShape 
    {
        NORMAL,
        BOX,
        SPHERE,
        HEMISPHERE,
        CONE,
        EDGE,
        CIRCLE
    }

    /**
     *  粒子初始数据
     */
    export class ParticleStartData 
    {

        public shapeType: ParticleSystemShape = ParticleSystemShape.NORMAL;

        private _position: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);
        public set position(_pos: gd3d.math.vector3) 
        {
            // this._position = gd3d.math.pool.clone_vector3(_pos);
            gd3d.math.vec3Clone(_pos, this._position);
        }

        public get position() 
        {
            return this._position;
        }

        private _direction: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public set direction(_dir: gd3d.math.vector3)
        {
            // this._direction = gd3d.math.pool.clone_vector3(_dir);
            gd3d.math.vec3Clone(_dir,this._direction);
        }

        public get direction()
        {
            return this._direction;
        }

        private _width: number = 0;
        public set width(_w: number)
        {
            this._width = _w;
        }

        public get width()
        {
            return this._width;
        }


        private _height: number = 0;
        public set height(_h: number) 
        {
            this._height = _h;
        }

        public get height()
        {
            return this._height;
        }

        public depth: number = 0;

        private _radius: number = 0;
        public set radius(_r: number) 
        {
            this._radius = _r;
        }

        public get radius() 
        {
            return this._radius;
        }

        private _angle: number = 0;
        public set angle(_a: number) 
        {
            this._angle = _a;
        }

        public get angle()
        {
            return this._angle;
        }

        public emitFrom:emitfromenum=emitfromenum.base;
        public randomPosition: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 0);

        private _randomDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get randomDirection(): gd3d.math.vector3
        {
            switch (this.shapeType)
            {
                case ParticleSystemShape.BOX:
                    math.vec3Clone(this.boxDirection, this._randomDirection);
                    break;
                case ParticleSystemShape.SPHERE:
                    math.vec3Clone(this.sphereDirection, this._randomDirection);
                    break;
                case ParticleSystemShape.HEMISPHERE:
                    math.vec3Clone(this.hemisphereDirection, this._randomDirection);
                    break;
                case ParticleSystemShape.CONE:
                    math.vec3Clone(this.coneDirection, this._randomDirection);
                    break;
                case ParticleSystemShape.CIRCLE:
                    math.vec3Clone(this.circleDirection, this._randomDirection);
                    break;
                case ParticleSystemShape.EDGE:
                    math.vec3Clone(this.edgeDirection, this._randomDirection);
                    break;
                default:
                    math.vec3Clone(this.direction, this._randomDirection);
                    break;
            }
            math.vec3Normalize(this._randomDirection, this._randomDirection);
            return this._randomDirection;
        }
        private _boxDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get boxDirection(): gd3d.math.vector3
        {
            let boxpos = new gd3d.math.vector3(0, 0, 0);
            boxpos.x = ValueData.RandomRange(-this.width / 2, this.width / 2);
            boxpos.y = ValueData.RandomRange(-this.height / 2, this.height / 2);
            boxpos.z = ValueData.RandomRange(-this.depth / 2, this.depth / 2);

            let length = math.vec3Length(boxpos);

            //EffectUtil.RotateVector3(boxpos, this.direction, boxpos);

            gd3d.math.vec3Normalize(boxpos,this.direction);
            this.getRandomPosition(boxpos, length);
            return this.direction;
        }


        private _sphereDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get sphereDirection(): gd3d.math.vector3
        {
            let _radius = ValueData.RandomRange(0, this.radius);

            let θ = ValueData.RandomRange(0, Math.PI);
            let φ = ValueData.RandomRange(-Math.PI, Math.PI);
            this._sphereDirection.x = _radius * Math.sin(θ) * Math.cos(φ);
            this._sphereDirection.y = _radius * Math.sin(θ) * Math.sin(φ);
            this._sphereDirection.z = _radius * Math.cos(θ);

            math.vec3Normalize(this._sphereDirection, this._sphereDirection);
            //gd3d.framework.EffectUtil.RotateVector3(this._sphereDirection, this.direction, this._sphereDirection);
            this.getRandomPosition(this._sphereDirection, _radius);
            return this._sphereDirection;
        }


        private _hemisphereDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get hemisphereDirection(): gd3d.math.vector3
        {

            let _radius = ValueData.RandomRange(0, this.radius);

            let θ = ValueData.RandomRange(0, Math.PI/2);
            let φ = ValueData.RandomRange(-Math.PI, Math.PI);

            this._hemisphereDirection.z = _radius * Math.cos(θ);
            this._hemisphereDirection.y = _radius * Math.sin(θ) * Math.sin(φ);
            this._hemisphereDirection.x = _radius * Math.sin(θ)*Math.cos(φ);

            math.vec3Normalize(this._hemisphereDirection, this._hemisphereDirection);
            EffectUtil.RotateVector3(this._hemisphereDirection, this.direction, this._hemisphereDirection);

            this.getRandomPosition(this._hemisphereDirection, _radius);
            return this._hemisphereDirection;
        }

        //private bottomRidus: number = 1000;

        private _coneDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get coneDirection(): gd3d.math.vector3
        {

            var randomAngle=Math.random()*Math.PI*2;//弧度
            var randomHeight=Math.random()*this.height;
            var upradius=randomHeight*Math.tan(this.angle*Math.PI/180)+this.radius;
            var radomRadius=Math.random()*upradius;

            var bottompos=gd3d.math.pool.new_vector3();
            bottompos.x=this.radius*Math.cos(randomAngle);
            bottompos.y=0;
            bottompos.z=this.radius*Math.sin(randomAngle);

            if(this.emitFrom==emitfromenum.base)
            {
               gd3d.math.vec3Clone(bottompos,this.randomPosition);
            }
            else if(this.emitFrom==emitfromenum.volume)
            {
                
                this.randomPosition.x=radomRadius*Math.cos(randomAngle);
                this.randomPosition.z=radomRadius*Math.sin(randomAngle);
                this.randomPosition.y=randomHeight;
            }
            this._coneDirection.x=Math.cos(randomAngle)*Math.sin(this.angle*Math.PI/180);
            this._coneDirection.z=Math.sin(randomAngle)*Math.sin(this.angle*Math.PI/180);
            this._coneDirection.y=Math.cos(this.angle*Math.PI/180);
            return this._coneDirection;
        }

        private _circleDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 0, 1);
        public get circleDirection(): gd3d.math.vector3
        {
            let _arc = this.angle * (Math.PI / 180);
            let a = ValueData.RandomRange(-_arc / 2, _arc / 2);
            let _radius = ValueData.RandomRange(0, this.radius);
            this._circleDirection.x = _radius * Math.cos(a);
            this._circleDirection.z = _radius * Math.sin(a);
            this._circleDirection.y = 0;

            let length = math.vec3Length(this._circleDirection);

            math.vec3Normalize(this._circleDirection, this._circleDirection);
            EffectUtil.RotateVector3(this._circleDirection, this.direction, this._circleDirection);

            this.getRandomPosition(this._circleDirection, length);
            return this._circleDirection;
        }


        private _edgeDirection: gd3d.math.vector3 = new gd3d.math.vector3(0, 1, 0);
        public get edgeDirection()
        {

            let edgePos = new gd3d.math.vector3(0, 0, 0);
            edgePos.y += ValueData.RandomRange(-this.radius / 2, this.radius / 2);

            let lenght = math.vec3Length(edgePos);
            EffectUtil.RotateVector3(edgePos, this.direction, edgePos);
            math.vec3Clone(this.direction, this._edgeDirection);
            this.getRandomPosition(edgePos, length);

            return this._edgeDirection;
        }

        constructor()
        {
            //math.vec3Normalize(this.direction, this.direction);
        }

        private getRandomPosition(dir: gd3d.math.vector3, length: number)
        {
            math.vec3ScaleByNum(dir, length, dir);
            this.randomPosition.x = dir.x;
            this.randomPosition.y = dir.y;
            this.randomPosition.z = dir.z;
        }
        clone()
        {
            let data = new ParticleStartData();
            data.shapeType = this.shapeType;
            data._position = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._position, data._position);

            data._direction = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._direction, data._direction);
            data._width = this._width;
            //data._bottomRadius = this._bottomRadius;

            data._height = this._height;

            data.depth = this.depth;
            data._radius = this._radius;

            data._angle = this._angle;

            data._randomDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._randomDirection, data._randomDirection);

            data.randomPosition = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this.randomPosition, data.randomPosition);

            data._boxDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._boxDirection, data._boxDirection);

            data._sphereDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._sphereDirection, data._sphereDirection);


            data._hemisphereDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._hemisphereDirection, data._hemisphereDirection);

            //data.bottomRidus = this.bottomRidus;

            data._coneDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._coneDirection, data._coneDirection);


            data._circleDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._circleDirection, data._circleDirection);

            data._edgeDirection = new gd3d.math.vector3();
            gd3d.math.vec3Clone(this._edgeDirection, data._edgeDirection);
            return data;
        }
    }
    export enum emitfromenum
    {
        base,
        volume
    }
}

