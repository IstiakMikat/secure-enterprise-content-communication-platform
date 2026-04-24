import SectionHeader from "../../components/ui/SectionHeader";

function RoleManagementPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Authorization" title="Role Management" description="Define permission boundaries for admin, manager, and employee platform personas." />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["ADMIN", "Full access to users, keys, logs, sessions, and all analytics."],
          ["MANAGER", "Approval authority and department analytics access."],
          ["USER", "Profile, secure posts, drafts, and personal notifications."],
        ].map(([title, text]) => (
          <div key={title} className="panel p-6">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleManagementPage;
