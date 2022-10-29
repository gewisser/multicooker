import { Octokit } from "@octokit/action";

const octokit = new Octokit();

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// const data = await octokit.request('GET /user', {})
// const { login } = data.data


console.log(owner, repo);
console.log(process.env);
