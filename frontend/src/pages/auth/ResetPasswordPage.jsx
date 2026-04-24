function ResetPasswordPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Credential Reset</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Reset Password</h2>
      <div className="mt-8 space-y-4">
        <input className="input" placeholder="Reset token" />
        <input className="input" placeholder="New password" type="password" />
        <input className="input" placeholder="Confirm password" type="password" />
      </div>
      <button className="button-primary mt-6 w-full">Apply Password Reset</button>
    </div>
  );
}

export default ResetPasswordPage;

