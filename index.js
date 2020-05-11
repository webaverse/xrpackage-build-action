const path = require('path');
const child_process = require('child_process');

console.log('got env', process.env);

const cp = child_process.spawn('npm', [
  'install',
  'xrpk',
], {
  stdio: 'pipe',
});
cp.stdout.pipe(process.stdout);
cp.stderr.pipe(process.stderr);
cp.on('close', (code, signal) => {
  console.log('install done', code, signal);

  if (code === 0) {
    const src = path.join(process.env.GITHUB_WORKSPACE, process.env['INPUT_SRC']);
    let ref = process.env['GITHUB_REF'] || '';
    if (ref) {
      const match = ref.match(/^refs\/tags\/(.+)$/);
      if (match) {
        ref = match[1];
      } else {
        ref = '';
      }
    }
    const sha = process.env['GITHUB_SHA'] || '';
    console.log('building', path.join('node_modules', '.bin', 'xrpk'), [
      'build',
      src,
    ]);
    const cp2 = child_process.spawn(path.join('node_modules', '.bin', 'xrpk'), [
      'build',
      src,
    ]);
    const bs = [];
    cp2.stdout.on('data', d => {
      bs.push(d);
    });
    cp2.stderr.pipe(process.stderr);
    cp2.on('close', (code, signal) => {
      const b = Buffer.concat(bs);
      const s = b.toString('utf8');
      console.log('build done', {code, signal, s});

      if (code === 0) {
        const dst = s.match(/^(\S*)/)[1];
        console.log('got dst', JSON.stringify(dst));
        process.stdout.write(`::set-output name=dst::${dst}\n`);

        console.log('got ref', JSON.stringify(ref));
        if (ref) {
          process.stdout.write(`::set-output name=tag_name::${ref}\n`);
          process.stdout.write(`::set-output name=target_commitish::${sha}\n`);
          process.stdout.write(`::set-output name=name::${ref}\n`);
        }
      } else {
        throw new Error(`invalid build status code: ${code}`);
      }
    });
  } else {
    throw new Error(`invalid install status code: ${code}`);
  }
});