import { render, getMockContextProps } from "@stripe/ui-extension-sdk/testing";
import { ContextView } from "@stripe/ui-extension-sdk/ui";

import Customers from "./Customers";

describe("Customers", () => {
  it("renders ContextView with correct title", () => {
    const { wrapper } = render(<Customers {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)!.prop("title")).toBe("Customers page");
  });

  it("prompts user to click or create a customer", () => {
    const { wrapper } = render(<Customers {...getMockContextProps()} />);

    expect(wrapper.find(ContextView)).toContainText(
      "Click on a customer"
    );
  });
});
