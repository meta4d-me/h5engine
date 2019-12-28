// 修改Shader使其支持ETC1包含透明度的压缩纹理

var fs = require("fs");
var path = require('path');

var inDir = "res_etc1/可编辑Shaderlab/shader";
var outDir = "res_etc1/etc1_shader";
var exclude = [];
// var exclude = ["asi.fs.glsl", "barrel_blur.fs.glsl"];

var shaderRegExp = /([\w\d]+)\.(vs|fs)\.glsl/;
var texture2DRegExp = /texture2D\s*\(/g;
var mainRegExp = /(void\s+main\s*\()/;

var filepaths = getFilePaths(inDir);
filepaths.forEach(inPath =>
{
    var outPath = inPath.replace(inDir, outDir);
    var result = shaderRegExp.exec(inPath);
    if (result)
    {
        var shaderStr = readFile(inPath);
        var isExc = isExclude(inPath);
        if (!isExc && !shaderStr.includes(`texture2DEtC1`))
        {
            var result1 = texture2DRegExp.exec(shaderStr);
            if (result1)
            {
                shaderStr = shaderStr.replace(texture2DRegExp, `texture2DEtC1(`);

                shaderStr = shaderStr.replace(mainRegExp,
                    `

vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
    return vec4( texture2D(sampler, fract(uv) * vec2(1.0,0.5)).xyz, texture2D(sampler, fract(uv) * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}

$1`);
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