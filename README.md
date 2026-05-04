# Secure Enterprise Content & Communication Platform

Secure Enterprise Content & Communication Platform is a MERN monorepo for protected internal communication, encrypted content workflows, employee activity analytics, session monitoring, and key lifecycle administration.

## Highlights

- Full-stack monorepo with `backend` and `frontend` workspaces
- Role-based flows for admin, manager, and employee users
- OTP-based authentication and account recovery
- Encrypted content and profile handling with pluggable crypto providers
- Approval pipeline for secure post publishing and review
- Security monitoring, audit logging, integrity alerts, and analytics dashboards
- Academic cryptography layer designed for assignment/demo use

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Recharts
- Backend: Node.js, Express, Mongoose, Passport, Nodemailer
- Database: MongoDB
- Architecture: controllers, services, repositories, validators, middlewares

## Project Structure

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

## Core Features

- User registration, login, OTP verification, password reset, and account lockout
- Session management with device, IP, and activity tracking
- Role-based access control for admin, manager, and user modules
- Encrypted post storage and protected profile data handling
- Draft, pending, approved, rejected, and archived content workflows
- Key generation, rotation, assignment, revocation, and expiration management
- Audit logs, biometric logs, suspicious activity checks, and integrity alerts
- Organization-wide analytics for company, department, employee, and security views

## Local Setup

1. Copy `.env.example` to `.env` and fill in the required environment variables.
2. Install workspace dependencies:

```bash
npm install
```

3. Start MongoDB locally.
4. Start the backend server:

```bash
npm run dev
```

5. Start the frontend app in a separate terminal:

```bash
npm run dev:frontend
```

6. Seed demo data when needed:

```bash
npm run seed
```

7. Create a production frontend build:

```bash
npm run build
```

## Demo Roles

- `admin.secure`
- `manager.ops`
- `employee.user`

The seed script creates example users, departments, sample posts, and related demo data.

## Documentation

- [Repository Structure](./docs/architecture/repository-structure.md)
- [Schema Design](./docs/architecture/schema-design.md)
- [Frontend Structure](./docs/architecture/frontend-structure.md)
- [Crypto Layer](./docs/architecture/crypto-layer.md)
- [API Reference](./docs/api/reference.md)

## Academic Crypto Notice

This repository contains educational implementations of RSA-like arithmetic, ECC-like arithmetic, MAC, and password hashing for academic or demonstration purposes. These modules are not suitable for real production deployment.

For production replacement, the key seam is:

- `backend/src/crypto/adapters/cryptoProvider.js`

The academic implementations currently live in:

- `backend/src/crypto/rsa/academicRSA.js`
- `backend/src/crypto/ecc/academicECC.js`
- `backend/src/crypto/mac/hmac.js`
- `backend/src/crypto/hashing/academicHasher.js`
