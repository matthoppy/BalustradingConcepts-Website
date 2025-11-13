import { CheckCircle } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";
import aboutImage2 from "@/assets/about-image-2.jpg";
import aboutImage3 from "@/assets/about-image-3.jpg";

const About = () => {
  const features = [
    "Over 15 years of industry experience",
    "Family owned and operated",
    "Premium quality materials",
    "Expert installation team",
    "10 year warranty on materials",
    "5 year warranty on workmanship",
  ];

  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase">
              About Balustrading Concepts NZ
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At Balustrading Concepts NZ, we specialise in the design, manufacture, and installation of premium glass and aluminium balustrades, fencing, and gates throughout Auckland.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              With over a decade of experience, our expert team has worked with hundreds of residential and commercial clients, delivering solutions that combine style, strength, and safety. Whether you need a modern glass balustrade for your balcony, a custom sliding driveway gate, or a compliant pool fence, we provide tailored products that suit your exact needs and meet all NZ building standards.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our commitment to quality craftsmanship, innovative design, and reliable installation has made us one of Auckland's most trusted balustrading companies. Every project – from a private home to a large commercial development – is handled with precision and care, ensuring a result that looks exceptional and lasts for years to come.
            </p>
            
            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 gap-4">
            <img
              src={aboutImage}
              alt="Quality glass balustrading craftsmanship"
              className="w-full h-[280px] object-cover shadow-lg rounded-lg"
            />
            <img
              src={aboutImage3}
              alt="Modern glass balustrading installation"
              className="w-full h-[280px] object-cover shadow-lg rounded-lg"
            />
            <img
              src={aboutImage2}
              alt="Aluminium deck balustrading installation example"
              className="w-full h-[280px] object-cover shadow-lg rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
