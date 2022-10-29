import { Octokit } from "@octokit/action";

const octokit = new Octokit();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// const data = await octokit.request('GET /user', {})
// const { login } = data.data


console.log(owner, repo);
//console.log(process.env);


// const ret = await octokit.request(`POST /repos/${owner}/${repo}/git/tags`, {
//   accept: 'application/vnd.github+json',
//   owner,
//   repo,
//   tag: 'v0.0.1',
//   message: 'initial version',
//   object: process.env.GITHUB_SHA,
//   type: 'commit',
//   tagger: {
//     name: 'Roman Gavrilow',
//     email: 'roman@gavrilow.ru'
//   }
// })
//
// console.log(ret)


const ret = await octokit.request(`POST /repos/${owner}/${repo}/releases`, {
  owner,
  repo,
  tag_name: 'v1.0.0',
  target_commitish: process.env.GITHUB_REF_NAME,
  name: 'v1.0.0',
  body: 'Description of the release',
  draft: false,
  prerelease: false,
  generate_release_notes: true
})

console.log(ret)
