import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { postApi } from "../../api/postApi";
import { useApiState } from "../../hooks/useApiState";

function ViewPostsPage() {
  const { data, isLoading, error } = useApiState(postApi.list, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Content Repository" title="Encrypted Posts" description="Department and role visibility rules should limit which approved or draft posts are available to each user." />
      {isLoading ? <p className="text-slate-300">Loading posts...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "department", label: "Department" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Updated" },
        ]}
        rows={(data || []).map((row) => ({
          title: row.title,
          department: row.departmentName || row.departmentId,
          category: row.category,
          status: row.status,
          updatedAt: new Date(row.updatedAt).toLocaleString(),
        }))}
      />
    </div>
  );
}

export default ViewPostsPage;
