import type { ConfiguratorState } from "@/lib/configurator";

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill={accent ? "#FFF1E8" : "#ffffff"}
        stroke={accent ? "#FF6A1A" : "#D2D6DA"}
        strokeWidth="1.4"
      />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 6 : 0)} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#14171A">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="8.5" fill="#6B7480">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#89919A" strokeWidth="1.4" markerEnd="url(#arrowhead)" />
    </g>
  );
}

export default function ConfiguratorSchema({ s }: { s: ConfiguratorState }) {
  const dcW = 110;
  const invW = 100;
  const acW = 110;
  return (
    <svg viewBox="0 0 620 240" className="w-full" role="img" aria-label="Schéma de principe du tableau configuré">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#89919A" />
        </marker>
      </defs>
      <rect x="0" y="0" width="620" height="240" fill="#FAFAFB" />

      <Box x={20} y={90} w={90} h={54} label="Panneaux PV" sub={`${s.stringsCount} string(s)`} />
      <Arrow x1={110} y1={117} x2={140} y2={117} />

      <Box
        x={140}
        y={70}
        w={dcW}
        h={94}
        label="Section DC"
        sub={`${s.mpptCount} MPPT${s.sectionnementDc ? " · sectionné" : ""}`}
        accent={s.hasParafoudre && (s.parafoudreType === "type-1-2")}
      />
      <Arrow x1={140 + dcW} y1={117} x2={140 + dcW + 30} y2={117} />

      <Box x={140 + dcW + 30} y={80} w={invW} h={74} label="Onduleur" sub={`${s.inverterPowerKw} kW`} />
      <Arrow x1={140 + dcW + 30 + invW} y1={117} x2={140 + dcW + 30 + invW + 30} y2={117} />

      <Box
        x={140 + dcW + 30 + invW + 30}
        y={70}
        w={acW}
        h={94}
        label="Section AC"
        sub={`${s.phase} · ${s.departsCount} départ(s)`}
        accent={s.hasParafoudre}
      />
      <Arrow
        x1={140 + dcW + 30 + invW + 30 + acW}
        y1={117}
        x2={140 + dcW + 30 + invW + 30 + acW + 30}
        y2={117}
      />

      <Box
        x={140 + dcW + 30 + invW + 30 + acW + 30}
        y={90}
        w={80}
        h={54}
        label="Réseau"
        sub="Point de livraison"
      />

      {s.hasBattery && (
        <>
          <line
            x1={140 + dcW + 30 + invW / 2}
            y1={80}
            x2={140 + dcW + 30 + invW / 2}
            y2={40}
            stroke="#16794F"
            strokeWidth="1.4"
          />
          <Box x={140 + dcW + 30 + invW / 2 - 55} y={4} w={110} h={38} label="Batterie" sub={`${s.batteryPowerKwh} kWh`} accent />
        </>
      )}

      {s.hasParafoudre && (
        <text x={310} y="200" textAnchor="middle" fontSize="9" fill="#C24700">
          Parafoudre {s.parafoudreType === "type-1-2" ? "type 1+2" : "type 2"} — protections AC{s.mpptCount > 0 ? "/DC" : ""}
        </text>
      )}
      <text x={310} y="222" textAnchor="middle" fontSize="8" fill="#89919A">
        Schéma de principe — à valider selon l'étude technique définitive
      </text>
    </svg>
  );
}
