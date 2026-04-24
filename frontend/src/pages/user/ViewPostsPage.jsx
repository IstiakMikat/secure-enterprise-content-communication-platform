import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { approvalRows } from "../../utils/mockData";

function ViewPostsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Content Repository" title="Encrypted Posts" description="Department and role visibility rules should limit which approved or draft posts are available to each user." />
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "department", label: "Department" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "updatedAt", label: "Updated" },
        ]}
        rows={approvalRows}
      />
    </div>
  );
}

export default ViewPostsPage;
