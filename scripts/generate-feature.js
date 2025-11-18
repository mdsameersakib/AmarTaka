#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const featureName = process.argv[2]?.toLowerCase();
const deleteFlag = process.argv.includes("--delete");
const dryRun = process.argv.includes("--dry-run");

if (!featureName) {
  console.error(
    "Usage: pnpm generate:feature <FeatureName> [--delete] [--dry-run]",
  );
  process.exit(1);
}

const featureDir = path.join("src", "features", featureName);
const appRouteDir = path.join("src", "app", "(app)", featureName);
const navFile = path.join("src", "config", "navigation.ts");

function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

async function main() {
  if (deleteFlag) {
    // Confirm deletion
    if (!dryRun) {
      const ok = await confirm(
        `Are you sure you want to delete feature "${featureName}"? This cannot be undone. (y/N): `,
      );
      if (!ok) return console.log("Aborted.");
    }
    // Only delete if folders exist and match expected structure
    if (fs.existsSync(featureDir)) {
      if (dryRun) {
        console.log(`[Dry Run] Would delete: ${featureDir}`);
      } else {
        fs.rmSync(featureDir, { recursive: true, force: true });
        console.log(`Deleted: ${featureDir}`);
      }
    }
    if (fs.existsSync(appRouteDir)) {
      if (dryRun) {
        console.log(`[Dry Run] Would delete: ${appRouteDir}`);
      } else {
        fs.rmSync(appRouteDir, { recursive: true, force: true });
        console.log(`Deleted: ${appRouteDir}`);
      }
    }
    // Clean up empty parent directories if they exist
    const appDir = path.join("src", "app", "(app)");
    if (fs.existsSync(appDir)) {
      const entries = fs.readdirSync(appDir);
      if (entries.length === 0) {
        if (dryRun) {
          console.log(`[Dry Run] Would delete empty directory: ${appDir}`);
        } else {
          try {
            fs.rmdirSync(appDir);
            console.log(`Deleted empty directory: ${appDir}`);
          } catch (_e) {
            // Directory not empty or other error, ignore
          }
        }
      }
    }
    // Remove from navigation.ts using marker
    let navContent = fs.readFileSync(navFile, "utf8");
    const navEntryRegex = new RegExp(
      `\\s*\\{[^}]*label:\\s*['"\`]${capitalize(featureName)}['"\`][^}]*\\},?\\n`,
      "g",
    );
    if (navEntryRegex.test(navContent)) {
      if (dryRun) {
        console.log(
          `[Dry Run] Would remove navigation entry for: ${featureName}`,
        );
      } else {
        // Re-create regex since test() consumed it
        const navEntryRegex2 = new RegExp(
          `\\s*\\{[^}]*label:\\s*['"\`]${capitalize(featureName)}['"\`][^}]*\\},?\\n`,
          "g",
        );
        navContent = navContent.replace(navEntryRegex2, "");
        fs.writeFileSync(navFile, navContent);
        console.log(`Removed navigation entry for: ${featureName}`);
      }
    }
    return;
  }

  // Create feature folders and files
  if (fs.existsSync(featureDir) || fs.existsSync(appRouteDir)) {
    console.error("Feature already exists. Aborting.");
    return;
  }
  if (!dryRun) {
    fs.mkdirSync(path.join(featureDir, "components"), { recursive: true });
    fs.mkdirSync(path.join(featureDir, "hooks"), { recursive: true });
    fs.mkdirSync(path.join(featureDir, "lib"), { recursive: true });
    fs.mkdirSync(path.join(featureDir, "pages"), { recursive: true });
    fs.mkdirSync(path.join(featureDir, "__tests__"), { recursive: true });
    fs.mkdirSync(appRouteDir, { recursive: true });
    // Add .gitkeep files
    ["components", "hooks", "lib", "__tests__"].forEach((sub) => {
      fs.writeFileSync(path.join(featureDir, sub, ".gitkeep"), "");
    });
    // Add boilerplate files
    fs.writeFileSync(
      path.join(featureDir, "constants.ts"),
      "// Feature constants\n",
    );
    fs.writeFileSync(path.join(featureDir, "types.ts"), "// Feature types\n");
    fs.writeFileSync(
      path.join(featureDir, "README.md"),
      `# ${capitalize(featureName)} Feature\n`,
    );
    fs.writeFileSync(
      path.join(featureDir, "index.ts"),
      `export * from "./pages/${featureName}-page";\n`,
    );
    fs.writeFileSync(
      path.join(featureDir, "pages", `${featureName}-page.tsx`),
      `export default function ${capitalize(featureName)}Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-card">
      <div className="w-full max-w-xl flex flex-col items-center gap-6 p-10">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl font-bold text-primary">${capitalize(featureName).charAt(0)}</span>
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">${capitalize(featureName)}</h2>
        </div>
        <p className="text-muted-foreground text-center">
          This is a beautiful starter page. Use this as a template for your own content and layouts.<br />
          <span className="text-xs text-muted-foreground">Edit <code>src/features/${featureName}/pages/${featureName}-page.tsx</code> to get started.</span>
        </p>
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="mb-1 font-medium">Section Example</h3>
            <p className="text-sm text-muted-foreground">
              You can add cards, forms, tables, or any UI here. This is a flexible layout for your next feature.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="mb-1 font-medium">Quick Tips</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Use Tailwind utility classes for rapid design.</li>
              <li>Organize your components in <code>src/components</code>.</li>
              <li>Update navigation in <code>src/config/navigation.ts</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
    );
    fs.writeFileSync(
      path.join(appRouteDir, "page.tsx"),
      `import ${capitalize(featureName)}Page from "@/features/${featureName}/pages/${featureName}-page";\n\nexport default function ${capitalize(featureName)}Route() {\n  return <${capitalize(featureName)}Page />;\n}\n`,
    );
  }
  // Add to navigation.ts using marker
  let navContent = fs.readFileSync(navFile, "utf8");
  const navEntry = `  {\n    label: "${capitalize(featureName)}",\n    href: "/${featureName}",\n    icon: LayoutDashboard, // TODO: Update icon\n    roles: ALL_ROLES,\n  },\n`;
  if (!navContent.includes(`label: "${capitalize(featureName)}"`)) {
    const marker = "// [GENERATOR-INSERTION-POINT]";
    if (navContent.includes(marker)) {
      navContent = navContent.replace(marker, `${navEntry}  ${marker}`);
      if (!dryRun) fs.writeFileSync(navFile, navContent);
      console.log(`Added navigation entry for: ${featureName}`);
    } else {
      console.error(
        'Marker not found in navigation.ts. Please add "// [GENERATOR-INSERTION-POINT]" to the navigationItems array.',
      );
    }
  }
  console.log(`Feature "${featureName}" created successfully.`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

main();
