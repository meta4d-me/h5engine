namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class font implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean;//是否为系统默认资源
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "font_" + this.getGUID();
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
            if (this.texture)
            {
                this.texture.unuse(true);
            }
            delete this.cmap;
        }

        caclByteLength(): number
        {
            let total = 0;
            for (let k in this.cmap)
            {
                total += math.caclStringByteLength(k);
                total += charinfo.caclByteLength();
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
        //mat: spriteMat;

        cmap: { [id: string]: charinfo };
        fontname: string;
        pointSize: number;//像素尺寸
        padding: number;//间隔
        lineHeight: number;//行高
        baseline: number;//基线
        atlasWidth: number;
        atlasHeight: number;

        Parse(jsonStr: string, assetmgr: assetMgr)
        {
            let d1 = new Date().valueOf();
            let json = JSON.parse(jsonStr);

            //parse fontinfo
            var font = <any[]>json["font"];
            this.fontname = <string>font[0];
            var picName = <string>font[1];
            this.texture = assetmgr.getAssetByName(picName) as gd3d.framework.texture;
            this.pointSize = <number>font[2];
            this.padding = <number>font[3];
            this.lineHeight = <number>font[4];
            this.baseline = <number>font[5];
            this.atlasWidth = <number>font[6];
            this.atlasHeight = <number>font[7];

            //parse char map
            this.cmap = {};
            let map = json["map"];
            for (var c in map)
            {
                let finfo = new charinfo();//ness
                this.cmap[c] = finfo;
                finfo.x = (map[c][0] - 0.5) / this.atlasWidth;
                finfo.y = (map[c][1] - 0.5) / this.atlasHeight;
                finfo.w = (map[c][2] + 1.0) / this.atlasWidth;
                finfo.h = (map[c][3] + 1.0) / this.atlasHeight;
                finfo.xSize = map[c][2];
                finfo.ySize = map[c][3];
                finfo.xOffset = map[c][4];
                finfo.yOffset = map[c][5];
                finfo.xAddvance = map[c][6];
            }
            map = null;
            json = null;


            let d2 = new Date().valueOf();
            let n = d2 - d1;
        }

    }

    export class charinfo
    {
        x: number;//uv
        y: number;
        w: number;//uv长度
        h: number;
        xSize: number;//像素
        ySize: number;
        xOffset: number;//偏移
        yOffset: number;//相对基线的偏移
        xAddvance: number;//字符宽度
        static caclByteLength(): number
        {
            return 36;
        }
    }
}