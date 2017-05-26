namespace gd3d.framework
{
    export class ParticleLoader
    {
        private emisssionMap: { [name: string]: any } = {};
        private materialMap: { [name: string]: any } = {};
        public particleMap: { [name: string]: any } = {};

        /**
         * 加载一个完整的粒子
         * @param indexurl 
         * @param callback 
         */
        public load(indexurl: string, callback: (effecsystemdata: EffectData) => void)
        {
            let effect = new EffectData();
            var totalCount = 3;

            var i = indexurl.lastIndexOf("/");
            var baseurl = indexurl.substring(0, i);

            if (baseurl != "")
            {
                baseurl += "/";
            }

            gd3d.io.loadText(indexurl, (txt: string, _err: Error) =>
            {

                if (_err != null)
                    throw _err;
                else
                {
                    let obj = JSON.parse(txt);
                    {
                        let fileName = obj["files"];

                        let emssionUrl = fileName["emission"];

                        this.loadEmission(baseurl + emssionUrl, (emission: Array<EmissionData>, _err) =>
                        {
                            totalCount--;
                            console.log("Emission has been loaded");

                        });

                        let particleUrl = <string>fileName["particle"];
                        this.loadParticle(baseurl + particleUrl, (p: Array<ParticleDetailData>, _err) =>
                        {
                            totalCount--;
                            console.log("Particle has been loaded");
                        }
                        );

                        let materialUrl = fileName["material"];
                        this.loadMatrial(baseurl + materialUrl, (matrial: Array<MaterialData>, _err: Error) =>
                        {
                            totalCount--;
                            console.log("material has been loaded");
                        });

                        let depengImg = obj["dependImg"];
                        if (depengImg != undefined)
                        {
                            for (var i = 0; i < depengImg.length; i++)
                            {
                                effect.dependImgList.push(depengImg[i]);
                            }
                        }


                        let dependShape = obj["dependShape"];
                        if (dependShape != undefined)
                        {
                            for (var i = 0; i < dependShape.length; i++)
                            {
                                effect.dependShapeList.push(dependShape[i]);
                            }
                        }

                    }

                    let id = setInterval(() =>
                    {
                        if (totalCount <= 0)
                        {
                            loadfinish();
                            clearInterval(id);
                            totalCount = 3;
                        }
                    }, 20);

                    var loadfinish = () =>
                    {
                        let effectsystem = obj["effectsystem"];
                        effect.name = effectsystem["name"];
                        let list = <any[]>effectsystem["particlelist"];
                        for (var e = 0; e < list.length; e++)
                        {
                            var particleData: ParticleData = new ParticleData();
                            let particleJsonData = list[e];
                            particleData.emissionData = this.emisssionMap[particleJsonData["emission"]];
                            particleData.materialData = this.materialMap[particleJsonData["material"]];
                            particleData.particleDetailData = this.particleMap[particleJsonData["particle"]];

                            effect.particlelist.push(particleData);
                        }
                        callback(effect);
                    }
                }

            }
            );
        }

        /**
        *  加载粒子发射器
        * @param baseUrl 材质路径
        * @param callback 回调函数
        */
        public loadEmission(baseUrl: string, callback: (emissionArray: Array<EmissionData>, _err: Error) => void): void
        {
            gd3d.io.loadText(baseUrl, (txt, _error) =>
            {
                let array = <any[]>JSON.parse(txt);
                var emissionArray = new Array<EmissionData>();
                for (var i = 0; i < array.length; i++)
                {
                    let json = array[i];
                    let emissionData = new EmissionData();
                    emissionArray[i] = emissionData;
                    emissionData.emissionName = json["name"];
                    switch (json["type"])
                    {
                        case "burst":
                            emissionData.type = ParticleEmissionType.burst;
                            break;
                        case "continue":
                            emissionData.type = ParticleEmissionType.continue;
                            break;
                        // case "timespace":
                        //     emissionData.type = ParticleEmissionType;
                        //     break;
                    }
                    emissionData.time = json["time"];
                    emissionData.count = json["count"];
                    this.emisssionMap[emissionData.emissionName] = emissionData;
                }
                callback(emissionArray, _error);
            }
            );
        }

        /**
        *  加载粒子材质
        * @param baseUrl 材质路径
        * @param callback 回调函数
        */
        //todo
        //需要用assetmgr加载
        loadMatrial(indexurl: string, callback: (material: Array<MaterialData>, _err: Error) => void): void
        {
            gd3d.io.loadText(indexurl, (txt, _err) =>
            {

                var i = indexurl.lastIndexOf("/");
                var url = indexurl.substring(0, i);

                if (url != "")
                {
                    url += "/";
                }

                let array = <any[]>JSON.parse(txt);
                let _material = new Array<MaterialData>();
                for (var i = 0; i < array.length; i++)
                {
                    let json = array[i];
                    _material[i] = new MaterialData();

                    _material[i].shaderName = json["shader"];
                    _material[i].name = json["name"];
                    _material[i].diffuseTexture = json["diffuseTexture"];

                    if (json["tilingx"] != undefined)
                    {
                        _material[i].tiling.x = json["tilingx"];
                    }
                    if (json["tilingy"] != undefined)
                    {
                        _material[i].tiling.y = json["tilingy"];
                    }
                    if (json["offsetx"] != undefined)
                    {
                        _material[i].offset.x = json["offsetx"];
                    }
                    if (json["offsety"] != undefined)
                    {
                        _material[i].offset.y = json["offsety"];
                    }
                    if (json["alphacut"] != undefined)
                    {
                        _material[i].alphaCut = <number>json["alphacut"];
                    }
                    this.materialMap[_material[i].name] = _material[i];
                }


                callback(_material, _err);
            }
            );
        }
        /**
        *  加载粒子
        * @param indexurl 粒子路径
        * @param callback 回掉函数
        */
        loadParticle(indexurl: string, callback: (p: Array<ParticleDetailData>, _err: Error) => void): void
        {

            gd3d.io.loadText(indexurl, (txt, _err) =>
            {

                let array = <any[]>JSON.parse(txt);
                let _particle: Array<ParticleDetailData> = new Array<ParticleDetailData>();
                for (var i = 0; i < array.length; i++)
                {
                    let json = array[i];
                    _particle[i] = new ParticleDetailData();
                    _particle[i].name = json["name"];

                    if (json["rendermodel"] == undefined)
                    {
                        console.log("url：" + indexurl + "此粒子未配置rendermodel" + "name:" + _particle[i].name);
                    }
                    else
                    {
                        let rendermodel = json["rendermodel"];
                        let rendermodelType = rendermodel["type"];
                        let flag: boolean = true;
                        if (rendermodelType == "mesh")
                        {
                            flag = false;
                            let rendermodelVal = rendermodel["value"];
                            _particle[i].renderModel = RenderModel.Mesh;
                            let meshType = rendermodelVal["type"];
                            if(meshType==undefined)
                            {
                                _particle[i].type="plane";
                            }
                            else
                            {
                                _particle[i].type=meshType;
                            }
                            if (rendermodelVal["lookatcam"] != undefined)
                            {
                                _particle[i].isLookAtCamera = rendermodel["lookatcam"];
                            }
                            if (rendermodelVal["angularvelocity"] != undefined)
                            {
                                let angularVelocity = rendermodelVal["angularvelocity"];
                                let angularVelocity_X = angularVelocity["x"];
                                if (angularVelocity_X != undefined)
                                {
                                    if (angularVelocity_X["value"] != undefined)
                                    {
                                        _particle[i].angularVelocity.x.value = angularVelocity_X["value"];
                                    } else
                                    {
                                        _particle[i].angularVelocity.x.valueLimitMin = angularVelocity_X["valuerange"]["0"];
                                        _particle[i].angularVelocity.x.valueLimitMax = angularVelocity_X["valuerange"]["1"];
                                    }
                                }
                                let angularVelocity_Y = angularVelocity["y"];
                                if (angularVelocity_Y != undefined)
                                {
                                    if (angularVelocity_Y["value"] != undefined)
                                    {
                                        _particle[i].angularVelocity.y.value = angularVelocity_Y["value"];
                                    } else
                                    {
                                        _particle[i].angularVelocity.y.valueLimitMin = angularVelocity_Y["valuerange"]["0"];
                                        _particle[i].angularVelocity.y.valueLimitMax = angularVelocity_Y["valuerange"]["1"];
                                    }
                                }
                                let angularVelocity_Z = angularVelocity["z"];
                                if (angularVelocity_Z != undefined)
                                {
                                    if (angularVelocity_Z["value"] != undefined)
                                    {
                                        _particle[i].angularVelocity.z.value = angularVelocity_Z["value"];
                                    } else
                                    {
                                        _particle[i].angularVelocity.z.valueLimitMin = angularVelocity_Z["valuerange"]["0"];
                                        _particle[i].angularVelocity.z.valueLimitMax = angularVelocity_Z["valuerange"]["1"];
                                    }
                                }

                            } else
                            {
                                _particle[i].angularVelocity.x.value = 0;
                                _particle[i].angularVelocity.y.value = 0;
                                _particle[i].angularVelocity.z.value = 0;
                            }

                            if(rendermodelVal["bindaxis"]!=undefined)
                            {
                                _particle[i].bindAxis=true;
                                let bindAxis=rendermodelVal["bindaxis"];
                                if(bindAxis["x"]!=undefined)
                                {
                                    _particle[i].bindx=bindAxis["x"];
                                }
                                if(bindAxis["y"]!=undefined)
                                {
                                    _particle[i].bindy=bindAxis["y"];
                                }
                                if(bindAxis["z"]!=undefined)
                                {
                                    _particle[i].bindz=bindAxis["z"];
                                }
                            }
                        }
                        else if (rendermodelType == "billboard")
                        {
                            _particle[i].renderModel = RenderModel.BillBoard;
                            

                        }
                        else if (rendermodelType == "stretched")
                        {
                            _particle[i].renderModel = RenderModel.StretchedBillBoard;
                        }
                        else if (rendermodelType == "horizontal")
                        {
                            _particle[i].renderModel = RenderModel.HorizontalBillBoard;
                        } else if (rendermodelType == "vertical")
                        {
                            _particle[i].renderModel = RenderModel.VerticalBillBoard;
                        }
                        if (flag)
                        {
                            if (rendermodel["value"] != undefined)
                            {
                                _particle[i].angleSpeedForbillboard.value = rendermodel["value"];
                            }
                            else if (rendermodel["valuerange"] != undefined)
                            {
                                _particle[i].angleSpeedForbillboard.valueLimitMin = rendermodel["valuerange"]["0"];
                                _particle[i].angleSpeedForbillboard.valueLimitMax = rendermodel["valuerange"]["1"];
                            }
                        }
                    }
                    if (json["infinite"] != undefined)
                    {
                        _particle[i].infinite = json["infinite"];
                    }

                    if (json["loop"] != undefined)
                    {
                        _particle[i].isLoop = json["loop"];
                    }

                    //UV序列帧的数据解析
                    if (json["uvsprite"] != undefined)
                    {
                        _particle[i].particleMethodType = ParticleMethodType.UVSPRITE;
                        let uvsprite = json["uvsprite"];
                        _particle[i].uvSprite = new UVSprite();
                        _particle[i].uvSprite.row = uvsprite["row"];
                        _particle[i].uvSprite.column = uvsprite["column"];
                        _particle[i].uvSprite.cycles = uvsprite["cycles"];
                        _particle[i].uvSprite.startFrame = uvsprite["startFrame"];
                        _particle[i].uvSprite.frameOverLifeTime = uvsprite["freamOverLifeTime"];
                    }
                    //UV滚动的数据解析
                    if (json["uvroll"] != undefined)
                    {
                        _particle[i].particleMethodType = ParticleMethodType.UVROLL;
                        _particle[i].uvRoll = new UVRoll();
                        let uvroll = json["uvroll"];

                        if (uvroll["speedU"] != undefined)
                        {
                            _particle[i].uvRoll.uvSpeed.u.value = uvroll["speedU"];
                        }
                        if (uvroll["speedV"] != undefined)
                        {
                            _particle[i].uvRoll.uvSpeed.v.value = uvroll["speedV"];
                        }
                        if (uvroll["uvSpeedNodes"] != undefined)
                        {
                            let uvspedNodes = uvroll["uvSpeedNodes"];
                            for (var k = 0; k < uvspedNodes.length; k++)
                            {
                                let uvNode = uvspedNodes[k.toString()];
                                _particle[i].uvRoll.uvSpeedNodes[k] = new UVSpeedNode();
                                if (uvNode["u"] != undefined)
                                {
                                    _particle[i].uvRoll.uvSpeedNodes[k].u.value = uvNode["u"];
                                }
                                if (uvNode["v"] != undefined)
                                {
                                    _particle[i].uvRoll.uvSpeedNodes[k].v.value = uvNode["v"];
                                }
                                if (uvNode["key"] != undefined)
                                {
                                    _particle[i].uvRoll.uvSpeedNodes[k].key = uvNode["key"];
                                }
                            }
                        }
                    }

                    if (json["gravity"] != undefined)
                    {
                        let gravity = json["gravity"];
                        if (gravity["value"] != undefined)
                        {
                            _particle[i].gravity.value = gravity["value"];
                        }
                        else
                        {
                            _particle[i].gravity.valueLimitMin = gravity["valuerange"]["0"];
                            _particle[i].gravity.valueLimitMax = gravity["valuerange"]["1"];
                        }
                    }

                    if (json["gravityspeed"] != undefined)
                    {
                        let gravitySpeed = json["gravityspeed"];
                        if (gravitySpeed["value"] != undefined)
                        {
                            _particle[i].gravitySpeed.value = gravitySpeed["value"];
                        }
                        else
                        {
                            _particle[i].gravitySpeed.valueLimitMin = gravitySpeed["valuerange"]["0"];
                            _particle[i].gravitySpeed.valueLimitMax = gravitySpeed["valuerange"]["1"];
                        }
                    }

                    if (json["speed"] != undefined)
                    {
                        let _speed = json["speed"];
                        if (_speed["value"] != undefined)
                        {
                            _particle[i].speed.value = _speed["value"];
                        }
                        else
                        {
                            _particle[i].speed.valueLimitMin = _speed["valuerange"]["0"];
                            _particle[i].speed.valueLimitMax = _speed["valuerange"]["1"];
                        }
                    }

                    if (json["life"] != undefined)
                    {
                        let life = json["life"];
                        if (life["value"] != undefined)
                        {
                            _particle[i].life.value = life["value"];
                        }
                        else
                        {
                            _particle[i].life.valueLimitMin = life["valuerange"]["0"];
                            _particle[i].life.valueLimitMax = life["valuerange"]["1"];
                        }
                    }


                    if (json["startrot"] != undefined)
                    {
                        let startRotation = json["startrot"];

                        let startRotation_X = startRotation["x"];
                        if (startRotation_X != undefined)
                        {
                            if (startRotation_X["value"] != undefined)
                            {
                                _particle[i].startPitchYawRoll.x.value = startRotation_X["value"];
                            } else
                            {
                                _particle[i].startPitchYawRoll.x.valueLimitMin = startRotation_X["valuerange"]["0"];
                                _particle[i].startPitchYawRoll.x.valueLimitMax = startRotation_X["valuerange"]["1"];
                            }
                        }


                        let startRotation_Y = startRotation["y"];
                        if (startRotation_Y != undefined)
                        {
                            if (startRotation_Y["value"] != undefined)
                            {
                                _particle[i].startPitchYawRoll.y.value = startRotation_Y["value"];
                            } else
                            {
                                _particle[i].startPitchYawRoll.y.valueLimitMin = startRotation_Y["valuerange"]["0"];
                                _particle[i].startPitchYawRoll.y.valueLimitMax = startRotation_Y["valuerange"]["1"];
                            }
                        }


                        let startRotation_Z = startRotation["z"];
                        if (startRotation_Z != undefined)
                        {
                            if (startRotation_Z["value"] != undefined)
                            {
                                _particle[i].startPitchYawRoll.z.value = startRotation_Z["value"];
                            } else
                            {
                                _particle[i].startPitchYawRoll.z.valueLimitMin = startRotation_Z["valuerange"]["0"];
                                _particle[i].startPitchYawRoll.z.valueLimitMax = startRotation_Z["valuerange"]["1"];
                            }
                        }
                    } else
                    {
                        _particle[i].startPitchYawRoll.x.value = 0;
                        _particle[i].startPitchYawRoll.y.value = 0;
                        _particle[i].startPitchYawRoll.z.value = 0;
                    }




                    if (json["interptype"] != undefined)
                    {
                        switch (json["interptype"])
                        {
                            case "linear":
                                _particle[i].interpolationType = ParticleCurveType.LINEAR;
                                break;
                            default:
                                _particle[i].interpolationType = ParticleCurveType.CURVE;
                                break;
                        }
                    }

                    if (json["scale"] != undefined)
                    {
                        let _scale = json["scale"];

                        if (_scale["x"] != undefined)
                        {
                            _particle[i].scale.x.value = _scale["x"];
                        }
                        else
                        {
                            _particle[i].scale.x.valueLimitMin = _scale["rangex"]["0"];
                            _particle[i].scale.x.valueLimitMax = _scale["rangex"]["1"];
                        }


                        if (_scale["y"] != undefined)
                        {
                            _particle[i].scale.y.value = _scale["y"];
                        }
                        else
                        {
                            _particle[i].scale.y.valueLimitMin = _scale["rangey"]["0"];
                            _particle[i].scale.y.valueLimitMax = _scale["rangey"]["1"];
                        }


                        if (_scale["z"] != undefined)
                        {
                            _particle[i].scale.z.value = _scale["z"];
                        }
                        else
                        {
                            _particle[i].scale.z.valueLimitMin = _scale["rangez"]["0"];
                            _particle[i].scale.z.valueLimitMax = _scale["rangez"]["1"];
                        }

                    } else
                    {
                        _particle[i].scale.x.value = 1;
                        _particle[i].scale.y.value = 1;
                        _particle[i].scale.z.value = 1;
                    }

                    if (json["scalenode"] != undefined)
                    {

                        let scaleNodes = json["scalenode"];
                        for (var ii = 0; ii < scaleNodes.length; ii++)
                        {
                            let scaleNode = scaleNodes[ii.toString()];
                            _particle[i].scaleNode[ii] = new ParticleNode();
                            {
                                if (scaleNode["x"] != undefined)
                                {
                                    _particle[i].scaleNode[ii].x.value = scaleNode["x"];
                                }
                                else
                                {
                                    _particle[i].scaleNode[ii].x.valueLimitMin = scaleNode["rangex"]["0"];
                                    _particle[i].scaleNode[ii].x.valueLimitMax = scaleNode["rangex"]["1"];
                                }
                            }

                            {
                                if (scaleNode["y"] != undefined)
                                {
                                    _particle[i].scaleNode[ii].y.value = scaleNode["y"];
                                }
                                else
                                {
                                    _particle[i].scaleNode[ii].y.valueLimitMin = scaleNode["rangey"]["0"];
                                    _particle[i].scaleNode[ii].y.valueLimitMax = scaleNode["rangey"]["1"];
                                }
                            }

                            {
                                if (scaleNode["z"] != undefined)
                                {
                                    _particle[i].scaleNode[ii].z.value = scaleNode["z"];
                                }
                                else
                                {
                                    _particle[i].scaleNode[ii].z.valueLimitMin = scaleNode["rangez"]["0"];
                                    _particle[i].scaleNode[ii].z.valueLimitMax = scaleNode["rangez"]["1"];
                                }
                            }

                            _particle[i].scaleNode[ii].key = scaleNode["key"];
                        }
                    }


                    if (json["color"] != undefined)
                    {

                        let _color = json["color"];

                        if (_color["x"] != undefined)
                        {
                            _particle[i].color.x.value = _color["x"];
                        }
                        else
                        {
                            _particle[i].color.x.valueLimitMin = _color["rangex"]["0"];
                            _particle[i].color.x.valueLimitMax = _color["rangex"]["1"];
                        }


                        if (_color["y"] != undefined)
                        {
                            _particle[i].color.y.value = _color["y"];
                        }
                        else
                        {
                            _particle[i].color.y.valueLimitMin = _color["rangey"]["0"];
                            _particle[i].color.y.valueLimitMax = _color["rangey"]["1"];
                        }


                        if (_color["z"] != undefined)
                        {
                            _particle[i].color.z.value = _color["z"];
                        }
                        else
                        {
                            _particle[i].color.z.valueLimitMin = _color["rangez"]["0"];
                            _particle[i].color.z.valueLimitMax = _color["rangez"]["1"];
                        }

                    } else
                    {
                        _particle[i].color.x.value = 1;
                        _particle[i].color.y.value = 1;
                        _particle[i].color.z.value = 1;
                    }


                    if (json["colornode"] != undefined)
                    {
                        let colorNodes = json["colornode"];
                        for (var ii = 0; ii < colorNodes.length; ii++)
                        {
                            let colorNode = colorNodes[ii.toString()];
                            _particle[i].colorNode[ii] = new ParticleNode();
                            {
                                if (colorNode["x"] != undefined)
                                {
                                    _particle[i].colorNode[ii].x.value = colorNode["x"];
                                }
                                else
                                {
                                    _particle[i].colorNode[ii].x.valueLimitMin = colorNode["rangex"]["0"];
                                    _particle[i].colorNode[ii].x.valueLimitMax = colorNode["rangex"]["1"];
                                }
                            }

                            {
                                if (colorNode["y"] != undefined)
                                {
                                    _particle[i].colorNode[ii].y.value = colorNode["y"];
                                }
                                else
                                {
                                    _particle[i].colorNode[ii].y.valueLimitMin = colorNode["rangey"]["0"];
                                    _particle[i].colorNode[ii].y.valueLimitMax = colorNode["rangey"]["1"];
                                }
                            }

                            {
                                if (colorNode["z"] != undefined)
                                {
                                    _particle[i].colorNode[ii].z.value = colorNode["z"];
                                }
                                else
                                {
                                    _particle[i].colorNode[ii].z.valueLimitMin = colorNode["rangez"]["0"];
                                    _particle[i].colorNode[ii].z.valueLimitMax = colorNode["rangez"]["1"];
                                }
                            }

                            _particle[i].colorNode[ii].key = colorNode["key"];
                        }
                    }


                    if (json["alpha"] != undefined)
                    {
                        let _alpha = json["alpha"];
                        if (_alpha["value"] != undefined)
                        {
                            _particle[i].alpha.value = _alpha["value"];
                        }
                        else
                        {
                            _particle[i].alpha.valueLimitMin = _alpha["valuerange"]["0"];
                            _particle[i].alpha.valueLimitMax = _alpha["valuerange"]["1"];
                        }
                    } else
                    {
                        _particle[i].alpha.value = 1;
                    }


                    if (json["alphanode"] != undefined)
                    {
                        let alphaNodes = json["alphanode"];
                        for (var aa = 0; aa < alphaNodes.length; aa++)
                        {
                            let alphaNode = alphaNodes[aa.toString()];
                            _particle[i].alphaNode[aa] = new AlphaNode();
                            if (alphaNode["value"] != undefined)
                            {
                                _particle[i].alphaNode[aa].alpha.value = alphaNode["value"];
                            }
                            else
                            {
                                _particle[i].alphaNode[aa].alpha.valueLimitMin = alphaNode["valuerange"]["0"];
                                _particle[i].alphaNode[aa].alpha.valueLimitMax = alphaNode["valuerange"]["1"];
                            }
                            _particle[i].alphaNode[aa].key = alphaNode["key"];
                        }
                    }

                    if (json["posnode"] != undefined)
                    {
                        let positionNodes = json["posnode"];
                        for (var ii = 0; ii < positionNodes.length; ii++)
                        {
                            let positionNode = positionNodes[ii.toString()];
                            _particle[i].positionNode[ii] = new ParticleNode();
                            {
                                if (positionNode["x"] != undefined)
                                {
                                    _particle[i].positionNode[ii].x.value = positionNode["x"];
                                }
                                else
                                {
                                    _particle[i].positionNode[ii].x.valueLimitMin = positionNode["rangex"]["0"];
                                    _particle[i].positionNode[ii].x.valueLimitMax = positionNode["rangex"]["1"];
                                }
                            }

                            {
                                if (positionNode["y"] != undefined)
                                {
                                    _particle[i].positionNode[ii].y.value = positionNode["y"];
                                }
                                else
                                {
                                    _particle[i].positionNode[ii].y.valueLimitMin = positionNode["rangey"]["0"];
                                    _particle[i].positionNode[ii].y.valueLimitMax = positionNode["rangey"]["1"];
                                }
                            }

                            {
                                if (positionNode["z"] != undefined)
                                {
                                    _particle[i].positionNode[ii].z.value = positionNode["z"];
                                }
                                else
                                {
                                    _particle[i].positionNode[ii].z.valueLimitMin = positionNode["rangez"]["0"];
                                    _particle[i].positionNode[ii].z.valueLimitMax = positionNode["rangez"]["1"];
                                }
                            }

                            _particle[i].positionNode[ii].key = positionNode["key"];
                        }
                    }

                    if (json["isrotation"] != undefined)
                    {
                        _particle[i].isRotation = json["isrotation"];
                    }

                    if (json["startpos"] != undefined)
                    {
                        let _startdata = json["startpos"];

                        let startdata = _particle[i].particleStartData;

                        if (_startdata["center"] != undefined)
                        {
                            let _startpos = _startdata["center"];
                            startdata.position.x = _startpos["0"];
                            startdata.position.y = _startpos["1"];
                            startdata.position.z = _startpos["2"];
                        }

                        switch (_startdata["type"])
                        {
                            case "normal":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.NORMAL;
                                break;
                            case "box":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.BOX;
                                break;
                            case "sphere":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.SPHERE;
                                break;
                            case "hemisphere":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.HEMISPHERE;
                                break;
                            case "cone":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.CONE;
                                break;
                            case "circle":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.CIRCLE;
                                break;
                            case "edge":
                                startdata.shapeType = gd3d.framework.ParticleSystemShape.EDGE;
                                break;
                            default:
                                break;
                        }


                        if (_startdata["bottomradius"] != undefined)
                        {
                            startdata.bottomRadius = _startdata["bottomradius"];
                        }

                        if (_startdata["width"] != undefined)
                        {
                            startdata.width = _startdata["width"];
                        }

                        if (_startdata["height"] != undefined)
                        {
                            startdata.height = _startdata["height"];
                        }

                        if (_startdata["depth"] != undefined)
                        {
                            startdata.depth = _startdata["depth"];
                        }

                        if (_startdata["angle"] != undefined)
                        {
                            startdata.angle = _startdata["angle"];
                        }

                        if (_startdata["radius"] != undefined)
                        {
                            startdata.radius = _startdata["radius"];
                        }

                        if (_startdata["direction"] != undefined)
                        {
                            let _startdir = _startdata["direction"];
                            let startdir = startdata.direction;
                            startdir.x = _startdir["0"];
                            startdir.y = _startdir["1"];
                            startdir.z = _startdir["2"];
                        }

                    }
                    if (json["istrail"] != undefined)
                    {
                        _particle[i].istrail = json["istrail"];
                    }

                    this.particleMap[_particle[i].name] = _particle[i];
                }
                callback(_particle, _err);
            }
            );

        }
    }
}