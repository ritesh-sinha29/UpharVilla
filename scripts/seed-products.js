const { spawnSync } = require("child_process");

const os = require("os");

const USER_ID = "jd70tvmdm7r54j3k05nvbcb1zd878ybv";

console.log(`Starting to seed 25 random products for userId: ${USER_ID}...`);

let jsonArgs = JSON.stringify({ userId: USER_ID });
if (os.platform() === "win32") {
  // Escape quotes for Windows command prompt/PowerShell
  jsonArgs = `{\\"userId\\":\\"${USER_ID}\\"}`;
}

const result = spawnSync(
  "npx",
  ["convex", "run", "seed:seedProducts", jsonArgs],
  { stdio: "inherit", shell: true }
);

if (result.status === 0) {
  console.log("Seeding completed successfully!");
} else {
  console.error("Seeding failed with exit code:", result.status);
  process.exit(1);
}
