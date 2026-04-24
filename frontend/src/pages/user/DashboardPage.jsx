import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import PieSummaryChart from "../../components/charts/PieSummaryChart";
import TrendLineChart from "../../components/charts/TrendLineChart";
import { overviewCards, statusDistribution, trendData } from "../../utils/mockData";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="User Dashboard"
        title="Secure Operations Overview"
        description="Track organizational activity, content approvals, and security trends from a unified enterprise workspace."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieSummaryChart data={statusDistribution} />
        <TrendLineChart data={trendData} />
      </div>
    </div>
  );
}

export default DashboardPage;

