namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class atlas implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean;//是否为系统默认资源
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "atlas_" + this.getGUID();
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
            for (var key in this.sprites)
            {
                this.sprites[key].unuse();
            }
            this.texture.unuse();
            delete this.sprites;
        }
        caclByteLength(): number
        {
            let total = 0;
            for (let k in this.sprites)
            {
                total += this.sprites[k].caclByteLength();
                total += math.caclStringByteLength(k);
            }
            return total;
        }
        //这2属性应该没用
        texturewidth: number;
        textureheight: number;

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
        sprites: { [id: string]: sprite } = {};

        Parse(jsonStr: string, assetmgr: assetMgr)
        {

            var json = JSON.parse(jsonStr);
            var name: string = json["t"];//name
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = <any[]>json["s"];

            this.texture = assetmgr.getAssetByName(name) as gd3d.framework.texture;
            if (this.texture == null)
            {
                console.log("atlas的图片名字不对");
            }
            for (var i in s)
            {
                var ss = <any[]>s[i];
                var spriteName = ss[0];
                var r: sprite = new sprite(this.getName() + "_" + spriteName);//用Atlas的名字的Sprite的名字拼接
                assetmgr.use(r);
                if (this.texture)
                {
                    r.texture = this.texture;
                }
                r.rect = new math.rect(<number>ss[1], <number>ss[2], <number>ss[3], <number>ss[4]);
                r.border = new math.border(0, 0, 0, 0);
                r.atlas = this.getName();
                this.sprites[spriteName] = r;
            }
        }
    }
}