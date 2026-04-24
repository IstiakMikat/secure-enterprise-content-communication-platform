import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function SessionManagementPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Session Control" title="Session Management" description="Track current and historical sessions, suspicious access flags, and remote logout operations." />
      <DataTable
        columns={[
          { key: "device", label: "Device" },
          { key: "ip", label: "IP Address" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Last Seen" },
        ]}
        rows={[
          { device: "Windows Browser", ip: "10.15.4.90", status: "Active", updatedAt: "2026-04-24 10:42" },
          { device: "MacBook Browser", ip: "10.15.5.18", status: "Pending", updatedAt: "2026-04-22 18:22" },
        ]}
      />
    </div>
  );
}

export default SessionManagementPage;
