/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework
{
    @reflect.nodeComponent
    export class aniplayer implements INodeComponent
    {
        gameObject: gameObject;
        // renders: skinnedMeshRenderer[];

        private _clipnameCount = 0;
        private _clipnames: { [key: string]: number } = null;
        get clipnames()
        {
            if (this._clipnames == null || this._clipnameCount != this.clips.length)
            {
                this._clipnameCount = this.clips.length;
                this._clipnames = {};
                for (let key in this.clips)
                {
                    this.clipnames[this.clips[key].getName()] = parseInt(key);
                }
            }
            return this._clipnames;
        }

        @reflect.Field("animationClip[]")
        clips: animationClip[];

        @reflect.Field("boolean")
        public autoplay: boolean = true;
        private playIndex: number = 0;
        private _playClip: animationClip = null;

        @reflect.Field("tPoseInfo[]")
        bones: tPoseInfo[];

        @reflect.Field("PoseBoneMatrix[]")
        startPos: PoseBoneMatrix[];

        tpose: { [key: string]: PoseBoneMatrix } = {};
        nowpose: { [key: string]: PoseBoneMatrix } = {};
        lerppose: { [key: string]: PoseBoneMatrix } = {};

        carelist: { [id: string]: transform } = {};

        private _playFrameid: number = 0;
        public _playTimer: number = 0;
        speed: number = 1.0;
        crossdelta: number = 0;
        crossspeed: number = 0;

        private beRevert: boolean = false;
        private playStyle: PlayStyle = PlayStyle.NormalPlay;
        private percent: number = 0;


        private init()
        {
            for (let i = 0; i < this.bones.length; i++)
            {
                let _info = this.bones[i];
                let name = _info.name;
                var nb = new PoseBoneMatrix();
                nb.r = _info.tposeq;
                nb.t = _info.tposep;
                nb.invert();

                this.tpose[name] = nb;
                this.nowpose[name] = this.startPos[i].Clone();
            }

            let asbones: asbone[] = this.gameObject.getComponentsInChildren("asbone") as asbone[];
            for (let key in asbones)
            {
                this.care(asbones[key].gameObject.transform);
            }

            if (this.autoplay && this.clips != null)
            {
                this.playByIndex(this.playIndex);
            }

        }

        start()
        {
            if (this.bones != null)
            {
                this.init();
            }
        }
        update(delta: number)
        {
            if (this._playClip == null)
                return;

            this.checkFrameId(delta);

            var mix = false;
            if (this.crossdelta > 0)
            {
                this.crossdelta -= delta / this.speed * this.crossspeed;
                mix = true;
            }

            for (var i = 0; i < this._playClip.boneCount; i++)
            {
                var bone = this._playClip.bones[i];
                //nbone next boneinfo
                //

                var next = this._playClip.frames[this._playFrameid].boneInfos[i];
                var outb = this.nowpose[bone];
                var tpose = this.tpose[bone];
                if (outb != undefined)
                {
                    if (mix)
                    {
                        var last = this.lerppose[bone];
                        if (last != undefined)
                        {
                            //把恶心的计算集中提纯到一起去，有空再修改
                            outb.lerpInWorld(tpose, last, next, 1 - this.crossdelta);
                        }
                        else
                        {
                            outb.copyFrom(next);
                        }
                    }
                    else
                    {
                        outb.copyFrom(next);
                    }
                }



                //else//动画里有player我没有的骨骼
                //{//这就需要单独分离出来那些cpu 做tpose处理的骨骼
                //    //if (this.tpose[bone] != undefined)
                //    //{
                //    //    var tb
                //    //    this.nowpose[bone] = FreeNode.PoseBoneMatrix.sMultiply(this.tpose[bone], next);
                //    //    if (mix)
                //    //    {
                //    //        this.lerppose[bone] = this.nowpose[bone].Clone();
                //    //    }
                //    //}
                //}


                var careobj = this.carelist[bone];
                if (careobj != undefined)
                {
                    //tbone ,一串算出最终坐标
                    //把恶心的计算集中提纯到一起去，有空再修改

                    let fmat = PoseBoneMatrix.sMultiply(outb, tpose);

                    let _matrix: math.matrix = math.pool.new_matrix();
                    math.matrixMakeTransformRTS(fmat.t, math.pool.vector3_one, fmat.r, _matrix);

                    let _newmatrix: math.matrix = math.pool.new_matrix();
                    math.matrixMultiply(this.gameObject.transform.getWorldMatrix(), _matrix, _newmatrix);

                    careobj.setWorldMatrix(_newmatrix);
                    careobj.updateTran(false);
                    math.pool.delete_matrix(_matrix);
                    math.pool.delete_matrix(_newmatrix);
                }
            }
        }

        /**
         * 根据动画片段索引播放普通动画
         * @param animIndex 动画片段索引
         * @param speed 播放速度
         * @param beRevert 是否倒播
         */
        playByIndex(animIndex: number, speed: number = 1.0, beRevert: boolean = false)
        {
            this.playIndex = animIndex;
            if (this.clips.length <= animIndex)
            {
                console.error("animIndex out Array of clips");
                return;
            }
            this.playAniamtion(animIndex.toString(), speed, beRevert);
            this.crossdelta = 0;
        }

        /**
         * 根据动画片段索引播放动画
         * @param animIndex 动画片段索引
         * @param speed 播放速度
         * @param beRevert 是否倒播
         */
        playCrossByIndex(animIndex: number, crosstimer: number, speed: number = 1.0, beRevert: boolean = false)
        {
            this.playIndex = animIndex;
            if (this.clips.length <= animIndex)
            {
                console.error("animIndex out Array of clips");
                return;
            }
            this.playAniamtion(animIndex.toString(), speed, beRevert);
            this.crossspeed = 1.0 / crosstimer;
            this.crossdelta = 1;
        }

        play(animName: string, speed: number = 1.0, beRevert: boolean = false)
        {
            if (this.clipnames[animName] == null)
            {
                console.error("animclip " + this.gameObject.transform.name + "  " + animName + " is not exist");
                return;
            }
            this.playByIndex(this.clipnames[animName], speed, beRevert);
        }

        playCross(animName: string, crosstimer: number, speed: number = 1.0, beRevert: boolean = false)
        {
            if (this.clipnames[animName] == null)
            {
                console.error("animclip " + this.gameObject.transform.name + "  " + animName + " is not exist");
                return;
            }
            if (crosstimer <= 0)
            {
                this.playByIndex(this.clipnames[animName], speed, beRevert);
            }
            else
            {
                this.playCrossByIndex(this.clipnames[animName], crosstimer, speed, beRevert);
            }
        }

        private playAniamtion(index: string, speed: number = 1.0, beRevert: boolean = false)
        {
            if (this.clips[index] == undefined) return;

            this._playClip = this.clips[index];
            this._playTimer = 0;
            this._playFrameid = 0;
            this.speed = speed;

            this.beRevert = beRevert;
            this.playStyle = PlayStyle.NormalPlay;

            this.speed = speed;
            this.lerppose = {};
            for (var key in this.nowpose)
            {
                var src = this.nowpose[key];
                this.lerppose[key] = src.Clone();
            }
        }

        stop(): void
        {
            this._playClip = null;
        }

        isPlay(): boolean
        {
            return this._playClip != null;
        }

        isStop(): boolean
        {
            if (this._playClip == null) return false;
            if (this.playStyle != PlayStyle.NormalPlay) return false;
            if (this._playClip.loop) return false;
            if (this._playFrameid == this._playClip.frameCount - 1)
                return true;
            return false;
        }

        remove()
        {

        }
        clone()
        {

        }
        private finishCallBack: Function;
        private thisObject: any;
        public addFinishedEventListener(finishCallBack: Function, thisObject: any): void
        {
            this.finishCallBack = finishCallBack;
            this.thisObject = thisObject;
        }

        private checkFrameId(delay: number): void 
        {
            if (this.playStyle == PlayStyle.NormalPlay)
            {
                this._playTimer += delay * this.speed;
                this._playFrameid = (this._playClip.fps * this._playTimer) | 0;
                if (this._playClip.loop)//加上循环与非循环动画的分别控制
                {
                    this._playFrameid %= this._playClip.frameCount;
                }
                else if (this._playFrameid > this._playClip.frameCount - 1)
                {
                    this._playFrameid = this._playClip.frameCount - 1;
                }
                if (this.beRevert)
                {
                    this._playFrameid = this._playClip.frameCount - this._playFrameid - 1;
                }

            } else if (this.playStyle == PlayStyle.FramePlay)
            {
                //使用传进来的百分比计算当前播放帧
                this._playFrameid = (this._playClip.frameCount * this.percent) - 1;
                this._playFrameid = Math.round(this._playFrameid);
            }
            if (this._playFrameid < 0)
            {
                this._playFrameid = 0;
            }
            if (this._playFrameid > this._playClip.frameCount - 1)
            {
                this._playFrameid = this._playClip.frameCount - 1;
            }
            if (this.isStop())
            {
                if (this.finishCallBack)
                {
                    this.finishCallBack(this.thisObject);
                    this.finishCallBack = null;
                }
            }
        }

        fillPoseData(data: Float32Array, bones: transform[], efficient: boolean = true): void
        {
            var seek: number = 0;
            for (var i in bones)
            {
                var key: string = bones[i].name;
                var obj = this.nowpose[key];
                if (obj == undefined)
                {
                    if (efficient)
                    {
                        data[seek * 8 + 0] = 0;
                        data[seek * 8 + 1] = 0;
                        data[seek * 8 + 2] = 0;
                        data[seek * 8 + 3] = 1;
                        data[seek * 8 + 4] = 0;
                        data[seek * 8 + 5] = 0;
                        data[seek * 8 + 6] = 0;
                        data[seek * 8 + 7] = 1;
                    }
                    else
                    {
                        data[seek * 16 + 0] = 1;
                        data[seek * 16 + 1] = 0;
                        data[seek * 16 + 2] = 0;
                        data[seek * 16 + 3] = 0;
                        data[seek * 16 + 4] = 0;
                        data[seek * 16 + 5] = 1;
                        data[seek * 16 + 6] = 0;
                        data[seek * 16 + 7] = 0;
                        data[seek * 16 + 8] = 0;
                        data[seek * 16 + 9] = 0;
                        data[seek * 16 + 10] = 1;
                        data[seek * 16 + 11] = 0;
                        data[seek * 16 + 12] = 0;
                        data[seek * 16 + 13] = 0;
                        data[seek * 16 + 14] = 0;
                        data[seek * 16 + 15] = 1;
                    }
                }
                else
                {
                    let _mat = math.pool.new_matrix();
                    if (efficient)
                    {
                        data[seek * 8 + 0] = obj.r.x;
                        data[seek * 8 + 1] = obj.r.y;
                        data[seek * 8 + 2] = obj.r.z;
                        data[seek * 8 + 3] = obj.r.w;
                        data[seek * 8 + 4] = obj.t.x;
                        data[seek * 8 + 5] = obj.t.y;
                        data[seek * 8 + 6] = obj.t.z;
                        data[seek * 8 + 7] = 1;
                    }
                    else
                    {
                        math.matrixMakeTransformRTS(obj.t, math.pool.vector3_one, obj.r, _mat);
                        for (var j = 0; j < 16; j++)
                        {
                            data[seek * 16 + j] = _mat.rawData[j];
                        }
                    }
                }
                seek++;
            }
        }

        care(node: transform)
        {
            var pnode = node;
            while (true)
            {
                if (this.nowpose[pnode.name] != undefined)
                {
                    this.carelist[pnode.name] = pnode;
                    return;
                }
                pnode = pnode.parent;
                // if (pnode instanceof transform)
                // {

                // }
                // else
                // {
                //     break;
                // }
            }
        }
    }

    @reflect.SerializeType
    export class tPoseInfo
    {
        @reflect.Field("string")
        name: string;
        @reflect.Field("vector3")
        tposep: math.vector3;
        @reflect.Field("quaternion")
        tposeq: math.quaternion;
    }

    export enum PlayStyle
    {
        NormalPlay,
        FramePlay,
        PingPang,
    }
}