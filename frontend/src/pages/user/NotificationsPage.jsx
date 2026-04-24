import SectionHeader from "../../components/ui/SectionHeader";

function NotificationsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Alerts" title="Notifications" description="This area is intended for approval feedback, security alerts, suspicious login warnings, and integrity events." />
      {[
        "Your device authenticated successfully with OTP.",
        "A key rotation event was completed by security administration.",
        "One compliance notice was rejected and returned for revision.",
      ].map((item) => (
        <div key={item} className="panel p-5 text-slate-200">
          {item}
        </div>
      ))}
    </div>
  );
}

export default NotificationsPage;
