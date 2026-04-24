# Secure Enterprise Content & Communication Platform

Enterprise-grade MERN application for secure internal communication, encrypted content workflows, employee activity analytics, session monitoring, and key lifecycle administration.

## Monorepo Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- constants
|   |   |-- controllers
|   |   |-- crypto
|   |   |-- middlewares
|   |   |-- models
|   |   |-- repositories
|   |   |-- routes
|   |   |-- scripts
|   |   |-- services
|   |   |-- utils
|   |   `-- validators
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- layouts
|   |   |-- pages
|   |   |-- routes
|   |   `-- utils
|-- docs
|   |-- api
|   `-- architecture
`-- .env.example
```

## Architecture Summary

- `backend` uses layered architecture with controllers, services, repositories, validators, and reusable middleware.
- `frontend` uses React, React Router, Axios, Context API, Tailwind CSS, and role-aware navigation.
- `crypto` is intentionally split into:
  - academic from-scratch implementations for the assignment
  - adapter/provider abstraction so production crypto can replace it later

## Academic Crypto Notice

This repository includes **educational** implementations of RSA-like arithmetic, ECC-like arithmetic, MAC, and password hashing for assignment purposes. These modules are not suitable for real production deployment. The codebase is designed so audited production crypto providers can replace the academic provider with minimal surface-area changes.

## Core Features

- Registration, login, OTP verification, password reset, account lockout
- Session token management with device and IP tracking
- Role-based access control for admin, manager, and user roles
- Encrypted profile storage and encrypted post storage
- Approval workflows for draft, pending, approved, rejected, and archived content
- Key management lifecycle: generation, assignment, rotation, revocation, expiration
- Audit logs, integrity alerts, suspicious activity monitoring
- Company, employee, and security analytics dashboards
- Modular biometric enrollment and verification flow

## Quick Start

1. Copy `.env.example` to `.env` in the project root and adjust values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB locally.
4. Run the backend:
   ```bash
   npm run dev
   ```
5. Run the frontend:
   ```bash
   npm run dev:frontend
   ```
6. Seed demo data:
   ```bash
   npm run seed
   ```

## Default Demo Roles

- `admin.secure`
- `manager.ops`
- `employee.user`

Seed users, departments, categories, and sample content are created by the backend seed script.

## Documentation

- [Repository Structure](./docs/architecture/repository-structure.md)
- [Schema Design](./docs/architecture/schema-design.md)
- [Frontend Structure](./docs/architecture/frontend-structure.md)
- [Crypto Layer](./docs/architecture/crypto-layer.md)
- [API Reference](./docs/api/reference.md)

## Production Replacement Strategy

The following modules should be replaced before real production use:

- `backend/src/crypto/rsa/academicRSA.js`
- `backend/src/crypto/ecc/academicECC.js`
- `backend/src/crypto/mac/hmac.js`
- `backend/src/crypto/hashing/academicHasher.js`

The provider seam is:

- `backend/src/crypto/adapters/cryptoProvider.js`
