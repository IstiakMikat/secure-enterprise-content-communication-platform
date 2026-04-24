import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function UserManagementPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Administration" title="User Management" description="Activate, deactivate, and monitor accounts across departments and security tiers." />
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "department", label: "Department" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]}
        rows={[
          { name: "Amina Rahman", department: "IT Security", role: "ADMIN", status: "Active" },
          { name: "Fahim Chowdhury", department: "Fraud Operations", role: "MANAGER", status: "Active" },
          { name: "Nabila Sultana", department: "Compliance", role: "USER", status: "Pending" },
        ]}
      />
    </div>
  );
}

export default UserManagementPage;
