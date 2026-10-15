# Media and thumbnail plan

## Decision

Bike Portal will use a small number of relevant, rights-cleared images rather
than automatically fetching search-result thumbnails. An image is useful only
when it helps a rider recognize the exact event, bike, route, or author. It is
not a substitute for missing facts or route evidence.

The Texas Cycling Hub's deterministic Bing thumbnail URLs are not a suitable
source for Bike Portal. A search-result image can change, be unrelated to the
record, lack reuse permission, or disappear. Bike Portal's current same-origin
image policy also intentionally prevents arbitrary remote image hotlinking.

## What earns a thumbnail

| Surface | Use a thumbnail when | Do not add one when |
| --- | --- | --- |
| Homepage | It is the existing editorial hero or a deliberately featured, reviewed collection | It repeats a card image the visitor will see immediately below |
| Event listings and details | The organizer supplied or authorized a current event image with a source and credit | Only a generic cycling stock photo is available |
| Bike model detail | It is an official manufacturer image for the exact model/year or build represented | The image is merely the same bicycle category or an unverified model year |
| Bike index | A compact, official category image materially helps selection | Every individual result would receive a nearly identical bike photograph |
| Routes and trails | A reviewed source provides a place-specific image and the route record has sufficient evidence | A map, surface, closure, or access claim cannot be supported by the image source |
| City guides and clubs | A city editorial image, official club logo, or owner-provided photo is available | A stock image would imply a relationship with a club or city it does not have |
| Guides | One selective editorial cover image on a guide landing or featured guide helps orientation | Each article section would be decorated with unrelated imagery |
| Community | The member has uploaded an approved avatar or later, an approved contribution image | An image has not passed the community moderation process |

No thumbnail should be added solely to fill whitespace. List pages should keep
their text-first layout when no reviewed image exists.

When an image represents a Bike Portal record, it must be wrapped in a working
link to that record's page when that page exists. Decorative graphics remain
non-record imagery; a personal avatar is not linked unless Bike Portal provides
the matching public profile page.

## Preferred sourcing order

1. Rights-cleared organizer, club, city, trail manager, or manufacturer media;
   store the approved derivative in Bike Portal's R2 media store.
2. Bike Portal-owned photography or illustrations with a recorded owner and
   intended use.
3. A narrowly used editorial provider image for a general guide or city landing
   page, only after its terms, attribution, and delivery rules are implemented.

For exact models, events, clubs, and routes, option 1 is the normal standard.
Generic provider images are not appropriate substitutes for entity-specific
media.

## Stored alternate editorial image

The reviewed Texas Cycling Hub hero is retained under the Bike Portal R2 key
`editorial/texas-ride-hero.webp` for a future, separately approved editorial
placement. It is not the active homepage hero; the active hero is Bike Portal's
original decorative bicycle illustration, linked to the events page.

## Required record before publishing

Each published image needs an entity type and ID, role (`hero`, `thumbnail`, or
`detail`), storage key, descriptive alt text, original source URL, credit or
license note, review date, and approval status. A missing source, uncertain
rights, misleading subject, or expired organizer image keeps the image out of
the public page.

The next implementation should add a reviewed-media record and an editor upload
flow; it must not create an automatic remote-image fetcher. This is deliberately
separate from the current data catalog and requires a schema/API approval before
it is built.

## Provider assessment

- **R2 media (recommended baseline):** preserves source control and enables
  same-origin delivery. Production delivery should use a custom domain, not the
  `r2.dev` development URL.
- **Unsplash API (optional, editorial-only):** useful for a rare, generic guide
  or city image, but its returned image URLs must be embedded and attributed
  according to its API rules. It must not be copied into R2 without a separate
  rights arrangement.
- **Cloudflare Images (later, community uploads):** suitable when direct,
  moderated uploads and image variants are needed. It needs a product/billing
  decision and server-side upload authorization.

## Acceptance checks

- The image subject matches the linked record and the alt text describes it.
- Every source/credit/review field is present and current.
- No event, route, club, or model page implies endorsement from a stock image.
- Mobile and desktop cards stay readable with no image, a thumbnail, or a hero.
- Community media remains hidden until moderation approval.
