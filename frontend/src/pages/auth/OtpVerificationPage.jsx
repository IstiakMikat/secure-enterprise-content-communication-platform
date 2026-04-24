import { useNavigate } from "react-router-dom";

function OtpVerificationPage() {
  const navigate = useNavigate();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Two-Step Authentication</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Verify OTP</h2>
      <p className="mt-2 text-sm text-slate-400">Enter the one-time code generated for your secure login session.</p>
      <div className="mt-8 grid grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <input key={index} className="input text-center text-lg" maxLength={1} />
        ))}
      </div>
      <button className="button-primary mt-6 w-full" onClick={() => navigate("/dashboard")}>
        Verify and Enter Workspace
      </button>
    </div>
  );
}

export default OtpVerificationPage;

