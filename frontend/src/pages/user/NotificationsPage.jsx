import SectionHeader from "../../components/ui/SectionHeader";
import { userApi } from "../../api/userApi";
import { useApiState } from "../../hooks/useApiState";

function NotificationsPage() {
  const { data, isLoading, error } = useApiState(userApi.notifications, []);

  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Alerts" title="Notifications" description="This area is intended for approval feedback, security alerts, suspicious login warnings, and integrity events." />
      {isLoading ? <p className="text-slate-300">Loading notifications...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}
      {(data || []).map((item) => (
        <div key={item._id} className="panel p-5 text-slate-200">
          <p className="font-semibold text-white">{item.title}</p>
          <p className="mt-2 text-sm text-slate-400">{item.message}</p>
        </div>
      ))}
    </div>
  );
}

export default NotificationsPage;
