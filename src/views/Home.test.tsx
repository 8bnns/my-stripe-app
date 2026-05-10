import { render, getMockContextProps } from "@stripe/ui-extension-sdk/testing";
import { ContextView } from "@stripe/ui-extension-sdk/ui";

import Home from "./Home";

describe("Home", () => {
  it("renders ContextView with correct title", () => {
    const { wrapper } = render(<Home {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)!.prop("title")).toBe("Dashboard homepage");
  });

  it("displays welcome heading", () => {
    const { wrapper } = render(<Home {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("Welcome to Stripe Apps");
  });

  it("lists all three viewports", () => {
    const { wrapper } = render(<Home {...getMockContextProps()} />);
    const text = wrapper.find(ContextView);

    expect(text).toContainText("Dashboard homepage");
    expect(text).toContainText("Customers page");
    expect(text).toContainText("Customer details page");
  });
});
