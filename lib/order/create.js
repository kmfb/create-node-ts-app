"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("../util/create");
// create 命令
async function create(projectName) {
    // 判断文件是否已经存在
    (0, create_1.isDirExist)(projectName);
    // 选择需要的功能
    const feature = await (0, create_1.selectFeature)();
    console.log(feature);
    (0, create_1.initProjectDir)(projectName);
    (0, create_1.changePackageInfo)(projectName);
    (0, create_1.installTSAndInit)();
    (0, create_1.installDevEnviroment)();
    // 安装 feature
    (0, create_1.installFeature)(feature);
    (0, create_1.end)(projectName);
}
exports.default = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29yZGVyL2NyZWF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQVN3QjtBQUV4QixZQUFZO0FBQ0csS0FBSyxVQUFVLE1BQU0sQ0FBQyxXQUFtQjtJQUN0RCxhQUFhO0lBQ2IsSUFBQSxtQkFBVSxFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3hCLFVBQVU7SUFDVixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUEsc0JBQWEsR0FBRSxDQUFDO0lBRXRDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckIsSUFBQSx1QkFBYyxFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVCLElBQUEsMEJBQWlCLEVBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0IsSUFBQSx5QkFBZ0IsR0FBRSxDQUFDO0lBQ25CLElBQUEsNkJBQW9CLEdBQUUsQ0FBQztJQUN2QixhQUFhO0lBQ2IsSUFBQSx1QkFBYyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLElBQUEsWUFBRyxFQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25CLENBQUM7QUFmRCx5QkFlQyJ9