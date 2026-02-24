import { Link } from "react-router-dom";
import sitewiseBadge from "@/assets/sitewise-green-2026.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer-bg text-footer-text">
      {/* SiteWise Badge */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center">
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
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <a href="#" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
