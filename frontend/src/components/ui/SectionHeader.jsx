function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;

