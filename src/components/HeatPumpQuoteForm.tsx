import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useToast } from "./ui/use-toast";

const TURNSTILE_SITE_KEY = "0x4AAAAAADOAJJhmHWvuf7PX";

const HeatPumpQuoteForm = () => {
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
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
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      style: formData.get("style") as string,
      colour: formData.get("colour") as string,
      quantity: formData.get("quantity") as string,
      unitWidth: formData.get("unitWidth") as string,
      unitDepth: formData.get("unitDepth") as string,
      unitHeight: formData.get("unitHeight") as string,
      knownSize: formData.get("knownSize") as string,
      siteAddress: formData.get("siteAddress") as string,
      siteSuburb: formData.get("siteSuburb") as string,
      sitePostcode: formData.get("sitePostcode") as string,
      otherNotes: formData.get("otherNotes") as string,
    };

    const message = `
HEAT PUMP COVER ENQUIRY

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}

Style: ${data.style}
Powdercoat Colour: ${data.colour || "N/A"}
Quantity: ${data.quantity || "1"}

Heat Pump Unit Dimensions (W x D x H):
  Width: ${data.unitWidth ? `${data.unitWidth} mm` : "N/A"}
  Depth: ${data.unitDepth ? `${data.unitDepth} mm` : "N/A"}
  Height: ${data.unitHeight ? `${data.unitHeight} mm` : "N/A"}
Known cover size (if applicable): ${data.knownSize || "N/A"}

Site Address: ${data.siteAddress || "N/A"}
Site Suburb: ${data.siteSuburb || "N/A"}
Postcode: ${data.sitePostcode || "N/A"}

Other Notes: ${data.otherNotes || "N/A"}
    `.trim();

    try {
      const response = await fetch("/api/submit-contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          message,
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
        console.error("Form submit response not OK:", result || response.statusText);
        toast({
          title: "Couldn't send your request",
          description: result?.error || "Please try again, or call us directly.",
          variant: "destructive",
        });
        setCaptchaValue(null);
        turnstileRef.current?.reset();
        return;
      }

      toast({
        title: "Quote request sent!",
        description: "We'll get back to you soon to confirm your heat pump cover.",
      });

      formRef.current?.reset();
      setCaptchaValue(null);
      turnstileRef.current?.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Couldn't send your request",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
      setCaptchaValue(null);
      turnstileRef.current?.reset();
    }
  };

  const inputClass =
    "w-full px-4 py-2 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Contact details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hp-name" className="block text-sm font-medium text-foreground mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input type="text" id="hp-name" name="name" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="hp-phone" className="block text-sm font-medium text-foreground mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input type="tel" id="hp-phone" name="phone" required className={inputClass} placeholder="Your phone number" />
        </div>
      </div>

      <div>
        <label htmlFor="hp-email" className="block text-sm font-medium text-foreground mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input type="email" id="hp-email" name="email" required className={inputClass} placeholder="your@email.com" />
      </div>

      {/* Style and Colour */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hp-style" className="block text-sm font-medium text-foreground mb-1">
            Cover Style <span className="text-red-500">*</span>
          </label>
          <select id="hp-style" name="style" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a style
            </option>
            <option value="Asko">Asko — great value</option>
            <option value="Chatham">Chatham — premium, minimal visibility</option>
            <option value="Futuna">Futuna — no-toehold, maximum security</option>
            <option value="Not sure">Not sure — please advise</option>
          </select>
        </div>
        <div>
          <label htmlFor="hp-colour" className="block text-sm font-medium text-foreground mb-1">
            Powdercoat Colour
          </label>
          <input
            type="text"
            id="hp-colour"
            name="colour"
            className={inputClass}
            placeholder="Dulux colour (25 standard options)"
          />
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="hp-quantity" className="block text-sm font-medium text-foreground mb-1">
          Quantity
        </label>
        <input type="number" min="1" id="hp-quantity" name="quantity" className={inputClass} placeholder="1" />
      </div>

      {/* Sizing */}
      <div className="bg-primary/10 border-l-4 border-primary p-4">
        <h4 className="font-bold text-foreground mb-2">How to size your cover</h4>
        <p className="text-muted-foreground text-sm mb-2">
          Measure your heat pump / AC unit (Width x Depth x Height), including any pipework and mounting blocks.
          We add the required clearances for you:
        </p>
        <ul className="text-muted-foreground text-sm list-disc pl-5 space-y-1">
          <li>Width: minimum +130 mm</li>
          <li>Depth: minimum +90 mm</li>
          <li>Height: minimum +20 mm</li>
          <li>Allow 100 mm from the back of the cover to the wall (or as recommended by the unit manufacturer)</li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="hp-width" className="block text-sm font-medium text-foreground mb-1">
            Unit Width (mm)
          </label>
          <input type="number" min="0" id="hp-width" name="unitWidth" className={inputClass} placeholder="e.g. 800" />
        </div>
        <div>
          <label htmlFor="hp-depth" className="block text-sm font-medium text-foreground mb-1">
            Unit Depth (mm)
          </label>
          <input type="number" min="0" id="hp-depth" name="unitDepth" className={inputClass} placeholder="e.g. 300" />
        </div>
        <div>
          <label htmlFor="hp-height" className="block text-sm font-medium text-foreground mb-1">
            Unit Height (mm)
          </label>
          <input type="number" min="0" id="hp-height" name="unitHeight" className={inputClass} placeholder="e.g. 600" />
        </div>
      </div>

      <div>
        <label htmlFor="hp-known-size" className="block text-sm font-medium text-foreground mb-1">
          Known cover size (optional)
        </label>
        <input
          type="text"
          id="hp-known-size"
          name="knownSize"
          className={inputClass}
          placeholder="If you already know the standard/custom size you need"
        />
      </div>

      {/* Site address */}
      <div>
        <label htmlFor="hp-address" className="block text-sm font-medium text-foreground mb-1">
          Site Address
        </label>
        <input type="text" id="hp-address" name="siteAddress" className={inputClass} placeholder="Number & Street Name" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hp-suburb" className="block text-sm font-medium text-foreground mb-1">
            Site Suburb
          </label>
          <input type="text" id="hp-suburb" name="siteSuburb" className={inputClass} placeholder="Suburb" />
        </div>
        <div>
          <label htmlFor="hp-postcode" className="block text-sm font-medium text-foreground mb-1">
            Postcode
          </label>
          <input type="text" id="hp-postcode" name="sitePostcode" className={inputClass} placeholder="Postcode" />
        </div>
      </div>

      <div>
        <label htmlFor="hp-notes" className="block text-sm font-medium text-foreground mb-1">
          Other Notes
        </label>
        <textarea
          id="hp-notes"
          name="otherNotes"
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Anything else we should know (mounting, access, timeframe...)"
        ></textarea>
      </div>

      {/* Cloudflare Turnstile */}
      <div className="flex justify-center">
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setCaptchaValue}
          onError={() => setCaptchaValue(null)}
          onExpire={() => setCaptchaValue(null)}
        />
      </div>

      <Button type="submit" className="w-full">
        Request Heat Pump Cover Quote
      </Button>
    </form>
  );
};

export default HeatPumpQuoteForm;
