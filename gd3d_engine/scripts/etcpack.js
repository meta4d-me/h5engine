// 打包png或者jpg图片为etc1格式的KTX文件

const { execFile } = require('child_process');
var fs = require("fs");
const path = require("path");

var exePath = path.resolve(__dirname, "tools/etcpack.exe");
var exeDir = path.dirname(exePath);
var outDir = path.resolve(__dirname, "out");
var input = path.resolve(__dirname, "t_0012lvyeshu_obj_p_d.png");
// var input = path.resolve(__dirname, "orange.JPG");

var res = "test_ktx";
var assetbundlePath = path.resolve(__dirname, `../res/prefabs/test_ktx/resources/t_0012lvyeshu_obj_p_d.imgdesc.json`);

etcpackImgdesc(assetbundlePath);
// etcpack(input, outDir);

// `t_0012lvyeshu_obj_p_d.imgdesc.json`

function etcpackImgdesc(imgdescPath, callback)
{
    callback = callback || (() => { });
    try
    {
        var imgdesc = JSON.parse(readFile(imgdescPath));
    } catch (error)
    {
        console.warn(`JSON.parse ${imgdescPath} 错误！ ${error}`)
        callback(error)
        return;
    }

    var imgPath = path.resolve(path.dirname(imgdescPath), imgdesc.name);
    if (!fs.existsSync(imgPath))
    {
        console.warn(`${imgdescPath} 中图片资源 ${imgPath} 不存在！`)
        callback();
        return;
    }
    var dotIndex = imgdesc.name.lastIndexOf(".");
    if (dotIndex == -1)
    {
        console.warn(`图片路径 ${imgPath} 格式不对！`);
        callback();
        return;
    }

    var newImgName = imgdesc.name.substring(0, dotIndex + 1) + "ktx";
    etcpack(imgPath, path.dirname(imgPath), (err) =>
    {
        if (err)
        {
            callback();
            return;
        }
        imgdesc.name = newImgName;
        writeFile(imgdescPath, JSON.stringify(imgdesc));
        callback();
    });
}

function etcpack(input, outDir, callback)
{
    execFile(exePath, [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`, `-aa`], { cwd: exeDir }, function (err, data)
    {
        callback && callback(err);

        console.log(data.toString());
    });
}


function isExclude(pathStr)
{
    for (var i = 0; i < exclude.length; i++)
    {
        if (pathStr.includes(exclude[i]))
        {
            return true;
        }
    }
    return false;
}

function makeDir(dir)
{
    if (fs.existsSync(dir)) return;

    var pDir = path.dirname(dir);
    makeDir(pDir);

    fs.mkdirSync(dir);
}

function writeFile(filePath, content)
{
    var pDir = path.dirname(filePath);
    makeDir(pDir);

    fs.openSync(filePath, "w");
    fs.writeFileSync(filePath, content, 'utf8');
}

function readFile(filePath)
{
    fs.openSync(filePath, "r");
    var result = fs.readFileSync(filePath, `utf8`);
    return result;
}

function readFiles(filePaths)
{
    var result = {};
    filePaths.forEach(function (element)
    {
        result[element] = readFile(element);
    }, this);
    return result;
}

function getFilePaths(rootPath, filePaths, depth)
{
    if (depth == undefined) depth = 10000;
    if (depth < 0) return;
    filePaths = filePaths || [];
    var stats = fs.statSync(rootPath);
    if (stats.isFile())
    {
        filePaths.push(rootPath);
    } else if (stats.isDirectory)
    {
        var childPaths = fs.readdirSync(rootPath);
        for (var i = 0; i < childPaths.length; i++)
        {
            getFilePaths(rootPath + "/" + childPaths[i], filePaths, depth - 1);
        }
    }
    return filePaths;
}