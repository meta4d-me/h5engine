namespace gd3d.framework
{
    export class f14eff implements IAsset
    {
        defaultAsset: boolean=false;
        private name: constText = null;
        private id: resID = new resID();
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "f14eff_" + this.getGUID();
            }
            this.name = new constText(assetName);
        }
        assetbundle: string = null;
        getName(): string {
            if (this.name == undefined)
            {
                return null;
            }
            return this.name.getText();
        }
        getGUID(): number {
            return this.id.getID();
        }
        use(): void {

        }
        unuse(disposeNow?: boolean): void {

        }
        dispose() {

        }
        caclByteLength(): number {
            return 0;
        }
        f14data:F14EffectData;
        trans:transform;
        f14Effect:F14Effect;
        Parse(jsonStr: string, assetmgr: assetMgr)
        {
            let json=JSON.parse(jsonStr);
            this.f14data=new F14EffectData();
            this.f14data.parsejson(json,assetmgr,this.assetbundle);
            
            this.trans=new gd3d.framework.transform();
            this.f14Effect=this.trans.gameObject.addComponent("F14Effect") as gd3d.framework.F14Effect;
            this.f14Effect.setData(this.f14data);
        }
    }    
}