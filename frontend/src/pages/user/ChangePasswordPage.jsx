import SectionHeader from "../../components/ui/SectionHeader";

function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Credential Security" title="Change Password" description="Passwords are expected to be salted and hashed by the backend academic hashing service before storage." />
      <div className="panel space-y-4 p-6">
        <input className="input" placeholder="Current password" type="password" />
        <input className="input" placeholder="New password" type="password" />
        <input className="input" placeholder="Confirm new password" type="password" />
      </div>
      <button className="button-primary">Update Password</button>
    </div>
  );
}

export default ChangePasswordPage;
