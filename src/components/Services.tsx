import { Building2, Home, Wrench, Shield, Ruler, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Balustrading",
      description: "Custom glass balustrading solutions for homes, balconies, and staircases.",
      link: "/residential-balustrading",
    },
    {
      icon: Waves,
      title: "Pool Fencing",
      description: "Safety-compliant pool fencing solutions for residential and commercial properties.",
      link: "/pool-fencing",
    },
    {
      icon: Building2,
      title: "Commercial Projects",
      description: "Large-scale installations for offices, shopping centers, and public spaces.",
      link: "/commercial-projects",
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
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive glass balustrading solutions for every need
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const ServiceCard = (
              <div
                className={`bg-card p-8 transition-all duration-300 hover:shadow-xl border border-border ${
                  service.link ? "cursor-pointer group" : ""
                }`}
              >
                <div className="mb-6">
                  <Icon className={`w-14 h-14 text-primary ${service.link ? "group-hover:scale-110 transition-transform" : ""}`} />
                </div>
                <h3 className={`text-2xl font-bold text-card-foreground mb-4 ${service.link ? "group-hover:text-primary transition-colors" : ""}`}>
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
              <Link key={index} to={service.link}>
                {ServiceCard}
              </Link>
            ) : (
              <div key={index}>{ServiceCard}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
