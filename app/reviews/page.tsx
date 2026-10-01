import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bits";
import { CheckIcon, StarIcon } from "@/components/Icons";
import { AGGREGATE_RATING, REVIEWS, REVIEW_LINK, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "What customers in Grantham say about MB Plumber.",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

const sorted = [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/logo.png`,
  telephone: SITE.phone,
  ...(AGGREGATE_RATING && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: AGGREGATE_RATING.ratingValue,
      reviewCount: AGGREGATE_RATING.reviewCount,
      bestRating: 5,
    },
  }),
  review: sorted.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    datePublished: r.date,
    reviewBody: r.text,
    ...(r.rating && { reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 } }),
  })),
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero eyebrow="Reviews" title="What our customers say" intro="Honest feedback from people we've worked for around Grantham." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        {sorted.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/20 p-10 text-center">
            <h2 className="heading mb-3 text-2xl">Reviews coming soon</h2>
            <p className="font-medium text-white/65">Used MB Plumber? We&apos;d love to hear how we did.</p>
          </div>
        ) : (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((r) => (
                <figure key={r.name + r.date} className="flex flex-col rounded-2xl border border-white/10 bg-ink-soft p-7">
                  {r.rating ? (
                    <div className="mb-4 flex gap-1 text-brand" aria-label={`${r.rating} out of 5 stars`}>
                      {[...Array(r.rating)].map((_, k) => (
                        <StarIcon key={k} className="h-5 w-5" />
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-brand px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                      <CheckIcon className="h-3.5 w-3.5" /> Recommended{r.source ? ` on ${r.source}` : ""}
                    </div>
                  )}
                  <blockquote className="flex-1 font-medium leading-relaxed text-white/85">“{r.text}”</blockquote>
                  <figcaption className="mt-5 text-sm font-extrabold">
                    {r.name}
                    <span className="block text-xs font-semibold uppercase tracking-wider text-white/50">{fmt(r.date)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {REVIEW_LINK && (
              <div className="mt-12 text-center">
                <a href={REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Read more or leave a review on Facebook
                </a>
              </div>
            )}
          </>
        )}
      </section>
      <CtaBand />
    </>
  );
}
