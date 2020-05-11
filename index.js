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
cp.on('exit', (code, signal) => {
  console.log('install done', code, signal);

  const src = path.join(process.env.GITHUB_WORKSPACE, process.env['INPUT_SRC']);
  console.log('building', path.join('node_modules', '.bin', 'xrpk'), [
    'build',
    src,
  ]);
  const cp2 = child_process.spawn(path.join('node_modules', '.bin', 'xrpk'), [
    'build',
    src,
  ]);
  cp2.stdout.pipe(process.stdout);
  cp2.stderr.pipe(process.stderr);
  cp2.on('exit', (code, signal) => {
  	console.log('build done', code, signal);

    const dst = code + '';
    process.stdout.write(`::set-output name=dst::${dst}\n`);
  });
});