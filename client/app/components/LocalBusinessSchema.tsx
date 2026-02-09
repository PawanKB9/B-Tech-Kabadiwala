export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "B Tech Kabadiwala",
          "url": "https://btechkabadiwala.in",
          "telephone": "+91-7518315870",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kanpur",
            "addressRegion": "UP",
            "addressCountry": "IN",
          },
          "areaServed": "Kanpur",
          "sameAs": [],
        }),
      }}
    />
  );
}
