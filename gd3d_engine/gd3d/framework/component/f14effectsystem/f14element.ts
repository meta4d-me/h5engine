namespace gd3d.framework
{
    export enum F14TypeEnum
    {
        SingleMeshType,//单mesh
        particlesType,//发射器
        RefType//索引
    }
    export interface F14Element
    {
        type:F14TypeEnum;
        update(deltaTime:number,frame:number, fps:number);
        reset();
        OnEndOnceLoop();
        changeColor(value:math.color);
        layer:F14Layer;
        drawActive:boolean;
    }
}

