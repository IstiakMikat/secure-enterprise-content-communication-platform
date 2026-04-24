# Repository Structure Proposal

## Root

- `backend/` Express, MongoDB, crypto, business services
- `frontend/` React SPA, dashboards, role-aware routes
- `docs/` architecture, API, setup, and academic crypto notes

## Backend

- `src/config` environment configuration and database bootstrap
- `src/constants` enums, roles, statuses, categories, departments
- `src/controllers` HTTP orchestration only
- `src/services` business logic and crypto orchestration
- `src/repositories` persistence access
- `src/models` Mongoose schemas
- `src/routes` route grouping by domain
- `src/middlewares` auth, RBAC, validation, integrity, errors
- `src/validators` request validation rules
- `src/crypto`
  - `rsa/` academic RSA implementation
  - `ecc/` academic ECC implementation
  - `mac/` academic MAC logic
  - `hashing/` salt and password hashing
  - `keyManagement/` key generation, rotation, metadata helpers
  - `adapters/` provider abstraction
- `src/scripts` seed and maintenance scripts
- `src/utils` error, response, async, parsing helpers

## Frontend

- `src/api` Axios client and API wrappers
- `src/context` authentication and app context
- `src/routes` protected routing and role gating
- `src/layouts` public and authenticated layouts
- `src/components/layout` sidebar, navbar, panels
- `src/components/ui` cards, tables, badges, loaders, modals
- `src/components/forms` reusable form controls
- `src/components/charts` chart wrappers
- `src/pages/auth` public auth flows
- `src/pages/user` user-facing secure workspace pages
- `src/pages/manager` approval and department analytics
- `src/pages/admin` admin operations and dashboards
- `src/pages/shared` landing and fallback pages

