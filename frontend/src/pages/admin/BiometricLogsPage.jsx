import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function BiometricLogsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Biometric Oversight" title="Biometric Verification Logs" description="Review enrollment and verification outcomes for camera-based second-factor events." />
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "action", label: "Action" },
          { key: "status", label: "Result" },
          { key: "updatedAt", label: "Timestamp" },
        ]}
        rows={[
          { name: "Amina Rahman", action: "ENROLL", status: "Active", updatedAt: "2026-04-20 11:00" },
          { name: "Nabila Sultana", action: "VERIFY", status: "Approved", updatedAt: "2026-04-24 10:40" },
        ]}
      />
    </div>
  );
}

export default BiometricLogsPage;
