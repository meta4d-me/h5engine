/// <reference path="../../../io/reflect.ts" />

namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class texture implements IAsset
    {
        @gd3d.reflect.Field("constText")
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "texture_" + this.getGUID();
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
            this.glTexture.dispose(sceneMgr.app.getAssetMgr().webgl);
        }
        glTexture: gd3d.render.ITexture;

        caclByteLength(): number
        {
            if (this.glTexture)
            {
                return this.glTexture.caclByteLength();
            }
        }

        //如果是imgdesc加载来的图片，通过这个可以获取到真实的图片名字
        private _realName: string;
        get realName(): string
        {
            return this._realName;
        }
        set realName(name: string)
        {
            this._realName = name;
        }
        
    }
}