import SectionHeader from "../../components/ui/SectionHeader";
import BarSummaryChart from "../../components/charts/BarSummaryChart";
import { departmentData } from "../../utils/mockData";

function DepartmentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Manager Analytics" title="Department Analytics" description="Track content production, approval load, and contribution trends within department scope." />
      <BarSummaryChart data={departmentData} />
    </div>
  );
}

export default DepartmentAnalyticsPage;
