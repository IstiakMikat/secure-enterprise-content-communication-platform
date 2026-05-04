import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import { adminApi } from "../../api/adminApi";
import { useApiState } from "../../hooks/useApiState";

function KeyManagementPage() {
  const { data, isLoading, error } = useApiState(adminApi.keys, []);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Cryptographic Governance" title="Key Management" description="Generate, assign, rotate, revoke, and review RSA and ECC academic key records." action={<button className="button-primary">Generate Key</button>} />
      {isLoading ? <p className="text-slate-300">Loading keys...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      <DataTable
        columns={[
          { key: "name", label: "Key Name" },
          { key: "algorithm", label: "Algorithm" },
          { key: "purpose", label: "Purpose" },
          { key: "status", label: "Status" },
        ]}
        rows={(data || []).map((row) => ({
          name: row.name,
          algorithm: row.algorithm,
          purpose: row.purpose,
          status: row.status === "ACTIVE" ? "Active" : row.status,
        }))}
      />
    </div>
  );
}

export default KeyManagementPage;
