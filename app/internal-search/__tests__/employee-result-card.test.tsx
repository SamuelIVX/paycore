/**
 * Vitest coverage for app/internal-search/employee-result-card.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmployeeResultCard } from "@/app/internal-search/employee-result-card";
import type { EmployeeWithProfile } from "@/lib/supabase/employee";

describe("EmployeeResultCard component", () => {
  const baseEmployee: EmployeeWithProfile = {
    id: "emp-1",
    first_name: "Sarah",
    last_name: "Connor",
    position: "Engineer",
    email: "sarah@paycore.com",
    phone: "555-0199",
  };

  it("renders basic employee information, initials, and contact links", () => {
    render(<EmployeeResultCard employee={baseEmployee} />);

    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("SC")).toBeInTheDocument();
    expect(screen.getAllByText("Engineer").length).toBeGreaterThanOrEqual(1);

    const emailLink = screen.getByRole("link", { name: "sarah@paycore.com" });
    expect(emailLink).toHaveAttribute("href", expect.stringContaining("mailto:sarah@paycore.com"));

    const phoneLink = screen.getByRole("link", { name: "555-0199" });
    expect(phoneLink).toHaveAttribute("href", "tel:555-0199");
  });

  it("renders fallback for missing name, position, and contact details", () => {
    const minimalEmployee = {
      id: "emp-min",
      first_name: null,
      last_name: null,
      position: null,
      email: null,
      phone: null,
    } as unknown as EmployeeWithProfile;

    render(<EmployeeResultCard employee={minimalEmployee} />);

    expect(screen.getByText("Unknown Employee")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(2);
  });

  it("renders address when location details are present", () => {
    const employeeWithAddress = {
      ...baseEmployee,
      address_line: "123 Main St",
      city: "New York",
      state: "NY",
    } as unknown as EmployeeWithProfile;

    render(<EmployeeResultCard employee={employeeWithAddress} />);

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, New York, NY")).toBeInTheDocument();
  });

  it("renders elevated pay rate and pay frequency for managers", () => {
    const elevatedEmployee = {
      ...baseEmployee,
      pay_rate: 85000.5,
      pay_frequency: "SALARY",
    } as unknown as EmployeeWithProfile;

    render(<EmployeeResultCard employee={elevatedEmployee} />);

    expect(screen.getByText("Pay Rate")).toBeInTheDocument();
    expect(screen.getByText("$85,000.50")).toBeInTheDocument();
    expect(screen.getByText("Frequency")).toBeInTheDocument();
    expect(screen.getByText("salary")).toBeInTheDocument();
  });
});
