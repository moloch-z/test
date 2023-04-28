// import { copy } from 'fs-extra'
import { resolve, join } from 'path'
import { parallel, series } from 'gulp'
import { copyFile, mkdir } from 'fs/promises'
import { run, runBuildUiTask, withTaskName, umiMetaUiOutputRoot, umiMetaUiRoot, umiMetaUiPackageJson } from '@umi-meta/internal'

export const copyFiles = () =>
  Promise.all([
    copyFile(umiMetaUiPackageJson, join(umiMetaUiOutputRoot, 'package.json')),
    copyFile(resolve(umiMetaUiRoot, 'README.md'), resolve(umiMetaUiOutputRoot, 'README.md'))
  ])

export const copyFullStyle = async () => {
  await mkdir(resolve(umiMetaUiOutputRoot, 'dist'), { recursive: true })
  await copyFile(resolve(umiMetaUiOutputRoot, 'theme-chalk/index.css'), resolve(umiMetaUiOutputRoot, 'dist/index.css'))
}

// 导入并导出任务
export * from '@umi-meta/internal'

export default series(
  // 清理
  withTaskName('clean', () => run('pnpm run -C packages/umi-meta-ui clean')),
  withTaskName('createOutput', () => mkdir(umiMetaUiOutputRoot, { recursive: true })),
  // 打包
  parallel(
    runBuildUiTask('buildUiModules'),
    runBuildUiTask('buildFullBundle'),
    runBuildUiTask('generateTypesDefinitions'),
    series(withTaskName('buildThemeChalk', () => run('pnpm run -C packages/theme-chalk build')))
  ),
  // 拷贝文件
  parallel(copyFiles)
)
