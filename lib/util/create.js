"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.end = exports.installFeature = exports.selectFeature = exports.installDevEnviroment = exports.installTSAndInit = exports.changePackageInfo = exports.initProjectDir = exports.isDirExist = void 0;
const fs_1 = require("fs");
const util_1 = require("../util");
const shell = require("shelljs");
const path_1 = require("path");
const chalk_1 = require("chalk");
const inquirer_1 = require("inquirer");
const installFeatureMethod = require("./installFeature");
const constants_1 = require("../constants");
const isDirExist = (dirName) => {
    const dirPath = (0, util_1.getProjectPath)(dirName);
    if ((0, fs_1.existsSync)(dirPath)) {
        // shell.rm('-rf', dirPath);
        process.exit(1);
    }
};
exports.isDirExist = isDirExist;
const initProjectDir = (projectName) => {
    const dirPath = (0, util_1.getProjectPath)(projectName);
    shell.exec(`mkdir ${projectName}`);
    shell.cd(projectName);
    shell.exec(`mkdir src`);
    const indexJsContent = `console.log('hello, world!')`;
    (0, fs_1.writeFileSync)('./src/index.ts', indexJsContent, { encoding: 'utf-8' });
    shell.exec(`npm init -y`);
    shell.cp('-r', (0, path_1.resolve)(global.__APP_PATH, '.vscode'), (0, path_1.resolve)(dirPath, '.vscode'));
    (0, fs_1.writeFileSync)('./.gitignore', constants_1.gitignore, { encoding: 'utf-8' });
};
exports.initProjectDir = initProjectDir;
const changePackageInfo = (projectName) => {
    (0, util_1.modifyJsonFile)((packageJSON) => {
        packageJSON.name = packageJSON.description = projectName;
    });
};
exports.changePackageInfo = changePackageInfo;
const installTSAndInit = () => {
    (0, util_1.printMsg)((0, chalk_1.blue)('installTSAndInit...'));
    shell.exec('npm i typescript @types/node -D && pnpx tsc --init');
    // 覆写 tsconfig.json
    const tsconfigJson = {
        compileOnSave: true,
        compilerOptions: {
            target: 'ES2018',
            module: 'commonjs',
            moduleResolution: 'node',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            inlineSourceMap: true,
            noImplicitThis: true,
            noUnusedLocals: true,
            stripInternal: true,
            pretty: true,
            declaration: true,
            outDir: 'lib',
            baseUrl: './',
            paths: {
                '*': ['src/*'],
            },
        },
        exclude: ['lib', 'node_modules'],
    };
    (0, util_1.writeJsonFile)('./tsconfig.json', tsconfigJson);
};
exports.installTSAndInit = installTSAndInit;
const installDevEnviroment = () => {
    (0, util_1.printMsg)((0, chalk_1.blue)('installDevEnviroment...'));
    shell.exec('npm i ts-node-dev -D');
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson.scripts['dev:comment'] = '启动开发环境';
        packageJson.scripts['dev'] =
            'ts-node-dev --respawn --transpile-only src/index.ts';
    });
};
exports.installDevEnviroment = installDevEnviroment;
/**
 * 交互式命令行，让用户自己选择需要的功能
 * return ['ESLint', 'Prettier', 'CZ']
 */
async function selectFeature() {
    // 清空命令行
    (0, util_1.clear)();
    // 输出信息
    /* eslint-disable @typescript-eslint/no-var-requires */
    (0, util_1.printMsg)((0, chalk_1.blue)(`TS CLI v${require('../../package.json').version}`));
    (0, util_1.printMsg)('Start initializing the project:');
    (0, util_1.printMsg)('');
    // 选择功能，这里配合 下面的 installFeature 方法 和 ./installFeature.ts 文件为脚手架提供了良好的扩展机制
    // 将来扩展其它功能只需要在 choices 数组中增加配置项，然后在 ./installFeature.ts 文件中增加相应的安装方法即可
    const { feature } = await (0, inquirer_1.prompt)([
        {
            name: 'feature',
            type: 'checkbox',
            message: 'Check the features needed for your project',
            choices: [
                { name: 'ESLint', value: 'ESLint' },
                { name: 'Prettier', value: 'Prettier' },
                { name: 'CZ', value: 'CZ' },
            ],
        },
    ]);
    return feature;
}
exports.selectFeature = selectFeature;
/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
function installFeature(feature) {
    feature.forEach((item) => {
        const func = installFeatureMethod[`install${item}`];
        func();
    });
    // 安装 husky 和 lint-staged
    installHusky(feature);
    // 安装构建工具
    installFeatureMethod.installBuild(feature);
}
exports.installFeature = installFeature;
/**
 * 安装 husky 和 lint-staged，并根据功能设置相关命令
 * @param feature 用户选择的功能列表
 */
function installHusky(feature) {
    // 初始化 git 仓库
    shell.exec('git init');
    (0, util_1.printMsg)((0, chalk_1.blue)('installHusky...'));
    // 在安装 husky 和 lint-staged
    shell.exec('npm i husky lint-staged -D');
    shell.exec(`npm set-script prepare "husky install"`);
    shell.exec(`npm run prepare`);
    // feature 副本
    const featureBak = JSON.parse(JSON.stringify(feature));
    // 设置 hook
    const hooks = {};
    // 判断用户是否选择了 CZ，有则设置 hooks
    if (featureBak.includes('CZ')) {
        hooks['prepare-commit-msg'] = 'exec < /dev/tty && git cz --hook || true';
        shell.exec(`npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`);
    }
    if (featureBak.includes('ESLint') || featureBak.includes('Prettier')) {
        (0, util_1.printMsg)((0, chalk_1.blue)('lint-staged...'));
        shell.exec('npx mrm@2 lint-staged');
    }
    installFeatureMethod.installHusky(hooks);
}
/**
 * 整个项目安装结束，给用户提示信息
 */
function end(projectName) {
    (0, util_1.printMsg)(`Successfully created project ${(0, chalk_1.yellow)(projectName)}`);
    (0, util_1.printMsg)('Get started with the following commands:');
    (0, util_1.printMsg)('');
    (0, util_1.printMsg)(`${(0, chalk_1.gray)('$')} ${(0, chalk_1.cyan)('cd ' + projectName)}`);
    (0, util_1.printMsg)(`${(0, chalk_1.gray)('$')} ${(0, chalk_1.cyan)('npm run dev')}`);
    (0, util_1.printMsg)('');
}
exports.end = end;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUErQztBQUMvQyxrQ0FPaUI7QUFDakIsaUNBQWlDO0FBQ2pDLCtCQUErQjtBQUMvQixpQ0FBaUQ7QUFDakQsdUNBQWtDO0FBQ2xDLHlEQUF5RDtBQUN6RCw0Q0FBeUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQVEsRUFBRTtJQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFBLHFCQUFjLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBSSxJQUFBLGVBQVUsRUFBQyxPQUFPLENBQUMsRUFBRTtRQUN2Qiw0QkFBNEI7UUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtBQUNILENBQUMsQ0FBQztBQU5XLFFBQUEsVUFBVSxjQU1yQjtBQUVLLE1BQU0sY0FBYyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUU7SUFDNUMsTUFBTSxPQUFPLEdBQUcsSUFBQSxxQkFBYyxFQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN4QixNQUFNLGNBQWMsR0FBRyw4QkFBOEIsQ0FBQztJQUN0RCxJQUFBLGtCQUFhLEVBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdkUsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMxQixLQUFLLENBQUMsRUFBRSxDQUNOLElBQUksRUFDSixJQUFBLGNBQU8sRUFBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMs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