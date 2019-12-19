/// <reference path="../../io/reflect.ts" />

namespace gd3d.framework {
    @reflect.nodeComponent
    export class keyFrameAniPlayer implements INodeComponent {
        static readonly ClassName:string="keyFrameAniPlayer";

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 关键帧动画数组
         * @version gd3d 1.0
         */
        @reflect.Field("keyFrameAniClip[]")
        clips: keyFrameAniClip[];

        //当前播放的clip
        private nowClip: keyFrameAniClip;
        //当前播放到的帧
        private get nowFrame() {
            if (!this.nowClip) return 0;
            return Math.floor(this.nowClip.fps * this.nowTime);
        };
        //当前播放到的时间
        private nowTime: number = 0;
        //对象路径map
        private pathPropertyMap = {};

        gameObject: gameObject;
        start() {
            this.init();
        }

        onPlay()
        {

        }

        update(delta: number) {
            let clip = this.nowClip;
            if (!clip) return;
            //是否播完
            if (this.checkPlayEnd(clip)) {
                this.nowClip = null;
                this.nowTime = 0;
                return ;
            }
            this.nowTime += delta;
            let playTime = this.nowTime % this.nowClip.time;  //当前播放时间
            this.displayByTime(clip,playTime);
        }

        //播放到指定时间状态
        private displayByTime(clip:keyFrameAniClip,playTime : number){
            let curves = this.timeFilterCurves(clip, playTime);
            if (!curves || curves.length < 1) return;
            //修改属性值
            for(var i=0;i<curves.length ;i++){
                let tempc = curves[i];
                this.refrasCurveProperty(tempc,playTime);
            }
        }

        //通过时间计算curve 值
        // 插值函数
        private static lhvec = new gd3d.math.vector3();
        private static rhvec = new gd3d.math.vector3();
        private static lhquat = new gd3d.math.quaternion();
        private static rhquat = new gd3d.math.quaternion();
        private static resvec = new gd3d.math.vector3();
        private static resquat = new gd3d.math.quaternion();
        private static vec3lerp(a: gd3d.math.vector3, b: gd3d.math.vector3, t: number, out: gd3d.math.vector3) {
            out.x = a.x + t * (b.x - a.x);
            out.y = a.y + t * (b.y - a.y);
            out.z = a.z + t * (b.z - a.z);
            return out;
        }
        private static quatSlerp(a: gd3d.math.quaternion, b: gd3d.math.quaternion, t: number, out: gd3d.math.quaternion) {
            let omega, cosom, sinom, scale0, scale1;

            cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
            if ( cosom < 0.0 ) {
                cosom = -cosom;
                b.x = - b.x;
                b.y = - b.y;
                b.z = - b.z;
                b.w = - b.w;
            }
            if ( (1.0 - cosom) > 0.000001 ) {
                omega  = Math.acos(cosom);
                sinom  = Math.sin(omega);
                scale0 = Math.sin((1.0 - t) * omega) / sinom;
                scale1 = Math.sin(t * omega) / sinom;
            } else {
                scale0 = 1.0 - t;
                scale1 = t;
            }
            out.x = scale0 * a.x + scale1 * b.x;
            out.y = scale0 * a.y + scale1 * b.y;
            out.z = scale0 * a.z + scale1 * b.z;
            out.w = scale0 * a.w + scale1 * b.w;

            return out;
        }
        private calcValueByTime(curve: AnimationCurve, playTime: number) {
            let kfs = curve.keyFrames;
            if(!kfs || kfs.length < 1)return 0;
            if(kfs.length == 1 && kfs[0])return kfs[0].value;
            //找到目标关键帧
            let leftKf: keyFrame;
            let rightKf: keyFrame;
            for (var i = 0; i < kfs.length; i++) {
                rightKf = kfs[i];
                if(kfs[i].time > playTime){
                    if(i>0) leftKf = kfs[i-1];
                    break;
                }
            }
            // NOTE: Using LINEAR instead of bezier
            const progress = leftKf
                ? (playTime-leftKf.time) /(rightKf.time - leftKf.time)
                : 1;
            switch(curve.propertyName) {
                case 'localScale':
                case 'localTranslate':
                    keyFrameAniPlayer.rhvec.x = rightKf.value[0];
                    keyFrameAniPlayer.rhvec.y = rightKf.value[1];
                    keyFrameAniPlayer.rhvec.z = rightKf.value[2];
                    if(!leftKf) {
                        return keyFrameAniPlayer.rhvec;
                    }
                    keyFrameAniPlayer.lhvec.x = leftKf.value[0];
                    keyFrameAniPlayer.lhvec.y = leftKf.value[1];
                    keyFrameAniPlayer.lhvec.z = leftKf.value[2];

                    return keyFrameAniPlayer.vec3lerp(keyFrameAniPlayer.lhvec, keyFrameAniPlayer.rhvec, progress, keyFrameAniPlayer.resvec);                    break;
                case 'localRotate':
                    keyFrameAniPlayer.rhquat.x = rightKf.value[0];
                    keyFrameAniPlayer.rhquat.y = rightKf.value[1];
                    keyFrameAniPlayer.rhquat.z = rightKf.value[2];
                    keyFrameAniPlayer.rhquat.w = rightKf.value[3];
                    if(!leftKf) {
                        return keyFrameAniPlayer.rhquat;
                    }
                    keyFrameAniPlayer.lhquat.x = leftKf.value[0];
                    keyFrameAniPlayer.lhquat.y = leftKf.value[1];
                    keyFrameAniPlayer.lhquat.z = leftKf.value[2];
                    keyFrameAniPlayer.lhquat.w = leftKf.value[3];

                    return keyFrameAniPlayer.quatSlerp(keyFrameAniPlayer.lhquat, keyFrameAniPlayer.rhquat, progress, keyFrameAniPlayer.resquat);
            }

            return null;
            //贝塞尔算值
            return bezierCurveTool.calcValue(leftKf,rightKf,playTime);
        }

        private eulerStatusMap = {};
        private eulerMap = {};
        //刷新curve 属性
        private refrasCurveProperty(curve: AnimationCurve, playTime: number) {
            if (playTime < 0  || !curve || curve.keyFrames.length<2 || StringUtil.isNullOrEmptyObject(curve.propertyName)) return;
            let path = curve.path;
            let key = `${path}_${curve.type}`;
            let obj = this.pathPropertyMap[key];
            if (!obj) return;
            let sub = obj;
            let strs = curve.propertyName.split(".");
            let prop_type = "";
            while (strs.length > 0) {
                if (strs.length == 1) {
                    let str_p = strs[0];
                    const target = this.calcValueByTime(curve, playTime);
                    // const target = 0;
                    if (curve.type == transform["name"]){
                        if(obj instanceof transform){
                            if(target) {
                                switch(curve.propertyName) {
                                    case 'localScale':
                                        obj.localScale.x = target['x'];
                                        obj.localScale.y = target['y'];
                                        obj.localScale.z = target['z'];
                                        break;
                                    case 'localTranslate':
                                        obj.localTranslate.x = target['x'];
                                        obj.localTranslate.y = target['y'];
                                        obj.localTranslate.z = target['z'];
                                        break;
                                    case 'localRotate':
                                        obj.localRotate.x = target['x'];
                                        obj.localRotate.y = target['y'];
                                        obj.localRotate.z = target['z'];
                                        obj.localRotate.w = target['w'];
                                        break;
                                }
                            }

                            // if(prop_type == "localEulerAngles"){
                            //     if(!this.eulerStatusMap[path]) this.eulerStatusMap[path] = 0;
                            //     let p_val = 0;
                            //     switch(str_p){
                            //         case "x" : p_val = 0;  break;
                            //         case "y" : p_val = 1;  break;
                            //         case "z" : p_val = 2;  break;
                            //     }

                            //     this.eulerStatusMap[path] |= 1 << p_val;
                            //     this.eulerMap[path+str_p] = target;

                            //     if(this.eulerStatusMap[path] == 7){
                            //         this.eulerStatusMap[path] = 0;
                            //         sub.x = this.eulerMap[path+'x'];
                            //         sub.y = this.eulerMap[path+'y'];
                            //         sub.z = this.eulerMap[path+'z'];
                            //         obj.localEulerAngles = sub;
                            //         // gd3d.math.quatNormalize(obj.localRotate,obj.localRotate);
                            //         // obj.localRotate = obj.localRotate;
                            //     }
                            // } else {
                            //     sub[str_p] = target;
                            // }

                            // obj.markDirty();
                            // obj["dirtyLocal"] = true;
                            obj["dirtify"](true);
                            // dirtify


                        }
                    }
                    return;
                }
                let str = strs.shift();
                prop_type = str;
                sub = sub[str];
                if (!sub)
                    return;
            }
        }

        //按时间筛选需要播放的 curve
        private timeFilterCurves(clip: keyFrameAniClip, nowTime: number) {
            if (!clip || clip.curves.length < 1) return;
            let result: AnimationCurve[] = [];
            for (var i = 0; i < clip.curves.length; i++) {
                let curve = clip.curves[i];
                let kfs = curve.keyFrames;
                if (kfs.length < 1 || !kfs[kfs.length - 1] || kfs[kfs.length - 1].time < nowTime) continue;
                result.push(curve);
            }
            return result;
        }

        //检查播放是否完毕
        private checkPlayEnd(clip: keyFrameAniClip) {
            if (!clip) return true;
            if (clip._wrapMode == WrapMode.Loop || clip._wrapMode == WrapMode.PingPong) return false;
            if (this.nowTime >= clip.time) return true;
        }

        private init() {

        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 动画是否在播放
         * @version gd3d 1.0
         */
        isPlaying(ClipName: string) {
            return (this.nowClip && this.nowClip.getName() == ClipName);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放指定动画
         * @version gd3d 1.0
         */
        playByName(ClipName: string) {
            if (!this.clips || this.clips.length < 1) return;
            for(var i=0;i<this.clips.length ;i++){
                let clip = this.clips[i];
                if(!clip) continue;
                if(clip.getName() == ClipName){
                    this.nowClip = clip;
                    this.collectPathPropertyObj(this.nowClip, this.pathPropertyMap);
                }
            }
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 播放默认动画
         * @version gd3d 1.0
         */
        play() {
            if (!this.clips || this.clips.length < 1) return;
            this.nowClip = this.clips[0];
            if (!this.nowClip) return;
            this.collectPathPropertyObj(this.nowClip, this.pathPropertyMap);
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 停止默认动画
         * @version gd3d 1.0
         */
        stop(){
           this.nowClip = null;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 倒带默认动画
         * @version gd3d 1.0
         */
        rewind(){
            if(!this.nowClip) return ;
            this.displayByTime(this.nowClip,0);  //到第一帧
            this.nowTime = 0;
        }

        private collectPropertyObj(clip: keyFrameAniClip) {
            if (!clip) return;
            for (var i = 0; i < clip.curves.length; i++) {  //"gameobj_0/gameobj_1"
                let curve = clip.curves[i];
                let tran = this.gameObject.transform;
                if (!StringUtil.isNullOrEmptyObject(curve.path)) {
                    tran = this.pathPropertyMap[curve.path];
                }
                let comp: any = tran;
                if (curve.type != transform.prototype.name) {
                    comp = tran.gameObject.getComponent(curve.type);
                }
                if (!comp) continue;

            }
        }

        //children对象收集路径
        private collectPathPropertyObj(clip: keyFrameAniClip, pathMap) {
            if (!clip || !pathMap) return;
            for (var i =0 ; i < clip.curves.length; i++) {  //"gameobj_0/gameobj_1"
                let curve = clip.curves[i];
                let key = "";
                let tran = this.gameObject.transform;
                if (!StringUtil.isNullOrEmptyObject(curve.path)) {
                    let strs = curve.path.split("/");
                    for (var j = 0; j < strs.length; j++) {
                        tran = this.serchChild(strs[j], tran);
                        if (!tran) break;
                    }
                    if (!tran) continue;
                }
                key = `${curve.path}_${curve.type}`;
                let comp: any = tran;
                if (curve.type != transform["name"]) {
                    comp = tran.gameObject.getComponent(curve.type);
                }
                pathMap[key] = comp;
            }
        }
        //寻找child by name
        private serchChild(name: string, trans: transform) {
            if (!trans || !trans.children || trans.children.length < 1) return;
            for (var i = 0; i < trans.children.length; i++) {
                let child = trans.children[i];
                if (child && child.name == name)
                    return child;
            }
        }

        clone() {

        }

        remove() {


            this.gameObject = null;
            this.pathPropertyMap = null;
            this.nowClip = null;
            this.clips.length = 0;
            this.clips = null;
        }
    }

    //贝塞尔计算工具
    class bezierCurveTool{
        private static cupV2 = new math.vector2();
        static calcValue(kf_l:keyFrame,kf_r:keyFrame,playTime:number){
            //是否 是常量
            if(kf_l.outTangent == Infinity || kf_r.inTangent == Infinity) return kf_l.value;
            let rate = (playTime-kf_l.time) /(kf_r.time - kf_l.time);
            let v2 = bezierCurveTool.converCalc(kf_l.value,kf_r.value,kf_l.time,kf_r.time,kf_l.inTangent,kf_r.outTangent,rate);
            return v2.y;
        }

        private static converCalc(inV:number,outV:number,inTime:number,outTime:number,inTangent:number,outTangent:number,t:number){
            let p0 = math.pool.new_vector2(inTime,inV);
            let p1 = math.pool.new_vector2();
            let p2 = math.pool.new_vector2();
            let p3 = math.pool.new_vector2(outTime,outV);

            let dir1 = math.pool.new_vector2(inTangent<0? -1 : 1, Math.sqrt(1 + inTangent * inTangent));
            let dir2 = math.pool.new_vector2(outTangent<0? -1 : 1, Math.sqrt(1 + outTangent * outTangent));
            math.vec2Add(p0,dir1,p1);
            math.vec2Add(p3,dir2,p2);
            bezierCurveTool.calcCurve(t,p0,p1,p2,p3,bezierCurveTool.cupV2);

            math.pool.delete_vector2Array([p0,p1,p2,p3,dir1,dir2]);
            return bezierCurveTool.cupV2;
        }

        //三阶 贝塞尔曲线
        private static calcCurve(t:number,P0:math.vector2,P1:math.vector2,P2:math.vector2,P3:math.vector2,out:math.vector2){
            var equation = (t: number, val0: number, val1: number, val2: number, val3: number) => {
                var res = (1.0 - t) * (1.0 - t) * (1.0 - t) * val0 + 3.0 * t * (1.0 - t) * (1.0 - t) * val1 + 3.0 * t * t * (1.0 - t) * val2 + t * t * t * val3;
                return res;
            }
            out.x = equation(t,P0.x,P1.x,P2.x,P3.x);
            out.y = equation(t,P0.y,P1.y,P2.y,P3.y);
            return out;
        }
    }
}