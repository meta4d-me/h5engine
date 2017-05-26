namespace gd3d.framework
{
    export interface IEffectAction
    {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement);
        update(frameIndex: number);
    }

    export class LinearAction implements IEffectAction
    {
        public type: string;
        public params: any;
        public startFrame: number;
        public endFrame: number;
        public elements: EffectElement;
        attriname: string;
        attrival: any;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
            if (this.params != undefined)
            {
                this.attriname = this.params["name"];
                switch (this.attriname)
                {
                    case "pos":
                    case "scale":
                    case "euler":
                    case "color":
                        this.attrival = EffectUtil.parseEffectVec3(this.params["value"]);
                        break;
                    case "uv":
                        this.attrival = EffectUtil.parseEffectUVSpeed(this.params["value"]);
                        break;
                    case "alpha":
                        this.attrival = this.params["value"];
                        break;
                }
            }
        }

        update(frameIndex: number)
        {
            if (this.startFrame > frameIndex || this.endFrame < frameIndex) return;
            let baseValue = this.elements.curAttrData;
            switch (this.attriname)
            {
                case "pos":
                    baseValue.pos.x = baseValue.pos.x + this.attrival.x.getValue();
                    baseValue.pos.y = baseValue.pos.y + this.attrival.y.getValue();
                    baseValue.pos.z = baseValue.pos.z + this.attrival.z.getValue();
                    break;
                case "scale":
                    baseValue.scale.x = baseValue.scale.x + this.attrival.x.getValue();
                    baseValue.scale.y = baseValue.scale.y + this.attrival.y.getValue();
                    baseValue.scale.z = baseValue.scale.z + this.attrival.z.getValue();
                    break;
                case "euler":
                    baseValue.euler.x = baseValue.euler.x + this.attrival.x.getValue();
                    baseValue.euler.y = baseValue.euler.y + this.attrival.y.getValue();
                    baseValue.euler.z = baseValue.euler.z + this.attrival.z.getValue();
                    break;
                case "color":
                    baseValue.color.x = baseValue.color.x + this.attrival.x.getValue();
                    baseValue.color.y = baseValue.color.y + this.attrival.y.getValue();
                    baseValue.color.z = baseValue.color.z + this.attrival.z.getValue();
                    break;
                case "uv":
                    baseValue.uv.x = baseValue.uv.x + this.attrival.u.getValue();
                    baseValue.uv.y = baseValue.uv.y + this.attrival.v.getValue();
                    break;
                case "alpha":
                    baseValue.alpha = baseValue.alpha + this.attrival;
                    console.log("alpha: " + baseValue.alpha);
                    break;
            }
        }
    }

    export class DestroyAction implements IEffectAction
    {
        public type: string;
        public params: any;
        public startFrame: number;
        public endFrame: number;
        public elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
        }

        update(frameIndex: number)
        {
            if (frameIndex >= this.startFrame)
            {
                this.elements.setActive(false);
            }
        }
    }

    export class LoopAction implements IEffectAction
    {
        public type: string;
        public params: any;
        public startFrame: number;
        public endFrame: number;
        public elements: EffectElement;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
        }

        update(frameIndex: number)
        {
            if (frameIndex == this.startFrame)
            {
                this.elements.loopFrame = this.startFrame + 1;
                this.elements.curAttrData = this.elements.data.initFrameData.attrsData.clone();
            }
        }
    }
    export class UVRollAction implements IEffectAction
    {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;

        speedu:number = 0;
        speedv:number = 0;
        startu:number = 0;
        startv:number = 0;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
            if (this.params["speedu"] != undefined)
            {
                this.speedu = <number>this.params["speedu"];
            }
            if (this.params["speedv"] != undefined)
            {
                this.speedv = <number>this.params["speedv"];
            }
            if (this.params["startu"] != undefined)
            {
                this.startu = <number>this.params["startu"];
            }
            if (this.params["startv"] != undefined)
            {
                this.startv = <number>this.params["startv"];
            }
        }
        
        update(frameIndex: number)
        {
            if (this.startFrame > frameIndex || this.endFrame < frameIndex) return;
            if(this.startFrame == frameIndex)
            {
                //init
                this.elements.curAttrData.uv.x = this.startu;
                this.elements.curAttrData.uv.y = this.startv;
                return;
            }
            this.elements.curAttrData.uv.x += this.speedu;
            this.elements.curAttrData.uv.y += this.speedv;
        }
    }
    export class UVSpriteAnimationAction implements IEffectAction
    {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        /**
         * 控制播放速度
         * 
         * @type {number}
         * @memberof UISpriteAnimation
         */
        fps: number = 30;
        /**
         * 行
         * 
         * @type {number}
         * @memberof UISpriteAnimation
         */
        row: number = 1;
        /**
         * 列
         * 
         * @type {number}
         * @memberof UISpriteAnimation
         */
        colum: number = 1;
        private frameInternal: number = 1;
        private spriteIndex: number = 0;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
            if (this.params["fps"] != undefined)
            {
                this.fps = <number>this.params["fps"];
                this.frameInternal = effectSystem.fps / this.fps;
            }
            if (this.params["row"] != undefined)
            {
                this.row = <number>this.params["row"];
            }
            if (this.params["colum"] != undefined)
            {
                this.colum = <number>this.params["colum"];
            }
        }
        update(frameIndex: number)
        {
            if (this.startFrame > frameIndex || this.endFrame < frameIndex) return;
            if ((frameIndex - this.startFrame) % this.frameInternal == 0)
            {
                this.spriteIndex = (frameIndex - this.startFrame) / this.frameInternal;
                this.spriteIndex %= (this.colum * this.row);
                this.elements.curAttrData.uv.x = (this.spriteIndex % this.colum) / this.colum;
                this.elements.curAttrData.uv.y = Math.floor((this.spriteIndex / this.colum)) / this.row;
                this.elements.curAttrData.tilling.x = this.colum;
                this.elements.curAttrData.tilling.y = this.row;
            }
        }
    }
    export class RotationAction implements IEffectAction
    {
        public type: string;
        public params: any;
        public startFrame: number;
        public endFrame: number;
        public elements: EffectElement;
        public velocity: any;
        public frameInternal: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;
            if (this.params["velocity"] != undefined)
            {
                this.velocity = EffectUtil.parseEffectVec3(this.params["velocity"]);
            }

            this.frameInternal = 1 / effectSystem.fps;
        }

        update(frameIndex: number)
        {
            // // if (this.startFrame > frameIndex || this.endFrame < frameIndex) 
            this.elements.curAttrData.euler.z = this.elements.curAttrData.euler.z + (this.velocity.z.getValue()) * this.frameInternal;

            if (this.elements.curAttrData.renderModel == RenderModel.None)
            {
                this.elements.curAttrData.euler.x = this.elements.curAttrData.euler.x + (this.velocity.x.getValue()) * this.frameInternal;
                this.elements.curAttrData.euler.y = this.elements.curAttrData.euler.y + (this.velocity.y.getValue()) * this.frameInternal;
            }


            // let rotationX = gd3d.math.pool.new_quaternion();
            // gd3d.math.quatFromAxisAngle(this.elements.curAttrData.localAxisX, this.elements.curAttrData.euler.x, rotationX);

            // let rotationY = gd3d.math.pool.new_quaternion();
            // gd3d.math.quatFromAxisAngle(this.elements.curAttrData.localAxisY, this.elements.curAttrData.euler.y, rotationY);

            // let rotationZ = gd3d.math.pool.new_quaternion();
            // gd3d.math.quatFromAxisAngle(this.elements.curAttrData.localAxisZ, this.elements.curAttrData.euler.z, rotationZ);

            // gd3d.math.quatMultiply(this.elements.curAttrData.rotationByEuler,rotationZ,this.elements.curAttrData.rotationByEuler);

        }
    }
    export class BreathAction implements IEffectAction
    {
        type: string;
        params: any;
        startFrame: number;
        endFrame: number;
        elements: EffectElement;
        attriname: string;
        startvalue: any;
        targetvalue: any;
        loopframe: number;
        halfloopframe: number;
        init(_startFrame: number, _endFrame: number, _params: any, _elements: EffectElement)
        {
            this.startFrame = _startFrame;
            this.endFrame = _endFrame;
            this.params = _params;
            this.elements = _elements;

            if (this.params != undefined)
            {
                this.attriname = this.params["name"];
                this.loopframe = this.params["loopframe"];
                this.halfloopframe = this.loopframe / 2;
                this.curTargetFrame = this.startFrame + this.halfloopframe;
                switch (this.attriname)
                {
                    case "pos":
                    case "scale":
                    case "euler":
                    case "color":
                        this.startvalue = EffectUtil.parseEffectVec3(this.params["startvalue"]).getValue();
                        this.targetvalue = EffectUtil.parseEffectVec3(this.params["targetvalue"]).getValue();
                        break;
                    case "uv":
                        this.startvalue = EffectUtil.parseEffectUVSpeed(this.params["startvalue"]).getValue();
                        this.targetvalue = EffectUtil.parseEffectUVSpeed(this.params["targetvalue"]).getValue();
                        break;
                    case "alpha":
                        this.startvalue = this.params["startvalue"];
                        this.targetvalue = this.params["targetvalue"];
                        break;
                }
            }
        }
        curTargetFrame: number;
        update(frameIndex: number)
        {
            if (this.startFrame > frameIndex) return;//这里只限制起始
            if (frameIndex >= this.curTargetFrame)
            {
                this.swap();
                this.curTargetFrame += this.halfloopframe;
            }
            let baseValue = this.elements.curAttrData;
            switch (this.attriname)
            {
                case "pos":
                    baseValue.pos = this.getLerpValue(frameIndex);
                    break;
                case "scale":
                    baseValue.scale = this.getLerpValue(frameIndex);
                    break;
                case "euler":
                    baseValue.euler = this.getLerpValue(frameIndex);
                    break;
                case "color":
                    baseValue.color = this.getLerpValue(frameIndex);
                    break;
                case "uv":
                    baseValue.uv = this.getLerpValue(frameIndex);
                    break;
                case "alpha":
                    baseValue.alpha = this.getLerpValue(frameIndex);
                    break;
            }
        }
        swap()
        {
            let temp;
            if (this.startvalue instanceof gd3d.math.vector3)
            {
                temp = gd3d.math.pool.clone_vector3(this.startvalue);
                this.startvalue = gd3d.math.pool.clone_vector3(this.targetvalue);
                this.targetvalue = temp;
            }
            else if (this.startvalue instanceof gd3d.math.vector2)
            {
                temp = gd3d.math.pool.clone_vector2(this.startvalue);
                this.startvalue = gd3d.math.pool.clone_vector2(this.targetvalue);
                this.targetvalue = temp;
            }
            else
            {
                temp = this.startvalue;
                this.startvalue = this.targetvalue;
                this.targetvalue = temp;
            }
        }
        getLerpValue(frameIndex: number): any
        {
            let curframe = (frameIndex - this.startFrame) % this.halfloopframe;
            let outVal;
            if (this.startvalue instanceof gd3d.math.vector3)
            {
                outVal = new gd3d.math.vector3();
                gd3d.math.vec3SLerp(this.startvalue, this.targetvalue, curframe / this.halfloopframe, outVal);
            }
            else if (this.startvalue instanceof gd3d.math.vector2)
            {
                outVal = new gd3d.math.vector2();
                gd3d.math.vec2SLerp(this.startvalue, this.targetvalue, curframe / this.halfloopframe, outVal);
            }
            else
            {
                outVal = gd3d.math.numberLerp(this.startvalue, this.targetvalue, curframe / this.halfloopframe);
            }
            return outVal;
        }
    }
}