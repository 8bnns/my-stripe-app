import { render, getMockContextProps } from "@stripe/ui-extension-sdk/testing";
import { Button, ContextView } from "@stripe/ui-extension-sdk/ui";

import CustomerDetails from "./CustomerDetails";

describe("CustomerDetails", () => {
  it("renders ContextView with correct title", () => {
    const { wrapper } = render(<CustomerDetails {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)!.prop("title")).toBe("Customer details page");
  });

  it("displays next steps heading", () => {
    const { wrapper } = render(<CustomerDetails {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("Next steps");
  });

  it("shows the clipboard command text", () => {
    const { wrapper } = render(<CustomerDetails {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText("stripe apps add view");
  });

  it("renders a clipboard button", () => {
    const { wrapper } = render(<CustomerDetails {...getMockContextProps()} />);

    expect(wrapper.findAll(Button)).toHaveLength(1);
  });
});
