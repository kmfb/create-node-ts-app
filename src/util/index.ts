import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  scripts: {
    [key: string]: string;
  };
}
export interface JSON {
  [key: string]: unknown;
}
export const getProjectPath = (projectName: string): string => {
  return resolve(process.cwd(), projectName);
};

/**
 * 读取指定路径下 json 文件
 * @param filename json 文件的路径
 */
export function readJsonFile<T>(filename: string): T {
  return JSON.parse(readFileSync(filename, { encoding: 'utf-8', flag: 'r' }));
}

/**
 * 覆写指定路径下的 json 文件
 * @param filename json 文件的路径
 * @param content  json 内容
 */
export function writeJsonFile<T>(filename: string, content: T): void {
  writeFileSync(filename, JSON.stringify(content, null, 2));
}

export const modifyJsonFile = async (callback) => {
  const packageJSON: PackageJSON = readJsonFile<PackageJSON>('./package.json');
  callback(packageJSON);
  writeJsonFile<PackageJSON>('./package.json', packageJSON);
};

export const clear = () => {
  console.clear();
};

export const printMsg = (msg) => {
  console.log(msg);
};
