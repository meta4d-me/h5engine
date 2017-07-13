namespace gd3d.io
{

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载text资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version egret-gd3d 1.0
     */
    export function loadText(url: string, fun: (_txt: string, _err: Error) => void, onprocess: (curLength: number, totalLength: number) => void = null): void 
    {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.responseType = "text";
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }
                fun(req.responseText, null);
            }
        };
        req.onprogress = (ev) =>
        {
            if (onprocess)
            {
                onprocess(ev.loaded, ev.total);
            }
        }

        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }


    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载arraybuffer资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version egret-gd3d 1.0
     */
    export function loadArrayBuffer(url: string, fun: (_bin: ArrayBuffer, _err: Error) => void, onprocess: (curLength: number, totalLength: number) => void = null): void
    {
        var req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "arraybuffer";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                //console.log("got bin:" + typeof (req.response) + req.responseType);
                fun(req.response, null);
            }
        };
        req.onprogress = (ev) =>
        {
            if (onprocess)
            {
                onprocess(ev.loaded, ev.total);
            }
        }
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载二进制资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param onprocess 加载进度
     * @version egret-gd3d 1.0
     */
    export function loadBlob(url: string, fun: (_blob: Blob, _err: Error) => void, onprocess: (curLength: number, totalLength: number) => void = null): void
    {
        var req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "blob";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                //console.log("got _blob:" + typeof (req.response) + req.responseType);
                fun(req.response, null);
            }
        };
        req.onprogress = (ev) =>
        {
            if (onprocess)
            {
                onprocess(ev.loaded, ev.total);
            }
        }
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }

    /**
     * @public
     * @language zh_CN
     * @classdesc
     * 加载图片资源
     * @param url 加载路径
     * @param fun 加载结果回调函数
     * @param progress 加载进度
     * @version egret-gd3d 1.0
     */
    export function loadImg(url: string, fun: (_tex: HTMLImageElement, _err: Error) => void, onprocess: (curLength: number, totalLength: number) => void = null): void
    {
        var req = new XMLHttpRequest();

        req.open("GET", url);
        req.responseType = "blob";//ie 一定要在open之后修改responseType
        req.onreadystatechange = () =>
        {
            if (req.readyState == 4)
            {
                if (req.status == 404)
                {
                    fun(null, new Error("got a 404:" + url));
                    return;
                }

                var blob = req.response;
                var img = document.createElement("img");
                //img.crossOrigin = "anonymous";
                img.onload = function (e)
                {
                    window.URL.revokeObjectURL(img.src);
                    fun(img, null);
                };
                img.onerror = function (e)
                {
                    fun(null, new Error("error when blob to img:" + url));
                }
                img.src = window.URL.createObjectURL(blob);
            }
        };
        req.onprogress = (ev) =>
        {
            if (onprocess)
            {
                onprocess(ev.loaded, ev.total);
            }
        }
        req.onerror = () =>
        {
            fun(null, new Error("onerr in req:"));
        };
        req.send();
    }
}