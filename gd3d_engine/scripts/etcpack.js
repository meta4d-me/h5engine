// 打包png或者jpg图片为etc1格式的KTX文件

const { execFile } = require('child_process');
var fs = require("fs");
const path = require("path");

var configStr = readFile("scripts/etc1.config.json");
var config;
eval(`config =` + configStr);

var inDir = config.assetInDir;
var outDir = config.assetOutDir;
var exclude = config.exclude;

var exePath = path.resolve(__dirname, "tools/etcpack.exe");
var exeDir = path.dirname(exePath);
// var outDir = path.resolve(__dirname, "out");
// var input = path.resolve(__dirname, "t_0012lvyeshu_obj_p_d.png");
// var input = path.resolve(__dirname, "orange.JPG");
// etcpack(input, outDir);

// var assetbundlePath = path.resolve(__dirname, `../res/prefabs/test_ktx/resources/t_0012lvyeshu_obj_p_d.imgdesc.json`);
// etcpackImgdesc(assetbundlePath);

// var assetDir = path.resolve(__dirname, `../res/prefabs`);

// 拷贝文件
if (inDir != outDir)
{
    copyFolder(inDir, outDir);
}
// 处理shader
etcpackImgdescInFolder(outDir);

function etcpackImgdescInFolder(dir, callback)
{
    callback = callback || (() => { });
    if (!fs.existsSync(dir))
    {
        console.warn(`文件夹 ${dir} 不存在！`)
        callback();
        return;
    }
    var imgdescs = getFilePaths(dir).filter(p =>
    {
        return p.substring(p.length - ".imgdesc.json".length) == ".imgdesc.json";
    })
    var total = imgdescs.length;
    handlers();

    function handlers()
    {
        console.log(`进度 ${total - imgdescs.length}/${total}`);
        if (imgdescs.length == 0)
        {
            callback();
            return;
        }
        var imgdescPath = imgdescs.pop();
        etcpackImgdesc(imgdescPath, handlers);
    }

}

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

    var imgName = imgdesc.name;
    var imgPath = path.resolve(path.dirname(imgdescPath), imgName);
    if (!fs.existsSync(imgPath))
    {
        console.warn(`${imgdescPath} 中图片资源 ${imgPath} 不存在！`)
        callback();
        return;
    }
    var dotIndex = imgName.lastIndexOf(".");
    if (dotIndex == -1)
    {
        console.warn(`图片路径 ${imgPath} 格式不对！`);
        callback();
        return;
    }

    if (imgName.substring(imgName.length - ".ktx".length) == ".ktx")
    {
        callback();
        return;
    }

    var newImgName = imgName.substring(0, dotIndex + 1) + "ktx";
    etcpack(imgPath, path.dirname(imgPath), (err) =>
    {
        if (err)
        {
            callback();
            return;
        }
        // 删除原图片
        fs.unlinkSync(imgPath);
        //
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

function copyFolder(inDir, outDir)
{
    console.log(`开始拷贝文件。`);
    var filepaths = getFilePaths(inDir);
    var len = filepaths.length;
    filepaths.forEach((inPath, i) =>
    {
        var outPath = inPath.replace(inDir, outDir);
        var pDir = path.dirname(outPath);
        makeDir(pDir);

        fs.copyFileSync(inPath, outPath);
        console.log(`拷贝文件 ${i} / ${len}`)
    });
    console.log(`结束拷贝文件。`);
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