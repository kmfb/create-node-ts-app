export declare const isDirExist: (dirName: any) => void;
export declare const initProjectDir: (projectName: any) => void;
export declare const changePackageInfo: (projectName: any) => void;
export declare const installTSAndInit: () => void;
export declare const installDevEnviroment: () => void;
/**
 * 交互式命令行，让用户自己选择需要的功能
 * return ['ESLint', 'Prettier', 'CZ']
 */
export declare function selectFeature(): Promise<Array<string>>;
/**
 * 安装用户选择的功能
 * @param feature 功能列表
 */
export declare function installFeature(feature: Array<string>): void;
/**
 * 整个项目安装结束，给用户提示信息
 */
export declare function end(projectName: string): void;
