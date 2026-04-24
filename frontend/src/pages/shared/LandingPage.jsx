import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Secure Enterprise Content & Communication Platform</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-6xl">
            Encrypted internal publishing, approval governance, and live security oversight for modern enterprise teams.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Purpose-built for fintech and telecom operations with role-based access, session monitoring, key management, and activity analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="button-primary" to="/login">
              Access Platform
            </Link>
            <Link className="button-secondary" to="/register">
              Register Employee
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            "Encrypted employee records with asymmetric academic crypto abstraction",
            "Approval workflows for compliance notices, incidents, and fraud advisories",
            "Admin visibility over sessions, integrity failures, and key lifecycle events",
          ].map((item) => (
            <div key={item} className="panel p-6 text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

