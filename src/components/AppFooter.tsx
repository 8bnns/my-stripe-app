import { Box, Link } from "@stripe/ui-extension-sdk/ui";

/**
 * Shared footer shown in all views with links to Stripe resources.
 */
const AppFooter = () => (
  <Box css={{ marginBottom: "medium" }}>
    Questions? Get help with your app from the{" "}
    <Link
      external
      href="https://stripe.com/docs/stripe-apps"
      target="_blank"
      type="secondary"
    >
      Stripe Apps docs
    </Link>
    ,{" "}
    <Link
      external
      href="https://support.stripe.com/"
      target="_blank"
      type="secondary"
    >
      Stripe Support
    </Link>
    , or the{" "}
    <Link
      external
      href="https://discord.com/invite/stripe"
      target="_blank"
      type="secondary"
    >
      Stripe Developers Discord
    </Link>
    .
  </Box>
);

export default AppFooter;
