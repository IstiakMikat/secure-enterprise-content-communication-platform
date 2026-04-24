import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { approvalRows } from "../../utils/mockData";

function ApprovalQueuePage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Manager Workflow" title="Approval Queue" description="Review department-bound content before release to broader enterprise audiences." />
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

export default ApprovalQueuePage;
