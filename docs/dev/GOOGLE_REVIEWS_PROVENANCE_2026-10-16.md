# Homepage Google review provenance

Verified October 16, 2026 against the public Google Maps listing for Merritt's Auto Recycling, 3106 68th Ave N, Brooklyn Center, MN 55429, telephone 763-533-2775. The listing links to the existing Merritt's website and the same knowledge-graph entity as the established Google Business Profile share link.

## Matched listing and rating

- [Google Maps listing](https://www.google.com/maps?cid=6884769659263131387)
- [Existing Business Profile share link](https://share.google/V9RTL8Y2wxrYL6PS8)
- Place ID: `ChIJ2Y_CI_Iws1IR-x7ELIedi18`
- Maps feature ID: `0x52b330f223c28fd9:0x5f8b9d872cc41efb`
- Maps CID: `6884769659263131387`
- Observed rating: **4.9 out of 5 from 54 reviews**
- Capture time: `2026-10-16T20:01:53.793744+00:00`
- SHA-256 of the captured public response: `9f8c7e94db945a8c22902a1d4adc8935521a4b4e27d4c8a16960b362084a1855`

The former `googleMaps` value used `10346311406139911893`. Google's response identifies that number as the Business Profile management ID; using it as the Maps CID opened a blank place panel. The site now uses the actual Maps CID. Its established share link remains valid.

## Review selection and publication

The public profile HTML exposes a Google Maps `/maps/preview/place` preload URL. Its unauthenticated HTTP 200 JSON response contains the matched business identity, rating/count, and five Google review records. Four short excerpts were selected from those records, totaling 55 quoted words. Names, stars, text, dates, reviewer-profile URLs and review permalinks come from that response. Review records were under JSON path `[6][175][9][0][0]`; the four selected records' inner review indices were 0, 1, 2 and 3.

`src/data/google-reviews.ts` preserves the exact excerpts, review IDs, source permalinks and publication dates. The displayed reviewers are Marc McShane, E W, Michael Spleiss and Joshua Reno. Each selected review has five stars. These are selected excerpts, not the complete review set or a claim that every review has five stars. Original punctuation and wording are retained. Month/year display avoids a UTC-versus-local-day discrepancy.

The homepage labels the quotations as excerpts, attributes each reviewer with a link to their Google profile, links to each full original review, and links to the complete business profile. Brief attributed quotations provide the relevant customer-experience context without reproducing whole reviews, profile photos or the complete feed. The overall rating and count are explicitly dated. This is a verified snapshot, not an automatically refreshed feed.

The eight testimonials and 5.0/8 rating in the old repository were not used: they lack Google provenance. No Review or aggregateRating structured data was added. Visible review excerpts on a business's own site do not establish eligibility for Google's self-serving review rich results.

## Refresh procedure and limits

Check the same listing's business identity, current rating/count and the continued existence of each source review before updating the snapshot. Preserve an exact short excerpt, author, original publication date and direct source link. Update the visible checked date alongside any rating/count change. Do not silently alter a customer's wording or reuse an old relative date as though it were current.

No API key, paid widget, sign-in, customer message, review posting or business response was needed. The limited browser view omitted individual reviews; its ordinary public preload response provided them. A separate Google Search request showed a challenge and was abandoned. Future public response availability is not guaranteed; failure to retrieve it is not permission to invent or silently refresh review data.
