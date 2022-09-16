/// <reference path="../../../io/reflect.ts" />
namespace m4m.framework {
    @reflect.nodeComponent
    export class animation implements INodeComponent {
        static readonly ClassName: string = "animation";
        onPlay() {
        }
        start() {
        }
        update(delta: number) {
            this.currentClip?.update(delta);
        }
        gameObject: gameObject;
        remove() {
        }
        clone() {
        }
        animationClips: GLTFanimationClip[] = [];
        private currentClip: clipInstance;
        play(clipName: string, options?: playOptions) {
            let clip = this.animationClips.find(el => el.name == clipName);
            if (clip == null) {
                console.warn(`播放动画失败，无法找到动画[name=${clipName}]`);
                return;
            }
            if (this.currentClip?.clip == clip) {
                this.currentClip.reset();
            } else {
                this.currentClip = new clipInstance(clip, this.gameObject.transform, options);
            }
        }
    }

    export interface playOptions {
        /** 播放速度，默认：1 */
        speed?: number;
        /** 是否循环播放，默认：true */
        beLoop?: boolean;
        /** 帧率，默认：30 */
        frameRate?: number;
    }

    export class GLTFanimationClip {
        name: string;
        totalTime: number = 0;
        channels: animationChannel[] = [];
    }

    export class animationChannel {
        targetName: string;// find transform(bone) by TargetName;
        propertyName: animationChannelTargetPath;
        /** 关键帧时间 */
        times: number[] = [];
        values: any[] = [];
        get startTime() { return this.times[0]; };
        get endTime() { return this.times[this.times.length - 1]; };
    }

    export enum animationChannelTargetPath {
        TRANSLATION = "translation",
        ROTATION = "rotation",
        SCALE = "scale",
        WEIGHTS = "weights",
    }

    export class clipInstance {
        readonly clip: GLTFanimationClip;
        readonly beReady: boolean;
        private channelInsArr: channelInstance[] = [];
        private speed: number = 1;
        private localTime: number = 0;
        private beLoop: boolean;
        private frameRate: number;

        private totalFrame: number;
        private curFrame: number = 0;
        constructor(clip: GLTFanimationClip, root: transform, options?: playOptions) {
            this.clip = clip;
            this.curFrame = 0;
            this.speed = options?.speed ?? 1;
            this.beLoop = options?.beLoop ?? true;
            this.frameRate = options?.frameRate ?? 30;

            this.totalFrame = (this.frameRate * clip.totalTime) | 0;
            for (let i = 0; i < this.clip.channels.length; i++) {
                const ins = new channelInstance(this.clip.channels[i], root);
                if (ins.beReady == false) {
                    this.beReady = false;
                    break;
                }
            }
            this.beReady = true;
        }

        private _bePlaying = false;
        get bePlaying() { return this._bePlaying }

        update(deltaTime: number) {
            if (!this.beReady) return;
            this.setTime(this.localTime + deltaTime * this.speed);
        }
        /** 指定动画时间*/
        setTime(time: number) {
            this.localTime = time;
            let newFrame = (this.localTime * this.frameRate) | 0;
            if (newFrame != this.curFrame) {
                const { channelInsArr, totalFrame } = this;
                if (newFrame > totalFrame) {
                    if (this.curFrame < totalFrame) {
                        newFrame = totalFrame;
                    } else {
                        if (this.beLoop) {
                            //动画跳到开头重新播放
                            newFrame = 0;
                            this.localTime = 0;
                            this.channelInsArr.forEach(item => item.jumpToStart());
                        } else {
                            //动画播放结束
                            this._bePlaying = false;
                            return;
                        }
                    }
                }
                this.curFrame = newFrame;
                channelInsArr.forEach(item => item.execute(newFrame, this.frameRate));
            }
        }

        reset() {
            this.localTime = 0;
            this.curFrame = 0;
            this.channelInsArr.forEach(item => item.jumpToStart());
        }
    }

    export class channelInstance {
        channel: animationChannel;
        private setFunc: (value: any) => void;
        private lerpFunc: (from: any, to: any, lerp: number) => any;
        private temptLastStartIndex: number;

        readonly beReady;
        constructor(channel: animationChannel, root: transform) {
            this.channel = channel;
            let bone = root.find(channel.targetName)
            if (bone == null) {
                this.beReady = false;
                console.warn("cannot find bone.", channel.targetName);
                return;
            }
            switch (this.channel.propertyName) {
                case animationChannelTargetPath.TRANSLATION:
                    this.setFunc = (value: any) => { bone.localPosition = value; };
                    let lerpPosResult = new math.vector3();
                    this.lerpFunc = (from: any, to: any, lerp: number) => {
                        math.vec3SLerp(from, to, lerp, lerpPosResult);
                        return lerpPosResult;
                    }
                    break;
                case animationChannelTargetPath.SCALE:
                    this.setFunc = (value: any) => { bone.localScale = value; }
                    let lerpScaleResult = new math.vector3();
                    this.lerpFunc = (from: any, to: any, lerp: number) => {
                        math.vec3SLerp(from, to, lerp, lerpScaleResult);
                        return lerpScaleResult;
                    }
                    break;
                case animationChannelTargetPath.ROTATION:
                    this.setFunc = (value) => { bone.localRotate = value; }
                    let lerpQuatResult = new math.quaternion();
                    this.lerpFunc = (from: any, to: any, lerp: number) => {
                        math.quatLerp(from, to, lerpQuatResult, lerp);
                        return lerpQuatResult;
                    }
                    break;
                default:
                    console.warn("unknown AnimationChannelTargetPath", this.channel.propertyName);
                    break;
            }
            this.beReady = true;
        }

        jumpToStart() {
            if (!this.beReady) { return; }
            this.setFunc(this.channel.values[0]);
            this.temptLastStartIndex = null;
        }

        execute(currentFrame: number, frameRate: number) {
            if (!this.beReady) { return; }
            let frameTime = currentFrame * 1.0 / frameRate;
            if (frameTime < this.channel.startTime || frameTime > this.channel.endTime) { return; }

            const { times, endTime, values } = this.channel;
            // ---------------------------------寻找lerp start end frame
            let startIndex = this.temptLastStartIndex ?? ((times.length - 1) * frameTime / endTime) | 0;
            if (times[startIndex] < frameTime) {
                startIndex++;
                while (times[startIndex] < frameTime) { startIndex++; }
                if (times[startIndex] > frameTime) { startIndex--; }
            } else {
                while (times[startIndex] > frameTime) { startIndex--; }
            }
            this.temptLastStartIndex = startIndex;
            const endIndex = startIndex + 1;

            if (times[endIndex] == null) {
                this.setFunc(values[startIndex]);
            } else {
                const frameOffset = times[endIndex] - times[startIndex];
                if (frameOffset == 0) return;
                const lerp = (frameTime - times[startIndex]) / frameOffset;
                const value = this.lerpFunc(values[startIndex], values[endIndex], lerp);
                this.setFunc(value);
            }
        }
    }
}