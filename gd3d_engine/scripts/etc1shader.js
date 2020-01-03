// 修改Shader使其支持ETC1包含透明度的压缩纹理

var fs = require("fs");
var path = require('path');

var configStr = readFile("scripts/etc1.config.json");
var config;
eval(`config =` + configStr);

var inDir = config.shaderInDir;
var outDir = config.shaderOutDir;
var exclude = config.exclude;

const shaderRegExp = /([\w\d]+)\.(shader)\.json/;
const texture2DRegExp = /texture2D\s*\(/g;
// 第一个函数声明
const firstFuncRegExp = /((\w+\s+)*\w+\s+\w+\s*\([\w\s\,\.\*\[\]]*\)\s*\{)/;
// 精度声明
const precisionExp = /(precision\s+\w+\sfloat\s*;)/;
// shader中纹理属性
const textureExp = /(\w+)\([\'\"\w\s]+\,\s*Texture\s*\)/;


// 检测该标记，在该位置新增texture2DEtC1方法
const texture2DEtC1Mark = "//texture2DEtC1Mark";

// 拷贝文件
if (inDir != outDir)
{
    //
    copyFolder(inDir, outDir);
}
// 处理shader
handleShader(outDir);

/**
 * 处理shader
 * 
 * @param {string} shaderDir shader文件夹 
 */
function handleShader(shaderDir)
{
    var filepaths = getFilePaths(shaderDir);
    var shaderPaths = filepaths.filter(path => !!shaderRegExp.exec(path));

    // shader中包含的glsl列表
    var glslList = [];

    shaderPaths.forEach(shaderpath =>
    {
        var excludeInfo = exclude[path.basename(shaderpath)];
        // 排除属性列表
        var excludeProperties = excludeInfo ? Object.keys(excludeInfo) : [];
        var glslExt = "_etc1";
        if (excludeProperties.length > 0)
            glslExt += excludeProperties.join("_");

        var shaderStr = readFile(shaderpath);
        var shaderObj = JSON.parse(shaderStr);
        var properties = shaderObj.properties;
        // shader中包含的纹理列表
        var textures = [];
        if (properties)
        {
            textures = properties.reduce((pv, cv) =>
            {
                var result = textureExp.exec(cv);
                if (!!result) pv.push(result[1]); return pv;
            }, []);
        }
        // 处理排除纹理
        for (var i = 0; i < excludeProperties.length; i++)
        {
            var index = textures.indexOf(excludeProperties[i]);
            if (index != -1)
            {
                textures.splice(index, 1);
            }
        }

        //
        for (const passName in shaderObj.passes)
        {
            var pass = shaderObj.passes[passName];
            for (let i = 0; i < pass.length; i++)
            {
                glslList.push({
                    shaderpath: shaderpath,
                    source: path.resolve(path.dirname(shaderpath), pass[i].vs + ".vs.glsl"),
                    target: path.resolve(path.dirname(shaderpath), pass[i].vs + glslExt + ".vs.glsl"),
                    textures: textures
                });
                pass[i].vs += glslExt;

                glslList.push({
                    shaderpath: shaderpath,
                    source: path.resolve(path.dirname(shaderpath), pass[i].fs + ".fs.glsl"),
                    target: path.resolve(path.dirname(shaderpath), pass[i].fs + glslExt + ".fs.glsl"),
                    textures: textures
                });
                pass[i].fs += glslExt;
            }
        }
        writeFile(shaderpath, JSON.stringify(shaderObj, null, '\t').replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1'));
    });

    var newGLSL = {};
    var oldGLSL = {};
    //
    for (var i = 0; i < glslList.length; i++)
    {
        if (!newGLSL[glslList[i].target])
        {
            handleGLSL(glslList[i].source, glslList[i].target, glslList[i].textures);
        }
        oldGLSL[glslList[i].source] = true;
        newGLSL[glslList[i].target] = true;
    }

    // 删除被替换的GLSL
    for (const glslpath in oldGLSL)
    {
        fs.unlinkSync(glslpath);
    }

    console.log(`转换shader完成！`);
}

/**
 * 处理GLSL
 * 
 * @param {string} source 原始路径
 * @param {string} target 目标路径
 * @param {string[]} textures 需要转换的纹理
 */
function handleGLSL(source, target, textures)
{
    var shaderStr = readFile(source);
    if (textures.length > 0 && shaderStr.includes(texture2DEtC1Mark))
    {
        var hasTexture2D = false;
        for (var i = 0; i < textures.length; i++)
        {
            shaderStr = shaderStr.replace(new RegExp(`(\\w+)\\s*\\(\\s*${textures[i]}`), (substring, ...args) =>
            {
                if (args[0] == "texture2D")
                {
                    hasTexture2D = true;
                    return `texture2DEtC1(${textures[i]}`;
                } else
                {
                    console.warn(`无法处理 ${source} 中 ${substring}`);
                }
                return substring;
            });
        }

        // 替换 texture2DEtC1Mark
        if (hasTexture2D)
        {
            var texture2DEtC1Str = `
vec4 texture2DEtC1(sampler2D sampler,vec2 uv)
{
uv = uv - floor(uv);
uv.y = 1.0 - uv.y;
return vec4( texture2D(sampler, uv * vec2(1.0,0.5)).xyz, texture2D(sampler, uv * vec2(1.0,0.5) + vec2(0.0,0.5)).x);
}
            `;

            if (!precisionExp.exec(shaderStr))
            {
                texture2DEtC1Str = `
mediump vec4 texture2DEtC1(mediump sampler2D sampler,mediump vec2 uv)
{
uv = uv - floor(uv);
uv.y = 1.0 - uv.y;
mediump vec2 scale = vec2(1.0,0.5);
mediump vec2 offset = vec2(0.0,0.5);
return vec4( texture2D(sampler, uv * scale).xyz, texture2D(sampler, uv * scale + offset).x);
}
`;
            }

            // 把texture2DEtC1放在第一个函数前面
            shaderStr = shaderStr.replace(texture2DEtC1Mark,
                `
${texture2DEtC1Str}
`);
        }
    }
    writeFile(target, shaderStr);
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

/**
 * 获取文件路径列表
 * 
 * @param {string} rootPath 根路径
 * @param {string[]} filePaths 用于保存文件路径列表
 * @param {number} depth 深度
 */
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