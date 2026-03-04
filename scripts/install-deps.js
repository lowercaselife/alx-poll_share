import { execSync } from 'child_process';

try {
  console.log('Running pnpm install...');
  const output = execSync('pnpm install', {
    cwd: '/vercel/share/v0-project',
    stdio: 'pipe',
    encoding: 'utf-8',
    timeout: 120000,
  });
  console.log(output);
  console.log('Dependencies installed successfully.');
} catch (error) {
  console.error('Install failed:', error.message);
  if (error.stdout) console.log('stdout:', error.stdout);
  if (error.stderr) console.error('stderr:', error.stderr);
}
