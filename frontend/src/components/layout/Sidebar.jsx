import { NavLink } from "react-router-dom";
import { sidebarSections } from "../../utils/navigation";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const links = [
    ...sidebarSections.common,
    ...(sidebarSections[user?.role] || []),
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/70 p-5 lg:block">
      <div className="rounded-2xl border border-accent/20 bg-accent/10 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Secure Enterprise</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Communication Platform</h2>
        <p className="mt-2 text-sm text-slate-400">Internal security, approvals, sessions, and encrypted content workflows.</p>
      </div>
      <nav className="mt-8 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-accent text-slate-950"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

