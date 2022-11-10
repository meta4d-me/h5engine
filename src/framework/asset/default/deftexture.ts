namespace m4m.framework
{
    export class defTexture
    {
        static readonly white = "white";
        static readonly black = "black";
        static readonly gray = "gray";
        static readonly normal = "normal";
        static readonly grid = "grid";
        static readonly particle = "particle";

        static initDefaultTexture(assetmgr: assetMgr)
        {
            var t = new texture(this.white);
            t.glTexture = m4m.render.glTexture2D.staticTexture(assetmgr.webgl, this.white);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.white] = t;

            var t = new texture(this.black);
            t.glTexture = m4m.render.glTexture2D.staticTexture(assetmgr.webgl, this.black);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.black] = t;

            var t = new texture(this.gray);
            t.glTexture = m4m.render.glTexture2D.staticTexture(assetmgr.webgl, this.gray);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.gray] = t;

            var t = new texture(this.normal);
            t.glTexture = m4m.render.glTexture2D.staticTexture(assetmgr.webgl, this.normal);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.normal] = t;

            var t = new texture(this.grid);
            t.glTexture = m4m.render.glTexture2D.staticTexture(assetmgr.webgl, this.grid);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.grid] = t;

            var t = new texture(this.particle);
            t.glTexture = m4m.render.glTexture2D.particleTexture(assetmgr.webgl);
            t.defaultAsset = true;
            assetmgr.mapDefaultTexture[this.particle] = t;

            //must in end
            defTexture.initDefaultCubeTexture(assetmgr);
        }

        private static initDefaultCubeTexture(assetmgr: assetMgr){
            let whiteTex = assetmgr.mapDefaultTexture[this.white];
            var t = new texture(this.white);
            t.glTexture = new m4m.render.glTextureCube(assetmgr.app.webgl);
            (t.glTexture as m4m.render.glTextureCube).uploadImages(whiteTex,whiteTex,whiteTex,whiteTex,whiteTex,whiteTex);
            t.defaultAsset = true;
            assetmgr.mapDefaultCubeTexture[this.white] = t;
        }
    }
}