import { d as defineCommand, c as consola } from '../shared/nuxi.b4d08588.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { l as loadKit } from '../shared/nuxi.2f404a3c.mjs';
import { a as clearBuildDir } from '../shared/nuxi.4290d487.mjs';
import { o as overrideEnv } from '../shared/nuxi.2509f57e.mjs';
import { s as showVersions } from '../shared/nuxi.c8477004.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve, a as relative } from '../shared/nuxi.610c92ff.mjs';
import 'node:url';
import '../shared/nuxi.bba5fe76.mjs';
import 'node:module';
import 'node:fs';
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
import '../shared/nuxi.d3241ca4.mjs';
import '../shared/nuxi.5aaa4630.mjs';

const buildCommand = defineCommand({
  meta: {
    name: "build",
    description: "Build Nuxt for production deployment"
  },
  args: {
    ...sharedArgs,
    prerender: {
      type: "boolean",
      description: "Build Nuxt and prerender static routes"
    },
    preset: {
      type: "string",
      description: "Nitro server preset"
    },
    dotenv: {
      type: "string",
      description: "Path to .env file"
    },
    ...legacyRootDirArgs
  },
  async run(ctx) {
    overrideEnv("production");
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    showVersions(cwd);
    const kit = await loadKit(cwd);
    const nitroPreset = ctx.args.prerender ? "static" : ctx.args.preset;
    if (nitroPreset) {
      consola.info(`Using Nitro server preset: \`${nitroPreset}\``);
    }
    const nuxt = await kit.loadNuxt({
      cwd,
      dotenv: {
        cwd,
        fileName: ctx.args.dotenv
      },
      overrides: {
        logLevel: ctx.args.logLevel,
        // TODO: remove in 3.8
        _generate: ctx.args.prerender,
        ...ctx.args.prerender ? { nitro: { static: true } } : { nitro: { preset: nitroPreset } },
        ...ctx.data?.overrides
      }
    });
    let nitro;
    try {
      nitro = kit.useNitro?.();
    } catch {
    }
    await clearBuildDir(nuxt.options.buildDir);
    await kit.writeTypes(nuxt);
    nuxt.hook("build:error", (err) => {
      consola.error("Nuxt Build Error:", err);
      process.exit(1);
    });
    await kit.buildNuxt(nuxt);
    if (ctx.args.prerender) {
      if (!nuxt.options.ssr) {
        consola.warn(
          "HTML content not prerendered because `ssr: false` was set. You can read more in `https://nuxt.com/docs/getting-started/deployment#static-hosting`."
        );
      }
      const dir = nitro?.options.output.publicDir;
      const publicDir = dir ? relative(process.cwd(), dir) : ".output/public";
      consola.success(
        `You can now deploy \`${publicDir}\` to any static hosting!`
      );
    }
  }
});

export { buildCommand as default };
