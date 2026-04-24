import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";

function KeyManagementPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Cryptographic Governance" title="Key Management" description="Generate, assign, rotate, revoke, and review RSA and ECC academic key records." action={<button className="button-primary">Generate Key</button>} />
      <DataTable
        columns={[
          { key: "name", label: "Key Name" },
          { key: "algorithm", label: "Algorithm" },
          { key: "purpose", label: "Purpose" },
          { key: "status", label: "Status" },
        ]}
        rows={[
          { name: "USER_PROFILE-RSA-primary", algorithm: "RSA", purpose: "USER_PROFILE", status: "Active" },
          { name: "POST_CONTENT-ECC-primary", algorithm: "ECC", purpose: "POST_CONTENT", status: "Active" },
        ]}
      />
    </div>
  );
}

export default KeyManagementPage;
