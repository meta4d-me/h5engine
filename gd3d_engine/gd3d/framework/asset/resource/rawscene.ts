namespace gd3d.framework
{
    @gd3d.reflect.SerializeType
    export class rawscene implements IAsset
    {
        private name: constText;
        private id: resID = new resID();
        defaultAsset: boolean = false;
        fog: Fog;
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

            let fogData = _json["fog"];
            if (fogData != undefined)
            {
                this.fog = new Fog();
                this.fog._Start = <number>fogData["_Start"];
                this.fog._End = <number>fogData["_End"];
                let cor: string = fogData["_Color"];
                let array: string[] = cor.split(",");
                this.fog._Color = new gd3d.math.vector4(parseFloat(array[0]), parseFloat(array[1]), parseFloat(array[2]), parseFloat(array[3]));
                this.fog._Density = <number>fogData["_Density"];
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
        useFog(scene: scene)
        {
            scene.fog = this.fog;
        }

        dispose()
        {
            if (this.rootNode)
            {
                this.rootNode.dispose();
            }
            for (let key in this.lightmaps)
            {
                this.lightmaps[key].unuse(true);
            }
        }

        private rootNode: transform;
        private lightmaps: texture[];
    }

    export class Fog
    {
        public _Start: number;
        public _End: number;
        public _Color: gd3d.math.vector4;
        public _Density: number;
    }
}