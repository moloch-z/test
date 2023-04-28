import { spawn } from 'child_process'
import chalk from 'chalk'
import { PKG_PREFIX, PKG_NAME, modulesBuildConfig } from './constants'
import { projRoot, umiMetaUiPackageJson } from './paths'
import type { ProjectManifest } from '@pnpm/types'

/**
 * 定义任务函数名称
 * @param {string} name 任务名称
 * @param {Function} fn 任务函数
 * @returns {Function}
 */
export function withTaskName<T extends Function>(name: string, fn: T): T {
  return Object.assign(fn, { displayName: name })
}

/**
 * 启一个子进程来运行脚本
 * @param {string} command 命令
 * @param {string} cwd cwd
 * @returns
 */
export async function run(command: string, cwd: string = projRoot): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    console.log(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', code => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else reject(new Error(`Command failed. \n Command: ${command} \n Code: ${code}`))
    })
    process.on('exit', onProcessExit)
  })
}
/**
 * 执行任务
 * @param {string} name 执行任务名称
 * @returns {Function}
 */
export function runTask(name: string) {
  return withTaskName(`shellTask:${name}`, () => run(`pnpm run build ${name}`))
}
/**
 * 执行 ui 库构建任务
 * @param {string} name 执行任务名称
 * @returns {Function}
 */
export function runBuildUiTask(name: string) {
  return withTaskName(`shellTask:${name}`, () => run(`pnpm run build:ui ${name}`))
}
export function excludeFiles(files: string[], moreExcludes: string[] = []) {
  // 屏蔽 node_modules、测试、dist，样式模块下有 gulpfile.ts 也要屏蔽
  const excludes = ['node_modules', 'gulpfile', '__tests__', 'dist', ...moreExcludes]
  const input = files.filter(path => !excludes.some(exclude => path.includes(exclude)))
  return input
}
export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest
}

export const getPackageDependencies = (pkgPath: string): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies)
  }
}

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(umiMetaUiPackageJson)

  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push('@vue', '@umi-meta', ...dependencies)
    }

    return [...new Set(packages)].some(pkg => id === pkg || id.startsWith(`${pkg}/`))
  }
}
export const pathRewriter = module => {
  const config = modulesBuildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}
