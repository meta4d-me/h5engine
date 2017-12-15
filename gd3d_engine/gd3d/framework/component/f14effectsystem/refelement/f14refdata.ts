namespace gd3d.framework
{
    export class F14RefBaseData implements F14ElementData
    {

        public beLoop:boolean = false;
        public refData:F14EffectData;
    
        public F14RefBaseData(data:F14EffectData=null)
        {
            this.refData = data;
            //if (data==null)
            //{
            //    this.refData = F14Util.ins.getDefEffectData();
            //}else
            //{
                
            //}
        }

        parse(json: any, assetmgr: assetMgr, assetbundle: string) {
            this.beLoop=json.beLoop;
            if(json.refData)
            {
                let data=new F14EffectData();
                data.parsejson(json.refData,assetmgr,assetbundle);
                this.refData=data;
            }
        }

    }
}

