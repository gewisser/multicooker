import * as dotenv from 'dotenv'
import { execFilePromise } from './node.utils.mjs'
import path from 'path'

dotenv.config()

const FS_IS_LITTLEFS = process.env.USE_FS_LITTLEFS === '1'
const FS_NAME = FS_IS_LITTLEFS ? 'littlefs' : 'spiffs'

console.log(`Start create ${FS_NAME}.`)

const processCwd = process.cwd()
const distPath = path.resolve(processCwd, 'dist', 'pwa')
const binFile = path.resolve(processCwd, `image-${FS_NAME}.bin`)

const MKFS_TOOL = FS_IS_LITTLEFS ? process.env.MKLITTLEFS_PATH : process.env.MKSPIFFS_PATH
const MKFS_TOOL_CMD = FS_IS_LITTLEFS ? process.env.MKLITTLEFS_CMD: process.env.MKSPIFFS_CMD

console.log(`Create ${FS_NAME}...`)
await execFilePromise(path.normalize(MKFS_TOOL), `-c ${distPath} ${path.normalize(MKFS_TOOL_CMD)} ${binFile}`.split(' '))
console.log('OK.\n-----------------------------')

console.log('Flash data...')
await execFilePromise(process.env.ESPTOOL_PATH, `${process.env.ESPTOOL_CMD} ${binFile}`.split(' '))
console.log('-----------------------------')

