import SectionHeader from "../../components/ui/SectionHeader";

function ProfilePage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Profile" title="Secure Employee Profile" description="Sensitive identity details are intended to be retrieved through backend decryption and integrity verification." />
      <div className="panel grid gap-4 p-6 md:grid-cols-2">
        {[
          ["Full Name", "Nabila Sultana"],
          ["Department", "Compliance"],
          ["Designation", "Compliance Analyst"],
          ["Last Login", "2026-04-24 10:42"],
          ["Biometric Status", "Enabled"],
          ["Session IP", "10.15.4.90"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-base text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;

