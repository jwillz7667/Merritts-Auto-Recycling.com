# Legacy redirect map

Vercel uses `permanent: true`, which emits a method-preserving permanent redirect. Rules are ordered from specific to general. The two retained service-area pages must appear before the placemark fallback.

## Primary pages

| Legacy source            | Destination           | Reason                      |
| ------------------------ | --------------------- | --------------------------- |
| `/index.html`            | `/`                   | Canonical home              |
| `/about-brad.html`       | `/about`              | Closest branded entity page |
| `/about-brad`            | `/about`              | Old clean canonical variant |
| `/contact.html`          | `/contact`            | Direct replacement          |
| `/faq.html`              | `/faq`                | Direct replacement          |
| `/testimonials.html`     | `/reviews`            | Live-profile review policy  |
| `/testimonials`          | `/reviews`            | Clean variant               |
| `/quote-calculator.html` | `/cash-for-junk-cars` | Closest service replacement |
| `/quote-calculator`      | `/cash-for-junk-cars` | Clean variant               |

## Legacy form processors

| Legacy source                   | Destination        | Notes                                                                     |
| ------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| `/form/process-contact.php`     | `/api/contact`     | Preserves method and endpoint; current validation and consent rules apply |
| `/form/process-quote.php`       | `/api/quote`       | Returns 410; the online cash-offer form is retired                        |
| `/form/process-appointment.php` | `/api/appointment` | Returns 410; appointment booking is retired until confirmed               |

## Blog migration

| Legacy source                                                | Destination                                  |
| ------------------------------------------------------------ | -------------------------------------------- |
| `/blog/index.html`                                           | `/guides`                                    |
| `/blog`                                                      | `/guides`                                    |
| `/blog/auto-recycling-environmental-impact-twin-cities.html` | `/guides/what-happens-after-junk-car-pickup` |
| `/blog/what-happens-to-car-after-pickup.html`                | `/guides/what-happens-after-junk-car-pickup` |
| `/blog/how-much-is-my-junk-car-worth-minnesota-2026.html`    | `/guides/what-affects-a-junk-car-offer`      |
| `/blog/running-vs-non-running-junk-car-prices.html`          | `/guides/what-affects-a-junk-car-offer`      |
| `/blog/scrap-value-by-weight-minnesota-guide.html`           | `/guides/what-affects-a-junk-car-offer`      |
| `/blog/minnesota-junk-car-title-requirements.html`           | `/guides/minnesota-junk-car-documents`       |
| `/blog/mn-license-plates-before-junking.html`                | `/guides/minnesota-junk-car-documents`       |
| `/blog/free-junk-car-removal-minneapolis-mn.html`            | `/junk-car-removal`                          |
| `/blog/junk-vs-tradein-vs-private-sale.html`                 | `/guides`                                    |
| `/blog/top-10-most-junked-cars-minnesota.html`               | `/guides`                                    |

## Placemark migration

Specific retained pages:

| Legacy source                         | Destination                      |
| ------------------------------------- | -------------------------------- |
| `/placemarks/brooklyn-center-mn.html` | `/service-areas/brooklyn-center` |
| `/placemarks/brooklyn-center-mn`      | `/service-areas/brooklyn-center` |
| `/placemarks/minneapolis-mn.html`     | `/service-areas/minneapolis`     |
| `/placemarks/minneapolis-mn`          | `/service-areas/minneapolis`     |

All other placemarks resolve to the focused service-area hub through these ordered catch-alls:

| Pattern                  | Destination      |
| ------------------------ | ---------------- |
| `/placemarks/:slug.html` | `/service-areas` |
| `/placemarks/:slug`      | `/service-areas` |

Full legacy placemark inventory covered by the fallback:

| Legacy URL                             | Destination      |
| -------------------------------------- | ---------------- |
| `/placemarks/albertville-mn.html`      | `/service-areas` |
| `/placemarks/andover-mn.html`          | `/service-areas` |
| `/placemarks/anoka-mn.html`            | `/service-areas` |
| `/placemarks/becker-mn.html`           | `/service-areas` |
| `/placemarks/big-lake-mn.html`         | `/service-areas` |
| `/placemarks/blaine-mn.html`           | `/service-areas` |
| `/placemarks/brooklyn-park-mn.html`    | `/service-areas` |
| `/placemarks/buffalo-mn.html`          | `/service-areas` |
| `/placemarks/champlin-mn.html`         | `/service-areas` |
| `/placemarks/clear-lake-mn.html`       | `/service-areas` |
| `/placemarks/clearwater-mn.html`       | `/service-areas` |
| `/placemarks/columbia-heights-mn.html` | `/service-areas` |
| `/placemarks/coon-rapids-mn.html`      | `/service-areas` |
| `/placemarks/corcoran-mn.html`         | `/service-areas` |
| `/placemarks/crystal-mn.html`          | `/service-areas` |
| `/placemarks/dayton-mn.html`           | `/service-areas` |
| `/placemarks/elk-river-mn.html`        | `/service-areas` |
| `/placemarks/foley-mn.html`            | `/service-areas` |
| `/placemarks/foreston-mn.html`         | `/service-areas` |
| `/placemarks/fridley-mn.html`          | `/service-areas` |
| `/placemarks/ham-lake-mn.html`         | `/service-areas` |
| `/placemarks/hanover-mn.html`          | `/service-areas` |
| `/placemarks/hennepin-county-mn.html`  | `/service-areas` |
| `/placemarks/maple-grove-mn.html`      | `/service-areas` |
| `/placemarks/maple-lake-mn.html`       | `/service-areas` |
| `/placemarks/milaca-mn.html`           | `/service-areas` |
| `/placemarks/minnesota.html`           | `/service-areas` |
| `/placemarks/monticello-mn.html`       | `/service-areas` |
| `/placemarks/new-brighton-mn.html`     | `/service-areas` |
| `/placemarks/new-hope-mn.html`         | `/service-areas` |
| `/placemarks/nowthen-mn.html`          | `/service-areas` |
| `/placemarks/oak-grove-mn.html`        | `/service-areas` |
| `/placemarks/orrock-mn.html`           | `/service-areas` |
| `/placemarks/osseo-mn.html`            | `/service-areas` |
| `/placemarks/otsego-mn.html`           | `/service-areas` |
| `/placemarks/plymouth-mn.html`         | `/service-areas` |
| `/placemarks/princeton-mn.html`        | `/service-areas` |
| `/placemarks/ramsey-mn.html`           | `/service-areas` |
| `/placemarks/robbinsdale-mn.html`      | `/service-areas` |
| `/placemarks/rockford-mn.html`         | `/service-areas` |
| `/placemarks/rogers-mn.html`           | `/service-areas` |
| `/placemarks/sartell-mn.html`          | `/service-areas` |
| `/placemarks/sauk-rapids-mn.html`      | `/service-areas` |
| `/placemarks/sherburne-county-mn.html` | `/service-areas` |
| `/placemarks/spring-lake-park-mn.html` | `/service-areas` |
| `/placemarks/st-cloud-mn.html`         | `/service-areas` |
| `/placemarks/st-francis-mn.html`       | `/service-areas` |
| `/placemarks/st-michael-mn.html`       | `/service-areas` |
| `/placemarks/waite-park-mn.html`       | `/service-areas` |
| `/placemarks/wright-county-mn.html`    | `/service-areas` |
| `/placemarks/zimmerman-mn.html`        | `/service-areas` |

## Canonical host

All requests to `www.merritts-auto-recycling.com` permanently redirect to the equivalent path on `https://merritts-auto-recycling.com`.

## Validation sampling

Before production launch, test at least:

- one primary page
- one retained service-area page
- one fallback city page
- one fallback county page
- each mapped blog topic
- all legacy form processor redirects, confirming retired endpoints return 410
- canonical `www` behavior

Confirm one hop, correct final status, preserved query parameters, and no redirect loop.
