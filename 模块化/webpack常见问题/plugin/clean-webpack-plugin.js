const path = require("path");
const fs = require("fs");

class CleanWebpackPlugin {
    constructor(options){
        console.log("插件被创建了", options);
    }
    apply(compiler){
        // console.log("插件被执行了");
        // 可以通过compiler对象的options拿到webpack的配置文件
        // console.log(compiler.options);
        // console.log(compiler.hooks);
        // console.log(compiler.options.output.path);
        let outputPath = compiler.options.output.path;
        compiler.hooks.entryOption.tap("CleanWebpackPlugin", () => {
            this.cleanDir(outputPath);
        });
    }
    cleanDir(dirPath){
        // 注意点: 在NodeJS中不能直接删除非空的目录
        // 1.判断是否是一个非空的目录
        if(fs.statSync(dirPath).isDirectory() && fs.readdirSync(dirPath).length !== 0){
            // 2.如果是一个非空的目录, 那么就先删除这个目录中的内容
            let files = fs.readdirSync(dirPath);
            files.forEach((file)=>{
                let filePath = path.resolve(dirPath, file);
                if(fs.statSync(filePath).isDirectory()){
                    this.cleanDir(filePath);
                }else{
                    fs.unlinkSync(filePath);
                }
            })
        }
        // 3.如果不是一个非空的目录, 那么就直接删除这个目录
        fs.rmdirSync(dirPath);
    }
}
module.exports = CleanWebpackPlugin;