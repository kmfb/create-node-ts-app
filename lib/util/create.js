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
        shell.rm('-rf', dirPath);
        // process.exit(1)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUErQztBQUMvQyxrQ0FPaUI7QUFDakIsaUNBQWlDO0FBQ2pDLCtCQUErQjtBQUMvQixpQ0FBaUQ7QUFDakQsdUNBQWtDO0FBQ2xDLHlEQUF5RDtBQUN6RCw0Q0FBeUM7QUFFbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQVEsRUFBRTtJQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFBLHFCQUFjLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEMsSUFBSSxJQUFBLGVBQVUsRUFBQyxPQUFPLENBQUMsRUFBRTtRQUN2QixLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QixrQkFBa0I7S0FDbkI7QUFDSCxDQUFDLENBQUM7QUFOVyxRQUFBLFVBQVUsY0FNckI7QUFFSyxNQUFNLGNBQWMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFO0lBQzVDLE1BQU0sT0FBTyxHQUFHLElBQUEscUJBQWMsRUFBQyxXQUFXLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNuQyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDeEIsTUFBTSxjQUFjLEdBQUcsOEJBQThCLENBQUM7SUFDdEQsSUFBQSxrQkFBYSxFQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDMUIsS0FBSyxDQUFDLEVBQUUsQ0FDTixJQUFJLEVBQ0osSUFBQSxjQUFPLEVBQUMsTUFBTSxDQUFDLFVBQVUs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