/**
 * Login page coverage for the public class-project demo notice and accounts.
 */
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/utils/supabase/client", () => ({
  createClient: () => ({}),
}));

vi.mock("@/components/SplitText", () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

import LoginPage from "@/app/page";

describe("LoginPage demo accounts", () => {
  it("shows the demo notice and labeled credentials beneath the login form", () => {
    render(<LoginPage />);

    const demo = screen.getByRole("region", { name: "Class project demo" });
    expect(within(demo).getByText(
      "PayCore is a class project demo. Try it using either demo account below.",
    )).toBeVisible();

    for (const account of [
      { role: "Manager", email: "johnsmith@paycore.com", password: "manager123" },
      { role: "Employee", email: "emilydavis@paycore.com", password: "employee123" },
    ]) {
      const heading = within(demo).getByRole("heading", { name: account.role });
      const block = heading.parentElement;
      expect(block).not.toBeNull();
      expect(within(block!).getByText("Email:")).toBeVisible();
      expect(within(block!).getByText(account.email)).toBeVisible();
      expect(within(block!).getByText("Password:")).toBeVisible();
      expect(within(block!).getByText(account.password)).toBeVisible();
    }

    const loginButton = screen.getByRole("button", { name: "Login" });
    const form = loginButton.closest("form");
    expect(form).not.toContainElement(demo);
    expect(form?.compareDocumentPosition(demo)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getByRole("link", { name: "Searching for someone?" }))
      .toHaveAttribute("href", "/internal-search");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");
  });
});
