import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function EmployeeAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Contribution Insights" title="Employee Analytics" description="Measure secure publishing participation, approval outcomes, and activity contribution across employees." />
      <DataTable
        columns={[
          { key: "name", label: "Employee" },
          { key: "posts", label: "Posts Created" },
          { key: "approved", label: "Approved" },
          { key: "logins", label: "Logins" },
        ]}
        rows={[
          { name: "Amina Rahman", posts: 12, approved: 9, logins: 30 },
          { name: "Fahim Chowdhury", posts: 21, approved: 14, logins: 24 },
          { name: "Nabila Sultana", posts: 8, approved: 6, logins: 18 },
        ]}
      />
    </div>
  );
}

export default EmployeeAnalyticsPage;
