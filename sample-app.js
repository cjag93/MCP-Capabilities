// Starts the bundled sample app that serves http://localhost:3000/samples/digital-media.
//
// The app is a self-contained Next.js project in ./sample-app; its dependencies
// install on first run. Set SAMPLE_APP_DIR to use a different copy instead
// (for example a checkout of eyes-capabilities-generator).
const { spawn, spawnSync } = require("child_process");
const { existsSync } = require("fs");
const path = require("path");

const appDir = path.resolve(__dirname, process.env.SAMPLE_APP_DIR || "sample-app");

if (!existsSync(path.join(appDir, "node_modules"))) {
  console.log("Installing sample app dependencies (first run only)...");
  const install = spawnSync("npm", ["install"], {
    cwd: appDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (install.status !== 0) {
    console.error("Could not install sample app dependencies in " + appDir);
    process.exit(install.status === null ? 1 : install.status);
  }
}

console.log("Starting the Digital Media sample app from " + appDir);

const child = spawn("npm", ["run", "dev"], {
  cwd: appDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("error", (error) => {
  console.error("Could not start the sample app from " + appDir);
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code) => process.exit(code === null ? 1 : code));
