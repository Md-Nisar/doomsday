interface JsonLdProps {
  data: object
}

/**
 * Renders a schema.org JSON-LD `<script>` tag. `<` is escaped so the data
 * can never prematurely close the script element.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
