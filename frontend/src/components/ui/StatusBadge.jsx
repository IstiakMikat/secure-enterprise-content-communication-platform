const styles = {
  Approved: "bg-emerald-500/15 text-emerald-300",
  "Pending Approval": "bg-amber-500/15 text-amber-300",
  Pending: "bg-amber-500/15 text-amber-300",
  Rejected: "bg-rose-500/15 text-rose-300",
  Active: "bg-sky-500/15 text-sky-300",
};

function StatusBadge({ children }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[children] || "bg-white/10 text-slate-200"}`}>
      {children}
    </span>
  );
}

export default StatusBadge;

