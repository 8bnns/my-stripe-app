# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This is a **Stripe App** — a UI extension that renders panels inside the Stripe Dashboard. It is built with TypeScript and React using the `@stripe/ui-extension-sdk`. The package manager is **pnpm**.

## Commands

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run a single test file
pnpm test src/views/Home.test.tsx

# Lint
pnpm lint

# Serve the app locally inside the Stripe Dashboard (requires Stripe CLI)
stripe apps serve

# Add a new view (viewport + component scaffold)
stripe apps add view

# Upload/publish the app to Stripe
stripe apps upload
```

## Architecture

### View registration

`stripe-app.json` is the manifest. The `ui_extension.views` array maps **Stripe Dashboard viewport names** to **React component names**. When adding a new view, register it here and create the corresponding component in `src/views/`.

Current viewports:
- `stripe.dashboard.home.overview` → `Home`
- `stripe.dashboard.customer.list` → `Customers`
- `stripe.dashboard.customer.detail` → `CustomerDetails`

### View components (`src/views/`)

Each view is a React functional component that receives `ExtensionContextValue` as props (destructured as `{ userContext, environment }`). Views must be wrapped in `<ContextView>` from `@stripe/ui-extension-sdk/ui`.

Key SDK imports:
- **UI components**: `@stripe/ui-extension-sdk/ui` (Box, Button, ContextView, Divider, Icon, Inline, Link, …)
- **Type**: `@stripe/ui-extension-sdk/context` → `ExtensionContextValue`
- **Utilities**: `@stripe/ui-extension-sdk/utils` (e.g. `clipboardWriteText`)

### Testing

Tests use `@stripe/ui-extension-sdk/testing` — specifically `render` and `getMockContextProps`. Pass `getMockContextProps()` spread as props to mount a view component in tests. Jest is configured via `@stripe/ui-extension-tools` (see `jest.config.js`).

### Toolchain config

All base configs (`tsconfig`, `eslintrc`, `jest.config`) extend `@stripe/ui-extension-tools` presets — avoid overriding them unless necessary.
