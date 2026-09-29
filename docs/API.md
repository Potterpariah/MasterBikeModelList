# Stage 4 API

All authenticated endpoints use the `bp_session` HttpOnly cookie.

## Authentication
- `POST /api/auth/signup` — `{email, username, password, turnstileToken}`
- `POST /api/auth/login` — `{identity, password}`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/me/activity` — the signed-in user's reactions, follows and saves (up to 500 each)
- `PATCH /api/me/profile`
- `POST /api/me/avatar` — multipart form field `file`

## Public profiles / Bike Garage
- `GET /api/users/:username`
- `GET /api/garage`
- `POST /api/garage`
- `DELETE /api/garage/:id`

## Texas events
- `GET /api/events?city=&discipline=&from=&to=&limit=`
- `GET /api/events/:id-or-slug`
- `POST /api/events/:id/status` — `{status: "interested"|"going"|"completed"}`

## Community
- `GET /api/discussions`
- `POST /api/discussions`
- `GET /api/discussions/:id-or-slug`
- `POST /api/discussions/:id/comments`
- `POST /api/reactions`
- `POST|DELETE /api/follows`
- `POST|DELETE /api/saves`

## Notifications
- `GET /api/notifications`
- Notification responses include `unread_count` across all unread records; the displayed list remains limited to 100 latest records.
- `POST /api/notifications/:id/read`

## Moderation
- `POST /api/reports`
- `GET /api/mod/reports` — moderator/admin
- `POST /api/mod/reports/:id/resolve` — moderator/admin

## Diagnostics
- `GET /api/health`
- `GET /stage4-test`

## Saved library (4.2.1)
- `GET /api/me/library` requires a session and returns only its owner's saves/follows with resolved titles, types, added dates, availability and links. Responses are private/no-store.
- Up to 500 newest items per list, exact totals and an explicit loaded-items notice. Search covers loaded items. Hidden/missing targets reveal no title and remain removable through existing DELETE routes.
