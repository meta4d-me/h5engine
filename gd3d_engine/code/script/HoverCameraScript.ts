namespace gd3d.framework{
    /**
     * 相机围绕盘旋 脚本
     */
    @gd3d.reflect.nodeComponent
    export class HoverCameraScript extends gd3d.framework.behaviour
    {
        public lookAtPoint: gd3d.math.vector3 = new gd3d.math.vector3 (0, 0, 0);
        @gd3d.reflect.Field("reference",null,"transform")
        public lookAtTarget: gd3d.framework.transform;
        public distance:number = 30;

        public minPanAngle:number = -Infinity;
        public maxPanAngle:number = Infinity;
        public minTileAngle:number = -90;
        public maxTileAngle:number = 90;

        public scaleSpeed:number = 0.2;

        private inputMgr:gd3d.framework.inputMgr;

        private _lastMouseX:number;
        private _lastMouseY:number;
        private _mouseDown = false;

        private _lastTouchX:number;
        private _lastTouchY:number;
        private _fingerTwo = false;
        private _lastDistance:number;

        private _panAngle:number = 0;
        private _panRad:number = 0;
        private _cur_panRad: number = 0;

        private damping = 0.08;
        private panSpeed = 0.01;

        public set panAngle(value:number) {
            this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
            this._panRad = this._panAngle * Math.PI / 180;
        }

        public get panAngle():number {
            return this._panAngle;
        }

        private _tiltAngle:number = 0;
        private _tiltRad:number = 0;
        private _cur_tiltRad:number = 0;

        public set tiltAngle(value:number) {
            this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
            this._tiltRad = this._tiltAngle * Math.PI / 180;
        }

        public get tiltAngle():number {
            return this._tiltAngle;
        }

        private panDir = new gd3d.math.vector3();
        private targetOffset = new gd3d.math.vector3();

        onPlay(){

        }

        public start() {
            this.inputMgr = this.gameObject.transform.scene.app.getInputMgr();
            //点击事件
            this.inputMgr.addPointListener(gd3d.event.PointEventEnum.PointDown,this.onPointDown,this);
            this.inputMgr.addPointListener(gd3d.event.PointEventEnum.PointUp,this.onPointUp,this);
            this.inputMgr.addPointListener(gd3d.event.PointEventEnum.PointMove,this.onPointMove,this);
            this.inputMgr.addPointListener(gd3d.event.PointEventEnum.MouseWheel,this.onWheel,this);

            this.inputMgr.addHTMLElementListener('touchstart', this.onTouch, this);
            this.inputMgr.addHTMLElementListener('touchmove', this.onTouchMove, this);
        }

        private cupTargetV3 = new gd3d.math.vector3();
        public update(delta: number) {
            const tiltRad = this._cur_tiltRad = gd3d.math.numberLerp(this._cur_tiltRad, this._tiltRad, this.damping);
            const panRad = this._cur_panRad = gd3d.math.numberLerp(this._cur_panRad, this._panRad, this.damping);

            let distanceX = this.distance * Math.sin(panRad) * Math.cos(tiltRad);
            let distanceY = this.distance * (tiltRad == 0 ? 0 : Math.sin(tiltRad));
            let distanceZ = this.distance * Math.cos(panRad) * Math.cos(tiltRad);

            if(this.lookAtTarget) {
                gd3d.math.vec3Clone(this.lookAtTarget.getWorldTranslate(),this.cupTargetV3);
            } else {
                gd3d.math.vec3Clone(this.lookAtPoint,this.cupTargetV3);
            }
            gd3d.math.vec3Add(this.cupTargetV3, this.targetOffset, this.cupTargetV3);
            let tempv3 = gd3d.math.pool.new_vector3(this.cupTargetV3.x + distanceX, this.cupTargetV3.y + distanceY, this.cupTargetV3.z + distanceZ);

            this.gameObject.transform.setWorldPosition(tempv3);
            this.gameObject.transform.lookatPoint(this.cupTargetV3);
            this.gameObject.transform.markDirty();

            gd3d.math.pool.delete_vector3(tempv3);
        }

        private onPointDown() {
            this._mouseDown = true;
            this._lastMouseX = this.inputMgr.point.x;
            this._lastMouseY = this.inputMgr.point.y;
        }
        private onPointUp() {
            this._mouseDown = false;
        }
        private onPointMove() {
            if(!this._mouseDown)    return ;
            let moveX = this.inputMgr.point.x - this._lastMouseX;
            let moveY = this.inputMgr.point.y - this._lastMouseY;
            if (this.inputMgr.isPressed(0)) {

                this.panAngle += moveX;
                this.tiltAngle += moveY;

            } else if(this.inputMgr.isPressed(1) || this.inputMgr.isPressed(2)) {
                gd3d.math.vec3Set(this.panDir, -moveX, moveY, 0);
                gd3d.math.vec3ScaleByNum(this.panDir, this.panSpeed, this.panDir);
                gd3d.math.quatTransformVector(this.gameObject.transform.localRotate, this.panDir, this.panDir);
                gd3d.math.vec3Add(this.targetOffset, this.panDir, this.targetOffset);
                gd3d.math.vec3Add(this.gameObject.transform.localPosition, this.panDir, this.gameObject.transform.localPosition);
                this.gameObject.transform.markDirty();
            }
            this._lastMouseX = this.inputMgr.point.x;
            this._lastMouseY = this.inputMgr.point.y;
        }

        private onWheel(){
            this.distance = Math.max(this.distance - this.inputMgr.wheel * 2, 1);
        }

        lastTouch = new gd3d.math.vector2();
        diffv2 = new gd3d.math.vector2();
        touchRotateID: number;

        lastTouches: { id: number; pos: pointinfo; }[] = null;
        panFingers = [new gd3d.math.vector2(), new gd3d.math.vector2()];

        private onTouch(ev: TouchEvent){
            if (ev.targetTouches.length == 1) {
                const touch = this.inputMgr.touches[ev.targetTouches[0].identifier];
                this.touchRotateID = ev.targetTouches[0].identifier;
                math.vec2Set(this.lastTouch, touch.x, touch.y);
            } else if (ev.targetTouches.length == 2) {
                const touches = [0, 1].map(i => {
                    return {
                        id: ev.targetTouches[i].identifier,
                        pos: {...this.inputMgr.touches[ev.targetTouches[i].identifier]},
                    }
                });
                this.lastTouches = touches;
            }
        }

        private onTouchMove(ev: TouchEvent) {
            if (ev.targetTouches.length == 1) {
                const touch = this.inputMgr.touches[ev.targetTouches[0].identifier];
                if (this.touchRotateID == ev.targetTouches[0].identifier) {
                    math.vec2Set(this.diffv2, touch.x, touch.y);
                    math.vec2Subtract(this.diffv2, this.lastTouch, this.diffv2);
                    this.panAngle += this.diffv2.x / window?.devicePixelRatio ?? 1;
                    this.tiltAngle += this.diffv2.y / window?.devicePixelRatio ?? 1;
                }
                math.vec2Set(this.lastTouch, touch.x, touch.y);
                this.touchRotateID = ev.targetTouches[0].identifier;
            } else if (ev.targetTouches.length == 2) {
                const touch = this.inputMgr.touches[ev.changedTouches[0].identifier];
                math.vec2Set(this.lastTouch, touch.x, touch.y);
                const touches = [0, 1].map(i => {
                    return {
                        id: ev.targetTouches[i].identifier,
                        pos: {...this.inputMgr.touches[ev.targetTouches[i].identifier]},
                    }
                });
                const deltas = touches.map(({id, pos}, i) => {
                    const lastpos = this.lastTouches.filter(t => t.id == id)[0]?.pos;
                    if (lastpos) {
                        gd3d.math.vec2Set(this.panFingers[i], pos.x, pos.y);
                        gd3d.math.vec2Set(this.diffv2, lastpos.x, lastpos.y);
                        gd3d.math.vec2Subtract(this.panFingers[i], this.diffv2, this.panFingers[i]);
                        // gd3d.math.vec2Normalize(this.panFingers[i], this.panFingers[i]);
                        return this.panFingers[i];
                    }
                });
                if (deltas.length == 2) {
                    const dot = gd3d.math.vec2Dot(deltas[0], deltas[1]);
                    if (dot < 0.2) {
                        const lastpos = this.lastTouches.map(({pos}) => pos);
                        gd3d.math.vec2Set(this.diffv2, lastpos[0].x - lastpos[1].x, lastpos[0].y - lastpos[1].y);
                        let dis = gd3d.math.vec2Dot(this.diffv2, this.diffv2);
                        const dpos = touches.map(({ pos }) => pos);
                        gd3d.math.vec2Set(this.diffv2, dpos[0].x - dpos[1].x, dpos[0].y - dpos[1].y);
                        dis -= gd3d.math.vec2Dot(this.diffv2, this.diffv2);
                        this.distance = Math.max(this.distance + dis * 1e-5, 1);
                    } else {
                        gd3d.math.vec3Set(this.panDir, -this.panFingers[0].x, this.panFingers[0].y, 0);
                        gd3d.math.vec3ScaleByNum(this.panDir, this.panSpeed, this.panDir);
                        gd3d.math.quatTransformVector(this.gameObject.transform.localRotate, this.panDir, this.panDir);
                        gd3d.math.vec3Add(this.targetOffset, this.panDir, this.targetOffset);
                        gd3d.math.vec3Add(this.gameObject.transform.localPosition, this.panDir, this.gameObject.transform.localPosition);
                        this.gameObject.transform.markDirty();
                    }
                }
                this.lastTouches = touches;
            }
        }

        public remove()
        {
            this.inputMgr.removePointListener(gd3d.event.PointEventEnum.PointDown,this.onPointDown,this);
            this.inputMgr.removePointListener(gd3d.event.PointEventEnum.PointUp,this.onPointUp,this);
            this.inputMgr.removePointListener(gd3d.event.PointEventEnum.PointMove,this.onPointMove,this);
            this.inputMgr.removePointListener(gd3d.event.PointEventEnum.MouseWheel,this.onWheel,this);
        }
    }
}
