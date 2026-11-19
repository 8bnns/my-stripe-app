# My Stripe App

A private Stripe Dashboard UI extension built with TypeScript, React, and `@stripe/ui-extension-sdk`. The current application is the Stripe starter experience: it renders informational panels and does not fetch customer data or call a backend.

## Requirements

- Node.js 14 or newer, matching `package.json`.
- pnpm.
- [Stripe CLI](https://stripe.com/docs/stripe-cli) for local serving and uploads.
- A Stripe account authorized to develop and upload the app.

## Install and validate

```bash
pnpm install
pnpm test:manifest
pnpm lint
pnpm test
```

Run all three checks with:

```bash
pnpm check
```

`test:manifest` uses only Node.js built-in modules. It checks required manifest fields, unique viewports and components, matching package/app versions, and the presence of each referenced view source file. It also warns about unrestricted content-security-policy directives.

## Local development

```bash
stripe apps serve
```

The Stripe CLI builds and serves the extension inside the Stripe Dashboard. Authentication and any required Stripe setup must be completed locally; credentials are not stored in this repository.

Run one component test or watch tests with:

```bash
pnpm test src/views/Home.test.tsx
pnpm test -- --watch
```

## Registered views

| Viewport | Component | Current behavior |
| --- | --- | --- |
| `stripe.dashboard.home.overview` | `Home` | Introduces the starter app and available views. |
| `stripe.dashboard.customer.list` | `Customers` | Explains navigation to customer details. |
| `stripe.dashboard.customer.detail` | `CustomerDetails` | Demonstrates UI components and clipboard interaction. |

The mapping is declared in `stripe-app.json`. Tests use the SDK's `render` and `getMockContextProps` helpers rather than React Testing Library.

## Project structure

```text
my-stripe-app/
├── stripe-app.json
├── package.json
├── tsconfig.json
├── jest.config.js
├── scripts/
│   └── validate-manifest.mjs
└── src/
    └── views/
        ├── Home.tsx
        ├── Home.test.tsx
        ├── Customers.tsx
        ├── Customers.test.tsx
        ├── CustomerDetails.tsx
        ├── CustomerDetails.test.tsx
        └── brand_icon.svg
```

Generated `.build/` output, dependencies, coverage, and local environment files are ignored.

## Security and external data

**Never place Stripe secret keys in a UI extension, browser bundle, source file, or committed environment file.** The current views must not import the `stripe` Node.js SDK or call Stripe API endpoints directly with secret credentials.

If the app later needs privileged Stripe API operations:

1. Implement them in a separately secured backend.
2. Keep secret keys in that backend's secret manager or environment.
3. Authenticate the extension user and authorize every requested operation.
4. Validate inputs server-side and return only the data the view needs.
5. Declare only the app permissions required by the integration.
6. Replace unrestricted `connect-src` and `image-src` values with explicit production endpoints before release.

The existing `stripe` dependency is not used by the current UI. Removing it or introducing a backend should be handled as a separate dependency/architecture change with its own tests.

## Add a view

```bash
stripe apps add view
```

After scaffolding, add or update its component test and run `pnpm check`. The manifest validator verifies that every registered component has a corresponding `src/views/<Component>.tsx` file.

## Upload

```bash
stripe apps upload
```

Upload only after local validation and an authorized review of the manifest, permissions, CSP, and application behavior. Uploading is a release action, not part of routine local validation.

## Repository metadata

The package is private. Its existing `~~proprietary~~` license string is non-standard; selecting or applying a license is a separate owner decision and is not changed by routine cleanup.

## Resources

- [Stripe Apps documentation](https://stripe.com/docs/stripe-apps)
- [UI Extension SDK reference](https://docs.stripe.com/stripe-apps/reference/extensions-sdk-api)
- [UI components](https://docs.stripe.com/stripe-apps/components)
- [Stripe viewports](https://docs.stripe.com/stripe-apps/reference/viewports)
