namespace gd3d.framework
{
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 特效组件
     * @version egret-gd3d 1.0
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    @reflect.selfClone
    export class effectSystem implements IRenderer
    {
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 挂载的gameobject
         * @version egret-gd3d 1.0
         */
        gameObject: gameObject;
        layer: RenderLayerEnum = RenderLayerEnum.Transparent;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version egret-gd3d 1.0
         */
        renderLayer: CullingMask = CullingMask.default;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同层级渲染排序依据
         * @version egret-gd3d 1.0
         */
        queue: number = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 自动播放
         * @version egret-gd3d 1.0
         */
        autoplay: boolean = true;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效是否循环
         * @version egret-gd3d 1.0
         */
        beLoop: boolean;
         /**
         * @private
         */
        state: EffectPlayStateEnum = EffectPlayStateEnum.None;
        private curFrameId: number = -1;
         /**
         * @private
         */
        public frameId: number = 0;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 特效播放速度
         * @version egret-gd3d 1.0
         */
        public static fps: number = 30;
        private playTimer: number = 0;
        private speed: number = 1;
         /**
         * @private
         */
        public webgl:WebGLRenderingContext;
        // private time: number = 0;

        private parser = new gd3d.framework.EffectParser();
         /**
         * @private
         */
        public vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
         /**
         * @private
         */
        //public particleVF=gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;//法线切线不要

        private effectBatchers: EffectBatcher[] = [];
        private particles: Particles;//粒子系统 发射器统一管理
        private matDataGroups: EffectMatData[] = [];
         /**
         * @private
         */
        @gd3d.reflect.Field("textasset")
        jsonData: textasset;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置特效数据 textasset
         * @version egret-gd3d 1.0
         */
        setJsonData(_jsonData: textasset)
        {
            this.webgl=gd3d.framework.sceneMgr.app.webgl;
            this.jsonData = _jsonData;
            this.data = this.parser.Parse(this.jsonData.content, gd3d.framework.sceneMgr.app.getAssetMgr());
        }
         /**
         * @private
         */
        set data(value: EffectSystemData)
        {
            this._data = value;
        }
         /**
         * @private
         */
        get data(): EffectSystemData
        {
            return this._data;
        }
         /**
         * @private
         */
        init()
        {
            if (this._data)
            {
                this.addElements();
            }
        }
        private _data: EffectSystemData;
         /**
         * @private
         */
        get totalFrameCount(): number
        {
            return this.data.life * effectSystem.fps;
        }

        start()
        {
            this.init();
        }
        update(delta: number)
        {
            if (this.gameObject.getScene() == null || this.gameObject.getScene() == undefined)
                return;
            if (this.state == EffectPlayStateEnum.Play || this.state == EffectPlayStateEnum.Pause)
            {
                if (this.state == EffectPlayStateEnum.Play)
                    this.playTimer += delta * this.speed;
                if(!this.beLoop)
                {
                   if (this.playTimer >= this.data.life)
                   {
                       this.stop();
                   }
                }
                this._update(delta);
            }
            else if (this.state == EffectPlayStateEnum.BeReady)
            {
                if (this.autoplay)
                {
                    this.play();
                }
                else
                {
                    this.gameObject.visible = false;
                    this.gameObject.transform.markDirty();
                }
            }
        }
        /**
         * 更新特效数据
         * 
         * @private
         * @param {number} delta 
         * 
         * @memberof effectSystem
         */
        private _update(delta: number)
        {
            if (this.checkFrameId())
            {
                for (let i in this.effectBatchers)
                {
                    let subEffectBatcher = this.effectBatchers[i];
                    for (let key in subEffectBatcher.effectElements)
                    {
                        let element = subEffectBatcher.effectElements[key];
                        let frameId = this.curFrameId % element.loopFrame;
                        if (element.active)
                        {
                            element.actionActive = false;
                            this.mergeLerpAttribData(element.curAttrData, element.timelineFrame[frameId]);
                            if (element.actions != undefined)
                            {
                                element.actionActive = true;
                                for (let j in element.actions)
                                {
                                    element.actions[j].update(frameId);
                                }
                            }
                        }
                        element.update();
                        if (element.isActiveFrame(frameId))
                        {
                            this.updateEffectBatcher(element.effectBatcher, element.curAttrData, element.data.initFrameData, element.startIndex);
                        }
                    }
                }
                if (this.particles != undefined)
                {
                    this.frameId = this.curFrameId % this.particles.loopFrame;
                    this.particles.update(1 / effectSystem.fps);
                }
            }

        }

        /**
         * 将插值信息合并到当前帧数据
         * 
         * @param {EffectAttrsData} realUseCurFrameData 
         * @param {EffectFrameData} curFrameData 
         * @returns 
         * 
         * @memberof effectSystem
         */
        private mergeLerpAttribData(realUseCurFrameData: EffectAttrsData, curFrameData: EffectFrameData)
        {
            if (curFrameData == undefined)
                return;
            if (realUseCurFrameData == undefined)//这里可能是个bug
                return;
            for (let key in curFrameData.attrsData)
            {
                if (curFrameData.attrsData[key] != undefined && realUseCurFrameData[key] != undefined)
                {
                    let val = curFrameData.attrsData.getAttribute(key);
                    if (val == null)
                        continue;
                    if (val instanceof math.vector3 || val instanceof math.vector2 || typeof (val) === 'number')
                    {
                        if (key != "renderModel")
                            realUseCurFrameData[key] = val;
                    }
                }
            }
        }

        /**
         * 根据当前帧的数据更新EffectBatcher中的vbo，ebo信息
         * 
         * @private
         * @param {EffectBatcher} effectBatcher 
         * @param {EffectAttrsData} curAttrsData 
         * @param {EffectFrameData} initFrameData 
         * @param {number} vertexStartIndex 
         * @param {number} delta 
         * @returns 
         * 
         * @memberof effectSystem
         */
        private updateEffectBatcher(effectBatcher: EffectBatcher, curAttrsData: EffectAttrsData, initFrameData: EffectFrameData, vertexStartIndex: number)
        {
            let mesh = curAttrsData.mesh;
            if (mesh == undefined)
            {
                mesh = initFrameData.attrsData.mesh;
            }
            if (mesh == undefined)
                return;
            if (curAttrsData.meshdataVbo == undefined)
            {
                curAttrsData.meshdataVbo = mesh.data.genVertexDataArray(this.vf);
            }
            let vertexCount = mesh.data.pos.length;//顶点数量
            let vertexArr = curAttrsData.meshdataVbo;
            let vertexSize = effectBatcher.vertexSize;
            for (let i = 0; i < vertexCount; i++)
            {
                {//postion
                    let vertex = gd3d.math.pool.new_vector3();
                    vertex.x = vertexArr[i * vertexSize + 0];
                    vertex.y = vertexArr[i * vertexSize + 1];
                    vertex.z = vertexArr[i * vertexSize + 2];

                    gd3d.math.matrixTransformVector3(vertex, curAttrsData.matrix, vertex);

                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 0] = vertex.x;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 1] = vertex.y;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 2] = vertex.z;
                    gd3d.math.pool.delete_vector3(vertex);
                }

                {//color
                    //处理一下颜色，以防灰度值 > 1
                    let r = vertexArr[i * vertexSize + 9];
                    let g = vertexArr[i * vertexSize + 10];
                    let b = vertexArr[i * vertexSize + 11];
                    let a = vertexArr[i * vertexSize + 12];
                    if (curAttrsData.color != undefined)
                    {
                        r = curAttrsData.color.x;
                        g = curAttrsData.color.y;
                        b = curAttrsData.color.z;
                    }
                    if (curAttrsData.alpha != undefined)
                        a =a*curAttrsData.alpha;//配置的alpha作为整体的百分比使用 源alpha依然是具体顶点的
                    if (curAttrsData.colorRate != undefined)
                    {
                        r *= curAttrsData.colorRate;
                        g *= curAttrsData.colorRate;
                        b *= curAttrsData.colorRate;
                        a *= curAttrsData.colorRate;
                    }

                    r = math.floatClamp(r, 0, 3);
                    g = math.floatClamp(g, 0, 3);
                    b = math.floatClamp(b, 0, 3);
                    a = math.floatClamp(a, 0, 3);

                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 9] = r;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 10] = g;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 11] = b;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 12] = a;
                }
                {
                    //uv
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 13] = vertexArr[i * vertexSize + 13] * curAttrsData.tilling.x + curAttrsData.uv.x;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 14] = vertexArr[i * vertexSize + 14] * curAttrsData.tilling.y + curAttrsData.uv.y;
                }
            }
        }

        /**
         * 提交各个EffectBatcher中的数据进行渲染
         * 
         * @param {renderContext} context 
         * @param {assetMgr} assetmgr 
         * @param {gd3d.framework.camera} camera 
         * 
         * @memberof effectSystem
         */
        render(context: renderContext, assetmgr: assetMgr, camera: gd3d.framework.camera)
        {
            //if (!(camera.CullingMask & this.renderLayer)) return;
            if (this.state == EffectPlayStateEnum.Play)
            {
                context.updateModel(this.gameObject.transform);
                for (let i in this.effectBatchers)
                {
                    let subEffectBatcher = this.effectBatchers[i];
                    let mesh = subEffectBatcher.mesh;
                    if (!subEffectBatcher.beBufferInited)
                    {
                        mesh.glMesh.initBuffer(context.webgl, this.vf, subEffectBatcher.curTotalVertexCount);
                        if (mesh.glMesh.ebos.length == 0)
                        {
                            mesh.glMesh.addIndex(context.webgl, subEffectBatcher.dataForEbo.length);
                        }
                        else
                        {
                            mesh.glMesh.resetEboSize(context.webgl, 0, subEffectBatcher.dataForEbo.length);
                        }
                        mesh.glMesh.uploadIndexSubData(context.webgl, 0, subEffectBatcher.dataForEbo);
                        mesh.submesh[0].size = subEffectBatcher.dataForEbo.length;
                        subEffectBatcher.beBufferInited = true;
                    }
                    mesh.glMesh.uploadVertexSubData(context.webgl, subEffectBatcher.dataForVbo);
                    if (this.gameObject.getScene().fog)
                    {
                        context.fog = this.gameObject.getScene().fog;
                        subEffectBatcher.mat.draw(context, mesh, mesh.submesh[0], "base_fog");//只有一个submesh
                    } else
                    {
                        subEffectBatcher.mat.draw(context, mesh, mesh.submesh[0], "base");//只有一个submesh
                    }
                }
                if (this.particles != undefined)
                {
                    this.particles.render(context, assetmgr, camera);
                }
            }
        }
        /**
         * @private
         */
        clone()
        {
            let effect = new effectSystem();
            effect.data = this.data.clone();
            return effect;

        }
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 播放特效
         * @version egret-gd3d 1.0
         */
        play(speed: number = 1)
        {
            this.speed = speed;
            this.state = EffectPlayStateEnum.Play;
            this.gameObject.visible = true;
            this.gameObject.transform.markDirty();
        }
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 暂停播放
         * @version egret-gd3d 1.0
         */
        pause()
        {
            this.state = EffectPlayStateEnum.Pause;
        }
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 停止播放
         * @version egret-gd3d 1.0
         */
        stop()
        {
            this.reset();
            this.state = EffectPlayStateEnum.Stop;
        }
        /**
         * @public
         * @language zh_CN
         * @param speed 播放速度
         * @classdesc
         * 重置到初始状态
         * @version egret-gd3d 1.0
         */
        reset(restSinglemesh:boolean=true,resetParticle:boolean=true)
        {
            this.state = EffectPlayStateEnum.BeReady;
            this.gameObject.visible = false;
            this.playTimer = 0;

            this.resetSingleMesh();
            this.resetparticle();
        }
        private resetSingleMesh()
        {
            for (let i in this.effectBatchers)
            {
                let subEffectBatcher = this.effectBatchers[i];
                for (let key in subEffectBatcher.effectElements)
                {
                    let element = subEffectBatcher.effectElements[key];
                    element.setActive(true);
                    if (element.data.initFrameData != undefined)//引用问题还没处理
                        element.curAttrData = element.data.initFrameData.attrsData.copyandinit();
                }
            }
        }
        private resetparticle()
        {
            if (this.particles != undefined)
                this.particles.dispose();

            for (let index in this.data.elements)
            {
                let data = this.data.elements[index];
                if (data.type == EffectElementTypeEnum.EmissionType)
                {
                    if (this.particles == undefined)
                    {
                        this.particles = new Particles(this);
                    }
                    this.particles.addEmission(data);
                }
            }
        }


        /**
         * 向特效中增加元素
         */
        private addElements()
        {
            for (let index in this.data.elements)
            {
                let data = this.data.elements[index];
                if (data.type == EffectElementTypeEnum.EmissionType)
                {
                    if (this.particles == undefined)
                    {
                        this.particles = new Particles(this);
                    }
                    this.particles.addEmission(data);
                }
                else if (data.type == EffectElementTypeEnum.SingleMeshType)
                {
                    this.addInitFrame(data);
                }

                // this.recordElementLerpAttributes(data);
            }

            this.state = EffectPlayStateEnum.BeReady;
            this.beLoop = this.data.beLoop;
        }

        /**
        * 根据初始化帧的数据，初始effectbatcher。根据mesh的材质增加或者合并mesh。同材质的就合并。
        */
        private addInitFrame(elementData: EffectElementData)
        {
            let element: EffectElement = new EffectElement(elementData);
            element.transform = this.gameObject.transform;
            let _initFrameData = element.data.initFrameData;
            if (_initFrameData == undefined || _initFrameData.attrsData == undefined || _initFrameData.attrsData.mesh == undefined)//初始化帧如果不存在,或者没有设置mesh信息，就不处理这个元素
                return;
            let index = -1;
            if (_initFrameData.attrsData.mat != null)
            {
                for (let i = 0; i < this.matDataGroups.length; i++)
                {
                    if (EffectMatData.beEqual(this.matDataGroups[i], _initFrameData.attrsData.mat))
                    {
                        index = i;
                        break;
                    }
                }
            }
            let vertexStartIndex = 0;
            let vertexCount = _initFrameData.attrsData.mesh.data.pos.length;//顶点数量
            let subEffectBatcher: EffectBatcher = null;
            if (index >= 0)
            {
                subEffectBatcher = this.effectBatchers[index];
                vertexStartIndex = subEffectBatcher.curTotalVertexCount;
                subEffectBatcher.curTotalVertexCount += vertexCount;
            } else
            {
                subEffectBatcher = new EffectBatcher(this.vf);
                subEffectBatcher.curTotalVertexCount = vertexCount;
                subEffectBatcher.mesh = new mesh();
                subEffectBatcher.mesh.data = new render.meshData();
                subEffectBatcher.mesh.glMesh = new render.glMesh();
                subEffectBatcher.mat = new material();
                subEffectBatcher.mesh.submesh = [];
                {
                    var sm = new subMeshInfo();
                    sm.matIndex = 0;
                    sm.useVertexIndex = 0;
                    sm.start = 0;
                    sm.size = 0;
                    sm.line = false;
                    subEffectBatcher.mesh.submesh.push(sm);
                }

                vertexStartIndex = 0;
                index = 0;
                if (_initFrameData.attrsData.mat.shader == null)
                {
                    subEffectBatcher.mat.setShader(sceneMgr.app.getAssetMgr().getShader("diffuse.shader.json"));
                    console.error("特效{0}shader为空", elementData.name);
                } else
                {
                    subEffectBatcher.mat.setShader(_initFrameData.attrsData.mat.shader);
                }

                if (_initFrameData.attrsData.mat.alphaCut != undefined)
                    subEffectBatcher.mat.setFloat("_AlphaCut", _initFrameData.attrsData.mat.alphaCut);
                if (_initFrameData.attrsData.mat.diffuseTexture != null)
                    subEffectBatcher.mat.setTexture("_MainTex", _initFrameData.attrsData.mat.diffuseTexture);
                if (_initFrameData.attrsData.mat.alphaTexture != null)
                    subEffectBatcher.mat.setTexture("_AlphaTex", _initFrameData.attrsData.mat.alphaTexture);
                this.effectBatchers.push(subEffectBatcher);
                this.matDataGroups.push(_initFrameData.attrsData.mat);

            }
            element.effectBatcher = subEffectBatcher;
            element.startIndex = vertexStartIndex;
            element.curAttrData = elementData.initFrameData.attrsData.copyandinit();
            let vertexSize = subEffectBatcher.vertexSize;
            let vertexArr = _initFrameData.attrsData.mesh.data.genVertexDataArray(this.vf);
            // if (_initFrameData.attrsData.startEuler)
            //  {
            //     _initFrameData.attrsData.startRotation = new gd3d.math.quaternion();
            //     gd3d.math.quatFromEulerAngles(_initFrameData.attrsData.startEuler.x, _initFrameData.attrsData.startEuler.y, _initFrameData.attrsData.startEuler.z, _initFrameData.attrsData.startRotation);
            // }
            element.update();

            subEffectBatcher.effectElements.push(element);
            for (let i = 0; i < vertexCount; i++)
            {
                {//postion
                    let vertex = gd3d.math.pool.new_vector3();
                    vertex.x = vertexArr[i * vertexSize + 0];
                    vertex.y = vertexArr[i * vertexSize + 1];
                    vertex.z = vertexArr[i * vertexSize + 2];

                    gd3d.math.matrixTransformVector3(vertex, element.curAttrData.matrix, vertex);

                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 0] = vertex.x;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 1] = vertex.y;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 2] = vertex.z;
                    gd3d.math.pool.delete_vector3(vertex);
                }
                {//normal
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 3] = vertexArr[i * vertexSize + 3];
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 4] = vertexArr[i * vertexSize + 4];
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 5] = vertexArr[i * vertexSize + 5];
                }

                {//tangent
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 6] = vertexArr[i * vertexSize + 6];
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 7] = vertexArr[i * vertexSize + 7];
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 8] = vertexArr[i * vertexSize + 8];
                }
                {//color
                    //处理一下颜色，以防灰度值 > 1\
                    let r = math.floatClamp(element.curAttrData.color.x, 0, 1);
                    let g = math.floatClamp(element.curAttrData.color.y, 0, 1);
                    let b = math.floatClamp(element.curAttrData.color.z, 0, 1);
                    let a = math.floatClamp(vertexArr[i * vertexSize + 12] * element.curAttrData.alpha, 0, 1);


                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 9] = r;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 10] = g;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 11] = b;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 12] = a;

                }
                {//uv
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 13] = vertexArr[i * vertexSize + 13] * element.curAttrData.tilling.x;
                    subEffectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 14] = vertexArr[i * vertexSize + 14] * element.curAttrData.tilling.y;
                    //  this.dataForVbo[(this._vercount + i) * total + 13] = vertexArr[i * total + 13] * materialData.tiling.x + materialData.offset.x;
                    // this.dataForVbo[(this._vercount + i) * total + 14] = vertexArr[i * total + 14] * materialData.tiling.y + materialData.offset.y;
                }
            }

            //index
            var indexArray = _initFrameData.attrsData.mesh.data.genIndexDataArray();
            let _startIndex = subEffectBatcher.indexStartIndex;
            subEffectBatcher.indexStartIndex += indexArray.length;

            for (var i = 0; i < indexArray.length; i++)
            {
                subEffectBatcher.dataForEbo[_startIndex + i] = indexArray[i] + vertexStartIndex;
            }
            this.effectBatchers[index].beBufferInited = false;

        }
         /**
         * @private
         */
        public setFrameId(id: number)
        {
            if (this.state == EffectPlayStateEnum.Pause && id >= 0 && id < this.totalFrameCount)
                this.curFrameId = id;
        }

        /**
         * 计算当前的frameid
         * 
         * @private
         * 
         * @memberof effectSystem
         */
        private checkFrameId(): boolean
        {
            // if(this.state == EffectPlayStateEnum.Pause)
            //     return true;
            let curid = (effectSystem.fps * this.playTimer) | 0;
            if (curid != this.curFrameId)
            {
                if (this.state == EffectPlayStateEnum.Play)
                    this.curFrameId = curid;
                return true;
            }
            return false;
        }
         /**
         * @private
         */
        remove()
        {
            this.state = EffectPlayStateEnum.Dispose;
            this.data.dispose();
            for (let key in this.effectBatchers)
            {
                this.effectBatchers[key].dispose();
            }
            if (this.particles)
                this.particles.dispose();
        }
         /**
         * @private
         * 临时测试时显示使用
         * @readonly
         * @type {number}
         * @memberof effectSystem
         */
        public get leftLifeTime(): number
        {
            if (this.data != null)
            {
                return this.data.life - this.playTimer;
            } else
                return 9999999999;
        }
    }
}
