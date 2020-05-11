const child_process = require('child_process');

console.log('got env', process.env);

const cp = child_process.spawn('npm', {
  stdio: 'pipe',
});
cp.stdout.pipe(process.stdout);
cp.stderr.pipe(process.stderr);
cp.on('exit', (code, signal) => {
  console.log('got code signal', code, signal);

  const dst = code + '';
  process.stdout.write(`::set-output name=dst::${dst}\n``);
});