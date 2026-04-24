import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Fintech Internal Platform</p>
          <h1 className="mt-4 max-w-xl text-5xl font-semibold leading-tight text-white">
            Secure enterprise communication, approvals, and cryptographic content governance.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300">
            Built for fraud operations, telecom-scale incident handling, compliance notices, and sensitive internal publishing workflows.
          </p>
        </div>
        <div className="panel p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

