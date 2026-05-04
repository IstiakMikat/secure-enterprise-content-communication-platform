import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import PieSummaryChart from "../../components/charts/PieSummaryChart";
import TrendLineChart from "../../components/charts/TrendLineChart";
import BarSummaryChart from "../../components/charts/BarSummaryChart";
import { analyticsApi } from "../../api/analyticsApi";
import { useApiState } from "../../hooks/useApiState";
import { useAuth } from "../../context/AuthContext";

function DashboardPage() {
  const { user } = useAuth();
  const loader = async () => {
    if (user?.role === "ADMIN") {
      const [companyOverview, securityOverview, employeePerformance] = await Promise.all([
        analyticsApi.companyOverview(),
        analyticsApi.securityOverview(),
        analyticsApi.employeePerformance(),
      ]);

      return { companyOverview, securityOverview, employeePerformance };
    }

    if (user?.role === "MANAGER") {
      const [companyOverview, departmentOverview] = await Promise.all([
        analyticsApi.companyOverview(),
        analyticsApi.departmentOverview(),
      ]);

      return { companyOverview, departmentOverview };
    }

    return { personalOverview: await analyticsApi.myOverview() };
  };

  const { data, isLoading, error } = useApiState(loader, [user?.role]);

  if (isLoading) {
    return <div className="text-slate-300">Loading dashboard analytics...</div>;
  }

  if (error) {
    return <div className="text-rose-300">{error}</div>;
  }

  const cards =
    user?.role === "ADMIN"
      ? [
          { label: "Total Users", value: data.companyOverview.totalUsers, delta: `${data.companyOverview.totalDepartments} departments` },
          { label: "Total Posts", value: data.companyOverview.totalPosts, delta: `${data.companyOverview.activeSessions} active sessions` },
          { label: "Integrity Alerts", value: data.companyOverview.integrityAlerts, delta: `${data.securityOverview.suspiciousSessions} suspicious sessions` },
          { label: "Failed Logins", value: data.securityOverview.failedLogins, delta: `${data.securityOverview.otpFailures} OTP failures` },
        ]
      : user?.role === "MANAGER"
        ? [
            { label: "Team Users", value: data.companyOverview.totalUsers, delta: `${data.companyOverview.totalDepartments} departments total` },
            { label: "Content Volume", value: data.companyOverview.totalPosts, delta: "Cross-department overview" },
            { label: "Pending Alerts", value: data.companyOverview.integrityAlerts, delta: "Escalation monitoring" },
            { label: "Active Sessions", value: data.companyOverview.activeSessions, delta: "Enterprise activity" },
          ]
        : [
            { label: "My Posts", value: data.personalOverview.totalPosts, delta: `${data.personalOverview.drafts} drafts` },
            { label: "Unread Notifications", value: data.personalOverview.unreadNotifications, delta: "Security and workflow inbox" },
            { label: "Active Sessions", value: data.personalOverview.activeSessions, delta: "Current secure sessions" },
            { label: "Post States", value: data.personalOverview.postsByStatus.length, delta: "Workflow status buckets" },
          ];

  const pieData =
    user?.role === "USER"
      ? data.personalOverview.postsByStatus.map((item) => ({
          name: item._id,
          value: item.count,
        }))
      : data.companyOverview.postsByStatus.map((item) => ({
          name: item._id,
          value: item.count,
        }));

  const lineData =
    user?.role === "ADMIN"
      ? [
          { name: "Failed Logins", posts: data.securityOverview.failedLogins },
          { name: "Suspicious Sessions", posts: data.securityOverview.suspiciousSessions },
          { name: "OTP Failures", posts: data.securityOverview.otpFailures },
          { name: "Integrity Alerts", posts: data.securityOverview.integrityAlerts },
        ]
      : user?.role === "MANAGER"
        ? data.departmentOverview.map((item) => ({
            name: item.department,
            posts: item.totalPosts,
          }))
        : data.personalOverview.recentPosts.map((item, index) => ({
            name: item.category || `Post ${index + 1}`,
            posts: index + 1,
          }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="User Dashboard"
        title="Secure Operations Overview"
        description="Track organizational activity, content approvals, and security trends from a unified enterprise workspace."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieSummaryChart data={pieData} />
        <BarSummaryChart data={lineData} />
      </div>
    </div>
  );
}

export default DashboardPage;
