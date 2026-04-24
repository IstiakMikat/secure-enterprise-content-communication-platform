import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";

function PostDetailsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Post Detail" title="Fraud Escalation Protocol Update" description="The application should validate record integrity before decrypting and displaying secure post content." />
      <div className="panel space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge>Approved</StatusBadge>
          <StatusBadge>Active</StatusBadge>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          This secure content area is intended to show the decrypted post body only after MAC validation and authorization checks complete.
        </p>
      </div>
    </div>
  );
}

export default PostDetailsPage;
