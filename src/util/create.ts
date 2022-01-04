import { existsSync, writeFileSync } from 'fs';
import {
  getProjectPath,
  writeJsonFile,
  JSON,
  clear,
  printMsg,
  modifyJsonFile,
} from '../util';
import * as shell from 'shelljs';

import { blue, cyan, gray, yellow } from 'chalk';
import { prompt } from 'inquirer';
import * as installFeatureMethod from './installFeature';
import { gitignore, vscodeSettings } from '../constants';

export const isDirExist = (dirName): void => {
  const dirPath = getProjectPath(dirName);
  if (existsSync(dirPath)) {
    // shell.rm('-rf', dirPath);
    process.exit(1);
  }
};

export const initProjectDir = (projectName) => {
  shell.exec(`mkdir ${projectName}`);
  shell.cd(projectName);
  shell.exec(`mkdir src`);
  shell.exec(`mkdir .vscode`);
  const indexJsContent = `console.log('hello, world!')`;
  writeFileSync('./src/index.ts', indexJsContent, { encoding: 'utf-8' });
  shell.exec(`npm init -y`);
  writeFileSync('./.vscode/settings.json', vscodeSettings, {
    encoding: 'utf-8',
  });
  writeFileSync('./.gitignore', gitignore, { encoding: 'utf-8' });
};

export const changePackageInfo = (projectName) => {
  modifyJsonFile((packageJSON) => {
    packageJSON.name = packageJSON.description = projectName;
  });
};

export const installTSAndInit = () => {
  printMsg(blue('installTSAndInit...'));
  shell.exec('npm i typescript @types/node -D && pnpx tsc --init');
  // 覆写 tsconfig.json
  const tsconfigJson: JSON = {
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
  writeJsonFile<JSON>('./tsconfig.json', tsconfigJson);
};

export const installDevEnviroment = () => {
  printMsg(blue('installDevEnviroment...'));
  shell.exec('npm i ts-node-dev -D');
  modifyJsonFile((packageJson) => {
    packageJson.scripts['dev:comment'] = '启动开发环境';
    packageJson.scripts['dev'] =
      'ts-node-dev --respawn --transpile-only src/index.ts';
  });
};

/**
 * 交互式命令行，让用户自己选择需要的功能
 * return ['ESLint', 'Prettier', 'CZ']
 */
export async function selectFeature(): Promise<Array<string>> {
  // 清空命令行
  clear();
  // 输出信息
  /* eslint-disable @typescript-eslint/no-var-requires */
  printMsg(blue(`TS CLI v${require('../../package.json').version}`));
  printMsg('Start initializing the project:');
  printMsg('');
  // 选择功能，这里配合 下面的 installFeature 方法 和 ./installFeature.ts 文件为脚手架提供了良好的扩展机制
  // 将来扩展其它功能只需要在 choices 数组中增加配置项，然后在 ./installFeature.ts 文件中增加相应的安装方法即可
  const { feature } = await prompt([
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

  return feature as Array<string>;
}

/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
export function installFeature(feature: Array<string>): void {
  feature.forEach((item) => {
    const func = installFeatureMethod[
      `install${item}`
    ] as unknown as () => void;
    func();
  });
  // 安装 husky 和 lint-staged
  installHusky(feature);
  // 安装构建工具
  installFeatureMethod.installBuild(feature);
}

/**
 * 安装 husky 和 lint-staged，并根据功能设置相关命令
 * @param feature 用户选择的功能列表
 */
function installHusky(feature: Array<string>): void {
  // 初始化 git 仓库
  shell.exec('git init');
  printMsg(blue('installHusky...'));

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
    shell.exec(
      `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`,
    );
  }

  if (featureBak.includes('ESLint') || featureBak.includes('Prettier')) {
    printMsg(blue('lint-staged...'));
    shell.exec('npx mrm@2 lint-staged');
  }

  installFeatureMethod.installHusky(hooks);
}

/**
 * 整个项目安装结束，给用户提示信息
 */
export function end(projectName: string): void {
  printMsg(`Successfully created project ${yellow(projectName)}`);
  printMsg('Get started with the following commands:');
  printMsg('');
  printMsg(`${gray('$')} ${cyan('cd ' + projectName)}`);
  printMsg(`${gray('$')} ${cyan('npm run dev')}`);
  printMsg('');
}
