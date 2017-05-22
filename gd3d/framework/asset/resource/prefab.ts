namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class prefab implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "prefab_" + this.getGUID();
            }
            if (!sceneMgr.app.getAssetMgr().nameDuplicateCheck(assetName))
            {
                throw new Error("already have name.");
            }
            this.name = new constText(assetName);
        }
        getName(): string
        {
            return this.name.getText();
        }
        getGUID(): number
        {
            return this.id.getID();
        }
        //prefab依赖的AssetBundle
        assetbundle: string = null;
        use()
        {
            sceneMgr.app.getAssetMgr().use(this);
        }
        unuse(disposeNow: boolean = false)
        {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        dispose()
        {
            this.trans.dispose();
        }
        caclByteLength(): number
        {
            let total = 0;
            return total;
        }
        private trans: transform;
        getCloneTrans(): transform
        {
            return io.cloneObj(this.trans);
        }
        apply(trans: transform)
        {
            if (this.trans)
            {
                this.trans.dispose();
            }
            this.trans = trans;
        }
        jsonstr: string;
        Parse(jsonStr: string, assetmgr: assetMgr)
        {
            this.jsonstr = jsonStr;
            this.trans = new transform();
            io.deSerialize(JSON.parse(jsonStr), this.trans, assetmgr, this.assetbundle);
        }
    }
}