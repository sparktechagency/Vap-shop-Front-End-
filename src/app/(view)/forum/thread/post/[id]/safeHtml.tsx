// components/core/SafeHtml.tsx
"use client";

import DOMPurify from "dompurify";

export default function SafeHtml({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);

  return (
    <article
      className="text-xs md:text-sm lg:text-base text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
