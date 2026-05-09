import { useState, useEffect } from "react";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { approvalApi } from "../../api/approvalApi";

function ApprovalQueuePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      const result = await approvalApi.getPending();
      setData(result || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load approval queue.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approvalApi.approve(id);
      fetchApprovals();
    } catch (err) {
      alert("Failed to approve: " + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await approvalApi.reject(id);
      fetchApprovals();
    } catch (err) {
      alert("Failed to reject: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Manager Workflow" title="Approval Queue" description="Review department-bound content before release to broader enterprise audiences." />
      {isLoading ? <p className="text-slate-300">Loading queue...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "department", label: "Department" },
          { key: "category", label: "Category" },
          { key: "updatedAt", label: "Submitted" },
          { key: "actions", label: "Actions" },
        ]}
        rows={(data || []).map((row) => ({
          title: row.title,
          department: row.departmentName || row.departmentId,
          category: row.category,
          updatedAt: new Date(row.updatedAt).toLocaleString(),
          actions: (
            <div className="flex space-x-2">
              <button onClick={() => handleApprove(row.id)} className="rounded bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-500/30">Approve</button>
              <button onClick={() => handleReject(row.id)} className="rounded bg-rose-500/20 px-3 py-1 text-xs text-rose-400 hover:bg-rose-500/30">Reject</button>
            </div>
          ),
        }))}
      />
    </div>
  );
}

export default ApprovalQueuePage;
