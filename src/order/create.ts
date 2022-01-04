import {
  changePackageInfo,
  end,
  initProjectDir,
  installDevEnviroment,
  installFeature,
  installTSAndInit,
  isDirExist,
  selectFeature,
} from '../util/create';

// create 命令
export default async function create(projectName: string): Promise<void> {
  // 判断文件是否已经存在
  isDirExist(projectName);
  // 选择需要的功能
  const feature = await selectFeature();

  console.log(feature);

  initProjectDir(projectName);
  changePackageInfo(projectName);
  installTSAndInit();
  installDevEnviroment();
  // 安装 feature
  installFeature(feature);
  end(projectName);
}
