# MongoDB Schema Design Proposal

## Core Reference Models

- `Role`
  - `name`, `code`, `description`, `permissions[]`, `isSystem`
- `Department`
  - `name`, `code`, `description`, `visibilityScope`, `isActive`

## User Security Domain

- `User`
  - encrypted fields: `employeeId`, `username`, `fullName`, `email`, `phone`, `designation`
  - auth fields: `passwordHash`, `passwordSalt`
  - references: `roleId`, `departmentId`, `publicKeyRef`
  - security fields: `accountStatus`, `failedLoginAttempts`, `lockedUntil`, `lastLoginAt`, `lastLoginIp`, `biometricEnabled`
- `UserProfileHistory`
  - `userId`, `changedBy`, `beforeSnapshot`, `afterSnapshot`, `reason`
- `OTPVerification`
  - `userId`, `purpose`, `codeHash`, `expiresAt`, `attempts`, `isUsed`
- `Session`
  - `userId`, `tokenHash`, `device`, `ipAddress`, `userAgent`, `expiresAt`, `isSuspicious`, `revokedAt`
- `Notification`
  - `userId`, `type`, `title`, `message`, `severity`, `readAt`, `meta`

## Content Domain

- `Post`
  - `authorId`, `departmentId`, `category`, `visibilityLevel`
  - encrypted fields: `title`, `body`
  - workflow fields: `status`, `integrityMac`, `integrityStatus`, `currentVersion`
- `PostVersion`
  - `postId`, `versionNumber`, encrypted content snapshot, `changeSummary`, `editedBy`
- `PostApproval`
  - `postId`, `reviewerId`, `action`, `comment`, `actedAt`

## Crypto and Integrity Domain

- `CryptoKey`
  - `name`, `algorithm`, `purpose`, `publicKeyData`, `encryptedPrivateKeyData`
  - `status`, `assignedUserId`, `expiresAt`, `rotatedAt`, `revokedAt`
- `KeyRotationLog`
  - `keyId`, `previousKeyId`, `actionBy`, `reason`, `timestamp`
- `IntegrityAlert`
  - `resourceType`, `resourceId`, `severity`, `status`, `message`, `detectedAt`

## Audit and Analytics Domain

- `AuditLog`
  - `actorId`, `action`, `resourceType`, `resourceId`, `severity`, `ipAddress`, `device`, `meta`
- `EmployeeAnalytics`
  - `userId`, `postsCreated`, `postsApproved`, `postsRejected`, `draftCount`, `loginCount`, `lastCalculatedAt`
- `DepartmentAnalytics`
  - `departmentId`, `totalPosts`, `approvedPosts`, `pendingPosts`, `rejectedPosts`, `activeUsers`, `lastCalculatedAt`

## Biometric Domain

- `BiometricProfile`
  - `userId`, encrypted `templateVector`, `provider`, `isEnabled`, `enrolledAt`
- `BiometricLog`
  - `userId`, `action`, `result`, `confidenceScore`, `device`, `ipAddress`, `createdAt`

