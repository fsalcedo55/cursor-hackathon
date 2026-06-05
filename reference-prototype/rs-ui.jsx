// rs-ui.jsx — shared UI primitives for RaiseSignal
(function () {
  const { useState, useEffect, useRef } = React;

  /* ---------- hooks ---------- */
  function useCountUp(target, dur = 900, start = true) {
    const [v, setV] = useState(0);
    useEffect(() => {
      if (!start) { setV(target); return; }
      let raf, t0;
      const tick = (t) => {
        if (!t0) t0 = t;
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // safety net: rAF can be throttled in background tabs — guarantee final value
      const fallback = setTimeout(() => setV(target), dur + 220);
      return () => { cancelAnimationFrame(raf); clearTimeout(fallback); };
    }, [target, start]);
    return v;
  }

  /* ---------- color helpers ---------- */
  function scoreColor(v) {
    if (v >= 80) return 'var(--success)';
    if (v >= 65) return 'var(--primary)';
    if (v >= 50) return 'var(--warning)';
    return 'var(--danger)';
  }
  function scoreSoft(v) {
    if (v >= 80) return 'var(--success-soft)';
    if (v >= 65) return 'var(--primary-soft)';
    if (v >= 50) return 'var(--warning-soft)';
    return 'var(--danger-soft)';
  }

  /* ---------- Card ---------- */
  function Card({ children, style, pad = 18, onClick, className = '', tone }) {
    const bg = tone === 'tint' ? 'var(--primary-tint)' : 'var(--card)';
    return (
      <div onClick={onClick} className={className} style={{
        background: bg, borderRadius: 'var(--r-card)', padding: pad,
        boxShadow: 'var(--shadow-md)', border: '1px solid var(--hairline)',
        position: 'relative', ...style,
      }}>{children}</div>
    );
  }

  /* ---------- Section label ---------- */
  function Eyebrow({ children, style }) {
    return <div style={{
      fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
      color: 'var(--ink-3)', ...style,
    }}>{children}</div>;
  }

  function CardTitle({ children, icon, iconColor, right, style }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, ...style }}>
        {icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: 'var(--primary-soft)', color: iconColor || 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name={icon} size={17} /></div>
        )}
        <div style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--ink)', letterSpacing: '-0.01em', flex: 1 }}>{children}</div>
        {right}
      </div>
    );
  }

  /* ---------- Button ---------- */
  function Button({ children, onClick, variant = 'primary', size = 'lg', icon, iconRight, full, style, disabled }) {
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined, borderRadius: 13, fontWeight: 600,
      letterSpacing: '-0.01em', transition: 'transform .12s ease, box-shadow .2s ease, background .2s ease',
      fontSize: size === 'sm' ? 13.5 : 15, padding: size === 'sm' ? '9px 14px' : '14px 18px',
      WebkitTapHighlightColor: 'transparent', ...style,
    };
    const variants = {
      primary: {
        color: '#fff',
        background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-600) 100%)',
        boxShadow: '0 1px 2px rgba(28,40,120,0.25), 0 8px 20px -6px rgba(49,64,206,0.5), inset 0 1px 0 rgba(255,255,255,0.22)',
      },
      secondary: { color: 'var(--primary-700)', background: 'var(--primary-soft)' },
      ghost: { color: 'var(--ink-2)', background: 'transparent', border: '1px solid var(--hairline)' },
      dark: { color: '#fff', background: 'var(--ink)' },
    };
    const [press, setPress] = useState(false);
    return (
      <button onClick={onClick} disabled={disabled}
        onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        style={{ ...base, ...variants[variant], opacity: disabled ? 0.5 : 1, transform: press ? 'scale(0.978)' : 'scale(1)' }}>
        {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
        {children}
        {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
      </button>
    );
  }

  /* ---------- Chip ---------- */
  function Chip({ children, active, onClick, icon, style }) {
    return (
      <button onClick={onClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px',
        borderRadius: 999, fontSize: 13, fontWeight: 550, whiteSpace: 'nowrap',
        border: '1px solid ' + (active ? 'transparent' : 'var(--hairline)'),
        background: active ? 'var(--primary)' : 'var(--card)',
        color: active ? '#fff' : 'var(--ink-2)',
        boxShadow: active ? '0 4px 12px -4px rgba(49,64,206,0.5)' : 'var(--shadow-sm)',
        transition: 'all .15s ease', ...style,
      }}>{icon && <Icon name={icon} size={14} />}{children}</button>
    );
  }

  /* ---------- Pills / statuses ---------- */
  const STATUS = {
    Strong:      { c: 'var(--success)', b: 'var(--success-soft)' },
    Good:        { c: 'var(--primary)', b: 'var(--primary-soft)' },
    'Needs work':{ c: 'var(--warning)', b: 'var(--warning-soft)' },
    Missing:     { c: 'var(--danger)',  b: 'var(--danger-soft)' },
    Done:        { c: 'var(--success)', b: 'var(--success-soft)' },
    Suggested:   { c: 'var(--cyan)',    b: 'var(--cyan-soft)' },
  };
  function StatusPill({ status, dot = true, style }) {
    const s = STATUS[status] || STATUS.Good;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 8px',
        borderRadius: 999, fontSize: 12, fontWeight: 600, color: s.c, background: s.b, whiteSpace: 'nowrap', ...style,
      }}>
        {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: s.c }} />}
        {status}
      </span>
    );
  }

  function TrendChip({ value, unit = '%', positive = true, style }) {
    const c = positive ? 'var(--success)' : 'var(--danger)';
    const bg = positive ? 'var(--success-soft)' : 'var(--danger-soft)';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 8px 3px 6px',
        borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: c, background: bg, ...style,
      }}>
        <Icon name={positive ? 'trendUp' : 'trendDown'} size={13} />
        <span className="num">{value}{unit}</span>
      </span>
    );
  }

  /* ---------- Progress bar ---------- */
  function ProgressBar({ value, max = 100, color, track = 'var(--hairline)', height = 7, reveal = true, delay = 0 }) {
    const ref = useRef(null);
    const [w, setW] = useState(0);
    useEffect(() => {
      const id = setTimeout(() => setW((value / max) * 100), 60 + delay);
      return () => clearTimeout(id);
    }, [value, max]);
    return (
      <div style={{ height, borderRadius: 999, background: track, overflow: 'hidden', width: '100%' }}>
        <div style={{
          height: '100%', width: (reveal ? w : (value / max) * 100) + '%',
          borderRadius: 999, background: color || scoreColor(value),
          transition: 'width 1s cubic-bezier(.22,.61,.36,1)',
        }} />
      </div>
    );
  }

  /* ---------- Score ring (animated donut) ---------- */
  function ScoreRing({ value, size = 132, stroke = 12, max = 100, suffix, label, animate = true, big }) {
    const v = useCountUp(value, 1100, animate);
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const pct = Math.min(1, value / max);
    const dash = animate ? undefined : circ * (1 - pct);
    const col = scoreColor(value);
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--hairline)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.22,.61,.36,1)', strokeDashoffset: animate ? circ*(1-pct) : dash }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0,
        }}>
          <div className="num" style={{ fontSize: big ? 46 : 34, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
            {Math.round(v)}{suffix && <span style={{ fontSize: big ? 20 : 16, color: 'var(--ink-3)', fontWeight: 500 }}>{suffix}</span>}
          </div>
          {label && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 5, fontWeight: 500 }}>{label}</div>}
        </div>
      </div>
    );
  }

  /* ---------- Metric stat ---------- */
  function MetricStat({ label, value, mono = true, accent, trend, sub, missing }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 550, letterSpacing: '0.01em' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
          <span className={mono ? 'num' : ''} style={{
            fontSize: 19, fontWeight: 600, color: missing ? 'var(--danger)' : (accent || 'var(--ink)'), lineHeight: 1.1,
          }}>{value}</span>
          {trend}
        </div>
        {sub && <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{sub}</div>}
      </div>
    );
  }

  /* ---------- Divider ---------- */
  function Divider({ m = 0 }) {
    return <div style={{ height: 1, background: 'var(--hairline)', margin: `${m}px 0` }} />;
  }

  /* ---------- App header ---------- */
  function AppHeader({ title, back, onBack, right, brand, sub }) {
    return (
      <div style={{
        padding: '54px 18px 12px', position: 'sticky', top: 0, zIndex: 30,
        background: 'linear-gradient(180deg, var(--bg) 72%, rgba(244,248,255,0))',
        backdropFilter: 'blur(6px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, minHeight: 40 }}>
          {back && (
            <button onClick={onBack} style={{
              width: 38, height: 38, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--hairline)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', boxShadow: 'var(--shadow-sm)',
              marginLeft: -2,
            }}><Icon name="back" size={20} /></button>
          )}
          {brand && <Logomark size={32} />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: brand ? 18 : 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em',
              lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{title}</div>
            {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
          </div>
          {right}
        </div>
      </div>
    );
  }

  function IconButton({ name, onClick, badge, size = 38 }) {
    return (
      <button onClick={onClick} style={{
        width: size, height: size, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)',
        boxShadow: 'var(--shadow-sm)', position: 'relative', flexShrink: 0,
      }}>
        <Icon name={name} size={20} />
        {badge && <span style={{
          position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 999,
          background: 'var(--danger)', border: '2px solid var(--card)',
        }} />}
      </button>
    );
  }

  /* ---------- Bottom navigation ---------- */
  function BottomNav({ active, onNav }) {
    const items = [
      { id: 'analyze', label: 'Home', icon: 'home' },
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'investors', label: 'Investors', icon: 'investors' },
    ];
    return (
      <div style={{
        flexShrink: 0, paddingBottom: 22, paddingTop: 9, paddingInline: 14,
        background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid var(--hairline)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: on ? 'var(--primary)' : 'var(--ink-4)', flex: 1, padding: '4px 0',
              transition: 'color .2s ease',
            }}>
              <Icon name={it.icon} size={24} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 650 : 500, letterSpacing: '0.01em' }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /* ---------- generic row with leading icon ---------- */
  function IconRow({ icon, iconBg, iconColor, title, sub, right, onClick, last }) {
    return (
      <div onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
        borderBottom: last ? 'none' : '1px solid var(--hairline-2)', cursor: onClick ? 'pointer' : 'default',
      }}>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: iconBg || 'var(--primary-soft)', color: iconColor || 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name={icon} size={18} /></div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>
          {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1, lineHeight: 1.35 }}>{sub}</div>}
        </div>
        {right}
      </div>
    );
  }

  Object.assign(window, {
    useCountUp, scoreColor, scoreSoft,
    Card, Eyebrow, CardTitle, Button, Chip, StatusPill, TrendChip,
    ProgressBar, ScoreRing, MetricStat, Divider,
    AppHeader, IconButton, BottomNav, IconRow,
  });
})();
