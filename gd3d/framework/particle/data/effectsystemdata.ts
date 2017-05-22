
namespace gd3d.framework
{
    /**
     *  特效系统数据
     */
    export class EffectData
    {
        public name: string = null;
        public particlelist: Array<ParticleData> = new Array<ParticleData>();
        public dependImgList: Array<string> = new Array<string>();
        public dependShapeList: Array<string> = new Array<string>();

        constructor()
        {

        }
    }


}

