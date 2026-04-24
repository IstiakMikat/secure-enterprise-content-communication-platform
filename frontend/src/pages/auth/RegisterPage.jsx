function RegisterPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Employee Enrollment</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Register</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {["Employee ID", "Username", "Full Name", "Email", "Phone", "Designation", "Department", "Password"].map((field) => (
          <input key={field} className="input" placeholder={field} />
        ))}
      </div>
      <button className="button-primary mt-6 w-full">Create Secure Account</button>
    </div>
  );
}

export default RegisterPage;

