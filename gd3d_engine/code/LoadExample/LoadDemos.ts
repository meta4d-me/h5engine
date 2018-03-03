
/** 
 * @public
 * @language zh_CN
 * @classdesc
 * gd3d.framework.assetMgr 加载资源的基本dome
*/
class LoadDomes {
    
    
    static load(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (out: any) => void = null) {
        //使用gd3d.framework.AssetTypeEnum.Auto参数可以适用与所有资源的加载。
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Auto, (s) => { //加载资源的回调方法
        
            if (s.iserror){//判断加载时是否出现错误。后面的dome中省略了该判断。
            
                if (onLoadfinish)
                    onLoadfinish(s);
                return;
            }
                
            if (s.isfinish) {//判断加载资源是否完成。s.isfinish=true 时才能执行与资源相关的操作。
                if (onLoadfinish)
                    onLoadfinish(s);
            }
        });
    }

    static loadBundle(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (name: string) => void = null) {
        //加载bundle包，用于批量加载资源。
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Bundle, (s) => {
            if (s.isfinish) {
                if (onLoadfinish)
                    onLoadfinish(this.getName(assetMgr.getFileName(url)));
            }
        });
    }
    
    static loadCompressBundle(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (out: any) => void = null) {
        //加载压缩报使用的方法比起使用 load 方法更有效率。
        assetMgr.loadCompressBundle(url, (s) => {
            if (s.iserror){
                if (onLoadfinish)
                    onLoadfinish(s);
                return;
            }

            if (s.isfinish) {
                if (onLoadfinish)
                    onLoadfinish(this.getName(assetMgr.getFileName(url)));
            }
        });
    }

    static loadGLVertexShader(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (vs: string) => void = null) {
        //加载单个 .vs.glsl shader资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.GLVertexShader, (s) => {
            if (s.isfinish) {
                let vs 
                //取出加载 .vs.glsl 资源 name(加载资源名) = 文件名去掉 .vs.glsl后缀，
                {
                    let name :string = this.getName(assetMgr.getFileName(url));
                    vs = assetMgr.shaderPool.mapVSString[name];
                }
                
                if (vs) {
                    if (onLoadfinish)
                        onLoadfinish(vs);
                } else {
                    console.error("GLVertexShader资源加载异常");
                }
            }
        });
    }

    static loadGLFragmentShader(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (fs: string) => void = null) {
        //加载单个 .fs.glsl shader资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.GLFragmentShader, (s) => {
            if (s.isfinish) {
                //取出加载 .fs.glsl 资源 name(加载资源名) = 文件名去掉 .fs.glsl后缀，
                let fs = assetMgr.shaderPool.mapFSString[this.getName(assetMgr.getFileName(url))];
                if (fs) {
                    if (onLoadfinish)
                        onLoadfinish(fs);
                } else {
                    console.error("GLFragmentShader资源加载异常");
                }
            }
        });
    }

    static loadShader(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (shader: gd3d.framework.shader) => void = null) {
        //加载单个 .shader.json shader资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Shader, (s) => {
            if (s.isfinish) {
                //取出加载的 IAsset 名字与文件名相同，使用该方法取的所有IAsset资源都遵循该规则
                let shader = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.shader;
                if (shader) {//一般情况不需要加此判断
                    if (onLoadfinish)
                        onLoadfinish(shader);
                } else {
                    console.error("shader资源加载异常");
                }
            }
        });
    }

    static loadTextAsset(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (textAsset: gd3d.framework.textasset) => void = null) {
        //加载单个 .json .txt .effect.json 文本、普通json、特效json资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.TextAsset, (s) => {
            if (s.isfinish) {
                let textAsset = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.textasset;
                if (textAsset) {
                    if (onLoadfinish)
                        onLoadfinish(textAsset);
                } else {
                    console.error("textasset资源加载异常");
                }
            }
        });
    }

    static loadPathAsset(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (textAsset: gd3d.framework.pathasset) => void = null) {
        //加载单个 .path.json 路径资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.PathAsset, (s) => {
            if (s.isfinish) {
                let pathAsset = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.pathasset;
                if (pathAsset) {
                    if (onLoadfinish)
                        onLoadfinish(pathAsset);
                } else {
                    console.error("textasset资源加载异常");
                }
            }
        });
    }

    static loadMesh(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (mesh: gd3d.framework.mesh) => void = null) {
        //加载单个 .mesh.bin 模型资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Mesh, (s) => {
            if (s.isfinish) {
                let mesh = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.mesh;
                if (mesh) {
                    if (onLoadfinish)
                        onLoadfinish(mesh);
                } else {
                    console.error("mesh资源加载异常");
                }
            }
        });
    }

    static loadTexture(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (texture: gd3d.framework.texture) => void = null) {
        //加载单个 .png .jpg 纹理资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Texture, (s) => {
            if (s.isfinish) {
                let texture = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.texture;
                if (texture) {
                    if (onLoadfinish)
                        onLoadfinish(texture);
                } else {
                    console.error("texture资源加载异常");
                }
            }
        });
    }

    static loadPVR(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (texture: gd3d.framework.texture) => void = null) {
        //加载单个 .pvr .pvr.bin pvr纹理资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.PVR, (s) => {
            if (s.isfinish) {
                let texture = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.texture;
                if (texture) {
                    if (onLoadfinish)
                        onLoadfinish(texture);
                } else {
                    console.error("PVR图片资源加载异常");
                }
            }
        });
    }

    static loadDDS(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (texture: gd3d.framework.texture) => void = null) {
        //加载单个 .dds .dds.bin dds纹理资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.DDS, (s) => {
            if (s.isfinish) {
                let texture = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.texture;
                if (texture) {
                    if (onLoadfinish)
                        onLoadfinish(texture);
                } else {
                    console.error("DDS图片资源加载异常");
                }
            }
        });
    }

    static loadTextureDesc(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (name: string) => void = null) {
        //加载 .imgdesc.json 贴图资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.TextureDesc, (s) => {
            if (s.isfinish) {
                if (onLoadfinish)
                    onLoadfinish(this.getName(assetMgr.getFileName(url)));
            }
        });
    }

    static loadFont(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (font: gd3d.framework.font) => void = null) {
        //加载 .font.json 字体资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Font, (s) => {
            if (s.isfinish) {
                let font = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.font;
                if (font) {
                    if (onLoadfinish)
                        onLoadfinish(font);
                } else {
                    console.error("font资源加载异常");
                }
            }
        });
    }

    static loadAtlas(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (atlas: gd3d.framework.atlas) => void = null) {
        //加载 .atlas.json 图集
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Atlas, (s) => {
            if (s.isfinish) {
                let atlas = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.atlas;
                if (atlas) {
                    if (onLoadfinish)
                        onLoadfinish(atlas);
                } else {
                    console.error("atlas资源加载异常");
                }
            }
        });
    }

    static loadMaterial(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (material: gd3d.framework.material) => void = null) {
        //加载单个 .mat.json 纹理资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Material, (s) => {
            if (s.isfinish) {
                let material = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.material;
                if (material) {
                    if (onLoadfinish)
                        onLoadfinish(material);
                } else {
                    console.error("material资源加载异常");
                }
            }
        });
    }

    static loadAniplayer(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (animationClip: gd3d.framework.animationClip) => void = null) {
        //加载单个 .aniclip.bin 动作资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Aniclip, (s) => {
            if (s.isfinish) {
                let aniClip = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.animationClip;
                if (aniClip) {
                    if (onLoadfinish)
                        onLoadfinish(aniClip);
                } else {
                    console.error("animationClip资源加载异常");
                }
            }
        });
    }

    static loadF14Effect(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (f14Effect: gd3d.framework.f14eff) => void = null) {
        //加载单个 .f14effect.json 特效资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.F14Effect, (s) => {
            if (s.isfinish) {
                let f14eff = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.f14eff;
                if (f14eff) {
                    if (onLoadfinish)
                        onLoadfinish(f14eff);
                } else {
                    console.error("animationClip资源加载异常");
                }
            }
        });
    }

    static loadPrefab(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (prefab: gd3d.framework.prefab) => void = null) {
        //加载单个 .prefab.json prefab资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Prefab, (s) => {
            if (s.isfinish) {
                let fileName = assetMgr.getFileName(url);
                let name = LoadDomes.getName(fileName);
                let prefab = assetMgr.getAssetByName(`${name}.prefab.json`) as gd3d.framework.prefab;
                if (prefab) {
                    if (onLoadfinish)
                        onLoadfinish(prefab);
                } else {
                    console.error("Prefab资源加载异常");
                }
            }
        });
    }

    static loadPrefabToTranfrom(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (transform: gd3d.framework.transform) => void = null) {
        //加载 .prefab.json prefab资源 取出transform
        this.loadPrefab(assetMgr, url, (out) => {
            let tran = out.getCloneTrans() as gd3d.framework.transform;
            if (tran) {
                if (onLoadfinish)
                    onLoadfinish(tran);
            } else {
                console.error("loadPrefabToTranfrom资源加载异常");
            }
        });
    }

    static loadPrefabToTranfrom2D(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (transform2D: gd3d.framework.transform2D) => void = null) {
        //加载 .prefab.json prefab资源 取出transform2D
        this.loadPrefab(assetMgr, url, (out) => {
            let tran = out.getCloneTrans2D() as gd3d.framework.transform2D;
            if (tran) {
                if (onLoadfinish)
                    onLoadfinish(tran);
            } else {
                console.error("loadPrefabToTranfrom2D资源加载异常");
            }
        });
    }

    static loadScene(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (rawscene: gd3d.framework.rawscene) => void = null) {
        //加载 .scene.json 场景资源
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Scene, (s) => {

            if (s.isfinish) {
                let scene = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.rawscene;
                if (scene) {
                    onLoadfinish(scene);
                }
            }
        });
    }

    static loadSceneToRoot(assetMgr: gd3d.framework.assetMgr, url: string, onLoadfinish: (rawscene: gd3d.framework.transform) => void = null) {
        //加载 .scene.json 场景资源 取出scene的 root节点
        assetMgr.load(url, gd3d.framework.AssetTypeEnum.Scene, (s) => {

            if (s.isfinish) {
                let scene = assetMgr.getAssetByName(assetMgr.getFileName(url)) as gd3d.framework.rawscene;
                if (scene) {
                    onLoadfinish(scene.getSceneRoot());
                }
            }
        });
    }

    private static getName(file: string) {
        let name = file.substring(0, file.indexOf("."));
        return name;
    }
}