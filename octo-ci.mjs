import { Octokit } from "@octokit/action";
import fs from 'fs'

const octokit = new Octokit();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

console.log(owner, repo);

let res

res = await octokit.rest.repos.getLatestRelease({
  owner,
  repo
})

//console.log(res)

const { name } = res.data

const partsVersion = name.split('.')

if (partsVersion.length < 2) {
  console.log('partsVersion < 2')
  process.exit(1)
}

const latsP = partsVersion.length - 1

partsVersion[latsP] = parseInt(partsVersion[latsP]) + 1

const newVersion = partsVersion.join('.')

console.log(newVersion)

/*
const ret = await octokit.repos.createRelease({
  owner,
  repo,
  tag_name: 'v1.0.9',
  target_commitish: process.env.GITHUB_REF_NAME,
  name: 'v1.0.9',
  body: 'Description of the release',
  draft: false,
  prerelease: false,
  generate_release_notes: true
})


console.log(ret)
console.log('==================================================')

const { id } = ret.data

const content = fs.readFileSync("./README.zip");


try {
  const result = await octokit.rest.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: id,
    name: 'test_asset.zip',
    data: new Uint8Array(content),
  });

  console.log(result)

} catch (e) {
  console.log(e)
}
*/
