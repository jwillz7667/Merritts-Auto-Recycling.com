# Content verification required before production launch

This file separates confirmed facts from claims that require owner records or explicit approval. Unverified items are not stated unconditionally on the rebuilt public pages.

## Confirmed and implemented

| Item           | Implemented value                                        | Source                                |
| -------------- | -------------------------------------------------------- | ------------------------------------- |
| Business name  | Merritt's Auto Recycling                                 | Owner prompt / existing entity record |
| Call number    | 763-533-2775                                             | Owner prompt / existing record        |
| Text number    | 763-438-2116                                             | Existing entity record                |
| Email          | merrittsautorecycling@gmail.com                          | Existing entity record                |
| Address        | 3106 68th Ave N, Brooklyn Center, MN 55429               | Existing entity record                |
| Hours          | Every day, 8:00 AM–8:00 PM                               | Direct owner correction               |
| Founder        | Brad Emholtz                                             | Owner-supplied immutable information  |
| Founded        | 1988                                                     | Owner-supplied immutable information  |
| Canonical site | https://merritts-auto-recycling.com                      | Owner prompt / existing site          |
| Google profile | `https://share.google/V9RTL8Y2wxrYL6PS8`                 | Existing entity record                |
| Facebook       | `https://www.facebook.com/profile.php?id=61565403974405` | Existing entity record                |

## P0: must verify before launch

| Claim or system          | Evidence/decision needed                                                           | Current treatment                                     |
| ------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Photo rights             | Confirm Merritt's has continuing commercial rights to the selected old-site images | Images used in review build only; provenance recorded |
| Resend sender            | Confirm sending domain/address is verified and recipient inbox is correct          | Environment-gated                                     |
| Turnstile                | Confirm production hostname and keys                                               | Form disabled when site key is absent                 |
| Contact consent language | Owner/legal review for phone, SMS, and email follow-up language                    | Conservative consent checkbox included                |
| Privacy retention        | Decide an operational retention period and deletion process                        | Uses “reasonably needed” language                     |
| Production branch        | Confirm which branch Vercel should track after maintenance ends                    | Refactor remains off production                       |

## P1: verify before publishing as facts

| Potential claim                                                | Needed proof                                                                             | Public status                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Licensed Minnesota auto recycler                               | Current license record and exact license name/number                                     | Omitted                                                 |
| Insured towing/salvage operation                               | Current policy confirmation and approved wording                                         | Omitted                                                 |
| Family-owned or owner-operated                                 | Owner approval of precise description                                                    | Omitted                                                 |
| Cash paid at pickup                                            | Current payment process, legal/compliance approval, exceptions                           | Site says “cash offer,” not payment timing              |
| Removal/towing has no charge                                   | Current policy, service area, and exceptions                                             | No free-towing promise                                  |
| Same-day pickup                                                | Dispatch evidence and approved qualification                                             | Explicitly not promised                                 |
| Vehicles without title accepted                                | Exact ownership/document rules and exceptions                                            | Explicitly not guaranteed                               |
| Cars, trucks, vans, SUVs, RVs, buses, tractors, farm equipment | Current acquisition list and equipment limits                                            | Public examples limited to cars, trucks, vans, SUVs     |
| Environmental process                                          | Actual downstream partners, permits, fluid handling, and approved percentage methodology | General education only; no business-specific percentage |
| Service outside Brooklyn Center/Minneapolis                    | Current dispatch boundary and unique local proof                                         | Call-to-confirm only; no dedicated page                 |
| Pickup at the business address                                 | Confirm whether customers may arrive without appointment                                 | Address shown; no walk-in instruction                   |

## Reviews and reputation

The legacy repository contains eight testimonials and a 5.0/8 aggregate-rating record. Before any excerpt is restored, document:

- original platform and direct URL
- reviewer display name exactly as published
- original date
- permission or a policy basis for republication
- confirmation that wording is unedited or that edits are disclosed
- a current check that the review still exists

Until then, `/reviews` links to the live Google profile and no Review or aggregateRating schema is emitted.

## Local area expansion gate

Add a new city page only when all are true:

1. The owner confirms current service availability.
2. The page contains unique operational context, not swapped city names.
3. The business can explain access, scheduling, or local proof specific to that area.
4. The page does not imply a staffed location or office that does not exist.
5. The redirect and keyword maps are updated.

Saint Paul is not confirmed and has no dedicated page.

## Owner sign-off

Record the reviewer, date, evidence link, and approved wording next to each item that is cleared. Do not mark the file complete based on an assumption or a competitor's wording.
