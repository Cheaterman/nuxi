import { d as defineCommand, c as consola, C } from '../shared/nuxi.b4d08588.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { o as overrideEnv } from '../shared/nuxi.2509f57e.mjs';
import { s as sharedArgs, l as legacyRootDirArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import { createNuxtDevServer } from './dev2.mjs';
import 'node:url';
import 'node:events';
import 'events';
import 'fs';
import 'path';
import 'util';
import 'stream';
import 'os';
import '../shared/nuxi.46ec4b0a.mjs';
import '../shared/nuxi.bba5fe76.mjs';
import 'node:module';
import 'node:fs';
import 'node:assert';
import 'node:v8';
import '../shared/nuxi.a6273a0c.mjs';
import './index2.mjs';
import 'node:http';
import 'node:https';
import 'node:net';
import 'node:os';
import '../shared/nuxi.2155838d.mjs';
import 'http';
import 'https';
import '../shared/nuxi.eaa29140.mjs';
import 'node:child_process';
import 'crypto';
import 'node:fs/promises';
import '../shared/nuxi.2f404a3c.mjs';
import 'node:perf_hooks';
import './satisfies.mjs';
import '../shared/nuxi.cc8dd4a9.mjs';
import '../shared/nuxi.60d8b8c7.mjs';
import 'module';
import 'perf_hooks';
import 'vm';
import 'url';
import 'assert';
import 'process';
import 'v8';
import 'tty';
import '../shared/nuxi.29890d44.mjs';
import '../shared/nuxi.4290d487.mjs';

const devChild = defineCommand({
  meta: {
    name: "_dev",
    description: "Run Nuxt development server (internal command to start child process)"
  },
  args: {
    ...sharedArgs,
    ...legacyRootDirArgs
  },
  async run(ctx) {
    const logger = consola.withTag("nuxi");
    if (!process.send && !C) {
      logger.warn(
        "`nuxi _dev` is an internal command and should not be used directly. Please use `nuxi dev` instead."
      );
    }
    overrideEnv("development");
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir || ".");
    const devContext = JSON.parse(process.env.__NUXT_DEV__ || "null") || {};
    const nuxtDev = await createNuxtDevServer({
      cwd,
      overrides: ctx.data?.overrides,
      logLevel: ctx.args.logLevel,
      clear: !!ctx.args.clear,
      dotenv: !!ctx.args.dotenv,
      port: process.env._PORT ?? void 0,
      devContext
    });
    function sendIPCMessage(message) {
      if (process.send) {
        process.send(message);
      } else {
        logger.info(
          "Dev server event:",
          Object.entries(message).map((e) => e[0] + "=" + JSON.stringify(e[1])).join(" ")
        );
      }
    }
    nuxtDev.on("loading", (message) => {
      sendIPCMessage({ type: "nuxt:internal:dev:loading", message });
    });
    nuxtDev.on("restart", () => {
      sendIPCMessage({ type: "nuxt:internal:dev:restart" });
    });
    nuxtDev.on("ready", (payload) => {
      sendIPCMessage({ type: "nuxt:internal:dev:ready", port: payload.port });
    });
    await nuxtDev.init();
  }
});

export { devChild as default };
