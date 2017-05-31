// namespace gd3d.framework
// {
//     @gd3d.reflect.SerializeType
//     export class Effect implements IAsset
//     {
//         asMgr: assetMgr;
//         private name: constText;
//         private id: resID = new resID();
//         defaultAsset: boolean;//是否为系统默认资源
//         effectData: EffectSystemData;
//         constructor(assetName: string = null)
//         {
//             if (!assetName)
//             {
//                 assetName = "Effect_" + this.getGUID();
//             }
//             if (!sceneMgr.app.getAssetMgr().nameDuplicateCheck(assetName))
//             {
//                 throw new Error("already have name.");
//             }
//             this.name = new constText(assetName);
//         }
//         getName(): string
//         {
//             if (this.name == undefined)
//             {
//                 return null;
//             }
//             return this.name.getText();
//         }
//         getGUID(): number
//         {
//             return this.id.getID();
//         }
//         getEffectConfig()
//         {

//         }
//         dispose()
//         {
//             //if (this._trans != null)
//             //{
//             //    this._trans.dispose();
//             //    this._trans = null;
//             //}
//             // this.effectData.dependImgList.length = 0;
//             // this.effectData.dependShapeList.length = 0;
//             // this.effectData.particlelist.length = 0;
//         }
//         use()
//         {
//             sceneMgr.app.getAssetMgr().use(this);
//         }
//         unuse(disposeNow: boolean = false)
//         {
//             sceneMgr.app.getAssetMgr().unuse(this, disposeNow);
//         }

//         caclByteLength(): number
//         {
//             let total = 0;
//             return total;
//         }
//         /**
//          * 解析特效数据
//          * 
//          * @param {string} content 
//          * @param {assetMgr} assetmgr 
//          * @returns 
//          * 
//          * @memberof Effect
//          */
//         Parse(content: string, assetmgr: assetMgr)
//         {
//             if (content == null)
//                 return;
//             this.asMgr = assetmgr;
//             this.effectData = new EffectSystemData();
//             if (content["life"] != undefined)
//                 this.effectData.life = <number>content["life"];
//             if (content["elements"] != undefined)
//             {
//                 this.effectData.elements = [];
//                 let elements = <any[]>content["elements"];
//                 for (let i in elements)
//                 {
//                     let element = new EffectElementData();
//                     this.effectData.elements.push(element);
//                     let elementData = elements[i];
//                     if (elementData["name"] != undefined)
//                         element.name = elementData["name"];
//                     if (elementData["type"] != undefined)
//                         element.type = elementData["type"];
//                     if (elementData["ref"] != undefined)
//                         element.ref = elementData["ref"];
//                     if (elementData["timeline"] != undefined)
//                     {
//                         element.timelineFrame = [];
//                         let _timelineArray = <any[]>elementData["timeline"];
//                         for (let j in _timelineArray)
//                         {
//                             let frame = new EffectFrameData();
//                             element.timelineFrame.push(frame);
//                             let _timeline = _timelineArray[j];
//                             if (_timeline["frame"] == undefined)
//                                 console.error("必须要配一个关键帧的索引");
//                             else
//                             {
//                                 frame.frameIndex = <number>_timeline["frame"];
//                                 if (frame.frameIndex == -1)
//                                     element.initFrameData = frame;
//                             }
//                             if (_timeline["attrs"] == undefined)
//                             {
//                                 let _attrs = <any[]>_timeline["attrs"];
//                                 frame.attrs = {};
//                                 for (let key in _attrs)
//                                 {
//                                     frame.attrs[key] = this._parseToObjData(key, _attrs[key]);
//                                 }
//                             }
//                             if (_timeline["lerp"] == undefined)
//                             {
//                                 let lerp = new EffectLerpData();
//                                 frame.lerp = lerp;
//                                 let _lerp = _timeline["lerp"];
//                                 if (_lerp["type"] != undefined)
//                                     lerp.type = _lerp["type"];
//                                 if (_lerp["to"] != undefined)
//                                     lerp.toFrame = this._parseToValueData(_lerp["to"]);
//                                 if (_lerp["attribute"] != undefined)
//                                     lerp.attributes = <any[]>_lerp["attribute"];
//                             }
//                             if (elementData["actions"] != undefined)
//                             {
//                                 let _actions = <any[]>elementData["actions"]
//                                 for (let k in _actions)
//                                 {
//                                     let _action = _actions[k];
//                                     let actionData = new EffectActionData();
//                                     if (_action["_action"] != undefined)
//                                         actionData.actionType = _action["_action"];
//                                     if (_action["end"] != undefined)
//                                     {
//                                         actionData.toFrame = this._parseToValueData(_action["end"]);
//                                         actionData.beExecuteOnce = false;
//                                     }
//                                     else
//                                     {
//                                         actionData.beExecuteOnce = true;
//                                     }
//                                     if (_action["param"] != undefined)
//                                     {
//                                         actionData.params = <any[]>_action["param"];
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         /**
//          * 解析属性数据
//          * 
//          * @param {string} attrib 
//          * @param {*} content 
//          * @returns 
//          * 
//          * @memberof Effect
//          */
//         _parseToObjData(attrib: string, content: any)
//         {
//             switch (attrib)
//             {
//                 case "pos":
//                 case "scale":
//                 case "euler":
//                     return this._parseToParticleNode(content);
//                 case "mat":
//                     let mat = new EffectMatData();
//                     if (content["mat"] != undefined)
//                     {
//                         if (content["shader"] != undefined)
//                             mat.shader = this.asMgr.getShader(content["shader"]);
//                         else
//                             mat.shader = this.asMgr.getShader("shader/def");
//                         if (content["diffuseTexture"] != undefined)
//                             mat.diffuseTexture = this.asMgr.getAssetByName(content["diffuseTexture"]) as texture;
//                         if (content["_AlphaCut"] != undefined)
//                             mat.alphaCut = <number>content["_AlphaCut"];
//                     }
//                     return mat;
//                 case "emmision":
//                     let emission = new EmissionData();
//                     if (content["type"] != undefined)
//                         emission.type = content["type"];
//                     if (content["time"] != undefined)
//                         emission.time = <number>content["time"];
//                     if (content["count"] != undefined)
//                         emission.count = <number>content["count"];
//                     return emission;
//                 case "billboard":
//                     return content;
//             }
//         }

//         /**
//          * 字符串解析成ParticleNode
//          * 
//          * @param {string} content 
//          * @returns {ParticleNode} 
//          * 
//          * @memberof Effect
//          */
//         _parseToParticleNode(content: string): ParticleNode
//         {
//             content = StringUtil.replaceAll(content, " ", "");
//             let charArray: RegExpMatchArray = content.match(RegexpUtil.vector3FloatOrRangeRegexp);
//             if (charArray != undefined)
//             {
//                 let node: ParticleNode = new ParticleNode();
//                 for (let i = 1; i < charArray.length; i++)
//                 {
//                     if (i == 1)
//                     {
//                         node.x = this._parseToValueData(charArray[i]);
//                     } else if (i == 2)
//                     {
//                         node.y = this._parseToValueData(charArray[i]);
//                     }
//                     else if (i == 3)
//                     {
//                         node.z = this._parseToValueData(charArray[i]);
//                     }
//                 }
//                 return node;
//             }
//             return null;
//         }

//         /**
//          * 字符串转ValueData
//          * 
//          * @param {string} content 
//          * @returns {ValueData} 
//          * 
//          * @memberof Effect
//          */
//         _parseToValueData(content: string): ValueData
//         {
//             let data = new ValueData();
//             let array: number[] = this._parseToNumberArray(content);
//             if (array != null)
//             {
//                 if (array.length > 1)
//                 {
//                     data.valueLimitMin = array[0];
//                     data.valueLimitMax = array[1];
//                 } else
//                     data.value = array[0];
//             }
//             return data;
//         }
//         /**
//          * 字符串转number数组
//          * 
//          * @param {string} content 
//          * @returns {number[]} 
//          * 
//          * @memberof Effect
//          */
//         _parseToNumberArray(content: string): number[]
//         {
//             content = StringUtil.replaceAll(content, " ", "");
//             content = StringUtil.replaceAll(content, "[", "");
//             content = StringUtil.replaceAll(content, "]", "");
//             let _array = <string[]>content.split(",");
//             let result: number[] = [];
//             if (_array != null)
//             {
//                 for (let i = 1; i < _array.length; i++)
//                 {
//                     result.push(parseInt(_array[i]));
//                 }
//             } else
//                 result.push(parseInt(content));
//             return result;
//         }

//         //复制特效到transform
//         clonetotran(camera: camera): transform
//         {
//             let tran = new transform();
//             tran.gameObject.addComponent(StringUtil.COMPONENT_EFFECTSYSTEM);
//             // this.parseEffectData(tran, this.effectData, camera);
//             return tran;
//         }
//     }
// }