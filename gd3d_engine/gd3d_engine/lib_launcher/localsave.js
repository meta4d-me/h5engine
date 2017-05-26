var localsave;
(function (localsave) {
    function stringToUtf8Array(str) {
        var bstr = [];
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            var cc = c.charCodeAt(0);
            if (cc > 0xFFFF) {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80) {
                if (cc < 0x07FF) {
                    var c1 = (cc >>> 6) | 0xC0;
                    var c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else {
                    var c1 = (cc >>> 12) | 0xE0;
                    var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    var c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else {
                bstr.push(cc);
            }
        }
        return bstr;
    }
    localsave.stringToUtf8Array = stringToUtf8Array;
    function file_str2blob(string) {
        var u8 = new Uint8Array(localsave.stringToUtf8Array(string));
        var blob = new Blob([u8]);
        return blob;
    }
    localsave.file_str2blob = file_str2blob;
    function file_u8array2blob(array) {
        var blob = new Blob([array]);
        return blob;
    }
    localsave.file_u8array2blob = file_u8array2blob;
    function save(path, file) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("POST", "../../hybirdapi/upload" + "?r=" + Math.random(), false);
        var fdata = new FormData();
        fdata.append("path", path);
        fdata.append("file", file);
        req.send(fdata);
        var json = JSON.parse(req.responseText);
        if (json["code"] != 0)
            throw new Error(json["error"]);
        return json["code"];
    }
    localsave.save = save;
    function saveStr(path, content) {
        console.log("path:" + path);
        console.log("content:" + content);
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("POST", "../../hybirdapi/upload" + "?r=" + Math.random(), false);
        var fdata = new FormData();
        fdata.append("path", path);
        fdata.append("content", content);
        req.send(fdata);
        var json = JSON.parse(req.responseText);
        if (json["code"] != 0)
            throw new Error(json["error"]);
        return json["code"];
    }
    localsave.saveStr = saveStr;
    function startDirect(exec, path, argc) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/startdirect" +
            "?exec=" + exec +
            "&path=" + path +
            "&argc=" + argc +
            "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    }
    localsave.startDirect = startDirect;
    function start(path) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/start?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = req.responseText;
        return json;
    }
    localsave.start = start;
    function startnowait(path, fun) {
        if (fun === void 0) { fun = null; }
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/start?path=" + path + "&r=" + Math.random(), true);
        req.onreadystatechange = function (ev) {
            if (req.readyState == 4) {
                if (req.status == 404) {
                    if (fun != null)
                        fun(null, new Error("got a 404:" + path));
                    return;
                }
                if (fun != null)
                    fun(req.responseText, null);
            }
        };
        req.onerror = function () {
            if (fun != null)
                fun(null, new Error("onerr in req:"));
        };
        req.send(null);
    }
    localsave.startnowait = startnowait;
    function list(path) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/list?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = JSON.parse(req.responseText);
        return json;
    }
    localsave.list = list;
    function listTree(path) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/listtree?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = JSON.parse(req.responseText);
        return json;
    }
    localsave.listTree = listTree;
    function copy(from, to) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/copy?from=" + from + "&to=" + to + "&r=" + Math.random(), false);
        req.send(null);
        var json = JSON.parse(req.responseText);
        return json;
    }
    localsave.copy = copy;
    function remove(path) {
        var req = new XMLHttpRequest(); //ness
        //用同步方法，本地操作
        req.open("GET", "../../hybirdapi/remove?path=" + path + "&r=" + Math.random(), false);
        req.send(null);
        var json = JSON.parse(req.responseText);
        return json;
    }
    localsave.remove = remove;
    function load(url, fun) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                if (req.status == 404)
                    fun(url, null, new Error("onerr 404"));
                else
                    fun(url, req.responseText, null);
            }
        };
        req.onerror = function () {
            fun(url, null, new Error("onerr in req:"));
        };
        req.send();
    }
    localsave.load = load;
})(localsave || (localsave = {}));
//# sourceMappingURL=localsave.js.map