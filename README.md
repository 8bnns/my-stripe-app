# My Stripe App

A Stripe App — a UI extension that renders custom panels inside the Stripe Dashboard. Built with TypeScript and React using the `@stripe/ui-extension-sdk`.

## Quick Start

### Prerequisites
- Node.js >= 14
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- pnpm (or npm/yarn)

### Installation & Development

```bash
# Install dependencies
pnpm install

# Run the app locally in the Stripe Dashboard (requires Stripe CLI)
stripe apps serve

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Deployment

```bash
# Publish the app to Stripe
stripe apps upload
```

## Project Structure

```
my-stripe-app/
├── stripe-app.json          # App manifest and configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest test configuration
├── src/
│   └── views/               # React view components
│       ├── Home.tsx         # Dashboard homepage panel
│       ├── Home.test.tsx
│       ├── Customers.tsx    # Customer list page panel
│       ├── Customers.test.tsx
│       ├── CustomerDetails.tsx  # Customer detail page panel
│       ├── CustomerDetails.test.tsx
│       └── brand_icon.svg   # Brand icon asset
└── .build/                  # Compiled artifacts (generated)
    ├── manifest.js
    ├── ext.js
    └── ext.min.js
```

## Architecture Overview

### Viewport-to-Component Mapping

The app registers three views in the Stripe Dashboard via `stripe-app.json`:

| Viewport | Component | Purpose |
| --- | --- | --- |
| `stripe.dashboard.home.overview` | Home | Dashboard homepage panel |
| `stripe.dashboard.customer.list` | Customers | Customer list page panel |
| `stripe.dashboard.customer.detail` | CustomerDetails | Individual customer detail panel |

When a user navigates to a Stripe Dashboard location, the corresponding React component is automatically mounted and rendered.

### Core Components

#### Home (`src/views/Home.tsx`)
- **Purpose**: Introduces users to the Stripe Apps framework
- **Features**: 
  - Links to Stripe Apps documentation
  - Guidance for navigating to other views
  - Help resources (docs, support, Discord)
- **Props**: Receives `ExtensionContextValue` containing `userContext` and `environment`
- **Responsibilities**: Educational content and documentation links

#### Customers (`src/views/Customers.tsx`)
- **Purpose**: Renders on the customer list page
- **Features**:
  - Informs users about customer interaction
  - Links to documentation
  - Help resources
- **Props**: Receives `ExtensionContextValue`
- **Responsibilities**: Template component ready for customer list functionality

#### CustomerDetails (`src/views/CustomerDetails.tsx`)
- **Purpose**: Renders on individual customer detail pages
- **Features**:
  - Demonstrates SDK utility usage (clipboard operations)
  - Provides next steps for app development
  - UI component composition patterns
- **Props**: Receives `ExtensionContextValue`
- **Interactions**: Implements `useCallback` hook with clipboard copy functionality
- **Error Handling**: Wraps SDK utilities in try-catch with console logging

### UI Components & SDK Utilities

All views use the `@stripe/ui-extension-sdk` library:

**UI Components** (`@stripe/ui-extension-sdk/ui`):
- `ContextView` — Container component providing layout, branding, and footer
- `Box` — Layout and spacing utility
- `Button` — Interactive button element
- `Link` — External navigation links
- `Icon` — Icon rendering
- `Inline` — Inline text styling
- `Divider` — Visual separator

**Utilities** (`@stripe/ui-extension-sdk/utils`):
- `clipboardWriteText()` — Copy text to clipboard with error handling

**Testing** (`@stripe/ui-extension-sdk/testing`):
- `render()` — Component testing utility
- `getMockContextProps()` — Mock context generator for tests

## Data Flow & Interactions

### Component Initialization
1. Stripe Dashboard detects user navigation to a registered viewport
2. Dashboard injects the mapped component with `ExtensionContextValue` props
3. Component receives `userContext` (user/account information) and `environment` (API endpoints, auth)
4. Component renders within the Dashboard UI

### Communication Methods
- **UI Components**: SDK provides styled, accessible components for rendering
- **External Links**: Components include links to documentation and support resources
- **SDK Utilities**: Access to browser APIs (clipboard, etc.) through SDK methods
- **No Inter-component Communication**: Views are isolated and do not communicate with each other

### Error Handling Pattern
The `CustomerDetails` component demonstrates the current error handling approach:

```typescript
const writeToClipboard = useCallback(async () => {
  try {
    await clipboardWriteText(CLIPBOARD_TEXT);
    // Success: text copied silently
  } catch (e) {
    console.error("Writing to the clipboard failed.");
    // Error logged to console; no user notification
  }
}, []);
```

**Current Limitations**:
- Errors log to console only (no user-facing notifications)
- No recovery mechanisms or retry logic
- No global error boundary or centralized error handling
- No logging infrastructure beyond `console.error()`

## Development Setup

### TypeScript Configuration
- Extends `@stripe/ui-extension-tools/tsconfig.ui-extension`
- No custom overrides needed; uses Stripe's preset
- Ensures compatibility with the SDK

### Testing Framework
- **Test Runner**: Jest (configured via `@stripe/ui-extension-tools/jest.config.ui-extension`)
- **Testing Utilities**: `@stripe/ui-extension-sdk/testing`
- **Test Pattern**: Mount components with mock context props and assert rendering

**Example Test**:
```typescript
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

**Running Tests**:
```bash
# Run all tests
pnpm test

# Run a specific test file
pnpm test src/views/Home.test.tsx

# Watch mode
pnpm test --watch
```

### Linting
- **Linter**: ESLint
- **Config**: Extends `@stripe/ui-extension-tools/eslintrc.ui-extension.js`
- **Run**: `pnpm lint`

## Build & Deployment

### Build Process
The Stripe CLI handles building and bundling:
- TypeScript compilation
- Bundle optimization
- Asset processing
- Manifest generation

Compiled artifacts are stored in `.build/`:
- `manifest.js` — App manifest
- `ext.js` — Full bundle
- `ext.min.js` — Minified bundle

### Local Development
```bash
stripe apps serve
```
- Serves the app locally
- Auto-reloads on file changes
- Requires Stripe CLI configuration and authentication

### Deployment
```bash
stripe apps upload
```
- Publishes the app to Stripe
- Makes it available in your Stripe Dashboard

## Dependencies

### Production Dependencies
- **@stripe/ui-extension-sdk** (^9.0.0) — Core SDK providing UI components, context, utilities, and testing helpers
- **stripe** (^13.4.0) — Stripe Node.js SDK for server-side API calls (included for future use)

### Development Dependencies
- **@stripe/ui-extension-tools** (^0.0.1) — Tooling, configs, and presets
- **@types/jest** (^27.5.2) — Jest type definitions
- **@types/react** (^17.0.2) — React type definitions

## Configuration Files

### stripe-app.json
The app manifest defining:
- **id**: Unique app identifier (`com.example.my-stripe-app`)
- **version**: Semantic version (`0.0.1`)
- **name**: Display name (`My Stripe App`)
- **ui_extension**: Viewport registrations and CSP headers
- **permissions**: Currently empty; add required permissions as needed

### Content Security Policy (CSP)
- `connect-src`: Currently `null` (allows all); restrict as needed
- `image-src`: Currently `null` (allows all); restrict as needed

## Runtime Behavior

### Application Lifecycle
1. **Load**: Stripe Dashboard reads the app manifest
2. **Register**: App registers views for the specified viewports
3. **Inject**: When user navigates, Dashboard injects the component with context props
4. **Render**: Component renders synchronously within the Dashboard UI
5. **Interact**: Users interact with UI; components handle events via SDK utilities

### Current Workflows
- **Home View**: Static information display and navigation guidance
- **Customers View**: Placeholder awaiting implementation
- **CustomerDetails View**: Demonstrates clipboard copy interaction with error handling

### No Backend Integration
Current views are purely UI-driven with no API calls. To integrate with Stripe APIs:
1. Use the `stripe` package (already included)
2. Call Stripe API endpoints from component event handlers
3. Implement proper error handling and loading states
4. Add authentication and authorization checks

## Extending the App

### Adding a New View
```bash
stripe apps add view
```

This scaffolds a new view component and registers it in `stripe-app.json`.

### Implementing Customer List Logic
Enhance the `Customers` component to:
1. Access customer data from `userContext` or Stripe API
2. Render a customer list
3. Navigate to customer details when clicked

### Implementing Customer Details Logic
Enhance the `CustomerDetails` component to:
1. Fetch customer data using customer ID from context
2. Display customer information
3. Implement customer-specific actions (e.g., refunds, disputes)

## Error Handling & Resilience

### Current State
- Minimal error handling (try-catch around clipboard operations only)
- Errors logged to console; no user notifications
- No recovery mechanisms or retry logic

### Recommended Enhancements
1. **Error Boundaries**: Wrap views in React error boundaries
2. **User Notifications**: Display errors to users with clear messages
3. **API Error Handling**: Implement retry logic and timeout handling for API calls
4. **Logging**: Add structured logging for debugging and monitoring
5. **Validation**: Validate user input and API responses

## Testing Strategy

### Current Coverage
- Component rendering tests
- Basic assertions on UI presence

### Recommended Additions
- **Error Path Testing**: Test error scenarios and exception handling
- **Interaction Testing**: Verify clipboard and button interactions
- **Integration Testing**: Test with real Stripe API endpoints (staging)
- **Edge Cases**: Handle missing data, network failures, invalid inputs

## Resources & Documentation

- [Stripe Apps Documentation](https://stripe.com/docs/stripe-apps)
- [UI Extension SDK Reference](https://docs.stripe.com/stripe-apps/reference/extensions-sdk-api)
- [UI Components Guide](https://docs.stripe.com/stripe-apps/components)
- [Stripe Viewports Reference](https://docs.stripe.com/stripe-apps/reference/viewports)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

## Support

For questions or issues:
- Check the [Stripe Apps docs](https://stripe.com/docs/stripe-apps)
- Visit [Stripe Support](https://support.stripe.com/)
- Join the [Stripe Developers Discord](https://discord.com/invite/stripe)

---

**Version**: 0.0.1  
**Created**: Based on Stripe Apps UI Extension SDK v9.0.0
