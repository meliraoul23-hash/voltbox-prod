import { complianceDisclaimer } from "@/lib/site-config";

export default function ComplianceNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex gap-3 rounded-md border border-steel-200 bg-steel-50 px-4 py-3 text-sm text-steel-700 ${className}`}
      role="note"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
        <path
          d="M12 3 2 20h20L12 3Z"
          stroke="#FF6A1A"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 10v5" stroke="#FF6A1A" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="17.5" r="1" fill="#FF6A1A" />
      </svg>
      <p>{complianceDisclaimer}</p>
    </div>
  );
}
