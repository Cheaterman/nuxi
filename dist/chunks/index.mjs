import { d as defineCommand } from '../shared/nuxi.b4d08588.mjs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import 'node:url';

const index = defineCommand({
  meta: {
    name: "module",
    description: "Manage Nuxt modules"
  },
  args: {},
  subCommands: {
    add: () => import('./add2.mjs').then((r) => r.default || r),
    search: () => import('./search.mjs').then((r) => r.default || r)
  }
});

export { index as default };
