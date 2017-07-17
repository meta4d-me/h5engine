namespace gd3d.framework
{
    export class AssetFactory_TextureDesc implements IAssetFactory
    {
        newAsset(): texture
        {
            return null;
        }

        load(url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: texture)
        {
            let filename = getFileName(url);

            state.resstate[filename] = new ResourceState();
            gd3d.io.loadText(url,
                (txt, err) =>
                {
                    if (AssetFactoryTools.catchError(err, onstate, state))
                        return;

                    var _texturedesc = JSON.parse(txt);
                    var _name: string = _texturedesc["name"];
                    var _filterMode: string = _texturedesc["filterMode"];
                    var _format: string = _texturedesc["format"];
                    var _mipmap: boolean = _texturedesc["mipmap"];
                    var _wrap: string = _texturedesc["wrap"];

                    var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
                    if (_format == "RGB")
                        _textureFormat = render.TextureFormatEnum.RGB;
                    else if (_format == "Gray")
                        _textureFormat = render.TextureFormatEnum.Gray;

                    var _linear: boolean = true;
                    if (_filterMode.indexOf("linear") < 0)
                        _linear = false;

                    var _repeat: boolean = false;
                    if (_wrap.indexOf("Repeat") >= 0)
                        _repeat = true;

                    var _textureSrc: string = url.replace(filename, _name);

                    if (_textureSrc.indexOf(".pvr.bin") >= 0)
                    {
                        gd3d.io.loadArrayBuffer(_textureSrc,
                            (_buffer, err) =>
                            {
                                if (AssetFactoryTools.catchError(err, onstate, state))
                                    return;

                                var _texture = new texture(filename);
                                let pvr: PvrParse = new PvrParse(assetMgr.webgl);
                                _texture.glTexture = pvr.parse(_buffer);

                                AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
                            },
                            (loadedLength, totalLength) =>
                            {
                                AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                            });
                    }
                    else
                    {
                        gd3d.io.loadImg(_textureSrc,
                            (_tex, _err) =>
                            {
                                if (AssetFactoryTools.catchError(_err, onstate, state))
                                    return;

                                var _texture = new texture(filename);
                                _texture.realName = _name;

                                var t2d = new gd3d.render.glTexture2D(assetMgr.webgl, _textureFormat);
                                t2d.uploadImage(_tex, _mipmap, _linear, true, _repeat);
                                _texture.glTexture = t2d;

                                AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);

                            },
                            (loadedLength, totalLength) =>
                            {
                                AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                            });
                    }
                })
        }

        loadByPack(packnum: number, url: string, onstate: (state: stateLoad) => void, state: stateLoad, assetMgr: assetMgr, asset?: texture)
        {
            let filename = getFileName(url);

            let txt = assetMgr.bundlePackJson[filename];

            var _texturedesc = JSON.parse(txt);
            var _name: string = _texturedesc["name"];
            var _filterMode: string = _texturedesc["filterMode"];
            var _format: string = _texturedesc["format"];
            var _mipmap: boolean = _texturedesc["mipmap"];
            var _wrap: string = _texturedesc["wrap"];

            var _textureFormat = render.TextureFormatEnum.RGBA;//这里需要确定格式
            if (_format == "RGB")
            {
                _textureFormat = render.TextureFormatEnum.RGB;
            }
            else if (_format == "Gray")
            {
                _textureFormat = render.TextureFormatEnum.Gray;
            }

            var _linear: boolean = true;
            if (_filterMode.indexOf("linear") < 0)
            {
                _linear = false;
            }

            var _repeat: boolean = false;
            if (_wrap.indexOf("Repeat") >= 0)
            {
                _repeat = true;
            }


            var _textureSrc: string = url.replace(filename, _name);

            state.resstate[filename] = new ResourceState();
            if (_textureSrc.indexOf(".pvr.bin") >= 0)
            {
                gd3d.io.loadArrayBuffer(_textureSrc,
                    (_buffer, err) =>
                    {
                        if (AssetFactoryTools.catchError(err, onstate, state))
                            return;

                        var _texture = new texture(filename);
                        let pvr: PvrParse = new PvrParse(assetMgr.webgl);
                        console.log(_textureSrc);
                        _texture.glTexture = pvr.parse(_buffer);

                        AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
                    },
                    (loadedLength, totalLength) =>
                    {
                        AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                    });
            }
            else
            {
                gd3d.io.loadImg(_textureSrc,
                    (_tex, _err) =>
                    {
                        if (AssetFactoryTools.catchError(_err, onstate, state))
                            return;
                        var _texture = new texture(filename);
                        _texture.realName = _name;

                        var t2d = new gd3d.render.glTexture2D(assetMgr.webgl, _textureFormat);
                        t2d.uploadImage(_tex, _mipmap, _linear, true, _repeat);
                        _texture.glTexture = t2d;

                        AssetFactoryTools.useAsset(assetMgr, onstate, state, _texture, url);
                    },
                    (loadedLength, totalLength) =>
                    {
                        AssetFactoryTools.onProgress(loadedLength, totalLength, onstate, state, filename);
                    });
            }
        }
    }
}