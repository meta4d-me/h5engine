namespace gd3d.framework
{
    @reflect.nodeRender
    @reflect.nodeComponent
    @reflect.selfClone
    export class effectSystem implements IRenderer
    {
        gameObject: gameObject;
        layer: RenderLayerEnum = RenderLayerEnum.Transparent;
        renderLayer: CullingMask = CullingMask.default;
        queue: number = 0;
        autoplay: boolean = true;
        //特效数据
        beLoop: boolean;
        state: EffectPlayStateEnum = EffectPlayStateEnum.None;
        private curFrameId: number = -1;
        public frameId: number = 0;
        public static fps: number = 30;
        private playTimer: number = 0;
        private speed: number = 1;
        // private time: number = 0;

        private parser = new gd3d.framework.EffectParser();
        //渲染数据
        public vf = gd3d.render.VertexFormatMask.Position | render.VertexFormatMask.Normal | render.VertexFormatMask.Tangent | render.VertexFormatMask.Color | render.VertexFormatMask.UV0;
        private effectBatchers: EffectBatcher[] = [];
        private particles: Particles;//粒子系统 发射器统一管理
        private matDataGroups: EffectMatData[] = [];

        setEffect(effectConfig: string)
        {
            this.data = this.parser.Parse(effectConfig, gd3d.framework.sceneMgr.app.getAssetMgr());
        }
        @gd3d.reflect.Field("textasset")
        jsonData: textasset;
        setJsonData(_jsonData: textasset)
        {
            this.jsonData = _jsonData;
            this.data = this.parser.Parse(this.jsonData.content, gd3d.framework.sceneMgr.app.getAssetMgr());
        }
        set data(value: EffectSystemData)
        {
            this._data = value;
            this.addElements();
        }
        get data(): EffectSystemData
        {
            return this._data;
        }
        private _data: EffectSystemData;
        start()
        {

        }
        update(delta: number)
        {
            if (this.gameObject.getScene() == null || this.gameObject.getScene() == undefined)
                return;
            if (this.state == EffectPlayStateEnum.Play)
            {
                this.playTimer += delta * this.speed;
                // console.log(this.playTimer);
                if (this.playTimer >= this.data.life)
                {
                    if (this.beLoop)
                    {
                        this.reset();
                        this.play();
                    }
                    else 
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
        mergeLerpAttribData(realUseCurFrameData: EffectAttrsData, curFrameData: EffectFrameData)
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
            if(curAttrsData.meshdataVbo == undefined)
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
                    let r = math.floatClamp(vertexArr[i * vertexSize + 9], 0, 1);
                    let g = math.floatClamp(vertexArr[i * vertexSize + 10], 0, 1);
                    let b = math.floatClamp(vertexArr[i * vertexSize + 11], 0, 1);
                    let a = math.floatClamp(vertexArr[i * vertexSize + 12], 0, 1);
                    if (curAttrsData.color != undefined)
                    {
                        r = math.floatClamp(curAttrsData.color.x, 0, 1);
                        g = math.floatClamp(curAttrsData.color.y, 0, 1);
                        b = math.floatClamp(curAttrsData.color.z, 0, 1);
                    }
                    if (curAttrsData.alpha != undefined)
                        a = math.floatClamp(curAttrsData.alpha * a, 0, 1);//配置的alpha作为整体的百分比使用 源alpha依然是具体顶点的
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 9] = r;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 10] = g;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 11] = b;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * 15 + 12] = a;
                }
                {
                    //uv
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 13] = vertexArr[i * vertexSize + 13] * curAttrsData.tilling.x + curAttrsData.uv.x;
                    effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 14] = vertexArr[i * vertexSize + 14] * curAttrsData.tilling.y + curAttrsData.uv.y;
                    // console.log(effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 13] + "   " + effectBatcher.dataForVbo[(vertexStartIndex + i) * vertexSize + 14]);
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
                        if(mesh.glMesh.ebos.length == 0)
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
                    subEffectBatcher.mat.draw(context, mesh, mesh.submesh[0], "base");//只有一个submesh
                }
                if (this.particles != undefined)
                {
                    this.particles.render(context, assetmgr, camera);
                }
            }
        }
        clone()
        {
            let effect = new effectSystem();
            effect.data = this.data.clone();
            return effect;

        }
        /**
         * 播放特效
         */
        play(speed: number = 1)
        {
            this.speed = speed;
            this.state = EffectPlayStateEnum.Play;
            this.gameObject.visible = true;
            this.gameObject.transform.markDirty();
        }
        /**
         * 暂停播放
         * @memberof effectSystem
         */
        pause()
        {
            this.state = EffectPlayStateEnum.Pause;
        }
        /**
         * 停止播放
         * @memberof effectSystem
         */
        stop()
        {
            this.reset();
            this.state = EffectPlayStateEnum.Stop;
        }
        /**
         * 重置到初始状态
         * @memberof effectSystem
         */
        reset()
        {
            this.state = EffectPlayStateEnum.BeReady;
            this.gameObject.visible = false;
            this.playTimer = 0;
            for (let i in this.effectBatchers)
            {
                let subEffectBatcher = this.effectBatchers[i];
                for (let key in subEffectBatcher.effectElements)
                {
                    let element = subEffectBatcher.effectElements[key];
                    element.setActive(true);
                    if (element.data.initFrameData != undefined)//引用问题还没处理
                        element.curAttrData = element.data.initFrameData.attrsData.clone();
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
                    this.particles.addEmission(data.emissionData);
                }
                else if (data.type == EffectElementTypeEnum.SingleMeshType)
                {
                    this.addInitFrame(data);
                }

                // this.recordElementLerpAttributes(data);
            }

            this.state = EffectPlayStateEnum.BeReady;
            if (this.data.life == 0)
                this.beLoop = true;
            else
                this.beLoop = false;
        }

        /**
        * 根据初始化帧的数据，初始effectbatcher。根据mesh的材质增加或者合并mesh。同材质的就合并。
        */
        private addInitFrame(elementData: EffectElementData)
        {
            let element: EffectElement = new EffectElement(elementData);
            element.gameobject = this.gameObject.transform;
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

                this.effectBatchers.push(subEffectBatcher);
                this.matDataGroups.push(_initFrameData.attrsData.mat);

            }
            element.effectBatcher = subEffectBatcher;
            element.startIndex = vertexStartIndex;
            element.curAttrData = elementData.initFrameData.attrsData.clone();
            let vertexSize = subEffectBatcher.vertexSize;
            let vertexArr = _initFrameData.attrsData.mesh.data.genVertexDataArray(this.vf);
            
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
         * 计算当前的frameid
         * 
         * @private
         * 
         * @memberof effectSystem
         */
        private checkFrameId(): boolean
        {
            let curid = (effectSystem.fps * this.playTimer) | 0;
            if (curid != this.curFrameId)
            {
                this.curFrameId = curid;
                return true;
            }
            return false;
        }

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
