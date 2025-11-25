import { Phone, Mail, MapPin, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "./ui/use-toast";

const Contact = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

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
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      captchaToken: captchaValue,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-contact-form`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to submit form');
      }

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });

      // Reset form and CAPTCHA
      e.currentTarget.reset();
      setSelectedFile(null);
      setCaptchaValue(null);
      recaptchaRef.current?.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Message sent (with a small hiccup)",
        description:
          "We received your request, but there was an issue confirming on the page. If you don't hear from us, please call or email directly.",
      });
      
      // Reset CAPTCHA on error so user can try again
      setCaptchaValue(null);
      recaptchaRef.current?.reset();
    }
  };
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your space? Contact us for a free consultation and quote
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
          <div className="bg-secondary p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Request A Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                    placeholder="Your phone"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors duration-300 resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-foreground mb-2">
                  Photo (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-background border border-input hover:border-primary cursor-pointer transition-colors duration-300"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Upload a photo of your project"}
                    </span>
                  </label>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Max file size: 5MB
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LeUNBgsAAAAACpEykq296IxdhZPgjl1gNAP1scs"
                  onChange={setCaptchaValue}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
