# REST API Structure Proposal

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `GET /api/auth/me`

## Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/change-password`
- `GET /api/users/notifications`
- `PATCH /api/users/notifications/:id/read`

## Posts

- `POST /api/posts/create`
- `GET /api/posts/list`
- `GET /api/posts/drafts/list`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `PATCH /api/posts/:id/archive`

## Approvals

- `GET /api/approvals/pending`
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`

## Admin

### Users

- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/department`

### Keys

- `GET /api/admin/keys`
- `POST /api/admin/keys/generate`
- `PATCH /api/admin/keys/:id/rotate`
- `PATCH /api/admin/keys/:id/revoke`

### Logs

- `GET /api/admin/logs/audit`
- `GET /api/admin/logs/integrity-alerts`
- `GET /api/admin/logs/security-summary`

## Analytics

- `GET /api/analytics/company-overview`
- `GET /api/analytics/employee-performance`
- `GET /api/analytics/department-overview`
- `GET /api/analytics/security-overview`

## Biometric

- `POST /api/biometric/enroll`
- `POST /api/biometric/verify`
- `GET /api/biometric/logs`

