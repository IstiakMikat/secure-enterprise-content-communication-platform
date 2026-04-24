import SectionHeader from "../../components/ui/SectionHeader";
import TrendLineChart from "../../components/charts/TrendLineChart";
import { trendData } from "../../utils/mockData";

function SecurityAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Security Intelligence" title="Security Analytics" description="Visualize failed logins, suspicious sessions, OTP failure trends, and overall security posture." />
      <TrendLineChart data={trendData} />
    </div>
  );
}

export default SecurityAnalyticsPage;
