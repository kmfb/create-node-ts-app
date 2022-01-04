import { blue, red } from 'chalk';
import { commitlint, eslintrc, prettierrc } from '../constants';
import { writeFileSync } from 'fs';
import * as shell from 'shelljs';

import { printMsg, modifyJsonFile } from '../util';

/**
 * 安装 ESLint
 */
export function installESLint(): void {
  printMsg(blue('installESLint...'));

  shell.exec(
    'npm i eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D',
  );

  try {
    writeFileSync('./.eslintrc.js', eslintrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .eslintrc.js file content')}`);
    printMsg(`${red('Please add the following content in .eslintrc.js')}`);
    printMsg(`${red(eslintrc)}`);
  }

  modifyJsonFile((packageJson) => {
    packageJson.scripts['eslint:comment'] =
      '使用 ESLint 检查并自动修复 src 目录下所有扩展名为 .ts 的文件';
    packageJson.scripts['eslint'] =
      'eslint --fix src --ext .ts --max-warnings=0';
  });
}

/**
 * 安装 Prettier
 */
export function installPrettier(): void {
  printMsg(blue('installPrettier...'));

  shell.exec('npm i prettier -D');

  try {
    writeFileSync('./.prettierrc.js', prettierrc, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write .prettierrc.js file content')}`);
    printMsg(`${red('Please add the following content in .prettierrc.js')}`);
    printMsg(`${red(prettierrc)}`);
  }
  modifyJsonFile((packageJson) => {
    packageJson.scripts['prettier:comment'] =
      '自动格式化 src 目录下的所有 .ts 文件';
    packageJson.scripts['prettier'] = 'prettier --write "src/**/*.ts"';
  });
}

/**
 * 安装 CZ，规范 git 提交信息
 */
export function installCZ(): void {
  printMsg(blue('installCZ...'));
  shell.exec(
    'npx commitizen init cz-conventional-changelog --save-dev --save-exact',
  );
  shell.exec('npm i @commitlint/cli @commitlint/config-conventional -D');

  try {
    writeFileSync('./commitlint.config.js', commitlint, { encoding: 'utf-8' });
  } catch (err) {
    printMsg(`${red('Failed to write commitlint.config.js file content')}`);
    printMsg(
      `${red('Please add the following content in commitlint.config.js')}`,
    );
    printMsg(`${red(commitlint)}`);
  }
  modifyJsonFile((packageJson) => {
    packageJson.scripts['commit:comment'] = '引导设置规范化的提交信息';
    packageJson.scripts['commit'] = 'cz';
  });
}

/**
 * 安装 husky 和 lint-staged，以实现 git commit 时自动化校验
 * @param hooks，需要自动执行的钩子
 * @param lintStaged，需要钩子运行的命令
 */
export function installHusky(hooks: { [key: string]: string }): void {
  modifyJsonFile((packageJson) => {
    packageJson['husky'] = {
      hooks: {
        ...hooks,
      },
    };
  });
}

/**
 * 安装构建工具，目前主要用于小项目，所以使用 typescript 原生的构建功能即可
 */
export function installBuild(feature: Array<string>): void {
  modifyJsonFile((packageJson) => {
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
