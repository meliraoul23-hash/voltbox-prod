// Illustration technique generative (SVG) representant un tableau/coffret
// electrique ouvert, cable et repere. Ce n'est PAS une photo du produit reel :
// c'est un schema d'illustration, coherent avec la consigne de ne jamais
// presenter de fausses photos produit.
type Variant =
  | "panel-ac-tri"
  | "panel-dc"
  | "panel-ac-dc"
  | "panel-ac-mono"
  | "panel-parafoudre"
  | "panel-batterie"
  | "panel-onduleur"
  | "panel-residentiel"
  | "panel-tertiaire"
  | "panel-industriel"
  | "panel-borne"
  | "inverter"
  | "optimizer"
  | "breaker"
  | string;

function paletteFor(variant: Variant) {
  if (variant === "panel-dc") return { rail: "#2E3339", block: "#3F454C", accent: "#FF6A1A" };
  if (variant === "panel-batterie") return { rail: "#2E3339", block: "#3F454C", accent: "#16794F" };
  if (variant === "panel-parafoudre") return { rail: "#2E3339", block: "#3F454C", accent: "#FF6A1A" };
  return { rail: "#2E3339", block: "#3F454C", accent: "#FF6A1A" };
}

function rowsFor(variant: Variant): number {
  switch (variant) {
    case "panel-ac-dc":
    case "panel-tertiaire":
    case "panel-industriel":
      return 4;
    case "panel-ac-mono":
    case "breaker":
    case "optimizer":
      return 2;
    default:
      return 3;
  }
}

export default function PanelArt({
  variant = "panel-ac-tri",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const { block, accent } = paletteFor(variant);
  const rows = rowsFor(variant);
  const showBattery = variant === "panel-batterie";
  const showDcStripe = variant === "panel-dc" || variant === "panel-ac-dc";
  const isDevice = variant === "inverter" || variant === "optimizer" || variant === "breaker";

  const railY = Array.from({ length: rows }, (_, i) => 48 + i * 34);

  return (
    <svg
      viewBox="0 0 320 240"
      className={className}
      role="img"
      aria-label="Illustration technique du produit (schema, pas une photo)"
    >
      <rect x="0" y="0" width="320" height="240" fill="#F4F5F6" />
      {/* enveloppe du coffret */}
      <rect x="24" y="20" width="272" height="200" rx="6" fill="#ffffff" stroke="#D2D6DA" strokeWidth="2" />
      <rect x="24" y="20" width="272" height="18" rx="6" fill="#14171A" />
      <circle cx="38" cy="29" r="3" fill={accent} />
      <text x="50" y="33" fontFamily="var(--font-plex-mono)" fontSize="9" fill="#F4F5F6" letterSpacing="0.06em">
        VOLTBOX — SCHEMA D'ILLUSTRATION
      </text>

      {!isDevice &&
        railY.map((y, i) => (
          <g key={i}>
            <rect x="40" y={y} width="240" height="4" fill="#AFB6BD" />
            {Array.from({ length: 6 }, (_, j) => (
              <rect
                key={j}
                x={44 + j * 39}
                y={y - 18}
                width="34"
                height="20"
                rx="2"
                fill={j === 0 && i === 0 ? accent : block}
              />
            ))}
          </g>
        ))}

      {showDcStripe && (
        <g>
          <rect x="40" y={railY[railY.length - 1] + 20} width="240" height="14" fill="#FF6A1A" opacity="0.15" />
          <text
            x="46"
            y={railY[railY.length - 1] + 30}
            fontFamily="var(--font-plex-mono)"
            fontSize="8"
            fill="#C24700"
            letterSpacing="0.08em"
          >
            DANGER — COURANT CONTINU (DC)
          </text>
        </g>
      )}

      {showBattery && (
        <g transform="translate(220,150)">
          <rect x="0" y="0" width="50" height="30" rx="3" fill="#16794F" opacity="0.15" stroke="#16794F" />
          <rect x="18" y="-6" width="14" height="6" fill="#16794F" opacity="0.4" />
          <text x="6" y="19" fontFamily="var(--font-plex-mono)" fontSize="8" fill="#16794F">
            BATTERIE
          </text>
        </g>
      )}

      {isDevice && (
        <g>
          <rect x="60" y="60" width="200" height="120" rx="8" fill={block} />
          <rect x="76" y="76" width="168" height="60" rx="4" fill="#0E1012" />
          <rect x="86" y="86" width="60" height="8" fill={accent} />
          <rect x="86" y="100" width="90" height="6" fill="#545C66" />
          <rect x="86" y="112" width="70" height="6" fill="#545C66" />
          {Array.from({ length: 4 }, (_, j) => (
            <circle key={j} cx={92 + j * 20} cy="160" r="4" fill="#D2D6DA" />
          ))}
        </g>
      )}

      <line x1="24" y1="200" x2="296" y2="200" stroke="#D2D6DA" />
      <text x="34" y="212" fontFamily="var(--font-plex-mono)" fontSize="7" fill="#89919A" letterSpacing="0.05em">
        REPERAGE INTERNE — DONNEES DE DEMONSTRATION
      </text>
    </svg>
  );
}
