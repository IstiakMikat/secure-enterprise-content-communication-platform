import SectionHeader from "../../components/ui/SectionHeader";

function IntegrityAlertsPage() {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Integrity Monitoring" title="Integrity Alerts" description="Tamper detection events should block content display, create alerts, and notify security administrators." />
      {[
        "Post #A19 failed MAC verification during read attempt.",
        "Biometric template record checksum mismatch detected.",
      ].map((item) => (
        <div key={item} className="panel border border-rose-500/20 p-5 text-rose-100">
          {item}
        </div>
      ))}
    </div>
  );
}

export default IntegrityAlertsPage;
