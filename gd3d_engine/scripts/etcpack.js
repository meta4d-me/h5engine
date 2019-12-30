const { execFile } = require('child_process');
const path = require("path");

var exePath = path.resolve(__dirname, "tools/etcpack.exe");
var exeDir = path.dirname(exePath);
var outDir = path.resolve(__dirname, "out");
var input = path.resolve(__dirname, "t_0012lvyeshu_obj_p_d.png");
// var input = path.resolve(__dirname, "orange.JPG");

etcpack(input, outDir);

function etcpack(input, outDir, callback)
{
    execFile(exePath, [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`, `-aa`], { cwd: exeDir }, function (err, data)
    {
        callback && callback(err);

        console.log(data.toString());
    });
}