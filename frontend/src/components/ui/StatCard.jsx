function StatCard({ label, value, delta }) {
  return (
    <div className="panel p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{delta}</p>
    </div>
  );
}

export default StatCard;

