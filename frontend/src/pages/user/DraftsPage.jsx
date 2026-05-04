import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { postApi } from "../../api/postApi";
import { useApiState } from "../../hooks/useApiState";

function DraftsPage() {
  const { data, isLoading, error } = useApiState(postApi.drafts, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Draft Workspace" title="Draft Posts" description="Maintain working drafts before submitting sensitive content into the approval chain." />
      {isLoading ? <p className="text-slate-300">Loading drafts...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Updated" },
        ]}
        rows={(data || []).map((row) => ({
          title: row.title,
          category: row.category,
          status: row.status,
          updatedAt: new Date(row.updatedAt).toLocaleString(),
        }))}
      />
    </div>
  );
}

export default DraftsPage;
