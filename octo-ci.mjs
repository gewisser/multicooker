import { Octokit } from "@octokit/action";
import fs from 'fs'
import { execFilePromise } from './node.utils.mjs'


const octokit = new Octokit();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

console.log(owner, repo);

let res

res = await octokit.rest.repos.getLatestRelease({
  owner,
  repo
})


const { name } = res.data

const partsVersion = name.split('.')

if (partsVersion.length < 2) {
  console.log('partsVersion < 2')
  process.exit(1)
}

const latsP = partsVersion.length - 1

partsVersion[latsP] = parseInt(partsVersion[latsP]) + 1

const newVersion = partsVersion.join('.')
const distFileVer = `dist.${newVersion}.tar.bz2`

console.log(`New version: ${newVersion}`)
console.log('==============================================')
console.log(`Create arch ${distFileVer}...`)
await execFilePromise('tar', '-zcf ${distFileVer} dist'.split(' '))
console.log(`OK.`)
console.log('==============================================')
console.log(`Create new release: ${newVersion}...`)

res = await octokit.repos.createRelease({
  owner,
  repo,
  tag_name: newVersion,
  target_commitish: process.env.GITHUB_REF_NAME,
  name: newVersion,
  body: '',
  draft: false,
  prerelease: false,
  generate_release_notes: true
})

const { id } = res.data

console.log(`OK. id: ${id}`)
console.log('==============================================')
console.log(`Upload release asset ${distFileVer} ... `)

const content = fs.readFileSync(`./${distFileVer}`);

try {
  res = await octokit.rest.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: id,
    name: distFileVer,
    data: new Uint8Array(content),
  });

  console.log(`OK.`)

} catch (e) {
  console.log(e)
}

