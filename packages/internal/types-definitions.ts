import type { CompilerOptions, SourceFile } from 'ts-morph'
import path from 'path'
import chalk from 'chalk'
import glob from 'fast-glob'
import process from 'process'
import { Project } from 'ts-morph'
import * as vueCompiler from 'vue/compiler-sfc'
import { pathRewriter, excludeFiles } from './utils'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { umiMetaUiOutputRoot, umiMetaUiRoot, workspace, projRoot } from './paths'

const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.json')
const outDir = path.resolve(umiMetaUiOutputRoot, 'types')

/**
 *
 * @param project
 */
function typeCheck(project: Project) {
  const diagnostics = project.getPreEmitDiagnostics()
  if (diagnostics.length > 0) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    console.error(err)
    throw err
  }
}
async function addSourceFiles(project: Project) {
  project.addSourceFileAtPath(path.resolve(projRoot, 'typings/env.d.ts'))

  const globSourceFile = '**/*.{js?(x),ts?(x),vue}'
  const filePaths = excludeFiles(
    await glob([globSourceFile, '!umi-meta-ui/**/*', '!internal/**/*'], {
      cwd: workspace,
      absolute: true,
      onlyFiles: true
    })
  )

  const epPaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: umiMetaUiRoot,
      onlyFiles: true
    })
  )

  const sourceFiles: SourceFile[] = []
  await Promise.all([
    ...filePaths.map(async file => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const hasTsNoCheck = content.includes('@ts-nocheck')

        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = (hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx'
            })
            content += compiled.content
          }

          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(`${path.relative(process.cwd(), file)}.${lang}`, content)
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async file => {
      const content = await readFile(path.resolve(umiMetaUiRoot, file), 'utf-8')
      sourceFiles.push(project.createSourceFile(path.resolve(workspace, file), content))
    })
  ])

  return sourceFiles
}

/**
 * fork = require( https://github.com/egoist/vue-dts-gen/blob/main/src/index.ts
 */
export const generateTypesDefinitions = async () => {
  const compilerOptions: CompilerOptions = {
    // 复合选项强制执行某些约束，使构建工具（包括TypeScript本身，在--build模式下）能够快速确定项目是否已经构建
    composite: true,
    resolveJsonModule: true,
    emitDeclarationOnly: true,
    outDir,
    baseUrl: projRoot,
    preserveSymlinks: true
  }
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true
  })

  const sourceFiles = await addSourceFiles(project)
  console.log('Added source files')

  typeCheck(project)
  console.log('Type check passed!')

  await project.emit({
    emitOnlyDtsFiles: true
  })

  const tasks = sourceFiles.map(async sourceFile => {
    const relativePath = path.relative(workspace, sourceFile.getFilePath())
    console.log(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`))

    const emitOutput = sourceFile.getEmitOutput()
    const emitFiles = emitOutput.getOutputFiles()
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`)
    }

    const subTasks = emitFiles.map(async outputFile => {
      const filepath = outputFile.getFilePath()
      await mkdir(path.dirname(filepath), {
        recursive: true
      })

      await writeFile(filepath, pathRewriter('esm')(outputFile.getText()), 'utf8')

      console.log(chalk.green(`Definition for file: ${chalk.bold(relativePath)} generated`))
    })

    await Promise.all(subTasks)
  })

  await Promise.all(tasks)
}
