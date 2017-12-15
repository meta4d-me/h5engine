namespace gd3d.framework
{
    export class defsprite
    {
        static initDefaultSprite(assetmgr: assetMgr)
        {
            let spt_white = new sprite("white_sprite");
            spt_white.texture = assetmgr.getDefaultTexture("white");
            spt_white.defaultAsset = true;
            assetmgr.mapDefaultSprite["white_sprite"] = spt_white;

            let spt_gray = new sprite("gray_sprite");
            spt_white.texture = assetmgr.getDefaultTexture("gray");
            spt_white.defaultAsset = true;
            assetmgr.mapDefaultSprite["gray_sprite"] = spt_white;

            let spt_grid = new sprite("grid_sprite");
            spt_white.texture = assetmgr.getDefaultTexture("grid");
            spt_white.defaultAsset = true;
            assetmgr.mapDefaultSprite["grid_sprite"] = spt_white;
        }
    }
}