import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { adminApi } from "../../api/adminApi";
import { useApiState } from "../../hooks/useApiState";

function BiometricLogsPage() {
  const { data, isLoading, error } = useApiState(adminApi.biometricLogs, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Biometric Oversight" title="Biometric Verification Logs" description="Review enrollment and verification outcomes for camera-based second-factor events." />
      {isLoading ? <p className="text-slate-300">Loading biometric logs...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "action", label: "Action" },
          { key: "status", label: "Result" },
          { key: "updatedAt", label: "Timestamp" },
        ]}
        rows={(data || []).map((row) => ({
          name: row.user?.fullName || "Unknown",
          action: row.action,
          status: row.result === "SUCCESS" ? "Approved" : row.result,
          updatedAt: new Date(row.createdAt).toLocaleString(),
        }))}
      />
    </div>
  );
}

export default BiometricLogsPage;
