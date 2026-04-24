import SectionHeader from "../../components/ui/SectionHeader";

function EditPostPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Version Control" title="Edit Post" description="Post edits should create encrypted version history snapshots and optional re-submission for approval." />
      <div className="panel space-y-4 p-6">
        <input className="input" defaultValue="Fraud escalation protocol update" />
        <textarea className="input min-h-48" defaultValue="Updated content version..." />
        <input className="input" placeholder="Change summary" />
      </div>
      <button className="button-primary">Save New Version</button>
    </div>
  );
}

export default EditPostPage;
