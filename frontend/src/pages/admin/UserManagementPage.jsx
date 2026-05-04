import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { adminApi } from "../../api/adminApi";
import { useApiState } from "../../hooks/useApiState";

function UserManagementPage() {
  const { data, isLoading, error } = useApiState(adminApi.users, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Administration" title="User Management" description="Activate, deactivate, and monitor accounts across departments and security tiers." />
      {isLoading ? <p className="text-slate-300">Loading users...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "department", label: "Department" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]}
        rows={(data || []).map((row) => ({
          name: row.fullName,
          department: row.department,
          role: row.role,
          status: row.accountStatus === "ACTIVE" ? "Active" : row.accountStatus,
        }))}
      />
    </div>
  );
}

export default UserManagementPage;
