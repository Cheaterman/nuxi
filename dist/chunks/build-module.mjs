import { execa } from './index3.mjs';
import { d as defineCommand, c as consola } from '../shared/nuxi.b4d08588.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { t as tryResolveModule } from '../shared/nuxi.bba5fe76.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import 'node:buffer';
import 'node:child_process';
import '../shared/nuxi.2155838d.mjs';
import 'child_process';
import 'path';
import 'fs';
import 'node:url';
import 'node:os';
import 'node:fs';
import 'node:timers/promises';
import 'stream';
import 'node:module';
import 'node:assert';
import 'node:v8';

const MODULE_BUILDER_PKG = "@nuxt/module-builder";
const buildModule = defineCommand({
  meta: {
    name: "build-module",
    description: `Helper command for using ${MODULE_BUILDER_PKG}`
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs,
    stub: {
      type: "boolean",
      description: "Stub dist instead of actually building it for development"
    },
    sourcemap: {
      type: "boolean",
      description: "Generate sourcemaps"
    },
    prepare: {
      type: "boolean",
      description: "Prepare module for local development"
    }
  },
  async run(ctx) {
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const hasLocal = await tryResolveModule(
      `${MODULE_BUILDER_PKG}/package.json`,
      cwd
    );
    const execArgs = Object.entries({
      "--stub": ctx.args.stub,
      "--sourcemap": ctx.args.sourcemap,
      "--prepare": ctx.args.prepare
    }).filter(([, value]) => value).map(([key]) => key);
    let cmd = "nuxt-module-build";
    if (!hasLocal) {
      consola.warn(
        `Cannot find locally installed version of \`${MODULE_BUILDER_PKG}\` (>=0.2.0). Falling back to \`npx ${MODULE_BUILDER_PKG}\``
      );
      cmd = "npx";
      execArgs.unshift(MODULE_BUILDER_PKG);
    }
    await execa(cmd, execArgs, {
      cwd,
      preferLocal: true,
      stdio: "inherit"
    });
  }
});

export { buildModule as default };
