import { Octokit } from "@octokit/action";

const octokit = new Octokit();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// const data = await octokit.request('GET /user', {})
// const { login } = data.data


console.log(owner, repo);
console.log(process.env);


await octokit.request(`POST /repos/${owner}/${repo}/git/tags`, {
  owner,
  repo,
  tag: 'v0.0.1',
  message: 'initial version',
  object: process.env.GITHUB_SHA,
  type: 'commit',
  tagger: {
    name: 'Roman Gavrilow',
    email: 'roman@gavrilow.ru'
  }
})

GITHUB_SHA
