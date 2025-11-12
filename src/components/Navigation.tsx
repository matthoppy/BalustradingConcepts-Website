import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Home, Waves, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Contact", href: "/#contact" },
  ];

  const serviceItems = [
    { label: "Residential Balustrading", href: "/residential-balustrading", icon: Home },
    { label: "Pool Fencing", href: "/pool-fencing", icon: Waves },
    { label: "Commercial Projects", href: "/commercial-projects", icon: Building2 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} alt="Balustrading Concepts NZ Ltd" className="h-16 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-300 font-medium">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <div className="bg-background border border-border shadow-xl rounded-md">
                    <div className="flex gap-4 p-6">
                      {serviceItems.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.label}
                            to={service.href}
                            className="flex flex-col items-center gap-3 px-6 py-4 text-center hover:bg-secondary rounded-md transition-colors duration-200 group min-w-[180px]"
                          >
                            <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {service.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Get Quote Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild>
              <a href="/#contact">Get a Free Quote</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-border">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-3 text-foreground hover:text-primary transition-colors duration-300 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {/* Services Submenu */}
            <div className="py-3">
              <div className="font-medium text-foreground mb-2">Services</div>
              <div className="pl-4 space-y-2">
                {serviceItems.map((service) => (
                  <Link
                    key={service.label}
                    to={service.href}
                    className="block py-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <Button asChild className="mt-3">
              <a href="/#contact">Get a Free Quote</a>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
