import { useState } from "react";
import sitewiseBadge from "@/assets/sitewise-green-2026.jpg";
import unexBadge from "@/assets/unex-authorised-fabricator.jpg";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import TermsOfTradeModal from "./TermsOfTradeModal";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer className="bg-footer-bg text-footer-text">
        {/* Certification Badges */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center gap-6 md:gap-10">
            <img
              src={unexBadge}
              alt="UNEX Authorised Fabricator"
              className="h-16 md:h-20 w-auto"
            />
            <img
              src={sitewiseBadge}
              alt="SiteWise Green 2026/27 - Powered by Site Safe"
              className="h-20 md:h-24 w-auto"
            />
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-footer-text/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-footer-text/60">
              <p>&copy; {currentYear} Balustrading Concepts. All rights reserved.</p>
              <div className="flex gap-6">
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setTermsOpen(true)}
                  className="hover:text-primary transition-colors duration-300"
                >
                  Terms of Trade
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsOfTradeModal open={termsOpen} onOpenChange={setTermsOpen} />
    </>
  );
};

export default Footer;
