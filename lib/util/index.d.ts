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
export declare const getProjectPath: (projectName: string) => string;
/**
 * 读取指定路径下 json 文件
 * @param filename json 文件的路径
 */
export declare function readJsonFile<T>(filename: string): T;
/**
 * 覆写指定路径下的 json 文件
 * @param filename json 文件的路径
 * @param content  json 内容
 */
export declare function writeJsonFile<T>(filename: string, content: T): void;
export declare const modifyJsonFile: (callback: any) => Promise<void>;
export declare const clear: () => void;
export declare const printMsg: (msg: any) => void;
