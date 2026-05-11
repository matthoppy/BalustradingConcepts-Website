import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "./ui/use-toast";

const Contact = () => {
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
    <section id="contact" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Ready to transform your space? Contact us for a free consultation and quote
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <a
                      href="tel:0982888858"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      09 828 8858
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <a
                      href="mailto:admin@balustrading.co.nz"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      admin@balustrading.co.nz
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Location</h4>
                    <p className="text-muted-foreground">
                      661a Rosebank Road<br />
                      Auckland, New Zealand
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary p-8">
              <h4 className="text-xl font-bold text-foreground mb-4">Office Hours</h4>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-semibold text-foreground">Monday - Friday:</span> 7:00 AM - 1:00 PM</p>
                <p><span className="font-semibold text-foreground">Weekends:</span> Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-secondary p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Request A Quote</h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

              {/* Building Type and Location */}
              <div className="grid sm:grid-cols-2 gap-4">
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
                    <option value="">Select type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Pool Fence">Pool Fence</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
                    Location <span className="text-red-500">*</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
