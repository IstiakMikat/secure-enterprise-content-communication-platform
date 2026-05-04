import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { userApi } from "../../api/userApi";
import { useApiState } from "../../hooks/useApiState";

function SessionManagementPage() {
  const { data, isLoading, error } = useApiState(userApi.sessions, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Session Control" title="Session Management" description="Track current and historical sessions, suspicious access flags, and remote logout operations." />
      {isLoading ? <p className="text-slate-300">Loading sessions...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "device", label: "Device" },
          { key: "ip", label: "IP Address" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Last Seen" },
        ]}
        rows={(data || []).map((row) => ({
          device: row.device?.name || "Unknown Device",
          ip: row.ipAddress,
          status: row.revokedAt ? "Revoked" : "Active",
          updatedAt: new Date(row.lastSeenAt || row.createdAt).toLocaleString(),
        }))}
      />
    </div>
  );
}

export default SessionManagementPage;
