import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.balustrading.co.nz";
const SITE_NAME = "Balustrading Concepts NZ";

interface SeoProps {
  title: string;
  description: string;
  /** Path for the canonical URL, e.g. "/balustrades". Defaults to current path. */
  path?: string;
  noindex?: boolean;
  /** Optional page-specific JSON-LD structured data */
  jsonLd?: object;
}

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const Seo = ({ title, description, path, noindex, jsonLd }: SeoProps) => {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${path ?? location.pathname}`;

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-jsonld";
      document.getElementById("page-jsonld")?.remove();
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonicalUrl, noindex, JSON.stringify(jsonLd)]);

  return null;
};

export const serviceJsonLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: `${SITE_URL}${path}`,
  areaServed: { "@type": "City", name: "Auckland" },
  provider: {
    "@type": "HomeAndConstructionBusiness",
    name: "Balustrading Concepts NZ Ltd",
    url: SITE_URL,
    telephone: "+64-9-828-8858",
  },
});

export default Seo;
