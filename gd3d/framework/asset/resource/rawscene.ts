namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class rawscene implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        constructor(assetName: string = null)
        {
            if (!assetName)
            {
                assetName = "rawscene_" + this.getGUID();
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

        caclByteLength(): number
        {
            let total = 0;
            return total;
        }
        Parse(txt: string, assetmgr: assetMgr)
        {
            let _json = JSON.parse(txt);

            this.rootNode = new transform();
            this.rootNode.name = this.getName();
            io.deSerialize(_json["rootNode"], this.rootNode, assetmgr, this.assetbundle);

            this.lightmaps = [];
            let lightmapData = _json["lightmap"];
            let lightmapCount = lightmapData.length;
            for (let i = 0; i < lightmapCount; i++)
            {
                if (lightmapData[i] == null)
                {
                    this.lightmaps.push(null);
                }
                else
                {
                    let lightmapName = lightmapData[i].name;
                    let lightmap = assetmgr.getAssetByName(lightmapName, this.assetbundle) as texture;
                    lightmap.use();
                    this.lightmaps.push(lightmap);
                }
            }
        }

        getSceneRoot(): transform
        {
            return io.cloneObj(this.rootNode);
        }

        useLightMap(scene: scene)
        {
            scene.lightmaps.length = 0;
            for (let i = 0; i < this.lightmaps.length; i++)
            {
                scene.lightmaps.push(this.lightmaps[i]);
            }
        }

        dispose()
        {
            if(this.rootNode)
            {
                this.rootNode.dispose();
            }
            for(let key in this.lightmaps)
            {
                this.lightmaps[key].unuse(true);
            }
        }

        private rootNode: transform;
        private lightmaps: texture[];
    }
}