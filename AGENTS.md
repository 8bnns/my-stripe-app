# AGENTS.md

Guidance for coding agents working in this repository.

## Project scope

This is a private Stripe Dashboard UI Extension built with React and TypeScript. The current views are starter UI only: they do not call a backend, fetch customer data, or perform privileged Stripe API operations.

## Commands

```bash
# Install dependencies
pnpm install

# Validate manifest structure, view references, and package metadata
pnpm test:manifest

# Run component tests
pnpm test

# Run one component test
pnpm test src/views/Home.test.tsx

# Lint TypeScript and TSX files under src/
pnpm lint

# Run all local checks
pnpm check

# Serve locally through the authenticated Stripe CLI
stripe apps serve

# Upload only as an explicitly authorized release action
stripe apps upload

# Scaffold and register another view
stripe apps add view
```

The Stripe CLI handles build and bundle output. There is no `pnpm build` script.

## Architecture

`stripe-app.json` maps Stripe Dashboard viewports to components in `src/views/`:

| Viewport | Component |
| --- | --- |
| `stripe.dashboard.home.overview` | `Home` |
| `stripe.dashboard.customer.list` | `Customers` |
| `stripe.dashboard.customer.detail` | `CustomerDetails` |

Every view receives `ExtensionContextValue` and renders inside `ContextView` from `@stripe/ui-extension-sdk/ui`. Views are isolated; do not assume shared state or inter-view communication.

Common SDK imports:

- UI components: `@stripe/ui-extension-sdk/ui`
- Context types: `@stripe/ui-extension-sdk/context`
- Utilities: `@stripe/ui-extension-sdk/utils`
- Test helpers: `@stripe/ui-extension-sdk/testing`

## Tests and validation

Tests use the SDK's `render` and `getMockContextProps` helpers, not React Testing Library. Jest inherits `@stripe/ui-extension-tools/jest.config.ui-extension`.

When changing `stripe-app.json`, run `pnpm test:manifest`. When adding a view, add its source file and component test, then run `pnpm check`. Do not claim that Stripe CLI serving or uploading was tested unless it was actually run with authorized credentials.

## Security requirements

- Never commit Stripe secret keys, session credentials, or real customer data.
- Never import the `stripe` Node.js SDK into a UI view for secret-key API calls.
- Put privileged Stripe API operations in a separately secured backend with authentication, authorization, server-side validation, and secret management.
- Keep `permissions` least-privilege and review any manifest permission change explicitly.
- Treat unrestricted `connect-src` and `image-src` values as production work to restrict, not as secure defaults.
- Do not run `stripe apps upload` as a test or without explicit release authorization.

## Dependency and license discipline

The `stripe` dependency is currently unused by the UI. Remove or use it only through a deliberate dependency/architecture change with updated lockfiles and tests. The package is private and `UNLICENSED`; do not replace that metadata with an open-source license without the owner's decision.
