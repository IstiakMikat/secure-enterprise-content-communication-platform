import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

const rows = [
  { title: "Customer support escalation note", category: "Customer Support Guideline", status: "Pending", updatedAt: "2026-04-24 07:10" },
  { title: "Monthly compliance digest", category: "Compliance Notice", status: "Pending", updatedAt: "2026-04-23 17:55" },
];

function DraftsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Draft Workspace" title="Draft Posts" description="Maintain working drafts before submitting sensitive content into the approval chain." />
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Updated" },
        ]}
        rows={rows}
      />
    </div>
  );
}

export default DraftsPage;
