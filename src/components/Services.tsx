import { Fence, Fan, Wrench, Shield, Ruler, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Fence,
      title: "Balustrades",
      description: "Custom glass and aluminium balustrading for residential and commercial projects.",
      link: "/balustrades",
    },
    {
      icon: Waves,
      title: "Pool Fences",
      description: "Safety-compliant glass pool fencing for residential and commercial properties.",
      link: "/pool-fencing",
    },
    {
      icon: Fan,
      title: "Heat Pump Covers",
      description: "Premium aluminium covers that conceal and protect your heat pump in style.",
      link: "/heat-pump-covers",
    },
    {
      icon: Ruler,
      title: "Custom Design",
      description: "Bespoke designs tailored to your specific requirements and vision.",
    },
    {
      icon: Wrench,
      title: "Professional Installation",
      description: "Expert installation by certified professionals with attention to detail.",
    },
    {
      icon: Shield,
      title: "Safety Compliance",
      description: "All installations meet New Zealand building codes and safety standards.",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Comprehensive glass balustrading solutions for every need
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const ServiceCard = (
              <div
                className={`bg-card p-8 transition-all duration-300 border border-border h-full flex flex-col ${
                  service.link ? "cursor-pointer group hover:shadow-xl" : ""
                }`}
              >
                <div className="mb-6">
                  <Icon className={`w-14 h-14 text-primary ${service.link ? "group-hover:scale-110 transition-transform" : ""}`} />
                </div>
                <h3 className={`text-2xl font-bold text-card-foreground mb-4 ${service.link ? "group-hover:text-primary transition-colors" : ""}`}>
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {service.description}
                </p>
                {service.link && (
                  <div className="mt-4 text-primary font-medium group-hover:underline">
                    Learn more →
                  </div>
                )}
              </div>
            );

            return service.link ? (
              <Link key={index} to={service.link} className="h-full">
                {ServiceCard}
              </Link>
            ) : (
              <div key={index} className="h-full">{ServiceCard}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
