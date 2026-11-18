#!/usr/bin/env node
// PostToolUse hook (Edit|Write|MultiEdit): formats the touched file with the repo's Prettier.
// Never fails the tool call; formatting problems are reported but not blocking.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const filePath = input.tool_input?.file_path;
if (!filePath || !/\.(ts|mts|js|mjs|vue|json|css|md|ya?ml|html)$/.test(filePath)) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const prettier = join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
if (!existsSync(prettier) || !existsSync(filePath)) process.exit(0);

const result = spawnSync(process.execPath, [prettier, '--write', '--log-level', 'warn', filePath], {
  cwd: root,
  encoding: 'utf8',
});
if (result.status !== 0) {
  process.stderr.write(`prettier failed on ${filePath}:\n${result.stderr}`);
}
process.exit(0);
