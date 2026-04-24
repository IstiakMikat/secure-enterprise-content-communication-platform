import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/40 px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Enterprise Workspace</p>
        <h1 className="mt-1 text-lg font-semibold text-white">{user?.department}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{user?.fullName}</p>
          <p className="text-xs text-slate-400">{user?.role}</p>
        </div>
        <button className="button-secondary" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Topbar;

