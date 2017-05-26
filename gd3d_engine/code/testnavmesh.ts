class test_navmesh implements IState
{
    app: gd3d.framework.application;
    scene: gd3d.framework.scene;
    start(app: gd3d.framework.application)
    {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();

        //添加一个摄像机
        var objCam = new gd3d.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as gd3d.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new gd3d.math.vector3(0, 10, -10);
        gd3d.io.loadText("res/navinfo.json", (text, error) =>
        {
            this.navmeshLoaded(text);
            objCam.lookat(this.navObj);
            objCam.markDirty();//标记为需要刷新
        });
    }

    /**
     * 地图寻路网格加载完成
     * @param e
     * @param thisObj
     */
    private navmeshLoaded(dataStr)
    {
        console.warn("navmeshLoaded");
        this.navObj = new gd3d.framework.transform();
        this.navObj.name = "navMesh";
        var meshD = new gd3d.render.meshData();
        meshD.pos = [];
        meshD.trisindex = [];

        var navinfo = lighttool.NavMesh.navMeshInfo.LoadMeshInfo(dataStr);
        for (var i = 0; i < navinfo.vecs.length; i++)
        {
            var v = navinfo.vecs[i];
            meshD.pos[i] = new gd3d.math.vector3(v.x, v.y, v.z);
        }
        var navindexmap = {};
        let indexDatas: number[] = [];
        for (var i = 0; i < navinfo.nodes.length; i++)
        {
            var poly = navinfo.nodes[i].poly;
            for (var fc = 0; fc < poly.length - 2; fc++)
            {
                var sindex = indexDatas.length / 3;
                navindexmap[sindex] = i;//做一个三角形序号映射表
                /**
                *此处处理顶点索引时按照画面的模式来的，即不需要重复的顶点，如果要在图上画出正确的线框，就用画线框的模式，即需要重复的顶点。
                其实无论哪种模式，只要跟webgl的api对应上就好。
                */
                indexDatas.push(poly[0]);
                indexDatas.push(poly[fc + 2]);
                indexDatas.push(poly[fc + 1]);
            }
        }
        meshD.trisindex = indexDatas;

        let meshFiter = this.navObj.gameObject.addComponent("meshFilter") as gd3d.framework.meshFilter;
        let mesh = this.createMesh(meshD, this.app.webgl);
        meshFiter.mesh = mesh;
        let renderer = this.navObj.gameObject.addComponent("meshRenderer") as gd3d.framework.meshRenderer;

        this.app.getScene().addChild(this.navObj);

        this.navObj.markDirty();
    }

    //构建mesh 并返回
    private createMesh(meshData: gd3d.render.meshData, webgl: WebGLRenderingContext): gd3d.framework.mesh
    {
        var _mesh = new gd3d.framework.mesh("NavMesh" + ".mesh.bin");
        _mesh.data = meshData;
        var vf = gd3d.render.VertexFormatMask.Position;
        var v32 = _mesh.data.genVertexDataArray(vf);
        var i16 = _mesh.data.genIndexDataArray();

        _mesh.glMesh = new gd3d.render.glMesh();
        _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexSubData(webgl, v32);

        _mesh.glMesh.addIndex(webgl, i16.length);
        _mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
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
        return _mesh;
    }
    camera: gd3d.framework.camera;
    navObj: gd3d.framework.transform;
    timer: number = 0;
    update(delta: number)
    {

    }
}


namespace lighttool.NavMesh
{
    export class navVec3
    {
        x: number = 0;
        y: number = 0;
        z: number = 0;
        clone(): navVec3
        {
            var navVec: navVec3 = new navVec3();
            navVec.x = this.x;
            navVec.y = this.y;
            navVec.z = this.z;
            return navVec;
        }
        static DistAZ(start: navVec3, end: navVec3): number
        {
            var num: number = end.x - start.x;
            var num2: number = end.z - start.z;
            return Math.sqrt(num * num + num2 * num2);
        }
        static NormalAZ(start: navVec3, end: navVec3): navVec3
        {
            var num: number = end.x - start.x;
            var num2: number = end.z - start.z;
            var num3: number = Math.sqrt(num * num + num2 * num2);
            var navVec: navVec3 = new navVec3();
            navVec.x = num / num3;
            navVec.y = 0.0;
            navVec.z = num2 / num3;
            return navVec;
        }
        static Cross(start: navVec3, end: navVec3): navVec3
        {
            var navVec: navVec3 = new navVec3();
            navVec.x = start.y * end.z - start.z * end.y;
            navVec.y = start.z * end.x - start.x * end.z;
            navVec.z = start.x * end.y - start.y * end.x;
            return navVec;
        }
        static DotAZ(start: navVec3, end: navVec3): number
        {
            return start.x * end.x + start.z * end.z;
        }
        static Angle(start: navVec3, end: navVec3): number
        {
            var d: number = start.x * end.x + start.z * end.z;
            var navVec: navVec3 = navVec3.Cross(start, end);
            var num: number = Math.acos(d);
            var flag: boolean = navVec.y < 0.0;
            if (flag)
            {
                num = -num;
            }
            return num;
        }
        static Border(start: navVec3, end: navVec3, dist: number): navVec3
        {
            var navVec: navVec3 = navVec3.NormalAZ(start, end);
            var navVec2: navVec3 = new navVec3();
            navVec2.x = start.x + navVec.x * <number>dist;
            navVec2.y = start.y + navVec.y * <number>dist;
            navVec2.z = start.z + navVec.z * <number>dist;
            return navVec2;
        }

    }
    export class navNode
    {
        nodeID: number = 0;
        poly: number[] = null;
        borderByPoly: string[] = null;
        borderByPoint: string[] = null;
        center: navVec3 = null;
        genBorder(): void
        {
            var list: string[] = [];
            for (var i: number = 0; i < this.poly.length; i = i + 1)
            {
                var num: number = i;
                var num2: number = i + 1;
                var flag: boolean = num2 >= this.poly.length;
                if (flag)
                {
                    num2 = 0;
                }
                var num3: number = this.poly[num];
                var num4: number = this.poly[num2];
                var flag2: boolean = num3 < num4;
                if (flag2)
                {
                    list.push(num3 + "-" + num4);
                }
                else
                {
                    list.push(num4 + "-" + num3);
                }
            }
            this.borderByPoint = list;
        }
        isLinkTo(info: navMeshInfo, nid: number): string
        {
            var flag: boolean = this.nodeID === nid;
            var result: string;
            if (flag)
            {
                result = null;
            }
            else
            {
                var flag2: boolean = nid < 0;
                if (flag2)
                {
                    result = null;
                }
                else
                {
                    var array: string[] = this.borderByPoly;
                    for (var i: number = 0; i < array.length; i = i + 1)
                    {
                        var text: string = array[i];
                        var flag3: boolean = (info.borders[text] == undefined);
                        if (!flag3)
                        {
                            var flag4: boolean = info.borders[text].nodeA === nid || info.borders[text].nodeB === nid;
                            if (flag4)
                            {
                                result = text;
                                return result;
                            }
                        }
                    }
                    result = null;
                }
            }
            return result;
        }
        getLinked(info: navMeshInfo): number[]
        {
            var list: number[] = [];
            var array: string[] = this.borderByPoly;
            for (var i: number = 0; i < array.length; i = i + 1)
            {
                var key: string = array[i];
                var flag: boolean = (info.borders[key] == undefined);
                if (!flag)
                {
                    var flag2: boolean = info.borders[key].nodeA === this.nodeID;
                    var num: number;
                    if (flag2)
                    {
                        num = info.borders[key].nodeB;
                    }
                    else
                    {
                        num = info.borders[key].nodeA;
                    }
                    var flag3: boolean = num >= 0;
                    if (flag3)
                    {
                        list.push(num);
                    }
                }
            }
            return list;
        }
        genCenter(info: navMeshInfo): void
        {
            this.center = new navVec3();
            this.center.x = 0.0;
            this.center.y = 0.0;
            this.center.z = 0.0;
            var array: number[] = this.poly;
            for (var i: number = 0; i < array.length; i = i + 1)
            {
                var num: number = array[i];
                this.center.x += info.vecs[num].x;
                this.center.y += info.vecs[num].y;
                this.center.z += info.vecs[num].z;
            }
            this.center.x /= <number>this.poly.length;
            this.center.y /= <number>this.poly.length;
            this.center.z /= <number>this.poly.length;
        }
    }
    export class navBorder 
    {
        borderName: string = null;
        nodeA: number = 0;
        nodeB: number = 0;
        pointA: number = 0;
        pointB: number = 0;
        length: number = 0;
        center: navVec3 = null;
    }
    export class navMeshInfo 
    {
        vecs: navVec3[] = null;
        nodes: navNode[] = null;
        borders: { [id: string]: navBorder } = null;
        min: navVec3 = null;
        max: navVec3 = null;
        calcBound(): void
        {
            this.min = new navVec3();
            this.max = new navVec3();
            this.min.x = 1.7976931348623157E+308;
            this.min.y = 1.7976931348623157E+308;
            this.min.z = 1.7976931348623157E+308;
            this.max.x = -1.7976931348623157E+308;
            this.max.y = -1.7976931348623157E+308;
            this.max.z = -1.7976931348623157E+308;
            for (var i: number = 0; i < this.vecs.length; i = i + 1)
            {
                var flag: boolean = this.vecs[i].x < this.min.x;
                if (flag)
                {
                    this.min.x = this.vecs[i].x;
                }
                var flag2: boolean = this.vecs[i].y < this.min.y;
                if (flag2)
                {
                    this.min.y = this.vecs[i].y;
                }
                var flag3: boolean = this.vecs[i].z < this.min.z;
                if (flag3)
                {
                    this.min.z = this.vecs[i].z;
                }
                var flag4: boolean = this.vecs[i].x > this.max.x;
                if (flag4)
                {
                    this.max.x = this.vecs[i].x;
                }
                var flag5: boolean = this.vecs[i].y > this.max.y;
                if (flag5)
                {
                    this.max.y = this.vecs[i].y;
                }
                var flag6: boolean = this.vecs[i].z > this.max.z;
                if (flag6)
                {
                    this.max.z = this.vecs[i].z;
                }
            }
        }
        private static cross(p0: navVec3, p1: navVec3, p2: navVec3): number
        {
            return (p1.x - p0.x) * (p2.z - p0.z) - (p2.x - p0.x) * (p1.z - p0.z);
        }
        inPoly(p: navVec3, poly: number[]): boolean
        {
            var num: number = 0;
            var flag: boolean = poly.length < 3;
            var result: boolean;
            if (flag)
            {
                result = false;
            }
            else
            {
                var flag2: boolean = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[1]]) < (-num);
                if (flag2)
                {
                    result = false;
                }
                else
                {
                    var flag3: boolean = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[poly.length - 1]]) > num;
                    if (flag3)
                    {
                        result = false;
                    }
                    else
                    {
                        var i: number = 2;
                        var num2: number = poly.length - 1;
                        var num3: number = -1;
                        while (i <= num2)
                        {
                            var num4: number = i + num2 >> 1;
                            var flag4: boolean = navMeshInfo.cross(this.vecs[poly[0]], p, this.vecs[poly[num4]]) < (-num);
                            if (flag4)
                            {
                                num3 = num4;
                                num2 = num4 - 1;
                            }
                            else
                            {
                                i = num4 + 1;
                            }
                        }
                        var num5: number = navMeshInfo.cross(this.vecs[poly[num3 - 1]], p, this.vecs[poly[num3]]);
                        result = (num5 > num);
                    }
                }
            }
            return result;
        }
        genBorder(): void
        {
            var __border: { [id: string]: navBorder } = {};
            for (var i0: number = 0; i0 < this.nodes.length; i0 = i0 + 1)
            {
                var n: navNode = this.nodes[i0];
                for (var i1: number = 0; i1 < n.borderByPoint.length; i1 = i1 + 1)
                {
                    var b: string = n.borderByPoint[i1];
                    if (__border[b] == undefined)
                    {
                        __border[b] = new navBorder();
                        __border[b].borderName = b;
                        __border[b].nodeA = n.nodeID;
                        __border[b].nodeB = -1;
                        __border[b].pointA = -1;
                    }
                    else
                    {
                        __border[b].nodeB = n.nodeID;
                        if (__border[b].nodeA > __border[b].nodeB)
                        {
                            __border[b].nodeB = __border[b].nodeA;
                            __border[b].nodeB = n.nodeID;
                        }
                        var na: navNode = this.nodes[__border[b].nodeA];
                        var nb: navNode = this.nodes[__border[b].nodeB];
                        for (var i2: number = 0; i2 < na.poly.length; i2 = i2 + 1)
                        {
                            var i: number = na.poly[i2];
                            if (nb.poly.indexOf(i) >= 0)
                            {
                                if (__border[b].pointA == -1)
                                    __border[b].pointA = i;
                                else
                                    __border[b].pointB = i;
                            }
                        }
                        var left: number = __border[b].pointA;
                        var right: number = __border[b].pointB;

                        var xd: number = this.vecs[left].x - this.vecs[right].x;
                        var yd: number = this.vecs[left].y - this.vecs[right].y;
                        var zd: number = this.vecs[left].z - this.vecs[right].z;

                        __border[b].length = <number>Math.sqrt(xd * xd + yd * yd + zd * zd);
                        __border[b].center = new navVec3();
                        __border[b].center.x = this.vecs[left].x * 0.5 + this.vecs[right].x * 0.5;
                        __border[b].center.y = this.vecs[left].y * 0.5 + this.vecs[right].y * 0.5;
                        __border[b].center.z = this.vecs[left].z * 0.5 + this.vecs[right].z * 0.5;
                        __border[b].borderName = __border[b].nodeA + "-" + __border[b].nodeB;
                    }
                }
            }

            var namechange: { [id: string]: string } = {};// Dictionary< string, string> = new Dictionary<string, string>();
            for (var key in __border)
            {
                if (__border[key].nodeB < 0)
                {
                }
                else
                {
                    namechange[key] = __border[key].borderName;
                }
            }
            this.borders = {};// new Dictionary<string, navBorder>();
            for (var key in __border)
            {
                if (namechange[key] != undefined)
                {
                    this.borders[namechange[key]] = __border[key];
                }
            }

            for (var m: number = 0; m < this.nodes.length; m = m + 1)
            {
                var v: navNode = this.nodes[m];
                var newborder: string[] = [];
                for (var nnn: number = 0; nnn < v.borderByPoint.length; nnn = nnn + 1)
                {
                    var b: string = v.borderByPoint[nnn];
                    if (namechange[b] != undefined)
                    {
                        newborder.push(namechange[b]);
                    }
                }
                v.borderByPoly = newborder;
            }
        }

        static LoadMeshInfo(s: string): navMeshInfo
        {
            var j = JSON.parse(s);
            var info: navMeshInfo = new navMeshInfo();
            var listVec: navVec3[] = [];//new List<navVec3>();

            for (var jsonid in j["v"])
            {
                var v3 = new navVec3();

                v3.x = j["v"][jsonid][0];
                v3.y = j["v"][jsonid][1];
                v3.z = j["v"][jsonid][2];
                listVec.push(v3);
            }
            info.vecs = listVec;

            var polys: navNode[] = [];
            var list = j["p"];
            for (var i = 0; i < list.length; i++)

            //foreach (var json in j.asDict()["p"].AsList())
            {
                var json = list[i];
                var node = new navNode();
                node.nodeID = i;
                var poly: number[] = [];//new List<int>();
                for (var tt in json)
                {
                    poly.push(json[tt]);
                }
                node.poly = poly;
                node.genBorder();//这里生成的border 是顶点border
                node.genCenter(info);
                polys.push(node);
            }
            info.nodes = polys;

            info.calcBound();
            info.genBorder();//这里会修改为 polyborder，这是个偷懒的修改
            return info;
        }

    }
}