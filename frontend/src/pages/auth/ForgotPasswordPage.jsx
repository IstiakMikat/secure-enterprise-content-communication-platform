function ForgotPasswordPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Recovery</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Forgot Password</h2>
      <p className="mt-2 text-sm text-slate-400">Request a reset token for your employee account.</p>
      <input className="input mt-8" placeholder="Employee email" />
      <button className="button-primary mt-6 w-full">Send Reset Token</button>
    </div>
  );
}

export default ForgotPasswordPage;

