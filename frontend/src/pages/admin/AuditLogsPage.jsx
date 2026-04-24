import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Traceability" title="Audit Logs" description="Track registration, login failures, session events, key lifecycle operations, and approval actions." />
      <DataTable
        columns={[
          { key: "action", label: "Action" },
          { key: "resource", label: "Resource" },
          { key: "status", label: "Severity" },
          { key: "updatedAt", label: "Timestamp" },
        ]}
        rows={[
          { action: "LOGIN_FAILED", resource: "USER", status: "Pending", updatedAt: "2026-04-24 08:41" },
          { action: "KEY_ROTATED", resource: "CRYPTOKEY", status: "Active", updatedAt: "2026-04-24 09:12" },
        ]}
      />
    </div>
  );
}

export default AuditLogsPage;
