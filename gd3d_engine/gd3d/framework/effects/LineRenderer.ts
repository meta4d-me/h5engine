namespace gd3d.framework
{
    /**
     * The line renderer is used to draw free-floating lines in 3D space.
     * 
     * 线渲染器用于在三维空间中绘制自由浮动的线。
     */
    @reflect.nodeRender
    @reflect.nodeComponent
    export class LineRenderer implements IRenderer
    {
        static readonly ClassName: string = "linerenderer";

        private mesh = new gd3d.framework.mesh("LineRenderer" + ".mesh.bin");

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * mesh的材质数组
         * @version gd3d 1.0
         */
        @gd3d.reflect.Field("material")
        material: material;

        layer: RenderLayerEnum = RenderLayerEnum.Transparent;

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 渲染层级
         * @version gd3d 1.0
         */
        //renderLayer: CullingMask = CullingMask.default;
        get renderLayer() { return this.gameObject.layer; }
        set renderLayer(layer: number)
        {
            this.gameObject.layer = layer;
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 同场景渲染层级时候先后排序依据
         * @version gd3d 1.0
         */
        queue: number = 0;

        get transform()
        {
            return this.gameObject && this.gameObject.transform;
        }

        gameObject: gameObject;

        /**
         * Connect the start and end positions of the line together to form a continuous loop.
         * 
         * 将直线的起点和终点连接在一起，形成一个连续的回路。
         */
        loop = false;

        /**
         * 是否使用曲线。
         */
        useCurve = false;

        /**
         * 曲线采样频率。
         */
        curveSamples = 10;

        /**
         * 顶点列表。
         */
        positions: math.vector3[] = [];

        /**
         * 曲线宽度。
         */
        lineWidth = serialization.setValue(new MinMaxCurve(), { between0And1: true, curveMultiplier: 0.1, mode: MinMaxCurveMode.Curve });

        /**
         * 
         * 线条颜色。
         */
        lineColor = serialization.setValue(new MinMaxGradient(), { mode: MinMaxGradientMode.Gradient });

        /**
         * Set this to a value greater than 0, to get rounded corners between each segment of the line.
         * 
         * 将此值设置为大于0的值，以在直线的每个线段之间获取圆角。
         */
        numCornerVertices = 0;

        /**
         * Set this to a value greater than 0, to get rounded corners on each end of the line.
         * 
         * 将此值设置为大于0的值，以在行的两端获得圆角。
         */
        numCapVertices = 0;

        /**
         * Select whether the line will face the camera, or the orientation of the Transform Component.
         * 
         * 选择线是否将面对摄像机，或转换组件的方向。
         */
        // alignment = LineAlignment.View;
        alignment = LineAlignment.TransformZ;

        /**
         * Choose whether the U coordinate of the line texture is tiled or stretched.
         * 
         * 选择是平铺还是拉伸线纹理的U坐标。
         */
        textureMode = LineTextureMode.Stretch;

        /**
         * Apply a shadow bias to prevent self-shadowing artifacts. The specified value is the proportion of the line width at each segment.
         * 
         * 应用阴影偏差以防止自阴影伪影。指定的值是每段线宽的比例。
         */
        shadowBias = 0.5;

        /**
         * Configures a line to generate Normals and Tangents. With this data, Scene lighting can affect the line via Normal Maps and the Unity Standard Shader, or your own custom-built Shaders.
         * 
         * 是否自动生成灯光所需的法线与切线。
         */
        generateLightingData = false;

        /**
         * If enabled, the lines are defined in world space.
         * 
         * 如果启用，则在世界空间中定义线。
         */
        useWorldSpace = false;

        /**
         * Set the curve describing the width of the line at various points along its length.
         * 
         * 设置曲线，以描述沿线长度在各个点处的线宽。
         */
        get widthCurve()
        {
            return this.lineWidth.curve;
        }

        set widthCurve(v)
        {
            this.lineWidth.curve = v;
        }

        /**
         * Set an overall multiplier that is applied to the LineRenderer.widthCurve to get the final width of the line.
         * 
         * 设置一个应用于LineRenderer.widthCurve的总乘数，以获取线的最终宽度。
         */
        get widthMultiplier()
        {
            return this.lineWidth.curveMultiplier;
        }

        set widthMultiplier(v)
        {
            this.lineWidth.curveMultiplier = v;
        }

        /**
         * Set the color gradient describing the color of the line at various points along its length.
         * 
         * 设置颜色渐变，以描述线条沿其长度的各个点的颜色。
         */
        get colorGradient()
        {
            return this.lineColor.gradient;
        }

        set colorGradient(v)
        {
            this.lineColor.gradient = v;
        }

        /**
         * Set the color at the end of the line.
         * 
         * 设置线尾颜色。
         */
        get endColor()
        {
            var color4 = new math.color();
            var color3 = this.colorGradient.colorKeys[this.colorGradient.colorKeys.length - 1];
            var alpha = this.colorGradient.alphaKeys[this.colorGradient.alphaKeys.length - 1];

            color4.r = color3.color.r;
            color4.g = color3.color.g;
            color4.b = color3.color.b;
            color4.a = alpha.alpha;
            return color4;
        }

        set endColor(v)
        {
            this.colorGradient.alphaKeys[this.colorGradient.alphaKeys.length - 1].alpha = v.a
            var color = this.colorGradient.colorKeys[this.colorGradient.colorKeys.length - 1].color;

            color.r = v.r;
            color.g = v.g;
            color.b = v.b;
        }

        /**
         * Set the width at the end of the line.
         * 
         * 设置线尾宽度。
         */
        get endWidth()
        {
            return this.widthCurve.keys[this.widthCurve.keys.length - 1].value;
        }

        set endWidth(v)
        {
            this.widthCurve.keys[this.widthCurve.keys.length - 1].value = v;
        }

        /**
         * Set/get the number of vertices.
         * 
         * 设置/获取顶点数。
         */
        get positionCount()
        {
            return this.positions.length;
        }

        set positionCount(v)
        {
            this.positions.length = v;
        }

        /**
         * Set the color at the start of the line.
         * 
         * 设置行线头颜色。
         */
        get startColor()
        {
            var color4 = new math.color();
            var color3 = this.colorGradient.colorKeys[0];
            var alpha = this.colorGradient.alphaKeys[0];
            color4.r = color3.color.r;
            color4.g = color3.color.g;
            color4.b = color3.color.b;
            color4.a = alpha.alpha;
            return color4;
        }

        set startColor(v)
        {
            this.colorGradient.alphaKeys[0].alpha = v.a
            var color = this.colorGradient.colorKeys[0].color;
            color.r = v.r;
            color.g = v.g;
            color.b = v.b;
        }

        /**
         * Set the width at the start of the line.
         * 
         * 设置线头宽度
         */
        get startWidth()
        {
            return this.widthCurve.keys[0].value * this.widthMultiplier;
        }

        set startWidth(v)
        {
            this.widthCurve.keys[0].value = v / this.widthMultiplier;
        }

        @gd3d.reflect.Field("LineRendererData")
        get lineRendererData()
        {
            return this._lineRendererData;
        }

        set lineRendererData(v)
        {
            var data = LineRendererData.get(v.value);
            if (data.objectData)
            {
                serialization.setValue(this, data.objectData);
            } else
            {
                data.lineRenderer = this;
            }
            this._lineRendererData = data;
        }
        private _lineRendererData: LineRendererData;

        render(context: renderContext, assetmgr: assetMgr, camera: camera)
        {
            math.matrixClone(this.transform.getWorldMatrix(), this.localToWorldMatrix);
            math.matrixInverse(this.localToWorldMatrix, this.worldToLocalMatrix);

            if (!this.material)
            {
                this.material = sceneMgr.app.getAssetMgr().getDefLineRendererMat();
            }

            // 清理网格
            LineRenderer.clearMesh(this.mesh);

            // 烘焙网格
            this.BakeMesh(this.mesh, camera, false);

            if (this.positions.length < 2) return;

            // 上传网格数据
            LineRenderer.uploadMesh(this.mesh, assetmgr.webgl);

            // 绘制
            LineRenderer.draw(context, this.gameObject, this.mesh, this.material);
        }

        onPlay()
        {

        }

        start()
        {

        }

        /**
         * 每帧执行
         */
        update(interval?: number)
        {

        }

        remove()
        {
            throw "未实现";
        }

        clone()
        {
            throw "未实现";
        }

        /**
         * Creates a snapshot of LineRenderer and stores it in mesh.
         * 
         * 创建LineRenderer的快照并将其存储在网格中。
         * 
         * @param mesh	A static mesh that will receive the snapshot of the line. 
         * @param camera	The camera used for determining which way camera-space lines will face.
         * @param useTransform	Include the rotation and scale of the Transform in the baked mesh.
         */
        BakeMesh(mesh: mesh, camera: camera, useTransform: boolean)
        {
            var positions = this.positions.concat();
            // 移除重复点
            positions = positions.filter((p, i) =>
            {
                if (i == 0) return true;
                if (math.vec3Distance(p, positions[i - 1]) < 0.01)
                    return false;
                return true;
            });
            if (positions.length < 2) return;

            var textureMode = this.textureMode;
            var loop = this.loop;
            var lineWidth = this.lineWidth;
            var alignment = this.alignment;
            var colorGradient = this.colorGradient;

            // 计算摄像机本地坐标
            var cameraPosition = new math.vector3();
            math.vec3Clone(camera.gameObject.transform.getWorldPosition(), cameraPosition);
            math.matrixTransformVector3(cameraPosition, this.worldToLocalMatrix, cameraPosition);

            // 计算线条总长度
            var totalLength = LineRenderer.calcTotalLength(positions, loop);

            // 计算结点所在线段位置
            var rateAtLines = LineRenderer.calcRateAtLines(positions, loop, textureMode);

            if (this.useCurve)
            {
                LineRenderer.calcPositionsToCurve(positions, loop, rateAtLines, loop ? (this.curveSamples * this.positionCount) : (this.positionCount + (this.curveSamples - 1) * (this.positionCount - 1)));
            }

            // 计算结点的顶点
            var positionVertex = LineRenderer.calcPositionVertex(positions, loop, rateAtLines, lineWidth, alignment, cameraPosition);

            // 计算线条拐点接缝
            LineRenderer.calcCornerVertices(this.numCornerVertices, positionVertex);

            // 计算两端帽子
            if (!loop)
            {
                LineRenderer.calcCapVertices(this.numCapVertices, positionVertex, true);
                LineRenderer.calcCapVertices(this.numCapVertices, positionVertex, false);
            }

            // 计算网格
            LineRenderer.calcMesh(positionVertex, textureMode, colorGradient, totalLength, mesh);
        }

        /**
         * Get the position of a vertex in the line.
         * 
         * 获取直线在顶点的位置。
         * 
         * @param index	The index of the position to retrieve.
         */
        GetPosition(index: number)
        {
            return this.positions[index];
        }

        /**
         * Get the positions of all vertices in the line.
         * 
         * 获取行中所有顶点的位置。
         * 
         * @param positions	The array of positions to retrieve. The array passed should be of at least positionCount in size.
         * 
         * @returns How many positions were actually stored in the output array.
         */
        GetPositions(positions: math.vector3[] = [])
        {
            positions.length = this.positions.length;
            for (let i = 0; i < this.positions.length; i++)
            {
                positions[i] = positions[i] || new math.vector3();
                positions[i].x = this.positions[i].x;
                positions[i].y = this.positions[i].y;
                positions[i].z = this.positions[i].z;
            }
            return positions;
        }

        /**
         * Set the position of a vertex in the line.
         * 
         * 设置顶点在直线中的位置。
         * 
         * @param index	Which position to set.
         * @param position	The new position.
         */
        setPosition(index: number, position: math.vector3)
        {
            this.positions[index].x = position.x;
            this.positions[index].y = position.y;
            this.positions[index].z = position.z;
        }

        /**
         * Set the positions of all vertices in the line.
         * 
         * 设置线中所有顶点的位置。
         * 
         * @param positions	The array of positions to set.
         */
        SetPositions(positions: math.vector3[])
        {
            this.positions.length = positions.length;
            for (let i = 0; i < positions.length; i++)
            {
                this.positions[i] = this.positions[i] || new math.vector3();
                this.positions[i].x = positions[i].x;
                this.positions[i].y = positions[i].y;
                this.positions[i].z = positions[i].z;
            }
        }

        /**
         * Generates a simplified version of the original line by removing points that fall within the specified tolerance.
         * 
         * 通过删除落在指定公差范围内的点，生成原始线的简化版本。
         * 
         * @param tolerance	This value is used to evaluate which points should be removed from the line. A higher value results in a simpler line (less points). A positive value close to zero results in a line with little to no reduction. A value of zero or less has no effect.
         * 
         * @todo
         */
        Simplify(tolerance: number)
        {

        }

        private localToWorldMatrix = new math.matrix();
        private worldToLocalMatrix = new math.matrix();


        /**
         * 绘制
         * 
         * @param context 
         * @param go 游戏对象
         * @param mesh 网格
         * @param material 材质
         */
        static draw(context: renderContext, go: gameObject, mesh: mesh, material: material)
        {
            DrawCallInfo.inc.currentState = DrawCallEnum.EffectSystem;
            let tran = go.transform;

            context.updateLightMask(go.layer);
            context.updateModel(tran);
            if (!material) return;
            if (mesh == null || mesh.glMesh == null || mesh.submesh == null) return;
            let subMeshs = mesh.submesh;
            if (subMeshs == null) return;

            mesh.glMesh.bindVboBuffer(context.webgl);

            material.draw(context, mesh, subMeshs[0]);
        }

        /**
         * 清理网格
         * 
         * @param mesh 
         */
        static clearMesh(mesh: mesh)
        {
            if (!mesh.data)
            {
                mesh.data = new gd3d.render.meshData();
            }
            var data = mesh.data
            data.pos = [];
            data.trisindex = [];
            data.normal = [];
            data.tangent = [];
            data.uv = [];
            data.color = [];
        }

        static uploadMesh(_mesh: mesh, webgl: WebGLRenderingContext)
        {
            var vf = gd3d.render.VertexFormatMask.Position | gd3d.render.VertexFormatMask.Normal | gd3d.render.VertexFormatMask.Tangent | gd3d.render.VertexFormatMask.Color | gd3d.render.VertexFormatMask.UV0;
            _mesh.data.originVF = vf;
            var v32 = _mesh.data.genVertexDataArray(vf);
            var i16 = _mesh.data.genIndexDataArray();

            _mesh.glMesh = new gd3d.render.glMesh();
            _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
            _mesh.glMesh.uploadVertexData(webgl, v32);

            _mesh.glMesh.addIndex(webgl, i16.length);
            _mesh.glMesh.uploadIndexData(webgl, 0, i16);
            _mesh.submesh = [];

            {
                var sm = new gd3d.framework.subMeshInfo();
                sm.matIndex = 0;
                sm.useVertexIndex = 0;
                sm.start = 0;
                sm.size = i16.length;
                sm.line = false;
                _mesh.submesh.push(sm);
            }
        }

        /**
         * 计算网格
         * 
         * @param positionVectex 顶点列表
         * @param rateAtLines 顶点所在线条位置
         * @param textureMode 纹理模式
         * @param totalLength 线条总长度
         * @param mesh 保存网格数据的对象
         */
        static calcMesh(positionVectex: {
            vertexs: math.vector3[];
            tangent: math.vector3; normal: math.vector3;
            rateAtLine: number;
        }[], textureMode: LineTextureMode, colorGradient: Gradient, totalLength: number, mesh: mesh)
        {
            var data = mesh.data;

            var a_positions: number[] = [];
            var a_uvs: number[] = [];
            var a_colors: number[] = [];
            //
            // 摄像机在该对象空间内的坐标
            for (var i = 0, n = positionVectex.length; i < n; i++)
            {
                //
                var vertex = positionVectex[i];
                //
                var offset0 = vertex.vertexs[0];
                var offset1 = vertex.vertexs[1];
                //
                var rateAtLine = vertex.rateAtLine;
                // 颜色
                var currentColor = colorGradient.getValue(rateAtLine);
                //
                a_positions.push(offset0.x, offset0.y, offset0.z, offset1.x, offset1.y, offset1.z);
                a_colors.push(currentColor.r, currentColor.g, currentColor.b, currentColor.a, currentColor.r, currentColor.g, currentColor.b, currentColor.a);
                // 计算UV
                if (textureMode == LineTextureMode.Stretch)
                {
                    a_uvs.push(rateAtLine, 1, rateAtLine, 0);
                }
                else if (textureMode == LineTextureMode.Tile)
                {
                    a_uvs.push(rateAtLine * totalLength, 1, rateAtLine * totalLength, 0);
                }
                else if (textureMode == LineTextureMode.DistributePerSegment)
                {
                    a_uvs.push(rateAtLine, 1, rateAtLine, 0);
                }
                else if (textureMode == LineTextureMode.RepeatPerSegment)
                {
                    a_uvs.push(i, 1, i, 0);
                }

                // 计算索引
                if (i > 0)
                {
                    gd3d.render.meshData.addQuadVec3ByValue(data.normal, vertex.normal);
                    gd3d.render.meshData.addQuadPos(data, [
                        new math.vector3(a_positions[(i - 1) * 6], a_positions[(i - 1) * 6 + 1], a_positions[(i - 1) * 6 + 2]),
                        new math.vector3(a_positions[(i - 1) * 6 + 3], a_positions[(i - 1) * 6 + 4], a_positions[(i - 1) * 6 + 5]),
                        new math.vector3(a_positions[i * 6], a_positions[i * 6 + 1], a_positions[i * 6 + 2]),
                        new math.vector3(a_positions[i * 6 + 3], a_positions[i * 6 + 4], a_positions[i * 6 + 5]),
                    ]);
                    gd3d.render.meshData.addQuadVec2(data.uv, [
                        new math.vector2(a_uvs[(i - 1) * 4], a_uvs[(i - 1) * 4 + 1]),
                        new math.vector2(a_uvs[(i - 1) * 4 + 2], a_uvs[(i - 1) * 4 + 3]),
                        new math.vector2(a_uvs[i * 4], a_uvs[i * 4 + 1]),
                        new math.vector2(a_uvs[i * 4 + 2], a_uvs[i * 4 + 3])
                    ]);
                    gd3d.render.meshData.addQuadVec3ByValue(data.tangent, vertex.tangent);

                    data.color.push(
                        new math.color(a_colors[(i - 1) * 8], a_colors[(i - 1) * 8 + 1], a_colors[(i - 1) * 8 + 2], a_colors[(i - 1) * 8 + 3]),
                        new math.color(a_colors[(i - 1) * 8 + 4], a_colors[(i - 1) * 8 + 5], a_colors[(i - 1) * 8 + 6], a_colors[(i - 1) * 8 + 7]),
                        new math.color(a_colors[i * 8], a_colors[i * 8 + 1], a_colors[i * 8 + 2], a_colors[i * 8 + 3]),
                        new math.color(a_colors[i * 8 + 4], a_colors[i * 8 + 5], a_colors[i * 8 + 6], a_colors[i * 8 + 7]),
                    );
                }
            }
        }

        /**
         * 计算结点的三角形顶点列表
         * 
         * @param positions 结点列表
         * @param loop 是否成换线
         * @param rateAtLines 结点所在线条位置
         * @param lineWidth 线条宽度曲线
         * @param alignment 朝向方式
         * @param cameraPosition 摄像机局部坐标
         */
        static calcPositionVertex(positions: math.vector3[], loop: boolean, rateAtLines: number[], lineWidth: MinMaxCurve, alignment: LineAlignment, cameraPosition: math.vector3)
        {
            // 
            var positionVertex: VertexInfo[] = [];

            // 处理两端循环情况
            if (loop)
            {
                positions.unshift(positions[positions.length - 1]);
                positions.push(positions[1]);
                positions.push(positions[2]);
            } else
            {
                positions.unshift(positions[0]);
                positions.push(positions[positions.length - 1]);
            }

            //
            var positionCount = positions.length;
            //
            // 摄像机在该对象空间内的坐标
            for (var i = 0; i < positionCount - 2; i++)
            {
                // 顶点索引
                var prePosition = positions[i];
                var currentPosition = positions[i + 1];
                var nextPosition = positions[i + 2];
                //
                // 当前所在线条，0表示起点，1表示终点
                var rateAtLine = rateAtLines[i];
                // 线条宽度
                var currentLineWidth = lineWidth.getValue(rateAtLine);

                // 切线，线条方向
                var tangent0 = new math.vector3(0, 0, 0);
                math.vec3Subtract(currentPosition, prePosition, tangent0);
                math.vec3Normalize(tangent0, tangent0);

                var tangent1 = new math.vector3(0, 0, 0);
                math.vec3Subtract(nextPosition, currentPosition, tangent1);
                math.vec3Normalize(tangent1, tangent1);

                var tangent = new math.vector3(1, 0, 0);
                math.vec2Add(tangent0, tangent1, tangent);
                math.vec3Normalize(tangent, tangent);

                // 处理切线为0的情况
                if (math.vec3SqrLength(tangent) == 0)
                {
                    if (math.vec3SqrLength(tangent0) != 0) math.vec3Clone(tangent0, tangent);
                    else
                    {
                        tangent.x = 1;
                        tangent.y = 0;
                        tangent.y = 0;
                    }
                }
                // 法线，面朝向
                var normal = new math.vector3(0, 0, -1);
                if (alignment == LineAlignment.View)
                {
                    math.vec3Subtract(cameraPosition, currentPosition, normal);
                    math.vec3Normalize(normal, normal);
                } else if (alignment == LineAlignment.TransformZ)
                {
                    normal.x = 0;
                    normal.y = 0;
                    normal.z = -1;
                }
                // 使用强制面向Z轴或者摄像机，会出现 与 线条方向一致的情况
                if (math.vec3IsParallel(tangent, normal))
                {
                    // 强制修改切线方向
                    tangent.x = 1;
                    tangent.y = 0;
                    tangent.z = 0;
                    if (math.vec3IsParallel(tangent, normal))
                    {
                        tangent.x = 0;
                        tangent.y = 1;
                        tangent.z = 0;
                    }
                    // 重新计算与法线垂直的切线
                    var tempTN = new math.vector3();
                    math.vec3Cross(tangent, normal, tempTN);
                    math.vec3Cross(normal, tempTN, tangent);
                    math.vec3Normalize(tangent, tangent);
                }
                // 用于计算线条中点生成两个点的偏移量
                var offset = new math.vector3();
                math.vec3Cross(tangent, normal, offset);
                math.vec3Normalize(offset, offset);
                math.vec3ScaleByNum(offset, currentLineWidth / 2, offset);
                // 保持线条宽度
                var temp = new math.vector3();
                math.vec3Clone(offset, temp);
                math.vec3Normalize(temp, temp);
                var cos = math.vec3Dot(temp, tangent0);
                var sin = Math.sqrt(1 - Math.pow(cos, 2));
                sin = Math.min(Math.max(sin, 0.2), 5);
                math.vec3ScaleByNum(offset, 1 / sin, offset);
                //
                var offset0 = new math.vector3();
                math.vec3Add(currentPosition, offset, offset0);
                var offset1 = new math.vector3();
                math.vec3Subtract(currentPosition, offset, offset1);
                //
                positionVertex[i] = {
                    width: currentLineWidth,
                    position: new math.vector3(currentPosition.x, currentPosition.y, currentPosition.z),
                    vertexs: [offset0, offset1],
                    rateAtLine: rateAtLine,
                    tangent: tangent,
                    normal: normal,
                };
            }
            return positionVertex;
        }

        /**
         * 计算线条总长度
         * 
         * @param positions 顶点列表
         * @param loop 是否循环
         */
        static calcTotalLength(positions: math.vector3[], loop: boolean)
        {
            var total = 0;
            var length = positions.length;
            for (let i = 0, n = length - 1; i < n; i++)
            {
                total += math.vec3Distance(positions[i + 1], positions[i]);
            }
            if (loop && length > 0)
            {
                total += math.vec3Distance(positions[length - 1], positions[0]);
            }
            return total;
        }

        /**
         * 计算结点所在线段位置
         * 
         * @param positions 顶点列表
         * @param loop 是否循环
         */
        static calcRateAtLines(positions: math.vector3[], loop: boolean, textureMode: LineTextureMode)
        {
            // 结点所在线段位置
            var rateAtLines: number[] = [0];
            // 线条总长度
            var totalLength = 0;
            var positionCount = positions.length;
            for (let i = 0, n = positionCount - 1; i < n; i++)
            {
                totalLength += math.vec3Distance(positions[i + 1], positions[i]);
                rateAtLines[i + 1] = totalLength;
            }
            if (loop && positionCount > 0)
            {
                totalLength += math.vec3Distance(positions[positionCount - 1], positions[0])
                rateAtLines[positionCount] = totalLength;
            }
            // 计算结点所在线段位置
            rateAtLines = rateAtLines.map((v, i) =>
            {
                // 计算UV
                if (textureMode == LineTextureMode.Stretch || textureMode == LineTextureMode.Tile)
                {
                    return v / totalLength;
                }
                return i / (loop ? positionCount : (positionCount - 1));
            });
            return rateAtLines;
        }

        /**
         * 拟合线段为曲线
         * 
         * @param positions 点列表
         * @param loop 是否为环线
         * @param rateAtLines 点在线条中的位置
         * @param numSamples 采样次数
         */
        static calcPositionsToCurve(positions: math.vector3[], loop: boolean, rateAtLines: number[], numSamples = 100)
        {
            var xCurve = new AnimationCurve1();
            var yCurve = new AnimationCurve1();
            var zCurve = new AnimationCurve1();

            xCurve.keys.length = 0;
            yCurve.keys.length = 0;
            zCurve.keys.length = 0;

            var position: math.vector3;
            var length = positions.length;
            for (let i = 0; i < length; i++)
            {
                position = positions[i];

                // 计算切线
                var prei = i - 1;
                var nexti = i + 1;
                var pretime = rateAtLines[prei];
                var nexttime = rateAtLines[nexti];
                if (i == 0)
                {
                    prei = 0;
                    pretime = 0;
                    if (loop)
                    {
                        prei = length - 1;
                    }
                } else if (i == length - 1)
                {
                    nexti = length - 1;
                    nexttime = 1;
                    if (loop)
                    {
                        nexti = 0;
                    }
                }
                var tangent = new math.vector3(0, 0, 0);
                math.vec3Subtract(positions[nexti], positions[prei], tangent);
                math.vec3ScaleByNum(tangent, 1 / (nexttime - pretime), tangent);

                xCurve.keys[i] = { time: rateAtLines[i], value: position.x, inTangent: tangent.x, outTangent: tangent.x };
                yCurve.keys[i] = { time: rateAtLines[i], value: position.y, inTangent: tangent.y, outTangent: tangent.y };
                zCurve.keys[i] = { time: rateAtLines[i], value: position.z, inTangent: tangent.z, outTangent: tangent.z };
            }
            if (loop && length > 0)
            {
                position = positions[0];
                xCurve.keys[length] = { time: 1, value: position.x, inTangent: xCurve.keys[0].inTangent, outTangent: xCurve.keys[0].outTangent };
                yCurve.keys[length] = { time: 1, value: position.y, inTangent: yCurve.keys[0].inTangent, outTangent: yCurve.keys[0].outTangent };
                zCurve.keys[length] = { time: 1, value: position.z, inTangent: zCurve.keys[0].inTangent, outTangent: zCurve.keys[0].outTangent };
            }

            // 重新计算 positions以及rateAtLines
            positions.length = 0;
            rateAtLines.length = 0;
            if (loop) numSamples = numSamples + 1;
            var step = 1 / (numSamples - 1);
            for (var i = 0, currentStep = 0; i < numSamples; i++, currentStep += step)
            {
                var x = xCurve.getValue(currentStep)
                var y = yCurve.getValue(currentStep)
                var z = zCurve.getValue(currentStep)
                positions[i] = new math.vector3(x, y, z);
                rateAtLines[i] = currentStep;
            }

            if (loop && length > 0)
            {
                positions.pop();
            }
        }

        /**
         * 计算线条拐点接缝
         * 
         * @param numCornerVertices 接缝顶点数量
         * @param positionVertex 结点信息列表
         */
        static calcCornerVertices(numCornerVertices: number, positionVertex: VertexInfo[])
        {
            var numNode = positionVertex.length;
            if (numNode < 3 || numCornerVertices == 0) return;

            var positionVertex0 = positionVertex;
            positionVertex = positionVertex.concat();
            positionVertex0.length = 0;
            positionVertex0.push(positionVertex[0]);

            for (let i = 0; i < numNode - 2; i++)
            {
                var preVertex = positionVertex[i];
                var curVertex = positionVertex[i + 1];
                var nexVertex = positionVertex[i + 2];
                //
                var width = curVertex.width;
                //
                var prePosition = preVertex.position;
                var curPosition = curVertex.position;
                var nexPosition = nexVertex.position;
                // 计算前后切线
                var preTanget = new math.vector3();
                math.vec3Subtract(curPosition, prePosition, preTanget);
                math.vec3Normalize(preTanget, preTanget);
                var nexTanget = new math.vector3();
                math.vec3Subtract(nexPosition, curPosition, nexTanget);
                math.vec3Normalize(nexTanget, nexTanget);
                // 计算内线方向
                var insideDir = new math.vector3();
                math.vec3Subtract(nexTanget, preTanget, insideDir);
                math.vec3Normalize(insideDir, insideDir);
                // 半夹角cos
                var halfcos = math.vec3Dot(insideDir, nexTanget);
                // 半夹角sin
                var halfsin = Math.sqrt(1 - halfcos * halfcos);
                // 计算内线点离顶点距离
                var insideDistance = 0.5 * width / halfsin;
                // 计算内线点
                var insidePosition = new math.vector3();
                math.vec3ScaleByNum(insideDir, insideDistance, insidePosition);
                math.vec3Add(insidePosition, curPosition, insidePosition);
                // 计算补充弧线的两端坐标
                var startPosition = new math.vector3();
                math.vec3ScaleByNum(preTanget, halfcos, startPosition);
                math.vec3Add(startPosition, insideDir, startPosition);
                math.vec3ScaleByNum(startPosition, -1, startPosition);
                math.vec3Normalize(startPosition, startPosition);
                math.vec3ScaleByNum(startPosition, width, startPosition);
                math.vec3Add(startPosition, insidePosition, startPosition);
                //
                var endPosition = new math.vector3();
                math.vec3ScaleByNum(nexTanget, halfcos, endPosition);
                math.vec3Subtract(endPosition, insideDir, endPosition);
                math.vec3Normalize(endPosition, endPosition);
                math.vec3ScaleByNum(endPosition, width, endPosition);
                math.vec3Add(endPosition, insidePosition, endPosition);
                // 计算内线点是否为第一个点
                var temp2 = new math.vector3();
                math.vec3Subtract(insidePosition, startPosition, temp2);
                math.vec3Cross(temp2, preTanget, temp2);
                var insideIsFirst = math.vec3Dot(temp2, curVertex.normal) > 0;
                // 计算起点
                var startVertex = curVertex;
                startVertex.vertexs = [insidePosition, startPosition];
                if (!insideIsFirst)
                {
                    startVertex.vertexs = [startPosition, insidePosition];
                }
                startVertex.position = new math.vector3();
                math.vec3Add(startVertex.vertexs[0], startVertex.vertexs[1], startVertex.position);
                math.vec3ScaleByNum(startVertex.position, 0.5, startVertex.position);
                startVertex.tangent = preTanget;
                // 计算终点
                var endVertex: VertexInfo = {
                    position: new math.vector3(insidePosition.x * endPosition.x * 0.5, insidePosition.y * endPosition.y * 0.5, insidePosition.z * endPosition.z * 0.5),
                    vertexs: [insidePosition, endPosition],
                    width: width,
                    tangent: nexTanget,
                    normal: curVertex.normal,
                    rateAtLine: curVertex.rateAtLine
                };
                if (!insideIsFirst)
                {
                    endVertex.vertexs = [endPosition, insidePosition];
                }
                positionVertex0.push(startVertex);
                // 计算中间补充夹角
                var outAngle = Math.acos(math.vec3Dot(preTanget, nexTanget));
                var angleStep = outAngle / (numCornerVertices);
                var startLineDir = new math.vector3();
                math.vec3Subtract(startPosition, insidePosition, startLineDir);
                math.vec3Normalize(startLineDir, startLineDir);
                for (let j = 1; j < numCornerVertices; j++)
                {
                    var curAngle = angleStep * j;
                    var curOutSidePosition = new math.vector3();
                    var temp3 = new math.vector3();
                    math.vec3ScaleByNum(startLineDir, Math.cos(curAngle) * width, temp3);
                    var temp4 = new math.vector3();
                    math.vec3ScaleByNum(preTanget, Math.sin(curAngle) * width, temp4);
                    math.vec3Add(temp3, temp4, curOutSidePosition);
                    math.vec3Add(curOutSidePosition, insidePosition, curOutSidePosition);
                    //
                    var tangentTemp = new math.vector3();
                    math.vec3SLerp(preTanget, nexTanget, 1 - (j / numCornerVertices), tangentTemp);
                    var addNewVertex: VertexInfo = {
                        position: new math.vector3((insidePosition.x + curOutSidePosition.x) * 0.5, (insidePosition.y + curOutSidePosition.y) * 0.5, (insidePosition.z + curOutSidePosition.z) * 0.5),
                        vertexs: [insidePosition, curOutSidePosition],
                        width: width,
                        tangent: tangentTemp,
                        normal: curVertex.normal,
                        rateAtLine: curVertex.rateAtLine
                    };
                    if (!insideIsFirst)
                    {
                        addNewVertex.vertexs = [curOutSidePosition, insidePosition];
                    }
                    positionVertex0.push(addNewVertex);
                }
                //
                positionVertex0.push(endVertex);
            }
            //
            positionVertex0.push(positionVertex[numNode - 1]);
        }

        /**
         * 计算线条帽子顶点
         * 
         * @param numCapVertices 帽子顶点数量
         * @param positionVertex 结点信息列表
         * @param ishead 是否为线条头部
         */
        static calcCapVertices(numCapVertices: number, positionVertex: VertexInfo[], ishead: boolean)
        {
            if (numCapVertices < 1) return;

            var step = Math.PI / (numCapVertices + 1);
            var vertex = positionVertex[0];
            if (!ishead)
                vertex = positionVertex[positionVertex.length - 1];
            var rateAtLine = vertex.rateAtLine;
            var normal = new math.vector3(vertex.normal.x, vertex.normal.y, vertex.normal.z);
            var tangent = vertex.tangent;
            if (ishead)
            {
                tangent.x = - tangent.x;
                tangent.y = - tangent.y;
                tangent.z = - tangent.z;
            }
            var offset0 = vertex.vertexs[0];
            var offset1 = vertex.vertexs[1];
            var center = new math.vector3();
            math.vec3Add(offset0, offset1, center);
            math.vec3ScaleByNum(center, 0.5, center);
            var width = math.vec3Distance(offset0, offset1);
            for (var i = 0; i <= numCapVertices + 1; i++)
            {
                var angle = step * i;
                // 计算新增点坐标
                var temp0 = new math.vector3();
                math.vec3Add(offset0, offset1, temp0);
                math.vec3ScaleByNum(temp0, 0.5 * Math.cos(angle), temp0);
                var temp1 = new math.vector3();
                math.vec3ScaleByNum(tangent, Math.sin(angle) * width / 2, tangent);
                var addPoint = new math.vector3();
                math.vec3Add(temp0, temp1, addPoint);
                //
                var newVertex = {
                    width: vertex.width / 2,
                    position: new math.vector3((addPoint.x + center.x) * 0.5, (addPoint.y + center.y) * 0.5, (addPoint.z + center.z) * 0.5),
                    rateAtLine: rateAtLine,
                    vertexs: [addPoint, center],
                    tangent: tangent,
                    normal: normal,
                };

                // 添加
                if (ishead)
                    positionVertex.unshift(newVertex);
                else
                    positionVertex.push(newVertex);
            }
        }

    }

    /**
     * 顶点信息
     */
    type VertexInfo = {
        width: number;
        position: math.vector3;
        rateAtLine: number;
        vertexs: math.vector3[];
        tangent: math.vector3;
        normal: math.vector3;
    }
}