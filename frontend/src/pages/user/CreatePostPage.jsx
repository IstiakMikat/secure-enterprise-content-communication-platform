import SectionHeader from "../../components/ui/SectionHeader";

function CreatePostPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Secure Publishing" title="Create Encrypted Post" description="Titles and bodies are designed to be encrypted before storage, with MAC integrity validation applied to each record." />
      <div className="panel space-y-4 p-6">
        <input className="input" placeholder="Post title" />
        <div className="grid gap-4 md:grid-cols-3">
          <input className="input" placeholder="Category" />
          <input className="input" placeholder="Department" />
          <input className="input" placeholder="Visibility level" />
        </div>
        <textarea className="input min-h-48" placeholder="Encrypted body content draft" />
        <div className="flex flex-wrap gap-3">
          <button className="button-secondary">Save Draft</button>
          <button className="button-primary">Submit for Approval</button>
        </div>
      </div>
    </div>
  );
}

export default CreatePostPage;
