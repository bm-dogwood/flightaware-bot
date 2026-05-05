// Drop-in component for any page that needs to inject JSON-LD schemas.
// Usage: <JsonLd schemas={[buildFAQSchema(faqs), buildBreadcrumbSchema(crumbs)]} />

interface JsonLdProps {
  /** One or more JSON-LD schema objects (plain JS objects — serialisation is handled internally). */
  schemas: object | object[]
}

export function JsonLd({ schemas }: JsonLdProps) {
  const payload = Array.isArray(schemas) ? schemas : [schemas]
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
