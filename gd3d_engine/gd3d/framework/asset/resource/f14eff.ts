namespace gd3d.framework
{

    export class f14node
    {
        trans:transform;
        f14Effect:f14EffectSystem;
    }
    @gd3d.reflect.SerializeType    
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
        f14Effect:f14EffectSystem;
        Parse(jsonStr: string, assetmgr: assetMgr)
        {
            let json=JSON.parse(jsonStr);
            this.f14data=new F14EffectData();
            this.f14data.parsejson(json,assetmgr,this.assetbundle);
            
            this.trans=new gd3d.framework.transform();
            this.f14Effect=this.trans.gameObject.addComponent("f14EffectSystem") as gd3d.framework.f14EffectSystem;
            this.f14Effect.setData(this.f14data);
        }

        getCloneF14eff():f14node
        {
            let f14node=new gd3d.framework.f14node();
            f14node.trans=new gd3d.framework.transform();
            f14node.f14Effect=this.trans.gameObject.addComponent("f14EffectSystem") as gd3d.framework.f14EffectSystem;
            f14node.f14Effect.setData(this.f14data);
            return f14node;
        }
    }


}