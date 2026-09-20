export default function DemoBadge({ label = "Donnée de démonstration" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-steel-300 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-steel-600">
      <span className="h-1.5 w-1.5 rounded-full bg-volt" />
      {label}
    </span>
  );
}
