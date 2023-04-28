import path from 'path'
import chalk from 'chalk'
import dartSass from 'sass'
import rename from 'gulp-rename'
import gulpSass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import { src, dest, parallel } from 'gulp'
import { umiMetaUiOutputRoot } from '@umi-meta/internal'

const distBundle = path.resolve(umiMetaUiOutputRoot, 'theme-chalk')

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noUPrefixFile = /(index|base|display)/
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, details => {
        console.log(
          `${chalk.cyan(details.name)}: ${chalk.yellow(details.stats.originalSize / 1000)} KB -> ${chalk.green(
            details.stats.minifiedSize / 1000
          )} KB`
        )
      })
    )
    .pipe(
      rename(path => {
        if (!noUPrefixFile.test(path.basename)) {
          path.basename = `u-${path.basename}`
        }
      })
    )
    .pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(dest(path.resolve(distBundle, 'src')))
}

export const build = parallel(copyThemeChalkSource, buildThemeChalk)

export default build
