import SectionHeader from "../../components/ui/SectionHeader";
import { adminApi } from "../../api/adminApi";
import { useApiState } from "../../hooks/useApiState";

function IntegrityAlertsPage() {
  const { data, isLoading, error } = useApiState(adminApi.integrityAlerts, []);

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Integrity Monitoring" title="Integrity Alerts" description="Tamper detection events should block content display, create alerts, and notify security administrators." />
      {isLoading ? <p className="text-slate-300">Loading integrity alerts...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      {(data || []).map((item) => (
        <div key={item._id} className="panel border border-rose-500/20 p-5 text-rose-100">
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default IntegrityAlertsPage;
