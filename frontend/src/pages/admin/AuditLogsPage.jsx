import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { adminApi } from "../../api/adminApi";
import { useApiState } from "../../hooks/useApiState";

function AuditLogsPage() {
  const { data, isLoading, error } = useApiState(adminApi.auditLogs, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Traceability" title="Audit Logs" description="Track registration, login failures, session events, key lifecycle operations, and approval actions." />
      {isLoading ? <p className="text-slate-300">Loading audit logs...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "action", label: "Action" },
          { key: "resource", label: "Resource" },
          { key: "status", label: "Severity" },
          { key: "updatedAt", label: "Timestamp" },
        ]}
        rows={(data || []).map((row) => ({
          action: row.action,
          resource: row.resourceType,
          status: row.severity === "INFO" ? "Active" : row.severity,
          updatedAt: new Date(row.createdAt).toLocaleString(),
        }))}
      />
    </div>
  );
}

export default AuditLogsPage;
