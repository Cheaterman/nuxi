import { c as cleanupNuxtDirs } from '../shared/nuxi.29890d44.mjs';
import { d as defineCommand } from '../shared/nuxi.b4d08588.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import { l as loadKit } from '../shared/nuxi.2f404a3c.mjs';
import 'node:fs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import '../shared/nuxi.4290d487.mjs';
import 'node:url';
import '../shared/nuxi.bba5fe76.mjs';
import 'node:module';
import 'node:assert';
import 'node:v8';
import 'node:perf_hooks';
import '../shared/nuxi.eaa29140.mjs';
import './satisfies.mjs';
import '../shared/nuxi.2155838d.mjs';
import '../shared/nuxi.cc8dd4a9.mjs';
import '../shared/nuxi.60d8b8c7.mjs';
import 'crypto';
import 'fs';
import 'module';
import 'path';
import 'perf_hooks';
import 'os';
import 'vm';
import 'url';
import 'assert';
import 'process';
import 'v8';
import 'util';
import 'tty';
import '../shared/nuxi.a6273a0c.mjs';

const cleanup = defineCommand({
  meta: {
    name: "cleanup",
    description: "Clean up generated Nuxt files and caches"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const { loadNuxtConfig } = await loadKit(cwd);
    const nuxtOptions = await loadNuxtConfig({ cwd });
    await cleanupNuxtDirs(nuxtOptions.rootDir, nuxtOptions.buildDir);
  }
});

export { cleanup as default };
