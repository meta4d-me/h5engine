// 修改Shader使其支持ETC1包含透明度的压缩纹理

var fs = require("fs");
var path = require('path');

var inDir = "res_etc1/可编辑Shaderlab/shader";
var outDir = "res_etc1/etc1_shader";

var shaderRegExp = /([\w\d]+)\.(vs|fs)\.glsl/;

var filepaths = getFilePaths(inDir);
filepaths.forEach(inPath =>
{
    var outPath = inPath.replace(inDir, outDir);
    var result = shaderRegExp.exec(inDir);
    if (result)
    {
        var shaderStr = readFile(inPath);
        if (!shaderStr.includes(`#define ETC1`))
        {
            if (shaderStr.indexOf(`texture2D(`))
            {

            }
        }
        writeFile(outPath, shaderStr);
    } else
    {
        var pDir = path.dirname(outPath);
        makeDir(pDir);

        fs.copyFileSync(inPath, outPath);
    }
});
console.log(filepaths);

function makeDir(dir)
{
    if (fs.existsSync(dir)) return;

    var pDir = path.dirname(dir);
    makeDir(pDir);

    fs.mkdirSync(dir);
}

function writeFile(filePath, content)
{
    options = options || 'utf8';
    fs.openSync(filePath, "w");
    fs.writeFileSync(filePath, content, 'utf8');
}

function readFile(filePath, options)
{
    options = options || 'utf8';
    fs.openSync(filePath, "r");
    var result = fs.readFileSync(filePath, options);
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