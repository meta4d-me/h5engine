/// <reference path="../../../io/reflect.ts" />

namespace m4m.framework {
    /**
     * @public
     * @language zh_CN
     * @classdesc
     * json资源
     * @version m4m 1.0
     */
    @m4m.reflect.SerializeType
    export class gltf implements IAsset {
        static readonly ClassName: string = "json";

        @m4m.reflect.Field("constText")
        private name: constText;
        private id: resID = new resID();
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 是否为默认资源
         * @version m4m 1.0
         */
        defaultAsset: boolean = false;
        constructor(assetName: string = null, public data) {
            if (!assetName) {
                assetName = "json_" + this.getGUID();
            }
            this.name = new constText(assetName);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源名称
         * @version m4m 1.0
         */
        getName(): string {
            return this.name.getText();
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 获取资源唯一id
         * @version m4m 1.0
         */
        getGUID(): number {
            return this.id.getID();
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数加一
         * @version m4m 1.0
         */
        use() {
            sceneMgr.app.getAssetMgr().use(this);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 引用计数减一
         * @version m4m 1.0
         */
        unuse(disposeNow: boolean = false) {
            sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 释放资源
         * @version m4m 1.0
         */
        dispose() {
        }

        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 计算资源字节大小
         * @version m4m 1.0
         */
        caclByteLength(): number {
            return this.data?.buffers?.map(e => e.byteLength).reduce((a, b) => a + b, 0);
        }

        private _realName: string;
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 如果是imgdesc加载来的图片，通过这个可以获取到真实的图片名字
         * @version m4m 1.0
         */
        get realName(): string {
            return this._realName;
        }
        /**
         * @public
         * @language zh_CN
         * @classdesc
         * 设置图片名称
         * @version m4m 1.0
         */
        set realName(name: string) {
            this._realName = name;
        }

        hexToRgb = hex =>
            hex?.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                , (m, r, g, b) => '#' + r + r + g + g + b + b)
                .substring(1).match(/.{2}/g)
                .map(x => parseInt(x, 16) / 255);

        buffers: bin[];
        async load(mgr: assetMgr, ctx: WebGL2RenderingContext, folder: string, brdf: texture, env: texture, irrSH: texture, exposure?, specFactor = 1, irrFactor = 1, uvChecker?: texture) {
            if (!this.data) {
                console.error(`load fail , data is Null.`);
                return;
            }
            const load = (uri) => new Promise((res) => {
                mgr.load(folder + uri, AssetTypeEnum.Auto, () => {
                    res(mgr.getAssetByName(uri.split('/').pop()));
                });
            });
            const defaltScene = this.data.scene ?? 0;
            const extensionsUsed = this.data.extensionsUsed as string[] ?? [];
            const hasKHR_texture_transform = extensionsUsed.indexOf("KHR_texture_transform") != -1;

            const loadImg = (url) => new Promise((res) => {
                m4m.io.loadImg(folder + url, (img, err) => {
                    if (!err) res(img);
                });
            });
            const samplers = this.data.samplers ?? [];
            this.buffers = await Promise.all(this.data?.buffers?.map(({ uri }) => load(uri)) ?? []);
            const images: HTMLImageElement[] = await Promise.all(this.data?.images?.map(({ uri }) => loadImg(uri)) ?? []);
            const textures: texture[] = await Promise.all(this.data.textures?.map(({ sampler, source }) => {
                const img = images[source];
                const tex = new m4m.framework.texture(img.src);
                let format = m4m.render.TextureFormatEnum.RGBA;
                if(img.src.length > 4 && img.src.substr(img.src.length - 4) == ".jpg"){
                    format = m4m.render.TextureFormatEnum.RGB;
                }
                const glt = new m4m.render.glTexture2D(ctx, format);
                const samp = {
                    minFilter: ctx.NEAREST,
                    magFilter: ctx.LINEAR,
                    wrapS: ctx.REPEAT,
                    wrapT: ctx.REPEAT,
                    ...samplers[sampler],
                };
                glt.uploadImage(img, false, false, false, false, false, false); // bind texture
                //额外设置
                ctx.bindTexture(ctx.TEXTURE_2D, glt.texture);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, samp.magFilter);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, samp.minFilter);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, samp.wrapS);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, samp.wrapT);
                if ((samp.minFilter & 0xFF00) == ctx.NEAREST_MIPMAP_NEAREST) {
                    ctx.generateMipmap(ctx.TEXTURE_2D);
                }
                ctx.bindTexture(ctx.TEXTURE_2D, null); // unbind
                tex.glTexture = glt;
                tex.use();
                return tex;
            }) ?? []);

            //lightMap 处理
            let sceneExtensions = this.data.scenes[defaltScene].extensions;
            let gd_linfo_scene: { mode: string, maps: string[] };
            if (sceneExtensions) { gd_linfo_scene = sceneExtensions.gd_linfo_scene; }
            const hasLightMap = extensionsUsed.indexOf("gd_linfo") != -1 && extensionsUsed.indexOf("gd_linfo_scene") != -1
                && gd_linfo_scene && gd_linfo_scene.maps && gd_linfo_scene.maps.length > 0;
            let lightMapTexs: texture[];
            if (hasLightMap) {
                //加载lightmap 纹理
                let maps = gd_linfo_scene.maps;
                lightMapTexs = await Promise.all(maps.map((path) => { return load(path) as Promise<texture>; }));
            }

            const extrasCfg = this.data.extras?.clayViewerConfig?.materials as any[];
            const materials: material[] = this.data.materials?.map(m => {
                const mat = new material(m.name);
                let matCfg;
                let cfgs = extrasCfg?.filter(e => e.name === m.name);
                if (cfgs?.length > 0) matCfg = cfgs[0];
                let pbrSH: shader;
                let alphaMode = m.alphaMode ?? "OPAQUE";
                let alphaCutoff = m.alphaCutoff ?? 0.5;
                let shaderRes = "pbr.shader.json";
                switch (alphaMode) {
                    case "OPAQUE": alphaCutoff = 0; break;
                    case "MASK": break;
                    case "BLEND": shaderRes = `pbr_blend.shader.json`; break;
                }
                pbrSH = mgr.getShader(shaderRes);
                mat.setShader(pbrSH);
                mat.setFloat("alphaCutoff", alphaCutoff);

                if (brdf) {
                    mat.setTexture('brdf', brdf);
                }
                if (env) {
                    mat.setCubeTexture('u_env', env);
                }
                if (irrSH) {
                    mat.setCubeTexture('u_diffuse', irrSH);
                }
                // if (m.normalTexture)
                // {
                //     mat.setTexture("uv_MetallicRoughness", textures[m.normalTexture.index]);
                // }
                if (m.occlusionTexture) {
                    mat.setTexture("uv_AO", textures[m.occlusionTexture.index]);
                }
                if (m.normalTexture) {
                    mat.setTexture("uv_Normal", textures[m.normalTexture.index]);
                }
                if (exposure != null) {
                    mat.setFloat("u_Exposure", exposure);
                }
                mat.setFloat("specularIntensity", specFactor);
                mat.setFloat("diffuseIntensity", irrFactor);
                let _bColor = m.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1];
                let _clayViewerColor = this.hexToRgb(matCfg?.color);
                if (_clayViewerColor) {
                    _bColor[0] = _clayViewerColor[0];
                    _bColor[1] = _clayViewerColor[1];
                    _bColor[2] = _clayViewerColor[2];
                }
                mat.setVector4('CustomBasecolor', new math.vector4(_bColor[0], _bColor[1], _bColor[2], _bColor[3]));
                mat.setFloat('CustomMetallic', matCfg?.metalness ?? m.pbrMetallicRoughness?.metallicFactor ?? 1);
                mat.setFloat('CustomRoughness', matCfg?.roughness ?? m.pbrMetallicRoughness?.roughnessFactor ?? 1);
                // console.log(matCfg.name);
                // console.table({...m.pbrMetallicRoughness});
                // console.table(matCfg);
                // if (matCfg && matCfg.length > 0) {
                // mat.setFloatv("uvRepeat", new Float32Array([matCfg[0]?.uvRepeat[0] ?? 1, matCfg[0]?.uvRepeat[1] ?? 1]));
                // mat.setFloat("uvRepeat", matCfg?.uvRepeat[0] ?? 1);
                // } else {
                // mat.setFloat("uvRepeat", 1);
                // }
                let extenKHR_tex_t: { offset: number[], scale: number[] };
                if (m.pbrMetallicRoughness) {
                    const { baseColorFactor, baseColorTexture, metallicFactor, roughnessFactor, metallicRoughnessTexture } = m.pbrMetallicRoughness;
                    if (baseColorTexture) {
                        mat.setTexture("uv_Basecolor", uvChecker ?? textures[baseColorTexture.index]);
                        //extensions
                        let bcTexExten = baseColorTexture.extensions;
                        if (bcTexExten) {
                            if (hasKHR_texture_transform && bcTexExten.KHR_texture_transform) {
                                extenKHR_tex_t = bcTexExten.KHR_texture_transform;
                            }
                        }
                    }
                    if (metallicRoughnessTexture) {
                        mat.setTexture("uv_MetallicRoughness", textures[metallicRoughnessTexture.index]);
                    }
                }
                if (m.occlusionTexture) {
                    mat.setTexture("uv_AO", textures[m.occlusionTexture.index]);
                }

                //tex transfrom
                let tex_ST = new math.vector4(1, 1, 0, 0);
                // clay-viewer 的配置优先
                let cViewScale = matCfg?.uvRepeat[0] ?? 1;
                if (cViewScale != 1) {
                    tex_ST.x = cViewScale;
                    tex_ST.y = cViewScale;
                } else {
                    if (extenKHR_tex_t) {
                        if (extenKHR_tex_t.scale) {
                            tex_ST.x *= extenKHR_tex_t.scale[0] ?? 1;
                            tex_ST.y *= extenKHR_tex_t.scale[1] ?? 1;
                        }
                        if (extenKHR_tex_t.offset) {
                            tex_ST.z = extenKHR_tex_t.offset[0] ?? 0;
                            tex_ST.w = extenKHR_tex_t.offset[1] ?? 0;
                        }
                    }
                }

                mat.setFloat("uvRepeat", tex_ST.x);     //之后 用 tex_ST 代替 uvRepeat

                return mat;
            });
            const views = this.data.bufferViews?.map(({ buffer = 0, byteOffset = 0, byteLength = 0, byteStride = 0 }) => {
                // return {byteStride ,dv: new DataView(this.buffers[buffer].data, byteOffset, byteLength)};
                return { byteOffset, byteLength, byteStride, rawBuffer: this.buffers[buffer].data };
            });
            const accessors = this.data?.accessors?.map(acc => {
                return {
                    ...acc,
                    bufferView: views[acc.bufferView],
                }
            });

            const meshes = this.data.meshes?.map(({ name, primitives }) => {
                return primitives.map(({ attributes, indices, material, extensions }) => {
                    const mf = new mesh(folder + name);
                    const mdata = mf.data = new m4m.render.meshData();
                    const vert: m4m.math.vector3[] = mdata.pos = [];
                    const uv1: m4m.math.vector2[] = mdata.uv = [];
                    const uv2: m4m.math.vector2[] = mdata.uv2 = [];
                    const normal: m4m.math.vector3[] = mdata.normal = [];
                    const tangent: m4m.math.vector3[] = mdata.tangent = [];
                    // const colors = mdata.color = [];
                    const attr: { [k: string]: Accessor } = {};
                    for (let k in attributes) {
                        attr[k] = new Accessor(accessors[attributes[k]], k);
                    }

                    const vcount = attr.POSITION.count;
                    const bs =
                        + (attr.POSITION?.size ?? 0)
                        + (attr.NORMAL?.size ?? 0)
                        // + (attr.COLOR?.size ?? 0)
                        + (attr.TANGENT?.size ? 3 : 0) // 引擎里的Tangent是vec3，而不是vec4
                        + (attr.TEXCOORD_0?.size ?? 0)
                        + (attr.TEXCOORD_1?.size ?? 0);
                    const vbo = new Float32Array(vcount * bs);

                    mf.glMesh = new m4m.render.glMesh();
                    let vf
                    if (attr.POSITION?.size)
                        vf |= m4m.render.VertexFormatMask.Position;
                    if (attr.NORMAL?.size)
                        vf |= m4m.render.VertexFormatMask.Normal;
                    // | m4m.render.VertexFormatMask.Color
                    if (attr.TANGENT?.size)
                        vf |= m4m.render.VertexFormatMask.Tangent;
                    if (attr.TEXCOORD_0?.size)
                        vf |= m4m.render.VertexFormatMask.UV0;
                    if (attr.TEXCOORD_1?.size)
                        vf |= m4m.render.VertexFormatMask.UV1;
                    // | m4m.render.VertexFormatMask.BlendIndex4
                    // | m4m.render.VertexFormatMask.BlendWeight4;
                    mf.glMesh.initBuffer(ctx, vf, vcount, m4m.render.MeshTypeEnum.Dynamic);

                    const eboAcc = new Accessor(accessors[indices], "indices");
                    const ebo = eboAcc.data as Uint16Array;
                    mdata.trisindex = Array.from(ebo);

                    for (let i = 0; i < vcount; i++) {
                        if (attr.TEXCOORD_0?.size != null) {
                            let uvFliped0 = attr.TEXCOORD_0.data[i];
                            uv1[i] = new m4m.math.vector2(uvFliped0[0], uvFliped0[1] * -1 + 1);
                        }

                        if (attr.TEXCOORD_1?.size != null) {
                            let uvFliped1 = attr.TEXCOORD_1.data[i];
                            uv2[i] = new m4m.math.vector2(uvFliped1[0], uvFliped1[1] * -1 + 1);
                        }

                        if (attr.POSITION?.size != null) {
                            let _posArr = attr.POSITION.data[i];
                            vert[i] = new m4m.math.vector3(_posArr[0], _posArr[1], _posArr[2]);
                        }

                        if (attr.NORMAL?.size != null) {
                            let _normalArr = attr.NORMAL.data[i];
                            normal[i] = new m4m.math.vector3(_normalArr[0], _normalArr[1], _normalArr[2]);
                        }

                        if (attr.TANGENT?.size != null) {
                            let _tangentArr = attr.TANGENT.data[i];
                            let t = new m4m.math.vector3(_tangentArr[0], _tangentArr[1], _tangentArr[2]);
                            //处理 w 分量 , w 存入 xyz 中, w 只因为为1 或 -1 ,表示为切向方向性。
                            //将w 平移2 , 映射为 -1 -> 1 , 1 -> 3 ，这样保障 normalize 后 xyz 一致
                            let w = _tangentArr[3] + 2;
                            //将w 乘入 xyz , x = x * w , y = y * w , y = y * w 
                            m4m.math.vec3ScaleByNum(t, w, t);
                            tangent[i] = t;
                        }

                        const cur = vbo.subarray(i * bs); // offset
                        let bit = 0;
                        if (attr.POSITION?.size != null) {
                            const position = cur.subarray(bit, bit += 3);
                            position.set(attr.POSITION.data[i] as AccTypedArray);
                        }

                        // const color = cur.subarray(3, 7);
                        if (attr.NORMAL?.size != null) {
                            const n = cur.subarray(bit, bit += 3);
                            n.set(attr.NORMAL.data[i] as AccTypedArray);
                        }

                        if (attr.TANGENT?.size != null) {
                            const tan = cur.subarray(bit, bit += 3);
                            const t = tangent[i];
                            tan[0] = t.x;
                            tan[1] = t.y;
                            tan[2] = t.z;
                        }

                        if (attr.TEXCOORD_0?.size != null) {
                            const _uv = cur.subarray(bit, bit += 2);
                            let u = uv1[i];
                            _uv[0] = u.x;
                            _uv[1] = u.y;
                        }

                        if (attr.TEXCOORD_1?.size != null) {
                            const _uv2 = cur.subarray(bit, bit += 2);
                            let u = uv2[i];
                            _uv2[0] = u.x;
                            _uv2[1] = u.y;
                        }

                        // const tangent = cur.subarray(7, 9);

                        // colors[i] = new m4m.math.vector4();
                    }
                    mf.glMesh.uploadVertexData(ctx, vbo);
                    mf.glMesh.addIndex(ctx, ebo.length);
                    mf.glMesh.uploadIndexData(ctx, 0, ebo, eboAcc.componentType);
                    mf.submesh = [];
                    const sm = new m4m.framework.subMeshInfo();
                    sm.matIndex = 0;
                    sm.useVertexIndex = 0;
                    sm.start = 0;
                    sm.size = ebo.length;
                    sm.line = false;
                    mf.submesh.push(sm);
                    mf.glMesh.uploadIndexSubData(ctx, 0, ebo);
                    mf.glMesh.initVAO();
                    
                    //light Map
                    let lightMapTexST = null;
                    let outMat: material = materials[material];
                    if (hasLightMap && extensions && extensions.gd_linfo) {
                        if (extensions.gd_linfo.so) {
                            lightMapTexST = extensions.gd_linfo.so;
                        } else {
                            lightMapTexST = [1, 1, 0, 0];
                        }
                        let texIdx = extensions.gd_linfo.index ?? 0;
                        let lightMapTex = lightMapTexs[texIdx];
                        if (lightMapTex) {
                            if (outMat.statedMapUniforms["_LightmapTex"]) {
                                outMat = outMat.clone();      //公用材质但lightmap 不同，需要clone一个新材质
                            }
                            outMat.setTexture("_LightmapTex", lightMapTex);
                            outMat = outMat;
                        }
                    }
                    return { m: mf, mat: outMat, lTexST: lightMapTexST };
                });
            });

            const nodes = this.data.nodes?.map(({ name, mesh, matrix, rotation, scale, translation, skin, camera, children }) => {
                const n = new m4m.framework.transform();
                n.name = name;
                if (matrix != null) {
                    n.getLocalMatrix().rawData = matrix;
                    math.matrixDecompose(n.getLocalMatrix(), n.localScale, n.localRotate, n.localTranslate);
                } else {
                    if (translation != null)
                        math.vec3Set(n.localTranslate, translation[0], translation[1], translation[2]);
                    if (rotation != null) {
                        n.localRotate.x = rotation[0];
                        n.localRotate.y = rotation[1];
                        n.localRotate.z = rotation[2];
                        n.localRotate.w = rotation[3];
                    }
                    if (scale != null)
                        math.vec3Set(n.localScale, scale[0], scale[1], scale[2]);
                }
                n.markDirty();
                if (mesh != null) {
                    const child = meshes[mesh].map(({ m, mat, lTexST }) => {
                        const texST: number[] = lTexST;
                        const submesh = new m4m.framework.transform();

                        const mf = submesh.gameObject.addComponent("meshFilter") as meshFilter;
                        mf.mesh = m;
                        const renderer = submesh.gameObject.addComponent("meshRenderer") as meshRenderer;
                        renderer.materials = [mat];
                        if (texST) {
                            renderer.lightmapIndex = -2;    //标记该节点使用非全局lightmap
                            math.vec4Set(renderer.lightmapScaleOffset, texST[0], texST[1], texST[2], texST[3]);
                        }
                        // renderer.materials.push(mat);
                        // renderer.materials.push(new framework.material());
                        // renderer.materials[0].setShader(mgr.getShader("shader/def"));
                        // renderer.materials[0].setShader(mgr.getShader("simple.shader.json"));
                        return submesh;
                    });
                    child.forEach(c => n.addChild(c));
                }
                return { n, children };
            });
            const scene = new m4m.framework.transform();
            const parseNode = (i) => {
                const { n, children } = nodes[i];
                children?.forEach(c => {
                    n.addChild(parseNode(c));
                });
                return n;
            }
            const roots = this.data.scenes[defaltScene].nodes.map(parseNode);
            roots.forEach(r => scene.addChild(r));
            return scene;
        }

        /**
         * 获取实时灯光列表详细
         */
        getRealtimeLights(): gltfRealtimeLight[] {
            let extUsed = this.data.extensionsUsed as string[];
            if (!extUsed || extUsed.indexOf("gd_realtime_lights") == -1) return;
            let scenes = this.data.scenes;
            if (!scenes || !scenes[0].extensions) return;
            let gd_realtime_lights = scenes[0].extensions.gd_realtime_lights;
            if (!gd_realtime_lights || !gd_realtime_lights.lightInfos) return;
            return gd_realtime_lights.lightInfos;
        }
    }

    /** 灯光阴影质量 */
    export enum ShadowQualityType {
        None,
        Low,
        Medium,
        High,
    }

    /** gltf 实时灯光 */
    export type gltfRealtimeLight = {
        /** 光灯类型 */
        type: LightTypeEnum,
        /** 影响范围 */
        range: number,
        /** 聚光灯张角度 */
        spotAngle: number,
        /** 阴影质量 */
        shadowQuality: ShadowQualityType,
        /** 光照强度 */
        intensity: number,
        /** 灯光颜色 */
        color: number[],
        /** 灯光角度 [x,y] */
        angles: number[],
        /** 灯光位置 [x,y,z] */
        pos: number[],
    };

    type AccTypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array;
    export class Accessor {
        static types = {
            "SCALAR": 1,
            'VEC1': 1,
            'VEC2': 2,
            'VEC3': 3,
            'VEC4': 4,
            "MAT2": 4,
            "MAT3": 9,
            "MAT4": 16,
        };
        attribute: string;
        bufferView: any;
        byteOffset: number;
        componentType: number;
        normalized: boolean;
        count: number;
        max: number[];
        min: number[];
        size: number;
        private _data: AccTypedArray | AccTypedArray[];
        constructor({ bufferView, byteOffset = 0, componentType, normalized = false, count, type, max = [], min = [] }, name = '') {
            this.attribute = name;
            this.bufferView = bufferView;
            this.byteOffset = byteOffset;
            this.componentType = componentType;
            this.normalized = normalized;
            this.count = count;
            this.max = max;
            this.min = min;
            this.size = Accessor.types[type];
        }
        get data() {
            if (!this._data)
                this._data = Accessor.getData(this);
            return this._data;
        }
        static newFloat32Array(acc: Accessor) {
            return new Float32Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
        }
        static getSubChunks(acc: Accessor, data: AccTypedArray) {
            let blocks: AccTypedArray[] = [];
            for (let i = 0; i < acc.count; i++) {
                let offset = i * acc.size;
                blocks.push(data.subarray(offset, offset + acc.size));
            }
            return blocks;
        }
        static getFloat32Blocks(acc: Accessor) {
            return this.getSubChunks(acc, Accessor.newTypedArray(acc));
        }

        static newTypedArray(acc: Accessor) {
            switch (acc.componentType) {
                case 5120:
                    return new Int8Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
                case 5121:
                    return new Uint8Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
                case 5122:
                    return new Int16Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
                case 5123:
                    return new Uint16Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
                case 5125:
                    return new Uint32Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
                case 5126:
                    return new Float32Array(acc.bufferView.rawBuffer, acc.byteOffset + acc.bufferView.byteOffset, acc.size * acc.count);
            }
        }
        static getData(acc: Accessor) {

            if (acc.size > 1) {
                return this.getFloat32Blocks(acc);
            }
            return this.newTypedArray(acc);
        }
    }
}
