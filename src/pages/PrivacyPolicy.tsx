import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FixedContactButtons from "@/components/FixedContactButtons";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navigation />
      <FixedContactButtons />
      <main className="bg-background text-foreground">
        <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Balustrading Concepts Limited &mdash; Last updated: 24th February 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Balustrading Concepts Limited ("we", "us", "our") respects your privacy and is committed to protecting
              your personal information in accordance with the Privacy Act 2020 (New Zealand).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              This Privacy Policy explains how we collect, use, store, and disclose personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-3">We may collect personal information including:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Physical address / site address</li>
              <li>Project details and measurements</li>
              <li>Billing and payment information</li>
              <li>Any information you provide when requesting a quote or engaging our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">3. How We Collect Information</h2>
            <p className="text-muted-foreground mb-3">We collect information when you:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Contact us via our website, email, phone, or in person</li>
              <li>Request a quote or site measurement</li>
              <li>Engage us to supply or install balustrades</li>
              <li>Make payments or receive invoices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-3">We use personal information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide quotes and estimates</li>
              <li>Carry out site measurements</li>
              <li>Supply and install balustrades</li>
              <li>Communicate about your project</li>
              <li>Invoice and receive payment</li>
              <li>Meet legal and regulatory obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Disclosure of Information</h2>
            <p className="text-muted-foreground mb-3">
              We may share your information only where necessary, including with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Employees and contractors involved in your project</li>
              <li>Suppliers and manufacturers</li>
              <li>Professional advisers (e.g. accountants)</li>
              <li>Authorities where required by law</li>
            </ul>
            <p className="text-muted-foreground mt-3">We do not sell personal information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable steps to protect personal information from loss, misuse, or unauthorised access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Access and Correction</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to request access to, or correction of, your personal information. Requests can be
              made by contacting us using the details below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground font-medium">Balustrading Concepts Limited</p>
            <p className="text-muted-foreground">Email: admin@balustrading.co.nz</p>
            <p className="text-muted-foreground">Phone: 09 828 8858</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
