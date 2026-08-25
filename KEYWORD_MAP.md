# Keyword and intent map

This map assigns one primary intent to each indexable page. Terms are planning targets, not ranking guarantees. Saint Paul and other unconfirmed city targets are intentionally excluded from dedicated pages.

| URL                                          | Search intent            | Primary topic                                  | Supporting topics                                               | Recommended schema       |
| -------------------------------------------- | ------------------------ | ---------------------------------------------- | --------------------------------------------------------------- | ------------------------ |
| `/`                                          | Local commercial         | cash offers for junk cars near Brooklyn Center | unwanted vehicles, Merritt's Auto Recycling, call for offer     | WebPage + LocalBusiness  |
| `/cash-for-junk-cars`                        | Commercial               | cash for junk cars                             | phone quote, junk car value factors, unwanted car buyer         | Service                  |
| `/junk-car-removal`                          | Commercial/informational | junk car removal                               | non-running vehicle pickup, vehicle access, acquisition removal | Service                  |
| `/auto-recycling`                            | Commercial/informational | auto recycling                                 | end-of-life vehicles, salvage handling, Minnesota resources     | Service                  |
| `/junk-car-towing`                           | Commercial clarification | junk vehicle towing for acquired vehicles      | acquisition-related towing, non-running vehicle removal         | Service                  |
| `/service-areas`                             | Local navigational       | Merritt's service areas                        | Brooklyn Center, Minneapolis, confirm pickup location           | CollectionPage           |
| `/service-areas/brooklyn-center`             | Local commercial         | cash offer for junk car Brooklyn Center MN     | local junk car buyer, Brooklyn Center vehicle removal           | Service + BreadcrumbList |
| `/service-areas/minneapolis`                 | Local commercial         | cash offer for junk car Minneapolis MN         | Minneapolis unwanted vehicle, pickup access                     | Service + BreadcrumbList |
| `/about`                                     | Branded trust            | about Merritt's Auto Recycling                 | Brad Emholtz, founded 1988, Brooklyn Center business            | AboutPage                |
| `/reviews`                                   | Branded trust            | Merritt's Auto Recycling reviews               | Google Business Profile, customer feedback                      | WebPage                  |
| `/faq`                                       | Informational            | junk car sale questions                        | title, keys, non-running cars, pickup timing, hours             | CollectionPage           |
| `/contact`                                   | Branded transactional    | contact Merritt's Auto Recycling               | phone, text, address, hours, directions                         | ContactPage              |
| `/guides`                                    | Informational hub        | junk car guides Minnesota                      | documents, preparation, offer factors, recycling                | CollectionPage           |
| `/guides/prepare-an-unwanted-car-for-pickup` | Informational            | prepare junk car for pickup                    | remove belongings, access checklist, safety                     | Article                  |
| `/guides/minnesota-junk-car-documents`       | Informational            | Minnesota junk car documents                   | title status, plates, identification, DVS                       | Article                  |
| `/guides/what-affects-a-junk-car-offer`      | Informational            | what affects junk car value                    | year, condition, completeness, access, market                   | Article                  |
| `/guides/what-happens-after-junk-car-pickup` | Informational            | what happens to a junk car                     | auto salvage, material recycling, MPCA                          | Article                  |
| `/guides/non-running-car-removal-checklist`  | Informational            | non-running car removal checklist              | wheels, steering, access, damage, property permission           | Article                  |
| `/privacy`                                   | Legal/navigational       | Merritt's website privacy                      | lead data, Turnstile, Resend, contact choices                   | WebPage                  |

## Cannibalization rules

- Home owns broad branded/local cash-offer intent.
- `/cash-for-junk-cars` owns the core service explanation; area pages add actual local context, not copied service text.
- `/junk-car-removal` owns pickup planning; `/junk-car-towing` exists to clarify the narrow acquisition-related scope.
- Guides answer informational questions and link to the relevant service page without copying its conversion copy.
- New city pages require confirmed service, unique operational context, and owner-approved evidence.

## Internal linking priorities

1. Home links to every core service, both area pages, the recycling guide, FAQ, and direct call/text actions.
2. Service pages link to call and text actions plus relevant FAQs.
3. Area pages link to direct contact actions and the service-area hub.
4. Guides link to authoritative sources and the direct call action.
5. Footer provides consistent service, guide, contact, address, and profile links.
