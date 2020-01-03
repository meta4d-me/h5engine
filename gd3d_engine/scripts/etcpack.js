// 打包png或者jpg图片为etc1格式的KTX文件

const { execFile } = require('child_process');
var fs = require("fs");
const path = require("path");

//----------------------常量----------------
/**
 * 材质配置文件后缀
 */
const matExt = ".mat.json";
/**
 * 图片描述文件后缀
 */
const imgdescExt = ".imgdesc.json";

// 读取配置
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

    var mats = getFilePaths(dir).filter(p =>
    {
        return p.substring(p.length - matExt.length) == matExt;
    });

    var imgdescs = [];
    for (var i = 0; i < mats.length; i++)
    {
        var addImgdescs = getImgdescFromMat(mats[i], exclude);
        imgdescs = imgdescs.concat(addImgdescs);
    }

    var total = imgdescs.length;
    console.log(`开始压缩ETC1`);
    handlers();

    function handlers()
    {
        console.log(`进度 ${total - imgdescs.length}/${total}`);
        if (imgdescs.length == 0)
        {
            callback();
            console.log(`结束压缩ETC1`);
            return;
        }
        var imgdescPath = imgdescs.pop();
        etcpackImgdesc(imgdescPath.imgdescPath, imgdescPath.isDiscardAlpha, handlers);
    }

}

/**
 * 获取材质中图片描述列表
 * 
 * @param {string} matPath 材质路径
 * @param {{[shader:string]:[]}} exclude shader排除列表
 */
function getImgdescFromMat(matPath, exclude)
{
    try
    {
        var mat = JSON.parse(readFile(matPath));
    } catch (error)
    {
        console.warn(`JSON.parse ${matPath} 错误！ ${error}`)
        callback(error)
        return;
    }

    var result = [];

    var excludeInfo = exclude[mat.shader];

    var mapUniform = mat.mapUniform;
    for (const key in mapUniform)
    {
        var itemValue = mapUniform[key].value;
        if (typeof itemValue == "string" && isFileOfExt(itemValue, imgdescExt))
        {
            var isDiscardAlpha = false;
            if (excludeInfo && excludeInfo.includes(key))
            {
                isDiscardAlpha = true;
            }
            //
            var imgdescPath = path.resolve(path.dirname(matPath), itemValue);
            result.push({ imgdescPath: imgdescPath, isDiscardAlpha: isDiscardAlpha });
        }
    }
    return result;
}


function etcpackImgdesc(imgdescPath, isDiscardAlpha, callback)
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
    etcpack(imgPath, path.dirname(imgPath), isDiscardAlpha, (err) =>
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

/**
 * 压缩ETC纹理
 * 
 * @param {string} input 输入图片文件路径
 * @param {string} outDir 输出文件夹路径
 * @param {boolean} isDiscardAlpha 如果为真则丢弃alpha通道，否则生成包含alpha的图集
 * @param {(err:Error)=>void} callback 完成回调
 */
function etcpack(input, outDir, isDiscardAlpha, callback)
{
    var args = [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`];
    if (!isDiscardAlpha)
        args.push("-aa");

    execFile(exePath, args, { cwd: exeDir }, function (err, data)
    {
        callback && callback(err);

        console.log(data.toString());
    });
}

/**
 * 是否为指定后缀名称的文件
 * 
 * @param {string} path 文件路径
 * @param {string} ext 后缀名称
 */
function isFileOfExt(path, ext)
{
    var b = path.substring(path.length - ext.length) == ext
    return b;
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