# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Run the app locally in the Stripe Dashboard (requires Stripe CLI authenticated)
stripe apps serve

# Run all tests
pnpm test

# Run a single test file
pnpm test src/views/Home.test.tsx

# Watch mode
pnpm test --watch

# Lint (ESLint, TypeScript + TSX files under src/)
pnpm lint

# Publish to Stripe
stripe apps upload

# Scaffold a new view component and register it in stripe-app.json
stripe apps add view
```

> Build/bundling is handled entirely by the Stripe CLI (`stripe apps serve` / `stripe apps upload`), not by a pnpm build script. There is no `pnpm build`.

## Architecture

This is a **Stripe Dashboard UI Extension** — a React app that renders panels inside the Stripe Dashboard at specific locations called viewports.

### Viewport → Component mapping (`stripe-app.json`)

| Viewport | Component | Mounted on |
|---|---|---|
| `stripe.dashboard.home.overview` | `Home` | Dashboard home |
| `stripe.dashboard.customer.list` | `Customers` | Customer list page |
| `stripe.dashboard.customer.detail` | `CustomerDetails` | Customer detail page |

The Stripe Dashboard reads `stripe-app.json` to know which React component to mount at each location. Views are isolated — there is no inter-component communication.

### View component contract

Every view is a React function component that receives `ExtensionContextValue` (destructured as `{ userContext, environment }`) injected by the Dashboard at runtime. All views must wrap their content in `ContextView` from `@stripe/ui-extension-sdk/ui`, which provides the standard panel chrome (title, brand icon/color, footer, external link).

```tsx
import type { ExtensionContextValue } from "@stripe/ui-extension-sdk/context";
import { ContextView, Box } from "@stripe/ui-extension-sdk/ui";

const MyView = ({ userContext, environment }: ExtensionContextValue) => (
  <ContextView title="..." brandColor="#..." brandIcon={BrandIcon}>
    <Box>...</Box>
  </ContextView>
);
export default MyView;
```

### SDK imports

- **UI components** — `@stripe/ui-extension-sdk/ui` (`ContextView`, `Box`, `Button`, `Link`, `Icon`, `Inline`, `Divider`, …)
- **Context types** — `@stripe/ui-extension-sdk/context` (`ExtensionContextValue`)
- **Utilities** — `@stripe/ui-extension-sdk/utils` (`clipboardWriteText`, etc.)
- **Testing** — `@stripe/ui-extension-sdk/testing` (`render`, `getMockContextProps`)

### Testing pattern

Tests use the SDK's own `render` and `getMockContextProps` helpers — **not** React Testing Library or `@testing-library/react`. Jest config inherits from `@stripe/ui-extension-tools/jest.config.ui-extension`.

```tsx
import { render, getMockContextProps } from "@stripe/ui-extension-sdk/testing";
import { ContextView } from "@stripe/ui-extension-sdk/ui";
import Home from "./Home";

describe("Home", () => {
  it("renders ContextView", () => {
    const { wrapper } = render(<Home {...getMockContextProps()} />);
    expect(wrapper.find(ContextView)).toContainText("save to reload this view");
  });
});
```

### TypeScript & linting

`tsconfig.json` extends `@stripe/ui-extension-tools/tsconfig.ui-extension` with no overrides. ESLint config is inlined in `package.json` and extends `@stripe/ui-extension-tools/eslintrc.ui-extension.js`.

### Adding Stripe API calls

The `stripe` Node.js package is already listed as a dependency for future server-side use. Permissions for any Stripe API access must be declared in the `permissions` array in `stripe-app.json` before they will be available at runtime.
