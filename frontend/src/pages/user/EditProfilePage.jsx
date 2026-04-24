import SectionHeader from "../../components/ui/SectionHeader";

function EditProfilePage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Profile Maintenance"
        title="Edit Profile"
        description="Sensitive profile updates should require re-verification and create profile history records."
      />
      <div className="panel grid gap-4 p-6 md:grid-cols-2">
        {["Full Name", "Phone", "Designation", "Reason for change"].map((field) => (
          <input key={field} className="input" placeholder={field} />
        ))}
      </div>
      <button className="button-primary">Save Encrypted Profile Updates</button>
    </div>
  );
}

export default EditProfilePage;
