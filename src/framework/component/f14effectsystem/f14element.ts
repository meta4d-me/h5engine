namespace m4m.framework
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
        /**
         * 更新
         * @param deltaTime 上一帧用时 
         * @param frame 帧数
         * @param fps 帧率
         */
        update(deltaTime:number,frame:number, fps:number);
        /**
         * 销毁
         */
        dispose();
        /**
         * 重置
         */
        reset();
        /***
         * 当结束一次循环后执行函数
         */
        OnEndOnceLoop();
        /**
         * 改变颜色
         * @param value 颜色
         */
        changeColor(value:math.color);
        /**
         * 改变透明度
         * @param value 透明度
         */
        changeAlpha(value:number);
        layer:F14Layer;
        drawActive:boolean;
    }
}

