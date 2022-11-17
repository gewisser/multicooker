import { execFile } from 'child_process';

export function execFilePromise(...args) {
  return new Promise((resolve) => {
    const child = execFile(...args);

    child.on('close', (code) => {
      resolve(code)
    });


    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
    })
  })
}
