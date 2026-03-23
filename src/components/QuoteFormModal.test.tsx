import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuoteFormModal from "./QuoteFormModal";

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

describe("QuoteFormModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  const renderModal = () => {
    const onOpenChange = vi.fn();
    render(<QuoteFormModal open={true} onOpenChange={onOpenChange} />);
    return { onOpenChange };
  };

  describe("Form fields are present", () => {
    it("renders all required fields", () => {
      renderModal();

      // Required text inputs
      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your name/i)).toBeRequired();

      expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^phone/i)).toBeRequired();

      expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email/i)).toBeRequired();

      expect(screen.getByLabelText(/site address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/site address/i)).toBeRequired();

      expect(screen.getByLabelText(/site suburb/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/site suburb/i)).toBeRequired();

      expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/postcode/i)).toBeRequired();

      // Required select fields
      expect(screen.getByLabelText(/building type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/building type/i)).toBeRequired();

      expect(screen.getByLabelText(/location within building/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location within building/i)).toBeRequired();

      expect(screen.getByLabelText(/protecting fall/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/protecting fall/i)).toBeRequired();
    });

    it("renders all optional fields", () => {
      renderModal();

      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).not.toBeRequired();

      expect(screen.getByLabelText(/balustrade height/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/balustrade height/i)).not.toBeRequired();

      expect(screen.getByLabelText(/total lineal metres/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total lineal metres/i)).not.toBeRequired();

      expect(screen.getByLabelText(/when do you expect/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/when do you expect/i)).not.toBeRequired();

      expect(screen.getByLabelText(/other notes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/other notes/i)).not.toBeRequired();
    });

    it("renders correct input types", () => {
      renderModal();

      expect(screen.getByLabelText(/^email/i)).toHaveAttribute("type", "email");
      expect(screen.getByLabelText(/^phone/i)).toHaveAttribute("type", "tel");
      expect(screen.getByLabelText(/your name/i)).toHaveAttribute("type", "text");
    });

    it("renders building type dropdown with correct options", () => {
      renderModal();

      const select = screen.getByLabelText(/building type/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(5); // placeholder + 4 options
      expect(options[1]).toHaveTextContent("Residential");
      expect(options[2]).toHaveTextContent("Commercial");
      expect(options[3]).toHaveTextContent("Pool Fence");
      expect(options[4]).toHaveTextContent("Other");
    });

    it("renders location dropdown with correct options", () => {
      renderModal();

      const select = screen.getByLabelText(/location within building/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(3); // placeholder + 2 options
      expect(options[1]).toHaveTextContent("Exterior");
      expect(options[2]).toHaveTextContent("Internal");
    });

    it("renders protecting fall dropdown with correct options", () => {
      renderModal();

      const select = screen.getByLabelText(/protecting fall/i);
      const options = within(select).getAllByRole("option");

      expect(options).toHaveLength(3); // placeholder + 2 options
      expect(options[1]).toHaveTextContent("Yes, balustrading IS preventing a fall");
      expect(options[2]).toHaveTextContent("No, balustrading is NOT preventing a fall");
    });

    it("renders ReCAPTCHA", () => {
      renderModal();
      expect(screen.getByTestId("mock-recaptcha")).toBeInTheDocument();
    });

    it("renders submit button", () => {
      renderModal();
      expect(screen.getByRole("button", { name: /submit quote request/i })).toBeInTheDocument();
    });
  });

  describe("Form submission", () => {
    it("shows error toast when CAPTCHA is not completed", async () => {
      renderModal();
      const user = userEvent.setup();

      // Fill required fields but don't complete CAPTCHA
      await user.type(screen.getByLabelText(/your name/i), "John Doe");
      await user.type(screen.getByLabelText(/^phone/i), "0211234567");
      await user.type(screen.getByLabelText(/^email/i), "john@example.com");
      await user.type(screen.getByLabelText(/site address/i), "123 Test St");
      await user.type(screen.getByLabelText(/site suburb/i), "Auckland");
      await user.type(screen.getByLabelText(/postcode/i), "1010");
      await user.selectOptions(screen.getByLabelText(/building type/i), "Residential");
      await user.selectOptions(screen.getByLabelText(/location within building/i), "Exterior");
      await user.selectOptions(screen.getByLabelText(/protecting fall/i), "Yes, balustrading IS preventing a fall");

      // Submit without CAPTCHA
      await user.click(screen.getByRole("button", { name: /submit quote request/i }));

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Verification required",
          variant: "destructive",
        })
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("submits form with all fields when CAPTCHA is completed", async () => {
      const { onOpenChange } = renderModal();
      const user = userEvent.setup();

      // Complete CAPTCHA first
      await user.click(screen.getByTestId("mock-recaptcha"));

      // Fill all fields
      await user.type(screen.getByLabelText(/company name/i), "Test Co");
      await user.type(screen.getByLabelText(/your name/i), "John Doe");
      await user.type(screen.getByLabelText(/^phone/i), "0211234567");
      await user.type(screen.getByLabelText(/^email/i), "john@example.com");
      await user.type(screen.getByLabelText(/site address/i), "123 Test St");
      await user.type(screen.getByLabelText(/site suburb/i), "Auckland");
      await user.type(screen.getByLabelText(/postcode/i), "1010");
      await user.type(screen.getByLabelText(/balustrade height/i), "1.2m");
      await user.selectOptions(screen.getByLabelText(/building type/i), "Residential");
      await user.selectOptions(screen.getByLabelText(/location within building/i), "Exterior");
      await user.selectOptions(screen.getByLabelText(/protecting fall/i), "Yes, balustrading IS preventing a fall");
      await user.type(screen.getByLabelText(/total lineal metres/i), "15m");
      await user.type(screen.getByLabelText(/when do you expect/i), "March 2026");
      await user.type(screen.getByLabelText(/other notes/i), "Test notes");

      // Submit form
      await user.click(screen.getByRole("button", { name: /submit quote request/i }));

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const fetchCall = mockFetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

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
        expect.objectContaining({
          title: "Quote request sent!",
        })
      );
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("includes N/A for empty optional fields in message", async () => {
      renderModal();
      const user = userEvent.setup();

      // Complete CAPTCHA
      await user.click(screen.getByTestId("mock-recaptcha"));

      // Fill only required fields
      await user.type(screen.getByLabelText(/your name/i), "Jane Doe");
      await user.type(screen.getByLabelText(/^phone/i), "0211234567");
      await user.type(screen.getByLabelText(/^email/i), "jane@example.com");
      await user.type(screen.getByLabelText(/site address/i), "456 Main Rd");
      await user.type(screen.getByLabelText(/site suburb/i), "Wellington");
      await user.type(screen.getByLabelText(/postcode/i), "6011");
      await user.selectOptions(screen.getByLabelText(/building type/i), "Commercial");
      await user.selectOptions(screen.getByLabelText(/location within building/i), "Internal");
      await user.selectOptions(screen.getByLabelText(/protecting fall/i), "No, balustrading is NOT preventing a fall");

      await user.click(screen.getByRole("button", { name: /submit quote request/i }));

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.message).toContain("Company Name: N/A");
      expect(body.message).toContain("Balustrade Height: N/A");
      expect(body.message).toContain("Total Lineal Metres: N/A");
      expect(body.message).toContain("Required Date: N/A");
      expect(body.message).toContain("Other Notes: N/A");
    });
  });
});
