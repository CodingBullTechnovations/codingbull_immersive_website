/**
 * Stylized interface mockups — deliberate abstractions, not screenshots.
 *
 * These illustrate the *type* of system CodingBull builds for each industry.
 * They are drawn as inline SVG (no image weight, crisp at any density, themed
 * by the accent token) and are marked aria-hidden because the surrounding
 * section already carries the meaning in real text.
 *
 * When real product screenshots become available, swap the body of the matching
 * case here for an <Image> — the layout and sizing contract stays the same.
 */

export type SystemMockupKind = 'healthcare' | 'commerce' | 'hrms' | 'custom' | 'radar';

const ACCENT = 'var(--accent)';
const ACCENT_SOFT = 'var(--accent-soft)';

function Chrome({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative w-full border border-white/18 bg-[var(--surface-card)] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-1.5 w-1.5 bg-white/20" />
        <span className="h-1.5 w-1.5 bg-white/20" />
        <span className="h-1.5 w-1.5 bg-white/20" />
        <span className="cb-mono ml-2 text-xs uppercase tracking-[0.16em] text-white/68">{label}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

/** Clinic scheduler: a week grid with booked slots. */
function HealthcareMockup() {
  const slots = [
    [1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 1, 1],
  ];
  return (
    <svg viewBox="0 0 320 180" className="w-full" role="presentation" aria-hidden="true">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
        <text key={day} x={38 + index * 56} y={16} fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="1.5">
          {day.toUpperCase()}
        </text>
      ))}
      {slots.map((row, rowIndex) =>
        row.map((booked, colIndex) => (
          <g key={`${rowIndex}-${colIndex}`}>
            <rect
              x={34 + colIndex * 56}
              y={28 + rowIndex * 36}
              width={48}
              height={28}
              fill={booked ? 'rgba(57,177,230,0.16)' : 'rgba(255,255,255,0.03)'}
              stroke={booked ? ACCENT : 'rgba(255,255,255,0.10)'}
              strokeWidth="1"
            />
            {booked === 1 && (
              <rect x={34 + colIndex * 56} y={28 + rowIndex * 36} width={3} height={28} fill={ACCENT} />
            )}
          </g>
        )),
      )}
      {[0, 1, 2, 3].map((row) => (
        <text key={row} x={6} y={46 + row * 36} fill="rgba(255,255,255,0.62)" fontSize="8" fontFamily="ui-monospace, monospace">
          {`${9 + row}:00`}
        </text>
      ))}
    </svg>
  );
}

/** Storefront + order pipeline. */
function CommerceMockup() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" role="presentation" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <g key={index}>
          <rect x={8 + index * 74} y={10} width={64} height={52} fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)" />
          <rect x={16 + index * 74} y={48} width={34} height={5} fill="rgba(255,255,255,0.18)" />
          <rect x={16 + index * 74} y={20} width={22} height={20} fill="rgba(57,177,230,0.20)" />
        </g>
      ))}
      <rect x={244} y={10} width={68} height={52} fill="rgba(57,177,230,0.10)" stroke={ACCENT} />
      <text x={252} y={32} fill={ACCENT_SOFT} fontSize="9" fontFamily="ui-monospace, monospace">CART</text>
      <text x={252} y={46} fill="rgba(255,255,255,0.78)" fontSize="11" fontFamily="ui-monospace, monospace">3 items</text>

      <text x={8} y={86} fill="rgba(255,255,255,0.68)" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.4">ORDER PIPELINE</text>
      {['PAID', 'PACKED', 'SHIPPED', 'DELIVERED'].map((stage, index) => (
        <g key={stage}>
          <line x1={22 + index * 76} y1={112} x2={index === 3 ? 22 + index * 76 : 76 + index * 76} y2={112} stroke={index < 2 ? ACCENT : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" />
          <rect x={16 + index * 76} y={106} width={12} height={12} fill={index < 2 ? ACCENT : 'rgba(255,255,255,0.08)'} />
          <text x={10 + index * 76} y={134} fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="ui-monospace, monospace">{stage}</text>
        </g>
      ))}
      <rect x={8} y={148} width={304} height={22} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <rect x={8} y={148} width={186} height={22} fill="rgba(57,177,230,0.14)" />
      <text x={16} y={163} fill="rgba(255,255,255,0.78)" fontSize="9" fontFamily="ui-monospace, monospace">INVENTORY SYNCED</text>
    </svg>
  );
}

/** HRMS: attendance roster + payroll run. */
function HrmsMockup() {
  const attendance = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1];
  return (
    <svg viewBox="0 0 320 180" className="w-full" role="presentation" aria-hidden="true">
      <text x={8} y={16} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.4">ATTENDANCE · 14 DAYS</text>
      {attendance.map((present, index) => (
        <rect
          key={index}
          x={8 + index * 22}
          y={24}
          width={16}
          height={present ? 26 : 12}
          y2={0}
          fill={present ? ACCENT : 'rgba(255,255,255,0.12)'}
          opacity={present ? 0.75 : 1}
        />
      ))}

      {[0, 1, 2, 3].map((row) => (
        <g key={row}>
          <rect x={8} y={68 + row * 26} width={304} height={20} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" />
          <circle cx={22} cy={78 + row * 26} r={5} fill="rgba(57,177,230,0.35)" />
          <rect x={34} y={74 + row * 26} width={70} height={5} fill="rgba(255,255,255,0.20)" />
          <rect x={120} y={74 + row * 26} width={44} height={5} fill="rgba(255,255,255,0.10)" />
          <rect x={250} y={72 + row * 26} width={54} height={9} fill={row === 0 ? 'rgba(57,177,230,0.22)' : 'rgba(255,255,255,0.06)'} />
        </g>
      ))}
    </svg>
  );
}

/** Custom systems: dashboard with approval workflow. */
function CustomMockup() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" role="presentation" aria-hidden="true">
      <rect x={8} y={10} width={140} height={72} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
      <polyline
        points="18,66 40,52 62,58 84,34 106,42 128,22 140,28"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.8"
      />
      {[[40, 52], [84, 34], [128, 22]].map(([cx, cy]) => (
        <rect key={`${cx}`} x={cx - 2.5} y={cy - 2.5} width={5} height={5} fill={ACCENT} />
      ))}

      {[0, 1].map((index) => (
        <g key={index}>
          <rect x={160 + index * 76} y={10} width={68} height={34} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" />
          <text x={168 + index * 76} y={26} fill="rgba(255,255,255,0.68)" fontSize="7" fontFamily="ui-monospace, monospace">
            {index === 0 ? 'OPEN' : 'CLOSED'}
          </text>
          <text x={168 + index * 76} y={38} fill="#fff" fontSize="12" fontFamily="ui-monospace, monospace">
            {index === 0 ? '42' : '318'}
          </text>
        </g>
      ))}
      <rect x={160} y={52} width={144} height={30} fill="rgba(57,177,230,0.10)" stroke={ACCENT} />
      <text x={168} y={71} fill={ACCENT_SOFT} fontSize="9" fontFamily="ui-monospace, monospace">APPROVAL QUEUE</text>

      <text x={8} y={104} fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.4">WORKFLOW</text>
      {['REQUEST', 'REVIEW', 'APPROVE', 'ARCHIVE'].map((stage, index) => (
        <g key={stage}>
          <rect x={8 + index * 78} y={114} width={64} height={26} fill="rgba(255,255,255,0.03)" stroke={index < 2 ? ACCENT : 'rgba(255,255,255,0.10)'} />
          <text x={16 + index * 78} y={131} fill={index < 2 ? ACCENT_SOFT : 'rgba(255,255,255,0.68)'} fontSize="7.5" fontFamily="ui-monospace, monospace">{stage}</text>
          {index < 3 && <line x1={72 + index * 78} y1={127} x2={86 + index * 78} y2={127} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />}
        </g>
      ))}
      <rect x={8} y={152} width={304} height={18} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" />
    </svg>
  );
}

/** RemoteRadar: aggregated remote-role feed with filters. */
function RadarMockup() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" role="presentation" aria-hidden="true">
      <rect x={8} y={10} width={304} height={24} fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.10)" />
      <text x={18} y={26} fill="rgba(255,255,255,0.72)" fontSize="9" fontFamily="ui-monospace, monospace">SEARCH REMOTE ROLES…</text>
      <rect x={252} y={14} width={56} height={16} fill="rgba(57,177,230,0.20)" stroke={ACCENT} />

      {['REACT', 'PYTHON', 'SENIOR', 'EU'].map((chip, index) => (
        <g key={chip}>
          <rect x={8 + index * 62} y={44} width={54} height={18} fill={index < 2 ? 'rgba(57,177,230,0.16)' : 'rgba(255,255,255,0.03)'} stroke={index < 2 ? ACCENT : 'rgba(255,255,255,0.10)'} />
          <text x={16 + index * 62} y={57} fill={index < 2 ? ACCENT_SOFT : 'rgba(255,255,255,0.68)'} fontSize="7.5" fontFamily="ui-monospace, monospace">{chip}</text>
        </g>
      ))}

      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect x={8} y={74 + row * 34} width={304} height={28} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" />
          <rect x={16} y={82 + row * 34} width={4} height={12} fill={ACCENT} />
          <rect x={28} y={82 + row * 34} width={96} height={5} fill="rgba(255,255,255,0.24)" />
          <rect x={28} y={91 + row * 34} width={58} height={4} fill="rgba(255,255,255,0.10)" />
          <rect x={244} y={84 + row * 34} width={60} height={12} fill="rgba(57,177,230,0.14)" stroke="rgba(57,177,230,0.4)" />
          <text x={252} y={93 + row * 34} fill={ACCENT_SOFT} fontSize="7" fontFamily="ui-monospace, monospace">APPLY ↗</text>
        </g>
      ))}
    </svg>
  );
}

const REGISTRY: Record<SystemMockupKind, { label: string; render: () => React.ReactElement }> = {
  healthcare: { label: 'Clinic scheduler', render: HealthcareMockup },
  commerce: { label: 'Storefront + orders', render: CommerceMockup },
  hrms: { label: 'Workforce & payroll', render: HrmsMockup },
  custom: { label: 'Operations dashboard', render: CustomMockup },
  radar: { label: 'RemoteRadar feed', render: RadarMockup },
};

export function SystemMockup({ kind }: { kind: SystemMockupKind }) {
  const entry = REGISTRY[kind];
  return <Chrome label={entry.label}>{entry.render()}</Chrome>;
}
