# Content verification and current publication scope

Updated October 16, 2026. This register supersedes the August two-city publication restriction. The owner explicitly requested a real page for every listed service-area city and recovery of the historical destinations. That work is authorized; it does not require a second approval under the former expansion gate.

This file separates confirmed facts from claims that require owner records or explicit approval. Unverified items are not stated unconditionally on the rebuilt public pages.

The current implementation contains 88 dedicated community pages, including St. Paul, all 66 previously listed metro cities, and the 22 additional historical communities. It retains six regional guides and 13 selling guides, with 121 indexable destinations including `/get-a-quote`. A city page describes a service inquiry area, not a staffed office or guaranteed pickup. Exact-address availability, access, terms and scheduling are confirmed directly. See [the migration audit](docs/dev/AUGUST_MIGRATION_AUDIT_2026-10-16.md), [the city directory](src/data/city-directory.json), and [the redirect map](REDIRECT_MAP.md). Production status must be established against the final deployed revision.

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

## Runtime and operational verification

These entries describe verification work; they do not revoke the owner's authorization to implement and release the requested repairs. Record actual evidence instead of inferring successful delivery from mocked tests or old launch checklists.

| Claim or system          | Evidence/decision needed                                                                  | Current treatment                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Photo rights             | Retain evidence of Merritt's continuing commercial rights to the selected old-site images | Existing production photos retained; provenance recorded in `IMAGE_ASSET_PROVENANCE.md` |
| Resend sender            | Confirm sending domain/address is verified and recipient inbox is correct                 | Environment-gated                                                                       |
| Turnstile                | Confirm production hostname and keys                                                      | Form disabled when site key is absent                                                   |
| Contact consent language | Owner/legal review for phone, SMS, and email follow-up language                           | Conservative consent checkbox included                                                  |
| Privacy retention        | Decide an operational retention period and deletion process                               | Uses “reasonably needed” language                                                       |
| Production branch        | Verify the released `master` revision and matching production deployment                  | August rebuild is already live; each recovery release needs its own deployment evidence |

## P1: verify before publishing as facts

| Potential claim                                                | Needed proof                                                                             | Public status                                                                                      |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Licensed Minnesota auto recycler                               | Current license record and exact license name/number                                     | Omitted                                                                                            |
| Insured towing/salvage operation                               | Current policy confirmation and approved wording                                         | Omitted                                                                                            |
| Family-owned or owner-operated                                 | Owner approval of precise description                                                    | Omitted                                                                                            |
| Cash paid at pickup                                            | Current payment process, legal/compliance approval, exceptions                           | Site says “cash offer,” not payment timing                                                         |
| Removal/towing has no charge                                   | Current policy, service area, and exceptions                                             | No free-towing promise                                                                             |
| Same-day pickup                                                | Dispatch evidence and approved qualification                                             | Explicitly not promised                                                                            |
| Vehicles without title accepted                                | Exact ownership/document rules and exceptions                                            | Explicitly not guaranteed                                                                          |
| Cars, trucks, vans, SUVs, RVs, buses, tractors, farm equipment | Current acquisition list and equipment limits                                            | Cars, trucks, vans and SUVs discussed; unusual equipment requires an individual acceptance inquiry |
| Environmental process                                          | Actual downstream partners, permits, fluid handling, and approved percentage methodology | General education only; no business-specific percentage                                            |
| Pickup at a particular address in a listed community           | Actual vehicle, location, access, equipment and schedule                                 | 88 dedicated community pages; address-level availability and terms confirmed directly              |
| Pickup at the business address                                 | Confirm whether customers may arrive without appointment                                 | Address shown; no walk-in instruction                                                              |

## Reviews and reputation

The legacy repository contains eight testimonials and a 5.0/8 aggregate-rating record. Before any excerpt is restored, document:

- original platform and direct URL
- reviewer display name exactly as published
- original date
- permission or a policy basis for republication
- confirmation that wording is unedited or that edits are disclosed
- a current check that the review still exists

Until then, `/reviews` links to the live Google profile and no Review or aggregateRating schema is emitted.

## Current community-page requirements

The October 16 owner request authorizes complete listed and historical coverage. Maintain these content and migration requirements for the 88 destinations and any future additions:

1. Provide useful city-specific geographic and pickup context using accurate facts.
2. Explain that the exact vehicle address, access, terms and pickup window are reviewed directly.
3. Keep the real business location in Brooklyn Center; do not invent a local office, completed job or testimonial.
4. Give every listed city a crawlable link to its actual static page.
5. Preserve each historical city URL with a direct own-city mapping and keep canonical, sitemap, directory and redirect inventories aligned.

St. Paul has a dedicated page at `/service-areas/st-paul`. It is subject to the same address-level review as the other service communities.

## Superseded August policy

The August launch limited dedicated pages to Brooklyn Center and Minneapolis and consolidated other legacy cities into a directory. That restriction and the statement that St. Paul had no page are historical, not current instructions. The October 16 migration audit identifies the resulting destination and answer loss. Preserve accurate operational qualifications while maintaining the complete city inventory requested by the owner.

## Evidence record

Record the reviewer, date, evidence link, and approved wording when an operational claim is established. Do not mark a claim verified based on an assumption or a competitor's wording. Keep code validation, production deployment, delivered mail and actual search/call recovery as separate evidence.
