namespace gd3d.framework
{
    export interface IAttributeData
    {
        uiState: AttributeUIState;
        data: { [frameIndex: number]: FrameKeyPointData };
        attributeType: AttributeType;
        actions: { [frameIndex: number]: IEffectAction[] };
        init();
    }
    @gd3d.reflect.SerializeType
    export class Vector3AttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: { [frameIndex: number]: FrameKeyPointData };
        public actions: { [frameIndex: number]: IEffectAction[] }
        constructor()
        {
            this.init();
        }
        init()
        {
            let keyPoint: FrameKeyPointData = new FrameKeyPointData(-1);
            keyPoint.val = new gd3d.math.vector3();
            this.data[keyPoint.frameIndex] = keyPoint;
        }
        addFramePoint(frameId: number, data: FrameKeyPointData)
        {
            if (this.data == undefined)
                this.data = {};
            this.data[frameId] = data;
            if (data.actions != undefined)
            {
                if (this.actions == undefined)
                    this.actions = {};
                this.actions[frameId] = data.actions;
            }
        }
        removeFramePoint(frameId: number, data: any)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            } else
                delete this.data[frameId];
            if (this.actions != undefined && this.actions[frameId] != undefined)
                delete this.actions[frameId];
        }
    }
    @gd3d.reflect.SerializeType
    export class Vector2AttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: { [frameIndex: number]: FrameKeyPointData };
        public actions: { [frameIndex: number]: IEffectAction[] }
        constructor()
        {
            this.init();
        }
        init()
        {
            let keyPoint: FrameKeyPointData = new FrameKeyPointData(-1);
            keyPoint.val = new gd3d.math.vector2();
            this.data[keyPoint.frameIndex] = keyPoint;
        }
        addFramePoint(frameId: number, data: FrameKeyPointData)
        {
            if (this.data == undefined)
                this.data = {};
            this.data[frameId] = data;
            if (data.actions != undefined)
            {
                if (this.actions == undefined)
                    this.actions = {};
                this.actions[frameId] = data.actions;
            }
        }
        removeFramePoint(frameId: number, data: gd3d.math.vector2)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            } else
                delete this.data[frameId];
            if (this.actions != undefined && this.actions[frameId] != undefined)
                delete this.actions[frameId];
        }
    }
    @gd3d.reflect.SerializeType
    export class NumberAttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: { [frameIndex: number]: FrameKeyPointData };
        public timeLine: { [frameIndex: number]: number };
        public actions: { [frameIndex: number]: IEffectAction[] };
        constructor()
        {
            this.init();
        }
        init()
        {
            let keyPoint: FrameKeyPointData = new FrameKeyPointData(-1);
            keyPoint.val = 0;
            this.data[keyPoint.frameIndex] = keyPoint;
        }
        addFramePoint(frameId: number, data: any)
        {
            if (this.data == undefined)
                this.data = {};
            this.data[frameId] = data;
            if (data.actions != undefined)
            {
                if (this.actions == undefined)
                    this.actions = {};
                this.actions[frameId] = data.actions;
            }
        }
        removeFramePoint(frameId: number, data: number)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            } else
                delete this.data[frameId];
            if (this.actions != undefined && this.actions[frameId] != undefined)
                delete this.actions[frameId];
        }
    }

    export interface ILerpAttributeInterface
    {
        addFramePoint(frameId: number, data: any);
        removeFramePoint(frameId: number, data: any);
    }

    export enum AttributeUIState
    {
        None,
        Show,
        Hide,
    }

    export enum AttributeUIType
    {
        Number,
        Vector2,
        Vector3,
        Vector4,
    }

    export enum AttributeType
    {
        FixedValType = 0,
        LerpType = 1
    }

    export class FrameKeyPointData
    {
        public frameIndex: number;
        public val: any;
        public actions: IEffectAction[];
        constructor(frameIndex: number)
        {
            this.frameIndex = frameIndex;
        }
    }

    // export class VectorLerpAttribute implements LerpAttributeInterface
    // {
    //     timeLine: { [frameId: number]: any };
    //     addFramePoint(frameId: number, data: any)
    //     {
    //         if (this.timeLine == undefined)
    //             this.timeLine = {};
    //         this.timeLine[frameId] = data;
    //     }
    //     removeKeyPoint(frameId: number, data: any)
    //     {
    //         if (this.timeLine == undefined || this.timeLine[frameId] == undefined)
    //         {
    //             console.warn("当前时间线中没有记录这一帧：" + frameId);
    //             return;
    //         }
    //         delete this.timeLine[frameId];
    //     }
    // }

    // export class ColorLerpAttribute implements LerpAttributeInterface
    // {
    //     timeLine: { [frameId: number]: gd3d.math.color };
    //     addFramePoint(frameId: number, data: any)
    //     {
    //         if (this.timeLine == undefined)
    //             this.timeLine = {};
    //         if (this.timeLine[frameId] == undefined)
    //             this.timeLine[frameId] = new gd3d.math.color();
    //         if (typeof (data) === 'number')
    //         {
    //             this.timeLine[frameId].a = data;
    //         } else if (data instanceof gd3d.math.vector3)
    //         {
    //             let c = data as gd3d.math.vector3;
    //             this.timeLine[frameId].r = c.x;
    //             this.timeLine[frameId].g = c.y;
    //             this.timeLine[frameId].b = c.z;
    //         }
    //     }
    //     removeKeyPoint(frameId: number, data: any)
    //     {
    //         if (this.timeLine == undefined || this.timeLine[frameId] == undefined)
    //         {
    //             console.warn("当前时间线中没有记录这一帧：" + frameId);
    //             return;
    //         }
    //         if (typeof (data) === 'number')
    //         {
    //             this.timeLine[frameId].a = -1;
    //         } else if (data instanceof gd3d.math.vector3)
    //         {
    //             this.timeLine[frameId].r = -1;
    //             this.timeLine[frameId].g = -1;
    //             this.timeLine[frameId].b = -1;
    //         }

    //         if (this.timeLine[frameId].r == -1 && this.timeLine[frameId].a == -1)
    //             delete this.timeLine[frameId];
    //     }
    // }
}