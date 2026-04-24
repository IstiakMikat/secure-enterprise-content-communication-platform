import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="panel max-w-xl p-10 text-center">
        <h1 className="text-4xl font-semibold text-white">Page Not Found</h1>
        <p className="mt-3 text-slate-400">The requested workspace route is unavailable or your role is not permitted to access it.</p>
        <Link to="/dashboard" className="button-primary mt-6">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

