import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Contact from "./Contact";

// Mock ReCAPTCHA
vi.mock("react-google-recaptcha", () => ({
  default: vi.fn(({ onChange }: { onChange: (token: string) => void }) => (
    <button data-testid="mock-recaptcha" onClick={() => onChange("test-token")}>
      Complete CAPTCHA
    </button>
  )),
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock("./ui/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Contact (Quote Form)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe("Form fields are present", () => {
    it("renders all required fields", () => {
      render(<Contact />);

      expect(screen.getByLabelText(/your name/i)).toBeRequired();
      expect(screen.getByLabelText(/^phone/i)).toBeRequired();
      expect(screen.getByLabelText(/^email/i)).toBeRequired();
      expect(screen.getByLabelText(/site address/i)).toBeRequired();
      expect(screen.getByLabelText(/site suburb/i)).toBeRequired();
      expect(screen.getByLabelText(/postcode/i)).toBeRequired();
      expect(screen.getByLabelText(/building type/i)).toBeRequired();
      expect(screen.getByLabelText(/^location/i)).toBeRequired();
      expect(screen.getByLabelText(/protecting fall/i)).toBeRequired();
    });

    it("renders all optional fields", () => {
      render(<Contact />);

      expect(screen.getByLabelText(/company name/i)).not.toBeRequired();
      expect(screen.getByLabelText(/balustrade height/i)).not.toBeRequired();
      expect(screen.getByLabelText(/total lineal metres/i)).not.toBeRequired();
      expect(screen.getByLabelText(/when do you expect/i)).not.toBeRequired();
      expect(screen.getByLabelText(/other notes/i)).not.toBeRequired();
    });

    it("renders building type dropdown with correct options", () => {
      render(<Contact />);

      const select = screen.getByLabelText(/building type/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(5);
      expect(options[1]).toHaveTextContent("Residential");
      expect(options[2]).toHaveTextContent("Commercial");
      expect(options[3]).toHaveTextContent("Pool Fence");
      expect(options[4]).toHaveTextContent("Other");
    });

    it("renders location dropdown with correct options", () => {
      render(<Contact />);

      const select = screen.getByLabelText(/^location/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(3);
      expect(options[1]).toHaveTextContent("Exterior");
      expect(options[2]).toHaveTextContent("Internal");
    });

    it("renders protecting fall dropdown with correct options", () => {
      render(<Contact />);

      const select = screen.getByLabelText(/protecting fall/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(3);
      expect(options[1]).toHaveTextContent("Yes, balustrading IS preventing a fall");
      expect(options[2]).toHaveTextContent("No, balustrading is NOT preventing a fall");
    });
  });

  describe("Form fields match between Contact and QuoteFormModal", () => {
    it("has all 14 form fields (9 required + 5 optional)", () => {
      render(<Contact />);

      const form = document.querySelector("form")!;
      const inputs = form.querySelectorAll("input, select, textarea");

      // 14 form fields: companyName, name, phone, email, siteAddress, siteSuburb,
      // sitePostcode, balustradeHeight, buildingType, location, protectingFall,
      // totalLinealMetres, requiredDate, otherNotes
      const fieldNames = Array.from(inputs).map((el) => el.getAttribute("name")).filter(Boolean);
      expect(fieldNames).toContain("companyName");
      expect(fieldNames).toContain("name");
      expect(fieldNames).toContain("phone");
      expect(fieldNames).toContain("email");
      expect(fieldNames).toContain("siteAddress");
      expect(fieldNames).toContain("siteSuburb");
      expect(fieldNames).toContain("sitePostcode");
      expect(fieldNames).toContain("balustradeHeight");
      expect(fieldNames).toContain("buildingType");
      expect(fieldNames).toContain("location");
      expect(fieldNames).toContain("protectingFall");
      expect(fieldNames).toContain("totalLinealMetres");
      expect(fieldNames).toContain("requiredDate");
      expect(fieldNames).toContain("otherNotes");
      expect(fieldNames).toHaveLength(14);
    });
  });

  describe("Form submission", () => {
    it("submits form data correctly with all fields populated", async () => {
      render(<Contact />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId("mock-recaptcha"));

      await user.type(screen.getByLabelText(/company name/i), "Test Co");
      await user.type(screen.getByLabelText(/your name/i), "John Doe");
      await user.type(screen.getByLabelText(/^phone/i), "0211234567");
      await user.type(screen.getByLabelText(/^email/i), "john@example.com");
      await user.type(screen.getByLabelText(/site address/i), "123 Test St");
      await user.type(screen.getByLabelText(/site suburb/i), "Auckland");
      await user.type(screen.getByLabelText(/postcode/i), "1010");
      await user.type(screen.getByLabelText(/balustrade height/i), "1.2m");
      await user.selectOptions(screen.getByLabelText(/building type/i), "Residential");
      await user.selectOptions(screen.getByLabelText(/^location/i), "Exterior");
      await user.selectOptions(screen.getByLabelText(/protecting fall/i), "Yes, balustrading IS preventing a fall");
      await user.type(screen.getByLabelText(/total lineal metres/i), "15m");
      await user.type(screen.getByLabelText(/when do you expect/i), "March 2026");
      await user.type(screen.getByLabelText(/other notes/i), "Test notes");

      await user.click(screen.getByRole("button", { name: /submit quote request/i }));

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);

      expect(body.name).toBe("John Doe");
      expect(body.phone).toBe("0211234567");
      expect(body.email).toBe("john@example.com");
      expect(body.captchaToken).toBe("test-token");
      expect(body.message).toContain("Company Name: Test Co");
      expect(body.message).toContain("Site Address: 123 Test St");
      expect(body.message).toContain("Site Suburb: Auckland");
      expect(body.message).toContain("Postcode: 1010");
      expect(body.message).toContain("Balustrade Height: 1.2m");
      expect(body.message).toContain("Building Type: Residential");
      expect(body.message).toContain("Location: Exterior");
      expect(body.message).toContain("Protecting Fall: Yes, balustrading IS preventing a fall");
      expect(body.message).toContain("Total Lineal Metres: 15m");
      expect(body.message).toContain("Required Date: March 2026");
      expect(body.message).toContain("Other Notes: Test notes");

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Quote request sent!" })
      );
    });
  });
});
