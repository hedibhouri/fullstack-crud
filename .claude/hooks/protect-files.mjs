#!/usr/bin/env node
// PreToolUse hook (Edit|Write|MultiEdit): blocks changes that break project rules.
// Exit code 2 = block the tool call; stderr is shown to Claude as the reason.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { relative, sep } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const filePath = input.tool_input?.file_path;
if (!filePath) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const rel = relative(root, filePath).split(sep).join('/');
const base = rel.split('/').pop() ?? '';

const block = (reason) => {
  process.stderr.write(`Blocked by .claude/hooks/protect-files.mjs: ${reason}\n`);
  process.exit(2);
};

// 1. Real env files hold secrets. Only *.env.example may be edited.
if (/^\.env(\..+)?$/.test(base) && !base.endsWith('.example')) {
  block(
    `"${rel}" is an environment file. Edit the matching .env.example and ask the user to update their local .env.`,
  );
}

// 2. Lockfile is managed by npm only.
if (base === 'package-lock.json') {
  block('package-lock.json must only change through npm install/uninstall.');
}

// 3. Committed migrations are immutable.
if (/^apps\/api\/src\/database\/migrations\/.+\.ts$/.test(rel) && input.tool_name !== 'Write') {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', rel], { cwd: root, stdio: 'ignore' });
    block(`"${rel}" is a committed migration. Create a new migration instead (see /db-migration).`);
  } catch {
    // not tracked by git yet: editing an unreleased migration is fine
  }
}

process.exit(0);
