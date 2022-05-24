/// <reference path="../lib/m4m_jsloader.d.ts" />
///<reference path="../lib_user/app.d.ts" />
window.onload = () =>
{
    //gd system lib
    // m4m.jsLoader.instance().addImportScript("lib/Reflect.js"); //微软反射库
    // m4m.jsLoader.instance().addImportScript("lib/m4m.js");


    // //user code
    // m4m.jsLoader.instance().addImportScript("lib_user/app.js");

    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    //init loadui
    var divLoading = document.createElement("div");
    divLoading.style.position = "absolute";
    divLoading.style.backgroundColor = "#555";
    divLoading.style.width = "100%";
    divLoading.style.height = "100%";
    divLoading.style.zIndex = "10000";
    document.body.appendChild(divLoading);

    var txt = document.createElement("span");
    txt.textContent = "这是一个临时的loader 界面，负责加载初始化脚本";
    divLoading.appendChild(txt);

    divLoading.appendChild(document.createElement("hr"));

    var loadtxt = document.createElement("span");
    divLoading.appendChild(loadtxt);

    //begin load
    m4m.jsLoader.instance().preload(
        //完成
        () =>
        {
            //normal
            var y = 0;
            var aniid = setInterval(() =>
            {
                y -= 0.05;
                divLoading.style.top = (y * 100).toString() + "%";
                if (y < -1)
                {
                    clearInterval(aniid);
                    //移除loadui
                    divLoading.parentNode.removeChild(divLoading);
                }
            }, 50);

            //完成加载
            var gdapp = new m4m.framework.application();
            var div = document.getElementById("drawarea") as HTMLDivElement;
            gdapp.start(div, m4m.framework.CanvasFixedType.Free,720);
            //gdapp.showFps();
            gdapp.bePlay = true;
            gdapp.addUserCode("main");

        }
        ,
        //进度变化
        (total, left) =>
        {
            loadtxt.textContent = "total js file:" + total + "  还剩多少个:" + left;
        }
    )
    document.onkeydown = (e) =>
    {
        if (e.keyCode == 116)//F5
        {
            document.location.reload();
            e.preventDefault();
        }
    };
}