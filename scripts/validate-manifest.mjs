#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const allowedJsonFiles = new Set(["stripe-app.json", "package.json"]);
const componentNamePattern = /^[A-Z][A-Za-z0-9]*$/;
const errors = [];
const warnings = [];

function readJson(fileName) {
  if (!allowedJsonFiles.has(fileName)) {
    errors.push(`Refusing to read unapproved JSON file: ${fileName}.`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(path.join(root, fileName), "utf8"));
  } catch (error) {
    errors.push(`${fileName}: ${error.message}`);
    return null;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${label} must be a non-empty string.`);
  }
}

const manifest = readJson("stripe-app.json");
const packageJson = readJson("package.json");

if (isObject(manifest)) {
  requireString(manifest.id, "stripe-app.json.id");
  requireString(manifest.version, "stripe-app.json.version");
  requireString(manifest.name, "stripe-app.json.name");

  if (!Array.isArray(manifest.permissions)) {
    errors.push("stripe-app.json.permissions must be an array.");
  }

  const views = manifest.ui_extension?.views;
  if (!Array.isArray(views) || views.length === 0) {
    errors.push("stripe-app.json.ui_extension.views must be a non-empty array.");
  } else {
    const viewports = new Set();
    const components = new Set();

    views.forEach((view, index) => {
      const label = `stripe-app.json.ui_extension.views[${index}]`;
      if (!isObject(view)) {
        errors.push(`${label} must be an object.`);
        return;
      }

      requireString(view.viewport, `${label}.viewport`);
      requireString(view.component, `${label}.component`);

      if (viewports.has(view.viewport)) {
        errors.push(`Duplicate viewport: ${view.viewport}.`);
      }
      if (components.has(view.component)) {
        errors.push(`Duplicate component: ${view.component}.`);
      }
      viewports.add(view.viewport);
      components.add(view.component);

      if (typeof view.component === "string" && view.component.trim()) {
        if (!componentNamePattern.test(view.component)) {
          errors.push(
            `${label}.component must be a PascalCase identifier containing only letters and numbers.`,
          );
        } else {
          const source = path.join(root, "src", "views", `${view.component}.tsx`);
          if (!fs.existsSync(source)) {
            errors.push(`${label} references missing src/views/${view.component}.tsx.`);
          }
        }
      }
    });
  }

  const csp = manifest.ui_extension?.content_security_policy;
  if (csp?.["connect-src"] === null) {
    warnings.push("connect-src is unrestricted; restrict it before production use.");
  }
  if (csp?.["image-src"] === null) {
    warnings.push("image-src is unrestricted; restrict it before production use.");
  }
} else if (manifest !== null) {
  errors.push("stripe-app.json must contain an object at the root.");
}

if (isObject(packageJson) && isObject(manifest)) {
  if (packageJson.name !== manifest.id) {
    errors.push("package.json name must match the Stripe app id.");
  }
  if (packageJson.version !== manifest.version) {
    errors.push("package.json version must match the Stripe app version.");
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Validated ${manifest.ui_extension.views.length} Stripe app views and matching package metadata.`,
);
