/**
@license
Copyright (c) 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
namespace m4m.framework
{
    /**
     * @private
     */
    export class EmissionBatcher
    {
        public emissionElement: EmissionElement;
        private webgl: WebGL2RenderingContext;
        public gameObject: gameObject;
        public data: Emission;
        public mesh: mesh;
        public mat: material;

        public dataForVbo: Float32Array;
        public dataForEbo: Uint16Array;

        public particles: Particle[] = [];
        private vertexSize: number = 0;
        public vf: number = 0;
        /**
         * 发射器合批
         * @param emissionElement 发射器元素
         */
        constructor(emissionElement: EmissionElement)
        {
            this.emissionElement = emissionElement;
            this.webgl = emissionElement.webgl;
            this.gameObject=emissionElement.gameObject;
            this.vf=emissionElement.vf;
            this.data = emissionElement.emissionData;

            this.vertexSize = m4m.render.meshData.calcByteSize(this.vf) / 4;
            this.initMesh();

            //初始化材质信息
            this.mat = new material();
            if (this.data.mat.shader == null)
            {
                this.mat.setShader(sceneMgr.app.getAssetMgr().getShader("diffuse.shader.json"));
            }
            else
            {
                this.mat.setShader(this.data.mat.shader);
            }
            if (this.data.mat.alphaCut != undefined)
                this.mat.setFloat("_AlphaCut", this.data.mat.alphaCut);
            if (this.data.mat.diffuseTexture != null)
                this.mat.setTexture("_MainTex", this.data.mat.diffuseTexture);
            if (this.data.mat.alphaTexture != null)
                this.mat.setTexture("_AlphaTex", this.data.mat.alphaTexture);
        }
        /**
         * 初始化mesh
         */
        initMesh()
        {
            this.mesh = new mesh();
            this.mesh.data = new render.meshData();
            this.mesh.glMesh = new render.glMesh();
            this.mesh.submesh = [];
            {
                var sm = new subMeshInfo();
                sm.matIndex = 0;
                sm.start = 0;
                sm.size = 0;
                sm.line = false;
                this.mesh.submesh.push(sm);
            }

            this.dataForVbo = new Float32Array(128);
            this.dataForEbo = new Uint16Array(128);
            this.mesh.glMesh.initBuffer(this.webgl, this.vf, 128, render.MeshTypeEnum.Dynamic);
            this.mesh.glMesh.addIndex(this.webgl, this.dataForEbo.length);
            this.mesh.glMesh.initVAO();

        }
        public curVerCount: number = 0;
        public curIndexCount: number = 0;
        /**
         * 添加粒子
         */
        addParticle()
        {
            this.refreshBuffer();

            let p = new Particle(this);
            p.update(0);
            p.uploadData(this.dataForVbo);
            for (let i = 0; i < p.dataForEbo.length; i++)
            {
                this.dataForEbo[this.curIndexCount + i] = p.dataForEbo[i] + this.curVerCount;
            }
            this.particles.push(p);

            this.curVerCount += this.emissionElement.perVertexCount;
            this.curIndexCount += this.emissionElement.perIndexxCount;

            // this.mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            //this.mesh.glMesh.uploadIndexSubData(this.webgl, 0, this.dataForEbo);
            this.mesh.glMesh.uploadIndexData(this.webgl,0,this.dataForEbo);
            this.mesh.submesh[0].size = this.curIndexCount;
        }
        /**
         * 刷新缓冲区
         */
        private refreshBuffer()
        {
            var needvercount = this.curVerCount + this.emissionElement.perVertexCount;
            var needIndexCount = this.curIndexCount + this.emissionElement.perIndexxCount;

            if (needvercount * this.vertexSize > this.dataForVbo.length)
            {
                var length = this.dataForVbo.length;
                this.mesh.glMesh.resetVboSize(this.webgl, length * 2);
                let vbo = new Float32Array(length * 2);
                vbo.set(this.dataForVbo, 0);
                this.dataForVbo = vbo;
            }
            if (needIndexCount > this.dataForEbo.length)
            {
                var length = this.dataForEbo.length;
                this.mesh.glMesh.resetEboSize(this.webgl, 0, length * 2);
                let ebo = new Uint16Array(length * 2);
                ebo.set(this.dataForEbo, 0);
                this.dataForEbo = ebo;
            }
        }
        /**
         * 更新
         * @param delta 
         */
        update(delta: number)
        {
            for (let key in this.particles)
            {
                this.particles[key].update(delta);
                this.particles[key].uploadData(this.dataForVbo);
            }
        }
        /**
         * 执行渲染
         * @param context   渲染上下文 
         * @param assetmgr 资源管理器
         * @param camera 相机
         */
        render(context: renderContext, assetmgr: assetMgr, camera: m4m.framework.camera)
        {
            let mesh = this.mesh;

            //mesh.glMesh.uploadVertexSubData(context.webgl, this.dataForVbo);
            mesh.glMesh.uploadVertexData(context.webgl, this.dataForVbo);
            if (assetmgr.app.getScene().fog)
            {
                // context.fog = assetmgr.app.getScene().fog;
                this.mat.draw(context, mesh, mesh.submesh[0], "base_fog");
            } else
            {
                this.mat.draw(context, mesh, mesh.submesh[0], "base");
            }
        }
        /**
         * 销毁
         */
        dispose()
        {
            this.dataForVbo = null;
            this.dataForEbo = null;
            this.mesh.dispose();
            this.mat.dispose();
            for (let key in this.particles)
            {
                this.particles[key].dispose();
            }
        }
    }
}