import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import 'node:module';
import { r as resolve, j as join, c as normalize } from './nuxi.610c92ff.mjs';

async function findup(cwd, match, options = {}) {
  const segments = normalize(cwd).split("/");
  while (segments.length > 0) {
    const path = segments.join("/") || "/";
    const result = await match(path);
    if (result || !options.includeParentDirs) {
      return result;
    }
    segments.pop();
  }
}
function cached(fn) {
  let v;
  return () => {
    if (v === void 0) {
      v = fn().then((r) => {
        v = r;
        return v;
      });
    }
    return v;
  };
}
const importExeca = cached(() => import('../chunks/index3.mjs').then((r) => r.execa));
const hasCorepack = cached(async () => {
  try {
    const execa = await importExeca();
    await execa("corepack", ["--version"]);
    return true;
  } catch {
    return false;
  }
});
async function executeCommand(command, args, options = {}) {
  const execaArgs = command === "npm" || command === "bun" || !await hasCorepack() ? [command, args] : ["corepack", [command, ...args]];
  const execa = await importExeca();
  await execa(execaArgs[0], execaArgs[1], {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "pipe" : "inherit"
  });
}
const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG = "No package manager auto-detected.";
async function resolveOperationOptions(options = {}) {
  const cwd = options.cwd || process.cwd();
  const packageManager = (typeof options.packageManager === "string" ? packageManagers.find((pm) => pm.name === options.packageManager) : options.packageManager) || await detectPackageManager(options.cwd || process.cwd());
  if (!packageManager) {
    throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
  }
  return {
    cwd,
    silent: options.silent ?? false,
    packageManager,
    dev: options.dev ?? false,
    workspace: options.workspace,
    global: options.global ?? false
  };
}
function getWorkspaceArgs(options) {
  if (!options.workspace) {
    return [];
  }
  const workspacePkg = typeof options.workspace === "string" && options.workspace !== "" ? options.workspace : void 0;
  if (options.packageManager.name === "pnpm") {
    return workspacePkg ? ["--dir", workspacePkg] : ["--workspace-root"];
  }
  if (options.packageManager.name === "npm") {
    return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
  }
  if (options.packageManager.name === "yarn") {
    if (!options.packageManager.majorVersion || options.packageManager.majorVersion === "1") {
      return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
    } else {
      return workspacePkg ? ["workspace", workspacePkg] : [];
    }
  }
  return [];
}

const packageManagers = [
  {
    name: "npm",
    command: "npm",
    lockFile: "package-lock.json"
  },
  {
    name: "pnpm",
    command: "pnpm",
    lockFile: "pnpm-lock.yaml",
    files: ["pnpm-workspace.yaml"]
  },
  {
    name: "bun",
    command: "bun",
    lockFile: "bun.lockb"
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "1.0.0",
    lockFile: "yarn.lock"
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "3.0.0",
    lockFile: "yarn.lock",
    files: [".yarnrc.yml"]
  }
];
async function detectPackageManager(cwd, options = {}) {
  const detected = await findup(
    resolve(cwd || "."),
    async (path) => {
      if (!options.ignorePackageJSON) {
        const packageJSONPath = join(path, "package.json");
        if (existsSync(packageJSONPath)) {
          const packageJSON = JSON.parse(
            await readFile(packageJSONPath, "utf8")
          );
          if (packageJSON?.packageManager) {
            const [name, version = "0.0.0"] = packageJSON.packageManager.split("@");
            const majorVersion = version.split(".")[0];
            const packageManager = packageManagers.find(
              (pm) => pm.name === name && pm.majorVersion === majorVersion
            ) || packageManagers.find((pm) => pm.name === name);
            return {
              ...packageManager,
              name,
              command: name,
              version,
              majorVersion
            };
          }
        }
      }
      if (!options.ignoreLockFile) {
        for (const packageManager of packageManagers) {
          const detectionsFiles = [
            packageManager.lockFile,
            ...packageManager.files || []
          ].filter(Boolean);
          if (detectionsFiles.some((file) => existsSync(resolve(path, file)))) {
            return {
              ...packageManager
            };
          }
        }
      }
    },
    {
      includeParentDirs: options.includeParentDirs ?? true
    }
  );
  if (!detected && !options.ignoreArgv) {
    const scriptArg = process.argv[1];
    if (scriptArg) {
      for (const packageManager of packageManagers) {
        const re = new RegExp(`[/\\\\]\\.?${packageManager.command}`);
        if (re.test(scriptArg)) {
          return packageManager;
        }
      }
    }
  }
  return detected;
}

async function installDependencies(options = {}) {
  const resolvedOptions = await resolveOperationOptions(options);
  await executeCommand(resolvedOptions.packageManager.command, ["install"], {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent
  });
}
async function addDependency(name, options = {}) {
  const resolvedOptions = await resolveOperationOptions(options);
  const names = Array.isArray(name) ? name : [name];
  const args = (resolvedOptions.packageManager.name === "yarn" ? [
    ...getWorkspaceArgs(resolvedOptions),
    // Global is not supported in berry: yarnpkg/berry#821
    resolvedOptions.global && resolvedOptions.packageManager.majorVersion === "1" ? "global" : "",
    "add",
    resolvedOptions.dev ? "-D" : "",
    ...names
  ] : [
    resolvedOptions.packageManager.name === "npm" ? "install" : "add",
    ...getWorkspaceArgs(resolvedOptions),
    resolvedOptions.dev ? "-D" : "",
    resolvedOptions.global ? "-g" : "",
    ...names
  ]).filter(Boolean);
  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent
  });
}

export { addDependency as a, installDependencies as i };
