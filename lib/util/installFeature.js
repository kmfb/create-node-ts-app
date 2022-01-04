"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installBuild = exports.installHusky = exports.installCZ = exports.installPrettier = exports.installESLint = void 0;
const chalk_1 = require("chalk");
const constants_1 = require("../constants");
const fs_1 = require("fs");
const shell = require("shelljs");
const util_1 = require("../util");
/**
 * 安装 ESLint
 */
function installESLint() {
    (0, util_1.printMsg)((0, chalk_1.blue)('installESLint...'));
    shell.exec('npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D');
    try {
        (0, fs_1.writeFileSync)('./.eslintrc.js', constants_1.eslintrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Failed to write .eslintrc.js file content')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in .eslintrc.js')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)(constants_1.eslintrc)}`);
    }
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson.scripts['eslint:comment'] =
            '使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件';
        packageJson.scripts['eslint'] =
            'eslint --fix src --ext .ts --max-warnings=0';
    });
}
exports.installESLint = installESLint;
/**
 * 安装 Prettier
 */
function installPrettier() {
    (0, util_1.printMsg)((0, chalk_1.blue)('installPrettier...'));
    shell.exec('npm i prettier -D');
    try {
        (0, fs_1.writeFileSync)('./.prettierrc.js', constants_1.prettierrc, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Failed to write .prettierrc.js file content')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in .prettierrc.js')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)(constants_1.prettierrc)}`);
    }
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson.scripts['prettier:comment'] =
            '自动格式化 src 目录下的所有 .ts 文件';
        packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"';
    });
}
exports.installPrettier = installPrettier;
/**
 * 安装 CZ，规范 git 提交信息
 */
function installCZ() {
    (0, util_1.printMsg)((0, chalk_1.blue)('installCZ...'));
    shell.exec('npx commitizen init cz-conventional-changelog --save-dev --save-exact');
    shell.exec('npm i @commitlint/cli @commitlint/config-conventional -D');
    try {
        (0, fs_1.writeFileSync)('./commitlint.config.js', constants_1.commitlint, { encoding: 'utf-8' });
    }
    catch (err) {
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Failed to write commitlint.config.js file content')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)('Please add the following content in commitlint.config.js')}`);
        (0, util_1.printMsg)(`${(0, chalk_1.red)(constants_1.commitlint)}`);
    }
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
        packageJson.scripts['commit'] = 'cz';
    });
}
exports.installCZ = installCZ;
/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
function installHusky(hooks) {
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson['husky'] = {
            hooks: {
                ...hooks,
            },
        };
    });
}
exports.installHusky = installHusky;
/**
 * 安装构建工具，目前主要用于小项目，所以使用 typescript 原生的构建功能即可
 */
function installBuild(feature) {
    (0, util_1.modifyJsonFile)((packageJson) => {
        packageJson.scripts['build:comment'] = '构建';
        let order = '';
        if (feature.includes('ESLint')) {
            order += 'npm run eslint';
        }
        if (feature.includes('Prettier')) {
            order += ' && npm run prettier';
        }
        order += ' && rm -rf lib && tsc --build';
        packageJson.scripts['build'] = order;
    });
}
exports.installBuild = installBuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbEZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9pbnN0YWxsRmVhdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBa0M7QUFDbEMsNENBQWdFO0FBQ2hFLDJCQUFtQztBQUNuQyxpQ0FBaUM7QUFFakMsa0NBQW1EO0FBRW5EOztHQUVHO0FBQ0gsU0FBZ0IsYUFBYTtJQUMzQixJQUFBLGVBQVEsRUFBQyxJQUFBLFlBQUksRUFBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7SUFFbkMsS0FBSyxDQUFDLElBQUksQ0FDUiw0RUFBNEUsQ0FDN0UsQ0FBQztJQUVGLElBQUk7UUFDRixJQUFBLGtCQUFhLEVBQUMsZ0JBQWdCLEVBQUUsb0JBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2xFO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixJQUFBLGVBQVEsRUFBQyxHQUFHLElBQUEsV0FBRyxFQUFDLDJDQUEyQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLElBQUEsZUFBUSxFQUFDLEdBQUcsSUFBQSxXQUFHLEVBQUMsa0RBQWtELENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBQSxlQUFRLEVBQUMsR0FBRyxJQUFBLFdBQUcsRUFBQyxvQkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsSUFBQSxxQkFBYyxFQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7UUFDN0IsV0FBVyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuQyx5Q0FBeUMsQ0FBQztRQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUMzQiw2Q0FBNkMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFyQkQsc0NBcUJDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixlQUFlO0lBQzdCLElBQUEsZUFBUSxFQUFDLElBQUEsWUFBSSxF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