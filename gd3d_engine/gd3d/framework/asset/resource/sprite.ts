namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class sprite implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean;//是否为系统默认资源
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "sprite_" + this.getGUID();
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
            if (this.texture != null)
            {
                this.texture.unuse(true);
            }
        }

        caclByteLength(): number
        {
            let total = 0;
            if (this._texture)
            {
                total += this._texture.caclByteLength();
            }
            
            return total;
        }
        private _texture: texture;
        public get texture()
        {
            return this._texture;
        }
        public set texture(value: texture)
        {
            if (this._texture != null)
            {
                this._texture.unuse();
            }
            this._texture = value;
            this._texture.use();
        }
        atlas: string;
        rect: math.rect;
        border: math.border;
        private _urange: math.vector2;
        private _vrange: math.vector2;
        public get urange()
        {
            if (this._urange == null)
            {
                this._urange = new math.vector2();
                this._urange.x = this.rect.x / this._texture.glTexture.width;
                this._urange.y = (this.rect.x + this.rect.w) / this._texture.glTexture.width;
            }
            return this._urange;
        }
        public get vrange()
        {
            if (this._vrange == null)
            {
                this._vrange = new math.vector2();
                this._vrange.x = this.rect.y / this._texture.glTexture.height;
                this._vrange.y = (this.rect.y + this.rect.h) / this._texture.glTexture.height;
            }
            return this._vrange;
        }
    }
}