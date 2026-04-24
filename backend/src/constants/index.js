const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
};

const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  LOCKED: "LOCKED",
  PENDING_OTP: "PENDING_OTP",
  DISABLED: "DISABLED",
};

const POST_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
};

const KEY_STATUS = {
  ACTIVE: "ACTIVE",
  ROTATED: "ROTATED",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
  INACTIVE: "INACTIVE",
};

const INTEGRITY_STATUS = {
  VERIFIED: "VERIFIED",
  FAILED: "FAILED",
  PENDING: "PENDING",
};

const CONTENT_CATEGORIES = [
  "Fraud Alert",
  "Service Outage",
  "Compliance Notice",
  "Security Advisory",
  "Engineering Update",
  "Customer Support Guideline",
  "Policy Update",
  "Incident Report",
];

const DEPARTMENTS = [
  "Fraud Operations",
  "Customer Service",
  "Network Operations",
  "Compliance",
  "HR",
  "IT Security",
  "Finance",
];

module.exports = {
  ROLES,
  ACCOUNT_STATUS,
  POST_STATUS,
  KEY_STATUS,
  INTEGRITY_STATUS,
  CONTENT_CATEGORIES,
  DEPARTMENTS,
};

