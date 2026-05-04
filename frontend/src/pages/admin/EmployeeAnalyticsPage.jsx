import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { analyticsApi } from "../../api/analyticsApi";
import { useApiState } from "../../hooks/useApiState";

function EmployeeAnalyticsPage() {
  const { data, isLoading, error } = useApiState(analyticsApi.employeePerformance, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Contribution Insights" title="Employee Analytics" description="Measure secure publishing participation, approval outcomes, and activity contribution across employees." />
      {isLoading ? <p className="text-slate-300">Loading employee analytics...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "posts", label: "Posts Created" },
          { key: "approved", label: "Approved" },
          { key: "logins", label: "Logins" },
        ]}
        rows={(data || []).map((row) => ({
          name: row.user?.fullName || "Unknown",
          posts: row.postsCreated,
          approved: row.postsApproved,
          logins: row.loginCount,
        }))}
      />
    </div>
  );
}

export default EmployeeAnalyticsPage;
