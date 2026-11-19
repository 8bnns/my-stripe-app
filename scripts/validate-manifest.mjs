#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function readJson(relativePath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(object, key, source) {
  if (typeof object?.[key] !== "string" || !object[key].trim()) {
    errors.push(`${source}.${key} must be a non-empty string.`);
  }
}

const manifest = readJson("stripe-app.json");
const packageJson = readJson("package.json");

if (isObject(manifest)) {
  requireString(manifest, "id", "stripe-app.json");
  requireString(manifest, "version", "stripe-app.json");
  requireString(manifest, "name", "stripe-app.json");

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

      requireString(view, "viewport", label);
      requireString(view, "component", label);

      if (viewports.has(view.viewport)) {
        errors.push(`Duplicate viewport: ${view.viewport}.`);
      }
      if (components.has(view.component)) {
        errors.push(`Duplicate component: ${view.component}.`);
      }
      viewports.add(view.viewport);
      components.add(view.component);

      if (typeof view.component === "string" && view.component.trim()) {
        const source = path.join(root, "src", "views", `${view.component}.tsx`);
        if (!fs.existsSync(source)) {
          errors.push(`${label} references missing src/views/${view.component}.tsx.`);
        }
      }
    });
  }

  const csp = manifest.ui_extension?.content_security_policy;
  for (const directive of ["connect-src", "image-src"]) {
    if (csp?.[directive] === null) {
      warnings.push(`${directive} is unrestricted; restrict it before production use.`);
    }
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
