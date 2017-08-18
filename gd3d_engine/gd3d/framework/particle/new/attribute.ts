namespace gd3d.framework
{
    export interface IAttributeData
    {
        uiState: AttributeUIState;
        data: any;
        // timeLine: { [frameIndex: number]: any };
        attributeType: AttributeType;
        actions: { [frameIndex: number]: IEffectAction };
        init();
    }
    @gd3d.reflect.SerializeType
    export class Vector3AttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: any;
        // public timeLine: { [frameIndex: number]: gd3d.math.vector3 };
        public actions: { [frameIndex: number]: IEffectAction };
        init()
        {
            if (this.attributeType == AttributeType.FixedValType)
            {
                this.data = new gd3d.math.vector3();
            } else if (this.attributeType == AttributeType.LerpType)
            {
                this.data = {};
                this.data[-1] = new gd3d.math.vector3();
            }
        }
        addFramePoint(frameId: number, data: gd3d.math.vector3)
        {
            this.data[frameId] = data;
        }
        removeKeyPoint(frameId: number, data: any)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            }
            delete this.data[frameId];
        }
    }
    @gd3d.reflect.SerializeType
    export class Vector2AttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: any;
        public timeLine: { [frameIndex: number]: gd3d.math.vector2 };
        public actions: { [frameIndex: number]: IEffectAction };
        init()
        {
            if (this.attributeType == AttributeType.FixedValType)
            {
                this.data = new gd3d.math.vector3();
            } else if (this.attributeType == AttributeType.LerpType)
            {
                this.data = {};
                this.data[-1] = new gd3d.math.vector3();
            }
        }
        addFramePoint(frameId: number, data: gd3d.math.vector2)
        {
            this.data[frameId] = data;
        }
        removeKeyPoint(frameId: number, data: gd3d.math.vector2)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            }
            delete this.data[frameId];
        }
    }
    @gd3d.reflect.SerializeType
    export class NumberAttributeData implements IAttributeData, ILerpAttributeInterface
    {
        public uiState: AttributeUIState;
        public attributeType: AttributeType;
        public data: any;
        public timeLine: { [frameIndex: number]: number };
        public actions: { [frameIndex: number]: IEffectAction };
        init()
        {
            if (this.attributeType == AttributeType.FixedValType)
            {
                this.data = new gd3d.math.vector3();
            } else if (this.attributeType == AttributeType.LerpType)
            {
                this.data = {};
                this.data[-1] = new gd3d.math.vector3();
            }
        }
        addFramePoint(frameId: number, data: any)
        {
            this.data[frameId] = data;
        }
        removeKeyPoint(frameId: number, data: number)
        {
            if (this.data[frameId] == undefined)
            {
                console.warn("当前时间线中没有记录这一帧：" + frameId);
                return;
            }
            delete this.data[frameId];
        }
    }

    export interface ILerpAttributeInterface
    {
        addFramePoint(frameId: number, data: any);
        removeKeyPoint(frameId: number, data: any);
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
