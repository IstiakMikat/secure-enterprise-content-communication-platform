import SectionHeader from "../../components/ui/SectionHeader";
import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Profile" title="Secure Employee Profile" description="Sensitive identity details are retrieved through backend decryption." />
      <div className="panel grid gap-4 p-6 md:grid-cols-2">
        {[
          ["Full Name", user.fullName],
          ["Email", user.email],
          ["Phone", user.phone],
          ["Department", user.department],
          ["Designation", user.designation],
          ["Role", user.role],
          ["Account Status", user.accountStatus],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-base text-white">{value || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;

