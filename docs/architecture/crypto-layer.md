# Crypto Layer Architecture

## Design Goal

The codebase intentionally separates educational cryptography from application business logic so the academic implementation can satisfy coursework requirements without locking the wider platform into unsafe primitives.

## Layering

### Academic Implementations

- `backend/src/crypto/rsa/academicRSA.js`
- `backend/src/crypto/ecc/academicECC.js`
- `backend/src/crypto/hashing/academicHasher.js`

These files implement assignment-focused primitives from scratch and are clearly not production-grade.

### Provider Abstraction

- `backend/src/crypto/adapters/cryptoProvider.js`

This is the swap point between academic and production crypto providers.

### Application Crypto Service

- `backend/src/services/cryptoService.js`

This service exposes the small set of application-facing operations:

- field encryption
- field decryption
- asymmetric signature generation
- asymmetric signature verification
- key lookup
- token randomness helpers

### Domain Usage

- `AuthService` encrypts employee profile fields with RSA
- `PostService` encrypts post content with ECC
- `BiometricService` encrypts stored biometric templates
- `AcademicKeyManager` governs key generation, rotation, and revocation records

## Replacement Plan For Real Deployment

To harden the application for real production:

1. Replace the academic primitives with audited crypto libraries and HSM/KMS integrations.
2. Keep the `CryptoService` and provider interface stable.
3. Migrate stored ciphertext and signature formats through versioned key metadata.
4. Move OTP delivery, token signing, and secret storage into managed infrastructure.

