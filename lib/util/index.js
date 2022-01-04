"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printMsg = exports.clear = exports.modifyJsonFile = exports.writeJsonFile = exports.readJsonFile = exports.getProjectPath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const getProjectPath = (projectName) => {
    return (0, path_1.resolve)(process.cwd(), projectName);
};
exports.getProjectPath = getProjectPath;
/**
 * 读取指定路径下 json 文件
 * @param filename json 文件的路径
 */
function readJsonFile(filename) {
    return JSON.parse((0, fs_1.readFileSync)(filename, { encoding: 'utf-8', flag: 'r' }));
}
exports.readJsonFile = readJsonFile;
/**
 * 覆写指定路径下的 json 文件
 * @param filename json 文件的路径
 * @param content  json 内容
 */
function writeJsonFile(filename, content) {
    (0, fs_1.writeFileSync)(filename, JSON.stringify(content, null, 2));
}
exports.writeJsonFile = writeJsonFile;
const modifyJsonFile = async (callback) => {
    const packageJSON = readJsonFile('./package.json');
    callback(packageJSON);
    writeJsonFile('./package.json', packageJSON);
};
exports.modifyJsonFile = modifyJsonFile;
const clear = () => {
    console.clear();
};
exports.clear = clear;
const printMsg = (msg) => {
    console.log(msg);
};
exports.printMsg = printMsg;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQkFBaUQ7QUFDakQsK0JBQStCO0FBYXhCLE1BQU0sY0FBYyxHQUFHLENBQUMsV0FBbUIsRUFBVSxFQUFFO0lBQzVELE9BQU8sSUFBQSxjQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUZXLFFBQUEsY0FBYyxrQkFFekI7QUFFRjs7O0dBR0c7QUFDSCxTQUFnQixZQUFZLENBQUksUUFBZ0I7SUFDOUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUEsaUJBQVksRUFBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUZELG9DQUVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGFBQWEsQ0FBSSxRQUFnQixFQUFFLE9BQVU7SUFDM0QsSUFBQSxrQkFBYSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRkQsc0NBRUM7QUFFTSxNQUFNLGNBQWMsR0FBRyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7SUFDL0MsTUFBTSxXQUFXLEdBQWdCLFlBQVksQ0FBYyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdFLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0QixhQUFhLENBQWMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUQsQ0FBQyxDQUFDO0FBSlcsUUFBQSxjQUFjLGtCQUl6QjtBQUVLLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtJQUN4QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBRlcsUUFBQSxLQUFLLFNBRWhCO0FBRUssTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUZXLFFBQUEsUUFBUSxZQUVuQiJ9