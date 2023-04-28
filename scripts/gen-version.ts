import { writeFile } from 'fs/promises'
import path from 'path'
import { umiMetaUiRoot } from '@umi-meta/internal'
import pkg from '../packages/umi-meta-ui/package.json' // need to be checked

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  await writeFile(path.resolve(umiMetaUiRoot, 'version.ts'), `export const version = '${version}'\n`)
}

main()
