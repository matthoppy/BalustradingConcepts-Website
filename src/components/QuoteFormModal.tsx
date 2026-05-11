import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface QuoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuoteFormModal = ({ open, onOpenChange }: QuoteFormModalProps) => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      toast({
        title: "Verification required",
        description: "Please complete the CAPTCHA",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      companyName: formData.get('companyName') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      siteAddress: formData.get('siteAddress') as string,
      siteSuburb: formData.get('siteSuburb') as string,
      sitePostcode: formData.get('sitePostcode') as string,
      balustradeHeight: formData.get('balustradeHeight') as string,
      buildingType: formData.get('buildingType') as string,
      location: formData.get('location') as string,
      protectingFall: formData.get('protectingFall') as string,
      totalLinealMetres: formData.get('totalLinealMetres') as string,
      requiredDate: formData.get('requiredDate') as string,
      otherNotes: formData.get('otherNotes') as string,
      captchaToken: captchaValue,
    };

    // Build message string for the email
    const message = `
Company Name: ${data.companyName || 'N/A'}
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Site Address: ${data.siteAddress}
Site Suburb: ${data.siteSuburb}
Postcode: ${data.sitePostcode}
Balustrade Height: ${data.balustradeHeight || 'N/A'}
Building Type: ${data.buildingType}
Location: ${data.location}
Protecting Fall: ${data.protectingFall}
Total Lineal Metres: ${data.totalLinealMetres || 'N/A'}
Required Date: ${data.requiredDate || 'N/A'}
Other Notes: ${data.otherNotes || 'N/A'}
    `.trim();

    try {
      const response = await fetch('/api/submit-contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message: message,
          captchaToken: captchaValue,
        }),
      });

      let result: { error?: string } | null = null;
      try {
        result = await response.json();
      } catch {
        // ignore JSON parse issues
      }

      if (!response.ok) {
        console.error('Form submit response not OK:', result || response.statusText);
        toast({
          title: "Couldn't send your request",
          description: result?.error || "Please try again, or call us directly.",
          variant: "destructive",
        });
        setCaptchaValue(null);
        recaptchaRef.current?.reset();
        return;
      }

      toast({
        title: "Quote request sent!",
        description: "We'll get back to you soon.",
      });

      formRef.current?.reset();
      setCaptchaValue(null);
      recaptchaRef.current?.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Couldn't send your request",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      setCaptchaValue(null);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Request A Quote</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="Company name (if applicable)"
            />
          </div>

          {/* Name and Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="your@email.com"
            />
          </div>

          {/* Site Address */}
          <div>
            <label htmlFor="siteAddress" className="block text-sm font-medium text-foreground mb-1">
              Site Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="siteAddress"
              name="siteAddress"
              required
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="Number & Street Name"
            />
          </div>

          {/* Site Suburb and Town/City */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="siteSuburb" className="block text-sm font-medium text-foreground mb-1">
                Site Suburb <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="siteSuburb"
                name="siteSuburb"
                required
                className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                placeholder="Suburb"
              />
            </div>
            <div>
              <label htmlFor="sitePostcode" className="block text-sm font-medium text-foreground mb-1">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sitePostcode"
                name="sitePostcode"
                required
                className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                placeholder="Postcode"
              />
            </div>
          </div>

          {/* Balustrade Height */}
          <div>
            <label htmlFor="balustradeHeight" className="block text-sm font-medium text-foreground mb-1">
              Balustrade Height
            </label>
            <input
              type="text"
              id="balustradeHeight"
              name="balustradeHeight"
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="e.g. 1m, 1.1m, 1.2m..."
            />
          </div>

          {/* Building Type */}
          <div>
            <label htmlFor="buildingType" className="block text-sm font-medium text-foreground mb-1">
              Building Type <span className="text-red-500">*</span>
            </label>
            <select
              id="buildingType"
              name="buildingType"
              required
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
            >
              <option value="">Select building type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Pool Fence">Pool Fence</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location within Building */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
              Location within Building <span className="text-red-500">*</span>
            </label>
            <select
              id="location"
              name="location"
              required
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
            >
              <option value="">Select location</option>
              <option value="Exterior">Exterior</option>
              <option value="Internal">Internal</option>
            </select>
          </div>

          {/* Protecting Fall */}
          <div>
            <label htmlFor="protectingFall" className="block text-sm font-medium text-foreground mb-1">
              Protecting Fall <span className="text-red-500">*</span>
            </label>
            <select
              id="protectingFall"
              name="protectingFall"
              required
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
            >
              <option value="">Select option</option>
              <option value="Yes, balustrading IS preventing a fall">Yes, balustrading IS preventing a fall</option>
              <option value="No, balustrading is NOT preventing a fall">No, balustrading is NOT preventing a fall</option>
            </select>
          </div>

          {/* Total Lineal Metres */}
          <div>
            <label htmlFor="totalLinealMetres" className="block text-sm font-medium text-foreground mb-1">
              Total Lineal Metres
            </label>
            <input
              type="text"
              id="totalLinealMetres"
              name="totalLinealMetres"
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="e.g. 10m, 15m..."
            />
          </div>

          {/* Required Date */}
          <div>
            <label htmlFor="requiredDate" className="block text-sm font-medium text-foreground mb-1">
              When do you expect the balustrade to be required?
            </label>
            <input
              type="text"
              id="requiredDate"
              name="requiredDate"
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
              placeholder="Enter the month and year"
            />
          </div>

          {/* Other Notes */}
          <div>
            <label htmlFor="otherNotes" className="block text-sm font-medium text-foreground mb-1">
              Other Notes
            </label>
            <textarea
              id="otherNotes"
              name="otherNotes"
              rows={3}
              className="w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300 resize-none"
              placeholder="Any additional information..."
            ></textarea>
          </div>

          {/* ReCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeUNBgsAAAAACpEykq296IxdhZPgjl1gNAP1scs"
              onChange={setCaptchaValue}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteFormModal;
