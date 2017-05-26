namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    export class particleSystem implements IRenderer
    {
        particleData: ParticleData;
        public camera: camera;
        private emission: Emission;
        private particleMesh: gd3d.framework.mesh;
        private material: gd3d.framework.material;
        public particleMethodType: ParticleMethodType = ParticleMethodType.Normal;
        private meshBatchers: MeshBatcher[] = [];
        private curBather: MeshBatcher;
        layer: RenderLayerEnum = RenderLayerEnum.Common;
        queue: number = 0;
        delayTime: number;

        isTrail: boolean = false;//是否为拖尾
        private startLifeTime: number;

        /**
         *  计时器
         */
        private timer: number = 0;
        speed: number = 1;

        private assetmgr: assetMgr;
        start()
        {
            if (this.particleData == null)
            {
                //todo
                //这里应该给一个默认粒子数据
                this.particleData = new ParticleData();
            }
            let assetmgr = this.gameObject.getScene().app.getAssetMgr();
            this.assetmgr = assetmgr;
            this.initByData(assetmgr);
        }
        private initByData(assetmgr: gd3d.framework.assetMgr)
        {
            let emissionData = this.particleData.emissionData;
            let materialData = this.particleData.materialData;
            this.isTrail = this.particleData.particleDetailData.istrail;
            let meshName = this.particleData.particleDetailData.type;
            if ((meshName.substr(meshName.indexOf(".")) == ".mesh.bin.js") || (meshName.substr(meshName.indexOf(".")) == ".mesh.bin")) 
            {
                this.particleMesh = assetmgr.getAssetByName(meshName) as gd3d.framework.mesh;
            }
            else
            {
                this.particleMesh = assetmgr.getDefaultMesh(meshName) as gd3d.framework.mesh;
            }
            this.startLifeTime = this.particleData.particleDetailData.life.getValue();
            this.delayTime = this.particleData.particleDetailData.delayTime.getValue();
            this.emission = new Emission(emissionData.type, emissionData.count, emissionData.time);
            let shaderName = materialData.shaderName + ".json";
            this.material = new gd3d.framework.material();
            let shader = assetmgr.getShader(shaderName);
            this.material.setShader(shader);
            var textureName = materialData.diffuseTexture;
            var texture = assetmgr.getAssetByName(textureName) as gd3d.framework.texture;
            this.material.setFloat("_AlphaCut", materialData.alphaCut);
            this.material.setTexture("_MainTex", texture);
            this.layer = this.material.getLayer();
            this.queue = this.material.getQueue();
            this.particleMethodType = this.particleData.particleDetailData.particleMethodType;
        }

        update(delta: number)
        {
            this.timer += delta;

            let realdelta = this.speed * delta;

            //刷新batcher
            for (var i = 0; i < this.meshBatchers.length; i++) 
            {
                let batcher = this.meshBatchers[i];
                for (var j = 0; j < batcher.parlist.length; j++)
                {
                    var p = batcher.parlist[j];
                    p.update(realdelta);//刷新粒子的旋转位移
                }
                if (batcher.parlist.length > 0)
                {
                    batcher.update(realdelta);//刷新batcher的顶点data
                }
            }

            if (!this.emission.isOver())
            {
                if (this.emission.update(realdelta))
                {
                    var count = 1;
                    if (this.emission.emissionType == ParticleEmissionType.burst)
                    {
                        count = this.emission.emissionCount;
                    }
                    for (var i = 0; i < count; i++) 
                    {
                        this.checkEmissionBatcher(this.emission);
                        this.curBather.addParticle(this.particleMesh, this.particleData);
                    }
                }
            }
        }

        public render(context: gd3d.framework.renderContext, assetmgr: gd3d.framework.assetMgr, camera: gd3d.framework.camera)
        {
            if (this.timer < this.delayTime)
            {
                return;
            }

            for (var i in this.meshBatchers)
            {
                this.meshBatchers[i].render(context, assetmgr);
            }
        }

        private batchervercountLimit: number = 4096;
        //根据需要的数据大小创建batcher，但是一次只创建一个batcher
        creatMeshbatcher(mat: gd3d.framework.material, needCount: number = 128)
        {
            if (needCount > this.batchervercountLimit)
            {
                needCount = this.batchervercountLimit;
            }
            this.curBather = new MeshBatcher(mat, needCount, this);
            this.curBather.camera = this.camera;
            this.meshBatchers.push(this.curBather);
            if (needCount > this.batchervercountLimit)
            {
                needCount = needCount - this.batchervercountLimit;
                this.creatMeshbatcher(mat, needCount);
            }
        }

        //emission发射粒子，检查是否创建新batcher
        checkEmissionBatcher(emission: Emission, count: number = 1)
        {
            if (this.curBather == null)
            {
                this.creatMeshbatcher(this.material, this.particleMesh.data.pos.length * count);
            } else
            {
                var tcount = this.curBather.vercount + this.particleMesh.data.pos.length * count;
                if (tcount > this.curBather.maxvercount)//超过当前batcher的上限
                {
                    this.creatMeshbatcher(this.material, tcount);
                }
            }
        }
        remove()
        {
            for (var k in this.meshBatchers)
            {
                this.meshBatchers[k].dispose();
            }
            this.meshBatchers.length = 0;
            this.emission = null;
            this.material.dispose();
        }
        clone()
        {

        }
        gameObject: gd3d.framework.gameObject;
        renderLayer: CullingMask = CullingMask.default;
    }


    export class Emission
    {
        /**
         * 发射器类型
         */
        emissionType: ParticleEmissionType;
        /**
         * 最大发射粒子数（全类型）
         */
        maxEmissionCount: number;
        /**
         * 发射数量（全类型）
         */
        emissionCount: number;
        /**
         * 爆发时间（burst类型）
         */
        burstDelayTime: number;
        /**
         * 持续发射时间（continue类型）
         */
        emissionKeepTime: number;
        /**
         * 粒子数据
         */
        particleData: ParticleData;
        private curTime: number;
        private numcount: number;
        private b: boolean;
        private isover: boolean = false;
        private _continueSpaceTime: number;
        constructor(_type: ParticleEmissionType = ParticleEmissionType.burst, count: number = 1, time: number = 0)
        {
            this.emissionType = _type;
            this.emissionCount = count;
            switch (this.emissionType)
            {
                case ParticleEmissionType.burst:
                    this.burstDelayTime = time;
                    break;
                case ParticleEmissionType.continue:
                    this.emissionKeepTime = time;
                    this._continueSpaceTime = this.emissionKeepTime / this.emissionCount;
                    break;
            }
            this.curTime = 0;
            this.numcount = 0;
        }

        public update(delta: number): boolean 
        {
            this.curTime += delta;
            this.b = false;
            if (this.emissionType == ParticleEmissionType.continue)
            {
                if (this.curTime > this._continueSpaceTime)
                {
                    this.b = true;
                    if (this.numcount < this.emissionCount)
                    {
                        this.curTime = 0;
                        this.numcount++;
                    }
                    else
                    {
                        this.isover = true;
                    }
                }
            }
            else if (this.emissionType == ParticleEmissionType.burst)
            {
                if (this.curTime > this.burstDelayTime) 
                {
                    this.b = true;
                    this.isover = true;
                }
            }
            return this.b;
        }

        public isOver(): boolean 
        {
            return this.isover;
        }
    }
}