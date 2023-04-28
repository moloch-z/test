import glob from 'fast-glob'
import { build } from './build'
import { workspace } from './paths'
import { excludeFiles } from './utils'
import { modulesBuildConfig } from './constants'
/**
 * 模块包构建输出
 * @param {Partial<RollupOptions>} rollupOptions RollupOptions
 */
export async function buildUiModules(): Promise<void> {
  const input = excludeFiles(
    await glob('**/*.{js,ts,tsx,vue}', {
      cwd: workspace,
      absolute: true,
      onlyFiles: true
    }),
    ['internal', 'theme-chalk', 'umi-meta-ui']
  )
  const bundle = await build({ input })
  Object.keys(modulesBuildConfig).forEach(k => {
    const config = modulesBuildConfig[k]
    bundle.write({
      format: config.format,
      exports: config.format === 'cjs' ? 'named' : undefined,
      // 输出路径，不同规范不一样，这个对应主包 package.json 的 exports 配置
      dir: config.output,
      // 保持目录结构
      preserveModules: true,
      // 保持目录结构的最高位置，这里设置为 packages
      preserveModulesRoot: workspace,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`
    })
  })
}
